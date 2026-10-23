import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, Home, BarChart3, MessageSquarePlus, ShieldCheck, Sparkles } from 'lucide-react';

export function FeedbackSuccessPage() {
  const { isAdmin } = useAuth();
  const location = useLocation();
  const state = location.state || {};

  const {
    facultyName = 'Faculty Member',
    facultyDesignation,
    subjectName = 'Academic Course',
    subjectCode,
    semester,
    className
  } = state;

  return (
    <div className="max-w-xl mx-auto py-12 px-4 text-center space-y-6">
      {/* Success Badge & Animation */}
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border-4 border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-lg shadow-emerald-100 dark:shadow-none animate-in zoom-in-75 duration-300">
          <CheckCircle2 className="w-12 h-12" />
        </div>
      </div>

      {/* Main Success Title */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          ✓ Feedback Submitted
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300 max-w-md mx-auto">
          Thank you for helping improve teaching quality.
        </p>
        <p className="text-xs text-slate-400">
          Student identity is not stored with submitted feedback in this prototype.
        </p>
      </div>

      {/* Submitted Details Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm text-left space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Submission Confirmation
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            Identity Not Stored
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Faculty</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white block">
              {facultyName}
            </span>
            {facultyDesignation && (
              <span className="text-slate-500 text-[11px]">{facultyDesignation}</span>
            )}
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Subject</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white block">
              {subjectName}
            </span>
            {subjectCode && (
              <span className="text-slate-500 text-[11px]">Code: {subjectCode}</span>
            )}
          </div>

          {semester && (
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Semester</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Semester {semester}
              </span>
            </div>
          )}

          {className && (
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Class Section</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {className}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <Link
          to="/feedback"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-200 dark:shadow-none transition-all"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span>Submit Another Feedback</span>
        </Link>

        {isAdmin ? (
          <Link
            to="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
          >
            <BarChart3 className="w-4 h-4" />
            <span>View Analytics</span>
          </Link>
        ) : (
          <Link
            to="/quiz"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>Try Practice Quiz</span>
          </Link>
        )}

        <Link
          to="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
