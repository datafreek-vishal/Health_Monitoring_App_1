import React, { useState, useEffect, useRef } from 'react';
import {
  Watch,
  Bluetooth,
  Activity,
  Heart,
  Smartphone,
  Upload,
  CheckCircle2,
  AlertTriangle,
  X,
  RefreshCw,
  Zap,
  Radio,
  FileCode,
  Copy,
  Check,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import {
  BluetoothWatchService,
  BluetoothReading,
  BluetoothConnectionStatus,
} from '../services/BluetoothWatchService';
import { WearableDataBridge } from '../services/WearableDataBridge';
import { MockDataStore } from '../services/MockDataStore';

interface WatchConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export const WatchConnectionModal: React.FC<WatchConnectionModalProps> = ({
  isOpen,
  onClose,
  userId,
}) => {
  const [activeTab, setActiveTab] = useState<'BLUETOOTH' | 'APPLE_HEALTH' | 'GOOGLE_WATCH' | 'WEBHOOK'>('BLUETOOTH');
  const [bleStatus, setBleStatus] = useState<BluetoothConnectionStatus>(BluetoothWatchService.getStatus());
  const [bleError, setBleError] = useState<string | null>(BluetoothWatchService.getLastError());
  const [latestBleReading, setLatestBleReading] = useState<BluetoothReading | null>(null);
  const [isSimulatingLiveStream, setIsSimulatingLiveStream] = useState(false);
  const simIntervalRef = useRef<any>(null);

  // File upload state
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [importedCount, setImportedCount] = useState<number | null>(null);
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  const isBluetoothSupported = BluetoothWatchService.isSupported();

  // Subscribe to Bluetooth updates
  useEffect(() => {
    const unsubStatus = BluetoothWatchService.subscribeStatus((status, err) => {
      setBleStatus(status);
      setBleError(err || null);
    });

    const unsubReadings = BluetoothWatchService.subscribe((reading) => {
      setLatestBleReading(reading);
    });

    return () => {
      unsubStatus();
      unsubReadings();
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
    };
  }, []);

  if (!isOpen) return null;

  // Handle Connect Web Bluetooth
  const handleConnectBluetooth = async () => {
    setBleError(null);
    try {
      await BluetoothWatchService.connectWatch();
    } catch (err: any) {
      setBleError(err.message || 'Connection failed.');
    }
  };

  const handleDisconnectBluetooth = async () => {
    await BluetoothWatchService.disconnect();
    setLatestBleReading(null);
  };

  // Toggle Live Stream Simulation
  const handleToggleSimulatedStream = () => {
    if (isSimulatingLiveStream) {
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
      setIsSimulatingLiveStream(false);
    } else {
      setIsSimulatingLiveStream(true);
      simIntervalRef.current = setInterval(() => {
        const simulatedBpm = Math.floor(68 + Math.random() * 18);
        const sample: BluetoothReading = {
          heartRate: simulatedBpm,
          contactDetected: true,
          energyExpended: 320,
          rrIntervals: [Math.round(60000 / simulatedBpm)],
          batteryLevel: 82,
          timestamp: new Date().toISOString(),
          deviceName: 'Apple Watch Series 9 (Broadcast BLE)',
        };
        setLatestBleReading(sample);
        WearableDataBridge.handleIncomingWatchReading(sample);
      }, 1500);
    }
  };

  // Handle File Upload (XML / JSON)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadStatus(`Reading ${file.name}...`);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        let readings: any[] = [];

        if (file.name.endsWith('.xml') || content.trim().startsWith('<?xml') || content.includes('<HealthData')) {
          readings = WearableDataBridge.parseAppleHealthXml(content, userId);
        } else {
          const json = JSON.parse(content);
          readings = WearableDataBridge.parseWearableJson(json, userId);
        }

        if (readings.length > 0) {
          readings.forEach((r) => MockDataStore.addReading(r));
          setImportedCount(readings.length);
          setUploadStatus(`Successfully imported ${readings.length} biometric records from ${file.name}!`);
        } else {
          setUploadStatus('File read, but no compatible Heart Rate or SpO2 records were found.');
        }
      } catch (err: any) {
        setUploadStatus(`Failed to parse file: ${err.message}`);
      }
    };

    reader.readAsText(file);
  };

  // Webhook URL
  const webhookUrl = `${window.location.origin}/api/v1/sync/wearables`;

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  const handleSendTestWebhook = async () => {
    setUploadStatus('Sending test webhook ping...');
    try {
      const payload = {
        source: 'Google Pixel Watch / Health Connect',
        deviceName: 'Pixel Watch 2',
        readings: [
          {
            metricType: 'HEART_RATE',
            value: Math.floor(70 + Math.random() * 15),
            unit: 'BPM',
            timestamp: new Date().toISOString(),
          },
          {
            metricType: 'SPO2',
            value: 98,
            unit: '%',
            timestamp: new Date().toISOString(),
          },
        ],
      };

      const res = await fetch('/api/v1/sync/wearables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        // Also feed into client data store
        const parsed = WearableDataBridge.parseWearableJson(payload, userId);
        parsed.forEach((r) => MockDataStore.addReading(r));
        setUploadStatus('Webhook received! Ingested live readings into HealthGuard.');
      } else {
        setUploadStatus('Webhook responded with status ' + res.status);
      }
    } catch (e: any) {
      setUploadStatus('Webhook error: ' + e.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <Watch className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Connect Smartwatch / Wearable
              </h3>
              <p className="text-xs text-slate-500">
                Live pairing for Apple Watch, Google Pixel Watch, Samsung Galaxy Watch & BLE Monitors
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('BLUETOOTH')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'BLUETOOTH'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Bluetooth className="w-4 h-4 text-blue-500" />
            Live Web Bluetooth (BLE)
          </button>

          <button
            onClick={() => setActiveTab('APPLE_HEALTH')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'APPLE_HEALTH'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Watch className="w-4 h-4 text-emerald-500" />
            Apple Watch
          </button>

          <button
            onClick={() => setActiveTab('GOOGLE_WATCH')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'GOOGLE_WATCH'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4 text-purple-500" />
            Google / Wear OS
          </button>

          <button
            onClick={() => setActiveTab('WEBHOOK')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'WEBHOOK'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Radio className="w-4 h-4 text-amber-500" />
            Live Webhook
          </button>
        </div>

        {/* TAB 1: REAL WEB BLUETOOTH (BLE) */}
        {activeTab === 'BLUETOOTH' && (
          <div className="space-y-4">
            {/* Status Card */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    bleStatus === 'CONNECTED' || isSimulatingLiveStream
                      ? 'bg-emerald-500 animate-ping'
                      : bleStatus === 'SCANNING' || bleStatus === 'CONNECTING'
                      ? 'bg-amber-500 animate-pulse'
                      : 'bg-slate-400'
                  }`} />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    Bluetooth State: {isSimulatingLiveStream ? 'STREAMING (LIVE SIMULATOR)' : bleStatus}
                  </span>
                </div>

                {isBluetoothSupported ? (
                  <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Web Bluetooth Ready
                  </span>
                ) : (
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Browser Not Supported
                  </span>
                )}
              </div>

              {/* Live Streaming Pulse Display */}
              {(bleStatus === 'CONNECTED' || isSimulatingLiveStream) && latestBleReading && (
                <div className="p-4 bg-emerald-500 text-white rounded-2xl flex items-center justify-between shadow-lg animate-in zoom-in-95">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-600/60 rounded-xl animate-pulse">
                      <Heart className="w-7 h-7 fill-white" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-100">
                        {latestBleReading.deviceName}
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black">{latestBleReading.heartRate}</span>
                        <span className="text-xs font-semibold text-emerald-100">BPM</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right text-xs text-emerald-100">
                    <div>Skin Contact: <strong className="text-white">Detected</strong></div>
                    <div>Synced: {new Date(latestBleReading.timestamp).toLocaleTimeString()}</div>
                  </div>
                </div>
              )}

              {/* Error Alert */}
              {bleError && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{bleError}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-1">
                {bleStatus === 'CONNECTED' ? (
                  <button
                    onClick={handleDisconnectBluetooth}
                    className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Disconnect Watch
                  </button>
                ) : (
                  <button
                    onClick={handleConnectBluetooth}
                    disabled={bleStatus === 'SCANNING' || bleStatus === 'CONNECTING'}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <Bluetooth className="w-4 h-4" />
                    {bleStatus === 'SCANNING' ? 'Opening Bluetooth Pairing...' : 'Pair Live Watch via Bluetooth'}
                  </button>
                )}

                <button
                  onClick={handleToggleSimulatedStream}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    isSimulatingLiveStream
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200'
                  }`}
                  title="Stream simulated Bluetooth packets to test dashboard and emergency rules"
                >
                  <Zap className="w-3.5 h-3.5" />
                  {isSimulatingLiveStream ? 'Stop Live Test Stream' : 'Simulate Live Watch Stream'}
                </button>
              </div>
            </div>

            {/* Practical Guidance */}
            <div className="text-xs text-slate-500 space-y-2">
              <div className="font-bold text-slate-700 dark:text-slate-300">
                How this real connection works:
              </div>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Noise Rep Fitness Band & Smartwatches</strong>: Ensure your Noise Rep Band has Bluetooth enabled and isn't locked by the NoiseFit app. Tap <strong>Pair Live Watch via Bluetooth</strong> to pair directly via GATT Heart Rate Service (0x180D).
                </li>
                <li>
                  <strong>Google Pixel Watch & Samsung Galaxy Watch</strong>: Enable Bluetooth Heart Rate broadcast in your watch settings or Wear OS fitness app, then click "Pair Live Watch".
                </li>
                <li>
                  <strong>Apple Watch</strong>: Install a free Bluetooth broadcast app (like <em>HeartCast</em> or <em>BlueHeart</em>) on your Apple Watch. Tap "Start Broadcast" on your wrist, then click "Pair Live Watch".
                </li>
                <li>
                  <strong>Standard Smartwatches & Chest Straps</strong>: Any Polar, Garmin, Wahoo, Noise, or Amazfit device broadcasting the standard Bluetooth SIG Heart Rate Service (0x180D) pairs directly!
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 2: APPLE WATCH SPECIFIC */}
        {activeTab === 'APPLE_HEALTH' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl space-y-2">
              <div className="font-bold text-emerald-900 dark:text-emerald-200 text-sm flex items-center gap-2">
                <Watch className="w-4 h-4 text-emerald-600" />
                Apple Watch & Apple Health Direct Bridges
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                Apple HealthKit uses strict sandboxing on iOS. HealthGuard provides three production-grade methods to sync your real Apple Watch biometrics:
              </p>
            </div>

            {/* Method A: Live Broadcast */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="font-bold text-slate-900 dark:text-white block text-sm">
                Method 1: Live Real-Time Streaming (Recommended)
              </span>
              <p className="text-slate-500">
                Use the free <strong>HeartCast</strong> or <strong>BlueHeart</strong> app on your Apple Watch. It broadcasts your pulse via Bluetooth GATT, allowing HealthGuard to receive every heartbeat live in your browser!
              </p>
              <button
                onClick={() => setActiveTab('BLUETOOTH')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5"
              >
                <Bluetooth className="w-3.5 h-3.5" />
                Switch to Live Bluetooth Pairing
              </button>
            </div>

            {/* Method B: Instant Export Upload */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <span className="font-bold text-slate-900 dark:text-white block text-sm">
                Method 2: Import Apple Health Export (XML or JSON)
              </span>
              <p className="text-slate-500">
                Export your health data from your iPhone (Health App &gt; Profile &gt; Export All Health Data) or Health Auto Export app, then drag and drop the file here to import real historical records.
              </p>

              <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/20 transition-all">
                <Upload className="w-6 h-6 text-slate-400 mb-1" />
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  Select or drop export.xml / health_data.json
                </span>
                <span className="text-[11px] text-slate-400">Parses Heart Rate, SpO2, Steps, Glucose</span>
                <input
                  type="file"
                  accept=".xml,.json,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {uploadStatus && (
                <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                  {uploadStatus}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: GOOGLE / WEAR OS */}
        {activeTab === 'GOOGLE_WATCH' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-2xl space-y-2">
              <div className="font-bold text-purple-900 dark:text-purple-200 text-sm flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-purple-600" />
                Google Pixel Watch & Samsung Galaxy Watch (Health Connect)
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                Pixel Watch and Galaxy Watch run Wear OS, which syncs seamlessly with Google Health Connect and supports Bluetooth broadcast.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                Pair via Bluetooth Broadcast
              </h4>
              <ol className="list-decimal pl-5 space-y-1.5 text-slate-600 dark:text-slate-300">
                <li>On your Pixel Watch / Galaxy Watch, open your workout or HR Broadcast app.</li>
                <li>Ensure "Broadcast Heart Rate over Bluetooth" is enabled.</li>
                <li>Click the button below to connect the browser to your watch.</li>
              </ol>

              <button
                onClick={() => setActiveTab('BLUETOOTH')}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold flex items-center gap-1.5"
              >
                <Bluetooth className="w-3.5 h-3.5" />
                Open Bluetooth Pairing Dialog
              </button>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                Test Health Connect Ingestion
              </h4>
              <p className="text-slate-500">
                Test sending a real-time biometric packet from Google Health Connect into the HealthGuard engine.
              </p>
              <button
                onClick={handleSendTestWebhook}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 rounded-xl font-bold flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 text-purple-600" />
                Send Test Ingestion Packet (Heart Rate & SpO2)
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: LIVE REST WEBHOOK */}
        {activeTab === 'WEBHOOK' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl space-y-2">
              <div className="font-bold text-amber-900 dark:text-amber-200 text-sm flex items-center gap-2">
                <Radio className="w-4 h-4 text-amber-600" />
                Live Ingestion REST Webhook Endpoint
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                Any third-party app (iOS Shortcuts, Health Auto Export, or Wear OS background service) can POST biometric readings directly to this live endpoint.
              </p>
            </div>

            <div className="space-y-2">
              <label className="font-semibold block text-slate-700 dark:text-slate-300">
                Your HealthGuard Webhook URL
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={webhookUrl}
                  className="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-xs text-slate-900 dark:text-white"
                />
                <button
                  onClick={handleCopyWebhook}
                  className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5"
                >
                  {copiedWebhook ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  {copiedWebhook ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <div>
              <span className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                Example JSON Payload (curl / iOS Shortcut):
              </span>
              <pre className="p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px] overflow-x-auto">
{`curl -X POST "${webhookUrl}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "source": "Apple Watch Ultra",
    "readings": [
      { "metricType": "HEART_RATE", "value": 78, "unit": "BPM" },
      { "metricType": "SPO2", "value": 98, "unit": "%" }
    ]
  }'`}
              </pre>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSendTestWebhook}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                Trigger Live Test Webhook Now
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl font-bold text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
