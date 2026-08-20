const test = require('node:test');
const assert = require('node:assert');
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

test('E2E Verification: Complete Student, Admin, Drill, and Direct Code Evaluation Loop', async () => {
  // 1. Health check
  const healthRes = await axios.get(`${BASE_URL}/health`);
  assert.strictEqual(healthRes.data.status, 'healthy');

  // 2. 1-Click Login as Alex Chen
  const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
    email: 'student@skilltwin.dev',
    password: 'password123'
  });
  assert.ok(loginRes.data.token, 'Token should be returned');
  const alexToken = loginRes.data.token;
  const authHeaders = { headers: { Authorization: `Bearer ${alexToken}` } };

  // 3. Fetch Digital Twin Profile
  const twinRes = await axios.get(`${BASE_URL}/profile/me`, authHeaders);
  assert.ok(twinRes.data.profile, 'Profile should exist');
  assert.strictEqual(twinRes.data.profile.targetRole.name, 'Backend Software Engineer');

  // 4. Test Skill Defense Rapid Technical Drill Reward (+10 pts)
  const drillRes = await axios.post(`${BASE_URL}/skills/drill-reward`, {
    skillName: 'System Design & Concurrency',
    pointsEarned: 10,
    drillTitle: 'Distributed Systems & Caching Challenge'
  }, authHeaders);
  assert.ok(drillRes.data.updatedSkill);
  assert.strictEqual(drillRes.data.updatedSkill.skillName, 'System Design & Concurrency');
  assert.ok(drillRes.data.newScore >= drillRes.data.previousScore);

  // 5. Test Direct In-Modal Code Evaluation
  const missionsRes = await axios.get(`${BASE_URL}/missions`, authHeaders);
  const dockerMission = missionsRes.data.missions.find(m => m.targetSkill === 'Docker & Containerization');
  assert.ok(dockerMission);

  const directCodeRes = await axios.post(`${BASE_URL}/missions/${dockerMission.id}/submit`, {
    directCodeFiles: {
      'Dockerfile': 'FROM node:20-alpine\nWORKDIR /app\nCOPY . .\nCMD ["node", "index.js"]',
      'docker-compose.yml': 'version: "3.8"\nservices:\n  web:\n    build: .',
      'tests/app.test.js': 'test("ok", () => {})',
      'README.md': '# Docker Service'
    }
  }, authHeaders);
  assert.ok(directCodeRes.data.evaluation);
  assert.strictEqual(directCodeRes.data.evaluation.allPassed, true);
  assert.strictEqual(directCodeRes.data.evaluation.inspectionSource, 'Live In-Browser Code & Artifact Evaluation');

  // 6. Test Admin Login & Faculty Assignment
  const adminLoginRes = await axios.post(`${BASE_URL}/auth/login`, {
    email: 'admin@skilltwin.dev',
    password: 'password123'
  });
  const adminToken = adminLoginRes.data.token;
  const adminHeaders = { headers: { Authorization: `Bearer ${adminToken}` } };

  const assignRes = await axios.post(`${BASE_URL}/admin/assign-mission`, {
    studentProfileId: twinRes.data.profile.id,
    missionId: dockerMission.id,
    facultyNote: 'Please complete before campus placement interviews on Friday.',
    deadline: 'Friday 5:00 PM'
  }, adminHeaders);
  assert.ok(assignRes.data.assignment);
  assert.strictEqual(assignRes.data.assignment.status, 'PENDING');

  // 7. Verify student sees faculty assignment in profile/me
  const refreshedTwin = await axios.get(`${BASE_URL}/profile/me`, authHeaders);
  assert.ok(refreshedTwin.data.profile.facultyAssignments.length >= 1);
  assert.strictEqual(refreshedTwin.data.profile.facultyAssignments[0].mission.id, dockerMission.id);
});
