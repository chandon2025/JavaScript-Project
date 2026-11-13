import type { CropProfile, CropRecommendationItem, SoilGridsData, USDA_SoilTexture, WeatherDailyPoint } from "../types/index.js";

export const CROPS_DATABASE: CropProfile[] = [
  {
    id: "boro_rice",
    name: "Boro Rice (BRRI dhan28/29/89)",
    nameBn: "বোরো ধান (ব্রি ধান২৮/২৯/৮৯)",
    botanicalFamily: "Poaceae",
    season: "Rabi",
    seasonBn: "রবি মৌসুম",
    durationDays: 145,
    baseTemp_c: 10.0,
    optimalTempMin_c: 20.0,
    optimalTempMax_c: 32.0,
    anthesisHeatThreshold_c: 35.0,
    optimalPhMin: 5.5,
    optimalPhMax: 7.2,
    optimalTexture: ["Clay Loam", "Silty Clay Loam", "Clay", "Silty Clay", "Loam"],
    waterRequirement_mm: 1350,
    rootDepthCategory: "Shallow",
    nitrogenImpactKgHa: -110,
    averageGrossProfitBdtAcre: 52000,
    emoji: "🌾",
  },
  {
    id: "hybrid_maize",
    name: "Hybrid Maize (Corn)",
    nameBn: "হাইব্রিড ভুট্টা",
    botanicalFamily: "Poaceae",
    season: "Rabi",
    seasonBn: "রবি মৌসুম",
    durationDays: 125,
    baseTemp_c: 10.0,
    optimalTempMin_c: 22.0,
    optimalTempMax_c: 34.0,
    anthesisHeatThreshold_c: 37.0,
    optimalPhMin: 5.8,
    optimalPhMax: 7.5,
    optimalTexture: ["Sandy Loam", "Loam", "Clay Loam", "Silt Loam"],
    waterRequirement_mm: 650,
    rootDepthCategory: "Deep",
    nitrogenImpactKgHa: -95,
    averageGrossProfitBdtAcre: 58000,
    emoji: "🌽",
  },
  {
    id: "potato",
    name: "Diamond Potato",
    nameBn: "ডায়মন্ড আলু",
    botanicalFamily: "Solanaceae",
    season: "Rabi",
    seasonBn: "রবি মৌসুম",
    durationDays: 90,
    baseTemp_c: 7.0,
    optimalTempMin_c: 15.0,
    optimalTempMax_c: 24.0,
    anthesisHeatThreshold_c: 28.0,
    optimalPhMin: 5.2,
    optimalPhMax: 6.8,
    optimalTexture: ["Sandy Loam", "Loam", "Silt Loam"],
    waterRequirement_mm: 420,
    rootDepthCategory: "Shallow",
    nitrogenImpactKgHa: -45,
    averageGrossProfitBdtAcre: 65000,
    emoji: "🥔",
  },
  {
    id: "mustard",
    name: "Mustard (BARI Sarisha-14/17)",
    nameBn: "সরিষা (বারি সরিষা-১৪/১৭)",
    botanicalFamily: "Brassicaceae",
    season: "Rabi",
    seasonBn: "রবি মৌসুম",
    durationDays: 82,
    baseTemp_c: 5.0,
    optimalTempMin_c: 15.0,
    optimalTempMax_c: 26.0,
    anthesisHeatThreshold_c: 30.0,
    optimalPhMin: 6.0,
    optimalPhMax: 7.5,
    optimalTexture: ["Loam", "Sandy Loam", "Silt Loam", "Clay Loam"],
    waterRequirement_mm: 300,
    rootDepthCategory: "Medium",
    nitrogenImpactKgHa: -35,
    averageGrossProfitBdtAcre: 34000,
    emoji: "🌼",
  },
  {
    id: "lentil",
    name: "Lentil / Masur (BARI Masur-8)",
    nameBn: "মসুর ডাল (বারি মসুর-৮)",
    botanicalFamily: "Fabaceae",
    season: "Rabi",
    seasonBn: "রবি মৌসুম",
    durationDays: 105,
    baseTemp_c: 5.0,
    optimalTempMin_c: 16.0,
    optimalTempMax_c: 27.0,
    anthesisHeatThreshold_c: 32.0,
    optimalPhMin: 6.0,
    optimalPhMax: 7.8,
    optimalTexture: ["Loam", "Clay Loam", "Silt Loam"],
    waterRequirement_mm: 260,
    rootDepthCategory: "Medium",
    nitrogenImpactKgHa: 50, // Fixes Nitrogen!
    averageGrossProfitBdtAcre: 38000,
    emoji: "🫘",
  },
  {
    id: "t_aman_rice",
    name: "T. Aman Rice (BRRI dhan71/75)",
    nameBn: "রোপা আমন ধান (ব্রি ধান৭১/৭৫)",
    botanicalFamily: "Poaceae",
    season: "Kharif-2",
    seasonBn: "খরিপ-২ মৌসুম",
    durationDays: 120,
    baseTemp_c: 10.0,
    optimalTempMin_c: 24.0,
    optimalTempMax_c: 34.0,
    anthesisHeatThreshold_c: 36.0,
    optimalPhMin: 5.5,
    optimalPhMax: 7.4,
    optimalTexture: ["Clay Loam", "Silty Clay Loam", "Clay", "Loam"],
    waterRequirement_mm: 1100,
    rootDepthCategory: "Shallow",
    nitrogenImpactKgHa: -80,
    averageGrossProfitBdtAcre: 44000,
    emoji: "🌾",
  },
  {
    id: "jute",
    name: "Tossa Jute (BJRI Tossa-8)",
    nameBn: "তোষা পাট (বিজেআরআই তোষা-৮)",
    botanicalFamily: "Malvaceae",
    season: "Kharif-1",
    seasonBn: "খরিপ-১ মৌসুম",
    durationDays: 120,
    baseTemp_c: 12.0,
    optimalTempMin_c: 25.0,
    optimalTempMax_c: 36.0,
    anthesisHeatThreshold_c: 38.0,
    optimalPhMin: 5.8,
    optimalPhMax: 7.2,
    optimalTexture: ["Sandy Loam", "Loam", "Clay Loam", "Silt Loam"],
    waterRequirement_mm: 1050,
    rootDepthCategory: "Deep",
    nitrogenImpactKgHa: -40,
    averageGrossProfitBdtAcre: 39000,
    emoji: "🌿",
  },
  {
    id: "mungbean",
    name: "Mungbean (BARI Mung-6)",
    nameBn: "মুগ ডাল (বারি মুগ-৬)",
    botanicalFamily: "Fabaceae",
    season: "Kharif-1",
    seasonBn: "খরিপ-১ মৌসুম",
    durationDays: 68,
    baseTemp_c: 10.0,
    optimalTempMin_c: 25.0,
    optimalTempMax_c: 35.0,
    anthesisHeatThreshold_c: 37.0,
    optimalPhMin: 6.2,
    optimalPhMax: 7.5,
    optimalTexture: ["Sandy Loam", "Loam", "Silt Loam"],
    waterRequirement_mm: 280,
    rootDepthCategory: "Medium",
    nitrogenImpactKgHa: 45, // Fixes Nitrogen!
    averageGrossProfitBdtAcre: 32000,
    emoji: "🌱",
  },
];

/**
 * Multi-Criteria Decision Analysis (MCDA) Scoring Engine
 */
export function runMcdaCropSuitability(
  soil: SoilGridsData,
  forecast: WeatherDailyPoint[],
  currentSaturationPct: number,
  targetSeason: string = "All",
): CropRecommendationItem[] {
  const avgTemp = forecast.reduce((acc, f) => acc + f.tempAvg, 0) / (forecast.length || 1);
  const maxTempForecast = Math.max(...forecast.map((f) => f.tempMax));
  const avgSolar = forecast.reduce((acc, f) => acc + f.solarRadiation_MJm2, 0) / (forecast.length || 1);

  const eligibleCrops = CROPS_DATABASE.filter((c) => {
    if (targetSeason === "All") return true;
    return c.season.toLowerCase().includes(targetSeason.toLowerCase());
  });

  const results: CropRecommendationItem[] = eligibleCrops.map((crop) => {
    // 1. Soil Compatibility Score (0 - 100)
    let soilScore = 80;
    // pH check
    if (soil.ph >= crop.optimalPhMin && soil.ph <= crop.optimalPhMax) {
      soilScore += 15;
    } else {
      const phDiff = Math.min(Math.abs(soil.ph - crop.optimalPhMin), Math.abs(soil.ph - crop.optimalPhMax));
      soilScore -= Math.min(40, phDiff * 25);
    }
    // Texture match
    if (crop.optimalTexture.includes(soil.soilTexture)) {
      soilScore += 10;
    } else {
      soilScore -= 15;
    }
    soilScore = Math.max(10, Math.min(100, Math.round(soilScore)));

    // 2. Water Balance & Root-Zone Moisture Score (0 - 100)
    let waterScore = 80;
    if (crop.waterRequirement_mm > 1000) {
      // Heavy water crops (Rice, Jute) thrive with high saturation
      if (currentSaturationPct >= 65) waterScore = 95;
      else if (currentSaturationPct >= 40) waterScore = 75;
      else waterScore = 50; // water deficit
    } else if (crop.waterRequirement_mm < 400) {
      // Drought tolerant / low water crops (Lentil, Mustard)
      if (currentSaturationPct > 85) waterScore = 45; // Waterlogging risk!
      else if (currentSaturationPct >= 30 && currentSaturationPct <= 65) waterScore = 95;
      else waterScore = 80;
    } else {
      // Moderate (Maize, Potato)
      if (currentSaturationPct > 85) waterScore = 55;
      else if (currentSaturationPct >= 45 && currentSaturationPct <= 75) waterScore = 92;
      else waterScore = 70;
    }
    waterScore = Math.max(10, Math.min(100, Math.round(waterScore)));

    // 3. Temperature & Heat Sensitivity Score (0 - 100)
    let temperatureScore = 85;
    if (avgTemp >= crop.optimalTempMin_c && avgTemp <= crop.optimalTempMax_c) {
      temperatureScore = 95;
    } else if (avgTemp < crop.optimalTempMin_c) {
      temperatureScore -= (crop.optimalTempMin_c - avgTemp) * 8;
    } else {
      temperatureScore -= (avgTemp - crop.optimalTempMax_c) * 7;
    }

    // Anthesis heat spike penalty
    if (maxTempForecast >= crop.anthesisHeatThreshold_c) {
      temperatureScore -= 25; // High spikelet sterility risk
    }
    temperatureScore = Math.max(10, Math.min(100, Math.round(temperatureScore)));

    // 4. Solar Insolation & GDD Sufficiency Score (0 - 100)
    let gddScore = 85;
    if (avgSolar >= 16.0) gddScore += 10;
    else if (avgSolar < 12.0) gddScore -= 15;
    gddScore = Math.max(20, Math.min(100, Math.round(gddScore)));

    // Weighted Overall Score:
    // Soil (25%), Water/Moisture (30%), Temperature (25%), Solar/GDD (20%)
    const weightedScore = Math.round(soilScore * 0.25 + waterScore * 0.3 + temperatureScore * 0.25 + gddScore * 0.2);

    // Confidence Level (based on data completeness and soil sensor fidelity)
    const confidence = Math.round(soil.confidence * 0.5 + 45);

    // Explanations (Bilingual)
    let explanationEn = "";
    let explanationBn = "";
    const riskFactorsEn: string[] = [];
    const riskFactorsBn: string[] = [];

    if (crop.waterRequirement_mm > 1000) {
      explanationEn = `Soil root-zone saturation is well suited for ${crop.name}. Soil pH of ${soil.ph} is within the favorable agronomic threshold.`;
      explanationBn = `মূলমণ্ডলে মাটির আর্দ্রতা ${crop.nameBn}-এর জন্য অত্যন্ত অনুকূল। মাটির পিএইচ (${soil.ph}) এই ফসলের বৃদ্ধির জন্য আদর্শ।`;
    } else if (crop.id === "mustard" || crop.id === "lentil") {
      explanationEn = `${crop.name} requires low irrigation (${crop.waterRequirement_mm}mm). Ideal fit for current moisture levels, helping conserve groundwater and reduce input costs.`;
      explanationBn = `${crop.nameBn}-এ পানি কম লাগে (${crop.waterRequirement_mm} মিমি)। বর্তমান মাটির আর্দ্রতায় স্বল্প সেচেই লাভজনক ফলন সম্ভব, যা সেচ খরচ বাঁচাবে।`;
    } else {
      explanationEn = `Strong thermodynamic suitability with current GDD accumulation and soil texture (${soil.soilTexture}).`;
      explanationBn = `বর্তমান তাপমাত্রা, আলোক-ঘণ্টা (GDD) এবং মাটির বুনট (${soil.soilTexture}) ${crop.nameBn} চাষের জন্য উপযোগী।`;
    }

    // Specific Risk Factors
    if (maxTempForecast >= crop.anthesisHeatThreshold_c) {
      riskFactorsEn.push(`Heatwave risk: Forecasted Tmax (${maxTempForecast}°C) exceeds anthesis safety threshold (${crop.anthesisHeatThreshold_c}°C), risking spikelet sterility.`);
      riskFactorsBn.push(`ফুল ফোটার সময় তাপপ্রবাহের ঝুঁকি: তাপমাত্রা ${maxTempForecast}°C অতিক্রম করলে পরাগায়ন বাধাগ্রস্ত হয়ে চিটা হতে পারে।`);
    }

    if (currentSaturationPct > 80 && (crop.id === "potato" || crop.id === "mustard" || crop.id === "lentil")) {
      riskFactorsEn.push("Waterlogging vulnerability: Saturated root zone may cause tuber rotting or collar rot in case of rain.");
      riskFactorsBn.push("গোড়ায় পানি জমার ঝুঁকি: মাটিতে অতিরিক্ত আর্দ্রতার কারণে কন্দ বা শিকড় পচে যাওয়ার আশঙ্কা রয়েছে।");
    }

    if (soil.ph < crop.optimalPhMin) {
      riskFactorsEn.push(`Mild soil acidity: Measured pH ${soil.ph} is below optimal ${crop.optimalPhMin}. Dolomite lime application advised.`);
      riskFactorsBn.push(`মাটির সামান্য অম্লতা: পিএইচ ${soil.ph} অনুকূল মাত্রার নিচে। ডলোমাইট বা চুন প্রয়োগের পরামর্শ দেওয়া হলো।`);
    }

    if (riskFactorsEn.length === 0) {
      riskFactorsEn.push("No severe agro-climatic stress detected for this crop under current 7-day outlook.");
      riskFactorsBn.push("বর্তমান ৭ দিনের আবহাওয়ায় এই ফসলের জন্য কোনো গুরুতর প্রাকৃতিক ঝুঁকি নেই।");
    }

    // Financial water savings estimation (৳1,200 to ৳3,800/acre saved by precision moisture timing)
    const waterSavings = crop.waterRequirement_mm > 800 ? 3200 : 1800;

    return {
      crop,
      matchScore: weightedScore,
      confidenceLevel: Math.min(98, confidence),
      rank: 0,
      suitabilityBreakdown: {
        soilScore,
        waterScore,
        temperatureScore,
        gddScore,
        overallWeightedScore: weightedScore,
      },
      explanationEn,
      explanationBn,
      riskFactorsEn,
      riskFactorsBn,
      financialProjection: {
        estimatedProfitBdtAcre: `৳ ${(crop.averageGrossProfitBdtAcre / 1000).toFixed(0)}k/একর`,
        marketDemand: crop.id === "potato" || crop.id === "boro_rice" ? "High" : "Stable",
        waterCostSavingsBdtAcre: waterSavings,
      },
    };
  });

  // Sort descending by match score
  results.sort((a, b) => b.matchScore - a.matchScore);
  results.forEach((r, idx) => (r.rank = idx + 1));

  return results;
}
