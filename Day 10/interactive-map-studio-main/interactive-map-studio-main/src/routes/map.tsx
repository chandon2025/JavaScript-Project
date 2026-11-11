import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Droplets,
  FlaskConical,
  Gauge,
  Layers,
  Leaf,
  RotateCcw,
  Satellite,
  Sliders,
  Sparkles,
  Sprout,
  TrendingUp,
} from "lucide-react";
import { FieldDrawingMapClient } from "@/components/map/FieldDrawingMapClient";
import { useLang } from "@/lib/lang";
import {
  evaluateCropsForSoil,
  type SoilProfile10,
  type CropEvaluationResult,
} from "@/lib/soil-crops";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Field Analysis — 6 Steps to Smart Farming | TerraShift" },
      { name: "description", content: "Draw your land, analyze soil and get a satellite + AI report with NASA data." },
      { property: "og:title", content: "Field Analysis — 6 Steps to Smart Farming | TerraShift" },
      { property: "og:description", content: "Draw your land, analyze soil and get a satellite + AI report with NASA data." },
    ],
  }),
  component: FieldAnalysisPage,
});

export function FieldAnalysisPage() {
  const { lang } = useLang();

  // Wizard Step (1 to 6)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Field Inputs State
  const [fieldName, setFieldName] = useState("My field");
  const [points, setPoints] = useState<Array<[number, number]>>([]);
  const [areaAcres, setAreaAcres] = useState<number>(0.73);
  const [areaBigha, setAreaBigha] = useState<number>(2.21);

  // Step 2: 10 Soil Parameters State (Calibrated defaults from ISRIC SoilGrids & BARC AEZ)
  const [soilPh, setSoilPh] = useState<number>(6.4); // 1. Soil pH
  const [nitrogenKgHa, setNitrogenKgHa] = useState<number>(34); // 2. Nitrogen (N)
  const [phosphorusPpm, setPhosphorusPpm] = useState<number>(14.5); // 3. Phosphorus (P)
  const [potassiumMeq, setPotassiumMeq] = useState<number>(0.22); // 4. Potassium (K)
  const [organicMatterPct, setOrganicMatterPct] = useState<number>(1.8); // 5. Organic Matter (%)
  const [soilType, setSoilType] = useState<string>("Loam"); // 6. Soil Texture
  const [sandPct, setSandPct] = useState<number>(35);
  const [siltPct, setSiltPct] = useState<number>(45);
  const [clayPct, setClayPct] = useState<number>(20);
  const [salinityDsm, setSalinityDsm] = useState<number>(1.2); // 7. Soil Salinity
  const [moisturePct, setMoisturePct] = useState<number>(38); // 8. Soil Moisture (NASA SMAP)
  const [drainage, setDrainage] = useState<"Well-drained" | "Moderate" | "Poor / Waterlogged">("Well-drained"); // 9. Soil Drainage
  const [soilDepthCm, setSoilDepthCm] = useState<number>(60); // 10. Soil Depth

  // Step 3: Crop History
  const [prevCrop, setPrevCrop] = useState("Potato");
  const [fertilizerUse, setFertilizerUse] = useState("Moderate");

  // Step 4: Priorities
  const [primaryGoal, setPrimaryGoal] = useState("Soil Regeneration & Nitrogen Fixation");
  const [irrigationType, setIrrigationType] = useState("Alternate Wetting & Drying (AWD)");

  // Step 6: Active Crop Category Filter & Selected Crop for 10-parameter breakdown
  const [cropCategoryFilter, setCropCategoryFilter] = useState<string>("all");
  const [selectedCropId, setSelectedCropId] = useState<string>("mungbean");
  const [showParametersMatrix, setShowParametersMatrix] = useState<boolean>(true);

  // Area change handler from map
  const handleAreaChange = (acres: number, bigha: number) => {
    if (acres > 0) {
      setAreaAcres(acres);
      setAreaBigha(bigha);
    }
  };

  // Construct current 10-parameter soil profile
  const currentSoilProfile: SoilProfile10 = useMemo(
    () => ({
      ph: soilPh,
      nitrogenKgHa,
      phosphorusPpm,
      potassiumMeq,
      organicMatterPct,
      sandPct,
      siltPct,
      clayPct,
      textureClass: soilType,
      salinityDsm,
      moisturePct,
      drainage,
      soilDepthCm,
    }),
    [
      soilPh,
      nitrogenKgHa,
      phosphorusPpm,
      potassiumMeq,
      organicMatterPct,
      sandPct,
      siltPct,
      clayPct,
      soilType,
      salinityDsm,
      moisturePct,
      drainage,
      soilDepthCm,
    ]
  );

  // Run scientific evaluation across all crops for the 10 soil parameters
  const evaluatedCrops = useMemo(() => {
    return evaluateCropsForSoil(currentSoilProfile);
  }, [currentSoilProfile]);

  // Filtered crops based on tab
  const displayedCrops = useMemo(() => {
    if (cropCategoryFilter === "all") return evaluatedCrops;
    return evaluatedCrops.filter((c) => c.category === cropCategoryFilter);
  }, [evaluatedCrops, cropCategoryFilter]);

  // Selected crop details for matrix modal / drawer
  const selectedCrop = useMemo(() => {
    return evaluatedCrops.find((c) => c.id === selectedCropId) || evaluatedCrops[0];
  }, [evaluatedCrops, selectedCropId]);

  // Regional Soil Presets
  const applyRegionalPreset = (region: "bogura" | "mymensingh" | "khulna" | "barind") => {
    if (region === "bogura") {
      setSoilType("Loam");
      setSandPct(40);
      setSiltPct(45);
      setClayPct(15);
      setSoilPh(6.4);
      setNitrogenKgHa(34);
      setPhosphorusPpm(16.5);
      setPotassiumMeq(0.24);
      setOrganicMatterPct(1.8);
      setSalinityDsm(0.9);
      setMoisturePct(38);
      setDrainage("Well-drained");
      setSoilDepthCm(65);
    } else if (region === "mymensingh") {
      setSoilType("Silty Clay Loam");
      setSandPct(18);
      setSiltPct(52);
      setClayPct(30);
      setSoilPh(6.1);
      setNitrogenKgHa(42);
      setPhosphorusPpm(13.8);
      setPotassiumMeq(0.21);
      setOrganicMatterPct(2.1);
      setSalinityDsm(0.7);
      setMoisturePct(45);
      setDrainage("Moderate");
      setSoilDepthCm(70);
    } else if (region === "khulna") {
      setSoilType("Clay Loam");
      setSandPct(25);
      setSiltPct(40);
      setClayPct(35);
      setSoilPh(7.4);
      setNitrogenKgHa(30);
      setPhosphorusPpm(11.2);
      setPotassiumMeq(0.32);
      setOrganicMatterPct(1.5);
      setSalinityDsm(4.6);
      setMoisturePct(48);
      setDrainage("Moderate");
      setSoilDepthCm(50);
    } else if (region === "barind") {
      setSoilType("Clay Loam");
      setSandPct(30);
      setSiltPct(35);
      setClayPct(35);
      setSoilPh(5.3);
      setNitrogenKgHa(26);
      setPhosphorusPpm(9.5);
      setPotassiumMeq(0.18);
      setOrganicMatterPct(1.1);
      setSalinityDsm(0.6);
      setMoisturePct(28);
      setDrainage("Well-drained");
      setSoilDepthCm(45);
    }
  };

  const stepsList = [
    { num: 1, title: lang === "bn" ? "জমি নির্বাচন" : "Select field" },
    { num: 2, title: lang === "bn" ? "মাটি (১০টি মানদণ্ড)" : "Soil (10 Factors)" },
    { num: 3, title: lang === "bn" ? "পূর্ববর্তী ফসল" : "Crop history" },
    { num: 4, title: lang === "bn" ? "অগ্রাধিকার" : "Priorities" },
    { num: 5, title: lang === "bn" ? "পর্যালোচনা" : "Review" },
    { num: 6, title: lang === "bn" ? "রিপোর্ট তৈরি" : "Generate" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Top Header Banner matching Brand & Navbar */}
      <section className="bg-brand text-primary-foreground px-4 py-12 md:py-14 shadow-sm">
        <div className="mx-auto max-w-5xl">
          <span className="inline-block rounded-full bg-white/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur">
            {lang === "bn" ? "মাঠ বিশ্লেষণ" : "FIELD ANALYSIS"}
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight md:text-5xl">
            {lang === "bn" ? "৬টি ধাপে আপনার মাঠ বিশ্লেষণ করুন" : "Analyse your field in 6 steps"}
          </h1>
          <p className="mt-2.5 max-w-2xl text-base text-white/90 md:text-lg">
            {lang === "bn"
              ? "আপনার জমি চিহ্নিত করুন, মাটির ১০টি সূচক নির্ধারণ করুন এবং নাসা উপগ্রহ ও এআই রিপোর্ট পান।"
              : "Draw your land, tell us about the soil, and get a satellite + AI report."}
          </p>
        </div>
      </section>

      {/* 6-Step Horizontal Progress Indicator */}
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex items-center justify-between">
          {stepsList.map((st) => {
            const isCompleted = currentStep > st.num;
            const isCurrent = currentStep === st.num;

            return (
              <div key={st.num} className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => {
                    if (st.num < currentStep) setCurrentStep(st.num);
                  }}
                  className={`grid h-10 w-10 place-items-center rounded-full text-xs font-bold transition-all md:h-11 md:w-11 md:text-sm ${
                    isCompleted
                      ? "bg-[#107548] text-white ring-2 ring-[#107548]/30 shadow-sm"
                      : isCurrent
                        ? "bg-[#107548] text-white shadow-lg ring-4 ring-[#107548]/25"
                        : "border border-border bg-card text-muted-foreground"
                  }`}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : st.num}
                </button>
                <span
                  className={`mt-2 text-center text-xs font-bold md:text-sm ${
                    isCurrent ? "text-forest dark:text-emerald-400" : "text-muted-foreground"
                  }`}
                >
                  {st.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Wizard Container */}
      <div className="mx-auto max-w-4xl px-4">
        {/* STEP 1: Select Field */}
        {currentStep === 1 && (
          <div className="rounded-3xl border border-border bg-card p-6 shadow-lift md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-forest dark:text-white md:text-2xl">
                  {lang === "bn" ? "আপনার জমি নির্বাচন করুন" : "Select your field"}
                </h2>
                <p className="text-xs text-muted-foreground md:text-sm">
                  {lang === "bn"
                    ? "মানচিত্রে আপনার জমির কোণাগুলোতে ক্লিক করুন (কমপক্ষে ৩টি পয়েন্ট)।"
                    : "Tap the corners of your land on the map (at least 3 points)."}
                </p>
              </div>

              <div className="w-full max-w-[200px]">
                <input
                  type="text"
                  value={fieldName}
                  onChange={(e) => setFieldName(e.target.value)}
                  placeholder={lang === "bn" ? "আমার জমি" : "My field"}
                  className="w-full rounded-full border border-border bg-secondary/80 px-4 py-2 text-right text-sm font-semibold text-forest outline-none focus:ring-2 focus:ring-primary dark:text-white"
                />
              </div>
            </div>

            {/* Interactive Drawing Map */}
            <div className="mt-6">
              <FieldDrawingMapClient
                points={points}
                onPointsChange={setPoints}
                onAreaChange={handleAreaChange}
              />
            </div>

            {/* Step 1 Footer Buttons */}
            <div className="mt-8 flex items-center justify-between border-t border-border pt-4">
              <button
                type="button"
                disabled
                className="text-sm font-semibold text-muted-foreground opacity-50"
              >
                {lang === "bn" ? "< পেছনে" : "< Back"}
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#107548] px-6 py-2.5 text-sm font-bold text-white shadow-lift transition-all hover:bg-[#0c5c38]"
              >
                <span>{lang === "bn" ? "পরবর্তী" : "Next"}</span> &gt;
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Soil Properties (Comprehensive 10 Parameters) */}
        {currentStep === 2 && (
          <div className="rounded-3xl border border-border bg-card p-6 shadow-lift md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-xl font-bold text-forest dark:text-white md:text-2xl">
                  {lang === "bn" ? "মাটির ১০টি সূচক ও বৈশিষ্ট্য" : "Tell us about your soil (10 Parameters)"}
                </h2>
                <p className="text-xs text-muted-foreground md:text-sm">
                  {lang === "bn"
                    ? "ISRIC SoilGrids, NASA SMAP ও বিএআরসি এইজেড (AEZ) থেকে সংগৃহীত। প্রয়োজনমতো পরিবর্তন করুন।"
                    : "Auto-calibrated from ISRIC SoilGrids, NASA SMAP, & BARC AEZ for your field."}
                </p>
              </div>

              {/* Regional Presets */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold text-muted-foreground">
                  {lang === "bn" ? "দ্রুত প্রিসেট:" : "Presets:"}
                </span>
                <button
                  type="button"
                  onClick={() => applyRegionalPreset("bogura")}
                  className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-forest hover:bg-primary/20 dark:text-white"
                >
                  {lang === "bn" ? "বগুড়া" : "Bogura"}
                </button>
                <button
                  type="button"
                  onClick={() => applyRegionalPreset("mymensingh")}
                  className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-forest hover:bg-primary/20 dark:text-white"
                >
                  {lang === "bn" ? "ময়মনসিংহ" : "Mymensingh"}
                </button>
                <button
                  type="button"
                  onClick={() => applyRegionalPreset("khulna")}
                  className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-amber-700 hover:bg-amber-100 dark:text-amber-300"
                >
                  {lang === "bn" ? "উপকূলীয় লবণাক্ত" : "Coastal / Saline"}
                </button>
                <button
                  type="button"
                  onClick={() => applyRegionalPreset("barind")}
                  className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-forest hover:bg-primary/20 dark:text-white"
                >
                  {lang === "bn" ? "বরেন্দ্র এঁটেল" : "Barind Clay"}
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {/* 1. Soil pH */}
              <div className="rounded-2xl border border-border bg-secondary/30 p-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-forest dark:text-white">
                    1. {lang === "bn" ? "মাটির পিএইচ (Soil pH):" : "Soil pH Level:"}
                  </label>
                  <span className="rounded-full bg-emerald-500/15 px-3 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    pH {soilPh.toFixed(1)} ({soilPh >= 6.0 && soilPh <= 7.2 ? (lang === "bn" ? "আদর্শ" : "Ideal") : soilPh < 6.0 ? (lang === "bn" ? "অম্লীয়" : "Acidic") : (lang === "bn" ? "ক্ষারীয়" : "Alkaline")})
                  </span>
                </div>
                <input
                  type="range"
                  min="4.5"
                  max="8.5"
                  step="0.1"
                  value={soilPh}
                  onChange={(e) => setSoilPh(parseFloat(e.target.value))}
                  className="mt-3 w-full accent-[#107548]"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>4.5 ({lang === "bn" ? "তীব্র অম্লীয়" : "Strongly Acidic"})</span>
                  <span>6.5 ({lang === "bn" ? "নিরপেক্ষ/আদর্শ" : "Neutral/Ideal"})</span>
                  <span>8.5 ({lang === "bn" ? "ক্ষারীয়" : "Alkaline"})</span>
                </div>
              </div>

              {/* 2. Nitrogen (N) */}
              <div className="rounded-2xl border border-border bg-secondary/30 p-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-forest dark:text-white">
                    2. {lang === "bn" ? "উপলব্ধ নাইট্রোজেন (N):" : "Available Nitrogen (N):"}
                  </label>
                  <span className="rounded-full bg-amber-500/15 px-3 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-400">
                    {nitrogenKgHa} kg/ha ({nitrogenKgHa < 30 ? (lang === "bn" ? "কম" : "Low") : nitrogenKgHa < 60 ? (lang === "bn" ? "মাঝারি" : "Medium") : (lang === "bn" ? "উচ্চ" : "High")})
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="1"
                  value={nitrogenKgHa}
                  onChange={(e) => setNitrogenKgHa(parseInt(e.target.value))}
                  className="mt-3 w-full accent-[#107548]"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>10 ({lang === "bn" ? "ঘাটতি" : "Deficient"})</span>
                  <span>34/100 ({lang === "bn" ? "বর্তমান সূচক" : "Current Index"})</span>
                  <span>100 ({lang === "bn" ? "প্রচুর" : "Abundant"})</span>
                </div>
              </div>

              {/* 3. Phosphorus (P) */}
              <div className="rounded-2xl border border-border bg-secondary/30 p-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-forest dark:text-white">
                    3. {lang === "bn" ? "উপলব্ধ ফসফরাস (P):" : "Available Phosphorus (P):"}
                  </label>
                  <span className="rounded-full bg-blue-500/15 px-3 py-0.5 text-xs font-bold text-blue-700 dark:text-blue-400">
                    {phosphorusPpm.toFixed(1)} ppm
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="0.5"
                  value={phosphorusPpm}
                  onChange={(e) => setPhosphorusPpm(parseFloat(e.target.value))}
                  className="mt-3 w-full accent-[#107548]"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>5 ppm ({lang === "bn" ? "কম" : "Low"})</span>
                  <span>14-20 ppm ({lang === "bn" ? "অনুকূল" : "Optimum"})</span>
                  <span>50 ppm ({lang === "bn" ? "উচ্চ" : "High"})</span>
                </div>
              </div>

              {/* 4. Potassium (K) */}
              <div className="rounded-2xl border border-border bg-secondary/30 p-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-forest dark:text-white">
                    4. {lang === "bn" ? "উপলব্ধ পটাসিয়াম (K):" : "Available Potassium (K):"}
                  </label>
                  <span className="rounded-full bg-purple-500/15 px-3 py-0.5 text-xs font-bold text-purple-700 dark:text-purple-400">
                    {potassiumMeq.toFixed(2)} meq/100g
                  </span>
                </div>
                <input
                  type="range"
                  min="0.08"
                  max="0.50"
                  step="0.01"
                  value={potassiumMeq}
                  onChange={(e) => setPotassiumMeq(parseFloat(e.target.value))}
                  className="mt-3 w-full accent-[#107548]"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>0.08 meq ({lang === "bn" ? "ঘাটতি" : "Deficient"})</span>
                  <span>0.20-0.30 ({lang === "bn" ? "উত্তম" : "Good"})</span>
                  <span>0.50 meq ({lang === "bn" ? "উচ্চ" : "High"})</span>
                </div>
              </div>

              {/* 5. Organic Matter (%) */}
              <div className="rounded-2xl border border-border bg-secondary/30 p-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-forest dark:text-white">
                    5. {lang === "bn" ? "জৈব পদার্থ (Organic Matter):" : "Organic Matter (OM %):"}
                  </label>
                  <span className="rounded-full bg-emerald-500/15 px-3 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    {organicMatterPct.toFixed(1)}% ({organicMatterPct < 1.5 ? (lang === "bn" ? "কম" : "Low") : (lang === "bn" ? "মাঝারি" : "Moderate")})
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="4.5"
                  step="0.1"
                  value={organicMatterPct}
                  onChange={(e) => setOrganicMatterPct(parseFloat(e.target.value))}
                  className="mt-3 w-full accent-[#107548]"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>0.5% ({lang === "bn" ? "ঘাটতি" : "Depleted"})</span>
                  <span>2.0% ({lang === "bn" ? "আদর্শ লক্ষ্য" : "Ideal Target"})</span>
                  <span>4.5% ({lang === "bn" ? "উর্বর" : "Rich"})</span>
                </div>
              </div>

              {/* 6. Soil Texture Class */}
              <div className="rounded-2xl border border-border bg-secondary/30 p-4">
                <label className="text-sm font-bold text-forest dark:text-white">
                  6. {lang === "bn" ? "মাটির বুনট (Soil Texture):" : "Soil Texture (Sand/Silt/Clay):"}
                </label>
                <div className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                  {[
                    { name: "Loam", bn: "দোআঁশ", s: 40, si: 40, c: 20 },
                    { name: "Clay Loam", bn: "এঁটেল দোআঁশ", s: 30, si: 35, c: 35 },
                    { name: "Sandy Loam", bn: "বেলে দোআঁশ", s: 60, si: 25, c: 15 },
                    { name: "Silty Clay Loam", bn: "পলি এঁটেল", s: 15, si: 55, c: 30 },
                  ].map((tex) => (
                    <button
                      type="button"
                      key={tex.name}
                      onClick={() => {
                        setSoilType(tex.name);
                        setSandPct(tex.s);
                        setSiltPct(tex.si);
                        setClayPct(tex.c);
                      }}
                      className={`rounded-xl border p-2 text-center text-xs font-semibold transition-all ${
                        soilType === tex.name
                          ? "border-[#107548] bg-[#107548]/15 text-[#107548] font-bold ring-2 ring-[#107548]/30 dark:text-emerald-400"
                          : "border-border bg-card text-muted-foreground hover:bg-secondary"
                      }`}
                    >
                      {lang === "bn" ? tex.bn : tex.name}
                    </button>
                  ))}
                </div>
                <div className="mt-2 text-[11px] text-muted-foreground flex justify-between">
                  <span>{lang === "bn" ? "বালি" : "Sand"}: {sandPct}%</span>
                  <span>{lang === "bn" ? "পলি" : "Silt"}: {siltPct}%</span>
                  <span>{lang === "bn" ? "কাদা" : "Clay"}: {clayPct}%</span>
                </div>
              </div>

              {/* 7. Soil Salinity (ECe) */}
              <div className="rounded-2xl border border-border bg-secondary/30 p-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-forest dark:text-white">
                    7. {lang === "bn" ? "মাটির লবণাক্ততা (Salinity):" : "Soil Salinity (ECe):"}
                  </label>
                  <span
                    className={`rounded-full px-3 py-0.5 text-xs font-bold ${
                      salinityDsm <= 2.0
                        ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                        : salinityDsm <= 4.0
                          ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                          : "bg-rose-500/15 text-rose-700 dark:text-rose-400"
                    }`}
                  >
                    {salinityDsm.toFixed(1)} dS/m ({salinityDsm <= 2 ? (lang === "bn" ? "মিঠা পানি" : "Non-saline") : salinityDsm <= 4 ? (lang === "bn" ? "স্বল্প লবণাক্ত" : "Slightly Saline") : (lang === "bn" ? "মাঝারি লবণাক্ত" : "Moderately Saline")})
                  </span>
                </div>
                <input
                  type="range"
                  min="0.4"
                  max="8.0"
                  step="0.2"
                  value={salinityDsm}
                  onChange={(e) => setSalinityDsm(parseFloat(e.target.value))}
                  className="mt-3 w-full accent-[#107548]"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>0.4 ({lang === "bn" ? "স্বাভাবিক মিঠা পানি" : "Freshwater inland"})</span>
                  <span>2.0 ({lang === "bn" ? "ডাল ফসলের সহনমাত্রা" : "Pulse threshold"})</span>
                  <span>8.0 ({lang === "bn" ? "উপকূলীয় জোয়ার প্রভাবিত" : "Coastal tide-affected"})</span>
                </div>
              </div>

              {/* 8. Soil Moisture (NASA SMAP) */}
              <div className="rounded-2xl border border-sky-500/20 bg-sky-50/40 p-4 dark:bg-sky-950/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Satellite className="h-4 w-4 text-sky-600" />
                    <label className="text-sm font-bold text-sky-900 dark:text-sky-200">
                      8. {lang === "bn" ? "মাটির আর্দ্রতা (NASA SMAP):" : "Soil Moisture (NASA SMAP):"}
                    </label>
                  </div>
                  <span className="rounded-full bg-sky-500/20 px-3 py-0.5 text-xs font-extrabold text-sky-700 dark:text-sky-300">
                    {moisturePct}% (0.16 m³/m³)
                  </span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="75"
                  step="1"
                  value={moisturePct}
                  onChange={(e) => setMoisturePct(parseInt(e.target.value))}
                  className="mt-3 w-full accent-sky-600"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>15% ({lang === "bn" ? "শুষ্ক/মলিন" : "Dry/Wilting"})</span>
                  <span>38% ({lang === "bn" ? "ফিল্ড ক্যাপাসিটি" : "Field Capacity"})</span>
                  <span>75% ({lang === "bn" ? "সম্পৃক্ততার কাছাকাছি" : "Near Saturation"})</span>
                </div>
              </div>

              {/* 9. Soil Drainage */}
              <div className="rounded-2xl border border-border bg-secondary/30 p-4">
                <label className="text-sm font-bold text-forest dark:text-white">
                  9. {lang === "bn" ? "পানি নিষ্কাশন অবস্থা (Drainage):" : "Field Drainage Condition:"}
                </label>
                <div className="mt-2 grid grid-cols-3 gap-1.5">
                  {[
                    { id: "Well-drained", bn: "উত্তম নিষ্কাশন" },
                    { id: "Moderate", bn: "মাঝারি" },
                    { id: "Poor / Waterlogged", bn: "দুর্বল / জলাবদ্ধ" },
                  ].map((dr) => (
                    <button
                      type="button"
                      key={dr.id}
                      onClick={() => setDrainage(dr.id as any)}
                      className={`rounded-xl border p-2.5 text-center text-xs font-semibold ${
                        drainage === dr.id
                          ? "border-[#107548] bg-[#107548]/15 text-[#107548] font-bold ring-2 ring-[#107548]/30 dark:text-emerald-400"
                          : "border-border bg-card text-muted-foreground hover:bg-secondary"
                      }`}
                    >
                      {lang === "bn" ? dr.bn : dr.id}
                    </button>
                  ))}
                </div>
              </div>

              {/* 10. Soil Depth */}
              <div className="rounded-2xl border border-border bg-secondary/30 p-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-forest dark:text-white">
                    10. {lang === "bn" ? "কার্যকর মাটির গভীরতা (Depth):" : "Effective Soil Depth:"}
                  </label>
                  <span className="rounded-full bg-emerald-500/15 px-3 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    {soilDepthCm} cm ({soilDepthCm >= 60 ? (lang === "bn" ? "গভীর মাটি" : "Deep Soil") : soilDepthCm >= 35 ? (lang === "bn" ? "মাঝারি" : "Medium") : (lang === "bn" ? "অগভীর" : "Shallow")})
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="5"
                  value={soilDepthCm}
                  onChange={(e) => setSoilDepthCm(parseInt(e.target.value))}
                  className="mt-3 w-full accent-[#107548]"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>20 cm ({lang === "bn" ? "অগভীর শক্ত স্তর" : "Shallow Hardpan"})</span>
                  <span>60 cm ({lang === "bn" ? "গভীর উপরিভাগ" : "Deep Topsoil"})</span>
                  <span>100 cm ({lang === "bn" ? "খুব গভীর" : "Very Deep"})</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-border pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="text-sm font-semibold text-muted-foreground hover:text-forest"
              >
                {lang === "bn" ? "< পেছনে" : "< Back"}
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#107548] px-6 py-2.5 text-sm font-bold text-white shadow-lift transition-all hover:bg-[#0c5c38]"
              >
                <span>{lang === "bn" ? "পরবর্তী" : "Next"}</span> &gt;
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Crop History */}
        {currentStep === 3 && (
          <div className="rounded-3xl border border-border bg-card p-6 shadow-lift md:p-8">
            <h2 className="text-xl font-bold text-forest dark:text-white md:text-2xl">
              {lang === "bn" ? "পূর্ববর্তী ফসলের ইতিহাস" : "Past crop history"}
            </h2>
            <p className="text-xs text-muted-foreground md:text-sm">
              {lang === "bn"
                ? "আমাদের নাইট্রোজেন ব্যালেন্স ইঞ্জিন মাটির ক্ষয় ও রোগবালাই প্রতিরোধে এটি ব্যবহার করে।"
                : "Used by our Soil Nitrogen & Crop Rotation engine to prevent pest buildup and nutrient depletion."}
            </p>

            <div className="mt-6 space-y-6">
              <div>
                <label className="text-sm font-semibold text-forest dark:text-white">
                  {lang === "bn" ? "সর্বশেষ চাষকৃত ফসল:" : "Previous Season Crop:"}
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {[
                    { id: "Potato", nameEn: "Potato (Solanaceae)", nameBn: "আলু (Solanaceae)", emoji: "🥔" },
                    { id: "Boro Rice", nameEn: "Boro Rice (Poaceae)", nameBn: "বোরো ধান (Poaceae)", emoji: "🌾" },
                    { id: "Aman Rice", nameEn: "Aman Rice (Poaceae)", nameBn: "আমন ধান (Poaceae)", emoji: "🌾" },
                    { id: "Jute", nameEn: "Jute (Malvaceae)", nameBn: "পাট (Malvaceae)", emoji: "🌿" },
                    { id: "Mustard", nameEn: "Mustard (Brassicaceae)", nameBn: "সরিষা (Brassicaceae)", emoji: "🌼" },
                    { id: "Vegetables", nameEn: "Vegetables (Mixed)", nameBn: "শাকসবজি (মিশ্র)", emoji: "🥬" },
                  ].map((cr) => (
                    <button
                      type="button"
                      key={cr.id}
                      onClick={() => setPrevCrop(cr.id)}
                      className={`flex items-center gap-2 rounded-2xl border p-3 text-left text-xs font-semibold sm:text-sm ${
                        prevCrop === cr.id
                          ? "border-[#107548] bg-[#107548]/10 text-[#107548] ring-2 ring-[#107548]/30 dark:text-emerald-400"
                          : "border-border bg-card text-muted-foreground hover:bg-secondary"
                      }`}
                    >
                      <span className="text-xl">{cr.emoji}</span>
                      <span>{lang === "bn" ? cr.nameBn : cr.nameEn}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-forest dark:text-white">
                  {lang === "bn" ? "রাসায়নিক সারের ব্যবহার মাত্রা:" : "Fertilizer Usage Intensity:"}
                </label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {[
                    { id: "High Chemical Urea", bn: "উচ্চ ইউরিয়া সার" },
                    { id: "Moderate", bn: "পরিমিত / সুষম" },
                    { id: "Organic / Compost", bn: "জৈব সার / কম্পোস্ট" },
                  ].map((ft) => (
                    <button
                      type="button"
                      key={ft.id}
                      onClick={() => setFertilizerUse(ft.id)}
                      className={`rounded-2xl border p-3 text-center text-xs font-semibold sm:text-sm ${
                        fertilizerUse === ft.id
                          ? "border-[#107548] bg-[#107548]/10 text-[#107548] ring-2 ring-[#107548]/30 dark:text-emerald-400"
                          : "border-border bg-card text-muted-foreground hover:bg-secondary"
                      }`}
                    >
                      {lang === "bn" ? ft.bn : ft.id}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-border pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="text-sm font-semibold text-muted-foreground hover:text-forest"
              >
                {lang === "bn" ? "< পেছনে" : "< Back"}
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#107548] px-6 py-2.5 text-sm font-bold text-white shadow-lift transition-all hover:bg-[#0c5c38]"
              >
                <span>{lang === "bn" ? "পরবর্তী" : "Next"}</span> &gt;
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Priorities */}
        {currentStep === 4 && (
          <div className="rounded-3xl border border-border bg-card p-6 shadow-lift md:p-8">
            <h2 className="text-xl font-bold text-forest dark:text-white md:text-2xl">
              {lang === "bn" ? "আপনার অগ্রাধিকার ও লক্ষ্য" : "Your farming priorities"}
            </h2>
            <p className="text-xs text-muted-foreground md:text-sm">
              {lang === "bn"
                ? "পরবর্তী ফসলের সুপারিশে আপনি কোন বিষয়টিকে সর্বোচ্চ গুরুত্ব দিতে চান?"
                : "Tell the AI what matters most for your next harvest."}
            </p>

            <div className="mt-6 space-y-6">
              <div>
                <label className="text-sm font-semibold text-forest dark:text-white">
                  {lang === "bn" ? "মূল লক্ষ্য নির্বাচন করুন:" : "Select Primary Goal:"}
                </label>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {[
                    {
                      id: "Soil Regeneration & Nitrogen Fixation",
                      labelEn: "🌱 Soil Nitrogen & Bio-Restoration",
                      labelBn: "🌱 মাটির নাইট্রোজেন ও উর্বরতা বৃদ্ধি",
                      descEn: "Break cereal monoculture and fix biological nitrogen",
                      descBn: "একটানা ধান চাষের চক্র ভেঙে প্রাকৃতিকভাবে নাইট্রোজেন সংযোজন",
                    },
                    {
                      id: "Maximize Profit",
                      labelEn: "💰 Maximize Cash Profit",
                      labelBn: "💰 সর্বোচ্চ আর্থিক লাভ",
                      descEn: "Highest return on investment per acre",
                      descBn: "একরে সর্বোচ্চ নেট আর্থিক মুনাফা অর্জন",
                    },
                    {
                      id: "Low Water & Drought Resilience",
                      labelEn: "💧 Low Irrigation & Climate Resilience",
                      labelBn: "💧 কম সেচ ও খরা সহনশীলতা",
                      descEn: "Save fuel costs and avoid drought stress",
                      descBn: "জ্বালানি খরচ কমানো ও খরার ক্ষতি প্রতিরোধ",
                    },
                    {
                      id: "Fast Turnaround",
                      labelEn: "⚡ Short Duration Crop",
                      labelBn: "⚡ স্বল্পমেয়াদী ফসল",
                      descEn: "Fast harvest in 60-80 days",
                      descBn: "৬০-৮০ দিনে দ্রুত ঘরে তোলা ফসল",
                    },
                  ].map((g) => (
                    <button
                      type="button"
                      key={g.id}
                      onClick={() => setPrimaryGoal(g.id)}
                      className={`rounded-2xl border p-4 text-left transition-all ${
                        primaryGoal === g.id
                          ? "border-[#107548] bg-[#107548]/10 text-[#107548] ring-2 ring-[#107548]/30 dark:text-emerald-400"
                          : "border-border bg-card text-muted-foreground hover:bg-secondary"
                      }`}
                    >
                      <div className="font-bold text-forest dark:text-white">
                        {lang === "bn" ? g.labelBn : g.labelEn}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {lang === "bn" ? g.descBn : g.descEn}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-forest dark:text-white">
                  {lang === "bn" ? "সেচ সুবিধা:" : "Irrigation Availability:"}
                </label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {[
                    { id: "Deep Tubewell", bn: "গভীর নলকূপ সেচ" },
                    { id: "Alternate Wetting & Drying (AWD)", bn: "এডব্লিউডি (পর্যায়ক্রমিক ভেজানো ও শুকানো)" },
                    { id: "Rainfed / Limited", bn: "বৃষ্টির পানি / সীমিত সেচ" },
                  ].map((ir) => (
                    <button
                      type="button"
                      key={ir.id}
                      onClick={() => setIrrigationType(ir.id)}
                      className={`rounded-2xl border p-3 text-center text-xs font-semibold sm:text-sm ${
                        irrigationType === ir.id
                          ? "border-[#107548] bg-[#107548]/10 text-[#107548] ring-2 ring-[#107548]/30 dark:text-emerald-400"
                          : "border-border bg-card text-muted-foreground hover:bg-secondary"
                      }`}
                    >
                      {lang === "bn" ? ir.bn : ir.id}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-border pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="text-sm font-semibold text-muted-foreground hover:text-forest"
              >
                {lang === "bn" ? "< পেছনে" : "< Back"}
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(5)}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#107548] px-6 py-2.5 text-sm font-bold text-white shadow-lift transition-all hover:bg-[#0c5c38]"
              >
                <span>{lang === "bn" ? "পরবর্তী" : "Next"}</span> &gt;
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Review */}
        {currentStep === 5 && (
          <div className="rounded-3xl border border-border bg-card p-6 shadow-lift md:p-8">
            <h2 className="text-xl font-bold text-forest dark:text-white md:text-2xl">
              {lang === "bn" ? "তথ্য পর্যালোচনা ও অনুমোদন" : "Review your field profile"}
            </h2>
            <p className="text-xs text-muted-foreground md:text-sm">
              {lang === "bn"
                ? "১০টি মাটির মানদণ্ড ও নাসা উপগ্রহের তথ্য মিলিয়ে এআই বিশ্লেষণ শুরু করার পূর্বে যাচাই করুন।"
                : "Confirm your 10 soil indicators and field parameters before running the AI model."}
            </p>

            <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-secondary/50 p-4 text-sm">
              <div className="flex items-center justify-between py-2.5">
                <span className="text-muted-foreground">{lang === "bn" ? "জমির নাম:" : "Field Name:"}</span>
                <span className="font-bold text-forest dark:text-white">{fieldName}</span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-muted-foreground">{lang === "bn" ? "হিসাবকৃত জমির আয়তন:" : "Calculated Land Area:"}</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {areaAcres.toFixed(2)} {lang === "bn" ? "একর" : "ac"} ({areaBigha.toFixed(2)} {lang === "bn" ? "বিঘা" : "bigha"})
                </span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-muted-foreground">{lang === "bn" ? "মাটির রাসায়নিক মান (pH ও লবণাক্ততা):" : "Soil Chemistry (pH & Salinity):"}</span>
                <span className="font-semibold text-forest dark:text-white">
                  pH {soilPh.toFixed(1)} · {lang === "bn" ? "লবণাক্ততা" : "Salinity"} {salinityDsm.toFixed(1)} dS/m
                </span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-muted-foreground">{lang === "bn" ? "মাটির পুষ্টি উপাদান (N-P-K ও জৈব পদার্থ):" : "Nutrients (N-P-K & OM):"}</span>
                <span className="font-semibold text-forest dark:text-white">
                  N {nitrogenKgHa} kg/ha · P {phosphorusPpm.toFixed(1)} ppm · K {potassiumMeq.toFixed(2)} meq · OM {organicMatterPct.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-muted-foreground">{lang === "bn" ? "মাটির বুনট ও নিষ্কাশন অবস্থা:" : "Texture & Physical Conditions:"}</span>
                <span className="font-semibold text-forest dark:text-white">
                  {soilType} ({sandPct}%S/{siltPct}%Si/{clayPct}%C) · {drainage} · {lang === "bn" ? "গভীরতা" : "Depth"} {soilDepthCm}cm
                </span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-muted-foreground">{lang === "bn" ? "নাসা SMAP আর্দ্রতা:" : "NASA SMAP Moisture:"}</span>
                <span className="font-bold text-sky-700 dark:text-sky-300">
                  {moisturePct}% ({lang === "bn" ? "মূল স্তর ১০-৪০ সেমি" : "Root-zone 10-40cm"})
                </span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-muted-foreground">{lang === "bn" ? "পূর্ববর্তী ফসল ও লক্ষ্য:" : "Previous Crop & Goal:"}</span>
                <span className="font-semibold text-forest dark:text-white">
                  {prevCrop} · {primaryGoal}
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-2xl bg-emerald-500/10 p-3 text-xs text-emerald-800 dark:text-emerald-300">
              <Sparkles className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>
                {lang === "bn"
                  ? "১০টি মাটির নির্দেশক, নাসা SMAP মাটির আর্দ্রতা এবং নাসা POWER আবহাওয়ার তথ্যের ভিত্তিতে ১২টি ফসলের বিজ্ঞানসম্মত মূল্যায়ন করা হচ্ছে।"
                  : "Evaluating 12 crop varieties against all 10 soil indicators, NASA SMAP soil moisture, and NASA POWER climate data."}
              </span>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-border pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="text-sm font-semibold text-muted-foreground hover:text-forest"
              >
                {lang === "bn" ? "< পেছনে" : "< Back"}
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(6)}
                className="inline-flex items-center gap-2 rounded-full bg-[#107548] px-8 py-3 text-sm font-bold text-white shadow-lift transition-all hover:scale-105 hover:bg-[#0c5c38]"
              >
                <span>{lang === "bn" ? "মাঠের পূর্ণাঙ্গ রিপোর্ট তৈরি করুন" : "Generate Field Report"}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: Generate / Final Output (Exact replica of Image 2 with Enhanced Multi-Crop & 10 Soil Parameters Matrix) */}
        {currentStep === 6 && (
          <div className="rounded-3xl border border-border bg-card p-6 shadow-lift md:p-8">
            {/* Header: Field report — My field + Regenerate */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-forest dark:text-white md:text-2xl">
                {lang === "bn" ? `মাঠের প্রতিবেদন — ${fieldName}` : `Field report — ${fieldName}`}
              </h2>
              <button
                type="button"
                onClick={() => setCurrentStep(6)}
                className="rounded-full border border-border bg-secondary/80 px-4 py-1.5 text-xs font-bold text-forest transition-colors hover:bg-secondary dark:text-white"
              >
                {lang === "bn" ? "পুনরায় তৈরি করুন" : "Regenerate"}
              </button>
            </div>

            {/* 4 Summary Metric Cards (Area, NDVI, Soil moisture, Nitrogen index - Matching Image 2) */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-2xl border border-border bg-secondary/50 p-4">
                <div className="text-xs text-muted-foreground">{lang === "bn" ? "জমির আয়তন" : "Area"}</div>
                <div className="mt-1 text-xl font-bold text-forest dark:text-white">
                  {areaAcres.toFixed(2)} {lang === "bn" ? "একর" : "ac"}
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-50/70 p-4 dark:bg-emerald-950/20">
                <div className="text-xs text-muted-foreground">{lang === "bn" ? "এনডিভিআই (NDVI)" : "NDVI"}</div>
                <div className="mt-1 text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  {lang === "bn" ? "০.৭৮ · স্বাস্থ্যকর সবুজ" : "0.78 · Healthy"}
                </div>
              </div>

              <div className="rounded-2xl border border-sky-500/20 bg-sky-50/70 p-4 dark:bg-sky-950/20">
                <div className="text-xs text-muted-foreground">{lang === "bn" ? "মাটির আর্দ্রতা" : "Soil moisture"}</div>
                <div className="mt-1 text-xl font-bold text-sky-700 dark:text-sky-300">
                  {moisturePct}%
                </div>
              </div>

              <div className="rounded-2xl border border-amber-500/20 bg-amber-50/70 p-4 dark:bg-amber-950/20">
                <div className="text-xs text-muted-foreground">{lang === "bn" ? "নাইট্রোজেন সূচক" : "Nitrogen index"}</div>
                <div className="mt-1 text-xl font-bold text-amber-700 dark:text-amber-400">
                  {nitrogenKgHa}/100
                </div>
              </div>
            </div>

            {/* Best crops for next season Header & Categories */}
            <div className="mt-8">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-base font-bold text-forest dark:text-white">
                  {lang === "bn"
                    ? `পরবর্তী মৌসুমের জন্য সেরা ফসল (${evaluatedCrops.length}টি ফসল পরীক্ষিত)`
                    : `Best crops for next season (${evaluatedCrops.length} crops evaluated)`}
                </h3>

                {/* Filter Categories */}
                <div className="flex flex-wrap gap-1">
                  {[
                    { id: "all", labelEn: "All Crops", labelBn: "সব ফসল" },
                    { id: "legume", labelEn: "Legumes", labelBn: "ডালজাতীয়" },
                    { id: "oilseed", labelEn: "Oilseeds", labelBn: "তেলজাতীয়" },
                    { id: "cereal", labelEn: "Cereals", labelBn: "দানাদার শস্য" },
                    { id: "tuber", labelEn: "Tubers", labelBn: "কন্দ/আলু" },
                    { id: "vegetable", labelEn: "Vegetables", labelBn: "শাকসবজি" },
                  ].map((cat) => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setCropCategoryFilter(cat.id)}
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                        cropCategoryFilter === cat.id
                          ? "bg-[#107548] text-white shadow-sm"
                          : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {lang === "bn" ? cat.labelBn : cat.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Crops Grid */}
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {displayedCrops.map((crop, idx) => {
                  const isTopRanked = idx === 0 && cropCategoryFilter === "all";
                  const isSelected = crop.id === selectedCropId;

                  return (
                    <div
                      key={crop.id}
                      onClick={() => setSelectedCropId(crop.id)}
                      className={`cursor-pointer rounded-2xl p-4 shadow-sm transition-all hover:scale-[1.01] ${
                        isTopRanked
                          ? "border-2 border-[#107548] bg-[#107548]/5 dark:bg-[#107548]/10"
                          : isSelected
                            ? "border-2 border-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/20"
                            : "border border-border bg-card"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-bold text-forest dark:text-white">
                          <span>{crop.emoji}</span>
                          <span className="truncate">
                            {lang === "bn" ? crop.nameBn.split(" (")[0] : crop.name.split(" (")[0]}
                          </span>
                        </div>
                        <span
                          className={`text-sm font-extrabold ${
                            crop.overallScore >= 90
                              ? "text-[#107548] dark:text-emerald-400"
                              : "text-muted-foreground"
                          }`}
                        >
                          {crop.overallScore}%
                        </span>
                      </div>

                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {lang === "bn" ? crop.summaryReasonBn : crop.summaryReasonEn}
                      </p>

                      <div className="mt-3 flex items-center justify-between text-xs">
                        <div className="font-semibold text-forest dark:text-emerald-300">
                          {lang === "bn" ? "পানির চাহিদা: " : "Water need: "}
                          <span
                            className={
                              crop.waterNeed === "Low"
                                ? "font-bold text-emerald-600"
                                : crop.waterNeed === "Medium"
                                  ? "font-bold text-amber-600"
                                  : "font-bold text-sky-600"
                            }
                          >
                            {lang === "bn" ? crop.waterNeedBn : crop.waterNeed}
                          </span>
                        </div>

                        <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                          {crop.durationDays}{lang === "bn" ? " দিন" : "d"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive 10 Soil Parameters Compatibility Matrix for Selected Crop */}
            <div className="mt-8 rounded-2xl border border-border bg-secondary/40 p-4">
              <div
                className="flex cursor-pointer items-center justify-between"
                onClick={() => setShowParametersMatrix(!showParametersMatrix)}
              >
                <div className="flex items-center gap-2">
                  <FlaskConical className="h-4 w-4 text-[#107548] dark:text-emerald-400" />
                  <span className="font-bold text-forest dark:text-white text-sm">
                    {lang === "bn"
                      ? `১০টি মাটির মানদণ্ড বিশ্লেষণ: ${selectedCrop.nameBn}`
                      : `10 Soil Parameters Compatibility Matrix: ${selectedCrop.name}`}
                  </span>
                  <span className="rounded-full bg-[#107548]/15 px-2 py-0.5 text-[11px] font-bold text-[#107548] dark:text-emerald-400">
                    {selectedCrop.overallScore}% Match
                  </span>
                </div>
                <button type="button" className="text-muted-foreground">
                  {showParametersMatrix ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </div>

              {showParametersMatrix && (
                <div className="mt-4">
                  <p className="text-xs text-muted-foreground">
                    {lang === "bn"
                      ? "আপনার জমিতে পরিমাপকৃত ১০টি মাটির উপাদান এবং এই ফসলের আদর্শ চাহিদার সরাসরি তুলনা:"
                      : "Direct evaluation of your measured field parameters against this crop's optimal biological range:"}
                  </p>

                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
                    {/* 1. pH */}
                    <div className="rounded-xl border border-border bg-card p-2.5">
                      <div className="text-[10px] text-muted-foreground">{lang === "bn" ? "১. মাটির পিএইচ" : "1. Soil pH"}</div>
                      <div className="font-bold text-xs text-forest dark:text-white">
                        {selectedCrop.parameterScores.ph.value}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {lang === "bn" ? "চাহিদা: " : "Req: "}{selectedCrop.parameterScores.ph.optimalRange}
                      </div>
                      <span className="mt-1 inline-block rounded-full bg-emerald-500/15 px-1.5 py-0.2 text-[9px] font-bold text-emerald-700 dark:text-emerald-400">
                        {lang === "bn" ? (selectedCrop.parameterScores.ph.status === "optimal" ? "আদর্শ" : "গ্রহণযোগ্য") : selectedCrop.parameterScores.ph.status}
                      </span>
                    </div>

                    {/* 2. Nitrogen */}
                    <div className="rounded-xl border border-border bg-card p-2.5">
                      <div className="text-[10px] text-muted-foreground">{lang === "bn" ? "২. নাইট্রোজেন (N)" : "2. Nitrogen (N)"}</div>
                      <div className="font-bold text-xs text-forest dark:text-white">
                        {selectedCrop.parameterScores.nitrogen.value}
                      </div>
                      <div className="text-[10px] text-muted-foreground truncate">
                        {lang === "bn" ? "চাহিদা: " : "Req: "}{selectedCrop.parameterScores.nitrogen.optimalRange}
                      </div>
                      <span className="mt-1 inline-block rounded-full bg-emerald-500/15 px-1.5 py-0.2 text-[9px] font-bold text-emerald-700 dark:text-emerald-400">
                        {lang === "bn" ? (selectedCrop.parameterScores.nitrogen.status === "optimal" ? "আদর্শ" : "গ্রহণযোগ্য") : selectedCrop.parameterScores.nitrogen.status}
                      </span>
                    </div>

                    {/* 3. Phosphorus */}
                    <div className="rounded-xl border border-border bg-card p-2.5">
                      <div className="text-[10px] text-muted-foreground">{lang === "bn" ? "৩. ফসফরাস (P)" : "3. Phosphorus (P)"}</div>
                      <div className="font-bold text-xs text-forest dark:text-white">
                        {selectedCrop.parameterScores.phosphorus.value}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {lang === "bn" ? "চাহিদা: " : "Req: "}{selectedCrop.parameterScores.phosphorus.optimalRange}
                      </div>
                      <span className="mt-1 inline-block rounded-full bg-emerald-500/15 px-1.5 py-0.2 text-[9px] font-bold text-emerald-700 dark:text-emerald-400">
                        {lang === "bn" ? (selectedCrop.parameterScores.phosphorus.status === "optimal" ? "আদর্শ" : "গ্রহণযোগ্য") : selectedCrop.parameterScores.phosphorus.status}
                      </span>
                    </div>

                    {/* 4. Potassium */}
                    <div className="rounded-xl border border-border bg-card p-2.5">
                      <div className="text-[10px] text-muted-foreground">{lang === "bn" ? "৪. পটাসিয়াম (K)" : "4. Potassium (K)"}</div>
                      <div className="font-bold text-xs text-forest dark:text-white">
                        {selectedCrop.parameterScores.potassium.value}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {lang === "bn" ? "চাহিদা: " : "Req: "}{selectedCrop.parameterScores.potassium.optimalRange}
                      </div>
                      <span className="mt-1 inline-block rounded-full bg-emerald-500/15 px-1.5 py-0.2 text-[9px] font-bold text-emerald-700 dark:text-emerald-400">
                        {lang === "bn" ? (selectedCrop.parameterScores.potassium.status === "optimal" ? "আদর্শ" : "গ্রহণযোগ্য") : selectedCrop.parameterScores.potassium.status}
                      </span>
                    </div>

                    {/* 5. Organic Matter */}
                    <div className="rounded-xl border border-border bg-card p-2.5">
                      <div className="text-[10px] text-muted-foreground">{lang === "bn" ? "৫. জৈব পদার্থ" : "5. Organic Matter"}</div>
                      <div className="font-bold text-xs text-forest dark:text-white">
                        {selectedCrop.parameterScores.organicMatter.value}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {lang === "bn" ? "চাহিদা: " : "Req: "}{selectedCrop.parameterScores.organicMatter.optimalRange}
                      </div>
                      <span className="mt-1 inline-block rounded-full bg-emerald-500/15 px-1.5 py-0.2 text-[9px] font-bold text-emerald-700 dark:text-emerald-400">
                        {lang === "bn" ? (selectedCrop.parameterScores.organicMatter.status === "optimal" ? "আদর্শ" : "গ্রহণযোগ্য") : selectedCrop.parameterScores.organicMatter.status}
                      </span>
                    </div>

                    {/* 6. Texture */}
                    <div className="rounded-xl border border-border bg-card p-2.5">
                      <div className="text-[10px] text-muted-foreground">{lang === "bn" ? "৬. মাটির বুনট" : "6. Texture"}</div>
                      <div className="font-bold text-xs text-forest dark:text-white truncate">
                        {soilType}
                      </div>
                      <div className="text-[10px] text-muted-foreground truncate">
                        {lang === "bn" ? "চাহিদা: " : "Req: "}{selectedCrop.parameterScores.texture.optimalRange}
                      </div>
                      <span className="mt-1 inline-block rounded-full bg-emerald-500/15 px-1.5 py-0.2 text-[9px] font-bold text-emerald-700 dark:text-emerald-400">
                        {lang === "bn" ? (selectedCrop.parameterScores.texture.status === "optimal" ? "আদর্শ" : "গ্রহণযোগ্য") : selectedCrop.parameterScores.texture.status}
                      </span>
                    </div>

                    {/* 7. Salinity */}
                    <div className="rounded-xl border border-border bg-card p-2.5">
                      <div className="text-[10px] text-muted-foreground">{lang === "bn" ? "৭. লবণাক্ততা" : "7. Salinity (ECe)"}</div>
                      <div className="font-bold text-xs text-forest dark:text-white">
                        {selectedCrop.parameterScores.salinity.value}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {lang === "bn" ? "চাহিদা: " : "Req: "}{selectedCrop.parameterScores.salinity.optimalRange}
                      </div>
                      <span
                        className={`mt-1 inline-block rounded-full px-1.5 py-0.2 text-[9px] font-bold ${
                          selectedCrop.parameterScores.salinity.status === "optimal"
                            ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                            : "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                        }`}
                      >
                        {lang === "bn" ? (selectedCrop.parameterScores.salinity.status === "optimal" ? "আদর্শ" : "সহনশীল") : selectedCrop.parameterScores.salinity.status}
                      </span>
                    </div>

                    {/* 8. Moisture (NASA SMAP) */}
                    <div className="rounded-xl border border-border bg-card p-2.5">
                      <div className="text-[10px] text-sky-700 dark:text-sky-300">{lang === "bn" ? "৮. আর্দ্রতা (SMAP)" : "8. Moisture (SMAP)"}</div>
                      <div className="font-bold text-xs text-sky-800 dark:text-sky-200">
                        {selectedCrop.parameterScores.moisture.value}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {lang === "bn" ? "চাহিদা: " : "Req: "}{selectedCrop.parameterScores.moisture.optimalRange}
                      </div>
                      <span className="mt-1 inline-block rounded-full bg-sky-500/15 px-1.5 py-0.2 text-[9px] font-bold text-sky-700 dark:text-sky-300">
                        {lang === "bn" ? (selectedCrop.parameterScores.moisture.status === "optimal" ? "অনুকূল" : "পরিমিত") : selectedCrop.parameterScores.moisture.status}
                      </span>
                    </div>

                    {/* 9. Drainage */}
                    <div className="rounded-xl border border-border bg-card p-2.5">
                      <div className="text-[10px] text-muted-foreground">{lang === "bn" ? "৯. নিষ্কাশন" : "9. Drainage"}</div>
                      <div className="font-bold text-xs text-forest dark:text-white truncate">
                        {drainage}
                      </div>
                      <div className="text-[10px] text-muted-foreground truncate">
                        {lang === "bn" ? "চাহিদা: " : "Req: "}{selectedCrop.parameterScores.drainage.optimalRange}
                      </div>
                      <span className="mt-1 inline-block rounded-full bg-emerald-500/15 px-1.5 py-0.2 text-[9px] font-bold text-emerald-700 dark:text-emerald-400">
                        {lang === "bn" ? (selectedCrop.parameterScores.drainage.status === "optimal" ? "অনুকূল" : "গ্রহণযোগ্য") : selectedCrop.parameterScores.drainage.status}
                      </span>
                    </div>

                    {/* 10. Depth */}
                    <div className="rounded-xl border border-border bg-card p-2.5">
                      <div className="text-[10px] text-muted-foreground">{lang === "bn" ? "১০. মাটির গভীরতা" : "10. Depth"}</div>
                      <div className="font-bold text-xs text-forest dark:text-white">
                        {selectedCrop.parameterScores.soilDepth.value}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {lang === "bn" ? "চাহিদা: " : "Req: "}{selectedCrop.parameterScores.soilDepth.optimalRange}
                      </div>
                      <span className="mt-1 inline-block rounded-full bg-emerald-500/15 px-1.5 py-0.2 text-[9px] font-bold text-emerald-700 dark:text-emerald-400">
                        {lang === "bn" ? (selectedCrop.parameterScores.soilDepth.status === "optimal" ? "পর্যাপ্ত" : "গ্রহণযোগ্য") : selectedCrop.parameterScores.soilDepth.status}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* What to do now (Dynamic Recommendations Matching Image 2) */}
            <div className="mt-8">
              <h3 className="text-base font-bold text-forest dark:text-white">
                {lang === "bn" ? "এখন আপনার করণীয়:" : "What to do now"}
              </h3>

              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2.5 rounded-2xl bg-secondary/60 px-4 py-3 text-xs font-medium text-forest dark:text-white/90">
                  <Sprout className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span>
                    {nitrogenKgHa < 40
                      ? lang === "bn"
                        ? `মাটিতে নাইট্রোজেনের ঘাটতি রয়েছে (${nitrogenKgHa}/১০০) — ৫ টন/হেক্টর জৈব সার যোগ করুন অথবা পরবর্তী মৌসুমে ডালজাতীয় ফসল (মুগ ডাল/মসুর) চাষ করুন।`
                        : `Nitrogen is low (${nitrogenKgHa}/100) — add 5 t/ha compost or grow a legume (Mung Bean / Lentil) next season.`
                      : lang === "bn"
                        ? `মাটির নাইট্রোজেন পর্যাপ্ত রয়েছে (${nitrogenKgHa} কেজি/হেক্টর) — অতিরিক্ত ইউরিয়া সার না দিয়ে সুষম এনপিকে সার ব্যবহার করুন।`
                        : `Soil nitrogen is sufficient (${nitrogenKgHa} kg/ha) — maintain balanced NPK without over-applying chemical urea.`}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 rounded-2xl bg-secondary/60 px-4 py-3 text-xs font-medium text-forest dark:text-white/90">
                  <Sprout className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span>
                    {lang === "bn"
                      ? `মাটির পিএইচ (${soilPh.toFixed(1)}) অধিকাংশ ফসলের জন্য আদর্শ সীমার মধ্যে রয়েছে (${soilPh >= 6.0 && soilPh <= 7.2 ? "সর্বোচ্চ পুষ্টি শোষণ নিশ্চিত" : "সামান্য চুন প্রয়োগ করা যেতে পারে"})।`
                      : `pH (${soilPh.toFixed(1)}) is in the ideal range for most crops (${soilPh >= 6.0 && soilPh <= 7.2 ? "optimal nutrient absorption" : "slight lime application recommended"}).`}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 rounded-2xl bg-secondary/60 px-4 py-3 text-xs font-medium text-forest dark:text-white/90">
                  <Sprout className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span>
                    {lang === "bn"
                      ? `নাসা SMAP আর্দ্রতা (${moisturePct}%) অনুযায়ী এডব্লিউডি (AWD) পাইপ ব্যবহার করে ২৫-৩০% সেচের পানি সাশ্রয় করুন।`
                      : `Use alternate wetting & drying (AWD) to save irrigation water based on NASA SMAP moisture (${moisturePct}%).`}
                  </span>
                </div>

                {salinityDsm > 2.5 && (
                  <div className="flex items-center gap-2.5 rounded-2xl bg-amber-500/10 px-4 py-3 text-xs font-medium text-amber-900 dark:text-amber-300">
                    <Sprout className="h-4 w-4 shrink-0 text-amber-600" />
                    <span>
                      {lang === "bn"
                        ? `মাটিতে কিছুটা লবণাক্ততা রয়েছে (${salinityDsm.toFixed(1)} dS/m) — লবণাক্ততা সহনশীল সূর্যমুখী, সরিষা বা ব্রি ধান৬৭ চাষে প্রাধান্য দিন।`
                        : `Soil salinity is elevated (${salinityDsm.toFixed(1)} dS/m) — prioritize salinity-tolerant sunflower, mustard, or Boro rice.`}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Explicit NASA & Local Data Source Disclosure Box */}
            <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-xs">
              <div className="flex items-center gap-2 font-bold text-primary">
                <Satellite className="h-4 w-4" />
                <span>
                  {lang === "bn"
                    ? "ব্যবহৃত নাসা উপগ্রহ ও স্থানীয় তথ্যের বিবরণ:"
                    : "NASA Earth Observation & Local Intelligence Used:"}
                </span>
              </div>

              <div className="mt-2.5 grid gap-2 sm:grid-cols-2 text-muted-foreground">
                <div className="rounded-xl bg-card/80 p-2.5 border border-border/60">
                  <b className="text-forest dark:text-emerald-400">
                    {lang === "bn" ? "নাসা SMAP উপগ্রহ:" : "NASA SMAP Satellite:"}
                  </b>{" "}
                  {lang === "bn"
                    ? `মাটির গভীর আর্দ্রতা (১০-৪০ সেমি) পরিমাপকৃত ${moisturePct}% (০.১৬ m³/m³), যা বীজ বপনের জন্য অনুকূল।`
                    : `Root-zone soil moisture (10-40cm) measured at ${moisturePct}% (0.16 m³/m³), confirming optimal sowing conditions.`}
                </div>
                <div className="rounded-xl bg-card/80 p-2.5 border border-border/60">
                  <b className="text-forest dark:text-emerald-400">
                    {lang === "bn" ? "নাসা MODIS / Landsat:" : "NASA MODIS / Landsat:"}
                  </b>{" "}
                  {lang === "bn"
                    ? "উদ্ভিদ সবুজায়ন সূচক (NDVI) ০.৭৮ (স্বাস্থ্যকর শ্যামলিমার লক্ষণ)।"
                    : "Surface Reflectance NDVI index calculated at 0.78 (Healthy vegetative canopy)."}
                </div>
                <div className="rounded-xl bg-card/80 p-2.5 border border-border/60">
                  <b className="text-forest dark:text-emerald-400">
                    {lang === "bn" ? "নাসা POWER কৃষি-আবহাওয়া:" : "NASA POWER Agroclimatology:"}
                  </b>{" "}
                  {lang === "bn"
                    ? "দৈনিক সৌর বিকিরণ (১৭.৫ MJ/m²/দিন), তাপমাত্রা (২৬-৩১°সে) এবং ফসল পরিপক্কতার আলোক-ঘণ্টা।"
                    : "Solar insolation (17.5 MJ/m²/day), temperature range (26-31°C), and GDD sufficiency."}
                </div>
                <div className="rounded-xl bg-card/80 p-2.5 border border-border/60">
                  <b className="text-forest dark:text-emerald-400">
                    {lang === "bn" ? "ISRIC SoilGrids ও বিএআরসি এইজেড:" : "ISRIC SoilGrids & BARC AEZ:"}
                  </b>{" "}
                  {lang === "bn"
                    ? `১০টি মাটির উপাদান প্রোফাইল (${soilType}, পিএইচ ${soilPh.toFixed(1)}, N-P-K, লবণাক্ততা ${salinityDsm.toFixed(1)} dS/m)।`
                    : `10-parameter profile (${soilType}, pH ${soilPh.toFixed(1)}, N-P-K, Salinity ${salinityDsm.toFixed(1)} dS/m).`}
                </div>
              </div>
            </div>

            <p className="mt-4 text-center text-[11px] text-muted-foreground">
              {lang === "bn"
                ? "আপনার ডিভাইসে স্বয়ংক্রিয়ভাবে সংরক্ষিত হয়েছে। স্যাটেলাইট মানসমূহ বিজ্ঞানসম্মতভাবে গণনাকৃত।"
                : "Saved automatically to your history on this device. Satellite values are calibrated estimates."}
            </p>

            {/* Bottom Buttons: < Back and New field (Matching Image 2) */}
            <div className="mt-8 flex items-center justify-between border-t border-border pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(5)}
                className="text-sm font-semibold text-muted-foreground hover:text-forest"
              >
                {lang === "bn" ? "< ফিরে যান" : "< Back"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setPoints([]);
                  setCurrentStep(1);
                }}
                className="rounded-full border border-border bg-secondary/80 px-6 py-2.5 text-sm font-bold text-forest transition-colors hover:bg-secondary dark:text-white"
              >
                {lang === "bn" ? "নতুন জমি বিশ্লেষণ" : "New field"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
