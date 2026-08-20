# SkillTwin — Full Build Prompt

Copy everything below the line into Claude Code (or another AI coding agent) to scaffold and build the SkillTwin MVP end to end.

---

## PROMPT START

You are an experienced senior full-stack engineer. Build **SkillTwin**, a career-readiness web app, as a working MVP. Think through architecture before coding, work incrementally, and install any missing dependencies as you go. Prioritize a demo-ready, reliable core loop over broad feature coverage.

### 1. Product Summary

SkillTwin gives every student a "digital twin" of their skills — a scored, evidence-backed profile that is continuously compared against real industry requirements for their target career. Instead of recommending generic courses, it detects the student's highest-priority skill gaps and generates concrete, hands-on missions to close them, then re-scores the student based on submitted evidence.

**Core loop:**
```
Student Profile → Skill Graph → Compare vs Target Role Requirements
→ Detect & Prioritize Gaps → Generate Mission → Student Submits Evidence
→ Rubric-Based Evaluation → Update Skill Graph → repeat
```

**Tagline:** "Know what you know. Fix what you don't."

### 2. Explicit Scope Boundary (read carefully)

Build the **honest, demo-able MVP**, not the aspirational full vision. Do NOT attempt:
- LLM-based resume/GitHub scraping or parsing
- Deep static/dynamic code analysis of submitted repos
- Any trained ML model

Instead, use:
- **Structured manual input forms** for student profile data (no scraping)
- **A static, hand-authored JSON dataset** of target-role skill requirements (e.g., Backend Engineer, Full-Stack Developer, Data Analyst — pick 3–5 roles)
- **Rule-based scoring** (simple arithmetic, not ML) for gap detection and prioritization
- **A rubric checklist evaluator** for mission submissions (e.g., "does this repo contain a Dockerfile?", "does docker-compose.yml exist?", "is there a /tests folder?") — checked via simple file-presence/pattern rules, not AI judgment

This scope must be clearly reflected in the code comments and README, so it's obvious what's real vs. roadmap.

### 3. Tech Stack

- **Frontend:** React (Vite), Tailwind CSS
- **Backend:** Node.js + Express (or FastAPI if you prefer Python — pick one and be consistent)
- **Database:** PostgreSQL (or SQLite for local/demo simplicity — use SQLite by default so it runs with zero setup, but structure the schema/ORM so swapping to Postgres later is trivial)
- **ORM:** Prisma (Node) or SQLAlchemy (Python)
- **Auth:** Simple email/password with JWT (no need for OAuth in MVP)
- **State management:** React Context or Zustand (keep it lightweight)

### 4. Data Model

Design and implement these entities:

```
User
 - id, name, email, password_hash, role (student | college_admin), created_at

StudentProfile
 - id, user_id, degree, academic_subjects[], languages[], 
   dsa_problems_solved, projects[], certifications[], 
   github_url, target_role_id

TargetRole
 - id, name (e.g. "Backend Software Engineer")
 - skill_requirements: { skill_name: required_percentage }[]

SkillGraph
 - id, student_profile_id, skill_name, current_score (0-100), 
   last_evidence, last_updated

Mission
 - id, target_skill, title, description, checklist_items[], 
   difficulty, related_role_id

MissionSubmission
 - id, mission_id, student_profile_id, submission_url, 
   status (pending | evaluated), rubric_results (json), 
   score_delta, submitted_at, evaluated_at

ReadinessScoreHistory
 - id, student_profile_id, score, computed_at
```

### 5. Core Features to Build

**A. Student Onboarding**
- Signup/login
- Profile creation form: degree, subjects, languages, DSA count, projects (repeatable fields), certifications, GitHub URL, target role dropdown

**B. Skill Graph Engine**
- On profile submit/update, compute an initial `SkillGraph` using a deterministic rule set you define (e.g., DSA score derived from problems-solved bucketed into a 0–100 scale; project count/type maps to relevant skill boosts). Document the rules clearly in code comments — they are intentionally simple heuristics, not ML.

**C. Gap Detection & Prioritization**
- For the student's selected `TargetRole`, compute `gap = required - current` per skill
- Compute `priority_score = gap × industry_importance_weight × career_relevance_weight` (define importance/relevance as static weights per skill per role in the seed dataset)
- Return gaps sorted by priority_score descending

**D. Mission Generation**
- Seed a `missions` table with 3–5 hand-authored missions per target role, each mapped to a specific skill and containing a checklist (e.g., Docker mission → ["Dockerfile present", "docker-compose.yml present", "README with run instructions"])
- When a student views their top-priority gap, surface the matching mission

**E. Evidence Submission & Rubric Evaluation**
- Student submits a GitHub repo URL (or file upload as fallback) for a mission
- Backend runs a **simple, deterministic checklist evaluator**: e.g., clone or fetch repo file listing via GitHub API, check for presence of expected filenames/patterns from the mission's checklist
- Compute how many checklist items passed → score_delta
- Update the student's `SkillGraph` for that skill and log a new `ReadinessScoreHistory` entry

**F. Career Readiness Score**
- `readiness_score = weighted average of all SkillGraph scores vs the target role's requirements`
- Show before/after when missions are completed
- UI must include a visible disclaimer: "This is a readiness indicator based on demonstrated evidence, not a guarantee of employment."

**G. Student Dashboard**
- Readiness score (large, prominent)
- Skill graph as a bar/radar chart (current vs required)
- Ranked list of priority gaps
- Active/available missions
- Mission history with score deltas

**H. College Admin Dashboard**
- List of students in the cohort with readiness scores
- Aggregate view: most common skill gaps across the cohort
- Filter/sort by target role, readiness score, last activity

### 6. Non-Functional Requirements
- Seed script that populates: 3–5 target roles, their skill requirement weights, 3–5 missions each, and 2–3 demo student accounts with realistic pre-filled profiles (so the app is demoable immediately after `npm run seed`)
- Basic input validation and error handling on all forms and API routes
- README with: setup instructions, architecture overview, explicit "MVP scope vs future roadmap" section (mirror the scope boundary from section 2), and how to run the seed/demo data
- Reasonably clean component structure — don't over-engineer, but don't put everything in one file either

### 7. Explicitly Out of Scope for This Build
State these clearly in the README as "Not implemented — roadmap":
- LLM-based resume/code parsing and evidence scoring
- Real job-market data ingestion (live scraping of job postings)
- Payment/subscription billing integration
- Company-facing recruiter portal

### 8. Delivery
- Working local dev setup (`npm install && npm run seed && npm run dev` or equivalent)
- All core loop steps (A through G above) functioning end-to-end with seed data
- Short README covering setup, architecture, and scope boundary

Build this now — plan the file/folder structure first, then implement incrementally (data models → seed data → backend routes → frontend screens → wire together), testing the core loop after each major step.

## PROMPT END
