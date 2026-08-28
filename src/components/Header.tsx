import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  Flame, 
  PhoneCall, 
  ChefHat, 
  MapPin, 
  Utensils, 
  Home, 
  Info,
  ShieldAlert,
  Settings
} from 'lucide-react';
import { PageView } from '../types';
import { useStore } from '../context/StoreContext';

interface HeaderProps {
  currentPage: PageView;
  onNavigate: (page: PageView, filterCategory?: string) => void;
  cartCount: number;
  cartTotal: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenCookingGuide: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  cartCount,
  cartTotal,
  wishlistCount,
  onOpenCart,
  onOpenCookingGuide,
  searchQuery,
  onSearchChange
}) => {
  const { siteSettings, notificationBar, navbarConfig } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpenMobile, setSearchOpenMobile] = useState(false);

  const getLinkIcon = (iconName?: string) => {
    switch (iconName) {
      case 'home': return <Home className="w-3.5 h-3.5 inline text-amber-300" />;
      case 'flame': return <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 inline" />;
      case 'map-pin': return <MapPin className="w-3.5 h-3.5 inline text-amber-300" />;
      case 'info': return <Info className="w-3.5 h-3.5 inline text-amber-300" />;
      case 'chef-hat': return <ChefHat className="w-3.5 h-3.5 inline text-amber-300" />;
      default: return undefined;
    }
  };

  const handleNavClick = (page: PageView) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cleanPhone = siteSettings.phoneHotline.replace(/[^0-9+]/g, '');
  const cleanWhatsApp = siteSettings.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F0]/95 backdrop-blur-md border-b border-[#E8DFC8] shadow-xs">
      
      {/* Top Announcement Ribbon (Configured via Admin Notification Bar) */}
      {notificationBar.enabled && (
        <div className="bg-[#801414] text-[#FDFBF7] text-xs py-1.5 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
              {notificationBar.badgeText && (
                <span className="bg-[#E69500] text-[#2D1A16] text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider animate-pulse shrink-0">
                  {notificationBar.badgeText}
                </span>
              )}
              <span className="hidden sm:inline font-medium">
                {notificationBar.mainText}
              </span>
              <span className="sm:hidden font-medium text-[11px]">
                {notificationBar.mobileText || notificationBar.mainText}
              </span>
            </div>

            <div className="flex items-center gap-4 text-[11px] shrink-0 font-medium">
              {notificationBar.showCookingGuide && (
                <button 
                  onClick={onOpenCookingGuide}
                  className="hover:text-amber-300 flex items-center gap-1 transition-colors underline-offset-2 hover:underline cursor-pointer"
                >
                  <ChefHat className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden md:inline">3-Min Frying Guide</span>
                </button>
              )}
              {notificationBar.showCookingGuide && notificationBar.showPhoneCall && (
                <span className="hidden sm:inline text-white/30">|</span>
              )}
              {notificationBar.showPhoneCall && (
                <a 
                  href={`tel:${cleanPhone}`} 
                  className="hover:text-amber-300 flex items-center gap-1 transition-colors"
                >
                  <PhoneCall className="w-3 h-3 text-amber-300" />
                  <span>{siteSettings.phoneHotline}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo / Brand Name */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick('home')}
              className="text-left group flex items-center gap-3 focus:outline-none cursor-pointer"
            >
              <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-gradient-to-br from-[#801414] via-[#651010] to-[#4A0A0A] flex flex-col items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform border-2 border-[#E69500]/40">
                <Utensils className="w-5 h-5 text-amber-300" />
                <span className="text-[8px] font-black tracking-widest text-amber-200 uppercase">
                  {navbarConfig.estYear || 'Est. 2021'}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#801414] font-display">
                    {navbarConfig.brandPrefix}{' '}
                    <span className="text-[#D97706]">{navbarConfig.brandSuffix}</span>
                  </span>
                </div>
                <p className="text-[11px] font-medium text-[#735A50] tracking-wide flex items-center gap-1">
                  <span>{navbarConfig.subtext}</span>
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Nav Links (Dynamic from NavbarConfig) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navbarConfig.links
              .filter(link => link.isEnabled)
              .map((link) => {
                const isActive = currentPage === link.page;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.page)}
                    className={`relative px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-[#801414] text-white shadow-sm'
                        : 'text-[#4A352F] hover:text-[#801414] hover:bg-[#F2EBDC]'
                    }`}
                  >
                    {getLinkIcon(link.iconName)}
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="ml-1 bg-amber-500 text-slate-900 text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-xs">
                        {link.badge}
                      </span>
                    )}
                  </button>
                );
              })}
          </nav>

          {/* Search bar & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Search Input (Desktop) */}
            {navbarConfig.showSearch && (
              <div className="hidden md:flex relative items-center w-48 lg:w-56">
                <Search className="absolute left-3 w-4 h-4 text-[#8C7A70] pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    onSearchChange(e.target.value);
                    if (currentPage !== 'shop') onNavigate('shop');
                  }}
                  placeholder="Search kababs, nimko..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#E0D5C1] rounded-xl text-[#2D1A16] placeholder:text-[#9E8E85] focus:outline-none focus:ring-2 focus:ring-[#801414] focus:border-transparent transition-all shadow-xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="absolute right-2.5 text-[#8C7A70] hover:text-[#2D1A16] text-xs font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>
            )}

            {/* Mobile Search Toggle */}
            {navbarConfig.showSearch && (
              <button
                onClick={() => {
                  setSearchOpenMobile(!searchOpenMobile);
                  if (currentPage !== 'shop') onNavigate('shop');
                }}
                className="md:hidden p-2.5 rounded-xl text-[#4A352F] hover:bg-[#F2EBDC] transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            {/* Cooking Guide Button */}
            {navbarConfig.showCookingGuide && (
              <button
                onClick={onOpenCookingGuide}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#FAF0DC] hover:bg-[#F5E5C4] text-[#801414] border border-[#EAD5AB] transition-colors cursor-pointer"
                title="How to fry instructions"
              >
                <ChefHat className="w-4 h-4 text-[#801414]" />
                <span className="hidden xl:inline">Frying Guide</span>
              </button>
            )}

            {/* Cart Button */}
            {navbarConfig.showCart && (
              <button
                id="btn-header-cart"
                onClick={onOpenCart}
                className="relative flex items-center gap-2.5 bg-[#801414] hover:bg-[#681010] text-white px-3.5 py-2.5 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
                aria-label={`Shopping cart with ${cartCount} items`}
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2.5 bg-[#E69500] text-[#2D1A16] font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs animate-in zoom-in-50 duration-200">
                      {cartCount}
                    </span>
                  )}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-[10px] font-medium text-amber-200 leading-tight uppercase tracking-wider">Cart</div>
                  <div className="text-xs font-bold leading-tight">Rs. {cartTotal.toLocaleString()}</div>
                </div>
              </button>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#4A352F] hover:bg-[#F2EBDC] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Expandable */}
        {searchOpenMobile && (
          <div className="md:hidden pb-3 pt-1">
            <div className="relative flex items-center">
              <Search className="absolute left-3 w-4 h-4 text-[#8C7A70]" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search Chicken Seekh, Shami, Mix Nimko..."
                className="w-full pl-9 pr-8 py-2.5 text-sm bg-white border border-[#E0D5C1] rounded-xl text-[#2D1A16] placeholder:text-[#9E8E85] focus:outline-none focus:ring-2 focus:ring-[#801414]"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 text-[#8C7A70] hover:text-[#2D1A16] text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF7F0] border-b border-[#E8DFC8] px-4 pt-2 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-3 duration-200">
          {navbarConfig.links
            .filter(link => link.isEnabled)
            .map((link) => {
              const isActive = currentPage === link.page;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.page)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-between transition-colors ${
                    isActive ? 'bg-[#801414] text-white' : 'text-[#3D2821] hover:bg-[#F2EBDC]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {getLinkIcon(link.iconName)}
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}

          <div className="pt-3 border-t border-[#E8DFC8] flex items-center justify-between gap-2">
            <button
              onClick={() => {
                onOpenCookingGuide();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold bg-[#FAF0DC] text-[#801414] border border-[#EAD5AB] flex items-center justify-center gap-1.5"
            >
              <ChefHat className="w-4 h-4" />
              <span>3-Min Frying Guide</span>
            </button>
            <a
              href={`https://wa.me/${cleanWhatsApp}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold bg-[#25D366] text-white flex items-center justify-center gap-1.5"
            >
              <span>WhatsApp Order</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
