import React, { useRef, useState } from 'react';
import { UploadCloud, CheckCircle2, Building2, MapPin, Sparkles, Image as ImageIcon } from 'lucide-react';
import { CustomerVenue } from '../types';
import { DEFAULT_CUSTOMER_VENUE, SAMPLE_BALLROOM_VENUE } from '../data/venues';

interface VenueSelectorProps {
  currentVenue: CustomerVenue;
  onUploadVenue: (imageDataUrl: string, venueName: string, estimatedType: CustomerVenue['estimatedType']) => void;
  onSelectSampleVenue: (venue: CustomerVenue) => void;
}

export const VenueSelector: React.FC<VenueSelectorProps> = ({
  currentVenue,
  onUploadVenue,
  onSelectSampleVenue,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [venueNameInput, setVenueNameInput] = useState('');
  const [venueTypeInput, setVenueTypeInput] = useState<CustomerVenue['estimatedType']>('Indoor Hall / Ballroom');
  const [isUploading, setIsUploading] = useState(false);

  const handleFile = (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;
    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const derivedName = venueNameInput.trim() || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setTimeout(() => {
        onUploadVenue(dataUrl, derivedName, venueTypeInput);
        setIsUploading(false);
      }, 500);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <section id="venue-selection" className="py-20 border-t border-white/[0.08] bg-[#0E0D0C]">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#C5A880] mb-2 font-medium">
              <span>Step 01</span>
              <span aria-hidden="true">·</span>
              <span>Spatial Foundation</span>
            </div>
            <h2 className="font-serif-luxury text-3xl md:text-4xl lg:text-5xl text-[#FAF8F5] font-normal">
              Bring Your Venue
            </h2>
          </div>
          <p className="max-w-md text-xs md:text-sm text-[#A8A196] leading-relaxed font-light">
            Upload a clear photo of your banquet hall, hotel ballroom, garden lawn, or terrace. SKETCH anchors every subsequent concept to your actual physical walls.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Main Upload Dropzone */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            {/* Metadata Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#141312] p-4 rounded-sm border border-white/[0.08]">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#A8A196] mb-1.5 font-medium">
                  Venue Name / Location (Optional)
                </label>
                <input
                  type="text"
                  value={venueNameInput}
                  onChange={(e) => setVenueNameInput(e.target.value)}
                  placeholder="e.g. Grand Ballroom, The Leela or Lawn Area"
                  className="w-full bg-[#0C0B0A] border border-white/10 rounded-sm px-3 py-2 text-xs text-[#FAF8F5] placeholder-[#555048] focus:border-[#C5A880] focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#A8A196] mb-1.5 font-medium">
                  Space Type
                </label>
                <select
                  value={venueTypeInput}
                  onChange={(e) => setVenueTypeInput(e.target.value as any)}
                  className="w-full bg-[#0C0B0A] border border-white/10 rounded-sm px-3 py-2 text-xs text-[#FAF8F5] focus:border-[#C5A880] focus:outline-none transition-colors"
                >
                  <option value="Indoor Hall / Ballroom">Indoor Hall / Ballroom</option>
                  <option value="Outdoor Lawn / Courtyard">Outdoor Lawn / Courtyard</option>
                  <option value="Historic / Heritage Space">Historic / Heritage Space</option>
                  <option value="Custom Venue">Custom Space</option>
                </select>
              </div>
            </div>

            {/* Drop Container */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex-1 min-h-[300px] rounded-sm border transition-all duration-300 flex flex-col items-center justify-center p-8 text-center cursor-pointer group ${
                isDragging
                  ? 'border-[#C5A880] bg-[#C5A880]/10'
                  : 'border-dashed border-white/20 hover:border-[#C5A880]/60 bg-[#141312]/80 hover:bg-[#181615]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFile(e.target.files[0]);
                  }
                }}
              />

              <div className="w-14 h-14 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-[#C5A880]/50 transition-all">
                {isUploading ? (
                  <div className="w-6 h-6 border-2 border-[#C5A880] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <UploadCloud className="w-6 h-6 text-[#C5A880]" />
                )}
              </div>

              <span className="text-xs uppercase tracking-[0.2em] text-[#C5A880] mb-1 block font-medium">
                {isUploading ? 'Registering Venue Geometry...' : 'Upload Your Space'}
              </span>
              <p className="font-serif-luxury text-xl md:text-2xl text-[#FAF8F5] mb-2 font-normal">
                Drop your venue photo here
              </p>
              <p className="text-xs text-[#8A8378] max-w-sm leading-relaxed mb-5 font-light">
                Wide-angle interior or outdoor perspective recommended. Clear visibility of floor, perimeter walls, or columns helps preserve spatial context.
              </p>

              <button
                type="button"
                className="cursor-pointer px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-[#FAF8F5] bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 rounded-sm transition-colors"
              >
                Browse Image Files
              </button>
            </div>
          </div>

          {/* Active Venue Status & Sample Spaces */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            {/* Active Venue Card */}
            <div className="bg-[#141312] border border-white/[0.08] p-5 rounded-sm">
              <span className="text-[10px] uppercase tracking-wider text-[#C5A880] block mb-2 font-medium">
                Currently Active Venue Photo
              </span>
              <div className="flex gap-4 items-center">
                <div className="w-24 h-20 rounded-sm overflow-hidden bg-black shrink-0 relative border border-white/10">
                  <img
                    src={currentVenue.image}
                    alt={currentVenue.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif-luxury text-lg text-[#FAF8F5] truncate mb-0.5">
                    {currentVenue.name}
                  </h4>
                  <p className="text-xs text-[#9E978D] font-light mb-1">
                    {currentVenue.estimatedType}
                  </p>
                  <p className="text-[11px] text-[#C5A880] font-mono-numbers">
                    {currentVenue.knownDimensions}
                  </p>
                </div>
              </div>
            </div>

            {/* Starter Sample Spaces for Testing */}
            <div>
              <div className="flex items-center justify-between text-xs text-[#A8A196] uppercase tracking-[0.16em] mb-3">
                <span>Or explore with a sample space</span>
                <span className="text-[10px] text-[#7A746B]">For Testing</span>
              </div>

              <div className="space-y-3">
                {[DEFAULT_CUSTOMER_VENUE, SAMPLE_BALLROOM_VENUE].map((sample) => {
                  const isCurrent = currentVenue.id === sample.id;
                  return (
                    <div
                      key={sample.id}
                      onClick={() => onSelectSampleVenue(sample)}
                      className={`cursor-pointer rounded-sm border p-3.5 transition-all flex items-center gap-4 ${
                        isCurrent
                          ? 'border-[#C5A880] bg-[#181615]'
                          : 'border-white/[0.08] bg-[#121110] hover:border-white/20'
                      }`}
                    >
                      <div className="w-16 h-12 rounded-sm overflow-hidden bg-black shrink-0">
                        <img
                          src={sample.image}
                          alt={sample.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-medium text-[#FAF8F5] truncate">
                          {sample.name}
                        </h5>
                        <p className="text-[11px] text-[#8A8378] font-light">
                          {sample.estimatedType}
                        </p>
                      </div>
                      {isCurrent && (
                        <span className="text-[10px] uppercase tracking-wider text-[#C5A880] font-mono-numbers shrink-0">
                          Selected
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Realistic Disclaimer Footer */}
            <div className="p-3.5 bg-[#0C0B0A] rounded-sm border border-white/[0.06] text-xs text-[#8A8378] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#C5A880] shrink-0" />
              <span>
                Visual analysis only. Exact structural capacity and dimensions require an on-site survey.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
