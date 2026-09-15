'use client';

import React, { useState } from 'react';
import { useAlerts } from '@/hooks/useAlerts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { RiskBadge } from '@/components/ui/StatusBadge';
import { LoadingState } from '@/components/ui/LoadingState';
import { AlertTriangle, Phone, Radio, Clock, MapPin, PhoneCall } from 'lucide-react';
import { formatDate } from '@/lib/utils/format';
import { OperatingModeBadge } from '@/components/ui/DataLabelBadge';
import { useLanguage } from '@/lib/providers/LanguageProvider';
import { EmergencyCallModal } from '@/components/ui/EmergencyCallModal';

export default function AlertsPage() {
  const { alerts, loading } = useAlerts();
  const { t } = useLanguage();
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [selectedHotline, setSelectedHotline] = useState('112');

  const openEmergencyCall = (num: string) => {
    setSelectedHotline(num);
    setIsEmergencyModalOpen(true);
  };

  if (loading) {
    return <LoadingState message={t('loading')} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="border-b border-[#E5DED3] dark:border-[#303949] pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sand-200 dark:bg-earth-800 rounded-xl border border-sand-300 dark:border-earth-700 text-risk-severe">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-earth-900 dark:text-earth-100 tracking-tight">
                {t('warningsAlertsTitle')}
              </h1>
              <p className="text-sm text-earth-600 dark:text-earth-400 mt-1">
                {t('warningsAlertsSub')}
              </p>
            </div>
          </div>
        </div>
        <OperatingModeBadge mode="live_decision_support" />
      </div>

      {/* Emergency Helpline Strip */}
      <div className="p-5 bg-white dark:bg-[#1B212B] border border-[#E5DED3] dark:border-[#323C4B] rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-earth-700 dark:text-earth-300 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-risk-severe/15 rounded-xl border border-risk-severe/30 text-risk-severe">
            <Phone className="h-6 w-6" />
          </div>
          <div>
            <div className="font-bold text-sm text-earth-900 dark:text-white">State & National Disaster Helplines</div>
            <div className="text-earth-600 dark:text-gray-400 text-xs mt-0.5">
              Tap any hotline to prepare coordinates and open your device dialer.
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => openEmergencyCall('112')}
            className="px-3 py-1.5 rounded-lg bg-risk-severe text-white text-xs font-bold hover:bg-red-700 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <PhoneCall className="h-3.5 w-3.5" />
            <span>National 112</span>
          </button>
          <button
            onClick={() => openEmergencyCall('1078')}
            className="px-3 py-1.5 rounded-lg bg-[#754A2B] hover:bg-[#5D3820] text-white text-xs font-semibold transition-colors"
          >
            NDRF 1078
          </button>
          <button
            onClick={() => openEmergencyCall('1070')}
            className="px-3 py-1.5 rounded-lg bg-sand-200 dark:bg-[#202734] text-earth-900 dark:text-gray-100 border border-sand-300 dark:border-[#323C4B] text-xs font-semibold hover:bg-sand-300 transition-colors"
          >
            Meghalaya 1070
          </button>
          <button
            onClick={() => openEmergencyCall('1077')}
            className="px-3 py-1.5 rounded-lg bg-sand-200 dark:bg-[#202734] text-earth-900 dark:text-gray-100 border border-sand-300 dark:border-[#323C4B] text-xs font-semibold hover:bg-sand-300 transition-colors"
          >
            Sikkim 1077
          </button>
          <button
            onClick={() => openEmergencyCall('1079')}
            className="px-3 py-1.5 rounded-lg bg-sand-200 dark:bg-[#202734] text-earth-900 dark:text-gray-100 border border-sand-300 dark:border-[#323C4B] text-xs font-semibold hover:bg-sand-300 transition-colors"
          >
            Assam 1079
          </button>
        </div>
      </div>

      {/* Safety Guidance Box */}
      <div className="p-4 bg-sand-100 dark:bg-[#1B212B] border border-[#E5DED3] dark:border-[#323C4B] rounded-2xl space-y-2 text-xs">
        <h3 className="font-bold text-earth-900 dark:text-earth-100 text-sm flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-risk-moderate" />
          {t('safetyGuidance')}
        </h3>
        <ul className="list-disc list-inside space-y-1 text-earth-700 dark:text-earth-300 leading-relaxed">
          <li>{t('stayClearSlopes')}</li>
          <li>{t('reportNewCracks')}</li>
          <li>{t('monitorBulletins')}</li>
        </ul>
      </div>

      {/* Alerts Feed Grid */}
      <div className="space-y-6">
        {alerts.length === 0 ? (
          <div className="text-center py-10 text-earth-600 dark:text-earth-400 text-sm">
            {t('noAlertsFound')}
          </div>
        ) : (
          alerts.map((alert) => (
            <Card key={alert.id} variant="tactical">
              <CardHeader className="pb-3 border-b border-sand-300 dark:border-earth-800">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-earth-900 dark:text-earth-100 font-medium text-base">
                    <Radio className="h-4 w-4 text-earth-600 dark:text-earth-400" />
                    {alert.alert_code} — {alert.title}
                  </span>
                  <RiskBadge level={alert.severity} />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4 text-xs">
                <div className="text-earth-800 dark:text-earth-200 font-sans text-sm leading-relaxed">
                  {alert.advisory_text}
                </div>

                <div className="p-3.5 bg-sand-100 dark:bg-earth-800 border border-sand-300 dark:border-earth-700 rounded-xl space-y-1 text-earth-900 dark:text-earth-100">
                  <strong className="block text-xs font-semibold text-risk-moderate">
                    {t('advisoryNote')}:
                  </strong>
                  <p className="font-sans text-xs text-earth-700 dark:text-earth-300 leading-relaxed">
                    {alert.recommended_action}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-earth-600 dark:text-earth-400 pt-3 border-t border-sand-300 dark:border-earth-800">
                  <div className="flex items-center gap-1.5 text-earth-700 dark:text-earth-300 font-medium">
                    <MapPin className="h-4 w-4" />
                    <span>{t('targetCorridorLabel')}: {alert.affected_areas.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-earth-500" />
                      {t('lastUpdatedLabel')}: {formatDate(alert.issued_at)}
                    </span>
                    <span>{t('issuedBy')}: {alert.issued_by}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Emergency Call Modal Instance */}
      <EmergencyCallModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        initialNumber={selectedHotline}
      />
    </div>
  );
}
