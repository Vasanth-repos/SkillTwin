const express = require('express');
const prisma = require('../db');
const { requireAuth } = require('../middleware/auth');
const { computeSkillScoresFromProfile, calculateGaps, calculateReadinessScore, safeJsonParse } = require('../services/skillEngine');

const router = express.Router();

/**
 * GET /api/profile/me
 * Retrieves current student's full digital twin state
 */
router.get('/me', requireAuth, async (req, res, next) => {
  try {
    if (req.user.role !== 'STUDENT') {
      return res.json({ profile: null, message: 'User is an administrator.' });
    }

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: req.user.id },
      include: {
        targetRole: true,
        skillGraphs: true,
        readinessHistory: {
          orderBy: { computedAt: 'asc' }
        },
        submissions: {
          include: {
            mission: true
          },
          orderBy: { submittedAt: 'desc' }
        }
      }
    });

    if (!profile) {
      return res.status(404).json({ error: 'Student profile not found.' });
    }

    const roleRequirements = profile.targetRole ? safeJsonParse(profile.targetRole.skillRequirements, []) : [];
    const gaps = calculateGaps(profile.skillGraphs, roleRequirements);
    const readiness = calculateReadinessScore(profile.skillGraphs, roleRequirements);

    res.json({
      profile: {
        ...profile,
        academicSubjects: safeJsonParse(profile.academicSubjects, []),
        languages: safeJsonParse(profile.languages, []),
        projects: safeJsonParse(profile.projects, []),
        certifications: safeJsonParse(profile.certifications, []),
        targetRole: profile.targetRole ? {
          ...profile.targetRole,
          skillRequirements: roleRequirements
        } : null,
        submissions: profile.submissions.map(s => ({
          ...s,
          rubricResults: safeJsonParse(s.rubricResults, []),
          mission: s.mission ? {
            ...s.mission,
            checklistItems: safeJsonParse(s.mission.checklistItems, []),
            expectedFiles: safeJsonParse(s.mission.expectedFiles, [])
          } : null
        }))
      },
      gaps,
      readiness
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/profile/me
 * Updates student profile details and recomputes the digital twin skill graph
 */
router.put('/me', requireAuth, async (req, res, next) => {
  try {
    if (req.user.role !== 'STUDENT') {
      return res.status(403).json({ error: 'Only student accounts can update profile details.' });
    }

    const {
      degree,
      academicSubjects,
      languages,
      dsaProblemsSolved,
      projects,
      certifications,
      githubUrl,
      targetRoleId
    } = req.body;

    const existingProfile = await prisma.studentProfile.findUnique({
      where: { userId: req.user.id }
    });

    if (!existingProfile) {
      return res.status(404).json({ error: 'Student profile not found.' });
    }

    // Update profile in DB
    const updatedProfile = await prisma.studentProfile.update({
      where: { id: existingProfile.id },
      data: {
        degree: degree !== undefined ? degree : existingProfile.degree,
        academicSubjects: academicSubjects !== undefined ? JSON.stringify(academicSubjects) : existingProfile.academicSubjects,
        languages: languages !== undefined ? JSON.stringify(languages) : existingProfile.languages,
        dsaProblemsSolved: dsaProblemsSolved !== undefined ? Number(dsaProblemsSolved) : existingProfile.dsaProblemsSolved,
        projects: projects !== undefined ? JSON.stringify(projects) : existingProfile.projects,
        certifications: certifications !== undefined ? JSON.stringify(certifications) : existingProfile.certifications,
        githubUrl: githubUrl !== undefined ? githubUrl.trim() : existingProfile.githubUrl,
        targetRoleId: targetRoleId !== undefined ? targetRoleId : existingProfile.targetRoleId
      },
      include: {
        targetRole: true,
        skillGraphs: true
      }
    });

    // Recompute Skill Graph
    const roleRequirements = updatedProfile.targetRole ? safeJsonParse(updatedProfile.targetRole.skillRequirements, []) : [];
    const newSkillScores = computeSkillScoresFromProfile(updatedProfile, roleRequirements);

    // Upsert skill graph records
    for (const sk of newSkillScores) {
      await prisma.skillGraph.upsert({
        where: {
          studentProfileId_skillName: {
            studentProfileId: updatedProfile.id,
            skillName: sk.skillName
          }
        },
        update: {
          currentScore: sk.currentScore,
          lastEvidence: sk.lastEvidence,
          lastUpdated: new Date()
        },
        create: {
          studentProfileId: updatedProfile.id,
          skillName: sk.skillName,
          currentScore: sk.currentScore,
          lastEvidence: sk.lastEvidence
        }
      });
    }

    // Fetch refreshed skill graph
    const refreshedSkillGraphs = await prisma.skillGraph.findMany({
      where: { studentProfileId: updatedProfile.id }
    });

    // Recalculate readiness & gaps
    const gaps = calculateGaps(refreshedSkillGraphs, roleRequirements);
    const readiness = calculateReadinessScore(refreshedSkillGraphs, roleRequirements);

    // Log to history
    await prisma.readinessScoreHistory.create({
      data: {
        studentProfileId: updatedProfile.id,
        score: readiness.readinessScore
      }
    });

    const readinessHistory = await prisma.readinessScoreHistory.findMany({
      where: { studentProfileId: updatedProfile.id },
      orderBy: { computedAt: 'asc' }
    });

    res.json({
      message: 'Profile updated and digital skill twin recalculated.',
      profile: {
        ...updatedProfile,
        academicSubjects: safeJsonParse(updatedProfile.academicSubjects, []),
        languages: safeJsonParse(updatedProfile.languages, []),
        projects: safeJsonParse(updatedProfile.projects, []),
        certifications: safeJsonParse(updatedProfile.certifications, []),
        skillGraphs: refreshedSkillGraphs,
        readinessHistory
      },
      gaps,
      readiness
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
