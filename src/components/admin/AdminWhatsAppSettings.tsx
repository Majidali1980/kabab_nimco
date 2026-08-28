import React, { useState } from 'react';
import { 
  MessageCircle, 
  Phone, 
  Store, 
  Truck, 
  Clock, 
  MapPin, 
  Save, 
  CheckCircle, 
  HelpCircle,
  ExternalLink 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { SiteSettings } from '../../types';

export const AdminWhatsAppSettings: React.FC = () => {
  const { siteSettings, updateSiteSettings } = useStore();
  const [formData, setFormData] = useState<SiteSettings>(siteSettings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleTestWhatsApp = () => {
    const cleanNumber = formData.whatsappNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=Admin%20Test%20Message%20from%20Nimko%20%26%20Kabab%20Co.`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DFC8] pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#2D1A16] font-display flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-emerald-600" />
            WhatsApp Number & Store Settings
          </h2>
          <p className="text-xs text-[#735A50]">
            Update your official WhatsApp dispatch number, customer support hotline, delivery fee limits, and brand info.
          </p>
        </div>

        <button
          type="button"
          onClick={handleTestWhatsApp}
          className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Test WhatsApp Link</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span>WhatsApp number and store settings updated successfully! All storefront buttons are now live with this number.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* WhatsApp & Phone Group */}
        <div className="bg-white p-6 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#2D1A16] font-display uppercase tracking-wider flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            WhatsApp Hotline Integration
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#3D2821] mb-1">
                WhatsApp Phone Number (with Country Code) *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  placeholder="+923001234567 or 923001234567"
                  className="w-full bg-[#FAF7F0] border border-[#DDD4CA] focus:border-emerald-600 focus:bg-white text-sm font-semibold text-[#2D1A16] px-3.5 py-2.5 rounded-xl outline-none"
                />
              </div>
              <p className="text-[11px] text-[#8C7A70] mt-1">
                Used in `https://wa.me/&lt;number&gt;` links for Floating WhatsApp, Order confirmation receipts, and Cart buttons.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3D2821] mb-1">
                WhatsApp Display Format
              </label>
              <input
                type="text"
                value={formData.whatsappDisplay}
                onChange={(e) => setFormData({ ...formData, whatsappDisplay: e.target.value })}
                placeholder="+92 300 1234567"
                className="w-full bg-[#FAF7F0] border border-[#DDD4CA] focus:border-emerald-600 focus:bg-white text-sm font-semibold text-[#2D1A16] px-3.5 py-2.5 rounded-xl outline-none"
              />
              <p className="text-[11px] text-[#8C7A70] mt-1">
                Formatted for human readability in footers and tooltips.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3D2821] mb-1">
                Store Call Phone Hotline
              </label>
              <input
                type="text"
                value={formData.phoneHotline}
                onChange={(e) => setFormData({ ...formData, phoneHotline: e.target.value })}
                placeholder="+92 300 1234567"
                className="w-full bg-[#FAF7F0] border border-[#DDD4CA] focus:border-[#801414] focus:bg-white text-sm font-semibold text-[#2D1A16] px-3.5 py-2.5 rounded-xl outline-none"
              />
              <p className="text-[11px] text-[#8C7A70] mt-1">
                Shown in top notification bar and contact widgets.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3D2821] mb-1">
                Customer Orders Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="orders@nimkokabab.pk"
                className="w-full bg-[#FAF7F0] border border-[#DDD4CA] focus:border-[#801414] focus:bg-white text-sm font-semibold text-[#2D1A16] px-3.5 py-2.5 rounded-xl outline-none"
              />
            </div>
          </div>
        </div>

        {/* Brand & Store Details Group */}
        <div className="bg-white p-6 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#2D1A16] font-display uppercase tracking-wider flex items-center gap-2">
            <Store className="w-4 h-4 text-[#801414]" />
            Brand Identity & Store Info
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#3D2821] mb-1">
                Brand Name
              </label>
              <input
                type="text"
                value={formData.brandName}
                onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                className="w-full bg-[#FAF7F0] border border-[#DDD4CA] focus:border-[#801414] focus:bg-white text-sm font-semibold text-[#2D1A16] px-3.5 py-2.5 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3D2821] mb-1">
                Brand Tagline
              </label>
              <input
                type="text"
                value={formData.brandTagline}
                onChange={(e) => setFormData({ ...formData, brandTagline: e.target.value })}
                className="w-full bg-[#FAF7F0] border border-[#DDD4CA] focus:border-[#801414] focus:bg-white text-sm font-semibold text-[#2D1A16] px-3.5 py-2.5 rounded-xl outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#3D2821] mb-1">
                Commercial Kitchen Address
              </label>
              <input
                type="text"
                value={formData.kitchenAddress}
                onChange={(e) => setFormData({ ...formData, kitchenAddress: e.target.value })}
                className="w-full bg-[#FAF7F0] border border-[#DDD4CA] focus:border-[#801414] focus:bg-white text-sm font-semibold text-[#2D1A16] px-3.5 py-2.5 rounded-xl outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#3D2821] mb-1">
                Kitchen Operating Hours
              </label>
              <input
                type="text"
                value={formData.kitchenHours}
                onChange={(e) => setFormData({ ...formData, kitchenHours: e.target.value })}
                className="w-full bg-[#FAF7F0] border border-[#DDD4CA] focus:border-[#801414] focus:bg-white text-sm font-semibold text-[#2D1A16] px-3.5 py-2.5 rounded-xl outline-none"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Delivery Thresholds Group */}
        <div className="bg-white p-6 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#2D1A16] font-display uppercase tracking-wider flex items-center gap-2">
            <Truck className="w-4 h-4 text-amber-600" />
            Pricing & Delivery Thresholds
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#3D2821] mb-1">
                Currency Symbol
              </label>
              <input
                type="text"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full bg-[#FAF7F0] border border-[#DDD4CA] focus:border-[#801414] focus:bg-white text-sm font-semibold text-[#2D1A16] px-3.5 py-2.5 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3D2821] mb-1">
                Standard Delivery Fee (Rs.)
              </label>
              <input
                type="number"
                value={formData.standardDeliveryFee}
                onChange={(e) => setFormData({ ...formData, standardDeliveryFee: Number(e.target.value) })}
                className="w-full bg-[#FAF7F0] border border-[#DDD4CA] focus:border-[#801414] focus:bg-white text-sm font-semibold text-[#2D1A16] px-3.5 py-2.5 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3D2821] mb-1">
                Free Delivery Order Threshold (Rs.)
              </label>
              <input
                type="number"
                value={formData.freeDeliveryThreshold}
                onChange={(e) => setFormData({ ...formData, freeDeliveryThreshold: Number(e.target.value) })}
                className="w-full bg-[#FAF7F0] border border-[#DDD4CA] focus:border-[#801414] focus:bg-white text-sm font-semibold text-[#2D1A16] px-3.5 py-2.5 rounded-xl outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8DFC8]">
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-[#801414] hover:bg-[#681010] text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Store & WhatsApp Settings</span>
          </button>
        </div>

      </form>
    </div>
  );
};
