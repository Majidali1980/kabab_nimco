import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Trash2, 
  Edit2, 
  Search, 
  Sparkles, 
  Star, 
  CheckCircle, 
  X, 
  Flame, 
  Tag, 
  Copy,
  Layers,
  Scale,
  Check
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product, PackOption, Category, SpiceLevel } from '../../types';
import { SAMPLE_IMAGE_PRESETS } from '../../data/defaultConfig';
import { ImageUploader } from '../common/ImageUploader';

export const AdminProducts: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, toggleProductBestseller } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState<Product | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form State for Adding / Editing Product
  const defaultNewProduct: Omit<Product, 'id'> = {
    name: '',
    urduName: '',
    slug: '',
    category: 'chicken',
    tagline: '',
    description: '',
    status: 'published',
    image: SAMPLE_IMAGE_PRESETS[1].url,
    galleryImages: [SAMPLE_IMAGE_PRESETS[1].url],
    packOptions: [
      { size: 'Half Dozen (6 Pcs)', weightGrams: 250, pieces: 6, price: 550, originalPrice: 620, costPrice: 310 },
      { size: '1 Dozen (12 Pcs)', weightGrams: 500, pieces: 12, price: 980, originalPrice: 1150, costPrice: 540, isPopular: true },
      { size: '2 Dozen (24 Pcs Value Pack)', weightGrams: 1000, pieces: 24, price: 1850, originalPrice: 2200, costPrice: 1020 }
    ],
    defaultPackIndex: 1,
    rating: 5.0,
    reviewCount: 120,
    spiceLevel: 'Medium',
    isBestseller: false,
    isNew: false,
    badge: 'Rs. 980 / Dozen',
    ingredients: [
      '100% Halal Prime Meat Mince',
      'Fresh Ginger & Garlic Paste',
      'Crushed Green Chilies & Fresh Mint',
      'Roasted Cumin & Coriander Seeds',
      'Pure Spices & Natural Salt'
    ],
    storageInfo: 'Keep frozen at -18°C. Do not thaw before frying.',
    shelfLife: '6 Months in deep freezer.',
    cookingInstructions: [
      {
        method: 'Pan Fry',
        time: '3–4 Mins',
        temperature: 'Medium Heat',
        steps: [
          'Heat 2 tbsp oil in pan over medium heat.',
          'Place frozen kababs directly into pan without thawing.',
          'Fry for 3-4 mins rotating regularly until golden brown.'
        ],
        tips: 'Do not thaw! Frying directly from frozen locks in the moisture.'
      }
    ],
    nutritionPer100g: {
      calories: 170,
      protein: '19g',
      carbs: '3g',
      fat: '8g'
    },
    altText: 'Frozen gourmet product'
  };

  const [formData, setFormData] = useState<Omit<Product, 'id'>>(defaultNewProduct);
  const [ingredientsText, setIngredientsText] = useState(defaultNewProduct.ingredients.join('\n'));

  // Filtering products
  const filteredProducts = products.filter(p => {
    const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (p.urduName && p.urduName.includes(searchTerm)) ||
      p.tagline.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleOpenAdd = () => {
    setFormData(defaultNewProduct);
    setIngredientsText(defaultNewProduct.ingredients.join('\n'));
    setIsAddingProduct(true);
  };

  const handleOpenEdit = (p: Product) => {
    setIsEditingProduct(p);
    setFormData(p);
    setIngredientsText(p.ingredients.join('\n'));
  };

  const handleDuplicate = (p: Product) => {
    const duplicated: Omit<Product, 'id'> = {
      ...p,
      name: `${p.name} (Copy)`,
      slug: `${p.slug}-copy-${Date.now()}`
    };
    addProduct(duplicated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAddPackOption = () => {
    const isNimko = formData.category === 'nimko';
    const newPack: PackOption = isNimko ? {
      size: '250 Grams (250g Pack)',
      weightGrams: 250,
      price: 300,
      costPrice: 150
    } : {
      size: '1 Dozen (12 Pcs)',
      weightGrams: 500,
      pieces: 12,
      price: 950,
      costPrice: 500
    };
    setFormData({
      ...formData,
      packOptions: [...formData.packOptions, newPack]
    });
  };

  const handleApplyKababDozenPreset = () => {
    setFormData({
      ...formData,
      badge: 'Priced Per Dozen',
      packOptions: [
        { size: 'Half Dozen (6 Pcs)', weightGrams: 250, pieces: 6, price: 550, originalPrice: 620, costPrice: 310 },
        { size: '1 Dozen (12 Pcs)', weightGrams: 500, pieces: 12, price: 980, originalPrice: 1150, costPrice: 540, isPopular: true },
        { size: '2 Dozen (24 Pcs Mega Pack)', weightGrams: 1000, pieces: 24, price: 1850, originalPrice: 2200, costPrice: 1020 }
      ],
      defaultPackIndex: 1
    });
  };

  const handleApplyNimkoGramPreset = () => {
    setFormData({
      ...formData,
      badge: 'Priced in Grams',
      packOptions: [
        { size: '250 Grams (250g Zip Pouch)', weightGrams: 250, price: 290, originalPrice: 340, costPrice: 140 },
        { size: '500 Grams (500g Jar Pack)', weightGrams: 500, price: 540, originalPrice: 650, costPrice: 260, isPopular: true },
        { size: '1000 Grams / 1 Kg (Family Pack)', weightGrams: 1000, price: 990, originalPrice: 1200, costPrice: 480 }
      ],
      defaultPackIndex: 1
    });
  };

  const handleUpdatePackOption = (index: number, updatedFields: Partial<PackOption>) => {
    const updated = formData.packOptions.map((opt, i) => {
      if (i === index) {
        return { ...opt, ...updatedFields };
      }
      return opt;
    });
    setFormData({ ...formData, packOptions: updated });
  };

  const handleRemovePackOption = (index: number) => {
    if (formData.packOptions.length <= 1) return;
    const updated = formData.packOptions.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      packOptions: updated,
      defaultPackIndex: 0
    });
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const parsedIngredients = ingredientsText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const generatedSlug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const cleanProductData = {
      ...formData,
      slug: formData.slug || generatedSlug,
      ingredients: parsedIngredients.length > 0 ? parsedIngredients : defaultNewProduct.ingredients
    };

    if (isAddingProduct) {
      addProduct(cleanProductData);
      setIsAddingProduct(false);
    } else if (isEditingProduct) {
      updateProduct(isEditingProduct.id, cleanProductData);
      setIsEditingProduct(null);
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DFC8] pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#2D1A16] font-display flex items-center gap-2">
            <Package className="w-6 h-6 text-[#801414]" />
            Products & Inventory Management
          </h2>
          <p className="text-xs text-[#735A50]">
            Manage ready-to-fry kababs (priced per dozen) and fresh Karachi nimko snacks (priced in grams) with multi-pack sizes and image gallery uploads.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 bg-[#801414] hover:bg-[#681010] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span>Product changes saved successfully!</span>
        </div>
      )}

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8DFC8] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8C7A70] absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products by title, tagline..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF7F0] border border-[#DDD4CA] rounded-xl text-[#2D1A16] focus:border-[#801414] focus:bg-white outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['all', 'chicken', 'beef', 'nimko', 'combos'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer whitespace-nowrap ${
                categoryFilter === cat
                  ? 'bg-[#801414] text-white shadow-xs'
                  : 'bg-[#FAF7F0] text-[#4A352F] hover:bg-[#F2EBDC] border border-[#DDD4CA]'
              }`}
            >
              {cat === 'all' ? `All (${products.length})` : cat === 'chicken' ? 'Chicken (Per Dozen)' : cat === 'beef' ? 'Beef (Per Dozen)' : cat === 'nimko' ? 'Nimko (In Grams)' : 'Combos'}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-[#E8DFC8] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#2D1A16]">
            <thead className="bg-[#FAF7F0] text-[#70584E] font-bold uppercase tracking-wider border-b border-[#E8DFC8]">
              <tr>
                <th className="py-3.5 px-4">Product Info & Image</th>
                <th className="py-3.5 px-4">Category & Unit</th>
                <th className="py-3.5 px-4">Pack Options & Prices</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Bestseller</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DFC8]">
              {filteredProducts.map((prod) => {
                const isKabab = prod.category === 'chicken' || prod.category === 'beef';
                const isNimko = prod.category === 'nimko';
                const isPublished = prod.status !== 'draft';
                return (
                  <tr key={prod.id} className="hover:bg-[#FAF7F0]/60 transition-colors">
                    {/* Info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl bg-stone-100 border border-[#E8DFC8] overflow-hidden shrink-0">
                          <img 
                            src={prod.image} 
                            alt={prod.name} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover" 
                          />
                          {prod.galleryImages && prod.galleryImages.length > 1 && (
                            <span className="absolute bottom-0.5 right-0.5 bg-black/70 text-white text-[8px] px-1 rounded font-bold">
                              +{prod.galleryImages.length - 1}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-[#2D1A16]">{prod.name}</div>
                          {prod.urduName && (
                            <div className="text-[11px] text-[#801414] font-urdu">{prod.urduName}</div>
                          )}
                          <div className="text-[11px] text-[#8C7A70] line-clamp-1">{prod.tagline}</div>
                        </div>
                      </div>
                    </td>

                    {/* Category & Unit designation */}
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <span className="capitalize font-bold text-[11px] bg-[#FAF0DC] text-[#801414] px-2.5 py-0.5 rounded-full border border-[#EAD5AB] inline-block">
                          {prod.category}
                        </span>
                        <div>
                          {isKabab && (
                            <span className="text-[10px] text-amber-800 bg-amber-100 font-bold px-1.5 py-0.5 rounded inline-flex items-center gap-1">
                              <Package className="w-2.5 h-2.5" /> Per Dozen
                            </span>
                          )}
                          {isNimko && (
                            <span className="text-[10px] text-emerald-800 bg-emerald-100 font-bold px-1.5 py-0.5 rounded inline-flex items-center gap-1">
                              <Scale className="w-2.5 h-2.5" /> In Grams (g)
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Pricing Options */}
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        {prod.packOptions.map((opt, i) => (
                          <div key={i} className="text-[11px] flex items-center gap-2">
                            <span className="font-semibold text-[#4A352F]">{opt.size}:</span>
                            <span className="font-bold text-[#801414]">Rs. {opt.price}</span>
                            {opt.costPrice && (
                              <span className="text-[10px] text-stone-500">(Cost: Rs. {opt.costPrice})</span>
                            )}
                            {opt.isPopular && (
                              <span className="text-[9px] bg-amber-200 text-amber-900 font-bold px-1 py-0.2 rounded">POPULAR</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Status (Publish vs Revision) */}
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${
                        isPublished
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? 'bg-emerald-600' : 'bg-amber-600'}`}></span>
                        {isPublished ? 'Published' : 'In Revision'}
                      </span>
                    </td>

                    {/* Bestseller Toggle */}
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => toggleProductBestseller(prod.id)}
                        className={`p-1.5 rounded-lg border text-xs font-bold cursor-pointer transition-colors ${
                          prod.isBestseller
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : 'bg-stone-100 text-stone-500 border-stone-200'
                        }`}
                        title={prod.isBestseller ? 'Featured as Bestseller' : 'Click to flag as Bestseller'}
                      >
                        <Star className={`w-4 h-4 ${prod.isBestseller ? 'fill-amber-500 text-amber-600' : 'text-stone-400'}`} />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleDuplicate(prod)}
                          className="p-1.5 text-stone-600 hover:bg-[#FAF0DC] rounded-lg border border-transparent hover:border-[#EAD5AB] transition-colors cursor-pointer"
                          title="Duplicate product"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEdit(prod)}
                          className="p-1.5 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors cursor-pointer"
                          title="Edit product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteProduct(prod.id)}
                          disabled={products.length <= 1}
                          className="p-1.5 text-red-700 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors disabled:opacity-30 cursor-pointer"
                          title="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {(isAddingProduct || isEditingProduct) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-[#E8DFC8] space-y-6 animate-in zoom-in-95 my-6 max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-[#E8DFC8] pb-4">
              <div>
                <h3 className="font-bold text-lg text-[#2D1A16] font-display">
                  {isAddingProduct ? 'Create New Product' : `Edit Product: ${isEditingProduct?.name}`}
                </h3>
                <p className="text-xs text-[#735A50]">
                  Configure product details, upload product photos with specified 800x800px dimensions, and configure Dozen / Gram pack options.
                </p>
              </div>
              <button 
                onClick={() => { setIsAddingProduct(false); setIsEditingProduct(null); }}
                className="text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-6">
              
              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#3D2821] mb-1">Product Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Frozen Beef Seekh Kabab"
                    className="w-full bg-[#FAF7F0] border border-[#DDD4CA] text-xs font-semibold px-3 py-2 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3D2821] mb-1">Urdu Name</label>
                  <input
                    type="text"
                    value={formData.urduName || ''}
                    onChange={(e) => setFormData({ ...formData, urduName: e.target.value })}
                    placeholder="e.g. بیف سیخ کباب (فی درجن)"
                    className="w-full bg-[#FAF7F0] border border-[#DDD4CA] text-xs font-semibold px-3 py-2 rounded-xl outline-none font-urdu"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3D2821] mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#FAF7F0] border border-[#DDD4CA] text-xs font-semibold px-3 py-2 rounded-xl outline-none"
                  >
                    <option value="chicken">Chicken Kababs (Priced Per Dozen)</option>
                    <option value="beef">Beef Kababs (Priced Per Dozen)</option>
                    <option value="nimko">Karachi Mix Nimko (Priced in Grams)</option>
                    <option value="combos">Family Deals & Combos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3D2821] mb-1">Spice Level</label>
                  <select
                    value={formData.spiceLevel}
                    onChange={(e) => setFormData({ ...formData, spiceLevel: e.target.value as SpiceLevel })}
                    className="w-full bg-[#FAF7F0] border border-[#DDD4CA] text-xs font-semibold px-3 py-2 rounded-xl outline-none"
                  >
                    <option value="Mild">Mild</option>
                    <option value="Medium">Medium</option>
                    <option value="Spicy">Spicy</option>
                    <option value="Kids-Friendly">Kids-Friendly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3D2821] mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={formData.badge || ''}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g. Rs. 980 / Dozen, Rs. 540 / 500g"
                    className="w-full bg-[#FAF7F0] border border-[#DDD4CA] text-xs font-semibold px-3 py-2 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3D2821] mb-1">Storefront Status *</label>
                  <select
                    value={formData.status || 'published'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'published' | 'draft' })}
                    className="w-full bg-[#FAF7F0] border border-[#DDD4CA] text-xs font-bold px-3 py-2 rounded-xl outline-none text-[#2D1A16]"
                  >
                    <option value="published">✅ Published (Live on Storefront)</option>
                    <option value="draft">⏳ Draft / In Revision (Hidden)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3D2821] mb-1">Tagline / Short Hook</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. Tender, juicy, charcoal-smoked minced chicken priced per dozen"
                  className="w-full bg-[#FAF7F0] border border-[#DDD4CA] text-xs font-semibold px-3 py-2 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3D2821] mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#FAF7F0] border border-[#DDD4CA] text-xs font-normal px-3 py-2 rounded-xl outline-none"
                />
              </div>

              {/* IMAGE UPLOADER COMPONENT WITH MENTIONED SIZES & THUMBNAILS */}
              <ImageUploader
                label="Product Photos & Gallery Thumbnails"
                value={formData.image}
                onChange={(newUrl) => setFormData({ 
                  ...formData, 
                  image: newUrl, 
                  galleryImages: formData.galleryImages?.includes(newUrl) ? formData.galleryImages : [newUrl, ...(formData.galleryImages || [])]
                })}
                recommendedWidth={800}
                recommendedHeight={800}
                aspectRatioLabel="1:1 Square"
                maxSizeMB={2}
                helpText="Upload primary cover image and extra gallery thumbnails. Recommended: 800 × 800 px (1:1 Square, max 2MB)."
                allowGallery={true}
                galleryValues={formData.galleryImages || [formData.image]}
                onGalleryChange={(updatedUrls) => setFormData({ ...formData, galleryImages: updatedUrls })}
              />

              {/* Pack Sizes & Prices (Multi-tier CRUD with Dozen vs Gram Presets) */}
              <div className="bg-[#FAF7F0] p-4 rounded-2xl border border-[#E8DFC8] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-[#2D1A16] uppercase tracking-wider">
                      Pack Sizes & Pricing Tiers ({formData.packOptions.length})
                    </h4>
                    <p className="text-[10px] text-[#735A50]">
                      Kababs are priced per dozen (6/12/24 pcs) while Nimko is priced in grams (250g/500g/1000g).
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleApplyKababDozenPreset}
                      className="text-[10px] font-bold bg-[#FAF0DC] text-[#801414] hover:bg-[#F5E5C4] px-2.5 py-1 rounded-lg border border-[#EAD5AB] cursor-pointer"
                    >
                      + Dozen Packs
                    </button>
                    <button
                      type="button"
                      onClick={handleApplyNimkoGramPreset}
                      className="text-[10px] font-bold bg-[#FAF0DC] text-[#801414] hover:bg-[#F5E5C4] px-2.5 py-1 rounded-lg border border-[#EAD5AB] cursor-pointer"
                    >
                      + Gram Packs
                    </button>
                    <button
                      type="button"
                      onClick={handleAddPackOption}
                      className="text-[11px] font-bold bg-[#801414] text-white px-3 py-1 rounded-lg hover:bg-[#681010] flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Option</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {formData.packOptions.map((pack, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-xl border border-[#DDD4CA] flex flex-wrap items-center gap-2 sm:gap-3">
                      <div className="flex-1 min-w-[150px]">
                        <label className="text-[10px] font-semibold text-[#8C7A70] block">Size / Unit Label</label>
                        <input
                          type="text"
                          value={pack.size}
                          onChange={(e) => handleUpdatePackOption(idx, { size: e.target.value })}
                          placeholder="e.g. 1 Dozen (12 Pcs) or 500 Grams"
                          className="w-full bg-[#FAF7F0] border border-[#DDD4CA] text-xs font-semibold px-2.5 py-1.5 rounded-lg"
                        />
                      </div>

                      <div className="w-24">
                        <label className="text-[10px] font-semibold text-[#8C7A70] block">Selling (Rs.)</label>
                        <input
                          type="number"
                          value={pack.price}
                          onChange={(e) => handleUpdatePackOption(idx, { price: Number(e.target.value) })}
                          className="w-full bg-[#FAF7F0] border border-[#DDD4CA] text-xs font-bold text-[#801414] px-2.5 py-1.5 rounded-lg"
                        />
                      </div>

                      <div className="w-20">
                        <label className="text-[10px] font-semibold text-[#8C7A70] block">Cost (Rs.)</label>
                        <input
                          type="number"
                          value={pack.costPrice || ''}
                          onChange={(e) => handleUpdatePackOption(idx, { costPrice: Number(e.target.value) })}
                          placeholder="COGS"
                          className="w-full bg-[#FAF7F0] border border-[#DDD4CA] text-xs font-bold text-stone-600 px-2.5 py-1.5 rounded-lg"
                        />
                      </div>

                      <div className="w-20">
                        <label className="text-[10px] font-semibold text-[#8C7A70] block">Pieces (Pcs)</label>
                        <input
                          type="number"
                          value={pack.pieces || ''}
                          onChange={(e) => handleUpdatePackOption(idx, { pieces: Number(e.target.value) })}
                          placeholder="12"
                          className="w-full bg-[#FAF7F0] border border-[#DDD4CA] text-xs px-2.5 py-1.5 rounded-lg"
                        />
                      </div>

                      <div className="w-20">
                        <label className="text-[10px] font-semibold text-[#8C7A70] block">Grams (g)</label>
                        <input
                          type="number"
                          value={pack.weightGrams}
                          onChange={(e) => handleUpdatePackOption(idx, { weightGrams: Number(e.target.value) })}
                          className="w-full bg-[#FAF7F0] border border-[#DDD4CA] text-xs px-2.5 py-1.5 rounded-lg"
                        />
                      </div>

                      <div className="self-end pb-1 flex items-center gap-1">
                        <label className="text-[10px] flex items-center gap-1 font-semibold cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.defaultPackIndex === idx}
                            onChange={() => setFormData({ ...formData, defaultPackIndex: idx })}
                            className="accent-[#801414]"
                          />
                          Default
                        </label>

                        <button
                          type="button"
                          onClick={() => handleRemovePackOption(idx)}
                          disabled={formData.packOptions.length <= 1}
                          className="p-1 text-red-600 hover:bg-red-50 rounded disabled:opacity-20 ml-2 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ingredients List */}
              <div>
                <label className="block text-xs font-bold text-[#3D2821] mb-1">
                  Ingredients (One per line)
                </label>
                <textarea
                  rows={3}
                  value={ingredientsText}
                  onChange={(e) => setIngredientsText(e.target.value)}
                  placeholder="100% Halal Chicken Mince&#10;Fresh Ginger Garlic&#10;Mint & Cumin"
                  className="w-full bg-[#FAF7F0] border border-[#DDD4CA] text-xs font-normal px-3 py-2 rounded-xl outline-none font-mono"
                />
              </div>

              {/* Flags */}
              <div className="flex flex-wrap gap-4 pt-2 border-t border-[#E8DFC8]">
                <label className="flex items-center gap-2 text-xs font-bold text-[#2D1A16] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isBestseller}
                    onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
                    className="accent-[#801414]"
                  />
                  <span>Mark as Bestseller ⭐</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-[#2D1A16] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isNew}
                    onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                    className="accent-[#801414]"
                  />
                  <span>New Product Launch 🚀</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#E8DFC8]">
                <button
                  type="button"
                  onClick={() => { setIsAddingProduct(false); setIsEditingProduct(null); }}
                  className="px-5 py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-600 hover:bg-stone-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#801414] hover:bg-[#681010] text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  {isAddingProduct ? 'Save New Product' : 'Update Product'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
