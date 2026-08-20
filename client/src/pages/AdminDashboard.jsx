import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Search, 
  Filter, 
  Eye, 
  X, 
  CheckCircle2, 
  GraduationCap, 
  ShieldCheck, 
  Clock, 
  ArrowUpRight,
  Download,
  BookOpen,
  Calendar,
  Sparkles,
  Copy,
  Check
} from 'lucide-react';
import SkillRadarChart from '../components/SkillRadarChart';
import ReadinessTrendChart from '../components/ReadinessTrendChart';

export default function AdminDashboard({ subView = 'stats' }) {
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [minReadiness, setMinReadiness] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showCurriculumModal, setShowCurriculumModal] = useState(false);
  const [copiedPlan, setCopiedPlan] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch cohort telemetry and students
  useEffect(() => {
    async function loadAdminData() {
      setLoading(true);
      try {
        const statsRes = await api.get('/admin/cohort-stats');
        setStats(statsRes.data);

        const studentsRes = await api.get('/admin/students', {
          params: { search, roleId: roleFilter, minReadiness }
        });
        setStudents(studentsRes.data.students || []);
      } catch (err) {
        console.error('Failed to load admin data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, [search, roleFilter, minReadiness]);

  // Load individual student drilldown details
  const handleViewStudent = async (studentId) => {
    try {
      const res = await api.get(`/admin/students/${studentId}`);
      setSelectedStudent(res.data.student);
    } catch (err) {
      alert('Could not fetch student details.');
    }
  };

  // Export CSV Handler
  const handleExportCsv = () => {
    if (!students || students.length === 0) return;

    const headers = ['Student Name', 'Email', 'Degree', 'Target Role', 'Readiness Score (%)', 'DSA Problems Solved', 'Completed Missions', 'Last Active'];
    const rows = students.map(s => [
      `"${s.name}"`,
      `"${s.email}"`,
      `"${s.degree}"`,
      `"${s.targetRoleName}"`,
      s.readinessScore,
      s.dsaProblemsSolved,
      s.completedMissionsCount,
      `"${new Date(s.lastActive).toISOString()}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `skilltwin-cohort-telemetry-${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const topInstitutionalGap = stats?.institutionalSkillGaps?.[0];

  const handleCopyCurriculum = () => {
    const plan = `SkillTwin Curriculum Action Plan — Institutional Intervention\nTarget Deficit: ${topInstitutionalGap?.skillName} (${topInstitutionalGap?.gapPercentage}% cohort deficit)\n\nWeek 1: Foundations & Architecture\n- Session 1: Core concepts and container runtime\n- Lab 1: Multi-stage Docker build assignment\n\nWeek 2: Production Readiness\n- Session 2: Orchestration and environment configuration\n- Lab 2: Automated test integration and deployment verification`;
    navigator.clipboard.writeText(plan);
    setCopiedPlan(true);
    setTimeout(() => setCopiedPlan(false), 3000);
  };

  if (loading && !stats) {
    return (
      <div className="p-12 text-center text-slate-400 space-y-2">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs">Loading institutional cohort analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
              Institutional Placement Telemetry
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400">College Administration Cockpit</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Cohort Career Readiness Overview
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time aggregate insights into institutional skill deficits and student placement readiness.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowCurriculumModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-600/30 transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Curriculum Intervention</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Top 3 Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Total Students */}
        <div className="glass-panel p-6 rounded-3xl space-y-2 border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Enrolled Students</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">
            {stats?.totalStudents || 0}
          </div>
          <p className="text-[11px] text-slate-400">Active student digital twins tracking placement benchmarks</p>
        </div>

        {/* Cohort Average Readiness */}
        <div className="glass-panel p-6 rounded-3xl space-y-2 border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Avg Cohort Readiness</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-cyan-400">
            {stats?.avgCohortReadiness || 0}%
          </div>
          <p className="text-[11px] text-slate-400">Weighted average readiness across all career targets</p>
        </div>

        {/* Critical Institutional Gaps */}
        <div className="glass-panel p-6 rounded-3xl space-y-2 border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Critical Skill Deficits</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-rose-400">
            {stats?.institutionalSkillGaps?.filter(g => g.gapPercentage >= 50).length || 0}
          </div>
          <p className="text-[11px] text-slate-400">Skills where &gt;50% of enrolled students have unmet gaps</p>
        </div>

      </div>

      {/* Institutional Skill Gap Heatmap (Key Admin Feature) */}
      <div className="glass-panel p-6 sm:p-7 rounded-3xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
              Curriculum Optimization Intelligence
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">
              Institutional Skill Gap Frequency Heatmap
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Aggregated across all student profiles
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Shows the percentage of students requiring each skill who currently lack verified project evidence or coursework.
        </p>

        <div className="space-y-3 pt-2">
          {stats?.institutionalSkillGaps?.map((gap) => (
            <div 
              key={gap.skillName}
              className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{gap.skillName}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    gap.gapPercentage >= 70
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      : gap.gapPercentage >= 40
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }`}>
                    {gap.gapPercentage}% Cohort Deficit
                  </span>
                </div>

                <span className="text-slate-400">
                  <strong className="text-white">{gap.studentsWithGap}</strong> of {gap.totalStudentsNeeding} students affected
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-700 ${
                    gap.gapPercentage >= 70
                      ? 'bg-rose-500'
                      : gap.gapPercentage >= 40
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${gap.gapPercentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Student Roster Table Section */}
      <div className="glass-panel p-6 sm:p-7 rounded-3xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Student Placement Roster
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">
              Enrolled Candidate Telemetry ({students.length})
            </h3>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search candidate..."
                className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>
            <select
              value={minReadiness}
              onChange={(e) => setMinReadiness(e.target.value)}
              className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-brand-500"
            >
              <option value="">All Readiness</option>
              <option value="80">&ge; 80% (Interview Ready)</option>
              <option value="50">&ge; 50% (Placement Track)</option>
              <option value="30">&ge; 30% (Foundational)</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Student</th>
                <th className="py-3 px-3">Target Career Benchmark</th>
                <th className="py-3 px-3">Readiness Score</th>
                <th className="py-3 px-3">DSA Count</th>
                <th className="py-3 px-3">Missions</th>
                <th className="py-3 px-3 text-right">Drilldown</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {students.map((st) => (
                <tr key={st.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3.5 px-3">
                    <p className="font-bold text-white">{st.name}</p>
                    <span className="text-[11px] text-slate-400 font-mono">{st.email}</span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="font-semibold text-slate-200">{st.targetRoleName}</span>
                    <span className="text-[11px] text-slate-500 block truncate">{st.degree}</span>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      <span className={`font-black text-sm ${
                        st.readinessScore >= 80 
                          ? 'text-emerald-400' 
                          : st.readinessScore >= 50 
                          ? 'text-amber-400' 
                          : 'text-rose-400'
                      }`}>
                        {st.readinessScore}%
                      </span>
                      <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${st.readinessScore >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                          style={{ width: `${st.readinessScore}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-300">
                    {st.dsaProblemsSolved} Solved
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-brand-500/10 text-brand-300 border border-brand-500/20 font-semibold text-[11px]">
                      {st.completedMissionsCount} Verified
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => handleViewStudent(st.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Twin</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Curriculum Intervention Generator Modal */}
      {showCurriculumModal && topInstitutionalGap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-8 animate-in zoom-in-95">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-400" />
                <h3 className="text-sm font-bold text-white">
                  Curriculum Intervention Syllabus Plan
                </h3>
              </div>
              <button
                onClick={() => setShowCurriculumModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
              
              {/* Target Banner */}
              <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-brand-300">
                    Recommended Workshop: {topInstitutionalGap.skillName}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                    {topInstitutionalGap.gapPercentage}% Cohort Deficit
                  </span>
                </div>
                <p className="text-slate-400">
                  Targeted at closing the {topInstitutionalGap.studentsWithGap} student gap identified by SkillTwin telemetry.
                </p>
              </div>

              {/* 2-Week Workshop Plan */}
              <div className="space-y-3">
                <h4 className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-cyan-400" /> 2-Week Intensive Hands-On Lab Schedule
                </h4>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <p className="font-bold text-cyan-300">Week 1: Core Architecture & Artifact Creation</p>
                  <p className="text-slate-300">• Lecture: Production containerization and multi-stage builds</p>
                  <p className="text-slate-300">• Lab Mission: Containerize Express + PostgreSQL backend service</p>
                  <p className="text-slate-400 font-mono text-[10px]">Verification: Dockerfile, docker-compose.yml presence & healthcheck</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <p className="font-bold text-indigo-300">Week 2: CI/CD Pipeline & Orchestration</p>
                  <p className="text-slate-300">• Lecture: GitHub Actions automation matrix and test execution</p>
                  <p className="text-slate-300">• Lab Mission: Multi-environment deployment with automated testing</p>
                  <p className="text-slate-400 font-mono text-[10px]">Verification: .github/workflows/ci.yml and test assertions</p>
                </div>
              </div>

            </div>

            <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex justify-between">
              <button
                onClick={handleCopyCurriculum}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all"
              >
                {copiedPlan ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedPlan ? 'Copied to Clipboard!' : 'Copy Syllabus Plan'}</span>
              </button>

              <button
                onClick={() => setShowCurriculumModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Student Drilldown Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-8 animate-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-brand-600/20 text-brand-400 border border-brand-500/30 flex items-center justify-center font-bold text-sm">
                  {selectedStudent.user?.name?.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {selectedStudent.user?.name} — Digital Skill Twin
                  </h3>
                  <p className="text-xs text-slate-400">
                    Targeting: <strong className="text-cyan-400">{selectedStudent.targetRole?.name}</strong> • {selectedStudent.degree}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              
              {/* Radar & Score Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Skill Competency Radar
                  </h4>
                  <SkillRadarChart 
                    skillGraphs={selectedStudent.skillGraphs} 
                    roleRequirements={selectedStudent.targetRole?.skillRequirements || []} 
                  />
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Readiness Trajectory
                  </h4>
                  <ReadinessTrendChart history={selectedStudent.readinessHistory} />

                  <div className="pt-2 border-t border-slate-800/80 space-y-1 text-xs">
                    <p className="text-slate-300">
                      <strong>DSA Problems Solved:</strong> {selectedStudent.dsaProblemsSolved}
                    </p>
                    <p className="text-slate-300">
                      <strong>Languages:</strong> {(selectedStudent.languages || []).join(', ')}
                    </p>
                    <p className="text-slate-300">
                      <strong>Coursework:</strong> {(selectedStudent.academicSubjects || []).join(', ')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Verified Submissions */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Verified Hands-on Submissions ({selectedStudent.submissions?.length || 0})
                </h4>
                <div className="space-y-2">
                  {selectedStudent.submissions?.map((sub) => (
                    <div key={sub.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-white">{sub.mission?.title || 'Hands-on Mission'}</p>
                        <span className="text-[11px] font-mono text-slate-400">{sub.submissionUrl}</span>
                      </div>
                      <span className="font-bold text-emerald-400">+{sub.scoreDelta} PTS Earned</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white"
              >
                Close Inspector
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
