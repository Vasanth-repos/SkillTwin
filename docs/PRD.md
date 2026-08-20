# Product Requirements Document — SkillTwin

## Problem
College students and early-career software engineers struggle to know where they stand relative to real industry expectations. Generic course platforms recommend endless video tutorials, but lack personalized gap analysis and verifiable, hands-on evidence evaluation. College administrators lack aggregate visibility into cohort skill deficits.

## Target Users
1. **Students & Early Career Developers:** Looking for clear, honest benchmark scoring against target industry roles (e.g. Backend Engineer, Full-Stack Developer, Cloud DevOps Engineer) and concrete missions to close skill gaps.
2. **College / Bootcamp Administrators:** Looking for cohort-level skill telemetry to detect institutional gaps and improve placement readiness.

## Current Alternatives
- **LeetCode / HackerRank:** Only measures algorithmic DSA; ignores real-world systems, containerization, databases, architecture, and testing.
- **Coursera / Udemy:** Passive video watching without automated verification of hands-on project artifacts.
- **Resume Parsers:** Static keyword matching without deterministic skill verification.

## Proposed Solution
SkillTwin constructs a verified **"Digital Skill Twin"** for every student:
1. Profiles academic background, languages, DSA problem counts, projects, and certifications.
2. Computes an evidence-weighted **Skill Graph** (0–100 scale per skill).
3. Compares the student against static, hand-authored **Target Role Requirements**.
4. Automatically calculates and prioritizes skill gaps using:
   `priority_score = gap × industry_importance_weight × career_relevance_weight`
5. Generates targeted, hands-on **Missions** for top priority gaps.
6. Evaluates submitted repositories with an automated, deterministic **Rubric Evaluator** (inspecting required files, test suites, container configs, and documentation).
7. Dynamically updates the student's Skill Graph, logs **Readiness Score History**, and updates the College Admin aggregate analytics.

## Core Features (MVP)
- **Authentication & Multi-Persona Onboarding:** JWT-based login with student and college admin roles + 1-Click Demo Logins.
- **Skill Graph Heuristic Engine:** Deterministic mapping of student inputs into normalized skill competencies.
- **Gap Prioritization Engine:** Arithmetic priority scoring surfacing the highest-impact missing skills.
- **Mission Catalog & Generator:** Role-specific practical missions with clear checklists.
- **Automated Rubric Evaluation:** Repository tree checklist verification with score deltas and pass/fail feedback.
- **Career Readiness Score Meter:** Prominent weighted readiness percentage with historic trendline and legal disclaimers.
- **College Admin Cockpit:** Cohort average readiness, institutional skill gap heatmap, student roster search and drilldown.

## Future Features (Roadmap)
- LLM-based semantic code quality and architecture analysis.
- Live job market API scraping for real-time skill demand indexing.
- Direct LMS (Canvas / Blackboard) integration.
- Recruiter portal for verified candidate talent search.

## Success Criteria
- Instant zero-friction local run (`npm run seed && npm run dev`).
- Complete closed-loop demo: Profile → Gap Analysis → Mission Submission → Rubric Evaluation → Skill Graph Update.
- Sub-50ms API response times and responsive UI.
