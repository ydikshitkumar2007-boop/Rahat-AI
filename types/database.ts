export type UserRole = 'admin' | 'field_operator' | 'citizen';
export type StationStatus = 'online' | 'offline' | 'maintenance' | 'degraded';
export type RiskLevel = 'low' | 'moderate' | 'high' | 'severe';
export type HazardNowcastCategory = 'low' | 'moderate' | 'high' | 'severe';
export type ReportVerificationStatus = 'pending' | 'verified' | 'rejected' | 'investigating';
export type SimulationScenario = 'normal' | 'heavy_rain' | 'extreme_rain' | 'manual';
export type OperatingMode = 'live_decision_support' | 'simulation';
export type ModelApprovalStatus = 'candidate' | 'approved' | 'archived';
export type AlertLifecycleStatus = 'draft' | 'staged' | 'acknowledged' | 'resolved';

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  organization?: string;
  state?: string;
  created_at: string;
  updated_at: string;
}

export interface Station {
  id: string;
  code: string;
  name: string;
  state: string;
  district: string;
  latitude: number;
  longitude: number;
  elevation_m?: number;
  status: StationStatus;
  risk_level: RiskLevel;
  installation_date?: string;
  last_ping: string;
  created_at: string;
}

export interface WeatherStation {
  id: string;
  name: string;
  location_name: string;
  latitude: number;
  longitude: number;
  terrain_vulnerability: number; // 0-100
  is_active: boolean;
  is_demo: boolean;
  operating_mode?: OperatingMode;
  slope_deg?: number;
  elevation_m?: number;
  geology_class?: string;
  distance_to_road_m?: number;
  historical_susceptibility_score?: number;
  data_quality_score?: number;
  metadata_provenance?: string;
  created_at: string;
  updated_at: string;
}

export interface StationReading {
  id: string;
  station_id: string;
  observed_at: string;
  live_temperature_c?: number;
  live_relative_humidity?: number;
  live_precipitation_mm?: number;
  live_wind_speed_kmh?: number;
  live_weather_code?: number;
  forecast_rain_next_6h_mm?: number;
  precipitation_1h_mm?: number;
  precipitation_3h_mm?: number;
  precipitation_6h_mm?: number;
  precipitation_24h_mm?: number;
  precipitation_72h_mm?: number;
  precipitation_7d_mm?: number;
  forecast_rain_24h_mm?: number;
  forecast_rain_72h_mm?: number;
  provider_name?: string;
  freshness_status?: 'online' | 'degraded' | 'unavailable' | 'stale';
  simulated_soil_saturation_pct: number; // 0-100
  simulated_slope_displacement_mm: number; // >= 0
  simulated_vibration_score: number; // 0-100
  scenario: SimulationScenario;
  created_at: string;
}

export interface VirtualRiskAssessment {
  id: string;
  station_reading_id: string;
  station_id: string;
  risk_score: number; // 0-100
  hazard_nowcast_category?: HazardNowcastCategory;
  confidence_score?: number;
  uncertainty_score?: number;
  operating_mode?: OperatingMode;
  model_version?: string;
  model_mode?: 'prototype_ml' | 'rule_based_fallback';
  ml_risk_score?: number;
  rule_based_risk_score?: number;
  contributing_factors?: string[];
  simulation_disclaimer?: string;
  feature_importances?: Record<string, number>;
  data_quality_status?: string;
  created_at: string;
}

export interface SensorReading {
  id: string;
  station_id: string;
  rainfall_mm: number;
  rainfall_24h_mm: number;
  soil_moisture_pct: number;
  slope_tilt_deg: number;
  temperature_c?: number;
  humidity_pct?: number;
  pore_water_pressure_kpa?: number;
  recorded_at: string;
  created_at: string;
}

export interface WeatherSnapshot {
  id: string;
  station_id?: string;
  location_name: string;
  latitude: number;
  longitude: number;
  forecast_rainfall_24h_mm: number;
  wind_speed_kmh: number;
  weather_condition: string;
  captured_at: string;
}

export interface RiskAssessment {
  id: string;
  station_id: string;
  risk_score: number;
  risk_level: RiskLevel;
  primary_trigger: string;
  landslide_probability: number;
  ai_summary?: string;
  recommended_action?: string;
  model_version?: string;
  model_mode?: 'prototype_ml' | 'rule_based_fallback';
  ml_risk_score?: number;
  rule_based_risk_score?: number;
  contributing_factors?: string[];
  simulation_disclaimer?: string;
  assessed_at: string;
}

export interface CitizenReport {
  id: string;
  idempotency_key: string;
  user_id?: string;
  reporter_name: string;
  reporter_role: UserRole;
  state: string;
  district: string;
  location_description: string;
  latitude: number;
  longitude: number;
  hazard_type: string;
  severity: RiskLevel;
  description: string;
  verification_status: ReportVerificationStatus;
  verified_by?: string;
  sync_source: string;
  created_at: string;
}

export interface ReportMedia {
  id: string;
  report_id: string;
  media_url: string;
  media_type: string;
  created_at: string;
}

export interface Alert {
  id: string;
  station_id?: string;
  alert_code: string;
  title: string;
  severity: RiskLevel;
  affected_areas: string[];
  advisory_text: string;
  recommended_action: string;
  issued_by: string;
  issued_at: string;
  expires_at: string;
  status: 'active' | 'resolved' | 'cancelled';
  lifecycle_status?: AlertLifecycleStatus;
  admin_approved_by?: string;
  admin_approved_at?: string;
  nearby_audience?: string;
  staging_status?: string;
  staging_notes?: string;
}

export interface ModelRegistryEntry {
  id: string;
  version: string;
  algorithm: string;
  model_card: {
    intended_use: string;
    excluded_use: string;
    limitations: string;
    data_sources?: string[];
  };
  training_dataset_summary: {
    source: string;
    samples: number;
    features: string[];
  };
  metrics: {
    mae?: number;
    rmse?: number;
    accuracy_pct?: number;
    precision?: number;
    recall?: number;
    f1_score?: number;
    roc_auc?: number;
    false_negative_rate?: number;
    false_positive_rate?: number;
  };
  approval_status: ModelApprovalStatus;
  artifact_uri: string;
  approved_by?: string;
  approved_at?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: Record<string, any>;
  ip_address?: string;
  created_at: string;
}
