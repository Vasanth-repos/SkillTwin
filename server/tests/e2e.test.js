const test = require('node:test');
const assert = require('node:assert');
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

test('E2E Verification: Complete Student & Admin Core Loop', async () => {
  // 1. Health check
  const healthRes = await axios.get(`${BASE_URL}/health`);
  assert.strictEqual(healthRes.data.status, 'healthy');

  // 2. 1-Click Login as Alex Chen
  const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
    email: 'student@skilltwin.dev',
    password: 'password123'
  });
  assert.ok(loginRes.data.token, 'Token should be returned');
  assert.strictEqual(loginRes.data.user.email, 'student@skilltwin.dev');
  const alexToken = loginRes.data.token;

  const authHeaders = { headers: { Authorization: `Bearer ${alexToken}` } };

  // 3. Fetch Digital Twin Profile
  const twinRes = await axios.get(`${BASE_URL}/profile/me`, authHeaders);
  assert.ok(twinRes.data.profile, 'Profile should exist');
  assert.strictEqual(twinRes.data.profile.targetRole.name, 'Backend Software Engineer');
  assert.ok(twinRes.data.gaps.length > 0, 'Should have prioritized gaps');
  assert.strictEqual(twinRes.data.gaps[0].urgency, 'CRITICAL', 'Top gap should be critical');

  // 4. Fetch Missions
  const missionsRes = await axios.get(`${BASE_URL}/missions`, authHeaders);
  assert.ok(missionsRes.data.missions.length >= 4, 'Should have missions available');
  const dockerMission = missionsRes.data.missions.find(m => m.targetSkill === 'Docker & Containerization');
  assert.ok(dockerMission, 'Docker mission should exist');

  // 5. Submit Evidence & Run Rubric Evaluator
  const submitRes = await axios.post(`${BASE_URL}/missions/${dockerMission.id}/submit`, {
    submissionUrl: 'https://github.com/alexchen/verified-docker-solution'
  }, authHeaders);

  assert.ok(submitRes.data.evaluation, 'Evaluation should be returned');
  assert.strictEqual(submitRes.data.evaluation.allPassed, true, 'All checklist items should pass');
  assert.ok(submitRes.data.evaluation.scoreDelta >= 15, 'Should earn positive score delta');
  assert.ok(submitRes.data.newScore > submitRes.data.previousScore, 'Skill score should increase');

  // 6. Login as Admin Prof. Davis
  const adminLoginRes = await axios.post(`${BASE_URL}/auth/login`, {
    email: 'admin@skilltwin.dev',
    password: 'password123'
  });
  const adminToken = adminLoginRes.data.token;
  const adminHeaders = { headers: { Authorization: `Bearer ${adminToken}` } };

  // 7. Fetch Cohort Telemetry
  const statsRes = await axios.get(`${BASE_URL}/admin/cohort-stats`, adminHeaders);
  assert.ok(statsRes.data.totalStudents >= 3, 'Cohort should have students');
  assert.ok(statsRes.data.avgCohortReadiness > 0, 'Average readiness should be calculated');
  assert.ok(statsRes.data.institutionalSkillGaps.length > 0, 'Institutional heatmap should be computed');

  // 8. Fetch Student Roster & Inspect Alex Chen
  const rosterRes = await axios.get(`${BASE_URL}/admin/students`, adminHeaders);
  assert.ok(rosterRes.data.students.length >= 3);
  const alexSummary = rosterRes.data.students.find(s => s.email === 'student@skilltwin.dev');
  assert.ok(alexSummary);

  const drilldownRes = await axios.get(`${BASE_URL}/admin/students/${alexSummary.id}`, adminHeaders);
  assert.ok(drilldownRes.data.student);
  assert.ok(drilldownRes.data.student.submissions.length >= 1, 'Should reflect completed mission in admin drilldown');
});
