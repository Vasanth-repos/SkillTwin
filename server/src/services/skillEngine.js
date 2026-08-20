/**
 * SkillTwin Deterministic Skill Graph & Gap Engine
 * 
 * Implements transparent arithmetic heuristics for:
 * 1. Initial skill graph computation from student profile evidence
 * 2. Role gap prioritization: priority_score = gap * importance_weight * relevance_weight
 * 3. Overall career readiness score computation
 */

/**
 * Maps raw profile evidence into 0-100 skill scores using clear heuristics.
 * @param {Object} profile - StudentProfile entity
 * @param {Array} requiredSkills - TargetRole skill requirements
 * @returns {Array} Array of { skillName, currentScore, lastEvidence }
 */
function computeSkillScoresFromProfile(profile, requiredSkills = []) {
  const academicSubjects = safeJsonParse(profile.academicSubjects, []);
  const languages = safeJsonParse(profile.languages, []);
  const projects = safeJsonParse(profile.projects, []);
  const certifications = safeJsonParse(profile.certifications, []);
  const dsaCount = Number(profile.dsaProblemsSolved) || 0;

  // Set of all skills to evaluate (target role requirements + common baseline)
  const skillNames = new Set([
    ...requiredSkills.map(r => r.skillName),
    'Data Structures & Algorithms',
    'System Design',
    'REST APIs',
    'Relational Databases',
    'Git & Version Control'
  ]);

  const skillScores = [];

  for (const skill of skillNames) {
    let score = 0;
    const evidenceList = [];

    const lowerSkill = skill.toLowerCase();

    // 1. Academic Coursework Heuristics (+15 to +25)
    for (const subject of academicSubjects) {
      const subLower = (typeof subject === 'string' ? subject : subject.name || '').toLowerCase();
      if (matchesSkillAndSubject(lowerSkill, subLower)) {
        score += 20;
        evidenceList.push(`Academic: ${subject}`);
        break;
      }
    }

    // 2. Language Match (+15 to +30)
    for (const lang of languages) {
      const langLower = (typeof lang === 'string' ? lang : lang.name || '').toLowerCase();
      if (lowerSkill.includes(langLower) || (langLower === 'javascript' && lowerSkill.includes('frontend')) || (langLower === 'python' && lowerSkill.includes('data'))) {
        score += 25;
        evidenceList.push(`Language Proficiency: ${lang}`);
      }
    }

    // 3. DSA Problems Count (Specifically for DSA skill or general problem solving)
    if (lowerSkill.includes('data structure') || lowerSkill.includes('algorithm') || lowerSkill.includes('dsa')) {
      if (dsaCount >= 400) {
        score += 90;
        evidenceList.push(`DSA: ${dsaCount}+ solved (Mastery tier)`);
      } else if (dsaCount >= 200) {
        score += 75;
        evidenceList.push(`DSA: ${dsaCount}+ solved (Advanced tier)`);
      } else if (dsaCount >= 100) {
        score += 55;
        evidenceList.push(`DSA: ${dsaCount}+ solved (Intermediate tier)`);
      } else if (dsaCount >= 30) {
        score += 35;
        evidenceList.push(`DSA: ${dsaCount}+ solved (Foundational tier)`);
      } else if (dsaCount > 0) {
        score += 15;
        evidenceList.push(`DSA: ${dsaCount} solved (Novice tier)`);
      }
    }

    // 4. Project Experience Heuristics (+15 to +35 per relevant project)
    for (const project of projects) {
      const projTitle = (project.title || '').toLowerCase();
      const projDesc = (project.description || '').toLowerCase();
      const projStack = (project.techStack || []).map(t => String(t).toLowerCase());
      const complexity = (project.complexity || 'INTERMEDIATE').toUpperCase();

      const isRelevant = projStack.some(t => lowerSkill.includes(t) || t.includes(lowerSkill)) ||
                         projTitle.includes(lowerSkill) ||
                         projDesc.includes(lowerSkill);

      if (isRelevant) {
        let projPoints = complexity === 'ADVANCED' ? 30 : complexity === 'INTERMEDIATE' ? 20 : 12;
        if (project.repoUrl) projPoints += 5; // Verified repository bonus
        score += projPoints;
        evidenceList.push(`Project: "${project.title}" (${complexity})`);
      }
    }

    // 5. Certifications (+20 to +35)
    for (const cert of certifications) {
      const certStr = (typeof cert === 'string' ? cert : cert.name || '').toLowerCase();
      if (certStr.includes(lowerSkill) || (lowerSkill.includes('cloud') && certStr.includes('aws')) || (lowerSkill.includes('docker') && certStr.includes('container'))) {
        score += 30;
        evidenceList.push(`Certification: ${cert}`);
      }
    }

    // 6. GitHub URL Baseline
    if (profile.githubUrl && profile.githubUrl.trim() !== '' && lowerSkill.includes('git')) {
      score += 25;
      evidenceList.push(`Active GitHub Profile`);
    }

    // Bound between 0 and 100
    const finalScore = Math.min(100, Math.max(0, Math.round(score)));
    const lastEvidence = evidenceList.length > 0 ? evidenceList.join('; ') : 'Self-assessment baseline';

    skillScores.push({
      skillName: skill,
      currentScore: finalScore,
      lastEvidence
    });
  }

  return skillScores;
}

/**
 * Calculates and prioritizes skill gaps for a student's active target role.
 * Formula: priority_score = gap * importance_weight * relevance_weight
 * 
 * @param {Array} skillGraphs - Current student SkillGraph records
 * @param {Array} roleRequirements - TargetRole skill requirements
 * @returns {Array} Ranked gaps from highest priority to lowest
 */
function calculateGaps(skillGraphs = [], roleRequirements = []) {
  const currentScoresMap = {};
  for (const sg of skillGraphs) {
    currentScoresMap[sg.skillName] = sg.currentScore;
  }

  const gaps = [];

  for (const req of roleRequirements) {
    const skillName = req.skillName;
    const requiredScore = Number(req.requiredPercentage) || 80;
    const currentScore = currentScoresMap[skillName] !== undefined ? currentScoresMap[skillName] : 0;
    const gap = Math.max(0, requiredScore - currentScore);

    const importanceWeight = Number(req.importanceWeight) || 1.0;
    const relevanceWeight = Number(req.relevanceWeight) || 1.0;

    // Deterministic Priority Score: gap * importance * relevance
    const priorityScore = Math.round(gap * importanceWeight * relevanceWeight * 10) / 10;

    let urgency = 'MASTERED';
    let urgencyColor = 'emerald';
    if (gap > 0) {
      if (priorityScore >= 45) {
        urgency = 'CRITICAL';
        urgencyColor = 'rose';
      } else if (priorityScore >= 20) {
        urgency = 'HIGH';
        urgencyColor = 'amber';
      } else {
        urgency = 'MODERATE';
        urgencyColor = 'blue';
      }
    }

    gaps.push({
      skillName,
      currentScore,
      requiredScore,
      gap,
      importanceWeight,
      relevanceWeight,
      priorityScore,
      urgency,
      urgencyColor,
      isMastered: gap === 0
    });
  }

  // Sort descending: highest priority gaps first
  gaps.sort((a, b) => b.priorityScore - a.priorityScore);

  return gaps;
}

/**
 * Calculates weighted Career Readiness Score (0-100%) against target role.
 * 
 * @param {Array} skillGraphs - Student's skill scores
 * @param {Array} roleRequirements - Role requirements with weights
 * @returns {Object} { readinessScore, totalRequired, totalDemonstrated, benchmarkSummary }
 */
function calculateReadinessScore(skillGraphs = [], roleRequirements = []) {
  if (!roleRequirements || roleRequirements.length === 0) {
    return { readinessScore: 0, totalRequired: 0, totalDemonstrated: 0 };
  }

  const currentScoresMap = {};
  for (const sg of skillGraphs) {
    currentScoresMap[sg.skillName] = sg.currentScore;
  }

  let totalWeightedFulfillment = 0;
  let totalWeight = 0;

  for (const req of roleRequirements) {
    const required = Number(req.requiredPercentage) || 80;
    const current = currentScoresMap[req.skillName] || 0;
    const weight = (Number(req.importanceWeight) || 1.0) * (Number(req.relevanceWeight) || 1.0);

    // Fulfillment capped at 100% per skill
    const fulfillmentRatio = Math.min(1.0, current / required);

    totalWeightedFulfillment += fulfillmentRatio * weight;
    totalWeight += weight;
  }

  const rawScore = totalWeight > 0 ? (totalWeightedFulfillment / totalWeight) * 100 : 0;
  const readinessScore = Math.min(100, Math.max(0, Math.round(rawScore)));

  return {
    readinessScore,
    skillCount: roleRequirements.length,
    fulfilledSkillsCount: roleRequirements.filter(r => (currentScoresMap[r.skillName] || 0) >= (Number(r.requiredPercentage) || 80)).length
  };
}

// Helpers
function safeJsonParse(val, fallback) {
  if (!val) return fallback;
  if (typeof val === 'object') return val;
  try {
    return JSON.parse(val);
  } catch (e) {
    return fallback;
  }
}

function matchesSkillAndSubject(skill, subject) {
  const mappings = {
    'database': ['database', 'dbms', 'sql', 'data storage'],
    'data structures': ['data structure', 'algorithm', 'dsa', 'problem solving'],
    'operating systems': ['operating system', 'os', 'linux', 'unix', 'concurrency'],
    'system design': ['distributed system', 'software engineering', 'computer architecture', 'system design'],
    'cloud': ['cloud', 'aws', 'distributed', 'virtualization'],
    'docker': ['devops', 'cloud', 'systems programming'],
    'rest apis': ['web development', 'software engineering', 'internet technologies'],
    'frontend': ['web development', 'human computer interaction', 'ui/ux', 'frontend'],
    'backend': ['backend', 'database', 'systems', 'server']
  };

  for (const [key, keywords] of Object.entries(mappings)) {
    if (skill.includes(key)) {
      if (keywords.some(k => subject.includes(k))) return true;
    }
  }
  return skill.includes(subject) || subject.includes(skill);
}

module.exports = {
  computeSkillScoresFromProfile,
  calculateGaps,
  calculateReadinessScore,
  safeJsonParse
};
