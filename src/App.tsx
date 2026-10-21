import React, { useState } from 'react';
import { ConfigurationForm } from './components/ConfigurationForm';
import { GhostTypingConsole } from './components/GhostTypingConsole';
import { ActionPriorityMatrix } from './components/ActionPriorityMatrix';
import { TrajectoryComparison } from './components/TrajectoryComparison';
import { ModerationConsensusGate } from './components/ModerationConsensusGate';
import {
  CompanyInput,
  EngineResult,
  IngestedSiteData,
} from './types/helios';
import {
  AlertCircle,
  ArrowLeft,
  Terminal,
} from 'lucide-react';

export default function App() {
  const [currentPhase, setCurrentPhase] = useState<'input' | 'generating' | 'results'>('input');

  // Clean initial state with zero test data
  const [formData, setFormData] = useState<CompanyInput>({
    companyName: '',
    industry: '',
    websiteUrl: '',
    employees: 5,
    businessSummary: '',
    currentRevenue: '',
    monthlyUsers: '',
    followerCount: '',
    goalMetric: '',
    additionalContext: '',
    uploadedAssets: [],
  });

  const [ingestedData, setIngestedData] = useState<IngestedSiteData | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<EngineResult | null>(null);

  const handleStartGeneration = async () => {
    setIsRunning(true);
    setErrorMessage(null);
    setCurrentPhase('generating');

    try {
      const resp = await fetch('/api/helios/run-engine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await resp.json();
      if (!resp.ok) {
        throw new Error(json.error || 'Engine analysis failed');
      }

      setResult(json.data);
    } catch (err: any) {
      console.error('Run engine error:', err);
      setErrorMessage(err.message || 'Failed to execute multi-agent engine');
      setCurrentPhase('input');
    } finally {
      setIsRunning(false);
    }
  };

  const handleGhostTypingComplete = () => {
    setCurrentPhase('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditInfo = () => {
    setCurrentPhase('input');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTriggerRetry = async () => {
    setIsRetrying(true);
    setTimeout(async () => {
      await handleStartGeneration();
      setIsRetrying(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-orange-500 selection:text-white">
      {/* Compact Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="w-2.5 h-2.5 bg-orange-600 rounded-none transform rotate-45"></span>
            <span className="text-base font-extrabold tracking-tight font-mono text-neutral-950">
              HELIOS
            </span>
            <span className="text-xs text-neutral-400 font-mono border-l border-neutral-200 pl-2 hidden sm:inline">
              sentur.org
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span
              className={`px-2 py-0.5 ${
                currentPhase === 'input'
                  ? 'bg-neutral-900 text-white font-bold'
                  : 'text-neutral-400'
              }`}
            >
              1. Business Info
            </span>
            <span className="text-neutral-300">→</span>
            <span
              className={`px-2 py-0.5 ${
                currentPhase === 'generating'
                  ? 'bg-orange-600 text-white font-bold'
                  : 'text-neutral-400'
              }`}
            >
              2. 8-Agent Council
            </span>
            <span className="text-neutral-300">→</span>
            <span
              className={`px-2 py-0.5 ${
                currentPhase === 'results'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-neutral-400'
              }`}
            >
              3. Results
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {currentPhase === 'results' ? (
              <button
                onClick={handleEditInfo}
                className="text-xs font-mono font-medium text-neutral-700 hover:text-neutral-950 px-2.5 py-1 border border-neutral-300 hover:border-neutral-400 bg-white transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Edit Info</span>
              </button>
            ) : currentPhase === 'input' ? (
              <button
                onClick={handleStartGeneration}
                disabled={isRunning}
                className="text-xs font-mono font-bold text-white px-3 py-1.5 bg-orange-600 hover:bg-orange-700 transition-colors shadow-2xs"
              >
                Run Engine
              </button>
            ) : null}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {errorMessage && (
          <div className="mb-6 p-3 bg-red-50 border border-red-300 text-red-800 text-xs font-mono flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-red-700 hover:text-red-950 font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {currentPhase === 'input' && (
          <ConfigurationForm
            formData={formData}
            onChange={setFormData}
            onSubmit={handleStartGeneration}
            isRunning={isRunning}
            ingestedData={ingestedData}
            onIngestSuccess={setIngestedData}
          />
        )}

        {currentPhase === 'generating' && (
          <div className="py-4">
            <div className="text-center mb-4">
              <span className="text-xs font-mono text-orange-600 font-semibold uppercase tracking-wider block">
                8-Agent Creative Council
              </span>
              <h2 className="text-xl font-bold text-neutral-950">
                Watching the 8 Specialized Agents Brainstorm Solutions
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Each agent brings a distinct perspective to solve your business challenges and create actionable growth loops.
              </p>
            </div>

            <GhostTypingConsole
              pathways={result?.latentReasoningPathways || []}
              moderationGate={
                result?.moderationGate || {
                  quorumRequired: '3 of 5 Consultant Approvals',
                  passed: true,
                  approvalCount: 4,
                  rejectionCount: 1,
                  verdict: 'APPROVED',
                  consultants: [],
                  consensusCertificate: {
                    signedAt: new Date().toISOString(),
                    consensusHash: '0x8asentur',
                    retryRound: 1,
                    statusNote: 'Quorum reached.',
                  },
                }
              }
              companyName={formData.companyName || 'Your Business'}
              onComplete={handleGhostTypingComplete}
            />
          </div>
        )}

        {currentPhase === 'results' && result && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200">
              <div>
                <span className="text-[11px] font-mono text-orange-600 uppercase font-semibold block">
                  8-Agent Consensus Clear · Phase 03
                </span>
                <h1 className="text-xl font-bold text-neutral-950 font-mono">
                  {result.companyProfile.name} · Decision Intelligence Report
                </h1>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPhase('generating')}
                  className="text-xs font-mono px-3 py-1.5 border border-neutral-300 hover:border-neutral-400 bg-white text-neutral-700 transition-colors flex items-center gap-1.5"
                >
                  <Terminal className="w-3.5 h-3.5 text-orange-600" />
                  <span>Replay Agent Thoughts</span>
                </button>
                <button
                  onClick={handleEditInfo}
                  className="text-xs font-mono px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white transition-colors"
                >
                  Edit Input
                </button>
              </div>
            </div>

            <ActionPriorityMatrix
              executiveSummary={result.executiveSummary}
              companyProfile={result.companyProfile}
              starburstData={result.starburstGraph}
              actions={result.rankedActions}
              onViewGhostLog={() => setCurrentPhase('generating')}
            />

            <TrajectoryComparison
              goalObtainability={result.goalObtainability}
              trajectoryComparison={result.trajectoryComparison}
            />

            <ModerationConsensusGate
              gateData={result.moderationGate}
              onTriggerRetry={handleTriggerRetry}
              isRetrying={isRetrying}
            />
          </div>
        )}
      </main>

      <footer className="border-t border-neutral-200 py-6 mt-12 bg-white text-xs font-mono text-neutral-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-orange-600 transform rotate-45"></span>
            <span className="font-bold text-neutral-900">HELIOS</span>
            <span>· 8-Agent Solution Intelligence</span>
          </div>
          <div className="flex items-center gap-3 text-neutral-400">
            <span>sentur.org</span>
            <span>·</span>
            <span>3 of 5 Consultant Quorum</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
