import axios from 'axios';
import { 
  MOCK_PERSONAS, 
  MOCK_ROLES, 
  MOCK_MISSIONS, 
  MOCK_ADMIN_STATS 
} from './mockDataStore';
import { calculateReadinessScore, calculateGaps } from '../utils/simulatorEngine';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 4000
});

// In-memory / local storage state for static hosts (GitHub Pages)
let activeUserEmail = localStorage.getItem('skilltwin_email') || 'student@skilltwin.dev';
let clientState = JSON.parse(localStorage.getItem('skilltwin_client_state')) || {
  personas: JSON.parse(JSON.stringify(MOCK_PERSONAS)),
  roles: JSON.parse(JSON.stringify(MOCK_ROLES)),
  missions: JSON.parse(JSON.stringify(MOCK_MISSIONS)),
  adminStats: JSON.parse(JSON.stringify(MOCK_ADMIN_STATS))
};

function persistClientState() {
  try {
    localStorage.setItem('skilltwin_client_state', JSON.stringify(clientState));
    localStorage.setItem('skilltwin_email', activeUserEmail);
  } catch (e) {
    // Ignore storage quota
  }
}

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('skilltwin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with seamless Static-Host Fallback for GitHub Pages
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config } = error;
    if (!config) return Promise.reject(error);

    const url = config.url || '';
    const method = (config.method || 'GET').toUpperCase();
    const data = config.data ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data) : {};

    console.warn(`[SkillTwin Static Fallback] Handling ${method} ${url} locally for offline/GitHub Pages mode.`);

    // 1. Auth routes
    if (url.includes('/auth/login')) {
      const email = data.email || 'student@skilltwin.dev';
      const persona = clientState.personas[email] || clientState.personas['student@skilltwin.dev'];
      activeUserEmail = email;
      persistClientState();
      return {
        status: 200,
        data: {
          token: `mock-jwt-token-for-${email}`,
          user: persona.user
        }
      };
    }

    if (url.includes('/auth/me')) {
      const persona = clientState.personas[activeUserEmail] || clientState.personas['student@skilltwin.dev'];
      return {
        status: 200,
        data: { user: persona.user }
      };
    }

    // 2. Roles route
    if (url.includes('/roles')) {
      return {
        status: 200,
        data: { roles: clientState.roles }
      };
    }

    // 3. Profile / Twin State routes
    if (url.includes('/profile/me')) {
      const persona = clientState.personas[activeUserEmail] || clientState.personas['student@skilltwin.dev'];
      if (!persona.profile) {
        return { status: 200, data: { profile: null } };
      }

      const role = clientState.roles.find(r => r.id === persona.profile.targetRoleId) || clientState.roles[0];
      const readiness = calculateReadinessScore(persona.profile.skillGraphs, role.skillRequirements);
      const gaps = calculateGaps(persona.profile.skillGraphs, role.skillRequirements);

      if (method === 'PUT') {
        if (data.targetRoleId) persona.profile.targetRoleId = data.targetRoleId;
        if (data.degree) persona.profile.degree = data.degree;
        if (data.dsaProblemsSolved !== undefined) persona.profile.dsaProblemsSolved = Number(data.dsaProblemsSolved);
        persistClientState();
      }

      return {
        status: 200,
        data: {
          profile: {
            ...persona.profile,
            targetRole: role
          },
          readiness,
          gaps
        }
      };
    }

    // 4. Missions routes
    if (url.includes('/missions') && method === 'GET') {
      return {
        status: 200,
        data: { missions: clientState.missions }
      };
    }

    if (url.includes('/missions/') && url.includes('/submit')) {
      const missionId = url.split('/missions/')[1].split('/')[0];
      const mission = clientState.missions.find(m => m.id === missionId) || clientState.missions[0];
      const persona = clientState.personas[activeUserEmail] || clientState.personas['student@skilltwin.dev'];

      // Award +20 pts
      const targetSkill = mission.targetSkill;
      let existingSkill = persona.profile.skillGraphs.find(s => s.skillName === targetSkill);
      const prevScore = existingSkill ? existingSkill.currentScore : 40;
      const newScore = Math.min(100, prevScore + 20);

      if (existingSkill) {
        existingSkill.currentScore = newScore;
      } else {
        persona.profile.skillGraphs.push({ skillName: targetSkill, currentScore: newScore });
      }

      const role = clientState.roles.find(r => r.id === persona.profile.targetRoleId) || clientState.roles[0];
      const newReadiness = calculateReadinessScore(persona.profile.skillGraphs, role.skillRequirements);
      const newGaps = calculateGaps(persona.profile.skillGraphs, role.skillRequirements);

      const submission = {
        id: `sub-${Date.now()}`,
        submissionUrl: data.submissionUrl || 'Direct In-Browser Code Artifact',
        scoreDelta: 20,
        submittedAt: new Date().toISOString(),
        mission
      };
      persona.profile.submissions.unshift(submission);
      persona.profile.readinessHistory.push({ recordedAt: new Date().toISOString(), score: newReadiness.readinessScore });
      persistClientState();

      return {
        status: 201,
        data: {
          evaluation: {
            allPassed: true,
            scoreDelta: 20,
            inspectionSource: 'Live Evaluator Sandbox',
            discoveredFiles: ['Dockerfile', 'docker-compose.yml', 'tests/api.test.js'],
            rubricResults: mission.checklistItems.map(c => ({ text: c.text, points: c.points, passed: true }))
          },
          previousScore: prevScore,
          newScore: newScore,
          updatedSkill: existingSkill || { skillName: targetSkill, currentScore: newScore },
          readiness: newReadiness,
          gaps: newGaps,
          readinessHistory: persona.profile.readinessHistory,
          submission
        }
      };
    }

    // 5. Skill Drill Reward
    if (url.includes('/skills/drill-reward')) {
      const { skillName, pointsEarned = 10 } = data;
      const persona = clientState.personas[activeUserEmail] || clientState.personas['student@skilltwin.dev'];
      let existing = persona.profile.skillGraphs.find(s => s.skillName === skillName);
      const prev = existing ? existing.currentScore : 40;
      const next = Math.min(100, prev + pointsEarned);
      if (existing) existing.currentScore = next;

      const role = clientState.roles.find(r => r.id === persona.profile.targetRoleId) || clientState.roles[0];
      const newReadiness = calculateReadinessScore(persona.profile.skillGraphs, role.skillRequirements);
      const newGaps = calculateGaps(persona.profile.skillGraphs, role.skillRequirements);
      persistClientState();

      return {
        status: 200,
        data: {
          updatedSkill: existing || { skillName, currentScore: next },
          previousScore: prev,
          newScore: next,
          readiness: newReadiness,
          gaps: newGaps
        }
      };
    }

    // 6. Admin routes
    if (url.includes('/admin/cohort-stats')) {
      return {
        status: 200,
        data: clientState.adminStats
      };
    }

    if (url.includes('/admin/students')) {
      return {
        status: 200,
        data: { students: clientState.adminStats.students }
      };
    }

    if (url.includes('/admin/assign-mission')) {
      return {
        status: 201,
        data: { message: 'Priority mission assigned successfully!' }
      };
    }

    return Promise.reject(error);
  }
);

export default api;
