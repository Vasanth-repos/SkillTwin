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
  CheckCircle2
} from 'lucide-react';

const EXTENDED_PITCH_SCENES = [
  {
    id: 'scene-1',
    act: 'ACT 1: THE PROBLEM',
    timestamp: '0:00 – 1:00',
    title: 'The $350$ LeetCode Problem Paradox',
    subtitle: 'The systemic disconnect between competitive coding and real-world engineering',
    speakerText: "Good morning, judges. Last semester, we met a brilliant final-year student named Alex. Alex had solved 350 LeetCode problems, completed two video certifications, and listed a dozen buzzwords on his resume. Yet, in his very first technical interview for a Backend role, he was rejected in under twenty minutes. Why? Because when the interviewer asked him to write a multi-stage Dockerfile and debug a database race condition, Alex froze. Coding platforms track puzzle-solving speed. Course platforms track video watch-time. Resumes show unverified claims that recruiters distrust. And college placement cells discover student weaknesses only after they get rejected. Students don't need another 40-hour video course. They need to know: What is my number one deficit right now, and how do I prove I've fixed it?",
    visualType: 'problem',
    badgeText: 'The Signaling Crisis',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    keyPoints: [
      'Algorithmic Isolation: Tracks synthetic puzzle speed, not systems architecture',
      'Passive Consumption: MOOCs measure video completion rather than code output',
      'Resume Inflation: Self-reported claims lack audit trails and proof',
      'Institutional Blindness: Placement cells discover deficits only post-rejection'
    ]
  },
  {
    id: 'scene-2',
    act: 'ACT 2: THE SOLUTION',
    timestamp: '1:00 – 2:00',
    title: 'Introducing SkillTwin: The Living Digital Career Twin',
    subtitle: 'A deterministic, evidence-backed career-readiness engine',
    speakerText: "That is why we built SkillTwin. SkillTwin creates a living, evidence-backed Digital Skill Twin of a student that continuously benchmarks their real demonstrated capabilities against curated industry requirements for their target career. Rather than relying on black-box generative AI that hallucinates career advice, SkillTwin operates on an explainable, deterministic feedback loop. First, it assesses demonstrated evidence across academic coursework, projects, languages, and coding milestones into a scored skill graph. Second, it mathematically prioritizes skill deficits. Third, it generates practical hands-on engineering missions. And fourth, it verifies code artifacts with an automated rubric evaluator, dynamically re-scoring the student's Career Readiness Index in real time.",
    visualType: 'solution',
    badgeText: 'Digital Twin Architecture',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    keyPoints: [
      '1. Assess: Normalized multi-dimensional skill graph from real evidence',
      '2. Prioritize: Mathematical tri-factor ranking of highest-impact gaps',
      '3. Execute: Practical hands-on challenges (Docker, SQL, APIs, CI/CD)',
      '4. Verify & Rescore: Deterministic rubric evaluator with score deltas'
    ]
  },
  {
    id: 'scene-3',
    act: 'ACT 3: MATHEMATICAL MODELING',
    timestamp: '2:00 – 3:00',
    title: 'Mathematical Gap Prioritization & The Readiness Index',
    subtitle: 'Zero hallucinations: 100% explainable, deterministic algorithms',
    speakerText: "Let us examine the mathematical foundation of SkillTwin. For any target role, each required skill is parameterized by required target percentage, intrinsic industry weight, and role relevance. The priority urgency score is calculated as Gap multiplied by Industry Weight multiplied by Career Relevance. The skill with the highest priority score is designated as the candidate's number one critical deficit. Furthermore, our Career Readiness Index computes the weighted normalized percentage across all competencies, capping mastered skills at 100% so that solving a thousand DSA problems cannot artificially mask a critical zero score in systems engineering.",
    visualType: 'math',
    badgeText: 'Deterministic Algorithms',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    formula: 'Priority Score(s) = Gap(s) × W_industry(s) × W_relevance(s, r)',
    secondaryFormula: 'CRI = [ Σ min(1.0, Score(s) / Req(s)) × Weight(s) ] / Σ Weight(s) × 100',
    keyPoints: [
      'Explainable Urgency: Deficits ranked by mathematical urgency, not arbitrary lists',
      'Anti-Masking Bound: Prevents over-specialization in DSA from hiding missing systems skills',
      'Deterministic Grading: Identical code submissions always produce identical score deltas',
      'Transparent Audit Trail: Every point gained is tied to a verifiable code artifact'
    ]
  },
  {
    id: 'scene-4',
    act: 'ACT 4: LIVE CORE LOOP DEMO',
    timestamp: '3:00 – 4:15',
    title: 'Live Product Demo: From 58% to 66% Readiness',
    subtitle: 'Real-time in-browser code evaluation, rubric verification & predictive forecasting',
    speakerText: "Let's look at Alex Chen's live Digital Twin. Alex is targeting Backend Software Engineer. SkillTwin scores his baseline readiness at 58%. Notice that the system did not tell him to do more DSA—his DSA score is already at 82%. Instead, our engine flagged Docker and Containerization as his number one critical deficit with a Priority Score of 72.8. Inside the mission evaluator, Alex uses our direct in-browser code editor to inspect his Dockerfile and docker-compose configurations. When he clicks 'Run Rubric Evaluator', our deterministic scanner verifies non-root user declarations, container healthchecks, and passing unit tests. It awards plus 20 points, triggers celebration confetti, and updates his Career Readiness Index from 58% to 66%. Alex can also use our 30-day Predictive Simulator to forecast that completing two more missions will push him to 82% Interview-Ready by next month.",
    visualType: 'demo',
    badgeText: 'Live Evaluation Loop',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    keyPoints: [
      'Alex Chen: 145 DSA solved (82% mastered), Docker deficit at 35%',
      'Targeted Mission: Containerize an Express Service with Multi-Stage Dockerfile',
      'In-Browser Artifact Editor: Live syntax editing of Dockerfile & compose manifests',
      'Rubric Engine: Awards +20 points, updating Career Readiness from 58% to 66%',
      'Predictive Trajectory: 30-day forecast slider modeling growth curve to 82%'
    ]
  },
  {
    id: 'scene-5',
    act: 'ACT 5: THE COLLEGE COCKPIT',
    timestamp: '4:15 – 5:30',
    title: 'The College Placement Cockpit & Institutional Telemetry',
    subtitle: 'Automated cohort heatmaps, 2-week workshop synthesis, and faculty nudge loops',
    speakerText: "Now let's examine the institutional B2B interface designed for universities and department chairs. Logging in as Professor Marcus Davis, the placement director gains real-time cohort telemetry. The Institutional Skill Gap Heatmap immediately reveals that 67% of students lack containerization and concurrency skills before campus placement drives begin. With a single click, SkillTwin synthesizes a tailored 2-Week Faculty Lab Syllabus addressing the cohort's number one deficit. Furthermore, Professor Davis can dispatch a priority mission directly to Alex with a personalized coaching note: 'Complete before Friday's placement drive', which appears as a prominent alert banner on Alex's dashboard. Administrators can also export a complete cohort readiness spreadsheet for accreditation bodies.",
    visualType: 'admin',
    badgeText: 'Institutional B2B Intel',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    keyPoints: [
      'Institutional Heatmap: Real-time cohort deficit frequency across technical domains',
      'Curriculum Intervention Generator: 1-click synthesis of a 2-week faculty lab syllabus',
      'Faculty Nudge Loop: Direct mission dispatch with custom instructor guidance notes',
      '1-Click Accreditation Export: Complete cohort placement readiness telemetry CSV'
    ]
  },
  {
    id: 'scene-6',
    act: 'ACT 6: BUSINESS & DEFENSIBILITY',
    timestamp: '5:30 – 6:30',
    title: 'B2B2C Business Model & Technical Defensibility',
    subtitle: 'A high-retention SaaS flywheel powered by deterministic verifiable credentials',
    speakerText: "Our business model is a high-retention B2B2C SaaS flywheel. For universities and colleges, we offer annual per-seat enterprise licensing for cohort analytics, curriculum intervention tools, and accreditation reporting. For students, we provide a freemium model with premium mock interview defenses and cryptographically verifiable digital certificates. For corporate recruiters, SkillTwin serves as a direct talent pipeline to pre-verified candidates filtered by demonstrated competency rather than unverified resumes. Why do we win? We deliberately chose deterministic heuristics over unconstrained generative AI. Our rubrics never hallucinate, our scoring is 100% auditable, and our credentials carry verifiable SHA-256 evidence hashes.",
    visualType: 'business',
    badgeText: 'Enterprise Monetization',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    keyPoints: [
      'Colleges (B2B): Annual per-seat licensing for cohort telemetry & placement success',
      'Students (Freemium): Free core digital twin + verified cryptographic credentials',
      'Recruiters (B2B): Talent search based on verified proof rather than keyword resumes',
      'Defensibility Moat: Deterministic heuristics, zero hallucination, repeatable rubrics'
    ]
  },
  {
    id: 'scene-7',
    act: 'ACT 7: VISION & CLOSING',
    timestamp: '6:30 – 7:30',
    title: 'Transforming Learners into Verified Engineers',
    subtitle: 'Know what you know. Fix what you don’t.',
    speakerText: "In conclusion: Education has spent the last decade digitizing content through video lectures. SkillTwin is digitizing competency and career readiness. We turn students from passive course consumers into evidence-backed software engineers who walk into technical interviews with verifiable proof of their abilities. The full platform is live, containerized, and tested with automated CI/CD pipelines on GitHub. Thank you, and we welcome your questions.",
    visualType: 'vision',
    badgeText: 'The Future of Career Readiness',
    badgeColor: 'bg-brand-500/20 text-brand-300 border-brand-500/40',
    keyPoints: [
      'From Content to Competency: Moving beyond passive video consumption',
      'Verifiable Evidence: Candidate abilities backed by inspectable code artifacts',
      'Institutional Impact: Closing the signaling disconnect between campus and industry',
      'Production-Ready: Fully deployed on Vercel and GitHub with 100% passing test suites'
    ]
  }
];

export default function VideoPitchPlayerModal({ onClose }) {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [progressPercent, setProgressPercent] = useState(0);
  const timerRef = useRef(null);

  const scene = EXTENDED_PITCH_SCENES[currentSceneIndex];
  
  // Calculate scene duration dynamically based on word count (~130 words/min = ~2.2 words/sec)
  const wordCount = scene.speakerText.split(' ').length;
  const SCENE_DURATION_MS = Math.max(18000, Math.round((wordCount / 2.3) * 1000));

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
          if (currentSceneIndex + 1 < EXTENDED_PITCH_SCENES.length) {
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
    if (currentSceneIndex + 1 < EXTENDED_PITCH_SCENES.length) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/95 backdrop-blur-2xl overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-4 flex flex-col justify-between max-h-[92vh]">
        
        {/* Video Player Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-600 via-pink-600 to-amber-500 flex items-center justify-center text-white shadow-lg">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-white">SkillTwin — Full Comprehensive Video Pitch</span>
                <span className="text-[10px] font-mono uppercase bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full border border-rose-500/30">
                  Full Pitch Reel
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">{scene.act} • Scene {currentSceneIndex + 1} of {EXTENDED_PITCH_SCENES.length} • {scene.timestamp}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
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

        {/* Video Canvas Stage (Scrollable if needed) */}
        <div className="p-6 sm:p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 overflow-y-auto flex-1 flex flex-col justify-between relative">
          
          {/* Ambient Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Slide Header */}
          <div className="space-y-1.5 relative z-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${scene.badgeColor}`}>
                {scene.badgeText}
              </span>
              <span className="text-xs font-mono text-cyan-400 font-semibold">{scene.timestamp}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {scene.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-3xl">
              {scene.subtitle}
            </p>
          </div>

          {/* Core Visual Elements */}
          <div className="my-4 p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 relative z-10 space-y-3">
            
            {/* Formulas if provided */}
            {scene.formula && (
              <div className="space-y-1.5">
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

            {/* Key Takeaways */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {scene.keyPoints.map((pt, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-2 text-xs text-slate-200">
                  <div className="w-5 h-5 rounded-md bg-brand-600/30 text-brand-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <span className="leading-snug">{pt}</span>
                </div>
              ))}
            </div>

            {/* Speaker Closed Caption Transcript */}
            <div className="pt-3 border-t border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-300 italic bg-slate-900/40 p-3 rounded-xl">
              <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 not-italic block">Speaker Voiceover Transcript:</span>
                <span>"{scene.speakerText}"</span>
              </div>
            </div>

          </div>

          {/* Slide Indicator Dots */}
          <div className="flex items-center justify-center gap-1.5 relative z-10 pt-2">
            {EXTENDED_PITCH_SCENES.map((s, idx) => (
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
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 space-y-3 flex-shrink-0">
          
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
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/30 transition-all hover:scale-105"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? 'Pause Presentation' : 'Play Full Video Pitch'}</span>
              </button>

              <button
                onClick={handlePrev}
                disabled={currentSceneIndex === 0}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={handleNext}
                disabled={currentSceneIndex === EXTENDED_PITCH_SCENES.length - 1}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleReset}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                title="Restart from Beginning"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Full Narrative Pitch • Scene {currentSceneIndex + 1} of {EXTENDED_PITCH_SCENES.length}</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
