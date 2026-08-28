import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { CategoryItem, PrimaryMaterialCategory } from '../../types';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Sparkles,
  Flame,
  Drumstick,
  Package,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  ShoppingBag,
  Boxes,
  Tag,
  Hash,
  Scale,
  Palette,
  FileText,
  AlertCircle,
  CheckCircle2,
  FolderPlus
} from 'lucide-react';

export const AdminCategories: React.FC = () => {
  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    primaryMaterialCategories,
    addPrimaryMaterialCategory,
    updatePrimaryMaterialCategory,
    deletePrimaryMaterialCategory,
    reorderPrimaryMaterialCategories,
    products,
    purchases
  } = useStore();

  // Active sub-tab: 'product' for Storefront finished goods, 'material' for Primary raw material categories
  const [activeTab, setActiveTab] = useState<'product' | 'material'>('product');

  // Product Category CRUD state
  const [isEditingProduct, setIsEditingProduct] = useState<string | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [productFormData, setProductFormData] = useState<Omit<CategoryItem, 'id'>>({
    name: '',
    slug: '',
    urduName: '',
    description: '',
    badge: '',
    iconName: 'drumstick',
    colorBadge: 'red',
    displayOrder: categories.length + 1,
    isEnabled: true
  });

  // Primary Material Category CRUD state
  const [isEditingMaterial, setIsEditingMaterial] = useState<string | null>(null);
  const [isCreatingMaterial, setIsCreatingMaterial] = useState(false);
  const [materialFormData, setMaterialFormData] = useState<Omit<PrimaryMaterialCategory, 'id' | 'createdAt'>>({
    name: '',
    slug: '',
    code: '',
    description: '',
    defaultUnit: 'Kg',
    colorBadge: 'emerald',
    isCustom: true,
    displayOrder: primaryMaterialCategories.length + 1,
    isEnabled: true
  });

  // Counts
  const getProductCount = (slug: string) => {
    return products.filter(p => p.category === slug || p.category === slug.replace('cat-', '')).length;
  };

  const getPurchasesCount = (catName: string) => {
    return purchases.filter(p => p.category.toLowerCase() === catName.toLowerCase()).length;
  };

  // --- Product Category Handlers ---
  const handleStartCreateProduct = () => {
    setProductFormData({
      name: '',
      slug: '',
      urduName: '',
      description: '',
      badge: '',
      iconName: 'drumstick',
      colorBadge: 'red',
      displayOrder: categories.length + 1,
      isEnabled: true
    });
    setIsCreatingProduct(true);
    setIsEditingProduct(null);
  };

  const handleStartEditProduct = (cat: CategoryItem) => {
    setProductFormData({
      name: cat.name,
      slug: cat.slug,
      urduName: cat.urduName || '',
      description: cat.description || '',
      badge: cat.badge || '',
      iconName: cat.iconName || 'drumstick',
      colorBadge: cat.colorBadge || 'red',
      displayOrder: cat.displayOrder || 1,
      isEnabled: cat.isEnabled !== undefined ? cat.isEnabled : true
    });
    setIsEditingProduct(cat.id);
    setIsCreatingProduct(false);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productFormData.name.trim()) return;

    const generatedSlug = productFormData.slug?.trim()
      ? productFormData.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
      : productFormData.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const cleanData = {
      ...productFormData,
      slug: generatedSlug
    };

    if (isCreatingProduct) {
      addCategory(cleanData);
      setIsCreatingProduct(false);
    } else if (isEditingProduct) {
      updateCategory(isEditingProduct, cleanData);
      setIsEditingProduct(null);
    }
  };

  const handleMoveProduct = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const newCategories = [...categories];
    const [moved] = newCategories.splice(index, 1);
    newCategories.splice(targetIndex, 0, moved);

    const updated = newCategories.map((c, i) => ({ ...c, displayOrder: i + 1 }));
    reorderCategories(updated);
  };

  // --- Primary Material Category Handlers ---
  const handleStartCreateMaterial = () => {
    setMaterialFormData({
      name: '',
      slug: '',
      code: '',
      description: '',
      defaultUnit: 'Kg',
      colorBadge: 'emerald',
      isCustom: true,
      displayOrder: primaryMaterialCategories.length + 1,
      isEnabled: true
    });
    setIsCreatingMaterial(true);
    setIsEditingMaterial(null);
  };

  const handleStartEditMaterial = (cat: PrimaryMaterialCategory) => {
    setMaterialFormData({
      name: cat.name,
      slug: cat.slug,
      code: cat.code || '',
      description: cat.description || '',
      defaultUnit: cat.defaultUnit || 'Kg',
      colorBadge: cat.colorBadge || 'emerald',
      isCustom: cat.isCustom !== undefined ? cat.isCustom : true,
      displayOrder: cat.displayOrder || 1,
      isEnabled: cat.isEnabled !== undefined ? cat.isEnabled : true
    });
    setIsEditingMaterial(cat.id);
    setIsCreatingMaterial(false);
  };

  const handleSaveMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!materialFormData.name.trim()) return;

    const generatedSlug = materialFormData.slug?.trim()
      ? materialFormData.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
      : materialFormData.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const generatedCode = materialFormData.code?.trim()
      ? materialFormData.code.trim().toUpperCase()
      : `MAT-${materialFormData.name.slice(0, 4).toUpperCase().replace(/[^A-Z]/g, '')}`;

    const cleanData = {
      ...materialFormData,
      slug: generatedSlug,
      code: generatedCode
    };

    if (isCreatingMaterial) {
      addPrimaryMaterialCategory(cleanData);
      setIsCreatingMaterial(false);
    } else if (isEditingMaterial) {
      updatePrimaryMaterialCategory(isEditingMaterial, cleanData);
      setIsEditingMaterial(null);
    }
  };

  const handleMoveMaterial = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= primaryMaterialCategories.length) return;

    const newCats = [...primaryMaterialCategories];
    const [moved] = newCats.splice(index, 1);
    newCats.splice(targetIndex, 0, moved);

    const updated = newCats.map((c, i) => ({ ...c, displayOrder: i + 1 }));
    reorderPrimaryMaterialCategories(updated);
  };

  const renderIcon = (iconName?: string) => {
    switch (iconName) {
      case 'drumstick':
        return <Drumstick className="w-4 h-4" />;
      case 'flame':
        return <Flame className="w-4 h-4" />;
      case 'sparkles':
        return <Sparkles className="w-4 h-4" />;
      case 'package':
        return <Package className="w-4 h-4" />;
      default:
        return <Layers className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-amber-100 text-amber-900 rounded-2xl">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-900 font-display">Category Management Center</h2>
            <p className="text-sm text-stone-500">
              Manage finished storefront menu categories and customize primary raw material categories for purchase tracking.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'product' ? (
            <button
              onClick={handleStartCreateProduct}
              disabled={isCreatingProduct}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#801414] hover:bg-[#681010] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>Add Menu Category</span>
            </button>
          ) : (
            <button
              onClick={handleStartCreateMaterial}
              disabled={isCreatingMaterial}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <FolderPlus className="w-4 h-4" />
              <span>Add Primary Material Category</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200 max-w-xl">
        <button
          onClick={() => setActiveTab('product')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'product'
              ? 'bg-white text-[#801414] shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Storefront Menu Categories ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('material')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'material'
              ? 'bg-white text-emerald-800 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>Primary Material Categories ({primaryMaterialCategories.length})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PRODUCT / MENU CATEGORIES */}
      {/* ========================================================================= */}
      {activeTab === 'product' && (
        <div className="space-y-6">
          
          {/* Create/Edit Form */}
          {(isCreatingProduct || isEditingProduct) && (
            <div className="bg-amber-50/70 border border-amber-200 p-6 rounded-2xl space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-700" />
                  {isCreatingProduct ? 'Create New Storefront Category' : 'Edit Menu Category'}
                </h3>
                <button
                  onClick={() => {
                    setIsCreatingProduct(false);
                    setIsEditingProduct(null);
                  }}
                  className="text-stone-400 hover:text-stone-700 p-1 rounded-lg hover:bg-amber-100/50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Category Name (English) *
                    </label>
                    <input
                      type="text"
                      required
                      value={productFormData.name}
                      onChange={e => setProductFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Traditional Beef Kababs"
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-stone-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Urdu Name / Label
                    </label>
                    <input
                      type="text"
                      value={productFormData.urduName}
                      onChange={e => setProductFormData(prev => ({ ...prev, urduName: e.target.value }))}
                      placeholder="e.g. روایتی بیف کباب"
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-stone-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-urdu text-right"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      URL Slug (Auto-generated if empty)
                    </label>
                    <input
                      type="text"
                      value={productFormData.slug}
                      onChange={e => setProductFormData(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="e.g. beef-kababs"
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-stone-900 text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Promotional Tag / Badge
                    </label>
                    <input
                      type="text"
                      value={productFormData.badge}
                      onChange={e => setProductFormData(prev => ({ ...prev, badge: e.target.value }))}
                      placeholder="e.g. Best Seller, New Recipe"
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-stone-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Category Icon
                    </label>
                    <select
                      value={productFormData.iconName}
                      onChange={e => setProductFormData(prev => ({ ...prev, iconName: e.target.value }))}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-stone-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="drumstick">🍗 Drumstick (Poultry & Meat)</option>
                      <option value="flame">🔥 Flame (Spicy / Charcoal)</option>
                      <option value="sparkles">✨ Sparkles (Specials & Deals)</option>
                      <option value="package">📦 Package (Nimko & Snacks)</option>
                      <option value="layers">📑 Layers (General Category)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Theme Color
                    </label>
                    <select
                      value={productFormData.colorBadge}
                      onChange={e => setProductFormData(prev => ({ ...prev, colorBadge: e.target.value as any }))}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-stone-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="red">🔴 Crimson Red (Kabab Theme)</option>
                      <option value="amber">🟠 Amber Yellow (Nimko Theme)</option>
                      <option value="emerald">🟢 Emerald Green (Fresh & Special)</option>
                      <option value="blue">🔵 Cobalt Blue (Party Packs)</option>
                    </select>
                  </div>

                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-700">
                      <input
                        type="checkbox"
                        checked={productFormData.isEnabled}
                        onChange={e => setProductFormData(prev => ({ ...prev, isEnabled: e.target.checked }))}
                        className="w-4 h-4 text-[#801414] rounded focus:ring-amber-500"
                      />
                      <span>Visible on Storefront</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Category Tagline / Description
                  </label>
                  <textarea
                    rows={2}
                    value={productFormData.description}
                    onChange={e => setProductFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Short description shown in category filter headers and meta descriptions..."
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-stone-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-amber-200">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreatingProduct(false);
                      setIsEditingProduct(null);
                    }}
                    className="px-4 py-2 bg-white hover:bg-stone-100 text-stone-700 font-bold text-xs rounded-xl border border-stone-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#801414] hover:bg-[#681010] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>{isCreatingProduct ? 'Create Category' : 'Save Changes'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Product Categories Table */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
              <h3 className="font-bold text-stone-800 text-sm">Storefront Menu Categories ({categories.length})</h3>
              <span className="text-xs text-stone-500">Drag or use arrows to change customer menu sequence</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-600">
                <thead className="bg-stone-50 text-[11px] font-bold uppercase tracking-wider text-stone-500 border-b border-stone-200">
                  <tr>
                    <th className="px-4 py-3 text-center w-12">Order</th>
                    <th className="px-4 py-3">Category Name & Urdu</th>
                    <th className="px-4 py-3">Slug</th>
                    <th className="px-4 py-3 text-center">Badge</th>
                    <th className="px-4 py-3 text-center">Catalog Products</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {categories.map((cat, idx) => {
                    const prodCount = getProductCount(cat.slug);
                    return (
                      <tr key={cat.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="px-4 py-3.5 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleMoveProduct(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 rounded text-stone-400 hover:text-stone-800 disabled:opacity-20 cursor-pointer"
                              title="Move Up"
                            >
                              <MoveUp className="w-3.5 h-3.5" />
                            </button>
                            <span className="font-mono font-bold text-stone-500 text-[11px] w-4">{idx + 1}</span>
                            <button
                              onClick={() => handleMoveProduct(idx, 'down')}
                              disabled={idx === categories.length - 1}
                              className="p-1 rounded text-stone-400 hover:text-stone-800 disabled:opacity-20 cursor-pointer"
                              title="Move Down"
                            >
                              <MoveDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700">
                              {renderIcon(cat.iconName)}
                            </div>
                            <div>
                              <div className="font-bold text-stone-900 text-sm flex items-center gap-2">
                                <span>{cat.name}</span>
                                {cat.urduName && (
                                  <span className="text-xs text-amber-800 font-urdu bg-amber-50 px-1.5 py-0.5 rounded">
                                    {cat.urduName}
                                  </span>
                                )}
                              </div>
                              {cat.description && (
                                <p className="text-[11px] text-stone-500 line-clamp-1 max-w-sm">
                                  {cat.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3.5 font-mono text-[11px] text-stone-500">
                          {cat.slug}
                        </td>

                        <td className="px-4 py-3.5 text-center">
                          {cat.badge ? (
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              {cat.badge}
                            </span>
                          ) : (
                            <span className="text-stone-400 text-[11px]">-</span>
                          )}
                        </td>

                        <td className="px-4 py-3.5 text-center">
                          <span className="font-bold text-stone-900 bg-stone-100 px-2 py-1 rounded-md text-xs">
                            {prodCount} {prodCount === 1 ? 'item' : 'items'}
                          </span>
                        </td>

                        <td className="px-4 py-3.5 text-center">
                          <button
                            onClick={() => updateCategory(cat.id, { isEnabled: !cat.isEnabled })}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors cursor-pointer ${
                              cat.isEnabled !== false
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                            }`}
                          >
                            {cat.isEnabled !== false ? (
                              <>
                                <Eye className="w-3 h-3" />
                                <span>Active</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3 h-3" />
                                <span>Hidden</span>
                              </>
                            )}
                          </button>
                        </td>

                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleStartEditProduct(cat)}
                              className="p-1.5 text-stone-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                              title="Edit Category"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete category "${cat.name}"? Existing products will need reassignment.`)) {
                                  deleteCategory(cat.id);
                                }
                              }}
                              className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Category"
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
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PRIMARY MATERIAL & RAW INVENTORY CATEGORIES (CRUD + CUSTOM) */}
      {/* ========================================================================= */}
      {activeTab === 'material' && (
        <div className="space-y-6">
          
          {/* Quick Helper Banner */}
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-start gap-3 text-xs text-emerald-900">
            <Boxes className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-emerald-950">
                Primary Material Categories for Kitchen Procurement & Raw Inward Costing
              </p>
              <p className="mt-0.5 text-emerald-800 leading-relaxed">
                Use these categories when logging raw materials (e.g. Fresh Poultry Mince, Beef Cuts, Daal Chana, Whole Spices, Vacuum Seal Bags, Cooking Oil). You can add unlimited custom categories to track any custom ingredient or packaging material.
              </p>
            </div>
          </div>

          {/* Create/Edit Material Category Form */}
          {(isCreatingMaterial || isEditingMaterial) && (
            <div className="bg-emerald-50/70 border border-emerald-200 p-6 rounded-2xl space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <FolderPlus className="w-4 h-4 text-emerald-700" />
                  {isCreatingMaterial ? 'Add New Primary Material Category' : 'Edit Primary Material Category'}
                </h3>
                <button
                  onClick={() => {
                    setIsCreatingMaterial(false);
                    setIsEditingMaterial(null);
                  }}
                  className="text-stone-400 hover:text-stone-700 p-1 rounded-lg hover:bg-emerald-100/50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveMaterial} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Material Category Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={materialFormData.name}
                      onChange={e => setMaterialFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Premium Dairy & Cheese, Packaging Foils"
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-stone-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Material Code / Prefix (e.g. MAT-DAIRY)
                    </label>
                    <input
                      type="text"
                      value={materialFormData.code}
                      onChange={e => setMaterialFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                      placeholder="e.g. MAT-DAIRY"
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-stone-900 text-sm font-mono uppercase focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Default Measurement Unit
                    </label>
                    <select
                      value={materialFormData.defaultUnit}
                      onChange={e => setMaterialFormData(prev => ({ ...prev, defaultUnit: e.target.value }))}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-stone-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                    >
                      <option value="Kg">Kilograms (Kg)</option>
                      <option value="Grams">Grams (g)</option>
                      <option value="Liters">Liters (L)</option>
                      <option value="Packs">Packs / Boxes</option>
                      <option value="Pouches">Pouches / Sleeves</option>
                      <option value="Cartons">Cartons / Sacks</option>
                      <option value="Pieces">Pieces / Dozen</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Badge Color Theme
                    </label>
                    <select
                      value={materialFormData.colorBadge}
                      onChange={e => setMaterialFormData(prev => ({ ...prev, colorBadge: e.target.value }))}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-stone-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                    >
                      <option value="emerald">🟢 Emerald Green</option>
                      <option value="red">🔴 Crimson Red</option>
                      <option value="amber">🟠 Amber Yellow</option>
                      <option value="blue">🔵 Ocean Blue</option>
                      <option value="purple">🟣 Purple Accent</option>
                      <option value="stone">⚪ Neutral Stone</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Material Category Description / Notes
                    </label>
                    <input
                      type="text"
                      value={materialFormData.description}
                      onChange={e => setMaterialFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="e.g. Mozzarella, cheddar shreds, butter, and cream for stuffed kababs"
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-stone-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-emerald-200">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-700">
                    <input
                      type="checkbox"
                      checked={materialFormData.isEnabled}
                      onChange={e => setMaterialFormData(prev => ({ ...prev, isEnabled: e.target.checked }))}
                      className="w-4 h-4 text-emerald-700 rounded focus:ring-emerald-600"
                    />
                    <span>Available in Purchase Inward Dropdowns</span>
                  </label>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingMaterial(false);
                        setIsEditingMaterial(null);
                      }}
                      className="px-4 py-2 bg-white hover:bg-stone-100 text-stone-700 font-bold text-xs rounded-xl border border-stone-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>{isCreatingMaterial ? 'Add Category' : 'Save Material Category'}</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Primary Material Categories Table */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-stone-800 text-sm">
                  Primary Material Categories ({primaryMaterialCategories.length})
                </h3>
                <p className="text-xs text-stone-500">
                  Custom and standard categories used for procurement billing and unit cost allocation.
                </p>
              </div>
              <button
                onClick={handleStartCreateMaterial}
                className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Custom Category</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-600">
                <thead className="bg-stone-50 text-[11px] font-bold uppercase tracking-wider text-stone-500 border-b border-stone-200">
                  <tr>
                    <th className="px-4 py-3 text-center w-12">Seq</th>
                    <th className="px-4 py-3">Code</th>
                    <th className="px-4 py-3">Category Name & Scope</th>
                    <th className="px-4 py-3 text-center">Unit</th>
                    <th className="px-4 py-3 text-center">Type</th>
                    <th className="px-4 py-3 text-center">Purchases Logged</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {primaryMaterialCategories.map((cat, idx) => {
                    const purchaseCount = getPurchasesCount(cat.name);
                    return (
                      <tr key={cat.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="px-4 py-3.5 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleMoveMaterial(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 rounded text-stone-400 hover:text-stone-800 disabled:opacity-20 cursor-pointer"
                              title="Move Up"
                            >
                              <MoveUp className="w-3.5 h-3.5" />
                            </button>
                            <span className="font-mono font-bold text-stone-500 text-[11px] w-4">{idx + 1}</span>
                            <button
                              onClick={() => handleMoveMaterial(idx, 'down')}
                              disabled={idx === primaryMaterialCategories.length - 1}
                              className="p-1 rounded text-stone-400 hover:text-stone-800 disabled:opacity-20 cursor-pointer"
                              title="Move Down"
                            >
                              <MoveDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <span className="font-mono font-bold text-[11px] bg-stone-100 text-stone-800 px-2 py-0.5 rounded border border-stone-200">
                            {cat.code || `MAT-${idx + 1}`}
                          </span>
                        </td>

                        <td className="px-4 py-3.5">
                          <div>
                            <div className="font-bold text-stone-900 text-sm">
                              {cat.name}
                            </div>
                            {cat.description && (
                              <p className="text-[11px] text-stone-500 line-clamp-1 max-w-sm">
                                {cat.description}
                              </p>
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-3.5 text-center">
                          <span className="inline-block bg-stone-100 text-stone-700 text-[11px] font-bold px-2 py-0.5 rounded">
                            {cat.defaultUnit || 'Kg'}
                          </span>
                        </td>

                        <td className="px-4 py-3.5 text-center">
                          {cat.isCustom ? (
                            <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              Custom
                            </span>
                          ) : (
                            <span className="bg-stone-100 text-stone-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              Standard
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3.5 text-center">
                          <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 text-xs">
                            {purchaseCount} {purchaseCount === 1 ? 'invoice' : 'invoices'}
                          </span>
                        </td>

                        <td className="px-4 py-3.5 text-center">
                          <button
                            onClick={() => updatePrimaryMaterialCategory(cat.id, { isEnabled: !cat.isEnabled })}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors cursor-pointer ${
                              cat.isEnabled !== false
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                            }`}
                          >
                            {cat.isEnabled !== false ? (
                              <>
                                <Eye className="w-3 h-3" />
                                <span>Active</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3 h-3" />
                                <span>Hidden</span>
                              </>
                            )}
                          </button>
                        </td>

                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleStartEditMaterial(cat)}
                              className="p-1.5 text-stone-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                              title="Edit Material Category"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete primary material category "${cat.name}"?`)) {
                                  deletePrimaryMaterialCategory(cat.id);
                                }
                              }}
                              className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Material Category"
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
        </div>
      )}

    </div>
  );
};
