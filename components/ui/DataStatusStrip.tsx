'use client';

import React from 'react';
import { useLanguage } from '@/lib/providers/LanguageProvider';
import { Database, Clock, CheckCircle2, Cpu, MapPin, Radio } from 'lucide-react';

interface DataStatusStripProps {
  stationName?: string;
  providerName?: string;
  lastUpdated?: string;
  isSimulation?: boolean;
  modelConfidence?: string;
  className?: string;
}

export function DataStatusStrip({
  stationName = 'Sohra East Ridge (Meghalaya)',
  providerName = 'Open-Meteo Weather API',
  lastUpdated,
  isSimulation = false,
  modelConfidence = 'Baseline Rules (92% Quality Index)',
  className = '',
}: DataStatusStripProps) {
  const { t } = useLanguage();
  const timeString = lastUpdated || new Date().toLocaleTimeString();

  return (
    <div
      className={`bg-white dark:bg-gray-800 border border-earth-300 dark:border-gray-700 p-3.5 sm:p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs shadow-xs text-earth-900 dark:text-gray-100 ${className}`}
    >
      {/* Station Corridor */}
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-brand-primary dark:text-saffron-primary shrink-0" />
        <span className="text-earth-600 dark:text-gray-400 font-medium">Corridor:</span>
        <span className="font-semibold text-earth-900 dark:text-white truncate max-w-[200px] sm:max-w-none">
          {stationName}
        </span>
      </div>

      {/* Provider */}
      <div className="flex items-center gap-2">
        <Database className="w-4 h-4 text-brand-primary dark:text-saffron-primary shrink-0" />
        <span className="text-earth-600 dark:text-gray-400 font-medium">{t('dataSourceLabel')}:</span>
        <span className="font-semibold text-earth-900 dark:text-white">{providerName}</span>
      </div>

      {/* Last Updated */}
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-brand-primary dark:text-saffron-primary shrink-0" />
        <span className="text-earth-600 dark:text-gray-400 font-medium">{t('lastUpdatedLabel')}:</span>
        <span className="font-semibold text-earth-900 dark:text-white">{timeString}</span>
      </div>

      {/* Status Mode Badge */}
      <div className="flex items-center gap-2">
        {isSimulation ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800">
            <Radio className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-pulse" />
            {t('simulationBadge')}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-green-50 dark:bg-green-950/50 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
            {t('liveObservation')}
          </span>
        )}
      </div>
    </div>
  );
}
