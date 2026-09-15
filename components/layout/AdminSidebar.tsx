'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileCheck,
  Radio,
  Sliders,
  AlertOctagon,
  BarChart3,
  Users,
  History,
  ShieldCheck,
  ChevronRight,
  Brain,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/lib/providers/LanguageProvider';

export function AdminSidebar() {
  const pathname = usePathname();
  const { role } = useAuth();
  const { t } = useLanguage();

  const menuItems = [
    { href: '/admin', label: t('administration'), icon: LayoutDashboard },
    { href: '/admin/reports', label: t('fieldReports'), icon: FileCheck },
    { href: '/admin/stations', label: t('stations'), icon: Radio },
    { href: '/admin/simulation', label: t('simulations'), icon: Sliders },
    { href: '/admin/model-registry', label: t('modelRegistry'), icon: Brain },
    { href: '/admin/alerts', label: t('warningsAlerts'), icon: AlertOctagon },
    { href: '/admin/analytics', label: t('analytics'), icon: BarChart3 },
    { href: '/admin/users', label: t('users'), icon: Users },
    { href: '/admin/audit', label: t('auditLogs'), icon: History },
  ];

  return (
    <aside className="w-64 bg-[#FBFAF7] dark:bg-[#15191D] border-r border-[#DED8CD] dark:border-[#303943] shrink-0 flex flex-col justify-between min-h-[calc(100vh-3.5rem)] shadow-xs transition-colors">
      <div className="p-4 space-y-4">
        {/* Admin Header Title */}
        <div className="px-3 py-2 bg-[#F3EFE7] dark:bg-[#252D36] border border-[#DED8CD] dark:border-[#38424C] rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#734627] dark:text-[#F4B942]" />
            <span className="text-xs font-bold text-[#20262D] dark:text-[#F8FAFC] uppercase tracking-wider">
              {t('commandCenter')}
            </span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#734627] dark:bg-[#C98957] text-white dark:text-[#111315] uppercase">
            {role}
          </span>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-[#F1E4D8] dark:bg-[rgba(244,185,66,0.12)] text-[#734627] dark:text-[#F8FAFC] border-l-4 border-l-[#D98A18] dark:border-l-[#F4B942] shadow-xs'
                    : 'text-[#5F6974] dark:text-[#D8DEE5] hover:bg-[#F6F4EF] dark:hover:bg-[#242B33] hover:text-[#20262D] dark:hover:text-[#FFFFFF]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-[#D98A18] dark:text-[#F4B942]' : 'text-[#7C858D] dark:text-[#919EAB]'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="h-3 w-3 text-[#D98A18] dark:text-[#F4B942]" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info Box */}
      <div className="p-4 border-t border-[#DED8CD] dark:border-[#303943] text-[11px] text-[#5F6974] dark:text-[#B9C3CD] font-medium space-y-1">
        <p className="flex justify-between">
          <span>{t('systemStatusLabel')}:</span>
          <span className="text-[#4F7A58] font-bold">ONLINE</span>
        </p>
        <p className="flex justify-between">
          <span>{t('activeWeatherStations')}:</span>
          <span className="text-[#20262D] dark:text-[#F8FAFC] font-bold">7 / 8</span>
        </p>
        <p className="text-[10px] text-[#7C858D] dark:text-[#919EAB] mt-2">RAHAT Decision Support System</p>
      </div>
    </aside>
  );
}
