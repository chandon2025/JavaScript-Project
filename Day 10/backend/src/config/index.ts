import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "5000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  nasaPowerApiBase: process.env.NASA_POWER_API_BASE || "https://power.larc.nasa.gov/api/temporal/daily/point",
  isricSoilGridsApiBase: process.env.ISRIC_SOILGRIDS_API_BASE || "https://rest.isric.org/soilgrids/v2.0/properties/query",
  openMeteoApiBase: process.env.OPEN_METEO_API_BASE || "https://api.open-meteo.com/v1/forecast",
  cacheTtlSeconds: parseInt(process.env.CACHE_TTL_SECONDS || "21600", 10), // 6 hours
  apiTimeoutMs: parseInt(process.env.API_REQUEST_TIMEOUT_MS || "6000", 10),
  supabaseUrl: process.env.SUPABASE_URL || "",
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || "",
  databaseUrl: process.env.DATABASE_URL || "",
};
