/**
 * HEALTHGUARD - Alert State Machine & Escalation Engine
 * Coordinates state transitions:
 * NORMAL -> WARNING -> URGENT -> EMERGENCY -> RESOLVED
 * Supports:
 * - "I'm OK" flow (stops family escalation, records timestamp, marks resolved)
 * - "Recheck" flow (starts protocol, compares results without auto-diagnosis)
 * - "I Need Help" flow (escalates to Health Circle, requests 30-min temporary location, presents 112/108)
 * - SOS button immediate override
 */

import {
  AlertSeverity,
  EmergencyEvent,
  HealthReading,
  TimelineItem,
  UserAlertResponse,
  TrustedContact,
} from '../types';
import { LocationService } from './LocationService';
import { NotificationDispatcher } from './NotificationDispatcher';
import { AuditLogger } from './AuditLogger';

export class AlertStateMachine {
  /**
   * Initializes a new Emergency / Warning Event from a triggered reading or rule
   */
  public static createEventFromReading(
    userId: string,
    userName: string,
    reading: HealthReading,
    severity: AlertSeverity,
    title: string,
    ruleId?: string
  ): EmergencyEvent {
    const eventId = 'evt_' + Math.random().toString(36).substring(2, 9);
    const now = new Date().toISOString();

    const valueDisplay =
      typeof reading.value === 'object' && reading.value !== null
        ? `${(reading.value as { systolic: number; diastolic: number }).systolic}/${(reading.value as { systolic: number; diastolic: number }).diastolic} ${reading.unit}`
        : `${reading.value} ${reading.unit}`;

    const timeline: TimelineItem[] = [
      {
        id: 'tl_1',
        timestamp: reading.timestamp,
        title: 'Health Reading Received',
        description: `Measurement captured: ${valueDisplay} from ${reading.source}.`,
        type: 'READING',
      },
      {
        id: 'tl_2',
        timestamp: now,
        title: `${severity} Status Triggered`,
        description: `${title}. Safety monitoring parameters satisfied.`,
        type: 'WARNING',
      },
    ];

    AuditLogger.log({
      actorId: 'system_engine',
      actorRole: 'SUPPORT_AGENT',
      action: 'ALERT_CREATED',
      target: `Event ${eventId} (${title})`,
      why: 'Health monitoring rule criteria satisfied',
      result: 'SUCCESS',
      details: { readingId: reading.id, metric: reading.metricType, severity },
    });

    return {
      id: eventId,
      userId,
      userName,
      eventType: title,
      severity,
      metric: reading.metricType,
      metricDisplay: valueDisplay,
      source: reading.source,
      createdAt: now,
      updatedAt: now,
      status: 'ACTIVE',
      ruleId,
      ruleVersion: 'v1.2.0',
      timeline,
    };
  }

  /**
   * User clicks "I'm OK"
   * Halts family escalation, updates timeline, resolves the alert
   */
  public static handleUserOk(event: EmergencyEvent, reason?: string): EmergencyEvent {
    const now = new Date().toISOString();
    const updated = { ...event };
    updated.userResponse = 'OK';
    updated.status = 'RESOLVED';
    updated.severity = 'RESOLVED';
    updated.resolvedAt = now;
    updated.resolvedBy = event.userName;
    updated.updatedAt = now;

    updated.timeline = [
      ...updated.timeline,
      {
        id: 'tl_' + Math.random().toString(36).substring(2, 7),
        timestamp: now,
        title: "User Confirmed: 'I'm OK'",
        description: reason || "User responded to in-app prompt and verified wellness. Family escalation cancelled.",
        type: 'RESOLVED',
        actor: event.userName,
      },
    ];

    if (updated.temporaryLocationToken) {
      LocationService.revokeToken(updated.temporaryLocationToken);
    }

    AuditLogger.log({
      actorId: event.userId,
      actorRole: 'PATIENT',
      action: 'ALERT_ACKNOWLEDGED',
      target: `Event ${event.id}`,
      why: "User confirmed 'I'm OK'",
      result: 'SUCCESS',
    });

    return updated;
  }

  /**
   * User clicks "Recheck"
   * Updates state, guides second measurement
   */
  public static handleUserRecheck(event: EmergencyEvent): EmergencyEvent {
    const now = new Date().toISOString();
    const updated = { ...event };
    updated.userResponse = 'RECHECK_INITIATED';
    updated.updatedAt = now;

    updated.timeline = [
      ...updated.timeline,
      {
        id: 'tl_' + Math.random().toString(36).substring(2, 7),
        timestamp: now,
        title: 'Recheck Protocol Initiated',
        description: 'User initiated secondary measurement verification protocol.',
        type: 'RECHECK',
        actor: event.userName,
      },
    ];

    return updated;
  }

  /**
   * User clicks "I Need Help" or SOS Button
   * Escalates to EMERGENCY, generates 30-min temporary location token, dispatches to Health Circle
   */
  public static handleUserNeedHelp(
    event: EmergencyEvent,
    contacts: TrustedContact[],
    userCoords?: { latitude: number; longitude: number; address?: string }
  ): EmergencyEvent {
    const now = new Date().toISOString();
    const updated = { ...event };
    updated.severity = 'EMERGENCY';
    updated.userResponse = 'HELP_REQUESTED';
    updated.updatedAt = now;

    // Generate temporary 30-minute location token
    const location = LocationService.createEmergencyLocationToken(
      event.userId,
      event.id,
      userCoords || { latitude: 12.9716, longitude: 77.5946 }
    );
    updated.temporaryLocationToken = location.token;

    // Dispatch notifications to trusted circle
    const message = `🚨 HEALTHGUARD ALERT: ${event.userName} has requested assistance regarding ${event.eventType}. Temporary location active for 30 minutes.`;
    NotificationDispatcher.dispatchEmergencyAlert(event.id, contacts, message, location.token);

    updated.timeline = [
      ...updated.timeline,
      {
        id: 'tl_' + Math.random().toString(36).substring(2, 7),
        timestamp: now,
        title: 'Emergency Assistance Requested',
        description: "User triggered 'I Need Help'. Coordinated emergency protocol initiated.",
        type: 'ESCALATION',
        actor: event.userName,
      },
      {
        id: 'tl_' + Math.random().toString(36).substring(2, 7),
        timestamp: now,
        title: 'Temporary Emergency Location Activated',
        description: `Secure 30-minute location token generated (${location.address}). Sharing with authorized contacts.`,
        type: 'LOCATION_SHARED',
      },
      {
        id: 'tl_' + Math.random().toString(36).substring(2, 7),
        timestamp: now,
        title: 'Health Circle Notifications Dispatched',
        description: `Push & SMS alerts sent to primary and secondary family contacts.`,
        type: 'SMS_SENT',
      },
    ];

    AuditLogger.log({
      actorId: event.userId,
      actorRole: 'PATIENT',
      action: 'SOS_TRIGGERED',
      target: `Event ${event.id}`,
      why: 'User requested emergency assistance',
      result: 'SUCCESS',
      details: { token: location.token },
    });

    return updated;
  }

  /**
   * Family member acknowledges the alert
   */
  public static handleFamilyAcknowledge(
    event: EmergencyEvent,
    contactName: string
  ): EmergencyEvent {
    const now = new Date().toISOString();
    const updated = { ...event };
    updated.status = 'ACKNOWLEDGED';
    updated.updatedAt = now;

    updated.timeline = [
      ...updated.timeline,
      {
        id: 'tl_' + Math.random().toString(36).substring(2, 7),
        timestamp: now,
        title: `Alert Acknowledged by ${contactName}`,
        description: `${contactName} opened the emergency portal and acknowledged response coordination.`,
        type: 'ACKNOWLEDGED',
        actor: contactName,
      },
    ];

    AuditLogger.log({
      actorId: contactName,
      actorRole: 'TRUSTED_FAMILY',
      action: 'ALERT_ACKNOWLEDGED',
      target: `Event ${event.id}`,
      why: 'Family member responded to emergency alert',
      result: 'SUCCESS',
    });

    return updated;
  }

  public static acknowledgeAlert(event: EmergencyEvent, contactName: string): EmergencyEvent {
    return this.handleFamilyAcknowledge(event, contactName);
  }

  public static resolveAlert(event: EmergencyEvent, resolvedBy: string, reason?: string): EmergencyEvent {
    const now = new Date().toISOString();
    const updated = { ...event };
    updated.status = 'RESOLVED';
    updated.severity = 'RESOLVED';
    updated.resolvedAt = now;
    updated.resolvedBy = resolvedBy;
    updated.updatedAt = now;

    if (updated.temporaryLocationToken) {
      LocationService.revokeToken(updated.temporaryLocationToken);
    }

    updated.timeline = [
      ...updated.timeline,
      {
        id: 'tl_' + Math.random().toString(36).substring(2, 7),
        timestamp: now,
        title: 'Event Resolved',
        description: reason || `Resolved by ${resolvedBy}.`,
        type: 'RESOLVED',
        actor: resolvedBy,
      },
    ];

    AuditLogger.log({
      actorId: resolvedBy,
      actorRole: 'PATIENT',
      action: 'ALERT_ACKNOWLEDGED',
      target: `Event ${event.id}`,
      why: reason || 'Event resolved',
      result: 'SUCCESS',
    });

    return updated;
  }

  public static createManualSOSEvent(userId: string, userName: string): EmergencyEvent {
    const eventId = 'evt_sos_' + Math.random().toString(36).substring(2, 9);
    const now = new Date().toISOString();

    const location = LocationService.createEmergencyLocationToken(
      userId,
      eventId,
      { latitude: 12.9716, longitude: 77.5946, address: 'Residency Road, Ashok Nagar, Bengaluru, Karnataka 560025' }
    );

    return {
      id: eventId,
      userId,
      userName,
      eventType: 'Direct Emergency SOS Panic Triggered',
      severity: 'EMERGENCY',
      metric: 'FALL_EVENT',
      metricDisplay: 'Immediate SOS',
      source: 'HealthGuard In-App SOS Button',
      createdAt: now,
      updatedAt: now,
      status: 'ACTIVE',
      temporaryLocationToken: location.token,
      timeline: [
        {
          id: 'tl_1',
          timestamp: now,
          title: 'EMERGENCY SOS Initiated',
          description: `${userName} pressed the one-tap Emergency SOS panic button.`,
          type: 'ESCALATION',
          actor: userName,
        },
        {
          id: 'tl_2',
          timestamp: now,
          title: '30-Minute Temporary Location Generated',
          description: `Location active: ${location.address}. Available to authorized contacts.`,
          type: 'LOCATION_SHARED',
        },
      ],
    };
  }
}
