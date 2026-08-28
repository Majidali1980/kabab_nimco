import React from 'react';
import { 
  Package, 
  Flame, 
  Sliders, 
  ShoppingBag, 
  MessageCircle, 
  Layers, 
  CheckCircle, 
  Sparkles,
  ArrowRight,
  ExternalLink,
  PhoneCall,
  RotateCcw,
  TrendingUp,
  Receipt,
  FolderTree,
  DollarSign,
  Percent
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AdminTab, PageView } from '../../types';

interface AdminOverviewProps {
  onSelectTab: (tab: AdminTab) => void;
  onExitAdmin: () => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ onSelectTab, onExitAdmin }) => {
  const { 
    products, 
    deals, 
    heroSlides, 
    orders, 
    categories,
    purchases,
    siteSettings, 
    notificationBar,
    navbarConfig,
    topSellingConfig,
    nimkoRangeConfig
  } = useStore();

  const totalProducts = products.length;
  const bestsellersCount = products.filter(p => p.isBestseller).length;
  const activeDeals = deals.length;
  const activeSlides = heroSlides.filter(s => s.isEnabled).length;
  const totalOrders = orders.length;
  const totalCategories = categories.length;
  const totalPurchases = purchases.length;

  const validOrders = orders.filter(o => o.status !== 'Cancelled');
  const totalSales = validOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalProfit = validOrders.reduce((sum, o) => sum + (o.profit || 0), 0);
  const totalInwardPurchases = purchases.reduce((sum, p) => sum + (p.totalAmount || 0), 0);
  const marginPercent = totalSales > 0 ? ((totalProfit / totalSales) * 100).toFixed(1) : '0';

  const quickModules: {
    id: AdminTab;
    title: string;
    description: string;
    icon: React.ReactNode;
    badge: string;
    accentColor: string;
  }[] = [
    {
      id: 'reports',
      title: 'Purchase to Sale & Profit Reports',
      description: `Daily, weekly, and monthly BI analysis. Gross sales: Rs. ${totalSales.toLocaleString()}, Profit: Rs. ${totalProfit.toLocaleString()} (${marginPercent}% margin).`,
      icon: <TrendingUp className="w-6 h-6 text-emerald-600" />,
      badge: `${marginPercent}% Margin`,
      accentColor: 'bg-emerald-50 border-emerald-200'
    },
    {
      id: 'orders',
      title: 'Customer Orders & Dispatch Ledger',
      description: `${totalOrders} orders logged. Track fulfillment, dispatch stages, cost-per-order, and send WhatsApp updates.`,
      icon: <ShoppingBag className="w-6 h-6 text-red-600" />,
      badge: `${totalOrders} Orders`,
      accentColor: 'bg-red-50 border-red-200'
    },
    {
      id: 'purchases',
      title: 'Purchases & Inward Material Invoices',
      description: `${totalPurchases} vendor bills logged (Total: Rs. ${totalInwardPurchases.toLocaleString()}). Manage meat, spices, and packaging stock costs.`,
      icon: <Receipt className="w-6 h-6 text-blue-600" />,
      badge: `${totalPurchases} Bills`,
      accentColor: 'bg-blue-50 border-blue-200'
    },
    {
      id: 'categories',
      title: 'Categories Management (CRUD)',
      description: `${totalCategories} categories active. Add, edit, reorder, and configure Urdu subtitles and icons.`,
      icon: <FolderTree className="w-6 h-6 text-amber-600" />,
      badge: `${totalCategories} Categories`,
      accentColor: 'bg-amber-50 border-amber-200'
    },
    {
      id: 'products',
      title: 'Products Catalog (CRUD)',
      description: `${totalProducts} items (${bestsellersCount} bestsellers). Add, edit prices, pack sizes, ingredients, recipe costs, and photos.`,
      icon: <Package className="w-6 h-6 text-[#801414]" />,
      badge: `${totalProducts} Products`,
      accentColor: 'bg-red-50 border-red-200'
    },
    {
      id: 'deals',
      title: 'Deals & Family Combos',
      description: `${activeDeals} combo packs currently active with savings calculator and items included list.`,
      icon: <Flame className="w-6 h-6 text-amber-600" />,
      badge: `${activeDeals} Combos`,
      accentColor: 'bg-amber-50 border-amber-200'
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp & Store Hotline',
      description: `Current WhatsApp: ${siteSettings.whatsappNumber}. Configure instant chat order routing and store phone lines.`,
      icon: <MessageCircle className="w-6 h-6 text-emerald-600" />,
      badge: siteSettings.whatsappNumber,
      accentColor: 'bg-emerald-50 border-emerald-200'
    },
    {
      id: 'hero',
      title: 'Hero Section & Carousel',
      description: `${activeSlides} slides configured with dynamic call-to-actions, highlight badges, and background imagery.`,
      icon: <Sliders className="w-6 h-6 text-indigo-600" />,
      badge: `${activeSlides} Slides`,
      accentColor: 'bg-indigo-50 border-indigo-200'
    },
    {
      id: 'top-selling',
      title: 'Top Selling Frozen Kababs Section',
      description: `Title: "${topSellingConfig.title}". Customize featured items and promotion headings.`,
      icon: <Sparkles className="w-6 h-6 text-orange-600" />,
      badge: topSellingConfig.enabled ? 'Enabled' : 'Disabled',
      accentColor: 'bg-orange-50 border-orange-200'
    },
    {
      id: 'nimko-range',
      title: "Karachi's Mix Nimko Range Section",
      description: `Title: "${nimkoRangeConfig.title}". Manage artisanal nimko snacks spotlight on homepage.`,
      icon: <Layers className="w-6 h-6 text-amber-700" />,
      badge: nimkoRangeConfig.enabled ? 'Enabled' : 'Disabled',
      accentColor: 'bg-yellow-50 border-yellow-200'
    },
    {
      id: 'notification-bar',
      title: 'Top Notification Bar',
      description: `Banner: "${notificationBar.badgeText}: ${notificationBar.mainText.slice(0, 45)}..."`,
      icon: <CheckCircle className="w-6 h-6 text-blue-600" />,
      badge: notificationBar.enabled ? 'Active' : 'Hidden',
      accentColor: 'bg-blue-50 border-blue-200'
    },
    {
      id: 'navbar',
      title: 'Navbar & Links Menu',
      description: `${navbarConfig.links.length} menu items, brand titles "${navbarConfig.brandPrefix} ${navbarConfig.brandSuffix}".`,
      icon: <Layers className="w-6 h-6 text-purple-600" />,
      badge: `${navbarConfig.links.length} Links`,
      accentColor: 'bg-purple-50 border-purple-200'
    },
    {
      id: 'footer',
      title: 'Footer & Delivery Areas',
      description: 'Quick links, delivery coverage list, contact addresses, certifications and SEO copyright info.',
      icon: <Layers className="w-6 h-6 text-stone-600" />,
      badge: 'Configured',
      accentColor: 'bg-stone-50 border-stone-200'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-linear-to-r from-[#801414] via-[#661010] to-[#450A0A] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Storefront & Financial Management Hub</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display">
            Welcome to the Admin Control Panel
          </h2>
          <p className="text-sm text-stone-200 leading-relaxed">
            Manage your frozen kababs and fresh nimko catalog, categories, WhatsApp hotline, purchase invoices, daily/weekly/monthly profit reports, and homepage sections in real time.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={onExitAdmin}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-5 py-3 rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95 text-sm cursor-pointer"
          >
            <span>Preview Live Storefront</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-1">
          <span className="text-xs font-semibold text-[#8C7A70] uppercase">Total Sales Revenue</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#801414] font-mono">
            {siteSettings.currency} {totalSales.toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-600 font-medium">✓ {totalOrders} total orders processed</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-1">
          <span className="text-xs font-semibold text-[#8C7A70] uppercase">Gross Profit (Margin)</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-mono">
            {siteSettings.currency} {totalProfit.toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-700 font-bold">{marginPercent}% Avg. Profit Margin</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-1">
          <span className="text-xs font-semibold text-[#8C7A70] uppercase">Raw Material Purchases</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-700 font-mono">
            {siteSettings.currency} {totalInwardPurchases.toLocaleString()}
          </div>
          <p className="text-[11px] text-blue-600">✓ {totalPurchases} vendor invoices</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-1">
          <span className="text-xs font-semibold text-[#8C7A70] uppercase">Catalog & Categories</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#2D1A16] font-mono">
            {totalProducts} Items
          </div>
          <p className="text-[11px] text-stone-500">{totalCategories} Active Categories</p>
        </div>
      </div>

      {/* Modules Quick Navigation */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[#2D1A16] font-display">
            Quick Management Modules (Full CRUD)
          </h3>
          <span className="text-xs text-[#8C7A70]">Select any section to manage and configure</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickModules.map((mod) => (
            <div
              key={mod.id}
              onClick={() => onSelectTab(mod.id)}
              className="bg-white hover:bg-[#FAF7F0] border border-[#E8DFC8] hover:border-[#D4C3A3] p-5 rounded-2xl shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-xl border ${mod.accentColor}`}>
                    {mod.icon}
                  </div>
                  <span className="text-xs font-bold bg-[#FAF0DC] text-[#801414] px-2.5 py-1 rounded-full border border-[#EAD5AB]">
                    {mod.badge}
                  </span>
                </div>
                <h4 className="font-bold text-base text-[#2D1A16] group-hover:text-[#801414] transition-colors">
                  {mod.title}
                </h4>
                <p className="text-xs text-[#735A50] mt-1 line-clamp-2">
                  {mod.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F2EBDC] flex items-center justify-between text-xs font-bold text-[#801414] group-hover:translate-x-1 transition-transform">
                <span>Manage Section</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
