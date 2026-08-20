# SkillTwin — Career-Readiness Digital Twin & Evidence Engine

> **Tagline:** *"Know what you know. Fix what you don't."*

SkillTwin gives every student a **"digital twin"** of their skills — a scored, evidence-backed profile continuously benchmarked against real industry requirements for their target career. Instead of recommending generic, passive video tutorials, SkillTwin detects the student's highest-priority skill gaps and evaluates concrete, hands-on missions to dynamically update the student's readiness telemetry.

---

## Quickstart (Zero-Setup Local Run)

SkillTwin runs with **zero database configuration** (portable persistent SQLite layer with 100% cross-platform compatibility).

### 1. Install & Seed
```bash
# Clone or open repository root
npm run install:all    # Installs root, server, and client dependencies
npm run seed           # Populates 4 roles, 16 missions, and 4 demo personas
```

### 2. Start Application
```bash
npm run dev            # Starts backend API (port 5000) and frontend (port 5173)
```

Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 1-Click Live Demo Personas

The login screen features instant **1-Click Quick Demo Login** buttons for judges and evaluators:

| Persona | Email / Password | Role & Stage | Key Focus Area |
|---|---|---|---|
| **Alex Chen** | `student@student.dev` / `password123` | Student • **58% Readiness** | Aspiring Backend Engineer with high DSA (165 solved) but critical Docker & System Design gaps. |
| **Sarah Miller** | `sarah@skilltwin.dev` / `password123` | Student • **86% Readiness** | Aspiring Full-Stack Developer with comprehensive React, TypeScript, and state management portfolio. |
| **Jordan Lee** | `dev@skilltwin.dev` / `password123` | Student • **36% Readiness** | Early-stage Cloud DevOps Engineer starting with Linux/Bash and CI/CD pipelines. |
| **Prof. Marcus Davis** | `admin@skilltwin.dev` / `password123` | **College Administrator** | Institutional cockpit viewing cohort average readiness (60%), institutional skill gap heatmaps, and candidate roster. |

---

## The Core Loop

```
Student Profile ──► Skill Graph ──► Compare vs Target Role Benchmarks
        ▲                                                │
        │                                                ▼
  Update Twin ◄── Rubric Evaluation ◄── Evidence Repo ◄── Detect & Prioritize Gaps
  (+20 pts)       (Dockerfile, tests)   Submission        (gap × importance × relevance)
```

1. **Student Profile:** Captures academic coursework, languages, DSA problem milestones, verified project repositories, and certifications.
2. **Deterministic Skill Engine:** Heuristic algorithm translates evidence into normalized 0–100 competencies across core engineering skills.
3. **Gap Prioritization:** Computes mathematical urgency:
   $$\text{priority\_score} = \text{gap} \times \text{industry\_importance\_weight} \times \text{career\_relevance\_weight}$$
4. **Hands-On Missions:** Surfaces target-role missions with explicit checklist criteria (e.g. multi-stage Docker builds, SQL schema indexing, CI/CD automation).
5. **Rubric Evaluator:** Deterministically inspects submitted repository structures for required artifacts, test suites, and configurations.
6. **Dynamic Rescoring:** Awards points (+10 to +25 pts), logs historic readiness growth, and updates college admin telemetry.

---

## Architecture & Technology Stack

```
[ React 18 + Vite + Tailwind CSS + Recharts ] (Port 5173)
                     │
                     │ HTTP REST API (JWT Authenticated)
                     ▼
[ Express.js + Node.js API Server ] (Port 5000)
   ├── Skill Graph Computation Engine (Heuristic Arithmetic)
   ├── Gap Prioritization Engine
   ├── Rubric-Based Repository Evaluator (GitHub Tree & Mock Verification)
   └── Persistent Relational Data Store (SQLite / JSON)
```

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React, Recharts (Radar, Area, Bar charts), Canvas Confetti, Axios.
- **Backend:** Node.js, Express, JWT, bcryptjs, Prisma ORM schema.
- **Persistence:** Zero-native-dependency SQLite / persistent JSON store (`server/prisma/dev-store.json`).

---

## MVP Scope Boundary vs Future Roadmap

To ensure high reliability during live judging, SkillTwin implements an **honest, verifiable MVP scope**:

### Implemented in MVP:
- Structured manual input forms for student profile evidence (coursework, DSA counts, projects, certifications).
- Curated static dataset of 4 target industry roles with explicit requirement weights.
- Transparent, deterministic arithmetic heuristics for skill calculation and gap prioritization.
- Deterministic checklist rubric evaluator for repository file structures and test assertions.
- Prominent Career Readiness Score meter with legal disclaimer banner.
- Student cockpit with interactive Radar / Bar charts and historical growth trajectory.
- College Admin cockpit with cohort average readiness and institutional skill gap frequency heatmaps.

### Not Implemented (Future Roadmap):
- LLM-based arbitrary resume PDF parsing or hallucination-prone code evaluation.
- Live scraping of third-party job posting websites.
- Recruiter hiring & talent sourcing marketplace.
- Payment & subscription billing integrations.

---

## Running Tests

To run the backend deterministic scoring and rubric verification test suite:

```bash
npm test
```

Expected output:
```
✔ SkillEngine: calculateGaps correctly ranks gaps by priority_score = gap * importance * relevance
✔ SkillEngine: calculateReadinessScore returns normalized weighted percentage
✔ SkillEngine: computeSkillScoresFromProfile extracts deterministic evidence
✔ RubricEvaluator: checks checklist patterns and calculates score delta
ℹ pass 4, fail 0
```
