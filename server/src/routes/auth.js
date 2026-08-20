const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../db');
const { requireAuth, JWT_SECRET } = require('../middleware/auth');
const { computeSkillScoresFromProfile, calculateReadinessScore, safeJsonParse } = require('../services/skillEngine');

const router = express.Router();

/**
 * POST /api/auth/register
 */
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, role = 'STUDENT', degree, targetRoleId, languages, academicSubjects, dsaProblemsSolved } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required fields.' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email address already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        passwordHash,
        role: role.toUpperCase() === 'COLLEGE_ADMIN' ? 'COLLEGE_ADMIN' : 'STUDENT'
      }
    });

    let profile = null;

    if (user.role === 'STUDENT') {
      // Find default target role if not provided
      let roleId = targetRoleId;
      if (!roleId) {
        const defaultRole = await prisma.targetRole.findFirst();
        roleId = defaultRole ? defaultRole.id : null;
      }

      profile = await prisma.studentProfile.create({
        data: {
          userId: user.id,
          degree: degree || 'B.S. in Computer Science',
          academicSubjects: JSON.stringify(academicSubjects || ['Data Structures', 'Database Systems', 'Web Engineering']),
          languages: JSON.stringify(languages || ['JavaScript', 'Python']),
          dsaProblemsSolved: Number(dsaProblemsSolved) || 45,
          projects: JSON.stringify([]),
          certifications: JSON.stringify([]),
          githubUrl: '',
          targetRoleId: roleId
        },
        include: {
          targetRole: true
        }
      });

      // Compute initial skill graph
      const roleRequirements = profile.targetRole ? safeJsonParse(profile.targetRole.skillRequirements, []) : [];
      const initialSkills = computeSkillScoresFromProfile(profile, roleRequirements);

      for (const sk of initialSkills) {
        await prisma.skillGraph.create({
          data: {
            studentProfileId: profile.id,
            skillName: sk.skillName,
            currentScore: sk.currentScore,
            lastEvidence: sk.lastEvidence
          }
        });
      }

      // Initial readiness score history
      const { readinessScore } = calculateReadinessScore(initialSkills, roleRequirements);
      await prisma.readinessScoreHistory.create({
        data: {
          studentProfileId: profile.id,
          score: readinessScore
        }
      });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Account registered successfully.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/login
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        profile: {
          include: {
            targetRole: true
          }
        }
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/auth/me
 */
router.get('/me', requireAuth, async (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      profile: req.user.profile
    }
  });
});

/**
 * GET /api/auth/demo-users
 * Quick credentials for 1-click judging demo login
 */
router.get('/demo-users', async (req, res, next) => {
  try {
    const demoAccounts = [
      {
        name: 'Alex Chen',
        email: 'student@skilltwin.dev',
        role: 'STUDENT',
        targetRole: 'Backend Software Engineer',
        description: 'Mid-readiness backend student with high DSA and database gaps.',
        badge: 'Recommended Demo'
      },
      {
        name: 'Sarah Miller',
        email: 'sarah@skilltwin.dev',
        role: 'STUDENT',
        targetRole: 'Full-Stack Developer',
        description: 'Advanced student with strong React & Node foundations.',
        badge: 'Advanced Persona'
      },
      {
        name: 'Jordan Lee',
        email: 'dev@skilltwin.dev',
        role: 'STUDENT',
        targetRole: 'Cloud DevOps Engineer',
        description: 'Early-stage DevOps learner focusing on Docker and CI/CD.',
        badge: 'Beginner Persona'
      },
      {
        name: 'Prof. Davis',
        email: 'admin@skilltwin.dev',
        role: 'COLLEGE_ADMIN',
        targetRole: 'Department Chair & Placement Director',
        description: 'College admin reviewing institutional cohort skill heatmaps.',
        badge: 'Admin Cockpit'
      }
    ];

    res.json({ demoAccounts, defaultPassword: 'password123' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
