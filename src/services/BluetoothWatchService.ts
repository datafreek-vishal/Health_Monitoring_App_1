/**
 * HEALTHGUARD - Real Web Bluetooth (BLE) Standardized Watch Connection Service
 * Connects directly to Apple Watch (via BLE broadcast apps like HeartCast / BlueHeart),
 * Google Pixel Watch, Samsung Galaxy Watch (Wear OS), and standard Bluetooth Smartwatches & HR Monitors.
 *
 * Implements Bluetooth SIG Standard Heart Rate Profile:
 * - Service: 0x180D (Heart Rate)
 * - Characteristic: 0x2A37 (Heart Rate Measurement)
 * - Service: 0x180F (Battery Service)
 * - Characteristic: 0x2A19 (Battery Level)
 */

import { MockDataStore } from './MockDataStore';

export interface BluetoothReading {
  heartRate: number;
  contactDetected?: boolean;
  energyExpended?: number;
  rrIntervals?: number[];
  batteryLevel?: number;
  timestamp: string;
  deviceName: string;
}

export type BluetoothConnectionStatus =
  | 'DISCONNECTED'
  | 'SCANNING'
  | 'CONNECTING'
  | 'CONNECTED'
  | 'ERROR';

export type BluetoothListener = (reading: BluetoothReading) => void;
export type StatusListener = (status: BluetoothConnectionStatus, error?: string) => void;

export class BluetoothWatchService {
  private static device: any = null;
  private static server: any = null;
  private static hrCharacteristic: any = null;
  private static batteryCharacteristic: any = null;
  private static status: BluetoothConnectionStatus = 'DISCONNECTED';
  private static lastError: string | null = null;
  private static listeners: Set<BluetoothListener> = new Set();
  private static statusListeners: Set<StatusListener> = new Set();
  private static lastKnownBattery: number | undefined = undefined;

  /**
   * Check if Web Bluetooth API is supported by the current browser environment
   */
  public static isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'bluetooth' in navigator;
  }

  public static getStatus(): BluetoothConnectionStatus {
    return this.status;
  }

  public static getLastError(): string | null {
    return this.lastError;
  }

  public static getConnectedDeviceName(): string | null {
    return this.device?.name || null;
  }

  public static subscribe(listener: BluetoothListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public static subscribeStatus(listener: StatusListener): () => void {
    this.statusListeners.add(listener);
    listener(this.status, this.lastError || undefined);
    return () => {
      this.statusListeners.delete(listener);
    };
  }

  private static setStatus(status: BluetoothConnectionStatus, error?: string) {
    this.status = status;
    this.lastError = error || null;
    this.statusListeners.forEach((l) => l(status, error));
  }

  /**
   * Triggers native browser Bluetooth pairing popup for smartwatches
   */
  public static async connectWatch(): Promise<boolean> {
    if (!this.isSupported()) {
      const err =
        'Web Bluetooth API is not supported in this browser. Please use Google Chrome, Microsoft Edge, or Opera on desktop/Android.';
      this.setStatus('ERROR', err);
      throw new Error(err);
    }

    try {
      this.setStatus('SCANNING');

      // Request device with standard Bluetooth SIG Heart Rate Service, Noise fitness band filters, and battery/device info
      const bluetooth = (navigator as any).bluetooth;
      const device = await bluetooth.requestDevice({
        filters: [
          { services: ['heart_rate'] },
          { services: [0x180D] },
          { namePrefix: 'Noise' },
          { namePrefix: 'ColorFit' },
          { namePrefix: 'Pulse' },
          { namePrefix: 'Band' },
        ],
        optionalServices: ['heart_rate', 'battery_service', 'device_information', 0x180D, 0x180F, 0x180A],
      });

      if (!device) {
        this.setStatus('DISCONNECTED');
        return false;
      }

      this.device = device;
      this.setStatus('CONNECTING');

      // Handle spontaneous disconnect
      device.addEventListener('gattserverdisconnected', () => {
        console.warn('[BLE] Watch GATT server disconnected.');
        this.device = null;
        this.server = null;
        this.hrCharacteristic = null;
        this.batteryCharacteristic = null;
        this.setStatus('DISCONNECTED');
      });

      // Connect to GATT Server
      const server = await device.gatt.connect();
      this.server = server;

      // Connect to Primary Heart Rate Service (0x180D)
      const hrService = await server.getPrimaryService('heart_rate');
      const hrChar = await hrService.getCharacteristic('heart_rate_measurement');
      this.hrCharacteristic = hrChar;

      // Start real-time notifications
      await hrChar.startNotifications();
      hrChar.addEventListener('characteristicvaluechanged', (event: any) => {
        this.handleHeartRateData(event.target.value);
      });

      // Attempt to read battery service if available (optional)
      try {
        const batteryService = await server.getPrimaryService('battery_service');
        const batteryChar = await batteryService.getCharacteristic('battery_level');
        this.batteryCharacteristic = batteryChar;
        const batteryVal = await batteryChar.readValue();
        this.lastKnownBattery = batteryVal.getUint8(0);

        // Listen for battery changes
        await batteryChar.startNotifications();
        batteryChar.addEventListener('characteristicvaluechanged', (event: any) => {
          this.lastKnownBattery = event.target.value.getUint8(0);
        });
      } catch (battErr) {
        console.log('[BLE] Battery service not exposed by watch (optional).', battErr);
      }

      this.setStatus('CONNECTED');

      // Sync device entry in MockDataStore
      const devName = device.name || 'Bluetooth Smartwatch';
      MockDataStore.addDevice({
        id: 'dev_ble_' + (device.id || 'current'),
        userId: MockDataStore.getState().user.userId,
        deviceName: devName,
        manufacturer: 'Bluetooth SIG (GATT)',
        model: 'BLE Standard HR Profile (0x180D)',
        connectionType: 'BLUETOOTH_LE',
        batteryLevel: this.lastKnownBattery ?? 90,
        isConnected: true,
        lastSyncTime: new Date().toISOString(),
        supportedMetrics: ['HEART_RATE', 'BATTERY', 'HRV'],
        status: 'CONNECTED',
        icon: 'watch',
      });

      return true;
    } catch (err: any) {
      console.error('[BLE] Watch connection error:', err);
      let message = err.message || 'Failed to connect to Bluetooth watch.';
      if (err.name === 'NotFoundError' || message.includes('User cancelled')) {
        message = 'Bluetooth pairing cancelled by user.';
        this.setStatus('DISCONNECTED');
      } else if (err.name === 'SecurityError') {
        message = 'Bluetooth access blocked. If running inside an embedded frame, please open in a new browser tab.';
        this.setStatus('ERROR', message);
      } else {
        this.setStatus('ERROR', message);
      }
      return false;
    }
  }

  /**
   * Parses standard Bluetooth SIG Heart Rate Measurement (0x2A37) DataView
   */
  private static handleHeartRateData(value: DataView) {
    if (!value || value.byteLength === 0) return;

    const flags = value.getUint8(0);
    const is16Bit = (flags & 0x1) !== 0;
    let index = 1;

    // Heart Rate Value
    let heartRate: number;
    if (is16Bit) {
      heartRate = value.getUint16(index, true);
      index += 2;
    } else {
      heartRate = value.getUint8(index);
      index += 1;
    }

    // Sensor contact
    const contactSensorSupported = (flags & 0x4) !== 0;
    const contactDetected = contactSensorSupported ? (flags & 0x2) !== 0 : true;

    // Energy expended
    let energyExpended: number | undefined;
    if ((flags & 0x8) !== 0) {
      energyExpended = value.getUint16(index, true);
      index += 2;
    }

    // RR-Intervals (for HRV)
    const rrIntervals: number[] = [];
    if ((flags & 0x10) !== 0) {
      while (index + 1 < value.byteLength) {
        const rawRR = value.getUint16(index, true);
        // RR interval is in 1/1024 seconds, convert to ms
        rrIntervals.push(Math.round((rawRR / 1024) * 1000));
        index += 2;
      }
    }

    const reading: BluetoothReading = {
      heartRate,
      contactDetected,
      energyExpended,
      rrIntervals: rrIntervals.length > 0 ? rrIntervals : undefined,
      batteryLevel: this.lastKnownBattery,
      timestamp: new Date().toISOString(),
      deviceName: this.device?.name || 'Bluetooth Smartwatch',
    };

    // Dispatch to subscribers
    this.listeners.forEach((listener) => {
      try {
        listener(reading);
      } catch (listenerErr) {
        console.error('[BLE] Error in listener:', listenerErr);
      }
    });
  }

  /**
   * Disconnects current watch
   */
  public static async disconnect(): Promise<void> {
    if (this.device && this.device.gatt.connected) {
      try {
        await this.device.gatt.disconnect();
      } catch (err) {
        console.warn('[BLE] Disconnect error:', err);
      }
    }
    this.device = null;
    this.server = null;
    this.hrCharacteristic = null;
    this.batteryCharacteristic = null;
    this.setStatus('DISCONNECTED');
  }
}
