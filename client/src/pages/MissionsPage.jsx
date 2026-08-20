import React, { useState } from 'react';
import { useSkillTwin } from '../context/SkillTwinContext';
import MissionCard from '../components/MissionCard';
import MissionSubmissionModal from '../components/MissionSubmissionModal';
import { Compass, Filter, Sparkles, CheckCircle2, Search } from 'lucide-react';

export default function MissionsPage() {
  const { missions, profile } = useSkillTwin();
  const [selectedMission, setSelectedMission] = useState(null);
  const [difficultyFilter, setDifficultyFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMissions = missions.filter((m) => {
    if (difficultyFilter !== 'ALL' && m.difficulty !== difficultyFilter) return false;
    if (statusFilter === 'COMPLETED' && !m.isCompleted) return false;
    if (statusFilter === 'ACTIVE' && m.isCompleted) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.targetSkill.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
              Hands-On Engineering Missions
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400">
              Target: <strong className="text-white">{profile?.targetRole?.name}</strong>
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Mission Command Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Close your prioritized skill gaps by submitting verifiable project codebases, container configurations, and test suites.
          </p>
        </div>

        {/* Stats Pill */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 self-start md:self-auto text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300">
            <strong className="text-white font-bold">{missions.filter(m => m.isCompleted).length}</strong> of {missions.length} Missions Completed
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search missions, skills, tools..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          
          {/* Difficulty Filter */}
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-brand-500"
          >
            <option value="ALL">All Difficulties</option>
            <option value="BEGINNER">Beginner Tier</option>
            <option value="INTERMEDIATE">Intermediate Tier</option>
            <option value="ADVANCED">Advanced Tier</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-brand-500"
          >
            <option value="ALL">All Missions</option>
            <option value="ACTIVE">Pending / Active</option>
            <option value="COMPLETED">Completed</option>
          </select>

        </div>

      </div>

      {/* Mission Grid */}
      {filteredMissions.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center text-slate-400 space-y-2">
          <Compass className="w-10 h-10 mx-auto text-slate-600 mb-2" />
          <h3 className="font-bold text-white text-base">No matching missions found</h3>
          <p className="text-xs">Try clearing search filters or selecting a different career target role.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMissions.map((mission) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              onSelectMission={(m) => setSelectedMission(m)}
            />
          ))}
        </div>
      )}

      {/* Submission Modal */}
      {selectedMission && (
        <MissionSubmissionModal
          mission={selectedMission}
          onClose={() => setSelectedMission(null)}
        />
      )}

    </div>
  );
}
