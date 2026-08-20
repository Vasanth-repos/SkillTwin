const express = require('express');
const prisma = require('../db');
const { safeJsonParse } = require('../services/skillEngine');

const router = express.Router();

/**
 * GET /api/roles
 * List all available target career roles with benchmark requirements
 */
router.get('/', async (req, res, next) => {
  try {
    const roles = await prisma.targetRole.findMany({
      include: {
        _count: {
          select: { missions: true, profiles: true }
        }
      }
    });

    const formattedRoles = roles.map(role => ({
      ...role,
      skillRequirements: safeJsonParse(role.skillRequirements, [])
    }));

    res.json({ roles: formattedRoles });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/roles/:id
 */
router.get('/:id', async (req, res, next) => {
  try {
    const role = await prisma.targetRole.findUnique({
      where: { id: req.params.id },
      include: {
        missions: true
      }
    });

    if (!role) {
      return res.status(404).json({ error: 'Target role not found.' });
    }

    res.json({
      role: {
        ...role,
        skillRequirements: safeJsonParse(role.skillRequirements, []),
        missions: role.missions.map(m => ({
          ...m,
          checklistItems: safeJsonParse(m.checklistItems, []),
          expectedFiles: safeJsonParse(m.expectedFiles, [])
        }))
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
