import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Target, 
  ShieldCheck, 
  Flame, 
  Zap, 
  GraduationCap, 
  Users, 
  ArrowRight,
  Award,
  Layers,
  BrainCircuit,
  BarChart3,
  CheckCircle2,
  BookOpen,
  Code2,
  Terminal,
  FileCode2
} from 'lucide-react';

const DEEP_DIVE_PITCH_SCENES = [
  {
    id: 'scene-1',
    act: 'ACT 1: THE ROOT PROBLEM',
    timestamp: '0:00 – 1:15',
    title: 'The Signaling Crisis & The $350$ LeetCode Paradox',
    subtitle: 'Why high algorithmic puzzle counts fail to predict real-world software engineering competency',
    speakerText: "Good morning, judges. In technical education, we face a profound evaluation mismatch that costs students job offers and leaves universities blind. Consider the typical story of Alex Chen, a top-performing final-year computer science student. Alex solved 350 LeetCode problems, maintained a strong GPA, watched over 100 hours of video courses, and listed twelve modern frameworks on his resume. Yet, in his very first technical interview for an entry-level Backend Engineer role, he was rejected in under twenty minutes. Why? Because when the interviewer asked him to write a multi-stage production Dockerfile, configure database connection pooling, and handle race conditions in Redis, Alex had never written those files in a real environment. The problem is that our current ecosystem relies on fragmented, unverified proxies. Competitive coding platforms measure puzzle-solving speed in synthetic environments. Course platforms measure passive video watch-time rather than code output. Resumes are filled with unverified claims that recruiters view with skepticism. And college placement cells discover these critical deficits only after their students fail campus interviews. Students don't need another video course. They need a system that tells them: What is my number one deficit right now, and how do I prove I have fixed it?",
    visualType: 'problem',
    badgeText: 'The Core Disconnect',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    deepDiveNotes: "Traditional platforms produce false confidence: solving 350 DSA puzzles demonstrates algorithmic familiarity, but hiring benchmarks require container orchestration, schema normalization, idempotency, and automated test suites.",
    keyPoints: [
      'Algorithmic Isolation: LeetCode tests synthetic isolated functions, ignoring software architecture',
      'Passive Video Metrics: Coursera and Udemy reward watch-time without verified code artifacts',
      'Unverified Resumes: Self-reported keywords lack verifiable cryptographic evidence or commit history',
      'Institutional Blindness: College placement cells lack continuous telemetry and discover gaps post-rejection'
    ]
  },
  {
    id: 'scene-2',
    act: 'ACT 2: THE SKILLTWIN SOLUTION',
    timestamp: '1:15 – 2:30',
    title: 'SkillTwin: The Living Digital Career Twin',
    subtitle: 'A continuous, evidence-backed competency modeling and evaluation engine',
    speakerText: "To solve this signaling crisis, we built SkillTwin. SkillTwin constructs a living, multi-dimensional Digital Skill Twin of a student that continuously benchmarks their demonstrated capabilities against hand-authored industry requirements for their target career. Rather than using black-box generative AI models that hallucinate career advice, SkillTwin operates on an explainable, deterministic four-stage feedback loop. Stage one is Evidence Ingestion: the platform normalizes heterogeneous profile evidence across academic coursework in Operating Systems and Databases, verified programming languages, competitive programming milestones, project repositories, and industry certifications into an auditable skill graph. Stage two is Mathematical Gap Prioritization: our engine ranks every skill deficit by mathematical urgency. Stage three is Hands-on Evidence Missions: the student receives practical engineering challenges designed to close their top deficit. And stage four is Deterministic Rubric Verification: our scanner inspects code manifests, Docker configurations, and unit test assertions, awarding score deltas and updating the student's Career Readiness Index in real time.",
    visualType: 'solution',
    badgeText: '4-Stage Continuous Loop',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    deepDiveNotes: "SkillTwin models candidate competencies as a normalized directed graph where nodes represent skills (0–100%) and edges represent requirement weights for specific target roles (Backend, Full-Stack, DevOps, Data Analyst).",
    keyPoints: [
      '1. Assess: Ingests 5 evidence streams into a normalized 0–100% competency graph',
      '2. Prioritize: Mathematically ranks skill deficits using industry and role weights',
      '3. Execute: Delivers practical engineering missions (Docker, SQL indexing, REST APIs)',
      '4. Verify & Rescore: Automated rubric scanner inspects code artifacts and updates readiness'
    ]
  },
  {
    id: 'scene-3',
    act: 'ACT 3: MATHEMATICAL FORMULATION',
    timestamp: '2:30 – 3:45',
    title: 'Mathematical Gap Prioritization & The Readiness Index',
    subtitle: '100% explainable, deterministic algorithms with anti-masking bounds',
    speakerText: "Let us examine the mathematical rigor behind SkillTwin. For any target career role, every required competency is defined by three parameters: the target percentage required for hiring readiness, an intrinsic industry importance weight between 1.0 and 2.0, and a role-specific relevance weight. The absolute gap is calculated as target percentage minus the student's current demonstrated score. The priority urgency score is the exact product of the gap multiplied by the industry weight multiplied by the career relevance weight. The skill with the highest priority score is designated as the student's number one critical deficit. Furthermore, our Career Readiness Index computes the weighted normalized percentage across all competencies. Crucially, each skill fulfillment ratio is mathematically bounded at 1.0. This prevents over-specialization—meaning solving a thousand DSA problems can never artificially mask a critical zero score in Docker or database systems.",
    visualType: 'math',
    badgeText: 'Mathematical Formulations',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    formula: 'Priority Score(s) = Gap(s) × W_industry(s) × W_relevance(s, r)',
    secondaryFormula: 'CRI(r) = [ Σ min(1.0, Score(s) / Req(s, r)) × (W_ind × W_rel) ] / Σ (W_ind × W_rel) × 100',
    deepDiveNotes: "The anti-masking bound guarantees that the readiness index accurately reflects balanced production readiness. No single over-developed skill can compensate for missing foundational prerequisites.",
    keyPoints: [
      'Tri-Factor Priority Formula: Ranks gaps by mathematical urgency: gap × industry weight × role relevance',
      'Anti-Masking Bound: Bounding ratio at 1.0 prevents high DSA scores from hiding missing systems skills',
      'Deterministic Reliability: The same evidence profile always produces the exact same score, zero drift',
      'Auditable Point Provenance: Every single point gained is mapped to a verified repository artifact'
    ]
  },
  {
    id: 'scene-4',
    act: 'ACT 4: LIVE STUDENT DEMONSTRATION',
    timestamp: '3:45 – 5:00',
    title: 'Live Core Loop Walkthrough: Alex Chen',
    subtitle: 'In-browser artifact editing, rubric inspection, and 30-day predictive trajectory modeling',
    speakerText: "Let us walk through Alex Chen's live Digital Twin on the platform. Alex is an aspiring Backend Software Engineer. SkillTwin analyzes his profile and scores his baseline readiness at 58%. Look at his competency radar chart: his Data Structures score is at 82% and SQL is at 78%, but his Docker score is only 35%. Our prioritization engine immediately flags Docker and Containerization as his number one critical deficit with a Priority Score of 72.8. Instead of generic tutorials, SkillTwin delivers an active challenge: Containerize an Express Service with a Multi-Stage Dockerfile. In our in-browser code editor, Alex inspects his Dockerfile, docker-compose configuration, and integration test suite. When he clicks 'Run Rubric Evaluator', our deterministic engine scans the manifest—verifying multi-stage build stages, non-root user security, and passing healthchecks. It awards plus 20 points, triggers celebration confetti, and instantly lifts his readiness from 58% to 66%. Alex can also open our Predictive Trajectory Simulator, sliding goal targets to project that completing two more missions will reach 82% Interview-Readiness within 30 days.",
    visualType: 'demo',
    badgeText: 'Live Student Cockpit',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    deepDiveNotes: "The direct in-browser editor eliminates local environment friction, allowing candidates and judges to test manifests in real time with instant rubric pass/fail feedback.",
    keyPoints: [
      'Baseline Diagnosis: 58% readiness with #1 critical gap in Docker (35% score, priority score 72.8)',
      'Targeted Mission: Multi-stage Docker build with non-root user and docker-compose healthchecks',
      'In-Browser Artifact Editor: Direct live editing of Dockerfile, docker-compose.yml, and unit tests',
      'Rubric Scanner: Validates checklist patterns, awards +20 points, and updates readiness to 66%',
      '30-Day Growth Forecaster: Interactive slider calculating exact trajectory curve to 82% readiness'
    ]
  },
  {
    id: 'scene-5',
    act: 'ACT 5: INSTITUTIONAL COCKPIT',
    timestamp: '5:00 – 6:15',
    title: 'The College Placement Cockpit & Curriculum Generator',
    subtitle: 'Institutional cohort heatmaps, automated 2-week lab syllabi, and directed faculty interventions',
    speakerText: "Now let us examine the institutional B2B interface built for college department chairs, deans, and placement directors. Switching personas to Professor Marcus Davis, the administrative dashboard provides real-time cohort telemetry. The Institutional Skill Gap Heatmap immediately exposes that 67% of the cohort lacks containerization and concurrency skills before companies arrive on campus for recruitment drives. With a single click on 'Generate Curriculum Intervention', SkillTwin synthesizes a tailored 2-Week Intensive Faculty Lab Syllabus covering lecture topics, multi-stage lab assignments, and automated grading rubrics. Furthermore, Professor Davis can dispatch a directed mission assignment to Alex Chen with a personalized coaching note: 'Alex, please complete the containerization mission before our mock campus technical interview on Friday', which appears immediately as a high-visibility faculty intervention banner on Alex's dashboard. Placement cells can also export a complete cohort readiness CSV in one click for academic accreditation.",
    visualType: 'admin',
    badgeText: 'Institutional B2B Intel',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    deepDiveNotes: "Colleges shift from passive observers to proactive educators: identifying cohort weaknesses weeks before placement drives and synthesizing actionable curriculum interventions automatically.",
    keyPoints: [
      'Institutional Heatmap: Real-time cohort deficit frequency across backend, full-stack, and DevOps',
      'Automated Syllabus Generator: 1-click synthesis of a 2-week intensive faculty laboratory workshop',
      'Directed Faculty Nudge Loop: Direct mission dispatch with custom instructor guidance notes',
      '1-Click Placement Telemetry Export: Full cohort readiness CSV for ABET and accreditation bodies'
    ]
  },
  {
    id: 'scene-6',
    act: 'ACT 6: ENTERPRISE BUSINESS MODEL & MOAT',
    timestamp: '6:15 – 7:15',
    title: 'B2B2C Business Model, Defensibility & Verifiable Credentials',
    subtitle: 'A high-retention SaaS flywheel powered by deterministic verifiable cryptographic credentials',
    speakerText: "Our business model is a high-retention B2B2C SaaS flywheel with three distinct revenue streams. First, for universities and colleges, we offer annual per-seat enterprise licensing for cohort analytics, curriculum intervention generators, and accreditation compliance. Second, for students, we provide a freemium model with premium mock interview defense simulations and verified cryptographic credentials. Third, for corporate recruiters, SkillTwin operates as a pre-verified talent discovery gateway, allowing employers to filter candidates by demonstrated skill thresholds rather than unverified resumes. Why is SkillTwin defensible? We deliberately chose deterministic heuristics over unconstrained generative AI. Our rubrics never hallucinate, our scoring is 100% reproducible, and our credentials carry verifiable SHA-256 evidence hashes formatted as ST-2026-VERIFIED with printable executive PDF summaries.",
    visualType: 'business',
    badgeText: 'Monetization & Defensibility',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    deepDiveNotes: "Recruiters bypass resume spam: candidate credentials link directly to verified code artifacts and checklist passes backed by SHA-256 evidence hashes.",
    keyPoints: [
      'Universities (B2B): Annual per-seat licensing for cohort analytics and placement rate improvement',
      'Students (Freemium): Free digital twin + premium mock interview defense and certificate export',
      'Corporate Recruiters (B2B): Direct access to candidates pre-verified by demonstrated code proof',
      'Cryptographic Credential: Deterministic SHA-256 certificate hashes with QR codes and PDF export'
    ]
  },
  {
    id: 'scene-7',
    act: 'ACT 7: VISION, RAPID Q&A & CLOSING',
    timestamp: '7:15 – 8:15',
    title: 'Transforming Technical Education & Rapid Judge Defense',
    subtitle: 'Closing the loop between university education and software engineering careers',
    speakerText: "In conclusion: Over the past decade, educational technology focused on digitizing content into video lectures. SkillTwin is digitizing competency, evidence, and career readiness. We transform students from passive video consumers into confident, evidence-backed software engineers who walk into technical interviews with verifiable proof of their abilities. Before taking your questions, let us address three common considerations: First, why not use an unconstrained LLM for grading? Because LLMs suffer from prompt injection and grading drift; universities demand deterministic, explainable rubrics. Second, how do we prevent cheating? Submissions require multi-file code artifacts backed by our 'Skill Defense' rapid scenario drills that quiz candidates on architectural trade-offs. Third, what is our deployment state? The entire platform is live on Vercel, deployed on GitHub Pages with an offline dual-mode engine, and verified by automated test suites. Thank you, and we welcome your questions.",
    visualType: 'vision',
    badgeText: 'The Winning Edge',
    badgeColor: 'bg-brand-500/20 text-brand-300 border-brand-500/40',
    deepDiveNotes: "SkillTwin is fully production-ready: monorepo Docker, GitHub Actions CI/CD pipeline, Vercel serverless integration, and 100% passing test suites.",
    keyPoints: [
      'Why Heuristics Over LLMs: Zero hallucinations, deterministic scoring, and auditable compliance',
      'Anti-Cheating Defense: Multi-factor rubric checks coupled with interactive Skill Defense trade-off drills',
      'Production-Ready: Live on Vercel & GitHub Pages with 100% automated test coverage',
      'Core Mission: Know what you know. Fix what you don’t.'
    ]
  }
];

export default function VideoPitchPlayerModal({ onClose }) {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [progressPercent, setProgressPercent] = useState(0);
  const [showDeepDive, setShowDeepDive] = useState(false);
  const timerRef = useRef(null);

  const scene = DEEP_DIVE_PITCH_SCENES[currentSceneIndex];
  
  // Dynamic scene duration calculated from word count (~130 words per min = ~2.15 words/sec)
  const wordCount = scene.speakerText.split(' ').length;
  const SCENE_DURATION_MS = Math.max(22000, Math.round((wordCount / 2.15) * 1000));

  const speakScene = (text) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (isPlaying) {
      speakScene(scene.speakerText);
      const startTime = Date.now();
      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const pct = Math.min(100, (elapsed / SCENE_DURATION_MS) * 100);
        setProgressPercent(pct);

        if (elapsed >= SCENE_DURATION_MS) {
          clearInterval(timerRef.current);
          if (currentSceneIndex + 1 < DEEP_DIVE_PITCH_SCENES.length) {
            setCurrentSceneIndex(prev => prev + 1);
            setProgressPercent(0);
          } else {
            setIsPlaying(false);
            setProgressPercent(100);
          }
        }
      }, 100);
    } else {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, [isPlaying, currentSceneIndex, voiceEnabled, SCENE_DURATION_MS]);

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrev = () => {
    setProgressPercent(0);
    if (currentSceneIndex > 0) {
      setCurrentSceneIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    setProgressPercent(0);
    if (currentSceneIndex + 1 < DEEP_DIVE_PITCH_SCENES.length) {
      setCurrentSceneIndex(prev => prev + 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentSceneIndex(0);
    setProgressPercent(0);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-slate-950/95 backdrop-blur-2xl overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-3 flex flex-col justify-between max-h-[95vh]">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-slate-800 bg-slate-950 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 via-pink-600 to-amber-500 flex items-center justify-center text-white shadow-lg">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-white">SkillTwin — In-Depth Master Video Pitch</span>
                <span className="text-[9px] font-mono uppercase bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full border border-rose-500/30">
                  Full Technical Reel
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-mono">{scene.act} • Scene {currentSceneIndex + 1} of {DEEP_DIVE_PITCH_SCENES.length} • {scene.timestamp}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDeepDive(!showDeepDive)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                showDeepDive ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300' : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{showDeepDive ? 'Hide Architecture Notes' : 'Architecture Notes'}</span>
            </button>

            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                voiceEnabled ? 'bg-brand-600/20 border-brand-500/40 text-brand-300' : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
              title={voiceEnabled ? 'Voiceover Active' : 'Voiceover Muted'}
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">{voiceEnabled ? 'Voiceover ON' : 'Muted'}</span>
            </button>

            <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Canvas Stage */}
        <div className="p-5 sm:p-7 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 overflow-y-auto flex-1 flex flex-col justify-between relative space-y-4">
          
          {/* Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Slide Header */}
          <div className="space-y-1 relative z-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-2">
              <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${scene.badgeColor}`}>
                {scene.badgeText}
              </span>
              <span className="text-xs font-mono text-cyan-400 font-semibold">{scene.timestamp}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {scene.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-3xl">
              {scene.subtitle}
            </p>
          </div>

          {/* Architecture Notes Box (if enabled) */}
          {showDeepDive && scene.deepDiveNotes && (
            <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-xs text-cyan-200 relative z-10 flex items-start gap-2 animate-in fade-in duration-200">
              <Terminal className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <p><strong>Architectural Rationale:</strong> {scene.deepDiveNotes}</p>
            </div>
          )}

          {/* Formulas if provided */}
          {scene.formula && (
            <div className="space-y-1.5 relative z-10">
              <div className="p-2.5 rounded-xl bg-brand-950/60 border border-brand-500/40 text-center font-mono font-bold text-cyan-300 text-xs sm:text-sm shadow-inner">
                {scene.formula}
              </div>
              {scene.secondaryFormula && (
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center font-mono text-indigo-300 text-xs">
                  {scene.secondaryFormula}
                </div>
              )}
            </div>
          )}

          {/* Key Takeaways Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 relative z-10">
            {scene.keyPoints.map((pt, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-2 text-xs text-slate-200">
                <div className="w-5 h-5 rounded-md bg-brand-600/30 text-brand-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <span className="leading-snug">{pt}</span>
              </div>
            ))}
          </div>

          {/* Speaker Full Narration Box */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 italic flex items-start gap-2.5 relative z-10">
            <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1 w-full">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 not-italic block">Complete Spoken Narration:</span>
                <span className="text-[10px] text-slate-500 font-mono not-italic">{wordCount} words</span>
              </div>
              <p className="leading-relaxed">"{scene.speakerText}"</p>
            </div>
          </div>

          {/* Slide Indicator Dots */}
          <div className="flex items-center justify-center gap-1.5 relative z-10 pt-1">
            {DEEP_DIVE_PITCH_SCENES.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => { setCurrentSceneIndex(idx); setProgressPercent(0); }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSceneIndex === idx ? 'w-8 bg-brand-500 shadow-md shadow-brand-500/50' : 'w-2 bg-slate-800 hover:bg-slate-700'
                }`}
                title={`Scene ${idx + 1}: ${s.title}`}
              />
            ))}
          </div>

        </div>

        {/* Video Scrubber & Playback Controls */}
        <div className="px-5 sm:px-6 py-3.5 bg-slate-950 border-t border-slate-800 space-y-2.5 flex-shrink-0">
          
          {/* Progress Bar Scrubber */}
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-rose-500 via-indigo-500 to-cyan-400 rounded-full transition-all duration-100"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            
            {/* Play/Pause & Nav buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleTogglePlay}
                className="flex items-center gap-2 px-5 py-2 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/30 transition-all hover:scale-105"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? 'Pause Narration' : 'Play Full Narration'}</span>
              </button>

              <button
                onClick={handlePrev}
                disabled={currentSceneIndex === 0}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={handleNext}
                disabled={currentSceneIndex === DEEP_DIVE_PITCH_SCENES.length - 1}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleReset}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                title="Restart from Beginning"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Full Narrative Pitch • Act {currentSceneIndex + 1} of {DEEP_DIVE_PITCH_SCENES.length}</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
