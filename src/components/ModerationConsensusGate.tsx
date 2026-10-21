import React, { useState } from 'react';
import {
  ShieldCheck,
  RotateCcw,
  Users,
  Check,
  X,
  Briefcase,
  Award,
} from 'lucide-react';
import { ModerationGateData, ConsultantVote } from '../types/helios';

interface ModerationConsensusGateProps {
  gateData: ModerationGateData;
  onTriggerRetry: () => void;
  isRetrying: boolean;
}

export const ModerationConsensusGate: React.FC<ModerationConsensusGateProps> = ({
  gateData,
  onTriggerRetry,
  isRetrying,
}) => {
  const [overrideSimulateReject, setOverrideSimulateReject] = useState(false);

  const consultants = gateData.consultants || [];
  const approvals = overrideSimulateReject
    ? consultants.filter((c, idx) => idx !== 4).length
    : consultants.filter((c) => c.vote === 'APPROVED').length;
  const isApproved = !overrideSimulateReject && gateData.passed && approvals >= 3;

  return (
    <div className="border border-neutral-200 bg-white p-5 shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-100">
        <div>
          <h3 className="text-sm font-bold text-neutral-900 uppercase font-mono tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-orange-600" />
            <span>Consultant Advisory Board (5-Member Expert Team)</span>
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Senior management consultants (ex-McKinsey, Goldman Sachs, Bain) review, debate, and vote on the final strategy. Requires at least 3 of 5 approvals.
          </p>
        </div>

        <div
          className={`px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 ${
            isApproved ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
          }`}
        >
          {isApproved ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Board Approved ({approvals}/5 Quorum)</span>
            </>
          ) : (
            <>
              <X className="w-3.5 h-3.5" />
              <span>Board Review Failed ({approvals}/5 Votes)</span>
            </>
          )}
        </div>
      </div>

      {/* 5 Consultants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {consultants.map((consultant, index) => {
          const currentVote =
            overrideSimulateReject && index === 4 ? 'REJECTED' : consultant.vote;
          const isVoteApproved = currentVote === 'APPROVED';

          return (
            <div
              key={consultant.id || index}
              className={`p-3.5 border text-xs space-y-2 flex flex-col justify-between ${
                isVoteApproved
                  ? 'border-neutral-200 bg-neutral-50/50'
                  : 'border-red-300 bg-red-50/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200/60 mb-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Briefcase className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                    <span className="font-bold text-neutral-900 font-mono text-xs truncate">
                      {consultant.name}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 shrink-0 ${
                      isVoteApproved ? 'bg-neutral-900 text-white' : 'bg-red-600 text-white'
                    }`}
                  >
                    {currentVote}
                  </span>
                </div>

                <div className="space-y-1 mb-2">
                  <span className="text-[11px] font-semibold text-orange-800 block font-mono">
                    {consultant.role}
                  </span>
                  <span className="text-[10px] text-neutral-400 block font-mono">
                    {consultant.firmBackground}
                  </span>
                </div>

                <p className="text-[11px] text-neutral-600 leading-relaxed font-sans mb-2">
                  "{consultant.critique}"
                </p>

                <div className="p-2 bg-white border border-neutral-200 text-[10px] text-neutral-700 font-mono">
                  <strong className="text-orange-700 uppercase block mb-0.5">Stipulation:</strong>
                  {consultant.stipulation}
                </div>
              </div>

              <div className="pt-2.5 mt-2 border-t border-neutral-200/60 flex items-center justify-between text-[11px] font-mono">
                <span className="text-neutral-500">Score: <strong className="text-neutral-900">{consultant.score}/100</strong></span>
                <span className="text-neutral-500">Confidence: <strong className="text-neutral-900">{consultant.confidence}%</strong></span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer / Simulation Controls */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-neutral-500 border-t border-neutral-100">
        <span>
          {isApproved
            ? gateData.consensusCertificate.statusNote
            : 'Board quorum not met. Revisions required.'}
        </span>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setOverrideSimulateReject(!overrideSimulateReject)}
            className="text-[11px] px-2.5 py-1 border border-neutral-200 hover:border-neutral-400 bg-white text-neutral-700"
          >
            {overrideSimulateReject ? 'Show All Approved' : 'Simulate Consultant Rejection'}
          </button>
          {!isApproved && (
            <button
              onClick={onTriggerRetry}
              disabled={isRetrying}
              className="text-[11px] font-bold px-3 py-1 bg-red-600 hover:bg-red-700 text-white uppercase tracking-wider flex items-center gap-1"
            >
              <RotateCcw className={`w-3 h-3 ${isRetrying ? 'animate-spin' : ''}`} />
              <span>Revise Strategy</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
