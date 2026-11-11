import type { ClimateHazardAlert, WeatherDailyPoint } from "../types/index.js";

/**
 * Engine 3: Deep Climate Hazard & Disaster Early Warning Engine
 * Quantitative agronomic thresholds:
 * 1. Heat Stress: Tmax > 35°C during flowering/anthesis -> Spikelet sterility
 * 2. Waterlogging/Flood: 3-day cumulative rain > 110mm OR root-zone saturation > 90%
 * 3. Agricultural Drought: Root-zone moisture <= 0.18 m^3/m^3 for > 5 consecutive days
 * 4. Fungal Blast/Blight: RH > 85% with 22°C <= Temp <= 28°C for > 36 hours
 */
export function evaluateClimateHazards(
  forecast: WeatherDailyPoint[],
  currentSaturationPct: number,
  currentRootZoneMoisture: number,
): ClimateHazardAlert[] {
  const alerts: ClimateHazardAlert[] = [];

  // 1. Heat Stress Analysis
  const heatStressDays = forecast.filter((d) => d.tempMax >= 35.0);
  if (heatStressDays.length > 0) {
    const maxT = Math.max(...heatStressDays.map((d) => d.tempMax));
    alerts.push({
      hazardType: "HEAT_STRESS",
      severity: maxT >= 37.0 ? "CRITICAL" : "HIGH",
      titleEn: "Extreme Heat Stress & Spikelet Sterility Alert",
      titleBn: "তীব্র তাপপ্রবাহ ও ফসল বাঁঝা হওয়ার ঝুঁকি (Spikelet Sterility)",
      messageEn: `Maximum temperatures are forecasted to reach ${maxT}°C over ${heatStressDays.length} day(s). High temperatures exceeding 35°C during anthesis/flowering cause pollen desiccation and spikelet sterility in cereals (especially Boro Rice).`,
      messageBn: `পরবর্তী দিনগুলোতে সর্বোচ্চ তাপমাত্রা ${maxT}°C পর্যন্ত পৌঁছাবে। ধান ও ভুট্টার ফুল ফোটার (Anthesis) সময় ৩৫°C-এর বেশি তাপমাত্রা থাকলে পরাগায়ন ব্যাহত হয় এবং শিষ চিটা বা বাঁঝা হয়ে যায়।`,
      actionRecommendationEn: "Apply light standing water (5-7 cm) in rice fields to cool canopy temperatures by 2-3°C. Avoid applying nitrogen fertilizers during midday heat.",
      actionRecommendationBn: "জমিতে ৫-৭ সেমি পানি ধরে রাখুন যাতে চারপাশের তাপমাত্রা ২-৩°C কম থাকে। দুপুরের কড়া রোদে জমিতে ইউরিয়া সার প্রয়োগ করবেন না।",
      triggeredMetric: "T2M_MAX",
      thresholdValue: ">= 35.0°C",
      measuredValue: `${maxT}°C`,
    });
  }

  // 2. Waterlogging & Flood Risk Analysis
  let threeDayMaxRain = 0;
  for (let i = 0; i <= forecast.length - 3; i++) {
    const sum = (forecast[i]?.precipitation_mm ?? 0) + (forecast[i + 1]?.precipitation_mm ?? 0) + (forecast[i + 2]?.precipitation_mm ?? 0);
    if (sum > threeDayMaxRain) threeDayMaxRain = sum;
  }

  const isSaturated = currentSaturationPct >= 90;
  if (threeDayMaxRain > 110 || isSaturated) {
    alerts.push({
      hazardType: "WATERLOGGING_FLOOD",
      severity: threeDayMaxRain > 150 || (threeDayMaxRain > 90 && isSaturated) ? "CRITICAL" : "HIGH",
      titleEn: "Waterlogging & Field Flooding Risk",
      titleBn: "জমিতে জলাবদ্ধতা ও পানি জমার সতর্কতা",
      messageEn: `Predicted 3-day cumulative precipitation is ${threeDayMaxRain.toFixed(1)} mm with soil root-zone saturation at ${currentSaturationPct}%. Excessive moisture will suffocate roots and induce anaerobic damping-off.`,
      messageBn: `আগামী ৩ দিনে আনুমানিক মোট বৃষ্টিপাত ${threeDayMaxRain.toFixed(1)} মিমি এবং মাটির স্যাচুরেশন ${currentSaturationPct}%। অতিরিক্ত পানিতে ফসলের শিকড়ে অক্সিজেনের অভাব ঘটবে ও গোড়া পচে যেতে পারে।`,
      actionRecommendationEn: "Halt all scheduled irrigations immediately. Excavate 15cm field perimeter drainage furrows to discharge ponding water within 12 hours.",
      actionRecommendationBn: "অবিলম্বে সকল সেচ স্থগিত রাখুন। জমি থেকে দ্রুত পানি নিষ্কাশনের জন্য চারদিকে ১৫ সেমি গভীর নালা বা ড্রেনেজ ব্যবস্থা তৈরি করুন।",
      triggeredMetric: "3-Day Cumulative Rain / Root Saturation",
      thresholdValue: "> 110 mm OR > 90% Saturation",
      measuredValue: `${threeDayMaxRain.toFixed(1)} mm / ${currentSaturationPct}%`,
    });
  }

  // 3. Agricultural Drought Analysis
  const lowMoistureDays = forecast.filter((d) => d.soilMoistureRootZone <= 0.18).length;
  if (currentRootZoneMoisture <= 0.18 || lowMoistureDays >= 4) {
    alerts.push({
      hazardType: "DROUGHT",
      severity: currentRootZoneMoisture <= 0.14 || lowMoistureDays >= 5 ? "CRITICAL" : "MODERATE",
      titleEn: "Agricultural Root-Zone Drought Alert",
      titleBn: "কৃষি খরা ও মূলমণ্ডলে আর্দ্রতার ঘাটতি সতর্কতা",
      messageEn: `Root-zone soil moisture has dropped to ${(currentRootZoneMoisture * 100).toFixed(1)}% (below the critical threshold of 18%). Crops are nearing permanent wilting point.`,
      messageBn: `ফসলের মূলমণ্ডল বা শিকড় অঞ্চলে আর্দ্রতা কমে ${(currentRootZoneMoisture * 100).toFixed(1)}%-এ নেমে এসেছে (বিপজ্জনক মাত্রা ১৮%-এর নিচে)। দ্রুত সেচ না দিলে গাছ স্থায়ীভাবে শুকিয়ে যেতে পারে।`,
      actionRecommendationEn: "Initiate conservation irrigation (drip or Alternate Wetting and Drying - AWD). Apply organic mulching around root zones to suppress evaporative losses.",
      actionRecommendationBn: "জরুরি ভিত্তিতে AWD পদ্ধতিতে সেচ দিন। বাষ্পীভবন কমাতে ফসলের গোড়ায় খড় বা নাড়া দিয়ে মালচিং প্রয়োগ করুন।",
      triggeredMetric: "Soil Moisture (10-40cm)",
      thresholdValue: "<= 18% (0.18 m^3/m^3)",
      measuredValue: `${(currentRootZoneMoisture * 100).toFixed(1)}%`,
    });
  }

  // 4. Fungal Blast & Blight Risk Analysis
  // RH > 85% and Temp between 22°C and 28°C
  const blastFavorableDays = forecast.filter((d) => d.relativeHumidity >= 85 && d.tempAvg >= 22 && d.tempAvg <= 28);
  if (blastFavorableDays.length >= 2) {
    alerts.push({
      hazardType: "FUNGAL_BLIGHT",
      severity: blastFavorableDays.length >= 3 ? "HIGH" : "MODERATE",
      titleEn: "Fungal Blast & Late Blight Epidemic Alert",
      titleBn: "ধানের ব্লাস্ট ও আলুর নাবি ধসা (Late Blight) রোগের ঝুঁকি",
      messageEn: `Prolonged high humidity (RH > 85%) coupled with moderate temperatures (22-28°C) over 36+ hours creates an optimal incubation microclimate for Pyricularia oryzae (Rice Blast) and Phytophthora infestans (Potato Blight).`,
      messageBn: `টানা ৩৬ ঘণ্টার বেশি সময় ধরে উচ্চ আর্দ্রতা (> ৮৫%) এবং ২২-২৮°C তাপমাত্রা ধানের ব্লাস্ট ছত্রাক ও আলুর লেট ব্লাইটের জন্য অত্যন্ত অনুকূল পরিবেশ তৈরি করেছে।`,
      actionRecommendationEn: "Scout field canopies daily for spindle-shaped lesions. Spray prophylactic Tricyclazole (0.8 g/L for rice) or Mancozeb/Metalaxyl (2 g/L for potato) during dry daylight hours.",
      actionRecommendationBn: "প্রতিদিন ফসলের পাতা পর্যবেক্ষণ করুন। রোগের লক্ষণ দেখা দিলে অবিলম্বে ট্রাইসাইক্লাজল (প্রতি লিটারে ০.৮ গ্রাম) অথবা ম্যানকোজেব নির্দেশিত মাত্রায় স্প্রে করুন।",
      triggeredMetric: "Relative Humidity & Temperature Matrix",
      thresholdValue: "RH > 85% & Temp 22-28°C for > 36h",
      measuredValue: `RH ${blastFavorableDays[0]?.relativeHumidity}% @ ${blastFavorableDays[0]?.tempAvg}°C`,
    });
  }

  return alerts;
}
