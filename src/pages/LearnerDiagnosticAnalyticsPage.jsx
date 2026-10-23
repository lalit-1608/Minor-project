import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { calculateFacultyLearnerAnalytics } from '../services/quizData';
import { DataProvenanceBadge } from '../components/research/DataProvenanceBadge';
import {
  Brain,
  AlertTriangle,
  TrendingUp,
  Users,
  CheckCircle2,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Clock
} from 'lucide-react';

export function LearnerDiagnosticAnalyticsPage() {
  const { currentUser, role } = useAuth();
  const { subjects } = useData();

  const facultyId = currentUser?.facultyId || 'fac-1';
  const facultyName = currentUser?.name || 'Mr. Ashok Rathi';

  // Determine assigned course codes
  const assignedCourseCodes = useMemo(() => {
    if (role === 'admin') {
      return ['CS501', 'CS701', 'IT401'];
    }
    if (facultyId === 'fac-1') {
      return ['CS501', 'CS701'];
    }
    const taught = subjects.filter(s => s.facultyIds && s.facultyIds.includes(facultyId));
    return taught.length > 0 ? taught.map(s => s.code) : ['CS501', 'CS701'];
  }, [facultyId, role, subjects]);

  const [selectedCourseFilter, setSelectedCourseFilter] = useState('ALL');

  // Calculate analytics
  const analytics = useMemo(() => {
    const codesToAnalyze = selectedCourseFilter === 'ALL'
      ? assignedCourseCodes
      : [selectedCourseFilter];
    return calculateFacultyLearnerAnalytics(codesToAnalyze);
  }, [assignedCourseCodes, selectedCourseFilter]);

  if (role === 'faculty' && assignedCourseCodes.length === 0) {
    return (
      <div className="p-8 max-w-2xl mx-auto my-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-sm">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white">
          No Assigned Courses Available
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Learner diagnostic analytics are scoped strictly to assigned teaching curricula. Your educator profile ({facultyName}) currently has no assigned course codes.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-1.5">
            <Brain className="w-3.5 h-3.5 text-emerald-600" />
            <span>Learner Diagnostic Calibration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Learner Misconception Diagnostics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Empirical analysis of student diagnostic attempts on assigned courses ({assignedCourseCodes.join(', ')}). Detects cognitive traps where students exhibit high confidence in flawed reasoning.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Course:</span>
          <select
            value={selectedCourseFilter}
            onChange={(e) => setSelectedCourseFilter(e.target.value)}
            className="text-xs font-bold px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Assigned ({assignedCourseCodes.join(', ')})</option>
            {assignedCourseCodes.map(code => (
              <option key={code} value={code}>{code}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Attempts */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Attempts</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {analytics.totalAttempts}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {analytics.uniqueLearners} unique learners evaluated
          </p>
        </div>

        {/* Average Accuracy */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Accuracy</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {analytics.averageAccuracy != null ? `${analytics.averageAccuracy}%` : 'N/A'}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Mean score across attempts
          </p>
        </div>

        {/* High-Confidence Error Count */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">High-Conf Errors</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {analytics.highConfidenceErrorsCount}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            High confidence in wrong answer
          </p>
        </div>

        {/* Immediate Error Correction Rate */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Error Correction</span>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
            {analytics.immediateErrorCorrectionRate != null ? `${analytics.immediateErrorCorrectionRate}%` : 'Pending Data'}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Paired items corrected on retake
          </p>
        </div>

        {/* Data Provenance */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Provenance</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="pt-1">
            <DataProvenanceBadge provenance={analytics.hasCollectedData ? 'collected' : 'demo'} />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {analytics.hasCollectedData ? 'Real student attempts' : 'Calibration demo baseline'}
          </p>
        </div>
      </div>

      {/* Response-Time Contextual Deliberation Analytics Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Cognitive Deliberation & Response Time Analytics
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Formative deliberation indicator (not a speed metric)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <span className="text-[11px] text-slate-400 block font-medium">Average Deliberation / Item</span>
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              {analytics.averageQuestionTimeSeconds ? `${analytics.averageQuestionTimeSeconds}s` : 'N/A'}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Mean time per diagnostic question</span>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
            <span className="text-[11px] text-emerald-700 dark:text-emerald-300 block font-medium">Correct Response Average</span>
            <span className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
              {analytics.averageCorrectQuestionTimeSeconds ? `${analytics.averageCorrectQuestionTimeSeconds}s` : 'N/A'}
            </span>
            <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400 block mt-0.5">Deliberation on verified concepts</span>
          </div>

          <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40">
            <span className="text-[11px] text-amber-700 dark:text-amber-300 block font-medium">Incorrect Response Average</span>
            <span className="text-lg font-bold text-amber-700 dark:text-amber-300">
              {analytics.averageIncorrectQuestionTimeSeconds ? `${analytics.averageIncorrectQuestionTimeSeconds}s` : 'N/A'}
            </span>
            <span className="text-[10px] text-amber-600/80 dark:text-amber-400 block mt-0.5">Deliberation before selecting traps</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 leading-relaxed">
          * Empirical Deliberation Interpretation: In diagnostic assessment, response latency is analyzed contextually with confidence ratings and distractor taxonomy. Slower response times observed on high-confidence incorrect answers highlight entrenched cognitive illusions rather than hesitation.
        </p>
      </div>

      {/* Course Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {analytics.subjectBreakdown.map((sb) => (
          <div
            key={sb.code}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  {sb.code}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  {sb.name}
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {sb.attemptsCount} Attempts
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-400 block text-[11px]">Average Score</span>
                <span className="font-bold text-slate-900 dark:text-white text-base">
                  {sb.averageScore != null ? `${sb.averageScore}%` : 'N/A'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200/50 dark:border-amber-900/50">
                <span className="text-amber-700 dark:text-amber-300 block text-[11px]">High-Conf Errors</span>
                <span className="font-bold text-amber-600 dark:text-amber-400 text-base">
                  {sb.highConfidenceErrorsCount} caught
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 text-xs">
              <Link
                to={`/study-snippets`}
                className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>View Remediation Snippets</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
              <Link
                to={`/educator/content`}
                className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
              >
                Author Items →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Identified Misconceptions Taxonomy Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <span>Identified Cognitive Misconceptions in Assigned Courses</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Specific cognitive traps where students selected structured distractor options
            </p>
          </div>
        </div>

        {analytics.misconceptionsIdentified.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-sm">
            No specific misconceptions recorded yet in diagnostic attempts for this course selection.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                  <th className="py-2.5 px-3 font-bold">Misconception Identifier</th>
                  <th className="py-2.5 px-3 font-bold">Concept Trap Description</th>
                  <th className="py-2.5 px-3 font-bold text-center">Frequency Caught</th>
                  <th className="py-2.5 px-3 font-bold text-center">High-Confidence Errors</th>
                  <th className="py-2.5 px-3 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {analytics.misconceptionsIdentified.map((m, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {m.tag}
                    </td>
                    <td className="py-3 px-3 text-slate-700 dark:text-slate-300 max-w-md">
                      {m.description}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-900 dark:text-white">
                      {m.occurrences}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                        {m.highConfidenceCount}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        to="/study-snippets"
                        className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
                      >
                        <span>Study Snippet</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Learner Misconception Calibration Records Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              <span>Learner Misconception Calibration Records</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Aggregated student-level calibration metrics across assigned courses
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500">
            {analytics.learnerRecords ? analytics.learnerRecords.length : 0} Enrolled Learners
          </span>
        </div>

        {!analytics.learnerRecords || analytics.learnerRecords.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-sm">
            No learner records found for this course filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                  <th className="py-2.5 px-3 font-bold">Learner Name</th>
                  <th className="py-2.5 px-3 font-bold">Subject</th>
                  <th className="py-2.5 px-3 font-bold text-center">Attempts</th>
                  <th className="py-2.5 px-3 font-bold text-center">Accuracy</th>
                  <th className="py-2.5 px-3 font-bold text-center">High-Conf Errors</th>
                  <th className="py-2.5 px-3 font-bold text-center">Trap Rate</th>
                  <th className="py-2.5 px-3 font-bold">Correct / Incorrect Time</th>
                  <th className="py-2.5 px-3 font-bold">Weakest Topic</th>
                  <th className="py-2.5 px-3 font-bold text-right">Last Attempt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {analytics.learnerRecords.map((lr, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                      {lr.studentName}
                      <span className="block text-[10px] font-mono text-slate-400">{lr.studentId}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                        {lr.subjectCode}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-900 dark:text-white">
                      {lr.attemptCount}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-900 dark:text-white">
                      {lr.accuracy}%
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                        {lr.highConfidenceErrors}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-medium text-slate-600 dark:text-slate-300">
                      {lr.trapRate}%
                    </td>
                    <td className="py-3 px-3 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                      {lr.averageCorrectQuestionTimeSeconds}s / {lr.averageIncorrectQuestionTimeSeconds}s
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300 font-medium">
                      {lr.weakestTopic}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-400">
                      {lr.lastAttemptAt ? new Date(lr.lastAttemptAt).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Attempts Log Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-600" />
              <span>Learner Diagnostic Attempt History</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Academic diagnostic logs recorded for cognitive research
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500">
            {analytics.recentAttempts.length} Records
          </span>
        </div>

        {analytics.recentAttempts.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-sm">
            No diagnostic attempts logged for this course filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                  <th className="py-2.5 px-3 font-bold">Attempt ID</th>
                  <th className="py-2.5 px-3 font-bold">Learner</th>
                  <th className="py-2.5 px-3 font-bold">Subject</th>
                  <th className="py-2.5 px-3 font-bold">Score</th>
                  <th className="py-2.5 px-3 font-bold">Type</th>
                  <th className="py-2.5 px-3 font-bold">High-Conf Errors</th>
                  <th className="py-2.5 px-3 font-bold">Date</th>
                  <th className="py-2.5 px-3 font-bold">Provenance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {analytics.recentAttempts.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-2.5 px-3 font-mono text-slate-400">
                      {att.id.substring(0, 10)}...
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                      {att.studentName || att.studentId || 'Anonymous Learner'}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                        {att.subjectCode || 'CS501'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-bold">
                      {att.score} / {att.maxScore} ({Math.round((att.score / (att.maxScore || 1)) * 100)}%)
                    </td>
                    <td className="py-2.5 px-3">
                      {att.isRetake ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                          Retake
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          Initial
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      {att.highConfidenceErrors && att.highConfidenceErrors.length > 0 ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                          {att.highConfidenceErrors.length} flagged
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">0</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">
                      {new Date(att.timestamp).toLocaleDateString()}
                    </td>
                    <td className="py-2.5 px-3">
                      <DataProvenanceBadge state={att.isDemo ? 'demo' : (att.dataProvenance || 'demo')} compact />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Point 4 & 5 Research Integrity Banner */}
      <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-900/60 text-xs space-y-2">
        <div className="flex items-center gap-2 font-bold text-indigo-900 dark:text-indigo-200">
          <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span>Research Data Architecture — Point 4 & Point 5 Compliance</span>
        </div>
        <p className="text-indigo-800/80 dark:text-indigo-300/80 leading-relaxed text-[11px]">
          Learner diagnostic attempts represent identifiable formative assessment data strictly used for cognitive calibration modeling. Course feedback is collected on a completely segregated pathway with anonymous tokens and zero student linkages. Neither module provides ERP functionality, attendance tracking, fee auditing, or marksheet generation.
        </p>
      </div>
    </div>
  );
}

export default LearnerDiagnosticAnalyticsPage;
