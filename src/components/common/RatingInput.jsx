import React from 'react';
import { Star } from 'lucide-react';

const RATING_LEVELS = [
  { value: 1, label: 'Very Poor', description: 'Significant gaps; below expectations', color: 'hover:border-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30' },
  { value: 2, label: 'Poor', description: 'Needs considerable improvement', color: 'hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30' },
  { value: 3, label: 'Average', description: 'Meets basic academic criteria', color: 'hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30' },
  { value: 4, label: 'Good', description: 'Thorough, engaging, and consistent', color: 'hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30' },
  { value: 5, label: 'Excellent', description: 'Exceptional mastery and delivery', color: 'hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30' },
];

export function RatingInput({
  label,
  description,
  value,
  onChange,
  error,
  required = true
}) {
  const currentLevel = RATING_LEVELS.find(lvl => lvl.value === value);

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <div>
          <label className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
            {label}
            {required && <span className="text-rose-500 font-bold" title="Required field">*</span>}
          </label>
          {description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {description}
            </p>
          )}
        </div>
        {currentLevel ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            <span className="font-bold">{currentLevel.value}</span> — {currentLevel.label}
          </span>
        ) : (
          <span className="text-xs text-slate-400 dark:text-slate-500 italic">
            Select rating (1–5)
          </span>
        )}
      </div>

      {/* Interactive 1 to 5 selector */}
      <div className="grid grid-cols-5 gap-2 pt-1" role="radiogroup" aria-label={label}>
        {RATING_LEVELS.map((lvl) => {
          const isSelected = value === lvl.value;
          return (
            <button
              key={lvl.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(lvl.value)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200 dark:shadow-none'
                  : `bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 ${lvl.color}`
              }`}
            >
              <div className="flex items-center gap-0.5 mb-1">
                <Star
                  className={`w-4 h-4 ${
                    isSelected
                      ? 'fill-amber-300 text-amber-300'
                      : value && lvl.value <= value
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-300 dark:text-slate-600'
                  }`}
                />
              </div>
              <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                {lvl.value}
              </span>
              <span className={`text-[10px] hidden sm:block truncate w-full mt-0.5 ${
                isSelected ? 'text-indigo-100 font-medium' : 'text-slate-500 dark:text-slate-400'
              }`}>
                {lvl.label}
              </span>
            </button>
          );
        })}
      </div>

      {error && (
        <p className="text-xs text-rose-500 font-medium mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
