'use client';

import React from 'react';
import { useLanguage } from '@/lib/providers/LanguageProvider';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#2B2520] dark:bg-[#0B0E13] border-t border-white/10 dark:border-[#2A3341] py-6 px-4 sm:px-6 text-xs text-[#F7F1E8] dark:text-[#E5E7EB] transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-tight text-sm">
              {t('brandTitle')}
            </span>
            <span className="text-[#D5C4B2] dark:text-[#9CA3AF]">•</span>
            <span className="font-medium text-[#F7F1E8] dark:text-[#E5E7EB]">
              {t('footerSubtitle')}
            </span>
          </div>
          <p className="text-[11px] text-[#D5C4B2] dark:text-[#9CA3AF] font-medium">
            {t('verifyUrgentConditions')} • {t('notOfficialEmergencyService')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-[11px] text-[#D5C4B2] dark:text-[#9CA3AF] font-medium">
          <div>{t('footerRight')}</div>
          <span>•</span>
          <div>© {new Date().getFullYear()} {t('brandTitle')}. {t('allRightsReserved')}</div>
        </div>
      </div>
    </footer>
  );
}
