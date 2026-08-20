import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  Printer, 
  Copy, 
  Check, 
  QrCode, 
  Award, 
  CheckCircle2, 
  ExternalLink,
  Code2
} from 'lucide-react';

export default function CredentialExportModal({ profile, readiness, skillGraphs = [], onClose }) {
  const [copied, setCopied] = useState(false);

  const candidateName = profile?.user?.name || 'Verified Student';
  const targetRole = profile?.targetRole?.name || 'Software Engineer';
  const score = readiness?.readinessScore || 0;
  const verificationHash = `ST-2026-${Math.abs(candidateName.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)).toString(16).toUpperCase()}-VERIFIED`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `https://skilltwin.dev/verify/${verificationHash}\nSkillTwin Verified Credential for ${candidateName} — ${score}% Readiness for ${targetRole}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-8 animate-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-400" />
            <h3 className="text-sm font-bold text-white">
              Verified Digital Skill Credential
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Card Content (Printable) */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          <div id="printable-credential" className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-brand-950/40 border-2 border-brand-500/40 shadow-2xl relative overflow-hidden space-y-6">
            
            {/* Background Seal watermark */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Credential Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-600 to-cyan-400 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-extrabold text-base tracking-tight text-white">
                    SkillTwin Verified Credential
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 font-mono">
                  ID: {verificationHash}
                </p>
              </div>

              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-black text-emerald-400 block">
                  {score}%
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Readiness Index
                </span>
              </div>
            </div>

            {/* Candidate Title */}
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Candidate Certification
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {candidateName}
              </h2>
              <p className="text-xs sm:text-sm text-cyan-300 font-semibold">
                Benchmarked for {targetRole}
              </p>
              <p className="text-xs text-slate-400">
                {profile?.degree || 'Computer Science'} • Verified via Rule-Based Evidence Heuristics
              </p>
            </div>

            {/* Verified Skills Grid */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Demonstrated Competencies:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {skillGraphs.map((sk) => (
                  <div 
                    key={sk.skillName}
                    className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <span className="font-semibold text-slate-200 truncate pr-2">
                      {sk.skillName}
                    </span>
                    <span className="font-mono font-bold text-cyan-400">
                      {sk.currentScore}/100
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Credential Footer Verification Details */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-400">
              <div className="space-y-0.5">
                <p className="font-semibold text-slate-300">Evidence Verification Protocol</p>
                <p>Checklist Rubric Evaluator • Zero ML Hallucination</p>
                <p className="font-mono text-[10px] text-slate-500">Issued: {new Date().toLocaleDateString()}</p>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800">
                <QrCode className="w-7 h-7 text-brand-400" />
                <div className="text-[9px] font-mono leading-tight text-slate-400">
                  <span>SCAN TO</span><br />
                  <strong className="text-white">VERIFY TWIN</strong>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Verification Link Copied!' : 'Copy Shareable Link'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white shadow-md shadow-brand-600/30 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
