import React, { useState } from 'react';
import {
  FlaskConical,
  Heart,
  Activity,
  AlertTriangle,
  Flame,
  UserCheck,
  CheckCircle2,
  X,
  Play,
  RotateCcw,
} from 'lucide-react';
import { MetricType, HealthReading, EmergencyEvent } from '../types';
import { HealthDataQualityEngine } from '../services/HealthDataQualityEngine';
import { HealthMonitoringRuleEngine } from '../services/HealthMonitoringRuleEngine';
import { AlertStateMachine } from '../services/AlertStateMachine';
import { MockDataStore } from '../services/MockDataStore';

interface EventSimulatorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EventSimulatorDrawer: React.FC<EventSimulatorDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const [simulationLog, setSimulationLog] = useState<string[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<string>('bp_crisis');

  if (!isOpen) return null;

  const scenarios = [
    {
      id: 'hr_spike',
      title: 'Elevated Pulse Spike (142 BPM)',
      metric: 'HEART_RATE' as MetricType,
      value: 142,
      unit: 'BPM',
      source: 'Apple Watch Series 9',
      severity: 'WARNING' as const,
      expected: 'Triggers Warning -> Prompts Recheck protocol',
    },
    {
      id: 'bp_crisis',
      title: 'Hypertensive Alert (188/124 mmHg)',
      metric: 'BLOOD_PRESSURE' as MetricType,
      value: { systolic: 188, diastolic: 124 },
      unit: 'mmHg',
      source: 'Withings BPM Connect',
      severity: 'URGENT' as const,
      expected: 'Triggers Urgent Alert -> Family Notification Readiness',
    },
    {
      id: 'spo2_drop',
      title: 'Low Oxygen Desaturation (88%)',
      metric: 'SPO2' as MetricType,
      value: 88,
      unit: '%',
      source: 'Apple Watch Series 9',
      severity: 'URGENT' as const,
      expected: 'Triggers Urgent Notification -> Health Circle escalation',
    },
    {
      id: 'fall_impact',
      title: 'Hard Fall Detected Event',
      metric: 'FALL_EVENT' as MetricType,
      value: 'Hard Impact Followed by 45s Immobility',
      unit: 'Event',
      source: 'Apple Watch Series 9',
      severity: 'EMERGENCY' as const,
      expected: 'Triggers Immediate Emergency Protocol -> Location Token',
    },
    {
      id: 'invalid_sensor',
      title: 'Physiologically Invalid Sensor (HR 320 BPM)',
      metric: 'HEART_RATE' as MetricType,
      value: 320,
      unit: 'BPM',
      source: 'Corrupted Ble Packet',
      severity: 'NORMAL' as const,
      expected: 'Quality Engine marks INVALID -> CRITICAL ALERTS SUPPRESSED',
    },
  ];

  const handleRunSimulation = () => {
    const state = MockDataStore.getState();
    const scenario = scenarios.find((s) => s.id === selectedScenario);
    if (!scenario) return;

    // 1. Normalize and Quality Assess
    const reading: HealthReading = HealthDataQualityEngine.normalizeReading({
      userId: state.user.userId,
      metricType: scenario.metric,
      value: scenario.value,
      unit: scenario.unit,
      source: scenario.source,
      measurementType: scenario.metric === 'FALL_EVENT' ? 'EVENT' : 'AUTOMATIC',
    });

    MockDataStore.addReading(reading);

    const logEntries: string[] = [
      `[${new Date().toLocaleTimeString()}] Reading captured: ${JSON.stringify(scenario.value)} ${scenario.unit}`,
      `[Quality Engine] Classified as: ${reading.quality} (Confidence: ${(reading.confidence * 100).toFixed(0)}%)`,
    ];

    if (reading.quality === 'INVALID') {
      logEntries.push(`[Safety Filter] Suppressed alert generation for physiologically implausible sensor artifact.`);
      setSimulationLog(logEntries);
      return;
    }

    // 2. Evaluate rules
    const evalResult = HealthMonitoringRuleEngine.evaluateReading(reading, state.rules);
    logEntries.push(`[Rule Engine] Triggered: ${evalResult.triggered}, Severity: ${evalResult.severity}`);

    if (evalResult.triggered) {
      // 3. Create Emergency Event & escalate through Alert State Machine
      const event: EmergencyEvent = AlertStateMachine.createEventFromReading(
        state.user.userId,
        state.user.fullName,
        reading,
        evalResult.severity,
        evalResult.eventTitle,
        evalResult.rule?.id
      );

      MockDataStore.setActiveAlert(event);
      logEntries.push(`[Alert State Machine] State set to ${evalResult.severity}. Alert UI rendered.`);
    }

    setSimulationLog(logEntries);
  };

  const handleResetToNormal = () => {
    MockDataStore.setActiveAlert(null);
    setSimulationLog([`[${new Date().toLocaleTimeString()}] System reset to normal monitoring state.`]);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
              <FlaskConical className="w-6 h-6" />
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-purple-100 dark:bg-purple-950 px-2 py-0.5 rounded text-purple-700 dark:text-purple-300">
                  DEVELOPER ONLY
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Health Event Simulator
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-slate-500">
            Simulate incoming wearable sensor payloads to verify the Data Quality Engine, Rule Engine, and Alert Escalation state machine.
          </p>

          {/* Scenario Radio List */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">
              Select Test Scenario
            </label>
            {scenarios.map((sc) => (
              <div
                key={sc.id}
                onClick={() => setSelectedScenario(sc.id)}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                  selectedScenario === sc.id
                    ? 'border-purple-600 bg-purple-50/50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 font-medium'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span>{sc.title}</span>
                  <span className="font-mono text-[10px] opacity-70">
                    {sc.severity}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Expected: {sc.expected}
                </div>
              </div>
            ))}
          </div>

          {/* Execution Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleRunSimulation}
              className="flex-1 py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md"
            >
              <Play className="w-4 h-4" />
              Inject Scenario Payload
            </button>
            <button
              onClick={handleResetToNormal}
              className="py-3 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1"
              title="Clear Active Alert"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>

          {/* Output log */}
          {simulationLog.length > 0 && (
            <div className="p-3 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-xl border border-slate-800 space-y-1 max-h-48 overflow-y-auto">
              <span className="text-slate-400 block pb-1 border-b border-slate-800 text-[10px]">
                REAL-TIME SIMULATION TELEMETRY
              </span>
              {simulationLog.map((log, i) => (
                <div key={i}>{log}</div>
              ))}
            </div>
          )}
        </div>

        <div className="text-center pt-4 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400">
          Disabled in production builds. Used for QA & clinical validation.
        </div>
      </div>
    </div>
  );
};
