import React, { useState } from 'react';
import { Lock, Layers, Eye, Check, ShieldCheck, Compass, Info } from 'lucide-react';
import { CustomerVenue } from '../types';

interface VenueLockVisualizerProps {
  venue: CustomerVenue;
}

export const VenueLockVisualizer: React.FC<VenueLockVisualizerProps> = ({ venue }) => {
  const [activeCheckId, setActiveCheckId] = useState<string>('perspective');
  const [showOverlayGrid, setShowOverlayGrid] = useState(true);

  const checks = venue.venueLock.checks;
  const activeCheck = checks.find((c) => c.id === activeCheckId) || checks[0];

  return (
    <section id="venue-lock" className="py-20 bg-[#0C0B0A] border-t border-white/[0.08] relative">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* Header Lock Status */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C5A880]/10 border border-[#C5A880]/30 rounded-sm mb-3">
              <Lock className="w-3.5 h-3.5 text-[#C5A880]" />
              <span className="text-[11px] uppercase tracking-[0.24em] font-medium text-[#C5A880]">
                VENUE LOCK™
              </span>
            </div>
            <h2 className="font-serif-luxury text-3xl md:text-4xl lg:text-5xl text-[#FAF8F5] font-normal mb-2">
              Preserving the character of your actual space
            </h2>
            <p className="text-xs md:text-sm text-[#A8A196] max-w-xl font-light">
              SKETCH recognizes the architectural perspective and boundaries of your uploaded photo, ensuring all proposed décor complements rather than distorts your real venue.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowOverlayGrid(!showOverlayGrid)}
              className={`cursor-pointer flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-[0.16em] transition-all rounded-sm border ${
                showOverlayGrid
                  ? 'bg-white/[0.08] text-[#FAF8F5] border-white/20'
                  : 'bg-transparent text-[#8A8378] border-white/10 hover:border-white/20'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>{showOverlayGrid ? 'Hide Perspective Overlay' : 'Show Perspective Overlay'}</span>
            </button>
          </div>
        </div>

        {/* Visual Arena: Customer's Real Photo with Perspective Overlay */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Visual Viewport */}
          <div className="lg:col-span-8 relative rounded-sm overflow-hidden border border-white/10 bg-[#141312]">
            <div className="aspect-[16/9] w-full relative overflow-hidden">
              <img
                src={venue.image}
                alt={`${venue.name} Locked Perspective`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover filter brightness-[0.92] contrast-[1.04]"
              />

              {/* Realistic Perspective Overlay HUD */}
              {showOverlayGrid && (
                <div className="absolute inset-0 pointer-events-none transition-opacity duration-300">
                  {/* Perspective Horizon and Depth Guides */}
                  <div className="absolute top-[50%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C5A880]/60 to-transparent" />
                  
                  <svg className="absolute inset-0 w-full h-full opacity-60">
                    {/* Vanishing Lines converging on central viewpoint */}
                    <line x1="12%" y1="96%" x2="50%" y2="50%" stroke="#C5A880" strokeWidth="1" strokeDasharray="5 5" />
                    <line x1="88%" y1="96%" x2="50%" y2="50%" stroke="#C5A880" strokeWidth="1" strokeDasharray="5 5" />
                    <line x1="30%" y1="12%" x2="50%" y2="50%" stroke="#C5A880" strokeWidth="0.75" strokeDasharray="4 4" />
                    <line x1="70%" y1="12%" x2="50%" y2="50%" stroke="#C5A880" strokeWidth="0.75" strokeDasharray="4 4" />
                    
                    {/* Focal Reticle */}
                    <circle cx="50%" cy="50%" r="16" fill="none" stroke="#C5A880" strokeWidth="1.5" />
                    <circle cx="50%" cy="50%" r="3" fill="#C5A880" />
                  </svg>

                  {/* Contextual Marker for active check */}
                  {activeCheckId === 'perspective' && (
                    <div className="absolute top-[44%] left-[50%] -translate-x-1/2 bg-[#0C0B0A]/90 backdrop-blur-md border border-[#C5A880] px-3 py-1.5 rounded-sm text-[11px] text-[#FAF8F5] shadow-lg animate-fade-in pointer-events-none">
                      <span className="text-[#C5A880] font-mono-numbers mr-1">01</span>
                      Focal Horizon & Symmetry Line
                    </div>
                  )}

                  {activeCheckId === 'architecture' && (
                    <div className="absolute top-[30%] left-[24%] -translate-x-1/2 bg-[#0C0B0A]/90 backdrop-blur-md border border-[#C5A880] px-3 py-1.5 rounded-sm text-[11px] text-[#FAF8F5] shadow-lg animate-fade-in pointer-events-none">
                      <span className="text-[#C5A880] font-mono-numbers mr-1">02</span>
                      Visible Architectural Wall Surface
                    </div>
                  )}

                  {activeCheckId === 'openings' && (
                    <div className="absolute top-[52%] left-[80%] -translate-x-1/2 bg-[#0C0B0A]/90 backdrop-blur-md border border-[#C5A880] px-3 py-1.5 rounded-sm text-[11px] text-[#FAF8F5] shadow-lg animate-fade-in pointer-events-none">
                      <span className="text-[#C5A880] font-mono-numbers mr-1">03</span>
                      Ingress / Ingress Pathway Openings
                    </div>
                  )}

                  {activeCheckId === 'structure' && (
                    <div className="absolute top-[22%] left-[45%] -translate-x-1/2 bg-[#0C0B0A]/90 backdrop-blur-md border border-[#C5A880] px-3 py-1.5 rounded-sm text-[11px] text-[#FAF8F5] shadow-lg animate-fade-in pointer-events-none">
                      <span className="text-[#C5A880] font-mono-numbers mr-1">04</span>
                      Visible Structural Pillar / Arch Rhythm
                    </div>
                  )}

                  {activeCheckId === 'floor' && (
                    <div className="absolute bottom-[16%] left-[50%] -translate-x-1/2 bg-[#0C0B0A]/90 backdrop-blur-md border border-[#C5A880] px-3 py-1.5 rounded-sm text-[11px] text-[#FAF8F5] shadow-lg animate-fade-in pointer-events-none">
                      <span className="text-[#C5A880] font-mono-numbers mr-1">05</span>
                      Usable Floor Footprint for Banquets & Stage
                    </div>
                  )}

                  {/* Overlay Badges */}
                  <div className="absolute top-4 left-4 text-[10px] font-mono-numbers text-[#C5A880] tracking-wider uppercase bg-[#0C0B0A]/80 px-2 py-1 rounded-[1px] border border-white/10">
                    VENUE LOCK™ // PERSPECTIVE PRESERVED
                  </div>
                  <div className="absolute top-4 right-4 text-[10px] font-mono-numbers text-white/60 tracking-wider bg-[#0C0B0A]/80 px-2 py-1 rounded-[1px] border border-white/10">
                    CAMERA SIGHTLINE LOCKED
                  </div>
                </div>
              )}

              {/* Bottom Real-Estate Info Bar */}
              <div className="absolute bottom-4 left-4 right-4 bg-[#0C0B0A]/85 backdrop-blur-md border border-white/10 p-3 rounded-sm flex items-center justify-between text-xs text-[#C5BFB5]">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="font-serif-luxury text-sm text-[#FAF8F5]">{venue.name}</span>
                  <span aria-hidden="true" className="text-white/20">·</span>
                  <span className="text-[#8A8378]">{venue.estimatedType}</span>
                </div>
                <div className="text-[11px] font-mono-numbers text-[#A8A196]">
                  {venue.knownDimensions}
                </div>
              </div>
            </div>
          </div>

          {/* Verification Indicators Column */}
          <div className="lg:col-span-4 flex flex-col space-y-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs uppercase tracking-[0.2em] text-[#8A8378] font-medium block">
                Visual Preservation Checks
              </span>
              <span className="text-[10px] text-[#C5A880] font-mono-numbers">
                5 Parameters
              </span>
            </div>

            {checks.map((check) => {
              const isSelected = activeCheckId === check.id;
              return (
                <div
                  key={check.id}
                  onClick={() => setActiveCheckId(check.id)}
                  className={`cursor-pointer rounded-sm border p-4 transition-all duration-200 ${
                    isSelected
                      ? 'border-[#C5A880] bg-[#181615] shadow-sm'
                      : 'border-white/[0.08] bg-[#141312] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-serif-luxury text-base text-[#FAF8F5]">
                      {check.title}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-[#C5A880] font-mono-numbers">
                      <Check className="w-3 h-3 text-[#C5A880]" />
                      {check.status}
                    </span>
                  </div>

                  <p className="text-xs text-[#A8A196] leading-relaxed font-light">
                    {check.observation}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mandatory Realistic Disclaimer */}
        <div className="mt-8 p-4 rounded-sm bg-[#141312] border border-[#C5A880]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#A8A196]">
          <div className="flex items-start sm:items-center gap-3">
            <Info className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5 sm:mt-0" />
            <span className="leading-relaxed">
              <strong className="text-[#FAF8F5] font-medium">Visual preservation only.</strong> Final dimensions and structural suitability require on-site verification.
            </span>
          </div>
          <span className="text-[11px] uppercase tracking-widest text-[#C5A880] shrink-0 font-mono-numbers">
            Venue Lock™ Standard
          </span>
        </div>
      </div>
    </section>
  );
};
