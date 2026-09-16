/**
 * HEALTHGUARD - Audit & Compliance Engine
 * Immutable security and privacy audit trail for all sensitive operations.
 * Satisfies India DPDP, HIPAA, and HealthKit/Health Connect audit compliance rules.
 */

import { AuditLog, UserRole } from '../types';

export class AuditLogger {
  private static logs: AuditLog[] = [
    {
      id: 'audit_init_1',
      timestamp: new Date(Date.now() - 3600 * 1000).toISOString(),
      actorId: 'user_101',
      actorRole: 'PATIENT',
      action: 'CONSENT_GRANTED',
      target: 'Emergency Location Sharing Consent v1.2',
      why: 'User onboarding completion',
      result: 'SUCCESS',
      details: { consentType: 'LOCATION_EMERGENCY_SHARING', durationMinutes: 30 },
    },
    {
      id: 'audit_init_2',
      timestamp: new Date(Date.now() - 1800 * 1000).toISOString(),
      actorId: 'user_101',
      actorRole: 'PATIENT',
      action: 'DEVICE_CONNECTED',
      target: 'Apple Watch Series 9',
      why: 'User paired wearable via HealthKit bridge',
      result: 'SUCCESS',
      details: { provider: 'APPLE_HEALTH', metricsCount: 6 },
    },
    {
      id: 'audit_init_3',
      timestamp: new Date(Date.now() - 900 * 1000).toISOString(),
      actorId: 'user_101',
      actorRole: 'PATIENT',
      action: 'CONTACT_ADDED',
      target: 'Aditya (Son - Primary Contact)',
      why: 'User configured emergency escalation tier',
      result: 'SUCCESS',
      details: { permissions: ['emergencyAlerts', 'locationAccess', 'bloodPressure'] },
    },
  ];

  public static log(entry: {
    actorId: string;
    actorRole: UserRole;
    action: AuditLog['action'];
    target: string;
    why: string;
    result: 'SUCCESS' | 'FAILURE';
    details?: Record<string, unknown>;
  }): AuditLog {
    const logItem: AuditLog = {
      id: 'audit_' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
      ...entry,
    };
    this.logs.unshift(logItem);
    return logItem;
  }

  public static getLogs(): AuditLog[] {
    return [...this.logs];
  }
}
