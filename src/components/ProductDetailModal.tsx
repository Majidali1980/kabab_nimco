import React, { useState } from 'react';
import { 
  X, 
  Star, 
  ShoppingBag, 
  MessageCircle, 
  Flame, 
  Clock, 
  ShieldCheck, 
  Snowflake, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  Plus, 
  Minus,
  Sparkles,
  Share2,
  Utensils,
  Package,
  Scale,
  Layers
} from 'lucide-react';
import { Product, PackOption } from '../types';
import { PRODUCTS } from '../data/products';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, selectedPack: PackOption, quantity: number) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onSelectProduct
}) => {
  if (!product) return null;

  const [selectedPackIndex, setSelectedPackIndex] = useState(product.defaultPackIndex ?? 0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<'cooking' | 'ingredients' | 'storage' | 'nutrition'>('cooking');
  const [addedAnimation, setAddedAnimation] = useState(false);

  const images = product.galleryImages && product.galleryImages.length > 0
    ? product.galleryImages
    : [product.image];

  const currentPack = product.packOptions[selectedPackIndex] || product.packOptions[0];

  const isKabab = product.category === 'chicken' || product.category === 'beef' || product.name.toLowerCase().includes('kabab');
  const isNimko = product.category === 'nimko' || product.name.toLowerCase().includes('nimko');

  const handleAddToCart = () => {
    onAddToCart(product, currentPack, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const handleWhatsAppOrder = () => {
    const unitType = isKabab ? 'Dozen / Pieces' : isNimko ? 'Grams (Weight)' : 'Pack';
    const text = `Salam! I want to order from Nimko & Kabab Co.:\n\n🍢 *${product.name}*\n📦 Pack: ${currentPack.size} (${unitType})\n🔢 Quantity: ${quantity} pack(s)\n💰 Total: Rs. ${(currentPack.price * quantity).toLocaleString()}\n\nPlease confirm delivery in Karachi!`;
    window.open(`https://wa.me/923001234567?text=${encodeURIComponent(text)}`, '_blank');
  };

  const relatedProducts = PRODUCTS.filter(p => p.id !== product.id).slice(0, 3);

  // Compute unit rates
  const getUnitRateText = () => {
    if (isKabab && currentPack.pieces) {
      const dozenEquivalent = currentPack.pieces / 12;
      const ratePerDozen = Math.round(currentPack.price / dozenEquivalent);
      return `Rate: Rs. ${ratePerDozen.toLocaleString()} / Dozen (Rs. ${Math.round(currentPack.price / currentPack.pieces)} / pc)`;
    }
    if (isNimko && currentPack.weightGrams) {
      const ratePer100g = Math.round((currentPack.price / currentPack.weightGrams) * 100);
      const ratePerKg = Math.round((currentPack.price / currentPack.weightGrams) * 1000);
      return `Rate: Rs. ${ratePer100g} per 100g (Rs. ${ratePerKg.toLocaleString()} / 1000g)`;
    }
    return '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-[#E8DFC8] overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Modal Top Bar with Close Button */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-[#F0E8D8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#801414] bg-[#FAF0DC] px-2.5 py-1 rounded-md flex items-center gap-1">
              {isKabab ? (
                <>
                  <Package className="w-3.5 h-3.5" />
                  <span>Frozen Kababs • Priced Per Dozen</span>
                </>
              ) : isNimko ? (
                <>
                  <Scale className="w-3.5 h-3.5" />
                  <span>Karachi Nimko • Priced in Grams</span>
                </>
              ) : (
                <span>Value Combo Deal</span>
              )}
            </span>
            {product.isBestseller && (
              <span className="text-xs font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded-md">
                ⭐ Bestseller
              </span>
            )}
          </div>
          
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#FAF6EE] hover:bg-[#F2EBDC] text-[#2D1A16] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 md:p-8 overflow-y-auto custom-scrollbar space-y-8">
          
          {/* Main Product Presentation (Gallery + Info Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
            
            {/* Left Column: Image Gallery & Thumbnails (5 Cols) */}
            <div className="md:col-span-5 space-y-3">
              {/* Main Active Image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#F4EFE6] border border-[#E8DFC8] shadow-inner">
                <img
                  src={images[activeImageIndex] || product.image}
                  alt={product.altText}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transition-all duration-300"
                />
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full flex items-center gap-1.5 font-medium">
                  {isKabab ? (
                    <>
                      <Snowflake className="w-3.5 h-3.5 text-amber-300" />
                      <span>Blast Frozen at -18°C</span>
                    </>
                  ) : isNimko ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Fresh Batch In Sealed Gram Packs</span>
                    </>
                  ) : (
                    <>
                      <Package className="w-3.5 h-3.5 text-amber-300" />
                      <span>Combo Bundle</span>
                    </>
                  )}
                </div>

                {/* Image Size / Thumbnail Info overlay */}
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded-md font-mono">
                  800 × 800 px
                </div>
              </div>

              {/* Thumbnails list with indicator */}
              {images.length > 1 && (
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-[#735A50] flex items-center justify-between">
                    <span>Product Gallery Thumbnails ({images.length}):</span>
                    <span className="text-[10px] text-[#801414] font-semibold">Click thumbnail to view</span>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImageIndex(i)}
                        className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                          activeImageIndex === i ? 'border-[#801414] scale-95 shadow-md ring-2 ring-[#801414]/30' : 'border-[#E8DFC8] opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt={`Thumbnail ${i + 1}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        <span className="absolute bottom-0.5 right-0.5 bg-black/70 text-white text-[8px] font-bold px-1 rounded">
                          {i + 1}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trust Badges */}
              <div className="bg-[#FAF7F0] p-3.5 rounded-2xl border border-[#E8DFC8] space-y-2 text-xs text-[#523B33]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">100% Certified Halal Ingredients</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#D97706] shrink-0" />
                  <span>
                    {isKabab ? 'Fry directly from frozen in 3–4 minutes' : 'Crispy & ready to serve immediately with tea'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Zero harmful chemicals, MSG or artificial colors</span>
                </div>
              </div>
            </div>

            {/* Right Column: Title, Pricing, Pack Selector & Action Buttons (7 Cols) */}
            <div className="md:col-span-7 flex flex-col justify-between space-y-5">
              <div>
                {/* Rating & Urdu Name */}
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 bg-[#FAF0DC] px-2.5 py-1 rounded-lg">
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="font-extrabold text-xs text-[#801414]">{product.rating}</span>
                    <span className="text-[11px] text-[#70584E]">({product.reviewCount} customer reviews)</span>
                  </div>
                  {product.urduName && (
                    <span className="text-sm font-bold text-[#801414] font-urdu">
                      {product.urduName}
                    </span>
                  )}
                </div>

                {/* Main Heading */}
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2D1A16] font-display mt-2 leading-tight">
                  {product.name}
                </h1>

                {/* Subtitle / Tagline */}
                <p className="text-sm text-[#735A50] mt-1 font-medium leading-relaxed">
                  {product.tagline}
                </p>

                {/* Full Description */}
                <p className="text-xs sm:text-sm text-[#4A352F] mt-3 leading-relaxed">
                  {product.description}
                </p>

                {/* Pack Size Selector with Dozen / Gram Highlight */}
                <div className="mt-5 p-4 rounded-2xl bg-[#FAF7F0] border border-[#E8DFC8]">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-[#2D1A16] uppercase tracking-wider">
                      {isKabab ? 'Select Dozen / Pieces Pack:' : isNimko ? 'Select Weight in Grams:' : 'Select Pack Size:'}
                    </label>
                    <span className="text-[11px] font-bold text-[#801414] bg-[#FAF0DC] px-2 py-0.5 rounded">
                      {getUnitRateText()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {product.packOptions.map((pack, idx) => {
                      const isSelected = selectedPackIndex === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedPackIndex(idx)}
                          className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#801414] text-white border-[#801414] shadow-md'
                              : 'bg-white text-[#2D1A16] border-[#E0D5C1] hover:border-[#801414]/40'
                          }`}
                        >
                          <div className="text-xs font-bold leading-tight">{pack.size}</div>
                          <div className="text-[10px] mt-0.5 opacity-80">
                            {pack.pieces ? `${pack.pieces} Pcs (${pack.weightGrams}g)` : `${pack.weightGrams} Grams`}
                          </div>
                          <div className={`text-xs font-extrabold mt-1.5 ${isSelected ? 'text-amber-300' : 'text-[#801414]'}`}>
                            Rs. {pack.price.toLocaleString()}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Price Display & Stepper */}
                <div className="mt-5 flex flex-wrap items-center justify-between gap-4 p-3.5 bg-amber-50/60 rounded-2xl border border-amber-200/70">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#8C7A70] tracking-wider block">
                      {isKabab ? 'Total Price for Kababs' : isNimko ? 'Total Price in Grams' : 'Total Price'}
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-extrabold text-[#801414] font-display">
                        Rs. {(currentPack.price * quantity).toLocaleString()}
                      </span>
                      {currentPack.originalPrice && (
                        <span className="text-sm text-[#9E8E85] line-through">
                          Rs. {(currentPack.originalPrice * quantity).toLocaleString()}
                        </span>
                      )}
                      <span className="text-xs text-[#735A50] font-semibold">
                        ({quantity} × {currentPack.size})
                      </span>
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-[#DDD4CA] bg-white rounded-xl overflow-hidden shadow-xs">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 flex items-center justify-center text-stone-600 hover:bg-[#FAF0DC] hover:text-[#801414] transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-9 text-center font-extrabold text-xs text-[#2D1A16]">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-stone-600 hover:bg-[#FAF0DC] hover:text-[#801414] transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    className={`py-3 px-6 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all transform active:scale-95 shadow-md cursor-pointer ${
                      addedAnimation
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#801414] hover:bg-[#681010] text-white'
                    }`}
                  >
                    {addedAnimation ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add To Cart (Rs. {(currentPack.price * quantity).toLocaleString()})</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleWhatsAppOrder}
                    className="py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Quick Order on WhatsApp</span>
                  </button>
                </div>

              </div>
            </div>

          </div>

          {/* Accordion Tabs for Cooking, Ingredients, Storage */}
          <div className="pt-6 border-t border-[#E8DFC8]">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              <button
                onClick={() => setOpenAccordion('cooking')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  openAccordion === 'cooking'
                    ? 'bg-[#801414] text-white shadow-xs'
                    : 'bg-[#FAF7F0] text-[#5C453D] hover:bg-[#F2EBDC]'
                }`}
              >
                🍳 Cooking Guide
              </button>

              <button
                onClick={() => setOpenAccordion('ingredients')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  openAccordion === 'ingredients'
                    ? 'bg-[#801414] text-white shadow-xs'
                    : 'bg-[#FAF7F0] text-[#5C453D] hover:bg-[#F2EBDC]'
                }`}
              >
                🌿 Ingredients
              </button>

              <button
                onClick={() => setOpenAccordion('storage')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  openAccordion === 'storage'
                    ? 'bg-[#801414] text-white shadow-xs'
                    : 'bg-[#FAF7F0] text-[#5C453D] hover:bg-[#F2EBDC]'
                }`}
              >
                ❄️ Storage & Shelf Life
              </button>

              <button
                onClick={() => setOpenAccordion('nutrition')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  openAccordion === 'nutrition'
                    ? 'bg-[#801414] text-white shadow-xs'
                    : 'bg-[#FAF7F0] text-[#5C453D] hover:bg-[#F2EBDC]'
                }`}
              >
                📊 Nutrition Facts
              </button>
            </div>

            {/* Accordion Content Panel */}
            <div className="bg-[#FAF7F0] p-5 rounded-2xl border border-[#E8DFC8]">
              {openAccordion === 'cooking' && (
                <div className="space-y-4">
                  <h4 className="font-bold text-sm text-[#2D1A16] flex items-center gap-2">
                    <Flame className="w-4 h-4 text-[#D97706]" />
                    <span>How to Fry / Cook {product.name}</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {product.cookingInstructions.map((inst, idx) => (
                      <div key={idx} className="bg-white p-3.5 rounded-xl border border-[#E0D5C1] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-[#801414]">{inst.method}</span>
                          <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">{inst.time}</span>
                        </div>
                        <ul className="text-[11px] text-[#523B33] space-y-1 list-disc pl-4">
                          {inst.steps.map((st, sIdx) => (
                            <li key={sIdx}>{st}</li>
                          ))}
                        </ul>
                        {inst.tips && (
                          <div className="text-[10px] text-[#801414] bg-amber-50 p-1.5 rounded-lg font-medium border border-amber-200">
                            💡 {inst.tips}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {openAccordion === 'ingredients' && (
                <div className="space-y-2">
                  <h4 className="font-bold text-sm text-[#2D1A16]">Crafted with Pure, Unadulterated Ingredients:</h4>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {product.ingredients.map((ing, idx) => (
                      <span key={idx} className="bg-white px-3 py-1.5 rounded-xl text-xs font-semibold text-[#4A352F] border border-[#DDD4CA] shadow-2xs">
                        ✓ {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {openAccordion === 'storage' && (
                <div className="space-y-2 text-xs text-[#523B33]">
                  <p><strong>Storage:</strong> {product.storageInfo}</p>
                  <p><strong>Shelf Life:</strong> {product.shelfLife}</p>
                  <p className="text-[11px] text-[#735A50] mt-1">
                    * Our products are prepared in pristine hygienic conditions and flash frozen at peak freshness.
                  </p>
                </div>
              )}

              {openAccordion === 'nutrition' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-white p-3 rounded-xl border border-[#DDD4CA] text-center">
                    <div className="text-[10px] text-[#8C7A70] uppercase font-bold">Calories</div>
                    <div className="text-base font-extrabold text-[#801414]">{product.nutritionPer100g.calories} kcal</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-[#DDD4CA] text-center">
                    <div className="text-[10px] text-[#8C7A70] uppercase font-bold">Protein</div>
                    <div className="text-base font-extrabold text-[#2D1A16]">{product.nutritionPer100g.protein}</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-[#DDD4CA] text-center">
                    <div className="text-[10px] text-[#8C7A70] uppercase font-bold">Carbohydrates</div>
                    <div className="text-base font-extrabold text-[#2D1A16]">{product.nutritionPer100g.carbs}</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-[#DDD4CA] text-center">
                    <div className="text-[10px] text-[#8C7A70] uppercase font-bold">Fat</div>
                    <div className="text-base font-extrabold text-[#2D1A16]">{product.nutritionPer100g.fat}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Products Bar */}
          {relatedProducts.length > 0 && (
            <div className="pt-6 border-t border-[#E8DFC8]">
              <h3 className="font-bold text-base text-[#2D1A16] font-display mb-4">
                You Might Also Love:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedProducts.map((p) => {
                  const pIsKabab = p.category === 'chicken' || p.category === 'beef';
                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        onSelectProduct(p);
                        setSelectedPackIndex(p.defaultPackIndex ?? 0);
                        setActiveImageIndex(0);
                      }}
                      className="p-3 bg-[#FAF7F0] hover:bg-white rounded-2xl border border-[#E8DFC8] hover:border-[#801414]/40 transition-all cursor-pointer flex items-center gap-3 group"
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-xl object-cover border border-[#E0D5C1] group-hover:scale-105 transition-transform shrink-0"
                      />
                      <div className="overflow-hidden">
                        <div className="font-bold text-xs text-[#2D1A16] group-hover:text-[#801414] truncate">
                          {p.name}
                        </div>
                        <div className="text-[11px] font-extrabold text-[#801414] mt-0.5">
                          Rs. {p.packOptions[0]?.price.toLocaleString()} {pIsKabab ? '/ Doz' : '/ Grams'}
                        </div>
                        <div className="text-[10px] text-[#8C7A70] truncate">{p.packOptions[0]?.size}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
