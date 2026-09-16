import React, { useState } from 'react';
import {
  Plus,
  Heart,
  Activity,
  Wind,
  Droplet,
  Thermometer,
  Scale,
  X,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { MetricType, MeasurementContext, HealthReading } from '../types';
import { HealthDataQualityEngine } from '../services/HealthDataQualityEngine';

interface AddReadingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveReading: (reading: HealthReading) => void;
  userId: string;
}

export const AddReadingModal: React.FC<AddReadingModalProps> = ({
  isOpen,
  onClose,
  onSaveReading,
  userId,
}) => {
  const [metricType, setMetricType] = useState<MetricType>('HEART_RATE');
  const [hrValue, setHrValue] = useState<number>(72);
  const [bpSystolic, setBpSystolic] = useState<number>(120);
  const [bpDiastolic, setBpDiastolic] = useState<number>(80);
  const [spo2Value, setSpo2Value] = useState<number>(98);
  const [glucoseValue, setGlucoseValue] = useState<number>(100);
  const [tempValue, setTempValue] = useState<number>(98.6);
  const [weightValue, setWeightValue] = useState<number>(70);
  const [context, setContext] = useState<MeasurementContext>('RESTING');
  const [notes, setNotes] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    let rawValue: any;
    let unit = '';

    switch (metricType) {
      case 'HEART_RATE':
        rawValue = Number(hrValue);
        unit = 'BPM';
        break;
      case 'BLOOD_PRESSURE':
        rawValue = { systolic: Number(bpSystolic), diastolic: Number(bpDiastolic) };
        unit = 'mmHg';
        break;
      case 'SPO2':
        rawValue = Number(spo2Value);
        unit = '%';
        break;
      case 'BLOOD_GLUCOSE':
        rawValue = Number(glucoseValue);
        unit = 'mg/dL';
        break;
      case 'TEMPERATURE':
        rawValue = Number(tempValue);
        unit = '°F';
        break;
      case 'WEIGHT':
        rawValue = Number(weightValue);
        unit = 'kg';
        break;
      default:
        rawValue = Number(hrValue);
        unit = 'BPM';
    }

    // Run clinical bounds validation
    const valResult = HealthDataQualityEngine.validateBoundaries(metricType, rawValue);
    if (!valResult.valid) {
      setValidationError(valResult.errorReason || 'Physiologically implausible value.');
      return;
    }

    const combinedNotes = context ? `[Context: ${context}] ${notes}`.trim() : notes;

    const normalized = HealthDataQualityEngine.normalizeReading({
      userId,
      metricType,
      value: rawValue,
      unit,
      source: 'Manual Patient Entry',
      measurementType: 'MANUAL',
      notes: combinedNotes || undefined,
    });

    onSaveReading(normalized);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Log Manual Health Reading
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Metric Selector Pills */}
          <div>
            <label className="font-semibold block mb-1.5 text-slate-700 dark:text-slate-300">
              Select Biometric Vital
            </label>
            <div className="grid grid-cols-3 gap-1.5 font-medium">
              {[
                { type: 'HEART_RATE' as MetricType, label: 'Heart Rate' },
                { type: 'BLOOD_PRESSURE' as MetricType, label: 'Blood Pressure' },
                { type: 'SPO2' as MetricType, label: 'Oxygen (SpO2)' },
                { type: 'BLOOD_GLUCOSE' as MetricType, label: 'Glucose' },
                { type: 'TEMPERATURE' as MetricType, label: 'Temperature' },
                { type: 'WEIGHT' as MetricType, label: 'Weight' },
              ].map((m) => (
                <button
                  key={m.type}
                  type="button"
                  onClick={() => {
                    setMetricType(m.type);
                    setValidationError(null);
                  }}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    metricType === m.type
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 font-bold'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Metric Inputs */}
          {metricType === 'HEART_RATE' && (
            <div>
              <label className="font-semibold block mb-1">Pulse / Heart Rate (BPM)</label>
              <input
                type="number"
                min={20}
                max={300}
                value={hrValue}
                onChange={(e) => setHrValue(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-base font-bold"
              />
            </div>
          )}

          {metricType === 'BLOOD_PRESSURE' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold block mb-1">Systolic (mmHg)</label>
                <input
                  type="number"
                  min={40}
                  max={300}
                  value={bpSystolic}
                  onChange={(e) => setBpSystolic(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-base font-bold"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Diastolic (mmHg)</label>
                <input
                  type="number"
                  min={30}
                  max={200}
                  value={bpDiastolic}
                  onChange={(e) => setBpDiastolic(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-base font-bold"
                />
              </div>
            </div>
          )}

          {metricType === 'SPO2' && (
            <div>
              <label className="font-semibold block mb-1">Oxygen Saturation (%)</label>
              <input
                type="number"
                min={40}
                max={100}
                value={spo2Value}
                onChange={(e) => setSpo2Value(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-base font-bold"
              />
            </div>
          )}

          {metricType === 'BLOOD_GLUCOSE' && (
            <div>
              <label className="font-semibold block mb-1">Blood Glucose (mg/dL)</label>
              <input
                type="number"
                min={20}
                max={600}
                value={glucoseValue}
                onChange={(e) => setGlucoseValue(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-base font-bold"
              />
            </div>
          )}

          {metricType === 'TEMPERATURE' && (
            <div>
              <label className="font-semibold block mb-1">Body Temperature (°F)</label>
              <input
                type="number"
                step="0.1"
                min={85}
                max={115}
                value={tempValue}
                onChange={(e) => setTempValue(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-base font-bold"
              />
            </div>
          )}

          {metricType === 'WEIGHT' && (
            <div>
              <label className="font-semibold block mb-1">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                min={10}
                max={350}
                value={weightValue}
                onChange={(e) => setWeightValue(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-base font-bold"
              />
            </div>
          )}

          {/* Context */}
          <div>
            <label className="font-semibold block mb-1">Measurement Context</label>
            <select
              value={context}
              onChange={(e) => setContext(e.target.value as MeasurementContext)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
            >
              <option value="RESTING">Resting</option>
              <option value="AFTER_EXERCISE">After Exercise</option>
              <option value="FASTING">Fasting</option>
              <option value="POST_MEAL">Post-Meal (2 Hours)</option>
              <option value="BEFORE_BED">Before Bed</option>
              <option value="DURING_SYMPTOMS">During Symptoms / Discomfort</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="font-semibold block mb-1">Clinical Notes or Symptoms (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Mild headache, seated quietly for 5 min"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
            />
          </div>

          {/* Validation Error Banner */}
          {validationError && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl text-rose-800 dark:text-rose-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{validationError}</span>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="btn-confirm-add-reading"
              className="w-2/3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              Validate & Save Reading
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
