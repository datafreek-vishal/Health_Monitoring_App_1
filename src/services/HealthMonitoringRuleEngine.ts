/**
 * HEALTHGUARD - Health Monitoring Rule Engine
 * Evaluates readings against clinically configured safety thresholds and persistence windows.
 * Does NOT generate automated medical diagnoses; generates safety notifications according to user consent.
 */

import { HealthReading, HealthRule, EmergencyEvent, AlertSeverity, BloodPressureValue } from '../types';

export interface RuleEvaluationResult {
  triggered: boolean;
  rule?: HealthRule;
  severity: AlertSeverity;
  eventTitle: string;
  userFacingMessage: string;
  requiresRecheck: boolean;
  suggestedAction: 'NOTIFY_USER' | 'PROMPT_RECHECK' | 'ESCALATE_FAMILY' | 'TRIGGER_EMERGENCY';
}

export class HealthMonitoringRuleEngine {
  /**
   * Default baseline monitoring rules (clinically reviewed parameters for alert generation)
   */
  public static getDefaultRules(): HealthRule[] {
    return [
      {
        id: 'rule_hr_high',
        name: 'High Resting Heart Rate',
        metric: 'HEART_RATE',
        condition: 'GT',
        threshold: { max: 120 },
        persistenceMinutes: 5,
        confirmationRequired: true,
        severity: 'WARNING',
        action: 'PROMPT_RECHECK',
        version: 'v1.2.0',
        status: 'ACTIVE',
        effectiveDate: '2026-01-01',
        reviewDate: '2027-01-01',
        clinicalRationale: 'Resting pulse exceeding 120 BPM sustained for >5 min merits verification and calm rest check.',
      },
      {
        id: 'rule_hr_extreme',
        name: 'Severe Tachycardia / Extreme Pulse',
        metric: 'HEART_RATE',
        condition: 'GT',
        threshold: { max: 160 },
        persistenceMinutes: 1,
        confirmationRequired: false,
        severity: 'URGENT',
        action: 'ESCALATE_FAMILY',
        version: 'v1.2.0',
        status: 'ACTIVE',
        effectiveDate: '2026-01-01',
        reviewDate: '2027-01-01',
        clinicalRationale: 'Sustained resting pulse above 160 BPM requires immediate user check-in and family readiness.',
      },
      {
        id: 'rule_bp_hypertensive_crisis',
        name: 'Elevated Blood Pressure Threshold',
        metric: 'BLOOD_PRESSURE',
        condition: 'GT',
        threshold: { systolicMax: 180, diastolicMax: 120 },
        persistenceMinutes: 0,
        confirmationRequired: true,
        severity: 'URGENT',
        action: 'PROMPT_RECHECK',
        version: 'v1.4.0',
        status: 'ACTIVE',
        effectiveDate: '2026-01-01',
        reviewDate: '2027-01-01',
        clinicalRationale: 'Systolic >180 mmHg or Diastolic >120 mmHg is outside typical home monitoring ranges and prompts rest recheck or assistance.',
      },
      {
        id: 'rule_spo2_low',
        name: 'Low Peripheral Oxygen Saturation (SpO2)',
        metric: 'SPO2',
        condition: 'LT',
        threshold: { min: 90 },
        persistenceMinutes: 2,
        confirmationRequired: true,
        severity: 'URGENT',
        action: 'ESCALATE_FAMILY',
        version: 'v1.1.0',
        status: 'ACTIVE',
        effectiveDate: '2026-01-01',
        reviewDate: '2027-01-01',
        clinicalRationale: 'Sustained pulse oximetry below 90% requires alert verification and respiratory review.',
      },
      {
        id: 'rule_glucose_hypoglycemia',
        name: 'Low Blood Glucose Range',
        metric: 'BLOOD_GLUCOSE',
        condition: 'LT',
        threshold: { min: 60 },
        persistenceMinutes: 0,
        confirmationRequired: true,
        severity: 'URGENT',
        action: 'NOTIFY_USER',
        version: 'v1.2.0',
        status: 'ACTIVE',
        effectiveDate: '2026-01-01',
        reviewDate: '2027-01-01',
        clinicalRationale: 'Glucose reading below 60 mg/dL requires prompt intake and verification.',
      },
      {
        id: 'rule_fall_detected',
        name: 'Hard Fall Detected Event',
        metric: 'FALL_EVENT',
        condition: 'EVENT_TRIGGERED',
        threshold: {},
        persistenceMinutes: 0,
        confirmationRequired: true,
        severity: 'EMERGENCY',
        action: 'TRIGGER_EMERGENCY',
        version: 'v2.0.0',
        status: 'ACTIVE',
        effectiveDate: '2026-01-01',
        reviewDate: '2027-01-01',
        clinicalRationale: 'High-impact accelerometer spike followed by immobility indicates potential fall.',
      }
    ];
  }

  /**
   * Evaluates an incoming reading against active rules
   */
  public static evaluateReading(reading: HealthReading, rules: HealthRule[]): RuleEvaluationResult {
    // Safety check: Never trigger alerts on INVALID data
    if (reading.quality === 'INVALID') {
      return {
        triggered: false,
        severity: 'NORMAL',
        eventTitle: 'Invalid Reading Suppressed',
        userFacingMessage: 'Corrupt or impossible sensor reading ignored by quality filter.',
        requiresRecheck: false,
        suggestedAction: 'NOTIFY_USER',
      };
    }

    const applicableRules = rules.filter(
      (r) => r.status === 'ACTIVE' && r.metric === reading.metricType
    );

    for (const rule of applicableRules) {
      if (reading.metricType === 'HEART_RATE') {
        const bpm = Number(reading.value);
        if (rule.threshold.max && bpm >= rule.threshold.max) {
          return {
            triggered: true,
            rule,
            severity: rule.severity,
            eventTitle: `Elevated Heart Rate (${bpm} BPM)`,
            userFacingMessage: `Your heart rate reading of ${bpm} BPM is above your configured monitoring threshold of ${rule.threshold.max} BPM.`,
            requiresRecheck: rule.confirmationRequired,
            suggestedAction: rule.action,
          };
        }
      }

      if (reading.metricType === 'BLOOD_PRESSURE') {
        const bp = reading.value as BloodPressureValue;
        if (bp && typeof bp.systolic === 'number' && typeof bp.diastolic === 'number') {
          const sysViolated = rule.threshold.systolicMax && bp.systolic >= rule.threshold.systolicMax;
          const diaViolated = rule.threshold.diastolicMax && bp.diastolic >= rule.threshold.diastolicMax;
          if (sysViolated || diaViolated) {
            return {
              triggered: true,
              rule,
              severity: rule.severity,
              eventTitle: `Elevated Blood Pressure (${bp.systolic}/${bp.diastolic} mmHg)`,
              userFacingMessage: `Your blood pressure reading of ${bp.systolic}/${bp.diastolic} mmHg exceeds your configured threshold.`,
              requiresRecheck: rule.confirmationRequired,
              suggestedAction: rule.action,
            };
          }
        }
      }

      if (reading.metricType === 'SPO2') {
        const spo2 = Number(reading.value);
        if (rule.threshold.min && spo2 <= rule.threshold.min) {
          return {
            triggered: true,
            rule,
            severity: rule.severity,
            eventTitle: `Low Oxygen Reading (${spo2}%)`,
            userFacingMessage: `Your oxygen saturation reading of ${spo2}% is below your configured limit of ${rule.threshold.min}%.`,
            requiresRecheck: rule.confirmationRequired,
            suggestedAction: rule.action,
          };
        }
      }

      if (reading.metricType === 'BLOOD_GLUCOSE') {
        const glucose = Number(reading.value);
        if (rule.threshold.min && glucose <= rule.threshold.min) {
          return {
            triggered: true,
            rule,
            severity: rule.severity,
            eventTitle: `Low Glucose Reading (${glucose} mg/dL)`,
            userFacingMessage: `Your glucose reading of ${glucose} mg/dL is below your configured threshold of ${rule.threshold.min} mg/dL.`,
            requiresRecheck: rule.confirmationRequired,
            suggestedAction: rule.action,
          };
        }
      }

      if (reading.metricType === 'FALL_EVENT') {
        return {
          triggered: true,
          rule,
          severity: 'EMERGENCY',
          eventTitle: 'Hard Fall Detected',
          userFacingMessage: 'A sudden impact and stillness were detected by your connected wearable.',
          requiresRecheck: true,
          suggestedAction: 'TRIGGER_EMERGENCY',
        };
      }
    }

    return {
      triggered: false,
      severity: 'NORMAL',
      eventTitle: 'Normal Health Reading',
      userFacingMessage: 'Reading is within configured monitoring parameters.',
      requiresRecheck: false,
      suggestedAction: 'NOTIFY_USER',
    };
  }
}
