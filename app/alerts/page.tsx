'use client';

import React from 'react';
import { useAlerts } from '@/hooks/useAlerts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { RiskBadge } from '@/components/ui/StatusBadge';
import { LoadingState } from '@/components/ui/LoadingState';
import { AlertTriangle, Phone, Radio, Clock, MapPin } from 'lucide-react';
import { formatDate } from '@/lib/utils/format';
import { OperatingModeBadge } from '@/components/ui/DataLabelBadge';
import { useLanguage } from '@/lib/providers/LanguageProvider';

export default function AlertsPage() {
  const { alerts, loading } = useAlerts();
  const { t } = useLanguage();

  if (loading) {
    return <LoadingState message={t('loading')} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="border-b border-sand-300 dark:border-earth-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sand-200 dark:bg-earth-800 rounded-xl border border-sand-300 dark:border-earth-700 text-risk-severe">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-earth-900 dark:text-earth-100 tracking-tight">
                {t('warningsAlertsTitle')}
              </h1>
              <p className="text-sm text-earth-600 dark:text-earth-400 mt-1">
                {t('warningsAlertsSub')}
              </p>
            </div>
          </div>
        </div>
        <OperatingModeBadge mode="live_decision_support" />
      </div>

      {/* Emergency Helpline Strip */}
      <div className="p-4 bg-sand-50 dark:bg-earth-850 border border-sand-300 dark:border-earth-800 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-earth-700 dark:text-earth-300 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-sand-200 dark:bg-earth-800 rounded-xl border border-sand-300 dark:border-earth-700 text-earth-600 dark:text-earth-400">
            <Phone className="h-5 w-5" />
          </div>
          <div>
            <div className="font-semibold text-earth-900 dark:text-earth-100">State Disaster Emergency Helplines</div>
            <div className="text-earth-600 dark:text-earth-400 text-xs">National Emergency Response: 112 • NDRF Control Room: 1078</div>
          </div>
        </div>
        <div className="text-right text-xs text-earth-600 dark:text-earth-400">
          Meghalaya SDMA: 1070 • Sikkim SDMA: 1077 • Assam SDMA: 1079
        </div>
      </div>

      {/* Safety Guidance Box */}
      <div className="p-4 bg-sand-200/80 dark:bg-earth-800/80 border border-sand-300 dark:border-earth-700 rounded-2xl space-y-2 text-xs">
        <h3 className="font-bold text-earth-900 dark:text-earth-100 text-sm flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-risk-moderate" />
          {t('safetyGuidance')}
        </h3>
        <ul className="list-disc list-inside space-y-1 text-earth-700 dark:text-earth-300 leading-relaxed">
          <li>{t('stayClearSlopes')}</li>
          <li>{t('reportNewCracks')}</li>
          <li>{t('monitorBulletins')}</li>
        </ul>
      </div>

      {/* Alerts Feed Grid */}
      <div className="space-y-6">
        {alerts.length === 0 ? (
          <div className="text-center py-10 text-earth-600 dark:text-earth-400 text-sm">
            {t('noAlertsFound')}
          </div>
        ) : (
          alerts.map((alert) => (
            <Card key={alert.id} variant="tactical">
              <CardHeader className="pb-3 border-b border-sand-300 dark:border-earth-800">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-earth-900 dark:text-earth-100 font-medium text-base">
                    <Radio className="h-4 w-4 text-earth-600 dark:text-earth-400" />
                    {alert.alert_code} — {alert.title}
                  </span>
                  <RiskBadge level={alert.severity} />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4 text-xs">
                <div className="text-earth-800 dark:text-earth-200 font-sans text-sm leading-relaxed">
                  {alert.advisory_text}
                </div>

                <div className="p-3.5 bg-sand-100 dark:bg-earth-800 border border-sand-300 dark:border-earth-700 rounded-xl space-y-1 text-earth-900 dark:text-earth-100">
                  <strong className="block text-xs font-semibold text-risk-moderate">
                    {t('advisoryNote')}:
                  </strong>
                  <p className="font-sans text-xs text-earth-700 dark:text-earth-300 leading-relaxed">
                    {alert.recommended_action}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-earth-600 dark:text-earth-400 pt-3 border-t border-sand-300 dark:border-earth-800">
                  <div className="flex items-center gap-1.5 text-earth-700 dark:text-earth-300 font-medium">
                    <MapPin className="h-4 w-4" />
                    <span>{t('targetCorridorLabel')}: {alert.affected_areas.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-earth-500" />
                      {t('lastUpdatedLabel')}: {formatDate(alert.issued_at)}
                    </span>
                    <span>{t('issuedBy')}: {alert.issued_by}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
