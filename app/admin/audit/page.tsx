'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { History } from 'lucide-react';
import { MOCK_AUDIT_LOGS } from '@/lib/constants/mockData';
import { formatDate } from '@/lib/utils/format';
import { useLanguage } from '@/lib/providers/LanguageProvider';

export default function AdminAuditPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-sand-300 dark:border-earth-800 pb-4">
        <h1 className="text-xl font-bold text-earth-900 dark:text-earth-100 flex items-center gap-2">
          <History className="h-5 w-5 text-earth-600 dark:text-earth-400" />
          {t('auditLogs')} & Security Activity
        </h1>
        <p className="text-xs text-earth-600 dark:text-earth-400 mt-1">
          Immutable event log tracking early warning dispatches, report verifications, and station telemetry updates.
        </p>
      </div>

      <div className="space-y-3">
        {MOCK_AUDIT_LOGS.map((log) => (
          <Card key={log.id} variant="tactical">
            <CardContent className="p-4 flex items-center justify-between text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-earth-900 dark:text-earth-100">{log.action}</span>
                  <span className="text-[10px] px-2 py-0.5 bg-sand-200 dark:bg-earth-800 rounded border border-sand-300 dark:border-earth-700 text-earth-700 dark:text-earth-300">
                    {log.entity_type}
                  </span>
                </div>
                <div className="text-earth-600 dark:text-earth-400 font-sans text-xs">
                  Entity ID: {log.entity_id} • Payload: {JSON.stringify(log.details)}
                </div>
              </div>

              <div className="text-[11px] text-earth-500 font-mono">
                {formatDate(log.created_at)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
