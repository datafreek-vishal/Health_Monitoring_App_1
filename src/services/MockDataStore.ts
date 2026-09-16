/**
 * HEALTHGUARD - Core Data Store & State Repository
 * Provides persistent local state, seed data, and reactive subscription hooks.
 */

import {
  UserProfile,
  DeviceConnection,
  HealthReading,
  HealthRule,
  EmergencyEvent,
  TrustedContact,
  EmergencyPlan,
  ConsentRecord,
  AuditLog,
} from '../types';
import { HealthMonitoringRuleEngine } from './HealthMonitoringRuleEngine';
import { AuditLogger } from './AuditLogger';

export interface HealthGuardState {
  user: UserProfile;
  devices: DeviceConnection[];
  readings: HealthReading[];
  rules: HealthRule[];
  activeAlert: EmergencyEvent | null;
  alertHistory: EmergencyEvent[];
  trustedContacts: TrustedContact[];
  emergencyPlan: EmergencyPlan;
  consents: ConsentRecord[];
  auditLogs: AuditLog[];
}

const DEFAULT_READINGS: HealthReading[] = [
  {
    id: 'rd_hr_1',
    userId: 'user_101',
    metricType: 'HEART_RATE',
    value: 74,
    unit: 'BPM',
    timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    source: 'Apple Watch Series 9',
    deviceId: 'dev_apple_watch',
    deviceManufacturer: 'Apple Inc.',
    measurementType: 'AUTOMATIC',
    quality: 'GOOD',
    confidence: 0.98,
    createdAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
  },
  {
    id: 'rd_bp_1',
    userId: 'user_101',
    metricType: 'BLOOD_PRESSURE',
    value: { systolic: 124, diastolic: 78 },
    unit: 'mmHg',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    source: 'Withings BPM Connect',
    deviceId: 'dev_withings_bpm',
    deviceManufacturer: 'Withings',
    measurementType: 'MANUAL',
    quality: 'GOOD',
    confidence: 0.95,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: 'rd_spo2_1',
    userId: 'user_101',
    metricType: 'SPO2',
    value: 98,
    unit: '%',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    source: 'Apple Watch Series 9',
    deviceId: 'dev_apple_watch',
    deviceManufacturer: 'Apple Inc.',
    measurementType: 'AUTOMATIC',
    quality: 'GOOD',
    confidence: 0.96,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: 'rd_glu_1',
    userId: 'user_101',
    metricType: 'BLOOD_GLUCOSE',
    value: 108,
    unit: 'mg/dL',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    source: 'Health Connect (Accu-Chek Guide)',
    deviceId: 'dev_health_connect',
    deviceManufacturer: 'Roche',
    measurementType: 'MANUAL',
    quality: 'GOOD',
    confidence: 0.99,
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: 'rd_temp_1',
    userId: 'user_101',
    metricType: 'TEMPERATURE',
    value: 36.7,
    unit: '°C',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    source: 'Apple Watch Series 9',
    deviceId: 'dev_apple_watch',
    deviceManufacturer: 'Apple Inc.',
    measurementType: 'AUTOMATIC',
    quality: 'GOOD',
    confidence: 0.94,
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'rd_steps_1',
    userId: 'user_101',
    metricType: 'STEPS',
    value: 6842,
    unit: 'steps',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    source: 'Apple Health',
    deviceId: 'dev_apple_watch',
    deviceManufacturer: 'Apple Inc.',
    measurementType: 'CONTINUOUS',
    quality: 'GOOD',
    confidence: 0.99,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: 'rd_sleep_1',
    userId: 'user_101',
    metricType: 'SLEEP',
    value: 7.2,
    unit: 'hours',
    timestamp: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    source: 'Health Connect (Sleep As Android)',
    deviceId: 'dev_health_connect',
    deviceManufacturer: 'Google',
    measurementType: 'AUTOMATIC',
    quality: 'GOOD',
    confidence: 0.92,
    createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
  },
];

const INITIAL_STATE: HealthGuardState = {
  user: {
    id: 'prof_101',
    userId: 'user_101',
    fullName: 'Vishal Metri',
    email: 'metrivishal01@gmail.com',
    phone: '+91 98450 12345',
    dateOfBirth: '1964-08-14',
    gender: 'MALE',
    heightCm: 174,
    weightKg: 72,
    country: 'India',
    city: 'Bengaluru',
    state: 'Karnataka',
    emergencyPreferences: {
      autoShareLocationOnEmergency: true,
      autoCallEmergencyServices: false,
      elderlyHighContrastMode: false,
      language: 'en',
      preferredEmergencyNumber: '112',
    },
    healthConditions: ['Mild Essential Hypertension', 'Occasional Seasonal Asthma'],
    createdAt: '2026-01-10T00:00:00.000Z',
    updatedAt: '2026-03-01T00:00:00.000Z',
  },
  devices: [
    {
      id: 'dev_apple_watch',
      userId: 'user_101',
      deviceName: 'Apple Watch Series 9',
      manufacturer: 'Apple Inc.',
      model: 'Watch7,5 (Cellular)',
      connectionType: 'APPLE_HEALTH',
      batteryLevel: 78,
      isConnected: true,
      lastSyncTime: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      supportedMetrics: ['HEART_RATE', 'SPO2', 'ECG', 'HRV', 'STEPS', 'SLEEP', 'FALL_EVENT'],
      status: 'CONNECTED',
      icon: 'watch',
    },
    {
      id: 'dev_withings_bpm',
      userId: 'user_101',
      deviceName: 'Withings BPM Connect',
      manufacturer: 'Withings',
      model: 'BPM-05',
      connectionType: 'WITHINGS',
      batteryLevel: 92,
      isConnected: true,
      lastSyncTime: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      supportedMetrics: ['BLOOD_PRESSURE', 'HEART_RATE'],
      status: 'CONNECTED',
      icon: 'activity',
    },
    {
      id: 'dev_health_connect',
      userId: 'user_101',
      deviceName: 'Android Health Connect Hub',
      manufacturer: 'Google LLC',
      model: 'Health Connect v1.4',
      connectionType: 'HEALTH_CONNECT',
      batteryLevel: 85,
      isConnected: true,
      lastSyncTime: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
      supportedMetrics: ['BLOOD_GLUCOSE', 'WEIGHT', 'SLEEP', 'STEPS'],
      status: 'CONNECTED',
      icon: 'smartphone',
    },
  ],
  readings: DEFAULT_READINGS,
  rules: HealthMonitoringRuleEngine.getDefaultRules(),
  activeAlert: null,
  alertHistory: [
    {
      id: 'evt_historic_1',
      userId: 'user_101',
      userName: 'Vishal Metri',
      eventType: 'Elevated Resting Pulse (128 BPM)',
      severity: 'RESOLVED',
      metric: 'HEART_RATE',
      metricDisplay: '128 BPM',
      source: 'Apple Watch Series 9',
      createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 24 * 3600 * 1000 + 10 * 60 * 1000).toISOString(),
      status: 'RESOLVED',
      resolvedAt: new Date(Date.now() - 24 * 3600 * 1000 + 10 * 60 * 1000).toISOString(),
      resolvedBy: 'Vishal Metri',
      userResponse: 'OK',
      timeline: [
        {
          id: 'h_tl_1',
          timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
          title: 'Elevated Reading Received',
          description: 'Resting pulse of 128 BPM observed after climbing stairs.',
          type: 'READING',
        },
        {
          id: 'h_tl_2',
          timestamp: new Date(Date.now() - 24 * 3600 * 1000 + 2 * 60 * 1000).toISOString(),
          title: 'User Prompted: Recheck Protocol',
          description: 'User instructed to sit quietly for 2 minutes.',
          type: 'RECHECK',
        },
        {
          id: 'h_tl_3',
          timestamp: new Date(Date.now() - 24 * 3600 * 1000 + 5 * 60 * 1000).toISOString(),
          title: "User Confirmed: 'I'm OK'",
          description: 'Pulse settled to 82 BPM. Alert closed gracefully.',
          type: 'RESOLVED',
        },
      ],
    },
  ],
  trustedContacts: [
    {
      id: 'tc_1',
      userId: 'user_101',
      name: 'Aditya Metri',
      relationship: 'Son',
      phone: '+91 98451 98765',
      email: 'aditya.metri@example.com',
      priority: 'Primary',
      notificationChannels: ['PUSH', 'SMS'],
      permissions: {
        emergencyAlerts: true,
        locationAccess: true,
        heartRate: true,
        bloodPressure: true,
        glucose: true,
        fullHealthHistory: false,
      },
      status: 'ACTIVE',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'tc_2',
      userId: 'user_101',
      name: 'Priya Metri',
      relationship: 'Daughter',
      phone: '+91 98452 54321',
      email: 'priya.metri@example.com',
      priority: 'Secondary',
      notificationChannels: ['PUSH', 'SMS'],
      permissions: {
        emergencyAlerts: true,
        locationAccess: true,
        heartRate: true,
        bloodPressure: true,
        glucose: false,
        fullHealthHistory: false,
      },
      status: 'ACTIVE',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'tc_3',
      userId: 'user_101',
      name: 'Sunita Metri',
      relationship: 'Wife',
      phone: '+91 98450 67890',
      email: 'sunita.metri@example.com',
      priority: 'Backup',
      notificationChannels: ['PUSH', 'SMS', 'VOICE'],
      permissions: {
        emergencyAlerts: true,
        locationAccess: true,
        heartRate: true,
        bloodPressure: true,
        glucose: true,
        fullHealthHistory: true,
      },
      status: 'ACTIVE',
      avatarUrl: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=150&auto=format&fit=crop&q=80',
    },
  ],
  emergencyPlan: {
    id: 'eplan_1',
    userId: 'user_101',
    primaryHospital: 'Manipal Hospital – Old Airport Road',
    primaryHospitalPhone: '+91 80 2502 4444',
    preferredDoctor: 'Dr. Arvind Rao (Cardiologist, Fortis)',
    preferredDoctorPhone: '+91 80 4199 4444',
    emergencyContactPhone: '+91 98451 98765',
    bloodGroup: 'B Positive (B+)',
    allergies: ['Penicillin', 'Sulfa Antibiotics'],
    medications: ['Telmisartan 40mg (Daily Morning)', 'Amlodipine 5mg (Daily Night)'],
    medicalConditionsSummary: 'Controlled Hypertension under routine clinical follow-up. No prior coronary events.',
    insuranceProvider: 'Star Health & Allied Insurance',
    insurancePolicyNumber: 'SH-CAR-902148',
    shareWithTrustedContacts: true,
  },
  consents: [
    {
      id: 'cs_1',
      userId: 'user_101',
      consentType: 'HEALTH_DATA_COLLECTION',
      purpose: 'Aggregate vital readings from authorized wearables for trend evaluation.',
      dataCategories: ['Heart Rate', 'Blood Pressure', 'SpO2', 'Glucose'],
      recipient: 'HealthGuard Secure Platform',
      version: 'v2.1',
      acceptedAt: '2026-01-10T10:00:00Z',
      status: 'ACTIVE',
    },
    {
      id: 'cs_2',
      userId: 'user_101',
      consentType: 'LOCATION_EMERGENCY_SHARING',
      purpose: 'Generate 30-minute temporary GPS tokens only when SOS or Urgent escalation occurs.',
      dataCategories: ['Real-time Geolocation', 'Reverse Geocoded Address'],
      recipient: 'Authorized Health Circle Contacts',
      version: 'v1.4',
      acceptedAt: '2026-01-10T10:02:00Z',
      status: 'ACTIVE',
    },
    {
      id: 'cs_3',
      userId: 'user_101',
      consentType: 'FAMILY_DATA_ACCESS',
      purpose: 'Permit designated family members to view monitoring status and emergency alerts.',
      dataCategories: ['Monitoring Status', 'Emergency Alerts', 'Vital Metrics'],
      recipient: 'Designated Health Circle (Son, Daughter, Wife)',
      version: 'v2.0',
      acceptedAt: '2026-01-10T10:05:00Z',
      status: 'ACTIVE',
    },
  ],
  auditLogs: AuditLogger.getLogs(),
};

export class MockDataStore {
  private static state: HealthGuardState = INITIAL_STATE;
  private static listeners: Array<(state: HealthGuardState) => void> = [];

  public static getState(): HealthGuardState {
    return this.state;
  }

  public static updateState(updater: (prev: HealthGuardState) => HealthGuardState) {
    this.state = updater(this.state);
    this.notify();
  }

  public static subscribe(listener: (state: HealthGuardState) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private static notify() {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  public static addReading(reading: HealthReading) {
    this.updateState((prev) => ({
      ...prev,
      readings: [reading, ...prev.readings.filter((r) => r.metricType !== reading.metricType || r.id !== reading.id)],
    }));
  }

  public static setActiveAlert(alert: EmergencyEvent | null) {
    this.updateState((prev) => {
      const history = alert && alert.status === 'RESOLVED'
        ? [alert, ...prev.alertHistory.filter((a) => a.id !== alert.id)]
        : prev.alertHistory;
      return {
        ...prev,
        activeAlert: alert && alert.status !== 'RESOLVED' ? alert : null,
        alertHistory: history,
      };
    });
  }
}
