import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  TrendingUp,
  Sparkles,
  Zap,
  DollarSign,
  Users,
  Cpu,
  GitBranch,
  ShieldCheck,
  FastForward,
  Terminal,
} from 'lucide-react';
import { LatentReasoningPathway, ModerationGateData } from '../types/helios';

interface GhostTypingConsoleProps {
  pathways: LatentReasoningPathway[];
  moderationGate: ModerationGateData;
  companyName: string;
  onComplete: () => void;
}

interface TypingStep {
  agentName: string;
  roleTitle: string;
  iconType: string;
  fullText: string;
  latencyMs: number;
}

export const GhostTypingConsole: React.FC<GhostTypingConsoleProps> = ({
  pathways,
  moderationGate,
  companyName,
  onComplete,
}) => {
  // 8 diverse creative solution agents
  const steps: TypingStep[] =
    pathways && pathways.length >= 8
      ? pathways.map((p) => ({
          agentName: p.agentName,
          roleTitle: p.roleTitle || 'Solution Strategist',
          iconType: p.agentId,
          fullText: `Solution Strategy: ${p.creativeSolution} — Key finding: ${p.keyFinding}`,
          latencyMs: p.latencyMs || 35,
        }))
      : [
          {
            agentName: 'Market Researcher Agent',
            roleTitle: 'Market & Demand Scout',
            iconType: 'researcher',
            fullText: 'Solution: Target underserved micro-niches searching for direct alternatives on community forums.',
            latencyMs: 32,
          },
          {
            agentName: 'Growth Hacker Agent',
            roleTitle: 'Viral Loops & Acquisition Futurist',
            iconType: 'growth_hacker',
            fullText: 'Solution: Build an interactive free calculator tool that users naturally share with peers.',
            latencyMs: 41,
          },
          {
            agentName: 'Brand Storyteller Agent',
            roleTitle: 'Messaging & Emotional Resonance',
            iconType: 'brand_storyteller',
            fullText: 'Solution: Rewrite homepage headline to emphasize 10-second setup instead of technical architecture.',
            latencyMs: 28,
          },
          {
            agentName: 'Product Innovation Architect',
            roleTitle: 'UX & Feature Solution Designer',
            iconType: 'product_architect',
            fullText: 'Solution: Implement a 1-click sample template importer so users experience value instantly.',
            latencyMs: 49,
          },
          {
            agentName: 'Pricing Futurist Agent',
            roleTitle: 'Monetization & Packaging Engineer',
            iconType: 'pricing_futurist',
            fullText: 'Solution: Introduce a 20% annual upfront discount paired with usage tiers for expanding teams.',
            latencyMs: 36,
          },
          {
            agentName: 'Customer Retention Specialist',
            roleTitle: 'Cohort Loyalty & Churn Killer',
            iconType: 'retention_specialist',
            fullText: 'Solution: Trigger automated milestone celebration emails and proactive tips when usage dips.',
            latencyMs: 39,
          },
          {
            agentName: 'Operational Efficiency Lead',
            roleTitle: 'Automation & Leverage Engineer',
            iconType: 'operational_efficiency',
            fullText: 'Solution: Replace manual onboarding calls with an interactive guided checklist and video tours.',
            latencyMs: 45,
          },
          {
            agentName: 'Decision Synthesizer Agent',
            roleTitle: 'Chief Consensus Arbiter',
            iconType: 'decision_synthesizer',
            fullText: 'Solution: Synthesized all agent strategies into 3 immediate P0 execution milestones. Quorum passed!',
            latencyMs: 55,
          },
        ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [completedSteps, setCompletedSteps] = useState<{ name: string; text: string }[]>([]);
  const [progressPercent, setProgressPercent] = useState(10);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentStepIndex >= steps.length) {
      const timer = setTimeout(() => {
        onComplete();
      }, 700);
      return () => clearTimeout(timer);
    }

    const currentStep = steps[currentStepIndex];
    let charIndex = 0;
    setDisplayedText('');

    const interval = setInterval(() => {
      if (charIndex < currentStep.fullText.length) {
        const nextChars = currentStep.fullText.slice(0, charIndex + 4);
        setDisplayedText(nextChars);
        charIndex += 4;

        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      } else {
        clearInterval(interval);
        setCompletedSteps((prev) => [
          ...prev,
          { name: currentStep.agentName, text: currentStep.fullText },
        ]);
        setCurrentStepIndex((prev) => prev + 1);
        setProgressPercent(Math.min(100, Math.round(((currentStepIndex + 1) / steps.length) * 100)));
      }
    }, 22);

    return () => clearInterval(interval);
  }, [currentStepIndex]);

  const handleSkip = () => {
    onComplete();
  };

  const getAgentIcon = (id: string) => {
    switch (id) {
      case 'researcher':
        return <Search className="w-3.5 h-3.5 text-orange-600" />;
      case 'growth_hacker':
        return <TrendingUp className="w-3.5 h-3.5 text-orange-600" />;
      case 'brand_storyteller':
        return <Sparkles className="w-3.5 h-3.5 text-orange-600" />;
      case 'product_architect':
        return <Cpu className="w-3.5 h-3.5 text-orange-600" />;
      case 'pricing_futurist':
        return <DollarSign className="w-3.5 h-3.5 text-orange-600" />;
      case 'retention_specialist':
        return <Users className="w-3.5 h-3.5 text-orange-600" />;
      case 'operational_efficiency':
        return <Zap className="w-3.5 h-3.5 text-orange-600" />;
      case 'decision_synthesizer':
      default:
        return <GitBranch className="w-3.5 h-3.5 text-orange-600" />;
    }
  };

  const activeStep = steps[currentStepIndex] || steps[steps.length - 1];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="border border-neutral-300 bg-white shadow-sm overflow-hidden">
        {/* Terminal Header */}
        <div className="px-4 py-3 bg-neutral-900 text-white flex items-center justify-between font-mono text-xs border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-orange-500 rounded-none transform rotate-45 animate-pulse"></span>
            <span className="font-bold tracking-wider uppercase text-neutral-100">
              8-Agent Creative Solution Council
            </span>
            <span className="text-neutral-500 hidden sm:inline">|</span>
            <span className="text-neutral-400 hidden sm:inline">sentur.org</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-orange-400 font-bold tabular-nums">
              {progressPercent}%
            </span>
            <button
              onClick={handleSkip}
              className="text-neutral-400 hover:text-white px-2 py-0.5 border border-neutral-700 hover:border-neutral-500 transition-colors flex items-center gap-1 text-[11px]"
            >
              <span>Skip</span>
              <FastForward className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-neutral-100 w-full overflow-hidden">
          <div
            className="h-full bg-orange-600 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Live Typing Body */}
        <div
          ref={scrollRef}
          className="p-5 font-mono text-xs bg-neutral-50/70 min-h-[340px] max-h-[460px] overflow-y-auto space-y-4"
        >
          {completedSteps.map((s, idx) => (
            <div
              key={idx}
              className="p-3 bg-white border border-neutral-200/80 space-y-1 transition-opacity duration-300"
            >
              <div className="flex items-center justify-between text-neutral-500 text-[11px]">
                <span className="font-bold text-neutral-800 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500"></span>
                  {s.name}
                </span>
                <span className="text-neutral-400">Solution Proposed</span>
              </div>
              <p className="text-neutral-700 leading-relaxed font-sans text-xs">
                {s.text}
              </p>
            </div>
          ))}

          {currentStepIndex < steps.length && (
            <div className="p-3.5 bg-white border border-orange-300 shadow-2xs space-y-2 relative">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-orange-50 border border-orange-200">
                    {getAgentIcon(activeStep.iconType)}
                  </div>
                  <div>
                    <span className="font-bold text-neutral-900 block font-mono text-xs">
                      {activeStep.agentName}
                    </span>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      {activeStep.roleTitle}
                    </span>
                  </div>
                </div>

                <div className="text-right font-mono text-[11px]">
                  <span className="text-neutral-400 block text-[9px] uppercase">
                    Latency
                  </span>
                  <span className="text-orange-600 font-bold tabular-nums">
                    {activeStep.latencyMs}ms
                  </span>
                </div>
              </div>

              <div className="text-neutral-800 font-sans text-xs leading-relaxed min-h-[42px] pt-1">
                <span>{displayedText}</span>
                <span className="inline-block w-1.5 h-3.5 bg-orange-600 ml-1 translate-y-0.5 animate-pulse"></span>
              </div>
            </div>
          )}
        </div>

        {/* Console Footer */}
        <div className="px-4 py-2.5 bg-white border-t border-neutral-200 flex items-center justify-between text-[11px] font-mono text-neutral-500">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-neutral-400" />
            <span>Analyzing: <strong className="text-neutral-900">{companyName}</strong></span>
          </div>
          <span className="text-orange-600 font-semibold">
            {currentStepIndex < steps.length ? 'Brainstorming creative solutions...' : 'Consensus reached!'}
          </span>
        </div>
      </div>
    </div>
  );
};
