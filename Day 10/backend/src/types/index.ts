export type USDA_SoilTexture =
  | "Sand"
  | "Loamy Sand"
  | "Sandy Loam"
  | "Loam"
  | "Silt Loam"
  | "Silt"
  | "Sandy Clay Loam"
  | "Clay Loam"
  | "Silty Clay Loam"
  | "Sandy Clay"
  | "Silty Clay"
  | "Clay";

export interface SoilGridsData {
  ph: number;
  clayPercentage: number;
  sandPercentage: number;
  siltPercentage: number;
  soilTexture: USDA_SoilTexture;
  soc: number; // Soil Organic Carbon (g/kg)
  cec: number; // Cation Exchange Capacity (cmol/kg)
  depth: string;
  source: string;
  confidence: number; // 0-100%
  retrievedAt: string;
  isFallback: boolean;
}

export interface AEZInfo {
  aezNumber: number;
  aezName: string;
  aezNameBn: string;
  dominantSoilGroup: string;
  physiography: string;
  inundationLandTypes: {
    highlandF0: number; // percentage
    mediumHighlandF1: number;
    mediumLowlandF2: number;
    lowlandF3: number;
    veryLowlandF4: number;
  };
  salinityRisk: {
    level: "None" | "Slight" | "Moderate" | "Severe" | "Extreme";
    levelBn: string;
    rangeECe_dSm: string;
  };
  floodVulnerability: "Very Low" | "Low" | "Medium" | "High" | "Severe";
  floodVulnerabilityBn: string;
  regionalCropCalendar: {
    boroRice: string;
    amanRice: string;
    ausRice: string;
    rabiCrops: string[];
    kharifCrops: string[];
  };
  majorDistricts: string[];
}

export interface SoilIntelligenceResponse {
  location: {
    lat: number;
    lon: number;
    nearestDistrict: string;
    districtBn: string;
  };
  soilProperties: SoilGridsData;
  agroEcologicalZone: AEZInfo;
  sources: string[];
  retrievalTimestamp: string;
  latencyMs: number;
  confidenceScore: number;
}

export interface WeatherDailyPoint {
  date: string;
  dayName: string;
  tempAvg: number;
  tempMax: number;
  tempMin: number;
  relativeHumidity: number;
  solarRadiation_MJm2: number; // ALLSKY_SFC_SW_DWN in MJ/m^2/day
  precipitation_mm: number;
  precipitationProbability: number;
  soilMoistureSurface: number; // 0-10cm in m^3/m^3
  soilMoistureRootZone: number; // 10-40cm in m^3/m^3
  rootZoneSaturationPct: number; // 0-100%
  gddRice: number; // Tbase 10°C
  gddMaize: number; // Tbase 10°C
  gddPotato: number; // Tbase 7°C
  gddMustard: number; // Tbase 5°C
  et0_mm: number;
  eta_mm: number;
  cwsi: number; // Crop Water Stress Index: 1 - (ETa / ETp)
}

export interface ClimateHazardAlert {
  hazardType: "HEAT_STRESS" | "WATERLOGGING_FLOOD" | "DROUGHT" | "FUNGAL_BLIGHT";
  severity: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  titleEn: string;
  titleBn: string;
  messageEn: string;
  messageBn: string;
  actionRecommendationEn: string;
  actionRecommendationBn: string;
  triggeredMetric: string;
  thresholdValue: string;
  measuredValue: string;
}

export interface SatelliteWeatherResponse {
  location: {
    lat: number;
    lon: number;
    district: string;
    districtBn: string;
  };
  currentConditions: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    windSpeedKmh: number;
    solarRadiation: number;
    precipitationToday: number;
    soilMoisture0_10cm: number;
    soilMoisture10_40cm: number;
    rootZoneSaturation: number;
    cwsi: number;
  };
  sevenDayForecast: WeatherDailyPoint[];
  gddSummary: {
    cumulative7DayGddRice: number;
    cumulative7DayGddMaize: number;
    cumulative7DayGddPotato: number;
    cumulative7DayGddMustard: number;
  };
  hazardAlerts: ClimateHazardAlert[];
  thirtyYearClimateNorm: {
    historicalRainfallMonth_mm: number;
    historicalTempAvgMonth_c: number;
    heatwaveRiskDays: number;
    droughtCycleRisk: string;
  };
  sources: string[];
  retrievalTimestamp: string;
  latencyMs: number;
  confidenceScore: number;
  isFallback: boolean;
}

export interface CropProfile {
  id: string;
  name: string;
  nameBn: string;
  botanicalFamily: "Poaceae" | "Solanaceae" | "Fabaceae" | "Brassicaceae" | "Malvaceae" | "Other";
  season: "Rabi" | "Kharif-1" | "Kharif-2" | "Year-Round";
  seasonBn: string;
  durationDays: number;
  baseTemp_c: number;
  optimalTempMin_c: number;
  optimalTempMax_c: number;
  anthesisHeatThreshold_c: number; // Temperature above which spikelet sterility occurs
  optimalPhMin: number;
  optimalPhMax: number;
  optimalTexture: USDA_SoilTexture[];
  waterRequirement_mm: number;
  rootDepthCategory: "Shallow" | "Medium" | "Deep";
  nitrogenImpactKgHa: number; // positive = fixation, negative = depletion
  averageGrossProfitBdtAcre: number;
  emoji: string;
}

export interface CropRecommendationItem {
  crop: CropProfile;
  matchScore: number; // 0-100%
  confidenceLevel: number; // 0-100%
  rank: number;
  suitabilityBreakdown: {
    soilScore: number;
    waterScore: number;
    temperatureScore: number;
    gddScore: number;
    overallWeightedScore: number;
  };
  explanationEn: string;
  explanationBn: string;
  riskFactorsEn: string[];
  riskFactorsBn: string[];
  financialProjection: {
    estimatedProfitBdtAcre: string;
    marketDemand: "High" | "Medium" | "Stable";
    waterCostSavingsBdtAcre: number;
  };
}

export interface CropIntelligenceResponse {
  location: {
    lat: number;
    lon: number;
    district: string;
  };
  seasonEvaluated: string;
  recommendations: CropRecommendationItem[];
  climateRiskSummary: {
    activeHazardsCount: number;
    highestAlertSeverity: string;
    hazards: ClimateHazardAlert[];
  };
  evaluatedAt: string;
  confidenceScore: number;
  sources: string[];
}

export interface RotationSeasonInput {
  seasonName: string; // e.g. "Rabi 2025"
  cropId: string;
  cropName: string;
}

export interface RotationTrajectoryResponse {
  seasonPlan: {
    seasonName: string;
    cropName: string;
    botanicalFamily: string;
    rootDepth: string;
    nitrogenDeltaKgHa: number;
    cumulativeNitrogenKgHa: number;
    fertilizerCostDeltaBdtHa: number;
  }[];
  biologicalViolations: {
    hasViolation: boolean;
    violationType?: "SAME_FAMILY_MONOCULTURE" | "ROOT_COMPACTION_RISK";
    detailsEn: string;
    detailsBn: string;
  }[];
  totalNitrogenBalanceKgHa: number;
  fertilizerSavingsBdtHa: number;
  fertilizerSavingsBdtAcre: number;
  counterfactualAudit: {
    withoutNasaData: {
      titleEn: string;
      titleBn: string;
      practices: string[];
      practicesBn: string[];
      risks: string[];
      risksBn: string[];
      estimatedWastedInputBdtAcre: number;
    };
    withNasaData: {
      titleEn: string;
      titleBn: string;
      optimizations: string[];
      optimizationsBn: string[];
      benefits: string[];
      benefitsBn: string[];
      financialSavingsBdtAcre: number;
      netYieldGainPercentage: number;
    };
    netFinancialDeltaBdtAcre: number;
  };
}
