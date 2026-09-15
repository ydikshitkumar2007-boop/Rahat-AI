import { NextRequest, NextResponse } from 'next/server';
import { calculateRiskScore } from '@/lib/utils/risk';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rainfall24h, soilMoisturePct, slopeTiltDeg, locationName } = body;

    // Never leak AI secret keys to frontend
    const apiKey = process.env.AI_API_KEY;

    // Perform hybrid algorithmic + simulated AI analysis
    const { score, level } = calculateRiskScore(
      rainfall24h ?? 0,
      soilMoisturePct ?? 0,
      slopeTiltDeg ?? 0
    );

    const isHighOrSevere = level === 'high' || level === 'severe';

    const aiSummary = isHighOrSevere
      ? `[RAHAT-AI SERVER ASSESSMENT]: High saturation (${soilMoisturePct}%) and critical slope tilt displacement (${slopeTiltDeg}°) near ${
          locationName || 'target corridor'
        }. Shear strength failure threshold exceeded.`
      : `[RAHAT-AI SERVER ASSESSMENT]: Telemetry parameters within normal limits for ${
          locationName || 'monitored sector'
        }. Slope stability index nominal.`;

    const recommendedAction = isHighOrSevere
      ? 'Issue immediate Level 4 alert. Suspend vehicular traffic on cut-slopes and advise local SDRF units.'
      : 'Maintain standard 15-minute telemetry polling interval.';

    return NextResponse.json({
      success: true,
      data: {
        riskScore: score,
        riskLevel: level,
        aiSummary,
        recommendedAction,
        landslideProbability: parseFloat((score / 100).toFixed(3)),
        hasAiApiKeyConfigured: !!apiKey,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal AI service error' },
      { status: 500 }
    );
  }
}
