import type { AEZInfo, USDA_SoilTexture } from "../types/index.js";

export interface DistrictGeo {
  name: string;
  nameBn: string;
  lat: number;
  lon: number;
  aezNumber: number;
  calibratedSoil: {
    ph: number;
    clay: number;
    sand: number;
    silt: number;
    texture: USDA_SoilTexture;
    soc: number;
    cec: number;
  };
  climateBaseline: {
    annualRainfall_mm: number;
    monthlyRainfallNorm_mm: number;
    tempAvgNorm_c: number;
    heatwaveRiskDays: number;
    droughtCycleRisk: string;
  };
}

export const BANGLADESH_DISTRICTS: DistrictGeo[] = [
  {
    name: "Bogura",
    nameBn: "বগুড়া",
    lat: 24.8465,
    lon: 89.3777,
    aezNumber: 4, // Karatoya-Bangali Floodplain & Level Barind
    calibratedSoil: {
      ph: 6.4,
      clay: 26,
      sand: 32,
      silt: 42,
      texture: "Loam",
      soc: 11.8,
      cec: 16.5,
    },
    climateBaseline: {
      annualRainfall_mm: 1720,
      monthlyRainfallNorm_mm: 185,
      tempAvgNorm_c: 25.8,
      heatwaveRiskDays: 14,
      droughtCycleRisk: "Moderate (Early Kharif-1)",
    },
  },
  {
    name: "Mymensingh",
    nameBn: "ময়মনসিংহ",
    lat: 24.7471,
    lon: 90.4203,
    aezNumber: 9, // Old Brahmaputra Floodplain
    calibratedSoil: {
      ph: 6.8,
      clay: 28,
      sand: 28,
      silt: 44,
      texture: "Clay Loam",
      soc: 13.5,
      cec: 18.2,
    },
    climateBaseline: {
      annualRainfall_mm: 2250,
      monthlyRainfallNorm_mm: 265,
      tempAvgNorm_c: 25.4,
      heatwaveRiskDays: 9,
      droughtCycleRisk: "Low",
    },
  },
  {
    name: "Barishal",
    nameBn: "বরিশাল",
    lat: 22.701,
    lon: 90.3535,
    aezNumber: 13, // Ganges Tidal Floodplain
    calibratedSoil: {
      ph: 7.2,
      clay: 38,
      sand: 18,
      silt: 44,
      texture: "Silty Clay Loam",
      soc: 14.8,
      cec: 22.4,
    },
    climateBaseline: {
      annualRainfall_mm: 2180,
      monthlyRainfallNorm_mm: 240,
      tempAvgNorm_c: 26.2,
      heatwaveRiskDays: 8,
      droughtCycleRisk: "Low (High Salinity Risk in Dry Season)",
    },
  },
  {
    name: "Dhaka",
    nameBn: "ঢাকা",
    lat: 23.8103,
    lon: 90.4125,
    aezNumber: 28, // Madhupur Tract & Young Brahmaputra
    calibratedSoil: {
      ph: 5.8,
      clay: 32,
      sand: 34,
      silt: 34,
      texture: "Clay Loam",
      soc: 9.4,
      cec: 14.1,
    },
    climateBaseline: {
      annualRainfall_mm: 2050,
      monthlyRainfallNorm_mm: 210,
      tempAvgNorm_c: 26.1,
      heatwaveRiskDays: 12,
      droughtCycleRisk: "Moderate",
    },
  },
  {
    name: "Rajshahi",
    nameBn: "রাজশাহী",
    lat: 24.3745,
    lon: 88.6042,
    aezNumber: 26, // High Barind Tract
    calibratedSoil: {
      ph: 6.2,
      clay: 34,
      sand: 24,
      silt: 42,
      texture: "Clay Loam",
      soc: 8.6,
      cec: 15.3,
    },
    climateBaseline: {
      annualRainfall_mm: 1450,
      monthlyRainfallNorm_mm: 130,
      tempAvgNorm_c: 26.8,
      heatwaveRiskDays: 24,
      droughtCycleRisk: "High (Severe dry season)",
    },
  },
  {
    name: "Rangpur",
    nameBn: "রংপুর",
    lat: 25.7439,
    lon: 89.2752,
    aezNumber: 3, // Tista Meander Floodplain
    calibratedSoil: {
      ph: 5.6,
      clay: 18,
      sand: 48,
      silt: 34,
      texture: "Sandy Loam",
      soc: 11.2,
      cec: 12.8,
    },
    climateBaseline: {
      annualRainfall_mm: 2100,
      monthlyRainfallNorm_mm: 235,
      tempAvgNorm_c: 24.9,
      heatwaveRiskDays: 10,
      droughtCycleRisk: "Low",
    },
  },
  {
    name: "Sylhet",
    nameBn: "সিলেট",
    lat: 24.8949,
    lon: 91.8687,
    aezNumber: 20, // Eastern Surma-Kushiyara Floodplain
    calibratedSoil: {
      ph: 5.1,
      clay: 30,
      sand: 26,
      silt: 44,
      texture: "Clay Loam",
      soc: 16.2,
      cec: 19.5,
    },
    climateBaseline: {
      annualRainfall_mm: 4180,
      monthlyRainfallNorm_mm: 480,
      tempAvgNorm_c: 25.2,
      heatwaveRiskDays: 5,
      droughtCycleRisk: "Very Low (Flash Flood Vulnerable)",
    },
  },
  {
    name: "Khulna",
    nameBn: "খুলনা",
    lat: 22.8456,
    lon: 89.5403,
    aezNumber: 13, // Ganges Tidal Floodplain
    calibratedSoil: {
      ph: 7.4,
      clay: 42,
      sand: 14,
      silt: 44,
      texture: "Silty Clay",
      soc: 13.8,
      cec: 24.1,
    },
    climateBaseline: {
      annualRainfall_mm: 1750,
      monthlyRainfallNorm_mm: 190,
      tempAvgNorm_c: 26.5,
      heatwaveRiskDays: 15,
      droughtCycleRisk: "Moderate (High Coastal Salinity)",
    },
  },
  {
    name: "Chattogram",
    nameBn: "চট্টগ্রাম",
    lat: 22.3569,
    lon: 91.7832,
    aezNumber: 23, // Chittagong Coastal Plain
    calibratedSoil: {
      ph: 5.7,
      clay: 26,
      sand: 38,
      silt: 36,
      texture: "Loam",
      soc: 12.4,
      cec: 16.0,
    },
    climateBaseline: {
      annualRainfall_mm: 2950,
      monthlyRainfallNorm_mm: 320,
      tempAvgNorm_c: 26.0,
      heatwaveRiskDays: 8,
      droughtCycleRisk: "Low (Cyclone/Surge Vulnerable)",
    },
  },
  {
    name: "Dinajpur",
    nameBn: "দিনাজপুর",
    lat: 25.6279,
    lon: 88.6332,
    aezNumber: 1, // Old Himalayan Piedmont Plain
    calibratedSoil: {
      ph: 5.4,
      clay: 16,
      sand: 54,
      silt: 30,
      texture: "Sandy Loam",
      soc: 10.5,
      cec: 11.6,
    },
    climateBaseline: {
      annualRainfall_mm: 1980,
      monthlyRainfallNorm_mm: 195,
      tempAvgNorm_c: 25.1,
      heatwaveRiskDays: 14,
      droughtCycleRisk: "Moderate",
    },
  },
  {
    name: "Jashore",
    nameBn: "যশোর",
    lat: 23.1664,
    lon: 89.2081,
    aezNumber: 11, // High Ganges River Floodplain
    calibratedSoil: {
      ph: 7.1,
      clay: 30,
      sand: 30,
      silt: 40,
      texture: "Clay Loam",
      soc: 11.5,
      cec: 18.0,
    },
    climateBaseline: {
      annualRainfall_mm: 1580,
      monthlyRainfallNorm_mm: 160,
      tempAvgNorm_c: 26.6,
      heatwaveRiskDays: 20,
      droughtCycleRisk: "Moderate to High",
    },
  },
  {
    name: "Cumilla",
    nameBn: "কুমিল্লা",
    lat: 23.4607,
    lon: 91.1809,
    aezNumber: 19, // Old Meghna Estuarine Floodplain
    calibratedSoil: {
      ph: 6.3,
      clay: 32,
      sand: 24,
      silt: 44,
      texture: "Clay Loam",
      soc: 12.8,
      cec: 17.5,
    },
    climateBaseline: {
      annualRainfall_mm: 2200,
      monthlyRainfallNorm_mm: 245,
      tempAvgNorm_c: 25.9,
      heatwaveRiskDays: 9,
      droughtCycleRisk: "Low",
    },
  },
];

export const BARC_AEZ_REGISTRY: Record<number, AEZInfo> = {
  1: {
    aezNumber: 1,
    aezName: "Old Himalayan Piedmont Plain",
    aezNameBn: "পুরাতন হিমালয় পাদদেশীয় সমভূমি",
    dominantSoilGroup: "Non-Calcareous Brown Floodplain Soils & Deep Black Terai Soils",
    physiography: "Gently sloping piedmont alluvial plain with coarse-textured sediments",
    inundationLandTypes: { highlandF0: 58, mediumHighlandF1: 34, mediumLowlandF2: 5, lowlandF3: 3, veryLowlandF4: 0 },
    salinityRisk: { level: "None", levelBn: "লবণাক্ততামুক্ত", rangeECe_dSm: "< 2.0" },
    floodVulnerability: "Low",
    floodVulnerabilityBn: "কম",
    regionalCropCalendar: {
      boroRice: "Dec - May",
      amanRice: "Jul - Dec",
      ausRice: "Apr - Jul",
      rabiCrops: ["Wheat", "Potato", "Maize", "Mustard", "Vegetables"],
      kharifCrops: ["T. Aman", "Jute", "Aus Rice"],
    },
    majorDistricts: ["Panchagarh", "Thakurgaon", "Dinajpur"],
  },
  3: {
    aezNumber: 3,
    aezName: "Tista Meander Floodplain",
    aezNameBn: "তিস্তা ঘূর্ণন প্লাবনভূমি",
    dominantSoilGroup: "Non-Calcareous Grey & Brown Floodplain Soils",
    physiography: "Meander ridge and basin landscape with sandy to silty alluvium",
    inundationLandTypes: { highlandF0: 35, mediumHighlandF1: 51, mediumLowlandF2: 10, lowlandF3: 3, veryLowlandF4: 1 },
    salinityRisk: { level: "None", levelBn: "লবণাক্ততামুক্ত", rangeECe_dSm: "< 2.0" },
    floodVulnerability: "Medium",
    floodVulnerabilityBn: "মাঝারি",
    regionalCropCalendar: {
      boroRice: "Jan - May",
      amanRice: "Jul - Nov",
      ausRice: "Apr - Jul",
      rabiCrops: ["Potato", "Tobacco", "Maize", "Mustard", "Wheat"],
      kharifCrops: ["T. Aman", "Jute", "Summer Vegetables"],
    },
    majorDistricts: ["Rangpur", "Nilphamari", "Gaibandha", "Lalmonirhat", "Kurigram"],
  },
  4: {
    aezNumber: 4,
    aezName: "Karatoya-Bangali Floodplain",
    aezNameBn: "করতোয়া-বাঙালি প্লাবনভূমি",
    dominantSoilGroup: "Non-Calcareous Grey Floodplain Soils",
    physiography: "Smooth floodplain ridges and broad depressions with fertile silt loam",
    inundationLandTypes: { highlandF0: 23, mediumHighlandF1: 44, mediumLowlandF2: 14, lowlandF3: 14, veryLowlandF4: 5 },
    salinityRisk: { level: "None", levelBn: "লবণাক্ততামুক্ত", rangeECe_dSm: "< 2.0" },
    floodVulnerability: "Medium",
    floodVulnerabilityBn: "মাঝারি",
    regionalCropCalendar: {
      boroRice: "Dec - May",
      amanRice: "Jul - Nov",
      ausRice: "Apr - Jul",
      rabiCrops: ["Potato", "Mustard", "Chili", "Winter Vegetables", "Maize"],
      kharifCrops: ["T. Aman", "Jute", "Dhaincha"],
    },
    majorDistricts: ["Bogura", "Sirajganj", "Gaibandha"],
  },
  9: {
    aezNumber: 9,
    aezName: "Old Brahmaputra Floodplain",
    aezNameBn: "পুরাতন ব্রহ্মপুত্র প্লাবনভূমি",
    dominantSoilGroup: "Non-Calcareous Dark Grey Floodplain Soils",
    physiography: "Broad ridges and inter-ridge depressions with high fertility silty clay loam",
    inundationLandTypes: { highlandF0: 35, mediumHighlandF1: 41, mediumLowlandF2: 15, lowlandF3: 8, veryLowlandF4: 1 },
    salinityRisk: { level: "None", levelBn: "লবণাক্ততামুক্ত", rangeECe_dSm: "< 2.0" },
    floodVulnerability: "Low",
    floodVulnerabilityBn: "কম",
    regionalCropCalendar: {
      boroRice: "Jan - May",
      amanRice: "Jul - Nov",
      ausRice: "Apr - Aug",
      rabiCrops: ["Boro Rice", "Mustard", "Wheat", "Potato", "Pulses"],
      kharifCrops: ["T. Aman", "Jute", "Aus Rice"],
    },
    majorDistricts: ["Mymensingh", "Netrokona", "Kishoreganj", "Sherpur", "Jamalpur"],
  },
  11: {
    aezNumber: 11,
    aezName: "High Ganges River Floodplain",
    aezNameBn: "উচ্চ গঙ্গা নদী প্লাবনভূমি",
    dominantSoilGroup: "Calcareous Dark Grey & Brown Floodplain Soils",
    physiography: "High ridges with calcareous silts and clayey basin depressions",
    inundationLandTypes: { highlandF0: 43, mediumHighlandF1: 32, mediumLowlandF2: 12, lowlandF3: 8, veryLowlandF4: 5 },
    salinityRisk: { level: "None", levelBn: "লবণাক্ততামুক্ত", rangeECe_dSm: "< 2.0" },
    floodVulnerability: "Low",
    floodVulnerabilityBn: "কম",
    regionalCropCalendar: {
      boroRice: "Dec - Apr",
      amanRice: "Jul - Nov",
      ausRice: "Apr - Jul",
      rabiCrops: ["Wheat", "Lentil", "Mustard", "Onion", "Garlic", "Sugarcane"],
      kharifCrops: ["T. Aman", "Jute", "Sesame"],
    },
    majorDistricts: ["Rajshahi", "Kushtia", "Meherpur", "Chuadanga", "Jashore", "Pabna"],
  },
  13: {
    aezNumber: 13,
    aezName: "Ganges Tidal Floodplain",
    aezNameBn: "গঙ্গা জোয়ার-ভাটা প্লাবনভূমি",
    dominantSoilGroup: "Non-Calcareous Grey Floodplain Soils with Tidal Inundation",
    physiography: "Tidal landscape dissected by intricate tidal creeks and brackish influence",
    inundationLandTypes: { highlandF0: 12, mediumHighlandF1: 78, mediumLowlandF2: 8, lowlandF3: 1, veryLowlandF4: 1 },
    salinityRisk: { level: "Moderate", levelBn: "মাঝারি থেকে তীব্র (শুষ্ক মৌসুমে)", rangeECe_dSm: "4.0 - 12.0" },
    floodVulnerability: "High",
    floodVulnerabilityBn: "উচ্চ (জোয়ার-ভাটা ও জলোচ্ছ্বাস)",
    regionalCropCalendar: {
      boroRice: "Dec - May (Salinity-Tolerant BRRI dhan67/89)",
      amanRice: "Jul - Dec (Local / High-Yielding Saline Tolerant)",
      ausRice: "Apr - Jul",
      rabiCrops: ["Mungbean", "Watermelon", "Sunflower", "Mustard", "Boro Rice"],
      kharifCrops: ["T. Aman", "Aus Rice"],
    },
    majorDistricts: ["Barishal", "Jhalakathi", "Pirojpur", "Patuakhali", "Barguna", "Khulna", "Satkhira", "Bagerhat"],
  },
  19: {
    aezNumber: 19,
    aezName: "Old Meghna Estuarine Floodplain",
    aezNameBn: "পুরাতন মেঘনা মোহনা প্লাবনভূমি",
    dominantSoilGroup: "Non-Calcareous Dark Grey Floodplain Soils",
    physiography: "Broad flat floodplain silt loams and silty clays with high moisture retention",
    inundationLandTypes: { highlandF0: 24, mediumHighlandF1: 45, mediumLowlandF2: 23, lowlandF3: 7, veryLowlandF4: 1 },
    salinityRisk: { level: "None", levelBn: "লবণাক্ততামুক্ত", rangeECe_dSm: "< 2.0" },
    floodVulnerability: "Medium",
    floodVulnerabilityBn: "মাঝারি",
    regionalCropCalendar: {
      boroRice: "Jan - May",
      amanRice: "Jul - Dec",
      ausRice: "Apr - Jul",
      rabiCrops: ["Potato", "Mustard", "Winter Vegetables", "Boro Rice"],
      kharifCrops: ["T. Aman", "Jute", "Aus Rice"],
    },
    majorDistricts: ["Cumilla", "Brahmanbaria", "Kishoreganj", "Chandpur"],
  },
  20: {
    aezNumber: 20,
    aezName: "Eastern Surma-Kushiyara Floodplain",
    aezNameBn: "পূর্ব সুরমা-কুশিয়ারা প্লাবনভূমি",
    dominantSoilGroup: "Grey Piedmont Soils & Acid Basin Clays",
    physiography: "Low-lying floodplain and haor margins receiving high piedmont runoff",
    inundationLandTypes: { highlandF0: 25, mediumHighlandF1: 20, mediumLowlandF2: 29, lowlandF3: 17, veryLowlandF4: 9 },
    salinityRisk: { level: "None", levelBn: "লবণাক্ততামুক্ত", rangeECe_dSm: "< 2.0" },
    floodVulnerability: "Severe",
    floodVulnerabilityBn: "তীব্র (আকস্মিক পাহাড়ি ঢল)",
    regionalCropCalendar: {
      boroRice: "Dec - Apr (Early Harvest Haor Boro)",
      amanRice: "Jul - Nov",
      ausRice: "Apr - Jul",
      rabiCrops: ["Boro Rice", "Mustard", "Winter Vegetables", "Tea (Piedmont slopes)"],
      kharifCrops: ["T. Aman", "Aus Rice"],
    },
    majorDistricts: ["Sylhet", "Moulvibazar", "Habiganj", "Sunamganj"],
  },
  23: {
    aezNumber: 23,
    aezName: "Chittagong Coastal Plain",
    aezNameBn: "চট্টগ্রাম উপকূলীয় সমভূমি",
    dominantSoilGroup: "Non-Calcareous Grey Floodplain Soils & Acid Sulphate Soils",
    physiography: "Narrow gently undulating coastal plain between hills and Bay of Bengal",
    inundationLandTypes: { highlandF0: 17, mediumHighlandF1: 43, mediumLowlandF2: 23, lowlandF3: 13, veryLowlandF4: 4 },
    salinityRisk: { level: "Moderate", levelBn: "মাঝারি (উপকূলবর্তী এলাকায়)", rangeECe_dSm: "4.0 - 8.0" },
    floodVulnerability: "High",
    floodVulnerabilityBn: "উচ্চ (ঘূর্ণিঝড় ও বৃষ্টিপাত)",
    regionalCropCalendar: {
      boroRice: "Dec - May",
      amanRice: "Jul - Dec",
      ausRice: "Apr - Jul",
      rabiCrops: ["Watermelon", "Winter Vegetables", "Chili", "Boro Rice"],
      kharifCrops: ["T. Aman", "Aus Rice", "Betel Leaf"],
    },
    majorDistricts: ["Chattogram", "Cox's Bazar", "Feni"],
  },
  26: {
    aezNumber: 26,
    aezName: "High Barind Tract",
    aezNameBn: "উচ্চ বরেন্দ্র ভূমি",
    dominantSoilGroup: "Deep Red-Brown Terrace Soils & Compact Grey Terrace Soils",
    physiography: "Dissected Pleistocene terrace with rolling topography and drought-prone silty clays",
    inundationLandTypes: { highlandF0: 93, mediumHighlandF1: 7, mediumLowlandF2: 0, lowlandF3: 0, veryLowlandF4: 0 },
    salinityRisk: { level: "None", levelBn: "লবণাক্ততামুক্ত", rangeECe_dSm: "< 2.0" },
    floodVulnerability: "Very Low",
    floodVulnerabilityBn: "অত্যন্ত কম (খরাপ্রবণ এলাকা)",
    regionalCropCalendar: {
      boroRice: "Jan - May (Deep Tubewell Irrigated)",
      amanRice: "Jul - Nov (Rainfed T. Aman, Drought-Sensitive)",
      ausRice: "Apr - Jul",
      rabiCrops: ["Wheat", "Chickpea", "Lentil", "Mustard", "Mango Orchards"],
      kharifCrops: ["T. Aman", "Summer Pulses"],
    },
    majorDistricts: ["Rajshahi", "Chapai Nawabganj", "Naogaon"],
  },
  28: {
    aezNumber: 28,
    aezName: "Madhupur Tract",
    aezNameBn: "মধুপুর গড়",
    dominantSoilGroup: "Deep Red-Brown Terrace Soils & Shallow Red-Brown Terrace Soils",
    physiography: "Dissected uplifted terrace plateau with deep acidic red clays",
    inundationLandTypes: { highlandF0: 56, mediumHighlandF1: 18, mediumLowlandF2: 7, lowlandF3: 9, veryLowlandF4: 10 },
    salinityRisk: { level: "None", levelBn: "লবণাক্ততামুক্ত", rangeECe_dSm: "< 2.0" },
    floodVulnerability: "Low",
    floodVulnerabilityBn: "কম",
    regionalCropCalendar: {
      boroRice: "Jan - May (In valleys / baid)",
      amanRice: "Jul - Nov",
      ausRice: "Apr - Jul",
      rabiCrops: ["Pineapple", "Banana", "Ginger", "Turmeric", "Vegetables"],
      kharifCrops: ["T. Aman", "Jute", "Papaya"],
    },
    majorDistricts: ["Gazipur", "Tangail", "Dhaka", "Narsingdi"],
  },
};

export function findNearestDistrict(lat: number, lon: number): DistrictGeo {
  let closest = BANGLADESH_DISTRICTS[0]!;
  let minDistance = Number.MAX_VALUE;

  for (const dist of BANGLADESH_DISTRICTS) {
    const dLat = dist.lat - lat;
    const dLon = dist.lon - lon;
    const distSq = dLat * dLat + dLon * dLon;
    if (distSq < minDistance) {
      minDistance = distSq;
      closest = dist;
    }
  }

  return closest;
}

export function getAEZForLocation(lat: number, lon: number): AEZInfo {
  const district = findNearestDistrict(lat, lon);
  const aez = BARC_AEZ_REGISTRY[district.aezNumber];
  if (aez) return aez;

  // Fallback default: AEZ-9 (Old Brahmaputra) if unmapped
  return BARC_AEZ_REGISTRY[9]!;
}
