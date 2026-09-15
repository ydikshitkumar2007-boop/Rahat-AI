'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/lib/providers/ThemeProvider';
import { useLanguage } from '@/lib/providers/LanguageProvider';

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <div className="flex items-center bg-earth-200 dark:bg-gray-800 border border-earth-300 dark:border-gray-700 rounded-lg p-0.5 shadow-xs">
      <button
        type="button"
        onClick={() => setTheme('light')}
        title={t('light')}
        className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
          resolvedTheme === 'light'
            ? 'bg-white text-earth-900 shadow-xs border border-earth-300'
            : 'text-earth-800 dark:text-gray-300 hover:text-earth-900 dark:hover:text-white'
        }`}
      >
        <Sun className="h-3.5 w-3.5 text-saffron-primary" />
        <span className="hidden sm:inline text-[11px]">{t('light')}</span>
      </button>

      <button
        type="button"
        onClick={() => setTheme('dark')}
        title={t('dark')}
        className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
          resolvedTheme === 'dark'
            ? 'bg-gray-900 text-white shadow-xs border border-gray-700'
            : 'text-earth-800 dark:text-gray-300 hover:text-earth-900 dark:hover:text-white'
        }`}
      >
        <Moon className="h-3.5 w-3.5 text-saffron-text" />
        <span className="hidden sm:inline text-[11px]">{t('dark')}</span>
      </button>
    </div>
  );
}
