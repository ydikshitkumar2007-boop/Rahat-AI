import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    system: 'RAHAT AI Disaster Intelligence Platform',
    region: 'Northeast India Monitoring Grid',
    timestamp: new Date().toISOString(),
    version: '1.0.0-MVP',
  });
}
