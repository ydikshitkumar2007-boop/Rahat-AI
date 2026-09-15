# RAHAT AI — Reproducible ML Training & Pipeline Workspace

This directory contains the production-oriented ML training pipeline for the **RAHAT AI Landslide Early Warning & Disaster Intelligence Platform**.

---

## ⚠️ Important Safety & Truthfulness Guardrails
1. **Decision Support Output**: All ML model outputs are **Landslide Hazard Nowcasts** or **Relative Landslide Risk Scores**, NOT guaranteed landslide predictions or official emergency warnings.
2. **Labelled Data Integrity**: Candidate models are trained strictly on validated historical tabular datasets with verified landslide occurrences.
3. **Reproducibility**: Experiments use fixed random seeds, temporal/spatial splits, explicit schema validation, and versioned Model Cards.
4. **Approval Gate**: Trained candidate models remain marked `approval_status: candidate` until evaluated and approved by an authorized State Admin.

---

## Workspace Structure
```
ml/
├── README.md                          # Pipeline documentation & guardrails
├── requirements.txt                   # Offline Python ML dependencies
├── configs/
│   └── production_candidate.yaml      # Model hyperparameters & feature schema
├── data/
│   ├── raw/                           # Validated historical observation CSVs
│   └── processed/                     # Preprocessed train/val/test splits
├── src/
│   ├── validate_schema.py             # Schema, leakage & data quality validator
│   ├── features.py                    # Multi-window rainfall & susceptibility features
│   ├── train.py                       # Training pipeline (Baseline vs Candidate)
│   ├── evaluate.py                    # Metrics, calibration & confusion matrix evaluator
│   └── export_model.py                # Model card & JS inference artifact exporter
├── models/                            # Serialized model artifacts (.json / .joblib)
└── reports/                           # Versioned model cards & evaluation reports
```

---

## Quick Start (Offline CLI Command)

### 1. Install Dependencies
```bash
pip install -r ml/requirements.txt
```

### 2. Run Validation & Training Pipeline
```bash
python -m ml.src.train --config ml/configs/production_candidate.yaml
```

### 3. Evaluate Candidate Model & Export Model Card
```bash
python -m ml.src.evaluate --model ml/models/candidate_v1.json
```
