import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  MessageCircle,
  Trash2,
  Clock,
  CheckCircle2,
  Truck,
  Package,
  ExternalLink,
  Filter,
  Eye,
  X,
  Printer,
  Edit2,
  DollarSign,
  TrendingUp,
  User,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
  Volume2,
  VolumeX,
  Bell,
  History,
  RotateCcw,
  Sparkles,
  Send,
  UserCheck,
  Award,
  QrCode
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { OrderDetails } from '../../types';

export const AdminOrders: React.FC = () => {
  const { 
    orders, 
    updateOrder, 
    updateOrderStatus, 
    deleteOrder, 
    siteSettings,
    isOrderSoundEnabled,
    toggleOrderSound,
    simulateNewOrderAlert
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const [isEditingOrder, setIsEditingOrder] = useState<OrderDetails | null>(null);

  // Customer History Modal State
  const [historyCustomerPhone, setHistoryCustomerPhone] = useState<string | null>(null);

  // Customer Direct WhatsApp Message Composer Modal State
  const [directWhatsAppOrder, setDirectWhatsAppOrder] = useState<OrderDetails | null>(null);
  const [whatsAppTemplateType, setWhatsAppTemplateType] = useState<
    'confirm' | 'dispatch' | 'delivered' | 'loyalty' | 'custom'
  >('confirm');
  const [customWhatsAppText, setCustomWhatsAppText] = useState('');

  // Filtered orders
  const filteredOrders = orders.filter(o => {
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchPayment = paymentFilter === 'all' || (o.paymentStatus || 'Paid') === paymentFilter;
    const matchSearch =
      o.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.phone.includes(searchTerm) ||
      o.area.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchPayment && matchSearch;
  });

  const getStatusColor = (status: OrderDetails['status']) => {
    switch (status) {
      case 'Received':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Preparing':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Out for Delivery':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-stone-50 text-stone-700 border-stone-200';
    }
  };

  // Open Direct WhatsApp modal
  const handleOpenDirectWhatsApp = (order: OrderDetails, template: 'confirm' | 'dispatch' | 'delivered' | 'loyalty' | 'custom' = 'confirm') => {
    setDirectWhatsAppOrder(order);
    setWhatsAppTemplateType(template);
    
    // Generate initial message
    const msg = generateWhatsAppMessage(order, template);
    setCustomWhatsAppText(msg);
  };

  const generateWhatsAppMessage = (
    order: OrderDetails, 
    type: 'confirm' | 'dispatch' | 'delivered' | 'loyalty' | 'custom'
  ) => {
    const itemsList = order.items.map(i => `• ${i.product?.name || 'Item'} (${i.selectedPack?.size}) x${i.quantity}`).join('\n');
    const riderName = order.assignedRider?.name || 'Assigned Express Rider';
    const riderPhone = order.assignedRider?.phone ? `(${order.assignedRider.phone})` : '';

    switch (type) {
      case 'confirm':
        return `Salam ${order.customerName}! 👋\n\nYour order *#${order.orderId}* has been *CONFIRMED* at *${siteSettings.brandName}*!\n\n📋 *Order Summary:*\n${itemsList}\n\n💰 *Total Amount:* Rs. ${order.total.toLocaleString()} (${(order.paymentStatus || 'Paid').toUpperCase()})\n📍 *Delivery Address:* ${order.address}, ${order.area}\n⏰ *Delivery Slot:* ${order.deliveryDate} (${order.timeSlot})\n\nOur kitchen has started packing your frozen kababs & fresh nimko with ice-gel packs. We will notify you once dispatched!`;
      
      case 'dispatch':
        return `Salam ${order.customerName}! 🚴\n\nGreat news! Your order *#${order.orderId}* is now *OUT FOR DELIVERY* with our rider:\n\n👤 *Rider:* ${riderName} ${riderPhone}\n📍 *Destination:* ${order.address}, ${order.area}\n💵 *Payment Due:* Rs. ${order.paymentStatus === 'Paid' ? '0 (Already Paid Online)' : `${order.total.toLocaleString()} (Cash on Delivery)`}\n\nPlease ensure someone is available to receive the package. Thank you!`;

      case 'delivered':
        return `Salam ${order.customerName}! 🎉\n\nYour order *#${order.orderId}* has been marked *DELIVERED*! We hope you love the taste and crispiness.\n\n❄️ *Storage Tip:* Please store your frozen kababs immediately in the freezer at -18°C.\n\n⭐ *Feedback:* How was your experience today? We'd love to hear your thoughts! Reply directly to this WhatsApp message.`;

      case 'loyalty':
        return `Salam ${order.customerName}! 🎁\n\nAs a valued customer of *${siteSettings.brandName}*, here is an exclusive *15% OFF VIP Promo Code* for your next frozen kababs or fresh nimko order:\n\n🏷️ Use Code: *VIP15*\n\nOrder online anytime at our store or reply right here to claim your special discount!`;

      case 'custom':
      default:
        return `Salam ${order.customerName}! Regarding your order *#${order.orderId}* with *${siteSettings.brandName}*...`;
    }
  };

  const handleSendDirectWhatsAppNow = () => {
    if (!directWhatsAppOrder) return;
    const cleanPhone = directWhatsAppOrder.phone.replace(/[^0-9]/g, '');
    const phoneWithCountry = cleanPhone.startsWith('92') ? cleanPhone : `92${cleanPhone.replace(/^0/, '')}`;
    
    window.open(`https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(customWhatsAppText)}`, '_blank');
    setDirectWhatsAppOrder(null);
  };

  const handleSaveOrderEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditingOrder) return;
    updateOrder(isEditingOrder.orderId, isEditingOrder);
    setIsEditingOrder(null);
    if (selectedOrder && selectedOrder.orderId === isEditingOrder.orderId) {
      setSelectedOrder(isEditingOrder);
    }
  };

  // Top summary metrics
  const totalRevenue = orders.filter(o => o.status !== 'Cancelled').reduce((sum, o) => sum + (o.total || 0), 0);
  const totalProfit = orders.filter(o => o.status !== 'Cancelled').reduce((sum, o) => sum + (o.profit || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'Received' || o.status === 'Preparing').length;

  // Selected customer history calculations
  const customerHistoryOrders = historyCustomerPhone
    ? orders.filter(
        o => o.phone.replace(/[^0-9]/g, '') === historyCustomerPhone.replace(/[^0-9]/g, '')
      ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    : [];

  const customerTotalSpent = customerHistoryOrders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const customerAOV = customerHistoryOrders.length > 0
    ? Math.round(customerTotalSpent / Math.max(1, customerHistoryOrders.filter(o => o.status !== 'Cancelled').length))
    : 0;

  // Aggregate favorite items for customer history
  const customerFavoriteItemsMap: { [name: string]: number } = {};
  customerHistoryOrders.forEach(o => {
    o.items.forEach(it => {
      const name = it.product?.name || 'Item';
      customerFavoriteItemsMap[name] = (customerFavoriteItemsMap[name] || 0) + it.quantity;
    });
  });

  const sortedCustomerFavorites = Object.entries(customerFavoriteItemsMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-red-100 text-red-800 rounded-xl">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-900">Customer Orders & Dispatch Ledger</h2>
            <p className="text-xs text-stone-500">
              Live tracking, customer order history, direct WhatsApp messaging, POS sound alerts & dispatch.
            </p>
          </div>
        </div>

        {/* Audio Alert Chime & Test Simulator Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={toggleOrderSound}
            className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border transition-all cursor-pointer shadow-2xs ${
              isOrderSoundEnabled
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                : 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200'
            }`}
            title={isOrderSoundEnabled ? 'Audio alerts are ON (Click to mute)' : 'Audio alerts are MUTED (Click to enable)'}
          >
            {isOrderSoundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-emerald-600" />
                <span>Audio Alert: Active</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-stone-400" />
                <span>Audio Alert: Muted</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={simulateNewOrderAlert}
            className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-xs active:scale-95 cursor-pointer"
            title="Test the POS audio chime and trigger a simulated incoming order"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Test Order Chime</span>
          </button>

          <div className="text-xs font-bold text-red-900 bg-red-50 px-3.5 py-2 rounded-xl border border-red-200 font-mono">
            {orders.length} Total Orders
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-3.5">
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">Gross Sales Revenue</div>
            <div className="text-xl font-black text-stone-900 font-mono mt-0.5">
              {siteSettings.currency} {totalRevenue.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-3.5">
          <div className="p-3 bg-red-50 text-red-700 rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">Calculated Gross Profit</div>
            <div className="text-xl font-black text-red-700 font-mono mt-0.5">
              {siteSettings.currency} {totalProfit.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-3.5">
          <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">Kitchen & Dispatch Queue</div>
            <div className="text-xl font-black text-amber-700 font-mono mt-0.5">
              {pendingOrders} Active Orders
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by Order ID, Customer Name, Phone, Area..."
            className="w-full pl-10 pr-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-red-600 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
            {['all', 'Received', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  statusFilter === st
                    ? 'bg-red-700 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Payment filter */}
          <select
            value={paymentFilter}
            onChange={e => setPaymentFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-stone-100 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700"
          >
            <option value="all">All Payments</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending / COD</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
          <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto" />
          <h4 className="font-bold text-sm text-stone-900">No Orders Found</h4>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            {orders.length === 0
              ? 'When customers complete checkout on your storefront, orders will appear here in real time with customer contact details and itemized totals.'
              : 'No orders match your current filter or search criteria.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-3.5 px-4">Order ID & Date</th>
                  <th className="py-3.5 px-4">Customer & History</th>
                  <th className="py-3.5 px-4">Delivery Slot & Area</th>
                  <th className="py-3.5 px-4">Items & Bill</th>
                  <th className="py-3.5 px-4 text-right">Cost & Profit</th>
                  <th className="py-3.5 px-4 text-center">Fulfillment Status</th>
                  <th className="py-3.5 px-4 text-right">Direct Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredOrders.map(ord => {
                  const customerTotalOrdersCount = orders.filter(
                    o => o.phone.replace(/[^0-9]/g, '') === ord.phone.replace(/[^0-9]/g, '')
                  ).length;

                  return (
                    <tr key={ord.orderId} className="hover:bg-stone-50 transition-colors">
                      {/* Order ID */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-xs text-red-700">#{ord.orderId}</div>
                        <div className="text-[11px] text-stone-500 mt-0.5">
                          {new Date(ord.createdAt).toLocaleDateString('en-PK', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>

                      {/* Customer & History Link */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setHistoryCustomerPhone(ord.phone)}
                            className="font-bold text-xs text-stone-900 hover:text-red-700 transition-colors text-left flex items-center gap-1 group cursor-pointer"
                            title="Click to view full Customer History & past orders"
                          >
                            <span>{ord.customerName}</span>
                            <History className="w-3 h-3 text-stone-400 group-hover:text-red-700" />
                          </button>

                          {customerTotalOrdersCount > 1 && (
                            <span 
                              onClick={() => setHistoryCustomerPhone(ord.phone)}
                              className="text-[10px] font-extrabold bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded-full border border-amber-300 cursor-pointer"
                              title={`${customerTotalOrdersCount} total lifetime orders placed`}
                            >
                              {customerTotalOrdersCount} Orders
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-stone-600 font-medium font-mono">{ord.phone}</div>
                        {ord.email && <div className="text-[10px] text-stone-400">{ord.email}</div>}
                      </td>

                      {/* Area */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-xs text-stone-900">{ord.area}</div>
                        <div className="text-[11px] text-stone-500 line-clamp-1 max-w-[180px]">{ord.address}</div>
                        <div className="text-[10px] text-stone-400 mt-0.5">{ord.timeSlot}</div>
                      </td>

                      {/* Items & Bill */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-xs text-stone-900 font-mono">
                          Rs. {ord.total.toLocaleString()}
                        </div>
                        <div className="text-[11px] text-stone-500 capitalize">
                          {ord.items.length} items • {ord.paymentMethod.replace('_', ' ').toUpperCase()}
                        </div>
                      </td>

                      {/* Cost & Profit */}
                      <td className="py-3.5 px-4 text-right font-mono">
                        <div className="font-bold text-emerald-700 text-xs">
                          + Rs. {(ord.profit || 0).toLocaleString()}
                        </div>
                        <div className="text-[10px] text-stone-400">
                          Cost: Rs. {(ord.costTotal || 0).toLocaleString()}
                        </div>
                      </td>

                      {/* Status Select */}
                      <td className="py-3.5 px-4 text-center">
                        <select
                          value={ord.status}
                          onChange={e => updateOrderStatus(ord.orderId, e.target.value as any)}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border outline-hidden cursor-pointer ${getStatusColor(
                            ord.status
                          )}`}
                        >
                          <option value="Received">Received</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Direct WhatsApp message composer modal trigger */}
                          <button
                            type="button"
                            onClick={() => handleOpenDirectWhatsApp(ord, 'confirm')}
                            className="p-1.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
                            title="Send Direct WhatsApp Message"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </button>

                          {/* Customer History button */}
                          <button
                            type="button"
                            onClick={() => setHistoryCustomerPhone(ord.phone)}
                            className="p-1.5 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors cursor-pointer"
                            title="View Customer Lifetime History"
                          >
                            <History className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Order */}
                          <button
                            type="button"
                            onClick={() => setIsEditingOrder(ord)}
                            className="p-1.5 text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition-colors cursor-pointer"
                            title="Edit Order Info & Rider"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* View Invoice */}
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(ord)}
                            className="p-1.5 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors cursor-pointer"
                            title="View order bill breakdown"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Delete order #${ord.orderId}?`)) {
                                deleteOrder(ord.orderId);
                              }
                            }}
                            className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors cursor-pointer"
                            title="Delete Order"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= MODAL 1: CUSTOMER HISTORY MODAL ================= */}
      {historyCustomerPhone && customerHistoryOrders.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-800 flex items-center justify-center font-bold text-lg font-display">
                  {customerHistoryOrders[0].customerName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-stone-900">
                      {customerHistoryOrders[0].customerName}
                    </h3>
                    <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-200">
                      {customerHistoryOrders.length} Lifetime Orders
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 font-mono">
                    {customerHistoryOrders[0].phone} • {customerHistoryOrders[0].area}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setHistoryCustomerPhone(null)}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-lg hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Customer Lifetime KPI Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200">
                <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                  Lifetime Revenue
                </div>
                <div className="text-lg font-black text-emerald-900 font-mono mt-0.5">
                  Rs. {customerTotalSpent.toLocaleString()}
                </div>
              </div>

              <div className="bg-blue-50/70 p-3.5 rounded-2xl border border-blue-200">
                <div className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">
                  Average Order Value (AOV)
                </div>
                <div className="text-lg font-black text-blue-900 font-mono mt-0.5">
                  Rs. {customerAOV.toLocaleString()}
                </div>
              </div>

              <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200">
                <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                  First & Latest Order
                </div>
                <div className="text-xs font-bold text-amber-950 mt-0.5">
                  {new Date(customerHistoryOrders[customerHistoryOrders.length - 1].createdAt).toLocaleDateString('en-PK', { month: 'short', day: 'numeric' })} → {new Date(customerHistoryOrders[0].createdAt).toLocaleDateString('en-PK', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            </div>

            {/* Favorite Ordered Items */}
            {sortedCustomerFavorites.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  Most Frequently Ordered Items:
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {sortedCustomerFavorites.map(([itemTitle, qty]) => (
                    <div key={itemTitle} className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 text-xs">
                      <div className="font-bold text-stone-900 truncate" title={itemTitle}>{itemTitle}</div>
                      <div className="text-[11px] text-red-700 font-semibold mt-0.5">{qty} Packs Ordered</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Full Historical Order Timeline */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-red-700" />
                Complete Order Timeline:
              </h4>

              <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden text-xs max-h-60 overflow-y-auto">
                {customerHistoryOrders.map(ord => (
                  <div key={ord.orderId} className="p-3.5 bg-white hover:bg-stone-50 transition-colors flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-red-700">#{ord.orderId}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusColor(ord.status)}`}>
                          {ord.status}
                        </span>
                        <span className="text-[11px] text-stone-400">
                          {new Date(ord.createdAt).toLocaleDateString('en-PK', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-600 mt-1">
                        {ord.items.map(i => `${i.product?.name} (${i.selectedPack?.size}) x${i.quantity}`).join(', ')}
                      </div>
                    </div>

                    <div className="text-right shrink-0 ml-4">
                      <div className="font-mono font-extrabold text-stone-900">
                        Rs. {ord.total.toLocaleString()}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedOrder(ord);
                          setHistoryCustomerPhone(null);
                        }}
                        className="text-[11px] text-blue-700 font-bold hover:underline block mt-0.5 cursor-pointer"
                      >
                        View Bill Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions in History Modal */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-stone-200">
              <button
                type="button"
                onClick={() => {
                  const latestOrder = customerHistoryOrders[0];
                  setHistoryCustomerPhone(null);
                  handleOpenDirectWhatsApp(latestOrder, 'loyalty');
                }}
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-xs cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send Direct WhatsApp Message</span>
              </button>

              <button
                type="button"
                onClick={() => setHistoryCustomerPhone(null)}
                className="bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold py-2.5 px-4 rounded-xl transition-colors cursor-pointer"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: DIRECT WHATSAPP MESSAGE COMPOSER MODAL ================= */}
      {directWhatsAppOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-stone-900 font-display">
                    Send Customer Direct WhatsApp Message
                  </h3>
                  <p className="text-xs text-stone-500">
                    To: <strong className="text-stone-900">{directWhatsAppOrder.customerName}</strong> ({directWhatsAppOrder.phone})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setDirectWhatsAppOrder(null)}
                className="text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Template Selector Pills */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700">Choose Message Template:</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'confirm', label: '🍳 Kitchen Confirmed' },
                  { id: 'dispatch', label: '🚴 Rider Dispatched' },
                  { id: 'delivered', label: '🎉 Delivered & Feedback' },
                  { id: 'loyalty', label: '🎁 15% VIP Loyalty' },
                  { id: 'custom', label: '💬 Custom Note' }
                ].map(tpl => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => {
                      setWhatsAppTemplateType(tpl.id as any);
                      setCustomWhatsAppText(generateWhatsAppMessage(directWhatsAppOrder, tpl.id as any));
                    }}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold text-center transition-all cursor-pointer ${
                      whatsAppTemplateType === tpl.id
                        ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-400'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {tpl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Editor */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700">
                WhatsApp Message Preview & Editor:
              </label>
              <textarea
                rows={7}
                value={customWhatsAppText}
                onChange={e => setCustomWhatsAppText(e.target.value)}
                className="w-full bg-[#FAF7F0] border border-[#DDD4CA] focus:bg-white focus:border-emerald-600 rounded-xl p-3 text-xs text-stone-900 outline-none font-sans leading-relaxed"
                placeholder="Type customized direct WhatsApp message here..."
              />
              <p className="text-[11px] text-stone-500">
                Supports WhatsApp Markdown (e.g. *bold*, _italics_).
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setDirectWhatsAppOrder(null)}
                className="px-4 py-2.5 text-stone-600 hover:bg-stone-100 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSendDirectWhatsAppNow}
                className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Open & Send in WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: EDIT ORDER MODAL ================= */}
      {isEditingOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-bold text-sm text-stone-900">
                Edit Order Info & Rider Assignment (#{isEditingOrder.orderId})
              </h3>
              <button onClick={() => setIsEditingOrder(null)} className="text-stone-400 hover:text-stone-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOrderEdit} className="space-y-3">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Customer Name</label>
                <input
                  type="text"
                  value={isEditingOrder.customerName}
                  onChange={e => setIsEditingOrder({ ...isEditingOrder, customerName: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={isEditingOrder.phone}
                    onChange={e => setIsEditingOrder({ ...isEditingOrder, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl text-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Area</label>
                  <input
                    type="text"
                    value={isEditingOrder.area}
                    onChange={e => setIsEditingOrder({ ...isEditingOrder, area: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Street Address</label>
                <input
                  type="text"
                  value={isEditingOrder.address}
                  onChange={e => setIsEditingOrder({ ...isEditingOrder, address: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Status</label>
                  <select
                    value={isEditingOrder.status}
                    onChange={e => setIsEditingOrder({ ...isEditingOrder, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl text-stone-900"
                  >
                    <option value="Received">Received</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Payment Status</label>
                  <select
                    value={isEditingOrder.paymentStatus || 'Paid'}
                    onChange={e => setIsEditingOrder({ ...isEditingOrder, paymentStatus: e.target.value as any })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl text-stone-900"
                  >
                    <option value="Paid">Paid in Full</option>
                    <option value="Pending">Pending / COD</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <div className="font-bold text-stone-800 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-red-700" />
                  Assigned Rider Details
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Rider Name (e.g. Kamran)"
                    value={isEditingOrder.assignedRider?.name || ''}
                    onChange={e =>
                      setIsEditingOrder({
                        ...isEditingOrder,
                        assignedRider: { ...isEditingOrder.assignedRider, name: e.target.value }
                      })
                    }
                    className="w-full px-2.5 py-1.5 border border-stone-300 rounded-lg text-stone-900"
                  />
                  <input
                    type="text"
                    placeholder="Rider Phone (e.g. 0315-9988112)"
                    value={isEditingOrder.assignedRider?.phone || ''}
                    onChange={e =>
                      setIsEditingOrder({
                        ...isEditingOrder,
                        assignedRider: { ...isEditingOrder.assignedRider, phone: e.target.value }
                      })
                    }
                    className="w-full px-2.5 py-1.5 border border-stone-300 rounded-lg text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Chef / Delivery Note</label>
                <textarea
                  rows={2}
                  value={isEditingOrder.notes || ''}
                  onChange={e => setIsEditingOrder({ ...isEditingOrder, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl text-stone-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsEditingOrder(null)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-700 hover:bg-red-800 text-white rounded-xl font-bold shadow-xs cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 4: VIEW INVOICE & BREAKDOWN MODAL ================= */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div>
                <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider">
                  Customer Invoice & Cost Breakdown
                </span>
                <h3 className="font-bold text-lg text-stone-900">
                  Order #{selectedOrder.orderId}
                </h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-stone-400 hover:text-stone-600 p-1 cursor-pointer">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Customer info card */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-stone-500 block font-medium">Customer:</span>
                <strong className="text-stone-900">{selectedOrder.customerName}</strong>
              </div>
              <div>
                <span className="text-stone-500 block font-medium">Phone:</span>
                <strong className="text-stone-900">{selectedOrder.phone}</strong>
              </div>
              <div className="col-span-2">
                <span className="text-stone-500 block font-medium">Delivery Address:</span>
                <span className="text-stone-900">
                  {selectedOrder.address}, {selectedOrder.area}
                </span>
              </div>
              {selectedOrder.landmark && (
                <div className="col-span-2">
                  <span className="text-stone-500 block font-medium">Nearby Landmark:</span>
                  <span className="text-stone-900">{selectedOrder.landmark}</span>
                </div>
              )}
              <div>
                <span className="text-stone-500 block font-medium">Delivery Slot:</span>
                <span className="text-stone-900">
                  {selectedOrder.deliveryDate} ({selectedOrder.timeSlot})
                </span>
              </div>
              <div>
                <span className="text-stone-500 block font-medium">Payment:</span>
                <span className="text-red-800 font-bold uppercase">
                  {selectedOrder.paymentMethod.replace('_', ' ')} • {selectedOrder.paymentStatus || 'Paid'}
                </span>
              </div>
              {selectedOrder.assignedRider?.name && (
                <div className="col-span-2 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                  <span className="text-[10px] font-bold text-amber-900 block">Assigned Rider:</span>
                  <span className="text-stone-800 font-medium">
                    {selectedOrder.assignedRider.name} ({selectedOrder.assignedRider.phone})
                  </span>
                </div>
              )}
              {selectedOrder.notes && (
                <div className="col-span-2 bg-white p-2.5 rounded-xl border border-stone-200">
                  <span className="text-[10px] font-bold text-red-700 block">Chef / Rider Note:</span>
                  <span className="text-stone-700 italic">{selectedOrder.notes}</span>
                </div>
              )}
            </div>

            {/* Itemized List with Cost & Profit */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Ordered Items & Cost Calculation:
              </h4>
              <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden text-xs">
                {selectedOrder.items.map((item, i) => {
                  const unitCost =
                    item.selectedPack?.costPrice ||
                    (item.selectedPack?.price ? Math.round(item.selectedPack.price * 0.55) : 0);
                  const lineCost = unitCost * item.quantity;
                  const lineSale = item.selectedPack.price * item.quantity;
                  const lineProfit = lineSale - lineCost;

                  return (
                    <div key={i} className="p-3 bg-white flex items-center justify-between">
                      <div>
                        <div className="font-bold text-stone-900">{item.product.name}</div>
                        <div className="text-[11px] text-stone-500">
                          {item.selectedPack.size} x {item.quantity} (Unit Cost: Rs. {unitCost})
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-stone-900 font-mono">
                          Rs. {lineSale.toLocaleString()}
                        </div>
                        <div className="text-[10px] font-medium text-emerald-700">
                          + Rs. {lineProfit.toLocaleString()} profit
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Total breakdown */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal:</span>
                <span>Rs. {selectedOrder.subtotal.toLocaleString()}</span>
              </div>
              {selectedOrder.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Promo Code Discount:</span>
                  <span>- Rs. {selectedOrder.discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-600">
                <span>Delivery Fee:</span>
                <span>{selectedOrder.deliveryFee === 0 ? 'FREE' : `Rs. ${selectedOrder.deliveryFee}`}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-stone-900 pt-2 border-t border-stone-200 font-mono">
                <span>Total Amount:</span>
                <span>Rs. {selectedOrder.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-emerald-700 pt-1 font-mono">
                <span>Estimated Order Gross Profit:</span>
                <span>+ Rs. {(selectedOrder.profit || 0).toLocaleString()}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedOrder(null);
                  handleOpenDirectWhatsApp(selectedOrder, 'confirm');
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Customer</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 font-bold text-xs py-2.5 px-4 rounded-xl transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Bill</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
