import { calculateUsdaSoilTexture } from "../ingestion/soilgrids.js";
import { calculateGdd } from "../ingestion/nasa-power.js";
import { calculateCwsi } from "../ingestion/smap-openmeteo.js";
import { analyzeCropRotationTrajectory } from "../engines/nitrogen-rotation.js";

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${msg}`);
  }
}

console.log("Running TerraShift Core Intelligence Engine Unit Tests...\n");

// 1. USDA Soil Texture Classification
console.log("Testing USDA Soil Texture Triangle Formulas...");
const t1 = calculateUsdaSoilTexture(90, 5, 5);
assert(t1 === "Sand", `Expected Sand, got ${t1}`);

const t2 = calculateUsdaSoilTexture(20, 45, 35);
assert(t2 === "Clay" || t2 === "Silty Clay", `Expected Clay/Silty Clay, got ${t2}`);

const t3 = calculateUsdaSoilTexture(30, 30, 40);
assert(t3 === "Clay Loam", `Expected Clay Loam, got ${t3}`);

const t4 = calculateUsdaSoilTexture(45, 15, 40);
assert(t4 === "Loam", `Expected Loam, got ${t4}`);
console.log("  ✓ USDA Soil Texture calculations passed.");

// 2. GDD Calculation
console.log("Testing Growing Degree Days (GDD) Math...");
// Rice Tbase 10°C, Tmax 32°C, Tmin 22°C -> avg 27°C -> GDD = 17°C
const gdd1 = calculateGdd(32, 22, 10);
assert(gdd1 === 17, `Expected GDD 17, got ${gdd1}`);

// Below base temperature -> GDD = 0
const gdd2 = calculateGdd(8, 6, 10);
assert(gdd2 === 0, `Expected GDD 0, got ${gdd2}`);
console.log("  ✓ GDD math formula passed.");

// 3. CWSI Math
console.log("Testing Crop Water Stress Index (CWSI)...");
// Saturated soil >= 0.40 -> CWSI should be 0.0 (no stress)
const cwsi0 = calculateCwsi(0.42);
assert(cwsi0 === 0.0, `Expected CWSI 0.0, got ${cwsi0}`);

// Wilting point <= 0.14 -> CWSI should be 1.0 (extreme stress)
const cwsi1 = calculateCwsi(0.12);
assert(cwsi1 === 1.0, `Expected CWSI 1.0, got ${cwsi1}`);
console.log("  ✓ CWSI calculation passed.");

// 4. Botanical Rotation Violations & Nitrogen Trajectory
console.log("Testing Rotation Biological Constraints & Nitrogen Kinetics...");
const testRotation = [
  { seasonName: "Rabi 2025", cropId: "potato", cropName: "Diamond Potato" },
  { seasonName: "Rabi 2026", cropId: "potato", cropName: "Diamond Potato" }, // Violation: Solanaceae monoculture
];
const rotResult = analyzeCropRotationTrajectory(testRotation);
assert(rotResult.biologicalViolations.length > 0, "Expected biological violation for back-to-back Solanaceae");
assert(rotResult.biologicalViolations[0]?.violationType === "SAME_FAMILY_MONOCULTURE", "Expected SAME_FAMILY_MONOCULTURE");
console.log("  ✓ Biological monoculture guardrail passed.");

// 5. Legume Nitrogen Fixation
const legumePlan = [
  { seasonName: "Rabi 2025", cropId: "boro_rice", cropName: "Boro Rice" }, // -110 kg N
  { seasonName: "Kharif-1 2026", cropId: "mungbean", cropName: "Mungbean" }, // +45 kg N
];
const legumeResult = analyzeCropRotationTrajectory(legumePlan);
assert(legumeResult.totalNitrogenBalanceKgHa === -65, `Expected -65 kg N, got ${legumeResult.totalNitrogenBalanceKgHa}`);
console.log("  ✓ Nitrogen fixation kinetics passed.");

console.log("\nALL ENGINE UNIT TESTS PASSED SUCCESSFULLY (5/5).\n");
