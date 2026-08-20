# Changelog — SkillTwin

## [1.0.0-MVP] - 2026-08-20

### Added
- **Core Architecture & Scaffolding:** Initialized monorepo with Express backend, Prisma ORM, and React Vite frontend.
- **Antigravity Rule & Customization Framework:** Configured `.agents/` rules, skills (`hackathon-builder`, `ui-ux-reviewer`, `debugging`), agent `hackathon-judge`, and 6 workflow slash commands.
- **Data Model & Schema:** Prisma schema with `User`, `StudentProfile`, `TargetRole`, `SkillGraph`, `Mission`, `MissionSubmission`, and `ReadinessScoreHistory`.
- **Deterministic Skill Engine:** Heuristic algorithm for student profile scoring, target role gap prioritization (`gap × importance × relevance`), and career readiness score calculation.
- **Rubric Evaluator:** Automated checklist evaluator for GitHub repositories checking for required code artifacts, Dockerfiles, unit tests, and configs.
- **Seed Dataset:** 4 Target Roles, 16 hands-on missions, 3 pre-built student personas (Alex, Sarah, Jordan) with history and 1 college administrator persona (Prof. Davis).
- **Student Dashboard:** Interactive readiness gauge, Recharts radar and bar graphs, ranked priority gaps, mission catalog, live evidence submission modal with rubric animation and confetti.
- **College Admin Dashboard:** Cohort readiness distribution, institutional skill gap heatmap, searchable & filterable student roster with drilldown view.
- **Landing & Auth:** Modern landing page with value proposition and 1-Click Demo Login fast-switching.
