import { Station, SensorReading, RiskAssessment, UserRole, RiskLevel } from './database';

export * from './database';

export interface StationWithMetrics extends Station {
  latest_reading?: SensorReading;
  latest_assessment?: RiskAssessment;
}

export interface OfflineReportQueueItem {
  idempotency_key: string;
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
  created_at: string;
  synced: boolean;
}

export interface SimulationParams {
  station_id: string;
  simulated_rainfall_mm: number;
  simulated_soil_moisture: number;
  simulated_slope_displacement: number;
  duration_hours: number;
}
