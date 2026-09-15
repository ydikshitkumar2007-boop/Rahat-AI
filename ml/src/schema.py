"""
RAHAT AI Tabular Schema Definition & Constraints
"""

REQUIRED_COLUMNS = [
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
    "relative_humidity_pct",
    "soil_moisture_pct",
    "slope_deg",
    "elevation_m",
    "geology_class",
    "landcover_class",
    "distance_to_road_m",
    "distance_to_fault_m",
    "historical_susceptibility_score",
    "data_source",
    "label_source",
    "record_quality",
]

NUMERICAL_FEATURES = [
    "rainfall_1h_mm",
    "rainfall_3h_mm",
    "rainfall_6h_mm",
    "rainfall_24h_mm",
    "rainfall_72h_mm",
    "rainfall_7d_mm",
    "forecast_rain_6h_mm",
    "relative_humidity_pct",
    "soil_moisture_pct",
    "slope_deg",
    "elevation_m",
    "distance_to_road_m",
    "distance_to_fault_m",
    "historical_susceptibility_score",
]

CATEGORICAL_FEATURES = [
    "geology_class",
    "landcover_class",
]

TARGET_COLUMN = "landslide_occurred"
