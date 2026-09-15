'use client';

import React from 'react';
import { useLanguage } from '@/lib/providers/LanguageProvider';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#2C2926] dark:bg-[#0C0F12] border-t border-[#3D3834] dark:border-[#27313B] py-6 px-4 sm:px-6 text-xs text-[#FAF7F0] dark:text-[#E7ECF1] transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-tight text-sm">
              {t('brandTitle')}
            </span>
            <span className="text-[#D4CCC0] dark:text-[#9AA6B2]">•</span>
            <span className="font-medium text-[#FAF7F0] dark:text-[#E7ECF1]">
              {t('footerSubtitle')}
            </span>
          </div>
          <p className="text-[11px] text-[#D4CCC0] dark:text-[#9AA6B2] font-medium">
            {t('verifyUrgentConditions')} • {t('notOfficialEmergencyService')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-[11px] text-[#D4CCC0] dark:text-[#9AA6B2] font-medium">
          <div>{t('footerRight')}</div>
          <span>•</span>
          <div>© {new Date().getFullYear()} {t('brandTitle')}. {t('allRightsReserved')}</div>
        </div>
      </div>
    </footer>
  );
}
