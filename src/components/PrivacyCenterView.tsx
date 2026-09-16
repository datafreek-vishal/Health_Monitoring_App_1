import React, { useState } from 'react';
import {
  Lock,
  Shield,
  FileCheck,
  Download,
  Trash2,
  Eye,
  RotateCcw,
  CheckCircle2,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { ConsentRecord, AuditLog } from '../types';

interface PrivacyCenterViewProps {
  consents: ConsentRecord[];
  auditLogs: AuditLog[];
  onRevokeConsent: (id: string) => void;
  onGrantConsent: (id: string) => void;
  onDownloadData: () => void;
}

export const PrivacyCenterView: React.FC<PrivacyCenterViewProps> = ({
  consents,
  auditLogs,
  onRevokeConsent,
  onGrantConsent,
  onDownloadData,
}) => {
  const [activeTab, setActiveTab] = useState<'CONSENTS' | 'AUDIT' | 'POLICIES'>('CONSENTS');

  return (
    <div className="space-y-6" id="privacy-center-view">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 mb-1">
            <Lock className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Privacy-by-Design & India DPDP / HIPAA Compliance
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Privacy Center & Consent Management
          </h2>
          <p className="text-xs text-slate-500 max-w-xl mt-1">
            You maintain absolute sovereignty over your physiological data and location telemetry. Inspect active permissions, verify cryptographic audit logs, or export your complete records.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            id="btn-download-my-data"
            onClick={onDownloadData}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-2xl flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download My Data (JSON)
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab('CONSENTS')}
          className={`pb-3 transition-all ${
            activeTab === 'CONSENTS'
              ? 'border-b-2 border-emerald-600 text-emerald-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Active Consents ({consents.length})
        </button>
        <button
          onClick={() => setActiveTab('AUDIT')}
          className={`pb-3 transition-all ${
            activeTab === 'AUDIT'
              ? 'border-b-2 border-emerald-600 text-emerald-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Security Audit Trail ({auditLogs.length})
        </button>
        <button
          onClick={() => setActiveTab('POLICIES')}
          className={`pb-3 transition-all ${
            activeTab === 'POLICIES'
              ? 'border-b-2 border-emerald-600 text-emerald-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Data Retention & Safeguards
        </button>
      </div>

      {/* TAB 1: CONSENTS */}
      {activeTab === 'CONSENTS' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {consents.map((cs) => {
              const isActive = cs.status === 'ACTIVE';
              return (
                <div
                  key={cs.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500">
                        {cs.consentType} • {cs.version}
                      </span>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm mt-1">
                        {cs.purpose}
                      </h4>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {cs.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500">
                    <span className="font-semibold block text-slate-600 dark:text-slate-400">
                      Authorized Data Categories:
                    </span>
                    <span>{cs.dataCategories.join(', ')}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <span className="text-[11px] text-slate-400">
                      Granted on: {new Date(cs.acceptedAt).toLocaleDateString()}
                    </span>
                    {isActive ? (
                      <button
                        onClick={() => onRevokeConsent(cs.id)}
                        className="text-rose-600 hover:underline font-bold text-xs"
                      >
                        Revoke Consent
                      </button>
                    ) : (
                      <button
                        onClick={() => onGrantConsent(cs.id)}
                        className="text-emerald-600 hover:underline font-bold text-xs"
                      >
                        Re-enable Consent
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: AUDIT LOGS */}
      {activeTab === 'AUDIT' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Cryptographic Audit Log
            </h3>
            <span className="text-xs text-slate-400">
              Immutable append-only record
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase">
                <tr>
                  <th className="pb-2">Timestamp</th>
                  <th className="pb-2">Actor & Role</th>
                  <th className="pb-2">Action</th>
                  <th className="pb-2">Target</th>
                  <th className="pb-2">Rationale</th>
                  <th className="pb-2 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 font-mono text-slate-500">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-2.5 font-medium text-slate-800 dark:text-slate-200">
                      {log.actorId} ({log.actorRole})
                    </td>
                    <td className="py-2.5">
                      <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono text-[10px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-600 dark:text-slate-300">
                      {log.target}
                    </td>
                    <td className="py-2.5 text-slate-500">
                      {log.why}
                    </td>
                    <td className="py-2.5 text-right font-bold text-emerald-600">
                      {log.result}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: DATA RETENTION & SAFEGUARDS */}
      {activeTab === 'POLICIES' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Retention Policies & Regulatory Compliance
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800">
              <strong className="block text-slate-900 dark:text-white text-sm mb-1">
                Emergency Location Telemetry
              </strong>
              <p>
                Retained only during active emergency events for a maximum validity window of <strong>30 minutes</strong>. Cryptographically purged immediately upon alert resolution.
              </p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800">
              <strong className="block text-slate-900 dark:text-white text-sm mb-1">
                Raw Sensor Signals
              </strong>
              <p>
                Raw high-frequency wearable packets are retained for 30 days, after which they are condensed into hourly and daily statistical trend summaries.
              </p>
            </div>
          </div>
          <div className="p-4 bg-rose-50 dark:bg-rose-950/30 rounded-2xl border border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200 flex items-center justify-between">
            <div>
              <strong className="block text-sm font-bold">Right to Erasure (Delete Account)</strong>
              <span>Permanently remove your health profile, device tokens, and contact associations.</span>
            </div>
            <button
              onClick={() => alert('Account deletion flow initiates a 7-day grace period under DPDP regulations.')}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shrink-0"
            >
              Request Account Deletion
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
