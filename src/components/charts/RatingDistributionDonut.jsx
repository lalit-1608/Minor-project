import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

function DonutTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-lg border border-slate-700 text-xs">
        <p className="font-bold">{item.rating}</p>
        <p className="text-slate-300 mt-0.5">
          Count: <span className="font-bold text-white">{item.count}</span> ({item.percentage}%)
        </p>
      </div>
    );
  }
  return null;
}

export function RatingDistributionDonut({ distribution = [] }) {
  const total = distribution.reduce((sum, item) => sum + item.count, 0);

  if (total === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-400">
        No rating distribution data available
      </div>
    );
  }

  return (
    <div className="w-full h-72 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="w-full sm:w-1/2 h-56 relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<DonutTooltip />} />
            <Pie
              data={distribution}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="count"
            >
              {distribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {total}
          </span>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Total Ratings
          </span>
        </div>
      </div>

      {/* Legend list */}
      <div className="w-full sm:w-1/2 space-y-1.5 text-xs">
        {distribution.map((item) => (
          <div key={item.stars} className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {item.stars} Star{item.stars > 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold text-slate-900 dark:text-white">
                {item.count}
              </span>
              <span className="text-slate-400 w-12 text-right">
                {item.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
