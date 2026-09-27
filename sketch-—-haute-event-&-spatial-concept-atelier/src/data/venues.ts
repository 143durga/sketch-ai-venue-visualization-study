import {
  CustomerVenue,
  ConceptTier,
  OptionalEnhancement,
  CurrencyCode,
  CurrencyConfig,
} from '../types';

export const SAMPLE_COURTYARD_IMAGE = '/src/assets/images/venue_tuscan_courtyard_1790504600946.jpg';
export const SAMPLE_BALLROOM_IMAGE = '/src/assets/images/hero_luxury_atelier_venue_1790504579868.jpg';
export const CONCEPT_01_INSP_IMG = '/src/assets/images/concept_01_essential_1790504616217.jpg';
export const CONCEPT_02_INSP_IMG = '/src/assets/images/concept_02_signature_1790504631231.jpg';
export const CONCEPT_03_INSP_IMG = '/src/assets/images/concept_03_luxury_1790504648554.jpg';

export const CURRENCY_CONFIGS: Record<CurrencyCode, CurrencyConfig> = {
  INR: {
    code: 'INR',
    symbol: '₹',
    rateFromINR: 1,
    format: (amountInINR: number) => {
      // Indian numbering format (e.g. 15,00,000)
      return '₹ ' + Math.round(amountInINR).toLocaleString('en-IN');
    },
  },
  USD: {
    code: 'USD',
    symbol: '$',
    rateFromINR: 0.012, // approx 1 USD = 83 INR
    format: (amountInINR: number) => {
      const val = Math.round(amountInINR * 0.012);
      return '$' + val.toLocaleString('en-US');
    },
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    rateFromINR: 0.0094,
    format: (amountInINR: number) => {
      const val = Math.round(amountInINR * 0.0094);
      return '£' + val.toLocaleString('en-GB');
    },
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    rateFromINR: 0.011,
    format: (amountInINR: number) => {
      const val = Math.round(amountInINR * 0.011);
      return '€' + val.toLocaleString('de-DE');
    },
  },
  AED: {
    code: 'AED',
    symbol: 'AED',
    rateFromINR: 0.044,
    format: (amountInINR: number) => {
      const val = Math.round(amountInINR * 0.044);
      return 'AED ' + val.toLocaleString('en-AE');
    },
  },
};

export const DEFAULT_CUSTOMER_VENUE: CustomerVenue = {
  id: 'venue-starter-01',
  name: 'Courtyard & Colonnade Space (Sample)',
  image: SAMPLE_COURTYARD_IMAGE,
  uploadedAt: 'Sample Venue for Exploration',
  estimatedType: 'Outdoor Lawn / Courtyard',
  knownDimensions: 'Measurement requires an on-site survey.',
  ceilingNote: 'Measurement requires an on-site survey.',
  venueLock: {
    summary: 'Visual perspective, colonnade arches, and perimeter floor lines identified for decor placement.',
    disclaimer: 'Visual preservation only. Final dimensions and structural suitability require on-site verification.',
    checks: [
      {
        id: 'perspective',
        title: 'Perspective & Focal Sightline',
        observation: 'Central perspective line identified. All seating and aisle lines will align with the existing camera depth.',
        status: 'Preserved',
      },
      {
        id: 'architecture',
        title: 'Visible Architecture',
        observation: 'Archway rhythm and perimeter stone surfaces detected. Décor will complement the natural stonework without obscuring key features.',
        status: 'Preserved',
      },
      {
        id: 'openings',
        title: 'Openings & Ingress Path',
        observation: 'Primary archway portals noted for guest movement and ceremonial entrance flow.',
        status: 'Identified',
      },
      {
        id: 'structure',
        title: 'Structural Elements',
        observation: 'Colonnade piers noted as natural anchors for freestanding floral arrangements. No drilling or structural anchoring assumed.',
        status: 'Preserved',
      },
      {
        id: 'floor',
        title: 'Floor Boundaries',
        observation: 'Main courtyard floor surface identified for banquet runs and carpet runners.',
        status: 'Preserved',
      },
    ],
  },
};

export const SAMPLE_BALLROOM_VENUE: CustomerVenue = {
  id: 'venue-starter-02',
  name: 'Classic Banquet Hall (Sample)',
  image: SAMPLE_BALLROOM_IMAGE,
  uploadedAt: 'Sample Venue for Exploration',
  estimatedType: 'Indoor Hall / Ballroom',
  knownDimensions: 'Measurement requires an on-site survey.',
  ceilingNote: 'Measurement requires an on-site survey.',
  venueLock: {
    summary: 'Ballroom perspective, wall wainscoting, and flooring boundaries identified for indoor stage and table layouts.',
    disclaimer: 'Visual preservation only. Final dimensions and structural suitability require on-site verification.',
    checks: [
      {
        id: 'perspective',
        title: 'Perspective & Focal Sightline',
        observation: 'Longitudinal ballroom axis calibrated for stage placement opposite main entrance.',
        status: 'Preserved',
      },
      {
        id: 'architecture',
        title: 'Visible Architecture',
        observation: 'Mouldings and perimeter walls preserved; decorative backdrops designed as freestanding structures.',
        status: 'Preserved',
      },
      {
        id: 'openings',
        title: 'Openings & Ingress Path',
        observation: 'Main access doors and service passageways mapped to ensure clear emergency and guest paths.',
        status: 'Identified',
      },
      {
        id: 'structure',
        title: 'Structural Elements',
        observation: 'Floor-standing production trussing recommended. Structural ceiling load verification required on-site.',
        status: 'Preserved',
      },
      {
        id: 'floor',
        title: 'Floor Boundaries',
        observation: 'Main hall floor perimeter mapped for dining tables and central walkway.',
        status: 'Preserved',
      },
    ],
  },
};

export const CONCEPT_TEMPLATES: Record<'essential' | 'signature' | 'luxury', ConceptTier> = {
  essential: {
    id: 'essential',
    number: '01',
    title: '01 — ESSENTIAL',
    tagline: 'Elegant, thoughtful décor within the selected budget.',
    description: 'A disciplined, refined design focusing on quality focal points. Emphasizes clean linen runners, ambient warm candlelight, restrained floral arrangements, and balanced seating layouts that let the venue architecture breathe.',
    budgetMultiplier: 0.9, // 90% of target budget
    breakdownPct: {
      florals: 0.32,
      lighting: 0.22,
      furniture: 0.20,
      stage: 0.16,
      production: 0.10,
    },
    decorElements: [
      'Refined banquet table styling with natural unpressed table runners',
      'Artisan ceramic or glass centerpieces with seasonal blooms & greenery',
      'Warm ambient pinspotting on key dining tables and entry foyer',
      'Minimalist backdrop frame with soft drapery or subtle floral accents',
      'Comfortable guest dining chairs and cohesive dinnerware setup'
    ],
    stagePlan: 'Restrained, elegant focal stage with soft textured fabric backdrop and warm base floral clustering.',
    lightingPlan: 'Warm 2700K ambient wash across perimeter walls plus focused table pinspots and wax candles.',
    floralPalette: ['Seasonal White Carnations & Ranunculus', 'Eucalyptus & Olive Sprigs', 'Baby’s Breath Accents'],
    furnitureProfile: 'Classic dining chairs with tailored slipcovers, natural timber dining tables, and clean linen lines.',
    sampleInspirationImage: CONCEPT_01_INSP_IMG,
    stageZones: [
      { x: 50, y: 70, title: 'Main Banquet Run', description: 'Aligned directly with the venue perspective axis.' },
      { x: 38, y: 62, title: 'Low-Profile Table Florals', description: 'Permits clear sightlines across conversation partners.' },
      { x: 62, y: 52, title: 'Perimeter Ambient Wash', description: 'Gently illuminates walls without glare.' }
    ]
  },
  signature: {
    id: 'signature',
    number: '02',
    title: '02 — SIGNATURE',
    tagline: 'A richer, more expressive interpretation of the space.',
    description: 'Elevated spatial presence featuring layered floral arrangements, custom statement lighting, upgraded stage architecture, and tailored lounge areas. Designed to create a cohesive sensory journey from entrance to main stage.',
    budgetMultiplier: 1.3, // 130% of target budget
    breakdownPct: {
      florals: 0.36,
      lighting: 0.24,
      furniture: 0.18,
      stage: 0.14,
      production: 0.08,
    },
    decorElements: [
      'Layered floral runner arrangements combining fresh roses, hydrangeas, and foliage',
      'Bespoke ambient lighting with warm amber chandeliers or suspended Edison bulbs',
      'Architectural statement backdrop with layered arches or 3D textured panels',
      'Dedicated lounge salon with velvet or bouclé accent sofas and cocktail tables',
      'Upgraded gold or matte black flatware and textured glassware settings'
    ],
    stagePlan: 'Multi-tiered decorative stage with textured architectural panels, lush flanking floral meadows, and dedicated spotlighting.',
    lightingPlan: 'Dynamic dimmable lighting scenes (welcome, dinner, celebration cues) with perimeter uplights.',
    floralPalette: ['David Austin Garden Roses', 'Hydrangeas in Ivory & Blush', 'Delphinium Spires', 'Lush Italian Ruscus'],
    furnitureProfile: 'Curated modern upholstered chairs, statement cocktail high-tops, and bespoke dining runners.',
    sampleInspirationImage: CONCEPT_02_INSP_IMG,
    stageZones: [
      { x: 48, y: 40, title: 'Suspended Foliage & Warm Light', description: 'Creates intimate volume beneath existing ceiling height.' },
      { x: 52, y: 74, title: 'Layered Banquet Tables', description: 'Statement glassware and amber candlelight reflections.' },
      { x: 26, y: 66, title: 'Flanking Floral Meadows', description: 'Ground-level floral surges framing the room.' }
    ]
  },
  luxury: {
    id: 'luxury',
    number: '03',
    title: '03 — LUXURY',
    tagline: 'A highly detailed premium interpretation.',
    description: 'An immersive, couture-level celebration concept. Features monumental floral installations, custom mirrored flooring or stage surfaces, architectural lighting choreography, suspended floral canopies, and bespoke furniture suites.',
    budgetMultiplier: 1.85, // 185% of target budget
    breakdownPct: {
      florals: 0.40,
      lighting: 0.25,
      furniture: 0.16,
      stage: 0.12,
      production: 0.07,
    },
    decorElements: [
      'Monumental floral installations framing the main stage, entrance, and key colonnades',
      'Custom suspended floral chandeliers and high-density hanging installations',
      'Bespoke mirrored or high-gloss dancefloor and stage surfacing',
      'Couture lounge pavilions with curved designer velvet seating and custom cocktail bar',
      'Fine porcelain, personalized menu stationery with foil detailing, and crystal stemware'
    ],
    stagePlan: 'Monumental architectural stage with 3D carved panels, cascading floral waterfalls, and programmable theatrical mood lighting.',
    lightingPlan: 'Full architectural lighting orchestration, syncopated candle glow, motorized moving washes, and pinpoint spotlighting.',
    floralPalette: ['Premium Imported Orchids', 'O’Hara Garden Roses', 'Cascading Jasmine & Wisteria', 'Preserved Foliage Clouds'],
    furnitureProfile: 'Bespoke curved velvet banquettes, brass-accented cocktail bars, and designer dining suites.',
    sampleInspirationImage: CONCEPT_03_INSP_IMG,
    stageZones: [
      { x: 25, y: 48, title: 'Monumental Floral Columns', description: 'Surging along existing structural pillars without altering the masonry.' },
      { x: 50, y: 25, title: 'Suspended Crystal & Botanical Canopy', description: 'High-density overhead installation framing the central axis.' },
      { x: 50, y: 80, title: 'Mirrored Reflective Surface', description: 'Reflects overhead lighting and floral architecture.' }
    ]
  },
};

export const OPTIONAL_ENHANCEMENTS: OptionalEnhancement[] = [
  {
    id: 'enhancement-floral-arch',
    title: 'Grand Entrance Floral Gateway',
    description: 'Freestanding floral and greenery archway framing the main guest entry path.',
    costINR: 65000,
  },
  {
    id: 'enhancement-mirror-floor',
    title: 'Mirrored or High-Gloss Stage / Dancefloor',
    description: 'Seamless reflective floor paneling designed to reflect ceiling lighting and floral decor.',
    costINR: 75000,
  },
  {
    id: 'enhancement-statement-chandelier',
    title: 'Suspended Statement Chandelier Cluster',
    description: 'Cluster of ambient warm crystal or woven pendants suspended over the central dining or bar area.',
    costINR: 50000,
  },
  {
    id: 'enhancement-lounge-cocktail',
    title: 'Curated Cocktail Lounge & Bar Setup',
    description: 'Dedicated lounge salon with velvet accent seating, low brass coffee tables, and bespoke bar facade.',
    costINR: 60000,
  },
  {
    id: 'enhancement-stationery',
    title: 'Handcrafted Menus & Place Settings',
    description: 'Custom artisanal place cards, foil-embossed menus, and coordinated napkin styling.',
    costINR: 25000,
  },
];

export const EVENT_TYPES = [
  'Wedding Reception',
  'Sangeet / Cocktail Night',
  'Traditional Wedding / Mandap Ceremony',
  'Milestone Birthday Celebration',
  'Corporate Gala Dinner',
  'Private Intimate Dinner Soirée',
];

export const DECOR_VIBES = [
  { name: 'Warm Candlelight & Botanical', desc: 'Amber illumination, ivory flora, lush green foliage, intimate warmth' },
  { name: 'Contemporary Royal Grandeur', desc: 'Rich jewel tones or warm gold, structured stage panels, statement floral arches' },
  { name: 'Minimalist Alabaster & Linen', desc: 'Restrained elegance, clean white ranunculus, natural textured linens' },
  { name: 'Modern Pastel & Glass', desc: 'Blush, peach, and ivory blooms with glass candelabras and clear acrylic accents' },
  { name: 'Traditional Marigold & Mogra Luxe', desc: 'Deep brass urns, fragrant mogra strands, rich marigold ombré' },
];

export const BUDGET_TIERS = [
  { label: '₹ 3,50,000', value: 350000, desc: 'Intimate Gathering' },
  { label: '₹ 7,50,000', value: 750000, desc: 'Classic Celebration' },
  { label: '₹ 15,00,000', value: 1500000, desc: 'Signature Grandeur' },
  { label: '₹ 30,00,000', value: 3000000, desc: 'Luxury Production' },
  { label: '₹ 60,00,000+', value: 6000000, desc: 'Monumental High-Couture' },
];
