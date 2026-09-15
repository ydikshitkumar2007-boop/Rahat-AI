'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StationStatusBadge } from '@/components/ui/StatusBadge';
import { Radio, Search, CloudRain, Sliders, RefreshCw, MapPin, BrainCircuit } from 'lucide-react';
import {
  DEMO_VIRTUAL_STATIONS,
  searchLocation,
  fetchLiveWeather,
  generateSimulatedTelemetry,
  GeocodeLocation,
  LiveWeatherData,
} from '@/services/weather';
import { evaluateDualRiskScore, MLInferenceResult } from '@/services/mlInference';
import { TruthfulnessNoticeBanner } from '@/components/ui/TruthfulnessNoticeBanner';
import { LiveWeatherBadge, SimulatedTelemetryBadge, MLModelStatusBadge } from '@/components/ui/DataLabelBadge';
import { WeatherStation, SimulationScenario } from '@/types';
import { useLanguage } from '@/lib/providers/LanguageProvider';

export default function AdminStationsPage() {
  const { t } = useLanguage();
  const [stations, setStations] = useState<WeatherStation[]>(DEMO_VIRTUAL_STATIONS);
  const [selectedStation, setSelectedStation] = useState<WeatherStation>(DEMO_VIRTUAL_STATIONS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodeLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Station readings & live weather state
  const [liveWeather, setLiveWeather] = useState<LiveWeatherData | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [scenario, setScenario] = useState<SimulationScenario>('normal');

  // Simulated telemetry sliders
  const [soilSaturation, setSoilSaturation] = useState(42.0);
  const [slopeDisplacement, setSlopeDisplacement] = useState(0.4);
  const [vibrationScore, setVibrationScore] = useState(12.0);
  const [vulnerability, setVulnerability] = useState(75);

  const [dualRiskResult, setDualRiskResult] = useState<MLInferenceResult | null>(null);

  // Fetch live weather from Open-Meteo on station change
  const loadStationWeather = async (st: WeatherStation) => {
    setIsLoadingWeather(true);
    const weather = await fetchLiveWeather(st.latitude, st.longitude);
    setLiveWeather(weather);
    setIsLoadingWeather(false);

    // Calculate Dual ML & Rule-Based Risk Scores
    const livePrecip = weather?.live_precipitation_mm ?? 0;
    const forecastRain = weather?.forecast_rain_next_6h_mm ?? 0;

    const evaluation = evaluateDualRiskScore({
      live_precipitation_mm: livePrecip,
      forecast_rain_next_6h_mm: forecastRain,
      live_relative_humidity: weather?.live_relative_humidity ?? 70,
      simulated_soil_saturation_pct: soilSaturation,
      simulated_slope_displacement_mm: slopeDisplacement,
      simulated_vibration_score: vibrationScore,
      terrain_vulnerability: st.terrain_vulnerability,
    });
    setDualRiskResult(evaluation);
  };

  useEffect(() => {
    loadStationWeather(selectedStation);
  }, [selectedStation, scenario, soilSaturation, slopeDisplacement, vibrationScore, vulnerability]);

  const handleScenarioChange = (newScenario: SimulationScenario) => {
    setScenario(newScenario);
    const telemetry = generateSimulatedTelemetry(newScenario);
    setSoilSaturation(telemetry.simulated_soil_saturation_pct);
    setSlopeDisplacement(telemetry.simulated_slope_displacement_mm);
    setVibrationScore(telemetry.simulated_vibration_score);
  };

  const handleSearchLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    const results = await searchLocation(searchQuery);
    setSearchResults(results);
    setIsSearching(false);
  };

  const handleAddVirtualStation = (loc: GeocodeLocation) => {
    const newStation: WeatherStation = {
      id: `ws-custom-${Date.now()}`,
      name: `${loc.name} Virtual Station`,
      location_name: `${loc.name}, ${loc.admin1}`,
      latitude: loc.latitude,
      longitude: loc.longitude,
      terrain_vulnerability: vulnerability,
      is_active: true,
      is_demo: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setStations([newStation, ...stations]);
    setSelectedStation(newStation);
    setSearchResults([]);
    setSearchQuery('');
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="border-b border-sand-300 dark:border-earth-800 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-earth-900 dark:text-earth-100 flex items-center gap-2">
            <Radio className="h-5 w-5 text-earth-600 dark:text-earth-400" />
            {t('stations')} & Monitoring Management
          </h1>
          <p className="text-xs text-earth-600 dark:text-earth-400 mt-1">
            Fusing live Open-Meteo weather data with simulated terrain telemetry for nowcast estimation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <LiveWeatherBadge />
          <SimulatedTelemetryBadge />
        </div>
      </div>

      {/* Truthfulness Notice Disclaimer */}
      <TruthfulnessNoticeBanner />

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Virtual Stations List & Search */}
        <div className="lg:col-span-5 space-y-6">
          {/* Location Geocoding Search */}
          <Card variant="tactical">
            <CardHeader>
              <CardTitle className="text-xs flex items-center gap-2 text-earth-900 dark:text-earth-100">
                <Search className="h-4 w-4 text-earth-600 dark:text-earth-400" />
                {t('addStation')} (Open-Meteo Geocoding)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <form onSubmit={handleSearchLocation} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search hill location (e.g. Shillong, Gangtok)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-sand-100 dark:bg-earth-800 border border-sand-300 dark:border-earth-700 rounded px-3 py-1.5 text-xs text-earth-900 dark:text-earth-100 focus:outline-none focus:ring-2 focus:ring-earth-500 font-medium"
                />
                <Button type="submit" disabled={isSearching} size="sm" className="px-3">
                  {isSearching ? t('loading') : t('search')}
                </Button>
              </form>

              {searchResults.length > 0 && (
                <div className="space-y-1.5 max-h-48 overflow-y-auto border-t border-sand-300 dark:border-earth-800 pt-2">
                  <span className="text-[10px] text-earth-600 dark:text-earth-400 block uppercase font-medium">Open-Meteo Location Results:</span>
                  {searchResults.map((loc) => (
                    <div
                      key={loc.id}
                      className="p-2 bg-sand-100 dark:bg-earth-800 border border-sand-300 dark:border-earth-700 rounded flex items-center justify-between hover:border-earth-400 transition-colors"
                    >
                      <div className="text-xs">
                        <div className="font-bold text-earth-900 dark:text-earth-100">{loc.name}</div>
                        <div className="text-[10px] text-earth-600 dark:text-earth-400">
                          {loc.admin1}, {loc.country} ({loc.latitude.toFixed(2)}°N, {loc.longitude.toFixed(2)}°E)
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAddVirtualStation(loc)}
                        className="text-[10px] py-0.5 px-2"
                      >
                        + {t('addStation')}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Virtual Weather Stations Inventory */}
          <Card variant="tactical">
            <CardHeader>
              <CardTitle className="text-xs flex items-center justify-between text-earth-900 dark:text-earth-100">
                <span>{t('activeWeatherStations')}</span>
                <span className="text-[10px] text-earth-600 dark:text-earth-400">{stations.length} {t('monitored')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {stations.map((st) => (
                <button
                  key={st.id}
                  onClick={() => setSelectedStation(st)}
                  className={`w-full p-3 rounded text-left border transition-all flex items-center justify-between ${
                    selectedStation.id === st.id
                      ? 'bg-sand-100 dark:bg-earth-800 text-brand-800 dark:text-brand-300 border-l-4 border-l-saffron-500 border-sand-300 dark:border-earth-700 font-semibold shadow-xs'
                      : 'bg-white dark:bg-earth-800/60 border-sand-300 dark:border-earth-700 text-earth-900 dark:text-earth-100 hover:border-sand-400'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-xs">{st.name}</div>
                    <div className="text-[10px] opacity-80 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {st.location_name}
                    </div>
                  </div>

                  <div className="text-right text-[10px]">
                    <span className="opacity-80 block">Vulnerability</span>
                    <span className="font-bold">{st.terrain_vulnerability}%</span>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Live Open-Meteo Weather + Telemetry Simulation + Dual Score Output */}
        <div className="lg:col-span-7 space-y-6">
          {/* Live Open-Meteo Weather Card */}
          <Card variant="tactical">
            <CardHeader>
              <CardTitle className="text-xs flex items-center justify-between text-earth-900 dark:text-earth-100">
                <span className="flex items-center gap-2">
                  <CloudRain className="h-4 w-4 text-earth-600 dark:text-earth-400" />
                  Live Weather Feed: {selectedStation.name}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => loadStationWeather(selectedStation)}
                  className="text-[10px] flex items-center gap-1"
                >
                  <RefreshCw className={`h-3 w-3 ${isLoadingWeather ? 'animate-spin' : ''}`} />
                  {t('refresh')}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 bg-sand-100 dark:bg-earth-800 border border-sand-300 dark:border-earth-700 rounded">
                  <span className="text-[10px] text-earth-600 dark:text-earth-400 block uppercase font-medium">{t('temperature')}</span>
                  <span className="text-base font-bold text-earth-900 dark:text-earth-100">
                    {liveWeather?.live_temperature_c ?? 'N/A'} °C
                  </span>
                </div>

                <div className="p-2.5 bg-sand-100 dark:bg-earth-800 border border-sand-300 dark:border-earth-700 rounded">
                  <span className="text-[10px] text-earth-600 dark:text-earth-400 block uppercase font-medium">{t('relativeHumidity')}</span>
                  <span className="text-base font-bold text-earth-800 dark:text-earth-200">
                    {liveWeather?.live_relative_humidity ?? 'N/A'} %
                  </span>
                </div>

                <div className="p-2.5 bg-sand-100 dark:bg-earth-800 border border-sand-300 dark:border-earth-700 rounded">
                  <span className="text-[10px] text-earth-600 dark:text-earth-400 block uppercase font-medium">{t('rain24h')}</span>
                  <span className="text-base font-bold text-earth-900 dark:text-earth-100">
                    {liveWeather?.live_precipitation_mm ?? 0} mm
                  </span>
                </div>

                <div className="p-2.5 bg-sand-100 dark:bg-earth-800 border border-sand-300 dark:border-earth-700 rounded">
                  <span className="text-[10px] text-earth-600 dark:text-earth-400 block uppercase font-medium">{t('forecast6h')}</span>
                  <span className="text-base font-bold text-risk-moderate">
                    {liveWeather?.forecast_rain_next_6h_mm ?? 0} mm
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Telemetry Scenario Simulator */}
          <Card variant="tactical">
            <CardHeader>
              <CardTitle className="text-xs flex items-center justify-between text-earth-900 dark:text-earth-100">
                <span className="flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-risk-moderate" />
                  Simulated Terrain Controls
                </span>
                <SimulatedTelemetryBadge />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              {/* Scenario Preset Buttons */}
              <div className="flex gap-2">
                {(['normal', 'heavy_rain', 'extreme_rain'] as SimulationScenario[]).map((sc) => (
                  <button
                    key={sc}
                    type="button"
                    onClick={() => handleScenarioChange(sc)}
                    className={`flex-1 py-1.5 rounded text-[11px] uppercase font-semibold border transition-colors ${
                      scenario === sc
                        ? 'bg-brand-600 text-white border-brand-700'
                        : 'bg-sand-100 dark:bg-earth-800 text-earth-800 dark:text-earth-200 border-sand-300 dark:border-earth-700 hover:bg-sand-200'
                    }`}
                  >
                    Scenario: {sc.replace('_', ' ')}
                  </button>
                ))}
              </div>

              {/* Sliders */}
              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between mb-1 text-earth-800 dark:text-earth-200 font-semibold">
                    <span>{t('soilSaturation')}</span>
                    <span className="font-bold text-risk-moderate">{soilSaturation}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={soilSaturation}
                    onChange={(e) => {
                      setSoilSaturation(Number(e.target.value));
                      setScenario('manual');
                    }}
                    className="w-full accent-earth-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1 text-earth-800 dark:text-earth-200 font-semibold">
                    <span>{t('slopeAngle')} Displacement</span>
                    <span className="font-bold text-risk-severe">{slopeDisplacement} mm</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={slopeDisplacement}
                    onChange={(e) => {
                      setSlopeDisplacement(Number(e.target.value));
                      setScenario('manual');
                    }}
                    className="w-full accent-earth-600 cursor-pointer"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dual Score Output */}
          {dualRiskResult && (
            <Card variant="tactical">
              <CardHeader>
                <CardTitle className="text-xs flex items-center justify-between text-earth-900 dark:text-earth-100">
                  <span className="flex items-center gap-2">
                    <BrainCircuit className="h-4 w-4 text-earth-600 dark:text-earth-400" />
                    ML & Rule-Based Comparison
                  </span>
                  <MLModelStatusBadge
                    status={dualRiskResult.model_status}
                    version={dualRiskResult.model_version}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4 text-xs">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-sand-100 dark:bg-earth-800 border border-sand-300 dark:border-earth-700 rounded">
                    <span className="text-[10px] text-earth-600 dark:text-earth-400 uppercase block font-semibold">ML Score</span>
                    <span className="text-xl font-bold text-earth-900 dark:text-earth-100">
                      {dualRiskResult.prototype_ml_risk_score}/100
                    </span>
                  </div>

                  <div className="p-3 bg-sand-100 dark:bg-earth-800 border border-sand-300 dark:border-earth-700 rounded">
                    <span className="text-[10px] text-earth-600 dark:text-earth-400 uppercase block font-semibold">Rule Score</span>
                    <span className="text-xl font-bold text-earth-800 dark:text-earth-200">
                      {dualRiskResult.rule_based_risk_score}/100
                    </span>
                  </div>

                  <div className="p-3 bg-sand-100 dark:bg-earth-800 border border-sand-300 dark:border-earth-700 rounded">
                    <span className="text-[10px] text-earth-600 dark:text-earth-400 uppercase block font-semibold">Nowcast</span>
                    <span className="text-xl font-bold text-risk-moderate">
                      {dualRiskResult.final_demo_risk_score}/100
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded space-y-1 text-amber-900 dark:text-amber-200">
                  <span className="text-[10px] font-semibold uppercase block">Model Status:</span>
                  <p className="text-xs">{dualRiskResult.status_message}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
