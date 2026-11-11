# TerraShift Backend Engine
### Adapting Farms with NASA Earth Observation & Local Intelligence

Production-ready backend service providing automated satellite data ingestion pipelines, scientific fallbacks, and 4 agronomic intelligence engines for agricultural resilience in Bangladesh.

---

## 1. Directory Structure

```text
nasa/
├── backend/                              <-- Standalone Production Backend Service
│   ├── src/
│   │   ├── config/                       <-- Environment & timeout configuration
│   │   ├── types/                        <-- TypeScript types & interfaces
│   │   ├── ingestion/
│   │   │   ├── soilgrids.ts              <-- ISRIC SoilGrids API v2 & USDA textural triangle math
│   │   │   ├── barc-aez.ts               <-- Bangladesh 30 AEZ zones database & district baselines
│   │   │   ├── nasa-power.ts             <-- NASA POWER Agroclimatology (T2M, Radiation, GDD)
│   │   │   ├── smap-openmeteo.ts         <-- NASA SMAP & Open-Meteo Root-Zone Moisture & CWSI
│   │   │   ├── satellite-weather.ts      <-- Weather aggregator & telemetry pipeline
│   │   │   └── cache.ts                  <-- 6-hour In-Memory TTL Cache
│   │   ├── engines/
│   │   │   ├── mcda-recommendation.ts    <-- Engine 1: Explainable Crop Recommendation (XAI)
│   │   │   ├── nitrogen-rotation.ts      <-- Engine 2 & 4: Nitrogen Trajectory & Counterfactual Audit
│   │   │   └── climate-hazard.ts         <-- Engine 3: Deep Climate Hazard Early Warning
│   │   ├── database/
│   │   │   ├── schema.sql                <-- PostgreSQL / Supabase Schema with PostGIS & RLS
│   │   │   └── validation.ts             <-- Zod validation schemas
│   │   ├── controllers/                  <-- Express route controllers
│   │   ├── routes/                       <-- Express router definitions
│   │   ├── tests/
│   │   │   ├── preflight.ts              <-- End-to-end verification script for Bogura, Mymensingh, Barishal
│   │   │   └── engines.test.ts           <-- Unit tests for formulas & biological constraints
│   │   └── server.ts                     <-- Express application entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
└── interactive-map-studio-main/          <-- Frontend (TanStack Start + React 19 + Tailwind CSS)
    └── interactive-map-studio-main/
        ├── src/
        │   ├── backend/                  <-- Shared engine implementation & server functions
        │   ├── routes/                   <-- TanStack Start routes (/advisory, /weather, /rotation, /map)
        │   └── components/               <-- Interactive Map & Bilingual UI
```

---

## 2. Mathematical Formulas & Scientific Models

### A. USDA Soil Texture Triangle Classification
Given `% Sand`, `% Clay`, and `% Silt` (where $\% \text{Silt} = 100 - \text{Sand} - \text{Clay}$):
- **Sand:** $\text{Sand} \ge 85 \land \text{Silt} + 1.5 \times \text{Clay} < 15$
- **Loamy Sand:** $\text{Sand} \in [70, 90] \land \text{Silt} + 1.5 \times \text{Clay} \ge 15 \land \text{Silt} + 2 \times \text{Clay} < 30$
- **Sandy Loam:** $(\text{Clay} \in [7, 20) \land \text{Sand} > 52 \land \text{Silt} + 2 \times \text{Clay} \ge 30) \lor (\text{Clay} < 7 \land \text{Silt} < 50 \land \text{Sand} > 43)$
- **Loam:** $\text{Clay} \in [7, 27) \land \text{Silt} \in [28, 50) \land \text{Sand} \le 52$
- **Silt Loam:** $(\text{Silt} \ge 50 \land \text{Clay} \in [12, 27)) \lor (\text{Silt} \in [50, 80) \land \text{Clay} < 12)$
- **Clay Loam:** $\text{Clay} \in [27, 40) \land \text{Sand} \in (20, 45]$
- **Silty Clay Loam:** $\text{Clay} \in [27, 40) \land \text{Sand} \le 20$
- **Silty Clay:** $\text{Clay} \ge 40 \land \text{Silt} \ge 40$
- **Clay:** $\text{Clay} \ge 40 \land \text{Sand} \le 45 \land \text{Silt} < 40$

### B. Growing Degree Days (GDD)
$$\text{GDD} = \max\left(0, \frac{T_{\max} + T_{\min}}{2} - T_{\text{base}}\right)$$
- Rice: $T_{\text{base}} = 10.0^\circ\text{C}$
- Maize: $T_{\text{base}} = 10.0^\circ\text{C}$
- Potato: $T_{\text{base}} = 7.0^\circ\text{C}$
- Mustard: $T_{\text{base}} = 5.0^\circ\text{C}$

### C. Crop Water Stress Index (CWSI)
$$\text{CWSI} = 1 - \frac{ET_a}{ET_p}$$
Where $ET_a / ET_p$ is modeled as a function of root-zone soil moisture $\theta_{\text{root}}$ (10-40cm):
$$\frac{ET_a}{ET_p} = \max\left(0, \min\left(1, \frac{\theta - \theta_{wp}}{\theta_{fc} - \theta_{wp}}\right)\right)$$
with field capacity $\theta_{fc} \approx 0.40\text{ m}^3/\text{m}^3$ and permanent wilting point $\theta_{wp} \approx 0.14\text{ m}^3/\text{m}^3$.

### D. Soil Nitrogen Dynamics & Fertilizer Conversion
- **Biological Nitrogen Fixation (BNF):** Legumes (Lentil, Mungbean, Chickpea) fix $+40\text{ to }+65\text{ kg N/ha}$.
- **Heavy Feeders:** Boro Rice and Hybrid Maize deplete $-80\text{ to }-120\text{ kg N/ha}$.
- **Urea Equivalence:** $1\text{ kg N} = 2.17\text{ kg Urea}$ ($46\% \text{ N content}$).
- **Fertilizer Financial Savings:** $\text{Savings (BDT)} = \Delta N \times 2.17 \times 27\text{ ৳/kg}$.

---

## 3. API Endpoints

### 1. `GET /api/public/satellite-weather`
**Query Parameters:** `lat={number}&lon={number}`
**Example:** `GET http://localhost:5000/api/public/satellite-weather?lat=24.8465&lon=89.3777`
**Response:**
```json
{
  "location": {
    "lat": 24.8465,
    "lon": 89.3777,
    "district": "Bogura",
    "districtBn": "বগুড়া"
  },
  "currentConditions": {
    "temperature": 26.8,
    "feelsLike": 29.3,
    "humidity": 79,
    "windSpeedKmh": 12,
    "soilMoisture0_10cm": 0.28,
    "soilMoisture10_40cm": 0.32,
    "rootZoneSaturation": 45,
    "cwsi": 0.804
  },
  "sevenDayForecast": [ ... ],
  "hazardAlerts": [ ... ],
  "confidenceScore": 96,
  "sources": [
    "NASA POWER Agroclimatology (CERES/MERRA-2 Satellite Assimilation)",
    "Open-Meteo / NASA SMAP Earth Observation Assimilation",
    "Bangladesh Meteorological Department (BMD) 30-Year Agro-Climatic Baseline"
  ]
}
```

### 2. `GET /api/public/soil-intelligence`
**Query Parameters:** `lat={number}&lon={number}`
**Example:** `GET http://localhost:5000/api/public/soil-intelligence?lat=24.8465&lon=89.3777`
**Response:**
```json
{
  "location": {
    "lat": 24.8465,
    "lon": 89.3777,
    "nearestDistrict": "Bogura",
    "districtBn": "বগুড়া"
  },
  "soilProperties": {
    "ph": 6.4,
    "clayPercentage": 26,
    "sandPercentage": 32,
    "siltPercentage": 42,
    "soilTexture": "Loam",
    "soc": 11.8,
    "cec": 16.5,
    "depth": "0-30cm (topsoil root-zone)",
    "confidence": 88
  },
  "agroEcologicalZone": {
    "aezNumber": 4,
    "aezName": "Karatoya-Bangali Floodplain",
    "aezNameBn": "করতোয়া-বাঙালি প্লাবনভূমি",
    "dominantSoilGroup": "Non-Calcareous Grey Floodplain Soils",
    "salinityRisk": { "level": "None", "rangeECe_dSm": "< 2.0" },
    "floodVulnerability": "Medium"
  }
}
```

### 3. `POST /api/public/crop-intelligence`
**Payload:**
```json
{
  "lat": 24.8465,
  "lon": 89.3777,
  "season": "Rabi"
}
```

### 4. `POST /api/public/rotation-engine`
**Payload:**
```json
{
  "seasons": [
    { "seasonName": "Rabi 2025", "cropId": "potato", "cropName": "Diamond Potato" },
    { "seasonName": "Kharif-1 2026", "cropId": "jute", "cropName": "Tossa Jute" },
    { "seasonName": "Kharif-2 2026", "cropId": "t_aman_rice", "cropName": "T. Aman Rice" },
    { "seasonName": "Rabi 2026", "cropId": "mustard", "cropName": "Mustard" },
    { "seasonName": "Kharif-1 2027", "cropId": "mungbean", "cropName": "Mungbean" }
  ]
}
```

---

## 4. How to Run & Verify

```bash
# 1. Navigate to backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Run Pre-flight Verification Script (Bogura, Mymensingh, Barishal)
npm run test:preflight

# 4. Run Core Intelligence Engine Unit Tests
npm run test:engines

# 5. Build for production
npm run build

# 6. Start the production backend server
npm start
# Server listens on http://localhost:5000
```
