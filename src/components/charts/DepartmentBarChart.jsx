import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

function DepartmentTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg border border-slate-700 text-xs">
        <p className="font-bold text-sm mb-1">{item.fullName} ({item.name})</p>
        <p className="text-slate-300">
          Average: <span className="font-bold text-amber-400">{item.average.toFixed(2)} / 5.0</span> ({item.percentage}%)
        </p>
        <p className="text-slate-400 mt-0.5">
          Total Evaluations: {item.count}
        </p>
      </div>
    );
  }
  return null;
}

export function DepartmentBarChart({ departmentStats = [] }) {
  if (!departmentStats || departmentStats.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-400">
        No department data available
      </div>
    );
  }

  const chartData = departmentStats.map(d => ({
    name: d.department.code,
    fullName: d.department.name,
    average: d.overallAverage,
    count: d.feedbackCount,
    percentage: d.percentage
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
          <Tooltip content={<DepartmentTooltip />} />
          <Bar dataKey="average" radius={[6, 6, 0, 0]}>
            {chartData.map((entry, index) => {
              const color = entry.average >= 4.0 ? '#4f46e5' : entry.average >= 3.5 ? '#3b82f6' : '#f59e0b';
              return <Cell key={`cell-${index}`} fill={color} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
