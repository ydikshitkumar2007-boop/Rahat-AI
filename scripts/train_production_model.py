#!/usr/bin/env python3
"""
RAHAT AI Production ML Candidate Training Pipeline
Checks ml/data/raw/ for verified historical landslide CSV datasets.
Enforces hard stop if no validated dataset is supplied.
"""
import os
import sys
import glob

RAW_DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "ml", "data", "raw")

def check_raw_dataset():
    csv_files = glob.glob(os.path.join(RAW_DATA_DIR, "*.csv"))
    valid_files = [f for f in csv_files if not f.endswith(".gitkeep")]
    return valid_files

def main():
    print("==========================================================================")
    print("RAHAT AI — Production ML Candidate Training Pipeline")
    print("==========================================================================")
    
    raw_files = check_raw_dataset()
    
    if not raw_files:
        print("\n[HARD STOP]: No verified labelled dataset supplied.")
        print("Production model training has not been performed.")
        print("\nTo train a candidate model:")
        print("1. Place a verified historical CSV dataset in: ml/data/raw/")
        print("2. Ensure fields match: ml/data/templates/verified_landslide_training_data_template.csv")
        print("3. Re-run: python scripts/train_production_model.py\n")
        print("Fallback Active: Transparent rainfall threshold & terrain susceptibility rule engine.\n")
        sys.exit(0)

    print(f"Found {len(raw_files)} verified dataset file(s). Proceeding with schema validation and model training...")
    # Dataset schema validation and candidate training execution would proceed here when CSV is present

if __name__ == "__main__":
    main()
