import React from 'react';
import { Building2, Rocket, Landmark, Cloud, Sparkles, Check } from 'lucide-react';

export const COMPANY_TIERS = [
  {
    id: 'STANDARD',
    name: 'Industry Standard',
    tagline: 'Balanced requirements across core engineering domains',
    icon: Building2,
    color: 'text-indigo-400 border-indigo-500/30'
  },
  {
    id: 'STARTUP',
    name: 'High-Growth Startup',
    tagline: 'Prioritizes rapid product shipping, React, and full-stack velocity',
    icon: Rocket,
    color: 'text-amber-400 border-amber-500/30'
  },
  {
    id: 'BIGTECH',
    name: 'Tier-1 Enterprise / Big Tech',
    tagline: 'Heavier weighting on Distributed Systems, SQL Isolation, and DSA',
    icon: Landmark,
    color: 'text-cyan-400 border-cyan-500/30'
  },
  {
    id: 'CLOUDSPEC',
    name: 'Cloud & Infrastructure Specialist',
    tagline: 'Emphasizes Docker, Kubernetes, CI/CD pipelines, and Terraform',
    icon: Cloud,
    color: 'text-emerald-400 border-emerald-500/30'
  }
];

export default function CompanyTierSelector({ activeTier = 'STANDARD', onSelectTier }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          Target Company Benchmark Tier
        </span>
        <span className="text-[11px] text-slate-500 font-mono">
          Custom Benchmark Weighting
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {COMPANY_TIERS.map((tier) => {
          const Icon = tier.icon;
          const isSelected = activeTier === tier.id;

          return (
            <button
              key={tier.id}
              type="button"
              onClick={() => onSelectTier(tier.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-brand-500/15 border-brand-500 text-white shadow-md shadow-brand-500/10'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="p-1.5 rounded-xl bg-slate-900 border border-slate-800">
                  <Icon className="w-4 h-4 text-cyan-400" />
                </div>
                {isSelected && (
                  <span className="w-4 h-4 rounded-full bg-brand-500 text-white flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold text-white">
                  {tier.name}
                </h4>
                <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                  {tier.tagline}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
