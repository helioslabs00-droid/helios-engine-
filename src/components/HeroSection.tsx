import React from 'react';
import { ShieldCheck, Activity, Layers, ArrowDown } from 'lucide-react';
import heroImage from '../assets/images/helios_edge_neural_1792366448564.jpg';

interface HeroSectionProps {
  onLoadPreset: (presetKey: 'saas' | 'ecommerce' | 'devtools') => void;
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onLoadPreset, onExploreClick }) => {
  return (
    <section className="relative pt-12 pb-16 border-b border-neutral-200 overflow-hidden bg-white">
      {/* Phantom grid background pattern */}
      <div className="absolute inset-0 phantom-grid pointer-events-none opacity-60" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Mission & Positioning */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 uppercase tracking-widest">
              <span className="text-orange-600 font-bold">sentur.org</span>
              <span aria-hidden="true">/</span>
              <span>Edge Decision Kernel</span>
              <span aria-hidden="true">/</span>
              <span>Worker Node V8</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-950 text-balance leading-none">
              HELIOS <br />
              <span className="text-orange-600 font-light tracking-normal">
                Decision Intelligence
              </span>
            </h1>

            <p className="text-base sm:text-lg text-neutral-600 max-w-2xl leading-relaxed">
              An edge-native multi-agent intelligence engine engineered for Cloudflare Workers. 
              Helios deploys 5 autonomous reasoning agents—Researcher, Growth Strategist, Fact Checker, Feasibility Analyst, and Decision Synthesizer—subject to a 3-agent moderation consensus gate before committing high-stakes business operations.
            </p>

            {/* Micro specs / edge characteristics */}
            <div className="grid grid-cols-3 gap-4 pt-2 border-t border-neutral-100">
              <div>
                <span className="text-[11px] font-mono uppercase text-neutral-400 block">Agent Pipeline</span>
                <span className="text-sm font-mono font-bold text-neutral-900">5 Autonomous Nodes</span>
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase text-neutral-400 block">Quorum Rule</span>
                <span className="text-sm font-mono font-bold text-orange-600">2 / 3 Consensus</span>
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase text-neutral-400 block">Target Runtime</span>
                <span className="text-sm font-mono font-bold text-neutral-900">Edge Worker &lt; 50ms</span>
              </div>
            </div>

            {/* Quick Demo Pre-load actions */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-neutral-400 mr-1">Load Seed Blueprint:</span>
              <button
                onClick={() => onLoadPreset('saas')}
                className="text-xs font-mono px-3 py-1.5 border border-neutral-200 hover:border-orange-500 hover:text-orange-600 transition-colors bg-neutral-50"
              >
                SaaS B2B Cloud
              </button>
              <button
                onClick={() => onLoadPreset('ecommerce')}
                className="text-xs font-mono px-3 py-1.5 border border-neutral-200 hover:border-orange-500 hover:text-orange-600 transition-colors bg-neutral-50"
              >
                E-Commerce D2C
              </button>
              <button
                onClick={() => onLoadPreset('devtools')}
                className="text-xs font-mono px-3 py-1.5 border border-neutral-200 hover:border-orange-500 hover:text-orange-600 transition-colors bg-neutral-50"
              >
                Developer API Engine
              </button>
            </div>
          </div>

          {/* Right Column: Phantom Edge Artwork */}
          <div className="lg:col-span-5 relative">
            <div className="relative border border-neutral-200 bg-neutral-50 p-2 shadow-xs group">
              <div className="relative overflow-hidden aspect-16/10 bg-white">
                <img
                  src={heroImage}
                  alt="Helios Phantom Edge Neural Architecture"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
                />
                {/* Phantom HUD Overlay */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 border border-neutral-200/80 text-[10px] font-mono text-neutral-700">
                  LATENT_EDGE_GRAPH // VERIFIED
                </div>
                <div className="absolute bottom-3 right-3 bg-neutral-950/90 backdrop-blur-xs px-2.5 py-1 text-[10px] font-mono text-white flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-none transform rotate-45"></span>
                  sentur.org
                </div>
              </div>

              {/* Edge caption bar */}
              <div className="mt-2 px-1 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                <span>MODEL: GEMINI 3.8 FLASH</span>
                <span className="text-orange-600 font-semibold">PHANTOM RUNTIME</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
