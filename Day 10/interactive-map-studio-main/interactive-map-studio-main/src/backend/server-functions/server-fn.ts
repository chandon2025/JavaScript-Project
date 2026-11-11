import { createServerFn } from "@tanstack/react-start";
import { fetchSatelliteWeather } from "../ingestion/satellite-weather";
import { fetchSoilIntelligence } from "../ingestion/soilgrids";
import { runMcdaCropSuitability } from "../engines/mcda-recommendation";
import { analyzeCropRotationTrajectory } from "../engines/nitrogen-rotation";
import type { CropIntelligenceResponse, RotationSeasonInput } from "../types";

export const getSatelliteWeatherFn = createServerFn({ method: "GET" })
  .validator((d: { lat: number; lon: number }) => d)
  .handler(async ({ data }) => {
    return await fetchSatelliteWeather(data.lat, data.lon);
  });

export const getSoilIntelligenceFn = createServerFn({ method: "GET" })
  .validator((d: { lat: number; lon: number }) => d)
  .handler(async ({ data }) => {
    return await fetchSoilIntelligence(data.lat, data.lon);
  });

export const getCropIntelligenceFn = createServerFn({ method: "POST" })
  .validator(
    (d: {
      lat: number;
      lon: number;
      season?: string;
      customSoilOverride?: { ph?: number; texture?: string };
    }) => d,
  )
  .handler(async ({ data }) => {
    const [soilIntel, weatherIntel] = await Promise.all([
      fetchSoilIntelligence(data.lat, data.lon),
      fetchSatelliteWeather(data.lat, data.lon),
    ]);

    const effectiveSoil = { ...soilIntel.soilProperties };
    if (data.customSoilOverride?.ph) effectiveSoil.ph = data.customSoilOverride.ph;
    if (data.customSoilOverride?.texture) effectiveSoil.soilTexture = data.customSoilOverride.texture as any;

    const recommendations = runMcdaCropSuitability(
      effectiveSoil,
      weatherIntel.sevenDayForecast,
      weatherIntel.currentConditions.rootZoneSaturation,
      data.season || "All",
    );

    const highestSeverity = weatherIntel.hazardAlerts.some((h) => h.severity === "CRITICAL")
      ? "CRITICAL"
      : weatherIntel.hazardAlerts.some((h) => h.severity === "HIGH")
        ? "HIGH"
        : weatherIntel.hazardAlerts.length > 0
          ? "MODERATE"
          : "NORMAL";

    const response: CropIntelligenceResponse = {
      location: {
        lat: data.lat,
        lon: data.lon,
        district: weatherIntel.location.district,
      },
      seasonEvaluated: data.season || "All",
      recommendations,
      climateRiskSummary: {
        activeHazardsCount: weatherIntel.hazardAlerts.length,
        highestAlertSeverity: highestSeverity,
        hazards: weatherIntel.hazardAlerts,
      },
      evaluatedAt: new Date().toISOString(),
      confidenceScore: Math.round((soilIntel.confidenceScore + weatherIntel.confidenceScore) / 2),
      sources: [...new Set([...soilIntel.sources, ...weatherIntel.sources])],
    };

    return response;
  });

export const getRotationEngineFn = createServerFn({ method: "POST" })
  .validator((d: { seasons: RotationSeasonInput[] }) => d)
  .handler(async ({ data }) => {
    return analyzeCropRotationTrajectory(data.seasons);
  });
