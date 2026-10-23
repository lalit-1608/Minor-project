import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import {
  getStudySnippets,
  getDiagnosticQuestions
} from '../services/learningContentService';
import {
  calculateFacultyLearnerAnalytics
} from '../services/quizData';
import {
  BookOpen,
  Brain,
  FileCheck2,
  BarChart3,
  Users,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  FlaskConical,
  GraduationCap
} from 'lucide-react';

export function EducatorDashboardPage() {
  const { currentUser } = useAuth();
  const { feedback, subjects } = useData();

  const facultyId = currentUser?.facultyId || 'fac-1';
  const facultyName = currentUser?.name || 'Mr. Ashok Rathi';

  // Assigned courses for faculty (CS701 and CS501 for demo faculty fac-1)
  const assignedSubjectCodes = useMemo(() => {
    if (facultyId === 'fac-1') {
      return ['CS701', 'CS501'];
    }
    const taught = subjects.filter(s => s.facultyIds && s.facultyIds.includes(facultyId));
    return taught.length > 0 ? taught.map(s => s.code) : ['CS701', 'CS501'];
  }, [facultyId, subjects]);

  // Content authored by this faculty
  const facultySnippets = useMemo(() => {
    return getStudySnippets({ facultyId });
  }, [facultyId]);

  const publishedSnippetsCount = facultySnippets.filter(s => s.status === 'published').length;

  const facultyQuestions = useMemo(() => {
    return getDiagnosticQuestions({ facultyId });
  }, [facultyId]);

  const publishedQuestionsCount = facultyQuestions.filter(q => q.status === 'published').length;

  // Learner diagnostic analytics for assigned courses
  const learnerAnalytics = useMemo(() => {
    return calculateFacultyLearnerAnalytics(assignedSubjectCodes);
  }, [assignedSubjectCodes]);

  // Anonymous feedback for this faculty
  const myFeedback = useMemo(() => {
    return feedback.filter(fb => fb.facultyId === facultyId);
  }, [feedback, facultyId]);

  const collectedFeedbackCount = myFeedback.filter(fb => fb.dataProvenance === 'collected').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-indigo-950 via-slate-900 to-slate-900 border border-indigo-900/40 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <FlaskConical className="w-3.5 h-3.5 text-indigo-400" />
              <span>Educator Research & Diagnostic Studio</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Welcome, {facultyName}
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Design misconception-driven diagnostic materials, inspect collected learner calibration patterns and misconception evidence when available, and connect qualitative feedback to verified pedagogical interventions.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
            <Link
              to="/educator/content"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
            >
              <BookOpen className="w-4 h-4" />
              <span>Content Studio</span>
            </Link>
            <Link
              to="/educator/learner-analytics"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs sm:text-sm transition-all"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Learner Diagnostics</span>
            </Link>
          </div>
        </div>

        {/* Research Alignment Badge */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Assigned Courses: {assignedSubjectCodes.join(', ')}</span>
          </div>
          <span className="text-slate-600">•</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            <span>Point 4 Research-Driven Prototype</span>
          </div>
          <span className="text-slate-600">•</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Zero ERP / Administrative Coupling</span>
          </div>
        </div>
      </div>

      {/* Core Research Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Published Snippets */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Study Snippets
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {publishedSnippetsCount}
              <span className="text-xs font-medium text-slate-400 ml-1.5">published</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {facultySnippets.length} total authored snippets
            </p>
          </div>
          <Link
            to="/educator/content"
            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline pt-1"
          >
            <span>Manage snippets</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Diagnostic Questions */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Diagnostic Questions
            </span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <Brain className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {publishedQuestionsCount}
              <span className="text-xs font-medium text-slate-400 ml-1.5">active</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              With distractor misconception taxonomy
            </p>
          </div>
          <Link
            to="/educator/content"
            className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline pt-1"
          >
            <span>Author questions</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Diagnostic Attempts */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Learner Attempts
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {learnerAnalytics.totalAttempts}
              <span className="text-xs font-medium text-slate-400 ml-1.5">attempts</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {learnerAnalytics.uniqueLearners} unique enrolled learners
            </p>
          </div>
          <Link
            to="/educator/learner-analytics"
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline pt-1"
          >
            <span>View error patterns</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Anonymous Feedback */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Feedback Records
            </span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {myFeedback.length}
              <span className="text-xs font-medium text-slate-400 ml-1.5">records</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {collectedFeedbackCount} collected ({myFeedback.length - collectedFeedbackCount} demo)
            </p>
          </div>
          <Link
            to="/feedback-records"
            className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline pt-1"
          >
            <span>Inspect comments</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Two Column Grid: Assigned Courses & Action Pathways */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Assigned Courses & Learning Calibration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Assigned Courses Detail */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-indigo-600" />
                  <span>Assigned Courses & Diagnostic Focus</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Pedagogical scope for educator {facultyName}
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold">
                {assignedSubjectCodes.length} Courses
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* CS701 Card */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                      CS701
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                      Machine Learning
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Semester 7 • Dept CSE
                    </p>
                  </div>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    Active
                  </span>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700">
                  <p className="font-semibold text-slate-700 dark:text-slate-200">Key Cognitive Trap:</p>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                    Base Rate Fallacy in high-precision medical diagnostic classifiers.
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs pt-1">
                  <Link
                    to="/educator/content"
                    className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Author Snippets
                  </Link>
                  <Link
                    to="/misconceptions"
                    className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                  >
                    View Analytics →
                  </Link>
                </div>
              </div>

              {/* CS501 Card */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300">
                      CS501
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                      Database Management Systems
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Semester 5 • Dept CSE
                    </p>
                  </div>
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                    Active
                  </span>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700">
                  <p className="font-semibold text-slate-700 dark:text-slate-200">Key Cognitive Trap:</p>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                    Three-Valued Logic NULL predicate negation trap in SQL WHERE clauses.
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs pt-1">
                  <Link
                    to="/educator/content"
                    className="font-bold text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    Author Snippets
                  </Link>
                  <Link
                    to="/misconceptions"
                    className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                  >
                    View Analytics →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Cognitive Traps & Calibration Summary */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <span>Learner Calibration Gaps (Assigned Courses)</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Students confident in wrong answers require immediate conceptual remediation
                </p>
              </div>
              <Link
                to="/educator/learner-analytics"
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Deep-dive →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/60 text-center">
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-300 block">
                  High-Conf Errors Rate
                </span>
                <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
                  {learnerAnalytics.totalQuestionsAnswered > 0
                    ? `${Math.round((learnerAnalytics.highConfidenceErrorsCount / learnerAnalytics.totalQuestionsAnswered) * 100)}%`
                    : 'N/A'}
                </span>
                <span className="text-[10px] text-amber-700/80 dark:text-amber-400 block mt-0.5">
                  Misconception trap susceptibility
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/60 text-center">
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 block">
                  Error Correction Rate
                </span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {learnerAnalytics.immediateErrorCorrectionRate != null
                    ? `${learnerAnalytics.immediateErrorCorrectionRate}%`
                    : 'Pending Data'}
                </span>
                <span className="text-[10px] text-emerald-700/80 dark:text-emerald-400 block mt-0.5">
                  Paired items corrected on retake
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-900/60 text-center">
                <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 block">
                  Diagnostic Accuracy
                </span>
                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                  {learnerAnalytics.averageAccuracy != null
                    ? `${learnerAnalytics.averageAccuracy}%`
                    : 'N/A'}
                </span>
                <span className="text-[10px] text-indigo-700/80 dark:text-indigo-400 block mt-0.5">
                  Mean score on diagnostic items
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Research Action Pathways */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-indigo-600" />
              <span>Research Workflows</span>
            </h3>

            <div className="space-y-2.5">
              <Link
                to="/educator/content"
                className="group block p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        Educational Content Studio
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Author snippets & diagnostic items
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>

              <Link
                to="/educator/learner-analytics"
                className="group block p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400">
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                        Learner Diagnostics
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Misconceptions in CS701 & CS501
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>

              <Link
                to="/feedback-records"
                className="group block p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-500 dark:hover:border-amber-500 hover:bg-amber-50/40 dark:hover:bg-amber-950/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400">
                        My Feedback Insights
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Scoped anonymous student comments
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>

              <Link
                to="/pedagogical-adjustments"
                className="group block p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-purple-500 dark:hover:border-purple-500 hover:bg-purple-50/40 dark:hover:bg-purple-950/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-400">
                      <FileCheck2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
                        Feedback-to-Action Loop
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Document pedagogical adjustments
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>

              <Link
                to={`/faculty/${facultyId}`}
                className="group block p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-sky-500 dark:hover:border-sky-500 hover:bg-sky-50/40 dark:hover:bg-sky-950/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-sky-100 dark:bg-sky-900/60 text-sky-600 dark:text-sky-400">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400">
                        My Teaching Dossier
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Individual pedagogical performance report
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            </div>
          </div>

          {/* Research Decoupling Guarantee Notice */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-900/60 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-indigo-900 dark:text-indigo-200">
              <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>University Research Architecture</span>
            </div>
            <p className="text-indigo-800/80 dark:text-indigo-300/80 text-[11px] leading-relaxed">
              Diagnostic test records track learning calibration (Point 4). Anonymous student feedback is strictly decoupled with zero student identifiers to preserve uninhibited evaluation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default EducatorDashboardPage;
