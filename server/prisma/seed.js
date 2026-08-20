const prisma = require('../src/db');
const bcrypt = require('bcryptjs');

async function main() {
  console.log('🌱 Seeding SkillTwin Database with Target Roles, Missions, and Demo Personas...');

  // Clean existing tables (in relational order)
  await prisma.readinessScoreHistory.deleteMany();
  await prisma.missionSubmission.deleteMany();
  await prisma.skillGraph.deleteMany();
  await prisma.mission.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.targetRole.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Create Target Roles
  console.log('Creating Target Roles...');
  
  const backendRole = await prisma.targetRole.create({
    data: {
      name: 'Backend Software Engineer',
      category: 'Software Engineering',
      description: 'Designs scalable server-side architectures, database schemas, distributed workflows, and high-throughput REST/gRPC APIs.',
      icon: 'server',
      skillRequirements: JSON.stringify([
        { skillName: 'Relational Databases & SQL', requiredPercentage: 90, importanceWeight: 1.9, relevanceWeight: 1.9 },
        { skillName: 'REST APIs', requiredPercentage: 85, importanceWeight: 1.8, relevanceWeight: 1.8 },
        { skillName: 'System Design & Concurrency', requiredPercentage: 80, importanceWeight: 1.7, relevanceWeight: 1.7 },
        { skillName: 'Docker & Containerization', requiredPercentage: 75, importanceWeight: 1.5, relevanceWeight: 1.6 },
        { skillName: 'Data Structures & Algorithms', requiredPercentage: 80, importanceWeight: 1.4, relevanceWeight: 1.5 },
        { skillName: 'Git & Version Control', requiredPercentage: 70, importanceWeight: 1.2, relevanceWeight: 1.3 }
      ])
    }
  });

  const fullstackRole = await prisma.targetRole.create({
    data: {
      name: 'Full-Stack Developer',
      category: 'Web Development',
      description: 'Builds end-to-end web applications with reactive client interfaces, robust backend services, and cloud deployments.',
      icon: 'layout',
      skillRequirements: JSON.stringify([
        { skillName: 'React & Modern Frontend', requiredPercentage: 85, importanceWeight: 1.8, relevanceWeight: 1.9 },
        { skillName: 'REST APIs', requiredPercentage: 80, importanceWeight: 1.7, relevanceWeight: 1.8 },
        { skillName: 'Relational Databases & SQL', requiredPercentage: 75, importanceWeight: 1.5, relevanceWeight: 1.6 },
        { skillName: 'TypeScript & Type Safety', requiredPercentage: 75, importanceWeight: 1.4, relevanceWeight: 1.5 },
        { skillName: 'State Management & UI Performance', requiredPercentage: 70, importanceWeight: 1.3, relevanceWeight: 1.4 },
        { skillName: 'Git & Version Control', requiredPercentage: 70, importanceWeight: 1.2, relevanceWeight: 1.3 }
      ])
    }
  });

  const devopsRole = await prisma.targetRole.create({
    data: {
      name: 'Cloud DevOps Engineer',
      category: 'Cloud & Infrastructure',
      description: 'Automates deployment pipelines, provisions infrastructure as code, and manages containerized Kubernetes clusters in the cloud.',
      icon: 'cloud',
      skillRequirements: JSON.stringify([
        { skillName: 'Docker & Containerization', requiredPercentage: 90, importanceWeight: 1.9, relevanceWeight: 1.9 },
        { skillName: 'CI/CD Pipelines & Automation', requiredPercentage: 85, importanceWeight: 1.8, relevanceWeight: 1.8 },
        { skillName: 'Kubernetes & Orchestration', requiredPercentage: 85, importanceWeight: 1.8, relevanceWeight: 1.8 },
        { skillName: 'Infrastructure as Code (Terraform)', requiredPercentage: 80, importanceWeight: 1.7, relevanceWeight: 1.7 },
        { skillName: 'Linux & Bash Scripting', requiredPercentage: 80, importanceWeight: 1.5, relevanceWeight: 1.6 },
        { skillName: 'Git & Version Control', requiredPercentage: 75, importanceWeight: 1.3, relevanceWeight: 1.4 }
      ])
    }
  });

  const dataRole = await prisma.targetRole.create({
    data: {
      name: 'Data Analyst & Analytics Engineer',
      category: 'Data & Analytics',
      description: 'Transforms raw relational data into dimensional models, automated ETL data pipelines, and executive business intelligence dashboards.',
      icon: 'database',
      skillRequirements: JSON.stringify([
        { skillName: 'Relational Databases & SQL', requiredPercentage: 90, importanceWeight: 1.9, relevanceWeight: 1.9 },
        { skillName: 'Python for Data Analysis', requiredPercentage: 85, importanceWeight: 1.8, relevanceWeight: 1.8 },
        { skillName: 'Business Intelligence & Dashboards', requiredPercentage: 80, importanceWeight: 1.6, relevanceWeight: 1.7 },
        { skillName: 'ETL Pipelines & Data Quality', requiredPercentage: 75, importanceWeight: 1.5, relevanceWeight: 1.6 },
        { skillName: 'Data Structures & Algorithms', requiredPercentage: 65, importanceWeight: 1.2, relevanceWeight: 1.3 },
        { skillName: 'Git & Version Control', requiredPercentage: 65, importanceWeight: 1.1, relevanceWeight: 1.2 }
      ])
    }
  });

  // 2. Create Missions
  console.log('Creating Hands-on Missions...');

  // Backend Missions
  const missionDocker = await prisma.mission.create({
    data: {
      targetSkill: 'Docker & Containerization',
      title: 'Containerize a Microservice with Multi-Stage Dockerfile',
      description: 'Write a production-ready multi-stage Dockerfile and docker-compose.yml to containerize an Express API with PostgreSQL. Ensure non-root user execution and minimal image size.',
      difficulty: 'INTERMEDIATE',
      relatedRoleId: backendRole.id,
      estimatedHours: 3,
      starterRepoUrl: 'https://github.com/skilltwin-templates/docker-microservice-starter',
      checklistItems: JSON.stringify([
        { id: 'dock_1', text: 'Dockerfile is present in root with multi-stage build pattern', points: 30, rulePattern: 'dockerfile' },
        { id: 'dock_2', text: 'docker-compose.yml orchestrates web application and database services', points: 30, rulePattern: 'docker-compose' },
        { id: 'dock_3', text: 'README.md documents container startup and teardown commands', points: 20, rulePattern: 'readme' },
        { id: 'dock_4', text: 'Healthcheck endpoint or automated test verified', points: 20, rulePattern: 'test' }
      ]),
      expectedFiles: JSON.stringify(['Dockerfile', 'docker-compose.yml', 'README.md', '.dockerignore', 'src/index.js'])
    }
  });

  await prisma.mission.create({
    data: {
      targetSkill: 'Relational Databases & SQL',
      title: 'Design High-Performance SQL Schema & Migration Suite',
      description: 'Model a relational schema for a multi-tenant e-commerce backend with B-tree indexes on foreign keys, audit timestamp triggers, and parameterized queries.',
      difficulty: 'ADVANCED',
      relatedRoleId: backendRole.id,
      estimatedHours: 4,
      starterRepoUrl: 'https://github.com/skilltwin-templates/sql-schema-starter',
      checklistItems: JSON.stringify([
        { id: 'sql_1', text: 'SQL schema file with foreign key constraints and primary keys', points: 35, rulePattern: 'sql' },
        { id: 'sql_2', text: 'Automated database migration scripts or Prisma schema', points: 35, rulePattern: 'schema' },
        { id: 'sql_3', text: 'Automated query performance or integration test suite', points: 30, rulePattern: 'test' }
      ]),
      expectedFiles: JSON.stringify(['prisma/schema.prisma', 'src/migrations/001_init.sql', 'tests/db.test.js', 'README.md'])
    }
  });

  await prisma.mission.create({
    data: {
      targetSkill: 'REST APIs',
      title: 'Implement Idempotent REST API with JWT Auth & Rate Limiting',
      description: 'Build a production-grade Express REST API with input validation, JWT middleware, structured error responses, and token bucket rate limiting.',
      difficulty: 'INTERMEDIATE',
      relatedRoleId: backendRole.id,
      estimatedHours: 3,
      starterRepoUrl: 'https://github.com/skilltwin-templates/express-auth-starter',
      checklistItems: JSON.stringify([
        { id: 'api_1', text: 'REST API routing controllers with parameter validation', points: 35, rulePattern: 'api' },
        { id: 'api_2', text: 'Automated endpoint unit & integration test coverage', points: 35, rulePattern: 'test' },
        { id: 'api_3', text: 'README with OpenAPI / curl request documentation', points: 30, rulePattern: 'readme' }
      ]),
      expectedFiles: JSON.stringify(['src/routes/api.js', 'src/middleware/auth.js', 'tests/api.test.js', 'README.md'])
    }
  });

  await prisma.mission.create({
    data: {
      targetSkill: 'System Design & Concurrency',
      title: 'Architect Distributed Redis Caching & Queue System',
      description: 'Implement an asynchronous worker queue with Redis BullMQ to handle background image processing jobs without blocking the main event loop.',
      difficulty: 'ADVANCED',
      relatedRoleId: backendRole.id,
      estimatedHours: 5,
      starterRepoUrl: 'https://github.com/skilltwin-templates/redis-queue-starter',
      checklistItems: JSON.stringify([
        { id: 'sys_1', text: 'Producer API endpoint enqueueing background jobs', points: 35, rulePattern: 'api' },
        { id: 'sys_2', text: 'Worker daemon process consuming queue messages', points: 35, rulePattern: 'worker' },
        { id: 'sys_3', text: 'docker-compose with Redis and worker containers', points: 30, rulePattern: 'docker-compose' }
      ]),
      expectedFiles: JSON.stringify(['src/queue.js', 'src/worker.js', 'docker-compose.yml', 'README.md'])
    }
  });

  // Full-Stack Missions
  await prisma.mission.create({
    data: {
      targetSkill: 'React & Modern Frontend',
      title: 'Build Accessible Component Design System with Tailwind',
      description: 'Develop a reusable UI component library with dark/light themes, keyboard navigation, ARIA attributes, and responsive layout primitives.',
      difficulty: 'INTERMEDIATE',
      relatedRoleId: fullstackRole.id,
      estimatedHours: 3,
      starterRepoUrl: 'https://github.com/skilltwin-templates/react-design-system',
      checklistItems: JSON.stringify([
        { id: 'fe_1', text: 'Reusable React components with prop validation', points: 40, rulePattern: 'src/components' },
        { id: 'fe_2', text: 'Tailwind CSS design token configuration', points: 30, rulePattern: 'tailwind' },
        { id: 'fe_3', text: 'Component unit tests with React Testing Library', points: 30, rulePattern: 'test' }
      ]),
      expectedFiles: JSON.stringify(['src/components/Button.jsx', 'tailwind.config.js', 'src/components/Button.test.jsx', 'README.md'])
    }
  });

  await prisma.mission.create({
    data: {
      targetSkill: 'TypeScript & Type Safety',
      title: 'End-to-End Type Safety with Shared Zod Schemas',
      description: 'Construct a full-stack monorepo sharing contract schemas between frontend forms and backend API handlers using TypeScript and Zod.',
      difficulty: 'INTERMEDIATE',
      relatedRoleId: fullstackRole.id,
      estimatedHours: 3,
      starterRepoUrl: 'https://github.com/skilltwin-templates/ts-zod-starter',
      checklistItems: JSON.stringify([
        { id: 'ts_1', text: 'Shared Zod validation schemas and TypeScript types', points: 40, rulePattern: 'schema' },
        { id: 'ts_2', text: 'Type-checked API handlers with zero `any` types', points: 30, rulePattern: 'route' },
        { id: 'ts_3', text: 'Automated type verification script in package.json', points: 30, rulePattern: 'package.json' }
      ]),
      expectedFiles: JSON.stringify(['src/schemas/user.ts', 'src/routes/user.ts', 'tsconfig.json', 'package.json'])
    }
  });

  await prisma.mission.create({
    data: {
      targetSkill: 'State Management & UI Performance',
      title: 'Implement Optimistic UI & Infinite Scroll Cache',
      description: 'Build an offline-resilient feed interface with TanStack Query / Zustand, handling optimistic comment posting and pagination cache invalidation.',
      difficulty: 'ADVANCED',
      relatedRoleId: fullstackRole.id,
      estimatedHours: 4,
      starterRepoUrl: 'https://github.com/skilltwin-templates/optimistic-ui-starter',
      checklistItems: JSON.stringify([
        { id: 'st_1', text: 'State store with optimistic mutation rollbacks', points: 40, rulePattern: 'store' },
        { id: 'st_2', text: 'Infinite scroll virtualized list component', points: 30, rulePattern: 'component' },
        { id: 'st_3', text: 'Automated hook tests simulating network latency', points: 30, rulePattern: 'test' }
      ]),
      expectedFiles: JSON.stringify(['src/store/useStore.js', 'src/components/Feed.jsx', 'tests/store.test.js', 'README.md'])
    }
  });

  // Cloud DevOps Missions
  await prisma.mission.create({
    data: {
      targetSkill: 'CI/CD Pipelines & Automation',
      title: 'Automate Multi-Environment CI/CD with GitHub Actions',
      description: 'Create a robust GitHub Actions workflow that executes linting, unit tests, Docker container builds, security scans (Trivy), and staging deployment.',
      difficulty: 'INTERMEDIATE',
      relatedRoleId: devopsRole.id,
      estimatedHours: 3,
      starterRepoUrl: 'https://github.com/skilltwin-templates/github-actions-ci',
      checklistItems: JSON.stringify([
        { id: 'ci_1', text: 'GitHub Actions workflow YAML file in .github/workflows', points: 40, rulePattern: 'workflow' },
        { id: 'ci_2', text: 'Automated test execution and Docker build matrix step', points: 30, rulePattern: 'dockerfile' },
        { id: 'ci_3', text: 'README documenting pipeline environment variables and badges', points: 30, rulePattern: 'readme' }
      ]),
      expectedFiles: JSON.stringify(['.github/workflows/ci.yml', 'Dockerfile', 'tests/app.test.js', 'README.md'])
    }
  });

  await prisma.mission.create({
    data: {
      targetSkill: 'Kubernetes & Orchestration',
      title: 'Deploy Microservices Cluster to Kubernetes with Helm',
      description: 'Write Helm chart templates for Deployment, ClusterIP Service, ConfigMap, and Ingress with Horizontal Pod Autoscaling (HPA).',
      difficulty: 'ADVANCED',
      relatedRoleId: devopsRole.id,
      estimatedHours: 5,
      starterRepoUrl: 'https://github.com/skilltwin-templates/helm-k8s-starter',
      checklistItems: JSON.stringify([
        { id: 'k8s_1', text: 'Helm Chart.yaml and values.yaml definitions', points: 35, rulePattern: 'chart' },
        { id: 'k8s_2', text: 'Kubernetes Deployment and Service YAML manifests', points: 35, rulePattern: 'deployment' },
        { id: 'k8s_3', text: 'Ingress and Horizontal Pod Autoscaler configuration', points: 30, rulePattern: 'hpa' }
      ]),
      expectedFiles: JSON.stringify(['helm/Chart.yaml', 'helm/values.yaml', 'helm/templates/deployment.yaml', 'README.md'])
    }
  });

  await prisma.mission.create({
    data: {
      targetSkill: 'Infrastructure as Code (Terraform)',
      title: 'Provision Cloud VPC & Database Cluster with Terraform',
      description: 'Author reusable Terraform modules to provision isolated public/private subnets, security groups, and an encrypted PostgreSQL database instance.',
      difficulty: 'ADVANCED',
      relatedRoleId: devopsRole.id,
      estimatedHours: 4,
      starterRepoUrl: 'https://github.com/skilltwin-templates/terraform-vpc-starter',
      checklistItems: JSON.stringify([
        { id: 'tf_1', text: 'Terraform main.tf and variables.tf with provider config', points: 40, rulePattern: 'terraform' },
        { id: 'tf_2', text: 'Modular VPC and Database resource declarations', points: 30, rulePattern: 'module' },
        { id: 'tf_3', text: 'README with `terraform plan` execution proof and diagrams', points: 30, rulePattern: 'readme' }
      ]),
      expectedFiles: JSON.stringify(['main.tf', 'variables.tf', 'outputs.tf', 'modules/vpc/main.tf', 'README.md'])
    }
  });

  await prisma.mission.create({
    data: {
      targetSkill: 'Linux & Bash Scripting',
      title: 'Author Automated Log Rotation & Server Health Daemon',
      description: 'Write POSIX-compliant Bash automation scripts for log rotation, disk memory threshold alerting, and systemd service management.',
      difficulty: 'BEGINNER',
      relatedRoleId: devopsRole.id,
      estimatedHours: 2,
      starterRepoUrl: 'https://github.com/skilltwin-templates/bash-monitor-starter',
      checklistItems: JSON.stringify([
        { id: 'sh_1', text: 'Shell script with robust error handling (`set -euo pipefail`)', points: 40, rulePattern: 'sh' },
        { id: 'sh_2', text: 'Systemd service unit file definition', points: 30, rulePattern: 'service' },
        { id: 'sh_3', text: 'README documenting cron / systemd installation', points: 30, rulePattern: 'readme' }
      ]),
      expectedFiles: JSON.stringify(['monitor.sh', 'skilltwin-monitor.service', 'tests/test_monitor.sh', 'README.md'])
    }
  });

  // Data Analyst Missions
  await prisma.mission.create({
    data: {
      targetSkill: 'Python for Data Analysis',
      title: 'Automate Exploratory Data Analysis & Anomaly Detection',
      description: 'Write a reproducible Python data cleaning pipeline using Pandas, NumPy, and Scikit-Learn to detect revenue fraud anomalies.',
      difficulty: 'INTERMEDIATE',
      relatedRoleId: dataRole.id,
      estimatedHours: 3,
      starterRepoUrl: 'https://github.com/skilltwin-templates/python-eda-starter',
      checklistItems: JSON.stringify([
        { id: 'py_1', text: 'Python data processing script with Pandas dataframes', points: 40, rulePattern: 'py' },
        { id: 'py_2', text: 'Jupyter notebook or Markdown visual summary', points: 30, rulePattern: 'notebook' },
        { id: 'py_3', text: 'requirements.txt and automated unit tests with pytest', points: 30, rulePattern: 'test' }
      ]),
      expectedFiles: JSON.stringify(['src/pipeline.py', 'notebooks/analysis.ipynb', 'requirements.txt', 'tests/test_pipeline.py'])
    }
  });

  await prisma.mission.create({
    data: {
      targetSkill: 'Business Intelligence & Dashboards',
      title: 'Design Interactive Cohort LTV & Retention Dashboard',
      description: 'Build an executive analytics dashboard tracking monthly active users, customer acquisition cost, and churn cohorts.',
      difficulty: 'INTERMEDIATE',
      relatedRoleId: dataRole.id,
      estimatedHours: 3,
      starterRepoUrl: 'https://github.com/skilltwin-templates/bi-dashboard-starter',
      checklistItems: JSON.stringify([
        { id: 'bi_1', text: 'Dashboard data ingestion script or SQL views', points: 40, rulePattern: 'sql' },
        { id: 'bi_2', text: 'Interactive chart visualizations and filtering controls', points: 30, rulePattern: 'dashboard' },
        { id: 'bi_3', text: 'Executive insights narrative and documentation', points: 30, rulePattern: 'readme' }
      ]),
      expectedFiles: JSON.stringify(['views/cohort_retention.sql', 'src/dashboard.js', 'README.md'])
    }
  });

  await prisma.mission.create({
    data: {
      targetSkill: 'ETL Pipelines & Data Quality',
      title: 'Build Automated dbt Transformation & Data Quality Suite',
      description: 'Author dbt models with staging, intermediate, and marts layers, incorporating schema tests and freshness alerts.',
      difficulty: 'ADVANCED',
      relatedRoleId: dataRole.id,
      estimatedHours: 4,
      starterRepoUrl: 'https://github.com/skilltwin-templates/dbt-analytics-starter',
      checklistItems: JSON.stringify([
        { id: 'dbt_1', text: 'dbt_project.yml and staging SQL models', points: 40, rulePattern: 'sql' },
        { id: 'dbt_2', text: 'Schema YAML tests (unique, not_null, accepted_values)', points: 30, rulePattern: 'schema' },
        { id: 'dbt_3', text: 'README documenting data lineage and execution commands', points: 30, rulePattern: 'readme' }
      ]),
      expectedFiles: JSON.stringify(['dbt_project.yml', 'models/staging/stg_users.sql', 'models/schema.yml', 'README.md'])
    }
  });

  // 3. Create Demo Users & Digital Twins
  console.log('Creating Demo Personas & Student Profiles...');

  // Persona 1: Alex Chen (Aspiring Backend Engineer - Mid Readiness)
  const alexUser = await prisma.user.create({
    data: {
      name: 'Alex Chen',
      email: 'student@skilltwin.dev',
      passwordHash,
      role: 'STUDENT'
    }
  });

  const alexProfile = await prisma.studentProfile.create({
    data: {
      userId: alexUser.id,
      degree: 'B.S. in Computer Science (Junior)',
      academicSubjects: JSON.stringify(['Data Structures', 'Algorithms', 'Database Management Systems', 'Computer Networks']),
      languages: JSON.stringify(['Java', 'Python', 'SQL', 'JavaScript']),
      dsaProblemsSolved: 165,
      projects: JSON.stringify([
        {
          title: 'Distributed Key-Value Store',
          techStack: ['Java', 'REST APIs', 'Relational Databases & SQL'],
          complexity: 'INTERMEDIATE',
          repoUrl: 'https://github.com/alexchen/distributed-kv',
          description: 'Multi-threaded key-value store with replication and write-ahead log.'
        },
        {
          title: 'Campus Course Registration API',
          techStack: ['Node.js', 'REST APIs', 'PostgreSQL'],
          complexity: 'INTERMEDIATE',
          repoUrl: 'https://github.com/alexchen/course-reg-api',
          description: 'RESTful API with JWT auth and concurrent enrollment transaction isolation.'
        }
      ]),
      certifications: JSON.stringify(['AWS Certified Cloud Practitioner']),
      githubUrl: 'https://github.com/alexchen',
      targetRoleId: backendRole.id
    }
  });

  // Alex Skill Graph
  await prisma.skillGraph.createMany({
    data: [
      { studentProfileId: alexProfile.id, skillName: 'Relational Databases & SQL', currentScore: 78, lastEvidence: 'Project: Campus Course Registration API + DBMS Course' },
      { studentProfileId: alexProfile.id, skillName: 'REST APIs', currentScore: 75, lastEvidence: 'Project: Campus Course Registration API' },
      { studentProfileId: alexProfile.id, skillName: 'Data Structures & Algorithms', currentScore: 68, lastEvidence: 'DSA: 165 problems solved on LeetCode' },
      { studentProfileId: alexProfile.id, skillName: 'System Design & Concurrency', currentScore: 52, lastEvidence: 'Project: Distributed Key-Value Store' },
      { studentProfileId: alexProfile.id, skillName: 'Git & Version Control', currentScore: 70, lastEvidence: 'Active GitHub repository history' },
      { studentProfileId: alexProfile.id, skillName: 'Docker & Containerization', currentScore: 25, lastEvidence: 'Self-assessment baseline' }
    ]
  });

  // Alex Readiness History (Simulate learning progress)
  await prisma.readinessScoreHistory.createMany({
    data: [
      { studentProfileId: alexProfile.id, score: 42, computedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) },
      { studentProfileId: alexProfile.id, score: 50, computedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      { studentProfileId: alexProfile.id, score: 58, computedAt: new Date() }
    ]
  });

  // Persona 2: Sarah Miller (Aspiring Full-Stack Developer - High Readiness)
  const sarahUser = await prisma.user.create({
    data: {
      name: 'Sarah Miller',
      email: 'sarah@skilltwin.dev',
      passwordHash,
      role: 'STUDENT'
    }
  });

  const sarahProfile = await prisma.studentProfile.create({
    data: {
      userId: sarahUser.id,
      degree: 'B.S. in Software Engineering (Senior)',
      academicSubjects: JSON.stringify(['Web Development', 'Human Computer Interaction', 'Database Systems', 'Cloud Computing']),
      languages: JSON.stringify(['TypeScript', 'JavaScript', 'Python', 'HTML/CSS']),
      dsaProblemsSolved: 240,
      projects: JSON.stringify([
        {
          title: 'Collaborative Real-Time Whiteboard',
          techStack: ['React & Modern Frontend', 'TypeScript & Type Safety', 'State Management & UI Performance'],
          complexity: 'ADVANCED',
          repoUrl: 'https://github.com/sarahmiller/collab-board',
          description: 'CRDT-based collaborative canvas with optimistic UI updates and WebSockets.'
        },
        {
          title: 'SaaS Billing & Subscription Portal',
          techStack: ['React & Modern Frontend', 'REST APIs', 'Relational Databases & SQL'],
          complexity: 'INTERMEDIATE',
          repoUrl: 'https://github.com/sarahmiller/saas-billing',
          description: 'Full-stack customer portal with Stripe webhooks and PostgreSQL.'
        }
      ]),
      certifications: JSON.stringify(['Meta Front-End Developer Professional Certificate']),
      githubUrl: 'https://github.com/sarahmiller',
      targetRoleId: fullstackRole.id
    }
  });

  await prisma.skillGraph.createMany({
    data: [
      { studentProfileId: sarahProfile.id, skillName: 'React & Modern Frontend', currentScore: 88, lastEvidence: 'Project: Collaborative Whiteboard + Meta Front-End Cert' },
      { studentProfileId: sarahProfile.id, skillName: 'REST APIs', currentScore: 82, lastEvidence: 'Project: SaaS Billing Portal' },
      { studentProfileId: sarahProfile.id, skillName: 'TypeScript & Type Safety', currentScore: 85, lastEvidence: 'Project: Collaborative Whiteboard' },
      { studentProfileId: sarahProfile.id, skillName: 'Relational Databases & SQL', currentScore: 78, lastEvidence: 'Project: SaaS Billing Portal + Database Course' },
      { studentProfileId: sarahProfile.id, skillName: 'State Management & UI Performance', currentScore: 84, lastEvidence: 'Project: Collaborative Whiteboard' },
      { studentProfileId: sarahProfile.id, skillName: 'Git & Version Control', currentScore: 85, lastEvidence: 'Active GitHub repository portfolio' }
    ]
  });

  await prisma.readinessScoreHistory.createMany({
    data: [
      { studentProfileId: sarahProfile.id, score: 68, computedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000) },
      { studentProfileId: sarahProfile.id, score: 76, computedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
      { studentProfileId: sarahProfile.id, score: 86, computedAt: new Date() }
    ]
  });

  // Persona 3: Jordan Lee (Aspiring DevOps Engineer - Beginner)
  const jordanUser = await prisma.user.create({
    data: {
      name: 'Jordan Lee',
      email: 'dev@skilltwin.dev',
      passwordHash,
      role: 'STUDENT'
    }
  });

  const jordanProfile = await prisma.studentProfile.create({
    data: {
      userId: jordanUser.id,
      degree: 'B.S. in Information Systems (Sophomore)',
      academicSubjects: JSON.stringify(['Operating Systems', 'Linux Administration']),
      languages: JSON.stringify(['Bash', 'Python', 'Go']),
      dsaProblemsSolved: 40,
      projects: JSON.stringify([
        {
          title: 'Linux Server Automation Scripts',
          techStack: ['Linux & Bash Scripting'],
          complexity: 'BEGINNER',
          repoUrl: 'https://github.com/jordanlee/server-scripts',
          description: 'Bash utility scripts for automated backups and system health logging.'
        }
      ]),
      certifications: JSON.stringify(['Linux Foundation Certified Associate']),
      githubUrl: 'https://github.com/jordanlee',
      targetRoleId: devopsRole.id
    }
  });

  await prisma.skillGraph.createMany({
    data: [
      { studentProfileId: jordanProfile.id, skillName: 'Linux & Bash Scripting', currentScore: 65, lastEvidence: 'Project: Linux Server Automation Scripts' },
      { studentProfileId: jordanProfile.id, skillName: 'Git & Version Control', currentScore: 50, lastEvidence: 'GitHub repository history' },
      { studentProfileId: jordanProfile.id, skillName: 'Docker & Containerization', currentScore: 30, lastEvidence: 'Self-assessment baseline' },
      { studentProfileId: jordanProfile.id, skillName: 'CI/CD Pipelines & Automation', currentScore: 25, lastEvidence: 'Self-assessment baseline' },
      { studentProfileId: jordanProfile.id, skillName: 'Kubernetes & Orchestration', currentScore: 15, lastEvidence: 'Self-assessment baseline' },
      { studentProfileId: jordanProfile.id, skillName: 'Infrastructure as Code (Terraform)', currentScore: 10, lastEvidence: 'Self-assessment baseline' }
    ]
  });

  await prisma.readinessScoreHistory.create({
    data: {
      studentProfileId: jordanProfile.id,
      score: 36,
      computedAt: new Date()
    }
  });

  // Persona 4: Prof. Davis (College Administrator)
  await prisma.user.create({
    data: {
      name: 'Prof. Marcus Davis',
      email: 'admin@skilltwin.dev',
      passwordHash,
      role: 'COLLEGE_ADMIN'
    }
  });

  console.log('✅ Seeding completed successfully!');
  console.log('----------------------------------------------------');
  console.log('Demo Credentials:');
  console.log('1. Alex Chen   (Student - Backend)   : student@skilltwin.dev / password123');
  console.log('2. Sarah Miller (Student - Full-Stack): sarah@skilltwin.dev   / password123');
  console.log('3. Jordan Lee  (Student - DevOps)    : dev@skilltwin.dev     / password123');
  console.log('4. Prof. Davis (College Admin)       : admin@skilltwin.dev   / password123');
  console.log('----------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
