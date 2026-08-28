import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  Search, 
  SlidersHorizontal, 
  RotateCcw, 
  Check, 
  Sparkles
} from 'lucide-react';
import { Product, Category, SpiceLevel, PackOption } from '../types';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';

interface ShopPageProps {
  initialCategory?: Category;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddToCart: (product: Product, selectedPack: PackOption, quantity: number) => void;
  onOpenQuickView: (product: Product) => void;
  wishlistIds: string[];
  onToggleWishlist: (id: string) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  initialCategory = 'all',
  searchQuery,
  onSearchChange,
  onAddToCart,
  onOpenQuickView,
  wishlistIds,
  onToggleWishlist
}) => {
  const { products, categories: storeCategories } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<Category>(initialCategory);
  const [selectedSpiceLevels, setSelectedSpiceLevels] = useState<SpiceLevel[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(3500);
  const [selectedPackSize, setSelectedPackSize] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'rating'>('popular');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const categories = useMemo(() => {
    return (storeCategories || [])
      .filter(c => c.isEnabled)
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
      .map(c => ({
        id: c.slug as Category,
        label: c.name,
        count: c.slug === 'all' ? products.length : products.filter(p => p.category === c.slug).length
      }));
  }, [storeCategories, products]);

  const spiceLevels: SpiceLevel[] = ['Mild', 'Medium', 'Spicy', 'Kids-Friendly'];

  const toggleSpiceLevel = (spice: SpiceLevel) => {
    if (selectedSpiceLevels.includes(spice)) {
      setSelectedSpiceLevels(selectedSpiceLevels.filter(s => s !== spice));
    } else {
      setSelectedSpiceLevels([...selectedSpiceLevels, spice]);
    }
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedSpiceLevels([]);
    setMaxPrice(3500);
    setSelectedPackSize('all');
    onSearchChange('');
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // Spice filter
      if (selectedSpiceLevels.length > 0 && !selectedSpiceLevels.includes(product.spiceLevel)) {
        return false;
      }

      // Price filter (based on lowest pack price)
      const lowestPrice = product.packOptions.length > 0
        ? Math.min(...product.packOptions.map(p => p.price))
        : 0;
      if (lowestPrice > maxPrice) {
        return false;
      }

      // Pack size filter
      if (selectedPackSize !== 'all') {
        const hasPack = product.packOptions.some(p => p.size.toLowerCase().includes(selectedPackSize.toLowerCase()));
        if (!hasPack) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesTagline = product.tagline.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        const matchesIngredients = (product.ingredients || []).some(ing => ing.toLowerCase().includes(q));
        if (!matchesName && !matchesTagline && !matchesDesc && !matchesIngredients) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.packOptions[0]?.price || 0;
      const priceB = b.packOptions[0]?.price || 0;

      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      // Default: popularity / bestsellers first
      if (a.isBestseller && !b.isBestseller) return -1;
      if (!a.isBestseller && b.isBestseller) return 1;
      return (b.reviewCount || 0) - (a.reviewCount || 0);
    });
  }, [products, selectedCategory, selectedSpiceLevels, maxPrice, selectedPackSize, searchQuery, sortBy]);

  return (
    <div className="py-8 md:py-12 bg-[#FDFBF7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Heading & SEO Text */}
        <div className="mb-8 border-b border-[#E8DFC8] pb-6">
          <div className="inline-flex items-center gap-1.5 bg-[#FAF0DC] text-[#801414] text-xs font-black uppercase px-3 py-1 rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Ready-To-Fry & Fresh Snacks</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2D1A16] font-display">
            Shop Frozen Kababs & Nimko Online
          </h1>
          <p className="text-sm text-[#735A50] mt-1.5 max-w-3xl">
            Browse our hand-crafted frozen chicken seekh, homestyle chicken shami, gourmet beef seekh, and traditional crispy Karachi mix nimko packs. Fast cold-chain delivery across Karachi.
          </p>
        </div>

        {/* Layout Grid: Sidebar Filters (4 cols) + Product Grid (8 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Mobile Filter Trigger Button */}
          <div className="lg:hidden flex items-center justify-between gap-3 mb-2">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="flex-1 bg-white border border-[#E8DFC8] px-4 py-2.5 rounded-xl font-bold text-xs text-[#2D1A16] flex items-center justify-center gap-2 shadow-xs"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#801414]" />
              <span>{mobileFilterOpen ? 'Hide Filters' : 'Filter Products'}</span>
            </button>

            {/* Sort Select Mobile */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-[#E8DFC8] px-3 py-2.5 rounded-xl font-bold text-xs text-[#2D1A16] outline-none"
            >
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          {/* Filter Sidebar (Desktop & Expandable Mobile) */}
          <aside className={`lg:col-span-3 space-y-6 ${mobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-3xl p-6 border border-[#E8DFC8] shadow-xs space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-[#F0E8D8]">
                <div className="flex items-center gap-2 font-extrabold text-base text-[#2D1A16] font-display">
                  <Filter className="w-4 h-4 text-[#801414]" />
                  <span>Filters</span>
                </div>
                <button
                  onClick={resetFilters}
                  className="text-xs text-[#801414] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All</span>
                </button>
              </div>

              {/* Filter 1: Categories */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-[#2D1A16] mb-3">
                  Categories
                </h3>
                <div className="space-y-1.5">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                        selectedCategory === cat.id
                          ? 'bg-[#801414] text-white'
                          : 'text-[#523B33] hover:bg-[#FAF7F0]'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span className={`text-[11px] px-1.5 py-0.5 rounded-md ${
                        selectedCategory === cat.id ? 'bg-white/20 text-white' : 'bg-[#FAF0DC] text-[#801414]'
                      }`}>
                        {cat.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter 2: Price Slider */}
              <div className="pt-4 border-t border-[#F0E8D8]">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#2D1A16]">
                    Max Price
                  </h3>
                  <span className="text-xs font-extrabold text-[#801414]">
                    Rs. {maxPrice.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="3500"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#801414] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#8C7A70] mt-1">
                  <span>Rs. 200</span>
                  <span>Rs. 3,500</span>
                </div>
              </div>

              {/* Filter 3: Spice Level */}
              <div className="pt-4 border-t border-[#F0E8D8]">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#2D1A16] mb-3">
                  Spice Level
                </h3>
                <div className="space-y-2">
                  {spiceLevels.map((lvl) => {
                    const isChecked = selectedSpiceLevels.includes(lvl);
                    return (
                      <label
                        key={lvl}
                        onClick={() => toggleSpiceLevel(lvl)}
                        className="flex items-center gap-2.5 text-xs text-[#523B33] cursor-pointer hover:text-[#2D1A16]"
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                          isChecked ? 'bg-[#801414] border-[#801414] text-white' : 'border-[#DDD4CA] bg-white'
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="font-medium">{lvl}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Filter 4: Pack Size Filter */}
              <div className="pt-4 border-t border-[#F0E8D8]">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#2D1A16] mb-2.5">
                  Pack Size
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: 'All Sizes', value: 'all' },
                    { label: '250g', value: '250g' },
                    { label: '500g', value: '500g' },
                    { label: '1 Kg', value: '1 kg' }
                  ].map((sz) => (
                    <button
                      key={sz.value}
                      onClick={() => setSelectedPackSize(sz.value)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                        selectedPackSize === sz.value
                          ? 'bg-[#801414] text-white'
                          : 'bg-[#FAF7F0] text-[#523B33] border border-[#E8DFC8] hover:bg-[#F2EBDC]'
                      }`}
                    >
                      {sz.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </aside>

          {/* Main Product Grid Column (9 cols) */}
          <main className="lg:col-span-9 space-y-6">
            
            {/* Top Toolbar (Sort & Results Count) */}
            <div className="hidden lg:flex items-center justify-between bg-white px-5 py-3.5 rounded-2xl border border-[#E8DFC8] shadow-xs">
              <div className="text-xs text-[#523B33]">
                Showing <strong className="text-[#801414] font-extrabold">{filteredProducts.length}</strong> delicious items
                {searchQuery && <span> matching "<strong>{searchQuery}</strong>"</span>}
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#735A50]">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#FAF7F0] border border-[#DDD4CA] px-3 py-1.5 rounded-xl text-xs font-bold text-[#2D1A16] focus:border-[#801414] outline-none cursor-pointer"
                >
                  <option value="popular">Bestsellers & Popularity</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Customer Rating</option>
                </select>
              </div>
            </div>

            {/* Product Cards Grid (3 Columns) */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#E8DFC8] space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#FAF0DC] text-[#801414] flex items-center justify-center mx-auto">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-[#2D1A16] font-display">No matching items found</h3>
                <p className="text-xs text-[#735A50] max-w-sm mx-auto">
                  We couldn't find any products matching your current filters. Try resetting the filters or searching for another flavor.
                </p>
                <button
                  onClick={resetFilters}
                  className="bg-[#801414] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md hover:bg-[#681010] transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onAddToCart={onAddToCart}
                    onOpenQuickView={onOpenQuickView}
                    isWishlisted={wishlistIds.includes(prod.id)}
                    onToggleWishlist={onToggleWishlist}
                  />
                ))}
              </div>
            )}

          </main>

        </div>

      </div>
    </div>
  );
};
