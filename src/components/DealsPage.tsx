import React from 'react';
import { Flame, Clock, ShoppingBag, Check, ShieldCheck, Gift } from 'lucide-react';
import { Deal, PageView } from '../types';
import { useStore } from '../context/StoreContext';

interface DealsPageProps {
  onAddDealToCart: (deal: Deal) => void;
  onNavigate: (page: PageView) => void;
}

export const DealsPage: React.FC<DealsPageProps> = ({ onAddDealToCart, onNavigate }) => {
  const { deals } = useStore();

  return (
    <div className="py-10 md:py-14 bg-[#FDFBF7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 bg-red-100 text-[#801414] text-xs font-black uppercase px-3.5 py-1.5 rounded-full mb-3 shadow-xs">
            <Flame className="w-4 h-4 fill-red-600 text-red-600" />
            <span>Kabab & Nimko Combo Deals</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#2D1A16] font-display">
            Exclusive Karachi Bundle Deals
          </h1>
          <p className="text-sm sm:text-base text-[#735A50] mt-3">
            Get your favourite frozen Chicken Seekh, Shami Kababs, Gourmet Beef Seekh, and crunchy Karachi Nimkos bundled together at special factory-direct discounted prices.
          </p>
        </div>

        {/* Hero Value Banner */}
        {deals.length > 0 && (
          <div className="mb-12 bg-gradient-to-r from-[#801414] via-[#651010] to-[#450A0A] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border-2 border-amber-400/30">
            <div className="space-y-2 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                <Gift className="w-4 h-4" />
                <span>Weekend Freezer Stocking Deal</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display">
                Featured Combo: {deals[0].title}
              </h2>
              <p className="text-xs sm:text-sm text-stone-200 max-w-xl">
                {deals[0].tagline} - Save Rs. {deals[0].savings.toLocaleString()}!
              </p>
            </div>

            <button
              onClick={() => onAddDealToCart(deals[0])}
              className="bg-[#D97706] hover:bg-[#B45309] text-slate-950 hover:text-white font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-lg transition-all active:scale-95 shrink-0 cursor-pointer"
            >
              Add {deals[0].badge || 'Combo'} Deal
            </button>
          </div>
        )}

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {deals.map((deal) => (
            <div
              key={deal.id}
              className="bg-white rounded-3xl border border-[#E8DFC8] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Image & Badges */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#F4EFE6]">
                <img
                  src={deal.image}
                  alt={deal.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {deal.badge && (
                  <div className="absolute top-3 left-3 bg-[#801414] text-white text-xs font-black px-3 py-1 rounded-md shadow-md uppercase tracking-wider">
                    {deal.badge}
                  </div>
                )}

                {deal.urgencyText && (
                  <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md text-amber-300 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{deal.urgencyText}</span>
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-extrabold text-xl text-[#2D1A16] font-display group-hover:text-[#801414] transition-colors leading-tight">
                    {deal.title}
                  </h3>
                  <p className="text-xs text-[#735A50] mt-1 font-medium leading-relaxed">
                    {deal.tagline}
                  </p>

                  <p className="text-xs text-[#4A352F] mt-3 leading-relaxed">
                    {deal.description}
                  </p>

                  {/* Included Items Box */}
                  {deal.itemsIncluded && deal.itemsIncluded.length > 0 && (
                    <div className="mt-4 p-3.5 bg-[#FAF7F0] rounded-2xl border border-[#E8DFC8] space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#801414] block">
                        ✓ Package Inclusions:
                      </span>
                      {deal.itemsIncluded.map((item, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-xs text-[#3D2821]">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="font-medium">{item}</span>
                        </div>
                      ))}
                      {deal.servings && (
                        <div className="text-[11px] font-bold text-[#8C7A70] pt-1 border-t border-[#E8DFC8]">
                          👥 Ideal for: {deal.servings}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Pricing & Add to Cart */}
                <div className="pt-4 border-t border-[#F0E8D8] flex items-center justify-between gap-3">
                  <div>
                    {deal.savings > 0 && (
                      <div className="text-[11px] text-emerald-700 font-extrabold uppercase">
                        Save Rs. {deal.savings.toLocaleString()}
                      </div>
                    )}
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-extrabold text-[#801414] font-display">
                        Rs. {deal.discountedPrice.toLocaleString()}
                      </span>
                      {deal.originalPrice > deal.discountedPrice && (
                        <span className="text-xs text-[#9E8E85] line-through">
                          Rs. {deal.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => onAddDealToCart(deal)}
                    className="bg-[#D97706] hover:bg-[#B45309] text-slate-950 hover:text-white px-5 py-3 rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add Deal</span>
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Guarantee Banner */}
        <div className="mt-14 p-6 bg-white rounded-3xl border border-[#E8DFC8] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF0DC] flex items-center justify-center text-[#801414] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#2D1A16] font-display">
                100% Cold-Chain Freshness Guarantee
              </h4>
              <p className="text-xs text-[#735A50]">
                All deal packages arrive in sealed thermal pouches with frozen ice packs. If your kababs arrive thawed, we replace them immediately.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('shop')}
            className="text-xs font-bold text-[#801414] hover:underline shrink-0 cursor-pointer"
          >
            Looking for single packs? Browse Menu →
          </button>
        </div>

      </div>
    </div>
  );
};
