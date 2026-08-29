import React, { useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Bell, ShoppingBag, X, MessageCircle, ArrowRight, Volume2, VolumeX } from 'lucide-react';

interface NewOrderToastProps {
  onOpenAdminOrders?: () => void;
}

export const NewOrderToast: React.FC<NewOrderToastProps> = ({ onOpenAdminOrders }) => {
  const { 
    lastNewOrderNotification, 
    dismissOrderNotification, 
    isOrderSoundEnabled, 
    toggleOrderSound,
    siteSettings 
  } = useStore();

  useEffect(() => {
    if (lastNewOrderNotification) {
      const timer = setTimeout(() => {
        dismissOrderNotification();
      }, 12000);
      return () => clearTimeout(timer);
    }
  }, [lastNewOrderNotification, dismissOrderNotification]);

  if (!lastNewOrderNotification) return null;

  const order = lastNewOrderNotification;
  const cleanPhone = order.phone.replace(/[^0-9]/g, '');
  const phoneWithCountry = cleanPhone.startsWith('92') ? cleanPhone : `92${cleanPhone.replace(/^0/, '')}`;

  const handleWhatsAppCustomer = () => {
    const msg = `Salam ${order.customerName}! 👋\n\nYour order *#${order.orderId}* for *Rs. ${order.total.toLocaleString()}* has been received at *${siteSettings.brandName}*.\n\nItems: ${order.items.map(i => `${i.product.name} x${i.quantity}`).join(', ')}\nDelivery Address: ${order.address}, ${order.area}\n\nOur kitchen is preparing your fresh order now!`;
    window.open(`https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <aside 
      aria-label="New order notification"
      className="fixed top-20 right-4 sm:right-6 z-50 max-w-md w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border-2 border-emerald-500 overflow-hidden animate-in slide-in-from-top-4 duration-300"
    >
      <div className="bg-emerald-600 text-white px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-300"></span>
          </span>
          <h4 className="font-bold text-xs tracking-wider uppercase flex items-center gap-1.5 font-display">
            <Bell className="w-3.5 h-3.5" />
            New Order Notification Received!
          </h4>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggleOrderSound}
            className="p-1 rounded-md bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
            title={isOrderSoundEnabled ? 'Audio alerts are ON (Click to mute)' : 'Audio alerts are MUTED (Click to enable)'}
            aria-label={isOrderSoundEnabled ? 'Mute order notification sounds' : 'Enable order notification sounds'}
          >
            {isOrderSoundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-red-200" />}
          </button>

          <button
            type="button"
            onClick={dismissOrderNotification}
            className="p-1 rounded-md bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
            aria-label="Close new order alert"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3 bg-gradient-to-b from-emerald-50/40 to-white">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-red-700">#{order.orderId}</span>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                {order.status}
              </span>
            </div>
            <div className="font-bold text-sm text-stone-900 mt-0.5">{order.customerName}</div>
            <div className="text-xs text-stone-500">{order.phone} • {order.area}</div>
          </div>

          <div className="text-right">
            <div className="text-xs text-stone-400 font-medium">Total Bill</div>
            <div className="font-extrabold text-base text-stone-900 font-mono">
              Rs. {order.total.toLocaleString()}
            </div>
            <div className="text-[10px] text-stone-500 uppercase">{order.paymentMethod.replace('_', ' ')}</div>
          </div>
        </div>

        {/* Order items snapshot */}
        <div className="bg-stone-50 rounded-xl p-2.5 border border-stone-200 text-xs text-stone-700 space-y-1 max-h-24 overflow-y-auto">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between items-center text-[11px]">
              <span className="truncate pr-2 font-medium">
                • {item.product?.name || 'Item'} ({item.selectedPack?.size})
              </span>
              <span className="font-bold text-stone-900 shrink-0">x{item.quantity}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={handleWhatsAppCustomer}
            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-3 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp Customer</span>
          </button>

          {onOpenAdminOrders && (
            <button
              type="button"
              onClick={() => {
                dismissOrderNotification();
                onOpenAdminOrders();
              }}
              className="inline-flex items-center justify-center gap-1 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold py-2 px-3 rounded-xl transition-all cursor-pointer"
            >
              <span>View in Admin</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
