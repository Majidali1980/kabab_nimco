import React, { useState } from 'react';
import { 
  Sparkles, 
  Save, 
  CheckCircle, 
  ToggleLeft, 
  ToggleRight, 
  Package, 
  Check 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { TopSellingSectionConfig } from '../../types';

export const AdminTopSelling: React.FC = () => {
  const { topSellingConfig, updateTopSellingConfig, products } = useStore();
  const [formData, setFormData] = useState<TopSellingSectionConfig>(topSellingConfig);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateTopSellingConfig(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const toggleProductSelection = (productId: string) => {
    const exists = formData.customProductIds.includes(productId);
    const newIds = exists
      ? formData.customProductIds.filter(id => id !== productId)
      : [...formData.customProductIds, productId];
    setFormData({ ...formData, customProductIds: newIds });
  };

  const handleSelectAllBestsellers = () => {
    const bestsellerIds = products.filter(p => p.isBestseller).map(p => p.id);
    setFormData({ ...formData, customProductIds: bestsellerIds });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#E8DFC8] pb-4">
        <h2 className="text-xl font-bold text-[#2D1A16] font-display flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-600" />
          "Top Selling Frozen Kababs & Snacks" Section (CRUD)
        </h2>
        <p className="text-xs text-[#735A50]">
          Customize the featured bestsellers showcase on the homepage, section headings, custom product selection, and CTA links.
        </p>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span>Top Selling section settings saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Toggle Section Active */}
        <div className="bg-white p-6 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#FAF7F0] rounded-xl border border-[#E8DFC8]">
            <div>
              <div className="text-sm font-bold text-[#2D1A16]">Enable Section on Homepage</div>
              <div className="text-xs text-[#735A50]">Toggle visibility of the "Top Selling Frozen Kababs & Snacks" section</div>
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
              <label className="block text-xs font-bold text-[#3D2821] mb-1">Section Badge Pill</label>
              <input
                type="text"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                placeholder="e.g. Customer Favorites"
                className="w-full bg-[#FAF7F0] border border-[#DDD4CA] focus:border-[#801414] text-xs font-semibold px-3 py-2.5 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3D2821] mb-1">Bottom CTA Button Text</label>
              <input
                type="text"
                value={formData.ctaText}
                onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                placeholder="e.g. Explore All Kabab & Nimko Varieties"
                className="w-full bg-[#FAF7F0] border border-[#DDD4CA] focus:border-[#801414] text-xs font-semibold px-3 py-2.5 rounded-xl outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#3D2821] mb-1">Main Section Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Top Selling Frozen Kababs & Snacks"
                className="w-full bg-[#FAF7F0] border border-[#DDD4CA] focus:border-[#801414] text-sm font-bold px-3.5 py-2.5 rounded-xl outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#3D2821] mb-1">Section Subtitle / Description</label>
              <textarea
                rows={2}
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="e.g. Ordered most frequently across Karachi for dinners, bun kababs, and tea-time crunch."
                className="w-full bg-[#FAF7F0] border border-[#DDD4CA] focus:border-[#801414] text-xs px-3 py-2 rounded-xl outline-none"
              />
            </div>
          </div>
        </div>

        {/* Product Selection Manager */}
        <div className="bg-white p-6 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-[#2D1A16] font-display uppercase tracking-wider">
                Select Featured Products ({formData.customProductIds.length > 0 ? formData.customProductIds.length : 'Auto Bestsellers'})
              </h3>
              <p className="text-xs text-[#735A50]">
                Choose specifically which items appear in this section. If none selected, the app automatically shows marked bestsellers.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSelectAllBestsellers}
                className="text-xs font-bold bg-[#FAF0DC] text-[#801414] hover:bg-[#F2E4C4] px-3 py-1.5 rounded-xl border border-[#EAD5AB] cursor-pointer"
              >
                Select Marked Bestsellers
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, customProductIds: [] })}
                className="text-xs font-bold text-stone-600 hover:text-stone-900 px-3 py-1.5 rounded-xl border border-stone-300 hover:bg-stone-50 cursor-pointer"
              >
                Clear / Auto Mode
              </button>
            </div>
          </div>

          {/* Selection Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
            {products.map((prod) => {
              const isSelected = formData.customProductIds.includes(prod.id);
              return (
                <div
                  key={prod.id}
                  onClick={() => toggleProductSelection(prod.id)}
                  className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-50/80 border-amber-500 shadow-xs'
                      : 'bg-[#FAF7F0] border-[#E8DFC8] hover:border-amber-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                    isSelected ? 'bg-amber-600 border-amber-600 text-white' : 'bg-white border-stone-300'
                  }`}>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>

                  <img 
                    src={prod.image} 
                    alt={prod.name} 
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-lg object-cover border border-stone-200 shrink-0" 
                  />

                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-xs text-[#2D1A16] truncate">{prod.name}</div>
                    <div className="text-[10px] text-[#8C7A70] capitalize">
                      {prod.category} • Rs. {prod.packOptions[0]?.price}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4 border-t border-[#E8DFC8]">
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-[#801414] hover:bg-[#681010] text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Section Settings</span>
          </button>
        </div>

      </form>
    </div>
  );
};
