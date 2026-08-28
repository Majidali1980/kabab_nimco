import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  CreditCard, 
  Banknote, 
  Phone, 
  User, 
  FileText, 
  CheckCircle2, 
  Truck, 
  ShieldCheck, 
  MessageCircle,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { CartItem, OrderDetails } from '../types';
import { DELIVERY_ZONES } from '../data/deliveryAreas';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  deliveryFee: number;
  total: number;
  appliedPromoCode?: string;
  onOrderSuccess: (order: OrderDetails) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  subtotal,
  discountAmount,
  deliveryFee,
  total,
  appliedPromoCode,
  onOrderSuccess
}) => {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [selectedArea, setSelectedArea] = useState(DELIVERY_ZONES[0].subAreas[0]);
  const [landmark, setLandmark] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('Today (Same-Day Express)');
  const [timeSlot, setTimeSlot] = useState('Evening Slot (6:00 PM – 9:00 PM)');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'raast' | 'jazzcash_easypaisa' | 'card'>('cod');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const allSubAreas = DELIVERY_ZONES.flatMap(z => z.subAreas);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!customerName.trim()) errors.customerName = 'Please enter your full name';
    if (!phone.trim() || phone.replace(/[^0-9]/g, '').length < 10) {
      errors.phone = 'Please enter a valid 11-digit mobile number (e.g. 03001234567)';
    }
    if (!address.trim()) errors.address = 'Please enter your street address / apartment details';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const generatedOrderId = `NK-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder: OrderDetails = {
      orderId: generatedOrderId,
      customerName,
      phone,
      email,
      address,
      area: selectedArea,
      landmark,
      deliveryDate,
      timeSlot,
      paymentMethod,
      notes,
      items,
      subtotal,
      discountAmount,
      deliveryFee,
      total,
      promoCode: appliedPromoCode,
      createdAt: new Date().toISOString(),
      status: 'Received'
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onOrderSuccess(newOrder);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      
      <div 
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-[#E8DFC8] overflow-hidden my-auto max-h-[94vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="bg-[#FAF7F0] border-b border-[#E8DFC8] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#523B33] hover:bg-[#F2EBDC] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-extrabold text-[#2D1A16] font-display">
                Checkout & Cold-Chain Delivery
              </h2>
              <p className="text-xs text-[#735A50]">
                Karachi Doorstep Delivery • Packed with Sub-Zero Gel Packs
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FAF6EE] hover:bg-[#F2EBDC] text-[#2D1A16] flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handlePlaceOrder} className="overflow-y-auto custom-scrollbar p-6 space-y-6 flex-1">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Customer & Delivery Details (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Step 1: Contact Details */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F0] border border-[#E8DFC8] space-y-3">
                <div className="flex items-center gap-2 text-sm font-extrabold text-[#801414]">
                  <User className="w-4 h-4" />
                  <span>1. Contact Information</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#523B33] block mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Fatima Ali"
                      className={`w-full px-3.5 py-2.5 bg-white border ${formErrors.customerName ? 'border-red-500' : 'border-[#DDD4CA]'} rounded-xl text-xs text-[#2D1A16] focus:border-[#801414] outline-none`}
                    />
                    {formErrors.customerName && <p className="text-[10px] text-red-500 mt-1">{formErrors.customerName}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#523B33] block mb-1">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0300 1234567"
                      className={`w-full px-3.5 py-2.5 bg-white border ${formErrors.phone ? 'border-red-500' : 'border-[#DDD4CA]'} rounded-xl text-xs text-[#2D1A16] focus:border-[#801414] outline-none`}
                    />
                    {formErrors.phone && <p className="text-[10px] text-red-500 mt-1">{formErrors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#523B33] block mb-1">Email Address (Optional)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="For delivery invoice receipt"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#DDD4CA] rounded-xl text-xs text-[#2D1A16] focus:border-[#801414] outline-none"
                  />
                </div>
              </div>

              {/* Step 2: Karachi Address & Area */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F0] border border-[#E8DFC8] space-y-3">
                <div className="flex items-center gap-2 text-sm font-extrabold text-[#801414]">
                  <MapPin className="w-4 h-4" />
                  <span>2. Delivery Address in Karachi</span>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#523B33] block mb-1">Karachi Neighborhood / Area *</label>
                  <select
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#DDD4CA] rounded-xl text-xs font-medium text-[#2D1A16] focus:border-[#801414] outline-none"
                  >
                    {allSubAreas.map((area, idx) => (
                      <option key={idx} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#523B33] block mb-1">House / Flat / Street Address *</label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House / Apartment #, Street Name, Block / Phase"
                    className={`w-full px-3.5 py-2.5 bg-white border ${formErrors.address ? 'border-red-500' : 'border-[#DDD4CA]'} rounded-xl text-xs text-[#2D1A16] focus:border-[#801414] outline-none`}
                  />
                  {formErrors.address && <p className="text-[10px] text-red-500 mt-1">{formErrors.address}</p>}
                </div>

                <div>
                  <label className="text-xs font-bold text-[#523B33] block mb-1">Nearby Landmark (Optional)</label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="e.g. Near Boat Basin / Near Imtiaz Super Market"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#DDD4CA] rounded-xl text-xs text-[#2D1A16] focus:border-[#801414] outline-none"
                  />
                </div>
              </div>

              {/* Step 3: Preferred Delivery Slot */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F0] border border-[#E8DFC8] space-y-3">
                <div className="flex items-center gap-2 text-sm font-extrabold text-[#801414]">
                  <Clock className="w-4 h-4" />
                  <span>3. Preferred Delivery Timing</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#523B33] block mb-1">Delivery Day</label>
                    <select
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#DDD4CA] rounded-xl text-xs font-medium text-[#2D1A16] focus:border-[#801414] outline-none"
                    >
                      <option value="Today (Same-Day Express)">Today (Same-Day Express)</option>
                      <option value="Tomorrow">Tomorrow</option>
                      <option value="Weekend (Saturday)">Weekend (Saturday)</option>
                      <option value="Weekend (Sunday)">Weekend (Sunday)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#523B33] block mb-1">Time Slot</label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#DDD4CA] rounded-xl text-xs font-medium text-[#2D1A16] focus:border-[#801414] outline-none"
                    >
                      <option value="Evening Slot (6:00 PM – 9:00 PM)">Evening Slot (6:00 PM – 9:00 PM)</option>
                      <option value="Afternoon Slot (2:00 PM – 5:00 PM)">Afternoon Slot (2:00 PM – 5:00 PM)</option>
                      <option value="Morning Slot (11:00 AM – 1:00 PM)">Morning Slot (11:00 AM – 1:00 PM)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#523B33] block mb-1">Special Delivery Notes (Optional)</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Please ring bell twice / extra spicy chutney preferred"
                    className="w-full px-3.5 py-2 bg-white border border-[#DDD4CA] rounded-xl text-xs text-[#2D1A16] focus:border-[#801414] outline-none"
                  />
                </div>
              </div>

              {/* Step 4: Payment Method */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F0] border border-[#E8DFC8] space-y-3">
                <div className="flex items-center gap-2 text-sm font-extrabold text-[#801414]">
                  <CreditCard className="w-4 h-4" />
                  <span>4. Payment Method</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <label
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'bg-[#801414] text-white border-[#801414] shadow-md'
                        : 'bg-white text-[#2D1A16] border-[#DDD4CA] hover:border-[#801414]/40'
                    }`}
                  >
                    <Banknote className="w-5 h-5" />
                    <div>
                      <div className="text-xs font-bold leading-tight">Cash on Delivery (COD)</div>
                      <div className={`text-[10px] ${paymentMethod === 'cod' ? 'text-amber-200' : 'text-[#735A50]'}`}>
                        Pay rider when receiving cold bag
                      </div>
                    </div>
                  </label>

                  <label
                    onClick={() => setPaymentMethod('raast')}
                    className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      paymentMethod === 'raast'
                        ? 'bg-[#801414] text-white border-[#801414] shadow-md'
                        : 'bg-white text-[#2D1A16] border-[#DDD4CA] hover:border-[#801414]/40'
                    }`}
                  >
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <div>
                      <div className="text-xs font-bold leading-tight">Raast / Instant Bank Transfer</div>
                      <div className={`text-[10px] ${paymentMethod === 'raast' ? 'text-amber-200' : 'text-[#735A50]'}`}>
                        0% fee instant payment
                      </div>
                    </div>
                  </label>

                  <label
                    onClick={() => setPaymentMethod('jazzcash_easypaisa')}
                    className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      paymentMethod === 'jazzcash_easypaisa'
                        ? 'bg-[#801414] text-white border-[#801414] shadow-md'
                        : 'bg-white text-[#2D1A16] border-[#DDD4CA] hover:border-[#801414]/40'
                    }`}
                  >
                    <Phone className="w-5 h-5" />
                    <div>
                      <div className="text-xs font-bold leading-tight">EasyPaisa / JazzCash</div>
                      <div className={`text-[10px] ${paymentMethod === 'jazzcash_easypaisa' ? 'text-amber-200' : 'text-[#735A50]'}`}>
                        Mobile wallet direct transfer
                      </div>
                    </div>
                  </label>

                  <label
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      paymentMethod === 'card'
                        ? 'bg-[#801414] text-white border-[#801414] shadow-md'
                        : 'bg-white text-[#2D1A16] border-[#DDD4CA] hover:border-[#801414]/40'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <div>
                      <div className="text-xs font-bold leading-tight">Debit / Credit Card</div>
                      <div className={`text-[10px] ${paymentMethod === 'card' ? 'text-amber-200' : 'text-[#735A50]'}`}>
                        Visa / Mastercard / PayPak
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary Recap (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#FAF7F0] p-5 rounded-2xl border border-[#E8DFC8] space-y-4 sticky top-0">
                <h3 className="font-extrabold text-base text-[#2D1A16] font-display flex items-center justify-between">
                  <span>Order Summary</span>
                  <span className="text-xs text-[#801414] bg-[#FAF0DC] px-2.5 py-0.5 rounded-md font-bold">
                    {items.length} Items
                  </span>
                </h3>

                {/* Items Mini List */}
                <div className="space-y-2.5 max-h-56 overflow-y-auto custom-scrollbar pr-1">
                  {items.map((item) => (
                    <div key={item.cartItemId} className="flex items-center gap-2.5 text-xs bg-white p-2.5 rounded-xl border border-[#E8DFC8]">
                      <img src={item.product.image} alt={item.product.name} referrerPolicy="no-referrer" className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[#2D1A16] truncate">{item.product.name}</p>
                        <p className="text-[10px] text-[#735A50]">{item.selectedPack.size} x {item.quantity}</p>
                      </div>
                      <div className="font-extrabold text-[#801414]">
                        Rs. {(item.selectedPack.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cost Breakdown */}
                <div className="border-t border-[#E8DFC8] pt-3 space-y-1.5 text-xs text-[#523B33]">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-bold text-[#2D1A16]">Rs. {subtotal.toLocaleString()}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Promo Discount ({appliedPromoCode}):</span>
                      <span>- Rs. {discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Cold-Chain Delivery:</span>
                    <span className="font-bold text-[#2D1A16]">
                      {deliveryFee === 0 ? (
                        <span className="text-emerald-700 font-extrabold uppercase text-[11px]">FREE</span>
                      ) : (
                        `Rs. ${deliveryFee}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-lg font-extrabold text-[#2D1A16] pt-2 border-t border-[#E8DFC8]">
                    <span>Total Due:</span>
                    <span className="text-[#801414] font-display">Rs. {total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Place Order CTA */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#801414] hover:bg-[#681010] text-white py-4 px-4 rounded-xl font-extrabold text-sm shadow-xl transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">Processing Order...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Confirm & Place Order (Rs. {total.toLocaleString()})</span>
                    </>
                  )}
                </button>

                <div className="text-[11px] text-[#735A50] text-center space-y-1 bg-white p-3 rounded-xl border border-[#E8DFC8]">
                  <p className="font-semibold text-emerald-800 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> 100% Satisfaction Guarantee
                  </p>
                  <p className="text-[10px] text-[#8C7A70]">
                    Your order will be dispatched in a sealed thermal bag. Our delivery rider will call upon arrival.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </form>

      </div>
    </div>
  );
};
