import React from 'react';
import { ShieldCheck, AlertCircle, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';

export default function ReadinessGauge({ readiness, targetRole, studentName }) {
  const score = readiness?.readinessScore || 0;
  const fulfilledCount = readiness?.fulfilledSkillsCount || 0;
  const totalSkills = readiness?.skillCount || 6;

  // Compute tier and styling
  let tierName = 'Foundational Phase';
  let tierColor = 'text-amber-400';
  let badgeBg = 'bg-amber-500/10 border-amber-500/20 text-amber-300';
  let strokeColor = '#f59e0b'; // Amber

  if (score >= 80) {
    tierName = 'Interview-Ready & Competitive';
    tierColor = 'text-emerald-400';
    badgeBg = 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300';
    strokeColor = '#10b981'; // Emerald
  } else if (score >= 60) {
    tierName = 'Placement Pipeline Qualified';
    tierColor = 'text-cyan-400';
    badgeBg = 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300';
    strokeColor = '#06b6d4'; // Cyan
  } else if (score >= 40) {
    tierName = 'Active Gap Closure Phase';
    tierColor = 'text-indigo-400';
    badgeBg = 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300';
    strokeColor = '#8b5cf6'; // Indigo/Brand
  }

  // Circular gauge math
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between">
      {/* Subtle background glow */}
      <div 
        className="absolute -top-20 -right-20 w-56 h-56 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: strokeColor }}
      />

      <div>
        {/* Header & Target Benchmark */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Career Readiness Index
              </span>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${badgeBg}`}>
                {tierName}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              {targetRole?.name || 'Target Role Benchmark'}
            </h2>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span><strong className="text-white">{fulfilledCount}</strong> of {totalSkills} skills mastered</span>
          </div>
        </div>

        {/* Gauge Visual & Metrics Center */}
        <div className="flex flex-col sm:flex-row items-center gap-6 my-2">
          
          {/* Radial SVG Meter */}
          <div className="relative w-44 h-44 flex-shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
              {/* Background Track */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="text-slate-800/80 stroke-current"
                strokeWidth="12"
                fill="transparent"
              />
              {/* Animated Value Stroke */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke={strokeColor}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Centered Score Readout */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-extrabold text-white tracking-tight">
                {score}%
              </span>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mt-0.5">
                Readiness
              </span>
            </div>
          </div>

          {/* Core Insights Column */}
          <div className="flex-1 space-y-3 text-center sm:text-left">
            <p className="text-sm text-slate-300 leading-relaxed">
              Based on verified projects, coursework, language proficiency, and DSA problem counts compared against hand-authored industry benchmarks for <strong className="text-white">{targetRole?.name}</strong>.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block font-medium">Scoring Engine</span>
                <span className="text-xs font-bold text-white flex items-center gap-1 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-400" /> Evidence Heuristics
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block font-medium">Dynamic Rescoring</span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                  <TrendingUp className="w-3.5 h-3.5" /> Rubric Verification
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Mandatory Regulatory & Product Disclaimer */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-start gap-2 text-[11px] text-slate-400">
        <AlertCircle className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 mt-0.5" />
        <p>
          <strong>Disclaimer:</strong> This is a career readiness indicator based on demonstrated evidence and rule-based rubric evaluation, not a guarantee of employment or hiring outcomes.
        </p>
      </div>

    </div>
  );
}
