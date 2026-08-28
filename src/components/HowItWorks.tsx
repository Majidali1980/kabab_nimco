import React from 'react';
import { ShoppingCart, Snowflake, Truck, Flame, Sparkles, ChefHat } from 'lucide-react';

interface HowItWorksProps {
  onOpenCookingGuide: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onOpenCookingGuide }) => {
  const steps = [
    {
      number: '01',
      title: 'Order Online or WhatsApp',
      desc: 'Pick your favourite chicken kababs, prime beef kababs, or crispy mix nimko snacks in just a few taps.',
      icon: <ShoppingCart className="w-6 h-6 text-[#801414]" />,
      badge: 'Step 1'
    },
    {
      number: '02',
      title: 'Freshly Prepared & Blast-Frozen',
      desc: 'Handmade daily with 100% Halal prime meat, freshly ground spices, and quick-frozen at -35°C within 30 mins.',
      icon: <Snowflake className="w-6 h-6 text-sky-700" />,
      badge: 'Step 2'
    },
    {
      number: '03',
      title: 'Insulated Cold-Chain Delivery',
      desc: 'Delivered to your doorstep in Karachi using insulated thermal pouches and sub-zero reusable ice gel packs.',
      icon: <Truck className="w-6 h-6 text-[#D97706]" />,
      badge: 'Step 3'
    },
    {
      number: '04',
      title: 'Fry for 3 Minutes & Enjoy',
      desc: 'No defrosting needed! Drop straight from freezer into medium-hot pan or air fryer for crispy juicy heaven.',
      icon: <Flame className="w-6 h-6 text-[#801414]" />,
      badge: 'Step 4'
    }
  ];

  return (
    <section className="py-14 bg-[#FAF7F0] border-b border-[#E8DFC8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 bg-[#FAF0DC] text-[#801414] text-xs font-black uppercase px-3 py-1 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#E69500]" />
            <span>Effortless Freshness</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#2D1A16] font-display">
            How Nimko & Kabab Co. Works
          </h2>
          <p className="text-sm text-[#735A50] mt-2">
            Restaurant-quality charcoal seekh kababs and artisanal tea-time snacks delivered frozen to your door.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-[#E8DFC8] shadow-sm hover:shadow-md transition-all relative flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#FAF0DC] flex items-center justify-center">
                  {step.icon}
                </div>
                <span className="text-2xl font-black text-[#E8DFC8] font-display">
                  {step.number}
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-base text-[#2D1A16] font-display mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-[#523B33] leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F0E8D8] text-[11px] font-bold text-[#801414] uppercase tracking-wider">
                {step.badge}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Frying Guide Trigger Banner */}
        <div className="mt-10 bg-gradient-to-r from-[#801414] to-[#5C0E0E] rounded-2xl p-6 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-white font-display">
                Want to know how to fry frozen kababs without breaking?
              </h3>
              <p className="text-xs text-amber-200 mt-0.5">
                Check our 3-minute pan frying, tawa grilling, and air-fryer temperature guide.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenCookingGuide}
            className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs px-5 py-3 rounded-xl shadow-md transition-all shrink-0 cursor-pointer"
          >
            View 3-Min Frying Guide
          </button>
        </div>

      </div>
    </section>
  );
};
