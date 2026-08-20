require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const rolesRoutes = require('./routes/roles');
const profileRoutes = require('./routes/profile');
const skillsRoutes = require('./routes/skills');
const missionsRoutes = require('./routes/missions');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request logger for hackathon observability
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[HTTP] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    product: 'SkillTwin Digital Career Twin Engine',
    version: '1.0.0-MVP',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/missions', missionsRoutes);
app.use('/api/admin', adminRoutes);

// Centralized error handler
app.use(errorHandler);

// Only listen if not required by tests
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 SkillTwin API Server running at http://localhost:${PORT}`);
    console.log(`📊 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`=======================================================`);
  });
}

module.exports = app;
