import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChartCard } from '../components/common/ChartCard';
import { SUSSurveyModal, getStoredSUSResponses } from '../components/hci/SUSSurveyModal';
import { DataProvenanceBadge } from '../components/research/DataProvenanceBadge';
import {
  Sparkles,
  Star,
  Clock,
  Info,
  FlaskConical,
  Users
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export function HciResearchPage() {
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const [showDemoChart, setShowDemoChart] = useState(false);

  const collectedResponses = getStoredSUSResponses();
  const hasCollectedData = collectedResponses.length > 0;

  const averageSUS = hasCollectedData
    ? Math.round((collectedResponses.reduce((sum, r) => sum + r.score, 0) / collectedResponses.length) * 10) / 10
    : null;

  // Demo speed data — clearly labelled as conceptual illustration
  const demoSpeedData = [
    { task: 'Taking a Quiz', conceptualBaseline: 320, prototypeEstimate: 150 },
    { task: 'Submitting Feedback', conceptualBaseline: 240, prototypeEstimate: 95 },
    { task: 'Viewing Reports', conceptualBaseline: 180, prototypeEstimate: 80 }
  ];

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>HCI / Usability Research</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            System Usability Scale (SUS) Evaluation
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Research Question: How usable and efficient is the StudySnippet research prototype for learners and educators? SUS is reported as a standardized 0–100 scale score.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsSurveyOpen(true)}
            className="px-4 py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold shadow-xs hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Quick Survey Modal</span>
          </button>
          <Link
            to="/usability-survey"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 w-fit"
          >
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>Participant Survey Portal</span>
          </Link>
        </div>
      </div>

      {/* Data Provenance */}
      <DataProvenanceBadge
        state={hasCollectedData ? 'collected' : 'insufficient'}
        sampleSize={hasCollectedData ? collectedResponses.length : undefined}
      />

      {/* SUS Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 block">SUS Score</span>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {averageSUS !== null ? `${averageSUS}` : '—'}
            <span className="text-lg text-slate-400"> / 100</span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
            {averageSUS !== null ? 'Standardized 0–100 scale score' : 'No collected responses yet'}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 block">Participants</span>
          <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
            {collectedResponses.length}
          </div>
          <p className="text-[10px] text-slate-400">
            {collectedResponses.length > 0 ? 'SUS responses collected' : 'No collected participant data yet'}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 block">Task Completion</span>
          <div className="text-xl font-black text-slate-500 dark:text-slate-400">Pending</div>
          <p className="text-[10px] text-slate-400">Awaiting participant observations</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 block">Methodology</span>
          <div className="text-lg font-black text-purple-600 dark:text-purple-400">SUS</div>
          <p className="text-[10px] text-slate-400">Brooke (1996), 10-item validated scale</p>
        </div>
      </div>

      {/* SUS Methodology */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Info className="w-4 h-4 text-indigo-600" />
          SUS Scoring Methodology
        </h3>
        <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
          <p>
            The System Usability Scale (SUS) is a validated 10-item questionnaire using a 1–5 Likert scale with
            alternating positive and negative statements.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
              <span className="font-bold block mb-1">Odd-numbered items (positive):</span>
              <span className="font-mono text-[11px]">contribution = response − 1</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
              <span className="font-bold block mb-1">Even-numbered items (negative):</span>
              <span className="font-mono text-[11px]">contribution = 5 − response</span>
            </div>
          </div>
          <p>
            <strong>Final SUS Score</strong> = sum of all contributions × 2.5 (range: 0–100).
          </p>
        </div>
      </div>

      {/* Collected Responses Table */}
      {hasCollectedData && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            Collected SUS Responses
            <DataProvenanceBadge state="collected" sampleSize={collectedResponses.length} compact />
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-2 px-3 font-bold text-slate-500">#</th>
                  <th className="text-left py-2 px-3 font-bold text-slate-500">Participant Identifier</th>
                  <th className="text-left py-2 px-3 font-bold text-slate-500">Role</th>
                  <th className="text-right py-2 px-3 font-bold text-slate-500">SUS Score</th>
                  <th className="text-right py-2 px-3 font-bold text-slate-500">Date</th>
                </tr>
              </thead>
              <tbody>
                {collectedResponses.map((r, i) => (
                  <tr key={r.id} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-2 px-3 text-slate-400">{i + 1}</td>
                    <td className="py-2 px-3 text-slate-700 dark:text-slate-300 font-medium font-mono">
                      {r.participantId || (r.participant && r.participant.startsWith('Participant') ? r.participant : `Participant (${r.role || 'student'})`)}
                    </td>
                    <td className="py-2 px-3 text-slate-500 capitalize">{r.role}</td>
                    <td className="py-2 px-3 text-right font-bold text-indigo-600 dark:text-indigo-400">{r.score}</td>
                    <td className="py-2 px-3 text-right text-slate-400">{new Date(r.submittedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Task Completion Study — Honest Status */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-600" />
          Task Completion Time Study
        </h3>
        <DataProvenanceBadge state="insufficient" />
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Task completion study pending participant data. Planned methodology: measure time-on-task for
          selected research interactions (quiz completion, feedback submission, report review) with consenting participants.
        </p>

        {/* Demo chart toggle */}
        <button
          onClick={() => setShowDemoChart(!showDemoChart)}
          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
        >
          <FlaskConical className="w-3.5 h-3.5" />
          {showDemoChart ? 'Hide' : 'Show'} Conceptual Illustration
        </button>

        {showDemoChart && (
          <div className="space-y-2">
            <DataProvenanceBadge state="demo" label="Conceptual Illustration" />
            <ChartCard
              title="Conceptual Task Duration Comparison"
              subtitle="Illustrative estimates — not based on collected observations"
            >
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={demoSpeedData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                    <XAxis dataKey="task" tick={{ fontSize: 10 }} />
                    <YAxis unit="s" tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(val) => [`${val} seconds`, 'Estimated Time']} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Bar dataKey="conceptualBaseline" name="Typical Portal (Estimated)" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="prototypeEstimate" name="StudySnippet (Estimated)" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
        )}
      </div>

      {/* Research Ethics Note */}
      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2">
        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
        <span>
          Research metrics should be collected with informed participant consent and used only for academic evaluation
          in accordance with institutional guidance.
        </span>
      </div>

      <SUSSurveyModal isOpen={isSurveyOpen} onClose={() => setIsSurveyOpen(false)} />
    </div>
  );
}
