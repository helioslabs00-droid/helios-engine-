import React from 'react';
import { Cpu, Terminal, ArrowUpRight } from 'lucide-react';

interface TopNavProps {
  onRunEngineClick: () => void;
  isRunning: boolean;
  hasResult: boolean;
  onReset: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  onRunEngineClick,
  isRunning,
  hasResult,
  onReset,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <a href="#" className="flex items-center gap-2 group">
            <span className="w-2.5 h-2.5 bg-orange-600 rounded-none transform rotate-45 group-hover:rotate-90 transition-transform duration-300"></span>
            <span className="text-xl font-extrabold tracking-tight text-neutral-950 font-mono">
              HELIOS
            </span>
          </a>
          <span className="text-xs text-neutral-400 font-mono border-l border-neutral-200 pl-3">
            sentur.org / edge-worker
          </span>
        </div>

        {/* Zone 2: Clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold tracking-wider text-neutral-600 uppercase font-mono">
          <a
            href="#config-matrix"
            className="hover:text-orange-600 transition-colors whitespace-nowrap shrink-0"
          >
            01. Configuration
          </a>
          <a
            href="#latent-pathways"
            className="hover:text-orange-600 transition-colors whitespace-nowrap shrink-0"
          >
            02. Latent Pathways
          </a>
          <a
            href="#consensus-gate"
            className="hover:text-orange-600 transition-colors whitespace-nowrap shrink-0"
          >
            03. Moderation Gate
          </a>
          <a
            href="#decision-roadmap"
            className="hover:text-orange-600 transition-colors whitespace-nowrap shrink-0"
          >
            04. Decision Matrix
          </a>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          {hasResult && (
            <button
              onClick={onReset}
              className="text-xs font-mono font-medium text-neutral-500 hover:text-neutral-900 px-3 py-2 border border-neutral-200 hover:border-neutral-300 transition-colors whitespace-nowrap shrink-0"
            >
              Reset Session
            </button>
          )}
          <button
            onClick={onRunEngineClick}
            disabled={isRunning}
            className={`flex items-center gap-2 px-5 py-2.5 text-xs font-mono font-semibold uppercase tracking-wider text-white transition-all whitespace-nowrap shrink-0 ${
              isRunning
                ? 'bg-neutral-800 cursor-wait opacity-80'
                : 'bg-orange-600 hover:bg-orange-700 active:scale-98 shadow-sm hover:shadow'
            }`}
          >
            {isRunning ? (
              <>
                <Cpu className="w-3.5 h-3.5 animate-spin" />
                <span>Executing Agents...</span>
              </>
            ) : (
              <>
                <Terminal className="w-3.5 h-3.5" />
                <span>{hasResult ? 'Re-Evaluate Consensus' : 'Deploy Analysis'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
