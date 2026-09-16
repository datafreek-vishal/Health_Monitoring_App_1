import React from 'react';
import { ShieldCheck, AlertCircle, AlertTriangle, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { AlertSeverity } from '../types';

interface HealthStatusBadgeProps {
  severity: AlertSeverity;
  size?: 'sm' | 'md' | 'lg';
  showLabelPrefix?: boolean;
  className?: string;
}

export const HealthStatusBadge: React.FC<HealthStatusBadgeProps> = ({
  severity,
  size = 'md',
  showLabelPrefix = true,
  className = '',
}) => {
  const configs = {
    NORMAL: {
      label: 'Stable',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
      textColor: 'text-emerald-700 dark:text-emerald-300',
      borderColor: 'border-emerald-200 dark:border-emerald-800',
      icon: CheckCircle2,
      dotColor: 'bg-emerald-500',
    },
    WARNING: {
      label: 'Needs Attention',
      bgColor: 'bg-amber-50 dark:bg-amber-950/40',
      textColor: 'text-amber-800 dark:text-amber-300',
      borderColor: 'border-amber-200 dark:border-amber-800',
      icon: AlertCircle,
      dotColor: 'bg-amber-500',
    },
    URGENT: {
      label: 'Urgent',
      bgColor: 'bg-orange-50 dark:bg-orange-950/40',
      textColor: 'text-orange-800 dark:text-orange-300',
      borderColor: 'border-orange-200 dark:border-orange-800',
      icon: AlertTriangle,
      dotColor: 'bg-orange-500',
    },
    EMERGENCY: {
      label: 'Emergency Alert Active',
      bgColor: 'bg-rose-50 dark:bg-rose-950/40',
      textColor: 'text-rose-800 dark:text-rose-200',
      borderColor: 'border-rose-300 dark:border-rose-800',
      icon: AlertOctagon,
      dotColor: 'bg-rose-600',
    },
    RESOLVED: {
      label: 'Resolved / Normal',
      bgColor: 'bg-slate-100 dark:bg-slate-800',
      textColor: 'text-slate-700 dark:text-slate-300',
      borderColor: 'border-slate-300 dark:border-slate-700',
      icon: ShieldCheck,
      dotColor: 'bg-slate-500',
    },
  };

  const config = configs[severity] || configs.NORMAL;
  const IconComponent = config.icon;

  const sizeStyles = {
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3.5 py-1.5 text-sm gap-2',
    lg: 'px-4 py-2 text-base gap-2.5',
  }[size];

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }[size];

  return (
    <div
      id={`health-status-badge-${severity.toLowerCase()}`}
      className={`inline-flex items-center font-medium rounded-full border ${config.bgColor} ${config.textColor} ${config.borderColor} ${sizeStyles} ${className} transition-colors`}
      role="status"
      aria-label={`Monitoring status: ${config.label}`}
    >
      <span className={`w-2 h-2 rounded-full ${config.dotColor} shrink-0 animate-pulse`} />
      <IconComponent className={`${iconSizes} shrink-0`} aria-hidden="true" />
      <span className="whitespace-nowrap">
        {showLabelPrefix && <span className="opacity-75 mr-1 font-normal">Monitoring:</span>}
        <strong>{config.label}</strong>
      </span>
    </div>
  );
};
