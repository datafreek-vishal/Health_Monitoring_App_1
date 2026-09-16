import React, { useState } from 'react';
import {
  Home,
  Activity,
  Bell,
  Users,
  User,
  AlertOctagon,
  BatteryCharging,
  Wifi,
  Signal,
  Clock,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Heart,
  Droplet,
  Wind,
  Plus,
} from 'lucide-react';
import { HealthStatusBadge } from './HealthStatusBadge';
import { EmergencySOSButton } from './EmergencySOSButton';
import { HealthGuardState, MetricType } from '../types';

interface MobileSimulatorViewProps {
  state: HealthGuardState;
  onTriggerSOS: () => void;
  onOpenMetricDetails: (metric: MetricType) => void;
  onOpenHealthcareFinder: () => void;
  onOpenPrivacyCenter: () => void;
  onOpenDevices: () => void;
}

export const MobileSimulatorView: React.FC<MobileSimulatorViewProps> = ({
  state,
  onTriggerSOS,
  onOpenMetricDetails,
  onOpenHealthcareFinder,
  onOpenPrivacyCenter,
  onOpenDevices,
}) => {
  const [mobileTab, setMobileTab] = useState<'home' | 'health' | 'alerts' | 'circle' | 'profile'>('home');
  const [isElderlyMode, setIsElderlyMode] = useState(state.user.emergencyPreferences.elderlyHighContrastMode);

  const activeDevice = state.devices.find((d) => d.isConnected) || state.devices[0];

  return (
    <div className="flex justify-center items-center py-6 px-2">
      {/* Mobile Device Mockup Frame */}
      <div className="w-full max-w-[390px] h-[780px] bg-slate-900 border-[8px] border-slate-800 rounded-[50px] shadow-2xl overflow-hidden flex flex-col relative select-none">
        {/* Dynamic Island / Top Speaker Bar */}
        <div className="w-full bg-slate-900 text-white px-7 pt-3 pb-2 flex items-center justify-between z-20">
          <span className="text-xs font-semibold font-mono">09:41</span>
          <div className="w-24 h-5 bg-black rounded-full flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <BatteryCharging className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        {/* Elderly Mode Quick Pill in Mobile App */}
        <div className="bg-slate-800/80 px-4 py-1.5 flex items-center justify-between text-[11px] text-slate-300 border-b border-slate-700/50">
          <span>{isElderlyMode ? 'High Contrast Mode: Active' : 'Standard Mobile Shell'}</span>
          <button
            onClick={() => setIsElderlyMode(!isElderlyMode)}
            className="text-emerald-400 font-bold hover:underline"
          >
            {isElderlyMode ? 'Standard UI' : 'Senior UI'}
          </button>
        </div>

        {/* Scrollable View Content */}
        <div className="flex-1 bg-slate-50 dark:bg-slate-950 overflow-y-auto p-4 space-y-4 text-slate-900 dark:text-white">
          {/* TAB 1: HOME */}
          {mobileTab === 'home' && (
            <div className="space-y-4">
              {/* Header Greeting */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 block">
                    Good afternoon,
                  </span>
                  <h2 className={`font-black tracking-tight ${isElderlyMode ? 'text-2xl' : 'text-xl'}`}>
                    {state.user.fullName}
                  </h2>
                </div>
                <HealthStatusBadge
                  severity={state.activeAlert ? state.activeAlert.severity : 'NORMAL'}
                  size="sm"
                  showLabelPrefix={false}
                />
              </div>

              {/* Connected Device Status Pill */}
              {activeDevice && (
                <div
                  onClick={onOpenDevices}
                  className="bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs cursor-pointer shadow-sm hover:border-emerald-500"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-bold">{activeDevice.deviceName}</span>
                  </div>
                  <span className="text-slate-400 text-[10px]">
                    Battery: {activeDevice.batteryLevel}% • Synced 2m ago
                  </span>
                </div>
              )}

              {/* Quick Metrics Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                {/* Heart Rate */}
                <div
                  onClick={() => onOpenMetricDetails('HEART_RATE')}
                  className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-emerald-500 transition-colors"
                >
                  <div className="flex items-center justify-between text-rose-600 mb-1">
                    <Heart className="w-4 h-4 fill-rose-500" />
                    <span className="text-[10px] text-slate-400 font-mono">BPM</span>
                  </div>
                  <div className={`font-black ${isElderlyMode ? 'text-3xl' : 'text-2xl'}`}>
                    74
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    Heart Rate • Stable
                  </div>
                </div>

                {/* Blood Pressure */}
                <div
                  onClick={() => onOpenMetricDetails('BLOOD_PRESSURE')}
                  className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-emerald-500 transition-colors"
                >
                  <div className="flex items-center justify-between text-blue-600 mb-1">
                    <Activity className="w-4 h-4" />
                    <span className="text-[10px] text-slate-400 font-mono">mmHg</span>
                  </div>
                  <div className={`font-black ${isElderlyMode ? 'text-2xl' : 'text-xl'}`}>
                    124/78
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    Blood Pressure
                  </div>
                </div>

                {/* SpO2 */}
                <div
                  onClick={() => onOpenMetricDetails('SPO2')}
                  className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-emerald-500 transition-colors"
                >
                  <div className="flex items-center justify-between text-cyan-600 mb-1">
                    <Wind className="w-4 h-4" />
                    <span className="text-[10px] text-slate-400 font-mono">%</span>
                  </div>
                  <div className={`font-black ${isElderlyMode ? 'text-3xl' : 'text-2xl'}`}>
                    98%
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    Oxygen Saturation
                  </div>
                </div>

                {/* Glucose */}
                <div
                  onClick={() => onOpenMetricDetails('BLOOD_GLUCOSE')}
                  className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-emerald-500 transition-colors"
                >
                  <div className="flex items-center justify-between text-amber-600 mb-1">
                    <Droplet className="w-4 h-4 fill-amber-500" />
                    <span className="text-[10px] text-slate-400 font-mono">mg/dL</span>
                  </div>
                  <div className={`font-black ${isElderlyMode ? 'text-3xl' : 'text-2xl'}`}>
                    108
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    Blood Glucose
                  </div>
                </div>
              </div>

              {/* SOS Banner in Mobile View */}
              <div className="p-4 bg-rose-50 dark:bg-rose-950/40 rounded-3xl border border-rose-200 dark:border-rose-900 text-center space-y-2">
                <span className="text-xs font-bold text-rose-700 dark:text-rose-300 block">
                  Family Emergency Safety
                </span>
                <button
                  onClick={onTriggerSOS}
                  className="w-full py-3.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-2xl shadow-md flex items-center justify-center gap-2 text-sm"
                >
                  <AlertOctagon className="w-5 h-5 animate-pulse" />
                  EMERGENCY SOS
                </button>
                <span className="text-[10px] text-slate-500 block">
                  Notifies Aditya, Priya & Sunita with temporary location.
                </span>
              </div>

              {/* Find Nearby Care Quick Button */}
              <button
                onClick={onOpenHealthcareFinder}
                className="w-full py-3 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-between shadow-sm"
              >
                <span>Find Nearby Hospitals & Trauma (108)</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          )}

          {/* TAB 2: HEALTH METRICS */}
          {mobileTab === 'health' && (
            <div className="space-y-3">
              <h3 className="text-lg font-bold">Health History & Trends</h3>
              <p className="text-xs text-slate-500">
                Normalized biometric streams. Tap any metric to inspect trends and quality parameters.
              </p>
              {(['HEART_RATE', 'BLOOD_PRESSURE', 'SPO2', 'BLOOD_GLUCOSE', 'TEMPERATURE', 'SLEEP'] as MetricType[]).map((m) => (
                <div
                  key={m}
                  onClick={() => onOpenMetricDetails(m)}
                  className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between cursor-pointer hover:border-emerald-500 shadow-sm"
                >
                  <div>
                    <span className="text-xs font-bold block">{m.replace('_', ' ')}</span>
                    <span className="text-[10px] text-slate-400">Quality: Good • Source: Health Connect</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: ALERTS */}
          {mobileTab === 'alerts' && (
            <div className="space-y-3">
              <h3 className="text-lg font-bold">Alert & Event Log</h3>
              {state.activeAlert ? (
                <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 rounded-2xl space-y-1">
                  <span className="text-xs font-bold text-amber-800 dark:text-amber-200">
                    ACTIVE ALERT
                  </span>
                  <div className="font-extrabold text-sm">{state.activeAlert.eventType}</div>
                  <span className="text-xs text-slate-500 block">
                    Triggered at {new Date(state.activeAlert.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              ) : (
                <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
                  <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto mb-1" />
                  No active health alerts. Monitoring normal.
                </div>
              )}

              <span className="text-xs font-bold uppercase text-slate-400 tracking-wider block pt-2">
                Historic Timeline
              </span>
              {state.alertHistory.map((h) => (
                <div key={h.id} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                  <div className="font-bold">{h.eventType}</div>
                  <div className="text-slate-500 text-[10px] mt-0.5">
                    {new Date(h.createdAt).toLocaleDateString()} • Resolved by {h.resolvedBy || 'User'}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: CIRCLE */}
          {mobileTab === 'circle' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Health Circle</h3>
                <span className="text-xs text-emerald-600 font-bold">3 Members</span>
              </div>
              <p className="text-xs text-slate-500">
                Authorized family contacts who receive notifications when safety rules trigger.
              </p>
              {state.trustedContacts.map((c) => (
                <div key={c.id} className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs">
                      {c.name[0]}
                    </div>
                    <div>
                      <span className="text-xs font-bold block">{c.name}</span>
                      <span className="text-[10px] text-slate-400">{c.relationship} • {c.priority}</span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: PROFILE */}
          {mobileTab === 'profile' && (
            <div className="space-y-3">
              <h3 className="text-lg font-bold">My Profile & Security</h3>
              <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                <div className="font-bold text-sm">{state.user.fullName}</div>
                <div className="text-slate-500">{state.user.email}</div>
                <div className="text-slate-500">{state.user.phone} • {state.user.city}, {state.user.country}</div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={onOpenPrivacyCenter}
                  className="w-full p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-left flex items-center justify-between"
                >
                  <span>Privacy Center & Consents</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
                <button
                  onClick={onOpenDevices}
                  className="w-full p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-left flex items-center justify-between"
                >
                  <span>Connected Wearables</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation Bar */}
        <div className="w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-3 py-2 flex items-center justify-around z-20">
          <button
            onClick={() => setMobileTab('home')}
            className={`flex flex-col items-center gap-0.5 ${
              mobileTab === 'home' ? 'text-emerald-600' : 'text-slate-400'
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="text-[10px] font-semibold">Home</span>
          </button>

          <button
            onClick={() => setMobileTab('health')}
            className={`flex flex-col items-center gap-0.5 ${
              mobileTab === 'health' ? 'text-emerald-600' : 'text-slate-400'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span className="text-[10px] font-semibold">Health</span>
          </button>

          <button
            onClick={() => setMobileTab('alerts')}
            className={`flex flex-col items-center gap-0.5 relative ${
              mobileTab === 'alerts' ? 'text-emerald-600' : 'text-slate-400'
            }`}
          >
            <Bell className="w-4 h-4" />
            {state.activeAlert && (
              <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-0 right-1" />
            )}
            <span className="text-[10px] font-semibold">Alerts</span>
          </button>

          <button
            onClick={() => setMobileTab('circle')}
            className={`flex flex-col items-center gap-0.5 ${
              mobileTab === 'circle' ? 'text-emerald-600' : 'text-slate-400'
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="text-[10px] font-semibold">Circle</span>
          </button>

          <button
            onClick={() => setMobileTab('profile')}
            className={`flex flex-col items-center gap-0.5 ${
              mobileTab === 'profile' ? 'text-emerald-600' : 'text-slate-400'
            }`}
          >
            <User className="w-4 h-4" />
            <span className="text-[10px] font-semibold">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};
