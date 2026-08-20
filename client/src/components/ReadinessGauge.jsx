import React from 'react';
import { ShieldCheck, AlertCircle, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';

export default function ReadinessGauge({ readiness, targetRole, studentName }) {
  const score = readiness?.readinessScore || 0;
  const fulfilledCount = readiness?.fulfilledSkillsCount || 0;
  const totalSkills = readiness?.skillCount || 6;

  let tierName = 'Foundational';
  let tierColor = 'text-amber-400';
  let badgeBg = 'bg-amber-500/10 border-amber-500/20 text-amber-300';
  let strokeColor = '#f59e0b';

  if (score >= 80) {
    tierName = 'Interview-Ready';
    tierColor = 'text-emerald-400';
    badgeBg = 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300';
    strokeColor = '#10b981';
  } else if (score >= 60) {
    tierName = 'Placement Pipeline';
    tierColor = 'text-cyan-400';
    badgeBg = 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300';
    strokeColor = '#06b6d4';
  } else if (score >= 40) {
    tierName = 'Active Gap Closure';
    tierColor = 'text-indigo-400';
    badgeBg = 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300';
    strokeColor = '#8b5cf6';
  }

  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="glass-panel p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between h-full">
      {/* Background glow */}
      <div 
        className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: strokeColor }}
      />

      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-5">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Career Readiness Index
            </span>
            <h2 className="text-xl font-bold text-white mt-0.5">
              {targetRole?.name || 'Target Role Benchmark'}
            </h2>
          </div>

          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${badgeBg}`}>
            {tierName}
          </span>
        </div>

        {/* Meter & Core Numbers */}
        <div className="flex flex-col sm:flex-row items-center gap-6 my-2">
          
          {/* Radial SVG Meter */}
          <div className="relative w-36 h-36 flex-shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="text-slate-800/80 stroke-current"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke={strokeColor}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black text-white tracking-tight">
                {score}%
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400">
                Score
              </span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex-1 space-y-2.5 w-full">
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Competencies Met:</span>
              <span className="font-bold text-white font-mono">{fulfilledCount} of {totalSkills}</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Engine Mode:</span>
              <span className="font-bold text-cyan-300 flex items-center gap-1 font-mono text-[11px]">
                <Sparkles className="w-3 h-3 text-cyan-400" /> Evidence-Based
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-start gap-1.5 text-[10px] text-slate-400 leading-snug">
        <AlertCircle className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 mt-0.5" />
        <p>
          Readiness indicator based on demonstrated evidence & rubric verification. Not a guarantee of employment.
        </p>
      </div>

    </div>
  );
}
