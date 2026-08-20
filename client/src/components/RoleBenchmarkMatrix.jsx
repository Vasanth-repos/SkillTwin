import React from 'react';
import { useSkillTwin } from '../context/SkillTwinContext';
import { calculateReadinessScore, calculateGaps } from '../utils/simulatorEngine';
import { Target, CheckCircle2, ArrowRight, Sparkles, Flame, Check } from 'lucide-react';

export default function RoleBenchmarkMatrix({ onClose }) {
  const { profile, skillGraphs, roles, switchTargetRole } = useSkillTwin();

  const currentRole = profile?.targetRole;

  // Calculate readiness for all roles simultaneously
  const roleSimulations = roles.map((role) => {
    const requirements = role.skillRequirements || [];
    const readiness = calculateReadinessScore(skillGraphs, requirements);
    const gaps = calculateGaps(skillGraphs, requirements);
    const topGap = gaps.find(g => g.gap > 0);

    return {
      role,
      readinessScore: readiness.readinessScore,
      fulfilledCount: readiness.fulfilledSkillsCount,
      totalSkills: requirements.length,
      topGap,
      isActive: currentRole?.id === role.id
    };
  });

  // Sort descending by highest readiness score
  roleSimulations.sort((a, b) => b.readinessScore - a.readinessScore);

  const handleSetActiveRole = async (roleId) => {
    await switchTargetRole(roleId);
    if (onClose) onClose();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> What-If Career Simulator
          </span>
          <h3 className="text-lg font-bold text-white mt-0.5">
            Cross-Role Readiness Matrix
          </h3>
        </div>
        <p className="text-xs text-slate-400 max-w-sm">
          See how your current skill twin benchmarks across alternative engineering roles.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {roleSimulations.map(({ role, readinessScore, fulfilledCount, totalSkills, topGap, isActive }) => {
          let scoreColor = 'text-amber-400';
          let progressBg = 'bg-amber-500';
          if (readinessScore >= 80) {
            scoreColor = 'text-emerald-400';
            progressBg = 'bg-emerald-500';
          } else if (readinessScore >= 60) {
            scoreColor = 'text-cyan-400';
            progressBg = 'bg-cyan-500';
          }

          return (
            <div
              key={role.id}
              className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                isActive
                  ? 'bg-brand-950/40 border-brand-500/50 shadow-lg shadow-brand-500/10'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400">
                    {role.category}
                  </span>

                  <div className="flex items-center gap-2">
                    {isActive && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                        Active Target
                      </span>
                    )}
                    <span className={`text-lg font-black ${scoreColor}`}>
                      {readinessScore}%
                    </span>
                  </div>
                </div>

                <h4 className="text-base font-bold text-white">
                  {role.name}
                </h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {role.description}
                </p>

                {/* Progress bar */}
                <div className="mt-4 space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                    <span>Role Competency Match</span>
                    <span>{fulfilledCount} of {totalSkills} skills met</span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${progressBg}`}
                      style={{ width: `${readinessScore}%` }}
                    />
                  </div>
                </div>

                {/* Critical Gap for this role */}
                {topGap && (
                  <div className="mt-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-rose-400" /> #1 Deficit:
                    </span>
                    <span className="font-bold text-rose-300 truncate max-w-[60%]">
                      {topGap.skillName} (-{topGap.gap} pts)
                    </span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-end">
                {isActive ? (
                  <div className="text-xs text-brand-400 font-bold flex items-center gap-1 py-1">
                    <Check className="w-4 h-4" /> Current Active Benchmark
                  </div>
                ) : (
                  <button
                    onClick={() => handleSetActiveRole(role.id)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-brand-600 text-slate-200 hover:text-white text-xs font-semibold transition-all"
                  >
                    <span>Switch to this Benchmark</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
