import React, { useState } from 'react';
import { 
  Phone, 
  MapPin, 
  MessageCircle, 
  ShieldCheck, 
  Snowflake, 
  Utensils, 
  Send,
  Clock,
  Lock
} from 'lucide-react';
import { PageView } from '../types';
import { useStore } from '../context/StoreContext';

interface FooterProps {
  onNavigate: (page: PageView, filterCategory?: string) => void;
  onOpenCookingGuide: () => void;
  onOpenAdminLogin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenCookingGuide, onOpenAdminLogin }) => {
  const { siteSettings, footerConfig, navbarConfig } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSubscribed(true);
    setNewsletterEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  const cleanWhatsApp = siteSettings.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <footer className="bg-[#1A0B09] text-stone-300 pt-14 pb-8 border-t border-[#331814]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          
          {/* Col 1: Brand Info (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#801414] flex items-center justify-center text-white border border-[#E69500]/40 shadow-md">
                <Utensils className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-white font-display tracking-tight">
                  {navbarConfig.brandPrefix} <span className="text-[#D97706]">{navbarConfig.brandSuffix}</span>
                </span>
                <p className="text-[11px] text-amber-200/80 font-medium">{navbarConfig.subtext}</p>
              </div>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed max-w-sm">
              {footerConfig.brandDescription}
            </p>

            {/* Quality Badges */}
            <div className="flex flex-wrap gap-2 text-[11px]">
              <span className="bg-white/10 px-2.5 py-1 rounded-lg text-stone-200 border border-white/10 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> {footerConfig.halalBadgeText}
              </span>
              <span className="bg-white/10 px-2.5 py-1 rounded-lg text-stone-200 border border-white/10 flex items-center gap-1">
                <Snowflake className="w-3.5 h-3.5 text-sky-400" /> {footerConfig.coldChainBadgeText}
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links (2 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 font-display">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              {footerConfig.quickLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => {
                      if (link.page === ('guide' as any)) {
                        onOpenCookingGuide();
                      } else {
                        onNavigate(link.page);
                      }
                    }}
                    className={`hover:text-amber-300 transition-colors text-left cursor-pointer ${
                      link.isHighlighted ? 'text-amber-300 font-bold' : 'text-stone-300'
                    }`}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
              {onOpenAdminLogin && (
                <li>
                  <button
                    onClick={onOpenAdminLogin}
                    className="hover:text-amber-300 text-stone-400 transition-colors text-left cursor-pointer flex items-center gap-1.5 font-medium"
                  >
                    <Lock className="w-3 h-3 text-amber-400/80" />
                    <span>Admin Portal Login</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Col 3: Delivery Areas (3 Cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 font-display">
              Karachi Delivery Coverage
            </h4>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-xs text-stone-300">
              {footerConfig.deliveryAreas.map((area, idx) => (
                <button 
                  key={idx} 
                  onClick={() => onNavigate('delivery')} 
                  className="text-left hover:text-amber-300 truncate cursor-pointer"
                >
                  • {area}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-stone-400 pt-1">
              🚚 Orders over Rs. {siteSettings.freeDeliveryThreshold.toLocaleString()} qualify for FREE cold-chain home delivery.
            </p>
          </div>

          {/* Col 4: Contact & WhatsApp Hotline (3 Cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 font-display">
              Kitchen Hotline & Orders
            </h4>
            
            <div className="space-y-2 text-xs">
              <a
                href={`https://wa.me/${cleanWhatsApp}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-emerald-300 px-3 py-2 rounded-xl transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current text-[#25D366]" />
                <span className="font-bold">WhatsApp: {siteSettings.whatsappNumber}</span>
              </a>

              <div className="flex items-start gap-2 text-stone-300">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{siteSettings.kitchenAddress}</span>
              </div>

              <div className="flex items-center gap-2 text-stone-300">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{siteSettings.kitchenHours}</span>
              </div>
            </div>

            {/* Mini Newsletter Subscribe */}
            <form onSubmit={handleSubscribe} className="pt-2">
              <span className="text-[10px] text-stone-400 block mb-1">
                {footerConfig.newsletterPromoText}
              </span>
              <div className="flex gap-1.5">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter email..."
                  className="bg-white/10 border border-white/15 px-3 py-1.5 rounded-lg text-xs text-white placeholder:text-stone-400 focus:outline-none focus:border-amber-400 flex-1"
                />
                <button
                  type="submit"
                  className="bg-[#D97706] hover:bg-[#B45309] text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              {subscribed && (
                <span className="text-[10px] text-emerald-400 mt-1 block">
                  ✓ Subscribed! Use code <strong>{footerConfig.welcomeCouponCode}</strong> for discount.
                </span>
              )}
            </form>
          </div>

        </div>

        {/* Bottom SEO Tagline & Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-xs text-stone-400">
          <div>
            <p className="font-semibold text-stone-300">
              {footerConfig.seoText}
            </p>
            <p className="text-[11px] text-stone-400 mt-0.5">
              {footerConfig.copyrightText}
            </p>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-stone-400">
            <span>Freshly Packed Daily</span>
            <span>•</span>
            <span>Temperature Protected</span>
            <span>•</span>
            <span>Express Delivery</span>
            {onOpenAdminLogin && (
              <>
                <span>•</span>
                <button
                  type="button"
                  onClick={onOpenAdminLogin}
                  className="inline-flex items-center gap-1 bg-white/10 hover:bg-amber-400 hover:text-stone-950 text-amber-300 px-2.5 py-1 rounded-md border border-amber-400/30 text-[11px] font-bold transition-all cursor-pointer shadow-xs"
                  title="Staff Portal Login (Ctrl+Shift+A)"
                  aria-label="Staff Portal Login"
                >
                  <Lock className="w-3 h-3" />
                  <span>Admin Login</span>
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
};
