import React from 'react';
import { Flame, Clock, ShoppingBag, ArrowRight, Check } from 'lucide-react';
import { Deal, PageView } from '../types';
import { useStore } from '../context/StoreContext';

interface DealsSectionProps {
  onAddDealToCart: (deal: Deal) => void;
  onNavigate: (page: PageView) => void;
}

export const DealsSection: React.FC<DealsSectionProps> = ({ onAddDealToCart, onNavigate }) => {
  const { deals } = useStore();

  return (
    <section className="py-14 bg-[#FFFDF9] border-b border-[#E8DFC8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-red-100 text-[#801414] text-xs font-black uppercase px-3 py-1 rounded-full mb-2">
              <Flame className="w-3.5 h-3.5 fill-red-600 text-red-600" />
              <span>Limited Time Specials</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#2D1A16] font-display">
              Deals & Family Combo Packs
            </h2>
            <p className="text-sm text-[#735A50] mt-1">
              Bundle your frozen chicken & beef kababs with fresh crunchy nimkos and save big.
            </p>
          </div>

          <button
            onClick={() => onNavigate('deals')}
            className="text-xs font-extrabold text-[#801414] hover:text-[#5C0E0E] flex items-center gap-1.5 underline-offset-4 hover:underline cursor-pointer"
          >
            <span>View All Deals & Combos</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Deals Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {deals.map((deal) => (
            <div
              key={deal.id}
              className="bg-white rounded-3xl border border-[#E8DFC8] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
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
                  <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md text-amber-300 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{deal.urgencyText}</span>
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-extrabold text-lg text-[#2D1A16] font-display group-hover:text-[#801414] transition-colors leading-tight">
                    {deal.title}
                  </h3>
                  <p className="text-xs text-[#735A50] mt-1 font-medium leading-relaxed">
                    {deal.tagline}
                  </p>

                  {/* Included Items Checklist */}
                  {deal.itemsIncluded && deal.itemsIncluded.length > 0 && (
                    <div className="mt-4 p-3 bg-[#FAF7F0] rounded-xl border border-[#E8DFC8] space-y-1.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8C7A70] block">
                        Included in this pack:
                      </span>
                      {deal.itemsIncluded.map((item, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-xs text-[#3D2821]">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="font-medium">{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price & Add to cart */}
                <div className="pt-3 border-t border-[#F0E8D8] flex items-center justify-between gap-3">
                  <div>
                    {deal.savings > 0 && (
                      <div className="text-[10px] text-emerald-700 font-bold uppercase">
                        Save Rs. {deal.savings.toLocaleString()}
                      </div>
                    )}
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-extrabold text-[#801414] font-display">
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
                    className="bg-[#D97706] hover:bg-[#B45309] text-slate-950 hover:text-white px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add Deal</span>
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
