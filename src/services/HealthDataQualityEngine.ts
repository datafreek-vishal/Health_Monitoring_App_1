/**
 * HEALTHGUARD - Health Data Quality Engine
 * Validates, checks bounds, catches sensor artifacts, and classifies readings.
 * Ensures critical alerts are NEVER triggered by physiologically impossible or corrupted data.
 */

import { HealthReading, DataQuality, MetricType, BloodPressureValue } from '../types';

export interface QualityValidationResult {
  quality: DataQuality;
  confidence: number;
  reasons: string[];
  isPlausible: boolean;
}

export class HealthDataQualityEngine {
  private static readonly MAX_FUTURE_SKEW_MS = 5 * 60 * 1000; // 5 minutes
  private static readonly MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
  private static seenReadingHashes: Set<string> = new Set();

  /**
   * Evaluate a raw reading and return quality assessment
   */
  public static assessQuality(
    metricType: MetricType,
    value: unknown,
    timestamp: string,
    deviceId: string
  ): QualityValidationResult {
    const reasons: string[] = [];
    let quality: DataQuality = 'GOOD';
    let confidence = 0.95;

    // 1. Missing or undefined check
    if (value === null || value === undefined) {
      return {
        quality: 'INVALID',
        confidence: 0.0,
        reasons: ['Reading value is null or missing'],
        isPlausible: false,
      };
    }

    // 2. Timestamp validity
    const readTime = new Date(timestamp).getTime();
    const now = Date.now();
    if (isNaN(readTime)) {
      return {
        quality: 'INVALID',
        confidence: 0.0,
        reasons: ['Malformed or invalid timestamp format'],
        isPlausible: false,
      };
    }

    if (readTime > now + this.MAX_FUTURE_SKEW_MS) {
      quality = 'QUESTIONABLE';
      confidence = 0.4;
      reasons.push('Timestamp is in the future beyond acceptable device clock drift');
    } else if (now - readTime > this.MAX_AGE_MS) {
      quality = 'QUESTIONABLE';
      confidence = 0.5;
      reasons.push('Reading is older than 30 days, historic only');
    }

    // 3. Duplicate check
    const hashKey = `${deviceId}_${metricType}_${JSON.stringify(value)}_${timestamp}`;
    if (this.seenReadingHashes.has(hashKey)) {
      quality = 'QUESTIONABLE';
      confidence = Math.min(confidence, 0.6);
      reasons.push('Duplicate reading detected within synchronization buffer');
    } else {
      this.seenReadingHashes.add(hashKey);
      if (this.seenReadingHashes.size > 2000) {
        this.seenReadingHashes.clear();
      }
    }

    // 4. Physiological bounds check
    switch (metricType) {
      case 'HEART_RATE': {
        const hr = typeof value === 'number' ? value : Number(value);
        if (isNaN(hr) || hr < 25 || hr > 260) {
          quality = 'INVALID';
          confidence = 0.1;
          reasons.push(`Heart rate of ${hr} BPM is outside physiological human threshold (25-260 BPM)`);
        } else if (hr < 40 || hr > 190) {
          if (quality === 'GOOD') quality = 'QUESTIONABLE';
          confidence = 0.75;
          reasons.push('Extreme heart rate detected; requires secondary confirmation');
        }
        break;
      }

      case 'BLOOD_PRESSURE': {
        const bp = value as BloodPressureValue;
        if (!bp || typeof bp.systolic !== 'number' || typeof bp.diastolic !== 'number') {
          quality = 'INVALID';
          confidence = 0.0;
          reasons.push('Malformed blood pressure object (requires systolic and diastolic)');
        } else {
          if (
            bp.systolic < 50 ||
            bp.systolic > 280 ||
            bp.diastolic < 30 ||
            bp.diastolic > 180 ||
            bp.systolic <= bp.diastolic
          ) {
            quality = 'INVALID';
            confidence = 0.1;
            reasons.push(
              `Impossible blood pressure reading: ${bp.systolic}/${bp.diastolic} mmHg (diastolic must be < systolic and within human survival limits)`
            );
          }
        }
        break;
      }

      case 'SPO2': {
        const spo2 = typeof value === 'number' ? value : Number(value);
        if (isNaN(spo2) || spo2 < 50 || spo2 > 100) {
          quality = 'INVALID';
          confidence = 0.1;
          reasons.push(`SpO2 of ${spo2}% is invalid (physiological range 50% - 100%)`);
        } else if (spo2 < 85) {
          if (quality === 'GOOD') quality = 'QUESTIONABLE';
          confidence = 0.7;
          reasons.push('Low peripheral perfusion or sensor displacement suspected; recheck suggested');
        }
        break;
      }

      case 'BLOOD_GLUCOSE': {
        const glucose = typeof value === 'number' ? value : Number(value);
        if (isNaN(glucose) || glucose < 20 || glucose > 600) {
          quality = 'INVALID';
          confidence = 0.1;
          reasons.push(`Blood glucose of ${glucose} mg/dL is out of clinical sensor bounds (20-600 mg/dL)`);
        }
        break;
      }

      case 'TEMPERATURE': {
        const temp = typeof value === 'number' ? value : Number(value);
        if (isNaN(temp) || temp < 32 || temp > 44) {
          quality = 'INVALID';
          confidence = 0.1;
          reasons.push(`Body temperature of ${temp}°C is outside human physiological viability`);
        }
        break;
      }

      default:
        break;
    }

    return {
      quality,
      confidence,
      reasons,
      isPlausible: quality !== 'INVALID',
    };
  }

  /**
   * Normalizes incoming sensor payload into valid HealthReading
   */
  public static normalizeReading(raw: {
    userId: string;
    metricType: MetricType;
    value: unknown;
    unit: string;
    timestamp?: string;
    source?: string;
    deviceId?: string;
    deviceManufacturer?: string;
    measurementType?: 'AUTOMATIC' | 'MANUAL' | 'CONTINUOUS' | 'EVENT';
    notes?: string;
  }): HealthReading {
    const timestamp = raw.timestamp || new Date().toISOString();
    const deviceId = raw.deviceId || 'device_default';
    const assessment = this.assessQuality(raw.metricType, raw.value, timestamp, deviceId);

    return {
      id: 'hr_' + Math.random().toString(36).substring(2, 9),
      userId: raw.userId,
      metricType: raw.metricType,
      value: raw.value as HealthReading['value'],
      unit: raw.unit,
      timestamp,
      source: raw.source || 'Health Device',
      deviceId,
      deviceManufacturer: raw.deviceManufacturer || 'Generic',
      measurementType: raw.measurementType || 'AUTOMATIC',
      quality: assessment.quality,
      confidence: assessment.confidence,
      notes: assessment.reasons.length > 0 ? assessment.reasons.join('; ') : undefined,
      createdAt: new Date().toISOString(),
    };
  }

  public static validateBoundaries(metricType: MetricType, value: unknown): { valid: boolean; errorReason?: string } {
    const result = this.assessQuality(metricType, value, new Date().toISOString(), 'manual_entry');
    return {
      valid: result.isPlausible,
      errorReason: result.reasons.length > 0 ? result.reasons[0] : undefined,
    };
  }
}
