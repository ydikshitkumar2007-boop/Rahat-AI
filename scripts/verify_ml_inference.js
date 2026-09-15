const { evaluateDualRiskScore } = require('../services/mlInference');

// Simple JS test invocation
const normalInputs = {
  live_precipitation_mm: 2.0,
  forecast_rain_next_6h_mm: 5.0,
  live_relative_humidity: 45.0,
  simulated_soil_saturation_pct: 30.0,
  simulated_slope_displacement_mm: 0.2,
  simulated_vibration_score: 5.0,
  terrain_vulnerability: 40.0,
};

const res = evaluateDualRiskScore(normalInputs);
console.log('[Verification Output]:');
console.log(JSON.stringify(res, null, 2));
