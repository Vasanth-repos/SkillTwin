const express = require('express');
const prisma = require('../db');
const { requireAuth, requireRole } = require('../middleware/auth');
const { calculateReadinessScore, calculateGaps, safeJsonParse } = require('../services/skillEngine');

const router = express.Router();

// Require authenticated COLLEGE_ADMIN for all admin routes
router.use(requireAuth);
router.use(requireRole('COLLEGE_ADMIN'));

/**
 * GET /api/admin/cohort-stats
 * Aggregates cohort readiness metrics and institutional skill gap heatmap
 */
router.get('/cohort-stats', async (req, res, next) => {
  try {
    const students = await prisma.studentProfile.findMany({
      include: {
        user: true,
        targetRole: true,
        skillGraphs: true,
        submissions: true,
        readinessHistory: {
          orderBy: { computedAt: 'desc' },
          take: 1
        }
      }
    });

    const totalStudents = students.length;
    let readinessScoresSum = 0;
    const roleMap = {};
    const skillGapsAggregate = {}; // { [skillName]: { totalRequiredCount, gapCount, avgGap } }

    const studentSummaries = [];

    for (const student of students) {
      const roleReqs = student.targetRole ? safeJsonParse(student.targetRole.skillRequirements, []) : [];
      const currentReadiness = calculateReadinessScore(student.skillGraphs, roleReqs).readinessScore;
      readinessScoresSum += currentReadiness;

      // Role distribution
      const roleName = student.targetRole ? student.targetRole.name : 'Undeclared';
      if (!roleMap[roleName]) {
        roleMap[roleName] = { roleName, count: 0, totalScore: 0 };
      }
      roleMap[roleName].count += 1;
      roleMap[roleName].totalScore += currentReadiness;

      // Student gaps analysis
      const gaps = calculateGaps(student.skillGraphs, roleReqs);
      for (const gap of gaps) {
        if (!skillGapsAggregate[gap.skillName]) {
          skillGapsAggregate[gap.skillName] = {
            skillName: gap.skillName,
            totalStudentsNeeding: 0,
            studentsWithGap: 0,
            totalGapPoints: 0,
            criticalGapCount: 0
          };
        }
        skillGapsAggregate[gap.skillName].totalStudentsNeeding += 1;
        if (gap.gap > 0) {
          skillGapsAggregate[gap.skillName].studentsWithGap += 1;
          skillGapsAggregate[gap.skillName].totalGapPoints += gap.gap;
          if (gap.urgency === 'CRITICAL') {
            skillGapsAggregate[gap.skillName].criticalGapCount += 1;
          }
        }
      }

      studentSummaries.push({
        id: student.id,
        userId: student.userId,
        name: student.user.name,
        email: student.user.email,
        degree: student.degree,
        targetRole: student.targetRole ? student.targetRole.name : 'Undeclared',
        readinessScore: currentReadiness,
        dsaProblemsSolved: student.dsaProblemsSolved,
        completedMissionsCount: student.submissions.filter(s => s.status === 'EVALUATED').length,
        updatedAt: student.updatedAt
      });
    }

    const avgCohortReadiness = totalStudents > 0 ? Math.round(readinessScoresSum / totalStudents) : 0;

    // Format role distribution
    const roleDistribution = Object.values(roleMap).map(r => ({
      roleName: r.roleName,
      studentCount: r.count,
      averageReadiness: Math.round(r.totalScore / r.count)
    }));

    // Format institutional skill gap heatmap
    const institutionalSkillGaps = Object.values(skillGapsAggregate).map(s => {
      const gapPercentage = s.totalStudentsNeeding > 0 
        ? Math.round((s.studentsWithGap / s.totalStudentsNeeding) * 100)
        : 0;
      const averageGapPoints = s.studentsWithGap > 0 
        ? Math.round(s.totalGapPoints / s.studentsWithGap)
        : 0;

      return {
        skillName: s.skillName,
        totalStudentsNeeding: s.totalStudentsNeeding,
        studentsWithGap: s.studentsWithGap,
        criticalGapCount: s.criticalGapCount,
        gapPercentage,
        averageGapPoints,
        severity: gapPercentage >= 70 ? 'CRITICAL' : gapPercentage >= 40 ? 'HIGH' : 'MODERATE'
      };
    }).sort((a, b) => b.gapPercentage - a.gapPercentage);

    res.json({
      totalStudents,
      avgCohortReadiness,
      roleDistribution,
      institutionalSkillGaps,
      studentSummaries
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/admin/students
 * Filterable student roster
 */
router.get('/students', async (req, res, next) => {
  try {
    const { search, roleId, minReadiness } = req.query;

    const where = {};
    if (roleId) {
      where.targetRoleId = roleId;
    }

    const students = await prisma.studentProfile.findMany({
      where,
      include: {
        user: true,
        targetRole: true,
        skillGraphs: true,
        submissions: true
      }
    });

    let results = students.map(student => {
      const roleReqs = student.targetRole ? safeJsonParse(student.targetRole.skillRequirements, []) : [];
      const readiness = calculateReadinessScore(student.skillGraphs, roleReqs).readinessScore;

      return {
        id: student.id,
        userId: student.userId,
        name: student.user.name,
        email: student.user.email,
        degree: student.degree,
        targetRoleId: student.targetRoleId,
        targetRoleName: student.targetRole ? student.targetRole.name : 'Undeclared',
        readinessScore: readiness,
        dsaProblemsSolved: student.dsaProblemsSolved,
        languages: safeJsonParse(student.languages, []),
        completedMissionsCount: student.submissions.filter(s => s.status === 'EVALUATED').length,
        lastActive: student.updatedAt
      };
    });

    // Apply search filter
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.email.toLowerCase().includes(q) || 
        s.targetRoleName.toLowerCase().includes(q) ||
        s.degree.toLowerCase().includes(q)
      );
    }

    // Apply minReadiness filter
    if (minReadiness) {
      const min = Number(minReadiness);
      results = results.filter(s => s.readinessScore >= min);
    }

    // Sort by readiness score descending
    results.sort((a, b) => b.readinessScore - a.readinessScore);

    res.json({ students: results, total: results.length });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/admin/students/:id
 * Individual student drilldown
 */
router.get('/students/:id', async (req, res, next) => {
  try {
    const student = await prisma.studentProfile.findUnique({
      where: { id: req.params.id },
      include: {
        user: true,
        targetRole: true,
        skillGraphs: true,
        readinessHistory: {
          orderBy: { computedAt: 'asc' }
        },
        submissions: {
          include: { mission: true },
          orderBy: { submittedAt: 'desc' }
        }
      }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    const roleReqs = student.targetRole ? safeJsonParse(student.targetRole.skillRequirements, []) : [];
    const gaps = calculateGaps(student.skillGraphs, roleReqs);
    const readiness = calculateReadinessScore(student.skillGraphs, roleReqs);

    res.json({
      student: {
        ...student,
        academicSubjects: safeJsonParse(student.academicSubjects, []),
        languages: safeJsonParse(student.languages, []),
        projects: safeJsonParse(student.projects, []),
        certifications: safeJsonParse(student.certifications, []),
        targetRole: student.targetRole ? {
          ...student.targetRole,
          skillRequirements: roleReqs
        } : null,
        submissions: student.submissions.map(s => ({
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

module.exports = router;
