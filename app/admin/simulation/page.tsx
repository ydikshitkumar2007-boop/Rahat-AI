'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Sliders, AlertTriangle, BrainCircuit } from 'lucide-react';
import { evaluateDualRiskScore } from '@/services/mlInference';
import { MLModelStatusBadge, OperatingModeBadge } from '@/components/ui/DataLabelBadge';
import { useLanguage } from '@/lib/providers/LanguageProvider';

export default function AdminSimulationPage() {
  const { t } = useLanguage();
  const [scenario, setScenario] = useState<'normal' | 'heavy_rain' | 'extreme_rain' | 'manual'>('manual');
  const [livePrecip, setLivePrecip] = useState(25);
  const [forecastRain, setForecastRain] = useState(60);
  const [soilMoisture, setSoilMoisture] = useState(75);
  const [slopeDisplacement, setSlopeDisplacement] = useState(2.8);
  const [vibrationScore, setVibrationScore] = useState(40);
  const [terrainVuln, setTerrainVuln] = useState(70);

  const applyPreset = (sc: 'normal' | 'heavy_rain' | 'extreme_rain') => {
    setScenario(sc);
    if (sc === 'normal') {
      setLivePrecip(5);
      setForecastRain(12);
      setSoilMoisture(35);
      setSlopeDisplacement(0.3);
      setVibrationScore(10);
      setTerrainVuln(45);
    } else if (sc === 'heavy_rain') {
      setLivePrecip(35);
      setForecastRain(75);
      setSoilMoisture(78);
      setSlopeDisplacement(2.4);
      setVibrationScore(50);
      setTerrainVuln(75);
    } else if (sc === 'extreme_rain') {
      setLivePrecip(58);
      setForecastRain(140);
      setSoilMoisture(92);
      setSlopeDisplacement(4.5);
      setVibrationScore(85);
      setTerrainVuln(88);
    }
  };

  const dualRiskResult = evaluateDualRiskScore({
    live_precipitation_mm: livePrecip,
    forecast_rain_next_6h_mm: forecastRain,
    live_relative_humidity: 85,
    simulated_soil_saturation_pct: soilMoisture,
    simulated_slope_displacement_mm: slopeDisplacement,
    simulated_vibration_score: vibrationScore,
    terrain_vulnerability: terrainVuln,
  });

  return (
    <div className="space-y-6">
      {/* Simulation Persistent Mandatory Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl text-earth-900 dark:text-earth-100 flex items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-7 h-7 text-risk-moderate shrink-0" />
          <div>
            <h2 className="text-base font-bold text-earth-900 dark:text-earth-100 uppercase tracking-wider">
              {t('simulationNoticeTitle')}
            </h2>
            <p className="text-xs text-earth-700 dark:text-earth-300 mt-0.5 font-medium">
              {t('simulationNoticeDesc')}
            </p>
          </div>
        </div>
        <OperatingModeBadge mode="simulation" />
      </div>

      {/* Header */}
      <div className="border-b border-sand-300 dark:border-earth-800 pb-4">
        <h1 className="text-xl font-bold text-earth-900 dark:text-earth-100 flex items-center gap-2">
          <Sliders className="h-5 w-5 text-earth-600 dark:text-earth-400" />
          {t('simulations')} — Scenario Laboratory
        </h1>
        <p className="text-xs text-earth-600 dark:text-earth-400 mt-1">
          Adjust synthetic precipitation and terrain parameters to test decision-support hazard estimates.
        </p>
      </div>

      {/* Scenario Presets Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-sand-50 dark:bg-earth-850 border border-sand-300 dark:border-earth-800 p-3 rounded-xl">
        <span className="text-xs font-semibold text-earth-800 dark:text-earth-200">Scenario Presets:</span>
        <button
          onClick={() => applyPreset('normal')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            scenario === 'normal'
              ? 'bg-brand-600 text-white shadow-xs'
              : 'bg-sand-100 dark:bg-earth-800 text-earth-800 dark:text-earth-200 border border-sand-300 dark:border-earth-700 hover:bg-sand-200'
          }`}
        >
          Normal Monsoonal
        </button>
        <button
          onClick={() => applyPreset('heavy_rain')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            scenario === 'heavy_rain'
              ? 'bg-brand-600 text-white shadow-xs'
              : 'bg-sand-100 dark:bg-earth-800 text-earth-800 dark:text-earth-200 border border-sand-300 dark:border-earth-700 hover:bg-sand-200'
          }`}
        >
          Heavy Rainfall Event
        </button>
        <button
          onClick={() => applyPreset('extreme_rain')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            scenario === 'extreme_rain'
              ? 'bg-risk-severe text-white'
              : 'bg-sand-100 dark:bg-earth-800 text-earth-800 dark:text-earth-200 border border-sand-300 dark:border-earth-700 hover:bg-sand-200'
          }`}
        >
          Extreme Cloudburst Event
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-6 space-y-4">
          <Card variant="tactical">
            <CardHeader className="pb-3 border-b border-sand-300 dark:border-earth-800">
              <CardTitle className="text-xs font-semibold text-earth-900 dark:text-earth-100 flex items-center justify-between">
                <span>Synthetic Parameter Sliders</span>
                <span className="text-[10px] text-risk-moderate uppercase font-semibold">{t('simulatedTelemetry')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs pt-4">
              <div>
                <div className="flex justify-between mb-1 text-earth-800 dark:text-earth-200 font-semibold">
                  <span>Precipitation (mm)</span>
                  <span className="font-bold text-earth-900 dark:text-earth-100">{livePrecip} mm</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={livePrecip}
                  onChange={(e) => {
                    setScenario('manual');
                    setLivePrecip(Number(e.target.value));
                  }}
                  className="w-full accent-earth-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1 text-earth-800 dark:text-earth-200 font-semibold">
                  <span>6h Forecast Rain (mm)</span>
                  <span className="font-bold text-earth-900 dark:text-earth-100">{forecastRain} mm</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="150"
                  value={forecastRain}
                  onChange={(e) => {
                    setScenario('manual');
                    setForecastRain(Number(e.target.value));
                  }}
                  className="w-full accent-earth-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1 text-earth-800 dark:text-earth-200 font-semibold">
                  <span>Soil Saturation (%)</span>
                  <span className="font-bold text-risk-moderate">{soilMoisture}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={soilMoisture}
                  onChange={(e) => {
                    setScenario('manual');
                    setSoilMoisture(Number(e.target.value));
                  }}
                  className="w-full accent-earth-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1 text-earth-800 dark:text-earth-200 font-semibold">
                  <span>Slope Displacement (mm)</span>
                  <span className="font-bold text-risk-severe">{slopeDisplacement} mm</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="0.1"
                  value={slopeDisplacement}
                  onChange={(e) => {
                    setScenario('manual');
                    setSlopeDisplacement(Number(e.target.value));
                  }}
                  className="w-full accent-earth-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1 text-earth-800 dark:text-earth-200 font-semibold">
                  <span>Terrain Susceptibility Index (%)</span>
                  <span className="font-bold text-earth-900 dark:text-earth-100">{terrainVuln}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={terrainVuln}
                  onChange={(e) => {
                    setScenario('manual');
                    setTerrainVuln(Number(e.target.value));
                  }}
                  className="w-full accent-earth-600 cursor-pointer"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Evaluation Output Column */}
        <div className="lg:col-span-6 space-y-4">
          <Card variant="tactical">
            <CardHeader className="pb-3 border-b border-sand-300 dark:border-earth-800">
              <CardTitle className="text-xs font-semibold text-earth-900 dark:text-earth-100 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <BrainCircuit className="h-4 w-4 text-earth-600 dark:text-earth-400" />
                  Decision-Support Nowcast Result
                </span>
                <MLModelStatusBadge
                  status={dualRiskResult.model_status}
                  version={dualRiskResult.model_version}
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-sand-100 dark:bg-earth-800 border border-sand-300 dark:border-earth-700 rounded-xl">
                  <span className="text-[10px] text-earth-600 dark:text-earth-400 uppercase block font-semibold">Candidate ML Score</span>
                  <span className="text-xl font-bold text-earth-900 dark:text-earth-100">
                    {dualRiskResult.prototype_ml_risk_score}/100
                  </span>
                </div>

                <div className="p-3 bg-sand-100 dark:bg-earth-800 border border-sand-300 dark:border-earth-700 rounded-xl">
                  <span className="text-[10px] text-earth-600 dark:text-earth-400 uppercase block font-semibold">Rule Baseline Score</span>
                  <span className="text-xl font-bold text-earth-800 dark:text-earth-200">
                    {dualRiskResult.rule_based_risk_score}/100
                  </span>
                </div>

                <div className="p-3 bg-sand-100 dark:bg-earth-800 border border-sand-300 dark:border-earth-700 rounded-xl">
                  <span className="text-[10px] text-earth-600 dark:text-earth-400 uppercase block font-semibold">Hazard Nowcast</span>
                  <span className="text-xl font-bold text-risk-moderate">
                    {dualRiskResult.hazard_nowcast_score}/100
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-sand-100 dark:bg-earth-800 border border-sand-300 dark:border-earth-700 rounded-xl space-y-1.5">
                <span className="text-xs font-semibold text-earth-900 dark:text-earth-100 block">
                  Top Contributing Risk Triggers:
                </span>
                <ul className="list-disc list-inside text-earth-700 dark:text-earth-300 space-y-1 text-xs">
                  {dualRiskResult.contributing_factors.map((factor, idx) => (
                    <li key={idx}>{factor}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-1 text-amber-900 dark:text-amber-200">
                <span className="text-xs font-semibold block">{t('simulationNoticeTitle')}:</span>
                <p className="text-xs leading-relaxed">{dualRiskResult.simulation_disclaimer}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
