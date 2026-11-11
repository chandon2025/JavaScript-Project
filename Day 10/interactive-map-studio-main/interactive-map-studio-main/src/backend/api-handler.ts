import { fetchSatelliteWeather } from "./ingestion/satellite-weather";
import { fetchSoilIntelligence } from "./ingestion/soilgrids";
import { runMcdaCropSuitability } from "./engines/mcda-recommendation";
import { analyzeCropRotationTrajectory } from "./engines/nitrogen-rotation";
import type { CropIntelligenceResponse } from "./types";

export async function handlePublicApiRequest(request: Request, url: URL): Promise<Response> {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json; charset=utf-8",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    // 1. Satellite Weather
    if (url.pathname === "/api/public/satellite-weather" && request.method === "GET") {
      const lat = parseFloat(url.searchParams.get("lat") || "24.8465");
      const lon = parseFloat(url.searchParams.get("lon") || "89.3777");

      if (isNaN(lat) || isNaN(lon)) {
        return new Response(JSON.stringify({ error: "Invalid coordinates (lat, lon required)" }), {
          status: 400,
          headers: corsHeaders,
        });
      }

      const weather = await fetchSatelliteWeather(lat, lon);
      return new Response(JSON.stringify(weather), { status: 200, headers: corsHeaders });
    }

    // 2. Soil Intelligence
    if (url.pathname === "/api/public/soil-intelligence" && request.method === "GET") {
      const lat = parseFloat(url.searchParams.get("lat") || "24.8465");
      const lon = parseFloat(url.searchParams.get("lon") || "89.3777");

      if (isNaN(lat) || isNaN(lon)) {
        return new Response(JSON.stringify({ error: "Invalid coordinates (lat, lon required)" }), {
          status: 400,
          headers: corsHeaders,
        });
      }

      const soil = await fetchSoilIntelligence(lat, lon);
      return new Response(JSON.stringify(soil), { status: 200, headers: corsHeaders });
    }

    // 3. Crop Intelligence
    if (url.pathname === "/api/public/crop-intelligence" && request.method === "POST") {
      const body = (await request.json().catch(() => ({}))) as {
        lat?: number;
        lon?: number;
        season?: string;
        customSoilOverride?: { ph?: number; texture?: string };
      };

      const lat = body.lat ?? 24.8465;
      const lon = body.lon ?? 89.3777;
      const season = body.season ?? "All";

      const [soilIntel, weatherIntel] = await Promise.all([
        fetchSoilIntelligence(lat, lon),
        fetchSatelliteWeather(lat, lon),
      ]);

      const effectiveSoil = { ...soilIntel.soilProperties };
      if (body.customSoilOverride?.ph) effectiveSoil.ph = body.customSoilOverride.ph;
      if (body.customSoilOverride?.texture) effectiveSoil.soilTexture = body.customSoilOverride.texture as any;

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

      return new Response(JSON.stringify(response), { status: 200, headers: corsHeaders });
    }

    // 4. Rotation Engine
    if (url.pathname === "/api/public/rotation-engine" && request.method === "POST") {
      const body = (await request.json().catch(() => ({}))) as {
        seasons?: Array<{ seasonName: string; cropId: string; cropName: string }>;
      };

      const seasons = body.seasons || [];
      if (!Array.isArray(seasons) || seasons.length === 0) {
        return new Response(JSON.stringify({ error: "seasons array is required" }), {
          status: 400,
          headers: corsHeaders,
        });
      }

      const trajectory = analyzeCropRotationTrajectory(seasons);
      return new Response(JSON.stringify(trajectory), { status: 200, headers: corsHeaders });
    }

    return new Response(JSON.stringify({ error: "Endpoint not found" }), {
      status: 404,
      headers: corsHeaders,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return new Response(JSON.stringify({ error: "API execution failed", details: message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}
