import React, { useState } from 'react';
import {
  Sliders,
  Shield,
  Heart,
  Activity,
  Wind,
  Droplet,
  Bell,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Info,
} from 'lucide-react';
import { HealthRule, SeverityLevel } from '../types';

interface HealthRulesViewProps {
  rules: HealthRule[];
  onToggleRule: (id: string, enabled: boolean) => void;
  onUpdateRule: (id: string, updates: Partial<HealthRule>) => void;
}

export const HealthRulesView: React.FC<HealthRulesViewProps> = ({
  rules,
  onToggleRule,
  onUpdateRule,
}) => {
  const [selectedRuleId, setSelectedRuleId] = useState<string>(rules[0]?.id || '');
  const selectedRule = rules.find((r) => r.id === selectedRuleId) || rules[0];

  const getMetricIcon = (type: string) => {
    switch (type) {
      case 'HEART_RATE':
        return <Heart className="w-4 h-4 text-rose-500" />;
      case 'BLOOD_PRESSURE':
        return <Activity className="w-4 h-4 text-blue-500" />;
      case 'SPO2':
        return <Wind className="w-4 h-4 text-cyan-500" />;
      case 'BLOOD_GLUCOSE':
        return <Droplet className="w-4 h-4 text-amber-500" />;
      default:
        return <Shield className="w-4 h-4 text-emerald-500" />;
    }
  };

  return (
    <div className="space-y-6" id="health-rules-view">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 mb-1">
            <Sliders className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Clinical Guardrails & Custom Alert Logic
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Health Monitoring Rules
          </h2>
          <p className="text-xs text-slate-500 max-w-xl mt-1">
            Fine-tune thresholds, time windows, and escalation channels for each vital parameter according to medical recommendations.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/60 px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-800">
          <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Clinical baseline checks active</span>
        </div>
      </div>

      {/* Main Grid: Left Rules List, Right Rule Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rules Sidebar List */}
        <div className="space-y-2 lg:col-span-1">
          <span className="text-xs font-bold uppercase text-slate-400 tracking-wider block px-1">
            Configured Rules ({rules.length})
          </span>
          <div className="space-y-2">
            {rules.map((rule) => {
              const isSelected = rule.id === selectedRuleId;
              return (
                <div
                  key={rule.id}
                  onClick={() => setSelectedRuleId(rule.id)}
                  className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/40 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
                      {getMetricIcon(rule.metricType)}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">
                        {rule.title}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {rule.severity} • Window: {rule.durationSeconds / 60}m
                      </span>
                    </div>
                  </div>

                  <input
                    type="checkbox"
                    checked={rule.enabled}
                    onChange={(e) => {
                      e.stopPropagation();
                      onToggleRule(rule.id, e.target.checked);
                    }}
                    className="rounded text-emerald-600 w-4 h-4"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Rule Inspector / Editor */}
        {selectedRule && (
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
                    {getMetricIcon(selectedRule.metricType)}
                  </span>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      {selectedRule.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {selectedRule.description}
                    </p>
                  </div>
                </div>
              </div>

              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  selectedRule.enabled
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {selectedRule.enabled ? 'Rule Active' : 'Rule Inactive'}
              </span>
            </div>

            {/* Threshold Parameters */}
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedRule.threshold.max !== undefined && (
                  <div>
                    <label className="font-semibold block mb-1">
                      Upper Limit ({selectedRule.metricType === 'HEART_RATE' ? 'BPM' : selectedRule.metricType === 'SPO2' ? '%' : 'mg/dL'})
                    </label>
                    <input
                      type="number"
                      value={selectedRule.threshold.max}
                      onChange={(e) =>
                        onUpdateRule(selectedRule.id, {
                          threshold: { ...selectedRule.threshold, max: Number(e.target.value) },
                        })
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold"
                    />
                  </div>
                )}

                {selectedRule.threshold.min !== undefined && (
                  <div>
                    <label className="font-semibold block mb-1">
                      Lower Limit
                    </label>
                    <input
                      type="number"
                      value={selectedRule.threshold.min}
                      onChange={(e) =>
                        onUpdateRule(selectedRule.id, {
                          threshold: { ...selectedRule.threshold, min: Number(e.target.value) },
                        })
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold"
                    />
                  </div>
                )}

                {selectedRule.threshold.systolicMax !== undefined && (
                  <div>
                    <label className="font-semibold block mb-1">
                      Systolic Max (mmHg)
                    </label>
                    <input
                      type="number"
                      value={selectedRule.threshold.systolicMax}
                      onChange={(e) =>
                        onUpdateRule(selectedRule.id, {
                          threshold: { ...selectedRule.threshold, systolicMax: Number(e.target.value) },
                        })
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold"
                    />
                  </div>
                )}

                {selectedRule.threshold.diastolicMax !== undefined && (
                  <div>
                    <label className="font-semibold block mb-1">
                      Diastolic Max (mmHg)
                    </label>
                    <input
                      type="number"
                      value={selectedRule.threshold.diastolicMax}
                      onChange={(e) =>
                        onUpdateRule(selectedRule.id, {
                          threshold: { ...selectedRule.threshold, diastolicMax: Number(e.target.value) },
                        })
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold"
                    />
                  </div>
                )}

                <div>
                  <label className="font-semibold block mb-1">
                    Sustained Window (Seconds)
                  </label>
                  <select
                    value={selectedRule.durationSeconds}
                    onChange={(e) =>
                      onUpdateRule(selectedRule.id, {
                        durationSeconds: Number(e.target.value),
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold"
                  >
                    <option value={0}>Immediate (Single Reading)</option>
                    <option value={300}>5 Minutes Sustained</option>
                    <option value={600}>10 Minutes Sustained</option>
                    <option value={900}>15 Minutes Sustained</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">
                    Alert Severity Level
                  </label>
                  <select
                    value={selectedRule.severity}
                    onChange={(e) =>
                      onUpdateRule(selectedRule.id, {
                        severity: e.target.value as SeverityLevel,
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold"
                  >
                    <option value="WARNING">WARNING (Prompt recheck first)</option>
                    <option value="URGENT">URGENT (Notify family circle)</option>
                    <option value="EMERGENCY">EMERGENCY (Immediate escalation)</option>
                  </select>
                </div>
              </div>

              {/* Clinical Reference Box */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div className="text-slate-600 dark:text-slate-300">
                  <strong className="block text-slate-800 dark:text-slate-200 mb-0.5">
                    Clinical Reference Guideline:
                  </strong>
                  {selectedRule.clinicalReference}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
