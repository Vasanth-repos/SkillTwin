import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  Target, 
  Compass, 
  ShieldCheck, 
  ArrowRight, 
  Award, 
  BarChart3, 
  Zap, 
  Code2, 
  CheckCircle2, 
  Layers,
  GraduationCap,
  Users
} from 'lucide-react';

export default function LandingPage({ onGetStarted }) {
  const { quickLogin } = useAuth();

  const personas = [
    {
      name: 'Alex Chen',
      email: 'student@skilltwin.dev',
      title: 'Aspiring Backend Software Engineer',
      level: 'Mid-Stage Readiness',
      score: '58%',
      scoreColor: 'text-amber-400',
      badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
      tagline: 'High DSA proficiency with critical Docker & System Design gaps.',
      roleType: 'STUDENT',
      icon: 'server'
    },
    {
      name: 'Sarah Miller',
      email: 'sarah@skilltwin.dev',
      title: 'Aspiring Full-Stack Developer',
      level: 'Advanced Placement Ready',
      score: '86%',
      scoreColor: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
      tagline: 'Comprehensive React, TypeScript, and state management portfolio.',
      roleType: 'STUDENT',
      icon: 'layout'
    },
    {
      name: 'Jordan Lee',
      email: 'dev@skilltwin.dev',
      title: 'Aspiring Cloud DevOps Engineer',
      level: 'Early Explorer',
      score: '36%',
      scoreColor: 'text-cyan-400',
      badgeBg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300',
      tagline: 'Foundational Linux and Bash with upcoming CI/CD & Kubernetes missions.',
      roleType: 'STUDENT',
      icon: 'cloud'
    },
    {
      name: 'Prof. Marcus Davis',
      email: 'admin@skilltwin.dev',
      title: 'Department Chair & Placement Director',
      level: 'College Administrator',
      score: 'Cohort Telemetry',
      scoreColor: 'text-brand-400',
      badgeBg: 'bg-brand-500/10 border-brand-500/30 text-brand-300',
      tagline: 'Aggregate cohort skill gap heatmaps and institutional readiness insights.',
      roleType: 'ADMIN',
      icon: 'users'
    }
  ];

  const handlePersonaClick = async (email) => {
    await quickLogin(email, 'password123');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      
      {/* Background Glow Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[160px]" />
      </div>

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28 text-center">
        
        {/* Hackathon Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 shadow-xl mb-8">
          <Sparkles className="w-4 h-4 text-brand-400 animate-pulse" />
          <span className="text-xs font-bold text-slate-300">
            Career-Readiness Digital Twin Platform
          </span>
          <span className="text-[10px] font-mono uppercase bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded-full border border-brand-500/30">
            MVP
          </span>
        </div>

        {/* Tagline Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.1]">
          Know what you know. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-brand-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
            Fix what you don't.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
          SkillTwin replaces generic video tutorials with a verified <strong>Digital Skill Twin</strong>. 
          We benchmark your real evidence against curated industry roles, prioritize your highest-impact skill gaps, and dynamically re-score your readiness through automated rubric evaluation.
        </p>

        {/* 1-Click Persona Launchpad for Judges */}
        <div className="mt-14 max-w-5xl mx-auto">
          <div className="flex items-center justify-between gap-4 mb-4 text-left">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                1-Click Live Demo Personas
              </h2>
              <p className="text-xs text-slate-400">
                Click any persona below to experience their live Digital Twin and test the core loop.
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
              Password: password123
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            {personas.map((p) => (
              <button
                key={p.email}
                onClick={() => handlePersonaClick(p.email)}
                className="glass-card p-5 rounded-3xl text-left hover:scale-[1.02] transition-all duration-300 group flex flex-col justify-between border-slate-800/80 hover:border-brand-500/50 relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${p.badgeBg}`}>
                      {p.level}
                    </span>
                    <span className={`text-base font-black ${p.scoreColor}`}>
                      {p.score}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-xs text-brand-300/90 font-medium">
                    {p.title}
                  </p>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {p.tagline}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400 group-hover:text-white transition-colors">
                  <span className="font-mono text-[11px] text-slate-500">{p.email}</span>
                  <span className="flex items-center gap-1 font-bold text-brand-400 group-hover:text-cyan-300">
                    Launch Persona <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Core Loop Infographic */}
        <div className="mt-20 pt-16 border-t border-slate-800/80 max-w-5xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-black text-white mb-2">
            The Continuous Evidence Loop
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto mb-10">
            A transparent, deterministic pipeline that transforms student evidence into career readiness telemetry.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-left">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h3 className="font-bold text-sm text-white">Digital Skill Twin</h3>
              <p className="text-xs text-slate-400">
                Maps academic coursework, languages, DSA counts, and projects into a normalized skill graph.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h3 className="font-bold text-sm text-white">Gap Prioritization</h3>
              <p className="text-xs text-slate-400">
                Ranks skill gaps via <code className="text-cyan-300 font-mono text-[11px]">gap × importance × relevance</code> against target roles.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h3 className="font-bold text-sm text-white">Hands-on Missions</h3>
              <p className="text-xs text-slate-400">
                Student tackles real engineering challenges (e.g. multi-stage Docker builds, SQL schemas, CI/CD).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                4
              </div>
              <h3 className="font-bold text-sm text-white">Rubric Rescoring</h3>
              <p className="text-xs text-slate-400">
                Automated checklist evaluator verifies repo artifacts, awards skill score deltas, and updates readiness.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        SkillTwin MVP • Built for Hackathon Excellence • Zero Hallucination Deterministic Engine
      </footer>

    </div>
  );
}
