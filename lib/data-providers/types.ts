export type ProviderStatus = 'online' | 'degraded' | 'unavailable' | 'stale';
export type OperatingMode = 'live_decision_support' | 'simulation';
export type ModelApprovalStatus = 'candidate' | 'approved' | 'archived';

export interface ProviderHealthStatus {
  providerName: string;
  status: ProviderStatus;
  lastSuccessfulUpdate: string | null;
  latencyMs: number | null;
  errorMessage: string | null;
  freshnessSeconds: number | null;
}

export interface AccumulatedPrecipitation {
  precipitation_1h_mm: number;
  precipitation_3h_mm: number;
  precipitation_6h_mm: number;
  precipitation_24h_mm: number;
  precipitation_72h_mm: number;
  precipitation_7d_mm: number;
  forecast_rain_6h_mm: number;
  forecast_rain_24h_mm: number;
  forecast_rain_72h_mm: number;
}

export interface WeatherObservation extends AccumulatedPrecipitation {
  providerName: string;
  stationId: string;
  latitude: number;
  longitude: number;
  observedAt: string;
  fetchedAt: string;
  temperatureC: number;
  relativeHumidityPct: number;
  windSpeedKmh: number;
  weatherCode: number;
  weatherCondition: string;
  freshnessStatus: ProviderStatus;
  rawSourceSummary?: Record<string, any>;
}

export interface TerrainSusceptibilityMetadata {
  stationId: string;
  slopeDeg: number;
  elevationM: number;
  aspectDeg?: number;
  geologyClass: string;
  landcoverClass?: string;
  distanceToRoadM?: number;
  distanceToFaultM?: number;
  drainageDensity?: number;
  historicalSusceptibilityScore: number; // 0-100
  dataQualityScore: number; // 0-100
  provenance: string;
}

export interface IWeatherProvider {
  name: string;
  fetchCurrentAndForecast(lat: number, lon: number): Promise<WeatherObservation>;
  getHealth(): Promise<ProviderHealthStatus>;
}

export interface IEnvironmentProvider {
  getTerrainMetadata(stationId: string, lat: number, lon: number): Promise<TerrainSusceptibilityMetadata>;
}
