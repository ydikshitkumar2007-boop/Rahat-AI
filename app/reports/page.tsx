'use client';

import React, { useState } from 'react';
import { useReports } from '@/hooks/useReports';
import { submitReport } from '@/services/reports';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { RiskBadge } from '@/components/ui/StatusBadge';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmergencyCallModal } from '@/components/ui/EmergencyCallModal';
import { FileText, Send, CheckCircle2, MapPin, AlertOctagon, PhoneCall, Info } from 'lucide-react';
import { formatTimeAgo } from '@/lib/utils/format';
import { RiskLevel } from '@/types';
import { useLanguage } from '@/lib/providers/LanguageProvider';

export default function ReportsPage() {
  const { reports, loading, refreshReports } = useReports();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    reporter_name: '',
    state: 'Meghalaya',
    district: 'East Khasi Hills',
    location_description: '',
    hazard_type: 'slope_crack',
    severity: 'high' as RiskLevel,
    description: '',
    latitude: 25.2986,
    longitude: 91.7321,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const idempotency_key = `CLIENT-UUID-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

      await submitReport({
        idempotency_key,
        reporter_name: formData.reporter_name || 'Anonymous Field Observer',
        reporter_role: 'citizen',
        state: formData.state,
        district: formData.district,
        location_description: formData.location_description,
        hazard_type: formData.hazard_type,
        severity: formData.severity,
        description: formData.description,
        latitude: formData.latitude,
        longitude: formData.longitude,
        sync_source: 'web_online',
      });

      setSuccessMessage(t('reportSubmittedSuccess'));
      await refreshReports();
      setFormData({
        reporter_name: '',
        state: 'Meghalaya',
        district: 'East Khasi Hills',
        location_description: '',
        hazard_type: 'slope_crack',
        severity: 'high',
        description: '',
        latitude: 25.2986,
        longitude: 91.7321,
      });
    } catch (err) {
      alert(t('error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingState message={t('loading')} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="border-b border-earth-300 dark:border-gray-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-earth-200 dark:bg-gray-800 rounded-xl border border-earth-300 dark:border-gray-700 text-brand-primary dark:text-saffron-primary shadow-xs">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-earth-900 dark:text-white tracking-tight">
                {t('fieldReportsTitle')}
              </h1>
              <p className="text-xs sm:text-sm text-earth-600 dark:text-gray-400 mt-0.5 font-medium">
                {t('fieldReportsSub')}
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={() => setIsEmergencyModalOpen(true)}
          variant="outline"
          className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/40 text-xs font-bold gap-2 shrink-0"
        >
          <PhoneCall className="w-4 h-4 text-red-600 dark:text-red-400" />
          <span>{t('emergencyCall')}</span>
        </Button>
      </div>

      {/* Purpose & Safety Notice Strip */}
      <div className="p-4 bg-earth-soft dark:bg-gray-800/90 border border-earth-300 dark:border-gray-700 rounded-2xl space-y-2 text-xs text-earth-900 dark:text-gray-200">
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-brand-primary dark:text-saffron-primary shrink-0 mt-0.5" />
          <p className="font-semibold leading-relaxed">{t('fieldReportGuide')}</p>
        </div>
        <div className="flex items-center justify-between gap-4 pt-2 border-t border-earth-300/40 dark:border-gray-700/60 text-[11px] text-earth-600 dark:text-gray-400">
          <span className="flex items-center gap-1.5">
            <AlertOctagon className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            {t('notEmergencyDispatch')}
          </span>
          <button
            type="button"
            onClick={() => setIsEmergencyModalOpen(true)}
            className="text-red-600 dark:text-red-400 font-bold underline hover:text-red-700 shrink-0"
          >
            {t('immediateDangerCall')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Submission Form Column */}
        <div className="lg:col-span-5">
          <Card variant="tactical">
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center justify-between">
                <span className="flex items-center gap-2 text-earth-900 dark:text-white">
                  <Send className="h-4 w-4 text-brand-primary dark:text-saffron-primary" />
                  {t('reportAnObservation')}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {successMessage && (
                <div className="p-3 mb-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-risk-low flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-earth-900 dark:text-gray-200 font-semibold mb-1">
                    Reporter Name <span className="text-earth-500 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Tashi Norbu or Anonymous"
                    value={formData.reporter_name}
                    onChange={(e) => setFormData({ ...formData, reporter_name: e.target.value })}
                    className="w-full bg-earth-100 dark:bg-gray-900 border border-earth-300 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-earth-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-earth-900 dark:text-gray-200 font-semibold mb-1">State</label>
                    <select
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full bg-earth-100 dark:bg-gray-900 border border-earth-300 dark:border-gray-700 rounded-xl px-3 py-2.5 text-earth-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary font-medium"
                    >
                      <option value="Meghalaya">Meghalaya</option>
                      <option value="Sikkim">Sikkim</option>
                      <option value="Assam">Assam</option>
                      <option value="Mizoram">Mizoram</option>
                      <option value="Nagaland">Nagaland</option>
                      <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                      <option value="Manipur">Manipur</option>
                      <option value="Tripura">Tripura</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-earth-900 dark:text-gray-200 font-semibold mb-1">District</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. East Khasi Hills"
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="w-full bg-earth-100 dark:bg-gray-900 border border-earth-300 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-earth-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-earth-900 dark:text-gray-200 font-semibold mb-1">{t('location')}</label>
                  <input
                    type="text"
                    required
                    placeholder={t('locationPlaceholder')}
                    value={formData.location_description}
                    onChange={(e) => setFormData({ ...formData, location_description: e.target.value })}
                    className="w-full bg-earth-100 dark:bg-gray-900 border border-earth-300 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-earth-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-earth-900 dark:text-gray-200 font-semibold mb-1">Hazard Type</label>
                    <select
                      value={formData.hazard_type}
                      onChange={(e) => setFormData({ ...formData, hazard_type: e.target.value })}
                      className="w-full bg-earth-100 dark:bg-gray-900 border border-earth-300 dark:border-gray-700 rounded-xl px-3 py-2.5 text-earth-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary font-medium"
                    >
                      <option value="slope_crack">Slope Crack</option>
                      <option value="rockfall">Rockfall / Boulders</option>
                      <option value="mudslide">Debris Flow / Mudslide</option>
                      <option value="road_block">Road Blockage</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-earth-900 dark:text-gray-200 font-semibold mb-1">{t('hazardCategory')}</label>
                    <select
                      value={formData.severity}
                      onChange={(e) => setFormData({ ...formData, severity: e.target.value as RiskLevel })}
                      className="w-full bg-earth-100 dark:bg-gray-900 border border-earth-300 dark:border-gray-700 rounded-xl px-3 py-2.5 text-earth-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary font-medium"
                    >
                      <option value="severe">{t('severe')}</option>
                      <option value="high">{t('high')}</option>
                      <option value="moderate">{t('moderate')}</option>
                      <option value="low">{t('low')}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-earth-900 dark:text-gray-200 font-semibold mb-1">{t('description')}</label>
                  <textarea
                    rows={3}
                    required
                    placeholder={t('descriptionPlaceholder')}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-earth-100 dark:bg-gray-900 border border-earth-300 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-earth-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary font-sans"
                  />
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full py-3 font-semibold">
                  {isSubmitting ? t('loading') : t('submitObservationButton')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Reports History Feed Column */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-base font-semibold text-earth-900 dark:text-white flex items-center justify-between">
            <span>{t('recentFieldObservations')}</span>
            <span className="text-xs text-earth-600 dark:text-gray-400 font-normal">{reports.length} Logs</span>
          </h2>

          <div className="space-y-4">
            {reports.map((rep) => (
              <Card key={rep.id} variant="tactical">
                <CardContent className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-earth-900 dark:text-white">{rep.reporter_name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-earth-100 dark:bg-gray-900 text-earth-700 dark:text-gray-300 border border-earth-300 dark:border-gray-700">
                        {rep.sync_source}
                      </span>
                    </div>
                    <RiskBadge level={rep.severity} />
                  </div>

                  <div className="text-earth-800 dark:text-gray-200 font-sans text-xs leading-relaxed">
                    <strong>Hazard: {rep.hazard_type}</strong> — {rep.description}
                  </div>

                  <div className="flex flex-wrap items-center justify-between text-[11px] text-earth-600 dark:text-gray-400 pt-2 border-t border-earth-300 dark:border-gray-700">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-earth-600 dark:text-gray-400" />
                      {rep.location_description} ({rep.district}, {rep.state})
                    </span>
                    <span>Status: <strong className="text-risk-low uppercase">{rep.verification_status}</strong> • {formatTimeAgo(rep.created_at)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Emergency Call Modal */}
      <EmergencyCallModal isOpen={isEmergencyModalOpen} onClose={() => setIsEmergencyModalOpen(false)} />
    </div>
  );
}
