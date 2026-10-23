import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { DataProvenanceBadge } from '../components/research/DataProvenanceBadge';
import { getStoredQuizAttempts } from '../services/quizData';
import { getStoredSUSResponses } from '../components/hci/SUSSurveyModal';
import {
  Brain,
  Sparkles,
  Target,
  ArrowRight,
  BookOpen,
  Clock,
  Layers,
  Shield,
  FileCheck2,
  BarChart3
} from 'lucide-react';

export function ResearchOverviewPage() {
  const { feedback, adjustments } = useData();

  const storedAttempts = getStoredQuizAttempts();
  const storedSUS = getStoredSUSResponses();
  const collectedFeedbackCount = feedback.filter(f => f.dataProvenance === 'collected').length;
  const demoFeedbackCount = feedback.filter(f => f.dataProvenance === 'demo' || f.isDemo).length;

  // Research Status definitions — strictly using allowed states: Completed, In Progress, Not Started, Pending
  const RESEARCH_PHASES = [
    {
      title: 'Prototype Implementation',
      status: 'Completed',
      statusClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
      description: 'Design and deployment of diagnostic MCQ engine, confidence selector, 10-item SUS instrument, rule-based feedback classifier, and pedagogical adjustment tracker.'
    },
    {
      title: 'Participant Data Collection',
      status: 'Not Started',
      statusClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700',
      description: 'Planned gathering of student quiz responses, confidence ratings, usability surveys, and anonymous course evaluations. Awaiting participant recruitment.'
    },
    {
      title: 'Empirical Analysis',
      status: 'Not Started',
      statusClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700',
      description: 'Statistical evaluation of high-confidence misconception rates, immediate retake learning curves, SUS psychometrics, and feedback categorization. Pending data collection.'
    },
    {
      title: 'Literature Review & Research Paper Verification',
      status: 'In Progress',
      statusClass: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300 dark:border-blue-800',
      description: 'Selecting and verifying 10 peer-reviewed papers that will correspond to the final project literature review and PPT references.'
    }
  ];

  // 10 Literature Framework Pillars for Research Paper / PPT Alignment
  const LITERATURE_FRAMEWORK = [
    { topic: 'Retrieval Practice', concept: 'Active retrieval testing effect vs. passive review' },
    { topic: 'Misconception Diagnosis', concept: 'Identifying specific underlying mental model flaws' },
    { topic: 'MCQ Distractor Quality', concept: 'Plausible, diagnostic distractors capturing intuitive traps' },
    { topic: 'Confidence & Metacognition', concept: 'Calibrating certainty vs. correctness (illusion of competence)' },
    { topic: 'System Usability Scale (SUS)', concept: 'Standardized 10-item psychometric usability benchmarking' },
    { topic: 'E-Learning Usability', concept: 'Cognitive load reduction in educational digital interfaces' },
    { topic: 'Anonymous Student Feedback', concept: 'Low-stakes qualitative channels for candid teaching input' },
    { topic: 'Feedback Text Analytics', concept: 'Extracting interpretable themes from open student comments' },
    { topic: 'Sentiment & Topic Categorisation', concept: 'Transparent rule-based partitioning of constructive feedback' },
    { topic: 'Feedback-Driven Educator Action', concept: 'Closing the pedagogical loop via documented classroom interventions' }
  ];

  return (
    <div className="space-y-10 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Research Platform Overview</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Research Overview
        </h1>
        <p className="text-base text-indigo-700 dark:text-indigo-400 font-semibold">
          StudySnippet — Misconception-Aware Learning & Educational Feedback Analytics
        </p>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          An academic technology research prototype investigating how cognitive diagnostics, usability engineering,
          and transparent feedback analytics can work together to improve teaching and learning.
        </p>
      </div>

      {/* SECTION A — RESEARCH PROBLEM */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Target className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Section A: Research Problem & Motivation
          </h2>
        </div>

        <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-3">
          <p>
            Conventional online quizzes often provide only scores and may fail to reveal why a learner selected an incorrect option
            or whether the learner is highly confident in a misconception.
          </p>
          <p>
            Traditional student-feedback systems may collect ratings and comments without systematically transforming qualitative feedback
            into actionable educational insights.
          </p>
          <p className="font-medium text-slate-900 dark:text-white">
            StudySnippet investigates these challenges through diagnostic assessment, confidence-aware learning analytics, usability evaluation and educational feedback analytics.
          </p>
        </div>
      </section>

      {/* THREE RESEARCH PILLARS (SECTIONS B, C, D) */}
      <section className="space-y-6">
        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-600" />
          <span>The Three Connected Research Pillars</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* SECTION B — DIAGNOSTIC LEARNING */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                  Pillar 1 • Cognitive Tech
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Diagnostic Learning
                </h3>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 italic">
                “Can misconception-driven distractors combined with confidence tracking help identify hidden conceptual errors beyond score-only assessment?”
              </div>
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Key Metrics:</span>
                <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside">
                  <li>Correctness & error rates</li>
                  <li>Distractor trap selection frequency</li>
                  <li>Confidence calibration (50%, 75%, 100%)</li>
                  <li>High-confidence incorrect responses</li>
                  <li>Topic-level misconception frequency</li>
                  <li>Immediate retake improvement</li>
                </ul>
              </div>
            </div>

            <Link
              to="/quiz"
              className="pt-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
            >
              <span>Explore Diagnostic Quizzes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* SECTION C — HCI / USABILITY */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                  Pillar 2 • HCI Research
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  HCI & Usability
                </h3>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 italic">
                “How usable and efficient is the StudySnippet research prototype for learners and educators?”
              </div>
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Key Metrics:</span>
                <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside">
                  <li>Validated 10-item SUS psychometrics</li>
                  <li>Individual participant SUS responses</li>
                  <li>Average SUS usability score (0–100)</li>
                  <li>Standardized 0–100 scale score (Brooke, 1996)</li>
                  <li>Task completion observations where available</li>
                  <li>Cognitive load considerations</li>
                </ul>
              </div>
            </div>

            <Link
              to="/hci-research"
              className="pt-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
            >
              <span>View Usability Study</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* SECTION D — EDUCATIONAL FEEDBACK ANALYTICS */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 dark:bg-purple-950 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 block">
                  Pillar 3 • Educational Analytics
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Feedback Analytics & Action
                </h3>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 italic">
                “Can anonymous qualitative feedback be transformed into interpretable categories that support teaching improvement?”
              </div>
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Key Metrics:</span>
                <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside">
                  <li>Evaluation volume and submission rates</li>
                  <li>6-parameter multidimensional ratings</li>
                  <li>Transparent rule-based sentiment categories</li>
                  <li>Identified pedagogical themes</li>
                  <li>Recorded teaching interventions</li>
                  <li>Academic oversight verification logs</li>
                </ul>
              </div>
            </div>

            <Link
              to="/pedagogical-adjustments"
              className="pt-2 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline inline-flex items-center gap-1"
            >
              <span>Feedback-to-Action Loop</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION E — RESEARCH WORKFLOW */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Layers className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Section E: Research Workflows & Methodological Pipelines
          </h2>
        </div>

        {/* FLOW 1 */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-3">
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
            Flow 1: Diagnostic Assessment & Testing Effect Pipeline
          </span>
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
            <span className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold">
              1. Participant
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold">
              2. Diagnostic MCQ
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold">
              3. Confidence Rating
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 font-bold">
              4. Misconception Detection
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold">
              5. Explanatory Feedback
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold">
              6. Active Retake
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300 font-bold">
              7. Learning Analytics
            </span>
          </div>
        </div>

        {/* FLOW 2 */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-3">
          <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">
            Flow 2: Educational Feedback-to-Action Research Loop
          </span>
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
            <span className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold">
              1. Anonymous Feedback
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold">
              2. Text Categorisation
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold">
              3. Theme & Sentiment Insight
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300 font-bold">
              4. Educator Action Logged
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold">
              5. Follow-Up & Academic Evaluation
            </span>
          </div>
        </div>
      </section>

      {/* SECTION F — DATA TRANSPARENCY & PROVENANCE */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Shield className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Section F: Data Provenance & Scientific Transparency
          </h2>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 leading-relaxed space-y-1">
          <span className="font-bold block">Scientific Integrity Notice:</span>
          <p>
            Demo data is used only to demonstrate interface functionality. Research conclusions must be based only on collected participant data.
            Synthetic demonstration records are never combined silently with collected empirical submissions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400">Quiz Attempts</span>
              <DataProvenanceBadge state={storedAttempts.length > 0 ? "collected" : "insufficient"} compact />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {storedAttempts.length}
            </div>
            <p className="text-[10px] text-slate-400">Locally saved attempts</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400">SUS Responses</span>
              <DataProvenanceBadge state={storedSUS.length > 0 ? "collected" : "insufficient"} compact />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {storedSUS.length}
            </div>
            <p className="text-[10px] text-slate-400">Standardized SUS submissions</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400">Evaluations</span>
              <DataProvenanceBadge
                state={collectedFeedbackCount > 0 ? "collected" : "insufficient"}
                compact
              />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {collectedFeedbackCount}
            </div>
            <p className="text-[10px] text-slate-400">
              {collectedFeedbackCount > 0
                ? "Collected participant submissions"
                : `No collected data yet (${demoFeedbackCount} demo records)`}
            </p>
          </div>
        </div>
      </section>

      {/* SECTION G — RESEARCH STATUS */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <BarChart3 className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Section G: Research Milestones & Execution Status
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {RESEARCH_PHASES.map((phase) => (
            <div
              key={phase.title}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-2"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  {phase.title}
                </h3>
                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${phase.statusClass}`}>
                  {phase.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                {phase.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION H — RESEARCH LITERATURE FRAMEWORK (PPT & PAPER COMPATIBILITY) */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Section H: Research Literature Framework
              </h2>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                Provisional
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Ten conceptual research themes underpinning the prototype design. Specific paper citations are treated as provisional until independently verified.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {LITERATURE_FRAMEWORK.map((lit, idx) => (
            <div
              key={lit.topic}
              className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 text-xs flex items-start gap-2.5"
            >
              <span className="w-5 h-5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-[10px] flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  {lit.topic}
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  {lit.concept}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* RESEARCH ETHICS STATEMENT */}
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-3">
        <Shield className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block text-slate-800 dark:text-slate-200">
            Academic Research Ethics Note:
          </span>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Research metrics should be collected with informed participant consent and used only for academic evaluation
            in accordance with institutional guidance. This web prototype does not claim institutional IRB approval.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResearchOverviewPage;
