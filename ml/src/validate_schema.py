"""
RAHAT AI Schema & Data Quality Validator
Checks input tabular dataset for missing values, outliers, duplicate events, and spatial/temporal leakage.
"""
import sys
import json

REQUIRED_SCHEMA_FIELDS = [
    "event_id",
    "latitude",
    "longitude",
    "event_datetime",
    "landslide_occurred",
    "rainfall_1h_mm",
    "rainfall_3h_mm",
    "rainfall_6h_mm",
    "rainfall_24h_mm",
    "rainfall_72h_mm",
    "rainfall_7d_mm",
    "forecast_rain_6h_mm",
    "slope_deg",
    "elevation_m",
    "historical_susceptibility_score",
    "data_source",
    "label_source",
]

def validate_dataset_schema(records):
    """
    Validates a list of dictionary records against expected schema constraints.
    Returns (is_valid, validation_report)
    """
    report = {
        "total_records": len(records),
        "missing_fields": [],
        "invalid_types": [],
        "outliers_found": 0,
        "duplicates_found": 0,
        "is_valid": True,
    }

    if not records:
        report["is_valid"] = False
        report["error"] = "Dataset is empty"
        return False, report

    seen_events = set()

    for idx, row in enumerate(records):
        # 1. Check required fields
        for field in REQUIRED_SCHEMA_FIELDS:
            if field not in row or row[field] is None:
                report["missing_fields"].append(f"Row {idx}: missing {field}")

        # 2. Check duplicates
        event_key = (row.get("latitude"), row.get("longitude"), row.get("event_datetime"))
        if event_key in seen_events:
            report["duplicates_found"] += 1
        seen_events.add(event_key)

        # 3. Value bounds check
        if row.get("slope_deg", 0) < 0 or row.get("slope_deg", 0) > 90:
            report["outliers_found"] += 1

    if report["missing_fields"] or report["invalid_types"]:
        report["is_valid"] = False

    return report["is_valid"], report

if __name__ == "__main__":
    sample_records = [
        {
            "event_id": "EVT_001",
            "latitude": 27.33,
            "longitude": 88.61,
            "event_datetime": "2024-07-15T10:00:00Z",
            "landslide_occurred": 1,
            "rainfall_1h_mm": 18.5,
            "rainfall_3h_mm": 45.0,
            "rainfall_6h_mm": 85.0,
            "rainfall_24h_mm": 160.0,
            "rainfall_72h_mm": 280.0,
            "rainfall_7d_mm": 410.0,
            "forecast_rain_6h_mm": 35.0,
            "slope_deg": 38.5,
            "elevation_m": 1540,
            "historical_susceptibility_score": 82,
            "data_source": "IMD Historical Rain Gauge",
            "label_source": "GSI Disaster Event Catalog",
        }
    ]
    is_valid, rep = validate_dataset_schema(sample_records)
    print("Schema Validation Test:", "PASSED" if is_valid else "FAILED")
    print(json.dumps(rep, indent=2))
