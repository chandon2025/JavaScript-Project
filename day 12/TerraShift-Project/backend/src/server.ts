import express from "express";
import cors from "cors";
import { config } from "./config/index.js";
import { publicApiRouter } from "./routes/api.js";

export const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "TerraShift Agricultural Intelligence Backend",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    environment: config.nodeEnv,
  });
});

// API Routes
app.use("/api/public", publicApiRouter);

// Root informational endpoint
app.get("/", (req, res) => {
  res.json({
    message: "TerraShift (Field Shift) Backend - Adapting Farms with NASA & Local Intelligence",
    docs: {
      health: "GET /health",
      satelliteWeather: "GET /api/public/satellite-weather?lat=24.8465&lon=89.3777",
      soilIntelligence: "GET /api/public/soil-intelligence?lat=24.8465&lon=89.3777",
      cropIntelligence: "POST /api/public/crop-intelligence",
      rotationEngine: "POST /api/public/rotation-engine",
    },
  });
});

// Start listening if run directly
if (process.env.NODE_ENV !== "test") {
  app.listen(config.port, () => {
    console.log(`================================================================`);
    console.log(` TerraShift NASA Agricultural AI Backend is running`);
    console.log(` Server Port: http://localhost:${config.port}`);
    console.log(` Health:      http://localhost:${config.port}/health`);
    console.log(` API Base:    http://localhost:${config.port}/api/public`);
    console.log(`================================================================`);
  });
}
