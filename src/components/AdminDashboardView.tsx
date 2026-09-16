import React, { useState } from 'react';
import {
  Users,
  Watch,
  Bell,
  AlertTriangle,
  Server,
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldAlert,
  Send,
  LifeBuoy,
} from 'lucide-react';
import { HealthGuardState } from '../types';

interface AdminDashboardViewProps {
  state: HealthGuardState;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ state }) => {
  return (
    <div className="space-y-6" id="admin-dashboard-view">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 mb-1">
            <Server className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              HealthGuard Operations & Admin Telemetry
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            System Observability & Incident Console
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-lg">
            Role-Based Access Control enforced. Direct personal health records are blinded to administrative operators according to privacy rules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-emerald-950 border border-emerald-700 text-emerald-300 font-mono text-xs rounded-xl flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            All Gateways Healthy (99.98% uptime)
          </span>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
            Total Users
          </span>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            14,820
          </div>
          <span className="text-xs text-emerald-600 font-semibold">
            +328 active this week
          </span>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
            Active Devices Connected
          </span>
          <div className="text-3xl font-black text-blue-600">
            21,410
          </div>
          <span className="text-xs text-slate-500">
            Apple: 62% • Health Connect: 38%
          </span>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
            Alerts Dispatched Today
          </span>
          <div className="text-3xl font-black text-amber-600">
            42
          </div>
          <span className="text-xs text-slate-500">
            Avg Escalation Latency: 3.2s
          </span>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
            Notification Delivery Rate
          </span>
          <div className="text-3xl font-black text-emerald-600">
            99.6%
          </div>
          <span className="text-xs text-slate-500">
            Primary: Push • Secondary: SMS
          </span>
        </div>
      </div>

      {/* Device Integration Health & System Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Integration Status */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <Watch className="w-5 h-5 text-emerald-600" />
            Device Integration Health
          </h3>
          <div className="space-y-2.5 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-bold block text-slate-800 dark:text-slate-200">
                  Apple HealthKit Bridge (iOS 16+)
                </span>
                <span className="text-slate-400">HKQuantityType observers & background deliveries</span>
              </div>
              <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold rounded-lg">
                Operational
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-bold block text-slate-800 dark:text-slate-200">
                  Android Health Connect API
                </span>
                <span className="text-slate-400">AndroidX HealthConnectClient sync channel</span>
              </div>
              <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold rounded-lg">
                Operational
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-bold block text-slate-800 dark:text-slate-200">
                  Withings Cloud Peripheral Hook
                </span>
                <span className="text-slate-400">OAuth 2.0 Webhook listener</span>
              </div>
              <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold rounded-lg">
                Operational
              </span>
            </div>
          </div>
        </div>

        {/* Support Tickets & Incidents */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <LifeBuoy className="w-5 h-5 text-indigo-600" />
              Active Support Inquiries
            </h3>
            <span className="text-xs text-slate-400 font-mono">2 Open</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl flex items-start justify-between">
              <div>
                <span className="font-bold block text-slate-800 dark:text-slate-200">
                  Ticket #4029: Apple Watch Bluetooth reconnection delay
                </span>
                <span className="text-slate-400">Reported by: user_891 (Bengaluru)</span>
              </div>
              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold">
                In Review
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl flex items-start justify-between">
              <div>
                <span className="font-bold block text-slate-800 dark:text-slate-200">
                  Ticket #4028: Family invitation phone number format (+91)
                </span>
                <span className="text-slate-400">Reported by: user_742 (Mumbai)</span>
              </div>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">
                Resolved
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
