import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

function TrendTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg border border-slate-700 text-xs">
        <p className="font-bold text-sm mb-1">{label}</p>
        {payload.map((entry, idx) => (
          <p key={idx} className="flex items-center justify-between gap-4 py-0.5">
            <span style={{ color: entry.color }}>{entry.name}:</span>
            <span className="font-bold text-white">
              {entry.name.includes('Average') ? Number(entry.value).toFixed(2) : entry.value}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export function FeedbackTrendLineChart({ trendData = [] }) {
  if (!trendData || trendData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-400">
        No feedback trend data available
      </div>
    );
  }

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={trendData} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: '#64748b' }}
          />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 11, fill: '#64748b' }}
            allowDecimals={false}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, 5]}
            ticks={[1, 2, 3, 4, 5]}
            tick={{ fontSize: 11, fill: '#64748b' }}
          />
          <Tooltip content={<TrendTooltip />} />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="count"
            name="Submissions Volume"
            stroke="#4f46e5"
            strokeWidth={2.5}
            dot={{ r: 4, fill: '#4f46e5' }}
            activeDot={{ r: 6 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="average"
            name="Average Rating"
            stroke="#10b981"
            strokeWidth={2.5}
            dot={{ r: 4, fill: '#10b981' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
