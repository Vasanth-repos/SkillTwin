import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import confetti from 'canvas-confetti';

const SkillTwinContext = createContext(null);

export function SkillTwinProvider({ children }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [skillGraphs, setSkillGraphs] = useState([]);
  const [gaps, setGaps] = useState([]);
  const [readiness, setReadiness] = useState({ readinessScore: 0, skillCount: 0, fulfilledSkillsCount: 0 });
  const [readinessHistory, setReadinessHistory] = useState([]);
  const [roles, setRoles] = useState([]);
  const [missions, setMissions] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all target roles
  const fetchRoles = useCallback(async () => {
    try {
      const res = await api.get('/roles');
      setRoles(res.data.roles || []);
    } catch (err) {
      console.error('Failed to fetch target roles:', err);
    }
  }, []);

  // Fetch student digital twin state
  const fetchTwinState = useCallback(async () => {
    if (!user || user.role !== 'STUDENT') return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/profile/me');
      if (res.data.profile) {
        setProfile(res.data.profile);
        setSkillGraphs(res.data.profile.skillGraphs || []);
        setGaps(res.data.gaps || []);
        setReadiness(res.data.readiness || { readinessScore: 0 });
        setReadinessHistory(res.data.profile.readinessHistory || []);
        setSubmissions(res.data.profile.submissions || []);
      }
    } catch (err) {
      console.error('Failed to fetch digital twin state:', err);
      setError('Could not load student digital twin.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch mission catalog
  const fetchMissions = useCallback(async (params = {}) => {
    if (!user) return;
    try {
      const res = await api.get('/missions', { params });
      setMissions(res.data.missions || []);
    } catch (err) {
      console.error('Failed to fetch missions:', err);
    }
  }, [user]);

  // Initial load when user changes
  useEffect(() => {
    fetchRoles();
    if (user && user.role === 'STUDENT') {
      fetchTwinState();
      fetchMissions();
    }
  }, [user, fetchRoles, fetchTwinState, fetchMissions]);

  // Update profile and recompute skill twin
  const updateProfile = async (formData) => {
    setLoading(true);
    try {
      const res = await api.put('/profile/me', formData);
      setProfile(res.data.profile);
      setSkillGraphs(res.data.profile.skillGraphs || []);
      setGaps(res.data.gaps || []);
      setReadiness(res.data.readiness || { readinessScore: 0 });
      setReadinessHistory(res.data.profile.readinessHistory || []);
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to update profile.';
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Switch target career role
  const switchTargetRole = async (targetRoleId) => {
    return updateProfile({ targetRoleId });
  };

  // Submit mission evidence and evaluate rubric
  const submitMissionEvidence = async (missionId, submissionUrl, customFilesList = null) => {
    try {
      const res = await api.post(`/missions/${missionId}/submit`, {
        submissionUrl,
        customFilesList
      });

      const { evaluation, updatedSkill, readiness: newReadiness, gaps: newGaps, readinessHistory: newHistory, submission } = res.data;

      // Update local twin state
      setSkillGraphs(prev => {
        const index = prev.findIndex(s => s.skillName === updatedSkill.skillName);
        if (index !== -1) {
          const clone = [...prev];
          clone[index] = updatedSkill;
          return clone;
        }
        return [...prev, updatedSkill];
      });

      if (newReadiness) setReadiness(newReadiness);
      if (newGaps) setGaps(newGaps);
      if (newHistory) setReadinessHistory(newHistory);
      if (submission) setSubmissions(prev => [submission, ...prev]);

      // Trigger celebratory confetti if score delta was achieved!
      if (evaluation.scoreDelta > 0) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      // Refresh missions list to update completed status
      fetchMissions();

      return res.data;
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to evaluate mission submission.';
      throw new Error(msg);
    }
  };

  const value = {
    profile,
    skillGraphs,
    gaps,
    readiness,
    readinessHistory,
    roles,
    missions,
    submissions,
    loading,
    error,
    fetchTwinState,
    fetchMissions,
    updateProfile,
    switchTargetRole,
    submitMissionEvidence
  };

  return <SkillTwinContext.Provider value={value}>{children}</SkillTwinContext.Provider>;
}

export function useSkillTwin() {
  const context = useContext(SkillTwinContext);
  if (!context) {
    throw new Error('useSkillTwin must be used within a SkillTwinProvider');
  }
  return context;
}
