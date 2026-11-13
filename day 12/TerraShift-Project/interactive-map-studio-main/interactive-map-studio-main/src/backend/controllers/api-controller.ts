import type { Request, Response } from "express";
import { CoordinatesQuerySchema, CropIntelligencePayloadSchema, RotationEnginePayloadSchema } from "../database/validation.js";
import { fetchSoilIntelligence } from "../ingestion/soilgrids.js";
import { fetchSatelliteWeather } from "../ingestion/satellite-weather.js";
import { runMcdaCropSuitability } from "../engines/mcda-recommendation.js";
import { analyzeCropRotationTrajectory } from "../engines/nitrogen-rotation.js";
import type { CropIntelligenceResponse } from "../types/index.js";

export async function getSatelliteWeatherHandler(req: Request, res: Response): Promise<void> {
  try {
    const parseResult = CoordinatesQuerySchema.safeParse(req.query);
    if (!parseResult.success) {
      res.status(400).json({
        error: "Validation Error",
        details: parseResult.error.format(),
      });
      return;
    }

    const { lat, lon } = parseResult.data;
    const weatherData = await fetchSatelliteWeather(lat, lon);
    res.json(weatherData);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error occurred";
    res.status(500).json({ error: "Failed to fetch satellite weather", message });
  }
}

export async function getSoilIntelligenceHandler(req: Request, res: Response): Promise<void> {
  try {
    const parseResult = CoordinatesQuerySchema.safeParse(req.query);
    if (!parseResult.success) {
      res.status(400).json({
        error: "Validation Error",
        details: parseResult.error.format(),
      });
      return;
    }

    const { lat, lon } = parseResult.data;
    const soilData = await fetchSoilIntelligence(lat, lon);
    res.json(soilData);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error occurred";
    res.status(500).json({ error: "Failed to fetch soil intelligence", message });
  }
}

export async function postCropIntelligenceHandler(req: Request, res: Response): Promise<void> {
  try {
    const parseResult = CropIntelligencePayloadSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: "Validation Error",
        details: parseResult.error.format(),
      });
      return;
    }

    const { lat, lon, season, customSoilOverride } = parseResult.data;

    // Concurrently fetch soil and weather
    const [soilIntel, weatherIntel] = await Promise.all([
      fetchSoilIntelligence(lat, lon),
      fetchSatelliteWeather(lat, lon),
    ]);

    // Apply custom overrides if provided
    const effectiveSoil = { ...soilIntel.soilProperties };
    if (customSoilOverride?.ph) effectiveSoil.ph = customSoilOverride.ph;
    if (customSoilOverride?.texture) effectiveSoil.soilTexture = customSoilOverride.texture as any;

    // Run Engine 1: MCDA Crop Recommendation
    const recommendations = runMcdaCropSuitability(
      effectiveSoil,
      weatherIntel.sevenDayForecast,
      weatherIntel.currentConditions.rootZoneSaturation,
      season,
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
        lat,
        lon,
        district: weatherIntel.location.district,
      },
      seasonEvaluated: season,
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

    res.json(response);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error occurred";
    res.status(500).json({ error: "Failed to process crop intelligence", message });
  }
}

export async function postRotationEngineHandler(req: Request, res: Response): Promise<void> {
  try {
    const parseResult = RotationEnginePayloadSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: "Validation Error",
        details: parseResult.error.format(),
      });
      return;
    }

    const { seasons } = parseResult.data;
    const trajectoryResult = analyzeCropRotationTrajectory(seasons);
    res.json(trajectoryResult);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error occurred";
    res.status(500).json({ error: "Failed to analyze crop rotation", message });
  }
}
