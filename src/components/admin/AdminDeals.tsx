import React, { useState } from 'react';
import { 
  Flame, 
  Plus, 
  Trash2, 
  Edit2, 
  CheckCircle, 
  X, 
  Tag, 
  Sparkles, 
  Clock, 
  Users 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Deal } from '../../types';
import { SAMPLE_IMAGE_PRESETS } from '../../data/defaultConfig';
import { ImageUploader } from '../common/ImageUploader';

export const AdminDeals: React.FC = () => {
  const { deals, addDeal, updateDeal, deleteDeal } = useStore();
  const [isAddingDeal, setIsAddingDeal] = useState(false);
  const [isEditingDeal, setIsEditingDeal] = useState<Deal | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const defaultDealForm: Omit<Deal, 'id'> = {
    title: 'Family Feast Combo Deal',
    slug: 'family-feast-combo-deal',
    tagline: 'Stock your freezer with 24 Kababs + 500g Nimko + Free Chutney',
    badge: '20% OFF',
    urgencyText: 'Limited Stock • Today Only',
    originalPrice: 2950,
    discountedPrice: 2350,
    savings: 600,
    image: SAMPLE_IMAGE_PRESETS[4].url,
    itemsIncluded: [
      '12 Pcs Frozen Chicken Seekh Kababs (500g)',
      '12 Pcs Gourmet Beef Seekh Kababs (500g)',
      '500g Royal Karachi Mix Nimko Pouch',
      'Free 200g Artisanal Imli-Mint Chutney Jar'
    ],
    servings: '6–8 Persons',
    expiryHoursLeft: 8,
    description: 'Our most sought-after deal for families. Get restaurant-quality charcoal smoked chicken and beef kababs with crunchy Karachi nimko snacks at an unbeatable price.'
  };

  const [formData, setFormData] = useState<Omit<Deal, 'id'>>(defaultDealForm);
  const [itemsIncludedText, setItemsIncludedText] = useState(defaultDealForm.itemsIncluded.join('\n'));

  const handleOpenAdd = () => {
    setFormData(defaultDealForm);
    setItemsIncludedText(defaultDealForm.itemsIncluded.join('\n'));
    setIsAddingDeal(true);
  };

  const handleOpenEdit = (deal: Deal) => {
    setIsEditingDeal(deal);
    setFormData(deal);
    setItemsIncludedText(deal.itemsIncluded.join('\n'));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const parsedItems = itemsIncludedText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const calculatedSavings = Math.max(0, formData.originalPrice - formData.discountedPrice);

    if (isEditingDeal) {
      updateDeal(isEditingDeal.id, {
        ...formData,
        savings: calculatedSavings,
        itemsIncluded: parsedItems
      });
      setIsEditingDeal(null);
    } else {
      addDeal({
        ...formData,
        savings: calculatedSavings,
        itemsIncluded: parsedItems
      });
      setIsAddingDeal(false);
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DFC8] pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#2D1A16] font-display flex items-center gap-2">
            <Flame className="w-6 h-6 text-amber-600 fill-amber-600" />
            Deals & Family Combo Packs (CRUD)
          </h2>
          <p className="text-xs text-[#735A50]">
            Create combo bundles, multi-pack discounted deals, free gift offers, items included checklists, and savings calculators.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 bg-[#801414] hover:bg-[#681010] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Combo Deal</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span>Deal bundle saved successfully! Updated across the homepage Deals section and Deals page.</span>
        </div>
      )}

      {/* Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deals.map((deal) => (
          <div 
            key={deal.id}
            className="bg-white rounded-2xl border border-[#E8DFC8] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Image & Badges */}
              <div className="relative h-44 w-full bg-stone-900 overflow-hidden">
                <img
                  src={deal.image}
                  alt={deal.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-[#801414] text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-md">
                  {deal.badge}
                </div>
                {deal.urgencyText && (
                  <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-xs text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-md">
                    {deal.urgencyText}
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-base text-[#2D1A16] font-display">
                    {deal.title}
                  </h4>
                </div>

                <p className="text-xs text-[#735A50] line-clamp-2">
                  {deal.tagline}
                </p>

                {/* Price Display */}
                <div className="bg-[#FAF7F0] p-3 rounded-xl border border-[#E8DFC8] flex items-baseline justify-between">
                  <div>
                    <span className="text-lg font-extrabold text-[#801414]">Rs. {deal.discountedPrice}</span>
                    <span className="text-xs text-[#8C7A70] line-through ml-2">Rs. {deal.originalPrice}</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                    Save Rs. {deal.savings}
                  </span>
                </div>

                {/* Items Included List */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-bold text-[#8C7A70] uppercase">Items Included:</span>
                  <ul className="text-xs text-[#4A352F] space-y-1">
                    {deal.itemsIncluded.map((item, i) => (
                      <li key={i} className="flex items-center gap-1.5 text-[11px]">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span className="truncate">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Action footer */}
            <div className="p-4 bg-[#FFFDF9] border-t border-[#E8DFC8] flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#8C7A70] flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-amber-600" />
                {deal.servings}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(deal)}
                  className="p-1.5 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors"
                  title="Edit deal"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => deleteDeal(deal.id)}
                  disabled={deals.length <= 1}
                  className="p-1.5 text-red-700 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors disabled:opacity-30"
                  title="Delete deal"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Deal Modal */}
      {(isAddingDeal || isEditingDeal) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#E8DFC8] space-y-6 animate-in zoom-in-95 my-6 max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-[#E8DFC8] pb-4">
              <h3 className="font-bold text-lg text-[#2D1A16] font-display">
                {isAddingDeal ? 'Add New Combo Pack Deal' : `Edit Deal: ${isEditingDeal?.title}`}
              </h3>
              <button 
                onClick={() => { setIsAddingDeal(false); setIsEditingDeal(null); }}
                className="text-stone-400 hover:text-stone-600 p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#3D2821] mb-1">Deal Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Mega Family Feast Bundle"
                    className="w-full bg-[#FAF7F0] border border-[#DDD4CA] text-xs font-semibold px-3 py-2 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3D2821] mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g. 20% OFF, FREE GIFT, BUY 2 GET 1"
                    className="w-full bg-[#FAF7F0] border border-[#DDD4CA] text-xs font-semibold px-3 py-2 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3D2821] mb-1">Tagline / Short Pitch</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. Stock your freezer with 24 Kababs + 500g Nimko + Free Chutney"
                  className="w-full bg-[#FAF7F0] border border-[#DDD4CA] text-xs font-semibold px-3 py-2 rounded-xl outline-none"
                />
              </div>

              {/* Pricing & Servings */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#FAF7F0] p-4 rounded-2xl border border-[#E8DFC8]">
                <div>
                  <label className="block text-xs font-bold text-[#3D2821] mb-1">Original Price (Rs.)</label>
                  <input
                    type="number"
                    required
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full bg-white border border-[#DDD4CA] text-xs font-semibold px-3 py-2 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3D2821] mb-1">Discounted Price (Rs.)</label>
                  <input
                    type="number"
                    required
                    value={formData.discountedPrice}
                    onChange={(e) => setFormData({ ...formData, discountedPrice: Number(e.target.value) })}
                    className="w-full bg-white border border-[#DDD4CA] text-xs font-bold text-[#801414] px-3 py-2 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3D2821] mb-1">Servings Count</label>
                  <input
                    type="text"
                    value={formData.servings}
                    onChange={(e) => setFormData({ ...formData, servings: e.target.value })}
                    placeholder="e.g. 5–6 Persons"
                    className="w-full bg-white border border-[#DDD4CA] text-xs font-semibold px-3 py-2 rounded-xl outline-none"
                  />
                </div>
              </div>

              {/* Items Included List (One per line) */}
              <div>
                <label className="block text-xs font-bold text-[#3D2821] mb-1">
                  Items Included in Combo (One per line) *
                </label>
                <textarea
                  rows={4}
                  required
                  value={itemsIncludedText}
                  onChange={(e) => setItemsIncludedText(e.target.value)}
                  placeholder="12 Pcs Chicken Seekh Kababs&#10;12 Pcs Beef Seekh Kababs&#10;500g Mix Nimko Pouch&#10;Free Mint Chutney Jar"
                  className="w-full bg-[#FAF7F0] border border-[#DDD4CA] text-xs px-3 py-2 rounded-xl outline-none font-mono"
                />
              </div>

              {/* Image Uploader Component with Specified Dimensions & Thumbnails */}
              <ImageUploader
                label="Combo Deal Promotional Banner"
                value={formData.image}
                onChange={(newUrl) => setFormData({ ...formData, image: newUrl })}
                recommendedWidth={800}
                recommendedHeight={600}
                aspectRatioLabel="4:3 Classic"
                maxSizeMB={2}
                helpText="Promotional banner for the deal spotlight card. Recommended: 800 × 600 px (Max 2MB)."
              />

              {/* Submit */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#E8DFC8]">
                <button
                  type="button"
                  onClick={() => { setIsAddingDeal(false); setIsEditingDeal(null); }}
                  className="px-5 py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#801414] hover:bg-[#681010] text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  {isAddingDeal ? 'Create Combo Deal' : 'Save Changes'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
