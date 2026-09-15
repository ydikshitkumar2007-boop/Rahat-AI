import { IWeatherProvider, WeatherObservation, ProviderHealthStatus } from './types';

export class OpenMeteoAdapter implements IWeatherProvider {
  name = 'Open-Meteo Weather API';
  private lastHealth: ProviderHealthStatus = {
    providerName: 'Open-Meteo Weather API',
    status: 'online',
    lastSuccessfulUpdate: null,
    latencyMs: null,
    errorMessage: null,
    freshnessSeconds: null,
  };

  async fetchCurrentAndForecast(lat: number, lon: number): Promise<WeatherObservation> {
    const startTime = Date.now();
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code&hourly=precipitation,temperature_2m&forecast_days=7&timezone=auto`;

    try {
      const response = await fetch(url, { next: { revalidate: 300 } });
      const latencyMs = Date.now() - startTime;

      if (!response.ok) {
        throw new Error(`Open-Meteo HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const current = data.current || {};
      const hourly = data.hourly || {};
      const hourlyPrecip: number[] = hourly.precipitation || [];
      const hourlyTimes: string[] = hourly.time || [];

      // Calculate accumulated precipitation windows from hourly forecast data
      const now = new Date();
      const currentIdx = hourlyTimes.findIndex((t) => new Date(t) >= now) || 0;
      const validIdx = currentIdx >= 0 ? currentIdx : 0;

      const sumPrecip = (start: number, end: number) => {
        const slice = hourlyPrecip.slice(Math.max(0, start), Math.min(hourlyPrecip.length, end));
        return Math.round(slice.reduce((acc, v) => acc + (v || 0), 0) * 10) / 10;
      };

      const precip1h = current.precipitation ?? sumPrecip(validIdx, validIdx + 1);
      const precip3h = sumPrecip(validIdx, validIdx + 3);
      const precip6h = sumPrecip(validIdx, validIdx + 6);
      const precip24h = sumPrecip(validIdx, validIdx + 24);
      const precip72h = sumPrecip(validIdx, validIdx + 72);
      const precip7d = sumPrecip(validIdx, validIdx + 168);

      const forecast6h = sumPrecip(validIdx, validIdx + 6);
      const forecast24h = sumPrecip(validIdx, validIdx + 24);
      const forecast72h = sumPrecip(validIdx, validIdx + 72);

      const observedAt = current.time || new Date().toISOString();
      const fetchedAt = new Date().toISOString();

      this.lastHealth = {
        providerName: this.name,
        status: 'online',
        lastSuccessfulUpdate: fetchedAt,
        latencyMs,
        errorMessage: null,
        freshnessSeconds: Math.round((new Date(fetchedAt).getTime() - new Date(observedAt).getTime()) / 1000),
      };

      return {
        providerName: this.name,
        stationId: `lat${lat}_lon${lon}`,
        latitude: lat,
        longitude: lon,
        observedAt,
        fetchedAt,
        temperatureC: current.temperature_2m ?? 22,
        relativeHumidityPct: current.relative_humidity_2m ?? 75,
        windSpeedKmh: current.wind_speed_10m ?? 12,
        weatherCode: current.weather_code ?? 0,
        weatherCondition: this.interpretWeatherCode(current.weather_code ?? 0),
        precipitation_1h_mm: Math.max(0, precip1h),
        precipitation_3h_mm: Math.max(0, precip3h),
        precipitation_6h_mm: Math.max(0, precip6h),
        precipitation_24h_mm: Math.max(0, precip24h),
        precipitation_72h_mm: Math.max(0, precip72h),
        precipitation_7d_mm: Math.max(0, precip7d),
        forecast_rain_6h_mm: Math.max(0, forecast6h),
        forecast_rain_24h_mm: Math.max(0, forecast24h),
        forecast_rain_72h_mm: Math.max(0, forecast72h),
        freshnessStatus: 'online',
        rawSourceSummary: {
          timezone: data.timezone,
          elevation: data.elevation,
        },
      };
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to fetch weather data';
      this.lastHealth = {
        providerName: this.name,
        status: 'degraded',
        lastSuccessfulUpdate: this.lastHealth.lastSuccessfulUpdate,
        latencyMs: null,
        errorMessage,
        freshnessSeconds: null,
      };
      throw err;
    }
  }

  async getHealth(): Promise<ProviderHealthStatus> {
    return this.lastHealth;
  }

  private interpretWeatherCode(code: number): string {
    if (code === 0) return 'Clear Sky';
    if (code >= 1 && code <= 3) return 'Partly Cloudy';
    if (code >= 51 && code <= 67) return 'Rain / Drizzle';
    if (code >= 80 && code <= 82) return 'Heavy Rain Showers';
    if (code >= 95) return 'Thunderstorm';
    return 'Moderate Weather';
  }
}
