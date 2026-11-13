export const config = {
  port: typeof process !== "undefined" && process.env?.PORT ? parseInt(process.env.PORT, 10) : 5000,
  nodeEnv: typeof process !== "undefined" && process.env?.NODE_ENV ? process.env.NODE_ENV : "development",
  nasaPowerApiBase: "https://power.larc.nasa.gov/api/temporal/daily/point",
  isricSoilGridsApiBase: "https://rest.isric.org/soilgrids/v2.0/properties/query",
  openMeteoApiBase: "https://api.open-meteo.com/v1/forecast",
  cacheTtlSeconds: 21600,
  apiTimeoutMs: 6000,
  supabaseUrl: "",
  supabaseAnonKey: "",
  databaseUrl: "",
};
