import React from 'react';
import { Award, CheckCircle2, ShieldCheck, Flame, Zap, Database, Box, Code2, Lock } from 'lucide-react';

export default function MilestoneBadges({ profile, skillGraphs = [], submissions = [] }) {
  const dsaCount = profile?.dsaProblemsSolved || 0;
  const projects = profile?.projects || [];
  const evaluatedCount = submissions.filter(s => s.status === 'EVALUATED').length;

  const currentScores = {};
  for (const sg of skillGraphs) {
    currentScores[sg.skillName] = sg.currentScore;
  }

  const badges = [
    {
      id: 'dsa_100',
      title: 'Algorithmic Problem Solver',
      description: '100+ LeetCode / DSA problems solved',
      icon: Code2,
      earned: dsaCount >= 100,
      color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10'
    },
    {
      id: 'mission_first',
      title: 'Evidence Pioneer',
      description: 'Completed first verified hands-on mission',
      icon: Zap,
      earned: evaluatedCount >= 1,
      color: 'text-amber-400 border-amber-500/30 bg-amber-500/10'
    },
    {
      id: 'docker_spec',
      title: 'Containerization Specialist',
      description: 'Demonstrated 60%+ in Docker & Containerization',
      icon: Box,
      earned: (currentScores['Docker & Containerization'] || 0) >= 60,
      color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10'
    },
    {
      id: 'sql_arch',
      title: 'Database Architect',
      description: 'Demonstrated 75%+ in Relational Databases & SQL',
      icon: Database,
      earned: (currentScores['Relational Databases & SQL'] || 0) >= 75,
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
    },
    {
      id: 'portfolio_pro',
      title: 'Portfolio Pro',
      description: '2+ verified projects with GitHub repositories',
      icon: ShieldCheck,
      earned: projects.filter(p => p.repoUrl).length >= 2,
      color: 'text-brand-400 border-brand-500/30 bg-brand-500/10'
    }
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-brand-400" />
          Verified Competency Badges
        </span>
        <span className="text-[11px] font-semibold text-slate-400">
          <strong className="text-white">{badges.filter(b => b.earned).length}</strong> of {badges.length} Unlocked
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {badges.map((badge) => {
          const Icon = badge.icon;
          return (
            <div
              key={badge.id}
              className={`p-3 rounded-2xl border transition-all flex flex-col justify-between ${
                badge.earned
                  ? `${badge.color} shadow-sm`
                  : 'bg-slate-950/40 border-slate-800/60 opacity-50 grayscale'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-1.5 rounded-xl bg-slate-950/80">
                  <Icon className="w-4 h-4" />
                </div>
                {badge.earned ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Lock className="w-3 h-3 text-slate-500" />
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold text-white leading-tight">
                  {badge.title}
                </h4>
                <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                  {badge.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
