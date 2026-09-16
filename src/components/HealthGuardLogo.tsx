import React from 'react';
import { Shield, Activity, Heart } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon-only';
  className?: string;
}

export const HealthGuardLogo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'full',
  className = '',
}) => {
  const sizeClasses = {
    sm: { icon: 'w-6 h-6', text: 'text-lg', sub: 'text-xs' },
    md: { icon: 'w-8 h-8', text: 'text-xl', sub: 'text-xs' },
    lg: { icon: 'w-11 h-11', text: 'text-2xl', sub: 'text-sm' },
  }[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`} id="healthguard-brand-logo">
      <div className="relative flex items-center justify-center bg-emerald-600 text-white rounded-xl p-2 shadow-sm">
        <Shield className={`${sizeClasses.icon} text-white`} />
        <div className="absolute inset-0 flex items-center justify-center">
          <Activity className="w-3.5 h-3.5 text-emerald-200 animate-pulse" />
        </div>
      </div>
      {variant === 'full' && (
        <div className="flex flex-col leading-tight">
          <span className={`font-bold tracking-tight text-slate-900 dark:text-white ${sizeClasses.text}`}>
            Health<span className="text-emerald-600">Guard</span>
          </span>
          <span className={`text-slate-500 dark:text-slate-400 font-medium ${sizeClasses.sub}`}>
            Your Health. Your People.
          </span>
        </div>
      )}
    </div>
  );
};
