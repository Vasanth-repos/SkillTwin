const jwt = require('jsonwebtoken');
const prisma = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'skilltwin-hackathon-jwt-secret-key-2026';

/**
 * Middleware: Verify JWT and attach user object to req.user
 */
async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required. Please log in.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        profile: {
          include: {
            targetRole: true
          }
        }
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid or expired user session.' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Session expired. Please log in again.' });
    }
    return res.status(401).json({ error: 'Invalid authentication token.' });
  }
}

/**
 * Middleware: Enforce required user role (e.g. COLLEGE_ADMIN)
 */
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }
    if (req.user.role !== role) {
      return res.status(403).json({ error: `Forbidden: Access requires ${role} role permissions.` });
    }
    next();
  };
}

module.exports = {
  requireAuth,
  requireRole,
  JWT_SECRET
};
