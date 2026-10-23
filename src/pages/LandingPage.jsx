import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  LogIn,
  Brain,
  MessageSquareHeart,
  FileCheck2,
  UserCheck,
  FlaskConical,
  Clock,
  TrendingUp,
  BookOpen,
  CheckCircle2
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth, DEMO_USERS } from '../context/AuthContext';
import { DataProvenanceBadge } from '../components/research/DataProvenanceBadge';
import { getStoredSUSResponses } from '../components/hci/SUSSurveyModal';
import { QUIZ_QUESTIONS, getStoredQuizAttempts } from '../services/quizData';

export function LandingPage() {
  const { overallMetrics, adjustments } = useData();
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleRoleNavigation = (roleKey, targetPath) => {
    if (isAuthenticated && currentUser?.role === roleKey) {
      navigate(targetPath);
    } else {
      navigate(`/login?role=${roleKey}`);
    }
  };

  const storedSUS = getStoredSUSResponses();
  const storedAttempts = getStoredQuizAttempts();

  const averageSUS = storedSUS.length > 0
    ? Math.round((storedSUS.reduce((sum, r) => sum + r.score, 0) / storedSUS.length) * 10) / 10
    : null;

  const RESEARCH_PILLARS = [
    {
      icon: Brain,
      title: 'Cognitive Diagnostics',
      description: 'Misconception-driven MCQs with confidence calibration and active retake cycles to reveal hidden conceptual errors.',
      link: '/quiz',
      btnText: 'Try Diagnostic Quiz',
      color: 'from-indigo-500 to-indigo-600',
      badge: '🧠',
      delay: 'delay-100'
    },
    {
      icon: Clock,
      title: 'HCI & Usability',
      description: 'System Usability Scale (SUS) benchmarking with validated 10-item psychometrics and cognitive-load-conscious UI design.',
      link: '/hci-research',
      btnText: 'View Usability Study',
      color: 'from-emerald-500 to-emerald-600',
      badge: '⚡',
      delay: 'delay-200'
    },
    {
      icon: FileCheck2,
      title: 'Feedback Analytics',
      description: 'Transparent rule-based categorization of student feedback with documented educator interventions.',
      link: '/pedagogical-adjustments',
      btnText: 'Explore Action Loop',
      color: 'from-purple-500 to-purple-600',
      badge: '📊',
      delay: 'delay-300'
    }
  ];

  const STATS = [
    { label: 'Feedback Collected', value: overallMetrics.collectedFeedbackCount > 0 ? overallMetrics.collectedFeedbackCount : 0, sublabel: overallMetrics.collectedFeedbackCount > 0 ? 'Real submissions' : `(${overallMetrics.demoFeedbackCount} demo)`, color: 'text-indigo-600 dark:text-indigo-400' },
    { label: 'SUS Score', value: averageSUS !== null ? averageSUS : '—', sublabel: averageSUS !== null ? 'Usability rating' : 'Studies pending', color: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Diagnostic Items', value: QUIZ_QUESTIONS.length, sublabel: 'Trap questions', color: 'text-purple-600 dark:text-purple-400' },
    { label: 'Interventions', value: adjustments.filter(a => a.dataProvenance === 'collected').length, sublabel: `${adjustments.filter(a => a.dataProvenance === 'demo' || a.isDemo).length} demo`, color: 'text-slate-700 dark:text-slate-300' },
  ];

  return (
    <div className="min-h-screen pb-16">

      {/* ── Navigation Bar ── */}
      <nav className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/70 dark:border-slate-800/70 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200 dark:shadow-none">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
              Study<span className="text-indigo-600 dark:text-indigo-400">Snippet</span>
            </span>
            <span className="hidden sm:block text-[10px] font-bold text-slate-400 uppercase tracking-wider -mt-0.5">
              Diagnostic Learning Platform
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold">
          <Link
            to="/research"
            className="hidden sm:inline-flex px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition-all items-center gap-1.5"
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Research</span>
          </Link>
          <Link
            to="/quiz"
            className="hidden md:inline-flex px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            🎯 Quiz
          </Link>
          <Link
            to="/feedback"
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
          >
            💬 Feedback
          </Link>
          <Link
            to="/login"
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all inline-flex items-center gap-1.5"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isAuthenticated ? currentUser?.name.split(' ')[0] : 'Sign In'}</span>
          </Link>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden px-4 pt-16 pb-20 text-center max-w-4xl mx-auto">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-indigo-100/60 dark:bg-indigo-950/30 blur-3xl" />
        </div>

        <div className="reveal inline-flex items-center gap-2 px-3.5 py-1.5 mb-5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Research-Oriented Educational Technology</span>
        </div>

        <h1 className="reveal delay-100 text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-5">
          Learn Smarter.
          <br />
          <span className="gradient-text">Fix Misconceptions.</span>
        </h1>

        <p className="reveal delay-200 text-base sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto mb-8">
          An educational platform that identifies hidden knowledge gaps through diagnostic quizzes,
          tracks your syllabus progress, and provides AI-powered study assistance.
        </p>

        {/* Action Buttons */}
        <div className="reveal delay-300 flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
          <Link
            to="/research"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-200 dark:shadow-none hover:-translate-y-0.5 transition-all"
          >
            <FlaskConical className="w-4 h-4" />
            <span>Explore Research</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/quiz"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
          >
            <Brain className="w-4 h-4 text-indigo-600" />
            <span>Diagnostic Quiz</span>
          </Link>

          <Link
            to="/feedback"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
          >
            <MessageSquareHeart className="w-4 h-4 text-rose-500" />
            <span>Course Feedback</span>
          </Link>
        </div>

        {/* Privacy badge */}
        <div className="reveal delay-400 inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Student identity is not stored with submitted feedback.</span>
        </div>
      </section>

      {/* ── Stats Row ── */}
      <section className="max-w-5xl mx-auto px-4 mb-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={`reveal delay-${(i + 1) * 100} card-hover p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center`}
            >
              <div className={`text-3xl font-black ${stat.color}`}>{stat.value}</div>
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">{stat.label}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{stat.sublabel}</div>
              <DataProvenanceBadge
                state={storedAttempts.length > 0 ? "collected" : "insufficient"}
                compact
                label=""
                className="mt-2 justify-center"
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── Research Pillars ── */}
      <section className="max-w-5xl mx-auto px-4 mb-16">
        <div className="reveal text-center mb-8">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
            Three Research Pillars
          </h2>
          <p className="text-sm text-slate-500">
            Investigating cognitive diagnosis, usability engineering, and feedback loops
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {RESEARCH_PILLARS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`reveal ${item.delay} card-hover group p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col space-y-4 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all`}
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-4 shadow-sm group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <Link
                  to={item.link}
                  className="mt-auto pt-3 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 inline-flex items-center gap-1 group-hover:gap-2 transition-all"
                >
                  <span>{item.btnText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── AI Chatbot Feature Highlight ── */}
      <section className="max-w-5xl mx-auto px-4 mb-16">
        <div className="reveal reveal-scale rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 p-8 text-white overflow-hidden relative">
          {/* Decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

          <div className="relative flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>NEW — AI-Powered Assistant</span>
              </div>
              <h2 className="text-2xl font-black leading-tight">
                Meet StudyBot 🤖
              </h2>
              <p className="text-sm text-indigo-100 leading-relaxed max-w-lg">
                Ask StudyBot about your syllabus progress, weak topics, quiz results, and get personalized study recommendations — all powered by Google Gemini AI.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {['How am I doing?', 'Explain my weak areas', 'What to study next?'].map((q) => (
                  <span
                    key={q}
                    className="px-3 py-1 text-xs font-medium bg-white/20 rounded-full border border-white/30"
                  >
                    "{q}"
                  </span>
                ))}
              </div>
            </div>
            <div className="flex-shrink-0 flex items-center justify-center w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm animate-float">
              <span className="text-4xl">🤖</span>
            </div>
          </div>

          <p className="relative mt-4 text-[11px] text-indigo-200">
            💡 Look for the chat button in the bottom-right corner to open StudyBot
          </p>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="max-w-5xl mx-auto px-4 mb-16">
        <div className="reveal text-center mb-8">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
            How It Works
          </h2>
          <p className="text-sm text-slate-500">Simple steps to improve your learning</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { step: '01', icon: Brain, title: 'Take a Diagnostic Quiz', desc: 'Answer misconception-trap questions with confidence ratings.', color: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400', delay: 'delay-100' },
            { step: '02', icon: TrendingUp, title: 'Review Your Weak Areas', desc: 'See exactly where you went wrong and what misconceptions you hold.', color: 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400', delay: 'delay-200' },
            { step: '03', icon: CheckCircle2, title: 'Study & Improve', desc: 'Use Study Snippets and StudyBot AI to fix your knowledge gaps.', color: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400', delay: 'delay-300' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className={`reveal ${item.delay} flex flex-col items-center text-center p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm card-hover`}>
                <div className="text-xs font-black text-slate-400 mb-3 tracking-widest">{item.step}</div>
                <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-2">{item.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Role Selection Section ── */}
      <section className="max-w-5xl mx-auto px-4 mb-16">
        <div className="reveal bg-slate-100/70 dark:bg-slate-900/60 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-indigo-600" />
                <span>Explore by Role</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Each role has a specialized interface for the research platform
              </p>
            </div>
            <Link to="/login" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
              Go to Sign In →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Student */}
            <div
              onClick={() => handleRoleNavigation('student', '/quiz')}
              className="reveal delay-100 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group card-hover space-y-2"
            >
              <div className="flex items-center gap-3">
                <img src={DEMO_USERS.student.avatar} alt="Rahul" className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700" />
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-emerald-600 transition-colors">
                    Rahul Chauhan
                  </span>
                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Learner
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                Takes diagnostic trap quizzes, tracks syllabus progress & provides course feedback.
              </p>
              <span className="text-xs font-bold text-emerald-600 inline-flex items-center gap-1">
                {isAuthenticated && currentUser?.role === 'student' ? 'Continue →' : 'Sign In →'}
              </span>
            </div>

            {/* Faculty */}
            <div
              onClick={() => handleRoleNavigation('faculty', `/faculty/${DEMO_USERS.faculty.facultyId}`)}
              className="reveal delay-200 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group card-hover space-y-2"
            >
              <div className="flex items-center gap-3">
                <img src={DEMO_USERS.faculty.avatar} alt="Mr. Ashok" className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700" />
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-blue-600 transition-colors">
                    Mr. Ashok Rathi
                  </span>
                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                    Educator
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                Reviews categorized feedback, analyzes misconceptions & documents adjustments.
              </p>
              <span className="text-xs font-bold text-blue-600 inline-flex items-center gap-1">
                {isAuthenticated && currentUser?.role === 'faculty' ? 'Continue →' : 'Sign In →'}
              </span>
            </div>

            {/* Admin */}
            <div
              onClick={() => handleRoleNavigation('admin', '/dashboard')}
              className="reveal delay-300 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-purple-500 hover:shadow-md transition-all cursor-pointer group card-hover space-y-2"
            >
              <div className="flex items-center gap-3">
                <img src={DEMO_USERS.admin.avatar} alt="Rajesh" className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700" />
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-purple-600 transition-colors">
                    Dr. Rajesh Verma
                  </span>
                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                    Oversight
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                Reviews institutional analytics & verifies documented adjustments.
              </p>
              <span className="text-xs font-bold text-purple-600 inline-flex items-center gap-1">
                {isAuthenticated && currentUser?.role === 'admin' ? 'Continue →' : 'Sign In →'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Study Snippets feature highlight ── */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="reveal reveal-scale rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center shrink-0">
            <BookOpen className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="flex-1 space-y-2">
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Study Snippets — Byte-Sized Learning
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Quick conceptual summaries targeting your exact misconceptions, written by educators and mapped to your syllabus units.
            </p>
          </div>
          <Link
            to="/study-snippets"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm transition-all"
          >
            <span>Browse Snippets</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
