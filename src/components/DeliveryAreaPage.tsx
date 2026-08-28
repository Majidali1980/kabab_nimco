import React, { useState } from 'react';
import { MapPin, Search, Truck, Clock, ShieldCheck, MessageCircle } from 'lucide-react';
import { DELIVERY_ZONES, DELIVERY_PROMISES } from '../data/deliveryAreas';
import { useStore } from '../context/StoreContext';

export const DeliveryAreaPage: React.FC = () => {
  const { siteSettings, navbarConfig } = useStore();
  const [searchArea, setSearchArea] = useState('');
  const cleanWhatsApp = siteSettings.whatsappNumber.replace(/[^0-9]/g, '');

  const filteredZones = DELIVERY_ZONES.map(zone => {
    if (!searchArea.trim()) return zone;
    const matchingSubs = zone.subAreas.filter(sub =>
      sub.toLowerCase().includes(searchArea.toLowerCase())
    );
    const matchesZoneName = zone.name.toLowerCase().includes(searchArea.toLowerCase());
    if (matchesZoneName || matchingSubs.length > 0) {
      return {
        ...zone,
        subAreas: matchingSubs.length > 0 ? matchingSubs : zone.subAreas
      };
    }
    return null;
  }).filter(Boolean) as typeof DELIVERY_ZONES;

  return (
    <div className="py-10 md:py-16 bg-[#FDFBF7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-[#FAF0DC] text-[#801414] text-xs font-black uppercase px-3.5 py-1.5 rounded-full">
            <MapPin className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Karachi City Wide Coverage</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#2D1A16] font-display">
            Delivery Areas & Timings
          </h1>
          <p className="text-sm sm:text-base text-[#735A50]">
            We deliver frozen, ready-to-fry kababs and fresh nimko across all major neighborhoods of Karachi in thermal insulated bags with reusable sub-zero gel ice packs.
          </p>

          {/* Area Search Input */}
          <div className="max-w-md mx-auto relative pt-4">
            <Search className="absolute left-4 top-7 w-4 h-4 text-[#8C7A70]" />
            <input
              type="text"
              value={searchArea}
              onChange={(e) => setSearchArea(e.target.value)}
              placeholder="Search your area (e.g. DHA, Clifton, Gulshan, PECHS)..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-[#E0D5C1] focus:border-[#801414] rounded-2xl text-xs sm:text-sm text-[#2D1A16] shadow-sm outline-none"
            />
            {searchArea && (
              <button
                onClick={() => setSearchArea('')}
                className="absolute right-4 top-7 text-xs font-bold text-[#8C7A70] hover:text-[#2D1A16] cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Coverage Zones Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredZones.map((zone) => (
            <div
              key={zone.id}
              className="bg-white rounded-3xl p-6 border border-[#E8DFC8] shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#F0E8D8]">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#801414]" />
                    <h3 className="font-extrabold text-base text-[#2D1A16] font-display">
                      {zone.name}
                    </h3>
                  </div>
                  <span className="bg-emerald-50 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-emerald-200">
                    Active Zone
                  </span>
                </div>

                <div className="mt-3 space-y-2 text-xs text-[#523B33]">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#D97706]" />
                    <span><strong>Delivery Time:</strong> {zone.deliveryTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-[#801414]" />
                    <span><strong>Delivery Fee:</strong> Rs. {siteSettings.standardDeliveryFee} (FREE above Rs. {siteSettings.freeDeliveryThreshold.toLocaleString()})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                    <span><strong>Same-Day Order Cutoff:</strong> {zone.sameDayCutoff}</span>
                  </div>
                </div>

                {/* Sub-areas Tags */}
                <div className="mt-4 pt-3 border-t border-[#F0E8D8]">
                  <p className="text-[10px] font-black uppercase tracking-wider text-[#8C7A70] mb-2">
                    Covered Locations in {zone.name}:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {zone.subAreas.map((sub, sIdx) => (
                      <span
                        key={sIdx}
                        className="bg-[#FAF7F0] text-[#3D2821] border border-[#E8DFC8] text-[11px] px-2.5 py-1 rounded-lg"
                      >
                        ✓ {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#F0E8D8] text-[11px] text-[#735A50] flex items-center justify-between">
                <span>Minimum Order: <strong>Rs. {zone.minOrder}</strong></span>
                <span className="text-emerald-700 font-bold">Cold Chain Bag</span>
              </div>
            </div>
          ))}
        </div>

        {/* Delivery Promises Strip */}
        <div className="bg-[#FAF7F0] rounded-3xl p-8 border border-[#E8DFC8]">
          <h3 className="text-xl font-extrabold text-[#2D1A16] font-display text-center mb-8">
            The {navbarConfig.brandPrefix} Cold-Chain Delivery Standard
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DELIVERY_PROMISES.map((p, idx) => (
              <div key={idx} className="space-y-1.5 text-left">
                <div className="w-8 h-8 rounded-lg bg-[#FAF0DC] flex items-center justify-center text-[#801414] font-bold text-xs mb-2">
                  0{idx + 1}
                </div>
                <h4 className="font-bold text-sm text-[#2D1A16] font-display">{p.title}</h4>
                <p className="text-xs text-[#523B33] leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Area Enquiry Help */}
        <div className="bg-white rounded-3xl p-6 border border-[#E8DFC8] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5 fill-current" />
            </div>
            <div>
              <p className="font-bold text-xs sm:text-sm text-[#2D1A16]">
                Don't see your specific Karachi sector or apartment complex?
              </p>
              <p className="text-xs text-[#735A50]">
                Message our dispatch coordinator on WhatsApp for instant address confirmation.
              </p>
            </div>
          </div>

          <a
            href={`https://wa.me/${cleanWhatsApp}?text=Salam!%20I%20want%20to%20check%20delivery%20availability%20for%20my%20address`}
            target="_blank"
            rel="noreferrer"
            className="bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm transition-all shrink-0 cursor-pointer"
          >
            Check Address on WhatsApp ({siteSettings.whatsappNumber})
          </a>
        </div>

      </div>
    </div>
  );
};
