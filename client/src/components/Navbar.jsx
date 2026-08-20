import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSkillTwin } from '../context/SkillTwinContext';
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
  Code2, 
  CheckCircle2,
  Menu,
  X
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const { user, logout, quickLogin } = useAuth();
  const { profile, roles, switchTargetRole } = useSkillTwin();
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const demoPersonas = [
    { name: 'Alex Chen', email: 'student@skilltwin.dev', role: 'Backend Software Engineer', badge: 'Mid Readiness (58%)', color: 'text-amber-400' },
    { name: 'Sarah Miller', email: 'sarah@skilltwin.dev', role: 'Full-Stack Developer', badge: 'High Readiness (86%)', color: 'text-emerald-400' },
    { name: 'Jordan Lee', email: 'dev@skilltwin.dev', role: 'Cloud DevOps Engineer', badge: 'Beginner (36%)', color: 'text-cyan-400' },
    { name: 'Prof. Davis', email: 'admin@skilltwin.dev', role: 'College Administrator', badge: 'Admin Cockpit', color: 'text-brand-400' },
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
    <nav className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  SkillTwin
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                  MVP
                </span>
              </div>
              <p className="text-[10px] text-slate-400 -mt-0.5 font-medium hidden sm:block">
                Digital Career Twin & Evidence Engine
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          {user && (
            <div className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/60">
              {user.role === 'STUDENT' ? (
                <>
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      activeTab === 'dashboard'
                        ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <Target className="w-4 h-4" />
                    Digital Twin
                  </button>

                  <button
                    onClick={() => setActiveTab('missions')}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      activeTab === 'missions'
                        ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <Compass className="w-4 h-4" />
                    Missions
                  </button>

                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      activeTab === 'profile'
                        ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    Profile & Evidence
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setActiveTab('admin-stats')}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      activeTab === 'admin-stats'
                        ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4" />
                    Cohort Analytics
                  </button>

                  <button
                    onClick={() => setActiveTab('admin-students')}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      activeTab === 'admin-students'
                        ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    Student Roster
                  </button>
                </>
              )}
            </div>
          )}

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            
            {/* Target Role Switcher Chip (Students only) */}
            {user && user.role === 'STUDENT' && profile?.targetRole && (
              <div className="relative hidden lg:block">
                <button
                  onClick={() => setShowRoleMenu(!showRoleMenu)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:border-brand-500/50 transition-colors"
                >
                  <Target className="w-3.5 h-3.5 text-brand-400" />
                  <span className="font-semibold text-white">{profile.targetRole.name}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {showRoleMenu && (
                  <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50">
                    <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold px-2 py-1">
                      Benchmark Target Role
                    </p>
                    <div className="space-y-1 mt-1">
                      {roles.map((r) => (
                        <button
                          key={r.id}
                          onClick={() => handleRoleSelect(r.id)}
                          className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                            profile.targetRoleId === r.id
                              ? 'bg-brand-500/20 text-brand-300 font-semibold border border-brand-500/30'
                              : 'text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <span>{r.name}</span>
                          {profile.targetRoleId === r.id && <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quick Demo Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowPersonaMenu(!showPersonaMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700/80 hover:border-brand-500/50 text-xs font-medium text-slate-200 transition-all shadow-sm"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="hidden sm:inline text-slate-400">Demo Persona:</span>
                <span className="font-semibold text-white">{user ? user.name : 'Select Persona'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showPersonaMenu && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2.5 z-50">
                  <div className="px-2 py-1.5 border-b border-slate-800/80 mb-2">
                    <p className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-brand-400" /> 1-Click Judging Personas
                    </p>
                    <p className="text-[11px] text-slate-400">Switch instantly to test different student readiness stages</p>
                  </div>
                  <div className="space-y-1.5">
                    {demoPersonas.map((persona) => (
                      <button
                        key={persona.email}
                        onClick={() => handlePersonaSwitch(persona.email)}
                        className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex flex-col gap-0.5 border ${
                          user?.email === persona.email
                            ? 'bg-brand-500/15 border-brand-500/40 text-white'
                            : 'bg-slate-800/40 border-transparent hover:bg-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">{persona.name}</span>
                          <span className={`text-[10px] font-semibold ${persona.color}`}>
                            {persona.badge}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">{persona.role}</span>
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
                className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800/60 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Dropdown Nav */}
      {mobileMenuOpen && user && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 p-4 space-y-2">
          {user.role === 'STUDENT' ? (
            <>
              <button
                onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                  activeTab === 'dashboard' ? 'bg-brand-600 text-white' : 'text-slate-300'
                }`}
              >
                Digital Twin
              </button>
              <button
                onClick={() => { setActiveTab('missions'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                  activeTab === 'missions' ? 'bg-brand-600 text-white' : 'text-slate-300'
                }`}
              >
                Missions
              </button>
              <button
                onClick={() => { setActiveTab('profile'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                  activeTab === 'profile' ? 'bg-brand-600 text-white' : 'text-slate-300'
                }`}
              >
                Profile & Evidence
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => { setActiveTab('admin-stats'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                  activeTab === 'admin-stats' ? 'bg-brand-600 text-white' : 'text-slate-300'
                }`}
              >
                Cohort Analytics
              </button>
              <button
                onClick={() => { setActiveTab('admin-students'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                  activeTab === 'admin-students' ? 'bg-brand-600 text-white' : 'text-slate-300'
                }`}
              >
                Student Roster
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
