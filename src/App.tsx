import React, { useState, useEffect } from 'react';
import { PageView, Product, Deal, CartItem, PackOption, Category, OrderDetails } from './types';
import { useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { ShopPage } from './components/ShopPage';
import { DealsPage } from './components/DealsPage';
import { AboutPage } from './components/AboutPage';
import { DeliveryAreaPage } from './components/DeliveryAreaPage';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CookingGuideModal } from './components/CookingGuideModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { QuickToast } from './components/QuickToast';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLoginModal } from './components/admin/AdminLoginModal';

export default function App() {
  const { products, deals, siteSettings, addOrder, navbarConfig } = useStore();
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [shopCategory, setShopCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Cart State with localStorage persistence
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('nk_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist State with localStorage
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nk_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Promo Code State
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discountPercent?: number;
    discountFixed?: number;
  } | null>(null);

  // Modals and Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCookingGuideOpen, setIsCookingGuideOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<OrderDetails | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Admin Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      const local = localStorage.getItem('nk_admin_auth');
      if (local) {
        const parsed = JSON.parse(local);
        return !!parsed.authenticated;
      }
      const session = sessionStorage.getItem('nk_admin_auth');
      if (session) {
        const parsed = JSON.parse(session);
        return !!parsed.authenticated;
      }
    } catch {
      return false;
    }
    return false;
  });
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  // Hash (#admin) and Keyboard Shortcut (Ctrl+Shift+A) listener for Admin Portal
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin' || window.location.hash === '#admin-login') {
        if (isAdminAuthenticated) {
          setCurrentPage('admin');
        } else {
          setIsAdminLoginOpen(true);
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + Shift + A or Cmd + Shift + A
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        if (isAdminAuthenticated) {
          setCurrentPage(prev => (prev === 'admin' ? 'home' : 'admin'));
        } else {
          setIsAdminLoginOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAdminAuthenticated]);

  // Save Cart to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('nk_cart_items', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
  }, [cartItems]);

  // Save Wishlist to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('nk_wishlist', JSON.stringify(wishlistIds));
    } catch (e) {
      console.error('Failed to save wishlist', e);
    }
  }, [wishlistIds]);

  // Dynamic SEO Page Title & Meta description
  useEffect(() => {
    const brand = `${navbarConfig.brandPrefix} ${navbarConfig.brandSuffix}`.trim() || 'Nimko & Kabab Co.';
    switch (currentPage) {
      case 'home':
        document.title = `${brand} | Frozen Kabab & Nimko Delivery in Karachi`;
        break;
      case 'shop':
        document.title = `Shop Frozen Chicken & Beef Kababs Online | ${brand}`;
        break;
      case 'deals':
        document.title = `Kabab & Nimko Combo Deals | ${brand}`;
        break;
      case 'about':
        document.title = `About ${brand} — Frozen Kabab Makers in Karachi`;
        break;
      case 'delivery':
        document.title = `Delivery Areas & Timing | ${brand}`;
        break;
      case 'admin':
        document.title = `Admin Control Panel | ${brand}`;
        break;
      default:
        document.title = `${brand} | Frozen Kababs & Nimko Online`;
    }
  }, [currentPage, navbarConfig]);

  // Navigation Handler
  const handleNavigate = (page: PageView, filterCategory?: string) => {
    if (page === 'admin') {
      if (!isAdminAuthenticated) {
        setIsAdminLoginOpen(true);
        return;
      }
    }
    if (page === 'cart') {
      setIsCartOpen(true);
      return;
    }
    if (page === 'checkout') {
      setIsCheckoutOpen(true);
      return;
    }
    if (filterCategory && (filterCategory as Category)) {
      setShopCategory(filterCategory as Category);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    setIsAdminLoginOpen(false);
    setCurrentPage('admin');
    setToastMessage('Authenticated as Master Administrator (alimajid03021980@gmail.com)');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleAdminLogout = () => {
    try {
      localStorage.removeItem('nk_admin_auth');
      sessionStorage.removeItem('nk_admin_auth');
    } catch (e) {
      console.error(e);
    }
    setIsAdminAuthenticated(false);
    setCurrentPage('home');
    if (window.location.hash === '#admin' || window.location.hash === '#admin-login') {
      window.history.replaceState(null, '', window.location.pathname);
    }
    setToastMessage('Logged out from Admin Session.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Add Item To Cart
  const handleAddToCart = (product: Product, selectedPack: PackOption, quantity: number = 1) => {
    const cartItemId = `${product.id}-${selectedPack.size}`;

    setCartItems(prev => {
      const existing = prev.find(item => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map(item =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { cartItemId, productId: product.id, product, selectedPack, quantity }];
    });

    setToastMessage(`Added ${quantity}x "${product.name} (${selectedPack.size})" to cart!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Add Combo Deal to Cart
  const handleAddDealToCart = (deal: Deal) => {
    const comboProduct = products.find(p => p.slug === deal.slug) || products.find(p => p.category === 'combos') || products[0];
    const dealPack: PackOption = {
      size: `${deal.title} (${deal.servings || 'Combo'})`,
      weightGrams: 1500,
      price: deal.discountedPrice,
      originalPrice: deal.originalPrice
    };

    if (comboProduct) {
      handleAddToCart(comboProduct, dealPack, 1);
      setToastMessage(`Deal Added: "${deal.title}" (Saved Rs. ${deal.savings})!`);
    }
  };

  // Update Cart Quantity
  const handleUpdateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveFromCart(cartItemId);
      return;
    }
    setCartItems(prev =>
      prev.map(item => (item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item))
    );
  };

  // Remove Item from Cart
  const handleRemoveFromCart = (cartItemId: string) => {
    setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  // Wishlist Toggle
  const handleToggleWishlist = (productId: string) => {
    setWishlistIds(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        const prod = products.find(p => p.id === productId);
        setToastMessage(`Saved "${prod?.name || 'Item'}" to your favorites!`);
        setTimeout(() => setToastMessage(null), 3000);
        return [...prev, productId];
      }
    });
  };

  // Promo Code Validation
  const handleApplyPromo = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'WELCOME10') {
      setAppliedPromo({ code: 'WELCOME10', discountPercent: 10 });
      return { success: true, message: '🎉 WELCOME10 applied! 10% discount subtracted from subtotal.' };
    }
    if (clean === 'KABAB15') {
      setAppliedPromo({ code: 'KABAB15', discountFixed: 150 });
      return { success: true, message: '🎉 KABAB15 applied! Rs. 150 discount deducted.' };
    }
    if (clean === 'FREESHIP') {
      setAppliedPromo({ code: 'FREESHIP', discountFixed: 0 });
      return { success: true, message: '🎉 FREESHIP applied! Free cold-chain delivery unlocked.' };
    }
    return { success: false, message: 'Invalid coupon code. Try WELCOME10, KABAB15 or FREESHIP.' };
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
  };

  // Calculations
  const cartSubtotal = cartItems.reduce((sum, it) => sum + it.selectedPack.price * it.quantity, 0);
  const cartTotalCount = cartItems.reduce((sum, it) => sum + it.quantity, 0);

  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountPercent) {
      discountAmount = Math.round((cartSubtotal * appliedPromo.discountPercent) / 100);
    } else if (appliedPromo.discountFixed) {
      discountAmount = Math.min(cartSubtotal, appliedPromo.discountFixed);
    }
  }

  const isFreeDelivery = cartSubtotal >= siteSettings.freeDeliveryThreshold || appliedPromo?.code === 'FREESHIP';
  const deliveryFee = cartSubtotal === 0 ? 0 : (isFreeDelivery ? 0 : siteSettings.standardDeliveryFee);
  const cartGrandTotal = Math.max(0, cartSubtotal - discountAmount + deliveryFee);

  // Order Placement Success Handler
  const handleOrderSuccess = (order: OrderDetails) => {
    addOrder(order);
    setLastPlacedOrder(order);
    setIsCheckoutOpen(false);
    setCartItems([]);
    setAppliedPromo(null);
  };

  // If currently in Admin view, render the comprehensive full Admin Panel layout
  if (currentPage === 'admin') {
    if (!isAdminAuthenticated) {
      return (
        <AdminLoginModal
          isOpen={true}
          onClose={() => handleNavigate('home')}
          onSuccess={handleAdminLoginSuccess}
        />
      );
    }
    return (
      <AdminLayout
        onExitAdmin={() => handleNavigate('home')}
        onLogout={handleAdminLogout}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#2D1A16] antialiased relative">
      
      {/* Toast Feedback Notification */}
      <QuickToast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Sticky Main Header */}
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        cartCount={cartTotalCount}
        cartTotal={cartSubtotal}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenCookingGuide={() => setIsCookingGuideOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Routed Content */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
            onAddDealToCart={handleAddDealToCart}
            onOpenQuickView={(p) => setQuickViewProduct(p)}
            onOpenCookingGuide={() => setIsCookingGuideOpen(true)}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
          />
        )}

        {currentPage === 'shop' && (
          <ShopPage
            initialCategory={shopCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onAddToCart={handleAddToCart}
            onOpenQuickView={(p) => setQuickViewProduct(p)}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
          />
        )}

        {currentPage === 'deals' && (
          <DealsPage
            onAddDealToCart={handleAddDealToCart}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage />
        )}

        {currentPage === 'delivery' && (
          <DeliveryAreaPage />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenCookingGuide={() => setIsCookingGuideOpen(true)}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
      />

      {/* Persistent Floating WhatsApp Order Button */}
      <FloatingWhatsApp
        cartItems={cartItems}
        subtotal={cartSubtotal}
      />

      {/* Cart Side Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        onContinueShopping={() => {
          setIsCartOpen(false);
          if (currentPage !== 'shop') handleNavigate('shop');
        }}
        appliedPromo={appliedPromo}
        onApplyPromo={handleApplyPromo}
        onRemovePromo={handleRemovePromo}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        subtotal={cartSubtotal}
        discountAmount={discountAmount}
        deliveryFee={deliveryFee}
        total={cartGrandTotal}
        appliedPromoCode={appliedPromo?.code}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Order Confirmation Receipt Modal */}
      <OrderConfirmationModal
        order={lastPlacedOrder}
        onClose={() => setLastPlacedOrder(null)}
        onContinueShopping={() => {
          setLastPlacedOrder(null);
          handleNavigate('home');
        }}
      />

      {/* Product Detail / Quick View Modal */}
      <ProductDetailModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onSelectProduct={(p) => setQuickViewProduct(p)}
      />

      {/* 3-Minute Cooking & Frying Guide Modal */}
      <CookingGuideModal
        isOpen={isCookingGuideOpen}
        onClose={() => setIsCookingGuideOpen(false)}
      />

      {/* Admin Authentication Login Modal (Hidden Access via Ctrl+Shift+A, #admin or Discreet Lock) */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => {
          setIsAdminLoginOpen(false);
          if (window.location.hash === '#admin' || window.location.hash === '#admin-login') {
            window.history.replaceState(null, '', window.location.pathname);
          }
        }}
        onSuccess={handleAdminLoginSuccess}
      />

    </div>
  );
}
