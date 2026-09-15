import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingState({ message = 'Loading data...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-earth-800 dark:text-gray-200 bg-earth-100 dark:bg-gray-800 rounded-2xl border border-earth-300 dark:border-gray-700 my-6 shadow-xs">
      <Loader2 className="h-8 w-8 animate-spin text-brand-primary dark:text-saffron-primary mb-3" />
      <p className="text-sm font-semibold tracking-tight text-earth-900 dark:text-white">{message}</p>
      <p className="text-xs text-earth-600 dark:text-gray-400 mt-1">RAHAT Landslide Hazard Intelligence System</p>
    </div>
  );
}
