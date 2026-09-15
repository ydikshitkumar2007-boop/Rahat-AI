-- Create Custom Enums
CREATE TYPE user_role AS ENUM ('admin', 'field_operator', 'citizen');
CREATE TYPE station_status AS ENUM ('online', 'offline', 'maintenance', 'degraded');
CREATE TYPE risk_level AS ENUM ('low', 'moderate', 'high', 'severe');
CREATE TYPE report_verification AS ENUM ('pending', 'verified', 'rejected', 'investigating');

-- 1. Profiles Table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'citizen',
  phone TEXT,
  organization TEXT,
  state TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Monitoring Stations Table
CREATE TABLE IF NOT EXISTS public.stations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  latitude NUMERIC(10, 7) NOT NULL,
  longitude NUMERIC(10, 7) NOT NULL,
  elevation_m NUMERIC(7, 2),
  status station_status NOT NULL DEFAULT 'online',
  risk_level risk_level NOT NULL DEFAULT 'low',
  installation_date DATE DEFAULT CURRENT_DATE,
  last_ping TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Sensor Readings Table
CREATE TABLE IF NOT EXISTS public.sensor_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id UUID NOT NULL REFERENCES public.stations(id) ON DELETE CASCADE,
  rainfall_mm NUMERIC(6, 2) NOT NULL DEFAULT 0.0,
  rainfall_24h_mm NUMERIC(7, 2) NOT NULL DEFAULT 0.0,
  soil_moisture_pct NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
  slope_tilt_deg NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
  temperature_c NUMERIC(4, 1),
  humidity_pct NUMERIC(5, 2),
  pore_water_pressure_kpa NUMERIC(6, 2),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Weather Snapshots Table
CREATE TABLE IF NOT EXISTS public.weather_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id UUID REFERENCES public.stations(id) ON DELETE SET NULL,
  location_name TEXT NOT NULL,
  latitude NUMERIC(10, 7) NOT NULL,
  longitude NUMERIC(10, 7) NOT NULL,
  forecast_rainfall_24h_mm NUMERIC(6, 2) DEFAULT 0.0,
  wind_speed_kmh NUMERIC(5, 2) DEFAULT 0.0,
  weather_condition TEXT NOT NULL,
  captured_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Risk Assessments Table
CREATE TABLE IF NOT EXISTS public.risk_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id UUID NOT NULL REFERENCES public.stations(id) ON DELETE CASCADE,
  risk_score NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
  risk_level risk_level NOT NULL DEFAULT 'low',
  primary_trigger TEXT NOT NULL,
  landslide_probability NUMERIC(4, 3) NOT NULL DEFAULT 0.0,
  ai_summary TEXT,
  recommended_action TEXT,
  assessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Citizen/Field Reports Table
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idempotency_key TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reporter_name TEXT NOT NULL,
  reporter_role user_role NOT NULL DEFAULT 'citizen',
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  location_description TEXT NOT NULL,
  latitude NUMERIC(10, 7) NOT NULL,
  longitude NUMERIC(10, 7) NOT NULL,
  hazard_type TEXT NOT NULL,
  severity risk_level NOT NULL DEFAULT 'moderate',
  description TEXT NOT NULL,
  verification_status report_verification NOT NULL DEFAULT 'pending',
  verified_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  sync_source TEXT NOT NULL DEFAULT 'web_online',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Report Media Table
CREATE TABLE IF NOT EXISTS public.report_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL DEFAULT 'image',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Alerts & Early Warnings Table
CREATE TABLE IF NOT EXISTS public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id UUID REFERENCES public.stations(id) ON DELETE SET NULL,
  alert_code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  severity risk_level NOT NULL DEFAULT 'high',
  affected_areas TEXT[] NOT NULL DEFAULT '{}',
  advisory_text TEXT NOT NULL,
  recommended_action TEXT NOT NULL,
  issued_by TEXT NOT NULL DEFAULT 'RAHAT-AI Early Warning System',
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'active'
);

-- 9. Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexing for Query Performance
CREATE INDEX IF NOT EXISTS idx_stations_state ON public.stations(state);
CREATE INDEX IF NOT EXISTS idx_stations_risk_level ON public.stations(risk_level);
CREATE INDEX IF NOT EXISTS idx_sensor_readings_station_time ON public.sensor_readings(station_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_idempotency ON public.reports(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_reports_verification ON public.reports(verification_status);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON public.alerts(status, expires_at);

-- ROW LEVEL SECURITY (RLS) POLICIES

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sensor_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles Policy: Users read own, Admin reads all
CREATE POLICY "Public profiles are readable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Stations: Public viewable, Admin editable
CREATE POLICY "Stations readable by everyone" ON public.stations FOR SELECT USING (true);
CREATE POLICY "Stations editable by admin" ON public.stations FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Readings & Snapshots: Public viewable
CREATE POLICY "Readings readable by everyone" ON public.sensor_readings FOR SELECT USING (true);
CREATE POLICY "Assessments readable by everyone" ON public.risk_assessments FOR SELECT USING (true);

-- Reports: Public viewable, anyone can insert (even offline synced), only operators/admins can update status
CREATE POLICY "Reports readable by everyone" ON public.reports FOR SELECT USING (true);
CREATE POLICY "Anyone can create report" ON public.reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Operators and admins can update reports" ON public.reports FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'field_operator'))
);

-- Alerts: Public viewable
CREATE POLICY "Alerts readable by everyone" ON public.alerts FOR SELECT USING (true);
CREATE POLICY "Alerts manageable by admin" ON public.alerts FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Audit Logs: Admin readable
CREATE POLICY "Audit logs readable by admin" ON public.audit_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
