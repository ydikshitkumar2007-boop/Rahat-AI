#!/usr/bin/env python3
"""
RAHAT AI - Prototype ML-Assisted Landslide Risk Estimator Training Script
-------------------------------------------------------------------------
Generates a deterministic synthetic dataset (3,000 samples, fixed seed = 42)
and trains a lightweight Decision Tree model for prototype risk estimation.

Outputs:
  - public/models/landslide_ml_model.json (Decision Tree JSON structure)
  - public/models/landslide_ml_evaluation.json (Evaluation metrics)
"""

import os
import sys
import json
import math
import random

# Fixed random seed for 100% reproducibility
SEED = 42
random.seed(SEED)

def generate_synthetic_dataset(num_samples=3000):
    dataset = []
    for i in range(num_samples):
        # 7 Input Features
        live_precip = round(random.uniform(0.0, 60.0), 2)
        forecast_rain_6h = round(random.uniform(0.0, 150.0), 2)
        humidity = round(random.uniform(30.0, 100.0), 1)
        soil_saturation = round(random.uniform(0.0, 100.0), 1)
        slope_disp = round(random.uniform(0.0, 20.0), 2)
        vibration = round(random.uniform(0.0, 100.0), 1)
        terrain_vuln = round(random.uniform(0.0, 100.0), 1)

        # Synthetic Domain Rule with bounded random noise (+/- 4.0)
        rain_component = min(35.0, (live_precip * 1.5 + forecast_rain_6h * 1.2) / 180.0 * 35.0)
        soil_component = (soil_saturation / 100.0) * 25.0
        slope_component = min(25.0, (slope_disp / 15.0) * 20.0 + (vibration / 100.0) * 5.0)
        terrain_component = (terrain_vuln / 100.0) * 15.0

        noise = random.gauss(0.0, 2.5)
        raw_score = rain_component + soil_component + slope_component + terrain_component + noise
        risk_score = int(max(0, min(100, round(raw_score))))

        # Bounded Risk Level Label
        if risk_score >= 80:
            risk_level = "severe"
        elif risk_score >= 60:
            risk_level = "high"
        elif risk_score >= 35:
            risk_level = "moderate"
        else:
            risk_level = "low"

        sample = {
            "live_precipitation_mm": live_precip,
            "forecast_rain_next_6h_mm": forecast_rain_6h,
            "live_relative_humidity": humidity,
            "simulated_soil_saturation_pct": soil_saturation,
            "simulated_slope_displacement_mm": slope_disp,
            "simulated_vibration_score": vibration,
            "terrain_vulnerability": terrain_vuln,
            "target_risk_score": risk_score,
            "target_risk_level": risk_level,
        }
        dataset.append(sample)

    return dataset


class DecisionTreeNode:
    def __init__(self, feature=None, threshold=None, left=None, right=None, value=None):
        self.feature = feature
        self.threshold = threshold
        self.left = left
        self.right = right
        self.value = value

    def is_leaf(self):
        return self.value is not None

    def to_dict(self):
        if self.is_leaf():
            return {"value": self.value}
        return {
            "feature": self.feature,
            "threshold": self.threshold,
            "left": self.left.to_dict(),
            "right": self.right.to_dict(),
        }


def build_decision_tree(data, features, depth=0, max_depth=5, min_samples=15):
    scores = [d["target_risk_score"] for d in data]
    avg_val = sum(scores) / len(scores) if scores else 0.0

    if depth >= max_depth or len(data) <= min_samples:
        return DecisionTreeNode(value=round(avg_val, 2))

    best_feature = None
    best_threshold = None
    best_variance_reduction = -1.0
    best_left_data = None
    best_right_data = None

    current_var = sum((s - avg_val) ** 2 for s in scores) / len(scores)

    for feat in features:
        values = sorted(set(d[feat] for d in data))
        if len(values) < 2:
            continue
        # Check candidate split thresholds
        step = max(1, len(values) // 10)
        candidate_thresholds = values[::step]

        for thresh in candidate_thresholds:
            left = [d for d in data if d[feat] <= thresh]
            right = [d for d in data if d[feat] > thresh]
            if len(left) < min_samples or len(right) < min_samples:
                continue

            left_scores = [d["target_risk_score"] for d in left]
            right_scores = [d["target_risk_score"] for d in right]

            left_var = sum((s - sum(left_scores)/len(left_scores))**2 for s in left_scores) / len(left_scores)
            right_var = sum((s - sum(right_scores)/len(right_scores))**2 for s in right_scores) / len(right_scores)

            weighted_var = (len(left)/len(data)) * left_var + (len(right)/len(data)) * right_var
            var_reduction = current_var - weighted_var

            if var_reduction > best_variance_reduction:
                best_variance_reduction = var_reduction
                best_feature = feat
                best_threshold = thresh
                best_left_data = left
                best_right_data = right

    if best_variance_reduction <= 0 or not best_feature:
        return DecisionTreeNode(value=round(avg_val, 2))

    left_child = build_decision_tree(best_left_data, features, depth + 1, max_depth, min_samples)
    right_child = build_decision_tree(best_right_data, features, depth + 1, max_depth, min_samples)

    return DecisionTreeNode(
        feature=best_feature,
        threshold=best_threshold,
        left=left_child,
        right=right_child
    )


def predict_tree(node, sample):
    if node.is_leaf():
        return node.value
    val = sample.get(node.feature, 0.0)
    if val <= node.threshold:
        return predict_tree(node.left, sample)
    else:
        return predict_tree(node.right, sample)


def evaluate_model(tree, test_data):
    predictions = []
    actuals = []
    errors = []
    correct_levels = 0

    for d in test_data:
        pred = predict_tree(tree, d)
        actual = d["target_risk_score"]
        predictions.append(pred)
        actuals.append(actual)
        errors.append(abs(pred - actual))

        pred_level = "severe" if pred >= 80 else ("high" if pred >= 60 else ("moderate" if pred >= 35 else "low"))
        if pred_level == d["target_risk_level"]:
            correct_levels += 1

    mae = sum(errors) / len(errors)
    mse = sum(e ** 2 for e in errors) / len(errors)
    rmse = math.sqrt(mse)
    level_accuracy = (correct_levels / len(test_data)) * 100.0

    return {
        "synthetic_test_samples": len(test_data),
        "mean_absolute_error_mae": round(mae, 2),
        "mean_squared_error_mse": round(mse, 2),
        "root_mean_squared_error_rmse": round(rmse, 2),
        "risk_level_classification_accuracy_pct": round(level_accuracy, 2),
    }


def main():
    print("Generating synthetic dataset (3,000 samples, fixed seed = 42)...")
    dataset = generate_synthetic_dataset(3000)

    # Train / Test Split (80% Train, 20% Test)
    split_idx = int(len(dataset) * 0.8)
    train_data = dataset[:split_idx]
    test_data = dataset[split_idx:]

    features = [
        "live_precipitation_mm",
        "forecast_rain_next_6h_mm",
        "live_relative_humidity",
        "simulated_soil_saturation_pct",
        "simulated_slope_displacement_mm",
        "simulated_vibration_score",
        "terrain_vulnerability",
    ]

    print("Training Decision Tree Regressor model (max_depth=6)...")
    tree_head = build_decision_tree(train_data, features, depth=0, max_depth=6, min_samples=10)

    print("Evaluating model performance on synthetic test split...")
    metrics = evaluate_model(tree_head, test_data)
    print(f"Metrics: MAE={metrics['mean_absolute_error_mae']}, RMSE={metrics['root_mean_squared_error_rmse']}, Accuracy={metrics['risk_level_classification_accuracy_pct']}%")

    model_metadata = {
        "model_name": "Prototype ML-Assisted Landslide Risk Estimator",
        "model_version": "v1.0.0-synthetic-dt",
        "trained_at": "2026-09-15T00:00:00Z",
        "dataset_size": len(dataset),
        "random_seed": SEED,
        "feature_names": features,
        "disclaimer": "PROTOTYPE ONLY: Trained on synthetic telemetry dataset for demonstration. Not an official emergency warning system.",
        "tree_root": tree_head.to_dict(),
    }

    eval_report = {
        "model_version": "v1.0.0-synthetic-dt",
        "evaluation_metrics": metrics,
        "disclaimer": "Synthetic evaluation metrics report. Not calibrated for real-world emergency response.",
    }

    # Save to public/models/ directory
    os.makedirs("public/models", exist_ok=True)
    os.makedirs("models", exist_ok=True)

    with open("public/models/landslide_ml_model.json", "w", encoding="utf-8") as f:
        json.dump(model_metadata, f, indent=2)

    with open("models/landslide_ml_model.json", "w", encoding="utf-8") as f:
        json.dump(model_metadata, f, indent=2)

    with open("public/models/landslide_ml_evaluation.json", "w", encoding="utf-8") as f:
        json.dump(eval_report, f, indent=2)

    print("Successfully saved model artifacts to public/models/landslide_ml_model.json!")

if __name__ == "__main__":
    main()
