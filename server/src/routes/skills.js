const express = require('express');
const prisma = require('../db');
const { requireAuth } = require('../middleware/auth');
const { calculateGaps, calculateReadinessScore, safeJsonParse } = require('../services/skillEngine');

const router = express.Router();

/**
 * GET /api/skills/graph
 * Fetch student's skill graph and gap ranking
 */
router.get('/graph', requireAuth, async (req, res, next) => {
  try {
    if (req.user.role !== 'STUDENT') {
      return res.status(400).json({ error: 'Only student accounts have a skill graph.' });
    }

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: req.user.id },
      include: {
        targetRole: true,
        skillGraphs: true
      }
    });

    if (!profile) {
      return res.status(404).json({ error: 'Student profile not found.' });
    }

    const roleRequirements = profile.targetRole ? safeJsonParse(profile.targetRole.skillRequirements, []) : [];
    const gaps = calculateGaps(profile.skillGraphs, roleRequirements);
    const readiness = calculateReadinessScore(profile.skillGraphs, roleRequirements);

    res.json({
      skillGraphs: profile.skillGraphs,
      roleRequirements,
      gaps,
      readiness
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/skills/drill-reward
 * Rewards points from completing an interactive Skill Defense scenario drill
 */
router.post('/drill-reward', requireAuth, async (req, res, next) => {
  try {
    if (req.user.role !== 'STUDENT' || !req.user.profile) {
      return res.status(403).json({ error: 'Only students can earn drill rewards.' });
    }

    const { skillName, pointsEarned = 10, drillTitle } = req.body;
    if (!skillName) {
      return res.status(400).json({ error: 'skillName is required.' });
    }

    const studentProfileId = req.user.profile.id;
    const existingSkill = await prisma.skillGraph.findUnique({
      where: {
        studentProfileId_skillName: {
          studentProfileId,
          skillName
        }
      }
    });

    const previousScore = existingSkill ? existingSkill.currentScore : 0;
    const newScore = Math.min(100, previousScore + Number(pointsEarned));

    const updatedSkill = await prisma.skillGraph.upsert({
      where: {
        studentProfileId_skillName: {
          studentProfileId,
          skillName
        }
      },
      update: {
        currentScore: newScore,
        lastEvidence: `Skill Defense Drill: "${drillTitle || 'Rapid Technical Challenge'}" (+${pointsEarned} pts)`,
        lastUpdated: new Date()
      },
      create: {
        studentProfileId,
        skillName,
        currentScore: newScore,
        lastEvidence: `Skill Defense Drill: "${drillTitle || 'Rapid Technical Challenge'}" (+${pointsEarned} pts)`
      }
    });

    // Recalculate readiness
    const allSkills = await prisma.skillGraph.findMany({ where: { studentProfileId } });
    const profile = await prisma.studentProfile.findUnique({
      where: { id: studentProfileId },
      include: { targetRole: true }
    });

    const roleRequirements = profile.targetRole ? safeJsonParse(profile.targetRole.skillRequirements, []) : [];
    const readiness = calculateReadinessScore(allSkills, roleRequirements);
    const gaps = calculateGaps(allSkills, roleRequirements);

    await prisma.readinessScoreHistory.create({
      data: {
        studentProfileId,
        score: readiness.readinessScore
      }
    });

    res.json({
      message: `Skill Defense Complete! Earned +${pointsEarned} pts in ${skillName}.`,
      updatedSkill,
      previousScore,
      newScore,
      readiness,
      gaps
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
