'use client';

import React, { useState } from 'react';
import { useStations } from '@/hooks/useStations';
import { useAlerts } from '@/hooks/useAlerts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { RiskBadge } from '@/components/ui/StatusBadge';
import { LoadingState } from '@/components/ui/LoadingState';
import {
  ShieldAlert,
  Radio,
  CloudRain,
  Activity,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Sliders,
  RotateCcw,
} from 'lucide-react';
import { OperatingModeBadge, LiveWeatherBadge } from '@/components/ui/DataLabelBadge';
import { useLanguage } from '@/lib/providers/LanguageProvider';
import { ActionGuidancePanel } from '@/components/ui/ActionGuidancePanel';
import { DataStatusStrip } from '@/components/ui/DataStatusStrip';
import { WhyRiskCard } from '@/components/ui/WhyRiskCard';

export default function RiskDashboardPage() {
  const { stations, loading: stationsLoading } = useStations();
  const { alerts } = useAlerts();
  const { t } = useLanguage();
  const [selectedStationId, setSelectedStationId] = useState<string>('st_01');
  const [demoScenario, setDemoScenario] = useState<'low' | 'moderate' | 'high' | 'severe' | null>(null);

  if (stationsLoading) {
    return <LoadingState message={t('loading')} />;
  }

  const baseStation = stations.find((s) => s.id === selectedStationId) || stations[0] || {
    id: 'st_01',
    code: 'SHR-01',
    name: 'Sohra East Ridge',
    state: 'Meghalaya',
    district: 'East Khasi Hills',
    risk_level: 'severe' as const,
    status: 'online',
    elevation_m: 1420,
    latest_reading: {
      rainfall_24h_mm: 185.4,
      soil_moisture_pct: 84.5,
      slope_tilt_deg: 34.5,
    },
  };

  // Compute active state based on optional Demo Scenario override
  const activeRiskLevel: 'low' | 'moderate' | 'high' | 'severe' = demoScenario || baseStation.risk_level || 'moderate';

  const getDemoReadings = (level: 'low' | 'moderate' | 'high' | 'severe') => {
    switch (level) {
      case 'low':
        return { rain24: 12.4, forecast6: 2.5, soil: 42.0, slope: 22.0 };
      case 'moderate':
        return { rain24: 65.0, forecast6: 14.0, soil: 64.0, slope: 28.5 };
      case 'high':
        return { rain24: 125.0, forecast6: 32.0, soil: 78.0, slope: 33.0 };
      case 'severe':
      default:
        return {
          rain24: baseStation.latest_reading?.rainfall_24h_mm ?? 185.4,
          forecast6: 22.0,
          soil: baseStation.latest_reading?.soil_moisture_pct ?? 84.5,
          slope: baseStation.latest_reading?.slope_tilt_deg ?? 34.5,
        };
    }
  };

  const activeReadings = getDemoReadings(activeRiskLevel);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-earth-300 dark:border-gray-800 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-earth-200 dark:bg-gray-800 rounded-xl border border-earth-300 dark:border-gray-700 text-brand-primary dark:text-saffron-primary shadow-xs">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-earth-900 dark:text-white tracking-tight">
                {t('dashboardTitle')}
              </h1>
              <p className="text-xs sm:text-sm text-earth-600 dark:text-gray-400 mt-0.5 font-medium">
                {t('dashboardSubtitle')}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <OperatingModeBadge mode={demoScenario ? 'simulation_training' : 'live_decision_support'} />
          <LiveWeatherBadge />
        </div>
      </div>

      {/* Trust & Data Status Strip */}
      <DataStatusStrip
        stationName={`${baseStation.name} (${baseStation.district}, ${baseStation.state})`}
        providerName="Open-Meteo Weather API"
        isSimulation={!!demoScenario}
      />

      {/* Station Selector & Demo Scenario Controls */}
      <div className="bg-white dark:bg-gray-800 border border-earth-300 dark:border-gray-700 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-2 text-earth-900 dark:text-white font-semibold text-xs sm:text-sm">
            <Radio className="w-4 h-4 text-brand-primary dark:text-saffron-primary" />
            <span>{t('targetCorridorLabel')}:</span>
          </div>
          <select
            value={selectedStationId}
            onChange={(e) => {
              setSelectedStationId(e.target.value);
              setDemoScenario(null);
            }}
            className="bg-earth-100 dark:bg-gray-900 text-earth-900 dark:text-white text-xs border border-earth-300 dark:border-gray-700 rounded-xl px-3.5 py-2 focus:ring-2 focus:ring-brand-primary font-medium"
          >
            {stations.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.district}, {s.state})
              </option>
            ))}
          </select>
        </div>

        {/* Safe Demo Scenario Controls */}
        <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-earth-200 dark:border-gray-700">
          <Sliders className="w-3.5 h-3.5 text-earth-500 dark:text-gray-400" />
          <span className="text-[11px] font-semibold text-earth-600 dark:text-gray-400">Demo Scenario:</span>
          <div className="flex items-center gap-1">
            {(['low', 'moderate', 'high', 'severe'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setDemoScenario(lvl)}
                className={`px-2 py-1 rounded text-[10px] font-bold capitalize transition-all ${
                  demoScenario === lvl
                    ? 'bg-brand-primary text-white dark:bg-saffron-primary dark:text-earth-950 shadow-xs'
                    : 'bg-earth-100 dark:bg-gray-900 text-earth-700 dark:text-gray-300 border border-earth-300 dark:border-gray-700 hover:bg-earth-200 dark:hover:bg-gray-800'
                }`}
              >
                {lvl}
              </button>
            ))}
            {demoScenario && (
              <button
                onClick={() => setDemoScenario(null)}
                title="Reset to Live Data"
                className="p-1 rounded bg-earth-200 text-earth-700 dark:bg-gray-700 dark:text-gray-200 hover:bg-earth-300"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Prominent "What to do now" Action Guidance Panel */}
      <ActionGuidancePanel riskLevel={activeRiskLevel} />

      {/* Structured Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* A. Current Hazard Summary Card */}
        <Card variant="tactical">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center justify-between">
              <span className="flex items-center gap-2 text-earth-900 dark:text-white">
                <Activity className="w-4 h-4 text-brand-primary dark:text-saffron-primary" /> {t('currentHazardSummary')}
              </span>
              <RiskBadge level={activeRiskLevel} />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-baseline justify-between bg-earth-100 dark:bg-gray-900 p-4 rounded-xl border border-earth-300 dark:border-gray-700">
              <span className="text-xs text-earth-600 dark:text-gray-400 font-medium">{t('relativeHazardScore')}</span>
              <span className="text-3xl font-bold text-earth-900 dark:text-white">
                {activeRiskLevel === 'severe' ? '86' : activeRiskLevel === 'high' ? '72' : activeRiskLevel === 'moderate' ? '48' : '18'} / 100
              </span>
            </div>
            <div className="text-xs text-earth-800 dark:text-gray-300 space-y-2 leading-relaxed font-medium">
              <div><strong className="text-earth-900 dark:text-white">{t('hazardCategory')}:</strong> <span className="capitalize">{t(activeRiskLevel)}</span></div>
              <div><strong className="text-earth-900 dark:text-white">{t('primaryTrigger')}:</strong> 24h Cumulative Rainfall Window</div>
              <div><strong className="text-earth-900 dark:text-white">{t('advisoryNote')}:</strong> Monitor steep cut slopes and slope runoff.</div>
            </div>
          </CardContent>
        </Card>

        {/* B. Weather Conditions Card */}
        <Card variant="tactical">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2 text-earth-900 dark:text-white">
              <CloudRain className="w-4 h-4 text-brand-primary dark:text-saffron-primary" /> {t('weatherConditions')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-earth-100 dark:bg-gray-900 p-3 rounded-xl border border-earth-300 dark:border-gray-700">
                <div className="text-earth-600 dark:text-gray-400 mb-1 font-medium">{t('rain24h')}</div>
                <div className="text-xl font-bold text-earth-900 dark:text-white">{activeReadings.rain24} mm</div>
              </div>
              <div className="bg-earth-100 dark:bg-gray-900 p-3 rounded-xl border border-earth-300 dark:border-gray-700">
                <div className="text-earth-600 dark:text-gray-400 mb-1 font-medium">{t('forecast6h')}</div>
                <div className="text-xl font-bold text-saffron-primary">{activeReadings.forecast6} mm</div>
              </div>
            </div>
            <div className="text-xs text-earth-600 dark:text-gray-400 flex items-center justify-between pt-1 font-medium">
              <span>{t('temperature')}: 21.5°C</span>
              <span>{t('relativeHumidity')}: 88%</span>
            </div>
          </CardContent>
        </Card>

        {/* C. Ground/Station Observations Card */}
        <Card variant="tactical">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2 text-earth-900 dark:text-white">
              <Radio className="w-4 h-4 text-brand-primary dark:text-saffron-primary" /> {t('groundTerrainMetadata')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-earth-100 dark:bg-gray-900 p-3 rounded-xl border border-earth-300 dark:border-gray-700">
                <div className="text-earth-600 dark:text-gray-400 mb-1 font-medium">{t('slopeAngle')}</div>
                <div className="text-xl font-bold text-earth-900 dark:text-white">{activeReadings.slope}°</div>
              </div>
              <div className="bg-earth-100 dark:bg-gray-900 p-3 rounded-xl border border-earth-300 dark:border-gray-700">
                <div className="text-earth-600 dark:text-gray-400 mb-1 font-medium">{t('soilSaturation')}</div>
                <div className="text-xl font-bold text-earth-900 dark:text-white">{activeReadings.soil}%</div>
              </div>
            </div>
            <div className="text-xs text-earth-600 dark:text-gray-400 flex items-center justify-between pt-1 font-medium">
              <span>{t('elevation')}: {baseStation.elevation_m || 1200}m</span>
              <span>{t('geology')}: Fractured Schist</span>
            </div>
          </CardContent>
        </Card>

        {/* D. Risk Trend Card */}
        <Card variant="tactical">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2 text-earth-900 dark:text-white">
              <TrendingUp className="w-4 h-4 text-brand-primary dark:text-saffron-primary" /> {t('hazardTrend')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-24 bg-earth-100 dark:bg-gray-900 rounded-xl border border-earth-300 dark:border-gray-700 p-3 flex items-end justify-between gap-2">
              {[25, 30, 42, 55, 68, 86, 74, 64].map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div
                    style={{ height: `${v}%` }}
                    className={`w-full rounded-md transition-all ${
                      v > 75 ? 'bg-red-600 dark:bg-red-500' : v > 50 ? 'bg-saffron-primary' : 'bg-earth-400'
                    }`}
                  />
                  <span className="text-[10px] text-earth-600 dark:text-gray-400 font-mono">{i * 3}h</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-earth-600 dark:text-gray-400 leading-relaxed font-medium">
              {t('peakHazardWindow')}
            </p>
          </CardContent>
        </Card>

        {/* E. Active In-App Alerts Card */}
        <Card variant="tactical">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center justify-between">
              <span className="flex items-center gap-2 text-earth-900 dark:text-white">
                <AlertTriangle className="w-4 h-4 text-brand-primary dark:text-saffron-primary" /> {t('stagedInAppAlerts')} ({alerts.length})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.slice(0, 2).map((a) => (
              <div key={a.id} className="p-3 bg-earth-100 dark:bg-gray-900 rounded-xl border border-earth-300 dark:border-gray-700 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-earth-900 dark:text-white">{a.title}</span>
                  <RiskBadge level={a.severity} />
                </div>
                <p className="text-xs text-earth-600 dark:text-gray-400 line-clamp-1">{a.advisory_text}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* F. Explainable "Why this risk?" Card */}
        <WhyRiskCard
          className="md:col-span-2 lg:col-span-1"
          metrics={{
            rainfall24h: activeReadings.rain24,
            forecast6h: activeReadings.forecast6,
            soilMoisture: activeReadings.soil,
            slopeTilt: activeReadings.slope,
            geology: 'Fractured Schist / High Permeability',
            dataQuality: 94,
            riskLevel: activeRiskLevel,
          }}
        />
      </div>
    </div>
  );
}
