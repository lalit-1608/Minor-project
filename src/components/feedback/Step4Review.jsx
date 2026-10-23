import React from 'react';
import { ArrowLeft, CheckCircle2, Edit3, Send, ShieldCheck, Star } from 'lucide-react';
import { PARAMETER_KEYS, PARAMETER_LABELS } from '../../utils/calculations';

export function Step4Review({
  formData,
  ratings,
  comment,
  departments,
  facultyList,
  subjectsList,
  onBack,
  onEditStep,
  onSubmit,
  isSubmitting
}) {
  const selectedDept = departments.find(d => d.id === formData.departmentId);
  const selectedFaculty = facultyList.find(f => f.id === formData.facultyId);
  const selectedSubject = subjectsList.find(s => s.id === formData.subjectId);

  const overallAvg = (
    PARAMETER_KEYS.reduce((sum, key) => sum + (ratings[key] || 0), 0) / 6
  ).toFixed(2);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Review Your Anonymous Evaluation
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Verify your ratings before final submission. Once submitted, records cannot be altered.
        </p>
      </div>

      {/* Course Context Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Course & Faculty Details
          </h3>
          <button
            type="button"
            onClick={() => onEditStep(1)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Faculty Member</span>
            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
              {selectedFaculty?.name || '—'}
            </span>
            <span className="text-slate-500 block text-[11px]">{selectedFaculty?.designation}</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Subject</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              {selectedSubject?.name || '—'}
            </span>
            <span className="text-slate-500 block text-[11px]">Code: {selectedSubject?.code}</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Department</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
              {selectedDept?.name || '—'}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Semester</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
              Semester {formData.semester}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Class Section</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
              {formData.className}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Overall Rating</span>
            <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
              {overallAvg} / 5.0
            </span>
          </div>
        </div>
      </div>

      {/* Ratings Summary Breakdown */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Parameter Ratings Breakdown
          </h3>
          <button
            type="button"
            onClick={() => onEditStep(2)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PARAMETER_KEYS.map((key) => {
            const score = ratings[key] || 0;
            return (
              <div
                key={key}
                className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {PARAMETER_LABELS[key]}
                  </p>
                  <div className="flex items-center gap-0.5 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < score
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-200 dark:text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-base font-extrabold text-slate-900 dark:text-white">
                    {score}
                  </span>
                  <span className="text-[10px] text-slate-400">/5</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Constructive Comment Preview */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Constructive Comments
          </h3>
          <button
            type="button"
            onClick={() => onEditStep(3)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        </div>

        {comment ? (
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 leading-relaxed">
            "{comment}"
          </p>
        ) : (
          <p className="text-xs text-slate-400 italic">
            No comment provided (optional).
          </p>
        )}
      </div>

      {/* Privacy Guarantee Banner */}
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-800 dark:text-emerald-300">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
        <span>
          <strong>Guaranteed Anonymity:</strong> Your student ID, IP, and personal identifiers are never stored. The institutional dashboard displays only aggregated metrics.
        </span>
      </div>

      {/* Actions */}
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
          onClick={onSubmit}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-indigo-200 dark:shadow-none transition-all cursor-pointer"
        >
          {isSubmitting ? (
            <span>Submitting...</span>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit Feedback</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
