import React, { useState } from 'react';
import { StarburstGraphData, RadarDimension } from '../types/helios';

interface RadialStarburstGraphProps {
  data: StarburstGraphData;
}

export const RadialStarburstGraph: React.FC<RadialStarburstGraphProps> = ({ data }) => {
  const dimensions = data?.radarDimensions || [];
  const [activeDimension, setActiveDimension] = useState<RadarDimension | null>(
    dimensions[0] || null
  );

  const size = 320;
  const center = size / 2;
  const maxRadius = 115;
  const minRadius = 38;

  const angleStep = dimensions.length > 0 ? (2 * Math.PI) / dimensions.length : 1;

  return (
    <div className="bg-white border border-neutral-200 p-5 shadow-xs relative">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-2">
        <div>
          <span className="text-[11px] font-mono tracking-widest uppercase text-orange-600 font-semibold block">
            Core Capability Geometry
          </span>
          <h3 className="text-sm font-bold text-neutral-900">
            Radial Starburst Diagnostic
          </h3>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-mono uppercase text-neutral-400 block">Status</span>
          <span className="text-xs font-mono font-medium text-emerald-600">Converged</span>
        </div>
      </div>

      <div className="relative flex items-center justify-center py-1">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full max-w-[280px] h-auto overflow-visible select-none"
        >
          {/* Reference concentric rings */}
          {[0.25, 0.5, 0.75, 1.0].map((level, i) => (
            <circle
              key={i}
              cx={center}
              cy={center}
              r={minRadius + (maxRadius - minRadius) * level}
              fill="none"
              stroke="#e5e5e5"
              strokeDasharray={i === 3 ? 'none' : '3 3'}
              strokeWidth={i === 3 ? 1 : 0.75}
            />
          ))}

          {/* Connective polygon fill between branch tips */}
          <polygon
            points={dimensions
              .map((dim, idx) => {
                const angle = idx * angleStep - Math.PI / 2;
                const len = minRadius + (maxRadius - minRadius) * (dim.score / 100);
                const x = center + len * Math.cos(angle);
                const y = center + len * Math.sin(angle);
                return `${x},${y}`;
              })
              .join(' ')}
            fill="rgba(217, 83, 30, 0.08)"
            stroke="#d9531e"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />

          {/* Radiating branches / spokes */}
          {dimensions.map((dim, idx) => {
            const angle = idx * angleStep - Math.PI / 2;
            const spokeLen = minRadius + (maxRadius - minRadius) * (dim.score / 100);
            const x = center + spokeLen * Math.cos(angle);
            const y = center + spokeLen * Math.sin(angle);
            const fullX = center + (maxRadius + 18) * Math.cos(angle);
            const fullY = center + (maxRadius + 18) * Math.sin(angle);

            const isHovered = activeDimension?.axis === dim.axis;

            return (
              <g
                key={dim.axis}
                className="cursor-pointer group"
                onMouseEnter={() => setActiveDimension(dim)}
                onClick={() => setActiveDimension(dim)}
              >
                {/* Spoke line from hub */}
                <line
                  x1={center + minRadius * Math.cos(angle)}
                  y1={center + minRadius * Math.sin(angle)}
                  x2={x}
                  y2={y}
                  stroke={isHovered ? '#b83e10' : '#d9531e'}
                  strokeWidth={isHovered ? 2.5 : 1.75}
                  strokeLinecap="round"
                />

                {/* Node at tip */}
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 6 : 4.5}
                  fill={isHovered ? '#d9531e' : '#ffffff'}
                  stroke="#d9531e"
                  strokeWidth="2"
                  className="transition-all duration-200"
                />

                {/* Outer label */}
                <text
                  x={fullX}
                  y={fullY}
                  fontSize="8.5"
                  fontFamily="'JetBrains Mono', monospace"
                  fontWeight={isHovered ? '700' : '500'}
                  fill={isHovered ? '#b83e10' : '#525252'}
                  textAnchor={
                    Math.abs(Math.cos(angle)) < 0.2
                      ? 'middle'
                      : Math.cos(angle) > 0
                      ? 'start'
                      : 'end'
                  }
                  dominantBaseline="central"
                >
                  {dim.axis.split(' ')[0]} ({dim.score})
                </text>
              </g>
            );
          })}

          {/* Central Composite Score Hub */}
          <circle
            cx={center}
            cy={center}
            r={minRadius}
            fill="#ffffff"
            stroke="#171717"
            strokeWidth="1.5"
            className="filter drop-shadow-xs"
          />
          <circle
            cx={center}
            cy={center}
            r={minRadius - 5}
            fill="#fff7f2"
            stroke="#f0cbb8"
            strokeWidth="1"
          />
          <text
            cx={center}
            cy={center - 7}
            x={center}
            y={center - 6}
            textAnchor="middle"
            fontSize="18"
            fontWeight="800"
            fontFamily="'Plus Jakarta Sans', sans-serif"
            fill="#d9531e"
          >
            {data.overallScore}
          </text>
          <text
            x={center}
            y={center + 10}
            textAnchor="middle"
            fontSize="7"
            fontFamily="'JetBrains Mono', monospace"
            fontWeight="600"
            letterSpacing="1"
            fill="#737373"
          >
            OVERALL
          </text>
        </svg>
      </div>

      {/* Interactive detail card for active dimension */}
      {activeDimension && (
        <div className="mt-3 pt-3 border-t border-neutral-100 bg-neutral-50/70 p-2.5">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-neutral-900 font-mono">
              {activeDimension.axis}
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-orange-600 font-bold tabular-nums">
                {activeDimension.score}/100
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">
                (bm: {activeDimension.benchmark})
              </span>
            </div>
          </div>
          <p className="text-[11px] text-neutral-600 leading-relaxed">
            {activeDimension.rationale}
          </p>
        </div>
      )}
    </div>
  );
};
