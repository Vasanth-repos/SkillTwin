# Architecture Document — SkillTwin

## System Architecture

SkillTwin is architected as a decoupled client-server web application with a relational persistence layer:

```
[ Frontend (React + Vite + Tailwind) ]
                │
                │ HTTP REST (JSON / JWT)
                ▼
[ Backend (Express.js / Node.js) ]
  ├── Auth & Profile Services
  ├── Skill Graph Computation Engine (Deterministic Heuristics)
  ├── Gap Prioritization Engine (Weighted Arithmetic)
  └── Rubric-Based Repository Evaluator (GitHub Tree API / Mock Engine)
                │
                ▼
[ Database (Prisma ORM + SQLite / PostgreSQL ready) ]
```

## Components

### 1. Client (`client/`)
- Built with React 18, Vite, and Tailwind CSS.
- Visualization layer uses Recharts for Radar, Bar, and Line charts.
- State is managed via lightweight React Contexts (`AuthContext`, `SkillTwinContext`).
- Fully responsive across desktop, tablet, and mobile with accessibility (WCAG AA).

### 2. Server (`server/`)
- Express.js REST API with structured routing and middleware.
- JWT authentication with bcrypt password hashing.
- Role-based route guards (`STUDENT`, `COLLEGE_ADMIN`).

### 3. Business Logic Engines (`server/src/services/`)
- **`skillEngine.js`**:
  - `computeInitialSkillGraph(profile, targetRole)`: Evaluates academic courses, language proficiency, DSA problem milestones, project depth, and certifications.
  - `calculateGaps(skillGraph, targetRole)`: Computes `gap = max(0, required - current)` and `priority_score = gap × importance × relevance`.
  - `calculateReadinessScore(skillGraph, targetRole)`: Computes role-weighted readiness percentage.
- **`rubricEvaluator.js`**:
  - Validates repository structure against mission checklist criteria (e.g. `Dockerfile`, `docker-compose.yml`, `tests/`, `README.md`, `schema.sql`).
  - Calculates score deltas (+5 to +25) and emits rubric result breakdowns.

### 4. Database (`server/prisma/`)
- Entities: `User`, `StudentProfile`, `TargetRole`, `SkillGraph`, `Mission`, `MissionSubmission`, `ReadinessScoreHistory`.
- SQLite for local zero-config execution; fully compatible with PostgreSQL via Prisma provider swap.

## Data Flow (Core Loop)
1. User logs in (e.g. Alex Chen, Backend Student).
2. Client fetches student profile, active skill graph, and target role requirements.
3. Server executes `skillEngine` to calculate gap ranking and readiness score (e.g. 58%).
4. Student selects top-priority mission (e.g. "Containerize a Microservice with Docker").
5. Student submits evidence repository URL.
6. `rubricEvaluator` inspects the repository checklist, awarding points for verified artifacts.
7. Server updates `SkillGraph`, appends to `ReadinessScoreHistory`, and returns updated state.
8. Client renders visual celebration, increases readiness score, and updates radar/gap charts.
