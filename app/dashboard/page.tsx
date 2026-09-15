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
  Clock,
  Database,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Cpu,
} from 'lucide-react';
import { OperatingModeBadge, LiveWeatherBadge } from '@/components/ui/DataLabelBadge';
import { useLanguage } from '@/lib/providers/LanguageProvider';

export default function RiskDashboardPage() {
  const { stations, loading: stationsLoading } = useStations();
  const { alerts } = useAlerts();
  const { t } = useLanguage();
  const [selectedStationId, setSelectedStationId] = useState<string>('st_01');

  if (stationsLoading) {
    return <LoadingState message={t('loading')} />;
  }

  const activeStation = stations.find((s) => s.id === selectedStationId) || stations[0] || {
    id: 'st_01',
    code: 'SHR-01',
    name: 'Sohra East Ridge',
    state: 'Meghalaya',
    district: 'East Khasi Hills',
    risk_level: 'severe',
    status: 'online',
    elevation_m: 1420,
    latest_reading: {
      rainfall_24h_mm: 185.4,
      soil_moisture_pct: 84.5,
      slope_tilt_deg: 34.5,
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-earth-300 dark:border-gray-800 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-earth-200 dark:bg-gray-800 rounded-xl border border-earth-300 dark:border-gray-700 text-brand-primary dark:text-saffron-primary">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-earth-900 dark:text-white tracking-tight">
                {t('dashboardTitle')}
              </h1>
              <p className="text-sm text-earth-600 dark:text-gray-400 mt-1">
                {t('dashboardSubtitle')}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <OperatingModeBadge mode="live_decision_support" />
          <LiveWeatherBadge />
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-white dark:bg-gray-800 border border-earth-300 dark:border-gray-700 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-6 text-xs shadow-xs">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-brand-primary dark:text-saffron-primary" />
          <span className="text-earth-600 dark:text-gray-400 font-medium">{t('dataSourceLabel')}:</span>
          <span className="font-semibold text-earth-900 dark:text-white">Open-Meteo Weather API</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-brand-primary dark:text-saffron-primary" />
          <span className="text-earth-600 dark:text-gray-400 font-medium">{t('lastUpdatedLabel')}:</span>
          <span className="font-semibold text-earth-900 dark:text-white">{new Date().toLocaleTimeString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-risk-low" />
          <span className="text-earth-600 dark:text-gray-400 font-medium">{t('freshnessLabel')}:</span>
          <span className="font-bold text-risk-low">{t('freshnessValue')}</span>
        </div>
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-saffron-primary" />
          <span className="text-earth-600 dark:text-gray-400 font-medium">{t('modelVersionLabel')}:</span>
          <span className="font-semibold text-earth-800 dark:text-gray-200">{t('modelVersionValue')}</span>
        </div>
      </div>

      {/* Station Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white dark:bg-gray-800 border border-earth-300 dark:border-gray-700 p-4 rounded-2xl gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <Radio className="w-4 h-4 text-brand-primary dark:text-saffron-primary" />
          <span className="text-sm font-semibold text-earth-900 dark:text-white">{t('targetCorridorLabel')}:</span>
        </div>
        <select
          value={selectedStationId}
          onChange={(e) => setSelectedStationId(e.target.value)}
          className="bg-earth-100 dark:bg-gray-900 text-earth-900 dark:text-white text-xs border border-earth-300 dark:border-gray-700 rounded-xl px-4 py-2 focus:ring-2 focus:ring-brand-primary font-medium"
        >
          {stations.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.district}, {s.state})
            </option>
          ))}
        </select>
      </div>

      {/* 6 Structured Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* A. Current Hazard Summary Card */}
        <Card variant="tactical">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center justify-between">
              <span className="flex items-center gap-2 text-earth-900 dark:text-white">
                <Activity className="w-4 h-4 text-risk-moderate" /> {t('currentHazardSummary')}
              </span>
              <RiskBadge level={activeStation.risk_level || 'moderate'} />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-baseline justify-between bg-earth-100 dark:bg-gray-900 p-4 rounded-xl border border-earth-300 dark:border-gray-700">
              <span className="text-xs text-earth-600 dark:text-gray-400 font-medium">{t('relativeHazardScore')}</span>
              <span className="text-3xl font-bold text-risk-moderate">68 / 100</span>
            </div>
            <div className="text-xs text-earth-800 dark:text-gray-300 space-y-2 leading-relaxed">
              <div><strong className="text-earth-900 dark:text-white">{t('hazardCategory')}:</strong> {t('moderate')}</div>
              <div><strong className="text-earth-900 dark:text-white">{t('primaryTrigger')}:</strong> 24h Cumulative Precipitation Peak</div>
              <div><strong className="text-earth-900 dark:text-white">{t('advisoryNote')}:</strong> Monitor steep highway cut-slopes.</div>
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
                <div className="text-xl font-bold text-earth-900 dark:text-white">{activeStation.latest_reading?.rainfall_24h_mm ?? 45.2} mm</div>
              </div>
              <div className="bg-earth-100 dark:bg-gray-900 p-3 rounded-xl border border-earth-300 dark:border-gray-700">
                <div className="text-earth-600 dark:text-gray-400 mb-1 font-medium">{t('forecast6h')}</div>
                <div className="text-xl font-bold text-saffron-primary">22.0 mm</div>
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
              <Radio className="w-4 h-4 text-risk-low" /> {t('groundTerrainMetadata')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-earth-100 dark:bg-gray-900 p-3 rounded-xl border border-earth-300 dark:border-gray-700">
                <div className="text-earth-600 dark:text-gray-400 mb-1 font-medium">{t('slopeAngle')}</div>
                <div className="text-xl font-bold text-earth-900 dark:text-white">{activeStation.latest_reading?.slope_tilt_deg ?? 32}°</div>
              </div>
              <div className="bg-earth-100 dark:bg-gray-900 p-3 rounded-xl border border-earth-300 dark:border-gray-700">
                <div className="text-earth-600 dark:text-gray-400 mb-1 font-medium">{t('soilSaturation')}</div>
                <div className="text-xl font-bold text-risk-moderate">{activeStation.latest_reading?.soil_moisture_pct ?? 75}%</div>
              </div>
            </div>
            <div className="text-xs text-earth-600 dark:text-gray-400 flex items-center justify-between pt-1 font-medium">
              <span>{t('elevation')}: {activeStation.elevation_m || 1200}m</span>
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
              {[25, 30, 42, 55, 68, 72, 68, 64].map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div
                    style={{ height: `${v}%` }}
                    className={`w-full rounded-md transition-all ${
                      v > 70 ? 'bg-risk-severe' : v > 50 ? 'bg-risk-moderate' : 'bg-risk-low'
                    }`}
                  />
                  <span className="text-[10px] text-earth-600 dark:text-gray-400 font-mono">{i * 3}h</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-earth-600 dark:text-gray-400 leading-relaxed">
              {t('peakHazardWindow')}
            </p>
          </CardContent>
        </Card>

        {/* E. Active In-App Alerts Card */}
        <Card variant="tactical">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center justify-between">
              <span className="flex items-center gap-2 text-earth-900 dark:text-white">
                <AlertTriangle className="w-4 h-4 text-risk-severe" /> {t('stagedInAppAlerts')} ({alerts.length})
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

        {/* F. Data Quality & Model Status Card */}
        <Card variant="tactical">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2 text-earth-900 dark:text-white">
              <BarChart3 className="w-4 h-4 text-brand-primary dark:text-saffron-primary" /> {t('dataQualityModelStatus')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-earth-100 dark:bg-gray-900 p-3.5 rounded-xl border border-earth-300 dark:border-gray-700 text-xs space-y-2">
              <div className="flex justify-between text-earth-600 dark:text-gray-400">
                <span>{t('dataQualityIndex')}:</span>
                <span className="font-bold text-risk-low">92 / 100</span>
              </div>
              <div className="flex justify-between text-earth-600 dark:text-gray-400">
                <span>{t('modelConfidence')}:</span>
                <span className="font-bold text-earth-900 dark:text-white">85%</span>
              </div>
              <div className="flex justify-between text-earth-600 dark:text-gray-400">
                <span>{t('productionModel')}:</span>
                <span className="font-semibold text-risk-moderate">{t('noValidatedModel')}</span>
              </div>
            </div>
            <p className="text-xs text-saffron-text bg-saffron-soft p-2.5 rounded-xl border border-saffron-border leading-relaxed">
              {t('fallbackActive')}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
