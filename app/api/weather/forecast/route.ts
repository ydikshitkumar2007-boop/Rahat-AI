import { NextRequest, NextResponse } from 'next/server';
import { OpenMeteoAdapter } from '@/lib/data-providers/weather-provider';
import { providerHealthTracker } from '@/lib/data-providers/provider-health';

const adapter = new OpenMeteoAdapter();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const latStr = searchParams.get('lat');
    const lngStr = searchParams.get('lng');

    if (!latStr || !lngStr) {
      return NextResponse.json(
        { success: false, error: 'Latitude (lat) and Longitude (lng) parameters are required' },
        { status: 400 }
      );
    }

    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json(
        { success: false, error: 'Invalid latitude or longitude format' },
        { status: 400 }
      );
    }

    const observation = await adapter.fetchCurrentAndForecast(lat, lng);
    const health = await adapter.getHealth();
    providerHealthTracker.recordHealth(health);

    return NextResponse.json({
      success: true,
      data_provenance: {
        provider_name: observation.providerName,
        fetched_at: observation.fetchedAt,
        observed_at: observation.observedAt,
        freshness_status: observation.freshnessStatus,
        notice: 'Live Decision-Support Weather Stream. Not a certified emergency warning broadcast.',
      },
      weather: {
        live_temperature_c: observation.temperatureC,
        live_relative_humidity: observation.relativeHumidityPct,
        live_precipitation_mm: observation.precipitation_1h_mm,
        live_wind_speed_kmh: observation.windSpeedKmh,
        live_weather_code: observation.weatherCode,
        weather_condition: observation.weatherCondition,
        precipitation_1h_mm: observation.precipitation_1h_mm,
        precipitation_3h_mm: observation.precipitation_3h_mm,
        precipitation_6h_mm: observation.precipitation_6h_mm,
        precipitation_24h_mm: observation.precipitation_24h_mm,
        precipitation_72h_mm: observation.precipitation_72h_mm,
        precipitation_7d_mm: observation.precipitation_7d_mm,
        forecast_rain_next_6h_mm: observation.forecast_rain_6h_mm,
        forecast_rain_next_24h_mm: observation.forecast_rain_24h_mm,
        forecast_rain_next_72h_mm: observation.forecast_rain_72h_mm,
        timestamp: observation.observedAt,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Failed to ingest weather observation',
        provider_status: 'degraded',
        fallback_notice: 'Provider service degraded. Historical baselines in effect.',
      },
      { status: 502 }
    );
  }
}
