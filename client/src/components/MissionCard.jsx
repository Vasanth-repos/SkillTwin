import React from 'react';
import { Compass, CheckCircle2, Clock, Award, ArrowRight, Sparkles, Code2 } from 'lucide-react';

export default function MissionCard({ mission, onSelectMission }) {
  const isCompleted = mission.isCompleted;

  let difficultyColor = 'text-blue-400 bg-blue-500/10 border-blue-500/20';
  if (mission.difficulty === 'ADVANCED') {
    difficultyColor = 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  } else if (mission.difficulty === 'INTERMEDIATE') {
    difficultyColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
  }

  const checklist = mission.checklistItems || [];

  return (
    <div className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between ${
      isCompleted
        ? 'bg-slate-900/40 border-emerald-500/30'
        : 'glass-card hover:-translate-y-1'
    }`}>
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-300 border border-brand-500/20">
            {mission.targetSkill}
          </span>

          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${difficultyColor}`}>
              {mission.difficulty}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <Clock className="w-3 h-3" /> {mission.estimatedHours}h
            </span>
          </div>
        </div>

        {/* Mission Title & Description */}
        <h3 className="text-base sm:text-lg font-extrabold text-white leading-snug">
          {mission.title}
        </h3>
        <p className="text-xs text-slate-300 mt-2 leading-relaxed line-clamp-3">
          {mission.description}
        </p>

        {/* Checklist Preview */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Award className="w-3 h-3 text-brand-400" /> Rubric Verification Criteria ({checklist.length}):
          </p>
          <div className="space-y-1">
            {checklist.slice(0, 3).map((item, i) => (
              <div key={i} className="flex items-start gap-1.5 text-xs text-slate-400">
                <span className="text-brand-400 font-bold">•</span>
                <span className="truncate">{item.text || item}</span>
              </div>
            ))}
            {checklist.length > 3 && (
              <p className="text-[10px] text-slate-500 italic pl-3">
                +{checklist.length - 3} more automated checks...
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Action Button / Completed State */}
      <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between gap-3">
        {isCompleted ? (
          <div className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" /> Evidence Verified & Evaluated
          </div>
        ) : (
          <button
            onClick={() => onSelectMission(mission)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-md shadow-brand-600/20 hover:shadow-brand-600/40"
          >
            <span>Start Mission & Submit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
