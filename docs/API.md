# API Specification — SkillTwin

## Base URL
`/api`

## Authentication
Bearer token in `Authorization: Bearer <token>` header.

---

## Endpoints

### 1. Auth & Personas
- `POST /api/auth/register` — Register student or admin.
- `POST /api/auth/login` — Login with email/password; returns JWT and user profile.
- `GET /api/auth/me` — Retrieve current authenticated user session.
- `GET /api/auth/demo-users` — Retrieve demo personas for 1-click quick testing.

### 2. Roles & Benchmarks
- `GET /api/roles` — List all target roles with skill requirement benchmarks.
- `GET /api/roles/:id` — Get specific role details and required skills.

### 3. Student Profile & Digital Twin
- `GET /api/profile/me` — Fetch authenticated student profile, active target role, and readiness history.
- `PUT /api/profile/me` — Update student profile (languages, projects, DSA count, certifications, target role); automatically recalculates skill graph and readiness score.
- `GET /api/skills/graph` — Retrieve student's current skill graph and gap ranking against target role.

### 4. Missions & Evidence Submission
- `GET /api/missions` — List available missions (filter by role, skill, difficulty).
- `GET /api/missions/:id` — Get mission details and rubric checklist.
- `POST /api/missions/:id/submit` — Submit evidence URL (GitHub repository or test artifact); triggers automated rubric evaluation, awards score delta, updates skill graph, and logs score history.
- `GET /api/missions/history/me` — Retrieve submission and evaluation history for current student.

### 5. College Admin Analytics
- `GET /api/admin/cohort-stats` — Cohort average readiness score, student count, role distribution, and institutional skill gap frequency heatmap.
- `GET /api/admin/students` — Searchable and filterable student roster with readiness scores and recent activity.
- `GET /api/admin/students/:id` — Detailed drilldown of an individual student's skill graph and mission history.
