'use client';

import React from 'react';
import { CloudRain, Sliders, Activity, BrainCircuit, Cpu } from 'lucide-react';
import { useLanguage } from '@/lib/providers/LanguageProvider';

export function LiveWeatherBadge() {
  const { t } = useLanguage();
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-saffron-text bg-saffron-soft border border-saffron-border">
      <span className="flex h-2 w-2 relative">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-saffron-500 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-saffron-600 dark:bg-saffron-400" />
      </span>
      <CloudRain className="h-3 w-3 text-saffron-primary" />
      {t('liveWeatherData')}
    </span>
  );
}

export function SimulatedTelemetryBadge() {
  const { t } = useLanguage();
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium text-earth-800 dark:text-gray-300 bg-earth-200 dark:bg-gray-800 border border-earth-300 dark:border-gray-700">
      <Sliders className="h-3 w-3 text-earth-600 dark:text-gray-400" />
      {t('simulatedTelemetry')}
    </span>
  );
}

export function OperatingModeBadge({ mode }: { mode: 'live_decision_support' | 'simulation' }) {
  const isLive = mode === 'live_decision_support';
  const { t } = useLanguage();
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
        isLive
          ? 'bg-[#4F7A58]/15 text-[#4F7A58] dark:text-[#4ADE80] border-[#4F7A58]/40'
          : 'bg-saffron-soft text-saffron-text border-saffron-border'
      }`}
    >
      <Cpu className="h-3 w-3" />
      {isLive ? t('liveDecisionSupportMode') : t('simulationTrainingMode')}
    </span>
  );
}

export function MLModelStatusBadge({ status, version }: { status: string; version: string }) {
  const isApproved = status === 'approved';
  const { t } = useLanguage();
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
        isApproved
          ? 'bg-[#4F7A58]/15 text-[#4F7A58] dark:text-[#4ADE80] border-[#4F7A58]/40'
          : 'bg-earth-200 dark:bg-gray-800 text-earth-800 dark:text-gray-200 border-earth-300 dark:border-gray-700'
      }`}
    >
      <BrainCircuit className="h-3 w-3" />
      {t('modelVersionLabel')}: {isApproved ? `Approved (${version})` : `${t('candidateModelStatus')} (${version})`}
    </span>
  );
}

export function HazardNowcastBadge({ score, category }: { score: number; category: string }) {
  let badgeStyle = 'bg-[#4F7A58]/15 text-[#4F7A58] dark:text-[#4ADE80] border-[#4F7A58]/40';
  if (category === 'severe') badgeStyle = 'bg-[#A33D32]/15 text-[#A33D32] dark:text-[#F87171] border-[#A33D32]/40 animate-pulse';
  else if (category === 'high') badgeStyle = 'bg-[#B7602B]/15 text-[#B7602B] dark:text-[#FB923C] border-[#B7602B]/40';
  else if (category === 'moderate') badgeStyle = 'bg-[#B88422]/15 text-[#B88422] dark:text-[#FBBF24] border-[#B88422]/40';

  const { t } = useLanguage();

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badgeStyle}`}>
      <Activity className="h-3 w-3" />
      {t('relativeHazardScore')}: {score}/100 ({category})
    </span>
  );
}

export function RiskScoreBadge({ score, level }: { score: number; level: string }) {
  return <HazardNowcastBadge score={score} category={level} />;
}

export default function DataLabelBadge({ labelType = 'nowcast' }: { labelType?: 'nowcast' | 'candidate_model' | 'live_weather' }) {
  if (labelType === 'candidate_model') {
    return <MLModelStatusBadge status="candidate" version="v2.0.0" />;
  }
  if (labelType === 'live_weather') {
    return <LiveWeatherBadge />;
  }
  return <HazardNowcastBadge score={42} category="moderate" />;
}
