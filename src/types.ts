/**
 * HEALTHGUARD - Canonical Types & Data Models
 * "Your Health. Your People. Help When It Matters."
 */

export type UserRole =
  | 'PATIENT'
  | 'TRUSTED_FAMILY'
  | 'CAREGIVER'
  | 'CLINICIAN'
  | 'SUPPORT_AGENT'
  | 'ADMIN'
  | 'SUPER_ADMIN';

export type MetricType =
  | 'HEART_RATE'
  | 'BLOOD_PRESSURE'
  | 'BLOOD_GLUCOSE'
  | 'SPO2'
  | 'TEMPERATURE'
  | 'ECG'
  | 'RESPIRATORY_RATE'
  | 'HRV'
  | 'WEIGHT'
  | 'STEPS'
  | 'CALORIES'
  | 'SLEEP'
  | 'FALL_EVENT'
  | 'ACTIVITY';

export type DataQuality = 'GOOD' | 'QUESTIONABLE' | 'INVALID';

export type AlertSeverity = 'NORMAL' | 'WARNING' | 'URGENT' | 'EMERGENCY' | 'RESOLVED';
export type SeverityLevel = AlertSeverity;

export type SupportedLanguage = 'en' | 'hi' | 'kn' | 'te';

export type MeasurementContext =
  | 'RESTING'
  | 'AFTER_EXERCISE'
  | 'FASTING'
  | 'POST_MEAL'
  | 'BEFORE_BED'
  | 'DURING_SYMPTOMS';

export interface BloodPressureValue {
  systolic: number;
  diastolic: number;
}

export type HealthMetricValue = number | BloodPressureValue | string;

export interface HealthReading {
  id: string;
  userId: string;
  metricType: MetricType;
  value: HealthMetricValue;
  unit: string;
  timestamp: string; // ISO 8601
  source: string; // e.g. "Apple Health", "Health Connect", "Withings", "Manual"
  deviceId: string;
  deviceManufacturer: string;
  measurementType: 'AUTOMATIC' | 'MANUAL' | 'CONTINUOUS' | 'EVENT';
  quality: DataQuality;
  confidence: number; // 0.0 to 1.0
  notes?: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  heightCm: number;
  weightKg: number;
  country: string;
  city: string;
  state: string;
  emergencyPreferences: {
    autoShareLocationOnEmergency: boolean;
    autoCallEmergencyServices: boolean;
    elderlyHighContrastMode: boolean;
    language: 'en' | 'hi' | 'kn';
    preferredEmergencyNumber: string; // e.g. "112", "108"
  };
  healthConditions: string[]; // e.g. ["Hypertension", "Type 2 Diabetes"]
  createdAt: string;
  updatedAt: string;
}

export interface DeviceConnection {
  id: string;
  userId: string;
  deviceName: string;
  manufacturer: string;
  model: string;
  connectionType: 'APPLE_HEALTH' | 'HEALTH_CONNECT' | 'GARMIN' | 'FITBIT' | 'OURA' | 'WITHINGS' | 'WHOOP' | 'POLAR';
  batteryLevel?: number; // 0 - 100
  isConnected: boolean;
  lastSyncTime: string;
  supportedMetrics: MetricType[];
  status: 'CONNECTED' | 'SYNCING' | 'DISCONNECTED' | 'AUTH_EXPIRED' | 'UNSUPPORTED';
  icon: string;
}

export type RuleConditionType = 'GT' | 'LT' | 'BETWEEN' | 'PERSISTENT_GT' | 'TREND_SPIKE' | 'EVENT_TRIGGERED';

export interface HealthRule {
  id: string;
  userId?: string; // Optional if global baseline rule
  name: string;
  metric: MetricType;
  condition: RuleConditionType;
  threshold: {
    min?: number;
    max?: number;
    systolicMax?: number;
    diastolicMax?: number;
    sustainedDurationMinutes?: number;
  };
  persistenceMinutes: number;
  confirmationRequired: boolean;
  severity: AlertSeverity;
  action: 'NOTIFY_USER' | 'PROMPT_RECHECK' | 'ESCALATE_FAMILY' | 'TRIGGER_EMERGENCY';
  version: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  effectiveDate: string;
  reviewDate: string;
  clinicalRationale: string;
}

export type UserAlertResponse = 'OK' | 'RECHECK_INITIATED' | 'HELP_REQUESTED' | 'NO_RESPONSE';

export interface TimelineItem {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  type: 'READING' | 'WARNING' | 'RECHECK' | 'ESCALATION' | 'SMS_SENT' | 'LOCATION_SHARED' | 'ACKNOWLEDGED' | 'RESOLVED';
  actor?: string;
}

export interface EmergencyEvent {
  id: string;
  userId: string;
  userName: string;
  eventType: string; // e.g. "Elevated Blood Pressure", "High Heart Rate", "Fall Detected", "SOS"
  severity: AlertSeverity;
  metric: MetricType;
  metricDisplay: string;
  source: string;
  createdAt: string;
  updatedAt: string;
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED' | 'DISMISSED';
  locationId?: string;
  ruleId?: string;
  ruleVersion?: string;
  userResponse?: UserAlertResponse;
  resolvedAt?: string;
  resolvedBy?: string;
  timeline: TimelineItem[];
  temporaryLocationToken?: string;
}

export interface ContactPermissions {
  emergencyAlerts: boolean;
  locationAccess: boolean;
  heartRate: boolean;
  bloodPressure: boolean;
  glucose: boolean;
  fullHealthHistory: boolean;
}

export type FamilyRelationship =
  | 'Son'
  | 'Daughter'
  | 'Wife'
  | 'Husband'
  | 'Mother'
  | 'Father'
  | 'Brother'
  | 'Sister'
  | 'Friend'
  | 'Caregiver';

export interface TrustedContact {
  id: string;
  userId: string;
  name: string;
  relationship: FamilyRelationship;
  phone: string;
  email: string;
  priority: 'Primary' | 'Secondary' | 'Backup';
  notificationChannels: ('PUSH' | 'SMS' | 'VOICE')[];
  permissions: ContactPermissions;
  status: 'ACTIVE' | 'INVITATION_PENDING' | 'REVOKED';
  inviteToken?: string;
  avatarUrl?: string;
}

export type NotificationDeliveryState =
  | 'CREATED'
  | 'QUEUED'
  | 'SENT'
  | 'DELIVERED'
  | 'OPENED'
  | 'FAILED'
  | 'RETRYING'
  | 'ACKNOWLEDGED';

export interface NotificationDelivery {
  id: string;
  eventId: string;
  contactId: string;
  contactName: string;
  channel: 'PUSH' | 'SMS' | 'VOICE';
  state: NotificationDeliveryState;
  recipientPhoneOrToken: string;
  sentAt: string;
  deliveredAt?: string;
  acknowledgedAt?: string;
  failureReason?: string;
  retryCount: number;
}

export interface TemporaryLocation {
  id: string;
  eventId: string;
  userId: string;
  token: string;
  latitude: number;
  longitude: number;
  address: string;
  accuracyMeters: number;
  createdAt: string;
  validUntil: string; // 30 minutes from creation
  revoked: boolean;
}

export type HealthcareFacilityType =
  | 'HOSPITAL'
  | 'EMERGENCY_DEPT'
  | 'CLINIC'
  | 'AMBULANCE'
  | 'PHARMACY';

export interface HealthcareFacility {
  id: string;
  name: string;
  type: HealthcareFacilityType;
  distanceKm: number;
  address: string;
  phone: string;
  emergencyDepartment: boolean;
  operatingHours: string;
  latitude: number;
  longitude: number;
  directionsUrl?: string;
}

export interface EmergencyPlan {
  id: string;
  userId: string;
  primaryHospital: string;
  primaryHospitalPhone: string;
  preferredDoctor: string;
  preferredDoctorPhone: string;
  emergencyContactPhone: string;
  bloodGroup: string;
  allergies: string[];
  medications: string[];
  medicalConditionsSummary: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  shareWithTrustedContacts: boolean;
}

export interface ConsentRecord {
  id: string;
  userId: string;
  consentType: 'HEALTH_DATA_COLLECTION' | 'LOCATION_EMERGENCY_SHARING' | 'FAMILY_DATA_ACCESS' | 'ANALYTICS_TELEMETRY';
  purpose: string;
  dataCategories: string[];
  recipient: string;
  version: string;
  acceptedAt: string;
  revokedAt?: string;
  status: 'ACTIVE' | 'REVOKED';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorId: string;
  actorRole: UserRole;
  action:
    | 'HEALTH_DATA_ACCESSED'
    | 'LOCATION_SHARED'
    | 'CONTACT_ADDED'
    | 'CONTACT_REMOVED'
    | 'ALERT_CREATED'
    | 'ALERT_SENT'
    | 'ALERT_ACKNOWLEDGED'
    | 'CONSENT_GRANTED'
    | 'CONSENT_REVOKED'
    | 'DEVICE_CONNECTED'
    | 'DEVICE_DISCONNECTED'
    | 'RULE_CHANGED'
    | 'SOS_TRIGGERED';
  target: string;
  why: string;
  result: 'SUCCESS' | 'FAILURE';
  details?: Record<string, unknown>;
}

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
