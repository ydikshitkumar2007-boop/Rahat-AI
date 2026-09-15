-- Idempotent Migration: Virtual Weather Stations & Station Readings Schema

-- 1. Create public.weather_stations Table
CREATE TABLE IF NOT EXISTS public.weather_stations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location_name TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  terrain_vulnerability INTEGER NOT NULL DEFAULT 60 CHECK (terrain_vulnerability BETWEEN 0 AND 100),
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_demo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create public.station_readings Table
CREATE TABLE IF NOT EXISTS public.station_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id UUID NOT NULL REFERENCES public.weather_stations(id) ON DELETE CASCADE,
  observed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  live_temperature_c DOUBLE PRECISION,
  live_relative_humidity DOUBLE PRECISION,
  live_precipitation_mm DOUBLE PRECISION,
  live_wind_speed_kmh DOUBLE PRECISION,
  live_weather_code INTEGER,
  forecast_rain_next_6h_mm DOUBLE PRECISION,
  simulated_soil_saturation_pct DOUBLE PRECISION NOT NULL CHECK (simulated_soil_saturation_pct BETWEEN 0 AND 100),
  simulated_slope_displacement_mm DOUBLE PRECISION NOT NULL CHECK (simulated_slope_displacement_mm >= 0),
  simulated_vibration_score DOUBLE PRECISION NOT NULL CHECK (simulated_vibration_score BETWEEN 0 AND 100),
  scenario TEXT NOT NULL CHECK (scenario IN ('normal', 'heavy_rain', 'extreme_rain', 'manual')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create / Ensure public.risk_assessments Table supports virtual weather stations
CREATE TABLE IF NOT EXISTS public.risk_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_reading_id UUID REFERENCES public.station_readings(id) ON DELETE CASCADE,
  station_id UUID REFERENCES public.weather_stations(id) ON DELETE CASCADE,
  risk_score INTEGER NOT NULL CHECK (risk_score BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add Indexing
CREATE INDEX IF NOT EXISTS idx_weather_stations_active ON public.weather_stations(is_active);
CREATE INDEX IF NOT EXISTS idx_station_readings_station_time ON public.station_readings(station_id, observed_at DESC);

-- Enable RLS
ALTER TABLE public.weather_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.station_readings ENABLE ROW LEVEL SECURITY;

-- Add RLS Policies
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Weather stations readable by everyone'
  ) THEN
    CREATE POLICY "Weather stations readable by everyone" ON public.weather_stations FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Station readings readable by everyone'
  ) THEN
    CREATE POLICY "Station readings readable by everyone" ON public.station_readings FOR SELECT USING (true);
  END IF;
END $$;
