import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { DataProvenanceBadge } from '../components/research/DataProvenanceBadge';
import {
  CheckCircle2,
  Send,
  PlusCircle,
  FileCheck2,
  Sparkles,
  Award,
  ThumbsUp,
  AlertTriangle,
  Info,
  ArrowRight
} from 'lucide-react';

export function PedagogicalAdjustmentsPage() {
  const { role, currentUser, isAdmin } = useAuth();
  const { adjustments = [], saveAdjustment, updateAdjustmentReview, subjects } = useData();
  const { addToast } = useToast();

  const facultyId = currentUser?.facultyId || currentUser?.id || 'fac-1';
  const assignedSubjects = useMemo(() => {
    if (role === 'faculty') {
      const assigned = subjects.filter(s => s.facultyIds && s.facultyIds.includes(facultyId));
      if (assigned.length > 0) return assigned;
      return subjects.filter(s => ['CS501', 'CS701'].includes(s.code));
    }
    return subjects;
  }, [role, facultyId, subjects]);

  const [formData, setFormData] = useState({
    subjectId: assignedSubjects[0]?.id || subjects[0]?.id || '',
    thematicCategory: 'Lecture Pacing & Clarity',
    feedbackPattern: '',
    intervention: '',
    term: 'Spring 2026',
    week: 'Week 6'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewNotesInput, setReviewNotesInput] = useState('');
  const [selectedReviewId, setSelectedReviewId] = useState(null);

  const CATEGORIES = [
    'Lecture Pacing & Clarity',
    'Hands-on Practice & Labs',
    'Doubt Clearing & Office Hours',
    'Exam & Grading Help',
    'Class Engagement'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (role !== 'faculty') {
      addToast('Only faculty educators may log pedagogical adjustments.', 'error');
      return;
    }
    if (!formData.feedbackPattern.trim() || !formData.intervention.trim()) {
      addToast('Please fill in both fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const effectiveSubjectId = formData.subjectId || assignedSubjects[0]?.id;
      const selectedSubject = subjects.find(s => s.id === effectiveSubjectId);
      await saveAdjustment({
        facultyId: currentUser?.facultyId || facultyId,
        facultyName: currentUser?.name || 'Mr. Ashok Rathi',
        subjectId: effectiveSubjectId,
        subjectName: selectedSubject ? `${selectedSubject.name} (${selectedSubject.code})` : 'Course',
        thematicCategory: formData.thematicCategory,
        feedbackPattern: formData.feedbackPattern.trim(),
        intervention: formData.intervention.trim(),
        term: formData.term,
        week: formData.week,
        status: 'Implemented'
      });

      addToast('Improvement logged successfully!', 'success');
      setFormData(prev => ({ ...prev, feedbackPattern: '', intervention: '' }));
    } catch (err) {
      addToast('Failed to save improvement.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = async (id) => {
    if (!isAdmin) {
      addToast('Only academic oversight administrators may verify adjustments.', 'error');
      return;
    }
    try {
      await updateAdjustmentReview(id, {
        hodNotes: reviewNotesInput || 'Verified under academic oversight.',
        status: 'Implemented'
      });
      addToast('Adjustment verified under academic oversight!', 'success');
      setSelectedReviewId(null);
      setReviewNotesInput('');
    } catch (err) {
      addToast('Failed to verify.', 'error');
    }
  };

  const collectedAdjustmentsCount = useMemo(() => adjustments.filter(a => a.dataProvenance === 'collected').length, [adjustments]);
  const demoAdjustmentsCount = useMemo(() => adjustments.filter(a => a.dataProvenance === 'demo' || a.isDemo).length, [adjustments]);

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-bold mb-1.5">
          <FileCheck2 className="w-3.5 h-3.5 text-purple-600" />
          <span>Feedback-to-Action Research Loop</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Pedagogical Adjustments & Action Research Loop
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          This module records whether recurring student feedback leads to a documented teaching adjustment, enabling later evaluation of the feedback-to-action loop.
        </p>
      </div>

      {/* Data Provenance Badge */}
      <DataProvenanceBadge
        state={collectedAdjustmentsCount > 0 ? "collected" : "demo"}
        label={
          collectedAdjustmentsCount > 0
            ? `Recorded Pedagogical Adjustments (${collectedAdjustmentsCount} collected, ${demoAdjustmentsCount} demo)`
            : `Demo Pedagogical Adjustments (${demoAdjustmentsCount} seed records) — Not an Experimental Finding`
        }
        sampleSize={collectedAdjustmentsCount > 0 ? collectedAdjustmentsCount : demoAdjustmentsCount}
      />

      {/* Conceptual Research Process Flow */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Feedback-to-Action Methodology:
        </span>
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
          <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold">
            1. Anonymous Feedback
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold">
            2. Feedback Categorisation
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold">
            3. Theme Identification
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-semibold">
            4. Educator Action
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold">
            5. Follow-Up & Evaluation
          </span>
        </div>
      </div>

      {/* 3 Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 block">Recorded Actions</span>
          <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
            {collectedAdjustmentsCount > 0 ? collectedAdjustmentsCount : "0 Collected"}
          </div>
          <p className="text-[10px] text-slate-400">
            {collectedAdjustmentsCount > 0 ? `${collectedAdjustmentsCount} collected actions` : `0 collected • ${demoAdjustmentsCount} demo records`}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 block">Academic Oversight</span>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {adjustments.filter(a => a.hodReviewed).length} / {adjustments.length}
          </div>
          <p className="text-[10px] text-slate-400">Verified under academic oversight</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 block">Empirical Impact Metric</span>
          <div className="text-xl font-bold text-slate-500 dark:text-slate-400 pt-1">
            Pending Study
          </div>
          <p className="text-[10px] text-slate-400">
            Impact measurement pending participant data
          </p>
        </div>
      </div>

      {/* Real Example Cards */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-3">
        <div className="space-y-0.5">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Why Anonymous Written Feedback Matters:</span>
          </h2>
          <p className="text-xs text-slate-500">
            Students can provide precise suggestions on pacing and labs that simple scores cannot capture!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 text-xs space-y-2">
            <div className="flex items-center justify-between font-bold">
              <span className="text-slate-900 dark:text-white">Machine Learning (CS701)</span>
              {isAdmin ? (
                <span className="text-emerald-600">Rating: 4.7 ⭐</span>
              ) : (
                <span className="text-emerald-600">High Satisfaction</span>
              )}
            </div>
            <p className="text-slate-500">
              <strong>What students said:</strong> "Formulas were explained too fast in the second half of class."
            </p>
            <p className="text-indigo-600 dark:text-indigo-400 font-medium">
              <strong>Action taken:</strong> Teacher split complex formulas into 2 lectures and shared step-by-step notes.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 text-xs space-y-2">
            <div className="flex items-center justify-between font-bold">
              <span className="text-slate-900 dark:text-white">Database Systems (CS501)</span>
              {isAdmin ? (
                <span className="text-blue-600">Rating: 4.2 ⭐</span>
              ) : (
                <span className="text-blue-600">Constructive Feedback</span>
              )}
            </div>
            <p className="text-slate-500">
              <strong>What students said:</strong> "Wanted to write real SQL queries on laptops instead of only theory slides."
            </p>
            <p className="text-indigo-600 dark:text-indigo-400 font-medium">
              <strong>Action taken:</strong> Added 20 minutes of live coding in every Friday lab.
            </p>
          </div>
        </div>
      </div>

      {/* Teacher Form: Add an improvement (Faculty Only) */}
      {role === 'faculty' ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-indigo-600" />
                <span>Log a Class Improvement (For Teachers)</span>
              </h2>
              <p className="text-xs text-slate-400">Document changes you made based on student feedback for your assigned courses:</p>
            </div>
            <span className="text-xs font-bold text-indigo-600">
              {currentUser?.name}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Assigned Course *
                </label>
                <select
                  value={formData.subjectId}
                  onChange={(e) => setFormData(prev => ({ ...prev, subjectId: e.target.value }))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                >
                  {assignedSubjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Category *
                </label>
                <select
                  value={formData.thematicCategory}
                  onChange={(e) => setFormData(prev => ({ ...prev, thematicCategory: e.target.value }))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                What did students ask for in their feedback? *
              </label>
              <input
                type="text"
                required
                value={formData.feedbackPattern}
                onChange={(e) => setFormData(prev => ({ ...prev, feedbackPattern: e.target.value }))}
                placeholder="e.g. Students wanted more hands-on coding demos..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                What did you change in class to fix it? *
              </label>
              <textarea
                rows={2}
                required
                value={formData.intervention}
                onChange={(e) => setFormData(prev => ({ ...prev, intervention: e.target.value }))}
                placeholder="e.g. Added live coding walkthroughs every Thursday lab session..."
                className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Save Class Improvement</span>
            </button>
          </form>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 font-semibold flex items-center gap-2">
          <Info className="w-4 h-4 shrink-0" />
          <span>Academic Oversight View: Pedagogical adjustments are authored by faculty educators. Review logged adjustments and verify their implementation below.</span>
        </div>
      )}

      {/* List of Improvements */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-3">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">
          All Verified Class Improvements:
        </h2>

        <div className="space-y-3">
          {adjustments.map((adj) => (
            <div
              key={adj.id}
              className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 space-y-2"
            >
              <div className="flex flex-wrap items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{adj.facultyName}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{adj.subjectName}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    adj.dataProvenance === 'collected'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
                      : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800'
                  }`}>
                    {adj.dataProvenance === 'collected' ? 'Collected Action' : 'Demo Record'}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    {adj.thematicCategory}
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <p><strong>Student Request:</strong> <span className="italic">"{adj.feedbackPattern}"</span></p>
                <p><strong>Change Made:</strong> {adj.intervention}</p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                {adj.hodReviewed ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Oversight Verified: {adj.hodNotes}</span>
                  </span>
                ) : (
                  <span className="text-amber-600 font-medium">Pending Academic Review</span>
                )}

                {!adj.hodReviewed && isAdmin && (
                  <button
                    onClick={() => handleApprove(adj.id)}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-[11px] cursor-pointer"
                  >
                    Verify Adjustment
                  </button>
                )}
                {!adj.hodReviewed && !isAdmin && (
                  <span className="text-[11px] text-slate-400 italic">
                    Pending Oversight Verification
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
