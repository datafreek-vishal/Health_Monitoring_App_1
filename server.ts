/**
 * HEALTHGUARD - REST API & Backend Service Entry Point
 * Implements REST endpoints for Auth, Devices, Health Metrics, Rules, Contacts, Emergency, Location, and Privacy.
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory persistent state representation for backend APIs
const state = {
  user: {
    id: 'user_101',
    fullName: 'Vishal Metri',
    email: 'metrivishal01@gmail.com',
    phone: '+91 98450 12345',
    country: 'India',
    city: 'Bengaluru',
    state: 'Karnataka',
    role: 'PATIENT',
  },
  emergencyPreferences: {
    autoShareLocationOnEmergency: true,
    autoCallEmergencyServices: false,
    language: 'en',
    preferredEmergencyNumber: '112',
  },
  devices: [
    {
      id: 'dev_apple_watch',
      deviceName: 'Apple Watch Series 9',
      manufacturer: 'Apple Inc.',
      connectionType: 'APPLE_HEALTH',
      batteryLevel: 78,
      isConnected: true,
      lastSyncTime: new Date().toISOString(),
      status: 'CONNECTED',
    },
    {
      id: 'dev_withings_bpm',
      deviceName: 'Withings BPM Connect',
      manufacturer: 'Withings',
      connectionType: 'WITHINGS',
      batteryLevel: 92,
      isConnected: true,
      lastSyncTime: new Date().toISOString(),
      status: 'CONNECTED',
    },
  ],
  rules: [
    {
      id: 'rule_hr_high',
      name: 'High Resting Pulse',
      metric: 'HEART_RATE',
      threshold: { max: 120 },
      severity: 'WARNING',
      action: 'PROMPT_RECHECK',
      status: 'ACTIVE',
      version: 'v1.2.0',
    },
    {
      id: 'rule_bp_crisis',
      name: 'Hypertensive Alert Range',
      metric: 'BLOOD_PRESSURE',
      threshold: { systolicMax: 180, diastolicMax: 120 },
      severity: 'URGENT',
      action: 'PROMPT_RECHECK',
      status: 'ACTIVE',
      version: 'v1.4.0',
    },
  ],
  contacts: [
    {
      id: 'tc_1',
      name: 'Aditya Metri',
      relationship: 'Son',
      phone: '+91 98451 98765',
      priority: 'Primary',
      status: 'ACTIVE',
      permissions: { emergencyAlerts: true, locationAccess: true },
    },
    {
      id: 'tc_2',
      name: 'Priya Metri',
      relationship: 'Daughter',
      phone: '+91 98452 54321',
      priority: 'Secondary',
      status: 'ACTIVE',
      permissions: { emergencyAlerts: true, locationAccess: true },
    },
  ],
  emergencyEvents: [] as any[],
  auditLogs: [] as any[],
};

// --- HEALTH & STATUS ---
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'HealthGuard Core Platform',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// --- AUTHENTICATION ---
app.post('/api/v1/auth/register', (req, res) => {
  const { email, phone, fullName } = req.body;
  res.status(201).json({
    message: 'Account created successfully. Please verify OTP.',
    userId: 'user_' + Math.random().toString(36).substring(2, 9),
    email,
    phone,
    mfaRequired: true,
  });
});

app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body;
  res.json({
    token: 'jwt_mock_access_token_secure_hs256',
    refreshToken: 'jwt_mock_refresh_token',
    expiresIn: 3600,
    user: state.user,
  });
});

app.post('/api/v1/auth/mfa/verify', (req, res) => {
  res.json({ verified: true, sessionToken: 'jwt_verified_mfa_token' });
});

// --- USER PROFILE ---
app.get('/api/v1/users/me', (req, res) => {
  res.json({ user: state.user, emergencyPreferences: state.emergencyPreferences });
});

app.patch('/api/v1/users/me', (req, res) => {
  Object.assign(state.user, req.body);
  res.json({ success: true, user: state.user });
});

// --- DEVICES ---
app.get('/api/v1/devices', (req, res) => {
  res.json({ devices: state.devices });
});

app.post('/api/v1/devices/connect', (req, res) => {
  const newDevice = {
    id: 'dev_' + Math.random().toString(36).substring(2, 8),
    deviceName: req.body.deviceName || 'Connected Health Device',
    manufacturer: req.body.manufacturer || 'Generic',
    connectionType: req.body.connectionType || 'APPLE_HEALTH',
    batteryLevel: 80,
    isConnected: true,
    lastSyncTime: new Date().toISOString(),
    status: 'CONNECTED',
  };
  state.devices.push(newDevice);
  res.status(201).json({ success: true, device: newDevice });
});

app.post('/api/v1/devices/:id/sync', (req, res) => {
  const dev = state.devices.find((d) => d.id === req.params.id);
  if (dev) {
    dev.lastSyncTime = new Date().toISOString();
    return res.json({ success: true, lastSyncTime: dev.lastSyncTime });
  }
  res.status(404).json({ code: 'DEVICE_NOT_FOUND', message: 'Device does not exist.' });
});

app.delete('/api/v1/devices/:id', (req, res) => {
  state.devices = state.devices.filter((d) => d.id !== req.params.id);
  res.json({ success: true, message: 'Device disconnected.' });
});

// --- HEALTH READINGS & SUMMARY ---
app.get('/api/v1/health/summary', (req, res) => {
  res.json({
    status: 'Stable',
    monitoringActive: true,
    latestMetrics: {
      heartRate: { value: 74, unit: 'BPM', timestamp: new Date().toISOString(), source: 'Apple Watch Series 9' },
      bloodPressure: { systolic: 124, diastolic: 78, unit: 'mmHg', timestamp: new Date().toISOString(), source: 'Withings BPM' },
      spo2: { value: 98, unit: '%', timestamp: new Date().toISOString(), source: 'Apple Watch Series 9' },
      glucose: { value: 108, unit: 'mg/dL', timestamp: new Date().toISOString(), source: 'Health Connect' },
    },
    disclaimer: 'HealthGuard does not diagnose medical conditions. Always seek professional advice.',
  });
});

app.post('/api/v1/health/readings', (req, res) => {
  const reading = req.body;
  res.status(201).json({ success: true, readingId: 'rd_' + Math.random().toString(36).substring(2, 8), reading });
});

// --- WEARABLE LIVE INGESTION WEBHOOK (Apple Watch & Google Health Connect) ---
app.post('/api/v1/sync/wearables', (req, res) => {
  const { source, deviceName, readings, metrics } = req.body;
  const incoming = readings || metrics || [req.body];
  const count = Array.isArray(incoming) ? incoming.length : 1;
  const now = new Date().toISOString();

  // Update or register device in state
  const dName = deviceName || source || 'External Smartwatch';
  const existingDev = state.devices.find((d) => d.deviceName.toLowerCase().includes(dName.toLowerCase()));
  if (existingDev) {
    existingDev.lastSyncTime = now;
    existingDev.isConnected = true;
    existingDev.status = 'CONNECTED';
  } else {
    state.devices.push({
      id: 'dev_ingest_' + Math.random().toString(36).substring(2, 8),
      deviceName: dName,
      manufacturer: dName.toLowerCase().includes('apple') ? 'Apple Inc.' : dName.toLowerCase().includes('pixel') ? 'Google LLC' : 'Wearable Sensor',
      connectionType: dName.toLowerCase().includes('apple') ? 'APPLE_HEALTH' : 'HEALTH_CONNECT',
      batteryLevel: 85,
      isConnected: true,
      lastSyncTime: now,
      status: 'CONNECTED',
    });
  }

  console.log(`[Wearable Ingest] Received ${count} readings from ${dName}`);
  res.status(200).json({
    success: true,
    ingestedCount: count,
    timestamp: now,
    message: `Successfully synced ${count} readings from ${dName}.`,
  });
});

app.get('/api/v1/sync/wearables/latest', (req, res) => {
  res.json({
    activeDevices: state.devices.filter((d) => d.isConnected),
    latestSync: new Date().toISOString(),
  });
});

// --- RULES ---
app.get('/api/v1/health-rules', (req, res) => {
  res.json({ rules: state.rules });
});

// --- TRUSTED CONTACTS ---
app.get('/api/v1/trusted-contacts', (req, res) => {
  res.json({ contacts: state.contacts });
});

app.post('/api/v1/trusted-contacts', (req, res) => {
  const contact = {
    id: 'tc_' + Math.random().toString(36).substring(2, 8),
    name: req.body.name,
    relationship: req.body.relationship,
    phone: req.body.phone,
    priority: req.body.priority || 'Secondary',
    status: 'ACTIVE',
    permissions: req.body.permissions || { emergencyAlerts: true, locationAccess: true },
  };
  state.contacts.push(contact);
  res.status(201).json({ success: true, contact });
});

// --- EMERGENCY & SOS ---
app.post('/api/v1/emergency/sos', (req, res) => {
  const event = {
    id: 'evt_sos_' + Math.random().toString(36).substring(2, 8),
    userId: state.user.id,
    userName: state.user.fullName,
    eventType: 'Emergency SOS Triggered',
    severity: 'EMERGENCY',
    createdAt: new Date().toISOString(),
    status: 'ACTIVE',
    temporaryLocationToken: 'loc_tok_' + Math.random().toString(36).substring(2, 10),
  };
  state.emergencyEvents.unshift(event);
  res.status(201).json({ success: true, event });
});

app.get('/api/v1/emergency/events', (req, res) => {
  res.json({ events: state.emergencyEvents });
});

// --- NEARBY HEALTHCARE SERVICES ---
app.get('/api/v1/emergency/nearby-services', (req, res) => {
  res.json({
    facilities: [
      { name: 'Manipal Hospital – 24/7 Emergency', distanceKm: 1.2, phone: '+91 80 2502 4444', emergencyDepartment: true },
      { name: 'Apollo Hospital Emergency', distanceKm: 2.4, phone: '+91 80 2630 4050', emergencyDepartment: true },
      { name: 'National Emergency Ambulance (108)', distanceKm: 0.5, phone: '108', emergencyDepartment: true },
    ],
  });
});

// --- PRIVACY & CONSENT ---
app.get('/api/v1/privacy/consents', (req, res) => {
  res.json({
    consents: [
      { type: 'HEALTH_DATA_COLLECTION', status: 'ACTIVE', version: 'v2.1' },
      { type: 'LOCATION_EMERGENCY_SHARING', status: 'ACTIVE', version: 'v1.4' },
      { type: 'FAMILY_DATA_ACCESS', status: 'ACTIVE', version: 'v2.0' },
    ],
  });
});

// --- OPENAPI 3.0 SPECIFICATION ---
app.get('/api/v1/openapi.json', (req, res) => {
  res.json({
    openapi: '3.0.0',
    info: {
      title: 'HealthGuard REST API',
      version: '1.0.0',
      description: 'Production API for health data normalization, clinical monitoring rules, and emergency coordination.',
    },
    paths: {
      '/api/v1/auth/login': { post: { summary: 'Authenticate user and retrieve session JWT' } },
      '/api/v1/health/summary': { get: { summary: 'Get current health metrics summary and monitoring status' } },
      '/api/v1/emergency/sos': { post: { summary: 'Trigger emergency SOS protocol' } },
      '/api/v1/devices': { get: { summary: 'List connected wearables and health monitors' } },
      '/api/v1/trusted-contacts': { get: { summary: 'List authorized Health Circle family contacts' } },
    },
  });
});

// --- VITE MIDDLEWARE SETUP ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HealthGuard server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
