import React, { useState } from 'react';
import { Star, ShoppingBag, Eye, Heart, Flame, Sparkles, Check, Clock, Scale, Package } from 'lucide-react';
import { Product, PackOption } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, selectedPack: PackOption, quantity: number) => void;
  onOpenQuickView: (product: Product) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onOpenQuickView,
  isWishlisted = false,
  onToggleWishlist
}) => {
  const [selectedPackIndex, setSelectedPackIndex] = useState(product.defaultPackIndex ?? 0);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const currentPack = product.packOptions[selectedPackIndex] || product.packOptions[0];

  const isKabab = product.category === 'chicken' || product.category === 'beef' || product.name.toLowerCase().includes('kabab');
  const isNimko = product.category === 'nimko' || product.name.toLowerCase().includes('nimko');

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);
    onAddToCart(product, currentPack, 1);
    
    setTimeout(() => {
      setIsAdding(false);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1800);
    }, 250);
  };

  const getSpiceBadge = (level: string) => {
    switch (level) {
      case 'Spicy':
        return <span className="bg-red-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">🌶️ Spicy</span>;
      case 'Medium':
        return <span className="bg-amber-800/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">🌶️ Medium</span>;
      case 'Mild':
        return <span className="bg-emerald-800/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">🍃 Mild</span>;
      default:
        return <span className="bg-sky-800/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">⭐ Classic</span>;
    }
  };

  // Format unit label for footer display
  const getUnitSuffix = () => {
    if (isKabab) {
      if (currentPack.pieces === 12 || currentPack.size.toLowerCase().includes('1 dozen')) return '/ Dozen (12 Pcs)';
      if (currentPack.pieces === 6 || currentPack.size.toLowerCase().includes('half dozen')) return '/ Half Dozen (6 Pcs)';
      if (currentPack.pieces === 24 || currentPack.size.toLowerCase().includes('2 dozen')) return '/ 2 Dozen (24 Pcs)';
      return currentPack.pieces ? `/ ${currentPack.pieces} Pcs` : '/ Dozen';
    }
    if (isNimko) {
      if (currentPack.weightGrams >= 1000) return '/ 1000g (1 Kg)';
      return `/ ${currentPack.weightGrams} Grams`;
    }
    return '';
  };

  return (
    <div 
      className="group bg-white rounded-2xl border border-[#E8DFC8] hover:border-[#D97706]/50 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden relative"
      onClick={() => onOpenQuickView(product)}
    >
      {/* Top Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F4EFE6] cursor-pointer">
        <img
          src={product.image}
          alt={product.altText || product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Floating Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className="bg-[#801414] text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md shadow-md tracking-wider">
              {product.badge}
            </span>
          )}
          
          {/* Unit Indicator Badge (Dozen vs. Grams) */}
          {isKabab && (
            <span className="bg-stone-900/90 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
              <Package className="w-3 h-3" /> Per Dozen Rate
            </span>
          )}
          {isNimko && (
            <span className="bg-amber-900/90 text-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
              <Scale className="w-3 h-3" /> In Grams (g)
            </span>
          )}

          {getSpiceBadge(product.spiceLevel)}
        </div>

        {/* Wishlist & Quick view action overlay */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          {onToggleWishlist && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleWishlist(product.id);
              }}
              className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#801414] shadow-md flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
              aria-label="Add to wishlist"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#801414] text-[#801414]' : 'text-[#523B33]'}`} />
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenQuickView(product);
            }}
            className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#2D1A16] shadow-md flex items-center justify-center transition-transform hover:scale-110 active:scale-95 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
            title="Quick view product details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Cooking or Unit badge */}
        <div className="absolute bottom-2.5 left-3 bg-black/65 backdrop-blur-md text-white text-[10px] font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1">
          {isKabab ? (
            <>
              <Clock className="w-3 h-3 text-amber-300" />
              <span>Fry 3–4 mins • Ready from frozen</span>
            </>
          ) : isNimko ? (
            <>
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Fresh Batch • Ready to Eat</span>
            </>
          ) : (
            <>
              <Clock className="w-3 h-3 text-amber-300" />
              <span>Ready in minutes</span>
            </>
          )}
        </div>
      </div>

      {/* Product Information Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating & Category */}
          <div className="flex items-center justify-between text-xs text-[#735A50] mb-1.5">
            <span className="capitalize font-semibold text-[#801414] flex items-center gap-1">
              {isKabab ? '🍢 Frozen Kababs (Dozen)' : isNimko ? '🥨 Mix Nimko (Grams)' : '📦 Value Deal'}
            </span>
            <div className="flex items-center gap-1 bg-[#FAF0DC] px-2 py-0.5 rounded-md font-bold text-[#801414]">
              <Star className="w-3.5 h-3.5 fill-[#D97706] text-[#D97706]" />
              <span>{product.rating}</span>
              <span className="text-[10px] text-[#8C7A70]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-extrabold text-base sm:text-lg text-[#2D1A16] font-display line-clamp-1 group-hover:text-[#801414] transition-colors">
            {product.name}
          </h3>

          {/* Tagline */}
          <p className="text-xs text-[#735A50] mt-1 line-clamp-2 leading-relaxed">
            {product.tagline}
          </p>

          {/* Pack Size Selector Chips */}
          <div className="mt-3.5 pt-3 border-t border-[#F0E8D8]">
            <p className="text-[11px] font-bold text-[#523B33] mb-1.5 flex items-center justify-between">
              <span>{isKabab ? 'Select Dozen Pack:' : isNimko ? 'Select Weight in Grams:' : 'Select Pack Size:'}</span>
              <span className="text-[10px] text-[#801414] font-bold">
                {currentPack.pieces ? `${currentPack.pieces} Pcs (${Math.round(currentPack.pieces / 12 * 10) / 10} Doz)` : `${currentPack.weightGrams}g Pack`}
              </span>
            </p>
            <div className="flex flex-wrap gap-1.5">
              {product.packOptions.map((pack, idx) => {
                const isSelected = selectedPackIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPackIndex(idx);
                    }}
                    className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#801414] text-white shadow-xs'
                        : 'bg-[#FAF6EE] hover:bg-[#F2EBDC] text-[#523B33] border border-[#E8DFC8]'
                    }`}
                  >
                    {pack.size}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Pricing & Add To Cart Button */}
        <div className="mt-4 pt-3 border-t border-[#F0E8D8] flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] text-[#8C7A70] uppercase font-bold tracking-wider">
              {isKabab ? 'Price Per Pack' : isNimko ? 'Price in Grams' : 'Total Price'}
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-extrabold text-[#801414] font-display">
                Rs. {currentPack.price.toLocaleString()}
              </span>
              <span className="text-[11px] font-semibold text-[#735A50]">
                {getUnitSuffix()}
              </span>
              {currentPack.originalPrice && currentPack.originalPrice > currentPack.price && (
                <span className="text-xs text-[#9E8E85] line-through">
                  Rs. {currentPack.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`px-3.5 sm:px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition-all transform active:scale-95 shadow-md cursor-pointer ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-[#D97706] hover:bg-[#B45309] text-slate-950 hover:text-white'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
