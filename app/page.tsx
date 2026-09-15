'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Activity,
  Map,
  FileText,
  WifiOff,
  BrainCircuit,
  ArrowRight,
  AlertTriangle,
  Radio,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useStations } from '@/hooks/useStations';
import { RiskBadge, StationStatusBadge } from '@/components/ui/StatusBadge';
import { useLanguage } from '@/lib/providers/LanguageProvider';

export default function LandingPage() {
  const { stations } = useStations();
  const { t } = useLanguage();

  const severeStations = stations.filter((s) => s.risk_level === 'severe');
  const highStations = stations.filter((s) => s.risk_level === 'high');

  return (
    <div className="flex-1 space-y-10 pb-16">
      {/* Civic Resilience Hero Section */}
      <section className="relative border-b border-earth-300 dark:border-gray-800 bg-earth-100/60 dark:bg-gray-950 py-14 px-4 sm:px-6 lg:px-8 transition-colors">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-gray-800 border border-earth-300 dark:border-gray-700 text-earth-800 dark:text-gray-200 text-xs font-semibold shadow-xs">
              <Radio className="h-3.5 w-3.5 text-saffron-primary" />
              <span>{t('northeastIndiaPlatform')}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold text-earth-900 dark:text-white tracking-tight leading-tight">
              {t('brandTitle')} <br />
              <span className="text-brand-primary dark:text-saffron-text font-semibold">
                {t('brandSubtitle')}
              </span>
            </h1>

            <p className="text-earth-800 dark:text-gray-300 text-sm sm:text-base max-w-2xl leading-relaxed font-normal">
              {t('heroDescription')}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/dashboard">
                <Button size="lg" className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5" />
                  <span>{t('viewHazardDashboard')}</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <Link href="/map">
                <Button variant="outline" size="lg" className="flex items-center gap-2 font-medium">
                  <Map className="h-5 w-5 text-brand-primary dark:text-saffron-primary" />
                  <span>{t('gisRiskMap')}</span>
                </Button>
              </Link>

              <Link href="/reports">
                <Button variant="secondary" size="lg" className="flex items-center gap-2 font-medium">
                  <FileText className="h-5 w-5 text-saffron-primary" />
                  <span>{t('submitFieldReport')}</span>
                </Button>
              </Link>
            </div>

            {/* Compact Status Indicator Bar */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-earth-300 dark:border-gray-800 text-xs">
              <div>
                <span className="text-earth-600 dark:text-gray-400 block text-[11px] font-medium">{t('activeWeatherStations')}</span>
                <span className="text-base font-bold text-earth-900 dark:text-white">{stations.length} {t('monitored')}</span>
              </div>
              <div>
                <span className="text-earth-600 dark:text-gray-400 block text-[11px] font-medium">{t('highSevereRiskCorridors')}</span>
                <span className="text-base font-bold text-risk-high">{severeStations.length + highStations.length} {t('corridors')}</span>
              </div>
              <div>
                <span className="text-earth-600 dark:text-gray-400 block text-[11px] font-medium">{t('operatingMode')}</span>
                <span className="text-base font-bold text-risk-low">{t('liveDecisionSupport')}</span>
              </div>
            </div>
          </div>

          {/* Right Live Station Monitor Card */}
          <div className="lg:col-span-5">
            <Card variant="tactical" className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-sm font-semibold">
                  <span className="flex items-center gap-2 text-earth-900 dark:text-white">
                    <Activity className="h-4 w-4 text-brand-primary dark:text-saffron-primary" />
                    {t('regionalMonitoringSummary')}
                  </span>
                  <span className="text-xs text-earth-600 dark:text-gray-400 font-normal">{t('liveIngestion')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {stations.slice(0, 3).map((st) => (
                  <div
                    key={st.id}
                    className="p-3 rounded-xl bg-earth-50 dark:bg-gray-900 border border-earth-300 dark:border-gray-700 flex items-center justify-between hover:border-brand-primary/40 transition-colors"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-earth-900 dark:text-white text-xs">{st.code}</span>
                        <StationStatusBadge status={st.status} />
                      </div>
                      <p className="text-xs text-earth-700 dark:text-gray-400">{st.name}, {st.state}</p>
                    </div>
                    <RiskBadge level={st.risk_level} />
                  </div>
                ))}

                <div className="p-3 bg-saffron-soft border border-saffron-border rounded-xl text-xs text-saffron-text flex items-start gap-2.5">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-saffron-primary mt-0.5" />
                  <span>{t('sohraAlertNotice')}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-earth-900 dark:text-white tracking-tight">
            {t('systemPillarsTitle')}
          </h2>
          <p className="text-xs text-earth-600 dark:text-gray-400">
            {t('systemPillarsSub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="tactical" className="hover:border-brand-primary/40 transition-all duration-150">
            <CardContent className="space-y-3 pt-6">
              <div className="p-2.5 bg-earth-200 dark:bg-gray-800 rounded-lg border border-earth-300 dark:border-gray-700 w-fit text-brand-primary dark:text-saffron-primary">
                <BrainCircuit className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-earth-900 dark:text-white">{t('multiWindowNowcastTitle')}</h3>
              <p className="text-xs text-earth-700 dark:text-gray-300 leading-relaxed">
                {t('multiWindowNowcastDesc')}
              </p>
            </CardContent>
          </Card>

          <Card variant="tactical" className="hover:border-brand-primary/40 transition-all duration-150">
            <CardContent className="space-y-3 pt-6">
              <div className="p-2.5 bg-earth-200 dark:bg-gray-800 rounded-lg border border-earth-300 dark:border-gray-700 w-fit text-brand-primary dark:text-saffron-primary">
                <WifiOff className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-earth-900 dark:text-white">{t('offlineFieldSyncTitle')}</h3>
              <p className="text-xs text-earth-700 dark:text-gray-300 leading-relaxed">
                {t('offlineFieldSyncDesc')}
              </p>
            </CardContent>
          </Card>

          <Card variant="tactical" className="hover:border-brand-primary/40 transition-all duration-150">
            <CardContent className="space-y-3 pt-6">
              <div className="p-2.5 bg-earth-200 dark:bg-gray-800 rounded-lg border border-earth-300 dark:border-gray-700 w-fit text-brand-primary dark:text-saffron-primary">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-earth-900 dark:text-white">{t('decisionSupportGovernanceTitle')}</h3>
              <p className="text-xs text-earth-700 dark:text-gray-300 leading-relaxed">
                {t('decisionSupportGovernanceDesc')}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Weather Station Network Coverage */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-earth-900 dark:text-white flex items-center gap-2">
            <Radio className="h-4 w-4 text-brand-primary dark:text-saffron-primary" />
            {t('northeastWeatherStations')}
          </h3>
          <Link href="/map" className="text-xs font-semibold text-saffron-primary hover:text-saffron-hover hover:underline">
            {t('viewInteractiveMap')}
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {stations.map((st) => (
            <div
              key={st.id}
              className="p-4 bg-white dark:bg-gray-800 border border-earth-300 dark:border-gray-700 rounded-xl flex flex-col justify-between hover:border-brand-primary/40 transition-colors shadow-xs"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-earth-900 dark:text-white">{st.code}</span>
                  <RiskBadge level={st.risk_level} />
                </div>
                <h4 className="text-sm font-semibold text-earth-900 dark:text-white">{st.name}</h4>
                <p className="text-xs text-earth-600 dark:text-gray-400">{st.district}, {st.state}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-earth-300 dark:border-gray-700 flex items-center justify-between text-xs text-earth-700 dark:text-gray-300">
                <span>{t('elevationShort')}: {st.elevation_m}m</span>
                <StationStatusBadge status={st.status} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
