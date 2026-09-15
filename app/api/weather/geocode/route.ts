import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name');

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ success: false, error: 'Location name parameter is required' }, { status: 400 });
    }

    const apiUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      name
    )}&count=5&language=en&format=json`;

    const res = await fetch(apiUrl, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`Open-Meteo geocoding service error: ${res.statusText}`);
    }

    const data = await res.json();

    const results = (data.results || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      admin1: item.admin1 || item.country || '',
      country: item.country || '',
      latitude: item.latitude,
      longitude: item.longitude,
      elevation: item.elevation || 0,
    }));

    return NextResponse.json({
      success: true,
      results,
      data_source: 'Live Open-Meteo Geocoding API',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch geocoding location' },
      { status: 500 }
    );
  }
}
