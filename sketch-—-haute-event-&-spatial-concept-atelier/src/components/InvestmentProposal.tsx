import React, { useState } from 'react';
import { Printer, Share2, Calendar, Users, Building, Check, ShieldCheck, Info, AlertCircle } from 'lucide-react';
import { CustomerVenue, ConceptTier, EventVision, OptionalEnhancement } from '../types';
import { OPTIONAL_ENHANCEMENTS, CURRENCY_CONFIGS } from '../data/venues';

interface InvestmentProposalProps {
  venue: CustomerVenue;
  concept: ConceptTier;
  conceptBasePriceINR: number;
  vision: EventVision;
  selectedGeneratedImage?: string | null;
  onToggleEnhancement: (id: string) => void;
  onBookConsultation: () => void;
}

export const InvestmentProposal: React.FC<InvestmentProposalProps> = ({
  venue,
  concept,
  conceptBasePriceINR,
  vision,
  selectedGeneratedImage,
  onToggleEnhancement,
  onBookConsultation,
}) => {
  const [copiedShareLink, setCopiedShareLink] = useState(false);
  const currentCurrency = CURRENCY_CONFIGS[vision.currency] || CURRENCY_CONFIGS.INR;

  // Breakdown calculation
  const breakdown = {
    florals: Math.round(conceptBasePriceINR * concept.breakdownPct.florals),
    lighting: Math.round(conceptBasePriceINR * concept.breakdownPct.lighting),
    furniture: Math.round(conceptBasePriceINR * concept.breakdownPct.furniture),
    stage: Math.round(conceptBasePriceINR * concept.breakdownPct.stage),
    production: Math.round(conceptBasePriceINR * concept.breakdownPct.production),
  };

  // Enhancements total
  const enhancementsTotal = vision.selectedEnhancements.reduce((sum, id) => {
    const item = OPTIONAL_ENHANCEMENTS.find((e) => e.id === id);
    return sum + (item ? item.costINR : 0);
  }, 0);

  const grandTotal = conceptBasePriceINR + enhancementsTotal;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShareLink(true);
    setTimeout(() => setCopiedShareLink(false), 3000);
  };

  return (
    <section id="proposal" className="py-24 bg-[#0E0D0C] border-t border-white/[0.08] relative">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* Dossier Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#C5A880] mb-2 font-medium">
              <span>Design Proposal</span>
              <span aria-hidden="true">·</span>
              <span>Client Review</span>
            </div>
            <h2 className="font-serif-luxury text-3xl md:text-5xl lg:text-6xl text-[#FAF8F5] font-normal">
              Investment Preview & Proposal
            </h2>
          </div>

          <div className="flex items-center gap-3 no-print">
            <button
              onClick={handleShare}
              className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-sm border border-white/10 bg-[#141312] text-xs uppercase tracking-[0.16em] text-[#FAF8F5] hover:border-white/30 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>{copiedShareLink ? 'Link Copied' : 'Share Proposal'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-sm border border-white/10 bg-[#141312] text-xs uppercase tracking-[0.16em] text-[#FAF8F5] hover:border-white/30 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Print Folio</span>
            </button>
          </div>
        </div>

        {/* The Proposal Folio Card */}
        <div className="bg-[#141312] border border-white/[0.08] rounded-sm p-8 md:p-14 shadow-2xl relative overflow-hidden">
          {/* Brand Seal */}
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-6 mb-8">
            <div>
              <span className="font-serif-luxury text-2xl tracking-[0.25em] text-[#FAF8F5] uppercase font-medium">
                SKETCH
              </span>
              <span className="block text-[11px] uppercase tracking-wider text-[#C5A880] mt-0.5">
                Spatial & Event Décor Concept
              </span>
            </div>
            <div className="text-right text-[11px] font-mono-numbers text-[#8A8378]">
              <span>Date: {vision.eventDate || 'Upcoming Celebration'}</span>
            </div>
          </div>

          {/* Event Metadata Banner */}
          <div className="border-b border-white/[0.08] pb-8 mb-10">
            <h3 className="font-serif-luxury text-3xl md:text-4xl text-[#FAF8F5] mb-6">
              {vision.eventType}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs text-[#B8B2A9]">
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-[#7A746B] mb-1">Venue</span>
                <span className="text-[#FAF8F5] font-serif-luxury text-base block">{venue.name}</span>
                <span className="text-[11px] text-[#8A8378]">{venue.estimatedType}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-[#7A746B] mb-1">Guest Scale</span>
                <span className="text-[#FAF8F5] font-serif-luxury text-base block">{vision.guestCount} Guests</span>
                <span className="text-[11px] text-[#8A8378]">Seating & Circulation Aligned</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-[#7A746B] mb-1">Décor Vibe</span>
                <span className="text-[#FAF8F5] font-serif-luxury text-base block">{vision.decorVibe}</span>
                <span className="text-[11px] text-[#8A8378]">Selected Atmosphere</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-[#7A746B] mb-1">Spatial Fidelity</span>
                <span className="text-[#C5A880] font-serif-luxury text-base block">Venue Lock™ Preserved</span>
                <span className="text-[11px] text-[#8A8378]">Survey Required on Site</span>
              </div>
            </div>
          </div>

          {/* Side-by-Side Visual Proof: Customer's Actual Venue + Selected Concept */}
          <div className="mb-12">
            <div className="flex items-center justify-between text-xs text-[#A8A196] uppercase tracking-[0.16em] mb-4">
              <span>Visual Comparison</span>
              <span>Original Venue vs. {concept.title}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer's Actual Venue Photo */}
              <div className="space-y-2">
                <div className="aspect-[16/10] rounded-sm overflow-hidden border border-white/10 bg-[#0C0B0A] relative">
                  <img
                    src={venue.image}
                    alt="Original Venue"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover filter brightness-90"
                  />
                  <div className="absolute bottom-3 left-3 bg-[#0C0B0A]/90 backdrop-blur-md px-2.5 py-1 text-[10px] uppercase tracking-wider text-[#FAF8F5] rounded-sm border border-white/10">
                    Original Venue Photo
                  </div>
                </div>
                <div className="text-[11px] text-[#807A70] flex items-center justify-between font-mono-numbers">
                  <span>{venue.name}</span>
                  <span>{venue.knownDimensions}</span>
                </div>
              </div>

              {/* Selected Concept Visualization */}
              <div className="space-y-2">
                <div className="aspect-[16/10] rounded-sm overflow-hidden border border-[#C5A880]/30 bg-[#0C0B0A] relative shadow-lg">
                  {selectedGeneratedImage ? (
                    <img
                      src={selectedGeneratedImage}
                      alt={concept.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover filter brightness-95"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#121110]">
                      <AlertCircle className="w-8 h-8 text-[#C5A880] mb-2" />
                      <span className="text-xs text-[#FAF8F5] font-medium mb-1">
                        Concept {concept.number} — {concept.title}
                      </span>
                      <p className="text-[11px] text-[#8A8378] max-w-xs font-light">
                        Visual generation unavailable due to API quota. Décor specifications and itemized investment remain active below.
                      </p>
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 bg-[#0C0B0A]/90 backdrop-blur-md px-2.5 py-1 text-[10px] uppercase tracking-wider text-[#C5A880] rounded-sm border border-[#C5A880]/30">
                    {concept.title} · {selectedGeneratedImage ? 'AI Visualization' : 'Concept Blueprint'}
                  </div>
                </div>
                <div className="text-[11px] text-[#807A70] flex items-center justify-between font-mono-numbers">
                  <span>Tier {concept.number}</span>
                  <span className="text-[#C5A880]">Base: {currentCurrency.format(conceptBasePriceINR)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Concept Narrative */}
          <div className="p-6 md:p-8 bg-[#0E0D0C] border border-white/[0.06] rounded-sm mb-12">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="flex-1">
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#C5A880] block mb-1">
                  Creative Direction
                </span>
                <h4 className="font-serif-luxury text-2xl text-[#FAF8F5] mb-2">
                  {concept.title}
                </h4>
                <p className="text-xs text-[#C5A880] uppercase tracking-wider mb-3">
                  {concept.tagline}
                </p>
                <p className="text-xs md:text-sm text-[#A8A196] leading-relaxed font-light mb-4">
                  {concept.description}
                </p>
                <div className="text-xs text-[#8A8378]">
                  <span className="text-[#FAF8F5] font-medium mr-2">Floral Palette:</span>
                  <span>{concept.floralPalette.join(' · ')}</span>
                </div>
              </div>
              <div className="text-right shrink-0 md:border-l md:border-white/[0.08] md:pl-8">
                <span className="block text-[10px] uppercase tracking-widest text-[#7A746B] mb-1">Base Décor</span>
                <div className="font-mono-numbers text-2xl md:text-3xl text-[#FAF8F5] font-medium">
                  {currentCurrency.format(conceptBasePriceINR)}
                </div>
              </div>
            </div>
          </div>

          {/* Optional Enhancements */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-medium block">
                  Optional Enhancements
                </span>
                <span className="text-xs text-[#8A8378]">
                  Select additional features to customize your celebration
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {OPTIONAL_ENHANCEMENTS.map((enhancement) => {
                const isSelected = vision.selectedEnhancements.includes(enhancement.id);
                return (
                  <div
                    key={enhancement.id}
                    onClick={() => onToggleEnhancement(enhancement.id)}
                    className={`cursor-pointer p-4 rounded-sm border transition-all duration-200 flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'border-[#C5A880] bg-[#181615]'
                        : 'border-white/[0.06] bg-[#0E0D0C] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded-sm border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          isSelected
                            ? 'bg-[#C5A880] border-[#C5A880] text-[#0C0B0A]'
                            : 'border-white/20 bg-transparent text-transparent'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <div>
                        <h5 className="text-xs md:text-sm font-medium text-[#FAF8F5] mb-0.5">
                          {enhancement.title}
                        </h5>
                        <p className="text-[11px] text-[#8A8378] font-light">
                          {enhancement.description}
                        </p>
                      </div>
                    </div>

                    <div className="font-mono-numbers text-xs md:text-sm text-[#FAF8F5] shrink-0">
                      +{currentCurrency.format(enhancement.costINR)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Transparent Itemized Pricing */}
          <div className="border-t border-white/[0.08] pt-8 mb-8">
            <span className="text-xs uppercase tracking-[0.2em] text-[#C5A880] block mb-4 font-medium">
              Estimated Investment Breakdown
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
              <div className="space-y-3 font-mono-numbers text-xs text-[#A8A196]">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
                  <span>Floral & Botanical Installations</span>
                  <span className="text-[#FAF8F5]">{currentCurrency.format(breakdown.florals)}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
                  <span>Ambient & Focus Lighting</span>
                  <span className="text-[#FAF8F5]">{currentCurrency.format(breakdown.lighting)}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
                  <span>Furniture, Seating & Linens</span>
                  <span className="text-[#FAF8F5]">{currentCurrency.format(breakdown.furniture)}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
                  <span>Stage & Backdrop Fabrication</span>
                  <span className="text-[#FAF8F5]">{currentCurrency.format(breakdown.stage)}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
                  <span>Crew, Setup & Logistics</span>
                  <span className="text-[#FAF8F5]">{currentCurrency.format(breakdown.production)}</span>
                </div>
                {enhancementsTotal > 0 && (
                  <div className="flex items-center justify-between pb-2 border-b border-white/[0.04] text-[#C5A880]">
                    <span>Selected Optional Enhancements ({vision.selectedEnhancements.length})</span>
                    <span>+{currentCurrency.format(enhancementsTotal)}</span>
                  </div>
                )}
              </div>

              <div className="bg-[#0C0B0A] border border-[#C5A880]/30 p-6 rounded-sm text-right">
                <span className="block text-[11px] uppercase tracking-[0.2em] text-[#C5A880] mb-1 font-medium">
                  Estimated Total
                </span>
                <div className="font-mono-numbers text-3xl md:text-4xl lg:text-5xl text-[#FAF8F5] font-semibold mb-2">
                  {currentCurrency.format(grandTotal)}
                </div>
                <span className="text-[11px] text-[#7A746B]">
                  Includes selected {concept.title} baseline + enhancements
                </span>
              </div>
            </div>
          </div>

          {/* Mandatory Pricing Disclaimer */}
          <div className="p-4 bg-[#0C0B0A] rounded-sm border border-white/[0.06] text-xs text-[#8A8378] leading-relaxed mb-8 flex items-start gap-3">
            <Info className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
            <p>
              <strong className="text-[#FAF8F5] font-medium">Estimate only.</strong> Final pricing depends on venue inspection, measurements, materials, logistics, seasonality and final design approval.
            </p>
          </div>

          {/* Consultation Booking CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/[0.06] no-print">
            <div className="flex items-center gap-2 text-xs text-[#A8A196]">
              <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
              <span>Ready to review with your decorator, planner, or family.</span>
            </div>

            <button
              onClick={onBookConsultation}
              className="cursor-pointer w-full sm:w-auto px-8 py-4 bg-[#C5A880] hover:bg-[#D6BD96] text-[#0C0B0A] font-medium text-xs uppercase tracking-[0.2em] rounded-sm transition-all shadow-[0_8px_25px_rgba(197,168,128,0.2)]"
            >
              Request On-Site Survey & Consultation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
