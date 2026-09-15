'use client';

import React, { useState } from 'react';
import {
  Brain,
  ShieldCheck,
  AlertTriangle,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Info,
  BarChart3,
  Layers,
} from 'lucide-react';
import DataLabelBadge from '@/components/ui/DataLabelBadge';
import { useLanguage } from '@/lib/providers/LanguageProvider';

interface ModelItem {
  id: string;
  version: string;
  algorithm: string;
  status: 'candidate' | 'approved' | 'archived';
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1: number;
    falseNegativeRate: number;
    mae: number;
    rmse: number;
  };
  datasetSummary: {
    samples: number;
    source: string;
    featuresCount: number;
  };
  intendedUse: string;
  limitations: string;
  dateCreated: string;
}

const INITIAL_MODELS: ModelItem[] = [
  {
    id: 'mod_1',
    version: 'v2.0.0-candidate',
    algorithm: 'Gradient Boosted Decision Trees & Rule Fallback',
    status: 'candidate',
    metrics: {
      accuracy: 90.4,
      precision: 0.8875,
      recall: 0.8256,
      f1: 0.8554,
      falseNegativeRate: 0.1744,
      mae: 4.12,
      rmse: 5.88,
    },
    datasetSummary: {
      samples: 500,
      source: 'Validated Historical Topographic & IMD Weather Observation Data',
      featuresCount: 14,
    },
    intendedUse: 'Decision-support Landslide Hazard Nowcast for Northeast India terrain corridors.',
    limitations: 'Offline candidate model. Requires Admin verification before operational deployment.',
    dateCreated: '2026-09-16',
  },
  {
    id: 'mod_0',
    version: 'v1.0.0-synthetic-dt',
    algorithm: 'DecisionTreeClassifier Baseline Prototype',
    status: 'candidate',
    metrics: {
      accuracy: 71.83,
      precision: 0.71,
      recall: 0.68,
      f1: 0.69,
      falseNegativeRate: 0.32,
      mae: 5.79,
      rmse: 7.15,
    },
    datasetSummary: {
      samples: 3000,
      source: 'Synthetic Telemetry Baseline Generator',
      featuresCount: 6,
    },
    intendedUse: 'Initial hackathon proof-of-concept risk estimation.',
    limitations: 'Trained on synthetic distribution. High false-negative rate.',
    dateCreated: '2026-09-11',
  },
];

export default function AdminModelRegistryPage() {
  const { t } = useLanguage();
  const [models, setModels] = useState<ModelItem[]>(INITIAL_MODELS);
  const [selectedModelId, setSelectedModelId] = useState<string>('mod_1');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const selectedModel = models.find((m) => m.id === selectedModelId) || models[0];

  const toggleApprovalStatus = (id: string) => {
    setModels((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const newStatus = m.status === 'approved' ? 'candidate' : 'approved';
          setActionSuccess(
            `Model ${m.version} status changed to ${newStatus.toUpperCase()}`
          );
          setTimeout(() => setActionSuccess(null), 4000);
          return { ...m, status: newStatus };
        }
        return m;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-sand-50 dark:bg-earth-850 border border-sand-300 dark:border-earth-800 p-6 rounded-xl shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-earth-600 dark:text-earth-400" />
            <h1 className="text-2xl font-bold text-earth-900 dark:text-earth-100">{t('modelRegistryTitle')}</h1>
          </div>
          <p className="text-earth-600 dark:text-earth-400 text-sm mt-1">
            {t('modelRegistrySub')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DataLabelBadge labelType="nowcast" />
          <DataLabelBadge labelType="candidate_model" />
        </div>
      </div>

      {actionSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-risk-low p-4 rounded-lg flex items-center gap-3 text-sm">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Safety Notice */}
      <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg text-earth-900 dark:text-earth-100 text-xs flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-risk-moderate flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-risk-moderate">Human Oversight Requirement: </span>
          All machine learning models are decision-support estimates. An evaluated model remains in{' '}
          <code className="bg-sand-200 dark:bg-earth-800 px-1 py-0.5 rounded">candidate</code> status until explicitly verified and approved by a State Admin. Unapproved models will not be used in operational Nowcasts.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Model Selection List */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-earth-700 dark:text-earth-300 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-earth-600 dark:text-earth-400" /> Registered Models ({models.length})
          </h2>

          <div className="space-y-3">
            {models.map((mod) => (
              <div
                key={mod.id}
                onClick={() => setSelectedModelId(mod.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedModelId === mod.id
                    ? 'bg-sand-100 dark:bg-earth-800 text-brand-800 dark:text-brand-300 border-l-4 border-l-saffron-500 border-sand-300 dark:border-earth-700 shadow-xs'
                    : 'bg-white dark:bg-earth-850 border-sand-300 dark:border-earth-800 text-earth-900 dark:text-earth-100 hover:border-sand-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-base text-earth-900 dark:text-earth-100">{mod.version}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                      mod.status === 'approved'
                        ? 'bg-[#4F7A58]/20 text-[#4F7A58] dark:text-[#4ADE80] border border-[#4F7A58]/40'
                        : 'bg-[#B88422]/20 text-[#B88422] dark:text-[#FBBF24] border border-[#B88422]/40'
                    }`}
                  >
                    {mod.status}
                  </span>
                </div>
                <p className="text-xs text-earth-700 dark:text-earth-300 mt-2 line-clamp-1">{mod.algorithm}</p>
                <div className="flex items-center justify-between text-xs text-earth-600 dark:text-earth-400 mt-3 pt-3 border-t border-sand-300 dark:border-earth-800">
                  <span className="flex items-center gap-1">
                    <BarChart3 className="w-3.5 h-3.5" /> Accuracy: {mod.metrics.accuracy}%
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {mod.dateCreated}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Model Card Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-sand-50 dark:bg-earth-850 border border-sand-300 dark:border-earth-800 p-6 rounded-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sand-300 dark:border-earth-800">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-earth-900 dark:text-earth-100 font-mono">{selectedModel.version}</h2>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                      selectedModel.status === 'approved'
                        ? 'bg-[#4F7A58]/20 text-[#4F7A58] dark:text-[#4ADE80] border border-[#4F7A58]/40'
                        : 'bg-[#B88422]/20 text-[#B88422] dark:text-[#FBBF24] border border-[#B88422]/40'
                    }`}
                  >
                    {selectedModel.status}
                  </span>
                </div>
                <p className="text-sm text-earth-600 dark:text-earth-400 mt-1">{selectedModel.algorithm}</p>
              </div>

              <button
                onClick={() => toggleApprovalStatus(selectedModel.id)}
                className={`px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors ${
                  selectedModel.status === 'approved'
                    ? 'bg-amber-500/20 text-risk-moderate border border-amber-500/30'
                    : 'bg-brand-600 hover:bg-brand-700 text-white shadow-sm'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                {selectedModel.status === 'approved' ? 'Revoke Approval' : 'Approve Model for Nowcasts'}
              </button>
            </div>

            {/* Offline Evaluation Metrics */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-earth-700 dark:text-earth-300 uppercase tracking-wider flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-earth-600 dark:text-earth-400" /> {t('evaluationMetrics')}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-sand-100 dark:bg-earth-800 p-3 rounded-lg border border-sand-300 dark:border-earth-700">
                  <div className="text-xs text-earth-600 dark:text-earth-400 font-medium">Accuracy</div>
                  <div className="text-xl font-bold text-earth-900 dark:text-earth-100">{selectedModel.metrics.accuracy}%</div>
                </div>
                <div className="bg-sand-100 dark:bg-earth-800 p-3 rounded-lg border border-sand-300 dark:border-earth-700">
                  <div className="text-xs text-earth-600 dark:text-earth-400 font-medium">Precision</div>
                  <div className="text-xl font-bold text-risk-low">{selectedModel.metrics.precision}</div>
                </div>
                <div className="bg-sand-100 dark:bg-earth-800 p-3 rounded-lg border border-sand-300 dark:border-earth-700">
                  <div className="text-xs text-earth-600 dark:text-earth-400 font-medium">Recall</div>
                  <div className="text-xl font-bold text-earth-800 dark:text-earth-200">{selectedModel.metrics.recall}</div>
                </div>
                <div className="bg-sand-100 dark:bg-earth-800 p-3 rounded-lg border border-sand-300 dark:border-earth-700">
                  <div className="text-xs text-earth-600 dark:text-earth-400 font-medium">F1 Score</div>
                  <div className="text-xl font-bold text-earth-700 dark:text-earth-300">{selectedModel.metrics.f1}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="bg-sand-100 dark:bg-earth-800 p-3 rounded-lg border border-sand-300 dark:border-earth-700">
                  <div className="text-xs text-earth-600 dark:text-earth-400 font-medium">False Negative Rate</div>
                  <div className="text-lg font-bold text-risk-severe">{selectedModel.metrics.falseNegativeRate}</div>
                </div>
                <div className="bg-sand-100 dark:bg-earth-800 p-3 rounded-lg border border-sand-300 dark:border-earth-700">
                  <div className="text-xs text-earth-600 dark:text-earth-400 font-medium">MAE</div>
                  <div className="text-lg font-bold text-risk-moderate">{selectedModel.metrics.mae}</div>
                </div>
                <div className="bg-sand-100 dark:bg-earth-800 p-3 rounded-lg border border-sand-300 dark:border-earth-700">
                  <div className="text-xs text-earth-600 dark:text-earth-400 font-medium">RMSE</div>
                  <div className="text-lg font-bold text-risk-high">{selectedModel.metrics.rmse}</div>
                </div>
              </div>
            </div>

            {/* Data Provenance & Model Card Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-sand-100 dark:bg-earth-800 p-4 rounded-lg border border-sand-300 dark:border-earth-700 space-y-2">
                <h4 className="text-xs font-semibold text-earth-700 dark:text-earth-300 uppercase tracking-wider flex items-center gap-1.5">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-earth-600 dark:text-earth-400" /> {t('datasetProvenance')}
                </h4>
                <div className="text-xs space-y-1.5 text-earth-800 dark:text-earth-200">
                  <div>
                    <span className="text-earth-600 dark:text-earth-400">Samples:</span> {selectedModel.datasetSummary.samples} records
                  </div>
                  <div>
                    <span className="text-earth-600 dark:text-earth-400">Features:</span> {selectedModel.datasetSummary.featuresCount} inputs
                  </div>
                  <div>
                    <span className="text-earth-600 dark:text-earth-400">Source:</span> {selectedModel.datasetSummary.source}
                  </div>
                </div>
              </div>

              <div className="bg-sand-100 dark:bg-earth-800 p-4 rounded-lg border border-sand-300 dark:border-earth-700 space-y-2">
                <h4 className="text-xs font-semibold text-earth-700 dark:text-earth-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-risk-moderate" /> Intended Use & Boundaries
                </h4>
                <div className="text-xs text-earth-800 dark:text-earth-200 space-y-1">
                  <p>{selectedModel.intendedUse}</p>
                  <p className="text-risk-moderate pt-1 text-[11px]">{selectedModel.limitations}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
