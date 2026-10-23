import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { ChartCard } from '../components/common/ChartCard';
import { PerformanceBadge } from '../components/common/PerformanceBadge';
import { PARAMETER_KEYS, PARAMETER_LABELS } from '../utils/calculations';
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
import { Check, Plus, Sparkles } from 'lucide-react';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ec4899'];

function CompareTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg border border-slate-700 text-xs">
        <p className="font-bold mb-1.5">{item.fullLabel}</p>
        {payload.map((entry, idx) => (
          <p key={idx} className="flex items-center justify-between gap-4 py-0.5">
            <span style={{ color: entry.color }}>{entry.name}:</span>
            <span className="font-bold text-white">{Number(entry.value).toFixed(2)}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export function ComparePage() {
  const { faculty, rankedFaculty, departments } = useData();

  // Default selection: top 2 faculty
  const [selectedIds, setSelectedIds] = useState(() => {
    return rankedFaculty.slice(0, 2).map(r => r.faculty.id);
  });

  const toggleFaculty = (id) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 2) {
        setSelectedIds(prev => prev.filter(item => item !== id));
      }
    } else {
      if (selectedIds.length < 4) {
        setSelectedIds(prev => [...prev, id]);
      }
    }
  };

  // Selected faculty stats
  const selectedStats = useMemo(() => {
    return selectedIds
      .map(id => rankedFaculty.find(r => r.faculty.id === id))
      .filter(Boolean);
  }, [selectedIds, rankedFaculty]);

  // Dynamic winner calculation
  const winner = useMemo(() => {
    if (selectedStats.length === 0) return null;

    let bestOverall = selectedStats[0];
    let bestKnowledge = selectedStats[0];
    let bestClarity = selectedStats[0];
    let bestEngagement = selectedStats[0];

    selectedStats.forEach(s => {
      if (s.overallAverage > bestOverall.overallAverage) bestOverall = s;
      if ((s.parameterAverages.subjectKnowledge || 0) > (bestKnowledge.parameterAverages.subjectKnowledge || 0)) bestKnowledge = s;
      if ((s.parameterAverages.clarity || 0) > (bestClarity.parameterAverages.clarity || 0)) bestClarity = s;
      if ((s.parameterAverages.engagement || 0) > (bestEngagement.parameterAverages.engagement || 0)) bestEngagement = s;
    });

    return {
      bestOverall,
      bestKnowledge,
      bestClarity,
      bestEngagement
    };
  }, [selectedStats]);

  // Grouped comparison data for the Bar Chart
  const chartData = useMemo(() => {
    return PARAMETER_KEYS.map(key => {
      const row = {
        parameter: key === 'subjectKnowledge' ? 'Knowledge'
          : key === 'clarity' ? 'Clarity'
          : key === 'communication' ? 'Comm.'
          : key === 'engagement' ? 'Engagement'
          : key === 'punctuality' ? 'Punctuality'
          : 'Satisfaction',
        fullLabel: PARAMETER_LABELS[key]
      };

      selectedStats.forEach((s) => {
        row[`fac_${s.faculty.id}`] = s.parameterAverages[key] || 0;
      });

      return row;
    });
  }, [selectedStats]);

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Faculty Comparative Analysis
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Select between 2 and 4 faculty members to perform side-by-side metric comparisons across evaluated criteria.
        </p>
      </div>

      {/* Selector Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Selected Faculty ({selectedIds.length} of 4)
          </span>
          <span className="text-[11px] text-slate-400">
            Select 2–4 faculty to compare
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {faculty.map((f) => {
            const isSelected = selectedIds.includes(f.id);
            const dept = departments.find(d => d.id === f.departmentId);
            const colorIdx = selectedIds.indexOf(f.id);

            return (
              <button
                key={f.id}
                type="button"
                onClick={() => toggleFaculty(f.id)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-semibold shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {isSelected && (
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: COLORS[colorIdx] }}
                  />
                )}
                <span>{f.name}</span>
                <span className="text-[10px] text-slate-400">({dept?.code})</span>
                {isSelected ? (
                  <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                ) : (
                  <Plus className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Calculated Winner Spotlight (Based on actual data!) */}
      {winner && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-50/80 via-blue-50/50 to-emerald-50/80 dark:from-indigo-950/30 dark:via-blue-950/20 dark:to-emerald-950/30 border border-indigo-200/80 dark:border-indigo-900 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-200">
              Comparative Analysis Insights
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="bg-white/80 dark:bg-slate-900/80 p-3.5 rounded-xl border border-indigo-100 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Highest Overall Rating</span>
              <p className="font-extrabold text-sm text-slate-900 dark:text-white mt-1">
                {winner.bestOverall.faculty.name}
              </p>
              <p className="text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                {winner.bestOverall.overallAverage.toFixed(2)} / 5.0
              </p>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/80 p-3.5 rounded-xl border border-indigo-100 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Top Subject Knowledge</span>
              <p className="font-extrabold text-sm text-slate-900 dark:text-white mt-1">
                {winner.bestKnowledge.faculty.name}
              </p>
              <p className="text-indigo-600 dark:text-indigo-400 font-bold mt-0.5">
                {(winner.bestKnowledge.parameterAverages.subjectKnowledge || 0).toFixed(2)} / 5.0
              </p>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/80 p-3.5 rounded-xl border border-indigo-100 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Highest Clarity / Explanation</span>
              <p className="font-extrabold text-sm text-slate-900 dark:text-white mt-1">
                {winner.bestClarity.faculty.name}
              </p>
              <p className="text-blue-600 dark:text-blue-400 font-bold mt-0.5">
                {(winner.bestClarity.parameterAverages.clarity || 0).toFixed(2)} / 5.0
              </p>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/80 p-3.5 rounded-xl border border-indigo-100 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Strongest Engagement</span>
              <p className="font-extrabold text-sm text-slate-900 dark:text-white mt-1">
                {winner.bestEngagement.faculty.name}
              </p>
              <p className="text-purple-600 dark:text-purple-400 font-bold mt-0.5">
                {(winner.bestEngagement.parameterAverages.engagement || 0).toFixed(2)} / 5.0
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Grouped Bar Chart */}
      <ChartCard
        title="Side-by-Side Parameter Performance"
        subtitle="Grouped comparison across all 6 evaluated educational criteria"
      >
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 15, right: 15, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
              <XAxis dataKey="parameter" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip content={<CompareTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              {selectedStats.map((s, idx) => (
                <Bar
                  key={s.faculty.id}
                  dataKey={`fac_${s.faculty.id}`}
                  name={s.faculty.name}
                  fill={COLORS[idx]}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Detailed Side-by-Side Comparison Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-3 px-4">Evaluation Metric</th>
                {selectedStats.map((s, idx) => (
                  <th key={s.faculty.id} className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                      <span className="font-bold text-slate-900 dark:text-white">{s.faculty.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {/* Department */}
              <tr className="hover:bg-slate-50/40 dark:hover:bg-slate-800/30">
                <td className="py-3 px-4 font-semibold text-slate-600 dark:text-slate-400">Department</td>
                {selectedStats.map(s => {
                  const dept = departments.find(d => d.id === s.faculty.departmentId);
                  return (
                    <td key={s.faculty.id} className="py-3 px-4 text-center text-slate-800 dark:text-slate-200">
                      {dept?.name || '—'}
                    </td>
                  );
                })}
              </tr>

              {/* Status */}
              <tr className="hover:bg-slate-50/40 dark:hover:bg-slate-800/30">
                <td className="py-3 px-4 font-semibold text-slate-600 dark:text-slate-400">Performance Status</td>
                {selectedStats.map(s => (
                  <td key={s.faculty.id} className="py-3 px-4 text-center">
                    <PerformanceBadge statusInfo={s.statusInfo} size="sm" />
                  </td>
                ))}
              </tr>

              {/* Overall Average */}
              <tr className="bg-indigo-50/30 dark:bg-indigo-950/20 font-bold">
                <td className="py-3.5 px-4 text-indigo-900 dark:text-indigo-200">Overall Average Rating</td>
                {selectedStats.map(s => (
                  <td key={s.faculty.id} className="py-3.5 px-4 text-center text-indigo-700 dark:text-indigo-300 text-sm">
                    {s.overallAverage.toFixed(2)} / 5.0
                  </td>
                ))}
              </tr>

              {/* Percentage */}
              <tr className="hover:bg-slate-50/40 dark:hover:bg-slate-800/30">
                <td className="py-3 px-4 font-semibold text-slate-600 dark:text-slate-400">Percentage Score</td>
                {selectedStats.map(s => (
                  <td key={s.faculty.id} className="py-3 px-4 text-center font-bold text-slate-800 dark:text-slate-200">
                    {s.percentage.toFixed(1)}%
                  </td>
                ))}
              </tr>

              {/* Feedback Count */}
              <tr className="hover:bg-slate-50/40 dark:hover:bg-slate-800/30">
                <td className="py-3 px-4 font-semibold text-slate-600 dark:text-slate-400">Evaluation Submissions</td>
                {selectedStats.map(s => (
                  <td key={s.faculty.id} className="py-3 px-4 text-center text-slate-800 dark:text-slate-200 font-semibold">
                    {s.feedbackCount}
                  </td>
                ))}
              </tr>

              {/* Six Parameters */}
              {PARAMETER_KEYS.map(key => (
                <tr key={key} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/30">
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{PARAMETER_LABELS[key]}</td>
                  {selectedStats.map(s => (
                    <td key={s.faculty.id} className="py-3 px-4 text-center font-medium text-slate-800 dark:text-slate-200">
                      {(s.parameterAverages[key] || 0).toFixed(2)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
