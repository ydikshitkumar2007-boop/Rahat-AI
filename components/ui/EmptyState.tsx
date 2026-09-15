import React from 'react';
import { AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-sand-50 dark:bg-earth-850 rounded-xl border border-sand-300 dark:border-earth-800 my-4 shadow-sm">
      <div className="p-3 bg-sand-200 dark:bg-earth-800 rounded-full text-earth-700 dark:text-earth-300 mb-3 border border-sand-300 dark:border-earth-700">
        <AlertCircle className="h-6 w-6 text-earth-600 dark:text-earth-400" />
      </div>
      <h4 className="text-base font-semibold text-earth-900 dark:text-earth-100">{title}</h4>
      <p className="text-xs text-earth-600 dark:text-earth-400 max-w-sm mt-1 mb-4">{description}</p>
      {action}
    </div>
  );
}
