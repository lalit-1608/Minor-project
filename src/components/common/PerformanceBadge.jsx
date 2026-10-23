import React from 'react';
import { Award, CheckCircle, AlertTriangle, AlertOctagon, HelpCircle } from 'lucide-react';

export function PerformanceBadge({ statusInfo, size = 'md' }) {
  if (!statusInfo) return null;

  const { status, code, badgeClass } = statusInfo;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-medium',
    lg: 'px-3 py-1.5 text-sm font-semibold'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4'
  };

  const getIcon = () => {
    switch (code) {
      case 'top':
        return <Award className={`${iconSizes[size]} text-emerald-600 dark:text-emerald-400`} />;
      case 'strong':
        return <CheckCircle className={`${iconSizes[size]} text-blue-600 dark:text-blue-400`} />;
      case 'opportunity':
        return <AlertTriangle className={`${iconSizes[size]} text-amber-600 dark:text-amber-400`} />;
      case 'improvement':
        return <AlertOctagon className={`${iconSizes[size]} text-rose-600 dark:text-rose-400`} />;
      default:
        return <HelpCircle className={`${iconSizes[size]} text-slate-500 dark:text-slate-400`} />;
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border shadow-sm ${badgeClass} ${sizeClasses[size]}`}>
      {getIcon()}
      <span>{status}</span>
    </span>
  );
}
