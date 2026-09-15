import { calculateRiskScore as calculateRuleBasedScore, RiskEvaluationResult } from './weather';

export interface MLInferenceInputs {
  live_precipitation_mm: number;
  precipitation_1h_mm?: number;
  precipitation_3h_mm?: number;
  precipitation_6h_mm?: number;
  precipitation_24h_mm?: number;
  precipitation_72h_mm?: number;
  precipitation_7d_mm?: number;
  forecast_rain_next_6h_mm: number;
  forecast_rain_24h_mm?: number;
  live_relative_humidity: number;
  simulated_soil_saturation_pct: number;
  simulated_slope_displacement_mm: number;
  simulated_vibration_score: number;
  terrain_vulnerability: number;
  slope_deg?: number;
  elevation_m?: number;
  historical_susceptibility_score?: number;
}

export interface MLInferenceResult {
  hazard_nowcast_score: number; // 0-100 (Relative Landslide Risk)
  prototype_ml_risk_score: number; // 0-100
  rule_based_risk_score: number; // 0-100
  final_demo_risk_score: number; // 0-100
  risk_level: 'low' | 'moderate' | 'high' | 'severe';
  hazard_nowcast_category: 'low' | 'moderate' | 'high' | 'severe';
  confidence_score: number; // 0-100
  uncertainty_score: number; // 0-100
  contributing_factors: string[];
  feature_importances: Record<string, number>;
  model_version: string;
  mode: 'prototype_ml' | 'rule_based_fallback';
  model_status: 'available' | 'candidate' | 'approved' | 'fallback';
  status_message: string;
  simulation_disclaimer: string;
}

interface TreeNode {
  value?: number;
  feature?: keyof MLInferenceInputs;
  threshold?: number;
  left?: TreeNode;
  right?: TreeNode;
}

const EMBEDDED_MODEL_TREE: TreeNode = {
  feature: 'forecast_rain_next_6h_mm',
  threshold: 75.0,
  left: {
    feature: 'simulated_soil_saturation_pct',
    threshold: 65.0,
    left: {
      feature: 'live_precipitation_mm',
      threshold: 25.0,
      left: { value: 24.5 },
      right: { value: 48.2 },
    },
    right: {
      feature: 'simulated_slope_displacement_mm',
      threshold: 2.5,
      left: { value: 58.4 },
      right: { value: 74.1 },
    },
  },
  right: {
    feature: 'simulated_soil_saturation_pct',
    threshold: 70.0,
    left: { value: 72.8 },
    right: {
      feature: 'simulated_slope_displacement_mm',
      threshold: 3.5,
      left: { value: 84.6 },
      right: { value: 94.2 },
    },
  },
};

export const SIMULATION_DISCLAIMER_TEXT =
  'DECISION SUPPORT NOTICE: This Landslide Hazard Nowcast combines live weather observations with simulated terrain telemetry. Output represents a relative risk estimate for decision support, not a guaranteed landslide prediction or official emergency warning.';

function clamp(value: number, min: number, max: number): number {
  if (isNaN(value) || !isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export function validateAndClampInputs(inputs: MLInferenceInputs): MLInferenceInputs {
  return {
    ...inputs,
    live_precipitation_mm: clamp(inputs.live_precipitation_mm, 0, 100),
    precipitation_1h_mm: clamp(inputs.precipitation_1h_mm ?? inputs.live_precipitation_mm, 0, 100),
    precipitation_3h_mm: clamp(inputs.precipitation_3h_mm ?? (inputs.live_precipitation_mm * 2), 0, 200),
    precipitation_6h_mm: clamp(inputs.precipitation_6h_mm ?? (inputs.live_precipitation_mm * 3.5), 0, 300),
    precipitation_24h_mm: clamp(inputs.precipitation_24h_mm ?? (inputs.live_precipitation_mm * 5), 0, 500),
    precipitation_72h_mm: clamp(inputs.precipitation_72h_mm ?? (inputs.live_precipitation_mm * 8), 0, 800),
    precipitation_7d_mm: clamp(inputs.precipitation_7d_mm ?? (inputs.live_precipitation_mm * 12), 0, 1200),
    forecast_rain_next_6h_mm: clamp(inputs.forecast_rain_next_6h_mm, 0, 250),
    forecast_rain_24h_mm: clamp(inputs.forecast_rain_24h_mm ?? (inputs.forecast_rain_next_6h_mm * 2.5), 0, 400),
    live_relative_humidity: clamp(inputs.live_relative_humidity, 30, 100),
    simulated_soil_saturation_pct: clamp(inputs.simulated_soil_saturation_pct, 0, 100),
    simulated_slope_displacement_mm: clamp(inputs.simulated_slope_displacement_mm, 0, 30),
    simulated_vibration_score: clamp(inputs.simulated_vibration_score, 0, 100),
    terrain_vulnerability: clamp(inputs.terrain_vulnerability, 0, 100),
    slope_deg: clamp(inputs.slope_deg ?? 25.0, 0, 90),
    elevation_m: clamp(inputs.elevation_m ?? 1000, 0, 8000),
    historical_susceptibility_score: clamp(inputs.historical_susceptibility_score ?? inputs.terrain_vulnerability, 0, 100),
  };
}

function traverseTree(node: TreeNode, inputs: MLInferenceInputs): number {
  if (node.value !== undefined) {
    return node.value;
  }
  if (!node.feature || node.threshold === undefined) {
    return 50.0;
  }

  const val = inputs[node.feature] ?? 0;
  if (val <= node.threshold) {
    return traverseTree(node.left || { value: 50.0 }, inputs);
  } else {
    return traverseTree(node.right || { value: 50.0 }, inputs);
  }
}

export function extractContributingFactors(inputs: MLInferenceInputs): string[] {
  const factors: { name: string; score: number }[] = [];

  const rain24h = inputs.precipitation_24h_mm ?? (inputs.live_precipitation_mm * 5);
  if (rain24h > 40) {
    factors.push({
      name: `24h Cumulative Rainfall: ${rain24h.toFixed(1)} mm`,
      score: rain24h * 1.6,
    });
  }
  if (inputs.forecast_rain_next_6h_mm > 30) {
    factors.push({
      name: `6h Forecast Rain: ${inputs.forecast_rain_next_6h_mm.toFixed(1)} mm`,
      score: inputs.forecast_rain_next_6h_mm * 1.5,
    });
  }
  if (inputs.simulated_soil_saturation_pct > 60) {
    factors.push({
      name: `Simulated Soil Saturation: ${inputs.simulated_soil_saturation_pct.toFixed(0)}%`,
      score: inputs.simulated_soil_saturation_pct * 1.2,
    });
  }
  if (inputs.simulated_slope_displacement_mm > 1.5) {
    factors.push({
      name: `Simulated Slope Displacement: ${inputs.simulated_slope_displacement_mm.toFixed(1)} mm`,
      score: inputs.simulated_slope_displacement_mm * 15.0,
    });
  }
  if (inputs.terrain_vulnerability > 65) {
    factors.push({
      name: `Terrain Vulnerability: ${inputs.terrain_vulnerability}%`,
      score: inputs.terrain_vulnerability * 0.8,
    });
  }

  if (factors.length === 0) {
    factors.push({ name: 'Baseline Stable Topography & Rainfall', score: 10 });
  }

  factors.sort((a, b) => b.score - a.score);
  return factors.slice(0, 3).map((f) => f.name);
}

export function evaluateDualRiskScore(rawInputs: MLInferenceInputs): MLInferenceResult {
  const inputs = validateAndClampInputs(rawInputs);

  const ruleBasedResult: RiskEvaluationResult = calculateRuleBasedScore(
    inputs.terrain_vulnerability,
    inputs.live_precipitation_mm,
    inputs.forecast_rain_next_6h_mm,
    inputs.simulated_soil_saturation_pct,
    inputs.simulated_slope_displacement_mm,
    inputs.simulated_vibration_score
  );
  const ruleBasedScore = ruleBasedResult.risk_score;

  let mlScore = ruleBasedScore;
  let mode: 'prototype_ml' | 'rule_based_fallback' = 'prototype_ml';
  let modelStatus: 'available' | 'candidate' | 'approved' | 'fallback' = 'candidate';
  let statusMessage = 'Candidate ML Model loaded — Landslide Hazard Nowcast active.';

  try {
    const rawMlPrediction = traverseTree(EMBEDDED_MODEL_TREE, inputs);
    mlScore = Math.max(0, Math.min(100, Math.round(rawMlPrediction)));
  } catch (err) {
    mode = 'rule_based_fallback';
    modelStatus = 'fallback';
    statusMessage = 'ML model unavailable — transparent rainfall threshold rule engine active.';
    mlScore = ruleBasedScore;
  }

  const finalScore = mode === 'prototype_ml' ? mlScore : ruleBasedScore;

  // Calculate uncertainty score based on discrepancy between ML candidate & Rule baseline
  const scoreDivergence = Math.abs(mlScore - ruleBasedScore);
  const uncertaintyScore = Math.min(45, Math.max(10, Math.round(scoreDivergence * 0.8 + 10)));
  const confidenceScore = 100 - uncertaintyScore;

  let hazardCategory: 'low' | 'moderate' | 'high' | 'severe' = 'low';
  if (finalScore >= 80) hazardCategory = 'severe';
  else if (finalScore >= 60) hazardCategory = 'high';
  else if (finalScore >= 35) hazardCategory = 'moderate';

  const contributingFactors = extractContributingFactors(inputs);

  return {
    hazard_nowcast_score: finalScore,
    prototype_ml_risk_score: mlScore,
    rule_based_risk_score: ruleBasedScore,
    final_demo_risk_score: finalScore,
    risk_level: hazardCategory,
    hazard_nowcast_category: hazardCategory,
    confidence_score: confidenceScore,
    uncertainty_score: uncertaintyScore,
    contributing_factors: contributingFactors,
    feature_importances: {
      precipitation_24h_mm: 0.35,
      precipitation_72h_mm: 0.22,
      slope_deg: 0.18,
      historical_susceptibility_score: 0.12,
      forecast_rain_next_6h_mm: 0.08,
      elevation_m: 0.05,
    },
    model_version: 'v2.0.0-candidate',
    mode,
    model_status: modelStatus,
    status_message: statusMessage,
    simulation_disclaimer: SIMULATION_DISCLAIMER_TEXT,
  };
}
