'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { BarChart3, CloudRain, Activity } from 'lucide-react';
import { useStations } from '@/hooks/useStations';
import { LoadingState } from '@/components/ui/LoadingState';
import { useLanguage } from '@/lib/providers/LanguageProvider';

export default function AdminAnalyticsPage() {
  const { stations, loading } = useStations();
  const { t } = useLanguage();

  if (loading) return <LoadingState message={t('loading')} />;

  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-sand-300 dark:border-earth-800 pb-4">
        <h1 className="text-xl font-bold text-earth-900 dark:text-earth-100 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-earth-600 dark:text-earth-400" />
          {t('analytics')} — Telemetry & Risk Trends
        </h1>
        <p className="text-xs text-earth-600 dark:text-earth-400 mt-1">
          Historical rainfall accumulation vs slope tilt displacement across Northeast India monitoring stations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card variant="tactical">
          <CardHeader>
            <CardTitle className="text-xs flex items-center gap-2 text-earth-900 dark:text-earth-100">
              <CloudRain className="h-4 w-4 text-earth-600 dark:text-earth-400" />
              {t('rain24h')} (mm)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-2">
            {stations.map((st) => {
              const rain = st.latest_reading?.rainfall_24h_mm ?? 15;
              const pct = Math.min(100, (rain / 350) * 100);
              return (
                <div key={st.id} className="space-y-1 text-xs">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-earth-800 dark:text-earth-200">{st.name} ({st.state})</span>
                    <span className="font-bold text-earth-900 dark:text-earth-100">{rain} mm</span>
                  </div>
                  <div className="w-full h-2 bg-sand-200 dark:bg-earth-800 rounded overflow-hidden border border-sand-300 dark:border-earth-700">
                    <div className="h-full bg-brand-600 dark:bg-brand-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card variant="tactical">
          <CardHeader>
            <CardTitle className="text-xs flex items-center gap-2 text-earth-900 dark:text-earth-100">
              <Activity className="h-4 w-4 text-risk-moderate" />
              {t('soilSaturation')} (%)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-2">
            {stations.map((st) => {
              const moisture = st.latest_reading?.soil_moisture_pct ?? 40;
              return (
                <div key={st.id} className="space-y-1 text-xs">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-earth-800 dark:text-earth-200">{st.code} — {st.name}</span>
                    <span className="font-bold text-risk-moderate">{moisture}%</span>
                  </div>
                  <div className="w-full h-2 bg-sand-200 dark:bg-earth-800 rounded overflow-hidden border border-sand-300 dark:border-earth-700">
                    <div className="h-full bg-risk-moderate" style={{ width: `${moisture}%` }} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
