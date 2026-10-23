import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';
import { useData } from '../../context/DataContext';

export function Footer() {
  const { settings } = useData();

  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-6 px-4 sm:px-8 transition-colors no-print">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            StudySnippet
          </span>
          <span>•</span>
          <span>Educational Technology Research Platform</span>
          <span>•</span>
          <span>&copy; {new Date().getFullYear()}</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            Identity Not Stored
          </span>
          <span>•</span>
          <span className="text-slate-400">
            Misconception-Aware Learning & Feedback Analytics
          </span>
        </div>
      </div>
    </footer>
  );
}
