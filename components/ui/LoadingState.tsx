import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingState({ message = 'Loading data...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-earth-700 dark:text-earth-300 bg-sand-50 dark:bg-earth-850 rounded-xl border border-sand-300 dark:border-earth-800 my-4 shadow-sm">
      <Loader2 className="h-8 w-8 animate-spin text-earth-600 dark:text-earth-400 mb-3" />
      <p className="text-sm font-semibold tracking-wide text-earth-900 dark:text-earth-100">{message}</p>
      <p className="text-xs text-earth-600 dark:text-earth-400 mt-1">RAHAT Landslide Hazard Intelligence System</p>
    </div>
  );
}
