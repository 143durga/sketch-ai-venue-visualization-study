import React from 'react';
import { Users, Calendar, ArrowRight, IndianRupee, Sparkles } from 'lucide-react';
import { EventVision } from '../types';
import { EVENT_TYPES, DECOR_VIBES, BUDGET_TIERS, CURRENCY_CONFIGS } from '../data/venues';

interface VisionAtelierProps {
  vision: EventVision;
  onChangeVision: (updated: Partial<EventVision>) => void;
  onRevealVision: () => void;
  isStudying: boolean;
  studyStep: string;
}

export const VisionAtelier: React.FC<VisionAtelierProps> = ({
  vision,
  onChangeVision,
  onRevealVision,
  isStudying,
  studyStep,
}) => {
  const currentCurrency = CURRENCY_CONFIGS[vision.currency] || CURRENCY_CONFIGS.INR;

  return (
    <section id="vision-atelier" className="py-20 bg-[#0E0D0C] border-t border-white/[0.08]">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#C5A880] mb-2 font-medium">
              <span>Step 02</span>
              <span aria-hidden="true">·</span>
              <span>Creative Direction</span>
            </div>
            <h2 className="font-serif-luxury text-3xl md:text-4xl lg:text-5xl text-[#FAF8F5] font-normal">
              Event Parameters & Décor Style
            </h2>
          </div>
          <p className="max-w-md text-xs md:text-sm text-[#A8A196] leading-relaxed font-light">
            Set your event scale, date, and target budget. SKETCH computes your three concepts (Essential, Signature, and Luxury) directly from these parameters.
          </p>
        </div>

        {/* Input Chamber */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Event Type, Date, & Décor Vibe */}
          <div className="lg:col-span-7 space-y-7 bg-[#141312] p-6 md:p-8 rounded-sm border border-white/[0.08]">
            {/* Event Typology */}
            <div>
              <label className="block text-xs uppercase tracking-[0.16em] text-[#C5A880] mb-3 font-medium">
                Event Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {EVENT_TYPES.map((type) => {
                  const isSelected = vision.eventType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => onChangeVision({ eventType: type })}
                      className={`cursor-pointer text-left p-3 rounded-sm border text-xs transition-all ${
                        isSelected
                          ? 'border-[#C5A880] bg-[#1C1A18] text-[#FAF8F5] font-medium'
                          : 'border-white/[0.08] bg-[#0E0D0C] text-[#A8A196] hover:border-white/20'
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Event Date Picker */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-[0.16em] text-[#C5A880] mb-2 font-medium">
                  Event Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={vision.eventDate}
                    onChange={(e) => onChangeVision({ eventDate: e.target.value })}
                    className="w-full bg-[#0C0B0A] border border-white/10 rounded-sm px-3.5 py-2.5 text-xs text-[#FAF8F5] focus:border-[#C5A880] focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.16em] text-[#C5A880] mb-2 font-medium">
                  Guest Scale
                </label>
                <div className="flex items-center gap-3 bg-[#0C0B0A] border border-white/10 rounded-sm px-3.5 py-2">
                  <Users className="w-4 h-4 text-[#C5A880]" />
                  <input
                    type="number"
                    min={20}
                    max={2000}
                    step={10}
                    value={vision.guestCount}
                    onChange={(e) => onChangeVision({ guestCount: Math.max(10, Number(e.target.value)) })}
                    className="w-full bg-transparent text-xs text-[#FAF8F5] font-mono-numbers focus:outline-none"
                  />
                  <span className="text-xs text-[#8A8378]">Guests</span>
                </div>
              </div>
            </div>

            {/* Décor Style / Vibe Selection */}
            <div>
              <label className="block text-xs uppercase tracking-[0.16em] text-[#C5A880] mb-3 font-medium">
                Décor Style & Visual Vibe
              </label>
              <div className="space-y-2.5">
                {DECOR_VIBES.map((vibe) => {
                  const isSelected = vision.decorVibe === vibe.name;
                  return (
                    <div
                      key={vibe.name}
                      onClick={() => onChangeVision({ decorVibe: vibe.name })}
                      className={`cursor-pointer p-3.5 rounded-sm border transition-all ${
                        isSelected
                          ? 'border-[#C5A880] bg-[#1C1A18]'
                          : 'border-white/[0.08] bg-[#0E0D0C] hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-medium ${isSelected ? 'text-[#FAF8F5]' : 'text-[#C5BFB5]'}`}>
                          {vibe.name}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] text-[#C5A880] uppercase tracking-wider font-mono-numbers">
                            Selected
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#807A70] font-light leading-relaxed">
                        {vibe.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom Notes */}
            <div>
              <label className="block text-xs uppercase tracking-[0.16em] text-[#C5A880] mb-2 font-medium">
                Specific Décor Priorities & Desires
              </label>
              <textarea
                value={vision.customNotes}
                onChange={(e) => onChangeVision({ customNotes: e.target.value })}
                rows={3}
                placeholder="e.g. Focus on a grand floral stage, warm perimeter uplighting, traditional brass accents, and minimalist dining runners..."
                className="w-full bg-[#0C0B0A] border border-white/10 rounded-sm p-3 text-xs text-[#FAF8F5] placeholder-[#555048] focus:border-[#C5A880] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Right Column: Target Budget Calibration & Primary Action */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-7 bg-[#141312] p-6 md:p-8 rounded-sm border border-white/[0.08]">
            {/* Target Budget Slider & Presets */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-[0.16em] text-[#C5A880] font-medium">
                  Target Décor Budget
                </span>
                <span className="text-[11px] text-[#8A8378]">Customer-Driven</span>
              </div>

              {/* Large Current Budget Display */}
              <div className="font-mono-numbers text-3xl md:text-4xl text-[#FAF8F5] font-medium mb-3">
                {currentCurrency.format(vision.targetBudgetINR)}
              </div>

              {/* Quick Presets */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                {BUDGET_TIERS.map((tier) => {
                  const isCurrent = vision.targetBudgetINR === tier.value;
                  return (
                    <button
                      key={tier.value}
                      type="button"
                      onClick={() => onChangeVision({ targetBudgetINR: tier.value })}
                      className={`cursor-pointer p-2 rounded-sm border text-[11px] font-mono-numbers transition-all text-center ${
                        isCurrent
                          ? 'border-[#C5A880] bg-[#1C1A18] text-[#FAF8F5] font-semibold'
                          : 'border-white/[0.08] bg-[#0E0D0C] text-[#8A8378] hover:border-white/20'
                      }`}
                    >
                      {currentCurrency.format(tier.value)}
                    </button>
                  );
                })}
              </div>

              {/* Continuous Range Slider */}
              <input
                type="range"
                min={200000}
                max={8000000}
                step={50000}
                value={vision.targetBudgetINR}
                onChange={(e) => onChangeVision({ targetBudgetINR: Number(e.target.value) })}
                className="w-full accent-[#C5A880] bg-white/10 h-1.5 rounded-lg cursor-pointer"
              />
              <div className="flex items-center justify-between text-[11px] text-[#7A746B] mt-1.5 font-mono-numbers">
                <span>{currentCurrency.format(200000)}</span>
                <span>{currentCurrency.format(8000000)}</span>
              </div>
            </div>

            {/* Transparent Calculation Insight */}
            <div className="p-4 bg-[#0C0B0A] rounded-sm border border-white/[0.06] text-xs space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-[#C5A880] font-medium block">
                How SKETCH Calculates Your 3 Concepts
              </span>
              <p className="text-[11px] text-[#A8A196] leading-relaxed font-light">
                Prices are computed transparently from your <strong className="text-[#FAF8F5]">target budget</strong>, <strong className="text-[#FAF8F5]">{vision.guestCount} guests</strong>, and tier multiplier:
              </p>
              <ul className="text-[11px] text-[#807A70] space-y-1 font-mono-numbers">
                <li>• 01 — Essential: ~90% of budget ({currentCurrency.format(vision.targetBudgetINR * 0.9)})</li>
                <li>• 02 — Signature: ~130% of budget ({currentCurrency.format(vision.targetBudgetINR * 1.3)})</li>
                <li>• 03 — Luxury: ~185% of budget ({currentCurrency.format(vision.targetBudgetINR * 1.85)})</li>
              </ul>
            </div>

            {/* Primary Action Button: "Reveal Your Vision" */}
            <div className="pt-2">
              <button
                type="button"
                onClick={onRevealVision}
                disabled={isStudying}
                className="cursor-pointer w-full group py-4 px-6 rounded-sm bg-[#C5A880] hover:bg-[#D6BD96] disabled:bg-[#3D372E] text-[#0C0B0A] font-medium text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-[0_8px_30px_rgba(197,168,128,0.22)]"
              >
                {isStudying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#0C0B0A] border-t-transparent rounded-full animate-spin" />
                    <span>{studyStep || 'Preparing Concepts...'}</span>
                  </>
                ) : (
                  <>
                    <span>Reveal Your Vision</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="text-center mt-3">
                <span className="text-[10px] uppercase tracking-[0.16em] text-[#7A746B]">
                  Tailored to your actual venue photo & budget
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
