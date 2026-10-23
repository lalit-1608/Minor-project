import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { calculateStudentLearningAnalytics } from '../services/quizData';
import { getStudySnippets, getDiagnosticTopics } from '../services/learningContentService';
import {
  Brain,
  AlertTriangle,
  TrendingUp,
  BookOpen,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Star,
  MessageSquare,
  FlaskConical,
  GraduationCap,
  Clock,
  Layers,
  ChevronDown,
  ChevronUp,
  XCircle,
  Target,
  BarChart2,
  Zap,
  Trophy,
  Bot
} from 'lucide-react';

export function MyLearningPage() {
  const { currentUser } = useAuth();
  const studentId = currentUser?.id || currentUser?.studentId || 'stu-1';
  const studentName = currentUser?.name || 'Rahul Chauhan';

  // State for expanded attempt details
  const [expandedAttemptId, setExpandedAttemptId] = useState(null);

  // Calculate student metrics
  const analytics = useMemo(() => {
    return calculateStudentLearningAnalytics(studentId);
  }, [studentId]);

  // Load relevant study snippets
  const studySnippets = useMemo(() => {
    return getStudySnippets({ status: 'published' });
  }, []);

  // Load active diagnostic topics
  const activeTopics = useMemo(() => {
    return getDiagnosticTopics({ status: 'active' });
  }, []);

  // Derived syllabus progress data (based on quiz performance + topics)
  const syllabusProgress = useMemo(() => {
    const subjects = [
      {
        code: 'CS501',
        name: 'Database Management Systems',
        units: 5,
        color: 'from-indigo-500 to-indigo-600',
        bgLight: 'bg-indigo-50 dark:bg-indigo-950/40',
        border: 'border-indigo-200 dark:border-indigo-800',
        textColor: 'text-indigo-600 dark:text-indigo-400'
      },
      {
        code: 'CS701',
        name: 'Machine Learning',
        units: 5,
        color: 'from-emerald-500 to-emerald-600',
        bgLight: 'bg-emerald-50 dark:bg-emerald-950/40',
        border: 'border-emerald-200 dark:border-emerald-800',
        textColor: 'text-emerald-600 dark:text-emerald-400'
      },
      {
        code: 'CS301',
        name: 'Data Structures & Algorithms',
        units: 5,
        color: 'from-purple-500 to-purple-600',
        bgLight: 'bg-purple-50 dark:bg-purple-950/40',
        border: 'border-purple-200 dark:border-purple-800',
        textColor: 'text-purple-600 dark:text-purple-400'
      }
    ];

    return subjects.map(sub => {
      // Find related answers from analytics
      const relatedAnswers = analytics?.recentAttempts?.flatMap(a =>
        (a.answers || []).filter(ans => ans.questionSubjectCode === sub.code)
      ) || [];

      const totalAnswered = relatedAnswers.length;
      const correctAnswered = relatedAnswers.filter(a => a.isCorrect).length;
      const topicsCovered = new Set(relatedAnswers.map(a => a.questionTopic).filter(Boolean)).size;
      const accuracy = totalAnswered > 0 ? Math.round((correctAnswered / totalAnswered) * 100) : null;

      // Estimate completion based on topics covered vs total topics expected
      const estimatedTopicsTotal = sub.units * 3; // assume ~3 testable topics per unit
      const completion = Math.min(100, Math.round((topicsCovered / estimatedTopicsTotal) * 100));

      // Active topics for this subject
      const subjectTopics = activeTopics.filter(t => t.subjectCode === sub.code);

      return {
        ...sub,
        totalAnswered,
        correctAnswered,
        accuracy,
        completion: totalAnswered > 0 ? completion : 0,
        topicsCovered,
        subjectTopics,
        hasData: totalAnswered > 0
      };
    });
  }, [analytics, activeTopics]);

  // Scroll reveal
  useEffect(() => {
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
      );
      document.querySelectorAll('.reveal:not(.visible), .reveal-left:not(.visible), .reveal-right:not(.visible), .reveal-scale:not(.visible)')
        .forEach(el => observer.observe(el));
      return () => observer.disconnect();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-indigo-950 via-slate-900 to-slate-900 border border-slate-200 dark:border-indigo-900/40 p-6 sm:p-8 text-slate-900 dark:text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
              <Brain className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Learner Metacognitive Calibration</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Welcome back, {studentName}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Track your diagnostic test performance, uncover high-confidence misconceptions before exams, and calibrate your confidence against empirical cognitive traps.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
            <Link
              to="/quiz"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
            >
              <Brain className="w-4 h-4" />
              <span>Take Diagnostic Quiz</span>
            </Link>
            <Link
              to="/study-snippets"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs sm:text-sm transition-all"
            >
              <BookOpen className="w-4 h-4" />
              <span>Study Snippets</span>
            </Link>
          </div>
        </div>

        {/* Student metadata */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Enrolled: CSE Semester 5 (Class CSE-A)</span>
          </div>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Anonymous Course Feedback Enabled</span>
          </div>
        </div>
      </div>

      {/* ── Syllabus Progress Section ── */}
      <div className="reveal bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600" />
            <div>
              <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wide">
                Syllabus Progress
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Based on diagnostic quiz performance across enrolled subjects
              </p>
            </div>
          </div>
          {analytics.totalAttempts === 0 && (
            <Link
              to="/quiz"
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
            >
              <Zap className="w-3 h-3" />
              Take First Quiz
            </Link>
          )}
        </div>

        {analytics.totalAttempts === 0 ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center mx-auto">
              <BarChart2 className="w-7 h-7 text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No Quiz Data Yet</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Take a diagnostic quiz to see your syllabus progress and track which topics you've covered.
              </p>
            </div>
            <Link
              to="/quiz"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm transition-all"
            >
              <Brain className="w-4 h-4" />
              Start Diagnostic Quiz
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {syllabusProgress.map((sub, idx) => (
              <div key={sub.code} className={`reveal delay-${(idx + 1) * 100} space-y-2`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black ${sub.bgLight} ${sub.textColor} border ${sub.border}`}>
                      {sub.code}
                    </span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[180px]">
                      {sub.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    {sub.hasData ? (
                      <>
                        <span className="text-slate-500">{sub.topicsCovered} topics covered</span>
                        <span className={`font-black ${sub.textColor}`}>{sub.completion}%</span>
                      </>
                    ) : (
                      <span className="text-slate-400 italic text-[11px]">No attempts yet</span>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${sub.color} transition-all duration-1000 ease-out`}
                    style={{ width: `${sub.completion}%` }}
                  />
                </div>

                {/* Sub-details */}
                {sub.hasData && (
                  <div className="flex flex-wrap gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      {sub.correctAnswered}/{sub.totalAnswered} correct ({sub.accuracy}%)
                    </span>
                    {sub.subjectTopics.length > 0 && (
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-indigo-400" />
                        {sub.subjectTopics.length} active diagnostic plan{sub.subjectTopics.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Overall summary */}
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>
                  Overall: {analytics.overallAccuracy != null ? `${analytics.overallAccuracy}% accuracy across all subjects` : 'Take quizzes to see overall progress'}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-medium text-indigo-500">
                <Bot className="w-3.5 h-3.5" />
                <span>Ask StudyBot for insights →</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Diagnostic Attempts */}
        <div className="reveal bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 card-hover">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Diagnostic Quizzes</span>
            <Brain className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {analytics.totalAttempts}
            <span className="text-xs font-medium text-slate-400 ml-1.5">attempts</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {analytics.retakeAttemptsCount} retake calibrations
          </p>
        </div>

        {/* Diagnostic Accuracy */}
        <div className="reveal delay-100 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 card-hover">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Overall Accuracy</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {analytics.overallAccuracy != null ? `${analytics.overallAccuracy}%` : 'N/A'}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Across all diagnostic items
          </p>
        </div>

        {/* High-Confidence Misconceptions */}
        <div className="reveal delay-200 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 card-hover">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Cognitive Traps Caught</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {analytics.highConfidenceErrorsCount}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            High confidence in incorrect choice
          </p>
        </div>

        {/* Immediate Error Correction Rate */}
        <div className="reveal delay-300 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 card-hover">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Error Correction Rate</span>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
            {analytics.immediateErrorCorrectionRate != null ? `${analytics.immediateErrorCorrectionRate}%` : 'Pending Data'}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Paired items corrected on retake
          </p>
        </div>
      </div>

      {/* Response-Time Contextual Deliberation Analytics Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Diagnostic Deliberation & Response Time Analytics
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Cognitive deliberation metric (not a speed test)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <span className="text-[11px] text-slate-400 block font-medium">Average Time / Question</span>
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              {analytics.averageQuestionTimeSeconds ? `${analytics.averageQuestionTimeSeconds}s` : 'Timing data not available yet'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
            <span className="text-[11px] text-emerald-700 dark:text-emerald-300 block font-medium">Correct Answer Deliberation</span>
            <span className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
              {analytics.averageCorrectQuestionTimeSeconds ? `${analytics.averageCorrectQuestionTimeSeconds}s` : 'N/A'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40">
            <span className="text-[11px] text-amber-700 dark:text-amber-300 block font-medium">Incorrect Answer Deliberation</span>
            <span className="text-lg font-bold text-amber-700 dark:text-amber-300">
              {analytics.averageIncorrectQuestionTimeSeconds ? `${analytics.averageIncorrectQuestionTimeSeconds}s` : 'N/A'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <span className="text-[11px] text-slate-400 block font-medium">Total Recent Deliberation</span>
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              {analytics.totalRecentQuizTimeSeconds ? `${analytics.totalRecentQuizTimeSeconds}s` : '0s'}
            </span>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 leading-relaxed">
          * Note on Metacognitive Timing: Response time is interpreted in conjunction with correctness, confidence, and cognitive trap selections. Slower response times coupled with high-confidence errors point to deeply ingrained intuitive misconceptions rather than computational hesitation.
        </p>
      </div>

      {/* Metacognitive Calibration Alert if High-Confidence Errors Exist */}
      {analytics.highConfidenceErrorsCount > 0 && (
        <div className="bg-amber-50/80 dark:bg-amber-950/40 rounded-2xl border border-amber-200/80 dark:border-amber-900/60 p-5 space-y-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                Metacognitive Calibration Notice: High-Confidence Mistakes Detected
              </h2>
              <p className="text-xs text-amber-800/90 dark:text-amber-300/85 leading-relaxed">
                You expressed high certainty on items containing structured misconceptions. In educational psychology, this "illusion of explanatory depth" leaves students vulnerable in final evaluations. Review the recommended Study Snippets below to replace incorrect intuitions with formal concepts.
              </p>
            </div>
          </div>

          {analytics.flaggedMisconceptions && analytics.flaggedMisconceptions.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1 pl-11">
              {analytics.flaggedMisconceptions.map((m, idx) => (
                <Link
                  key={idx}
                  to="/study-snippets"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-100/90 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 text-xs font-semibold hover:bg-amber-200 transition-colors"
                >
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>Topic: {m.tag || m.concept || 'Diagnostic Trap'}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recommended Study Snippets & Attempt History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Diagnostic Topics in Enrolled Courses */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-600" />
                  <span>Active Diagnostic Topics in Enrolled Courses</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Targeted misconception plans created by educators mapped to official syllabus units
                </p>
              </div>
              <span className="text-xs font-bold text-slate-400">
                {activeTopics.length} Active Plans
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {activeTopics.map((dt) => (
                <div
                  key={dt.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                        {dt.subjectCode}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">
                        Unit {dt.unitNumber || 1}
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {dt.topicTitle}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                      {dt.learningObjective || dt.shortDescription}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                    <Link
                      to="/study-snippets"
                      className="font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                    >
                      <span>Study Notes</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                    <Link
                      to="/quiz"
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      Test Traps →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Study Snippets */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  <span>Recommended Study Snippets</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Targeted conceptual summaries addressing cognitive traps in your courses
                </p>
              </div>
              <Link
                to="/study-snippets"
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                View all ({studySnippets.length}) →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {studySnippets.slice(0, 4).map((snp) => (
                <div
                  key={snp.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2.5 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                        {snp.subjectCode}
                      </span>
                      <span className="text-[11px] text-slate-400 truncate">
                        {snp.topic}
                      </span>
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                      {snp.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {snp.shortContent}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                    <Link
                      to="/study-snippets"
                      className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
                    >
                      <span>Read Snippet</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                    <Link
                      to="/quiz"
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      Test in Quiz
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Diagnostic Attempt History with Item-Level Inspection */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                  <span>My Diagnostic Quiz History</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Formative records showing calibration deltas and testing effects
                </p>
              </div>
              <span className="text-xs font-bold text-slate-400">
                {analytics.recentAttempts.length} Recorded Attempts
              </span>
            </div>

            {analytics.recentAttempts.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-sm">
                You haven't completed any diagnostic quizzes yet. Take your first quiz to calibrate your knowledge.
              </div>
            ) : (
              <div className="space-y-3">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                        <th className="py-2.5 px-3 font-bold">Subject</th>
                        <th className="py-2.5 px-3 font-bold">Score</th>
                        <th className="py-2.5 px-3 font-bold">Attempt Type</th>
                        <th className="py-2.5 px-3 font-bold">High-Conf Errors</th>
                        <th className="py-2.5 px-3 font-bold">Date</th>
                        <th className="py-2.5 px-3 font-bold text-right">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {analytics.recentAttempts.map((att) => {
                        const isExpanded = expandedAttemptId === att.id;
                        return (
                          <React.Fragment key={att.id}>
                            <tr
                              onClick={() => setExpandedAttemptId(isExpanded ? null : att.id)}
                              className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
                            >
                              <td className="py-2.5 px-3">
                                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                                  {att.subjectCode || 'CS501'}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
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
                                  <span className="text-emerald-600 font-bold">0</span>
                                )}
                              </td>
                              <td className="py-2.5 px-3 text-slate-400">
                                {new Date(att.timestamp).toLocaleDateString()}
                              </td>
                              <td className="py-2.5 px-3 text-right">
                                <span className="inline-flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400">
                                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                  <span>{isExpanded ? 'Hide' : 'Review'}</span>
                                </span>
                              </td>
                            </tr>

                            {/* Expanded Item-Level Review */}
                            {isExpanded && (
                              <tr>
                                <td colSpan={6} className="p-3 bg-slate-50/70 dark:bg-slate-800/40 rounded-xl">
                                  <div className="space-y-2 text-xs">
                                    <div className="flex items-center justify-between text-slate-500 font-bold text-[11px] pb-1 border-b border-slate-200 dark:border-slate-700">
                                      <span>Item-Level Metacognitive Review ({att.answers?.length || 0} Questions)</span>
                                      <span>Attempt ID: {att.id}</span>
                                    </div>

                                    {att.answers && att.answers.length > 0 ? (
                                      <div className="space-y-2">
                                        {att.answers.map((ans, aIdx) => (
                                          <div
                                            key={aIdx}
                                            className={`p-2.5 rounded-xl border ${
                                              ans.isCorrect
                                                ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40'
                                                : ans.isHighConfidenceError
                                                ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800'
                                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                                            } space-y-1`}
                                          >
                                            <div className="flex items-start justify-between gap-2">
                                              <span className="font-semibold text-slate-900 dark:text-white">
                                                Q{aIdx + 1}: {ans.questionText || 'Diagnostic Question'}
                                              </span>
                                              <span className="shrink-0">
                                                {ans.isCorrect ? (
                                                  <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 dark:text-emerald-300">
                                                    <CheckCircle2 className="w-3 h-3" /> Correct
                                                  </span>
                                                ) : (
                                                  <span className="inline-flex items-center gap-1 text-[10px] font-black text-rose-600 dark:text-rose-400">
                                                    <XCircle className="w-3 h-3" /> Incorrect
                                                  </span>
                                                )}
                                              </span>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                                              <span>Topic: <strong className="text-slate-700 dark:text-slate-300">{ans.topic || 'Core Concept'}</strong></span>
                                              <span>•</span>
                                              <span>Confidence: <strong className="capitalize text-slate-700 dark:text-slate-300">{ans.confidenceLevel || 'medium'}</strong></span>
                                              {ans.timeSpentSeconds && (
                                                <>
                                                  <span>•</span>
                                                  <span>Time: <strong className="text-slate-700 dark:text-slate-300">{ans.timeSpentSeconds}s</strong></span>
                                                </>
                                              )}
                                            </div>

                                            {/* Cautious Academic Diagnostic Phrasing */}
                                            {ans.isHighConfidenceError && (
                                              <div className="p-1.5 rounded-lg bg-amber-100/70 dark:bg-amber-900/50 text-amber-900 dark:text-amber-200 text-[11px] font-medium flex items-center gap-1.5">
                                                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                                <span>Possible misconception detected: High confidence recorded on incorrect choice. Recommended for targeted review.</span>
                                              </div>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <p className="text-slate-400 text-xs italic">Detailed item logs are stored in aggregated form for this attempt.</p>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Research Activities & Student Actions */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-indigo-600" />
              <span>Student Research Activities</span>
            </h3>

            <div className="space-y-2.5">
              <Link
                to="/quiz"
                className="group block p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400">
                      <Brain className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600">
                        Diagnostic Assessment Quiz
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Test mental models on trap questions
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                </div>
              </Link>

              <Link
                to="/study-snippets"
                className="group block p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600">
                        Study Snippets Library
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Short diagnostic concept guides
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                </div>
              </Link>

              <Link
                to="/feedback"
                className="group block p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-500 hover:bg-amber-50/40 dark:hover:bg-amber-950/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-600">
                        Anonymous Course Feedback
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Uninhibited pedagogical evaluation
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600" />
                </div>
              </Link>

              <Link
                to="/hci-research"
                className="group block p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-purple-500 hover:bg-purple-50/40 dark:hover:bg-purple-950/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-400">
                      <Star className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600">
                        HCI Usability Study (SUS)
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Participate in empirical usability research
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
                </div>
              </Link>
            </div>
          </div>

          {/* Privacy & Research Security Notice */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-900/60 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-indigo-900 dark:text-indigo-200">
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Student Privacy Guarantee</span>
            </div>
            <p className="text-indigo-800/80 dark:text-indigo-300/80 text-[11px] leading-relaxed">
              Diagnostic attempts are stored strictly to model cognitive trap repair. Student identity is not stored with submitted course feedback; the prototype uses a non-identifying browser-level duplicate-prevention identifier, which is not linked to the learner analytics dataset. Faculty cannot see who submitted specific qualitative evaluations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyLearningPage;
