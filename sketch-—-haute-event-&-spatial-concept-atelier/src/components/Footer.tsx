import React from 'react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#0A0908] border-t border-white/[0.08] py-16 text-[#8A8378] text-xs">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-5">
            <span className="font-serif-luxury text-2xl tracking-[0.25em] text-[#FAF8F5] uppercase block mb-3 font-medium">
              SKETCH
            </span>
            <p className="text-xs text-[#807A70] leading-relaxed max-w-md font-light mb-4">
              Premium event and spatial concept visualization. Transforming customer venue photographs into bespoke celebration concepts while preserving real room architecture through Venue Lock™.
            </p>
            <div className="text-[11px] text-[#C5A880] font-mono-numbers">
              Venue Lock™ · Visual Preservation Standard
            </div>
          </div>

          {/* Workflow Links */}
          <div className="md:col-span-4">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#C5A880] block mb-3 font-medium">
              Design Workflow
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('venue-selection')}
                  className="hover:text-[#FAF8F5] transition-colors cursor-pointer text-left"
                >
                  Bring Your Venue (Photo Upload)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('venue-lock')}
                  className="hover:text-[#FAF8F5] transition-colors cursor-pointer text-left"
                >
                  Venue Lock™ Spatial Recognition
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('vision-atelier')}
                  className="hover:text-[#FAF8F5] transition-colors cursor-pointer text-left"
                >
                  Creative Direction & Budgeting
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('concepts')}
                  className="hover:text-[#FAF8F5] transition-colors cursor-pointer text-left"
                >
                  Your Concepts (Essential, Signature, Luxury)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('proposal')}
                  className="hover:text-[#FAF8F5] transition-colors cursor-pointer text-left"
                >
                  Investment Preview & Proposal
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="md:col-span-3">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#C5A880] block mb-3 font-medium">
              Event Inquiries
            </span>
            <p className="text-xs text-[#807A70] leading-relaxed mb-2 font-light">
              For event decorators, planners, and clients planning weddings, galas, and celebrations.
            </p>
            <p className="text-xs text-[#FAF8F5] font-mono-numbers">
              hello@sketch-design.com
            </p>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#555048]">
          <div>
            © {new Date().getFullYear()} SKETCH Event Technologies. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Visual preservation only · On-site survey required</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
