'use client';

import React from 'react';
import { useStations } from '@/hooks/useStations';
import { useReports } from '@/hooks/useReports';
import { useAlerts } from '@/hooks/useAlerts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { RiskBadge, StationStatusBadge } from '@/components/ui/StatusBadge';
import { LoadingState } from '@/components/ui/LoadingState';
import {
  LayoutDashboard,
  Radio,
  FileCheck,
  AlertOctagon,
  Activity,
  Sliders,
} from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/providers/LanguageProvider';

export default function AdminOverviewPage() {
  const { stations, loading } = useStations();
  const { reports } = useReports();
  const { alerts } = useAlerts();
  const { t } = useLanguage();

  if (loading) {
    return <LoadingState message={t('loading')} />;
  }

  const pendingReports = reports.filter((r) => r.verification_status === 'pending');

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="border-b border-sand-300 dark:border-earth-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-earth-600 dark:text-earth-400" />
            <h1 className="text-xl font-bold text-earth-900 dark:text-earth-100 tracking-tight">
              {t('administration')} — {t('commandCenter')}
            </h1>
          </div>
          <p className="text-xs text-earth-600 dark:text-earth-400 mt-1">
            {t('dashboardSubtitle')}
          </p>
        </div>

        <Link
          href="/admin/simulation"
          className="px-3.5 py-2 bg-sand-200 dark:bg-earth-800 hover:bg-sand-300 dark:hover:bg-earth-700 text-earth-800 dark:text-earth-200 border border-sand-300 dark:border-earth-700 font-semibold text-xs rounded-lg flex items-center gap-2 transition-colors w-fit shadow-sm"
        >
          <Sliders className="h-4 w-4 text-earth-600 dark:text-earth-400" />
          <span>{t('simulations')}</span>
        </Link>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="tactical">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-earth-600 dark:text-earth-400 font-semibold">{t('stagedInAppAlerts')}</p>
              <h3 className="text-2xl font-bold text-risk-moderate mt-1">{alerts.length}</h3>
              <p className="text-[11px] text-earth-500">{t('warningsAlerts')}</p>
            </div>
            <AlertOctagon className="h-8 w-8 text-risk-moderate" />
          </CardContent>
        </Card>

        <Card variant="tactical">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-earth-600 dark:text-earth-400 font-semibold">{t('fieldReports')}</p>
              <h3 className="text-2xl font-bold text-earth-800 dark:text-earth-200 mt-1">{pendingReports.length}</h3>
              <p className="text-[11px] text-earth-500">Pending Operator Review</p>
            </div>
            <FileCheck className="h-8 w-8 text-earth-700 dark:text-earth-300" />
          </CardContent>
        </Card>

        <Card variant="tactical">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-earth-600 dark:text-earth-400 font-semibold">{t('activeWeatherStations')}</p>
              <h3 className="text-2xl font-bold text-risk-low mt-1">{stations.length} {t('monitored')}</h3>
              <p className="text-[11px] text-earth-500">{t('openMeteoActive')}</p>
            </div>
            <Radio className="h-8 w-8 text-risk-low" />
          </CardContent>
        </Card>

        <Card variant="tactical">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-earth-600 dark:text-earth-400 font-semibold">{t('systemStatusLabel')}</p>
              <h3 className="text-2xl font-bold text-earth-900 dark:text-earth-100 mt-1">Operational</h3>
              <p className="text-[11px] text-earth-500">{t('liveDecisionSupport')}</p>
            </div>
            <Activity className="h-8 w-8 text-earth-600 dark:text-earth-400" />
          </CardContent>
        </Card>
      </div>

      {/* Admin Modules Quick Launch Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card variant="tactical">
          <CardHeader className="pb-3 border-b border-sand-300 dark:border-earth-800">
            <CardTitle className="text-xs font-semibold text-earth-900 dark:text-earth-100 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-earth-600 dark:text-earth-400" />
                {t('recentFieldObservations')}
              </span>
              <Link href="/admin/reports" className="text-xs text-earth-600 dark:text-earth-400 hover:underline">
                {t('actions')} →
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs pt-4">
            {reports.slice(0, 2).map((r) => (
              <div key={r.id} className="p-3 bg-sand-100 dark:bg-earth-800 rounded-lg border border-sand-300 dark:border-earth-700 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-earth-900 dark:text-earth-100">{r.hazard_type} - {r.reporter_name}</div>
                  <div className="text-xs text-earth-600 dark:text-earth-400">{r.location_description}</div>
                </div>
                <RiskBadge level={r.severity} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card variant="tactical">
          <CardHeader className="pb-3 border-b border-sand-300 dark:border-earth-800">
            <CardTitle className="text-xs font-semibold text-earth-900 dark:text-earth-100 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Radio className="h-4 w-4 text-earth-600 dark:text-earth-400" />
                {t('stations')}
              </span>
              <Link href="/admin/stations" className="text-xs text-earth-600 dark:text-earth-400 hover:underline">
                {t('actions')} →
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs pt-4">
            {stations.slice(0, 3).map((st) => (
              <div key={st.id} className="p-3 bg-sand-100 dark:bg-earth-800 rounded-lg border border-sand-300 dark:border-earth-700 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-earth-900 dark:text-earth-100">{st.code} — {st.name}</div>
                  <div className="text-xs text-earth-600 dark:text-earth-400">{st.district}, {st.state}</div>
                </div>
                <StationStatusBadge status={st.status} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
