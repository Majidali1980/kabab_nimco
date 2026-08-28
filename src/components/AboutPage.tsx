import React from 'react';
import { ShieldCheck, Snowflake, Utensils, Heart, Award, CheckCircle2, Phone, MessageCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import heroImg from '../assets/images/hero_kabab_nimko_1787856565814.jpg';

export const AboutPage: React.FC = () => {
  const { siteSettings, navbarConfig } = useStore();
  const cleanWhatsApp = siteSettings.whatsappNumber.replace(/[^0-9]/g, '');
  const cleanPhone = siteSettings.phoneHotline.replace(/[^0-9+]/g, '');

  const standards = [
    {
      title: '100% Halal Prime Meats',
      desc: 'We select only premium boneless chicken breast and fresh prime beef cuts from certified local suppliers. No scraps, no fillers.',
      icon: <Award className="w-6 h-6 text-[#801414]" />
    },
    {
      title: 'Zero Chemical Preservatives',
      desc: 'We rely exclusively on natural spices, ginger, garlic, lemon juice, and blast freezing — never artificial nitrates or MSG.',
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />
    },
    {
      title: 'Same-Day Blast Freezing (-35°C)',
      desc: 'Our kababs are shaped by hand and deep blast-frozen within 30 minutes. This preserves the moisture cells and delivers juicy tenderness upon frying.',
      icon: <Snowflake className="w-6 h-6 text-sky-600" />
    },
    {
      title: 'HACCP Grade Commercial Kitchen',
      desc: 'Sanitized stainless steel meat mincers, food-grade airtight packing, and temperature-monitored prep rooms in Karachi.',
      icon: <Utensils className="w-6 h-6 text-[#D97706]" />
    }
  ];

  return (
    <div className="py-10 md:py-16 bg-[#FDFBF7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-1.5 bg-[#FAF0DC] text-[#801414] text-xs font-black uppercase px-3.5 py-1 rounded-full">
              <Heart className="w-3.5 h-3.5 fill-[#801414]" />
              <span>Our Story & Philosophy</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#2D1A16] font-display leading-tight">
              Crafting Karachi's Finest Frozen Kababs & Nimko
            </h1>

            <p className="text-sm sm:text-base text-[#523B33] leading-relaxed">
              At <strong className="text-[#801414]">{navbarConfig.brandPrefix} {navbarConfig.brandSuffix}</strong>, we believe great food begins with authentic family recipes and zero shortcuts. Started by passionate home cooks in Karachi, our mission is simple: bring restaurant-quality, juicy charcoal seekh kababs, delicate shami kababs, and crunchy mix nimko snacks straight to your kitchen freezer.
            </p>

            <p className="text-xs sm:text-sm text-[#735A50] leading-relaxed">
              Whether you are hosting unannounced evening tea guests, throwing a weekend family barbecue, or preparing bun kababs for your children's lunchboxes, our ready-to-fry packs let you enjoy hot, sizzling delights in under 4 minutes.
            </p>

            <div className="pt-2 flex flex-wrap gap-4 text-xs font-bold text-[#801414]">
              <span className="flex items-center gap-1">✓ Karachi Owned & Operated</span>
              <span className="flex items-center gap-1">✓ Over 10,000+ Happy Households</span>
              <span className="flex items-center gap-1">✓ 100% Halal Verified</span>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src={heroImg}
                alt="Nimko & Kabab Kitchen and Food Presentation"
                referrerPolicy="no-referrer"
                className="w-full h-[380px] sm:h-[440px] object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-[#801414]/90 backdrop-blur-md text-white p-4 rounded-2xl border border-white/20 text-xs">
                <p className="font-extrabold text-sm text-amber-300 font-display">The {navbarConfig.brandPrefix} Promise</p>
                <p className="text-stone-200 mt-0.5">
                  "If our kababs aren't as succulent and aromatic as your favourite BBQ restaurant, we will happily refund your order."
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Quality Standards Grid */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2D1A16] font-display">
              Hygiene & Quality Standards
            </h2>
            <p className="text-xs sm:text-sm text-[#735A50] mt-1.5">
              Every single batch is prepared under the highest standards of culinary hygiene and food safety.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {standards.map((st, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-[#E8DFC8] shadow-xs flex flex-col justify-between"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#FAF0DC] flex items-center justify-center mb-4">
                  {st.icon}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#2D1A16] font-display mb-2">
                    {st.title}
                  </h3>
                  <p className="text-xs text-[#523B33] leading-relaxed">
                    {st.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#F0E8D8] text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Strictly Enforced</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Direct Contact & Kitchen Support Banner */}
        <div className="bg-[#FAF7F0] rounded-3xl p-8 border border-[#E8DFC8] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-extrabold text-[#2D1A16] font-display">
              Have Questions or Planning a Large Party / Event?
            </h3>
            <p className="text-xs sm:text-sm text-[#735A50] max-w-xl">
              We provide catering bulk frozen packs, custom spice blends, and party packs for birthdays, dawats, and weddings.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <a
              href={`https://wa.me/${cleanWhatsApp}`}
              target="_blank"
              rel="noreferrer"
              className="bg-[#25D366] hover:bg-[#1EBE5D] text-white px-5 py-3 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp Us: {siteSettings.whatsappNumber}</span>
            </a>

            <a
              href={`tel:${cleanPhone}`}
              className="bg-[#801414] hover:bg-[#681010] text-white px-5 py-3 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>Call: {siteSettings.phoneHotline}</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
