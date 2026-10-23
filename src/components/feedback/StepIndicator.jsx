import React from 'react';
import { Check } from 'lucide-react';

const STEPS = [
  { step: 1, title: 'Course Details', desc: 'Select Faculty & Subject' },
  { step: 2, title: 'Ratings', desc: '6 Core Parameters' },
  { step: 3, title: 'Comments', desc: 'Constructive Feedback' },
  { step: 4, title: 'Review', desc: 'Confirm & Submit' },
];

export function StepIndicator({ currentStep, onStepClick }) {
  return (
    <div className="w-full mb-8">
      {/* Mobile Step Bar */}
      <div className="sm:hidden flex items-center justify-between mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          Step {currentStep} of 4: {STEPS[currentStep - 1].title}
        </span>
        <span className="text-xs text-slate-500">
          {Math.round((currentStep / 4) * 100)}%
        </span>
      </div>
      <div className="sm:hidden w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
        <div
          className="bg-indigo-600 h-full transition-all duration-300 ease-out"
          style={{ width: `${(currentStep / 4) * 100}%` }}
        />
      </div>

      {/* Desktop Step Bar */}
      <div className="hidden sm:grid grid-cols-4 gap-4">
        {STEPS.map((s) => {
          const isCompleted = currentStep > s.step;
          const isCurrent = currentStep === s.step;

          return (
            <div
              key={s.step}
              onClick={() => isCompleted && onStepClick && onStepClick(s.step)}
              className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                isCurrent
                  ? 'bg-white dark:bg-slate-900 border-indigo-600 dark:border-indigo-500 shadow-sm ring-2 ring-indigo-500/10'
                  : isCompleted
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900 cursor-pointer hover:bg-emerald-50'
                  : 'bg-white/40 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all shrink-0 ${
                  isCompleted
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : isCurrent
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : s.step}
              </div>
              <div className="min-w-0">
                <p className={`text-xs font-bold truncate ${
                  isCurrent
                    ? 'text-slate-900 dark:text-white'
                    : isCompleted
                    ? 'text-emerald-900 dark:text-emerald-300'
                    : 'text-slate-500 dark:text-slate-400'
                }`}>
                  {s.title}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {s.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
