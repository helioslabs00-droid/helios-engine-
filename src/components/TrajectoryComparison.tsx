import React, { useState } from 'react';
import { TrendingUp, Calculator } from 'lucide-react';
import { GoalObtainability, TrajectoryPoint } from '../types/helios';

interface TrajectoryComparisonProps {
  goalObtainability: GoalObtainability;
  trajectoryComparison: {
    baselineFormula: string;
    plannedFormula: string;
    points: TrajectoryPoint[];
  };
}

export const TrajectoryComparison: React.FC<TrajectoryComparisonProps> = ({
  goalObtainability,
  trajectoryComparison,
}) => {
  const [activeTab, setActiveTab] = useState<'revenue' | 'users'>('revenue');

  const points = trajectoryComparison?.points || [];
  const maxVal = points.length > 0 ? Math.max(
    ...points.map((p) =>
      activeTab === 'revenue' ? p.plannedRevenue : p.plannedUsers
    )
  ) : 100;

  return (
    <div className="border border-neutral-200 bg-white p-5 shadow-2xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200">
        <div>
          <h3 className="text-sm font-bold text-neutral-900 uppercase font-mono tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-orange-600" />
            <span>Growth Projection: Current Path vs New Plan</span>
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            How your revenue and active users compare over 18 months if you make these changes.
          </p>
        </div>

        {/* View Switcher (Revenue vs Active Users) */}
        <div className="flex items-center gap-1 p-0.5 bg-neutral-100 text-xs font-mono">
          <button
            onClick={() => setActiveTab('revenue')}
            className={`px-3 py-1 font-semibold transition-colors ${
              activeTab === 'revenue'
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Revenue ($)
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1 font-semibold transition-colors ${
              activeTab === 'users'
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Active Users
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3 bg-neutral-50 border border-neutral-200">
          <span className="text-[10px] uppercase text-neutral-400 block">Chance of Hitting Goal</span>
          <span className="text-xl font-bold text-neutral-900 tabular-nums block mt-0.5">
            {goalObtainability.probabilityPercent}%
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold">High Confidence</span>
        </div>

        <div className="p-3 bg-neutral-50 border border-neutral-200">
          <span className="text-[10px] uppercase text-neutral-400 block">Estimated Time</span>
          <span className="text-xl font-bold text-neutral-900 tabular-nums block mt-0.5">
            {goalObtainability.estimatedTimeSpanMonths} Months
          </span>
          <span className="text-[10px] text-neutral-400">Quarterly check-ins</span>
        </div>

        <div className="p-3 bg-neutral-50 border border-neutral-200">
          <span className="text-[10px] uppercase text-neutral-400 block">Current Path Annual</span>
          <span className="text-lg font-bold text-neutral-600 tabular-nums block mt-0.5">
            ${(goalObtainability.currentPathProjectedARR / 1000).toFixed(0)}k / yr
          </span>
          <span className="text-[10px] text-neutral-400">Baseline drift</span>
        </div>

        <div className="p-3 bg-orange-50/60 border border-orange-200">
          <span className="text-[10px] uppercase text-orange-600 font-bold block">With New Plan</span>
          <span className="text-lg font-bold text-orange-600 tabular-nums block mt-0.5">
            ${(goalObtainability.plannedPathProjectedARR / 1000).toFixed(0)}k / yr
          </span>
          <span className="text-[10px] text-orange-700 font-bold">
            +{Math.round(
              ((goalObtainability.plannedPathProjectedARR -
                goalObtainability.currentPathProjectedARR) /
                goalObtainability.currentPathProjectedARR) *
                100
            )}% Growth
          </span>
        </div>
      </div>

      {/* Trajectory comparison bars (Correctly toggles between revenue and active users) */}
      <div className="space-y-4 pt-1">
        <div className="flex items-center justify-between text-xs font-mono text-neutral-500 pb-1 border-b border-neutral-100">
          <span>Milestone Checkpoints ({activeTab === 'revenue' ? 'Revenue Projections' : 'Active User Projections'})</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-neutral-300"></span>
              <span>Current Path</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-orange-600"></span>
              <span className="font-bold text-neutral-900">New Plan</span>
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {trajectoryComparison.points.slice(0, 5).map((pt) => {
            const currentVal =
              activeTab === 'revenue' ? pt.currentRevenue : pt.currentUsers;
            const plannedVal =
              activeTab === 'revenue' ? pt.plannedRevenue : pt.plannedUsers;

            const currentPercent = maxVal > 0 ? (currentVal / maxVal) * 100 : 0;
            const plannedPercent = maxVal > 0 ? (plannedVal / maxVal) * 100 : 0;

            return (
              <div key={pt.month} className="space-y-1 font-mono text-xs">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-neutral-800">{pt.month}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-neutral-500">
                      Current:{' '}
                      <strong>
                        {activeTab === 'revenue'
                          ? `$${currentVal.toLocaleString()}`
                          : `${currentVal.toLocaleString()} users`}
                      </strong>
                    </span>
                    <span className="text-orange-600 font-bold">
                      Plan:{' '}
                      <strong>
                        {activeTab === 'revenue'
                          ? `$${plannedVal.toLocaleString()}`
                          : `${plannedVal.toLocaleString()} users`}
                      </strong>
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-orange-100 text-orange-800 font-semibold">
                      +{pt.deltaYieldPercent}%
                    </span>
                  </div>
                </div>

                {/* Dual comparison bars */}
                <div className="space-y-1">
                  <div className="h-1.5 bg-neutral-100 w-full overflow-hidden">
                    <div
                      className="h-full bg-neutral-300"
                      style={{ width: `${currentPercent}%` }}
                    />
                  </div>
                  <div className="h-2.5 bg-neutral-100 w-full overflow-hidden">
                    <div
                      className="h-full bg-orange-600"
                      style={{ width: `${plannedPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Simple Explanation of the Math */}
        <div className="p-3 bg-neutral-50 border border-neutral-200 text-xs text-neutral-700 leading-relaxed space-y-1 font-sans">
          <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-neutral-900 uppercase">
            <Calculator className="w-3.5 h-3.5 text-orange-600" />
            <span>How this projection works:</span>
          </div>
          <p className="text-[11px] text-neutral-600">
            {activeTab === 'revenue'
              ? 'Your baseline path assumes a standard 4% monthly increase without changing your current funnel. The new plan factors in a +22% cash collection boost from annual pricing and an extra 75 customer signups a month by removing checkout friction.'
              : 'User growth trajectories reflect the 8-agent conversion lifts (simplifying landing page copy and 1-click template imports), expanding active user signups by 13% month-over-month.'}
          </p>
        </div>
      </div>
    </div>
  );
};
