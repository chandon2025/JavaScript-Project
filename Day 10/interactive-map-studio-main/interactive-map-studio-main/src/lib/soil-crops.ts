/**
 * Comprehensive Soil & Crop Evaluation Engine for TerraShift
 * Evaluates 10 Soil Parameters + NASA Earth Observation Telemetry:
 * 1. Soil pH
 * 2. Available Nitrogen (N)
 * 3. Available Phosphorus (P)
 * 4. Available Potassium (K)
 * 5. Organic Matter (%)
 * 6. Soil Texture (Sand %, Silt %, Clay % & USDA Class)
 * 7. Soil Salinity (ECe dS/m)
 * 8. Soil Moisture (% Root-zone from NASA SMAP)
 * 9. Soil Drainage Condition
 * 10. Soil Depth (cm)
 */

export interface SoilProfile10 {
  ph: number; // e.g. 6.4 (4.0 - 8.5)
  nitrogenKgHa: number; // e.g. 34 kg/ha (0 - 150 kg/ha or Index /100)
  phosphorusPpm: number; // e.g. 14.5 ppm (0 - 60 ppm)
  potassiumMeq: number; // e.g. 0.22 meq/100g (0.05 - 0.8 meq/100g)
  organicMatterPct: number; // e.g. 1.8% (0.5 - 5.0%)
  sandPct: number; // e.g. 35%
  siltPct: number; // e.g. 45%
  clayPct: number; // e.g. 20%
  textureClass: string; // e.g. "Loam", "Clay Loam", "Sandy Loam", "Silty Clay Loam"
  salinityDsm: number; // e.g. 1.2 dS/m (0 - 12 dS/m)
  moisturePct: number; // e.g. 38% (NASA SMAP root-zone 10-40cm)
  drainage: "Well-drained" | "Moderate" | "Poor / Waterlogged";
  soilDepthCm: number; // e.g. 60 cm (15 - 120 cm)
}

export interface CropEvaluationResult {
  id: string;
  name: string;
  nameBn: string;
  category: "legume" | "oilseed" | "cereal" | "tuber" | "fibre" | "vegetable";
  categoryName: string;
  emoji: string;
  overallScore: number; // 0 - 100
  waterNeed: "Low" | "Medium" | "High";
  waterNeedBn: string;
  durationDays: number;
  season: string;
  seasonBn: string;
  avgProfitBdtAcre: number;
  summaryReasonEn: string;
  summaryReasonBn: string;
  keyBadgeEn: string;
  keyBadgeBn: string;
  parameterScores: {
    ph: { score: number; status: "optimal" | "acceptable" | "suboptimal"; value: string; optimalRange: string };
    nitrogen: { score: number; status: "optimal" | "acceptable" | "suboptimal"; value: string; optimalRange: string };
    phosphorus: { score: number; status: "optimal" | "acceptable" | "suboptimal"; value: string; optimalRange: string };
    potassium: { score: number; status: "optimal" | "acceptable" | "suboptimal"; value: string; optimalRange: string };
    organicMatter: { score: number; status: "optimal" | "acceptable" | "suboptimal"; value: string; optimalRange: string };
    texture: { score: number; status: "optimal" | "acceptable" | "suboptimal"; value: string; optimalRange: string };
    salinity: { score: number; status: "optimal" | "acceptable" | "suboptimal"; value: string; optimalRange: string };
    moisture: { score: number; status: "optimal" | "acceptable" | "suboptimal"; value: string; optimalRange: string };
    drainage: { score: number; status: "optimal" | "acceptable" | "suboptimal"; value: string; optimalRange: string };
    soilDepth: { score: number; status: "optimal" | "acceptable" | "suboptimal"; value: string; optimalRange: string };
  };
  risksEn: string[];
  risksBn: string[];
  actionsEn: string[];
  actionsBn: string[];
}

export interface CropDefinition {
  id: string;
  name: string;
  nameBn: string;
  category: "legume" | "oilseed" | "cereal" | "tuber" | "fibre" | "vegetable";
  categoryName: string;
  emoji: string;
  season: string;
  seasonBn: string;
  durationDays: number;
  waterNeed: "Low" | "Medium" | "High";
  waterNeedBn: string;
  avgProfitBdtAcre: number;
  summaryReasonEn: string;
  summaryReasonBn: string;
  keyBadgeEn: string;
  keyBadgeBn: string;
  optimalPh: [number, number]; // [min, max]
  phTolerance: [number, number];
  toleratesSalinityMaxDsm: number;
  optimalTextures: string[];
  toleratedTextures: string[];
  optimalMoisturePct: [number, number]; // NASA SMAP %
  toleratedDrainage: ("Well-drained" | "Moderate" | "Poor / Waterlogged")[];
  minSoilDepthCm: number;
  optimalNitrogenMin: number;
  fixesNitrogen: boolean;
  optimalPMin: number;
  optimalKMin: number;
  minOrganicMatterPct: number;
  risksEn: string[];
  risksBn: string[];
  actionsEn: string[];
  actionsBn: string[];
}

export const CROPS_CATALOGUE: CropDefinition[] = [
  {
    id: "mungbean",
    name: "Mung Bean (BARI Mung-6)",
    nameBn: "মুগ ডাল (বারি মুগ-৬)",
    category: "legume",
    categoryName: "Legumes & Pulses",
    emoji: "🌱",
    season: "Kharif-1 / Late Rabi",
    seasonBn: "খরিপ-১ / শেষ রবি",
    durationDays: 68,
    waterNeed: "Low",
    waterNeedBn: "কম পানি",
    avgProfitBdtAcre: 34000,
    summaryReasonEn: "Fixes atmospheric nitrogen (+45 kg N/ha) and breaks cereal disease cycles with minimal irrigation.",
    summaryReasonBn: "বায়ুমণ্ডলীয় নাইট্রোজেন মাটিতে ধরে রাখে (+৪৫ কেজি/হেক্টর) এবং কম সেচেই চমৎকার ফলন দেয়।",
    keyBadgeEn: "Bio-N Fixing",
    keyBadgeBn: "নাইট্রোজেন সংবন্ধন",
    optimalPh: [6.0, 7.5],
    phTolerance: [5.5, 8.2],
    toleratesSalinityMaxDsm: 2.5,
    optimalTextures: ["Loam", "Sandy Loam", "Silt Loam"],
    toleratedTextures: ["Clay Loam", "Silty Clay Loam"],
    optimalMoisturePct: [25, 45],
    toleratedDrainage: ["Well-drained", "Moderate"],
    minSoilDepthCm: 30,
    optimalNitrogenMin: 20,
    fixesNitrogen: true,
    optimalPMin: 12,
    optimalKMin: 0.15,
    minOrganicMatterPct: 1.2,
    risksEn: ["Susceptible to waterlogging during sudden pre-monsoon squalls."],
    risksBn: ["হঠাৎ অতিবৃষ্টিতে গোড়ায় পানি জমে শিকড় পচে যাওয়ার ঝুঁকি থাকে।"],
    actionsEn: ["Apply Rhizobium bio-fertilizer inoculant at seed sowing."],
    actionsBn: ["বীজ বপনের সময় রাইজোবিয়াম ব্যাকটেরিয়াল ইনোকুল্যান্ট ব্যবহার করুন।"],
  },
  {
    id: "mustard",
    name: "Mustard (BARI Sarisha-14/17)",
    nameBn: "সরিষা (বারি সরিষা-১৪/১৭)",
    category: "oilseed",
    categoryName: "Oilseeds & Spices",
    emoji: "🌼",
    season: "Rabi",
    seasonBn: "রবি মৌসুম",
    durationDays: 80,
    waterNeed: "Low",
    waterNeedBn: "কম পানি",
    avgProfitBdtAcre: 36000,
    summaryReasonEn: "Short season cash crop needing only 1-2 irrigations, perfect fitting between Aman and Boro.",
    summaryReasonBn: "স্বল্পমেয়াদী অর্থকরী ফসল যা মাত্র ১-২টি সেচেই আমন ও বোরোর মধ্যবর্তী সময়ে ঘরে তোলা যায়।",
    keyBadgeEn: "Short Duration (80d)",
    keyBadgeBn: "স্বল্পমেয়াদী (৮০ দিন)",
    optimalPh: [6.0, 7.6],
    phTolerance: [5.5, 8.3],
    toleratesSalinityMaxDsm: 3.5,
    optimalTextures: ["Loam", "Sandy Loam", "Silt Loam", "Clay Loam"],
    toleratedTextures: ["Silty Clay Loam"],
    optimalMoisturePct: [22, 42],
    toleratedDrainage: ["Well-drained", "Moderate"],
    minSoilDepthCm: 35,
    optimalNitrogenMin: 30,
    fixesNitrogen: false,
    optimalPMin: 14,
    optimalKMin: 0.18,
    minOrganicMatterPct: 1.2,
    risksEn: ["Aphid infestation during pod filling stage if temperature rises."],
    risksBn: ["তাপমাত্রা বৃদ্ধি পেলে দানা বাঁধার সময় জাবপোকার (Aphids) উপদ্রব বাড়তে পারে।"],
    actionsEn: ["Spray yellow sticky traps or neem oil at early vegetative phase."],
    actionsBn: ["প্রাথমিক বৃদ্ধির সময় জমিতে হলুদ আঠালো ফাঁদ বা নিম তেল ব্যবহার করুন।"],
  },
  {
    id: "maize",
    name: "Hybrid Maize (Corn)",
    nameBn: "হাইব্রিড ভুট্টা",
    category: "cereal",
    categoryName: "Cereals & Cash Crops",
    emoji: "🌽",
    season: "Rabi",
    seasonBn: "রবি মৌসুম",
    durationDays: 130,
    waterNeed: "Medium",
    waterNeedBn: "মাঝারি পানি",
    avgProfitBdtAcre: 58000,
    summaryReasonEn: "High yield capacity with strong poultry-feed market demand and high carbon efficiency.",
    summaryReasonBn: "উচ্চ ফলনশীল এবং পোল্ট্রি ফিড বাজারে চড়া দাম, কার্বন রূপান্তরের হার অত্যন্ত বেশি।",
    keyBadgeEn: "High Profitability",
    keyBadgeBn: "সর্বোচ্চ লাভজনক",
    optimalPh: [5.8, 7.5],
    phTolerance: [5.2, 8.2],
    toleratesSalinityMaxDsm: 2.8,
    optimalTextures: ["Sandy Loam", "Loam", "Clay Loam", "Silt Loam"],
    toleratedTextures: ["Silty Clay Loam"],
    optimalMoisturePct: [30, 50],
    toleratedDrainage: ["Well-drained", "Moderate"],
    minSoilDepthCm: 50,
    optimalNitrogenMin: 45,
    fixesNitrogen: false,
    optimalPMin: 18,
    optimalKMin: 0.22,
    minOrganicMatterPct: 1.5,
    risksEn: ["High fertilizer feeder; severe water stress during silking drops grain set."],
    risksBn: ["উচ্চ নাইট্রোজেন ও পটাস গ্রহণকারী; মোচা বের হওয়ার সময় খরার শিকার হলে ফলন ব্যাপক কমে।"],
    actionsEn: ["Apply 3-split urea and maintain balanced potassium for stem strength."],
    actionsBn: ["ইউরিয়া সার ৩ কিস্তিতে প্রয়োগ করুন এবং শক্ত কাণ্ডের জন্য পর্যাপ্ত পটাস দিন।"],
  },
  {
    id: "boro_rice",
    name: "Boro Rice (BRRI dhan89/92)",
    nameBn: "বোরো ধান (ব্রি ধান৮৯/৯২)",
    category: "cereal",
    categoryName: "Cereals & Cash Crops",
    emoji: "🌾",
    season: "Boro / Winter",
    seasonBn: "বোরো / শীতকালীন",
    durationDays: 145,
    waterNeed: "High",
    waterNeedBn: "উচ্চ পানি",
    avgProfitBdtAcre: 52000,
    summaryReasonEn: "Staple food grain yielding 7-8 t/ha with high response to irrigation management.",
    summaryReasonBn: "দেশের প্রধান খাদ্যশস্য, উপযুক্ত সেচ ব্যবস্থাপনায় প্রতি হেক্টরে ৭-৮ টন উচ্চ ফলন নিশ্চিত করে।",
    keyBadgeEn: "Staple Yield",
    keyBadgeBn: "উচ্চ খাদ্য ফলন",
    optimalPh: [5.5, 7.2],
    phTolerance: [4.8, 8.2],
    toleratesSalinityMaxDsm: 4.0,
    optimalTextures: ["Clay Loam", "Silty Clay Loam", "Clay", "Loam"],
    toleratedTextures: ["Silt Loam"],
    optimalMoisturePct: [45, 80],
    toleratedDrainage: ["Moderate", "Poor / Waterlogged"],
    minSoilDepthCm: 25,
    optimalNitrogenMin: 50,
    fixesNitrogen: false,
    optimalPMin: 15,
    optimalKMin: 0.2,
    minOrganicMatterPct: 1.4,
    risksEn: ["Cold injury during seedling and heat wave (>35°C) during flowering causing spikelet sterility."],
    risksBn: ["চারা অবস্থায় শৈত্যপ্রবাহ এবং ফুল ফোটার সময় অতিরিক্ত তাপে (>৩৫°সে) চিটা হওয়ার আশঙ্কা।"],
    actionsEn: ["Adopt Alternate Wetting & Drying (AWD) to save 25-30% diesel/electricity costs."],
    actionsBn: ["পানি সাশ্রয়ী এডব্লিউডি (AWD) পাইপ ব্যবহার করে ২৫-৩০% সেচ খরচ বাঁচান।"],
  },
  {
    id: "lentil",
    name: "Lentil / Masur (BARI Masur-8)",
    nameBn: "মসুর ডাল (বারি মসুর-৮)",
    category: "legume",
    categoryName: "Legumes & Pulses",
    emoji: "🫘",
    season: "Rabi",
    seasonBn: "রবি মৌসুম",
    durationDays: 105,
    waterNeed: "Low",
    waterNeedBn: "কম পানি",
    avgProfitBdtAcre: 42000,
    summaryReasonEn: "High-value protein pulse that enriches soil biology, requiring virtually no supplemental nitrogen.",
    summaryReasonBn: "উচ্চ পুষ্টিগুণসম্পন্ন ডাল যা মাটির উর্বরতা বাড়ায় এবং আলাদা নাইট্রোজেন সারের প্রয়োজন হয় না।",
    keyBadgeEn: "Low Input Cost",
    keyBadgeBn: "কম খরচ ও পুষ্টিকর",
    optimalPh: [6.0, 7.8],
    phTolerance: [5.5, 8.4],
    toleratesSalinityMaxDsm: 2.0,
    optimalTextures: ["Loam", "Clay Loam", "Silt Loam"],
    toleratedTextures: ["Sandy Loam"],
    optimalMoisturePct: [24, 40],
    toleratedDrainage: ["Well-drained"],
    minSoilDepthCm: 35,
    optimalNitrogenMin: 15,
    fixesNitrogen: true,
    optimalPMin: 16,
    optimalKMin: 0.16,
    minOrganicMatterPct: 1.3,
    risksEn: ["Extremely sensitive to waterlogging and soil salinity above 2 dS/m."],
    risksBn: ["গোড়ায় পানি জমা এবং ২ ডিএস/মি-এর বেশি লবণাক্ততা একদম সহ্য করতে পারে না।"],
    actionsEn: ["Ensure raised beds or surface field drainage furrows every 3 meters."],
    actionsBn: ["প্রতি ৩ মিটার অন্তর নিকাশ নালা তৈরি করে সেচ বা বৃষ্টির পানি দ্রুত সরান।"],
  },
  {
    id: "potato",
    name: "Diamond Potato",
    nameBn: "ডায়মন্ড আলু",
    category: "tuber",
    categoryName: "Vegetables & Tubers",
    emoji: "🥔",
    season: "Rabi",
    seasonBn: "রবি মৌসুম",
    durationDays: 90,
    waterNeed: "Medium",
    waterNeedBn: "মাঝারি পানি",
    avgProfitBdtAcre: 68000,
    summaryReasonEn: "Prime cash tuber crop with rapid biomass formation, thrives in friable, well-aerated soils.",
    summaryReasonBn: "স্বল্প সময়ে দ্রুত অর্থ উপার্জনের সেরা কন্দ ফসল, ঝুরঝুরে দোআঁশ মাটিতে সর্বোচ্চ ফলন দেয়।",
    keyBadgeEn: "Cash Intensive",
    keyBadgeBn: "উচ্চ নগদ মুনাফা",
    optimalPh: [5.2, 6.8],
    phTolerance: [4.8, 7.4],
    toleratesSalinityMaxDsm: 1.8,
    optimalTextures: ["Sandy Loam", "Loam", "Silt Loam"],
    toleratedTextures: ["Clay Loam"],
    optimalMoisturePct: [30, 48],
    toleratedDrainage: ["Well-drained"],
    minSoilDepthCm: 45,
    optimalNitrogenMin: 40,
    fixesNitrogen: false,
    optimalPMin: 22,
    optimalKMin: 0.28,
    minOrganicMatterPct: 1.8,
    risksEn: ["Late blight fungal risk under foggy, humid conditions with temperatures between 15-22°C."],
    risksBn: ["কুয়াশাচ্ছন্ন ও আর্দ্র আবহাওয়ায় (১৫-২২°সে) লেট ব্লাইট বা নাবি ধসা রোগের চরম ঝুঁকি।"],
    actionsEn: ["Preventive spraying of Mancozeb before continuous cloudy spells."],
    actionsBn: ["টানা মেঘলা আবহাওয়ার পূর্বাভাস পেলে পূর্বসতর্কতামূলক ম্যানকোজেব স্প্রে করুন।"],
  },
  {
    id: "wheat",
    name: "Wheat (BARI Gom-33)",
    nameBn: "গম (বারি গম-৩৩ - ব্লাস্ট প্রতিরোধী)",
    category: "cereal",
    categoryName: "Cereals & Cash Crops",
    emoji: "🌾",
    season: "Rabi",
    seasonBn: "রবি মৌসুম",
    durationDays: 110,
    waterNeed: "Low",
    waterNeedBn: "কম পানি",
    avgProfitBdtAcre: 38000,
    summaryReasonEn: "Zinc-enriched blast-resistant winter cereal saving up to 70% water compared to Boro rice.",
    summaryReasonBn: "জিঙ্কসমৃদ্ধ ব্লাস্ট-প্রতিরোধী গম জাত যা বোরো ধানের তুলনায় প্রায় ৭০% সেচের পানি সাশ্রয় করে।",
    keyBadgeEn: "Water-Saving Cereal",
    keyBadgeBn: "পানি সাশ্রয়ী খাদ্যশস্য",
    optimalPh: [6.0, 7.5],
    phTolerance: [5.4, 8.3],
    toleratesSalinityMaxDsm: 3.8,
    optimalTextures: ["Loam", "Clay Loam", "Silt Loam"],
    toleratedTextures: ["Sandy Loam"],
    optimalMoisturePct: [25, 45],
    toleratedDrainage: ["Well-drained", "Moderate"],
    minSoilDepthCm: 40,
    optimalNitrogenMin: 35,
    fixesNitrogen: false,
    optimalPMin: 16,
    optimalKMin: 0.2,
    minOrganicMatterPct: 1.3,
    risksEn: ["Terminal heat stress if sown late (after Dec 10) reducing grain weight."],
    risksBn: ["দেরিতে (১০ ডিসেম্বরের পর) বপন করলে শেষভাগে তীব্র গরমে দানা পুষ্ট হতে পারে না।"],
    actionsEn: ["Complete sowing within November 15 to December 5 for full grain filling."],
    actionsBn: ["১৫ নভেম্বর থেকে ৫ ডিসেম্বরের মধ্যেই বীজ বপন সম্পন্ন করুন।"],
  },
  {
    id: "t_aman_rice",
    name: "T. Aman Rice (BRRI dhan71/75)",
    nameBn: "রোপা আমন ধান (ব্রি ধান৭১/৭৫)",
    category: "cereal",
    categoryName: "Cereals & Cash Crops",
    emoji: "🌾",
    season: "Kharif-2",
    seasonBn: "খরিপ-২ মৌসুম",
    durationDays: 118,
    waterNeed: "High",
    waterNeedBn: "উচ্চ পানি",
    avgProfitBdtAcre: 44000,
    summaryReasonEn: "Drought-tolerant short-duration monsoon paddy escaping terminal dry spells with lower cost.",
    summaryReasonBn: "বৃষ্টি-নির্ভর খরা সহনশীল স্বল্পমেয়াদী আমন জাত, তুলনামূলক কম খরচে নিরাপদ ফলন নিশ্চিত করে।",
    keyBadgeEn: "Monsoon Paddy",
    keyBadgeBn: "আমন ধান",
    optimalPh: [5.5, 7.4],
    phTolerance: [4.8, 8.4],
    toleratesSalinityMaxDsm: 4.5,
    optimalTextures: ["Clay Loam", "Silty Clay Loam", "Clay", "Loam"],
    toleratedTextures: ["Silt Loam"],
    optimalMoisturePct: [45, 85],
    toleratedDrainage: ["Moderate", "Poor / Waterlogged"],
    minSoilDepthCm: 25,
    optimalNitrogenMin: 35,
    fixesNitrogen: false,
    optimalPMin: 14,
    optimalKMin: 0.18,
    minOrganicMatterPct: 1.2,
    risksEn: ["Dry spell during boot to flowering stage in late October."],
    risksBn: ["অক্টোবরের শেষভাগে থোর বা ফুল অবস্থায় বৃষ্টির অভাবে খরা দেখা দেওয়ার ঝুঁকি।"],
    actionsEn: ["Provide supplemental irrigation if rainfall ceases for 7 consecutive days."],
    actionsBn: ["টানা ৭ দিন বৃষ্টি না হলে সম্পূরক সেচ প্রদানের ব্যবস্থা রাখুন।"],
  },
  {
    id: "jute",
    name: "Tossa Jute (BJRI Tossa-8)",
    nameBn: "তোষা পাট (বিজেআরআই তোষা-৮)",
    category: "fibre",
    categoryName: "Cereals & Cash Crops",
    emoji: "🌿",
    season: "Kharif-1",
    seasonBn: "খরিপ-১ মৌসুম",
    durationDays: 120,
    waterNeed: "Medium",
    waterNeedBn: "মাঝারি পানি",
    avgProfitBdtAcre: 41000,
    summaryReasonEn: "Golden fibre replenishing 3-4 tons of organic matter per acre through fallen leaves.",
    summaryReasonBn: "মাটিতে প্রচুর পাতা ঝরিয়ে হেক্টরপ্রতি ৩-৪ টন জৈব পদার্থ যোগ করে জমির উর্বরতা বাড়ায়।",
    keyBadgeEn: "Soil Restorative",
    keyBadgeBn: "জৈব সার বৃদ্ধিকারী",
    optimalPh: [5.8, 7.4],
    phTolerance: [5.0, 8.2],
    toleratesSalinityMaxDsm: 2.5,
    optimalTextures: ["Sandy Loam", "Loam", "Clay Loam", "Silt Loam"],
    toleratedTextures: ["Silty Clay Loam"],
    optimalMoisturePct: [35, 60],
    toleratedDrainage: ["Well-drained", "Moderate"],
    minSoilDepthCm: 50,
    optimalNitrogenMin: 30,
    fixesNitrogen: false,
    optimalPMin: 14,
    optimalKMin: 0.22,
    minOrganicMatterPct: 1.2,
    risksEn: ["Waterlogging during young seedling stage (<20 days) stunts growth."],
    risksBn: ["চারা অবস্থায় (প্রথম ২০ দিন) জমিতে পানি জমলে চারার বৃদ্ধি স্থবির হয়ে যায়।"],
    actionsEn: ["Ensure clear drainage lines before the onset of pre-monsoon rains."],
    actionsBn: ["কালবৈশাখীর পূর্বে জমিতে ড্রেনেজ নালা কেটে পানি নিষ্কাশন নিশ্চিত করুন।"],
  },
  {
    id: "tomato",
    name: "Winter Tomato (BARI Tomato-14/15)",
    nameBn: "শীতকালীন টমেটো (বারি টমেটো-১৪/১৫)",
    category: "vegetable",
    categoryName: "Vegetables & Tubers",
    emoji: "🍅",
    season: "Rabi",
    seasonBn: "রবি মৌসুম",
    durationDays: 100,
    waterNeed: "Medium",
    waterNeedBn: "মাঝারি পানি",
    avgProfitBdtAcre: 85000,
    summaryReasonEn: "High-value commercial vegetable delivering top economic return on loamy soils with organic matter.",
    summaryReasonBn: "জৈব পদার্থসমৃদ্ধ দোআঁশ মাটিতে সবচেয়ে লাভজনক সবজি, স্থানীয় বাজারে উচ্চ চাহিদা।",
    keyBadgeEn: "Top Economic Value",
    keyBadgeBn: "সর্বোচ্চ লাভজনক সবজি",
    optimalPh: [6.0, 7.0],
    phTolerance: [5.5, 7.6],
    toleratesSalinityMaxDsm: 2.2,
    optimalTextures: ["Sandy Loam", "Loam", "Clay Loam", "Silt Loam"],
    toleratedTextures: ["Silty Clay Loam"],
    optimalMoisturePct: [32, 50],
    toleratedDrainage: ["Well-drained"],
    minSoilDepthCm: 45,
    optimalNitrogenMin: 40,
    fixesNitrogen: false,
    optimalPMin: 20,
    optimalKMin: 0.3,
    minOrganicMatterPct: 2.0,
    risksEn: ["Bacterial wilt and fruit borer infestation; sensitive to standing water."],
    risksBn: ["ব্যাকটেরিয়াল উইল্ট ও ফল ছিদ্রকারী পোকা; গোড়ায় পানি জমলে গাছ দ্রুত ঢলে পড়ে।"],
    actionsEn: ["Plant on raised beds with mulching sheet to conserve moisture and avoid splash blight."],
    actionsBn: ["মালচিং পেপার ব্যবহার করে উঁচু বেডে রোপণ করুন ও মাটির আর্দ্রতা ধরে রাখুন।"],
  },
  {
    id: "groundnut",
    name: "Groundnut (BARI Chinabadam-8)",
    nameBn: "চীনাবাদাম (বারি চিনাবাদাম-৮)",
    category: "oilseed",
    categoryName: "Oilseeds & Spices",
    emoji: "🥜",
    season: "Rabi / Char lands",
    seasonBn: "রবি / চরাঞ্চল",
    durationDays: 135,
    waterNeed: "Low",
    waterNeedBn: "কম পানি",
    avgProfitBdtAcre: 46000,
    summaryReasonEn: "Thrives in sandy and riverine char soils, fixing nitrogen and requiring minimal purchased inputs.",
    summaryReasonBn: "বেলে ও চরাঞ্চলের হালকা মাটিতে চমৎকার হয়, শিকড়ে নাইট্রোজেন সংবন্ধন করে খরচ কমায়।",
    keyBadgeEn: "Sand & Char Resilient",
    keyBadgeBn: "বেলে মাটির উপযোগী",
    optimalPh: [5.8, 7.2],
    phTolerance: [5.0, 8.0],
    toleratesSalinityMaxDsm: 2.2,
    optimalTextures: ["Sandy Loam", "Loam", "Silt Loam"],
    toleratedTextures: ["Clay Loam"],
    optimalMoisturePct: [20, 38],
    toleratedDrainage: ["Well-drained"],
    minSoilDepthCm: 40,
    optimalNitrogenMin: 15,
    fixesNitrogen: true,
    optimalPMin: 16,
    optimalKMin: 0.18,
    minOrganicMatterPct: 1.0,
    risksEn: ["Calcium deficiency causes hollow unfilled pods (pops)."],
    risksBn: ["মাটিতে ক্যালসিয়ামের অভাব থাকলে বাদামের খোসা ফাঁপা ও দানা অপুষ্ট থাকে।"],
    actionsEn: ["Apply gypsum (calcium sulphate) at flowering stage for solid pod development."],
    actionsBn: ["ফুল আসার সময় জমিতে জিপসাম (ক্যালসিয়াম সালফেট) প্রয়োগ করুন।"],
  },
  {
    id: "sunflower",
    name: "Sunflower (BARI Surjamukhi-2 / Hysun-33)",
    nameBn: "সূর্যমুখী (বারি সূর্যমুখী-২ / হাইসান-৩৩)",
    category: "oilseed",
    categoryName: "Oilseeds & Spices",
    emoji: "🌻",
    season: "Rabi / Coastal Belts",
    seasonBn: "রবি / উপকূলীয় অঞ্চল",
    durationDays: 95,
    waterNeed: "Low",
    waterNeedBn: "কম পানি",
    avgProfitBdtAcre: 48000,
    summaryReasonEn: "High oil-content seed with exceptional salinity tolerance (up to 5 dS/m) and deep taproot system.",
    summaryReasonBn: "উপকূলীয় লবণাক্ত মাটিতে (৫ ডিএস/মি পর্যন্ত) মানিয়ে নেওয়া তেলজাতীয় ফসল, শিকড় মাটির গভীর থেকে রস টানে।",
    keyBadgeEn: "Salinity Tolerant",
    keyBadgeBn: "লবণাক্ততা সহনশীল",
    optimalPh: [6.0, 7.8],
    phTolerance: [5.2, 8.5],
    toleratesSalinityMaxDsm: 5.5,
    optimalTextures: ["Loam", "Clay Loam", "Sandy Loam", "Silt Loam"],
    toleratedTextures: ["Silty Clay Loam"],
    optimalMoisturePct: [24, 45],
    toleratedDrainage: ["Well-drained", "Moderate"],
    minSoilDepthCm: 50,
    optimalNitrogenMin: 35,
    fixesNitrogen: false,
    optimalPMin: 15,
    optimalKMin: 0.22,
    minOrganicMatterPct: 1.2,
    risksEn: ["Parrot and bird damage during seed ripening stage."],
    risksBn: ["দানা পরিপক্ক হওয়ার সময় টিয়া ও দেশীয় পাখির আক্রমণ থেকে রক্ষা করা প্রয়োজন।"],
    actionsEn: ["Use reflective bird-scaring ribbons or nets during grain filling."],
    actionsBn: ["দানা গঠনের সময় জমিতে রিফ্লেক্টিভ চকচকে ফিতা টানিয়ে পাখি দূরে রাখুন।"],
  },
];

/**
 * Calculates dynamic suitability of all crops across 10 soil parameters
 */
export function evaluateCropsForSoil(soil: SoilProfile10): CropEvaluationResult[] {
  return CROPS_CATALOGUE.map((crop) => {
    // 1. Soil pH Evaluation
    let phScore = 100;
    let phStatus: "optimal" | "acceptable" | "suboptimal" = "optimal";
    if (soil.ph >= crop.optimalPh[0] && soil.ph <= crop.optimalPh[1]) {
      phScore = 100;
      phStatus = "optimal";
    } else if (soil.ph >= crop.phTolerance[0] && soil.ph <= crop.phTolerance[1]) {
      const dist = Math.min(Math.abs(soil.ph - crop.optimalPh[0]), Math.abs(soil.ph - crop.optimalPh[1]));
      phScore = Math.max(65, 95 - dist * 25);
      phStatus = "acceptable";
    } else {
      phScore = 40;
      phStatus = "suboptimal";
    }

    // 2. Nitrogen (N) Evaluation
    let nScore = 80;
    let nStatus: "optimal" | "acceptable" | "suboptimal" = "optimal";
    if (crop.fixesNitrogen) {
      // Legumes prefer lower to moderate N because they fix it and boost soil!
      if (soil.nitrogenKgHa <= 45) {
        nScore = 100;
        nStatus = "optimal";
      } else {
        nScore = 85;
        nStatus = "acceptable";
      }
    } else {
      if (soil.nitrogenKgHa >= crop.optimalNitrogenMin) {
        nScore = 95;
        nStatus = "optimal";
      } else if (soil.nitrogenKgHa >= crop.optimalNitrogenMin - 15) {
        nScore = 75;
        nStatus = "acceptable";
      } else {
        nScore = 55;
        nStatus = "suboptimal";
      }
    }

    // 3. Phosphorus (P) Evaluation
    let pScore = 85;
    let pStatus: "optimal" | "acceptable" | "suboptimal" = "optimal";
    if (soil.phosphorusPpm >= crop.optimalPMin) {
      pScore = 100;
      pStatus = "optimal";
    } else if (soil.phosphorusPpm >= crop.optimalPMin * 0.7) {
      pScore = 80;
      pStatus = "acceptable";
    } else {
      pScore = 55;
      pStatus = "suboptimal";
    }

    // 4. Potassium (K) Evaluation
    let kScore = 90;
    let kStatus: "optimal" | "acceptable" | "suboptimal" = "optimal";
    if (soil.potassiumMeq >= crop.optimalKMin) {
      kScore = 100;
      kStatus = "optimal";
    } else if (soil.potassiumMeq >= crop.optimalKMin * 0.75) {
      kScore = 80;
      kStatus = "acceptable";
    } else {
      kScore = 60;
      kStatus = "suboptimal";
    }

    // 5. Organic Matter (%)
    let omScore = 85;
    let omStatus: "optimal" | "acceptable" | "suboptimal" = "optimal";
    if (soil.organicMatterPct >= crop.minOrganicMatterPct) {
      omScore = 100;
      omStatus = "optimal";
    } else if (soil.organicMatterPct >= crop.minOrganicMatterPct * 0.75) {
      omScore = 80;
      omStatus = "acceptable";
    } else {
      omScore = 55;
      omStatus = "suboptimal";
    }

    // 6. Soil Texture Class
    let textScore = 70;
    let textStatus: "optimal" | "acceptable" | "suboptimal" = "suboptimal";
    if (crop.optimalTextures.includes(soil.textureClass)) {
      textScore = 100;
      textStatus = "optimal";
    } else if (crop.toleratedTextures.includes(soil.textureClass)) {
      textScore = 82;
      textStatus = "acceptable";
    } else {
      textScore = 50;
      textStatus = "suboptimal";
    }

    // 7. Soil Salinity (ECe dS/m)
    let salScore = 95;
    let salStatus: "optimal" | "acceptable" | "suboptimal" = "optimal";
    if (soil.salinityDsm <= crop.toleratesSalinityMaxDsm * 0.6) {
      salScore = 100;
      salStatus = "optimal";
    } else if (soil.salinityDsm <= crop.toleratesSalinityMaxDsm) {
      salScore = 75;
      salStatus = "acceptable";
    } else {
      salScore = 30; // Severe salinity damage
      salStatus = "suboptimal";
    }

    // 8. Soil Moisture (Root zone NASA SMAP)
    let moistScore = 85;
    let moistStatus: "optimal" | "acceptable" | "suboptimal" = "optimal";
    if (soil.moisturePct >= crop.optimalMoisturePct[0] && soil.moisturePct <= crop.optimalMoisturePct[1]) {
      moistScore = 100;
      moistStatus = "optimal";
    } else {
      const dist = Math.min(
        Math.abs(soil.moisturePct - crop.optimalMoisturePct[0]),
        Math.abs(soil.moisturePct - crop.optimalMoisturePct[1])
      );
      moistScore = Math.max(45, 95 - dist * 3);
      moistStatus = dist <= 12 ? "acceptable" : "suboptimal";
    }

    // 9. Soil Drainage
    let drainScore = 60;
    let drainStatus: "optimal" | "acceptable" | "suboptimal" = "suboptimal";
    if (crop.toleratedDrainage.includes(soil.drainage)) {
      drainScore = crop.toleratedDrainage[0] === soil.drainage ? 100 : 85;
      drainStatus = crop.toleratedDrainage[0] === soil.drainage ? "optimal" : "acceptable";
    } else {
      drainScore = 35;
      drainStatus = "suboptimal";
    }

    // 10. Soil Depth (cm)
    let depthScore = 85;
    let depthStatus: "optimal" | "acceptable" | "suboptimal" = "optimal";
    if (soil.soilDepthCm >= crop.minSoilDepthCm) {
      depthScore = 100;
      depthStatus = "optimal";
    } else {
      const deficit = crop.minSoilDepthCm - soil.soilDepthCm;
      depthScore = Math.max(40, 90 - deficit * 2.5);
      depthStatus = deficit <= 10 ? "acceptable" : "suboptimal";
    }

    // Weighted Overall Multi-Criteria Score
    // Weights: pH (12%), N (12%), P (8%), K (8%), OM (8%), Texture (15%), Salinity (15%), Moisture (10%), Drainage (7%), Depth (5%)
    const weighted =
      phScore * 0.12 +
      nScore * 0.12 +
      pScore * 0.08 +
      kScore * 0.08 +
      omScore * 0.08 +
      textScore * 0.15 +
      salScore * 0.15 +
      moistScore * 0.1 +
      drainScore * 0.07 +
      depthScore * 0.05;

    const overallScore = Math.round(Math.min(99, Math.max(30, weighted)));

    return {
      id: crop.id,
      name: crop.name,
      nameBn: crop.nameBn,
      category: crop.category,
      categoryName: crop.categoryName,
      emoji: crop.emoji,
      overallScore,
      waterNeed: crop.waterNeed,
      waterNeedBn: crop.waterNeedBn,
      durationDays: crop.durationDays,
      season: crop.season,
      seasonBn: crop.seasonBn,
      avgProfitBdtAcre: crop.avgProfitBdtAcre,
      summaryReasonEn: crop.summaryReasonEn,
      summaryReasonBn: crop.summaryReasonBn,
      keyBadgeEn: crop.keyBadgeEn,
      keyBadgeBn: crop.keyBadgeBn,
      parameterScores: {
        ph: {
          score: Math.round(phScore),
          status: phStatus,
          value: `pH ${soil.ph.toFixed(1)}`,
          optimalRange: `${crop.optimalPh[0]} - ${crop.optimalPh[1]}`,
        },
        nitrogen: {
          score: Math.round(nScore),
          status: nStatus,
          value: `${soil.nitrogenKgHa} kg/ha`,
          optimalRange: crop.fixesNitrogen ? "Fixes N (+45)" : `≥ ${crop.optimalNitrogenMin} kg/ha`,
        },
        phosphorus: {
          score: Math.round(pScore),
          status: pStatus,
          value: `${soil.phosphorusPpm.toFixed(1)} ppm`,
          optimalRange: `≥ ${crop.optimalPMin} ppm`,
        },
        potassium: {
          score: Math.round(kScore),
          status: kStatus,
          value: `${soil.potassiumMeq.toFixed(2)} meq`,
          optimalRange: `≥ ${crop.optimalKMin} meq`,
        },
        organicMatter: {
          score: Math.round(omScore),
          status: omStatus,
          value: `${soil.organicMatterPct.toFixed(1)}%`,
          optimalRange: `≥ ${crop.minOrganicMatterPct}%`,
        },
        texture: {
          score: Math.round(textScore),
          status: textStatus,
          value: `${soil.textureClass} (${soil.sandPct}S/${soil.siltPct}Si/${soil.clayPct}C)`,
          optimalRange: crop.optimalTextures.slice(0, 2).join(", "),
        },
        salinity: {
          score: Math.round(salScore),
          status: salStatus,
          value: `${soil.salinityDsm.toFixed(1)} dS/m`,
          optimalRange: `≤ ${crop.toleratesSalinityMaxDsm} dS/m`,
        },
        moisture: {
          score: Math.round(moistScore),
          status: moistStatus,
          value: `${soil.moisturePct}% (SMAP)`,
          optimalRange: `${crop.optimalMoisturePct[0]}-${crop.optimalMoisturePct[1]}%`,
        },
        drainage: {
          score: Math.round(drainScore),
          status: drainStatus,
          value: soil.drainage,
          optimalRange: crop.toleratedDrainage.join(", "),
        },
        soilDepth: {
          score: Math.round(depthScore),
          status: depthStatus,
          value: `${soil.soilDepthCm} cm`,
          optimalRange: `≥ ${crop.minSoilDepthCm} cm`,
        },
      },
      risksEn: crop.risksEn,
      risksBn: crop.risksBn,
      actionsEn: crop.actionsEn,
      actionsBn: crop.actionsBn,
    };
  }).sort((a, b) => b.overallScore - a.overallScore);
}
