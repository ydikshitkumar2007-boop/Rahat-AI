'use client';

import React from 'react';
import { useLanguage } from '@/lib/providers/LanguageProvider';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center bg-earth-200 dark:bg-gray-800 border border-earth-300 dark:border-gray-700 rounded-lg p-0.5 shadow-xs">
      <button
        type="button"
        onClick={() => setLanguage('en')}
        title="English"
        className={`px-2 py-1 rounded-md text-xs font-bold transition-all ${
          language === 'en'
            ? 'bg-brand-primary dark:bg-saffron-primary text-white dark:text-gray-950 shadow-xs'
            : 'text-earth-800 dark:text-gray-300 hover:text-earth-900 dark:hover:text-white'
        }`}
      >
        EN
      </button>

      <button
        type="button"
        onClick={() => setLanguage('hi')}
        title="हिंदी (Hindi)"
        className={`px-2 py-1 rounded-md text-xs font-bold transition-all ${
          language === 'hi'
            ? 'bg-brand-primary dark:bg-saffron-primary text-white dark:text-gray-950 shadow-xs'
            : 'text-earth-800 dark:text-gray-300 hover:text-earth-900 dark:hover:text-white'
        }`}
      >
        हिंदी
      </button>
    </div>
  );
}
