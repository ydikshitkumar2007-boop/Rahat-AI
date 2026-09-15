import { evaluateDualRiskScore, MLInferenceInputs } from '../services/mlInference';

function runVerification() {
  console.log('--- RAHAT AI ML Inference Verification Test ---');

  // Test 1: Normal Low-Risk Scenario
  const normalInputs: MLInferenceInputs = {
    live_precipitation_mm: 2.0,
    forecast_rain_next_6h_mm: 5.0,
    live_relative_humidity: 45.0,
    simulated_soil_saturation_pct: 30.0,
    simulated_slope_displacement_mm: 0.2,
    simulated_vibration_score: 5.0,
    terrain_vulnerability: 40.0,
  };

  const normalRes = evaluateDualRiskScore(normalInputs);
  console.log('\n[Test 1] Normal Low-Risk Scenario:');
  console.log(`- Prototype ML Score: ${normalRes.prototype_ml_risk_score}/100`);
  console.log(`- Rule-Based Score: ${normalRes.rule_based_risk_score}/100`);
  console.log(`- Final Demo Score: ${normalRes.final_demo_risk_score}/100`);
  console.log(`- Risk Level: ${normalRes.risk_level}`);
  console.log(`- Status: ${normalRes.model_status} (${normalRes.mode})`);
  console.log(`- Factors: ${normalRes.contributing_factors.join('; ')}`);

  // Test 2: Extreme Rain High/Severe Scenario
  const extremeInputs: MLInferenceInputs = {
    live_precipitation_mm: 45.0,
    forecast_rain_next_6h_mm: 120.0,
    live_relative_humidity: 98.0,
    simulated_soil_saturation_pct: 94.0,
    simulated_slope_displacement_mm: 4.8,
    simulated_vibration_score: 85.0,
    terrain_vulnerability: 85.0,
  };

  const extremeRes = evaluateDualRiskScore(extremeInputs);
  console.log('\n[Test 2] Extreme Rain High/Severe Scenario:');
  console.log(`- Prototype ML Score: ${extremeRes.prototype_ml_risk_score}/100`);
  console.log(`- Rule-Based Score: ${extremeRes.rule_based_risk_score}/100`);
  console.log(`- Final Demo Score: ${extremeRes.final_demo_risk_score}/100`);
  console.log(`- Risk Level: ${extremeRes.risk_level}`);
  console.log(`- Status: ${extremeRes.model_status} (${extremeRes.mode})`);
  console.log(`- Factors: ${extremeRes.contributing_factors.join('; ')}`);

  // Test 3: Deterministic Input Consistency
  const run1 = evaluateDualRiskScore(extremeInputs);
  const run2 = evaluateDualRiskScore(extremeInputs);
  const isDeterministic =
    run1.prototype_ml_risk_score === run2.prototype_ml_risk_score &&
    run1.final_demo_risk_score === run2.final_demo_risk_score;

  console.log('\n[Test 3] Deterministic Consistency Check:');
  console.log(`- Identical Input Runs Identical Score? ${isDeterministic ? 'PASSED (100% Deterministic)' : 'FAILED'}`);

  console.log('\n--- Verification Complete ---');
}

runVerification();
