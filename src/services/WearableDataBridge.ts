/**
 * HEALTHGUARD - Wearable Data Bridge
 * Handles real-time ingestion from Web Bluetooth, Apple HealthKit exports/webhooks,
 * and Google Health Connect / Fit payloads.
 */

import { MockDataStore } from './MockDataStore';
import { HealthMonitoringRuleEngine } from './HealthMonitoringRuleEngine';
import { HealthDataQualityEngine } from './HealthDataQualityEngine';
import { BluetoothWatchService, BluetoothReading } from './BluetoothWatchService';
import { HealthReading, DeviceConnection, MetricType } from '../types';

export class WearableDataBridge {
  private static isInitialized = false;

  /**
   * Initializes the bridge to listen for real Web Bluetooth watch packets
   */
  public static init() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    BluetoothWatchService.subscribe((reading: BluetoothReading) => {
      this.handleIncomingWatchReading(reading);
    });
  }

  /**
   * Ingests a live Bluetooth packet from an Apple Watch or Google Pixel Watch
   */
  public static handleIncomingWatchReading(ble: BluetoothReading) {
    const state = MockDataStore.getState();
    const userId = state.user.userId;
    const deviceName = ble.deviceName || 'Connected Watch';

    // 1. Create normalized HealthReading
    const reading: HealthReading = {
      id: 'rd_ble_' + Date.now(),
      userId,
      metricType: 'HEART_RATE',
      value: ble.heartRate,
      unit: 'BPM',
      timestamp: ble.timestamp,
      source: `Live BLE: ${deviceName}`,
      deviceId: 'dev_live_ble_watch',
      deviceManufacturer: deviceName.toLowerCase().includes('apple')
        ? 'Apple Inc.'
        : deviceName.toLowerCase().includes('pixel')
        ? 'Google LLC'
        : deviceName.toLowerCase().includes('galaxy')
        ? 'Samsung'
        : 'Bluetooth SIG HRM',
      measurementType: 'CONTINUOUS',
      dataQuality: 'GOOD',
      plausibilityFlag: true,
      confidenceScore: ble.contactDetected !== false ? 0.98 : 0.75,
      createdAt: ble.timestamp,
    };

    // 2. Push reading to Store
    MockDataStore.addReading(reading);

    // 3. Update device entry in Store
    const existingIndex = state.devices.findIndex((d) => d.id === 'dev_live_ble_watch');
    const updatedDevice: DeviceConnection = {
      id: 'dev_live_ble_watch',
      userId,
      deviceName,
      manufacturer: reading.deviceManufacturer,
      model: 'Bluetooth Standard HRM',
      connectionType: deviceName.toLowerCase().includes('apple')
        ? 'APPLE_HEALTH'
        : deviceName.toLowerCase().includes('pixel')
        ? 'HEALTH_CONNECT'
        : 'BLUETOOTH',
      batteryLevel: ble.batteryLevel || 85,
      isConnected: true,
      lastSyncTime: ble.timestamp,
      supportedMetrics: ['HEART_RATE', 'HRV'],
      status: 'CONNECTED',
      icon: 'watch',
    };

    if (existingIndex >= 0) {
      MockDataStore.updateState((prev) => ({
        ...prev,
        devices: prev.devices.map((d) => (d.id === 'dev_live_ble_watch' ? updatedDevice : d)),
      }));
    } else {
      MockDataStore.updateState((prev) => ({
        ...prev,
        devices: [updatedDevice, ...prev.devices],
      }));
    }

    // 4. Run safety rule evaluation for immediate response
    const updatedState = MockDataStore.getState();
    const alert = HealthMonitoringRuleEngine.evaluateAllRules(
      reading,
      updatedState.rules,
      updatedState.readings,
      userId,
      state.user.fullName
    );

    if (alert && (!state.activeAlert || state.activeAlert.severity !== 'EMERGENCY')) {
      MockDataStore.setActiveAlert(alert);
    }
  }

  /**
   * Parse Apple Health Export XML string (from export.xml in Apple Health export zip)
   */
  public static parseAppleHealthXml(xmlString: string, userId: string): HealthReading[] {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    const records = xmlDoc.getElementsByTagName('Record');
    const parsedReadings: HealthReading[] = [];

    const maxRecords = Math.min(records.length, 150); // Parse up to 150 recent records
    for (let i = 0; i < maxRecords; i++) {
      const record = records[i];
      const type = record.getAttribute('type') || '';
      const valueStr = record.getAttribute('value') || '';
      const unit = record.getAttribute('unit') || '';
      const startDate = record.getAttribute('startDate') || new Date().toISOString();
      const sourceName = record.getAttribute('sourceName') || 'Apple Watch';

      let metricType: MetricType | null = null;
      let rawVal: any = parseFloat(valueStr);

      if (type.includes('HeartRate')) {
        metricType = 'HEART_RATE';
      } else if (type.includes('OxygenSaturation')) {
        metricType = 'SPO2';
        rawVal = Math.round(parseFloat(valueStr) * 100); // often 0.98 -> 98%
      } else if (type.includes('StepCount')) {
        metricType = 'STEPS';
      } else if (type.includes('BloodGlucose')) {
        metricType = 'BLOOD_GLUCOSE';
      } else if (type.includes('BodyTemperature')) {
        metricType = 'TEMPERATURE';
      }

      if (metricType && !isNaN(rawVal)) {
        parsedReadings.push({
          id: 'apple_' + Math.random().toString(36).substring(2, 9),
          userId,
          metricType,
          value: rawVal,
          unit: unit || (metricType === 'HEART_RATE' ? 'BPM' : metricType === 'SPO2' ? '%' : 'units'),
          timestamp: startDate,
          source: `Apple HealthKit (${sourceName})`,
          deviceId: 'dev_apple_healthkit',
          deviceManufacturer: 'Apple Inc.',
          measurementType: 'AUTOMATIC',
          dataQuality: 'GOOD',
          plausibilityFlag: true,
          confidenceScore: 0.95,
          createdAt: startDate,
        });
      }
    }

    return parsedReadings;
  }

  /**
   * Parse Health Auto Export JSON (standard iOS HealthKit auto-export schema)
   * or Google Health Connect export format
   */
  public static parseWearableJson(jsonObj: any, userId: string): HealthReading[] {
    const readings: HealthReading[] = [];

    // Format 1: Health Auto Export (iOS standard)
    if (jsonObj?.data?.metrics || jsonObj?.metrics) {
      const metricsList = jsonObj?.data?.metrics || jsonObj?.metrics;
      if (Array.isArray(metricsList)) {
        for (const metric of metricsList) {
          const name = (metric.name || '').toLowerCase();
          const units = metric.units || '';
          const dataPoints = metric.data || [];

          for (const point of dataPoints.slice(-20)) {
            let mType: MetricType | null = null;
            let val: any = point.qty ?? point.value;

            if (name.includes('heart') || name.includes('pulse')) {
              mType = 'HEART_RATE';
            } else if (name.includes('oxygen') || name.includes('spo2')) {
              mType = 'SPO2';
              if (val <= 1) val = Math.round(val * 100);
            } else if (name.includes('step')) {
              mType = 'STEPS';
            } else if (name.includes('glucose')) {
              mType = 'BLOOD_GLUCOSE';
            }

            if (mType && val !== undefined) {
              readings.push({
                id: 'wearable_json_' + Math.random().toString(36).substring(2, 9),
                userId,
                metricType: mType,
                value: Number(val),
                unit: units || (mType === 'HEART_RATE' ? 'BPM' : '%'),
                timestamp: point.date || new Date().toISOString(),
                source: 'Apple HealthKit / Health Auto Export',
                deviceId: 'dev_apple_watch',
                deviceManufacturer: 'Apple Inc.',
                measurementType: 'AUTOMATIC',
                dataQuality: 'GOOD',
                plausibilityFlag: true,
                confidenceScore: 0.95,
                createdAt: point.date || new Date().toISOString(),
              });
            }
          }
        }
      }
    }

    // Format 2: Google Health Connect / REST format
    if (Array.isArray(jsonObj?.records) || Array.isArray(jsonObj?.readings)) {
      const records = jsonObj?.records || jsonObj?.readings;
      for (const rec of records) {
        if (rec.metricType && rec.value !== undefined) {
          readings.push({
            id: 'hc_' + Math.random().toString(36).substring(2, 9),
            userId,
            metricType: rec.metricType,
            value: rec.value,
            unit: rec.unit || 'units',
            timestamp: rec.timestamp || new Date().toISOString(),
            source: rec.source || 'Google Health Connect (Pixel Watch)',
            deviceId: 'dev_pixel_watch',
            deviceManufacturer: 'Google LLC',
            measurementType: 'AUTOMATIC',
            dataQuality: 'GOOD',
            plausibilityFlag: true,
            confidenceScore: 0.95,
            createdAt: rec.timestamp || new Date().toISOString(),
          });
        }
      }
    }

    return readings;
  }
}

// Auto-initialize listener
WearableDataBridge.init();
