import React, { useState } from 'react';
import { useSkillTwin } from '../context/SkillTwinContext';
import { 
  X, 
  Sparkles, 
  Github, 
  CheckCircle2, 
  XCircle, 
  Award, 
  ExternalLink, 
  Clock, 
  Flame, 
  Loader2, 
  ArrowRight,
  ShieldCheck,
  FileCode,
  FolderTree,
  FileText,
  Boxes,
  Key,
  Code2,
  Terminal,
  RotateCcw
} from 'lucide-react';

const DEFAULT_TEMPLATES = {
  'Dockerfile': `FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
USER node
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 5000
CMD ["node", "dist/index.js"]`,

  'docker-compose.yml': `version: '3.8'
services:
  api:
    build: .
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgres://user:pass@db:5432/appdb
    depends_on:
      db:
        condition: service_healthy
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: appdb
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d appdb"]
      interval: 5s
      timeout: 5s
      retries: 5`,

  'tests/api.test.js': `const test = require('node:test');
const assert = require('node:assert');

test('GET /health returns healthy status code 200', async () => {
  const response = { status: 200, data: { status: 'healthy' } };
  assert.strictEqual(response.status, 200);
});`,

  'README.md': `# Service Implementation
## Setup & Running
1. Run \`docker-compose up --build\` to launch the microservice cluster.
2. Run \`npm test\` to execute automated test assertions.`
};

export default function MissionSubmissionModal({ mission, onClose }) {
  const { submitMissionEvidence } = useSkillTwin();
  const [submissionMode, setSubmissionMode] = useState('url'); // 'url' | 'editor'
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [githubPat, setGithubPat] = useState('');
  const [showPatInput, setShowPatInput] = useState(false);
  
  // Direct code editor states
  const [activeFileTab, setActiveFileTab] = useState('Dockerfile');
  const [codeFiles, setCodeFiles] = useState(DEFAULT_TEMPLATES);

  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalStep, setEvalStep] = useState(0);
  const [evalResult, setEvalResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [resultViewTab, setResultViewTab] = useState('rubric'); // 'rubric' | 'files'

  if (!mission) return null;

  const checklist = mission.checklistItems || [];

  const handleDemoFill = (type) => {
    if (type === 'valid') {
      const slug = mission.targetSkill.toLowerCase().replace(/[^a-z0-9]/g, '-');
      setSubmissionUrl(`https://github.com/alexchen/verified-${slug}-solution`);
    } else {
      setSubmissionUrl(`https://github.com/alexchen/incomplete-draft-repo`);
    }
  };

  const handleCodeChange = (text) => {
    setCodeFiles(prev => ({
      ...prev,
      [activeFileTab]: text
    }));
  };

  const handleLoadFlawedCode = () => {
    setCodeFiles({
      'Dockerfile': `# Missing multi-stage build and non-root user\nFROM ubuntu:latest\nRUN apt-get update`,
      'README.md': `# Incomplete project`
    });
  };

  const handleResetValidCode = () => {
    setCodeFiles(DEFAULT_TEMPLATES);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (submissionMode === 'url' && (!submissionUrl || submissionUrl.trim() === '')) {
      setErrorMessage('Please enter a GitHub repository URL or switch to the Direct Code Editor.');
      return;
    }

    setIsEvaluating(true);
    setEvalStep(1);

    setTimeout(() => setEvalStep(2), 500);
    setTimeout(() => setEvalStep(3), 1100);

    try {
      let res;
      if (submissionMode === 'editor') {
        res = await submitMissionEvidence(
          mission.id,
          'Direct In-Browser Code Artifact',
          null
        );
      } else {
        res = await submitMissionEvidence(mission.id, submissionUrl.trim());
      }

      setTimeout(() => {
        setIsEvaluating(false);
        setEvalResult(res);
      }, 1600);
    } catch (err) {
      setIsEvaluating(false);
      setErrorMessage(err.message || 'Failed to evaluate submission.');
    }
  };

  const discoveredFiles = evalResult?.evaluation?.discoveredFiles || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-600/20 text-brand-400 border border-brand-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400">
                Hands-On Evidence Mission
              </span>
              <h3 className="text-base font-bold text-white leading-tight">
                {mission.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Mission Description & Target Skill */}
          <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Targets Skill: <strong className="text-white">{mission.targetSkill}</strong>
              </span>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[11px] font-semibold text-slate-300">
                  {mission.difficulty}
                </span>
                <span>~{mission.estimatedHours} Hours</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {mission.description}
            </p>
          </div>

          {/* Rubric Criteria Checklist */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-brand-400" />
                Automated Rubric Verification Checklist
              </h4>
              <span className="text-[11px] font-semibold text-slate-500 font-mono">
                {checklist.length} Criteria
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {checklist.map((item, i) => (
                <div 
                  key={i} 
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2.5"
                >
                  <FileCode className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                  <div className="text-xs space-y-0.5">
                    <p className="text-slate-200 font-semibold">{item.text}</p>
                    <span className="text-[10px] font-mono text-cyan-400">+{item.points} Points</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Evaluation Results Banner & Interactive File Explorer (if evaluated) */}
          {evalResult && (
            <div className="space-y-4">
              <div className={`p-5 rounded-2xl border ${
                evalResult.evaluation?.scoreDelta > 0 
                  ? 'bg-gradient-to-br from-emerald-950/40 to-slate-900 border-emerald-500/40'
                  : 'bg-slate-950 border-amber-500/30'
              }`}>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    {evalResult.evaluation?.allPassed ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <Award className="w-6 h-6 text-amber-400" />
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        {evalResult.evaluation?.allPassed ? '100% Rubric Verification Passed!' : 'Rubric Evaluation Complete'}
                      </h4>
                      <p className="text-xs text-slate-400">
                        Source: {evalResult.evaluation?.inspectionSource}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xl font-black text-emerald-400 block">
                      +{evalResult.evaluation?.scoreDelta} PTS
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      Skill Delta Awarded
                    </span>
                  </div>
                </div>

                {/* Rubric Tab Navigation */}
                <div className="flex gap-2 border-b border-slate-800 pb-2 mt-4 text-xs font-semibold">
                  <button
                    onClick={() => setResultViewTab('rubric')}
                    className={`pb-1 border-b-2 transition-colors ${
                      resultViewTab === 'rubric' ? 'border-brand-500 text-white' : 'border-transparent text-slate-400'
                    }`}
                  >
                    Checklist Results
                  </button>
                  <button
                    onClick={() => setResultViewTab('files')}
                    className={`pb-1 border-b-2 transition-colors flex items-center gap-1 ${
                      resultViewTab === 'files' ? 'border-brand-500 text-white' : 'border-transparent text-slate-400'
                    }`}
                  >
                    <FolderTree className="w-3.5 h-3.5" />
                    Discovered Artifacts ({discoveredFiles.length})
                  </button>
                </div>

                {resultViewTab === 'rubric' && (
                  <div className="space-y-1.5 mt-3">
                    {evalResult.evaluation?.rubricResults.map((r, i) => (
                      <div key={i} className="flex items-start justify-between text-xs py-1">
                        <div className="flex items-center gap-2">
                          {r.passed ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                          )}
                          <span className={r.passed ? 'text-slate-200' : 'text-slate-400'}>
                            {r.text}
                          </span>
                        </div>
                        <span className={`font-mono text-[11px] font-bold ${r.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {r.passed ? `+${r.points} pts` : '0 pts'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {resultViewTab === 'files' && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <p className="text-[11px] text-slate-400">
                      Discovered files verified against mission rubric pattern matchers:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-36 overflow-y-auto">
                      {discoveredFiles.map((file, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs text-cyan-300 font-mono py-0.5 px-2 rounded bg-slate-900 border border-slate-800/80">
                          <FileText className="w-3.5 h-3.5 text-brand-400" />
                          <span className="truncate">{file}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-slate-300">
                    {mission.targetSkill}: <strong className="text-white">{evalResult.previousScore}%</strong> → <strong className="text-cyan-400">{evalResult.newScore}%</strong>
                  </span>
                  <span className="text-slate-300">
                    New Overall Readiness: <strong className="text-emerald-400">{evalResult.readiness?.readinessScore}%</strong>
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Submission Mode Selector (URL vs Code Editor) */}
          {!evalResult && (
            <div className="space-y-4">
              
              {/* Submission Mode Tabs */}
              <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setSubmissionMode('url')}
                  className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 transition-all ${
                    submissionMode === 'url' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub Repository URL</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSubmissionMode('editor')}
                  className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 transition-all ${
                    submissionMode === 'editor' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Code2 className="w-4 h-4 text-cyan-300" />
                  <span>Direct Code / Artifact Editor (Live In-Browser)</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Mode A: URL Submission */}
                {submissionMode === 'url' ? (
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                          Submit Evidence Repository URL
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowPatInput(!showPatInput)}
                          className="text-[11px] text-brand-400 hover:text-brand-300 flex items-center gap-1"
                        >
                          <Key className="w-3 h-3" />
                          <span>{showPatInput ? 'Hide GitHub Token' : 'Live GitHub Token (Optional)'}</span>
                        </button>
                      </div>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                          <Github className="w-4 h-4" />
                        </div>
                        <input
                          type="url"
                          value={submissionUrl}
                          onChange={(e) => setSubmissionUrl(e.target.value)}
                          placeholder="https://github.com/your-username/my-docker-mission"
                          disabled={isEvaluating}
                          className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 font-mono"
                        />
                      </div>
                    </div>

                    {showPatInput && (
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                        <label className="text-[11px] text-slate-400 font-semibold block">
                          Personal Access Token (For rate-limited live GitHub queries)
                        </label>
                        <input
                          type="password"
                          value={githubPat}
                          onChange={(e) => setGithubPat(e.target.value)}
                          placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white font-mono"
                        />
                      </div>
                    )}

                    {/* Auto-fill buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-[11px] text-slate-400 font-semibold">Demo Auto-Fill:</span>
                      <button
                        type="button"
                        onClick={() => handleDemoFill('valid')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold transition-colors flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3" /> Valid Solution (+20pts)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDemoFill('incomplete')}
                        className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-[11px] font-semibold transition-colors flex items-center gap-1"
                      >
                        <XCircle className="w-3 h-3" /> Incomplete Repo
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Mode B: Direct In-Modal Code Editor */
                  <div className="space-y-3">
                    
                    {/* Template actions */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
                      <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Terminal className="w-4 h-4 text-cyan-400" />
                        In-Browser Code Inspector
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleResetValidCode}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 text-[11px] font-semibold"
                        >
                          Load Valid Template
                        </button>
                        <button
                          type="button"
                          onClick={handleLoadFlawedCode}
                          className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-[11px] font-semibold"
                        >
                          Load Incomplete Code
                        </button>
                      </div>
                    </div>

                    {/* File Tabs */}
                    <div className="flex gap-1 border-b border-slate-800 pb-1">
                      {Object.keys(codeFiles).map((filename) => (
                        <button
                          key={filename}
                          type="button"
                          onClick={() => setActiveFileTab(filename)}
                          className={`px-3 py-1.5 rounded-t-xl text-xs font-mono font-semibold transition-colors ${
                            activeFileTab === filename
                              ? 'bg-slate-950 text-cyan-300 border-t border-x border-slate-800'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {filename}
                        </button>
                      ))}
                    </div>

                    {/* Code Textarea */}
                    <textarea
                      rows={8}
                      value={codeFiles[activeFileTab] || ''}
                      onChange={(e) => handleCodeChange(e.target.value)}
                      className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-200 font-mono focus:outline-none focus:border-brand-500 leading-relaxed selection:bg-brand-500"
                    />
                  </div>
                )}

                {errorMessage && (
                  <p className="text-xs text-rose-400 font-medium">{errorMessage}</p>
                )}

                {/* Scanning Animation State */}
                {isEvaluating && (
                  <div className="p-4 rounded-2xl bg-brand-950/30 border border-brand-500/30 space-y-2 text-center animate-pulse">
                    <Loader2 className="w-6 h-6 text-brand-400 animate-spin mx-auto" />
                    <p className="text-xs font-bold text-white">
                      {evalStep === 1 && 'Scanning repository artifacts & code manifests...'}
                      {evalStep === 2 && 'Executing checklist pattern matchers...'}
                      {evalStep === 3 && 'Evaluating rubric criteria and calculating skill delta...'}
                    </p>
                  </div>
                )}

                {/* Submit CTA */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isEvaluating}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-sm font-bold shadow-lg shadow-brand-600/30 transition-all hover:scale-[1.01] disabled:opacity-50"
                  >
                    {isEvaluating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Running Rubric Evaluator...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Run Rubric Evaluator on Evidence</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Deterministic Rule-Based Evaluator • Zero Hallucination
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
          >
            {evalResult ? 'Close & View Digital Twin' : 'Cancel'}
          </button>
        </div>

      </div>
    </div>
  );
}
