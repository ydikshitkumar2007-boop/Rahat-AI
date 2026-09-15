import { WeatherStation, StationReading, SimulationScenario } from '@/types';

export interface GeocodeLocation {
  id: number;
  name: string;
  admin1: string;
  country: string;
  latitude: number;
  longitude: number;
  elevation: number;
}

export interface LiveWeatherData {
  live_temperature_c: number | null;
  live_relative_humidity: number | null;
  live_precipitation_mm: number;
  live_wind_speed_kmh: number;
  live_weather_code: number;
  forecast_rain_next_6h_mm: number;
  timestamp: string;
}

export interface RiskEvaluationResult {
  risk_score: number; // 0 - 100
  risk_level: 'low' | 'moderate' | 'high' | 'severe';
  primary_trigger: string;
  ai_summary: string;
  recommended_action: string;
}

export const DEMO_VIRTUAL_STATIONS: WeatherStation[] = [
  {
    id: 'ws-01',
    name: 'Sohra Cliff Monitoring Station',
    location_name: 'Cherrapunji, Meghalaya',
    latitude: 25.2986,
    longitude: 91.7321,
    terrain_vulnerability: 85,
    is_active: true,
    is_demo: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'ws-02',
    name: 'Gangtok East Pass Virtual Station',
    location_name: 'Gangtok, Sikkim',
    latitude: 27.3389,
    longitude: 88.6138,
    terrain_vulnerability: 75,
    is_active: true,
    is_demo: true,
    created_at: '2026-01-02T00:00:00Z',
    updated_at: '2026-01-02T00:00:00Z',
  },
  {
    id: 'ws-03',
    name: 'Aizawl Slope Incline Virtual Station',
    location_name: 'Aizawl, Mizoram',
    latitude: 23.7271,
    longitude: 92.7176,
    terrain_vulnerability: 80,
    is_active: true,
    is_demo: true,
    created_at: '2026-01-03T00:00:00Z',
    updated_at: '2026-01-03T00:00:00Z',
  },
];

export async function searchLocation(query: string): Promise<GeocodeLocation[]> {
  try {
    const res = await fetch(`/api/weather/geocode?name=${encodeURIComponent(query)}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || [];
  } catch {
    return [];
  }
}

export async function fetchLiveWeather(lat: number, lng: number): Promise<LiveWeatherData | null> {
  try {
    const res = await fetch(`/api/weather/forecast?lat=${lat}&lng=${lng}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.weather || null;
  } catch {
    return null;
  }
}

export function calculateRiskScore(
  terrainVulnerability: number, // 0-100
  livePrecipitationMm: number,
  forecastRainNext6hMm: number,
  simulatedSoilSaturationPct: number, // 0-100
  simulatedSlopeDisplacementMm: number, // >=0
  simulatedVibrationScore: number // 0-100
): RiskEvaluationResult {
  // 1. Terrain Vulnerability Contribution (20%)
  const terrainContribution = (terrainVulnerability / 100) * 20;

  // 2. Weather Rain Contribution (35%)
  const totalRain = livePrecipitationMm * 2 + forecastRainNext6hMm * 1.5;
  const rainContribution = Math.min(35, (totalRain / 50) * 35);

  // 3. Soil Saturation Contribution (25%)
  const saturationContribution = (simulatedSoilSaturationPct / 100) * 25;

  // 4. Slope Movement Contribution (20%)
  const displacementScore = Math.min(100, (simulatedSlopeDisplacementMm / 5) * 100);
  const movementContribution = ((displacementScore * 0.6 + simulatedVibrationScore * 0.4) / 100) * 20;

  const rawScore = terrainContribution + rainContribution + saturationContribution + movementContribution;
  const risk_score = Math.min(100, Math.max(0, Math.round(rawScore)));

  let risk_level: 'low' | 'moderate' | 'high' | 'severe' = 'low';
  if (risk_score >= 80) risk_level = 'severe';
  else if (risk_score >= 60) risk_level = 'high';
  else if (risk_score >= 35) risk_level = 'moderate';

  let primary_trigger = 'Stable baseline parameters';
  if (totalRain > 25) primary_trigger = `Heavy precipitation & forecast rain (${forecastRainNext6hMm}mm/6h)`;
  else if (simulatedSoilSaturationPct > 75) primary_trigger = `High soil saturation (${simulatedSoilSaturationPct}%)`;
  else if (simulatedSlopeDisplacementMm > 3) primary_trigger = `Accelerated slope displacement (${simulatedSlopeDisplacementMm}mm)`;

  let ai_summary = `AI-Assisted Risk Score evaluated at ${risk_score}/100. Combined parameters indicate ${risk_level} threat level for monitored hillside slope.`;
  let recommended_action = 'Maintain standard automated monitoring telemetry intervals.';

  if (risk_level === 'severe') {
    recommended_action = 'High threat level detected. Advise immediate field inspection and restrict vehicular traffic on vulnerable cuts.';
  } else if (risk_level === 'high') {
    recommended_action = 'Issue high alert bulletin to local SDRF field operators and monitor drainage channels.';
  }

  return {
    risk_score,
    risk_level,
    primary_trigger,
    ai_summary,
    recommended_action,
  };
}

export function generateSimulatedTelemetry(scenario: SimulationScenario): {
  simulated_soil_saturation_pct: number;
  simulated_slope_displacement_mm: number;
  simulated_vibration_score: number;
} {
  switch (scenario) {
    case 'extreme_rain':
      return {
        simulated_soil_saturation_pct: 92.5,
        simulated_slope_displacement_mm: 4.8,
        simulated_vibration_score: 85.0,
      };
    case 'heavy_rain':
      return {
        simulated_soil_saturation_pct: 78.0,
        simulated_slope_displacement_mm: 2.9,
        simulated_vibration_score: 55.0,
      };
    case 'normal':
    default:
      return {
        simulated_soil_saturation_pct: 42.0,
        simulated_slope_displacement_mm: 0.4,
        simulated_vibration_score: 12.0,
      };
  }
}
