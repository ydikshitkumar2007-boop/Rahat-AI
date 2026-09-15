'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/providers/LanguageProvider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  CloudRain,
  Droplets,
  Layers,
  Activity,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

interface StationMetrics {
  rainfall24h?: number;
  forecast6h?: number;
  soilMoisture?: number;
  slopeTilt?: number;
  geology?: string;
  dataQuality?: number;
  riskLevel?: 'low' | 'moderate' | 'high' | 'severe';
}

interface WhyRiskCardProps {
  metrics?: StationMetrics;
  className?: string;
}

export function WhyRiskCard({ metrics, className = '' }: WhyRiskCardProps) {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(true);

  const rain24 = metrics?.rainfall24h ?? 185.4;
  const forecast6 = metrics?.forecast6h ?? 22.0;
  const soilPct = metrics?.soilMoisture ?? 84.5;
  const slope = metrics?.slopeTilt ?? 34.5;
  const geologyText = metrics?.geology ?? 'Fractured Schist / High Permeability';
  const quality = metrics?.dataQuality ?? 94;
  const risk = metrics?.riskLevel ?? 'severe';

  const factors = [
    {
      id: 'rain24',
      title: t('accumulatedRainfall'),
      val: `${rain24} mm`,
      status: rain24 > 150 ? t('factorSevere') : rain24 > 80 ? t('factorHigh') : t('factorNormal'),
      type: t('observedProviderData'),
      icon: CloudRain,
      elevated: rain24 > 80,
    },
    {
      id: 'forecast6',
      title: t('shortTermForecast'),
      val: `${forecast6} mm`,
      status: forecast6 > 20 ? t('factorHigh') : t('factorNormal'),
      type: t('observedProviderData'),
      icon: Activity,
      elevated: forecast6 > 20,
    },
    {
      id: 'soilPct',
      title: t('soilSaturationLevel'),
      val: `${soilPct}%`,
      status: soilPct > 80 ? t('factorSevere') : soilPct > 60 ? t('factorModerate') : t('factorNormal'),
      type: t('calculatedAssessment'),
      icon: Droplets,
      elevated: soilPct > 70,
    },
    {
      id: 'slope',
      title: t('slopeAngleFactor'),
      val: `${slope}° Slope`,
      status: slope > 30 ? t('factorElevated') : t('factorNormal'),
      type: t('calculatedAssessment'),
      icon: Layers,
      elevated: slope > 30,
    },
    {
      id: 'geology',
      title: t('geologyFactor'),
      val: geologyText,
      status: t('factorModerate'),
      type: t('calculatedAssessment'),
      icon: Layers,
      elevated: false,
    },
    {
      id: 'confidence',
      title: t('dataConfidenceFactor'),
      val: `${quality}% Quality Index`,
      status: t('factorNormal'),
      type: t('calculatedAssessment'),
      icon: ShieldCheck,
      elevated: false,
    },
  ];

  return (
    <Card variant="tactical" className={`${className}`}>
      <CardHeader className="cursor-pointer select-none" onClick={() => setIsExpanded(!isExpanded)}>
        <CardTitle className="text-base font-semibold flex items-center justify-between text-earth-900 dark:text-white">
          <span className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-brand-primary dark:text-saffron-primary" />
            <span>{t('whyThisRisk')}</span>
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-earth-600 dark:text-gray-400 font-normal">
              {isExpanded ? 'Collapse' : 'Expand'}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-earth-600 dark:text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-earth-600 dark:text-gray-400" />
            )}
          </div>
        </CardTitle>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4 pt-1">
          <p className="text-xs text-earth-600 dark:text-gray-400 font-medium">
            {t('whyThisRiskSub')}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {factors.map((f) => {
              const IconComp = f.icon;
              return (
                <div
                  key={f.id}
                  className="p-3 bg-earth-100 dark:bg-gray-900/90 rounded-xl border border-earth-300 dark:border-gray-700 flex flex-col justify-between gap-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 font-medium text-earth-900 dark:text-white">
                      <IconComp className="w-3.5 h-3.5 text-brand-primary dark:text-saffron-primary shrink-0" />
                      <span>{f.title}</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        f.elevated
                          ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-200'
                          : 'bg-earth-200 text-earth-800 dark:bg-gray-800 dark:text-gray-300'
                      }`}
                    >
                      {f.status}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between pt-1 border-t border-earth-300/40 dark:border-gray-800">
                    <span className="text-sm font-bold text-earth-900 dark:text-white">
                      {f.val}
                    </span>
                    <span className="text-[10px] text-earth-500 dark:text-gray-400 font-mono">
                      {f.type}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-saffron-soft/60 dark:bg-amber-950/30 border border-saffron-border/60 dark:border-amber-900/40 rounded-xl flex items-center gap-2.5 text-xs text-earth-900 dark:text-amber-100 font-medium">
            <AlertCircle className="w-4 h-4 text-saffron-primary shrink-0" />
            <span>{t('riskDisclaimerNote')}</span>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
