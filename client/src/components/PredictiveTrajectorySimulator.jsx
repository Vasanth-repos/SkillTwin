import React, { useState } from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  Target, 
  Calendar, 
  CheckCircle2, 
  Sliders, 
  Zap, 
  ArrowRight,
  ShieldCheck,
  Award
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function PredictiveTrajectorySimulator({ currentReadiness = 58, gaps = [], dsaCurrent = 65 }) {
  const [plannedMissions, setPlannedMissions] = useState(2);
  const [plannedDsaAdd, setPlannedDsaAdd] = useState(30);

  // Compute predictive readiness score based on simulated inputs
  // Each completed top mission closes ~20 pts of a gap
  const simulatedMissionPoints = Math.min(30, plannedMissions * 12);
  const simulatedDsaPoints = Math.min(15, Math.round((plannedDsaAdd / 100) * 15));
  const projectedReadiness = Math.min(100, Math.round(currentReadiness + simulatedMissionPoints + simulatedDsaPoints));

  // Compute estimated readiness timeline
  const daysToGoal = Math.max(7, Math.round((plannedMissions * 5) + (plannedDsaAdd / 5)));
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + daysToGoal);

  // Forecast graph data points
  const forecastData = [
    { day: 'Today', score: currentReadiness, label: 'Current' },
    { day: `+${Math.round(daysToGoal * 0.3)}d`, score: Math.min(projectedReadiness, Math.round(currentReadiness + (projectedReadiness - currentReadiness) * 0.35)) },
    { day: `+${Math.round(daysToGoal * 0.7)}d`, score: Math.min(projectedReadiness, Math.round(currentReadiness + (projectedReadiness - currentReadiness) * 0.75)) },
    { day: `+${daysToGoal}d`, score: projectedReadiness, label: 'Forecast' }
  ];

  return (
    <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 border border-indigo-500/30 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Predictive Career Trajectory Engine
          </span>
          <h3 className="text-lg font-bold text-white mt-0.5">
            Future Readiness & Growth Simulator
          </h3>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
          <span>Forecast Target: <strong className="text-white">{targetDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left: Sliders Control (6 cols) */}
        <div className="lg:col-span-6 space-y-5">
          
          {/* Slider 1: Planned Missions */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Planned Mission Completions:
              </span>
              <span className="font-mono font-bold text-amber-300 text-sm">
                {plannedMissions} {plannedMissions === 1 ? 'Mission' : 'Missions'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="4"
              step="1"
              value={plannedMissions}
              onChange={(e) => setPlannedMissions(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 missions (0 pts)</span>
              <span>2 missions (+24 pts)</span>
              <span>4 missions (+30 pts)</span>
            </div>
          </div>

          {/* Slider 2: Additional DSA problems */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-indigo-400" /> Target Additional DSA Problems:
              </span>
              <span className="font-mono font-bold text-indigo-300 text-sm">
                +{plannedDsaAdd} Problems
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="10"
              value={plannedDsaAdd}
              onChange={(e) => setPlannedDsaAdd(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>+0 (Current: {dsaCurrent})</span>
              <span>+50 Problems</span>
              <span>+100 Problems</span>
            </div>
          </div>

          {/* Projected Growth Insight */}
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs flex items-center justify-between">
            <span className="text-emerald-300 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Projected Score Boost:
            </span>
            <span className="font-black text-emerald-400 font-mono text-sm">
              +{projectedReadiness - currentReadiness} PTS ({currentReadiness}% → {projectedReadiness}%)
            </span>
          </div>

        </div>

        {/* Right: Projected Graph & Milestone Forecast (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Simulated 30-Day Growth Curve
              </span>
              <span className="text-xs font-bold text-emerald-400 font-mono">
                {projectedReadiness}% Target Readiness
              </span>
            </div>

            <div className="h-36 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                    formatter={(val) => [`${val}% Readiness`, 'Projected Score']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#10b981" 
                    strokeWidth={2.5} 
                    dot={{ fill: '#10b981', r: 4 }} 
                    activeDot={{ r: 6 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <p className="font-bold text-white">Campus Interview-Ready Status</p>
              <p className="text-[11px] text-slate-400">
                {projectedReadiness >= 80 ? 'Tier-1 Tech Benchmark Cleared' : 'Approaching Placement Threshold'}
              </p>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
              projectedReadiness >= 80 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
            }`}>
              {projectedReadiness >= 80 ? 'Interview Ready' : 'Placement Track'}
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
