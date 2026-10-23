import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { PARAMETER_KEYS, PARAMETER_LABELS } from '../../utils/calculations';

function RadarTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-lg border border-slate-700 text-xs">
        <p className="font-bold">{item.parameter}</p>
        <p className="text-indigo-300 font-semibold mt-0.5">
          Score: {item.score.toFixed(2)} / 5.0
        </p>
      </div>
    );
  }
  return null;
}

export function ParameterRadarChart({ parameterAverages = {}, title = 'Parameter Performance' }) {
  const data = PARAMETER_KEYS.map(key => ({
    parameter: PARAMETER_LABELS[key] || key,
    shortLabel: key === 'subjectKnowledge' ? 'Knowledge'
      : key === 'clarity' ? 'Clarity'
      : key === 'communication' ? 'Comm.'
      : key === 'engagement' ? 'Engagement'
      : key === 'punctuality' ? 'Punctuality'
      : 'Satisfaction',
    score: parameterAverages[key] || 0
  }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#cbd5e1" opacity={0.6} />
          <PolarAngleAxis
            dataKey="shortLabel"
            tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 5]}
            ticks={[1, 2, 3, 4, 5]}
            tick={{ fontSize: 9, fill: '#94a3b8' }}
          />
          <Tooltip content={<RadarTooltip />} />
          <Radar
            name={title}
            dataKey="score"
            stroke="#4f46e5"
            fill="#6366f1"
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
