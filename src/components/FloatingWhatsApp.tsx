import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Clock, 
  PhoneCall, 
  ShieldCheck, 
  Mic, 
  MicOff, 
  RotateCcw, 
  ArrowLeft, 
  ShoppingBag, 
  CheckCircle2, 
  Package, 
  AlertCircle 
} from 'lucide-react';
import { CartItem } from '../types';
import { useStore } from '../context/StoreContext';

interface FloatingWhatsAppProps {
  cartItems?: CartItem[];
  subtotal?: number;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ cartItems = [], subtotal = 0 }) => {
  const { siteSettings, navbarConfig, orders } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [showRecentOrders, setShowRecentOrders] = useState(false);
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechNotice, setSpeechNotice] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const phoneNumber = siteSettings.whatsappNumber;

  // Cleanup speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // Fetch last 3 orders from orders state (sorted by most recent)
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const defaultTemplates = [
    'Salam! I want to place an order for frozen kababs & nimko.',
    'Is same-day delivery available to my area right now?',
    'What are your most popular kabab deals for tonight?'
  ];

  const handleSendWhatsApp = (textToSend?: string) => {
    const text = textToSend || message || `Salam! I would like to order from ${navbarConfig.brandPrefix} ${navbarConfig.brandSuffix}.`;
    
    let fullMsg = text;
    if (cartItems.length > 0 && !textToSend) {
      const itemsList = cartItems
        .map((item, i) => `${i + 1}. ${item.product.name} (${item.selectedPack.size}) x${item.quantity} = Rs. ${(item.selectedPack.price * item.quantity).toLocaleString()}`)
        .join('\n');
      fullMsg = `${text}\n\n🛒 *My Selected Order Items:*\n${itemsList}\n*Subtotal: Rs. ${subtotal.toLocaleString()}*\n\nPlease confirm availability and delivery!`;
    }

    const encoded = encodeURIComponent(fullMsg);
    window.open(`https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encoded}`, '_blank');
    setIsOpen(false);
    setShowRecentOrders(false);
  };

  const handleReorderViaWhatsApp = (order: typeof recentOrders[0]) => {
    const itemsSummary = order.items
      .map((item, i) => `${i + 1}. *${item.product?.name || 'Item'}* [${item.selectedPack?.size || 'Standard'}] x ${item.quantity} = Rs. ${((item.selectedPack?.price || 0) * item.quantity).toLocaleString()}`)
      .join('\n');

    const msg = `Salam ${navbarConfig.brandPrefix} ${navbarConfig.brandSuffix}! I would like to *RE-ORDER* my previous order (*#${order.orderId}*):\n\n${itemsSummary}\n\n*Total Payable:* Rs. ${order.total.toLocaleString()}\n*Delivery Address:* ${order.address}, ${order.area}\n*Payment Method:* ${order.paymentMethod.toUpperCase()}\n\nPlease confirm and dispatch to my address!`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encoded}`, '_blank');
    setIsOpen(false);
    setShowRecentOrders(false);
  };

  // Browser SpeechRecognition API handler
  const handleToggleVoiceDictation = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechNotice('Voice recognition is not supported in this browser.');
      setTimeout(() => setSpeechNotice(null), 3500);
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsListening(false);
      setSpeechNotice(null);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechNotice('🎙️ Listening... Please speak your order or message now');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          setMessage((prev) => (prev.trim() ? `${prev.trim()} ${transcript}` : transcript));
          setSpeechNotice(`Dictated: "${transcript}"`);
          setTimeout(() => setSpeechNotice(null), 3000);
        }
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.warn('SpeechRecognition error:', event.error);
        if (event.error === 'not-allowed') {
          setSpeechNotice('Microphone access was denied. Please allow microphone permissions in your browser.');
        } else if (event.error === 'no-speech') {
          setSpeechNotice('No speech detected. Please try tapping mic again.');
        } else {
          setSpeechNotice('Could not recognize voice. Please try again.');
        }
        setIsListening(false);
        setTimeout(() => setSpeechNotice(null), 3500);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Error starting voice dictation:', err);
      setIsListening(false);
      setSpeechNotice('Could not access microphone.');
      setTimeout(() => setSpeechNotice(null), 3500);
    }
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
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 bg-white rounded-2xl shadow-2xl border border-[#EEDCC7] overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200 flex flex-col max-h-[560px]">
          {/* Header */}
          <div className="bg-[#075E54] text-white p-4 flex items-center justify-between shrink-0 shadow-xs">
            <div className="flex items-center gap-3">
              {showRecentOrders ? (
                <button
                  onClick={() => setShowRecentOrders(false)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer mr-1"
                  title="Back to chat"
                  aria-label="Back to chat"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              ) : (
                <div className="relative">
                  <div className="w-11 h-11 rounded-full bg-[#128C7E] flex items-center justify-center text-white font-bold text-lg border-2 border-white/40 shadow-inner">
                    NK
                  </div>
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#075E54]"></span>
                </div>
              )}
              <div>
                <h4 className="font-bold text-sm tracking-wide flex items-center gap-1.5">
                  {showRecentOrders ? 'Recent Orders Re-order' : `${navbarConfig.brandPrefix} ${navbarConfig.brandSuffix}`}
                  {!showRecentOrders && <ShieldCheck className="w-4 h-4 text-emerald-300 inline" />}
                </h4>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                  {showRecentOrders ? (
                    <span>1-click re-order to WhatsApp</span>
                  ) : (
                    <>
                      <Clock className="w-3 h-3" /> Replies in ~2 minutes
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Recent Orders Button */}
              <button
                type="button"
                id="btn-whatsapp-recent-orders"
                onClick={() => setShowRecentOrders(!showRecentOrders)}
                className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition-all cursor-pointer shadow-xs ${
                  showRecentOrders
                    ? 'bg-amber-400 text-stone-950 ring-2 ring-amber-300'
                    : 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
                }`}
                title="View recent orders for fast re-ordering"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Recent Orders</span>
                {recentOrders.length > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    showRecentOrders ? 'bg-stone-900 text-amber-300' : 'bg-amber-400 text-stone-900'
                  }`}>
                    {recentOrders.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  setShowRecentOrders(false);
                }}
                className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 cursor-pointer"
                aria-label="Close WhatsApp popup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Voice Notification / Status Toast Banner */}
          {speechNotice && (
            <div className="bg-amber-500 text-stone-950 px-3.5 py-2 text-xs font-bold flex items-center justify-between gap-2 animate-in slide-in-from-top-2 shrink-0 border-b border-amber-600 shadow-xs">
              <div className="flex items-center gap-1.5 truncate">
                {isListening ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping shrink-0" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-stone-950 shrink-0" />
                )}
                <span className="truncate">{speechNotice}</span>
              </div>
              <button
                onClick={() => setSpeechNotice(null)}
                className="text-stone-900 hover:text-black font-bold text-xs p-0.5 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Chat or Recent Orders Body */}
          {showRecentOrders ? (
            /* ================= RECENT ORDERS VIEW ================= */
            <div className="p-3.5 bg-[#F7F4EE] space-y-3 flex-1 overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] uppercase font-extrabold text-[#70584E] tracking-wider flex items-center gap-1">
                  <Package className="w-3.5 h-3.5 text-[#801414]" />
                  Your Last {recentOrders.length} Orders
                </span>
                <span className="text-[10px] text-[#8C7A70]">Tap to re-order in 1 click</span>
              </div>

              {recentOrders.length === 0 ? (
                <div className="bg-white p-6 rounded-xl border border-[#E5DDD5] text-center space-y-2.5 shadow-xs">
                  <div className="w-12 h-12 mx-auto rounded-full bg-amber-50 text-[#801414] flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <h5 className="font-bold text-sm text-[#2D1A16]">No Previous Orders Yet</h5>
                  <p className="text-xs text-[#70584E] leading-relaxed max-w-xs mx-auto">
                    Place your first order through our store or message us directly on WhatsApp to quickly re-order favorites!
                  </p>
                  <button
                    onClick={() => setShowRecentOrders(false)}
                    className="inline-flex items-center gap-1.5 bg-[#801414] hover:bg-[#681010] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer"
                  >
                    <span>Back to Chat & Browse</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {recentOrders.map((ord) => (
                    <div
                      key={ord.orderId}
                      className="bg-white p-3.5 rounded-xl border border-[#E2D8C9] shadow-xs hover:border-[#D4C3A3] transition-all space-y-2.5"
                    >
                      {/* Order Header */}
                      <div className="flex items-center justify-between border-b border-[#F2ECE1] pb-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-xs text-[#2D1A16] font-mono">
                              #{ord.orderId}
                            </span>
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded-md">
                              {ord.status || 'Received'}
                            </span>
                          </div>
                          <span className="text-[10px] text-[#8C7A70]">
                            {new Date(ord.createdAt).toLocaleDateString('en-PK', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="font-extrabold text-sm text-[#801414] font-display">
                            Rs. {ord.total.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Items List */}
                      <div className="space-y-1 bg-[#FAF7F2] p-2 rounded-lg text-xs text-[#523B33]">
                        {ord.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-[11px]">
                            <span className="truncate max-w-[200px] text-[#2D1A16] font-medium">
                              • {item.product?.name || 'Item'} ({item.selectedPack?.size})
                            </span>
                            <span className="font-bold text-[#70584E] shrink-0">
                              x{item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Re-order Action Button */}
                      <button
                        type="button"
                        onClick={() => handleReorderViaWhatsApp(ord)}
                        className="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white py-2 px-3 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-xs transition-transform active:scale-98 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Re-order via WhatsApp (Rs. {ord.total.toLocaleString()})</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* ================= CHAT CONVERSATION VIEW ================= */
            <div className="p-4 bg-[#EFEAE2] space-y-3 flex-1 overflow-y-auto custom-scrollbar">
              {/* Auto greeting bubble */}
              <div className="bg-white p-3 rounded-2xl rounded-tl-xs shadow-sm max-w-[85%] border border-[#E5DDD5]">
                <p className="text-xs text-[#2D1A16] leading-relaxed">
                  Salam! 👋 Welcome to <strong className="text-[#801414]">{navbarConfig.brandPrefix} {navbarConfig.brandSuffix}</strong>
                </p>
                <p className="text-xs text-[#523B33] mt-1">
                  Looking for fresh frozen Chicken/Beef Kababs or crispy Karachi Nimko snacks? Ask questions or speak your order using the microphone!
                </p>
                <span className="text-[9px] text-[#8C7A70] block text-right mt-1">Just now</span>
              </div>

              {cartItems.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-xs text-[#523B33] shadow-xs">
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
                    className="w-full text-left text-xs bg-white hover:bg-emerald-50 hover:border-emerald-300 border border-[#DDD4CA] px-3 py-2 rounded-xl text-[#3A241D] transition-colors cursor-pointer shadow-2xs"
                  >
                    💬 {tpl}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Footer with Microphone Voice Dictation Button */}
          <div className="p-3 bg-white border-t border-[#EEDCC7] flex items-center gap-2 shrink-0">
            <div className="relative flex-1 flex items-center">
              <input
                id="whatsapp-chat-input"
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendWhatsApp()}
                placeholder={isListening ? "Listening... Speak your order" : "Type message or tap mic to speak..."}
                className={`w-full bg-[#F7F3EB] border text-xs text-[#2D1A16] pl-3.5 pr-10 py-2.5 rounded-xl outline-none transition-colors ${
                  isListening 
                    ? 'border-red-500 ring-2 ring-red-400/40 bg-red-50/40' 
                    : 'border-[#DDD4CA] focus:border-emerald-600'
                }`}
              />

              {/* Microphone Voice Dictation Button */}
              <button
                type="button"
                id="btn-whatsapp-microphone"
                onClick={handleToggleVoiceDictation}
                className={`absolute right-1.5 p-1.5 rounded-lg transition-all cursor-pointer ${
                  isListening
                    ? 'bg-red-600 text-white shadow-md animate-pulse'
                    : 'text-[#70584E] hover:text-emerald-700 hover:bg-[#EAE2D5]'
                }`}
                title={isListening ? "Stop listening" : "Dictate your message using microphone"}
                aria-label={isListening ? "Stop voice dictation" : "Start voice dictation"}
              >
                {isListening ? (
                  <MicOff className="w-4 h-4 animate-bounce" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </button>
            </div>

            <button
              onClick={() => handleSendWhatsApp()}
              className="bg-[#25D366] hover:bg-[#1EBE5D] text-white p-2.5 rounded-xl shadow-md transition-transform active:scale-95 cursor-pointer shrink-0"
              title="Send via WhatsApp"
              aria-label="Send via WhatsApp"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-[#FAF6EE] px-4 py-2 text-[10px] text-center text-[#70584E] border-t border-[#EEDCC7] flex items-center justify-center gap-1.5 shrink-0">
            <PhoneCall className="w-3 h-3 text-emerald-700" /> WhatsApp Hotline: {siteSettings.whatsappNumber}
          </div>
        </div>
      )}
    </>
  );
};

