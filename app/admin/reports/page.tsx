'use client';

import React from 'react';
import { useReports } from '@/hooks/useReports';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { RiskBadge } from '@/components/ui/StatusBadge';
import { LoadingState } from '@/components/ui/LoadingState';
import { FileCheck, CheckCircle2, XCircle } from 'lucide-react';
import { useLanguage } from '@/lib/providers/LanguageProvider';

export default function AdminReportsPage() {
  const { reports, loading } = useReports();
  const { t } = useLanguage();

  if (loading) return <LoadingState message={t('loading')} />;

  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-sand-300 dark:border-earth-800 pb-4">
        <h1 className="text-xl font-bold text-earth-900 dark:text-earth-100 flex items-center gap-2">
          <FileCheck className="h-5 w-5 text-earth-600 dark:text-earth-400" />
          {t('fieldReports')} — Verification Management
        </h1>
        <p className="text-xs text-earth-600 dark:text-earth-400 mt-1">
          Review, verify ground reliability, or reject crowd-sourced citizen hazard submissions.
        </p>
      </div>

      <div className="space-y-3">
        {reports.map((rep) => (
          <Card key={rep.id} variant="tactical">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-earth-900 dark:text-earth-100 text-sm">{rep.reporter_name}</span>
                  <span className="text-[10px] text-earth-500 ml-2 font-mono">({rep.sync_source})</span>
                </div>
                <div className="flex items-center gap-2">
                  <RiskBadge level={rep.severity} />
                  <span className="text-[10px] px-2 py-0.5 rounded bg-sand-200 dark:bg-earth-800 text-earth-800 dark:text-earth-200 border border-sand-300 dark:border-earth-700 uppercase font-bold">
                    {rep.verification_status}
                  </span>
                </div>
              </div>

              <div className="text-earth-800 dark:text-earth-200 font-sans text-xs">
                <strong>{rep.hazard_type.toUpperCase()}:</strong> {rep.description}
              </div>

              <div className="flex flex-wrap items-center justify-between text-xs pt-2 border-t border-sand-300 dark:border-earth-800 gap-2">
                <span className="text-earth-600 dark:text-earth-400">{rep.location_description} ({rep.state})</span>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="primary" className="flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {t('confirm')}
                  </Button>
                  <Button size="sm" variant="danger" className="flex items-center gap-1 text-[11px]">
                    <XCircle className="h-3.5 w-3.5" />
                    {t('delete')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
