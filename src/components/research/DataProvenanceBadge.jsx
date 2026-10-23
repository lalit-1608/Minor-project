import React from 'react';
import { Database, FlaskConical, AlertCircle, Info } from 'lucide-react';

/**
 * DataProvenanceBadge — Reusable data transparency component for research pages.
 * 
 * States:
 *   "collected"     — Real participant data
 *   "demo"          — Synthetic / demonstration data
 *   "insufficient"  — Not enough collected data yet
 * 
 * Props:
 *   state: 'collected' | 'demo' | 'insufficient'
 *   label: Optional custom label text
 *   sampleSize: Optional number to display (e.g., n=18)
 *   compact: If true, renders smaller inline version
 *   className: Additional CSS classes
 */

const PROVENANCE_CONFIG = {
  collected: {
    icon: Database,
    label: 'Collected Data',
    description: 'Based on collected participant responses',
    bgClass: 'bg-emerald-50 dark:bg-emerald-950/40',
    borderClass: 'border-emerald-200 dark:border-emerald-800',
    textClass: 'text-emerald-800 dark:text-emerald-300',
    iconClass: 'text-emerald-600 dark:text-emerald-400',
    dotClass: 'bg-emerald-500'
  },
  demo: {
    icon: FlaskConical,
    label: 'Demo Data',
    description: 'Synthetic demonstration dataset — not an experimental finding',
    bgClass: 'bg-amber-50 dark:bg-amber-950/40',
    borderClass: 'border-amber-200 dark:border-amber-800',
    textClass: 'text-amber-800 dark:text-amber-300',
    iconClass: 'text-amber-600 dark:text-amber-400',
    dotClass: 'bg-amber-500'
  },
  insufficient: {
    icon: AlertCircle,
    label: 'Insufficient Data',
    description: 'Not enough participant data yet',
    bgClass: 'bg-slate-50 dark:bg-slate-800/60',
    borderClass: 'border-slate-200 dark:border-slate-700',
    textClass: 'text-slate-600 dark:text-slate-400',
    iconClass: 'text-slate-400 dark:text-slate-500',
    dotClass: 'bg-slate-400'
  }
};

export function DataProvenanceBadge({ state, provenance, label, sampleSize, compact = false, className = '' }) {
  const resolvedState = state || provenance || 'demo';
  const config = PROVENANCE_CONFIG[resolvedState] || PROVENANCE_CONFIG.demo;
  const Icon = config.icon;
  const displayLabel = label || config.label;

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${config.bgClass} ${config.borderClass} ${config.textClass} ${className}`}
        title={config.description}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass} shrink-0`} />
        <span>{displayLabel}</span>
        {sampleSize != null && <span className="opacity-70">(n={sampleSize})</span>}
      </span>
    );
  }

  return (
    <div className={`flex items-start gap-2.5 p-3 rounded-xl border ${config.bgClass} ${config.borderClass} ${className}`}>
      <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${config.iconClass}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-bold ${config.textClass}`}>
            {displayLabel}
          </span>
          {sampleSize != null && (
            <span className={`text-[10px] font-semibold ${config.textClass} opacity-70`}>
              n = {sampleSize}
            </span>
          )}
        </div>
        <p className={`text-[11px] mt-0.5 ${config.textClass} opacity-80`}>
          {config.description}
        </p>
      </div>
    </div>
  );
}

export default DataProvenanceBadge;
