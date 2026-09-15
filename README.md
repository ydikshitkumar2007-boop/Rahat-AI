# RAHAT AI — Landslide Early Warning & Disaster Intelligence System

**RAHAT AI** is an AI-powered, offline-first disaster intelligence platform designed for landslide risk monitoring, telemetry analysis, and automated early warning broadcast across Northeast India (Meghalaya, Sikkim, Assam, Mizoram, Nagaland, Arunachal Pradesh, Manipur, Tripura).

---

## 🤖 Step 4: Prototype ML-Assisted Landslide Risk Estimator

RAHAT AI integrates a lightweight, reproducible **Prototype ML-Assisted Landslide Risk Estimator** alongside live weather data and simulated terrain telemetry.

### ⚠️ Truthfulness & Safety Notice
- **Decision Support Only**: Risk outputs are relative decision-support metrics, not guaranteed predictions or certified emergency alerts.
- **Data Labeling**: Weather metrics are labeled **"Live Weather Data"** (Open-Meteo API); terrain parameters are labeled **"Simulated Telemetry"**.
- **Alert Staging**: Alerts indicate *"Alert staged for nearby demo-zone users"* (no real SMS, WhatsApp, or external emergency notifications are sent).

---

## 📊 ML Model Training & Evaluation Metrics

- **Training Script**: `python scripts/train_landslide_model.py` or `npm run train:ml`
- **Synthetic Dataset**: 3,000 deterministic records generated with fixed seed `42`.
- **Model Architecture**: Decision Tree Regressor (max_depth=6).
- **Artifact Paths**:
  - Model Artifact: `public/models/landslide_ml_model.json`
  - Evaluation Report: `public/models/landslide_ml_evaluation.json`
- **Synthetic Test Evaluation Metrics**:
  - **MAE**: 5.79
  - **RMSE**: 7.15
  - **Classification Accuracy**: 71.83%
  - *(Note: Metrics evaluated on synthetic dataset; not calibrated for real emergency response)*

---

## 🛠️ Database Setup (Supabase / PostgreSQL)

Copy and run these migration scripts in the Supabase SQL Editor:
1. `supabase/migrations/20260911000000_initial_schema.sql` (Core tables & RLS)
2. `supabase/migrations/20260912000000_virtual_weather_stations.sql` (Virtual Weather Stations)
3. `supabase/migrations/20260915000000_extend_risk_assessments_ml.sql` (ML Risk Fields)
4. `supabase/seed/seed.sql` (NE India Seed Data)

---

## 🧪 Manual Demo Test Scenarios

1. **Normal Scenario Test**:
   - Open `/admin/stations` or `/admin/simulation`. Select **Scenario: Normal**.
   - Result: Final Demo Risk Score ~10–25 (**Low Risk**).
2. **Heavy Rain Scenario Test**:
   - Select **Scenario: Heavy Rain**.
   - Result: Final Demo Risk Score ~60–75 (**High Risk**).
3. **Extreme Rain Scenario Test**:
   - Select **Scenario: Extreme Rain**.
   - Result: Final Demo Risk Score ~85–95 (**Severe Risk**).

---

## 📦 How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Run ML Training Script (Optional - pre-built artifact provided)
npm run train:ml

# 3. Start development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
