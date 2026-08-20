# Architectural Decisions Record — SkillTwin

## 1. SQLite with Prisma ORM
- **Decision:** Use SQLite for local development and demos, orchestrated through Prisma ORM.
- **Alternatives Considered:** PostgreSQL Docker container, MongoDB.
- **Rationale:** Zero setup friction. Any evaluator or judge can clone the repo and run `npm run seed && npm run dev` immediately without starting database daemons. Upgrading to PostgreSQL in production is a single line change in `schema.prisma`.

## 2. Deterministic Rule-Based Scoring vs. Black-Box ML
- **Decision:** Use transparent, reproducible arithmetic heuristics for initial skill graph generation and gap prioritization.
- **Rationale:** Honest MVP scope boundary. Explainable metrics build trust with both students and college admins. Real ML models add latency and non-determinism during live hackathon demonstrations.

## 3. Rubric Checklist Evaluator vs. Complex Code Sandbox
- **Decision:** Validate mission submissions by evaluating expected file artifacts, configuration manifests, test suites, and structural patterns.
- **Rationale:** Avoids slow, unsafe arbitrary code execution sandboxes while reliably checking hands-on evidence (e.g. presence of `Dockerfile`, multi-stage builds, unit test directories, documentation).

## 4. Single-Port / Concurrently Development Experience
- **Decision:** Provide a root `package.json` with `concurrently` that launches backend on port 5000 and frontend on port 5173 with Vite proxying `/api` requests.
- **Rationale:** Seamless developer experience; one command starts the complete system.
