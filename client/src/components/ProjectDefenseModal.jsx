import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  MessageSquare, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  BrainCircuit, 
  Award,
  Bot
} from 'lucide-react';

const DEFENSE_SCENARIOS = [
  {
    interviewerQuestion: "In your verified Backend project, you built a high-throughput transaction API. If two concurrent requests try to update the same user account balance simultaneously, how do you prevent dirty reads and race conditions?",
    options: [
      "Use client-side setTimeout delays before making the API call",
      "Implement Database Row-Level Locking (SELECT ... FOR UPDATE) or Optimistic Locking with a version column",
      "Disable PostgreSQL indexes during peak hours",
      "Store balances in an in-memory global JavaScript variable"
    ],
    correctIndex: 1,
    rationale: "Row-level locking (`SELECT FOR UPDATE`) or optimistic concurrency control (`WHERE version = @v`) ensures that concurrent updates are serialized and transactional isolation is preserved."
  },
  {
    interviewerQuestion: "Your microservice architecture runs behind a load balancer. How do you ensure zero-downtime rolling deployments when deploying new Docker container versions?",
    options: [
      "Kill all containers at once and restart them manually",
      "Configure readiness and liveness probes in Docker/Kubernetes and only route traffic once new containers report healthy",
      "Remove HTTPS SSL certificates during deployment",
      "Hardcode localhost IP addresses into DNS records"
    ],
    correctIndex: 1,
    rationale: "Readiness probes ensure the orchestrator waits for the new container to boot and warm up its database connection pool before switching live ingress traffic."
  }
];

export default function ProjectDefenseModal({ onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [passedCount, setPassedCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const scenario = DEFENSE_SCENARIOS[currentStep];

  const handleSelect = (idx) => {
    if (submitted) return;
    setSelectedOption(idx);
  };

  const handleVerify = () => {
    if (selectedOption === null) return;
    setSubmitted(true);
    if (selectedOption === scenario.correctIndex) {
      setPassedCount(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentStep + 1 < DEFENSE_SCENARIOS.length) {
      setCurrentStep(prev => prev + 1);
      setSelectedOption(null);
      setSubmitted(false);
    } else {
      setIsFinished(true);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-8 animate-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                Mock Technical Defense
              </span>
              <h3 className="text-sm font-bold text-white">
                Project Architecture Defense Simulator
              </h3>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
          {!isFinished ? (
            <div className="space-y-4">
              
              {/* Interviewer Dialog Bubble */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-brand-600/30 border border-brand-500/30 flex items-center justify-center text-brand-400 flex-shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                    Technical Hiring Manager:
                  </span>
                  <p className="text-sm text-white font-medium leading-relaxed">
                    "{scenario.interviewerQuestion}"
                  </p>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-2 pt-1">
                {scenario.options.map((opt, i) => {
                  let style = 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300';
                  if (submitted) {
                    if (i === scenario.correctIndex) {
                      style = 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 font-semibold';
                    } else if (i === selectedOption) {
                      style = 'bg-rose-500/15 border-rose-500/50 text-rose-300';
                    }
                  } else if (selectedOption === i) {
                    style = 'bg-brand-500/20 border-brand-500 text-white font-semibold';
                  }

                  return (
                    <button
                      key={i}
                      disabled={submitted}
                      onClick={() => handleSelect(i)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${style}`}
                    >
                      <span className="w-5 h-5 rounded-md bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-[11px] flex-shrink-0">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Rationale feedback */}
              {submitted && (
                <div className={`p-4 rounded-2xl border ${
                  selectedOption === scenario.correctIndex
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                }`}>
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    {selectedOption === scenario.correctIndex ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Solid Architectural Defense!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-400" />
                        <span>Architectural Flaw Identified:</span>
                      </>
                    )}
                  </div>
                  <p className="text-slate-300 leading-relaxed">{scenario.rationale}</p>
                </div>
              )}

            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-500/40 text-center space-y-4">
              <ShieldCheck className="w-12 h-12 text-cyan-400 mx-auto" />
              <h3 className="text-xl font-bold text-white">
                Architecture Defense Cleared!
              </h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                You successfully defended your project architecture against live technical interview challenges.
              </p>
              <div className="inline-block p-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm font-bold text-cyan-400 font-mono">
                Verified Architectural Defense Competency Unlocked
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center">
          <span className="text-[11px] text-slate-500">
            Simulated Technical Interview • SkillTwin Engine
          </span>

          {!isFinished ? (
            !submitted ? (
              <button
                disabled={selectedOption === null}
                onClick={handleVerify}
                className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold disabled:opacity-40"
              >
                Submit Defense
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-1 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
              >
                <span>{currentStep + 1 < DEFENSE_SCENARIOS.length ? 'Next Defense Question' : 'Complete Defense'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )
          ) : (
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold"
            >
              Close
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
