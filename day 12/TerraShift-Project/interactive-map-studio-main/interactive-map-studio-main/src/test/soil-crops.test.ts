import { describe, it, expect } from "vitest";
import { evaluateCropsForSoil, type SoilProfile10 } from "../lib/soil-crops";

describe("Soil & Crop 10-Parameter Engine", () => {
  it("evaluates a standard alluvial loamy soil and returns a comprehensive crop list", () => {
    const soil: SoilProfile10 = {
      ph: 6.4,
      nitrogenKgHa: 34,
      phosphorusPpm: 14.5,
      potassiumMeq: 0.22,
      organicMatterPct: 1.8,
      sandPct: 35,
      siltPct: 45,
      clayPct: 20,
      textureClass: "Loam",
      salinityDsm: 1.2,
      moisturePct: 38,
      drainage: "Well-drained",
      soilDepthCm: 60,
    };

    const results = evaluateCropsForSoil(soil);

    // Expect at least 10 crops evaluated
    expect(results.length).toBeGreaterThanOrEqual(10);

    // Top crop should have high score
    expect(results[0].overallScore).toBeGreaterThanOrEqual(85);

    // Verify all 10 parameters are present in the score breakdown
    const top = results[0];
    expect(top.parameterScores).toHaveProperty("ph");
    expect(top.parameterScores).toHaveProperty("nitrogen");
    expect(top.parameterScores).toHaveProperty("phosphorus");
    expect(top.parameterScores).toHaveProperty("potassium");
    expect(top.parameterScores).toHaveProperty("organicMatter");
    expect(top.parameterScores).toHaveProperty("texture");
    expect(top.parameterScores).toHaveProperty("salinity");
    expect(top.parameterScores).toHaveProperty("moisture");
    expect(top.parameterScores).toHaveProperty("drainage");
    expect(top.parameterScores).toHaveProperty("soilDepth");
  });

  it("prioritizes salinity-tolerant crops (Sunflower) under coastal saline conditions", () => {
    const coastalSoil: SoilProfile10 = {
      ph: 7.4,
      nitrogenKgHa: 30,
      phosphorusPpm: 12.0,
      potassiumMeq: 0.32,
      organicMatterPct: 1.5,
      sandPct: 25,
      siltPct: 40,
      clayPct: 35,
      textureClass: "Clay Loam",
      salinityDsm: 5.0, // High coastal salinity
      moisturePct: 45,
      drainage: "Moderate",
      soilDepthCm: 50,
    };

    const results = evaluateCropsForSoil(coastalSoil);

    // Sunflower should tolerate high salinity and rank among the top
    const sunflower = results.find((c) => c.id === "sunflower");
    expect(sunflower).toBeDefined();
    expect(sunflower!.overallScore).toBeGreaterThanOrEqual(75);

    // Salinity sensitive crop like lentil or potato should have penalized scores
    const lentil = results.find((c) => c.id === "lentil");
    expect(lentil).toBeDefined();
    expect(sunflower!.overallScore).toBeGreaterThan(lentil!.overallScore);
  });
});
