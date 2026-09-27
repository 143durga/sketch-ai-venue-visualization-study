import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp,
  Sliders,
  AlertCircle,
  Building,
  RefreshCw,
  Eye,
  Check,
  Info,
  Terminal,
} from 'lucide-react';
import { CustomerVenue, ConceptTier, EventVision } from '../types';
import { CONCEPT_TEMPLATES, CURRENCY_CONFIGS } from '../data/venues';

interface ConceptSpreadProps {
  venue: CustomerVenue;
  vision: EventVision;
  selectedConceptId: 'essential' | 'signature' | 'luxury';
  onSelectConcept: (id: 'essential' | 'signature' | 'luxury') => void;
  onProceedToQuote: () => void;
  generatedConcepts: Record<string, { imageUrl?: string; status: 'idle' | 'generating' | 'completed' | 'unavailable'; message?: string }>;
  onRetryGeneration?: (tierId: 'essential' | 'signature' | 'luxury') => void;
}

export const ConceptSpread: React.FC<ConceptSpreadProps> = ({
  venue,
  vision,
  selectedConceptId,
  onSelectConcept,
  onProceedToQuote,
  generatedConcepts,
  onRetryGeneration,
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [viewMode, setViewMode] = useState<'edited' | 'compare' | 'original'>('compare');
  const [showQuotaDetails, setShowQuotaDetails] = useState(false);
  const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({
    essential: false,
    signature: true,
    luxury: false,
  });

  const currentCurrency = CURRENCY_CONFIGS[vision.currency] || CURRENCY_CONFIGS.INR;

  const calculateTierPrice = (multiplier: number) => {
    const guestScale = 0.85 + (vision.guestCount / 150) * 0.15;
    return Math.round(vision.targetBudgetINR * multiplier * guestScale);
  };

  const concepts = (['essential', 'signature', 'luxury'] as const).map((key) => {
    const template = CONCEPT_TEMPLATES[key];
    const price = calculateTierPrice(template.budgetMultiplier);
    const genData = generatedConcepts[key];

    return {
      tier: template,
      price,
      generatedImage: genData?.imageUrl || null,
      generationStatus: genData?.status || 'idle',
      generationMessage: genData?.message || null,
      breakdown: {
        florals: Math.round(price * template.breakdownPct.florals),
        lighting: Math.round(price * template.breakdownPct.lighting),
        furniture: Math.round(price * template.breakdownPct.furniture),
        stage: Math.round(price * template.breakdownPct.stage),
        production: Math.round(price * template.breakdownPct.production),
      },
    };
  });

  const activeConceptData = concepts.find((c) => c.tier.id === selectedConceptId) || concepts[1];
  const {
    tier: activeTier,
    price: activePrice,
    breakdown: activeBreakdown,
    generatedImage: activeGeneratedImage,
    generationStatus: activeGenerationStatus,
    generationMessage: activeGenerationMessage,
  } = activeConceptData;

  const toggleExpand = (id: string) => {
    setExpandedDetails((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const hasGeneratedVisual = !!activeGeneratedImage;

  return (
    <section id="concepts" className="py-24 bg-[#0C0B0A] border-t border-white/[0.08]">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#C5A880] mb-2 font-medium">
              <span>Step 03</span>
              <span aria-hidden="true">·</span>
              <span>Your Concepts</span>
            </div>
            <h2 className="font-serif-luxury text-3xl md:text-5xl lg:text-6xl text-[#FAF8F5] font-normal">
              Three Décor Visualizations
            </h2>
          </div>
          <p className="max-w-md text-xs md:text-sm text-[#A8A196] leading-relaxed font-light">
            All three concepts are anchored to your original venue photograph from the exact same viewpoint. The room architecture, walls, and perspective remain identical—only the décor evolves.
          </p>
        </div>

        {/* Concept Selector Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-10">
          {concepts.map(({ tier, price, generatedImage, generationStatus }) => {
            const isSelected = selectedConceptId === tier.id;
            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => onSelectConcept(tier.id)}
                className={`cursor-pointer text-left p-5 rounded-sm border transition-all duration-300 relative ${
                  isSelected
                    ? 'border-[#C5A880] bg-[#181615] shadow-[0_4px_25px_rgba(197,168,128,0.08)]'
                    : 'border-white/[0.08] bg-[#121110] hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono-numbers text-[#C5A880] tracking-widest uppercase">
                    {tier.number}
                  </span>
                  <div className="flex items-center gap-2">
                    {generatedImage && (
                      <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-[1px] border border-emerald-500/30 font-mono-numbers">
                        AI Edited
                      </span>
                    )}
                    <span className="text-xs font-mono-numbers text-[#FAF8F5] font-medium">
                      {currentCurrency.format(price)}
                    </span>
                  </div>
                </div>
                <h3 className="font-serif-luxury text-xl text-[#FAF8F5] mb-1">
                  {tier.title.replace(/^\d+\s*—\s*/, '')}
                </h3>
                <p className="text-xs text-[#8A8378] font-light line-clamp-1">
                  {tier.tagline}
                </p>
                {isSelected && (
                  <div className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-[#C5A880]" />
                )}
              </button>
            );
          })}
        </div>

        {/* View Mode Controls when Generated Visual is Available */}
        {hasGeneratedVisual && (
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2 bg-[#141312] border border-white/10 p-1 rounded-sm text-xs">
              <button
                onClick={() => setViewMode('compare')}
                className={`cursor-pointer px-3 py-1.5 rounded-[1px] transition-colors ${
                  viewMode === 'compare'
                    ? 'bg-[#C5A880] text-[#0C0B0A] font-medium'
                    : 'text-[#A8A196] hover:text-[#FAF8F5]'
                }`}
              >
                Before / After Slider
              </button>
              <button
                onClick={() => setViewMode('edited')}
                className={`cursor-pointer px-3 py-1.5 rounded-[1px] transition-colors ${
                  viewMode === 'edited'
                    ? 'bg-[#C5A880] text-[#0C0B0A] font-medium'
                    : 'text-[#A8A196] hover:text-[#FAF8F5]'
                }`}
              >
                Decorated Concept View
              </button>
              <button
                onClick={() => setViewMode('original')}
                className={`cursor-pointer px-3 py-1.5 rounded-[1px] transition-colors ${
                  viewMode === 'original'
                    ? 'bg-[#C5A880] text-[#0C0B0A] font-medium'
                    : 'text-[#A8A196] hover:text-[#FAF8F5]'
                }`}
              >
                Original Venue Photo
              </button>
            </div>

            <div className="text-xs text-[#C5A880] font-mono-numbers">
              VENUE LOCK™ // ARCHITECTURE PRESERVED
            </div>
          </div>
        )}

        {/* Main Viewport Container */}
        <div className="relative rounded-sm overflow-hidden border border-white/10 bg-[#141312] mb-10 group">
          {hasGeneratedVisual ? (
            /* REAL AI-EDITED IMAGE AVAILABLE */
            <div className="aspect-[16/9] w-full max-h-[640px] relative overflow-hidden select-none bg-[#0C0B0A]">
              {viewMode === 'compare' ? (
                /* Interactive Split Slider */
                <div className="relative w-full h-full">
                  {/* Original Venue Image (Before) */}
                  <img
                    src={venue.image}
                    alt="Original Venue"
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover filter brightness-95"
                  />

                  {/* AI-Edited Venue Image (After) clipped by slider */}
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
                  >
                    <img
                      src={activeGeneratedImage!}
                      alt={`Decorated Concept - ${activeTier.title}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover filter brightness-95"
                    />
                  </div>

                  {/* Divider Line & Handle */}
                  <div
                    className="absolute top-0 bottom-0 w-[2px] bg-[#C5A880] cursor-ew-resize z-20"
                    style={{ left: `${sliderPosition}%` }}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#0C0B0A] border-2 border-[#C5A880] flex items-center justify-center shadow-lg text-[10px] text-[#C5A880]">
                      ⇄
                    </div>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderPosition}
                    onChange={(e) => setSliderPosition(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
                    aria-label="Compare original venue photo and AI-edited décor"
                  />

                  {/* Floating Labels */}
                  <div className="absolute top-4 left-4 bg-[#0C0B0A]/90 backdrop-blur-md px-3 py-1 text-[11px] uppercase tracking-wider text-[#A8A196] border border-white/10 rounded-sm pointer-events-none">
                    Original Venue Photo
                  </div>
                  <div className="absolute top-4 right-4 bg-[#0C0B0A]/90 backdrop-blur-md px-3 py-1 text-[11px] uppercase tracking-wider text-[#C5A880] border border-[#C5A880]/30 rounded-sm pointer-events-none">
                    {activeTier.title} (Same Viewpoint)
                  </div>
                </div>
              ) : viewMode === 'edited' ? (
                /* Full AI-Edited View */
                <div className="relative w-full h-full">
                  <img
                    src={activeGeneratedImage!}
                    alt={`Decorated Concept - ${activeTier.title}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover filter brightness-95"
                  />
                  <div className="absolute top-4 right-4 bg-[#0C0B0A]/90 backdrop-blur-md px-3 py-1 text-[11px] uppercase tracking-wider text-[#C5A880] border border-[#C5A880]/30 rounded-sm">
                    {activeTier.title} Visualization
                  </div>
                </div>
              ) : (
                /* Full Original View */
                <div className="relative w-full h-full">
                  <img
                    src={venue.image}
                    alt="Original Venue"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover filter brightness-95"
                  />
                  <div className="absolute top-4 left-4 bg-[#0C0B0A]/90 backdrop-blur-md px-3 py-1 text-[11px] uppercase tracking-wider text-[#A8A196] border border-white/10 rounded-sm">
                    Original Venue Photo
                  </div>
                </div>
              )}

              {/* Bottom Real-Estate Info Bar */}
              <div className="absolute bottom-4 left-4 right-4 bg-[#0C0B0A]/90 backdrop-blur-md border border-white/10 p-3 rounded-sm flex items-center justify-between text-xs text-[#C5BFB5]">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-[#C5A880]" />
                  <span>{venue.name}</span>
                  <span aria-hidden="true" className="text-white/20">·</span>
                  <span className="text-[#C5A880] font-medium">{activeTier.title}</span>
                </div>
                <div className="font-mono-numbers text-sm text-[#FAF8F5]">
                  {currentCurrency.format(activePrice)}
                </div>
              </div>
            </div>
          ) : activeGenerationStatus === 'generating' ? (
            /* GENERATING IN PROGRESS STATE */
            <div className="aspect-[16/9] w-full max-h-[640px] relative overflow-hidden bg-[#0C0B0A]">
              <img
                src={venue.image}
                alt={`${venue.name} Original`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover filter brightness-[0.7] contrast-[1.05]"
              />
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-6">
                <div className="max-w-md bg-[#0C0B0A]/95 border border-[#C5A880]/30 rounded-sm p-8 text-center shadow-2xl">
                  <div className="w-12 h-12 rounded-full bg-[#C5A880]/10 border border-[#C5A880]/40 mx-auto flex items-center justify-center text-[#C5A880] mb-4 animate-spin">
                    <RefreshCw className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] block mb-2 font-medium">
                    VENUE LOCK™ // IMAGE-EDITING ACTIVE
                  </span>
                  <h4 className="font-serif-luxury text-2xl text-[#FAF8F5] mb-2 font-normal">
                    Composing {activeTier.title.replace(/^\d+\s*—\s*/, '')} Décor
                  </h4>
                  <p className="text-xs text-[#A8A196] leading-relaxed mb-4 font-light">
                    Directing Google Gemini (<code className="text-[#C5A880] bg-white/[0.05] px-1 py-0.5 rounded">gemini-3.1-flash-lite-image</code>) to apply professional event décor directly inside your room boundaries.
                  </p>
                  <div className="text-[11px] font-mono-numbers text-[#8A8378]">
                    Preserving camera viewpoint, perspective & perimeter architecture…
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* IMAGE VISUALIZATION CURRENTLY UNAVAILABLE (Honest, clean SKETCH handling) */
            <div className="aspect-[16/9] w-full max-h-[640px] relative overflow-hidden bg-[#0C0B0A]">
              {/* Display Customer's Original Venue Photo */}
              <img
                src={venue.image}
                alt={`${venue.name} Original`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover filter brightness-[0.88] contrast-[1.02]"
              />

              {/* Clean Honest SKETCH Message (Requirement: Do not show fake images) */}
              <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px] flex items-center justify-center p-6">
                <div className="max-w-lg bg-[#0C0B0A]/95 border border-[#C5A880]/30 rounded-sm p-6 md:p-8 text-center shadow-2xl">
                  <div className="w-10 h-10 rounded-full bg-[#C5A880]/10 border border-[#C5A880]/30 mx-auto flex items-center justify-center text-[#C5A880] mb-3">
                    <AlertCircle className="w-5 h-5" />
                  </div>

                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A880] block mb-1 font-medium">
                    Image Visualization Status
                  </span>

                  <h4 className="font-serif-luxury text-xl md:text-2xl text-[#FAF8F5] mb-2 font-normal">
                    Google Gemini Image Editing Quota
                  </h4>

                  <p className="text-xs text-[#A8A196] leading-relaxed mb-4 font-light">
                    Google Gemini image-editing models (<code className="text-[#FAF8F5] bg-white/[0.06] px-1 py-0.5 rounded text-[11px]">gemini-3.1-flash-lite-image</code>) currently enforce a quota limit of 0 on free-tier API projects, requiring pay-as-you-go billing in Google AI Studio. Your original venue photograph is preserved above with complete architectural integrity.
                  </p>

                  <div className="p-3 bg-[#141312] rounded-sm border border-white/[0.06] text-[11px] text-[#C5BFB5] mb-4 text-left space-y-1.5">
                    <div className="flex items-center justify-between text-[#8A8378]">
                      <span>Venue Architecture</span>
                      <span className="text-[#C5A880] font-medium">Locked & Preserved</span>
                    </div>
                    <div className="flex items-center justify-between text-[#8A8378]">
                      <span>Estimated Investment</span>
                      <span className="text-[#FAF8F5] font-mono-numbers">{currentCurrency.format(activePrice)}</span>
                    </div>
                    <div className="flex items-center justify-between text-[#8A8378]">
                      <span>Décor Bill-of-Materials</span>
                      <span className="text-emerald-400">Complete & Available Below</span>
                    </div>
                  </div>

                  {showQuotaDetails && (
                    <div className="p-3 bg-black/60 rounded-sm border border-white/10 text-left font-mono-numbers text-[10px] text-[#A8A196] mb-4 space-y-1">
                      <div className="text-[#C5A880] font-semibold flex items-center gap-1.5 mb-1">
                        <Terminal className="w-3 h-3" />
                        <span>Google AI Studio Diagnostics</span>
                      </div>
                      <div>Model: <span className="text-[#FAF8F5]">gemini-3.1-flash-lite-image</span></div>
                      <div>Metric: <span className="text-[#FAF8F5]">generativelanguage.googleapis.com/generate_content_free_tier_requests</span></div>
                      <div>Limit: <span className="text-amber-400">0 requests (Free tier)</span></div>
                      <div>Action: <span className="text-[#FAF8F5]">Billing upgrade required in AI Studio project</span></div>
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-3">
                    {onRetryGeneration && (
                      <button
                        onClick={() => onRetryGeneration(activeTier.id)}
                        className="cursor-pointer px-4 py-2 bg-[#C5A880] hover:bg-[#d6bc96] text-[#0C0B0A] text-xs font-medium uppercase tracking-wider rounded-sm transition-colors flex items-center justify-center gap-2"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Retry With Gemini</span>
                      </button>
                    )}
                    <button
                      onClick={() => setShowQuotaDetails(!showQuotaDetails)}
                      className="cursor-pointer px-3 py-2 bg-white/[0.06] hover:bg-white/[0.12] text-[#A8A196] hover:text-[#FAF8F5] text-xs rounded-sm transition-colors border border-white/10 flex items-center justify-center gap-1.5"
                    >
                      <Info className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>{showQuotaDetails ? 'Hide Diagnostics' : 'API Details'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Tag */}
              <div className="absolute bottom-4 left-4 right-4 bg-[#0C0B0A]/90 backdrop-blur-md border border-white/10 p-3 rounded-sm flex items-center justify-between text-xs text-[#C5BFB5]">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-[#C5A880]" />
                  <span>{venue.name}</span>
                  <span aria-hidden="true" className="text-white/20">·</span>
                  <span className="text-[#C5A880] font-medium">{activeTier.title}</span>
                </div>
                <div className="font-mono-numbers text-sm text-[#FAF8F5]">
                  {currentCurrency.format(activePrice)}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Detailed Concept Dossier Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Creative Direction & Philosophy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 md:p-8 bg-[#141312] border border-white/[0.08] rounded-sm">
              <span className="text-xs uppercase tracking-[0.2em] text-[#C5A880] block mb-2 font-medium">
                Creative Direction
              </span>
              <h3 className="font-serif-luxury text-2xl md:text-3xl text-[#FAF8F5] mb-2">
                {activeTier.title}
              </h3>
              <p className="text-xs text-[#C5A880] uppercase tracking-wider mb-4">
                {activeTier.tagline}
              </p>
              <p className="text-sm text-[#B8B2A9] leading-relaxed font-light mb-6">
                {activeTier.description}
              </p>

              {/* Décor Bill-of-Materials */}
              <div className="border-t border-white/[0.06] pt-6">
                <span className="text-xs uppercase tracking-[0.16em] text-[#FAF8F5] block mb-3 font-medium">
                  Key Décor Elements
                </span>
                <ul className="space-y-2">
                  {activeTier.decorElements.map((elem, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs text-[#A8A196]">
                      <span className="text-[#C5A880] font-mono-numbers mt-0.5">0{idx + 1}.</span>
                      <span className="leading-relaxed font-light">{elem}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Expandable Technical Details */}
              <div className="border-t border-white/[0.06] pt-5 mt-6">
                <button
                  onClick={() => toggleExpand(activeTier.id)}
                  className="cursor-pointer w-full flex items-center justify-between text-xs text-[#C5A880] hover:text-[#D6BD96] transition-colors"
                >
                  <span className="uppercase tracking-[0.16em]">
                    {expandedDetails[activeTier.id] ? 'Conceal Staging & Floral Details' : 'View Stage, Floral & Lighting Specs'}
                  </span>
                  {expandedDetails[activeTier.id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {expandedDetails[activeTier.id] && (
                  <div className="mt-4 pt-4 border-t border-white/[0.04] space-y-4 text-xs text-[#A8A196] animate-fade-in">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#8A8378] block mb-1">
                        Stage & Backdrop Architecture
                      </span>
                      <p className="leading-relaxed font-light">{activeTier.stagePlan}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#8A8378] block mb-1">
                        Floral Palette
                      </span>
                      <div className="flex flex-wrap gap-2 text-xs text-[#FAF8F5]">
                        {activeTier.floralPalette.map((flower, i) => (
                          <span key={i} className="inline-block bg-[#0C0B0A] border border-white/10 px-2.5 py-1 rounded-sm text-[11px]">
                            {flower}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#8A8378] block mb-1">
                        Lighting Plan
                      </span>
                      <p className="leading-relaxed font-light">{activeTier.lightingPlan}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#8A8378] block mb-1">
                        Furniture & Seating Setup
                      </span>
                      <p className="leading-relaxed font-light">{activeTier.furnitureProfile}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Investment Preview Column */}
          <div className="lg:col-span-5 p-6 md:p-8 bg-[#141312] border border-white/[0.08] rounded-sm space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-medium">
                  Estimated Investment
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#7A746B]">
                  Tier {activeTier.number}
                </span>
              </div>
              <div className="font-mono-numbers text-3xl md:text-4xl text-[#FAF8F5] font-medium mb-1">
                {currentCurrency.format(activePrice)}
              </div>
              <p className="text-xs text-[#8A8378] font-light">
                Calculated for {vision.guestCount} guests in {venue.name}.
              </p>
            </div>

            {/* Line-item Category Breakdown */}
            <div className="border-t border-white/[0.06] pt-5 space-y-3 font-mono-numbers text-xs">
              <span className="text-[11px] uppercase tracking-wider text-[#C5A880] block mb-1">
                Base Décor Allocation
              </span>
              <div className="flex items-center justify-between text-[#C5BFB5]">
                <span>Floral & Botanical Installations</span>
                <span>{currentCurrency.format(activeBreakdown.florals)}</span>
              </div>
              <div className="flex items-center justify-between text-[#C5BFB5]">
                <span>Ambient & Focus Lighting</span>
                <span>{currentCurrency.format(activeBreakdown.lighting)}</span>
              </div>
              <div className="flex items-center justify-between text-[#C5BFB5]">
                <span>Furniture, Seating & Linens</span>
                <span>{currentCurrency.format(activeBreakdown.furniture)}</span>
              </div>
              <div className="flex items-center justify-between text-[#C5BFB5]">
                <span>Stage & Backdrop Fabrication</span>
                <span>{currentCurrency.format(activeBreakdown.stage)}</span>
              </div>
              <div className="flex items-center justify-between text-[#C5BFB5]">
                <span>Crew, Logistics & Setup</span>
                <span>{currentCurrency.format(activeBreakdown.production)}</span>
              </div>
            </div>

            {/* Proceed to Proposal Button */}
            <div className="border-t border-white/[0.06] pt-5">
              <button
                type="button"
                onClick={onProceedToQuote}
                className="cursor-pointer w-full py-4 px-6 rounded-sm bg-[#C5A880] hover:bg-[#D6BD96] text-[#0C0B0A] font-medium text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-[0_8px_25px_rgba(197,168,128,0.2)]"
              >
                <span>Select for Design Proposal</span>
              </button>
              <p className="text-[10px] text-center text-[#7A746B] mt-3">
                Prepares a client-ready proposal with side-by-side venue proof
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
