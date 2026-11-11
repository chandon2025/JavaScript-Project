import { config } from "../config/index.js";
import type { SoilGridsData, USDA_SoilTexture, SoilIntelligenceResponse } from "../types/index.js";
import { findNearestDistrict, getAEZForLocation } from "./barc-aez.js";
import { appCache } from "./cache.js";

/**
 * Computes the USDA Soil Texture Class from sand, silt, and clay percentages.
 * Standard USDA Soil Science Division classification triangle rules.
 */
export function calculateUsdaSoilTexture(sand: number, clay: number, silt: number): USDA_SoilTexture {
  // Normalize if sum deviates slightly
  const total = sand + clay + silt;
  if (total > 0 && Math.abs(total - 100) > 0.5) {
    sand = (sand / total) * 100;
    clay = (clay / total) * 100;
    silt = (silt / total) * 100;
  }

  if (silt + 1.5 * clay < 15 && sand >= 85) {
    return "Sand";
  }
  if (silt + 1.5 * clay >= 15 && silt + 2 * clay < 30 && sand >= 70 && sand <= 90) {
    return "Loamy Sand";
  }
  if ((clay >= 7 && clay < 20 && sand > 52 && silt + 2 * clay >= 30) || (clay < 7 && silt < 50 && sand > 43)) {
    return "Sandy Loam";
  }
  if (clay >= 7 && clay < 27 && silt >= 28 && silt < 50 && sand <= 52) {
    return "Loam";
  }
  if ((silt >= 50 && clay >= 12 && clay < 27) || (silt >= 50 && silt < 80 && clay < 12)) {
    return "Silt Loam";
  }
  if (silt >= 80 && clay < 12) {
    return "Silt";
  }
  if (clay >= 20 && clay < 35 && silt < 28 && sand > 45) {
    return "Sandy Clay Loam";
  }
  if (clay >= 27 && clay < 40 && sand > 20 && sand <= 45) {
    return "Clay Loam";
  }
  if (clay >= 27 && clay < 40 && sand <= 20) {
    return "Silty Clay Loam";
  }
  if (clay >= 35 && sand > 45) {
    return "Sandy Clay";
  }
  if (clay >= 40 && silt >= 40) {
    return "Silty Clay";
  }
  if (clay >= 40 && sand <= 45 && silt < 40) {
    return "Clay";
  }

  // Default fallback if boundary float discrepancy
  return clay > 35 ? "Clay Loam" : "Loam";
}

interface SoilGridsApiResponse {
  properties?: {
    layers?: Array<{
      name: string;
      depths?: Array<{
        label: string;
        values?: {
          mean?: number;
        };
      }>;
    }>;
  };
}

export async function fetchSoilIntelligence(lat: number, lon: number): Promise<SoilIntelligenceResponse> {
  const startTime = Date.now();
  const cacheKey = `soil_${lat.toFixed(3)}_${lon.toFixed(3)}`;
  const cached = appCache.get<SoilIntelligenceResponse>(cacheKey);
  if (cached) {
    return {
      ...cached,
      latencyMs: Date.now() - startTime,
    };
  }

  const nearestDistrict = findNearestDistrict(lat, lon);
  const aez = getAEZForLocation(lat, lon);

  let soilData: SoilGridsData;
  let isFallback = false;
  let source = "ISRIC SoilGrids REST API v2.0 (depth 0-30cm)";
  let confidence = 96;

  try {
    const url = `${config.isricSoilGridsApiBase}?lon=${lon}&lat=${lat}&property=phh2o&property=clay&property=sand&property=soc&property=cec&depth=0-30cm&value=mean`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.apiTimeoutMs);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`ISRIC SoilGrids responded with status ${response.status}`);
    }

    const json = (await response.json()) as SoilGridsApiResponse;
    const layers = json.properties?.layers ?? [];

    const getMean = (name: string): number | null => {
      const layer = layers.find((l) => l.name === name);
      const val = layer?.depths?.[0]?.values?.mean;
      return typeof val === "number" ? val : null;
    };

    const rawPh = getMean("phh2o"); // SoilGrids returns ph * 10
    const rawClay = getMean("clay"); // in g/kg (divide by 10 for %)
    const rawSand = getMean("sand"); // in g/kg (divide by 10 for %)
    const rawSoc = getMean("soc"); // in dg/kg (divide by 10 for g/kg)
    const rawCec = getMean("cec"); // in mmol(c)/kg (divide by 10 for cmol(c)/kg)

    if (rawPh === null || rawClay === null || rawSand === null) {
      throw new Error("Incomplete layers in ISRIC response");
    }

    const ph = parseFloat((rawPh / 10).toFixed(2));
    const clay = parseFloat((rawClay / 10).toFixed(1));
    const sand = parseFloat((rawSand / 10).toFixed(1));
    const silt = parseFloat(Math.max(0, 100 - (clay + sand)).toFixed(1));
    const soc = parseFloat((rawSoc ? rawSoc / 10 : nearestDistrict.calibratedSoil.soc).toFixed(1));
    const cec = parseFloat((rawCec ? rawCec / 10 : nearestDistrict.calibratedSoil.cec).toFixed(1));

    soilData = {
      ph,
      clayPercentage: clay,
      sandPercentage: sand,
      siltPercentage: silt,
      soilTexture: calculateUsdaSoilTexture(sand, clay, silt),
      soc,
      cec,
      depth: "0-30cm (topsoil root-zone)",
      source,
      confidence,
      retrievedAt: new Date().toISOString(),
      isFallback: false,
    };
  } catch (err: unknown) {
    // Graceful fallback to BARC AEZ scientifically calibrated district matrices
    isFallback = true;
    source = "BARC Agro-Ecological Zones (AEZ) Database & Calibrated Regional Soil Baseline";
    confidence = 88;

    const cal = nearestDistrict.calibratedSoil;
    soilData = {
      ph: cal.ph,
      clayPercentage: cal.clay,
      sandPercentage: cal.sand,
      siltPercentage: cal.silt,
      soilTexture: cal.texture,
      soc: cal.soc,
      cec: cal.cec,
      depth: "0-30cm (regional agronomic baseline)",
      source,
      confidence,
      retrievedAt: new Date().toISOString(),
      isFallback: true,
    };
  }

  const result: SoilIntelligenceResponse = {
    location: {
      lat,
      lon,
      nearestDistrict: nearestDistrict.name,
      districtBn: nearestDistrict.nameBn,
    },
    soilProperties: soilData,
    agroEcologicalZone: aez,
    sources: [source, "BARC AEZ Classification Matrix 2024", "ISRIC World Soil Information"],
    retrievalTimestamp: new Date().toISOString(),
    latencyMs: Date.now() - startTime,
    confidenceScore: confidence,
  };

  appCache.set(cacheKey, result, config.cacheTtlSeconds);
  return result;
}
