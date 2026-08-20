const express = require('express');
const prisma = require('../db');
const { requireAuth } = require('../middleware/auth');
const { evaluateMissionSubmission } = require('../services/rubricEvaluator');
const { calculateReadinessScore, calculateGaps, safeJsonParse } = require('../services/skillEngine');

const router = express.Router();

/**
 * GET /api/missions
 * List available missions, with student completion status
 */
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const { roleId, skill, difficulty } = req.query;

    const where = {};
    if (roleId) where.relatedRoleId = roleId;
    if (skill) where.targetSkill = skill;
    if (difficulty) where.difficulty = difficulty.toUpperCase();

    const missions = await prisma.mission.findMany({
      where,
      include: {
        relatedRole: true
      },
      orderBy: { createdAt: 'asc' }
    });

    let completedMissionIds = new Set();

    if (req.user.role === 'STUDENT' && req.user.profile) {
      const studentSubmissions = await prisma.missionSubmission.findMany({
        where: {
          studentProfileId: req.user.profile.id,
          status: 'EVALUATED'
        },
        select: { missionId: true }
      });
      completedMissionIds = new Set(studentSubmissions.map(s => s.missionId));
    }

    const formattedMissions = missions.map(m => ({
      ...m,
      checklistItems: safeJsonParse(m.checklistItems, []),
      expectedFiles: safeJsonParse(m.expectedFiles, []),
      isCompleted: completedMissionIds.has(m.id)
    }));

    res.json({ missions: formattedMissions });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/missions/:id
 * Retrieve mission details and checklist rubric
 */
router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const mission = await prisma.mission.findUnique({
      where: { id: req.params.id },
      include: {
        relatedRole: true
      }
    });

    if (!mission) {
      return res.status(404).json({ error: 'Mission not found.' });
    }

    res.json({
      mission: {
        ...mission,
        checklistItems: safeJsonParse(mission.checklistItems, []),
        expectedFiles: safeJsonParse(mission.expectedFiles, [])
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/missions/:id/submit
 * Evaluates repository evidence against mission rubric and updates digital twin skill graph
 */
router.post('/:id/submit', requireAuth, async (req, res, next) => {
  try {
    if (req.user.role !== 'STUDENT') {
      return res.status(403).json({ error: 'Only student accounts can submit mission evidence.' });
    }

    const { submissionUrl, customFilesList, directCodeFiles } = req.body;

    if ((!submissionUrl || submissionUrl.trim() === '') && !directCodeFiles) {
      return res.status(400).json({ error: 'Please provide a valid repository URL or direct code artifacts.' });
    }

    const effectiveUrl = submissionUrl && submissionUrl.trim() !== '' ? submissionUrl.trim() : 'Direct In-Browser Code Artifact';

    const mission = await prisma.mission.findUnique({
      where: { id: req.params.id },
      include: { relatedRole: true }
    });

    if (!mission) {
      return res.status(404).json({ error: 'Mission not found.' });
    }

    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: req.user.id },
      include: {
        targetRole: true,
        skillGraphs: true
      }
    });

    if (!studentProfile) {
      return res.status(404).json({ error: 'Student profile not found.' });
    }

    // 1. Run deterministic rubric evaluation
    const evaluation = await evaluateMissionSubmission(mission, effectiveUrl, customFilesList, directCodeFiles);

    // 2. Save submission log
    const submissionRecord = await prisma.missionSubmission.create({
      data: {
        missionId: mission.id,
        studentProfileId: studentProfile.id,
        submissionUrl: effectiveUrl,
        status: 'EVALUATED',
        rubricResults: JSON.stringify(evaluation.rubricResults),
        scoreDelta: evaluation.scoreDelta,
        submittedAt: new Date(),
        evaluatedAt: new Date()
      }
    });

    // 3. Update Skill Graph for target skill
    const existingSkill = await prisma.skillGraph.findUnique({
      where: {
        studentProfileId_skillName: {
          studentProfileId: studentProfile.id,
          skillName: mission.targetSkill
        }
      }
    });

    const previousScore = existingSkill ? existingSkill.currentScore : 0;
    const newScore = Math.min(100, previousScore + evaluation.scoreDelta);

    const updatedSkill = await prisma.skillGraph.upsert({
      where: {
        studentProfileId_skillName: {
          studentProfileId: studentProfile.id,
          skillName: mission.targetSkill
        }
      },
      update: {
        currentScore: newScore,
        lastEvidence: `Completed Mission: "${mission.title}" (+${evaluation.scoreDelta} pts from verified repository)`,
        lastUpdated: new Date()
      },
      create: {
        studentProfileId: studentProfile.id,
        skillName: mission.targetSkill,
        currentScore: newScore,
        lastEvidence: `Completed Mission: "${mission.title}" (+${evaluation.scoreDelta} pts from verified repository)`
      }
    });

    // 4. Recalculate Career Readiness Score
    const allSkills = await prisma.skillGraph.findMany({
      where: { studentProfileId: studentProfile.id }
    });

    const roleRequirements = studentProfile.targetRole ? safeJsonParse(studentProfile.targetRole.skillRequirements, []) : [];
    const readiness = calculateReadinessScore(allSkills, roleRequirements);
    const gaps = calculateGaps(allSkills, roleRequirements);

    // 5. Append to Readiness History
    await prisma.readinessScoreHistory.create({
      data: {
        studentProfileId: studentProfile.id,
        score: readiness.readinessScore
      }
    });

    const readinessHistory = await prisma.readinessScoreHistory.findMany({
      where: { studentProfileId: studentProfile.id },
      orderBy: { computedAt: 'asc' }
    });

    res.status(201).json({
      message: evaluation.scoreDelta > 0 
        ? `Mission evaluated successfully! Earned +${evaluation.scoreDelta} points in ${mission.targetSkill}.`
        : `Mission evaluated. Review the rubric feedback below to earn skill points.`,
      submission: {
        ...submissionRecord,
        rubricResults: evaluation.rubricResults
      },
      evaluation,
      updatedSkill,
      previousScore,
      newScore,
      readiness,
      gaps,
      readinessHistory
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/missions/history/me
 * Retrieve submission and evaluation history for current student
 */
router.get('/history/me', requireAuth, async (req, res, next) => {
  try {
    if (req.user.role !== 'STUDENT' || !req.user.profile) {
      return res.json({ submissions: [] });
    }

    const submissions = await prisma.missionSubmission.findMany({
      where: { studentProfileId: req.user.profile.id },
      include: { mission: true },
      orderBy: { submittedAt: 'desc' }
    });

    const formatted = submissions.map(s => ({
      ...s,
      rubricResults: safeJsonParse(s.rubricResults, []),
      mission: s.mission ? {
        ...s.mission,
        checklistItems: safeJsonParse(s.mission.checklistItems, []),
        expectedFiles: safeJsonParse(s.mission.expectedFiles, [])
      } : null
    }));

    res.json({ submissions: formatted });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
