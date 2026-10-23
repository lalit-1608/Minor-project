import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

function SemesterTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg border border-slate-700 text-xs">
        <p className="font-bold text-sm mb-1">{item.fullLabel}</p>
        <p className="text-slate-300">
          Average Rating: <span className="font-bold text-emerald-400">{item.average.toFixed(2)} / 5.0</span>
        </p>
        <p className="text-slate-400">Feedback Count: {item.count}</p>
        <div className="mt-1.5 pt-1.5 border-t border-slate-700 text-[11px]">
          <p className="text-emerald-300">Top: {item.highest}</p>
          <p className="text-amber-300">Low: {item.lowest}</p>
        </div>
      </div>
    );
  }
  return null;
}

export function SemesterBarChart({ semesterStats = [] }) {
  if (!semesterStats || semesterStats.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-400">
        No semester data available
      </div>
    );
  }

  const chartData = semesterStats.map(s => ({
    name: `Sem ${s.semNumber}`,
    fullLabel: s.semester,
    average: s.overallAverage,
    count: s.feedbackCount,
    highest: s.highestParameter,
    lowest: s.lowestParameter
  }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: '#64748b' }}
          />
          <YAxis
            domain={[0, 5]}
            ticks={[1, 2, 3, 4, 5]}
            tick={{ fontSize: 11, fill: '#64748b' }}
          />
          <Tooltip content={<SemesterTooltip />} />
          <Bar
            dataKey="average"
            fill="#0284c7"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
