/**
 * TerraShift Pre-Flight End-to-End Verification Test Script
 * Tests Bogura, Mymensingh, and Barishal across all 4 intelligence pipelines and engines.
 */
import { fetchSoilIntelligence } from "../ingestion/soilgrids.js";
import { fetchSatelliteWeather } from "../ingestion/satellite-weather.js";
import { runMcdaCropSuitability } from "../engines/mcda-recommendation.js";
import { analyzeCropRotationTrajectory } from "../engines/nitrogen-rotation.js";

const TEST_LOCATIONS = [
  { name: "Bogura", nameBn: "বগুড়া", lat: 24.8465, lon: 89.3777 },
  { name: "Mymensingh", nameBn: "ময়মনসিংহ", lat: 24.7471, lon: 90.4203 },
  { name: "Barishal", nameBn: "বরিশাল", lat: 22.701, lon: 90.3535 },
];

async function runPreflight() {
  console.log("==================================================================");
  console.log("  TERRASHIFT PRE-FLIGHT END-TO-END VERIFICATION AUDIT");
  console.log("  NASA Earth Observation, ISRIC SoilGrids & BARC AEZ Engines");
  console.log("==================================================================\n");

  const results: any[] = [];

  for (const loc of TEST_LOCATIONS) {
    console.log(`>>> TESTING DISTRICT: ${loc.name} (${loc.nameBn}) [lat: ${loc.lat}, lon: ${loc.lon}]`);
    const t0 = Date.now();

    // 1. Soil Intelligence Test
    console.log("  [1/4] Querying Soil Intelligence (ISRIC SoilGrids + BARC AEZ)...");
    const soilRes = await fetchSoilIntelligence(loc.lat, loc.lon);
    console.log(`        Soil pH: ${soilRes.soilProperties.ph} | Texture: ${soilRes.soilProperties.soilTexture}`);
    console.log(`        AEZ Zone: ${soilRes.agroEcologicalZone.aezNumber} - ${soilRes.agroEcologicalZone.aezName}`);
    console.log(`        Confidence: ${soilRes.confidenceScore}% | Latency: ${soilRes.latencyMs}ms`);

    // Verify requirements: sources, timestamp, confidence
    if (!soilRes.sources || soilRes.sources.length === 0) throw new Error("Missing sources list in Soil response");
    if (!soilRes.retrievalTimestamp) throw new Error("Missing retrievalTimestamp in Soil response");
    if (typeof soilRes.confidenceScore !== "number") throw new Error("Missing confidenceScore in Soil response");

    // 2. Satellite Weather Test
    console.log("  [2/4] Querying Live Satellite Weather (NASA POWER + SMAP/Open-Meteo)...");
    const weatherRes = await fetchSatelliteWeather(loc.lat, loc.lon);
    console.log(`        Temp: ${weatherRes.currentConditions.temperature}°C | RH: ${weatherRes.currentConditions.humidity}%`);
    console.log(`        Root-zone Saturation: ${weatherRes.currentConditions.rootZoneSaturation}% | CWSI: ${weatherRes.currentConditions.cwsi}`);
    console.log(`        Active Hazards: ${weatherRes.hazardAlerts.length} alert(s) | Latency: ${weatherRes.latencyMs}ms`);

    if (!weatherRes.sources || weatherRes.sources.length === 0) throw new Error("Missing sources in Weather response");

    // 3. MCDA Crop Intelligence Test
    console.log("  [3/4] Running Engine 1: MCDA Crop Recommendation (XAI)...");
    const recommendations = runMcdaCropSuitability(
      soilRes.soilProperties,
      weatherRes.sevenDayForecast,
      weatherRes.currentConditions.rootZoneSaturation,
      "All",
    );
    const topCrop = recommendations[0]!;
    console.log(`        Top Recommended Crop: ${topCrop.crop.name} (${topCrop.crop.nameBn})`);
    console.log(`        Match Score: ${topCrop.matchScore}% | Confidence: ${topCrop.confidenceLevel}%`);
    console.log(`        English Rationale: "${topCrop.explanationEn.slice(0, 70)}..."`);
    console.log(`        Bengali Rationale: "${topCrop.explanationBn.slice(0, 70)}..."`);

    // Verify dual-language explainability
    if (!topCrop.explanationEn || !topCrop.explanationBn) throw new Error("Missing bilingual explanation");
    if (!topCrop.riskFactorsEn.length || !topCrop.riskFactorsBn.length) throw new Error("Missing bilingual risk factors");

    // 4. Crop Rotation & Counterfactual Audit Test
    console.log("  [4/4] Running Engine 2 & 4: Nitrogen Trajectory & Counterfactual Audit...");
    const rotationPlan = [
      { seasonName: "Rabi 2025", cropId: "potato", cropName: "Diamond Potato" },
      { seasonName: "Kharif-1 2026", cropId: "jute", cropName: "Tossa Jute" },
      { seasonName: "Kharif-2 2026", cropId: "t_aman_rice", cropName: "T. Aman Rice" },
      { seasonName: "Rabi 2026", cropId: "mustard", cropName: "Mustard" },
      { seasonName: "Kharif-1 2027", cropId: "mungbean", cropName: "Mungbean" },
    ];
    const rotationRes = analyzeCropRotationTrajectory(rotationPlan);
    console.log(`        Cumulative Nitrogen Balance: ${rotationRes.totalNitrogenBalanceKgHa} kg N/ha`);
    console.log(`        Estimated Fertilizer Savings: ৳${rotationRes.fertilizerSavingsBdtAcre} / acre`);
    console.log(`        NASA Precision Savings: ৳${rotationRes.counterfactualAudit.withNasaData.financialSavingsBdtAcre} / acre`);

    const totalLocTime = Date.now() - t0;
    console.log(`  >>> PASS: ${loc.name} completed in ${totalLocTime}ms\n`);

    results.push({
      district: loc.name,
      districtBn: loc.nameBn,
      soilLatencyMs: soilRes.latencyMs,
      weatherLatencyMs: weatherRes.latencyMs,
      totalLatencyMs: totalLocTime,
      soilConfidence: soilRes.confidenceScore,
      weatherConfidence: weatherRes.confidenceScore,
      topCrop: topCrop.crop.name,
      topMatchScore: topCrop.matchScore,
      sources: [...new Set([...soilRes.sources, ...weatherRes.sources])],
      dualLanguageVerified: true,
    });
  }

  console.log("==================================================================");
  console.log("  PRE-FLIGHT AUDIT SUMMARY MATRIX");
  console.log("==================================================================");
  console.table(
    results.map((r) => ({
      District: r.district,
      "Soil Latency": `${r.soilLatencyMs}ms`,
      "Weather Latency": `${r.weatherLatencyMs}ms`,
      Confidence: `${r.soilConfidence}% / ${r.weatherConfidence}%`,
      "Top Crop": r.topCrop,
      "Match Score": `${r.topMatchScore}%`,
      Bilingual: r.dualLanguageVerified ? "PASS" : "FAIL",
    })),
  );

  console.log("\nALL PRE-FLIGHT TESTS COMPLETED SUCCESSFULLY WITH 100% PASS RATE.");
}

runPreflight().catch((err) => {
  console.error("PRE-FLIGHT TEST FAILED:", err);
  process.exit(1);
});
