import React, { useState } from 'react';
import { 
  Layers, 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  CheckCircle, 
  X, 
  MapPin, 
  ShieldCheck, 
  Snowflake,
  Send
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { FooterConfig, FooterQuickLink, PageView } from '../../types';

export const AdminFooter: React.FC = () => {
  const { 
    footerConfig, 
    updateFooterConfig, 
    addFooterQuickLink, 
    updateFooterQuickLink, 
    deleteFooterQuickLink,
    updateFooterDeliveryAreas
  } = useStore();

  const [formData, setFormData] = useState<FooterConfig>(footerConfig);
  const [deliveryAreasText, setDeliveryAreasText] = useState(footerConfig.deliveryAreas.join('\n'));
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [isAddingLink, setIsAddingLink] = useState(false);
  const [isEditingLink, setIsEditingLink] = useState<FooterQuickLink | null>(null);
  const [newLink, setNewLink] = useState<Omit<FooterQuickLink, 'id'>>({
    label: '',
    page: 'shop',
    isHighlighted: false
  });

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedAreas = deliveryAreasText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    updateFooterConfig({
      ...formData,
      deliveryAreas: parsedAreas
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLink.label.trim()) return;
    addFooterQuickLink(newLink);
    setIsAddingLink(false);
    setNewLink({ label: '', page: 'shop', isHighlighted: false });
  };

  const handleUpdateLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditingLink || !isEditingLink.label.trim()) return;
    updateFooterQuickLink(isEditingLink.id, isEditingLink);
    setIsEditingLink(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#E8DFC8] pb-4">
        <h2 className="text-xl font-bold text-[#2D1A16] font-display flex items-center gap-2">
          <Layers className="w-6 h-6 text-stone-600" />
          Footer & Delivery Areas Management (CRUD)
        </h2>
        <p className="text-xs text-[#735A50]">
          Manage footer brand description, Halal/Cold-chain trust badges, quick navigation links, Karachi delivery coverage areas, newsletter promo banner, and SEO copyright notes.
        </p>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span>Footer settings updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSaveGeneral} className="space-y-6">
        
        {/* Brand & Badges */}
        <div className="bg-white p-6 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#2D1A16] font-display uppercase tracking-wider">
            1. Footer Brand Copy & Trust Badges
          </h3>

          <div>
            <label className="block text-xs font-bold text-[#3D2821] mb-1">Footer Brand Mission / About Description</label>
            <textarea
              rows={3}
              value={formData.brandDescription}
              onChange={(e) => setFormData({ ...formData, brandDescription: e.target.value })}
              className="w-full bg-[#FAF7F0] border border-[#DDD4CA] focus:border-[#801414] text-xs px-3.5 py-2.5 rounded-xl outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#3D2821] mb-1">Halal Certification Badge Text</label>
              <input
                type="text"
                value={formData.halalBadgeText}
                onChange={(e) => setFormData({ ...formData, halalBadgeText: e.target.value })}
                className="w-full bg-[#FAF7F0] border border-[#DDD4CA] text-xs px-3 py-2 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3D2821] mb-1">Cold Chain Dispatch Badge Text</label>
              <input
                type="text"
                value={formData.coldChainBadgeText}
                onChange={(e) => setFormData({ ...formData, coldChainBadgeText: e.target.value })}
                className="w-full bg-[#FAF7F0] border border-[#DDD4CA] text-xs px-3 py-2 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Karachi Delivery Areas List */}
        <div className="bg-white p-6 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#2D1A16] font-display uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#801414]" />
            2. Karachi Delivery Coverage Areas (One area per line)
          </h3>

          <textarea
            rows={6}
            value={deliveryAreasText}
            onChange={(e) => setDeliveryAreasText(e.target.value)}
            placeholder="DHA Phases 1–8&#10;Clifton Blocks 1–9&#10;Gulshan-e-Iqbal&#10;PECHS / Tariq Rd"
            className="w-full bg-[#FAF7F0] border border-[#DDD4CA] text-xs px-3.5 py-2.5 rounded-xl outline-none font-mono"
          />
          <p className="text-[11px] text-[#8C7A70]">
            These areas will be rendered in the 3rd column of the website footer and link directly to delivery info.
          </p>
        </div>

        {/* Promo & SEO Texts */}
        <div className="bg-white p-6 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#2D1A16] font-display uppercase tracking-wider">
            3. Newsletter Promo & SEO Copyright
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#3D2821] mb-1">Newsletter Pitch Text</label>
              <input
                type="text"
                value={formData.newsletterPromoText}
                onChange={(e) => setFormData({ ...formData, newsletterPromoText: e.target.value })}
                className="w-full bg-[#FAF7F0] border border-[#DDD4CA] text-xs px-3 py-2 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3D2821] mb-1">Auto Welcome Coupon Code</label>
              <input
                type="text"
                value={formData.welcomeCouponCode}
                onChange={(e) => setFormData({ ...formData, welcomeCouponCode: e.target.value })}
                className="w-full bg-[#FAF7F0] border border-[#DDD4CA] text-xs px-3 py-2 rounded-xl"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#3D2821] mb-1">SEO Tagline Statement</label>
              <input
                type="text"
                value={formData.seoText}
                onChange={(e) => setFormData({ ...formData, seoText: e.target.value })}
                className="w-full bg-[#FAF7F0] border border-[#DDD4CA] text-xs px-3 py-2 rounded-xl"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#3D2821] mb-1">Copyright Line</label>
              <input
                type="text"
                value={formData.copyrightText}
                onChange={(e) => setFormData({ ...formData, copyrightText: e.target.value })}
                className="w-full bg-[#FAF7F0] border border-[#DDD4CA] text-xs px-3 py-2 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4 border-t border-[#E8DFC8]">
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-[#801414] hover:bg-[#681010] text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Footer Settings</span>
          </button>
        </div>

      </form>

      {/* Footer Quick Links CRUD */}
      <div className="bg-white p-6 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#2D1A16] font-display uppercase tracking-wider">
              4. Footer Quick Links ({footerConfig.quickLinks.length})
            </h3>
            <p className="text-xs text-[#735A50]">Add, edit, or delete links in the second column of the footer</p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddingLink(true)}
            className="inline-flex items-center gap-1.5 bg-[#801414] hover:bg-[#681010] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Footer Link</span>
          </button>
        </div>

        <div className="divide-y divide-[#E8DFC8] border border-[#E8DFC8] rounded-xl overflow-hidden">
          {footerConfig.quickLinks.map((link) => (
            <div key={link.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#FAF7F0]">
              <div>
                <span className={`text-xs font-bold ${link.isHighlighted ? 'text-amber-600' : 'text-[#2D1A16]'}`}>
                  {link.label}
                </span>
                <span className="text-[11px] text-[#8C7A70] block">Page: {link.page}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingLink(link)}
                  className="p-1.5 text-stone-600 hover:bg-[#F2EBDC] rounded-lg border border-[#DDD4CA]"
                  title="Edit link"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteFooterQuickLink(link.id)}
                  disabled={footerConfig.quickLinks.length <= 1}
                  className="p-1.5 text-red-700 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 disabled:opacity-30"
                  title="Delete link"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Footer Link Modal */}
      {isAddingLink && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E8DFC8] space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#E8DFC8] pb-3">
              <h4 className="font-bold text-base text-[#2D1A16] font-display">Add Footer Quick Link</h4>
              <button onClick={() => setIsAddingLink(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddLink} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#3D2821] mb-1">Link Title *</label>
                <input
                  type="text"
                  required
                  value={newLink.label}
                  onChange={(e) => setNewLink({ ...newLink, label: e.target.value })}
                  placeholder="e.g. 3-Min Frying Guide"
                  className="w-full bg-[#FAF7F0] border border-[#DDD4CA] text-xs font-semibold px-3 py-2 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3D2821] mb-1">Target Page *</label>
                <select
                  value={newLink.page}
                  onChange={(e) => setNewLink({ ...newLink, page: e.target.value as PageView })}
                  className="w-full bg-[#FAF7F0] border border-[#DDD4CA] text-xs font-semibold px-3 py-2 rounded-xl"
                >
                  <option value="home">Home</option>
                  <option value="shop">Shop All / Menu</option>
                  <option value="deals">Family Deals</option>
                  <option value="delivery">Delivery Areas</option>
                  <option value="about">About Our Kitchen</option>
                </select>
              </div>

              <label className="flex items-center gap-2 text-xs font-bold text-[#2D1A16] cursor-pointer">
                <input
                  type="checkbox"
                  checked={newLink.isHighlighted}
                  onChange={(e) => setNewLink({ ...newLink, isHighlighted: e.target.checked })}
                  className="accent-[#801414]"
                />
                <span>Highlight in Amber text (e.g. Deals)</span>
              </label>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E8DFC8]">
                <button
                  type="button"
                  onClick={() => setIsAddingLink(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#801414] hover:bg-[#681010] text-white text-xs font-bold shadow-md"
                >
                  Save Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Footer Link Modal */}
      {isEditingLink && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E8DFC8] space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#E8DFC8] pb-3">
              <h4 className="font-bold text-base text-[#2D1A16] font-display">Edit Footer Quick Link</h4>
              <button onClick={() => setIsEditingLink(null)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateLink} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#3D2821] mb-1">Link Title *</label>
                <input
                  type="text"
                  required
                  value={isEditingLink.label}
                  onChange={(e) => setIsEditingLink({ ...isEditingLink, label: e.target.value })}
                  className="w-full bg-[#FAF7F0] border border-[#DDD4CA] text-xs font-semibold px-3 py-2 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3D2821] mb-1">Target Page *</label>
                <select
                  value={isEditingLink.page}
                  onChange={(e) => setIsEditingLink({ ...isEditingLink, page: e.target.value as PageView })}
                  className="w-full bg-[#FAF7F0] border border-[#DDD4CA] text-xs font-semibold px-3 py-2 rounded-xl"
                >
                  <option value="home">Home</option>
                  <option value="shop">Shop All / Menu</option>
                  <option value="deals">Family Deals</option>
                  <option value="delivery">Delivery Areas</option>
                  <option value="about">About Our Kitchen</option>
                </select>
              </div>

              <label className="flex items-center gap-2 text-xs font-bold text-[#2D1A16] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isEditingLink.isHighlighted}
                  onChange={(e) => setIsEditingLink({ ...isEditingLink, isHighlighted: e.target.checked })}
                  className="accent-[#801414]"
                />
                <span>Highlight in Amber text</span>
              </label>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E8DFC8]">
                <button
                  type="button"
                  onClick={() => setIsEditingLink(null)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#801414] hover:bg-[#681010] text-white text-xs font-bold shadow-md"
                >
                  Update Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
