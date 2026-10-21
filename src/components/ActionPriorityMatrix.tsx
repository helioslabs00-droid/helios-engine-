import React, { useState } from 'react';
import {
  Clock,
  Calculator,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { RankedAction, StarburstGraphData } from '../types/helios';
import { RadialStarburstGraph } from './RadialStarburstGraph';

interface ActionPriorityMatrixProps {
  executiveSummary: string;
  companyProfile: {
    name: string;
    industry: string;
    headcount: number;
    currentBaseline: string;
    targetHorizon: string;
  };
  starburstData: StarburstGraphData;
  actions: RankedAction[];
  onViewGhostLog: () => void;
}

export const ActionPriorityMatrix: React.FC<ActionPriorityMatrixProps> = ({
  executiveSummary,
  companyProfile,
  starburstData,
  actions,
  onViewGhostLog,
}) => {
  const [filterPriority, setFilterPriority] = useState<'ALL' | 'P0' | 'P1' | 'P2'>('ALL');
  const [expandedActionId, setExpandedActionId] = useState<string | null>(actions?.[0]?.id || null);

  const filteredActions =
    filterPriority === 'ALL'
      ? actions
      : actions.filter((a) => a.priority === filterPriority);

  return (
    <div className="space-y-6">
      {/* Top Split: Executive Summary (Left) + Circular Strength/Weakness Chart (Top Right) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left: Summary & Big Picture in plain English */}
        <div className="md:col-span-7 space-y-4">
          <div className="border border-neutral-200 bg-white p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-orange-600">
                Strategic Summary
              </span>
              <span className="text-xs font-mono text-neutral-500">
                {companyProfile.name} · {companyProfile.headcount} team members
              </span>
            </div>

            <p className="text-sm text-neutral-800 leading-relaxed font-sans">
              {executiveSummary}
            </p>

            <div className="pt-2 border-t border-neutral-100 grid grid-cols-2 gap-3 text-xs font-mono">
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase">Starting Point</span>
                <span className="font-bold text-neutral-900">{companyProfile.currentBaseline}</span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase">Goal Target</span>
                <span className="font-bold text-orange-600 truncate block">
                  {companyProfile.targetHorizon}
                </span>
              </div>
            </div>
          </div>

          {/* Key Recommendation Highlight */}
          <div className="p-4 bg-orange-50 border border-orange-200 flex items-start gap-3 text-xs">
            <Sparkles className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
            <div className="text-neutral-800 leading-relaxed">
              <strong className="text-orange-900 block font-semibold mb-0.5">
                What matters most right now:
              </strong>
              Focus your energy on fixing where potential customers drop off and offering an annual plan discount. That gives you immediate cash flow without burning out your current team.
            </div>
          </div>
        </div>

        {/* Right: The Circular Starburst Graph in the Top Right Corner */}
        <div className="md:col-span-5">
          <RadialStarburstGraph data={starburstData} />
        </div>
      </div>

      {/* Recommended Action Checklist */}
      <div className="border border-neutral-200 bg-white p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 uppercase font-mono tracking-wider">
              Recommended Action Plan
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Prioritized by expected return and team effort, with simple math behind each step.
            </p>
          </div>

          {/* Simple Filter Pills */}
          <div className="flex items-center gap-1 text-xs font-mono">
            {(['ALL', 'P0', 'P1', 'P2'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setFilterPriority(p)}
                className={`px-2.5 py-1 text-xs font-semibold transition-colors ${
                  filterPriority === p
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-600 hover:text-neutral-900 bg-neutral-100'
                }`}
              >
                {p === 'ALL' ? 'All Steps' : p === 'P0' ? 'P0: Do First' : p === 'P1' ? 'P1: Do Next' : 'P2: Later'}
              </button>
            ))}
          </div>
        </div>

        {/* Action Items List */}
        <div className="space-y-3">
          {filteredActions.map((action) => {
            const isExpanded = expandedActionId === action.id;

            return (
              <div
                key={action.id}
                className="border border-neutral-200 hover:border-neutral-300 transition-all bg-white"
              >
                <div
                  onClick={() => setExpandedActionId(isExpanded ? null : action.id)}
                  className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 shrink-0 ${
                        action.priority === 'P0'
                          ? 'bg-orange-600 text-white'
                          : action.priority === 'P1'
                          ? 'bg-neutral-800 text-white'
                          : 'bg-neutral-200 text-neutral-700'
                      }`}
                    >
                      {action.priority}
                    </span>

                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-neutral-900 truncate">
                        {action.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-mono mt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-neutral-400" />
                          <span>{action.timeframe}</span>
                        </span>
                        <span>·</span>
                        <span className="text-orange-600 font-semibold truncate">
                          {action.expectedYield}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] text-neutral-400 uppercase block">Impact</span>
                      <span className="font-bold text-emerald-600 tabular-nums">
                        {action.impactScore}/100
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-neutral-400 uppercase block">Effort</span>
                      <span className="font-bold text-neutral-700 tabular-nums">
                        {action.effortScore}/100
                      </span>
                    </div>

                    <div className="p-1 text-neutral-400">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Math and Reasoning in simple terms */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-neutral-100 bg-neutral-50/60 space-y-2 text-xs">
                    <div className="p-3 bg-white border border-neutral-200 space-y-1">
                      <span className="text-[10px] font-mono uppercase text-orange-600 font-bold block">
                        The Calculation (Why this works):
                      </span>
                      <code className="text-xs text-neutral-900 font-mono bg-neutral-100 px-2 py-0.5 block mb-1">
                        {action.calculationFormula}
                      </code>
                      <p className="text-neutral-700 text-xs leading-relaxed font-sans">
                        {action.calculationDetail}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 pt-1">
                      <span>Owner: {action.ownerAgent}</span>
                      <span>Requirement: {action.dependencies}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
