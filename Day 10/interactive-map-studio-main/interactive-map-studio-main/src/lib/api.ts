import type {
  CropIntelligenceResponse,
  RotationSeasonInput,
  RotationTrajectoryResponse,
  SatelliteWeatherResponse,
  SoilIntelligenceResponse,
} from "../backend/types";

export async function fetchSatelliteWeatherClient(lat: number, lon: number): Promise<SatelliteWeatherResponse> {
  const res = await fetch(`/api/public/satellite-weather?lat=${lat}&lon=${lon}`);
  if (!res.ok) {
    throw new Error(`Satellite weather error: ${res.status}`);
  }
  return res.json();
}

export async function fetchSoilIntelligenceClient(lat: number, lon: number): Promise<SoilIntelligenceResponse> {
  const res = await fetch(`/api/public/soil-intelligence?lat=${lat}&lon=${lon}`);
  if (!res.ok) {
    throw new Error(`Soil intelligence error: ${res.status}`);
  }
  return res.json();
}

export async function fetchCropIntelligenceClient(
  lat: number,
  lon: number,
  season: string = "All",
): Promise<CropIntelligenceResponse> {
  const res = await fetch(`/api/public/crop-intelligence`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lat, lon, season }),
  });
  if (!res.ok) {
    throw new Error(`Crop intelligence error: ${res.status}`);
  }
  return res.json();
}

export async function fetchRotationEngineClient(seasons: RotationSeasonInput[]): Promise<RotationTrajectoryResponse> {
  const res = await fetch(`/api/public/rotation-engine`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ seasons }),
  });
  if (!res.ok) {
    throw new Error(`Rotation engine error: ${res.status}`);
  }
  return res.json();
}
