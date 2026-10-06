import React, { useState } from 'react';
import {
  Heart,
  Activity,
  Wind,
  Droplet,
  Moon,
  Footprints,
  Watch,
  Plus,
  Share2,
  AlertOctagon,
  Clock,
  Phone,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  Bluetooth,
  User,
  Flame,
  MapPin,
} from 'lucide-react';
import { HealthStatusBadge } from './HealthStatusBadge';
import { EmergencySOSButton } from './EmergencySOSButton';
import { MetricChart } from './MetricChart';
import { HealthGuardState, MetricType, BloodPressureValue, HealthReading } from '../types';

interface MainDashboardProps {
  state: HealthGuardState;
  isElderlyMode: boolean;
  onToggleElderlyMode: () => void;
  onTriggerSOS: () => void;
  onOpenMetricChart: (metric: MetricType) => void;
  onOpenHealthcareFinder: () => void;
  onOpenAddReadingModal: () => void;
  onOpenSimulator: () => void;
  onViewFamilyPortal: () => void;
  onOpenWatchModal?: () => void;
  onOpenProfileModal?: () => void;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({
  state,
  isElderlyMode,
  onToggleElderlyMode,
  onTriggerSOS,
  onOpenMetricChart,
  onOpenHealthcareFinder,
  onOpenAddReadingModal,
  onOpenSimulator,
  onViewFamilyPortal,
  onOpenWatchModal,
  onOpenProfileModal,
}) => {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('HEART_RATE');

  // Find latest readings
  const hrReading = state.readings.find((r) => r.metricType === 'HEART_RATE');
  const bpReading = state.readings.find((r) => r.metricType === 'BLOOD_PRESSURE');
  const spo2Reading = state.readings.find((r) => r.metricType === 'SPO2');
  const glucoseReading = state.readings.find((r) => r.metricType === 'BLOOD_GLUCOSE');
  const sleepReading = state.readings.find((r) => r.metricType === 'SLEEP');
  const stepsReading = state.readings.find((r) => r.metricType === 'STEPS');

  // Derived activity values
  const currentSteps = stepsReading ? Number(stepsReading.value) : 6842;
  const distanceKm = (currentSteps * 0.00078).toFixed(2);
  const activeCalories = Math.round(currentSteps * 0.042);

  const bpValue = bpReading
    ? (bpReading.value as BloodPressureValue)
    : { systolic: 124, diastolic: 78 };
  const primaryContact = state.trustedContacts[0];

  return (
    <div className="space-y-6" id="main-dashboard-content">
      {/* Top Banner: Status, Greetings, Quick SOS */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <HealthStatusBadge
                severity={state.activeAlert ? state.activeAlert.severity : 'NORMAL'}
                size="md"
              />
              <span className="text-xs text-slate-400 font-mono">
                Continuous Monitor Active
              </span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className={`font-black tracking-tight text-slate-900 dark:text-white ${isElderlyMode ? 'text-3xl' : 'text-2xl'}`}>
                Hello, {state.user.fullName}
              </h1>
              {onOpenProfileModal && (
                <button
                  id="btn-open-profile-edit"
                  onClick={onOpenProfileModal}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl flex items-center gap-1 transition-colors"
                  title="Edit profile & medical parameters"
                >
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  Edit Profile
                </button>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Biometric baselines active. {state.devices.length} verified devices synchronized with zero latency.
            </p>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            {onOpenWatchModal && (
              <button
                id="btn-quick-connect-watch"
                onClick={onOpenWatchModal}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Bluetooth className="w-4 h-4" />
                Connect Watch
              </button>
            )}

            <button
              id="btn-quick-add-reading"
              onClick={onOpenAddReadingModal}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-2xl flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Log Manual Reading
            </button>

            <button
              onClick={() => alert(`Status summary shared with ${primaryContact.name} (+91 98450 12345)`)}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-2xl flex items-center gap-1.5 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share Status
            </button>

            <EmergencySOSButton
              onTriggerSOS={onTriggerSOS}
              size={isElderlyMode ? 'lg' : 'md'}
            />
          </div>
        </div>
      </div>

      {/* ACTIVE EMERGENCY NOTIFICATION BANNER (if an alert is triggered) */}
      {state.activeAlert && (
        <div className="p-5 bg-rose-500 text-white rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <AlertOctagon className="w-8 h-8 animate-pulse text-white shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-rose-700 px-2.5 py-0.5 rounded-full">
                {state.activeAlert.severity} ALERT IN PROGRESS
              </span>
              <h3 className="text-lg font-black mt-0.5">
                {state.activeAlert.eventType}
              </h3>
              <p className="text-xs text-rose-100">
                Health Circle contacts notified at {new Date(state.activeAlert.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onViewFamilyPortal}
              className="px-4 py-2 bg-white text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-black shadow"
            >
              Open Family Coordinator Portal
            </button>
            <button
              onClick={onOpenHealthcareFinder}
              className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold"
            >
              Nearby ER (108)
            </button>
          </div>
        </div>
      )}

      {/* Daily Fitness & Activity Metrics Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-blue-950/30 p-5 rounded-3xl border border-emerald-200/50 dark:border-emerald-800/40">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
            <Footprints className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] uppercase font-bold text-slate-400 block tracking-wider">
              Today's Steps
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {currentSteps.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400">/ 10,000 goal</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3.5 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 pt-3 md:pt-0 md:pl-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shrink-0">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] uppercase font-bold text-slate-400 block tracking-wider">
              Distance Covered
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {distanceKm}
              </span>
              <span className="text-xs text-slate-400">km</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3.5 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 pt-3 md:pt-0 md:pl-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] uppercase font-bold text-slate-400 block tracking-wider">
              Active Energy Expended
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {activeCalories}
              </span>
              <span className="text-xs text-slate-400">kcal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Vitals Grid (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Heart Rate Card */}
        <div
          onClick={() => {
            setSelectedMetric('HEART_RATE');
            onOpenMetricChart('HEART_RATE');
          }}
          className={`p-5 bg-white dark:bg-slate-900 rounded-3xl border cursor-pointer transition-all hover:border-emerald-500 shadow-sm ${
            selectedMetric === 'HEART_RATE' ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200 dark:border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between text-rose-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Pulse / Heart Rate
            </span>
            <div className="p-2 bg-rose-50 dark:bg-rose-950/40 rounded-xl">
              <Heart className="w-5 h-5 fill-rose-500" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`font-black text-slate-900 dark:text-white ${isElderlyMode ? 'text-4xl' : 'text-3xl'}`}>
              {hrReading ? String(hrReading.value) : '74'}
            </span>
            <span className="text-xs font-semibold text-slate-500">BPM</span>
          </div>
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              Normal (Resting: 68)
            </span>
            <span className="text-slate-400 text-[11px]">Apple Watch</span>
          </div>
        </div>

        {/* Blood Pressure Card */}
        <div
          onClick={() => {
            setSelectedMetric('BLOOD_PRESSURE');
            onOpenMetricChart('BLOOD_PRESSURE');
          }}
          className={`p-5 bg-white dark:bg-slate-900 rounded-3xl border cursor-pointer transition-all hover:border-emerald-500 shadow-sm ${
            selectedMetric === 'BLOOD_PRESSURE' ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200 dark:border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between text-blue-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Blood Pressure
            </span>
            <div className="p-2 bg-blue-50 dark:bg-blue-950/40 rounded-xl">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`font-black text-slate-900 dark:text-white ${isElderlyMode ? 'text-3xl' : 'text-3xl'}`}>
              {bpValue.systolic}/{bpValue.diastolic}
            </span>
            <span className="text-xs font-semibold text-slate-500">mmHg</span>
          </div>
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="text-blue-600 dark:text-blue-400 font-semibold">
              Prehypertension (Stage 1 Rule)
            </span>
            <span className="text-slate-400 text-[11px]">Withings BPM</span>
          </div>
        </div>

        {/* Oxygen Saturation Card */}
        <div
          onClick={() => {
            setSelectedMetric('SPO2');
            onOpenMetricChart('SPO2');
          }}
          className={`p-5 bg-white dark:bg-slate-900 rounded-3xl border cursor-pointer transition-all hover:border-emerald-500 shadow-sm ${
            selectedMetric === 'SPO2' ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200 dark:border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between text-cyan-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Blood Oxygen (SpO2)
            </span>
            <div className="p-2 bg-cyan-50 dark:bg-cyan-950/40 rounded-xl">
              <Wind className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`font-black text-slate-900 dark:text-white ${isElderlyMode ? 'text-4xl' : 'text-3xl'}`}>
              {spo2Reading ? String(spo2Reading.value) : '98'}%
            </span>
            <span className="text-xs font-semibold text-slate-500">Normal</span>
          </div>
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              Adequate &gt; 95%
            </span>
            <span className="text-slate-400 text-[11px]">5m ago</span>
          </div>
        </div>

        {/* Blood Glucose Card */}
        <div
          onClick={() => {
            setSelectedMetric('BLOOD_GLUCOSE');
            onOpenMetricChart('BLOOD_GLUCOSE');
          }}
          className={`p-5 bg-white dark:bg-slate-900 rounded-3xl border cursor-pointer transition-all hover:border-emerald-500 shadow-sm ${
            selectedMetric === 'BLOOD_GLUCOSE' ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200 dark:border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between text-amber-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Blood Glucose
            </span>
            <div className="p-2 bg-amber-50 dark:bg-amber-950/40 rounded-xl">
              <Droplet className="w-5 h-5 fill-amber-500" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`font-black text-slate-900 dark:text-white ${isElderlyMode ? 'text-4xl' : 'text-3xl'}`}>
              {glucoseReading ? String(glucoseReading.value) : '108'}
            </span>
            <span className="text-xs font-semibold text-slate-500">mg/dL</span>
          </div>
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              Fasting Normal
            </span>
            <span className="text-slate-400 text-[11px]">Health Connect</span>
          </div>
        </div>
      </div>

      {/* Embedded High-Resolution Metric Trend Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MetricChart
            metricType={selectedMetric}
            title={selectedMetric.replace('_', ' ')}
            unit={
              selectedMetric === 'HEART_RATE'
                ? 'BPM'
                : selectedMetric === 'BLOOD_PRESSURE'
                ? 'mmHg'
                : selectedMetric === 'SPO2'
                ? '%'
                : 'mg/dL'
            }
            currentReading={state.readings.find((r) => r.metricType === selectedMetric)}
            targetRange={{
              max: selectedMetric === 'HEART_RATE' ? 100 : selectedMetric === 'SPO2' ? 100 : 140,
              min: selectedMetric === 'HEART_RATE' ? 60 : selectedMetric === 'SPO2' ? 95 : 70,
            }}
          />
        </div>

        {/* Quick Emergency Contacts & Device Status Sidebar */}
        <div className="space-y-4">
          {/* Health Circle Quick Panel */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Emergency Contacts
              </h3>
              <span className="text-[11px] font-bold text-emerald-600">
                {state.trustedContacts.length} Enrolled
              </span>
            </div>

            <div className="space-y-2">
              {state.trustedContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {contact.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {contact.relationship} • {contact.priority}
                    </span>
                  </div>

                  <a
                    href={`tel:${contact.phone}`}
                    className="p-2 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-xl"
                    title={`Call ${contact.name}`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Connected Device Health Status */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Wearables Active
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="space-y-2 text-xs">
              {state.devices.map((d) => (
                <div key={d.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Watch className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="font-bold block text-slate-800 dark:text-slate-200">
                        {d.deviceName}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Battery: {d.batteryLevel}%
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    Synced 2m ago
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
