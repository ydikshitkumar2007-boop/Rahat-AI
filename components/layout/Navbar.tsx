'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldAlert, Activity, Map, AlertTriangle, FileText, User, Radio, LogOut, LogIn, CheckCircle2, PhoneCall } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/lib/providers/LanguageProvider';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { EmergencyCallModal } from '@/components/ui/EmergencyCallModal';

export function Navbar() {
  const pathname = usePathname();
  const { role, isAuthenticated, user, signOut } = useAuth();
  const { t } = useLanguage();
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  const navLinks = [
    { href: '/', label: t('overview'), icon: Activity },
    { href: '/dashboard', label: t('hazardDashboard'), icon: ShieldAlert },
    { href: '/map', label: t('gisRiskMap'), icon: Map },
    { href: '/reports', label: t('fieldReports'), icon: FileText },
    { href: '/alerts', label: t('warningsAlerts'), icon: AlertTriangle },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white dark:bg-[#15191D] border-b border-[#DED8CD] dark:border-[#303943] shadow-xs backdrop-blur-md transition-colors">
        {/* Top Civic Resilience Notice Bar */}
        <div className="bg-[#F6F4EF] dark:bg-[#111315] border-b border-[#DED8CD] dark:border-[#303943] px-4 py-1.5 flex items-center justify-between text-xs text-[#3E4751] dark:text-[#B9C3CD]">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D98A18] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D98A18] dark:bg-[#F4B942]" />
            </span>
            <span className="font-semibold text-[#20262D] dark:text-[#F8FAFC]">{t('systemStatus')}</span>
            <span className="text-[#5F6974] dark:text-[#B9C3CD] truncate">
              {t('liveStatusText')}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-[#5F6974] dark:text-[#B9C3CD] text-[11px]">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3 w-3 text-[#4F7A58]" />
              <span className="text-[#20262D] dark:text-[#B9C3CD] font-medium">{t('openMeteoActive')}</span>
            </span>
            <span>•</span>
            <span>{t('versionText')}</span>
          </div>
        </div>

        {/* Main Navigation Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 gap-3">
          {/* Brand Logo & Title */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="p-2 bg-[#F1E4D8] dark:bg-[#202730] rounded-lg border border-[#D6BDAA] dark:border-[#38424C] text-[#734627] dark:text-[#F4B942] group-hover:border-[#734627] transition-colors">
              <Radio className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-lg text-[#20262D] dark:text-[#F8FAFC] tracking-tight flex items-center gap-1.5">
                {t('brandTitle')}{' '}
                <span className="text-xs px-2 py-0.5 rounded bg-[#F1E4D8] dark:bg-[#202730] text-[#734627] dark:text-[#FFD77F] border border-[#D6BDAA] dark:border-[#38424C] font-medium">
                  Civic Tech
                </span>
              </div>
              <div className="text-xs text-[#5F6974] dark:text-[#B9C3CD] font-medium">
                {t('brandSubtitle')}
              </div>
            </div>
          </Link>

          {/* Primary Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-[#F1E4D8] dark:bg-[rgba(244,185,66,0.14)] text-[#734627] dark:text-[#FFD77F] border-b-2 border-[#D98A18] dark:border-[#F4B942] font-bold shadow-xs'
                      : 'text-[#3E4751] dark:text-[#D8DEE5] hover:text-[#734627] dark:hover:text-[#FFFFFF] hover:bg-[#F6F4EF] dark:hover:bg-[#202730]'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-[#D98A18] dark:text-[#F4B942]' : 'text-[#5F6974] dark:text-[#919EAB]'}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls: Language Toggle, Theme Toggle, Emergency Call & User Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsEmergencyModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold bg-red-50 dark:bg-red-950/40 text-[#A33D32] dark:text-red-400 border border-red-200 dark:border-red-900 hover:bg-[#A33D32] hover:text-white transition-all shadow-xs"
            >
              <PhoneCall className="h-3.5 w-3.5 animate-pulse" />
              <span className="hidden sm:inline">{t('emergencyCall')}</span>
              <span className="sm:hidden">112</span>
            </button>

            <LanguageToggle />
            <ThemeToggle />

            {(role === 'admin' || role === 'field_operator') && (
              <Link
                href="/admin"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-[#F1E4D8] dark:bg-[#202730] text-[#734627] dark:text-[#FFD77F] border border-[#D6BDAA] dark:border-[#38424C] hover:bg-[#E8D9C8] dark:hover:bg-[#252D36] transition-colors"
              >
                <ShieldAlert className="h-4 w-4 text-[#734627] dark:text-[#F4B942]" />
                <span>{t('commandCenter')}</span>
              </Link>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-2 text-xs">
                <div className="hidden sm:flex items-center gap-2 bg-[#F6F4EF] dark:bg-[#202730] border border-[#DED8CD] dark:border-[#38424C] rounded-md px-2.5 py-1.5">
                  <User className="h-3.5 w-3.5 text-[#734627] dark:text-[#F4B942]" />
                  <span className="text-[#20262D] dark:text-[#F8FAFC] font-semibold truncate max-w-[100px]">{user?.fullName}</span>
                </div>
                <button
                  onClick={() => signOut()}
                  title={t('signOut')}
                  className="p-1.5 rounded-md bg-[#F6F4EF] dark:bg-[#202730] border border-[#DED8CD] dark:border-[#38424C] text-[#5F6974] dark:text-[#B9C3CD] hover:text-[#A33D32] transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold bg-[#734627] hover:bg-[#5D351C] dark:bg-[#F4B942] dark:hover:bg-[#FFC95C] text-white dark:text-[#111315] transition-all shadow-xs"
              >
                <LogIn className="h-4 w-4" />
                <span>{t('signIn')}</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Emergency Assistance Modal */}
      <EmergencyCallModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        initialNumber="112"
      />
    </>
  );
}
