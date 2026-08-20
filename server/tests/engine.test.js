const test = require('node:test');
const assert = require('node:assert');
const { computeSkillScoresFromProfile, calculateGaps, calculateReadinessScore } = require('../src/services/skillEngine');
const { evaluateMissionSubmission } = require('../src/services/rubricEvaluator');

test('SkillEngine: calculateGaps correctly ranks gaps by priority_score = gap * importance * relevance', () => {
  const mockSkillGraphs = [
    { skillName: 'Relational Databases & SQL', currentScore: 40 },
    { skillName: 'REST APIs', currentScore: 80 },
    { skillName: 'Docker & Containerization', currentScore: 20 }
  ];

  const mockRoleRequirements = [
    { skillName: 'Relational Databases & SQL', requiredPercentage: 90, importanceWeight: 1.8, relevanceWeight: 1.8 }, // gap: 50, priority: 50*1.8*1.8 = 162
    { skillName: 'REST APIs', requiredPercentage: 85, importanceWeight: 1.5, relevanceWeight: 1.5 },                 // gap: 5, priority: 5*1.5*1.5 = 11.25
    { skillName: 'Docker & Containerization', requiredPercentage: 70, importanceWeight: 1.4, relevanceWeight: 1.4 }   // gap: 50, priority: 50*1.4*1.4 = 98
  ];

  const gaps = calculateGaps(mockSkillGraphs, mockRoleRequirements);

  assert.strictEqual(gaps.length, 3);
  assert.strictEqual(gaps[0].skillName, 'Relational Databases & SQL', 'Highest priority gap should be SQL');
  assert.strictEqual(gaps[1].skillName, 'Docker & Containerization');
  assert.strictEqual(gaps[2].skillName, 'REST APIs');
  assert.strictEqual(gaps[0].urgency, 'CRITICAL');
});

test('SkillEngine: calculateReadinessScore returns normalized weighted percentage', () => {
  const mockSkillGraphs = [
    { skillName: 'Skill A', currentScore: 80 },
    { skillName: 'Skill B', currentScore: 40 }
  ];

  const mockRoleRequirements = [
    { skillName: 'Skill A', requiredPercentage: 80, importanceWeight: 1.0, relevanceWeight: 1.0 }, // fulfillment: 1.0, weight: 1.0
    { skillName: 'Skill B', requiredPercentage: 80, importanceWeight: 1.0, relevanceWeight: 1.0 }  // fulfillment: 0.5, weight: 1.0
  ];

  const readiness = calculateReadinessScore(mockSkillGraphs, mockRoleRequirements);
  // (1.0*1.0 + 0.5*1.0) / 2.0 = 1.5 / 2.0 = 75%
  assert.strictEqual(readiness.readinessScore, 75);
  assert.strictEqual(readiness.fulfilledSkillsCount, 1);
});

test('SkillEngine: computeSkillScoresFromProfile extracts deterministic evidence', () => {
  const profile = {
    academicSubjects: JSON.stringify(['Database Management Systems', 'Algorithms']),
    languages: JSON.stringify(['Java', 'SQL']),
    dsaProblemsSolved: 250,
    projects: JSON.stringify([
      { title: 'Campus Database', techStack: ['SQL', 'Relational Databases & SQL'], complexity: 'INTERMEDIATE', repoUrl: 'https://github.com/test' }
    ]),
    certifications: JSON.stringify(['AWS Cloud']),
    githubUrl: 'https://github.com/user'
  };

  const roleReqs = [
    { skillName: 'Relational Databases & SQL', requiredPercentage: 90 },
    { skillName: 'Data Structures & Algorithms', requiredPercentage: 80 }
  ];

  const computedSkills = computeSkillScoresFromProfile(profile, roleReqs);
  const sqlSkill = computedSkills.find(s => s.skillName === 'Relational Databases & SQL');
  const dsaSkill = computedSkills.find(s => s.skillName === 'Data Structures & Algorithms');

  assert.ok(sqlSkill.currentScore >= 40, 'SQL skill should have evidence points from courses, language, and project');
  assert.ok(dsaSkill.currentScore >= 70, 'DSA skill should reflect 250 solved problems');
});

test('RubricEvaluator: checks checklist patterns and calculates score delta', async () => {
  const mission = {
    targetSkill: 'Docker & Containerization',
    title: 'Containerize an API',
    difficulty: 'INTERMEDIATE',
    checklistItems: JSON.stringify([
      { id: '1', text: 'Dockerfile present', points: 30, rulePattern: 'dockerfile' },
      { id: '2', text: 'docker-compose.yml present', points: 30, rulePattern: 'docker-compose' },
      { id: '3', text: 'README present', points: 40, rulePattern: 'readme' }
    ]),
    expectedFiles: JSON.stringify(['Dockerfile', 'docker-compose.yml', 'README.md'])
  };

  const result = await evaluateMissionSubmission(mission, 'https://github.com/demo/docker-api');
  assert.strictEqual(result.allPassed, true);
  assert.ok(result.scoreDelta >= 15);
  assert.strictEqual(result.rubricResults.length, 3);
});
