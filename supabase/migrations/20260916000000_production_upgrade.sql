-- ============================================================================
-- RAHAT AI PRODUCTION UPGRADE MIGRATION
-- File: 20260916000000_production_upgrade.sql
-- Idempotent schema evolution for Landslide Hazard Nowcast & Decision Support
-- ============================================================================

-- 1. Extend weather_stations table with static terrain susceptibility & operating mode
ALTER TABLE public.weather_stations
  ADD COLUMN IF NOT EXISTS operating_mode TEXT DEFAULT 'live_decision_support' CHECK (operating_mode IN ('live_decision_support', 'simulation')),
  ADD COLUMN IF NOT EXISTS slope_deg NUMERIC DEFAULT 25.0,
  ADD COLUMN IF NOT EXISTS elevation_m NUMERIC DEFAULT 1000.0,
  ADD COLUMN IF NOT EXISTS aspect_deg NUMERIC DEFAULT 180.0,
  ADD COLUMN IF NOT EXISTS geology_class TEXT DEFAULT 'Unconsolidated Metamorphic Rock',
  ADD COLUMN IF NOT EXISTS landcover_class TEXT DEFAULT 'Mixed Forest',
  ADD COLUMN IF NOT EXISTS distance_to_road_m NUMERIC DEFAULT 150.0,
  ADD COLUMN IF NOT EXISTS distance_to_fault_m NUMERIC DEFAULT 400.0,
  ADD COLUMN IF NOT EXISTS historical_susceptibility_score NUMERIC DEFAULT 65.0 CHECK (historical_susceptibility_score BETWEEN 0 AND 100),
  ADD COLUMN IF NOT EXISTS data_quality_score NUMERIC DEFAULT 90.0 CHECK (data_quality_score BETWEEN 0 AND 100),
  ADD COLUMN IF NOT EXISTS metadata_provenance TEXT DEFAULT 'Regional Topographic Survey';

-- 2. Extend station_readings / weather_observations with multi-window precipitation & data freshness
ALTER TABLE public.station_readings
  ADD COLUMN IF NOT EXISTS precipitation_1h_mm NUMERIC DEFAULT 0.0,
  ADD COLUMN IF NOT EXISTS precipitation_3h_mm NUMERIC DEFAULT 0.0,
  ADD COLUMN IF NOT EXISTS precipitation_6h_mm NUMERIC DEFAULT 0.0,
  ADD COLUMN IF NOT EXISTS precipitation_24h_mm NUMERIC DEFAULT 0.0,
  ADD COLUMN IF NOT EXISTS precipitation_72h_mm NUMERIC DEFAULT 0.0,
  ADD COLUMN IF NOT EXISTS precipitation_7d_mm NUMERIC DEFAULT 0.0,
  ADD COLUMN IF NOT EXISTS forecast_rain_24h_mm NUMERIC DEFAULT 0.0,
  ADD COLUMN IF NOT EXISTS forecast_rain_72h_mm NUMERIC DEFAULT 0.0,
  ADD COLUMN IF NOT EXISTS provider_name TEXT DEFAULT 'Open-Meteo Weather API',
  ADD COLUMN IF NOT EXISTS freshness_status TEXT DEFAULT 'online' CHECK (freshness_status IN ('online', 'degraded', 'unavailable', 'stale')),
  ADD COLUMN IF NOT EXISTS provider_error_state TEXT,
  ADD COLUMN IF NOT EXISTS raw_payload_summary JSONB DEFAULT '{}'::jsonb;

-- 3. Create Model Registry table for tracking candidate & approved ML models
CREATE TABLE IF NOT EXISTS public.model_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version TEXT UNIQUE NOT NULL,
  algorithm TEXT NOT NULL,
  model_card JSONB NOT NULL DEFAULT '{}'::jsonb,
  training_dataset_summary JSONB NOT NULL DEFAULT '{}'::jsonb,
  metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
  approval_status TEXT NOT NULL DEFAULT 'candidate' CHECK (approval_status IN ('candidate', 'approved', 'archived')),
  artifact_uri TEXT NOT NULL,
  approved_by UUID REFERENCES public.profiles(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Extend virtual_risk_assessments with uncertainty, feature importances & nowcast terminology
ALTER TABLE public.virtual_risk_assessments
  ADD COLUMN IF NOT EXISTS hazard_nowcast_category TEXT DEFAULT 'low' CHECK (hazard_nowcast_category IN ('low', 'moderate', 'high', 'severe')),
  ADD COLUMN IF NOT EXISTS confidence_score NUMERIC DEFAULT 85.0 CHECK (confidence_score BETWEEN 0 AND 100),
  ADD COLUMN IF NOT EXISTS uncertainty_score NUMERIC DEFAULT 15.0 CHECK (uncertainty_score BETWEEN 0 AND 100),
  ADD COLUMN IF NOT EXISTS operating_mode TEXT DEFAULT 'live_decision_support' CHECK (operating_mode IN ('live_decision_support', 'simulation')),
  ADD COLUMN IF NOT EXISTS feature_importances JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS data_quality_status TEXT DEFAULT 'verified';

-- 5. Extend alerts table for lifecycle governance (draft -> staged -> acknowledged -> resolved)
ALTER TABLE public.alerts
  ADD COLUMN IF NOT EXISTS lifecycle_status TEXT DEFAULT 'staged' CHECK (lifecycle_status IN ('draft', 'staged', 'acknowledged', 'resolved')),
  ADD COLUMN IF NOT EXISTS admin_approved_by UUID REFERENCES public.profiles(id),
  ADD COLUMN IF NOT EXISTS admin_approved_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS staging_notes TEXT DEFAULT 'Staged for decision support review';

-- 6. Indexes for queries
CREATE INDEX IF NOT EXISTS idx_station_readings_station_observed ON public.station_readings(station_id, observed_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_lifecycle_status ON public.alerts(lifecycle_status, severity);
CREATE INDEX IF NOT EXISTS idx_model_registry_approval ON public.model_registry(approval_status, created_at DESC);

-- 7. Row Level Security Policies
ALTER TABLE public.model_registry ENABLE ROW LEVEL SECURITY;

-- Model Registry: Public Read, Admin Write
CREATE POLICY "Model Registry read for all authenticated users"
  ON public.model_registry FOR SELECT
  USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

CREATE POLICY "Admin write Model Registry"
  ON public.model_registry FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Seed initial baseline model into Model Registry
INSERT INTO public.model_registry (
  version,
  algorithm,
  model_card,
  training_dataset_summary,
  metrics,
  approval_status,
  artifact_uri
)
VALUES (
  'v1.0.0-synthetic-dt',
  'DecisionTreeClassifier (Baseline Prototype)',
  '{
    "intended_use": "Hackathon Demonstration & Decision Support Baseline",
    "excluded_use": "Not calibrated for certified emergency response",
    "limitations": "Trained on synthetic topographic and precipitation distributions"
  }'::jsonb,
  '{
    "source": "Synthetic Topographic Telemetry Generator",
    "samples": 3000,
    "features": ["rainfall_24h_mm", "forecast_rain_next_6h_mm", "simulated_soil_saturation_pct", "terrain_vulnerability"]
  }'::jsonb,
  '{
    "mae": 5.79,
    "rmse": 7.15,
    "accuracy_pct": 71.83
  }'::jsonb,
  'candidate',
  '/models/landslide_ml_model.json'
)
ON CONFLICT (version) DO NOTHING;
