import React, { useState } from 'react';
import api from '../services/api';
import { useSkillTwin } from '../context/SkillTwinContext';
import confetti from 'canvas-confetti';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Flame, 
  Zap, 
  Award,
  HelpCircle,
  Code2
} from 'lucide-react';

const DRILL_QUESTIONS = {
  'Docker & Containerization': [
    {
      question: 'Why should you use multi-stage builds in production Dockerfiles?',
      options: [
        'To speed up CPU clock cycles during runtime',
        'To separate build-time tools from the final lean runtime image, reducing image size & CVE attack surface',
        'To avoid needing a .dockerignore file',
        'To enable automatic database migration rollbacks'
      ],
      correctIndex: 1,
      explanation: 'Multi-stage builds allow compiling binaries in a temporary build stage and copying only artifacts to a minimal Alpine/Distroless image, shrinking container sizes from ~1GB to <100MB.'
    },
    {
      question: 'Which docker-compose directive ensures that your web application starts only after PostgreSQL is ready to accept connections?',
      options: [
        'depends_on with condition: service_healthy and a valid healthcheck test',
        'restart: always',
        'network_mode: host',
        'links: ["postgres"]'
      ],
      correctIndex: 0,
      explanation: 'Using `depends_on` with `condition: service_healthy` checks the actual database connection rather than just waiting for the container process to spawn.'
    }
  ],
  'Relational Databases & SQL': [
    {
      question: 'What is the primary benefit of creating a composite B-tree index on (user_id, created_at)?',
      options: [
        'It encrypts the password column automatically',
        'It accelerates queries filtering by user_id and sorting by created_at without a separate sort pass',
        'It turns the table into a distributed graph store',
        'It prevents foreign key deadlocks entirely'
      ],
      correctIndex: 1,
      explanation: 'B-tree composite indexes allow the query planner to seek directly to the user_id range and scan ordered created_at values with zero additional sorting cost.'
    },
    {
      question: 'Which transaction isolation level prevents "Non-Repeatable Reads"?',
      options: [
        'Read Uncommitted',
        'Read Committed',
        'Repeatable Read (or Serializable)',
        'Auto-commit Mode'
      ],
      correctIndex: 2,
      explanation: 'Repeatable Read guarantees that any row read during a transaction retains the same values throughout that transaction, preventing non-repeatable reads.'
    }
  ],
  'REST APIs': [
    {
      question: 'Why is an Idempotency-Key header critical for billing and checkout POST endpoints?',
      options: [
        'It compresses the JSON payload for faster network transit',
        'It ensures that transient network retries do not charge the user multiple times for the same order',
        'It hashes the JWT token secret',
        'It disables CORS security headers'
      ],
      correctIndex: 1,
      explanation: 'Idempotency keys allow the server to recognize duplicate retries and return the original cached response without re-executing credit card charges.'
    }
  ],
  'System Design & Concurrency': [
    {
      question: 'How do you prevent a "Cache Stampede" (Thundering Herd) when a high-traffic Redis key expires?',
      options: [
        'Delete the Redis instance and rely solely on PostgreSQL',
        'Use mutex locks / singleflight or probabilistically refresh the cache before strict TTL expiration',
        'Set TTL to infinity for all keys',
        'Disable indexing on the database'
      ],
      correctIndex: 1,
      explanation: 'Using distributed mutex locks or probabilistic early expiration (XFetch algorithm) ensures only one worker computes the fresh value while others wait.'
    }
  ],
  'React & Modern Frontend': [
    {
      question: 'When should you use `useCallback` or `useMemo` in React?',
      options: [
        'Wrap every single function and variable in the entire codebase',
        'When passing callback props to memoized child components (`React.memo`) or avoiding expensive recalculations',
        'Only in server components',
        'To replace Redux store management'
      ],
      correctIndex: 1,
      explanation: 'Overusing `useCallback` adds overhead; it is intended for maintaining referential equality for props passed to memoized children or dependency arrays.'
    }
  ]
};

export default function SkillDefenseDrillModal({ skillName, onClose }) {
  const { fetchTwinState } = useSkillTwin();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [hasSubmittedAnswer, setHasSubmittedAnswer] = useState(false);
  const [scoreEarned, setScoreEarned] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [submittingReward, setSubmittingReward] = useState(false);

  const questions = DRILL_QUESTIONS[skillName] || DRILL_QUESTIONS['Docker & Containerization'];
  const currentQ = questions[currentStep];

  const handleSelectOption = (index) => {
    if (hasSubmittedAnswer) return;
    setSelectedAnswer(index);
  };

  const handleVerifyAnswer = () => {
    if (selectedAnswer === null) return;
    setHasSubmittedAnswer(true);
    if (selectedAnswer === currentQ.correctIndex) {
      setScoreEarned(prev => prev + 5);
    }
  };

  const handleNext = async () => {
    if (currentStep + 1 < questions.length) {
      setCurrentStep(prev => prev + 1);
      setSelectedAnswer(null);
      setHasSubmittedAnswer(false);
    } else {
      // Completed all questions
      setIsCompleted(true);
      setSubmittingReward(true);

      const totalBonus = Math.max(5, scoreEarned);
      try {
        await api.post('/skills/drill-reward', {
          skillName,
          pointsEarned: totalBonus,
          drillTitle: `${skillName} Skill Defense Challenge`
        });
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        await fetchTwinState();
      } catch (err) {
        console.error('Reward error:', err);
      } finally {
        setSubmittingReward(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-8 animate-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                Skill Defense Technical Drill
              </span>
              <h3 className="text-sm font-bold text-white leading-tight">
                {skillName} Challenge
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {!isCompleted ? (
            <div className="space-y-4">
              
              {/* Progress Indicator */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Question {currentStep + 1} of {questions.length}</span>
                <span className="font-mono text-cyan-300 font-bold">Reward: +10 pts potential</span>
              </div>

              {/* Question Text */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="text-sm font-bold text-white leading-relaxed">
                  {currentQ.question}
                </h4>
              </div>

              {/* Options */}
              <div className="space-y-2">
                {currentQ.options.map((opt, i) => {
                  let btnStyle = 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300';

                  if (hasSubmittedAnswer) {
                    if (i === currentQ.correctIndex) {
                      btnStyle = 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 font-semibold';
                    } else if (i === selectedAnswer) {
                      btnStyle = 'bg-rose-500/15 border-rose-500/50 text-rose-300';
                    }
                  } else if (selectedAnswer === i) {
                    btnStyle = 'bg-brand-500/20 border-brand-500 text-white font-semibold';
                  }

                  return (
                    <button
                      key={i}
                      disabled={hasSubmittedAnswer}
                      onClick={() => handleSelectOption(i)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-start gap-3 ${btnStyle}`}
                    >
                      <span className="w-5 h-5 rounded-md bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-[11px] flex-shrink-0">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation Banner after checking */}
              {hasSubmittedAnswer && (
                <div className={`p-4 rounded-2xl border text-xs space-y-1 ${
                  selectedAnswer === currentQ.correctIndex
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                }`}>
                  <div className="flex items-center gap-1.5 font-bold">
                    {selectedAnswer === currentQ.correctIndex ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Correct! (+5 Evidence Points)</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-400" />
                        <span>Incorrect. Review technical rationale below:</span>
                      </>
                    )}
                  </div>
                  <p className="text-slate-300 pt-1 leading-relaxed">
                    {currentQ.explanation}
                  </p>
                </div>
              )}

            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/40 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-xl font-bold text-white">
                Skill Defense Completed!
              </h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Your conceptual mastery in <strong className="text-cyan-400">{skillName}</strong> has been verified and recorded to your Digital Twin.
              </p>

              <div className="inline-block p-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm font-bold text-emerald-400 font-mono">
                +{scoreEarned || 10} Skill Points Awarded
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center">
          <span className="text-[11px] text-slate-500 font-mono">
            Interactive Rapid Drill • SkillTwin Verification
          </span>

          {!isCompleted ? (
            !hasSubmittedAnswer ? (
              <button
                disabled={selectedAnswer === null}
                onClick={handleVerifyAnswer}
                className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all disabled:opacity-40"
              >
                Verify Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all"
              >
                <span>{currentStep + 1 < questions.length ? 'Next Question' : 'Complete Drill'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )
          ) : (
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white"
            >
              Close & View Twin
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
