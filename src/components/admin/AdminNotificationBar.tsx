import React, { useState } from 'react';
import { 
  Bell, 
  Eye, 
  Save, 
  CheckCircle, 
  ChefHat, 
  PhoneCall, 
  ToggleLeft, 
  ToggleRight 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { NotificationBarConfig } from '../../types';

export const AdminNotificationBar: React.FC = () => {
  const { notificationBar, updateNotificationBar, siteSettings } = useStore();
  const [formData, setFormData] = useState<NotificationBarConfig>(notificationBar);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateNotificationBar(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#E8DFC8] pb-4">
        <h2 className="text-xl font-bold text-[#2D1A16] font-display flex items-center gap-2">
          <Bell className="w-6 h-6 text-amber-600" />
          Top Notification & Announcement Ribbon (CRUD)
        </h2>
        <p className="text-xs text-[#735A50]">
          Manage the top announcement header that displays delivery promotions, free shipping thresholds, phone hotlines, and recipe links.
        </p>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span>Notification bar settings saved successfully!</span>
        </div>
      )}

      {/* Live Preview Box */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#8C7A70] uppercase tracking-wider">
          <Eye className="w-4 h-4 text-[#801414]" />
          <span>Live Real-Time Header Preview</span>
        </div>

        <div className="border-2 border-dashed border-[#DDD4CA] rounded-2xl p-3 bg-[#FAF7F0] overflow-hidden">
          {formData.enabled ? (
            <div className="bg-[#801414] text-[#FDFBF7] text-xs py-2 px-4 rounded-xl shadow-xs">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
                  {formData.badgeText && (
                    <span className="bg-[#E69500] text-[#2D1A16] text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider">
                      {formData.badgeText}
                    </span>
                  )}
                  <span className="font-medium text-[11px] sm:text-xs">
                    {formData.mainText || 'Announcement text goes here...'}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[11px] font-medium shrink-0">
                  {formData.showCookingGuide && (
                    <span className="flex items-center gap-1 text-amber-300">
                      <ChefHat className="w-3.5 h-3.5" />
                      <span>3-Min Frying Guide</span>
                    </span>
                  )}
                  {formData.showPhoneCall && (
                    <span className="flex items-center gap-1 text-stone-200">
                      <PhoneCall className="w-3 h-3 text-amber-300" />
                      <span>{siteSettings.phoneHotline}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-stone-100 text-stone-500 py-3 text-center text-xs font-semibold rounded-xl">
              Notification Bar is currently DISABLED / HIDDEN
            </div>
          )}
        </div>
      </div>

      {/* Configuration Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-5">
        
        {/* Toggle Enabled */}
        <div className="flex items-center justify-between p-4 bg-[#FAF7F0] rounded-xl border border-[#E8DFC8]">
          <div>
            <div className="text-sm font-bold text-[#2D1A16]">Enable Announcement Ribbon</div>
            <div className="text-xs text-[#735A50]">Show or hide the top notification bar across the entire website</div>
          </div>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, enabled: !formData.enabled })}
            className={`cursor-pointer transition-colors ${formData.enabled ? 'text-emerald-600' : 'text-stone-400'}`}
          >
            {formData.enabled ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10" />}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#3D2821] mb-1">
              Badge Label Text (Pill tag)
            </label>
            <input
              type="text"
              value={formData.badgeText}
              onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
              placeholder="e.g. Karachi Delivery, Flash Offer, Ramadan Special"
              className="w-full bg-[#FAF7F0] border border-[#DDD4CA] focus:border-[#801414] focus:bg-white text-sm font-medium text-[#2D1A16] px-3.5 py-2.5 rounded-xl outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3D2821] mb-1">
              Mobile Short Text
            </label>
            <input
              type="text"
              value={formData.mobileText}
              onChange={(e) => setFormData({ ...formData, mobileText: e.target.value })}
              placeholder="Short text for small screens"
              className="w-full bg-[#FAF7F0] border border-[#DDD4CA] focus:border-[#801414] focus:bg-white text-sm font-medium text-[#2D1A16] px-3.5 py-2.5 rounded-xl outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-[#3D2821] mb-1">
              Main Desktop Announcement Message
            </label>
            <input
              type="text"
              value={formData.mainText}
              onChange={(e) => setFormData({ ...formData, mainText: e.target.value })}
              placeholder="e.g. ❄️ Same-Day Cold Chain Delivery • 🚚 FREE Shipping over Rs. 2,000"
              className="w-full bg-[#FAF7F0] border border-[#DDD4CA] focus:border-[#801414] focus:bg-white text-sm font-medium text-[#2D1A16] px-3.5 py-2.5 rounded-xl outline-none"
            />
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="pt-3 border-t border-[#E8DFC8] grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex items-center gap-3 p-3 bg-[#FAF7F0] rounded-xl border border-[#E8DFC8] cursor-pointer">
            <input
              type="checkbox"
              checked={formData.showCookingGuide}
              onChange={(e) => setFormData({ ...formData, showCookingGuide: e.target.checked })}
              className="w-4 h-4 text-[#801414] rounded-md accent-[#801414]"
            />
            <div>
              <span className="text-xs font-bold text-[#2D1A16] block">Show 3-Min Frying Guide Button</span>
              <span className="text-[10px] text-[#735A50]">Allows customers to quickly open modal guide</span>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 bg-[#FAF7F0] rounded-xl border border-[#E8DFC8] cursor-pointer">
            <input
              type="checkbox"
              checked={formData.showPhoneCall}
              onChange={(e) => setFormData({ ...formData, showPhoneCall: e.target.checked })}
              className="w-4 h-4 text-[#801414] rounded-md accent-[#801414]"
            />
            <div>
              <span className="text-xs font-bold text-[#2D1A16] block">Show Phone Hotline Link</span>
              <span className="text-[10px] text-[#735A50]">Direct clickable tel: link for mobile shoppers</span>
            </div>
          </label>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4 border-t border-[#E8DFC8]">
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-[#801414] hover:bg-[#681010] text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Notification Bar Changes</span>
          </button>
        </div>

      </form>
    </div>
  );
};
