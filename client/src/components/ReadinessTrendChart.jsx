import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { TrendingUp, History } from 'lucide-react';

export default function ReadinessTrendChart({ history = [] }) {
  if (!history || history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-slate-500">
        <History className="w-8 h-8 mb-2 opacity-50" />
        <p className="text-xs">Complete missions to record your readiness trajectory over time.</p>
      </div>
    );
  }

  const data = history.map((h, i) => {
    const d = new Date(h.computedAt);
    const dateLabel = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    return {
      date: dateLabel,
      score: h.score,
      checkpoint: `Entry #${i + 1}`
    };
  });

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const p = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-xl shadow-xl text-xs">
          <p className="text-slate-400 font-medium">{p.date}</p>
          <p className="text-sm font-bold text-cyan-400 mt-0.5">{p.score}% Readiness</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-44">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis 
            dataKey="date" 
            tick={{ fill: '#64748b', fontSize: 10 }} 
            axisLine={{ stroke: '#334155' }}
          />
          <YAxis 
            domain={[0, 100]} 
            tick={{ fill: '#64748b', fontSize: 10 }} 
            axisLine={{ stroke: '#334155' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="score" 
            stroke="#06b6d4" 
            strokeWidth={2.5}
            fillOpacity={1} 
            fill="url(#scoreGradient)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
