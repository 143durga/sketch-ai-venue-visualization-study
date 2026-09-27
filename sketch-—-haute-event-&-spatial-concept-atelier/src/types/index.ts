export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rateFromINR: number;
  format: (amountInINR: number) => string;
}

export interface VenueLockCheck {
  id: 'perspective' | 'architecture' | 'openings' | 'structure' | 'floor';
  title: string;
  observation: string;
  status: 'Preserved' | 'Identified';
}

export interface VenueLockData {
  summary: string;
  disclaimer: string;
  checks: VenueLockCheck[];
}

export interface ConceptBreakdown {
  florals: number;
  lighting: number;
  furniture: number;
  stage: number;
  production: number;
}

export interface ConceptTier {
  id: 'essential' | 'signature' | 'luxury';
  number: string;
  title: string;
  tagline: string;
  description: string;
  decorElements: string[];
  stagePlan: string;
  lightingPlan: string;
  floralPalette: string[];
  furnitureProfile: string;
  budgetMultiplier: number;
  breakdownPct: {
    florals: number;
    lighting: number;
    furniture: number;
    stage: number;
    production: number;
  };
  sampleInspirationImage: string;
  generatedImage?: string | null;
  generationStatus?: 'idle' | 'generating' | 'completed' | 'unavailable';
  generationMessage?: string | null;
  stageZones?: {
    x: number;
    y: number;
    title: string;
    description: string;
  }[];
}

export interface CustomerVenue {
  id: string;
  name: string;
  image: string;
  uploadedAt: string;
  estimatedType: 'Indoor Hall / Ballroom' | 'Outdoor Lawn / Courtyard' | 'Historic / Heritage Space' | 'Custom Venue';
  knownDimensions: string;
  ceilingNote: string;
  venueLock: VenueLockData;
}

export interface EventVision {
  eventType: string;
  guestCount: number;
  targetBudgetINR: number;
  currency: CurrencyCode;
  eventDate: string;
  decorVibe: string;
  customNotes: string;
  selectedEnhancements: string[];
}

export interface OptionalEnhancement {
  id: string;
  title: string;
  description: string;
  costINR: number;
}
