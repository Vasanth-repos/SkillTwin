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
  Maximize2, 
  Target, 
  ShieldCheck, 
  Flame, 
  Zap, 
  GraduationCap, 
  Users, 
  ArrowRight,
  Award,
  Layers,
  BrainCircuit
} from 'lucide-react';

const PITCH_SCENES = [
  {
    id: 'scene-1',
    timestamp: '0:00 – 1:00',
    title: 'The Problem: The $350$ LeetCode Paradox',
    subtitle: 'Why high DSA scores still result in technical interview rejections',
    speakerText: "Last semester, we met Alex—a brilliant final-year student with 350 solved LeetCode problems, two certifications, and an impressive resume. Yet in his first technical interview for a Backend role, he was rejected in 20 minutes because he had never configured a multi-stage Dockerfile or handled database concurrency. Modern platforms track puzzle counts and video completion, but nobody verifies systems engineering.",
    visualType: 'problem',
    keyPoints: [
      'Competitive Coding: Measures puzzle speed, not systems architecture',
      'Course Platforms: Measures video watch-time, not demonstrated ability',
      'Static Resumes: Unverified self-claims that recruiters distrust',
      'College Placement Cells: Discover student weaknesses only after rejection'
    ]
  },
  {
    id: 'scene-2',
    timestamp: '1:00 – 1:45',
    title: 'The Solution: Introducing SkillTwin',
    subtitle: 'A deterministic Digital Twin continuous career-readiness engine',
    speakerText: "SkillTwin creates a living, evidence-backed Digital Skill Twin of a student that continuously benchmarks their demonstrated capabilities against real industry requirements for their target engineering career, operating on an explainable, closed pedagogical loop.",
    visualType: 'solution',
    formula: 'Priority Score = Skill Gap × Industry Importance × Career Relevance',
    keyPoints: [
      '1. Assess: Multi-dimensional profile evidence normalization',
      '2. Prioritize: Mathematical tri-factor gap urgency ranking',
      '3. Execute: Targeted hands-on missions closing top deficits',
      '4. Verify: Deterministic rubric evaluator updating readiness'
    ]
  },
  {
    id: 'scene-3',
    timestamp: '1:45 – 3:15',
    title: 'Live Core Loop Demonstration',
    subtitle: 'From 58% readiness to verified Docker competency in real time',
    speakerText: "Looking at Alex Chen targeting Backend Engineer at 58% readiness: SkillTwin flags Docker as his #1 critical deficit with a Priority Score of 72.8. In the mission evaluator, Alex submits his code artifacts. The deterministic rubric evaluator verifies healthchecks and test suites, awarding +20 points and updating his readiness to 66%.",
    visualType: 'demo',
    keyPoints: [
      'Alex Chen: 145 DSA solved (82% mastered), Docker deficit (35%)',
      'Hands-on Mission: Containerize Express with Multi-Stage Dockerfile',
      'In-Browser Code Inspector: Dockerfile, docker-compose.yml, tests/',
      'Automated Rubric Scan: +20 points awarded with celebratory confetti'
    ]
  },
  {
    id: 'scene-4',
    timestamp: '3:15 – 4:00',
    title: 'The College Cockpit: Institutional Telemetry',
    subtitle: 'Empowering universities with automated curriculum intervention',
    speakerText: "For universities, SkillTwin delivers cohort-level placement intelligence. Department chairs view institutional skill gap heatmaps showing that 67% of students lack containerization skills, synthesize 2-week faculty lab syllabi with 1 click, and assign priority missions directly to students.",
    visualType: 'admin',
    keyPoints: [
      'Institutional Heatmap: Aggregate cohort deficit frequency across skills',
      'Curriculum Generator: Automated 2-week intensive faculty workshop syllabus',
      'Faculty Nudge Loop: Direct mission assignment with custom coaching notes',
      '1-Click Placement CSV: Complete cohort readiness spreadsheet export'
    ]
  },
  {
    id: 'scene-5',
    timestamp: '4:00 – 5:00',
    title: 'Business Model, Defensibility & Vision',
    subtitle: 'B2B2C SaaS flywheel converting learners into verified engineers',
    speakerText: "Our B2B2C business model monetizes through university annual seat licensing, student pro credentials, and corporate recruiter talent sourcing. We win by choosing deterministic heuristics over black-box AI wrappers—providing explainable, cryptographically verifiable career credentials.",
    visualType: 'business',
    keyPoints: [
      'Universities (B2B): Annual per-seat licensing for accreditation & placement',
      'Students (Freemium): Free digital twin + verified credential export',
      'Recruiters (B2B): Direct search across verified evidence portfolios',
      'Deterministic Advantage: Zero hallucination, auditable rubric scoring'
    ]
  }
];

export default function VideoPitchPlayerModal({ onClose }) {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [progressPercent, setProgressPercent] = useState(0);
  const timerRef = useRef(null);

  const scene = PITCH_SCENES[currentSceneIndex];
  const SCENE_DURATION_MS = 14000; // 14 seconds per slide in auto-mode

  // Speech synthesis for automated voiceover
  const speakScene = (text) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
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
          if (currentSceneIndex + 1 < PITCH_SCENES.length) {
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
  }, [isPlaying, currentSceneIndex, voiceEnabled]);

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
    if (currentSceneIndex + 1 < PITCH_SCENES.length) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-4 flex flex-col justify-between">
        
        {/* Video Player Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-white">SkillTwin — 5-Minute Final Video Pitch</span>
                <span className="text-[10px] font-mono uppercase bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full border border-rose-500/30">
                  HD Pitch Player
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">Scene {currentSceneIndex + 1} of {PITCH_SCENES.length} • {scene.timestamp}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
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

        {/* Video Canvas Stage (16:9 Aspect Feel) */}
        <div className="p-6 sm:p-10 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 min-h-[420px] flex flex-col justify-between relative overflow-hidden">
          
          {/* Animated Ambient background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Slide Content Header */}
          <div className="space-y-2 relative z-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
              ACT {currentSceneIndex + 1}: {scene.timestamp}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {scene.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-300 font-medium max-w-2xl">
              {scene.subtitle}
            </p>
          </div>

          {/* Visual Showcase Box according to slide type */}
          <div className="my-6 p-5 sm:p-6 rounded-2xl bg-slate-950/80 border border-slate-800/80 relative z-10 space-y-4">
            
            {/* Mathematical formula badge if available */}
            {scene.formula && (
              <div className="p-3 rounded-xl bg-brand-950/60 border border-brand-500/40 text-center font-mono font-bold text-cyan-300 text-xs sm:text-sm shadow-inner">
                {scene.formula}
              </div>
            )}

            {/* Key Presentation Takeaways */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {scene.keyPoints.map((pt, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-200">
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
              <span>"{scene.speakerText}"</span>
            </div>

          </div>

          {/* Slide Indicator Dots */}
          <div className="flex items-center justify-center gap-2 relative z-10">
            {PITCH_SCENES.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => { setCurrentSceneIndex(idx); setProgressPercent(0); }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSceneIndex === idx ? 'w-8 bg-brand-500 shadow-md shadow-brand-500/50' : 'w-2 bg-slate-800 hover:bg-slate-700'
                }`}
              />
            ))}
          </div>

        </div>

        {/* Video Scrubber & Playback Controls */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 space-y-3">
          
          {/* Progress Bar Scrubber */}
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-brand-500 to-cyan-400 rounded-full transition-all duration-100"
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
                <span>{isPlaying ? 'Pause Presentation' : 'Play Video Pitch'}</span>
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
                disabled={currentSceneIndex === PITCH_SCENES.length - 1}
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

            <div className="text-xs text-slate-400 font-mono">
              <span>Auto-Speech Narration Active</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
