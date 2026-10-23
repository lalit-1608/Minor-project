import React from 'react';
import { Star } from 'lucide-react';

export function RatingSummary({ rating, count, percentage, showStars = true, size = 'md' }) {
  const numRating = Number(rating) || 0;
  const starsCount = 5;

  const fontSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  const starSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-6 h-6'
  };

  return (
    <div className="flex items-baseline gap-2.5">
      <span className={`${fontSizes[size]} font-extrabold text-slate-900 dark:text-white tracking-tight`}>
        {numRating.toFixed(2)}
      </span>
      <div className="flex flex-col">
        {showStars && (
          <div className="flex items-center gap-0.5">
            {[...Array(starsCount)].map((_, i) => {
              const fillPercentage = Math.max(0, Math.min(1, numRating - i));
              return (
                <div key={i} className="relative">
                  <Star className={`${starSizes[size]} text-slate-200 dark:text-slate-700`} />
                  {fillPercentage > 0 && (
                    <div
                      className="absolute top-0 left-0 overflow-hidden"
                      style={{ width: `${fillPercentage * 100}%` }}
                    >
                      <Star className={`${starSizes[size]} fill-amber-400 text-amber-400`} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {(count !== undefined || percentage !== undefined) && (
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {count !== undefined && `${count} evaluations`}
            {count !== undefined && percentage !== undefined && ' • '}
            {percentage !== undefined && `${percentage.toFixed(1)}%`}
          </span>
        )}
      </div>
    </div>
  );
}
