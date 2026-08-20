import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import VideoPitchPlayerModal from '../components/VideoPitchPlayerModal';
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
  Users,
  Play
} from 'lucide-react';

export default function LandingPage({ onGetStarted }) {
  const { quickLogin } = useAuth();
  const [showPitchModal, setShowPitchModal] = useState(false);

  const personas = [
    {
      name: 'Alex Chen',
      email: 'student@skilltwin.dev',
      title: 'Backend Software Engineer',
      level: 'Mid-Stage Readiness',
      score: '58%',
      scoreColor: 'text-amber-400',
      badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
      tagline: 'High DSA proficiency with critical Docker deficit.',
      roleType: 'STUDENT'
    },
    {
      name: 'Sarah Miller',
      email: 'sarah@skilltwin.dev',
      title: 'Full-Stack Developer',
      level: 'Advanced Placement Ready',
      score: '86%',
      scoreColor: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
      tagline: 'Strong React, TypeScript, and state management portfolio.',
      roleType: 'STUDENT'
    },
    {
      name: 'Jordan Lee',
      email: 'dev@skilltwin.dev',
      title: 'Cloud DevOps Engineer',
      level: 'Early Explorer',
      score: '36%',
      scoreColor: 'text-cyan-400',
      badgeBg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300',
      tagline: 'Foundational Linux with upcoming CI/CD missions.',
      roleType: 'STUDENT'
    },
    {
      name: 'Prof. Marcus Davis',
      email: 'admin@skilltwin.dev',
      title: 'Placement Director',
      level: 'College Administrator',
      score: 'Cohort Intel',
      scoreColor: 'text-brand-400',
      badgeBg: 'bg-brand-500/10 border-brand-500/30 text-brand-300',
      tagline: 'Institutional skill gap heatmaps and curriculum tools.',
      roleType: 'ADMIN'
    }
  ];

  const handlePersonaClick = async (email) => {
    await quickLogin(email, 'password123');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-brand-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -left-32 w-[450px] h-[450px] bg-cyan-600/10 rounded-full blur-[150px]" />
      </div>

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 sm:pt-16 sm:pb-24 text-center">
        
        {/* Hackathon Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 shadow-xl mb-5">
          <Sparkles className="w-3.5 h-3.5 text-brand-400 animate-pulse" />
          <span className="text-xs font-bold text-slate-300">
            Career-Readiness Digital Twin Platform
          </span>
          <span className="text-[9px] font-mono uppercase bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded-full border border-brand-500/30">
            PRO
          </span>
        </div>

        {/* Tagline Headline */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
          Know what you know. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-brand-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
            Fix what you don't.
          </span>
        </h1>

        <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          SkillTwin replaces video courses with an evidence-backed <strong>Digital Skill Twin</strong>. 
          Benchmark your skills against real industry roles, prioritize critical gaps, and close them with hands-on evaluated missions.
        </p>

        {/* Big 5-Minute Final Video Pitch Button */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setShowPitchModal(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-black text-sm shadow-xl shadow-rose-600/30 transition-all hover:scale-105"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Watch 5-Minute Final Video Pitch</span>
          </button>
        </div>

        {/* 1-Click Persona Launchpad for Judges */}
        <div className="mt-10 max-w-5xl mx-auto">
          <div className="flex items-center justify-between gap-4 mb-4 text-left">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                1-Click Live Demo Personas
              </h2>
              <p className="text-xs text-slate-400">
                Click any persona below to launch their live Digital Twin.
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
              Auth: password123
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-left">
            {personas.map((p) => (
              <button
                key={p.email}
                onClick={() => handlePersonaClick(p.email)}
                className="glass-card p-4 sm:p-5 rounded-2xl text-left hover:scale-[1.01] transition-all duration-200 group flex flex-col justify-between border-slate-800/80 hover:border-brand-500/50 relative"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${p.badgeBg}`}>
                      {p.level}
                    </span>
                    <span className={`text-sm font-black ${p.scoreColor}`}>
                      {p.score}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-xs text-brand-300 font-semibold">
                    {p.title}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 leading-snug">
                    {p.tagline}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400 group-hover:text-white transition-colors">
                  <span className="font-mono text-[10px] text-slate-500">{p.email}</span>
                  <span className="flex items-center gap-1 font-bold text-brand-400 group-hover:text-cyan-300 text-[11px]">
                    Launch Twin <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 4-Step Loop Visualizer */}
        <div className="mt-16 pt-12 border-t border-slate-800/80 max-w-5xl mx-auto">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-1">
            The Continuous Evidence Loop
          </h2>
          <p className="text-xs text-slate-400 max-w-xl mx-auto mb-8">
            Assess $\to$ Prioritize $\to$ Execute $\to$ Re-score
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-left">
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h3 className="font-bold text-xs text-white">Digital Twin Graph</h3>
              <p className="text-[11px] text-slate-400 leading-snug">
                Scores student profile evidence (DSA, projects, coursework) from 0 to 100%.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <span className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-400 font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h3 className="font-bold text-xs text-white">Gap Prioritization</h3>
              <p className="text-[11px] text-slate-400 leading-snug">
                Ranks deficits using <code className="text-cyan-300 font-mono text-[10px]">gap × imp × rel</code> against target industry roles.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center">
                3
              </span>
              <h3 className="font-bold text-xs text-white">Hands-on Missions</h3>
              <p className="text-[11px] text-slate-400 leading-snug">
                Generates practical challenges (Docker, SQL indexing, CI/CD pipelines).
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center">
                4
              </span>
              <h3 className="font-bold text-xs text-white">Rubric Re-scoring</h3>
              <p className="text-[11px] text-slate-400 leading-snug">
                Automated evaluator verifies code artifacts and updates the Career Readiness Score.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-4 text-center text-xs text-slate-500">
        SkillTwin • Deterministic Career-Readiness Evidence Engine
      </footer>

      {/* Video Pitch Modal */}
      {showPitchModal && (
        <VideoPitchPlayerModal onClose={() => setShowPitchModal(false)} />
      )}

    </div>
  );
}
