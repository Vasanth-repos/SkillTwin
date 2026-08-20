import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSkillTwin } from '../context/SkillTwinContext';
import VideoPitchPlayerModal from './VideoPitchPlayerModal';
import { 
  Sparkles, 
  Target, 
  Compass, 
  User, 
  Users, 
  BarChart3, 
  LogOut, 
  ChevronDown, 
  ShieldCheck, 
  GraduationCap, 
  CheckCircle2,
  Menu,
  X,
  Play
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const { user, logout, quickLogin } = useAuth();
  const { profile, roles, switchTargetRole } = useSkillTwin();
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPitchModal, setShowPitchModal] = useState(false);

  const demoPersonas = [
    { name: 'Alex Chen', email: 'student@skilltwin.dev', role: 'Backend Engineer', badge: '58% Ready', color: 'text-amber-400 border-amber-500/30' },
    { name: 'Sarah Miller', email: 'sarah@skilltwin.dev', role: 'Full-Stack Dev', badge: '86% Ready', color: 'text-emerald-400 border-emerald-500/30' },
    { name: 'Jordan Lee', email: 'dev@skilltwin.dev', role: 'DevOps Engineer', badge: '36% Ready', color: 'text-cyan-400 border-cyan-500/30' },
    { name: 'Prof. Davis', email: 'admin@skilltwin.dev', role: 'College Admin', badge: 'Admin Cockpit', color: 'text-brand-400 border-brand-500/30' },
  ];

  const handlePersonaSwitch = async (email) => {
    setShowPersonaMenu(false);
    setMobileMenuOpen(false);
    await quickLogin(email, 'password123');
  };

  const handleRoleSelect = async (roleId) => {
    setShowRoleMenu(false);
    await switchTargetRole(roleId);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            
            {/* 1. Left: Logo & Brand */}
            <div 
              className="flex items-center gap-3 cursor-pointer flex-shrink-0 select-none group" 
              onClick={() => setActiveTab('dashboard')}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  SkillTwin
                </span>
                <span className="text-[9px] uppercase font-mono font-bold tracking-widest px-1.5 py-0.5 rounded-md bg-brand-500/15 text-brand-300 border border-brand-500/30">
                  PRO
                </span>
              </div>
            </div>

            {/* 2. Center: Desktop Navigation Tabs */}
            {user && (
              <div className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-2xl border border-slate-800/80 shadow-inner">
                {user.role === 'STUDENT' ? (
                  <>
                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        activeTab === 'dashboard'
                          ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      <Target className="w-3.5 h-3.5" />
                      <span>Digital Twin</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('missions')}
                      className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        activeTab === 'missions'
                          ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>Missions</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        activeTab === 'profile'
                          ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Profile & Evidence</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setActiveTab('admin-stats')}
                      className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        activeTab === 'admin-stats'
                          ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      <BarChart3 className="w-3.5 h-3.5" />
                      <span>Cohort Telemetry</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('admin-students')}
                      className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        activeTab === 'admin-students'
                          ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Student Roster</span>
                    </button>
                  </>
                )}
              </div>
            )}

            {/* 3. Right: Pitch Button + Target Role + Persona Dropdown + Logout */}
            <div className="flex items-center gap-2.5">
              
              {/* Prominent Video Pitch Button */}
              <button
                onClick={() => setShowPitchModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs font-black shadow-md shadow-rose-600/20 transition-all hover:scale-105"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span className="hidden sm:inline">5-Min Video Pitch</span>
                <span className="sm:hidden">Pitch</span>
              </button>

              {/* Target Role Dropdown (Students only) */}
              {user && user.role === 'STUDENT' && profile?.targetRole && (
                <div className="relative hidden xl:block">
                  <button
                    onClick={() => setShowRoleMenu(!showRoleMenu)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition-colors"
                  >
                    <Target className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="font-semibold text-white max-w-[130px] truncate">{profile.targetRole.name}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  {showRoleMenu && (
                    <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-2 py-1">
                        Active Benchmark Target
                      </p>
                      <div className="space-y-1 mt-1">
                        {roles.map((r) => (
                          <button
                            key={r.id}
                            onClick={() => handleRoleSelect(r.id)}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                              profile.targetRoleId === r.id
                                ? 'bg-brand-500/20 text-brand-300 font-bold border border-brand-500/30'
                                : 'text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            <span className="truncate">{r.name}</span>
                            {profile.targetRoleId === r.id && <CheckCircle2 className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Persona Switcher Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowPersonaMenu(!showPersonaMenu)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-white transition-all shadow-sm"
                >
                  <div className="w-5 h-5 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-[10px] font-bold text-white">
                    {user ? user.name.slice(0, 1) : 'P'}
                  </div>
                  <span className="hidden sm:inline font-bold">{user ? user.name : 'Demo Persona'}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {showPersonaMenu && (
                  <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-2 py-1.5 border-b border-slate-800/80 mb-2">
                      <p className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-brand-400" /> 1-Click Judging Personas
                      </p>
                      <p className="text-[10px] text-slate-400">Switch instantly to evaluate different stages</p>
                    </div>
                    <div className="space-y-1">
                      {demoPersonas.map((p) => (
                        <button
                          key={p.email}
                          onClick={() => handlePersonaSwitch(p.email)}
                          className={`w-full text-left p-2 rounded-xl text-xs transition-all flex items-center justify-between border ${
                            user?.email === p.email
                              ? 'bg-brand-500/15 border-brand-500/40 text-white'
                              : 'bg-slate-950/60 border-slate-800/60 hover:bg-slate-800 hover:border-slate-700 text-slate-300'
                          }`}
                        >
                          <div className="truncate">
                            <p className="font-bold text-white truncate">{p.name}</p>
                            <span className="text-[10px] text-slate-400">{p.role}</span>
                          </div>
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${p.color} flex-shrink-0`}>
                            {p.badge}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Logout Button */}
              {user && (
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800/80 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>

            </div>
          </div>
        </div>

        {/* Mobile Drawer Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-2xl p-4 space-y-2 animate-in slide-in-from-top duration-200">
            <button
              onClick={() => { setShowPitchModal(true); setMobileMenuOpen(false); }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-rose-600 to-amber-600 text-white flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Watch 5-Minute Video Pitch</span>
            </button>

            {user && user.role === 'STUDENT' ? (
              <>
                <button
                  onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                    activeTab === 'dashboard' ? 'bg-brand-600 text-white' : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <Target className="w-4 h-4" />
                  <span>Digital Twin</span>
                </button>
                <button
                  onClick={() => { setActiveTab('missions'); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                    activeTab === 'missions' ? 'bg-brand-600 text-white' : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <Compass className="w-4 h-4" />
                  <span>Missions</span>
                </button>
                <button
                  onClick={() => { setActiveTab('profile'); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                    activeTab === 'profile' ? 'bg-brand-600 text-white' : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Profile & Evidence</span>
                </button>
              </>
            ) : user && (
              <>
                <button
                  onClick={() => { setActiveTab('admin-stats'); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                    activeTab === 'admin-stats' ? 'bg-brand-600 text-white' : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Cohort Telemetry</span>
                </button>
                <button
                  onClick={() => { setActiveTab('admin-students'); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                    activeTab === 'admin-students' ? 'bg-brand-600 text-white' : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Student Roster</span>
                </button>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Video Pitch Modal */}
      {showPitchModal && (
        <VideoPitchPlayerModal onClose={() => setShowPitchModal(false)} />
      )}
    </>
  );
}
