/**
 * Client-Side Simulator Engine for instant Multi-Role What-If Calculations
 */

export function calculateReadinessScore(skillGraphs = [], roleRequirements = []) {
  if (!roleRequirements || roleRequirements.length === 0) {
    return { readinessScore: 0, skillCount: 0, fulfilledSkillsCount: 0 };
  }

  const currentScoresMap = {};
  for (const sg of skillGraphs) {
    currentScoresMap[sg.skillName] = sg.currentScore;
  }

  let totalWeightedFulfillment = 0;
  let totalWeight = 0;
  let fulfilledCount = 0;

  for (const req of roleRequirements) {
    const required = Number(req.requiredPercentage) || 80;
    const current = currentScoresMap[req.skillName] || 0;
    const weight = (Number(req.importanceWeight) || 1.0) * (Number(req.relevanceWeight) || 1.0);

    const fulfillmentRatio = Math.min(1.0, current / required);
    if (current >= required) {
      fulfilledCount += 1;
    }

    totalWeightedFulfillment += fulfillmentRatio * weight;
    totalWeight += weight;
  }

  const rawScore = totalWeight > 0 ? (totalWeightedFulfillment / totalWeight) * 100 : 0;
  const readinessScore = Math.min(100, Math.max(0, Math.round(rawScore)));

  return {
    readinessScore,
    skillCount: roleRequirements.length,
    fulfilledSkillsCount: fulfilledCount
  };
}

export function calculateGaps(skillGraphs = [], roleRequirements = []) {
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
    const priorityScore = Math.round(gap * importanceWeight * relevanceWeight * 10) / 10;

    gaps.push({
      skillName,
      currentScore,
      requiredScore,
      gap,
      importanceWeight,
      relevanceWeight,
      priorityScore
    });
  }

  gaps.sort((a, b) => b.priorityScore - a.priorityScore);
  return gaps;
}
