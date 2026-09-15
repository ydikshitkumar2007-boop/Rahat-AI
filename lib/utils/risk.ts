import { RiskLevel } from '@/types';

export function calculateRiskScore(
  rainfall24h: number,
  soilMoisturePct: number,
  slopeTiltDeg: number
): { score: number; level: RiskLevel } {
  // Heuristic weighting for slope stability:
  // 40% 24h rainfall (threshold ~250mm)
  // 35% soil moisture (threshold ~80%)
  // 25% slope displacement angle (threshold ~4.0 degrees)

  const rainScore = Math.min(100, (rainfall24h / 250) * 100);
  const moistureScore = Math.min(100, (soilMoisturePct / 85) * 100);
  const tiltScore = Math.min(100, (slopeTiltDeg / 4.5) * 100);

  const weightedScore = parseFloat(
    (rainScore * 0.4 + moistureScore * 0.35 + tiltScore * 0.25).toFixed(1)
  );

  let level: RiskLevel = 'low';
  if (weightedScore >= 80) level = 'severe';
  else if (weightedScore >= 60) level = 'high';
  else if (weightedScore >= 35) level = 'moderate';

  return { score: weightedScore, level };
}

export function getRiskDescription(level: RiskLevel): string {
  switch (level) {
    case 'severe':
      return 'Imminent major slope failure or rapid debris flow. Immediate evacuation required.';
    case 'high':
      return 'Critical soil saturation and active creeping movement. High probability of localized slips.';
    case 'moderate':
      return 'Elevated pore pressure and rainfall accumulation. Heightened vigilance advised.';
    case 'low':
    default:
      return 'Slope conditions stable. Normal monitoring operational.';
  }
}
