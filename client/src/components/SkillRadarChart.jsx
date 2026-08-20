import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

export default function SkillRadarChart({ skillGraphs = [], roleRequirements = [] }) {
  // Build comparison data
  const currentMap = {};
  for (const sg of skillGraphs) {
    currentMap[sg.skillName] = sg.currentScore;
  }

  const chartData = roleRequirements.map((req) => {
    // Shorten long skill names for clean radar layout
    const shortName = req.skillName
      .replace(' & Version Control', '')
      .replace(' & Containerization', '')
      .replace(' & Modern Frontend', '')
      .replace(' & Type Safety', '')
      .replace(' & UI Performance', '')
      .replace(' & Orchestration', '')
      .replace(' & SQL', '')
      .replace(' & Concurrency', '')
      .replace(' & Dashboards', '');

    return {
      skill: shortName,
      fullSkillName: req.skillName,
      Demonstrated: currentMap[req.skillName] || 0,
      Required: req.requiredPercentage || 80,
    };
  });

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-2xl text-xs space-y-1 z-50">
          <p className="font-bold text-white mb-1.5">{data.fullSkillName}</p>
          <div className="flex items-center justify-between gap-4 text-cyan-300">
            <span>Demonstrated Score:</span>
            <span className="font-bold">{data.Demonstrated}/100</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-indigo-300">
            <span>Role Requirement:</span>
            <span className="font-bold">{data.Required}/100</span>
          </div>
          <div className="pt-1 border-t border-slate-800 text-[11px] text-slate-400">
            Gap: <strong className={data.Required - data.Demonstrated > 0 ? 'text-amber-400' : 'text-emerald-400'}>
              {Math.max(0, data.Required - data.Demonstrated)} pts
            </strong>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-72 sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
          <PolarGrid stroke="#334155" strokeDasharray="3 3" />
          <PolarAngleAxis 
            dataKey="skill" 
            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]} 
            tick={{ fill: '#64748b', fontSize: 10 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Radar
            name="Target Role Required"
            dataKey="Required"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.15}
            strokeWidth={2}
          />
          <Radar
            name="Your Demonstrated Score"
            dataKey="Demonstrated"
            stroke="#06b6d4"
            fill="#06b6d4"
            fillOpacity={0.45}
            strokeWidth={2.5}
          />
          <Legend 
            wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
            formatter={(value) => <span className="text-slate-300 font-medium">{value}</span>}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
