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

module.exports = router;
