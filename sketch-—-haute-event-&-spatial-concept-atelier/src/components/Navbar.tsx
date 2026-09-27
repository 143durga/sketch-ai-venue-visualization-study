import React from 'react';
import { CurrencyCode } from '../types';
import { CURRENCY_CONFIGS } from '../data/venues';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  activeSection: string;
  onOpenFolio: () => void;
  currency: CurrencyCode;
  onChangeCurrency: (code: CurrencyCode) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigate,
  activeSection,
  onOpenFolio,
  currency,
  onChangeCurrency,
}) => {
  const currencies: CurrencyCode[] = ['INR', 'USD', 'EUR', 'GBP', 'AED'];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0C0B0A]/90 backdrop-blur-md border-b border-white/[0.08] transition-all">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 h-20 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onNavigate('hero')}
          className="text-left group cursor-pointer focus:outline-none"
        >
          <span className="font-serif-luxury text-2xl tracking-[0.28em] font-medium text-[#FAF8F5] uppercase group-hover:text-[#C5A880] transition-colors">
            SKETCH
          </span>
        </button>

        {/* Zone 2: Clean customer navigation flow */}
        <nav className="hidden lg:flex items-center gap-7 text-xs uppercase tracking-[0.16em] font-sans-luxury text-[#B8B2A9]">
          <button
            onClick={() => onNavigate('venue-selection')}
            className={`cursor-pointer hover:text-[#FAF8F5] transition-colors pb-0.5 border-b ${
              activeSection === 'venue-selection' ? 'text-[#FAF8F5] border-[#C5A880]' : 'border-transparent'
            }`}
          >
            Bring Your Venue
          </button>
          <button
            onClick={() => onNavigate('venue-lock')}
            className={`cursor-pointer hover:text-[#FAF8F5] transition-colors pb-0.5 border-b ${
              activeSection === 'venue-lock' ? 'text-[#FAF8F5] border-[#C5A880]' : 'border-transparent'
            }`}
          >
            Venue Lock™
          </button>
          <button
            onClick={() => onNavigate('vision-atelier')}
            className={`cursor-pointer hover:text-[#FAF8F5] transition-colors pb-0.5 border-b ${
              activeSection === 'vision-atelier' ? 'text-[#FAF8F5] border-[#C5A880]' : 'border-transparent'
            }`}
          >
            Creative Direction
          </button>
          <button
            onClick={() => onNavigate('concepts')}
            className={`cursor-pointer hover:text-[#FAF8F5] transition-colors pb-0.5 border-b ${
              activeSection === 'concepts' ? 'text-[#FAF8F5] border-[#C5A880]' : 'border-transparent'
            }`}
          >
            Your Concepts
          </button>
          <button
            onClick={() => onNavigate('proposal')}
            className={`cursor-pointer hover:text-[#FAF8F5] transition-colors pb-0.5 border-b ${
              activeSection === 'proposal' ? 'text-[#FAF8F5] border-[#C5A880]' : 'border-transparent'
            }`}
          >
            Investment Preview
          </button>
        </nav>

        {/* Zone 3: Currency Switcher & Primary Action */}
        <div className="flex items-center gap-3">
          {/* Currency Toggle */}
          <div className="flex items-center bg-[#141312] border border-white/10 rounded-sm p-0.5 text-[11px] font-mono-numbers">
            {currencies.map((curr) => {
              const isSelected = currency === curr;
              return (
                <button
                  key={curr}
                  onClick={() => onChangeCurrency(curr)}
                  className={`px-2 py-1 rounded-[1px] cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[#C5A880] text-[#0C0B0A] font-semibold'
                      : 'text-[#8A8378] hover:text-[#FAF8F5]'
                  }`}
                  title={`Display pricing in ${curr}`}
                >
                  {CURRENCY_CONFIGS[curr].symbol}
                </button>
              );
            })}
          </div>

          <button
            onClick={onOpenFolio}
            className="cursor-pointer px-4 py-2 text-xs uppercase tracking-[0.16em] font-medium text-[#0C0B0A] bg-[#C5A880] hover:bg-[#D6BD96] transition-all duration-200 rounded-sm whitespace-nowrap shadow-[0_4px_20px_rgba(197,168,128,0.15)]"
          >
            View Proposal
          </button>
        </div>
      </div>
    </header>
  );
};
