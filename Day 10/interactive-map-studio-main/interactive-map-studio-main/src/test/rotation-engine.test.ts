import { describe, it, expect } from "vitest";
import { runCropRotationRecommendationEngine, type RotationInputData } from "../lib/rotation-engine";

describe("Crop Rotation Recommendation Engine", () => {
  const mockInput: RotationInputData = {
    district: "Bogura",
    lat: 24.8465,
    lon: 89.3777,
    currentCrop: "Boro Rice",
    fieldAreaAcres: 1.0,
    cropHistory: [
      { year: 2023, season: "Kharif-2 (Monsoon)", cropName: "T. Aman Rice", botanicalFamily: "Poaceae", yieldRating: "Average" },
      { year: 2024, season: "Rabi (Winter)", cropName: "Boro Rice", botanicalFamily: "Poaceae", yieldRating: "Average" },
      { year: 2024, season: "Kharif-2 (Monsoon)", cropName: "T. Aman Rice", botanicalFamily: "Poaceae", yieldRating: "Average" },
      { year: 2025, season: "Rabi (Winter)", cropName: "Boro Rice", botanicalFamily: "Poaceae", yieldRating: "Average" },
    ],
    soil: {
      ph: 6.4,
      nitrogenKgHa: 34,
      phosphorusPpm: 14.5,
      potassiumMeq: 0.22,
      organicMatterPct: 1.8,
      texture: "Loam",
      salinityDsm: 1.2,
      drainage: "Well-drained",
      depthCm: 60,
    },
    nasaTelemetry: {
      smapRootZoneMoisturePct: 38,
      annualRainfallMm: 1650,
      avgDailyTempC: 26.5,
      maxTempAnthesisC: 32.0,
      gddSufficient: true,
      waterAvailability: "Alternate Wetting & Drying (AWD)",
    },
  };

  it("identifies chronic monoculture risk from continuous rice-rice history", () => {
    const result = runCropRotationRecommendationEngine(mockInput);
    expect(result.historicalAudit.monocultureRiskIdentified).toBe(true);
    expect(result.historicalAudit.totalSeasonsAnalyzed).toBe(4);
  });

  it("generates at least 3 distinct complete rotation strategies including baseline", () => {
    const result = runCropRotationRecommendationEngine(mockInput);
    expect(result.strategies.length).toBeGreaterThanOrEqual(3);

    const baseline = result.strategies.find((s) => s.isBaseline);
    const recommended = result.strategies.find((s) => s.isRecommended);

    expect(baseline).toBeDefined();
    expect(recommended).toBeDefined();

    // Baseline should have biological violations identified
    expect(baseline!.violations.length).toBeGreaterThan(0);

    // Recommended should have zero violations and higher soil health score
    expect(recommended!.violations.length).toBe(0);
    expect(recommended!.metrics.soilHealthScore).toBeGreaterThan(baseline!.metrics.soilHealthScore);

    // Recommended should save water compared to baseline
    expect(recommended!.metrics.totalWaterRequirementMm).toBeLessThan(baseline!.metrics.totalWaterRequirementMm);

    // Recommended should have higher net annual profit
    expect(recommended!.metrics.annualAvgNetProfitBdtAcre).toBeGreaterThan(baseline!.metrics.annualAvgNetProfitBdtAcre);
  });

  it("includes plain-language explanations, risks, benefits, and NASA data provenance", () => {
    const result = runCropRotationRecommendationEngine(mockInput);
    for (const strat of result.strategies) {
      expect(strat.explanationEn.length).toBeGreaterThan(10);
      expect(strat.explanationBn.length).toBeGreaterThan(10);
      expect(strat.keyBenefitsEn.length).toBeGreaterThan(0);
      expect(strat.keyBenefitsBn.length).toBeGreaterThan(0);
      expect(strat.risksAndMitigationsEn.length).toBeGreaterThan(0);
      expect(strat.dataProvenance.length).toBeGreaterThan(0);
      expect(strat.confidenceScorePct).toBeGreaterThanOrEqual(80);
    }
  });
});
