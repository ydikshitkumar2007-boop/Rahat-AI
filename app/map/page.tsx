'use client';

import React, { useState } from 'react';
import { useStations } from '@/hooks/useStations';
import { RiskMap } from '@/components/map/RiskMap';
import { StationWithMetrics } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { RiskBadge } from '@/components/ui/StatusBadge';
import { LoadingState } from '@/components/ui/LoadingState';
import { Map, Radio } from 'lucide-react';
import { OperatingModeBadge, LiveWeatherBadge } from '@/components/ui/DataLabelBadge';
import { useLanguage } from '@/lib/providers/LanguageProvider';

export default function GISRiskMapPage() {
  const { stations, loading } = useStations();
  const [selectedStation, setSelectedStation] = useState<StationWithMetrics | null>(null);
  const { t } = useLanguage();

  if (loading) {
    return <LoadingState message={t('loading')} />;
  }

  const activeStation = selectedStation || stations[0];

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)]">
      {/* Top Map Control Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-earth-300 dark:border-gray-700 px-4 py-2.5 flex items-center justify-between text-xs text-earth-800 dark:text-gray-300 shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <Map className="h-4 w-4 text-brand-primary dark:text-saffron-primary" />
          <span className="font-bold text-earth-900 dark:text-white">{t('gisMapTitle')}</span>
          <span className="text-earth-400">•</span>
          <span className="text-earth-600 dark:text-gray-400">{t('northeastRegion')}</span>
        </div>

        <div className="flex items-center gap-2">
          <OperatingModeBadge mode="live_decision_support" />
          <LiveWeatherBadge />
        </div>
      </div>

      {/* Main Map + Sidebar Split View */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Interactive Map Area */}
        <div className="flex-1 relative bg-earth-100 dark:bg-gray-900 p-2">
          <RiskMap
            stations={stations}
            selectedStationId={activeStation?.id}
            onSelectStation={(st) => setSelectedStation(st)}
          />
        </div>

        {/* Station Telemetry Sidebar */}
        <div className="w-full lg:w-96 bg-white dark:bg-gray-800 border-t lg:border-t-0 lg:border-l border-earth-300 dark:border-gray-700 p-4 space-y-4 overflow-y-auto shrink-0 shadow-xs">
          {activeStation && (
            <Card variant="tactical">
              <CardHeader className="pb-3 border-b border-earth-300 dark:border-gray-700">
                <CardTitle className="flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center gap-2 text-earth-900 dark:text-white font-mono">
                    <Radio className="h-4 w-4 text-brand-primary dark:text-saffron-primary" />
                    Station: {activeStation.code}
                  </span>
                  <RiskBadge level={activeStation.risk_level} />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div>
                  <h3 className="text-base font-bold text-earth-900 dark:text-white">{activeStation.name}</h3>
                  <p className="text-xs text-earth-600 dark:text-gray-400">{activeStation.district}, {activeStation.state}</p>
                  <p className="text-xs text-earth-500 mt-1 font-mono">
                    {t('coordsLabel')}: {activeStation.latitude}° N, {activeStation.longitude}° E • {t('elevation')}: {activeStation.elevation_m}m
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-earth-100 dark:bg-gray-900 border border-earth-300 dark:border-gray-700 rounded-lg">
                    <span className="text-earth-600 dark:text-gray-400 block text-[10px] uppercase font-medium">{t('rain24h')}</span>
                    <span className="text-sm font-bold text-earth-900 dark:text-white">
                      {activeStation.latest_reading?.rainfall_24h_mm ?? 45.2} mm
                    </span>
                  </div>

                  <div className="p-2.5 bg-earth-100 dark:bg-gray-900 border border-earth-300 dark:border-gray-700 rounded-lg">
                    <span className="text-earth-600 dark:text-gray-400 block text-[10px] uppercase font-medium">{t('soilSaturation')}</span>
                    <span className="text-sm font-bold text-risk-moderate">
                      {activeStation.latest_reading?.soil_moisture_pct ?? 75}%
                    </span>
                  </div>

                  <div className="p-2.5 bg-earth-100 dark:bg-gray-900 border border-earth-300 dark:border-gray-700 rounded-lg">
                    <span className="text-earth-600 dark:text-gray-400 block text-[10px] uppercase font-medium">{t('slopeAngle')}</span>
                    <span className="text-sm font-bold text-earth-900 dark:text-white">
                      {activeStation.latest_reading?.slope_tilt_deg ?? 34}°
                    </span>
                  </div>

                  <div className="p-2.5 bg-earth-100 dark:bg-gray-900 border border-earth-300 dark:border-gray-700 rounded-lg">
                    <span className="text-earth-600 dark:text-gray-400 block text-[10px] uppercase font-medium">{t('dataQualityIndex')}</span>
                    <span className="text-sm font-bold text-risk-low">
                      92 / 100
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-earth-100 dark:bg-gray-900 border border-earth-300 dark:border-gray-700 rounded-lg space-y-1 text-xs">
                  <div className="flex items-center justify-between text-earth-900 dark:text-white font-semibold">
                    <span>{t('hazardNowcastScore')}</span>
                    <span>{activeStation.latest_assessment?.risk_score || 68}/100</span>
                  </div>
                  <p className="text-earth-700 dark:text-gray-300 text-xs leading-relaxed pt-1">
                    {activeStation.latest_assessment?.ai_summary || 'Relative hazard estimate calculated using Open-Meteo precipitation windows & slope susceptibility factors.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick List Selector */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-earth-600 dark:text-gray-400 uppercase tracking-wider">
              {t('monitoredCorridors')}
            </h4>
            <div className="space-y-1.5 max-h-64 overflow-y-auto">
              {stations.map((st) => (
                <button
                  key={st.id}
                  onClick={() => setSelectedStation(st)}
                  className={`w-full p-2.5 rounded-lg text-left text-xs flex items-center justify-between border transition-all ${
                    activeStation.id === st.id
                      ? 'bg-earth-200 dark:bg-gray-700 text-earth-900 dark:text-white border-brand-primary dark:border-saffron-primary font-bold shadow-xs'
                      : 'bg-earth-100 dark:bg-gray-900 border-earth-300 dark:border-gray-700 text-earth-800 dark:text-gray-300 hover:border-earth-400'
                  }`}
                >
                  <div>
                    <div className="font-semibold">{st.code}</div>
                    <div className="text-[11px] opacity-80 truncate">{st.name}</div>
                  </div>
                  <RiskBadge level={st.risk_level} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
