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
    <aside className="w-64 bg-[#FFFDF9] dark:bg-[#151A22] border-r border-[#E5DED3] dark:border-[#303949] shrink-0 flex flex-col justify-between min-h-[calc(100vh-3.5rem)] shadow-xs">
      <div className="p-4 space-y-4">
        {/* Admin Header Title */}
        <div className="px-3 py-2 bg-[#F3EFE8] dark:bg-[#1B212B] border border-[#E5DED3] dark:border-[#323C4B] rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#754A2B] dark:text-[#E2B27D]" />
            <span className="text-xs font-bold text-[#25201C] dark:text-[#F8FAFC] uppercase tracking-wider">
              {t('commandCenter')}
            </span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#754A2B] dark:bg-[#C68A5A] text-white dark:text-[#0F1115] uppercase">
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
                    ? 'bg-[#F5E9D9] dark:bg-[rgba(198,138,90,0.16)] text-[#754A2B] dark:text-[#F2D1A7] border-l-4 border-l-[#D97706] dark:border-l-[#F59E0B] shadow-xs'
                    : 'text-[#6E6258] dark:text-[#CBD5E1] hover:bg-[#F8F2E9] dark:hover:bg-[#202734] hover:text-[#25201C] dark:hover:text-[#FFFFFF]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-[#D97706] dark:text-[#F59E0B]' : 'text-[#6E6258] dark:text-[#94A3B8]'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="h-3 w-3 text-[#D97706] dark:text-[#F59E0B]" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info Box */}
      <div className="p-4 border-t border-[#E5DED3] dark:border-[#303949] text-[11px] text-[#6E6258] dark:text-[#CBD5E1] font-medium space-y-1">
        <p className="flex justify-between">
          <span>{t('systemStatusLabel')}:</span>
          <span className="text-risk-low font-bold">ONLINE</span>
        </p>
        <p className="flex justify-between">
          <span>{t('activeWeatherStations')}:</span>
          <span className="text-[#25201C] dark:text-[#F8FAFC] font-bold">7 / 8</span>
        </p>
        <p className="text-[10px] text-[#918579] dark:text-[#94A3B8] mt-2">RAHAT Decision Support System</p>
      </div>
    </aside>
  );
}
