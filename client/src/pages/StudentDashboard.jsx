import React, { useState } from 'react';
import { useSkillTwin } from '../context/SkillTwinContext';
import ReadinessGauge from '../components/ReadinessGauge';
import SkillRadarChart from '../components/SkillRadarChart';
import SkillBarChart from '../components/SkillBarChart';
import PriorityGapList from '../components/PriorityGapList';
import ReadinessTrendChart from '../components/ReadinessTrendChart';
import MissionSubmissionModal from '../components/MissionSubmissionModal';
import { 
  Target, 
  Compass, 
  Flame, 
  BarChart2, 
  History, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  FolderGit2
} from 'lucide-react';

export default function StudentDashboard({ onNavigateToMissions, onNavigateToProfile }) {
  const { profile, skillGraphs, gaps, readiness, readinessHistory, missions, submissions } = useSkillTwin();
  const [selectedMissionForModal, setSelectedMissionForModal] = useState(null);
  const [chartViewMode, setChartViewMode] = useState('radar'); // 'radar' | 'bars'

  const targetRole = profile?.targetRole;
  const roleRequirements = targetRole?.skillRequirements || [];

  // Find top mission matching the student's #1 critical gap
  const topGap = gaps.find(g => g.gap > 0);
  const topMission = topGap 
    ? missions.find(m => m.targetSkill === topGap.skillName && !m.isCompleted) || missions[0]
    : missions[0];

  const handleLaunchMissionForSkill = (skillName) => {
    const matchingMission = missions.find(m => m.targetSkill === skillName) || missions[0];
    if (matchingMission) {
      setSelectedMissionForModal(matchingMission);
    } else {
      onNavigateToMissions();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Hero Digital Twin Overview Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Prominent Readiness Meter & Score Insights (5 cols) */}
        <div className="lg:col-span-5 flex flex-col">
          <ReadinessGauge 
            readiness={readiness} 
            targetRole={targetRole} 
            studentName={profile?.user?.name}
          />
        </div>

        {/* Right: Skill Benchmark Visualization (7 cols) */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Competency Benchmarking
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  Skill Graph vs Role Requirements
                </h3>
              </div>

              {/* View Toggle (Radar / Bar) */}
              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setChartViewMode('radar')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                    chartViewMode === 'radar' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Radar
                </button>
                <button
                  onClick={() => setChartViewMode('bars')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                    chartViewMode === 'bars' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Breakdown
                </button>
              </div>
            </div>

            {/* Chart Area */}
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

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" /> Cyan: Demonstrated Score
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500" /> Indigo: Target Requirement
            </span>
          </div>
        </div>

      </div>

      {/* Recommended Mission Callout Banner */}
      {topMission && !topMission.isCompleted && topGap && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-950/60 via-slate-900 to-indigo-950/50 border border-brand-500/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400 fill-amber-400" /> Highest-Priority Gap Action
              </span>
              <span className="text-xs text-cyan-300 font-semibold font-mono">
                Targets: {topMission.targetSkill} (-{topGap.gap} pts)
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">
              {topMission.title}
            </h3>
            <p className="text-xs text-slate-300 line-clamp-2">
              {topMission.description}
            </p>
          </div>

          <button
            onClick={() => setSelectedMissionForModal(topMission)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-600/30 transition-all hover:scale-105 flex-shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch Recommended Mission</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Middle 2-Column Section: Prioritized Gaps & Trajectory History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Ranked Priority Gaps List (7 cols) */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Rule-Based Gap Prioritization
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                Ranked Skill Deficits
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
              priority = gap × imp × rel
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Prioritized by mathematical urgency based on hand-authored industry importance weights and target career relevance.
          </p>

          <PriorityGapList 
            gaps={gaps} 
            onLaunchMissionForSkill={handleLaunchMissionForSkill} 
          />
        </div>

        {/* Right Column: Readiness Score History & Quick Evidence (5 cols) */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
          
          {/* Readiness Trajectory Card */}
          <div className="glass-panel rounded-3xl p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Score Trajectory
              </span>
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Historical Growth
              </span>
            </div>
            <h3 className="text-base font-bold text-white">
              Readiness Over Time
            </h3>
            <ReadinessTrendChart history={readinessHistory} />
          </div>

          {/* Submission History Summary Card */}
          <div className="glass-panel rounded-3xl p-6 space-y-4 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Evidence Audit Trail
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                {submissions.length} Evaluated
              </span>
            </div>
            <h3 className="text-base font-bold text-white">
              Recent Verified Submissions
            </h3>

            {submissions.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-950/40 border border-slate-800 text-center text-xs text-slate-400">
                <FolderGit2 className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                No mission submissions yet. Launch your first mission above!
              </div>
            ) : (
              <div className="space-y-2">
                {submissions.slice(0, 3).map((sub) => (
                  <div 
                    key={sub.id} 
                    className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5 max-w-[70%]">
                      <p className="font-bold text-white truncate">
                        {sub.mission?.title || 'Hands-on Mission'}
                      </p>
                      <span className="text-[11px] font-mono text-slate-500 truncate block">
                        {sub.submissionUrl}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-400 block">
                        +{sub.scoreDelta} PTS
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(sub.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Mission Submission Modal */}
      {selectedMissionForModal && (
        <MissionSubmissionModal 
          mission={selectedMissionForModal} 
          onClose={() => setSelectedMissionForModal(null)} 
        />
      )}

    </div>
  );
}
