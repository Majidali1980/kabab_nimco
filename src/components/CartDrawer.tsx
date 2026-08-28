import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight, 
  Truck, 
  Tag, 
  Check, 
  MessageCircle,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
  appliedPromo: { code: string; discountPercent?: number; discountFixed?: number } | null;
  onApplyPromo: (code: string) => { success: boolean; message: string };
  onRemovePromo: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onContinueShopping,
  appliedPromo,
  onApplyPromo,
  onRemovePromo
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 2000;
  const STANDARD_DELIVERY_FEE = 150;

  const subtotal = items.reduce((sum, item) => sum + item.selectedPack.price * item.quantity, 0);
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountPercent) {
      discountAmount = Math.round((subtotal * appliedPromo.discountPercent) / 100);
    } else if (appliedPromo.discountFixed) {
      discountAmount = Math.min(subtotal, appliedPromo.discountFixed);
    }
  }

  const isFreeDelivery = subtotal >= FREE_SHIPPING_THRESHOLD || appliedPromo?.code === 'FREESHIP';
  const deliveryFee = subtotal === 0 ? 0 : (isFreeDelivery ? 0 : STANDARD_DELIVERY_FEE);
  const total = Math.max(0, subtotal - discountAmount + deliveryFee);

  const amountNeededForFreeShip = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShipPercent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  const handleApplyPromoCode = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');
    
    if (!promoInput.trim()) return;

    const res = onApplyPromo(promoInput.trim().toUpperCase());
    if (res.success) {
      setPromoSuccess(res.message);
      setPromoInput('');
    } else {
      setPromoError(res.message);
    }
  };

  const handleQuickPromo = (code: string) => {
    setPromoError('');
    setPromoSuccess('');
    const res = onApplyPromo(code);
    if (res.success) {
      setPromoSuccess(res.message);
    } else {
      setPromoError(res.message);
    }
  };

  const handleWhatsAppQuickCheckout = () => {
    if (items.length === 0) return;
    const itemsList = items
      .map((item, i) => `${i + 1}. *${item.product.name}* [${item.selectedPack.size}] x ${item.quantity} = Rs. ${(item.selectedPack.price * item.quantity).toLocaleString()}`)
      .join('\n');

    const msg = `Salam Nimko & Kabab Co.! I would like to order directly:\n\n${itemsList}\n\n*Subtotal:* Rs. ${subtotal.toLocaleString()}\n*Delivery:* ${deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee}`}\n${discountAmount > 0 ? `*Discount (${appliedPromo?.code}):* -Rs. ${discountAmount.toLocaleString()}\n` : ''}*Total Payable:* Rs. ${total.toLocaleString()}\n\nPlease confirm my delivery slot in Karachi!`;
    
    window.open(`https://wa.me/923001234567?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden bg-stone-950/70 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      {/* Drawer Panel */}
      <div 
        className="w-full max-w-lg bg-[#FDFBF7] h-full max-h-screen shadow-2xl flex flex-col justify-between border-l border-[#E8DFC8] animate-in slide-in-from-right duration-300 relative z-10"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-[#E8DFC8] flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#801414]/10 text-[#801414] flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-lg text-[#2D1A16] font-display leading-tight">Your Order Cart</h2>
                <span className="bg-[#FAF0DC] text-[#801414] text-[11px] font-bold px-2 py-0.5 rounded-full">
                  {totalItemCount} {totalItemCount === 1 ? 'pack' : 'packs'}
                </span>
              </div>
              <p className="text-xs text-[#735A50]">
                Freshly blast-frozen & sealed Karachi delivery
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#FAF6EE] hover:bg-[#F2EBDC] text-[#2D1A16] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-[#FAF7F0] px-4 py-2.5 border-b border-[#E8DFC8] shrink-0">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <span className="flex items-center gap-1.5 text-[#801414]">
              <Truck className="w-4 h-4 text-[#D97706]" />
              {isFreeDelivery ? (
                <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                  🎉 FREE Cold-Chain Karachi Delivery Unlocked!
                </span>
              ) : (
                <span>Add <strong>Rs. {amountNeededForFreeShip.toLocaleString()}</strong> more for FREE Delivery</span>
              )}
            </span>
            <span className="text-[11px] text-[#70584E] font-extrabold">{freeShipPercent}%</span>
          </div>
          <div className="w-full bg-[#E5DDD0] h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                isFreeDelivery 
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' 
                  : 'bg-gradient-to-r from-[#D97706] to-[#801414]'
              }`}
              style={{ width: `${freeShipPercent}%` }}
            />
          </div>
        </div>

        {/* Items Scrollable List */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-3.5 custom-scrollbar">
          {items.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-[#FAF0DC] flex items-center justify-center text-[#801414] shadow-xs">
                <ShoppingBag className="w-10 h-10 stroke-1" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-[#2D1A16] font-display">Your cart is currently empty</h3>
                <p className="text-xs text-[#735A50] max-w-xs mx-auto">
                  Stock your home freezer with ready-to-fry Chicken Seekh, Shami kababs, and crunchy Karachi Nimko snacks!
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onContinueShopping();
                }}
                className="inline-flex items-center gap-2 bg-[#801414] hover:bg-[#681010] text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer transform hover:scale-102"
              >
                <span>Browse Menu & Deals</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => {
                const itemTotal = item.selectedPack.price * item.quantity;
                return (
                  <div
                    key={item.cartItemId}
                    className="bg-white p-3.5 rounded-2xl border border-[#E8DFC8] flex gap-3.5 shadow-xs hover:border-[#D4C3A3] transition-colors items-start"
                  >
                    {/* Item Thumbnail */}
                    <div className="relative shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-20 h-20 rounded-xl object-cover bg-[#F4EFE6] border border-[#EDE4D4]"
                      />
                      {item.product.spiceLevel && (
                        <span className="absolute bottom-1 right-1 bg-stone-900/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                          {item.product.spiceLevel}
                        </span>
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between min-h-[5rem]">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-bold text-sm text-[#2D1A16] leading-tight truncate">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(item.cartItemId)}
                            className="text-[#9E8E85] hover:text-red-600 p-1 transition-colors cursor-pointer rounded-lg hover:bg-red-50"
                            title="Remove item"
                            aria-label={`Remove ${item.product.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Selected Pack Size Tag */}
                        <div className="mt-1 flex items-center gap-2 flex-wrap">
                          <span className="inline-block bg-[#FAF6EE] border border-[#E5DDD0] text-[#735A50] text-[11px] font-bold px-2 py-0.5 rounded-md">
                            📦 {item.selectedPack.size}
                          </span>
                          <span className="text-[11px] text-[#8C7A70]">
                            Rs. {item.selectedPack.price.toLocaleString()} / pack
                          </span>
                        </div>
                      </div>

                      {/* Quantity Stepper & Price Calculation */}
                      <div className="mt-3 flex items-center justify-between pt-1 border-t border-[#F7F2E8]">
                        <div className="flex items-center bg-[#FAF7F0] border border-[#DDD4CA] rounded-lg overflow-hidden shadow-xs">
                          <button
                            onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-[#523B33] hover:bg-[#EAE1D2] active:bg-[#DCD0BE] transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs font-extrabold text-[#2D1A16]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-[#523B33] hover:bg-[#EAE1D2] active:bg-[#DCD0BE] transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="font-extrabold text-sm sm:text-base text-[#801414] font-display">
                            Rs. {itemTotal.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom Order Summary & Checkout Section */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 bg-white border-t border-[#E8DFC8] space-y-3.5 shrink-0 shadow-2xl">
            
            {/* Promo Code Form */}
            <div className="space-y-1.5">
              <form onSubmit={handleApplyPromoCode} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#8C7A70]" />
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Enter Coupon Code..."
                    className="w-full pl-8 pr-3 py-2 bg-[#FAF7F0] border border-[#DDD4CA] focus:border-[#801414] rounded-xl text-xs uppercase font-bold text-[#2D1A16] placeholder:normal-case placeholder:font-normal placeholder:text-[#9E8E85] outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#2D1A16] hover:bg-[#801414] text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </form>

              {/* Quick Promo Suggestions */}
              {!appliedPromo && (
                <div className="flex items-center gap-1.5 pt-0.5">
                  <span className="text-[10px] text-[#8C7A70] font-medium">Try code:</span>
                  <button
                    type="button"
                    onClick={() => handleQuickPromo('KABAB10')}
                    className="text-[10px] bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded border border-amber-200 cursor-pointer"
                  >
                    KABAB10 (10% Off)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPromo('FREESHIP')}
                    className="text-[10px] bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded border border-emerald-200 cursor-pointer"
                  >
                    FREESHIP
                  </button>
                </div>
              )}

              {promoError && (
                <p className="text-[11px] text-red-600 flex items-center gap-1 font-semibold">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {promoError}
                </p>
              )}
              {promoSuccess && (
                <p className="text-[11px] text-emerald-700 flex items-center gap-1 font-semibold">
                  <Check className="w-3.5 h-3.5 shrink-0" /> {promoSuccess}
                </p>
              )}

              {appliedPromo && (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs text-emerald-800 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    Coupon Applied: {appliedPromo.code}
                  </span>
                  <button
                    type="button"
                    onClick={onRemovePromo}
                    className="text-red-600 hover:text-red-800 font-bold text-[11px] hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Price Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-[#523B33] pt-2 border-t border-[#F0E8D8]">
              <div className="flex justify-between">
                <span>Subtotal ({totalItemCount} items):</span>
                <span className="font-bold text-[#2D1A16]">Rs. {subtotal.toLocaleString()}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Discount ({appliedPromo?.code}):</span>
                  <span>- Rs. {discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  <span>Temperature Controlled Delivery:</span>
                </span>
                <span className="font-bold text-[#2D1A16]">
                  {deliveryFee === 0 ? (
                    <span className="bg-emerald-100 text-emerald-800 font-extrabold uppercase text-[10px] px-2 py-0.5 rounded">
                      FREE
                    </span>
                  ) : (
                    `Rs. ${deliveryFee}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-base font-extrabold text-[#2D1A16] pt-2.5 border-t border-[#F0E8D8]">
                <span>Total Amount:</span>
                <span className="text-[#801414] font-display text-lg">Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                id="btn-proceed-checkout"
                type="button"
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full bg-[#801414] hover:bg-[#681010] text-white py-3.5 px-4 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all transform active:scale-98 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleWhatsAppQuickCheckout}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Instant Order via WhatsApp</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] text-[#8C7A70] text-center pt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cash on Delivery & Instant Raast / Bank Transfer Accepted</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
