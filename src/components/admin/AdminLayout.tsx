import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  PhoneCall, 
  Bell, 
  Layers, 
  Sliders, 
  Package, 
  Flame, 
  Sparkles, 
  ShoppingBag, 
  Database, 
  ArrowLeft,
  ExternalLink,
  Store,
  Menu,
  X,
  ChefHat,
  TrendingUp,
  Receipt,
  FolderTree,
  LogOut,
  UserCheck
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AdminTab } from '../../types';

// Tab Components
import { AdminOverview } from './AdminOverview';
import { AdminWhatsAppSettings } from './AdminWhatsAppSettings';
import { AdminNotificationBar } from './AdminNotificationBar';
import { AdminNavbar } from './AdminNavbar';
import { AdminHeroSection } from './AdminHeroSection';
import { AdminProducts } from './AdminProducts';
import { AdminCategories } from './AdminCategories';
import { AdminDeals } from './AdminDeals';
import { AdminTopSelling } from './AdminTopSelling';
import { AdminNimkoRange } from './AdminNimkoRange';
import { AdminFooter } from './AdminFooter';
import { AdminOrders } from './AdminOrders';
import { AdminPurchases } from './AdminPurchases';
import { AdminReports } from './AdminReports';
import { AdminBackup } from './AdminBackup';

interface AdminLayoutProps {
  onExitAdmin: () => void;
  onLogout?: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onExitAdmin, onLogout }) => {
  const { siteSettings, products, deals, orders, categories, purchases } = useStore();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogoutClick = () => {
    try {
      localStorage.removeItem('nk_admin_auth');
      sessionStorage.removeItem('nk_admin_auth');
    } catch (e) {
      console.error(e);
    }
    if (onLogout) {
      onLogout();
    } else {
      onExitAdmin();
    }
  };

  const navItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: string | number; sectionGroup?: string }[] = [
    { id: 'overview', label: 'Dashboard Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'reports', label: 'Purchase to Sale & Profit Reports', icon: <TrendingUp className="w-4 h-4 text-emerald-500" />, badge: 'Live BI' },
    { id: 'orders', label: 'Customer Orders & Dispatch', icon: <ShoppingBag className="w-4 h-4 text-red-400" />, badge: orders.length },
    { id: 'purchases', label: 'Purchases & Inward Invoices', icon: <Receipt className="w-4 h-4 text-blue-400" />, badge: purchases.length },
    { id: 'categories', label: 'Categories (CRUD)', icon: <FolderTree className="w-4 h-4 text-amber-400" />, badge: categories.length },
    { id: 'products', label: 'Products Catalog (CRUD)', icon: <Package className="w-4 h-4" />, badge: products.length },
    { id: 'deals', label: 'Deals & Family Combos', icon: <Flame className="w-4 h-4" />, badge: deals.length },
    { id: 'top-selling', label: 'Top Selling Kababs Section', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'nimko-range', label: 'Mix Nimko Range Section', icon: <ChefHat className="w-4 h-4" /> },
    { id: 'hero', label: 'Hero Carousel & Slides', icon: <Sliders className="w-4 h-4" /> },
    { id: 'notification-bar', label: 'Top Notification Bar', icon: <Bell className="w-4 h-4" /> },
    { id: 'navbar', label: 'Navbar & Menu Links', icon: <Layers className="w-4 h-4" /> },
    { id: 'footer', label: 'Footer & Delivery Zones', icon: <Layers className="w-4 h-4" /> },
    { id: 'whatsapp', label: 'WhatsApp & Store Settings', icon: <PhoneCall className="w-4 h-4" /> },
    { id: 'backup', label: 'Backup & JSON Sync', icon: <Database className="w-4 h-4" /> },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminOverview onSelectTab={(tab) => setActiveTab(tab)} onExitAdmin={onExitAdmin} />;
      case 'reports':
        return <AdminReports />;
      case 'orders':
        return <AdminOrders />;
      case 'purchases':
        return <AdminPurchases />;
      case 'categories':
        return <AdminCategories />;
      case 'products':
        return <AdminProducts />;
      case 'deals':
        return <AdminDeals />;
      case 'top-selling':
        return <AdminTopSelling />;
      case 'nimko-range':
        return <AdminNimkoRange />;
      case 'hero':
        return <AdminHeroSection />;
      case 'notification-bar':
        return <AdminNotificationBar />;
      case 'navbar':
        return <AdminNavbar />;
      case 'footer':
        return <AdminFooter />;
      case 'whatsapp':
        return <AdminWhatsAppSettings />;
      case 'backup':
        return <AdminBackup />;
      default:
        return <AdminOverview onSelectTab={(tab) => setActiveTab(tab)} onExitAdmin={onExitAdmin} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] flex flex-col font-sans">
      {/* Top Global Admin Bar */}
      <header className="bg-[#2D1A16] text-[#FDFBF7] border-b border-black/40 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-stone-300 hover:text-white rounded-xl hover:bg-stone-800"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#801414] text-amber-300 flex items-center justify-center font-black text-lg border border-amber-500/40 shadow-inner">
                N
              </div>
              <div>
                <div className="font-bold text-sm leading-none text-amber-300 font-display">
                  {siteSettings.brandName} Control Center
                </div>
                <div className="text-[10px] text-stone-400 mt-0.5">
                  ERP & E-Commerce Admin System
                </div>
              </div>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Authenticated Admin Badge */}
            <div className="hidden md:flex items-center gap-2 bg-stone-900/90 border border-amber-500/30 px-3 py-1.5 rounded-xl text-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <div className="text-left">
                <div className="text-[10px] text-stone-400 leading-none">Logged In Administrator</div>
                <div className="text-[11px] font-bold text-amber-300 leading-tight">alimajid03021980@gmail.com</div>
              </div>
            </div>

            <button
              type="button"
              onClick={onExitAdmin}
              className="inline-flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold px-3 py-2 rounded-xl border border-stone-600/50 shadow-xs transition-all cursor-pointer"
              title="View Customer Storefront"
            >
              <Store className="w-4 h-4 text-amber-300" />
              <span className="hidden sm:inline">Storefront</span>
            </button>

            <button
              type="button"
              onClick={handleLogoutClick}
              className="inline-flex items-center gap-1.5 bg-[#801414] hover:bg-[#961919] text-amber-200 text-xs font-bold px-3.5 py-2 rounded-xl border border-amber-500/30 shadow-sm transition-all cursor-pointer"
              title="Log Out of Admin Session"
            >
              <LogOut className="w-4 h-4 text-amber-300" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Wrapper */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex flex-col lg:flex-row gap-6">
        
        {/* Sidebar Navigation (Desktop) */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="bg-white rounded-3xl border border-[#E8DFC8] shadow-xs p-3 sticky top-24 space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#8C7A70]">
              Admin Operations & Modules
            </div>

            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#801414] text-white shadow-sm'
                      : 'text-[#4A352F] hover:bg-[#FAF7F0] hover:text-[#801414]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-amber-300' : 'text-[#8C7A70]'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                      isActive ? 'bg-amber-400 text-slate-950' : 'bg-[#FAF0DC] text-[#801414]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Mobile Drawer Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex">
            <div className="w-72 bg-white h-full p-4 space-y-2 overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[#E8DFC8] pb-3">
                <span className="font-bold text-sm text-[#2D1A16]">Admin Navigation</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-stone-500">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive ? 'bg-[#801414] text-white' : 'text-[#4A352F] hover:bg-[#FAF7F0]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#FAF0DC] text-[#801414]">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          {renderActiveTab()}
        </main>

      </div>
    </div>
  );
};
