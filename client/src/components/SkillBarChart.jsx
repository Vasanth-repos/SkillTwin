import React from 'react';
import { CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';

export default function SkillBarChart({ gaps = [], onSelectSkill }) {
  return (
    <div className="space-y-4">
      {gaps.map((item) => {
        const isFulfilled = item.gap === 0;
        const currentPct = Math.min(100, item.currentScore);
        const requiredPct = item.requiredScore;

        return (
          <div 
            key={item.skillName}
            className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 transition-all cursor-pointer group"
            onClick={() => onSelectSkill && onSelectSkill(item.skillName)}
          >
            {/* Title & Stats */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {item.skillName}
                </span>
                {isFulfilled ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" /> Met
                  </span>
                ) : (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                    item.urgency === 'CRITICAL' 
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    -{item.gap} pts gap
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">
                  <strong className="text-white">{item.currentScore}</strong> / {item.requiredScore}%
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
              </div>
            </div>

            {/* Progress Track */}
            <div className="relative h-2.5 w-full bg-slate-800/80 rounded-full overflow-hidden">
              {/* Target Marker line */}
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-white/70 z-10"
                style={{ left: `${requiredPct}%` }}
                title={`Target: ${requiredPct}%`}
              />
              
              {/* Current Progress bar */}
              <div 
                className={`h-full rounded-full transition-all duration-700 ${
                  isFulfilled 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400' 
                    : item.urgency === 'CRITICAL'
                    ? 'bg-gradient-to-r from-rose-500 to-amber-500'
                    : 'bg-gradient-to-r from-brand-500 to-cyan-400'
                }`}
                style={{ width: `${currentPct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
