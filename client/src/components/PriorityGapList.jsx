import React from 'react';
import { AlertTriangle, Flame, ArrowRight, CheckCircle2, Zap, Sparkles } from 'lucide-react';

export default function PriorityGapList({ gaps = [], onLaunchMissionForSkill }) {
  const activeGaps = gaps.filter(g => g.gap > 0);
  const masteredGaps = gaps.filter(g => g.gap === 0);

  return (
    <div className="space-y-3">
      {activeGaps.length === 0 ? (
        <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
          <h4 className="font-bold text-white text-base">Benchmark Fully Mastered!</h4>
          <p className="text-xs text-slate-400 mt-1">
            You have satisfied all core requirements for this target role. Consider exploring a new target career benchmark.
          </p>
        </div>
      ) : (
        activeGaps.map((item, index) => {
          const isTopPriority = index === 0;

          return (
            <div
              key={item.skillName}
              className={`p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                isTopPriority
                  ? 'bg-gradient-to-br from-slate-900 via-slate-900/90 to-brand-950/40 border-brand-500/50 shadow-xl shadow-brand-500/10'
                  : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {isTopPriority && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-brand-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-bl-xl flex items-center gap-1 shadow-sm">
                  <Flame className="w-3 h-3 text-amber-300 fill-amber-300" /> #1 Critical Gap
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                {/* Skill Details & Urgency */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-white text-sm sm:text-base">
                      {item.skillName}
                    </span>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      item.urgency === 'CRITICAL'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : item.urgency === 'HIGH'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                    }`}>
                      {item.urgency} DEFICIT
                    </span>
                  </div>

                  {/* Priority Formula Transparency Tag */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <span className="bg-slate-950/80 px-2 py-0.5 rounded-md border border-slate-800 text-[11px] font-mono text-cyan-300">
                      Score: {item.currentScore}% → Target: {item.requiredScore}% ({item.gap} pts gap)
                    </span>
                    <span className="hidden sm:inline text-slate-500">•</span>
                    <span className="text-[11px] text-slate-400">
                      Priority Index: <strong className="text-white font-mono">{item.priorityScore}</strong>
                      <span className="text-[10px] text-slate-500 ml-1">
                        ({item.gap} × {item.importanceWeight} × {item.relevanceWeight})
                      </span>
                    </span>
                  </div>
                </div>

                {/* Direct Action: Launch Mission */}
                <button
                  onClick={() => onLaunchMissionForSkill(item.skillName)}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex-shrink-0 ${
                    isTopPriority
                      ? 'bg-brand-600 hover:bg-brand-500 text-white shadow-brand-600/30 hover:scale-105'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                  <span>Launch Mission</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

              </div>
            </div>
          );
        })
      )}

      {/* Mastered Skills Accordion / Footnote */}
      {masteredGaps.length > 0 && (
        <div className="pt-3 border-t border-slate-800/60">
          <p className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Satisfied Role Competencies ({masteredGaps.length}):
          </p>
          <div className="flex flex-wrap gap-1.5">
            {masteredGaps.map(m => (
              <span 
                key={m.skillName}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium"
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
