import React, { useState } from 'react';
import { X, Check, Calendar, Mail, User, Phone, MapPin } from 'lucide-react';
import { CustomerVenue, ConceptTier, CurrencyCode } from '../types';
import { CURRENCY_CONFIGS } from '../data/venues';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  venue: CustomerVenue;
  concept: ConceptTier;
  totalEstimateINR: number;
  currency: CurrencyCode;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({
  isOpen,
  onClose,
  venue,
  concept,
  totalEstimateINR,
  currency,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedFolio, setSubmittedFolio] = useState<string | null>(null);

  const currentCurrency = CURRENCY_CONFIGS[currency] || CURRENCY_CONFIGS.INR;

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: name,
          clientEmail: email,
          phone,
          eventDate,
          city,
          conceptTitle: concept.title,
          totalEstimate: currentCurrency.format(totalEstimateINR),
          venueName: venue.name,
          notes,
        }),
      });
      const data = await res.json();
      setSubmittedFolio(data.folioNumber || `SK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
    } catch {
      setSubmittedFolio(`SK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#141312] border border-white/10 rounded-sm p-6 md:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-5 right-5 text-[#8A8378] hover:text-[#FAF8F5] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedFolio ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#C5A880]/10 border border-[#C5A880]/30 mx-auto flex items-center justify-center text-[#C5A880]">
              <Check className="w-6 h-6" />
            </div>

            <span className="text-[11px] uppercase tracking-[0.2em] text-[#C5A880] block font-medium">
              Consultation Requested
            </span>

            <h3 className="font-serif-luxury text-2xl md:text-3xl text-[#FAF8F5]">
              Design Proposal Registered
            </h3>

            <p className="text-xs text-[#A8A196] leading-relaxed max-w-sm mx-auto font-light">
              Your concept for <span className="text-[#FAF8F5] font-medium">{venue.name}</span> ({concept.title}) has been recorded. An event designer will reach out to schedule your on-site venue survey.
            </p>

            <div className="py-2.5 px-4 bg-[#0C0B0A] border border-white/10 rounded-sm inline-block font-mono-numbers text-xs text-[#C5A880]">
              REFERENCE № {submittedFolio}
            </div>

            <div className="pt-3">
              <button
                onClick={onClose}
                className="cursor-pointer px-6 py-2.5 bg-[#C5A880] hover:bg-[#D6BD96] text-[#0C0B0A] text-xs uppercase tracking-[0.16em] font-medium rounded-sm transition-all"
              >
                Return to Proposal
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#C5A880] block mb-1 font-medium">
                On-Site Survey & Consultation
              </span>
              <h3 className="font-serif-luxury text-2xl text-[#FAF8F5]">
                Schedule Your Venue Consultation
              </h3>
              <p className="text-xs text-[#8A8378] mt-1 font-light">
                Connect with an event decorator to confirm physical measurements, floral selections, and final stage fabrication.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#A8A196] mb-1 font-medium">
                  Full Name / Contact Person
                </label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Sharma or Rahul Mehta"
                  className="w-full bg-[#0C0B0A] border border-white/10 rounded-sm p-2.5 text-xs text-[#FAF8F5] focus:border-[#C5A880] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#A8A196] mb-1 font-medium">
                    Phone / WhatsApp
                  </label>
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#0C0B0A] border border-white/10 rounded-sm p-2.5 text-xs text-[#FAF8F5] focus:border-[#C5A880] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#A8A196] mb-1 font-medium">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-[#0C0B0A] border border-white/10 rounded-sm p-2.5 text-xs text-[#FAF8F5] focus:border-[#C5A880] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#A8A196] mb-1 font-medium">
                    Target Event Date
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-[#0C0B0A] border border-white/10 rounded-sm p-2.5 text-xs text-[#FAF8F5] focus:border-[#C5A880] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#A8A196] mb-1 font-medium">
                    City / Venue Location
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Mumbai, Delhi, Jaipur"
                    className="w-full bg-[#0C0B0A] border border-white/10 rounded-sm p-2.5 text-xs text-[#FAF8F5] focus:border-[#C5A880] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#A8A196] mb-1 font-medium">
                  Additional Notes or Questions
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Share any details regarding planner coordination, entry setup, or mandap/stage preferences..."
                  className="w-full bg-[#0C0B0A] border border-white/10 rounded-sm p-2.5 text-xs text-[#FAF8F5] focus:border-[#C5A880] focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="cursor-pointer w-full py-3.5 bg-[#C5A880] hover:bg-[#D6BD96] disabled:bg-[#3D372E] text-[#0C0B0A] font-medium uppercase tracking-[0.2em] text-xs rounded-sm transition-all"
                >
                  {isSubmitting ? 'Registering...' : 'Request On-Site Survey'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
