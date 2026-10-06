import React, { useState } from 'react';
import {
  Watch,
  Smartphone,
  Activity,
  Heart,
  Wind,
  Droplet,
  Scale,
  Plus,
  CheckCircle2,
  X,
  Search,
  Bluetooth,
  Wifi,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { DeviceConnection } from '../types';

interface AddDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeviceAdded: (device: DeviceConnection) => void;
  onOpenBluetoothWatch: () => void;
}

interface DeviceCatalogItem {
  name: string;
  manufacturer: string;
  model: string;
  type: 'watch' | 'activity' | 'smartphone';
  connectionType: 'APPLE_HEALTH' | 'HEALTH_CONNECT' | 'BLUETOOTH_LE' | 'WITHINGS' | 'MANUAL';
  supportedMetrics: ('HEART_RATE' | 'BLOOD_PRESSURE' | 'SPO2' | 'BLOOD_GLUCOSE' | 'WEIGHT' | 'STEPS')[];
  description: string;
  icon: any;
}

const CATALOG: DeviceCatalogItem[] = [
  {
    name: 'Noise Rep Fitness Band / Smartwatch',
    manufacturer: 'Noise (Nexxbase Technologies)',
    model: 'Noise Rep Active Band',
    type: 'watch',
    connectionType: 'BLUETOOTH_LE',
    supportedMetrics: ['HEART_RATE', 'SPO2', 'STEPS'],
    description: 'Noise Health Suite with 24/7 Optical HR, Blood Oxygen (SpO2) and Step Counter via standard BLE GATT.',
    icon: Watch,
  },
  {
    name: 'Apple Watch Series 10 / Ultra 2',
    manufacturer: 'Apple Inc.',
    model: 'Apple Watch Series 10',
    type: 'watch',
    connectionType: 'APPLE_HEALTH',
    supportedMetrics: ['HEART_RATE', 'SPO2', 'STEPS'],
    description: 'ECG, irregular rhythm notifications, continuous heart rate and step counter.',
    icon: Watch,
  },
  {
    name: 'Google Pixel Watch 3 / Wear OS 5',
    manufacturer: 'Google LLC',
    model: 'Pixel Watch 3',
    type: 'watch',
    connectionType: 'HEALTH_CONNECT',
    supportedMetrics: ['HEART_RATE', 'SPO2', 'STEPS'],
    description: 'Health Connect integration with real-time target heart rate zones and sleep stages.',
    icon: Watch,
  },
  {
    name: 'Samsung Galaxy Watch 7 / Ultra',
    manufacturer: 'Samsung Electronics',
    model: 'Galaxy Watch 7',
    type: 'watch',
    connectionType: 'HEALTH_CONNECT',
    supportedMetrics: ['HEART_RATE', 'BLOOD_PRESSURE', 'STEPS'],
    description: 'BioActive sensor for pulse, body composition and sleep monitoring.',
    icon: Watch,
  },
  {
    name: 'Withings BPM Connect',
    manufacturer: 'Withings',
    model: 'BPM-05 Smart Cuff',
    type: 'activity',
    connectionType: 'WITHINGS',
    supportedMetrics: ['BLOOD_PRESSURE', 'HEART_RATE'],
    description: 'Medically accurate cellular/Wi-Fi connected blood pressure monitor.',
    icon: Activity,
  },
  {
    name: 'Omron Evolv Wireless Upper Arm BP',
    manufacturer: 'Omron Healthcare',
    model: 'BP7000',
    type: 'activity',
    connectionType: 'BLUETOOTH_LE',
    supportedMetrics: ['BLOOD_PRESSURE', 'HEART_RATE'],
    description: 'Bluetooth Smart cuff with clinically validated oscillometric readings.',
    icon: Activity,
  },
  {
    name: 'FreeStyle Libre 3 Plus CGM',
    manufacturer: 'Abbott Laboratories',
    model: 'Libre 3 Continuous Sensor',
    type: 'activity',
    connectionType: 'HEALTH_CONNECT',
    supportedMetrics: ['BLOOD_GLUCOSE'],
    description: 'Minute-by-minute real-time glucose stream without fingersticks.',
    icon: Droplet,
  },
  {
    name: 'Wellue Pulse Oximeter Clip (BLE)',
    manufacturer: 'Viatom / Wellue',
    model: 'OxySmart PC-60FW',
    type: 'activity',
    connectionType: 'BLUETOOTH_LE',
    supportedMetrics: ['SPO2', 'HEART_RATE'],
    description: 'Continuous SpO2 and pulse measurement with perfusion index.',
    icon: Wind,
  },
];

export const AddDeviceModal: React.FC<AddDeviceModalProps> = ({
  isOpen,
  onClose,
  onDeviceAdded,
  onOpenBluetoothWatch,
}) => {
  const [search, setSearch] = useState('');
  const [selectedDevice, setSelectedDevice] = useState<DeviceCatalogItem | null>(null);
  const [isPairing, setIsPairing] = useState(false);
  const [pairedSuccess, setPairedSuccess] = useState(false);

  if (!isOpen) return null;

  const filtered = CATALOG.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.manufacturer.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  const handlePair = (item: DeviceCatalogItem) => {
    setSelectedDevice(item);
    setIsPairing(true);

    setTimeout(() => {
      const newDev: DeviceConnection = {
        id: 'dev_' + Math.random().toString(36).substring(2, 9),
        userId: 'user_101',
        deviceName: item.name,
        manufacturer: item.manufacturer,
        model: item.model,
        connectionType: item.connectionType,
        batteryLevel: Math.floor(75 + Math.random() * 24),
        isConnected: true,
        lastSyncTime: new Date().toISOString(),
        supportedMetrics: item.supportedMetrics,
        status: 'CONNECTED',
        icon: item.type,
      };

      onDeviceAdded(newDev);
      setIsPairing(false);
      setPairedSuccess(true);

      setTimeout(() => {
        setPairedSuccess(false);
        setSelectedDevice(null);
        onClose();
      }, 1000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Connect New Health Device
              </h3>
              <p className="text-xs text-slate-500">
                Pair verified fitness wearables, blood pressure cuffs & sensors
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Web Bluetooth Direct Action */}
        <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider block opacity-90">
              Live Web Bluetooth (BLE)
            </span>
            <span className="text-sm font-black block">
              Direct Watch & Heart Rate Monitor Pairing
            </span>
            <p className="text-[11px] opacity-80 mt-0.5">
              Scan for nearby standard GATT Heart Rate Monitors & Wear OS / Apple devices.
            </p>
          </div>
          <button
            onClick={() => {
              onClose();
              onOpenBluetoothWatch();
            }}
            className="px-3.5 py-2 bg-white text-blue-700 text-xs font-bold rounded-xl shadow-sm hover:bg-blue-50 transition-colors shrink-0 flex items-center gap-1.5"
          >
            <Bluetooth className="w-3.5 h-3.5" />
            Scan BLE
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search Apple, Pixel Watch, Omron, Withings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Pairing feedback */}
        {isPairing && selectedDevice && (
          <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-2xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin shrink-0" />
            <div>
              <h5 className="font-bold text-xs text-blue-900 dark:text-blue-100">
                Pairing with {selectedDevice.name}...
              </h5>
              <p className="text-[11px] text-blue-700 dark:text-blue-300">
                Negotiating secure key exchange and reading battery level.
              </p>
            </div>
          </div>
        )}

        {pairedSuccess && selectedDevice && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-2xl flex items-center gap-3">
            <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
            <div>
              <h5 className="font-bold text-xs text-emerald-900 dark:text-emerald-100">
                {selectedDevice.name} Connected!
              </h5>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                Live vitals streaming active and added to your device dashboard.
              </p>
            </div>
          </div>
        )}

        {/* Catalog List */}
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          {filtered.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.name}
                className="p-3.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-3 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-sm shrink-0">
                    <Icon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                      {item.name}
                    </h4>
                    <span className="text-[10px] text-slate-500 block">
                      {item.manufacturer} • {item.connectionType.replace('_', ' ')}
                    </span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-1">
                      {item.description}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handlePair(item)}
                  disabled={isPairing}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-white text-xs font-bold rounded-xl shrink-0 transition-colors"
                >
                  Pair
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
