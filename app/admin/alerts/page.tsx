'use client';

import React from 'react';
import { useAlerts } from '@/hooks/useAlerts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { RiskBadge } from '@/components/ui/StatusBadge';
import { LoadingState } from '@/components/ui/LoadingState';
import { AlertOctagon, Send } from 'lucide-react';
import { useLanguage } from '@/lib/providers/LanguageProvider';

export default function AdminAlertsPage() {
  const { alerts, loading } = useAlerts();
  const { t } = useLanguage();

  if (loading) return <LoadingState message={t('loading')} />;

  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-sand-300 dark:border-earth-800 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-earth-900 dark:text-earth-100 flex items-center gap-2">
            <AlertOctagon className="h-5 w-5 text-risk-severe" />
            {t('warningsAlerts')} Dispatch Control
          </h1>
          <p className="text-xs text-earth-600 dark:text-earth-400 mt-1">
            Dispatch Common Alerting Protocol (CAP) notifications to SMS, Cell Broadcast, and Public Dashboards.
          </p>
        </div>

        <Button variant="danger" size="sm" className="flex items-center gap-1.5 font-bold">
          <Send className="h-4 w-4" />
          <span>Broadcast Emergency CAP Alert</span>
        </Button>
      </div>

      <div className="space-y-3">
        {alerts.map((al) => (
          <Card key={al.id} variant="tactical">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-earth-900 dark:text-earth-100 text-sm">{al.alert_code} — {al.title}</span>
                <RiskBadge level={al.severity} />
              </div>
              <p className="text-earth-700 dark:text-earth-300 font-sans text-xs">{al.advisory_text}</p>
              <div className="flex items-center justify-between text-[11px] text-earth-600 dark:text-earth-400 pt-2 border-t border-sand-300 dark:border-earth-800">
                <span>{t('targetCorridorLabel')}: {al.affected_areas.join(', ')}</span>
                <span>{t('issuedBy')}: {al.issued_by}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
