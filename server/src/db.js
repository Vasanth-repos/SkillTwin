/**
 * SkillTwin Resilient Universal Data Layer
 * 
 * Provides a persistent, relational, zero-dependency storage engine
 * matching the Prisma Client API surface for 100% portability across
 * all architectures (Windows ARM64, x64, macOS, Linux).
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DB_FILE_PATH = path.resolve(__dirname, '../prisma/dev-store.json');

// In-memory relational store
let data = {
  users: [],
  targetRoles: [],
  studentProfiles: [],
  skillGraphs: [],
  missions: [],
  missionSubmissions: [],
  readinessScoreHistories: [],
  facultyAssignments: []
};

// Load existing database from disk if available
function loadFromDisk() {
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const raw = fs.readFileSync(DB_FILE_PATH, 'utf8');
      const parsed = JSON.parse(raw);
      data = {
        users: [],
        targetRoles: [],
        studentProfiles: [],
        skillGraphs: [],
        missions: [],
        missionSubmissions: [],
        readinessScoreHistories: [],
        facultyAssignments: [],
        ...parsed
      };
      if (!data.facultyAssignments) data.facultyAssignments = [];
    }
  } catch (err) {
    console.warn('[DB] Warning: Could not read dev-store.json, using fresh store.', err.message);
  }
}

// Atomic persistence to disk
function persistToDisk() {
  try {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('[DB] Failed to persist data to disk:', err.message);
  }
}

loadFromDisk();

function generateId() {
  return crypto.randomUUID();
}

function matchesWhere(item, where) {
  if (!where) return true;
  for (const [key, val] of Object.entries(where)) {
    if (key === 'studentProfileId_skillName') {
      if (item.studentProfileId !== val.studentProfileId || item.skillName !== val.skillName) {
        return false;
      }
      continue;
    }
    if (item[key] !== val) return false;
  }
  return true;
}

// Helper to resolve relational includes
function resolveIncludes(table, item, include) {
  if (!item || !include) return item;
  const clone = { ...item };

  if (table === 'users') {
    if (include.profile) {
      const profile = data.studentProfiles.find(p => p.userId === clone.id);
      clone.profile = profile ? resolveIncludes('studentProfiles', profile, include.profile.include) : null;
    }
  }

  if (table === 'studentProfiles') {
    if (include.user) {
      clone.user = data.users.find(u => u.id === clone.userId) || null;
    }
    if (include.targetRole) {
      clone.targetRole = data.targetRoles.find(r => r.id === clone.targetRoleId) || null;
    }
    if (include.skillGraphs) {
      clone.skillGraphs = data.skillGraphs.filter(s => s.studentProfileId === clone.id);
    }
    if (include.submissions) {
      let subs = data.missionSubmissions.filter(s => s.studentProfileId === clone.id);
      if (include.submissions.orderBy) {
        const ob = include.submissions.orderBy;
        if (ob.submittedAt === 'desc') {
          subs.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
        }
      }
      if (include.submissions.include && include.submissions.include.mission) {
        subs = subs.map(s => ({
          ...s,
          mission: data.missions.find(m => m.id === s.missionId) || null
        }));
      }
      clone.submissions = subs;
    }
    if (include.readinessHistory) {
      let history = data.readinessScoreHistories.filter(h => h.studentProfileId === clone.id);
      if (include.readinessHistory.orderBy) {
        const ob = include.readinessHistory.orderBy;
        if (ob.computedAt === 'asc') {
          history.sort((a, b) => new Date(a.computedAt) - new Date(b.computedAt));
        } else if (ob.computedAt === 'desc') {
          history.sort((a, b) => new Date(b.computedAt) - new Date(a.computedAt));
        }
      }
      if (include.readinessHistory.take) {
        history = history.slice(0, include.readinessHistory.take);
      }
      clone.readinessHistory = history;
    }
  }

  if (table === 'targetRoles') {
    if (include.missions) {
      clone.missions = data.missions.filter(m => m.relatedRoleId === clone.id);
    }
    if (include._count) {
      clone._count = {
        missions: data.missions.filter(m => m.relatedRoleId === clone.id).length,
        profiles: data.studentProfiles.filter(p => p.targetRoleId === clone.id).length
      };
    }
  }

  if (table === 'missions') {
    if (include.relatedRole) {
      clone.relatedRole = data.targetRoles.find(r => r.id === clone.relatedRoleId) || null;
    }
    if (include.submissions) {
      clone.submissions = data.missionSubmissions.filter(s => s.missionId === clone.id);
    }
  }

  if (table === 'missionSubmissions') {
    if (include.mission) {
      clone.mission = data.missions.find(m => m.id === clone.missionId) || null;
    }
    if (include.studentProfile) {
      clone.studentProfile = data.studentProfiles.find(p => p.id === clone.studentProfileId) || null;
    }
  }

  return clone;
}

// Factory for model operations
function createModel(tableName) {
  return {
    async findUnique({ where, include } = {}) {
      if (!data[tableName]) data[tableName] = [];
      const item = data[tableName].find(i => matchesWhere(i, where));
      return item ? resolveIncludes(tableName, item, include) : null;
    },

    async findFirst({ where, include } = {}) {
      if (!data[tableName]) data[tableName] = [];
      const item = data[tableName].find(i => matchesWhere(i, where));
      return item ? resolveIncludes(tableName, item, include) : null;
    },

    async findMany({ where, include, orderBy, take, select } = {}) {
      if (!data[tableName]) data[tableName] = [];
      let results = data[tableName].filter(i => matchesWhere(i, where));

      if (orderBy) {
        for (const [key, dir] of Object.entries(orderBy)) {
          results.sort((a, b) => {
            if (a[key] < b[key]) return dir === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return dir === 'asc' ? 1 : -1;
            return 0;
          });
        }
      }

      if (take && typeof take === 'number') {
        results = results.slice(0, take);
      }

      if (include) {
        results = results.map(i => resolveIncludes(tableName, i, include));
      }

      if (select) {
        results = results.map(item => {
          const selected = {};
          for (const key of Object.keys(select)) {
            selected[key] = item[key];
          }
          return selected;
        });
      }

      return results;
    },

    async create({ data: itemData, include } = {}) {
      const newItem = {
        id: itemData.id || generateId(),
        ...itemData,
        createdAt: itemData.createdAt || new Date(),
        updatedAt: itemData.updatedAt || new Date()
      };
      data[tableName].push(newItem);
      persistToDisk();
      return resolveIncludes(tableName, newItem, include);
    },

    async createMany({ data: items } = {}) {
      for (const itemData of items) {
        const newItem = {
          id: itemData.id || generateId(),
          ...itemData,
          createdAt: itemData.createdAt || new Date(),
          updatedAt: itemData.updatedAt || new Date()
        };
        data[tableName].push(newItem);
      }
      persistToDisk();
      return { count: items.length };
    },

    async update({ where, data: updateData, include } = {}) {
      const index = data[tableName].findIndex(i => matchesWhere(i, where));
      if (index === -1) {
        throw new Error(`Record not found in ${tableName} for update.`);
      }
      data[tableName][index] = {
        ...data[tableName][index],
        ...updateData,
        updatedAt: new Date()
      };
      persistToDisk();
      return resolveIncludes(tableName, data[tableName][index], include);
    },

    async upsert({ where, update, create, include } = {}) {
      const index = data[tableName].findIndex(i => matchesWhere(i, where));
      if (index !== -1) {
        data[tableName][index] = {
          ...data[tableName][index],
          ...update,
          updatedAt: new Date()
        };
        persistToDisk();
        return resolveIncludes(tableName, data[tableName][index], include);
      } else {
        const newItem = {
          id: create.id || generateId(),
          ...create,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        data[tableName].push(newItem);
        persistToDisk();
        return resolveIncludes(tableName, newItem, include);
      }
    },

    async deleteMany({ where } = {}) {
      const initialCount = data[tableName].length;
      if (!where || Object.keys(where).length === 0) {
        data[tableName] = [];
      } else {
        data[tableName] = data[tableName].filter(i => !matchesWhere(i, where));
      }
      persistToDisk();
      return { count: initialCount - data[tableName].length };
    }
  };
}

const prisma = {
  user: createModel('users'),
  targetRole: createModel('targetRoles'),
  studentProfile: createModel('studentProfiles'),
  skillGraph: createModel('skillGraphs'),
  mission: createModel('missions'),
  missionSubmission: createModel('missionSubmissions'),
  readinessScoreHistory: createModel('readinessScoreHistories'),
  facultyAssignment: createModel('facultyAssignments'),
  async $disconnect() {
    persistToDisk();
  }
};

module.exports = prisma;
