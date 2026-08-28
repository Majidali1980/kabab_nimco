import React, { useState } from 'react';
import { Star, ShieldCheck, ChevronDown, ChevronUp, MessageSquare, Sparkles, Heart } from 'lucide-react';
import { TESTIMONIALS, FAQS } from '../data/testimonials';

export const TestimonialsSection: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <section className="py-16 bg-[#FAF7F0] border-b border-[#E8DFC8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Testimonials Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 bg-[#FAF0DC] text-[#801414] text-xs font-black uppercase px-3 py-1 rounded-full mb-3">
            <Heart className="w-3.5 h-3.5 fill-[#801414]" />
            <span>Loved by 10,000+ Karachi Homes</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#2D1A16] font-display">
            Real Reviews From Real Foodies
          </h2>
          <p className="text-sm text-[#735A50] mt-2">
            See why families in DHA, Clifton, Gulshan, and across Karachi choose Nimko & Kabab Co.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-3xl p-6 border border-[#E8DFC8] shadow-xs flex flex-col justify-between"
            >
              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-xs text-[#4A352F] leading-relaxed italic">
                  "{t.review}"
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-[#F0E8D8] flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-[#E8DFC8]"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-[#2D1A16] truncate">{t.name}</h4>
                  <p className="text-[10px] text-[#735A50]">{t.location}</p>
                  <p className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3 h-3 inline" /> Verified Buyer
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQs Accordion Section */}
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFC8] shadow-sm">
          <div className="text-center mb-8">
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#2D1A16] font-display">
              Frequently Asked Questions
            </h3>
            <p className="text-xs text-[#735A50] mt-1">
              Everything you need to know about our cold-chain delivery, storage, and preparation.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="border border-[#E8DFC8] rounded-2xl overflow-hidden bg-[#FAF7F0]"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full px-5 py-4 text-left font-bold text-xs sm:text-sm text-[#2D1A16] flex items-center justify-between hover:bg-[#F2EBDC] transition-colors"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-[#801414] shrink-0" /> : <ChevronDown className="w-4 h-4 text-[#735A50] shrink-0" />}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-4 text-xs sm:text-sm text-[#523B33] leading-relaxed bg-white border-t border-[#E8DFC8] pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
