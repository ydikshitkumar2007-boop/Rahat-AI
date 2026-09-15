# RAHAT AI Verified Landslide Dataset Specifications

To train a production candidate machine learning model for landslide hazard nowcasting, place a verified CSV file in `ml/data/raw/` matching the schema defined in `verified_landslide_training_data_template.csv`.

## Required Fields & Schema Rules
- `event_id`: Unique string identifier per observation
- `latitude` / `longitude`: Valid coordinates within Northeast India bounds
- `event_datetime`: ISO-8601 timestamp (`YYYY-MM-DDTHH:MM:SSZ`)
- `landslide_occurred`: Binary classification label (0 = No landslide, 1 = Verified landslide)
- `rainfall_1h_mm` to `rainfall_7d_mm`: Multi-window cumulative rainfall
- `forecast_rain_6h_mm`: Server-side forecast rain window
- `slope_deg`, `elevation_m`, `geology_class`, `historical_susceptibility_score`: Static terrain susceptibility factors
- `data_source`: Provider provenance (e.g. IMD Rain Gauge, AWS)
- `label_source`: Label verification authority (e.g. Geological Survey of India, State Disaster Management Authority)

⚠️ **Hard Stop Enforcement**: If no verified dataset CSV is present in `ml/data/raw/`, production model training will halt with an explicit notification message.
