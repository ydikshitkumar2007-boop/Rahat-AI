'use client';

import React from 'react';
import { Info } from 'lucide-react';
import { useLanguage } from '@/lib/providers/LanguageProvider';

export function TruthfulnessNoticeBanner({ className = '' }: { className?: string }) {
  const { t } = useLanguage();

  return (
    <div
      className={`p-3.5 bg-sand-50 dark:bg-earth-850 border border-sand-300 dark:border-earth-800 rounded-xl text-xs text-earth-800 dark:text-earth-200 flex items-start gap-3 shadow-sm ${className}`}
    >
      <div className="p-1.5 bg-sand-200 dark:bg-earth-800 rounded-lg text-earth-700 dark:text-earth-300 shrink-0 border border-sand-300 dark:border-earth-700 mt-0.5">
        <Info className="h-4 w-4" />
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-bold text-earth-900 dark:text-earth-100 text-xs">
            {t('decisionSupportPlatform')}
          </span>
        </div>
        <p className="text-xs text-earth-600 dark:text-earth-400 font-sans leading-relaxed">
          {t('verifyUrgentConditions')}. {t('notOfficialEmergencyService')}.
        </p>
      </div>
    </div>
  );
}
