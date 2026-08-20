import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSkillTwin } from '../context/SkillTwinContext';
import { 
  Sparkles, 
  Users, 
  ChevronUp, 
  ChevronDown, 
  RotateCcw, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function JudgeDemoBar() {
  const { user, loginWithPersona } = useAuth();
  const { fetchTwinState } = useSkillTwin();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isSwitching, setIsSwitching] = useState(false);

  const personas = [
    { key: 'alex', name: 'Alex Chen', role: 'Backend Dev (58%)', color: 'border-cyan-500/40 text-cyan-300' },
    { key: 'sarah', name: 'Sarah Miller', role: 'Full-Stack (86%)', color: 'border-emerald-500/40 text-emerald-300' },
    { key: 'jordan', name: 'Jordan Lee', role: 'DevOps (36%)', color: 'border-amber-500/40 text-amber-300' },
    { key: 'prof', name: 'Prof. Davis', role: 'College Admin', color: 'border-indigo-500/40 text-indigo-300' }
  ];

  const handlePersonaSwitch = async (key) => {
    setIsSwitching(true);
    try {
      await loginWithPersona(key);
      await fetchTwinState();
    } catch (err) {
      console.error('Failed to switch persona:', err);
    } finally {
      setIsSwitching(false);
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-4xl w-[95%] sm:w-auto">
      <div className="p-2 rounded-2xl bg-slate-950/90 border border-slate-700/80 shadow-2xl backdrop-blur-md text-xs transition-all">
        
        {/* Minimized view */}
        {!isExpanded ? (
          <button
            onClick={() => setIsExpanded(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>Judge Demo Toolbar</span>
            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
          </button>
        ) : (
          /* Expanded view */
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-300 font-bold text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span>Judge Demo Quick-Launch:</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {personas.map((p) => {
                const isActive = user?.name?.toLowerCase().includes(p.name.toLowerCase().split(' ')[0]);

                return (
                  <button
                    key={p.key}
                    disabled={isSwitching}
                    onClick={() => handlePersonaSwitch(p.key)}
                    className={`px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-brand-600 text-white border-brand-400 shadow-md scale-105'
                        : `bg-slate-900/90 hover:bg-slate-800 text-slate-300 ${p.color}`
                    }`}
                  >
                    <span>{p.name}</span>
                    <span className="text-[9px] opacity-75 hidden sm:inline">({p.role.split(' ')[0]})</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-300 ml-1"
              title="Minimize Bar"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
