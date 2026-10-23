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

function FacultyTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg border border-slate-700 text-xs">
        <p className="font-bold text-sm mb-1">{item.fullName}</p>
        <p className="text-slate-300">
          Average Rating: <span className="font-bold text-amber-400">{item.rating.toFixed(2)} / 5.0</span>
        </p>
        <p className="text-slate-400 mt-0.5">
          Based on {item.count} evaluations
        </p>
      </div>
    );
  }
  return null;
}

export function FacultyBarChart({ data = [], onSelectFaculty }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-400">
        No faculty performance data available
      </div>
    );
  }

  // Format data: take top 8 faculty for clean bar representation
  const chartData = data
    .filter(d => typeof d.overallAverage === 'number' && d.overallAverage > 0)
    .slice(0, 8)
    .map(d => ({
      id: d.facultyId || d.faculty?.id,
      name: (d.faculty?.name || 'Faculty').replace('Dr. ', '').replace('Prof. ', ''),
      fullName: d.faculty?.name || 'Faculty',
      department: d.faculty?.departmentId || '',
      rating: d.overallAverage,
      count: d.feedbackCount
    }));

  const getColor = (rating) => {
    if (rating >= 4.0) return '#10b981'; // emerald
    if (rating >= 3.5) return '#3b82f6'; // blue
    if (rating >= 3.0) return '#f59e0b'; // amber
    return '#ef4444'; // rose
  };

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: '#64748b' }}
            angle={-25}
            textAnchor="end"
            interval={0}
          />
          <YAxis
            domain={[0, 5]}
            ticks={[1, 2, 3, 4, 5]}
            tick={{ fontSize: 11, fill: '#64748b' }}
          />
          <Tooltip content={<FacultyTooltip />} />
          <Bar
            dataKey="rating"
            radius={[6, 6, 0, 0]}
            cursor="pointer"
            onClick={(entry) => onSelectFaculty && onSelectFaculty(entry.id)}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.rating)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
