import React, { useState } from 'react';
import { MessageCircle, X, Send, Clock, PhoneCall, ShieldCheck } from 'lucide-react';
import { CartItem } from '../types';
import { useStore } from '../context/StoreContext';

interface FloatingWhatsAppProps {
  cartItems?: CartItem[];
  subtotal?: number;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ cartItems = [], subtotal = 0 }) => {
  const { siteSettings, navbarConfig } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const phoneNumber = siteSettings.whatsappNumber;

  const defaultTemplates = [
    'Salam! I want to place an order for frozen kababs & nimko.',
    'Is same-day delivery available to my area right now?',
    'What are your most popular kabab deals for tonight?'
  ];

  const handleSendWhatsApp = (textToSend?: string) => {
    const text = textToSend || message || `Salam! I would like to order from ${navbarConfig.brandPrefix} ${navbarConfig.brandSuffix}.`;
    
    let fullMsg = text;
    if (cartItems.length > 0) {
      const itemsList = cartItems
        .map((item, i) => `${i + 1}. ${item.product.name} (${item.selectedPack.size}) x${item.quantity} = Rs. ${item.selectedPack.price * item.quantity}`)
        .join('\n');
      fullMsg = `${text}\n\n🛒 *My Selected Order Items:*\n${itemsList}\n*Subtotal: Rs. ${subtotal.toLocaleString()}*\n\nPlease confirm availability and delivery!`;
    }

    const encoded = encodeURIComponent(fullMsg);
    window.open(`https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encoded}`, '_blank');
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
        {/* Helper tooltip badge when closed */}
        {!isOpen && (
          <div className="mb-2 hidden sm:flex items-center gap-2 bg-[#2D1A16] text-[#FDFBF7] px-3.5 py-1.5 rounded-full text-xs font-medium shadow-xl animate-bounce border border-[#E69500]/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live on WhatsApp • Instant Order</span>
          </div>
        )}

        <button
          id="btn-floating-whatsapp"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Order via WhatsApp"
          className="group relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-emerald-600 text-white shadow-2xl hover:bg-emerald-700 transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-emerald-400/40 cursor-pointer"
        >
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-400 border-2 border-white"></span>
          </span>

          {isOpen ? (
            <X className="w-7 h-7 transition-transform duration-200 rotate-0" />
          ) : (
            <MessageCircle className="w-8 h-8 fill-current transition-transform duration-200 group-hover:scale-110" />
          )}
        </button>
      </div>

      {/* WhatsApp Popup Card */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 bg-white rounded-2xl shadow-2xl border border-[#EEDCC7] overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-[#075E54] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-full bg-[#128C7E] flex items-center justify-center text-white font-bold text-lg border-2 border-white/40">
                  NK
                </div>
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#075E54]"></span>
              </div>
              <div>
                <h4 className="font-bold text-sm tracking-wide flex items-center gap-1.5">
                  {navbarConfig.brandPrefix} {navbarConfig.brandSuffix}
                  <ShieldCheck className="w-4 h-4 text-emerald-300 inline" />
                </h4>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Replies in ~2 minutes
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 bg-[#EFEAE2] space-y-3 max-h-[360px] overflow-y-auto custom-scrollbar">
            {/* Auto greeting bubble */}
            <div className="bg-white p-3 rounded-2xl rounded-tl-xs shadow-sm max-w-[85%] border border-[#E5DDD5]">
              <p className="text-xs text-[#2D1A16] leading-relaxed">
                Salam! 👋 Welcome to <strong className="text-[#801414]">{navbarConfig.brandPrefix} {navbarConfig.brandSuffix}</strong>
              </p>
              <p className="text-xs text-[#523B33] mt-1">
                Looking for fresh frozen Chicken/Beef Kababs or crispy Karachi Nimko snacks? Ask questions or send your order directly!
              </p>
              <span className="text-[9px] text-[#8C7A70] block text-right mt-1">Just now</span>
            </div>

            {cartItems.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-xs text-[#523B33]">
                <p className="font-semibold text-[#801414] flex items-center gap-1">
                  🛒 Cart Ready ({cartItems.length} items • Rs. {subtotal.toLocaleString()})
                </p>
                <p className="text-[11px] text-[#70584E] mt-0.5">
                  Click below to send your cart directly to WhatsApp for rapid dispatch!
                </p>
              </div>
            )}

            {/* Quick action chips */}
            <div className="space-y-1.5 pt-1">
              <p className="text-[10px] uppercase font-bold text-[#8C7A70] tracking-wider px-1">Quick prompts:</p>
              {defaultTemplates.map((tpl, i) => (
                <button
                  key={i}
                  onClick={() => handleSendWhatsApp(tpl)}
                  className="w-full text-left text-xs bg-white hover:bg-emerald-50 hover:border-emerald-300 border border-[#DDD4CA] px-3 py-2 rounded-xl text-[#3A241D] transition-colors cursor-pointer"
                >
                  💬 {tpl}
                </button>
              ))}
            </div>
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-[#EEDCC7] flex items-center gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendWhatsApp()}
              placeholder="Type your message or order..."
              className="flex-1 bg-[#F7F3EB] border border-[#DDD4CA] focus:border-emerald-600 text-xs text-[#2D1A16] px-3.5 py-2.5 rounded-xl outline-none"
            />
            <button
              onClick={() => handleSendWhatsApp()}
              className="bg-[#25D366] hover:bg-[#1EBE5D] text-white p-2.5 rounded-xl shadow-md transition-transform active:scale-95 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-[#FAF6EE] px-4 py-2 text-[10px] text-center text-[#70584E] border-t border-[#EEDCC7] flex items-center justify-center gap-1.5">
            <PhoneCall className="w-3 h-3 text-emerald-700" /> WhatsApp Hotline: {siteSettings.whatsappNumber}
          </div>
        </div>
      )}
    </>
  );
};
