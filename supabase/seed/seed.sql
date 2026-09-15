-- Seed Data for RAHAT AI - Northeast India Monitoring Infrastructure

-- 1. Insert Stations
INSERT INTO public.stations (id, code, name, state, district, latitude, longitude, elevation_m, status, risk_level, last_ping)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'ST-MEGH-01', 'Cherrapunji East Ridge', 'Meghalaya', 'East Khasi Hills', 25.2986, 91.7321, 1430, 'online', 'severe', NOW()),
  ('22222222-2222-2222-2222-222222222222', 'ST-SIKK-02', 'Gangtok North Slope', 'Sikkim', 'East Sikkim', 27.3389, 88.6138, 1650, 'online', 'high', NOW()),
  ('33333333-3333-3333-3333-333333333333', 'ST-ASSM-03', 'Haflong Hill Bypass', 'Assam', 'Dima Hasao', 25.1764, 93.0163, 512, 'online', 'moderate', NOW()),
  ('44444444-4444-4444-4444-444444444444', 'ST-MIZO-04', 'Aizawl Cliffside Road', 'Mizoram', 'Aizawl', 23.7271, 92.7176, 1132, 'online', 'severe', NOW()),
  ('55555555-5555-5555-5555-555555555555', 'ST-NAGA-05', 'Kohima South Pass', 'Nagaland', 'Kohima', 25.6751, 94.1086, 1444, 'online', 'moderate', NOW()),
  ('66666666-6666-6666-6666-666666666666', 'ST-ARUN-06', 'Tawang Mountain Route', 'Arunachal Pradesh', 'Tawang', 27.5861, 91.8594, 3048, 'online', 'low', NOW()),
  ('77777777-7777-7777-7777-777777777777', 'ST-MANI-07', 'Churachandpur Ridge', 'Manipur', 'Churachandpur', 24.3333, 93.6833, 920, 'degraded', 'low', NOW()),
  ('88888888-8888-8888-8888-888888888888', 'ST-TRIP-08', 'Jampui Hills Station', 'Tripura', 'North Tripura', 23.9500, 92.2700, 930, 'online', 'low', NOW());

-- 2. Insert Sensor Readings for Cherrapunji (Severe)
INSERT INTO public.sensor_readings (station_id, rainfall_mm, rainfall_24h_mm, soil_moisture_pct, slope_tilt_deg, temperature_c, humidity_pct, pore_water_pressure_kpa, recorded_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', 48.5, 312.4, 88.5, 4.8, 19.2, 98.0, 42.1, NOW() - INTERVAL '10 minutes'),
  ('11111111-1111-1111-1111-111111111111', 42.1, 280.0, 85.2, 4.1, 19.5, 97.0, 39.5, NOW() - INTERVAL '1 hour'),
  ('22222222-2222-2222-2222-222222222222', 28.4, 185.2, 74.8, 2.9, 16.8, 92.0, 28.4, NOW() - INTERVAL '15 minutes'),
  ('44444444-4444-4444-4444-444444444444', 35.2, 245.0, 82.1, 3.7, 21.0, 95.0, 36.8, NOW() - INTERVAL '5 minutes');

-- 3. Insert Risk Assessments
INSERT INTO public.risk_assessments (station_id, risk_score, risk_level, primary_trigger, landslide_probability, ai_summary, recommended_action, assessed_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', 92.4, 'severe', 'Extreme 24h rainfall (312mm) coupled with high slope tilt displacement (4.8°)', 0.924, 'AI sensor fusion indicates imminent slope instability near Sohra-Shella road corridor due to saturated soil moisture (>88%).', 'IMMEDIATE EVACUATION of low-lying hillside dwellings. Suspend heavy traffic on NH-206.', NOW()),
  ('22222222-2222-2222-2222-222222222222', 78.1, 'high', 'Accelerated pore water pressure rise (28.4 kPa) after continuous monsoon downpour', 0.781, 'Slope movement sensors show minor creep (2.9°). High risk of localized mudflows along Gangtok bypass.', 'Issue Level 2 Orange Alert. Deploy field monitoring personnel to Sector 4.', NOW()),
  ('44444444-4444-4444-4444-444444444444', 86.9, 'severe', 'Saturated soil (82%) combined with steep terrain gradient', 0.869, 'Critical pore pressure threshold reached. High rockfall probability on Aizawl-Lunglei highway.', 'Close Aizawl Cliffside road stretch. Activate local emergency response unit.', NOW());

-- 4. Insert Active Alerts
INSERT INTO public.alerts (alert_code, station_id, title, severity, affected_areas, advisory_text, recommended_action, issued_by, issued_at, expires_at, status)
VALUES
  ('ALT-MEGH-2026-001', '11111111-1111-1111-1111-111111111111', 'CRITICAL LANDSLIDE WARNING: Cherrapunji Corridor', 'severe', ARRAY['Cherrapunji', 'Sohra', 'Nongriat', 'Shella Highway'], 'Torrential rainfall exceeding 300mm in 24 hours has destabilized the eastern cliff face. High probability of major mudslides.', 'Evacuate vulnerable slope habitations immediately. Follow NDRF shelter instructions.', 'RAHAT AI Automated Early Warning Hub', NOW(), NOW() + INTERVAL '24 hours', 'active'),
  ('ALT-MIZO-2026-002', '44444444-4444-4444-4444-444444444444', 'HIGH RISK LANDSLIDE ADVISORY: Aizawl Cliffside', 'severe', ARRAY['Aizawl City South', 'Bawngkawn', 'Zemabawk'], 'Continuous heavy precipitation has triggered slope tilt displacement of 3.7 degrees. Severe rockfall hazard.', 'Restrict vehicular travel on cliffside arterial roads.', 'State Disaster Management Authority (SDMA)', NOW() - INTERVAL '2 hours', NOW() + INTERVAL '18 hours', 'active'),
  ('ALT-SIKK-2026-003', '22222222-2222-2222-2222-222222222222', 'MODERATE HAZARD BULLETIN: Gangtok Hill Section', 'high', ARRAY['Gangtok North', 'Chandmari', 'Deorali Slope'], 'Soil saturation levels have surpassed critical threshold (74%). Minor debris flows observed near drainage channels.', 'Avoid parking near unstable embankments.', 'Sikkim SDRF Control Room', NOW() - INTERVAL '5 hours', NOW() + INTERVAL '12 hours', 'active');

-- 5. Insert Sample Citizen Reports
INSERT INTO public.reports (idempotency_key, reporter_name, reporter_role, state, district, location_description, latitude, longitude, hazard_type, severity, description, verification_status, sync_source, created_at)
VALUES
  ('REPORT-KEY-001', 'Tashi Norbu', 'citizen', 'Sikkim', 'East Sikkim', 'Near 5th Mile NH-10 near Gangtok entrance', 27.3200, 88.6050, 'rockfall', 'high', 'Small boulders falling onto the road after heavy rain. Cracks visible on upper slope cut.', 'verified', 'web_online', NOW() - INTERVAL '40 minutes'),
  ('REPORT-KEY-002', 'Lalthan Mawia', 'field_operator', 'Mizoram', 'Aizawl', 'Bawngkawn junction hill incline', 23.7310, 92.7210, 'slope_crack', 'severe', 'Ground crack opening about 3 inches wide along 15 meters of road shoulder. Water seeping rapidly.', 'verified', 'pwa_offline_sync', NOW() - INTERVAL '1 hour'),
  ('REPORT-KEY-003', 'Prabin Das', 'citizen', 'Assam', 'Dima Hasao', 'Haflong station road near stream culvert', 25.1800, 93.0200, 'mudslide', 'moderate', 'Mud and loose soil sliding onto drainage canal. Road partially blocked.', 'pending', 'pwa_offline_sync', NOW() - INTERVAL '2 hours');

-- 6. Insert Audit Logs
INSERT INTO public.audit_logs (action, entity_type, entity_id, details)
VALUES
  ('SYSTEM_INIT', 'station', '11111111-1111-1111-1111-111111111111', '{"event": "Telemetry stream initialized", "sensors": ["rainfall", "moisture", "tilt"]}'::jsonb),
  ('ALERT_BROADCAST', 'alert', 'ALT-MEGH-2026-001', '{"channels": ["SMS", "CAP_BROADCAST", "PUBLIC_DASHBOARD"], "recipients": 14200}'::jsonb),
  ('REPORT_VERIFIED', 'report', 'REPORT-KEY-001', '{"verifier": "Field Operator #04", "status": "verified"}'::jsonb);
