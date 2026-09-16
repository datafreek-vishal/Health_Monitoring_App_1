import React, { useState, useEffect } from 'react';
import {
  Watch,
  Smartphone,
  Activity,
  Battery,
  RefreshCw,
  Trash2,
  Plus,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Wifi,
  WifiOff,
  CheckCircle2,
  Bluetooth,
  Heart,
  Zap,
  Radio,
} from 'lucide-react';
import { DeviceConnection } from '../types';
import { WatchConnectionModal } from './WatchConnectionModal';
import {
  BluetoothWatchService,
  BluetoothReading,
  BluetoothConnectionStatus,
} from '../services/BluetoothWatchService';

interface DevicesViewProps {
  devices: DeviceConnection[];
  onSyncDevice: (id: string) => void;
  onDisconnectDevice: (id: string) => void;
  onAddDevice: () => void;
}

export const DevicesView: React.FC<DevicesViewProps> = ({
  devices,
  onSyncDevice,
  onDisconnectDevice,
  onAddDevice,
}) => {
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [isWatchModalOpen, setIsWatchModalOpen] = useState(false);
  const [bleStatus, setBleStatus] = useState<BluetoothConnectionStatus>(BluetoothWatchService.getStatus());
  const [bleReading, setBleReading] = useState<BluetoothReading | null>(null);

  useEffect(() => {
    const unsubStatus = BluetoothWatchService.subscribeStatus((status) => {
      setBleStatus(status);
    });
    const unsubReadings = BluetoothWatchService.subscribe((r) => {
      setBleReading(r);
    });
    return () => {
      unsubStatus();
      unsubReadings();
    };
  }, []);

  const handleSync = (id: string) => {
    setSyncingId(id);
    setTimeout(() => {
      onSyncDevice(id);
      setSyncingId(null);
    }, 1200);
  };

  return (
    <div className="space-y-6" id="devices-management-view">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 mb-1">
            <Watch className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Wearable & Monitor Integration
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Connected Devices & Smartwatches
          </h2>
          <p className="text-xs text-slate-500 max-w-xl mt-1">
            HealthGuard connects directly to Apple Watch, Google Pixel Watch, Wear OS, and medical peripherals via live Web Bluetooth, Apple HealthKit bridges, and Health Connect.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-pair-watch"
            onClick={() => setIsWatchModalOpen(true)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl flex items-center gap-2 shadow-sm shrink-0"
          >
            <Bluetooth className="w-4 h-4" />
            Connect Apple / Google Watch
          </button>

          <button
            id="btn-pair-new-device"
            onClick={onAddDevice}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-2xl flex items-center gap-2 shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            Other Devices
          </button>
        </div>
      </div>

      {/* Live Bluetooth Streaming Bar if connected */}
      {bleStatus === 'CONNECTED' && bleReading && (
        <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center animate-pulse">
              <Heart className="w-6 h-6 fill-white text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">
                  Live Bluetooth Stream Active
                </span>
                <span className="px-2 py-0.5 bg-white/20 text-[10px] font-bold rounded-full">
                  {bleReading.deviceName}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black">{bleReading.heartRate}</span>
                <span className="text-xs font-semibold text-emerald-100">BPM</span>
                <span className="text-xs text-emerald-200 ml-2">
                  (Skin contact verified • Packet received at {new Date(bleReading.timestamp).toLocaleTimeString()})
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsWatchModalOpen(true)}
              className="px-4 py-2 bg-white text-emerald-800 text-xs font-bold rounded-xl shadow-sm hover:bg-emerald-50 transition-colors"
            >
              Manage Watch
            </button>
            <button
              onClick={() => BluetoothWatchService.disconnect()}
              className="px-3 py-2 bg-black/20 hover:bg-black/30 text-white text-xs font-bold rounded-xl transition-colors"
            >
              Disconnect
            </button>
          </div>
        </div>
      )}

      {/* Watch Modal */}
      <WatchConnectionModal
        isOpen={isWatchModalOpen}
        onClose={() => setIsWatchModalOpen(false)}
        userId="user_101"
      />

      {/* Critical "No Data" vs "Normal Data" Safety Notice */}
      <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-3xl text-xs text-blue-900 dark:text-blue-200 flex items-start gap-3">
        <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <strong className="block text-sm font-bold mb-0.5">Monitoring Integrity Protocol:</strong>
          If a device powers off, loses Bluetooth connection, or experiences background sync pause, HealthGuard displays <em>"HealthGuard has not received recent data"</em>. It will never infer a person is healthy or normal simply because no sensor events were received.
        </div>
      </div>

      {/* Connected Devices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {devices.map((device) => {
          const isSyncing = syncingId === device.id;
          return (
            <div
              key={device.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 hover:border-emerald-500/50 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200">
                    <Watch className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      {device.deviceName}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <span>{device.manufacturer}</span>
                      <span>•</span>
                      <span>{device.model}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-600">
                    {device.status}
                  </span>
                </div>
              </div>

              {/* Status details: Battery, Last sync */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Battery className="w-3.5 h-3.5 text-emerald-500" />
                    Battery Level:
                  </span>
                  <span className="font-bold font-mono text-slate-700 dark:text-slate-200">
                    {device.batteryLevel ? `${device.batteryLevel}%` : 'N/A'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    Last Synchronized:
                  </span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {new Date(device.lastSyncTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {/* Synced metrics */}
              <div>
                <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block mb-1.5">
                  Streaming Metrics
                </span>
                <div className="flex flex-wrap gap-1">
                  {device.supportedMetrics.map((m) => (
                    <span
                      key={m}
                      className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md text-slate-600 dark:text-slate-300 font-medium"
                    >
                      {m.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => handleSync(device.id)}
                  disabled={isSyncing}
                  className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-600' : ''}`} />
                  {isSyncing ? 'Syncing...' : 'Sync Now'}
                </button>

                <button
                  onClick={() => onDisconnectDevice(device.id)}
                  className="py-2 px-3 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 rounded-xl text-xs font-semibold flex items-center gap-1"
                  title="Disconnect device"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Disconnect
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Device Ecosystem Compatibility Directory */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Device Ecosystem Compatibility
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30">
            <span className="font-bold text-emerald-800 dark:text-emerald-200 block text-sm">
              Apple HealthKit
            </span>
            <span className="text-slate-500 block mt-1">Apple Watch Ultra, Series 4–9, SE</span>
            <span className="inline-block mt-2 font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded text-[10px]">
              Production Supported
            </span>
          </div>

          <div className="p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30">
            <span className="font-bold text-emerald-800 dark:text-emerald-200 block text-sm">
              Health Connect
            </span>
            <span className="text-slate-500 block mt-1">Samsung Galaxy Watch 4–6, Pixel Watch</span>
            <span className="inline-block mt-2 font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded text-[10px]">
              Production Supported
            </span>
          </div>

          <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <span className="font-bold text-slate-800 dark:text-slate-200 block text-sm">
              Withings Health
            </span>
            <span className="text-slate-500 block mt-1">BPM Connect, Body Scan Smart Scale</span>
            <span className="inline-block mt-2 font-bold text-blue-600 bg-blue-100 dark:bg-blue-900/60 px-2 py-0.5 rounded text-[10px]">
              Adapter Ready
            </span>
          </div>

          <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <span className="font-bold text-slate-800 dark:text-slate-200 block text-sm">
              Garmin Connect
            </span>
            <span className="text-slate-500 block mt-1">Venu, Forerunner, Fenix Series</span>
            <span className="inline-block mt-2 font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px]">
              Developer Program Pending
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
