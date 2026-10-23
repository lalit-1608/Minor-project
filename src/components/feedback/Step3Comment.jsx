import React from 'react';
import { ArrowLeft, ArrowRight, ShieldAlert, MessageSquareText } from 'lucide-react';

export function Step3Comment({ comment, onChange, onBack, onContinue }) {
  const maxLength = 500;
  const currentLength = (comment || '').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Constructive Feedback (Optional)
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Provide actionable feedback to help your professor enhance course delivery and classroom engagement.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <label
            htmlFor="constructive-comment"
            className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2"
          >
            <MessageSquareText className="w-4 h-4 text-indigo-600" />
            Constructive comments
          </label>
          <span
            className={`text-xs font-medium ${
              currentLength > 450
                ? 'text-amber-600 dark:text-amber-400 font-bold'
                : 'text-slate-400'
            }`}
          >
            {currentLength} / {maxLength} characters
          </span>
        </div>

        <textarea
          id="constructive-comment"
          rows={6}
          value={comment}
          maxLength={maxLength}
          onChange={(e) => onChange(e.target.value)}
          placeholder="What does the faculty do well, and what could be improved?"
          className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none leading-relaxed"
        />

        {/* Privacy Note */}
        <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-3 rounded-xl border border-amber-200/80 dark:border-amber-900/60">
          <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600" />
          <span>Please do not include personal information. All comments are displayed anonymously to faculty.</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onContinue}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-200 dark:shadow-none transition-all cursor-pointer"
        >
          <span>Review Submission</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
