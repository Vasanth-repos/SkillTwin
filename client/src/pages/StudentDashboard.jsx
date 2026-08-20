import React, { useState } from 'react';
import { useSkillTwin } from '../context/SkillTwinContext';
import ReadinessGauge from '../components/ReadinessGauge';
import SkillRadarChart from '../components/SkillRadarChart';
import SkillBarChart from '../components/SkillBarChart';
import PriorityGapList from '../components/PriorityGapList';
import ReadinessTrendChart from '../components/ReadinessTrendChart';
import MissionSubmissionModal from '../components/MissionSubmissionModal';
import MilestoneBadges from '../components/MilestoneBadges';
import RoleBenchmarkMatrix from '../components/RoleBenchmarkMatrix';
import CredentialExportModal from '../components/CredentialExportModal';
import SkillDefenseDrillModal from '../components/SkillDefenseDrillModal';
import ProjectDefenseModal from '../components/ProjectDefenseModal';
import CompanyTierSelector from '../components/CompanyTierSelector';
import PredictiveTrajectorySimulator from '../components/PredictiveTrajectorySimulator';
import { 
  Target, 
  Compass, 
  Flame, 
  Sparkles, 
  ArrowRight, 
  TrendingUp, 
  FolderGit2, 
  ShieldCheck, 
  Layers, 
  GraduationCap, 
  Zap, 
  BrainCircuit 
} from 'lucide-react';

export default function StudentDashboard({ onNavigateToMissions, onNavigateToProfile }) {
  const { profile, skillGraphs, gaps, readiness, readinessHistory, missions, submissions } = useSkillTwin();
  const [selectedMissionForModal, setSelectedMissionForModal] = useState(null);
  const [selectedDrillSkill, setSelectedDrillSkill] = useState(null);
  const [showProjectDefense, setShowProjectDefense] = useState(false);
  const [showSimulatorModal, setShowSimulatorModal] = useState(false);
  const [showCredentialModal, setShowCredentialModal] = useState(false);
  const [activeCompanyTier, setActiveCompanyTier] = useState('STANDARD');
  const [chartViewMode, setChartViewMode] = useState('radar');

  const targetRole = profile?.targetRole;
  const roleRequirements = targetRole?.skillRequirements || [];

  const topGap = gaps.find(g => g.gap > 0);
  const topMission = topGap 
    ? missions.find(m => m.targetSkill === topGap.skillName && !m.isCompleted) || missions[0]
    : missions[0];

  const facultyAssignments = profile?.facultyAssignments || [];
  const latestFacultyAssignment = facultyAssignments[0];

  const handleLaunchMissionForSkill = (skillName) => {
    const matchingMission = missions.find(m => m.targetSkill === skillName) || missions[0];
    if (matchingMission) {
      setSelectedMissionForModal(matchingMission);
    } else {
      onNavigateToMissions();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Quick Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800/80">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Active Role: <strong className="text-white">{targetRole?.name}</strong></span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {topGap && (
            <button
              onClick={() => setSelectedDrillSkill(topGap.skillName)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-xs font-bold text-amber-300 transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Skill Defense (+10 pts)</span>
            </button>
          )}

          <button
            onClick={() => setShowProjectDefense(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-xs font-bold text-cyan-300 transition-colors"
          >
            <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
            <span>Mock Defense</span>
          </button>

          <button
            onClick={() => setShowSimulatorModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Role Simulator</span>
          </button>

          <button
            onClick={() => setShowCredentialModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white shadow-md shadow-brand-600/30 transition-all hover:scale-105"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-white" />
            <span>Export Credential</span>
          </button>
        </div>
      </div>

      {/* Faculty Assignment Alert Banner */}
      {latestFacultyAssignment && latestFacultyAssignment.mission && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-brand-950/80 border-2 border-indigo-500/50 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in slide-in-from-top duration-300">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-cyan-300" /> Faculty Nudge: Priority Mission
              </span>
              <span className="text-xs text-slate-400 font-mono">
                From {latestFacultyAssignment.facultyName}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              {latestFacultyAssignment.mission.title}
            </h3>
            <p className="text-xs text-indigo-200/90 italic">
              "{latestFacultyAssignment.facultyNote}"
            </p>
          </div>

          <button
            onClick={() => setSelectedMissionForModal(latestFacultyAssignment.mission)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all hover:scale-105 flex-shrink-0"
          >
            <span>Start Mission</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Company Tier Selector */}
      <div className="glass-panel p-4 sm:p-5">
        <CompanyTierSelector
          activeTier={activeCompanyTier}
          onSelectTier={setActiveCompanyTier}
        />
      </div>

      {/* Readiness Meter & Radar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Gauge (5 cols) */}
        <div className="lg:col-span-5 flex flex-col">
          <ReadinessGauge 
            readiness={readiness} 
            targetRole={targetRole} 
            studentName={profile?.user?.name}
          />
        </div>

        {/* Right: Charts (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-4 mb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Competency Benchmarking
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Skill Graph vs Target Requirements
                </h3>
              </div>

              {/* View Toggle */}
              <div className="flex items-center bg-slate-950 p-0.5 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setChartViewMode('radar')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    chartViewMode === 'radar' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Radar
                </button>
                <button
                  onClick={() => setChartViewMode('bars')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    chartViewMode === 'bars' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Bar
                </button>
              </div>
            </div>

            {chartViewMode === 'radar' ? (
              <SkillRadarChart 
                skillGraphs={skillGraphs} 
                roleRequirements={roleRequirements} 
              />
            ) : (
              <SkillBarChart 
                gaps={gaps} 
                onSelectSkill={handleLaunchMissionForSkill} 
              />
            )}
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" /> Demonstrated Score
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500" /> Target Requirement
            </span>
          </div>
        </div>

      </div>

      {/* Milestone Badges */}
      <div className="glass-panel p-5">
        <MilestoneBadges 
          profile={profile} 
          skillGraphs={skillGraphs} 
          submissions={submissions} 
        />
      </div>

      {/* Predictive Trajectory Simulator */}
      <PredictiveTrajectorySimulator
        currentReadiness={readiness?.readinessScore || 58}
        gaps={gaps}
        dsaCurrent={profile?.dsaProblemsSolved || 65}
      />

      {/* Recommended Mission Callout */}
      {topMission && !topMission.isCompleted && topGap && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-brand-950/60 via-slate-900 to-indigo-950/50 border border-brand-500/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400 fill-amber-400" /> Priority Gap Action
              </span>
              <span className="text-xs text-cyan-300 font-semibold font-mono">
                {topMission.targetSkill} (-{topGap.gap} pts)
              </span>
            </div>
            <h3 className="text-base font-bold text-white">
              {topMission.title}
            </h3>
            <p className="text-xs text-slate-300 line-clamp-2">
              {topMission.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setSelectedDrillSkill(topMission.targetSkill)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all"
            >
              Skill Drill
            </button>
            <button
              onClick={() => setSelectedMissionForModal(topMission)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-600/30 transition-all hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch Mission</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Prioritized Gaps & Trajectory History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Ranked Gaps (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Rule-Based Prioritization
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                Ranked Skill Deficits
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500">
              priority = gap × imp × rel
            </span>
          </div>

          <PriorityGapList 
            gaps={gaps} 
            onLaunchMissionForSkill={handleLaunchMissionForSkill} 
          />
        </div>

        {/* Score History & Recent Submissions (5 cols) */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
          
          <div className="glass-panel p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Score Trajectory
              </span>
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Historical Growth
              </span>
            </div>
            <ReadinessTrendChart history={readinessHistory} />
          </div>

          <div className="glass-panel p-5 space-y-3 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Evidence Audit Trail
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {submissions.length} Verified
              </span>
            </div>

            {submissions.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 text-center text-xs text-slate-400">
                <FolderGit2 className="w-6 h-6 mx-auto text-slate-600 mb-1" />
                No submissions yet. Launch a mission above!
              </div>
            ) : (
              <div className="space-y-1.5">
                {submissions.slice(0, 3).map((sub) => (
                  <div 
                    key={sub.id} 
                    className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5 max-w-[70%]">
                      <p className="font-bold text-white truncate text-[11px]">
                        {sub.mission?.title || 'Hands-on Mission'}
                      </p>
                      <span className="text-[10px] font-mono text-slate-500 truncate block">
                        {sub.submissionUrl}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 font-mono">
                      +{sub.scoreDelta} PTS
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Modals */}
      {showSimulatorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-8 p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Multi-Role Benchmark Simulator</h3>
              <button onClick={() => setShowSimulatorModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <RoleBenchmarkMatrix onClose={() => setShowSimulatorModal(false)} />
          </div>
        </div>
      )}

      {showCredentialModal && (
        <CredentialExportModal
          profile={profile}
          readiness={readiness}
          skillGraphs={skillGraphs}
          onClose={() => setShowCredentialModal(false)}
        />
      )}

      {selectedDrillSkill && (
        <SkillDefenseDrillModal
          skillName={selectedDrillSkill}
          onClose={() => setSelectedDrillSkill(null)}
        />
      )}

      {showProjectDefense && (
        <ProjectDefenseModal
          onClose={() => setShowProjectDefense(false)}
        />
      )}

      {selectedMissionForModal && (
        <MissionSubmissionModal 
          mission={selectedMissionForModal} 
          onClose={() => setSelectedMissionForModal(null)} 
        />
      )}

    </div>
  );
}
