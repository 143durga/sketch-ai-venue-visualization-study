import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { VenueSelector } from './components/VenueSelector';
import { VenueLockVisualizer } from './components/VenueLockVisualizer';
import { VisionAtelier } from './components/VisionAtelier';
import { ConceptSpread } from './components/ConceptSpread';
import { InvestmentProposal } from './components/InvestmentProposal';
import { InquiryModal } from './components/InquiryModal';
import { Footer } from './components/Footer';
import {
  DEFAULT_CUSTOMER_VENUE,
  CONCEPT_TEMPLATES,
  OPTIONAL_ENHANCEMENTS,
} from './data/venues';
import { CustomerVenue, EventVision, CurrencyCode } from './types';
import { Lock, Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentVenue, setCurrentVenue] = useState<CustomerVenue>(DEFAULT_CUSTOMER_VENUE);
  const [selectedConceptId, setSelectedConceptId] = useState<'essential' | 'signature' | 'luxury'>('signature');
  const [activeSection, setActiveSection] = useState('hero');
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);

  // Generated images state per tier
  const [generatedConcepts, setGeneratedConcepts] = useState<Record<string, {
    imageUrl?: string;
    status: 'idle' | 'generating' | 'completed' | 'unavailable';
    message?: string;
  }>>({
    essential: { status: 'idle' },
    signature: { status: 'idle' },
    luxury: { status: 'idle' },
  });

  // Customer-driven event parameters
  const [vision, setVision] = useState<EventVision>({
    eventType: 'Wedding Reception',
    guestCount: 150,
    targetBudgetINR: 1500000, // ₹ 15,00,000 INR default
    currency: 'INR',
    eventDate: '2026-11-20',
    decorVibe: 'Warm Candlelight & Botanical',
    customNotes: '',
    selectedEnhancements: ['enhancement-floral-arch', 'enhancement-statement-chandelier'],
  });

  const [isStudying, setIsStudying] = useState(false);
  const [studyStepIndex, setStudyStepIndex] = useState(0);

  const generationSteps = [
    'Studying your venue…',
    'Locking architectural perspective…',
    'Composing your décor…',
    'Preparing three concepts…',
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleUpdateVision = (updated: Partial<EventVision>) => {
    setVision((prev) => ({ ...prev, ...updated }));
  };

  const handleChangeCurrency = (code: CurrencyCode) => {
    setVision((prev) => ({ ...prev, currency: code }));
  };

  const handleToggleEnhancement = (id: string) => {
    setVision((prev) => {
      const exists = prev.selectedEnhancements.includes(id);
      return {
        ...prev,
        selectedEnhancements: exists
          ? prev.selectedEnhancements.filter((e) => e !== id)
          : [...prev.selectedEnhancements, id],
      };
    });
  };

  // Customer uploads their venue photo
  const handleUploadVenue = (
    imageDataUrl: string,
    venueName: string,
    estimatedType: CustomerVenue['estimatedType']
  ) => {
    const newCustomerVenue: CustomerVenue = {
      id: `customer-venue-${Date.now()}`,
      name: venueName || 'Your Uploaded Event Space',
      image: imageDataUrl,
      uploadedAt: 'Uploaded by Customer',
      estimatedType,
      knownDimensions: 'Measurement requires an on-site survey.',
      ceilingNote: 'Measurement requires an on-site survey.',
      venueLock: {
        summary: 'Perspective, visible perimeter walls, and floor boundaries identified from your photo.',
        disclaimer: 'Visual preservation only. Final dimensions and structural suitability require on-site verification.',
        checks: [
          {
            id: 'perspective',
            title: 'Perspective & Focal Sightline',
            observation: 'Camera perspective line identified. Proposed stage and banquet runs will align with existing focal depth.',
            status: 'Preserved',
          },
          {
            id: 'architecture',
            title: 'Visible Architecture',
            observation: 'Perimeter wall lines and background boundaries preserved. Décor elements designed to complement without obstructing structural features.',
            status: 'Preserved',
          },
          {
            id: 'openings',
            title: 'Openings & Ingress Path',
            observation: 'Visible doorway and guest entrance vectors noted to ensure unobstructed guest circulation.',
            status: 'Identified',
          },
          {
            id: 'structure',
            title: 'Structural Elements',
            observation: 'Freestanding stage and floral trussing assumed. No structural drilling or ceiling alterations required.',
            status: 'Preserved',
          },
          {
            id: 'floor',
            title: 'Floor Boundaries',
            observation: 'Usable floor footprint mapped for guest seating, table placement, and main aisleway.',
            status: 'Preserved',
          },
        ],
      },
    };

    // Reset previous concept generations for the new image
    setGeneratedConcepts({
      essential: { status: 'idle' },
      signature: { status: 'idle' },
      luxury: { status: 'idle' },
    });

    setCurrentVenue(newCustomerVenue);
    scrollToSection('venue-lock');
  };

  // Core trigger: REVEAL YOUR VISION
  // Runs the exact 4-step generation UX and calls the real Gemini server editing endpoint
  const handleRevealVision = async () => {
    setIsStudying(true);
    setStudyStepIndex(0); // "Studying your venue…"

    try {
      // Step 1: Studying your venue…
      await new Promise((r) => setTimeout(r, 700));

      // Step 2: Locking architectural perspective…
      setStudyStepIndex(1);
      await new Promise((r) => setTimeout(r, 800));

      // Step 3: Composing your décor…
      setStudyStepIndex(2);

      // Call Gemini Server Endpoint for Image Editing
      const responsePromise = fetch('/api/generate-all-concepts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          venueImage: currentVenue.image,
          eventType: vision.eventType,
          guestCount: vision.guestCount,
          targetBudgetINR: vision.targetBudgetINR,
          eventDate: vision.eventDate,
          decorVibe: vision.decorVibe,
          customNotes: vision.customNotes,
        }),
      });

      // Also ensure minimum smooth transition duration
      const delayPromise = new Promise((r) => setTimeout(r, 1200));

      const [res] = await Promise.all([responsePromise, delayPromise]);
      const data = await res.json();

      // Step 4: Preparing three concepts…
      setStudyStepIndex(3);
      await new Promise((r) => setTimeout(r, 700));

      if (data.success && data.concepts) {
        setGeneratedConcepts({
          essential: data.concepts.essential?.success
            ? { imageUrl: data.concepts.essential.imageUrl, status: 'completed' }
            : { status: 'unavailable', message: data.concepts.essential?.error },
          signature: data.concepts.signature?.success
            ? { imageUrl: data.concepts.signature.imageUrl, status: 'completed' }
            : { status: 'unavailable', message: data.concepts.signature?.error },
          luxury: data.concepts.luxury?.success
            ? { imageUrl: data.concepts.luxury.imageUrl, status: 'completed' }
            : { status: 'unavailable', message: data.concepts.luxury?.error },
        });
      } else {
        // Honest fallback when quota/billing is not enabled
        setGeneratedConcepts({
          essential: { status: 'unavailable', message: data.message },
          signature: { status: 'unavailable', message: data.message },
          luxury: { status: 'unavailable', message: data.message },
        });
      }

      scrollToSection('concepts');
    } catch (err) {
      console.error('Vision reveal error:', err);
      setGeneratedConcepts({
        essential: { status: 'unavailable', message: 'Connection unavailable' },
        signature: { status: 'unavailable', message: 'Connection unavailable' },
        luxury: { status: 'unavailable', message: 'Connection unavailable' },
      });
      scrollToSection('concepts');
    } finally {
      setIsStudying(false);
      setStudyStepIndex(0);
    }
  };

  // Retry single tier generation
  const handleRetrySingleTier = async (tierId: 'essential' | 'signature' | 'luxury') => {
    setGeneratedConcepts((prev) => ({
      ...prev,
      [tierId]: { ...prev[tierId], status: 'generating' },
    }));

    try {
      const res = await fetch('/api/generate-concept-tier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          venueImage: currentVenue.image,
          tier: tierId,
          eventType: vision.eventType,
          guestCount: vision.guestCount,
          targetBudgetINR: vision.targetBudgetINR,
          eventDate: vision.eventDate,
          decorVibe: vision.decorVibe,
          customNotes: vision.customNotes,
        }),
      });
      const data = await res.json();
      if (data.success && data.imageUrl) {
        setGeneratedConcepts((prev) => ({
          ...prev,
          [tierId]: { imageUrl: data.imageUrl, status: 'completed' },
        }));
      } else {
        setGeneratedConcepts((prev) => ({
          ...prev,
          [tierId]: { status: 'unavailable', message: data.message || 'Generation unavailable' },
        }));
      }
    } catch {
      setGeneratedConcepts((prev) => ({
        ...prev,
        [tierId]: { status: 'unavailable', message: 'Network error' },
      }));
    }
  };

  // Selected concept calculation
  const activeTemplate = CONCEPT_TEMPLATES[selectedConceptId];
  const guestScale = 0.85 + (vision.guestCount / 150) * 0.15;
  const currentConceptBasePriceINR = Math.round(
    vision.targetBudgetINR * activeTemplate.budgetMultiplier * guestScale
  );

  // Total estimate with enhancements for inquiry modal
  const enhancementsTotalINR = vision.selectedEnhancements.reduce((sum, id) => {
    const item = OPTIONAL_ENHANCEMENTS.find((e) => e.id === id);
    return sum + (item ? item.costINR : 0);
  }, 0);
  const grandTotalINR = currentConceptBasePriceINR + enhancementsTotalINR;

  return (
    <div className="min-h-screen bg-[#0C0B0A] text-[#F3EFEA] flex flex-col font-sans-luxury selection:bg-[#C5A880]/30 selection:text-[#FFFDF9]">
      {/* 3-Zone Fixed Navbar with Currency Switcher */}
      <Navbar
        onNavigate={scrollToSection}
        activeSection={activeSection}
        onOpenFolio={() => scrollToSection('proposal')}
        currency={vision.currency}
        onChangeCurrency={handleChangeCurrency}
      />

      {/* Polished Generation State Overlay (User Requirement UX) */}
      {isStudying && (
        <div className="fixed inset-0 z-50 bg-[#0C0B0A]/95 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
          <div className="max-w-md w-full bg-[#141312] border border-[#C5A880]/40 rounded-sm p-8 text-center shadow-2xl relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#C5A880]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-16 h-16 rounded-full bg-[#C5A880]/10 border border-[#C5A880]/30 mx-auto flex items-center justify-center mb-6 relative">
              <div className="w-8 h-8 border-2 border-[#C5A880] border-t-transparent rounded-full animate-spin" />
              <Lock className="w-4 h-4 text-[#C5A880] absolute" />
            </div>

            <span className="text-[11px] uppercase tracking-[0.25em] text-[#C5A880] block mb-2 font-medium">
              SKETCH Atelier Engine
            </span>

            <h3 className="font-serif-luxury text-2xl md:text-3xl text-[#FAF8F5] mb-6">
              {generationSteps[studyStepIndex]}
            </h3>

            {/* Visual Step Progress */}
            <div className="space-y-3 text-left border-t border-white/[0.08] pt-6 text-xs font-mono-numbers">
              {generationSteps.map((step, idx) => {
                const isCompleted = idx < studyStepIndex;
                const isCurrent = idx === studyStepIndex;
                return (
                  <div
                    key={step}
                    className={`flex items-center gap-3 transition-colors ${
                      isCompleted
                        ? 'text-emerald-400'
                        : isCurrent
                        ? 'text-[#FAF8F5] font-semibold'
                        : 'text-[#555048]'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <div className="w-4 h-4 rounded-full border-2 border-[#C5A880] border-t-transparent animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-white/20 shrink-0" />
                    )}
                    <span>{step}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.06] text-[10px] text-[#7A746B] uppercase tracking-wider">
              Preserving original walls, columns, and camera viewpoint
            </div>
          </div>
        </div>
      )}

      <main className="flex-1">
        {/* Hero Section */}
        <div id="hero">
          <Hero
            onBringVenue={() => scrollToSection('venue-selection')}
            onExploreCurated={() => scrollToSection('venue-lock')}
          />
        </div>

        {/* Step 01: Bring Your Venue (Customer Photo Upload) */}
        <VenueSelector
          currentVenue={currentVenue}
          onUploadVenue={handleUploadVenue}
          onSelectSampleVenue={(sample) => {
            setCurrentVenue(sample);
            setGeneratedConcepts({
              essential: { status: 'idle' },
              signature: { status: 'idle' },
              luxury: { status: 'idle' },
            });
            scrollToSection('venue-lock');
          }}
        />

        {/* Signature Feature: Venue Lock™ Preserving Your Actual Space */}
        <VenueLockVisualizer venue={currentVenue} />

        {/* Step 02: Creative Direction & Event Parameters */}
        <VisionAtelier
          vision={vision}
          onChangeVision={handleUpdateVision}
          onRevealVision={handleRevealVision}
          isStudying={isStudying}
          studyStep={generationSteps[studyStepIndex]}
        />

        {/* Step 03: Your Concepts (01 Essential, 02 Signature, 03 Luxury) with Real Gemini Visualizations */}
        <ConceptSpread
          venue={currentVenue}
          vision={vision}
          selectedConceptId={selectedConceptId}
          onSelectConcept={setSelectedConceptId}
          onProceedToQuote={() => scrollToSection('proposal')}
          generatedConcepts={generatedConcepts}
          onRetryGeneration={handleRetrySingleTier}
        />

        {/* Step 04: Investment Preview & Transparent Proposal */}
        <InvestmentProposal
          venue={currentVenue}
          concept={activeTemplate}
          conceptBasePriceINR={currentConceptBasePriceINR}
          vision={vision}
          selectedGeneratedImage={generatedConcepts[selectedConceptId]?.imageUrl || null}
          onToggleEnhancement={handleToggleEnhancement}
          onBookConsultation={() => setIsConsultationOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer onNavigate={scrollToSection} />

      {/* Consultation & On-Site Survey Request Modal */}
      <InquiryModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
        venue={currentVenue}
        concept={activeTemplate}
        totalEstimateINR={grandTotalINR}
        currency={vision.currency}
      />
    </div>
  );
}
