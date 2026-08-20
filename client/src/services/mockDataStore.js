/**
 * Client-side Offline & Static-Host Fallback Engine (for GitHub Pages & Static Previews)
 * Ensures 100% functionality even when no backend Node daemon is reachable.
 */

import { calculateReadinessScore, calculateGaps } from '../utils/simulatorEngine';

export const MOCK_ROLES = [
  {
    id: 'role-backend-001',
    name: 'Backend Software Engineer',
    category: 'Backend',
    description: 'Specializes in scalable APIs, relational data modeling, system design, and container orchestration.',
    skillRequirements: [
      { skillName: 'Relational Databases & SQL', requiredPercentage: 85, importanceWeight: 1.5, relevanceWeight: 1.5 },
      { skillName: 'REST APIs', requiredPercentage: 90, importanceWeight: 1.4, relevanceWeight: 1.5 },
      { skillName: 'Docker & Containerization', requiredPercentage: 75, importanceWeight: 1.3, relevanceWeight: 1.4 },
      { skillName: 'Data Structures & Algorithms', requiredPercentage: 80, importanceWeight: 1.2, relevanceWeight: 1.2 },
      { skillName: 'System Design & Concurrency', requiredPercentage: 70, importanceWeight: 1.4, relevanceWeight: 1.3 },
      { skillName: 'CI/CD & Git Pipelines', requiredPercentage: 65, importanceWeight: 1.1, relevanceWeight: 1.1 }
    ]
  },
  {
    id: 'role-fullstack-002',
    name: 'Full-Stack Developer',
    category: 'Full-Stack',
    description: 'Builds end-to-end web applications with modern frontend frameworks and robust backend services.',
    skillRequirements: [
      { skillName: 'React & Modern Frontend', requiredPercentage: 90, importanceWeight: 1.5, relevanceWeight: 1.5 },
      { skillName: 'REST APIs', requiredPercentage: 85, importanceWeight: 1.4, relevanceWeight: 1.4 },
      { skillName: 'Relational Databases & SQL', requiredPercentage: 75, importanceWeight: 1.3, relevanceWeight: 1.3 },
      { skillName: 'TypeScript & JavaScript Core', requiredPercentage: 85, importanceWeight: 1.3, relevanceWeight: 1.4 },
      { skillName: 'Data Structures & Algorithms', requiredPercentage: 70, importanceWeight: 1.1, relevanceWeight: 1.1 },
      { skillName: 'Docker & Containerization', requiredPercentage: 60, importanceWeight: 1.0, relevanceWeight: 1.0 }
    ]
  },
  {
    id: 'role-devops-003',
    name: 'Cloud DevOps Engineer',
    category: 'Cloud & DevOps',
    description: 'Architects cloud infrastructure, automated delivery pipelines, and reliable observability systems.',
    skillRequirements: [
      { skillName: 'Docker & Containerization', requiredPercentage: 95, importanceWeight: 1.5, relevanceWeight: 1.5 },
      { skillName: 'CI/CD & Git Pipelines', requiredPercentage: 90, importanceWeight: 1.5, relevanceWeight: 1.5 },
      { skillName: 'Cloud Infrastructure & AWS', requiredPercentage: 85, importanceWeight: 1.4, relevanceWeight: 1.4 },
      { skillName: 'Linux & Scripting', requiredPercentage: 85, importanceWeight: 1.3, relevanceWeight: 1.4 },
      { skillName: 'System Design & Concurrency', requiredPercentage: 75, importanceWeight: 1.3, relevanceWeight: 1.2 },
      { skillName: 'Relational Databases & SQL', requiredPercentage: 60, importanceWeight: 1.0, relevanceWeight: 1.0 }
    ]
  },
  {
    id: 'role-data-004',
    name: 'Data Analyst & Engineer',
    category: 'Data & Analytics',
    description: 'Designs data pipelines, query optimizations, and statistical intelligence dashboards.',
    skillRequirements: [
      { skillName: 'Relational Databases & SQL', requiredPercentage: 95, importanceWeight: 1.5, relevanceWeight: 1.5 },
      { skillName: 'Data Structures & Algorithms', requiredPercentage: 75, importanceWeight: 1.2, relevanceWeight: 1.2 },
      { skillName: 'Python & Data Processing', requiredPercentage: 90, importanceWeight: 1.4, relevanceWeight: 1.5 },
      { skillName: 'System Design & Concurrency', requiredPercentage: 65, importanceWeight: 1.1, relevanceWeight: 1.1 }
    ]
  }
];

export const MOCK_MISSIONS = [
  {
    id: 'mission-docker-01',
    title: 'Containerize an Express Service with Multi-Stage Dockerfile',
    targetSkill: 'Docker & Containerization',
    difficulty: 'INTERMEDIATE',
    estimatedHours: 3,
    description: 'Author a production-ready, multi-stage Dockerfile and docker-compose.yml configuration with healthchecks.',
    starterRepoUrl: 'https://github.com/skilltwin-templates/docker-express-starter',
    checklistItems: [
      { text: 'Valid multi-stage Dockerfile with non-root user', points: 10, pattern: 'Dockerfile' },
      { text: 'docker-compose.yml with healthcheck configured', points: 5, pattern: 'docker-compose.yml' },
      { text: 'Passing unit/integration test assertions', points: 5, pattern: 'tests/' }
    ]
  },
  {
    id: 'mission-sql-02',
    title: 'Schema Design & Index Optimization Benchmark',
    targetSkill: 'Relational Databases & SQL',
    difficulty: 'ADVANCED',
    estimatedHours: 4,
    description: 'Design a normalized PostgreSQL schema with composite indexes and transaction isolation guarantees.',
    starterRepoUrl: 'https://github.com/skilltwin-templates/postgres-indexing-starter',
    checklistItems: [
      { text: 'SQL schema DDL with foreign key constraints', points: 10, pattern: 'schema.sql' },
      { text: 'B-tree index benchmark test script', points: 5, pattern: 'benchmark.js' },
      { text: 'Transaction isolation test suite', points: 5, pattern: 'tests/' }
    ]
  },
  {
    id: 'mission-api-03',
    title: 'Idempotent Payment & Webhook REST API',
    targetSkill: 'REST APIs',
    difficulty: 'INTERMEDIATE',
    estimatedHours: 3,
    description: 'Implement a RESTful API with Idempotency-Key request headers and structured error middleware.',
    starterRepoUrl: 'https://github.com/skilltwin-templates/rest-api-starter',
    checklistItems: [
      { text: 'Idempotency middleware implementation', points: 10, pattern: 'middleware/' },
      { text: 'Comprehensive route testing assertions', points: 10, pattern: 'tests/' }
    ]
  },
  {
    id: 'mission-react-04',
    title: 'State Management & Virtualized Data Grid',
    targetSkill: 'React & Modern Frontend',
    difficulty: 'ADVANCED',
    estimatedHours: 4,
    description: 'Build a high-performance React component with custom hooks, memoization, and zero re-render waste.',
    starterRepoUrl: 'https://github.com/skilltwin-templates/react-perf-starter',
    checklistItems: [
      { text: 'Virtualized list implementation with custom hook', points: 10, pattern: 'useVirtualList' },
      { text: 'React.memo performance regression test', points: 10, pattern: 'tests/' }
    ]
  }
];

export const MOCK_PERSONAS = {
  'student@skilltwin.dev': {
    user: { id: 'user-alex', name: 'Alex Chen', email: 'student@skilltwin.dev', role: 'STUDENT' },
    profile: {
      id: 'prof-alex',
      userId: 'user-alex',
      degree: 'B.Tech in Computer Science (Final Year)',
      dsaProblemsSolved: 145,
      targetRoleId: 'role-backend-001',
      academicSubjects: ['Data Structures', 'Database Systems', 'Operating Systems', 'Computer Networks'],
      languages: ['JavaScript', 'TypeScript', 'SQL', 'C++'],
      projects: [
        { title: 'Distributed Task Queue', repoUrl: 'https://github.com/alexchen/task-queue', tech: 'Node.js, Redis, PostgreSQL' }
      ],
      skillGraphs: [
        { skillName: 'Data Structures & Algorithms', currentScore: 82, lastEvidence: '145 DSA Problems Solved' },
        { skillName: 'Relational Databases & SQL', currentScore: 78, lastEvidence: 'Database Systems Coursework + SQL Project' },
        { skillName: 'REST APIs', currentScore: 80, lastEvidence: 'Task Queue API Architecture' },
        { skillName: 'Docker & Containerization', currentScore: 35, lastEvidence: 'Basic Single Container' },
        { skillName: 'System Design & Concurrency', currentScore: 60, lastEvidence: 'Redis Queue Lock Architecture' },
        { skillName: 'CI/CD & Git Pipelines', currentScore: 50, lastEvidence: 'Git Workflow' }
      ],
      readinessHistory: [
        { recordedAt: '2026-07-01T00:00:00Z', score: 38 },
        { recordedAt: '2026-07-20T00:00:00Z', score: 46 },
        { recordedAt: '2026-08-10T00:00:00Z', score: 54 },
        { recordedAt: '2026-08-20T00:00:00Z', score: 58 }
      ],
      facultyAssignments: [
        {
          id: 'assign-01',
          facultyName: 'Prof. Marcus Davis',
          facultyNote: 'Alex, please complete the containerization mission before our mock campus technical interview on Friday.',
          mission: MOCK_MISSIONS[0]
        }
      ],
      submissions: []
    }
  },

  'sarah@skilltwin.dev': {
    user: { id: 'user-sarah', name: 'Sarah Miller', email: 'sarah@skilltwin.dev', role: 'STUDENT' },
    profile: {
      id: 'prof-sarah',
      userId: 'user-sarah',
      degree: 'B.S. in Software Engineering',
      dsaProblemsSolved: 210,
      targetRoleId: 'role-fullstack-002',
      academicSubjects: ['Web Architecture', 'Software Design Patterns', 'Algorithms'],
      languages: ['TypeScript', 'JavaScript', 'React', 'Node.js', 'SQL'],
      projects: [
        { title: 'Real-time Collaborative Canvas', repoUrl: 'https://github.com/sarahm/collab-canvas', tech: 'React, WebSockets, Tailwind' },
        { title: 'E-Commerce Microservices', repoUrl: 'https://github.com/sarahm/ecom-api', tech: 'Express, PostgreSQL, Docker' }
      ],
      skillGraphs: [
        { skillName: 'React & Modern Frontend', currentScore: 92, lastEvidence: 'Collaborative Canvas Project' },
        { skillName: 'TypeScript & JavaScript Core', currentScore: 88, lastEvidence: 'Full TypeScript Codebase' },
        { skillName: 'REST APIs', currentScore: 85, lastEvidence: 'E-Commerce Microservices API' },
        { skillName: 'Relational Databases & SQL', currentScore: 80, lastEvidence: 'PostgreSQL E-Commerce Schema' },
        { skillName: 'Data Structures & Algorithms', currentScore: 78, lastEvidence: '210 DSA Problems' },
        { skillName: 'Docker & Containerization', currentScore: 70, lastEvidence: 'Multi-service Compose' }
      ],
      readinessHistory: [
        { recordedAt: '2026-06-15T00:00:00Z', score: 62 },
        { recordedAt: '2026-07-15T00:00:00Z', score: 75 },
        { recordedAt: '2026-08-20T00:00:00Z', score: 86 }
      ],
      facultyAssignments: [],
      submissions: []
    }
  },

  'dev@skilltwin.dev': {
    user: { id: 'user-jordan', name: 'Jordan Lee', email: 'dev@skilltwin.dev', role: 'STUDENT' },
    profile: {
      id: 'prof-jordan',
      userId: 'user-jordan',
      degree: 'B.Tech in Information Technology',
      dsaProblemsSolved: 45,
      targetRoleId: 'role-devops-003',
      academicSubjects: ['Operating Systems', 'Computer Networks'],
      languages: ['Bash', 'Python', 'Go'],
      projects: [
        { title: 'Server Health Monitor Script', repoUrl: 'https://github.com/jordanl/health-check', tech: 'Bash, Linux' }
      ],
      skillGraphs: [
        { skillName: 'Linux & Scripting', currentScore: 65, lastEvidence: 'Bash Monitor Script' },
        { skillName: 'Docker & Containerization', currentScore: 30, lastEvidence: 'Introductory Container' },
        { skillName: 'CI/CD & Git Pipelines', currentScore: 35, lastEvidence: 'Basic GitHub Action' },
        { skillName: 'Cloud Infrastructure & AWS', currentScore: 25, lastEvidence: 'Foundational Cloud' },
        { skillName: 'System Design & Concurrency', currentScore: 30, lastEvidence: 'Network Foundations' },
        { skillName: 'Relational Databases & SQL', currentScore: 30, lastEvidence: 'Basic Queries' }
      ],
      readinessHistory: [
        { recordedAt: '2026-07-10T00:00:00Z', score: 22 },
        { recordedAt: '2026-08-20T00:00:00Z', score: 36 }
      ],
      facultyAssignments: [],
      submissions: []
    }
  },

  'admin@skilltwin.dev': {
    user: { id: 'user-admin', name: 'Prof. Marcus Davis', email: 'admin@skilltwin.dev', role: 'COLLEGE_ADMIN' },
    profile: null
  }
};

export const MOCK_ADMIN_STATS = {
  totalStudents: 3,
  avgCohortReadiness: 60,
  institutionalSkillGaps: [
    { skillName: 'Docker & Containerization', gapPercentage: 67, studentsWithGap: 2, totalStudentsNeeding: 3 },
    { skillName: 'System Design & Concurrency', gapPercentage: 67, studentsWithGap: 2, totalStudentsNeeding: 3 },
    { skillName: 'CI/CD & Git Pipelines', gapPercentage: 50, studentsWithGap: 1, totalStudentsNeeding: 2 },
    { skillName: 'Relational Databases & SQL', gapPercentage: 33, studentsWithGap: 1, totalStudentsNeeding: 3 }
  ],
  students: [
    { id: 'prof-sarah', name: 'Sarah Miller', email: 'sarah@skilltwin.dev', degree: 'B.S. in Software Engineering', targetRoleName: 'Full-Stack Developer', readinessScore: 86, dsaProblemsSolved: 210, completedMissionsCount: 2, lastActive: '2026-08-20T12:00:00Z' },
    { id: 'prof-alex', name: 'Alex Chen', email: 'student@skilltwin.dev', degree: 'B.Tech in Computer Science', targetRoleName: 'Backend Software Engineer', readinessScore: 58, dsaProblemsSolved: 145, completedMissionsCount: 0, lastActive: '2026-08-20T14:30:00Z' },
    { id: 'prof-jordan', name: 'Jordan Lee', email: 'dev@skilltwin.dev', degree: 'B.Tech in Information Technology', targetRoleName: 'Cloud DevOps Engineer', readinessScore: 36, dsaProblemsSolved: 45, completedMissionsCount: 0, lastActive: '2026-08-19T09:00:00Z' }
  ]
};
