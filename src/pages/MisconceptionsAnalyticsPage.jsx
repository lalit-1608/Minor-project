import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ChartCard } from '../components/common/ChartCard';
import { DataProvenanceBadge } from '../components/research/DataProvenanceBadge';
import {
  DEMO_RESEARCH_DATA,
  QUIZ_QUESTIONS,
  calculateCollectedQuizAnalytics
} from '../services/quizData';
import {
  Brain,
  Zap,
  Target,
  AlertTriangle,
  BookOpen,
  Sparkles,
  Info,
  FlaskConical,
  Database,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell
} from 'recharts';

export function MisconceptionsAnalyticsPage() {
  const [viewMode, setViewMode] = useState('auto'); // 'auto' | 'demo'
  const FALLACY_COLORS = ['#ef4444', '#f97316', '#eab308', '#6366f1', '#8b5cf6'];

  const collectedAnalytics = calculateCollectedQuizAnalytics();
  const hasCollected = collectedAnalytics.hasCollectedData;

  const isShowingDemo = viewMode === 'demo' || (!hasCollected && viewMode === 'auto');

  // Chart dataset based on active mode
  const testingEffectData = (!isShowingDemo && collectedAnalytics.testingEffectComparison.length > 0)
    ? collectedAnalytics.testingEffectComparison
    : DEMO_RESEARCH_DATA.testingEffect;

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-1.5">
            <Brain className="w-3.5 h-3.5 text-indigo-600" />
            <span>Diagnostic Learning Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Misconception Analytics & Cognitive Traps
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Research Question: Can misconception-driven distractors combined with confidence tracking help identify hidden conceptual errors beyond score-only assessment?
          </p>
        </div>

        <div className="flex items-center gap-2">
          {hasCollected && (
            <div className="inline-flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
              <button
                onClick={() => setViewMode('auto')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  viewMode === 'auto'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Collected Data ({collectedAnalytics.totalAttempts})
              </button>
              <button
                onClick={() => setViewMode('demo')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  viewMode === 'demo'
                    ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Demo Dataset
              </button>
            </div>
          )}
          <Link
            to="/quiz"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 shrink-0"
          >
            <span>Take Diagnostic Quiz</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Provenance Badge */}
      <DataProvenanceBadge
        state={isShowingDemo ? (hasCollected ? 'demo' : 'insufficient') : 'collected'}
        sampleSize={!isShowingDemo ? collectedAnalytics.totalAttempts : undefined}
        label={
          isShowingDemo
            ? (hasCollected ? 'Viewing Synthetic Demonstration Dataset' : 'No Collected Participant Data Yet — Showing Demo Dataset')
            : `Collected Attempt Data (n = ${collectedAnalytics.totalAttempts} attempts)`
        }
      />

      {/* Research Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Card 1: First Attempt Accuracy or Error */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 block">First-Attempt Accuracy</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {isShowingDemo
              ? '35%'
              : (collectedAnalytics.firstAttemptAccuracy !== null ? `${collectedAnalytics.firstAttemptAccuracy}%` : '—')}
          </div>
          <p className="text-[10px] text-slate-400">
            {isShowingDemo ? 'Demo dataset value' : (collectedAnalytics.firstAttemptsCount > 0 ? `${collectedAnalytics.firstAttemptsCount} first attempts` : 'Awaiting attempts')}
          </p>
        </div>

        {/* Card 2: Retake Accuracy */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 block">Retake Accuracy</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {isShowingDemo
              ? '89%'
              : (collectedAnalytics.retakeAccuracy !== null ? `${collectedAnalytics.retakeAccuracy}%` : '—')}
          </div>
          <p className="text-[10px] text-slate-400">
            {isShowingDemo ? 'Demo dataset value' : (collectedAnalytics.retakeAttemptsCount > 0 ? `${collectedAnalytics.retakeAttemptsCount} retake attempts` : 'Awaiting retake data')}
          </p>
        </div>

        {/* Card 3: Immediate Retake Improvement */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 block">Immediate Retake Gain</span>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
            {isShowingDemo
              ? '+54% pts'
              : (collectedAnalytics.immediateRetakeImprovement !== null ? `+${collectedAnalytics.immediateRetakeImprovement}% pts` : 'Pending')}
          </div>
          <p className="text-[10px] text-slate-400">Immediate post-feedback retry</p>
        </div>

        {/* Card 4: High-Confidence Errors */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 block">High-Confidence Errors</span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {isShowingDemo
              ? '42%'
              : (collectedAnalytics.highConfidenceErrorRate !== null ? `${collectedAnalytics.highConfidenceErrorRate}%` : '0')}
          </div>
          <p className="text-[10px] text-slate-400">
            {isShowingDemo ? 'Demo dataset rate' : `${collectedAnalytics.highConfidenceErrorCount} instances observed`}
          </p>
        </div>
      </div>

      {/* High-Confidence Incorrect Responses Scientific Note */}
      <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-start gap-3">
        <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <div className="text-xs text-indigo-950 dark:text-indigo-200 space-y-1">
          <span className="font-bold block">Scientific Context on High-Confidence Errors:</span>
          <p>
            A high-confidence incorrect response may indicate a strongly held misconception and can be prioritised for targeted revision.
            In metacognitive research, learners who choose an engineered distractor with maximum confidence often experience the "illusion of competence,"
            making diagnostic distractor analysis significantly more informative than score-only testing.
          </p>
        </div>
      </div>

      {/* Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Chart 1: Initial Attempt vs Immediate Retake */}
        <ChartCard
          title={isShowingDemo ? "Demo: Round 1 vs Retake Error Rates by Topic" : "Initial Attempt vs Retake Error Rate by Topic"}
          subtitle="Comparing error frequency between initial attempt and immediate retake after explanatory feedback"
        >
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={testingEffectData}
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis dataKey="topic" tick={{ fontSize: 9 }} interval={0} angle={-10} textAnchor="end" />
                <YAxis unit="%" tick={{ fontSize: 10 }} />
                <Tooltip formatter={(val) => [`${val}%`, 'Error Rate']} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="initialErrorRate" name="First Attempt Error (%)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="retakeErrorRate" name="Retake Error (%)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Chart 2: Cognitive Distractor / Fallacy Distribution */}
        <ChartCard
          title={isShowingDemo ? "Demo: Cognitive Trap Frequency Distribution" : "Distractor Selection Distribution"}
          subtitle={isShowingDemo ? "Synthetic benchmark across 5 engineered cognitive biases" : "Observed frequency across collected attempts"}
        >
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={DEMO_RESEARCH_DATA.fallacyDistribution}
                margin={{ top: 10, right: 20, left: 30, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.2} />
                <XAxis type="number" unit="%" tick={{ fontSize: 10 }} domain={[0, 100]} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={120} />
                <Tooltip formatter={(val) => [`${val}% frequency`, 'Fallacy Trap']} />
                <Bar dataKey="frequency" name="Distractor Trap Frequency" radius={[0, 4, 4, 0]}>
                  {DEMO_RESEARCH_DATA.fallacyDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={FALLACY_COLORS[index % FALLACY_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Catalog of Engineered Distractor Traps */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>Diagnostic Misconception Item Catalog</span>
          </h2>
          <p className="text-xs text-slate-500">
            Engineered MCQs targeting documented misconceptions with plausible cognitive distractors:
          </p>
        </div>

        <div className="space-y-3">
          {QUIZ_QUESTIONS.map((q) => {
            const trapOptions = q.options.filter(o => o.isTrap);
            return (
              <div
                key={q.id}
                className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {q.subjectCode} • {q.topic}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">
                    {q.difficulty}
                  </span>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-200 font-medium">
                  {q.question}
                </p>

                {trapOptions.map(trap => (
                  <div
                    key={trap.id}
                    className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 text-xs space-y-0.5"
                  >
                    <div className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Engineered Distractor: {trap.trapType}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      {trap.explanation}
                    </p>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
