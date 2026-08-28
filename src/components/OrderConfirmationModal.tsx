import React from 'react';
import { CheckCircle2, MessageCircle, ArrowRight, Printer, MapPin, Calendar, Clock, Phone, Sparkles } from 'lucide-react';
import { OrderDetails } from '../types';

interface OrderConfirmationModalProps {
  order: OrderDetails | null;
  onClose: () => void;
  onContinueShopping: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  onClose,
  onContinueShopping
}) => {
  if (!order) return null;

  const handleSendToWhatsApp = () => {
    const itemsText = order.items
      .map((item, i) => `${i + 1}. *${item.product.name}* (${item.selectedPack.size}) x${item.quantity} = Rs. ${(item.selectedPack.price * item.quantity).toLocaleString()}`)
      .join('\n');

    const msg = `Salam Nimko & Kabab Co.! I have placed Order *#${order.orderId}*.\n\n👤 *Customer:* ${order.customerName}\n📱 *Phone:* ${order.phone}\n📍 *Address:* ${order.address}, ${order.area}\n📅 *Slot:* ${order.deliveryDate} (${order.timeSlot})\n\n🛒 *Items:*\n${itemsText}\n\n*Total Amount:* Rs. ${order.total.toLocaleString()} (${order.paymentMethod.toUpperCase()})\n\nPlease confirm order receipt and tracking!`;

    window.open(`https://wa.me/923001234567?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      
      <div 
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#E8DFC8] overflow-hidden my-auto p-6 sm:p-8 space-y-6 text-[#2D1A16]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Success Icon & Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-xs font-black uppercase px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Order Confirmed & In Kitchen</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-[#801414]">
            Thank You, {order.customerName}!
          </h2>
          <p className="text-xs sm:text-sm text-[#735A50]">
            Your order <strong>#{order.orderId}</strong> has been received and is being prepared in our cold-chain kitchen.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-[#FAF7F0] rounded-2xl p-5 border border-[#E8DFC8] space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-[#E8DFC8]">
            <div className="space-y-1">
              <span className="text-[#8C7A70] uppercase font-bold text-[10px] block">Delivery Address</span>
              <p className="font-bold text-[#2D1A16] flex items-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#801414] shrink-0 mt-0.5" />
                <span>{order.address}, {order.area}</span>
              </p>
              {order.landmark && <p className="text-[11px] text-[#735A50] pl-4">Landmark: {order.landmark}</p>}
            </div>

            <div className="space-y-1">
              <span className="text-[#8C7A70] uppercase font-bold text-[10px] block">Timing & Payment</span>
              <p className="font-bold text-[#2D1A16] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
                <span>{order.deliveryDate} • {order.timeSlot}</span>
              </p>
              <p className="text-[11px] text-emerald-800 font-bold uppercase pl-4">
                Method: {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod.toUpperCase()}
              </p>
            </div>
          </div>

          {/* Items Recap */}
          <div className="space-y-2">
            <span className="text-[#8C7A70] uppercase font-bold text-[10px] block">Ordered Items:</span>
            {order.items.map((it) => (
              <div key={it.cartItemId} className="flex justify-between items-center text-xs">
                <span>{it.product.name} ({it.selectedPack.size}) x {it.quantity}</span>
                <span className="font-bold text-[#801414]">Rs. {(it.selectedPack.price * it.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-[#E8DFC8] pt-3 flex justify-between items-baseline text-sm font-extrabold">
            <span>Total Payable:</span>
            <span className="text-[#801414] text-lg font-display">Rs. {order.total.toLocaleString()}</span>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={handleSendToWhatsApp}
            className="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>Send Order to WhatsApp for Instant Rider Tracking</span>
          </button>

          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="flex-1 bg-[#FAF6EE] hover:bg-[#F2EBDC] text-[#2D1A16] py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border border-[#E8DFC8] transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onContinueShopping();
              }}
              className="flex-1 bg-[#801414] hover:bg-[#681010] text-white py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Back to Store</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
