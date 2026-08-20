import React, { useState, useEffect } from 'react';
import { useSkillTwin } from '../context/SkillTwinContext';
import { 
  User, 
  Target, 
  GraduationCap, 
  Code2, 
  FolderGit2, 
  Award, 
  Github, 
  Plus, 
  Trash2, 
  Save, 
  Sparkles, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function ProfileEditorPage() {
  const { profile, roles, updateProfile, loading } = useSkillTwin();

  const [targetRoleId, setTargetRoleId] = useState('');
  const [degree, setDegree] = useState('');
  const [academicSubjects, setAcademicSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState('');
  const [languages, setLanguages] = useState([]);
  const [newLang, setNewLang] = useState('');
  const [dsaCount, setDsaCount] = useState(0);
  const [githubUrl, setGithubUrl] = useState('');
  const [certifications, setCertifications] = useState([]);
  const [newCert, setNewCert] = useState('');
  const [projects, setProjects] = useState([]);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    techStack: '',
    complexity: 'INTERMEDIATE',
    repoUrl: '',
    description: ''
  });

  useEffect(() => {
    if (profile) {
      setTargetRoleId(profile.targetRoleId || '');
      setDegree(profile.degree || '');
      setAcademicSubjects(profile.academicSubjects || []);
      setLanguages(profile.languages || []);
      setDsaCount(profile.dsaProblemsSolved || 0);
      setGithubUrl(profile.githubUrl || '');
      setCertifications(profile.certifications || []);
      setProjects(profile.projects || []);
    }
  }, [profile]);

  const handleAddSubject = (e) => {
    e.preventDefault();
    if (newSubject.trim() && !academicSubjects.includes(newSubject.trim())) {
      setAcademicSubjects([...academicSubjects, newSubject.trim()]);
      setNewSubject('');
    }
  };

  const handleRemoveSubject = (index) => {
    setAcademicSubjects(academicSubjects.filter((_, i) => i !== index));
  };

  const handleAddLanguage = (e) => {
    e.preventDefault();
    if (newLang.trim() && !languages.includes(newLang.trim())) {
      setLanguages([...languages, newLang.trim()]);
      setNewLang('');
    }
  };

  const handleRemoveLanguage = (index) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  const handleAddCert = (e) => {
    e.preventDefault();
    if (newCert.trim() && !certifications.includes(newCert.trim())) {
      setCertifications([...certifications, newCert.trim()]);
      setNewCert('');
    }
  };

  const handleRemoveCert = (index) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  const handleAddProject = (e) => {
    e.preventDefault();
    if (!newProject.title.trim()) return;

    const formatted = {
      ...newProject,
      techStack: newProject.techStack.split(',').map(s => s.trim()).filter(Boolean)
    };

    setProjects([...projects, formatted]);
    setNewProject({
      title: '',
      techStack: '',
      complexity: 'INTERMEDIATE',
      repoUrl: '',
      description: ''
    });
  };

  const handleRemoveProject = (index) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSavedSuccess(false);
    try {
      await updateProfile({
        targetRoleId,
        degree,
        academicSubjects,
        languages,
        dsaProblemsSolved: Number(dsaCount),
        githubUrl,
        certifications,
        projects
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      alert(err.message);
    }
  };

  // Compute DSA tier badge
  let dsaTier = 'Novice';
  let dsaBadgeColor = 'text-slate-400 bg-slate-800';
  if (dsaCount >= 400) {
    dsaTier = 'Mastery (90+ pts)';
    dsaBadgeColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  } else if (dsaCount >= 200) {
    dsaTier = 'Advanced (75 pts)';
    dsaBadgeColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  } else if (dsaCount >= 100) {
    dsaTier = 'Intermediate (55 pts)';
    dsaBadgeColor = 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
  } else if (dsaCount >= 30) {
    dsaTier = 'Foundational (35 pts)';
    dsaBadgeColor = 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30';
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 animate-in fade-in duration-300 max-w-5xl mx-auto pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
            Profile & Evidence Configuration
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Digital Twin Engine Inputs
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            The deterministic skill engine calculates your baseline skill graph and gap analysis from these verified inputs.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-600/30 transition-all hover:scale-105 disabled:opacity-50 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Recomputing Twin...' : 'Save & Recalculate Twin'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Profile updated successfully! Digital skill twin and career readiness scores recomputed.
        </div>
      )}

      {/* 1. Target Role Benchmark Card */}
      <div className="glass-panel p-6 rounded-3xl space-y-4 border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Target Career Benchmark</h3>
            <p className="text-xs text-slate-400">Select the industry role to benchmark your skills against.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {roles.map((role) => (
            <label
              key={role.id}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                targetRoleId === role.id
                  ? 'bg-brand-500/15 border-brand-500/50 shadow-md shadow-brand-500/10'
                  : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-bold text-sm text-white">{role.name}</span>
                <input
                  type="radio"
                  name="targetRole"
                  value={role.id}
                  checked={targetRoleId === role.id}
                  onChange={() => setTargetRoleId(role.id)}
                  className="mt-1 text-brand-600 focus:ring-brand-500"
                />
              </div>
              <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                {role.description}
              </p>
            </label>
          ))}
        </div>
      </div>

      {/* 2. Academic & DSA Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Academic Details */}
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Academic Foundation</h3>
              <p className="text-xs text-slate-400">Degree & completed coursework.</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Degree Program
              </label>
              <input
                type="text"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                placeholder="e.g. B.S. in Computer Science (Senior)"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Completed Coursework (Awards +20 pts to matching skills)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="e.g. Database Systems, OS, Web Dev"
                  className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
                <button
                  type="button"
                  onClick={handleAddSubject}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {academicSubjects.map((sub, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs"
                  >
                    <span>{sub}</span>
                    <button type="button" onClick={() => handleRemoveSubject(i)} className="text-indigo-400 hover:text-white">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* DSA & Languages */}
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">DSA & Languages</h3>
              <p className="text-xs text-slate-400">Problem solving & core stacks.</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* DSA Count Slider */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  DSA Problems Solved (LeetCode / Codeforces)
                </label>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${dsaBadgeColor}`}>
                  {dsaCount} Problems ({dsaTier})
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="500"
                step="5"
                value={dsaCount}
                onChange={(e) => setDsaCount(Number(e.target.value))}
                className="w-full accent-brand-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>0 (Novice)</span>
                <span>100 (Inter)</span>
                <span>200 (Adv)</span>
                <span>400+ (Mastery)</span>
              </div>
            </div>

            {/* Languages */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Programming Languages
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newLang}
                  onChange={(e) => setNewLang(e.target.value)}
                  placeholder="e.g. Python, TypeScript, Java, Go"
                  className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
                <button
                  type="button"
                  onClick={handleAddLanguage}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {languages.map((lang, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs"
                  >
                    <span>{lang}</span>
                    <button type="button" onClick={() => handleRemoveLanguage(i)} className="text-cyan-400 hover:text-white">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* GitHub URL */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                GitHub Portfolio URL
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/your-username"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 font-mono"
              />
            </div>

          </div>
        </div>

      </div>

      {/* 3. Verified Projects Showcase */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Hands-on Project Portfolio</h3>
              <p className="text-xs text-slate-400">Awards evidence points based on complexity and tech stack matching.</p>
            </div>
          </div>

          <span className="text-xs text-slate-400">
            <strong className="text-white">{projects.length}</strong> Projects
          </span>
        </div>

        {/* Existing Projects List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {projects.map((proj, i) => (
            <div key={i} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2 relative group">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-white">{proj.title}</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                    {proj.complexity}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveProject(i)}
                  className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {proj.description}
              </p>

              <div className="flex flex-wrap gap-1 pt-1">
                {(proj.techStack || []).map((t, idx) => (
                  <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Add Project Subform */}
        <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/60 space-y-3 mt-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5 text-brand-400" /> Add Verified Project
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              value={newProject.title}
              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
              placeholder="Project Title"
              className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
            />
            <input
              type="text"
              value={newProject.techStack}
              onChange={(e) => setNewProject({ ...newProject, techStack: e.target.value })}
              placeholder="Tech Stacks (e.g. React, PostgreSQL, Docker)"
              className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
            />
            <select
              value={newProject.complexity}
              onChange={(e) => setNewProject({ ...newProject, complexity: e.target.value })}
              className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
            >
              <option value="BEGINNER">Beginner (+12 pts)</option>
              <option value="INTERMEDIATE">Intermediate (+20 pts)</option>
              <option value="ADVANCED">Advanced (+30 pts)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="url"
              value={newProject.repoUrl}
              onChange={(e) => setNewProject({ ...newProject, repoUrl: e.target.value })}
              placeholder="GitHub Repository URL (+5 pts evidence bonus)"
              className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono"
            />
            <input
              type="text"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              placeholder="Brief architecture description"
              className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
            />
          </div>

          <button
            type="button"
            onClick={handleAddProject}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors"
          >
            Add Project to Portfolio
          </button>
        </div>

      </div>

      {/* 4. Certifications */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Industry Certifications</h3>
            <p className="text-xs text-slate-400">AWS Certified, CKA, Meta, etc. (+30 pts to relevant skills).</p>
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newCert}
            onChange={(e) => setNewCert(e.target.value)}
            placeholder="e.g. AWS Certified Solutions Architect, Docker Certified"
            className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
          <button
            type="button"
            onClick={handleAddCert}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {certifications.map((cert, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs"
            >
              <span>{cert}</span>
              <button type="button" onClick={() => handleRemoveCert(i)} className="text-amber-400 hover:text-white">
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Save Bar */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold shadow-lg shadow-brand-600/30 transition-all hover:scale-105 disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          <span>{loading ? 'Recomputing Twin...' : 'Save & Recompute Digital Twin'}</span>
        </button>
      </div>

    </form>
  );
}
