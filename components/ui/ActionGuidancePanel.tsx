'use client';

import React from 'react';
import { useLanguage } from '@/lib/providers/LanguageProvider';
import { RiskBadge } from '@/components/ui/StatusBadge';
import { ShieldAlert, CheckCircle2, AlertTriangle, HelpCircle, Info } from 'lucide-react';

interface ActionGuidancePanelProps {
  riskLevel: 'low' | 'moderate' | 'high' | 'severe';
  className?: string;
}

export function ActionGuidancePanel({ riskLevel, className = '' }: ActionGuidancePanelProps) {
  const { t } = useLanguage();

  const getGuidanceItems = () => {
    switch (riskLevel) {
      case 'low':
        return [t('lowGuidance1'), t('lowGuidance2')];
      case 'moderate':
        return [t('modGuidance1'), t('modGuidance2')];
      case 'high':
        return [t('highGuidance1'), t('highGuidance2')];
      case 'severe':
        return [t('sevGuidance1'), t('sevGuidance2'), t('sevGuidance3')];
      default:
        return [t('lowGuidance1')];
    }
  };

  const getThemeStyles = () => {
    switch (riskLevel) {
      case 'severe':
        return 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50 text-red-950 dark:text-red-100';
      case 'high':
        return 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50 text-amber-950 dark:text-amber-100';
      case 'moderate':
        return 'bg-saffron-soft dark:bg-amber-950/20 border-saffron-border dark:border-amber-900/40 text-earth-900 dark:text-amber-100';
      case 'low':
      default:
        return 'bg-earth-soft dark:bg-gray-800/80 border-earth-300 dark:border-gray-700 text-earth-900 dark:text-gray-100';
    }
  };

  const items = getGuidanceItems();

  return (
    <div
      className={`rounded-2xl border p-5 transition-all shadow-xs ${getThemeStyles()} ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-earth-300/60 dark:border-gray-700/60 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-earth-200/80 dark:bg-gray-700/80 text-earth-900 dark:text-white">
            {riskLevel === 'severe' ? (
              <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400" />
            ) : riskLevel === 'high' ? (
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            ) : (
              <Info className="w-5 h-5 text-brand-primary dark:text-saffron-primary" />
            )}
          </div>
          <h3 className="text-base font-bold text-earth-900 dark:text-white tracking-tight">
            {t('whatToDoNow')}
          </h3>
        </div>
        <RiskBadge level={riskLevel} />
      </div>

      <ul className="space-y-2.5 text-xs sm:text-sm font-medium leading-relaxed">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2.5">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-primary dark:bg-saffron-primary shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 pt-3 border-t border-earth-300/40 dark:border-gray-700/40 flex items-center gap-2 text-[11px] text-earth-600 dark:text-gray-400 italic">
        <HelpCircle className="w-3.5 h-3.5 shrink-0 text-earth-500 dark:text-gray-400" />
        <span>{t('guidanceDisclaimer')}</span>
      </div>
    </div>
  );
}
