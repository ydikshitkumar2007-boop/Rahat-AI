/**
 * RAHAT AI - Prototype ML-Assisted Landslide Risk Estimator Training Script (Node.js)
 * Generates a deterministic synthetic dataset (3,000 samples, fixed seed = 42)
 * and trains a lightweight Decision Tree model for prototype risk estimation.
 */

const fs = require('fs');
const path = require('path');

// Simple Pseudo-Random Number Generator with fixed seed 42
let seed = 42;
function pseudoRandom() {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

function uniform(min, max) {
  return min + pseudoRandom() * (max - min);
}

function gaussian(mean, std) {
  const u1 = pseudoRandom();
  const u2 = pseudoRandom();
  const z0 = Math.sqrt(-2.0 * Math.log(u1 || 0.0001)) * Math.cos(2.0 * Math.PI * u2);
  return mean + z0 * std;
}

function generateSyntheticDataset(numSamples = 3000) {
  const dataset = [];
  for (let i = 0; i < numSamples; i++) {
    const live_precipitation_mm = parseFloat(uniform(0.0, 60.0).toFixed(2));
    const forecast_rain_next_6h_mm = parseFloat(uniform(0.0, 150.0).toFixed(2));
    const live_relative_humidity = parseFloat(uniform(30.0, 100.0).toFixed(1));
    const simulated_soil_saturation_pct = parseFloat(uniform(0.0, 100.0).toFixed(1));
    const simulated_slope_displacement_mm = parseFloat(uniform(0.0, 20.0).toFixed(2));
    const simulated_vibration_score = parseFloat(uniform(0.0, 100.0).toFixed(1));
    const terrain_vulnerability = parseFloat(uniform(0.0, 100.0).toFixed(1));

    // Synthetic Bounded Domain Rule with Gaussian Noise
    const rainComponent = Math.min(35.0, ((live_precipitation_mm * 1.5 + forecast_rain_next_6h_mm * 1.2) / 180.0) * 35.0);
    const soilComponent = (simulated_soil_saturation_pct / 100.0) * 25.0;
    const slopeComponent = Math.min(25.0, (simulated_slope_displacement_mm / 15.0) * 20.0 + (simulated_vibration_score / 100.0) * 5.0);
    const terrainComponent = (terrain_vulnerability / 100.0) * 15.0;

    const noise = gaussian(0.0, 2.5);
    const rawScore = rainComponent + soilComponent + slopeComponent + terrainComponent + noise;
    const risk_score = Math.max(0, Math.min(100, Math.round(rawScore)));

    let risk_level = 'low';
    if (risk_score >= 80) risk_level = 'severe';
    else if (risk_score >= 60) risk_level = 'high';
    else if (risk_score >= 35) risk_level = 'moderate';

    dataset.push({
      live_precipitation_mm,
      forecast_rain_next_6h_mm,
      live_relative_humidity,
      simulated_soil_saturation_pct,
      simulated_slope_displacement_mm,
      simulated_vibration_score,
      terrain_vulnerability,
      target_risk_score: risk_score,
      target_risk_level: risk_level,
    });
  }
  return dataset;
}

function buildTree(data, features, depth = 0, maxDepth = 6, minSamples = 10) {
  const scores = data.map((d) => d.target_risk_score);
  const avgVal = scores.reduce((a, b) => a + b, 0) / (scores.length || 1);

  if (depth >= maxDepth || data.length <= minSamples) {
    return { value: parseFloat(avgVal.toFixed(2)) };
  }

  let bestFeature = null;
  let bestThreshold = null;
  let bestVarReduction = -1;
  let bestLeftData = null;
  let bestRightData = null;

  const currentVar = scores.reduce((sum, s) => sum + Math.pow(s - avgVal, 2), 0) / scores.length;

  for (const feat of features) {
    const values = Array.from(new Set(data.map((d) => d[feat]))).sort((a, b) => a - b);
    if (values.length < 2) continue;

    const step = Math.max(1, Math.floor(values.length / 10));
    for (let i = 0; i < values.length; i += step) {
      const thresh = values[i];
      const left = data.filter((d) => d[feat] <= thresh);
      const right = data.filter((d) => d[feat] > thresh);

      if (left.length < minSamples || right.length < minSamples) continue;

      const leftScores = left.map((d) => d.target_risk_score);
      const rightScores = right.map((d) => d.target_risk_score);

      const leftAvg = leftScores.reduce((a, b) => a + b, 0) / leftScores.length;
      const rightAvg = rightScores.reduce((a, b) => a + b, 0) / rightScores.length;

      const leftVar = leftScores.reduce((sum, s) => sum + Math.pow(s - leftAvg, 2), 0) / leftScores.length;
      const rightVar = rightScores.reduce((sum, s) => sum + Math.pow(s - rightAvg, 2), 0) / rightScores.length;

      const weightedVar = (left.length / data.length) * leftVar + (right.length / data.length) * rightVar;
      const varReduction = currentVar - weightedVar;

      if (varReduction > bestVarReduction) {
        bestVarReduction = varReduction;
        bestFeature = feat;
        bestThreshold = thresh;
        bestLeftData = left;
        bestRightData = right;
      }
    }
  }

  if (bestVarReduction <= 0 || !bestFeature) {
    return { value: parseFloat(avgVal.toFixed(2)) };
  }

  return {
    feature: bestFeature,
    threshold: bestThreshold,
    left: buildTree(bestLeftData, features, depth + 1, maxDepth, minSamples),
    right: buildTree(bestRightData, features, depth + 1, maxDepth, minSamples),
  };
}

function predictTree(node, sample) {
  if (node.value !== undefined) return node.value;
  const val = sample[node.feature] ?? 0;
  if (val <= node.threshold) return predictTree(node.left, sample);
  return predictTree(node.right, sample);
}

function evaluateModel(tree, testData) {
  let totalError = 0;
  let totalMse = 0;
  let correctLevels = 0;

  for (const d of testData) {
    const pred = predictTree(tree, d);
    const actual = d.target_risk_score;
    const err = Math.abs(pred - actual);
    totalError += err;
    totalMse += Math.pow(err, 2);

    const predLevel = pred >= 80 ? 'severe' : pred >= 60 ? 'high' : pred >= 35 ? 'moderate' : 'low';
    if (predLevel === d.target_risk_level) correctLevels++;
  }

  const mae = totalError / testData.length;
  const mse = totalMse / testData.length;
  const rmse = Math.sqrt(mse);
  const accuracy = (correctLevels / testData.length) * 100;

  return {
    synthetic_test_samples: testData.length,
    mean_absolute_error_mae: parseFloat(mae.toFixed(2)),
    mean_squared_error_mse: parseFloat(mse.toFixed(2)),
    root_mean_squared_error_rmse: parseFloat(rmse.toFixed(2)),
    risk_level_classification_accuracy_pct: parseFloat(accuracy.toFixed(2)),
  };
}

function main() {
  console.log('Generating synthetic dataset (3,000 samples, fixed seed = 42)...');
  seed = 42;
  const dataset = generateSyntheticDataset(3000);

  const splitIdx = Math.floor(dataset.length * 0.8);
  const trainData = dataset.slice(0, splitIdx);
  const testData = dataset.slice(splitIdx);

  const features = [
    'live_precipitation_mm',
    'forecast_rain_next_6h_mm',
    'live_relative_humidity',
    'simulated_soil_saturation_pct',
    'simulated_slope_displacement_mm',
    'simulated_vibration_score',
    'terrain_vulnerability',
  ];

  console.log('Training Decision Tree Regressor model (max_depth=6)...');
  const treeRoot = buildTree(trainData, features, 0, 6, 10);

  console.log('Evaluating model performance on synthetic test split...');
  const metrics = evaluateModel(treeRoot, testData);
  console.log(`Metrics: MAE=${metrics.mean_absolute_error_mae}, RMSE=${metrics.root_mean_squared_error_rmse}, Accuracy=${metrics.risk_level_classification_accuracy_pct}%`);

  const modelMetadata = {
    model_name: 'Prototype ML-Assisted Landslide Risk Estimator',
    model_version: 'v1.0.0-synthetic-dt',
    trained_at: '2026-09-15T00:00:00Z',
    dataset_size: dataset.length,
    random_seed: 42,
    feature_names: features,
    disclaimer:
      'PROTOTYPE ONLY: Trained on synthetic telemetry dataset for demonstration. Not an official emergency warning system.',
    tree_root: treeRoot,
  };

  const evalReport = {
    model_version: 'v1.0.0-synthetic-dt',
    evaluation_metrics: metrics,
    disclaimer: 'Synthetic evaluation metrics report. Not calibrated for real-world emergency response.',
  };

  const publicModelsDir = path.join(__dirname, '..', 'public', 'models');
  const modelsDir = path.join(__dirname, '..', 'models');

  if (!fs.existsSync(publicModelsDir)) fs.mkdirSync(publicModelsDir, { recursive: true });
  if (!fs.existsSync(modelsDir)) fs.mkdirSync(modelsDir, { recursive: true });

  fs.writeFileSync(path.join(publicModelsDir, 'landslide_ml_model.json'), JSON.stringify(modelMetadata, null, 2));
  fs.writeFileSync(path.join(modelsDir, 'landslide_ml_model.json'), JSON.stringify(modelMetadata, null, 2));
  fs.writeFileSync(path.join(publicModelsDir, 'landslide_ml_evaluation.json'), JSON.stringify(evalReport, null, 2));

  console.log('Successfully saved model artifacts to public/models/landslide_ml_model.json!');
}

main();
