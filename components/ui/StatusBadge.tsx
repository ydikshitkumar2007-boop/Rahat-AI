'use client';

import React from 'react';
import { RiskLevel, StationStatus } from '@/types';
import { getRiskBadgeStyle, getStationStatusStyle } from '@/lib/utils/format';
import { useLanguage } from '@/lib/providers/LanguageProvider';

export function RiskBadge({ level }: { level: RiskLevel }) {
  const style = getRiskBadgeStyle(level);
  const { t } = useLanguage();

  const labelKey = level === 'severe' ? 'severe' : level === 'high' ? 'high' : level === 'moderate' ? 'moderate' : 'low';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wider border ${style}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
      {t(labelKey as any)}
    </span>
  );
}

export function StationStatusBadge({ status }: { status: StationStatus }) {
  const style = getStationStatusStyle(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium border uppercase tracking-wider ${style}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
