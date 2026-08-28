import React, { useState } from 'react';
import { 
  Layers, 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  CheckCircle, 
  X, 
  Sparkles, 
  Flame, 
  MapPin, 
  ShoppingBag, 
  Info, 
  ChefHat, 
  Home,
  Eye,
  EyeOff
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { NavbarConfig, NavLinkConfig, PageView } from '../../types';

export const AdminNavbar: React.FC = () => {
  const { navbarConfig, updateNavbarConfig, addNavLink, updateNavLink, deleteNavLink } = useStore();
  
  const [brandForm, setBrandForm] = useState({
    brandPrefix: navbarConfig.brandPrefix,
    brandSuffix: navbarConfig.brandSuffix,
    subtext: navbarConfig.subtext,
    estYear: navbarConfig.estYear,
    showSearch: navbarConfig.showSearch,
    showCookingGuide: navbarConfig.showCookingGuide,
    showCart: navbarConfig.showCart
  });

  const [isEditingLink, setIsEditingLink] = useState<NavLinkConfig | null>(null);
  const [isAddingLink, setIsAddingLink] = useState(false);

  const [linkForm, setLinkForm] = useState<Omit<NavLinkConfig, 'id'>>({
    label: '',
    page: 'shop',
    badge: '',
    iconName: 'shopping-bag',
    isEnabled: true
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveBrand = (e: React.FormEvent) => {
    e.preventDefault();
    updateNavbarConfig(brandForm);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSaveNewLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkForm.label.trim()) return;
    addNavLink(linkForm);
    setIsAddingLink(false);
    setLinkForm({
      label: '',
      page: 'shop',
      badge: '',
      iconName: 'shopping-bag',
      isEnabled: true
    });
  };

  const handleSaveEditLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditingLink || !isEditingLink.label.trim()) return;
    updateNavLink(isEditingLink.id, isEditingLink);
    setIsEditingLink(null);
  };

  const getIconPreview = (iconName?: string) => {
    switch (iconName) {
      case 'home': return <Home className="w-3.5 h-3.5 inline text-amber-500" />;
      case 'flame': return <Flame className="w-3.5 h-3.5 inline text-amber-500 fill-amber-500" />;
      case 'map-pin': return <MapPin className="w-3.5 h-3.5 inline text-amber-500" />;
      case 'info': return <Info className="w-3.5 h-3.5 inline text-amber-500" />;
      case 'chef-hat': return <ChefHat className="w-3.5 h-3.5 inline text-amber-500" />;
      default: return <ShoppingBag className="w-3.5 h-3.5 inline text-amber-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#E8DFC8] pb-4">
        <h2 className="text-xl font-bold text-[#2D1A16] font-display flex items-center gap-2">
          <Layers className="w-6 h-6 text-purple-600" />
          Navbar & Navigation Links (CRUD)
        </h2>
        <p className="text-xs text-[#735A50]">
          Add, edit, remove, and manage navigation menu links, badges (e.g. "HOT DEAL", "SAVE 20%"), brand titles, and quick action icons.
        </p>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span>Navbar settings updated successfully!</span>
        </div>
      )}

      {/* Brand & Logo Text Settings */}
      <form onSubmit={handleSaveBrand} className="bg-white p-6 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[#2D1A16] font-display uppercase tracking-wider">
          1. Brand Title & Header Controls
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#3D2821] mb-1">Brand Main Prefix</label>
            <input
              type="text"
              value={brandForm.brandPrefix}
              onChange={(e) => setBrandForm({ ...brandForm, brandPrefix: e.target.value })}
              className="w-full bg-[#FAF7F0] border border-[#DDD4CA] focus:border-[#801414] focus:bg-white text-xs font-semibold px-3 py-2.5 rounded-xl outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3D2821] mb-1">Brand Accent Suffix</label>
            <input
              type="text"
              value={brandForm.brandSuffix}
              onChange={(e) => setBrandForm({ ...brandForm, brandSuffix: e.target.value })}
              className="w-full bg-[#FAF7F0] border border-[#DDD4CA] focus:border-[#801414] focus:bg-white text-xs font-semibold px-3 py-2.5 rounded-xl outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3D2821] mb-1">Tagline Subtext</label>
            <input
              type="text"
              value={brandForm.subtext}
              onChange={(e) => setBrandForm({ ...brandForm, subtext: e.target.value })}
              className="w-full bg-[#FAF7F0] border border-[#DDD4CA] focus:border-[#801414] focus:bg-white text-xs font-semibold px-3 py-2.5 rounded-xl outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3D2821] mb-1">Established Badge</label>
            <input
              type="text"
              value={brandForm.estYear}
              onChange={(e) => setBrandForm({ ...brandForm, estYear: e.target.value })}
              className="w-full bg-[#FAF7F0] border border-[#DDD4CA] focus:border-[#801414] focus:bg-white text-xs font-semibold px-3 py-2.5 rounded-xl outline-none"
            />
          </div>
        </div>

        <div className="pt-2 flex flex-wrap gap-4 items-center justify-between border-t border-[#F2EBDC]">
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-xs font-semibold text-[#2D1A16] cursor-pointer">
              <input
                type="checkbox"
                checked={brandForm.showSearch}
                onChange={(e) => setBrandForm({ ...brandForm, showSearch: e.target.checked })}
                className="w-4 h-4 text-[#801414] rounded-md accent-[#801414]"
              />
              <span>Enable Search Bar</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-semibold text-[#2D1A16] cursor-pointer">
              <input
                type="checkbox"
                checked={brandForm.showCookingGuide}
                onChange={(e) => setBrandForm({ ...brandForm, showCookingGuide: e.target.checked })}
                className="w-4 h-4 text-[#801414] rounded-md accent-[#801414]"
              />
              <span>Show Frying Guide Button</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-semibold text-[#2D1A16] cursor-pointer">
              <input
                type="checkbox"
                checked={brandForm.showCart}
                onChange={(e) => setBrandForm({ ...brandForm, showCart: e.target.checked })}
                className="w-4 h-4 text-[#801414] rounded-md accent-[#801414]"
              />
              <span>Show Cart Trigger Button</span>
            </label>
          </div>

          <button
            type="submit"
            className="bg-[#801414] hover:bg-[#681010] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs"
          >
            Save Header Brand Info
          </button>
        </div>
      </form>

      {/* Navigation Links CRUD Table */}
      <div className="bg-white p-6 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#2D1A16] font-display uppercase tracking-wider">
              2. Navigation Menu Links ({navbarConfig.links.length})
            </h3>
            <p className="text-xs text-[#735A50]">Add and edit links shown in the top navigation bar</p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddingLink(true)}
            className="inline-flex items-center gap-1.5 bg-[#801414] hover:bg-[#681010] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Nav Link</span>
          </button>
        </div>

        {/* Links List */}
        <div className="divide-y divide-[#E8DFC8] border border-[#E8DFC8] rounded-xl overflow-hidden">
          {navbarConfig.links.map((link) => (
            <div key={link.id} className="p-3.5 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAF7F0]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#FAF0DC] text-[#801414] flex items-center justify-center border border-[#EAD5AB]">
                  {getIconPreview(link.iconName)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#2D1A16]">{link.label}</span>
                    {link.badge && (
                      <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-md">
                        {link.badge}
                      </span>
                    )}
                    {!link.isEnabled && (
                      <span className="bg-stone-200 text-stone-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Hidden
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-[#8C7A70]">
                    Target Page: <code className="bg-[#F2EBDC] text-[#801414] px-1.5 py-0.5 rounded text-[11px] font-semibold">{link.page}</code>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => updateNavLink(link.id, { isEnabled: !link.isEnabled })}
                  className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 cursor-pointer ${
                    link.isEnabled
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200'
                  }`}
                  title={link.isEnabled ? 'Hide link' : 'Show link'}
                >
                  {link.isEnabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span className="text-[11px] font-bold">{link.isEnabled ? 'Active' : 'Hidden'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditingLink(link)}
                  className="p-1.5 bg-[#FAF7F0] hover:bg-[#F2EBDC] border border-[#DDD4CA] text-[#4A352F] rounded-lg transition-colors cursor-pointer"
                  title="Edit link"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => deleteNavLink(link.id)}
                  className="p-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded-lg transition-colors cursor-pointer"
                  title="Delete link"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Link Modal */}
      {isAddingLink && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E8DFC8] space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#E8DFC8] pb-3">
              <h4 className="font-bold text-base text-[#2D1A16] font-display">Add New Navigation Link</h4>
              <button onClick={() => setIsAddingLink(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewLink} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#3D2821] mb-1">Link Label *</label>
                <input
                  type="text"
                  required
                  value={linkForm.label}
                  onChange={(e) => setLinkForm({ ...linkForm, label: e.target.value })}
                  placeholder="e.g. Hot Deals, Frozen Kababs, About"
                  className="w-full bg-[#FAF7F0] border border-[#DDD4CA] focus:border-[#801414] text-xs font-semibold px-3 py-2 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3D2821] mb-1">Target Page *</label>
                <select
                  value={linkForm.page}
                  onChange={(e) => setLinkForm({ ...linkForm, page: e.target.value as PageView })}
                  className="w-full bg-[#FAF7F0] border border-[#DDD4CA] focus:border-[#801414] text-xs font-semibold px-3 py-2 rounded-xl outline-none"
                >
                  <option value="home">Home (home)</option>
                  <option value="shop">Shop / Menu (shop)</option>
                  <option value="deals">Hot Deals (deals)</option>
                  <option value="delivery">Delivery Areas (delivery)</option>
                  <option value="about">About Us (about)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3D2821] mb-1">Badge Tag (Optional)</label>
                <input
                  type="text"
                  value={linkForm.badge || ''}
                  onChange={(e) => setLinkForm({ ...linkForm, badge: e.target.value })}
                  placeholder="e.g. NEW, 20% OFF, HOT"
                  className="w-full bg-[#FAF7F0] border border-[#DDD4CA] focus:border-[#801414] text-xs font-semibold px-3 py-2 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3D2821] mb-1">Icon Style</label>
                <select
                  value={linkForm.iconName || 'shopping-bag'}
                  onChange={(e) => setLinkForm({ ...linkForm, iconName: e.target.value as any })}
                  className="w-full bg-[#FAF7F0] border border-[#DDD4CA] focus:border-[#801414] text-xs font-semibold px-3 py-2 rounded-xl outline-none"
                >
                  <option value="shopping-bag">Shopping Bag</option>
                  <option value="flame">Flame / Fire</option>
                  <option value="home">Home</option>
                  <option value="map-pin">Map Pin</option>
                  <option value="info">Info</option>
                  <option value="chef-hat">Chef Hat</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E8DFC8]">
                <button
                  type="button"
                  onClick={() => setIsAddingLink(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-600 hover:bg-stone-100"
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

      {/* Edit Link Modal */}
      {isEditingLink && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E8DFC8] space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#E8DFC8] pb-3">
              <h4 className="font-bold text-base text-[#2D1A16] font-display">Edit Navigation Link</h4>
              <button onClick={() => setIsEditingLink(null)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditLink} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#3D2821] mb-1">Link Label *</label>
                <input
                  type="text"
                  required
                  value={isEditingLink.label}
                  onChange={(e) => setIsEditingLink({ ...isEditingLink, label: e.target.value })}
                  className="w-full bg-[#FAF7F0] border border-[#DDD4CA] focus:border-[#801414] text-xs font-semibold px-3 py-2 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3D2821] mb-1">Target Page *</label>
                <select
                  value={isEditingLink.page}
                  onChange={(e) => setIsEditingLink({ ...isEditingLink, page: e.target.value as PageView })}
                  className="w-full bg-[#FAF7F0] border border-[#DDD4CA] focus:border-[#801414] text-xs font-semibold px-3 py-2 rounded-xl outline-none"
                >
                  <option value="home">Home (home)</option>
                  <option value="shop">Shop / Menu (shop)</option>
                  <option value="deals">Hot Deals (deals)</option>
                  <option value="delivery">Delivery Areas (delivery)</option>
                  <option value="about">About Us (about)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3D2821] mb-1">Badge Tag</label>
                <input
                  type="text"
                  value={isEditingLink.badge || ''}
                  onChange={(e) => setIsEditingLink({ ...isEditingLink, badge: e.target.value })}
                  className="w-full bg-[#FAF7F0] border border-[#DDD4CA] focus:border-[#801414] text-xs font-semibold px-3 py-2 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3D2821] mb-1">Icon Style</label>
                <select
                  value={isEditingLink.iconName || 'shopping-bag'}
                  onChange={(e) => setIsEditingLink({ ...isEditingLink, iconName: e.target.value as any })}
                  className="w-full bg-[#FAF7F0] border border-[#DDD4CA] focus:border-[#801414] text-xs font-semibold px-3 py-2 rounded-xl outline-none"
                >
                  <option value="shopping-bag">Shopping Bag</option>
                  <option value="flame">Flame / Fire</option>
                  <option value="home">Home</option>
                  <option value="map-pin">Map Pin</option>
                  <option value="info">Info</option>
                  <option value="chef-hat">Chef Hat</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E8DFC8]">
                <button
                  type="button"
                  onClick={() => setIsEditingLink(null)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-600 hover:bg-stone-100"
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
