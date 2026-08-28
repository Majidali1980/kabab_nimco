import React, { useRef } from 'react';
import { 
  Flame, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  Snowflake, 
  ShieldCheck, 
  Clock, 
  ChefHat,
  Award
} from 'lucide-react';
import { Product, Deal, Category, PageView, PackOption } from '../types';
import { HeroCarousel } from './HeroCarousel';
import { CategoryBar } from './CategoryBar';
import { ProductCard } from './ProductCard';
import { DealsSection } from './DealsSection';
import { HowItWorks } from './HowItWorks';
import { TestimonialsSection } from './TestimonialsSection';
import { useStore } from '../context/StoreContext';

interface HomePageProps {
  onNavigate: (page: PageView, filterCategory?: string) => void;
  onAddToCart: (product: Product, selectedPack: PackOption, quantity: number) => void;
  onAddDealToCart: (deal: Deal) => void;
  onOpenQuickView: (product: Product) => void;
  onOpenCookingGuide: () => void;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onAddToCart,
  onAddDealToCart,
  onOpenQuickView,
  onOpenCookingGuide,
  wishlistIds,
  onToggleWishlist
}) => {
  const { products, topSellingConfig, nimkoRangeConfig } = useStore();
  const topSellingSliderRef = useRef<HTMLDivElement>(null);

  // Compute Top Selling Products based on Admin Config (custom product selection or automatic bestsellers)
  const topSellingProducts = topSellingConfig.customProductIds.length > 0
    ? topSellingConfig.customProductIds
        .map(id => products.find(p => p.id === id))
        .filter((p): p is Product => Boolean(p))
    : products.filter(p => p.isBestseller || p.rating >= 4.9);

  // Compute Nimko Range Products based on Admin Config
  const nimkoProducts = nimkoRangeConfig.customProductIds.length > 0
    ? nimkoRangeConfig.customProductIds
        .map(id => products.find(p => p.id === id))
        .filter((p): p is Product => Boolean(p))
    : products.filter(p => p.category === 'nimko');

  const scrollSlider = (direction: 'left' | 'right') => {
    if (topSellingSliderRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      topSellingSliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-0">
      
      {/* 1. Hero Carousel (Dynamic CRUD) */}
      <HeroCarousel onNavigate={onNavigate} />

      {/* 2. Shop By Category Bar */}
      <CategoryBar
        activeCategory="all"
        onSelectCategory={(cat) => onNavigate('shop', cat)}
      />

      {/* 3. Top Selling Bestsellers (Dynamic CRUD) */}
      {topSellingConfig.enabled && (
        <section className="py-14 bg-[#FFFDF9] border-b border-[#E8DFC8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex items-end justify-between mb-8">
              <div>
                {topSellingConfig.badge && (
                  <div className="inline-flex items-center gap-1.5 bg-[#FAF0DC] text-[#801414] text-xs font-black uppercase px-3 py-1 rounded-full mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
                    <span>{topSellingConfig.badge}</span>
                  </div>
                )}
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#2D1A16] font-display">
                  {topSellingConfig.title}
                </h2>
                {topSellingConfig.subtitle && (
                  <p className="text-sm text-[#735A50] mt-1">
                    {topSellingConfig.subtitle}
                  </p>
                )}
              </div>

              {/* Slider Navigation arrows */}
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => scrollSlider('left')}
                  className="w-10 h-10 rounded-full border border-[#E8DFC8] bg-white hover:bg-[#FAF7F0] text-[#2D1A16] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scrollSlider('right')}
                  className="w-10 h-10 rounded-full border border-[#E8DFC8] bg-white hover:bg-[#FAF7F0] text-[#2D1A16] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable / Grid Cards */}
            <div 
              ref={topSellingSliderRef}
              className="flex gap-6 overflow-x-auto pb-4 no-scrollbar scroll-smooth sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible"
            >
              {topSellingProducts.map((prod) => (
                <div key={prod.id} className="min-w-[280px] sm:min-w-0 flex-1">
                  <ProductCard
                    product={prod}
                    onAddToCart={onAddToCart}
                    onOpenQuickView={onOpenQuickView}
                    isWishlisted={wishlistIds.includes(prod.id)}
                    onToggleWishlist={onToggleWishlist}
                  />
                </div>
              ))}
            </div>

            {/* View Menu CTA */}
            {topSellingConfig.ctaText && (
              <div className="mt-10 text-center">
                <button
                  onClick={() => onNavigate('shop', 'all')}
                  className="inline-flex items-center gap-2 bg-[#FAF0DC] hover:bg-[#F2E4C4] text-[#801414] font-bold text-xs sm:text-sm px-6 py-3 rounded-xl border border-[#EAD5AB] transition-colors cursor-pointer"
                >
                  <span>{topSellingConfig.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>
        </section>
      )}

      {/* 4. Deals & Family Combo Packs (Dynamic CRUD) */}
      <DealsSection
        onAddDealToCart={onAddDealToCart}
        onNavigate={onNavigate}
      />

      {/* 5. How It Works 4-Step Strip */}
      <HowItWorks onOpenCookingGuide={onOpenCookingGuide} />

      {/* 6. Spotlight on Karachi Nimko Snacks (Dynamic CRUD) */}
      {nimkoRangeConfig.enabled && (
        <section className="py-14 bg-[#FAF7F0] border-b border-[#E8DFC8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
              <div>
                {nimkoRangeConfig.badge && (
                  <div className="inline-flex items-center gap-1.5 bg-[#FAF0DC] text-[#801414] text-xs font-black uppercase px-3 py-1 rounded-full mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
                    <span>{nimkoRangeConfig.badge}</span>
                  </div>
                )}
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#2D1A16] font-display">
                  {nimkoRangeConfig.title}
                </h2>
                {nimkoRangeConfig.subtitle && (
                  <p className="text-sm text-[#735A50] mt-1">
                    {nimkoRangeConfig.subtitle}
                  </p>
                )}
              </div>

              {nimkoRangeConfig.ctaText && (
                <button
                  onClick={() => onNavigate('shop', 'nimko')}
                  className="text-xs font-extrabold text-[#801414] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{nimkoRangeConfig.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {nimkoProducts.map((prod) => (
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

          </div>
        </section>
      )}

      {/* 7. Why Nimko & Kabab Co. Value Grid */}
      <section className="py-16 bg-[#26100D] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-white">
              The Artisanal Taste Difference
            </h2>
            <p className="text-sm text-stone-300 mt-2">
              Why our frozen kababs stay juicy and tender while supermarket brands dry out.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-3 backdrop-blur-xs">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-400 flex items-center justify-center">
                <Snowflake className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg font-display text-white">
                30-Minute Blast Freezing
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Conventional freezing creates large ice crystals that tear meat fibers. Our -35°C blast chilling locks juices inside so every bite stays succulent and tender upon frying.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-3 backdrop-blur-xs">
              <div className="w-12 h-12 rounded-2xl bg-emerald-400/20 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg font-display text-white">
                100% Prime Cuts & Fresh Herbs
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                We use prime boneless chicken breast and lean beef with fresh crushed ginger, garlic, mint, and whole roasted spices. Zero artificial binders, MSG, or colors.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-3 backdrop-blur-xs">
              <div className="w-12 h-12 rounded-2xl bg-sky-400/20 text-sky-400 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg font-display text-white">
                Fry Direct in 3 Minutes
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                No defrosting or microwave thawing needed. Keep packs in your freezer and prepare delicious hot appetizers for unexpected guests in minutes.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 8. Testimonials & FAQs Section */}
      <TestimonialsSection />

    </div>
  );
};
