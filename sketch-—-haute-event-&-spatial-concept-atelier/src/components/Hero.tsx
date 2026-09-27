import React from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { SAMPLE_BALLROOM_IMAGE } from '../data/venues';

interface HeroProps {
  onBringVenue: () => void;
  onExploreCurated: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onBringVenue, onExploreCurated }) => {
  return (
    <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
      {/* Background architectural grid */}
      <div className="absolute inset-0 bg-grid-atelier pointer-events-none opacity-40" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#C5A880]/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
        {/* Editorial Sub-kicker */}
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-[#C5A880] mb-6">
          <span>Bespoke Event & Spatial Design</span>
          <span aria-hidden="true" className="text-white/20">·</span>
          <span>Venue Lock™ Visual Preservation</span>
          <span aria-hidden="true" className="text-white/20">·</span>
          <span>Transparent Pricing</span>
        </div>

        {/* Headline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-12">
          <div className="lg:col-span-8">
            <h1 className="font-serif-luxury text-4xl sm:text-5xl md:text-6xl lg:text-[70px] leading-[1.06] text-[#FAF8F5] font-normal tracking-[-0.01em] text-balance">
              Transform your actual venue into three bespoke celebration concepts.
            </h1>
          </div>
          <div className="lg:col-span-4 flex flex-col justify-end">
            <p className="text-sm md:text-base text-[#A8A196] leading-relaxed font-light mb-6">
              Upload a photograph of your event space. SKETCH preserves the camera perspective, walls, and architectural character of your room while generating three distinct décor concepts tailored to your budget.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onBringVenue}
                className="cursor-pointer px-6 py-3.5 text-xs uppercase tracking-[0.18em] font-medium text-[#0C0B0A] bg-[#C5A880] hover:bg-[#D6BD96] transition-all rounded-sm shadow-[0_8px_25px_rgba(197,168,128,0.2)]"
              >
                Bring Your Venue
              </button>
              <button
                onClick={onExploreCurated}
                className="cursor-pointer group flex items-center gap-2 px-5 py-3.5 text-xs uppercase tracking-[0.18em] font-medium text-[#FAF8F5] hover:text-[#C5A880] transition-colors"
              >
                <span>Explore Sample Space</span>
                <ArrowUpRight className="w-4 h-4 text-[#C5A880] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Hero Visual Container */}
        <div className="relative rounded-sm overflow-hidden border border-white/[0.08] shadow-2xl group">
          <div className="aspect-[16/9] w-full max-h-[600px] relative overflow-hidden bg-[#141312]">
            <img
              src={SAMPLE_BALLROOM_IMAGE}
              alt="Sample Event Venue Perspective"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center filter brightness-[0.9] contrast-[1.03] transition-transform duration-1000 group-hover:scale-[1.01]"
            />
            {/* Contrast gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0C0B0A] via-transparent to-black/30 pointer-events-none" />

            {/* Editorial caption */}
            <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-4 pointer-events-none">
              <div>
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#C5A880] block mb-1">
                  Venue Study · Architectural Perspective
                </span>
                <h2 className="font-serif-luxury text-xl md:text-2xl text-[#FAF8F5] font-light">
                  Preserving Your Actual Room Geometry
                </h2>
              </div>
              <div className="flex items-center gap-6 text-xs text-[#C7C0B5] font-mono-numbers">
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-[#8A8378]">Survey Status</span>
                  <span>Requires on-site survey</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-[#8A8378]">Fidelity</span>
                  <span className="text-[#C5A880]">Venue Lock™ Preserved</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footprint note */}
        <div className="mt-8 flex items-center justify-between text-xs text-[#827C72] border-t border-white/[0.06] pt-6 font-light">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]/70" />
            <span>Customer-Uploaded Venue Focus</span>
            <span aria-hidden="true">·</span>
            <span>Room Structure 100% Retained</span>
          </div>
          <button
            onClick={onBringVenue}
            className="flex items-center gap-2 hover:text-[#FAF8F5] transition-colors cursor-pointer"
          >
            <span>Upload your venue photograph below</span>
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
