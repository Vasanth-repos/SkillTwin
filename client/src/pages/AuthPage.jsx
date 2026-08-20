import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSkillTwin } from '../context/SkillTwinContext';
import { 
  Sparkles, 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  Zap, 
  CheckCircle2, 
  GraduationCap, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function AuthPage() {
  const { login, register, quickLogin } = useAuth();
  const { roles } = useSkillTwin();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [degree, setDegree] = useState('B.S. in Computer Science');
  const [role, setRole] = useState('STUDENT');
  const [targetRoleId, setTargetRoleId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const demoPersonas = [
    { name: 'Alex Chen', email: 'student@skilltwin.dev', role: 'Backend Student (58%)', color: 'border-amber-500/40 text-amber-300' },
    { name: 'Sarah Miller', email: 'sarah@skilltwin.dev', role: 'Full-Stack Student (86%)', color: 'border-emerald-500/40 text-emerald-300' },
    { name: 'Jordan Lee', email: 'dev@skilltwin.dev', role: 'DevOps Student (36%)', color: 'border-cyan-500/40 text-cyan-300' },
    { name: 'Prof. Davis', email: 'admin@skilltwin.dev', role: 'College Admin Cockpit', color: 'border-brand-500/40 text-brand-300' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await register({
          name,
          email,
          password,
          role,
          degree,
          targetRoleId: targetRoleId || (roles[0]?.id || null)
        });
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (demoEmail) => {
    setError('');
    setLoading(true);
    try {
      await quickLogin(demoEmail, 'password123');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        
        {/* Card Container */}
        <div className="glass-panel p-8 rounded-3xl border-slate-800 shadow-2xl relative overflow-hidden">
          
          {/* Logo */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-brand-500/30 mb-3">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-black text-white">
              {isRegister ? 'Create Your Digital Twin' : 'Welcome to SkillTwin'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {isRegister ? 'Setup your verified student evidence profile' : 'Sign in to access your skills dashboard'}
            </p>
          </div>

          {/* 1-Click Fast Persona Switcher for Judges */}
          <div className="mb-6 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/90 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                <Zap className="w-3 h-3" /> Quick Demo Login (1-Click)
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Demo Mode</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {demoPersonas.map((p) => (
                <button
                  key={p.email}
                  type="button"
                  onClick={() => handleQuickDemo(p.email)}
                  disabled={loading}
                  className={`p-2 rounded-xl text-left bg-slate-900/60 hover:bg-slate-850 border ${p.color} transition-all hover:scale-[1.02] text-xs`}
                >
                  <p className="font-bold text-white text-[11px] truncate">{p.name}</p>
                  <span className="text-[10px] text-slate-400 truncate block">{p.role}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {isRegister && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Chen"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Account Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
                  >
                    <option value="STUDENT">Student (Digital Skill Twin)</option>
                    <option value="COLLEGE_ADMIN">College Administrator (Cohort Analytics)</option>
                  </select>
                </div>

                {role === 'STUDENT' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Target Career Benchmark</label>
                    <select
                      value={targetRoleId}
                      onChange={(e) => setTargetRoleId(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
                    >
                      <option value="">Select target role...</option>
                      {roles.map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@skilltwin.dev"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-600/30 transition-all disabled:opacity-50"
            >
              <span>{loading ? 'Processing...' : isRegister ? 'Create Digital Twin' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>

          {/* Toggle Register / Login */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
            {isRegister ? (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(false)}
                  className="font-bold text-brand-400 hover:text-brand-300 underline underline-offset-2"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <p>
                New to SkillTwin?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(true)}
                  className="font-bold text-brand-400 hover:text-brand-300 underline underline-offset-2"
                >
                  Register Profile
                </button>
              </p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
