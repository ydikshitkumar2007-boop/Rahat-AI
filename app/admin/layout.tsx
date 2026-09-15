'use client';

import React from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { useAuth } from '@/hooks/useAuth';
import { Lock } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/providers/LanguageProvider';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { role, isAuthenticated, isLoading } = useAuth();
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-center text-xs text-earth-600 dark:text-earth-400 font-medium">
        {t('loading')}
      </div>
    );
  }

  // Strict Authentication & Role Guard Check
  if (!isAuthenticated || (role !== 'admin' && role !== 'field_operator')) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4 font-sans">
        <div className="p-4 bg-risk-severe/15 rounded-full text-risk-severe border border-risk-severe/40">
          <Lock className="h-10 w-10" />
        </div>
        <h2 className="text-xl font-bold text-earth-900 dark:text-earth-100 uppercase tracking-wide">{t('accessDenied')}</h2>
        <p className="text-xs text-earth-600 dark:text-earth-400 max-w-md">
          The Admin Command Center requires elevated credentials (Field Operator or State Admin role).
        </p>
        <Link
          href="/login"
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs rounded-lg font-bold transition-colors shadow-sm"
        >
          {t('signIn')}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 flex overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">{children}</div>
    </div>
  );
}
