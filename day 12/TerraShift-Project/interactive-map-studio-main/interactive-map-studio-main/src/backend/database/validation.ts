import { z } from "zod";

export const CoordinatesQuerySchema = z.object({
  lat: z.coerce
    .number()
    .min(20.0, "Latitude must be within Bangladesh bounds (>= 20.0)")
    .max(27.0, "Latitude must be within Bangladesh bounds (<= 27.0)"),
  lon: z.coerce
    .number()
    .min(88.0, "Longitude must be within Bangladesh bounds (>= 88.0)")
    .max(93.0, "Longitude must be within Bangladesh bounds (<= 93.0)"),
});

export const CropIntelligencePayloadSchema = z.object({
  lat: z.coerce.number().min(20.0).max(27.0),
  lon: z.coerce.number().min(88.0).max(93.0),
  season: z.enum(["All", "Rabi", "Kharif-1", "Kharif-2"]).default("All"),
  customSoilOverride: z
    .object({
      ph: z.number().min(3.5).max(9.5).optional(),
      texture: z.string().optional(),
    })
    .optional(),
});

export const RotationEnginePayloadSchema = z.object({
  fieldId: z.string().optional(),
  seasons: z
    .array(
      z.object({
        seasonName: z.string().min(2, "Season name required (e.g. Rabi 2025)"),
        cropId: z.string().min(1, "Crop ID required"),
        cropName: z.string().min(1, "Crop name required"),
      }),
    )
    .min(2, "At least 2 consecutive seasons are required to analyze crop rotation trajectory"),
});
