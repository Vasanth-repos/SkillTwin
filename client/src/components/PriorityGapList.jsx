import React from 'react';
import { AlertTriangle, Flame, ArrowRight, CheckCircle2, Zap, Sparkles } from 'lucide-react';

export default function PriorityGapList({ gaps = [], onLaunchMissionForSkill }) {
  const activeGaps = gaps.filter(g => g.gap > 0);
  const masteredGaps = gaps.filter(g => g.gap === 0);

  return (
    <div className="space-y-3">
      {activeGaps.length === 0 ? (
        <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-1">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-1" />
          <h4 className="font-bold text-white text-sm">All Benchmark Skills Satisfied!</h4>
          <p className="text-xs text-slate-400">
            You meet all required baseline thresholds for this target role.
          </p>
        </div>
      ) : (
        activeGaps.map((item, index) => {
          const isTopPriority = index === 0;

          return (
            <div
              key={item.skillName}
              className={`p-4 rounded-2xl border transition-all duration-200 relative overflow-hidden ${
                isTopPriority
                  ? 'bg-gradient-to-br from-slate-900 via-slate-900/90 to-brand-950/40 border-brand-500/50 shadow-lg shadow-brand-500/10'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {isTopPriority && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-brand-600 to-indigo-600 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-bl-xl flex items-center gap-1 shadow-sm">
                  <Flame className="w-3 h-3 text-amber-300 fill-amber-300" /> #1 Priority Deficit
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                
                {/* Skill Details */}
                <div className="space-y-1.5 flex-1 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">
                      {item.skillName}
                    </span>

                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                      item.urgency === 'CRITICAL'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : item.urgency === 'HIGH'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                    }`}>
                      {item.urgency}
                    </span>
                  </div>

                  {/* Metrics & Formula */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                    <span className="font-mono text-cyan-300 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                      {item.currentScore}% → {item.requiredScore}% ({item.gap} pts gap)
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">
                      Priority: <strong className="text-white">{item.priorityScore}</strong> <span className="text-slate-500">({item.gap} × {item.importanceWeight} × {item.relevanceWeight})</span>
                    </span>
                  </div>
                </div>

                {/* Launch Action */}
                <button
                  onClick={() => onLaunchMissionForSkill(item.skillName)}
                  className={`flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                    isTopPriority
                      ? 'bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-600/30 hover:scale-105'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                  <span>Launch Mission</span>
                  <ArrowRight className="w-3 h-3" />
                </button>

              </div>
            </div>
          );
        })
      )}

      {/* Mastered Skills List */}
      {masteredGaps.length > 0 && (
        <div className="pt-2 border-t border-slate-800/60">
          <p className="text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Satisfied Competencies ({masteredGaps.length}):
          </p>
          <div className="flex flex-wrap gap-1">
            {masteredGaps.map(m => (
              <span 
                key={m.skillName}
                className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono"
              >
                ✓ {m.skillName} ({m.currentScore}%)
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
