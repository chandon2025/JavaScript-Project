import { Router } from "express";
import {
  getSatelliteWeatherHandler,
  getSoilIntelligenceHandler,
  postCropIntelligenceHandler,
  postRotationEngineHandler,
} from "../controllers/api-controller.js";

export const publicApiRouter = Router();

// 1. Satellite Weather & Climate Aggregation
publicApiRouter.get("/satellite-weather", getSatelliteWeatherHandler);

// 2. Soil Properties & AEZ Intelligence
publicApiRouter.get("/soil-intelligence", getSoilIntelligenceHandler);

// 3. MCDA Crop Recommendation & Climate Risk
publicApiRouter.post("/crop-intelligence", postCropIntelligenceHandler);

// 4. Soil Nitrogen & Rotation Trajectory Engine with Counterfactual Audit
publicApiRouter.post("/rotation-engine", postRotationEngineHandler);
