'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldAlert, Activity, Map, AlertTriangle, FileText, User, Radio, LogOut, LogIn, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/lib/providers/LanguageProvider';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageToggle } from '@/components/ui/LanguageToggle';

export function Navbar() {
  const pathname = usePathname();
  const { role, isAuthenticated, user, signOut } = useAuth();
  const { t } = useLanguage();

  const navLinks = [
    { href: '/', label: t('overview'), icon: Activity },
    { href: '/dashboard', label: t('hazardDashboard'), icon: ShieldAlert },
    { href: '/map', label: t('gisRiskMap'), icon: Map },
    { href: '/reports', label: t('fieldReports'), icon: FileText },
    { href: '/alerts', label: t('warningsAlerts'), icon: AlertTriangle },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-[#151A22] border-b border-[#E5DED3] dark:border-[#303949] shadow-xs backdrop-blur-md transition-colors">
      {/* Top Civic Resilience Notice Bar */}
      <div className="bg-[#F8F7F4] dark:bg-[#0F1115] border-b border-[#E5DED3] dark:border-[#303949] px-4 py-1.5 flex items-center justify-between text-xs text-[#25201C] dark:text-[#CBD5E1]">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D97706] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D97706] dark:bg-[#F59E0B]" />
          </span>
          <span className="font-semibold text-[#2B2520] dark:text-[#F8FAFC]">{t('systemStatus')}</span>
          <span className="text-[#6E6258] dark:text-[#CBD5E1] truncate">
            {t('liveStatusText')}
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-[#6E6258] dark:text-[#CBD5E1] text-[11px]">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3 w-3 text-risk-low" />
            <span className="text-[#25201C] dark:text-[#CBD5E1] font-medium">{t('openMeteoActive')}</span>
          </span>
          <span>•</span>
          <span>{t('versionText')}</span>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 gap-3">
        {/* Brand Logo & Title */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="p-2 bg-[#F3E6D8] dark:bg-[#202734] rounded-lg border border-[#DABFA8] dark:border-[#323C4B] text-[#754A2B] dark:text-[#E2B27D] group-hover:border-[#754A2B] transition-colors">
            <Radio className="h-5 w-5" />
          </div>
          <div>
            <div className="font-bold text-lg text-[#33271F] dark:text-[#FFFFFF] tracking-tight flex items-center gap-1.5">
              {t('brandTitle')}{' '}
              <span className="text-xs px-2 py-0.5 rounded bg-[#F3E6D8] dark:bg-[#202734] text-[#754A2B] dark:text-[#FCD34D] border border-[#DABFA8] dark:border-[#323C4B] font-medium">
                Civic Tech
              </span>
            </div>
            <div className="text-xs text-[#6E6258] dark:text-[#CBD5E1] font-medium">
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
                    ? 'bg-[#F5E9D9] dark:bg-[rgba(198,138,90,0.16)] text-[#754A2B] dark:text-[#F2D1A7] border-b-2 border-[#D97706] dark:border-[#F59E0B] font-bold shadow-xs'
                    : 'text-[#25201C] dark:text-[#CBD5E1] hover:text-[#754A2B] dark:hover:text-[#FFFFFF] hover:bg-[#F8F2E9] dark:hover:bg-[#202734]'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-[#D97706] dark:text-[#F59E0B]' : 'text-[#6E6258] dark:text-[#94A3B8]'}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Controls: Language Toggle, Theme Toggle & User Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageToggle />
          <ThemeToggle />

          {(role === 'admin' || role === 'field_operator') && (
            <Link
              href="/admin"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-[#F3E6D8] dark:bg-[#202734] text-[#754A2B] dark:text-[#F2D1A7] border border-[#DABFA8] dark:border-[#323C4B] hover:bg-[#F5E9D9] dark:hover:bg-[#252E3C] transition-colors"
            >
              <ShieldAlert className="h-4 w-4 text-[#754A2B] dark:text-[#F59E0B]" />
              <span>{t('commandCenter')}</span>
            </Link>
          )}

          {isAuthenticated ? (
            <div className="flex items-center gap-2 text-xs">
              <div className="hidden sm:flex items-center gap-2 bg-[#F8F7F4] dark:bg-[#202734] border border-[#E5DED3] dark:border-[#323C4B] rounded-md px-2.5 py-1.5">
                <User className="h-3.5 w-3.5 text-[#754A2B] dark:text-[#F59E0B]" />
                <span className="text-[#25201C] dark:text-[#F8FAFC] font-semibold truncate max-w-[100px]">{user?.fullName}</span>
              </div>
              <button
                onClick={() => signOut()}
                title={t('signOut')}
                className="p-1.5 rounded-md bg-[#F8F7F4] dark:bg-[#202734] border border-[#E5DED3] dark:border-[#323C4B] text-[#6E6258] dark:text-[#CBD5E1] hover:text-risk-severe transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold bg-[#754A2B] hover:bg-[#5D3820] dark:bg-[#C68A5A] dark:hover:bg-[#D8A779] text-white dark:text-[#0F1115] transition-all shadow-xs"
            >
              <LogIn className="h-4 w-4" />
              <span>{t('signIn')}</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
