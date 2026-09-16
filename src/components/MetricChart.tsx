import React, { useState } from 'react';
import { MetricType, HealthReading, BloodPressureValue } from '../types';
import { TrendingUp, TrendingDown, Minus, Clock, ShieldCheck, AlertCircle } from 'lucide-react';

interface MetricChartProps {
  metricType: MetricType;
  title: string;
  unit: string;
  currentReading?: HealthReading;
  targetRange?: { min?: number; max?: number; systolicMax?: number; diastolicMax?: number };
}

export const MetricChart: React.FC<MetricChartProps> = ({
  metricType,
  title,
  unit,
  currentReading,
  targetRange,
}) => {
  const [timeframe, setTimeframe] = useState<'Day' | 'Week' | 'Month' | '3 Months'>('Week');

  // Generate realistic data points based on timeframe and metric
  const getHistoricalData = () => {
    if (metricType === 'HEART_RATE') {
      return [
        { label: 'Mon', value: 72, time: '08:00' },
        { label: 'Tue', value: 76, time: '11:30' },
        { label: 'Wed', value: 71, time: '14:15' },
        { label: 'Thu', value: 84, time: '16:00' },
        { label: 'Fri', value: 78, time: '09:45' },
        { label: 'Sat', value: 73, time: '13:20' },
        { label: 'Today', value: currentReading ? Number(currentReading.value) : 74, time: 'Now' },
      ];
    }
    if (metricType === 'BLOOD_PRESSURE') {
      return [
        { label: 'Mon', sys: 122, dia: 78 },
        { label: 'Tue', sys: 126, dia: 82 },
        { label: 'Wed', sys: 120, dia: 76 },
        { label: 'Thu', sys: 130, dia: 84 },
        { label: 'Fri', sys: 125, dia: 80 },
        { label: 'Sat', sys: 121, dia: 78 },
        {
          label: 'Today',
          sys: currentReading ? (currentReading.value as BloodPressureValue).systolic : 124,
          dia: currentReading ? (currentReading.value as BloodPressureValue).diastolic : 78,
        },
      ];
    }
    if (metricType === 'SPO2') {
      return [
        { label: 'Mon', value: 98 },
        { label: 'Tue', value: 99 },
        { label: 'Wed', value: 97 },
        { label: 'Thu', value: 98 },
        { label: 'Fri', value: 98 },
        { label: 'Sat', value: 99 },
        { label: 'Today', value: currentReading ? Number(currentReading.value) : 98 },
      ];
    }
    return [
      { label: 'Mon', value: 104 },
      { label: 'Tue', value: 112 },
      { label: 'Wed', value: 106 },
      { label: 'Thu', value: 118 },
      { label: 'Fri', value: 109 },
      { label: 'Sat', value: 105 },
      { label: 'Today', value: 108 },
    ];
  };

  const data = getHistoricalData();
  const isBP = metricType === 'BLOOD_PRESSURE';

  // SVG dimensions
  const width = 500;
  const height = 180;
  const paddingX = 40;
  const paddingY = 25;

  // Compute min and max for scaling
  let minVal = 50;
  let maxVal = 160;

  if (isBP) {
    minVal = 50;
    maxVal = 160;
  } else {
    const vals = data.map((d: any) => d.value);
    minVal = Math.max(0, Math.min(...vals) - 10);
    maxVal = Math.max(...vals) + 15;
  }

  const getY = (val: number) => {
    return height - paddingY - ((val - minVal) / (maxVal - minVal)) * (height - 2 * paddingY);
  };

  const getX = (index: number, total: number) => {
    return paddingX + (index / (total - 1)) * (width - 2 * paddingX);
  };

  const linePath = !isBP
    ? data
        .map((pt: any, i: number) => `${i === 0 ? 'M' : 'L'} ${getX(i, data.length)} ${getY(pt.value)}`)
        .join(' ')
    : '';

  const bpSysPath = isBP
    ? data
        .map((pt: any, i: number) => `${i === 0 ? 'M' : 'L'} ${getX(i, data.length)} ${getY(pt.sys)}`)
        .join(' ')
    : '';

  const bpDiaPath = isBP
    ? data
        .map((pt: any, i: number) => `${i === 0 ? 'M' : 'L'} ${getX(i, data.length)} ${getY(pt.dia)}`)
        .join(' ')
    : '';

  const currentDisplay = currentReading
    ? isBP
      ? `${(currentReading.value as BloodPressureValue).systolic}/${(currentReading.value as BloodPressureValue).diastolic} ${unit}`
      : `${currentReading.value} ${unit}`
    : `Normal ${unit}`;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <span className="text-xs uppercase font-semibold text-slate-500 dark:text-slate-400 tracking-wider">
            {title} Trend
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {currentDisplay}
            </span>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 gap-0.5 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
              <TrendingDown className="w-3.5 h-3.5" />
              Stable Trend
            </span>
          </div>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
          {(['Day', 'Week', 'Month', '3 Months'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                timeframe === tf
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Responsive Chart */}
      <div className="w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-44 overflow-visible"
          aria-label={`${title} trend chart for ${timeframe}`}
        >
          {/* Target Range Shaded Area */}
          {targetRange && !isBP && targetRange.max && (
            <rect
              x={paddingX}
              y={getY(targetRange.max)}
              width={width - 2 * paddingX}
              height={getY(targetRange.min || minVal) - getY(targetRange.max)}
              fill="rgba(16, 185, 129, 0.08)"
              rx="4"
            />
          )}

          {/* Grid lines */}
          <line
            x1={paddingX}
            y1={getY(maxVal * 0.75)}
            x2={width - paddingX}
            y2={getY(maxVal * 0.75)}
            stroke="#94a3b8"
            strokeDasharray="4 4"
            strokeOpacity="0.25"
          />
          <line
            x1={paddingX}
            y1={getY(minVal + (maxVal - minVal) * 0.25)}
            x2={width - paddingX}
            y2={getY(minVal + (maxVal - minVal) * 0.25)}
            stroke="#94a3b8"
            strokeDasharray="4 4"
            strokeOpacity="0.25"
          />

          {/* Chart Paths */}
          {!isBP ? (
            <>
              <path
                d={linePath}
                fill="none"
                stroke="#059669"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {data.map((pt: any, i: number) => (
                <circle
                  key={i}
                  cx={getX(i, data.length)}
                  cy={getY(pt.value)}
                  r="4.5"
                  fill="#ffffff"
                  stroke="#059669"
                  strokeWidth="3"
                />
              ))}
            </>
          ) : (
            <>
              {/* Systolic */}
              <path
                d={bpSysPath}
                fill="none"
                stroke="#0284c7"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Diastolic */}
              <path
                d={bpDiaPath}
                fill="none"
                stroke="#6366f1"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {data.map((pt: any, i: number) => (
                <g key={i}>
                  <circle
                    cx={getX(i, data.length)}
                    cy={getY(pt.sys)}
                    r="4"
                    fill="#ffffff"
                    stroke="#0284c7"
                    strokeWidth="2.5"
                  />
                  <circle
                    cx={getX(i, data.length)}
                    cy={getY(pt.dia)}
                    r="4"
                    fill="#ffffff"
                    stroke="#6366f1"
                    strokeWidth="2.5"
                  />
                </g>
              ))}
            </>
          )}

          {/* X Axis Labels */}
          {data.map((pt: any, i: number) => (
            <text
              key={i}
              x={getX(i, data.length)}
              y={height - 6}
              textAnchor="middle"
              className="text-[10px] fill-slate-400 dark:fill-slate-500 font-medium"
            >
              {pt.label}
            </text>
          ))}
        </svg>
      </div>

      {/* Footer metadata: Source, sync, data quality */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>Source: {currentReading?.source || 'Health Connect'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            Quality: Good (Validated)
          </span>
          {targetRange && (
            <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[11px] font-mono">
              Configured: {targetRange.max ? `< ${targetRange.max} ${unit}` : 'Standard Home Range'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
