import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Deal,
  SiteSettings,
  NotificationBarConfig,
  NavbarConfig,
  NavLinkConfig,
  HeroSlide,
  TopSellingSectionConfig,
  NimkoRangeSectionConfig,
  FooterConfig,
  FooterQuickLink,
  CategoryItem,
  PrimaryMaterialCategory,
  PurchaseRecord,
  OrderDetails
} from '../types';

import { PRODUCTS as INITIAL_PRODUCTS } from '../data/products';
import { DEALS as INITIAL_DEALS } from '../data/deals';
import {
  DEFAULT_SITE_SETTINGS,
  DEFAULT_NOTIFICATION_BAR,
  DEFAULT_NAVBAR_CONFIG,
  DEFAULT_HERO_SLIDES,
  DEFAULT_TOP_SELLING_CONFIG,
  DEFAULT_NIMKO_RANGE_CONFIG,
  DEFAULT_FOOTER_CONFIG,
  DEFAULT_CATEGORIES,
  DEFAULT_PRIMARY_MATERIAL_CATEGORIES,
  DEFAULT_PURCHASE_RECORDS,
  DEFAULT_INITIAL_ORDERS
} from '../data/defaultConfig';

interface StoreContextType {
  // 1. General Site & WhatsApp Settings
  siteSettings: SiteSettings;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;

  // 2. Notification Bar
  notificationBar: NotificationBarConfig;
  updateNotificationBar: (config: Partial<NotificationBarConfig>) => void;

  // 3. Navbar Config
  navbarConfig: NavbarConfig;
  updateNavbarConfig: (config: Partial<NavbarConfig>) => void;
  addNavLink: (link: Omit<NavLinkConfig, 'id'>) => void;
  updateNavLink: (id: string, updated: Partial<NavLinkConfig>) => void;
  deleteNavLink: (id: string) => void;

  // 4. Hero Slides
  heroSlides: HeroSlide[];
  addHeroSlide: (slide: Omit<HeroSlide, 'id'>) => void;
  updateHeroSlide: (id: string, updated: Partial<HeroSlide>) => void;
  deleteHeroSlide: (id: string) => void;
  reorderHeroSlides: (slides: HeroSlide[]) => void;

  // 5. Categories (CRUD)
  categories: CategoryItem[];
  addCategory: (category: Omit<CategoryItem, 'id'>) => void;
  updateCategory: (id: string, updated: Partial<CategoryItem>) => void;
  deleteCategory: (id: string) => void;
  reorderCategories: (categories: CategoryItem[]) => void;

  // 5b. Primary Material Categories (CRUD)
  primaryMaterialCategories: PrimaryMaterialCategory[];
  addPrimaryMaterialCategory: (category: Omit<PrimaryMaterialCategory, 'id' | 'createdAt'>) => void;
  updatePrimaryMaterialCategory: (id: string, updated: Partial<PrimaryMaterialCategory>) => void;
  deletePrimaryMaterialCategory: (id: string) => void;
  reorderPrimaryMaterialCategories: (categories: PrimaryMaterialCategory[]) => void;

  // 6. Products Catalog
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductBestseller: (id: string) => void;

  // 7. Deals & Family Combos
  deals: Deal[];
  addDeal: (deal: Omit<Deal, 'id'>) => void;
  updateDeal: (id: string, updated: Partial<Deal>) => void;
  deleteDeal: (id: string) => void;

  // 8. Purchases & Raw Material Inward (CRUD)
  purchases: PurchaseRecord[];
  addPurchase: (purchase: Omit<PurchaseRecord, 'id'>) => void;
  updatePurchase: (id: string, updated: Partial<PurchaseRecord>) => void;
  deletePurchase: (id: string) => void;

  // 9. Top Selling Section
  topSellingConfig: TopSellingSectionConfig;
  updateTopSellingConfig: (config: Partial<TopSellingSectionConfig>) => void;

  // 10. Nimko Range Section
  nimkoRangeConfig: NimkoRangeSectionConfig;
  updateNimkoRangeConfig: (config: Partial<NimkoRangeSectionConfig>) => void;

  // 11. Footer Config
  footerConfig: FooterConfig;
  updateFooterConfig: (config: Partial<FooterConfig>) => void;
  addFooterQuickLink: (link: Omit<FooterQuickLink, 'id'>) => void;
  updateFooterQuickLink: (id: string, link: Partial<FooterQuickLink>) => void;
  deleteFooterQuickLink: (id: string) => void;
  updateFooterDeliveryAreas: (areas: string[]) => void;

  // 12. Orders & Dispatch
  orders: OrderDetails[];
  addOrder: (order: OrderDetails) => void;
  updateOrder: (orderId: string, updated: Partial<OrderDetails>) => void;
  updateOrderStatus: (orderId: string, status: OrderDetails['status']) => void;
  deleteOrder: (orderId: string) => void;
  isOrderSoundEnabled: boolean;
  toggleOrderSound: () => void;
  lastNewOrderNotification: OrderDetails | null;
  dismissOrderNotification: () => void;
  simulateNewOrderAlert: () => void;

  // 13. Global Actions
  resetToDefaults: () => void;
  resetToFactoryDefaults: () => void;
  exportConfigJson: () => string;
  importConfigJson: (jsonString: string) => boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SETTINGS: 'nk_site_settings_v3',
  NOTIFICATION: 'nk_notification_bar_v3',
  NAVBAR: 'nk_navbar_config_v3',
  HERO: 'nk_hero_slides_v3',
  CATEGORIES: 'nk_categories_v3',
  PRIMARY_MATERIALS: 'nk_primary_material_categories_v3',
  PRODUCTS: 'nk_products_v3',
  DEALS: 'nk_deals_v3',
  PURCHASES: 'nk_purchases_v3',
  TOP_SELLING: 'nk_top_selling_v3',
  NIMKO_RANGE: 'nk_nimko_range_v3',
  FOOTER: 'nk_footer_config_v3',
  ORDERS: 'nk_orders_v3',
  SOUND_ENABLED: 'nk_order_sound_enabled_v3'
};

// Web Audio API pure synthesized chime for reliable new order alerts
export const playNewOrderAlertSound = () => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // Sound chime 1
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, ctx.currentTime); // A5
    osc1.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.12); // E6
    gain1.gain.setValueAtTime(0.25, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.55);

    // Sound chime 2 (harmonious bell ring)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1046.5, ctx.currentTime + 0.1); // C6
    osc2.frequency.exponentialRampToValueAtTime(1567.98, ctx.currentTime + 0.25); // G6
    gain2.gain.setValueAtTime(0, ctx.currentTime);
    gain2.gain.setValueAtTime(0.3, ctx.currentTime + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.95);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.1);
    osc2.stop(ctx.currentTime + 0.95);
  } catch (err) {
    console.warn('Audio chime notice:', err);
  }
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Site Settings
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SITE_SETTINGS;
    } catch {
      return DEFAULT_SITE_SETTINGS;
    }
  });

  // 2. Notification Bar
  const [notificationBar, setNotificationBar] = useState<NotificationBarConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATION);
      return saved ? { ...DEFAULT_NOTIFICATION_BAR, ...JSON.parse(saved) } : DEFAULT_NOTIFICATION_BAR;
    } catch {
      return DEFAULT_NOTIFICATION_BAR;
    }
  });

  // 3. Navbar Config
  const [navbarConfig, setNavbarConfig] = useState<NavbarConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NAVBAR);
      return saved ? { ...DEFAULT_NAVBAR_CONFIG, ...JSON.parse(saved) } : DEFAULT_NAVBAR_CONFIG;
    } catch {
      return DEFAULT_NAVBAR_CONFIG;
    }
  });

  // 4. Hero Slides
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HERO);
      return saved ? JSON.parse(saved) : DEFAULT_HERO_SLIDES;
    } catch {
      return DEFAULT_HERO_SLIDES;
    }
  });

  // 5. Categories
  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  });

  // 5b. Primary Material Categories
  const [primaryMaterialCategories, setPrimaryMaterialCategories] = useState<PrimaryMaterialCategory[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRIMARY_MATERIALS);
      return saved ? JSON.parse(saved) : DEFAULT_PRIMARY_MATERIAL_CATEGORIES;
    } catch {
      return DEFAULT_PRIMARY_MATERIAL_CATEGORIES;
    }
  });

  // 6. Products Catalog
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // 7. Deals & Family Combos
  const [deals, setDeals] = useState<Deal[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DEALS);
      return saved ? JSON.parse(saved) : INITIAL_DEALS;
    } catch {
      return INITIAL_DEALS;
    }
  });

  // 8. Purchases
  const [purchases, setPurchases] = useState<PurchaseRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PURCHASES);
      return saved ? JSON.parse(saved) : DEFAULT_PURCHASE_RECORDS;
    } catch {
      return DEFAULT_PURCHASE_RECORDS;
    }
  });

  // 9. Top Selling Section
  const [topSellingConfig, setTopSellingConfig] = useState<TopSellingSectionConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TOP_SELLING);
      return saved ? { ...DEFAULT_TOP_SELLING_CONFIG, ...JSON.parse(saved) } : DEFAULT_TOP_SELLING_CONFIG;
    } catch {
      return DEFAULT_TOP_SELLING_CONFIG;
    }
  });

  // 10. Nimko Range Section
  const [nimkoRangeConfig, setNimkoRangeConfig] = useState<NimkoRangeSectionConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NIMKO_RANGE);
      return saved ? { ...DEFAULT_NIMKO_RANGE_CONFIG, ...JSON.parse(saved) } : DEFAULT_NIMKO_RANGE_CONFIG;
    } catch {
      return DEFAULT_NIMKO_RANGE_CONFIG;
    }
  });

  // 11. Footer Config
  const [footerConfig, setFooterConfig] = useState<FooterConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FOOTER);
      return saved ? { ...DEFAULT_FOOTER_CONFIG, ...JSON.parse(saved) } : DEFAULT_FOOTER_CONFIG;
    } catch {
      return DEFAULT_FOOTER_CONFIG;
    }
  });

  // 12. Orders
  const [orders, setOrders] = useState<OrderDetails[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : DEFAULT_INITIAL_ORDERS;
    } catch {
      return DEFAULT_INITIAL_ORDERS;
    }
  });

  // Sound and Live Order Notifications
  const [isOrderSoundEnabled, setIsOrderSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SOUND_ENABLED);
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [lastNewOrderNotification, setLastNewOrderNotification] = useState<OrderDetails | null>(null);

  const toggleOrderSound = () => {
    setIsOrderSoundEnabled(prev => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const dismissOrderNotification = () => {
    setLastNewOrderNotification(null);
  };

  // LocalStorage sync effects
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(siteSettings)); } catch (e) { console.error(e); }
  }, [siteSettings]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.NOTIFICATION, JSON.stringify(notificationBar)); } catch (e) { console.error(e); }
  }, [notificationBar]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.NAVBAR, JSON.stringify(navbarConfig)); } catch (e) { console.error(e); }
  }, [navbarConfig]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.HERO, JSON.stringify(heroSlides)); } catch (e) { console.error(e); }
  }, [heroSlides]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories)); } catch (e) { console.error(e); }
  }, [categories]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.PRIMARY_MATERIALS, JSON.stringify(primaryMaterialCategories)); } catch (e) { console.error(e); }
  }, [primaryMaterialCategories]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products)); } catch (e) { console.error(e); }
  }, [products]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.DEALS, JSON.stringify(deals)); } catch (e) { console.error(e); }
  }, [deals]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify(purchases)); } catch (e) { console.error(e); }
  }, [purchases]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.TOP_SELLING, JSON.stringify(topSellingConfig)); } catch (e) { console.error(e); }
  }, [topSellingConfig]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.NIMKO_RANGE, JSON.stringify(nimkoRangeConfig)); } catch (e) { console.error(e); }
  }, [nimkoRangeConfig]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.FOOTER, JSON.stringify(footerConfig)); } catch (e) { console.error(e); }
  }, [footerConfig]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders)); } catch (e) { console.error(e); }
  }, [orders]);

  // Handler functions
  const updateSiteSettings = (settings: Partial<SiteSettings>) => {
    setSiteSettings(prev => ({ ...prev, ...settings }));
  };

  const updateNotificationBar = (config: Partial<NotificationBarConfig>) => {
    setNotificationBar(prev => ({ ...prev, ...config }));
  };

  const updateNavbarConfig = (config: Partial<NavbarConfig>) => {
    setNavbarConfig(prev => ({ ...prev, ...config }));
  };

  const addNavLink = (link: Omit<NavLinkConfig, 'id'>) => {
    const newId = `nav-${Date.now()}`;
    setNavbarConfig(prev => ({
      ...prev,
      links: [...prev.links, { ...link, id: newId }]
    }));
  };

  const updateNavLink = (id: string, updated: Partial<NavLinkConfig>) => {
    setNavbarConfig(prev => ({
      ...prev,
      links: prev.links.map(l => (l.id === id ? { ...l, ...updated } : l))
    }));
  };

  const deleteNavLink = (id: string) => {
    setNavbarConfig(prev => ({
      ...prev,
      links: prev.links.filter(l => l.id !== id)
    }));
  };

  const addHeroSlide = (slide: Omit<HeroSlide, 'id'>) => {
    const newId = `slide-${Date.now()}`;
    setHeroSlides(prev => [...prev, { ...slide, id: newId }]);
  };

  const updateHeroSlide = (id: string, updated: Partial<HeroSlide>) => {
    setHeroSlides(prev => prev.map(s => (s.id === id ? { ...s, ...updated } : s)));
  };

  const deleteHeroSlide = (id: string) => {
    setHeroSlides(prev => prev.filter(s => s.id !== id));
  };

  const reorderHeroSlides = (slides: HeroSlide[]) => {
    setHeroSlides(slides);
  };

  // Categories CRUD
  const addCategory = (category: Omit<CategoryItem, 'id'>) => {
    const newId = `cat-${Date.now()}`;
    const slug = category.slug || category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    setCategories(prev => [...prev, { ...category, id: newId, slug }]);
  };

  const updateCategory = (id: string, updated: Partial<CategoryItem>) => {
    setCategories(prev => prev.map(c => (c.id === id ? { ...c, ...updated } : c)));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const reorderCategories = (newCategories: CategoryItem[]) => {
    setCategories(newCategories);
  };

  // Primary Material Categories CRUD
  const addPrimaryMaterialCategory = (cat: Omit<PrimaryMaterialCategory, 'id' | 'createdAt'>) => {
    const newId = `mat-cat-${Date.now()}`;
    const slug = cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const code = cat.code || `MAT-${cat.name.slice(0, 4).toUpperCase().replace(/[^A-Z]/g, '')}`;
    setPrimaryMaterialCategories(prev => [
      ...prev,
      {
        ...cat,
        id: newId,
        slug,
        code,
        isCustom: true,
        createdAt: new Date().toISOString()
      }
    ]);
  };

  const updatePrimaryMaterialCategory = (id: string, updated: Partial<PrimaryMaterialCategory>) => {
    setPrimaryMaterialCategories(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updated } : c))
    );
  };

  const deletePrimaryMaterialCategory = (id: string) => {
    setPrimaryMaterialCategories(prev => prev.filter(c => c.id !== id));
  };

  const reorderPrimaryMaterialCategories = (newCategories: PrimaryMaterialCategory[]) => {
    setPrimaryMaterialCategories(newCategories);
  };

  // Products CRUD
  const addProduct = (product: Omit<Product, 'id'>) => {
    const newId = `prod-${Date.now()}`;
    setProducts(prev => [
      {
        ...product,
        id: newId,
        slug: product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      },
      ...prev
    ]);
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updated } : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const toggleProductBestseller = (id: string) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, isBestseller: !p.isBestseller } : p))
    );
  };

  // Deals CRUD
  const addDeal = (deal: Omit<Deal, 'id'>) => {
    const newId = `deal-${Date.now()}`;
    setDeals(prev => [
      {
        ...deal,
        id: newId,
        slug: deal.slug || deal.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      },
      ...prev
    ]);
  };

  const updateDeal = (id: string, updated: Partial<Deal>) => {
    setDeals(prev => prev.map(d => (d.id === id ? { ...d, ...updated } : d)));
  };

  const deleteDeal = (id: string) => {
    setDeals(prev => prev.filter(d => d.id !== id));
  };

  // Purchases CRUD
  const addPurchase = (purchase: Omit<PurchaseRecord, 'id'>) => {
    const newId = `pur-${Date.now()}`;
    setPurchases(prev => [
      { ...purchase, id: newId },
      ...prev
    ]);
  };

  const updatePurchase = (id: string, updated: Partial<PurchaseRecord>) => {
    setPurchases(prev => prev.map(p => (p.id === id ? { ...p, ...updated } : p)));
  };

  const deletePurchase = (id: string) => {
    setPurchases(prev => prev.filter(p => p.id !== id));
  };

  // Sections
  const updateTopSellingConfig = (config: Partial<TopSellingSectionConfig>) => {
    setTopSellingConfig(prev => ({ ...prev, ...config }));
  };

  const updateNimkoRangeConfig = (config: Partial<NimkoRangeSectionConfig>) => {
    setNimkoRangeConfig(prev => ({ ...prev, ...config }));
  };

  const updateFooterConfig = (config: Partial<FooterConfig>) => {
    setFooterConfig(prev => ({ ...prev, ...config }));
  };

  const addFooterQuickLink = (link: Omit<FooterQuickLink, 'id'>) => {
    const newId = `fl-${Date.now()}`;
    setFooterConfig(prev => ({
      ...prev,
      quickLinks: [...prev.quickLinks, { ...link, id: newId }]
    }));
  };

  const updateFooterQuickLink = (id: string, link: Partial<FooterQuickLink>) => {
    setFooterConfig(prev => ({
      ...prev,
      quickLinks: prev.quickLinks.map(l => (l.id === id ? { ...l, ...link } : l))
    }));
  };

  const deleteFooterQuickLink = (id: string) => {
    setFooterConfig(prev => ({
      ...prev,
      quickLinks: prev.quickLinks.filter(l => l.id !== id)
    }));
  };

  const updateFooterDeliveryAreas = (areas: string[]) => {
    setFooterConfig(prev => ({
      ...prev,
      deliveryAreas: areas
    }));
  };

  // Helper to calculate cost and profit
  const enrichOrderWithProfit = (ord: OrderDetails): OrderDetails => {
    let costTotal = 0;
    if (ord.items && ord.items.length > 0) {
      ord.items.forEach(item => {
        const unitCost = item.selectedPack?.costPrice || (item.selectedPack?.price ? Math.round(item.selectedPack.price * 0.55) : 0);
        costTotal += unitCost * (item.quantity || 1);
      });
    }
    const profit = Math.max(0, (ord.total || 0) - costTotal);
    return {
      ...ord,
      costTotal: ord.costTotal !== undefined ? ord.costTotal : costTotal,
      profit: ord.profit !== undefined ? ord.profit : profit,
      paymentStatus: ord.paymentStatus || 'Paid'
    };
  };

  // Orders CRUD
  const addOrder = (order: OrderDetails) => {
    const enriched = enrichOrderWithProfit(order);
    setOrders(prev => [enriched, ...prev]);

    // Trigger audible chime if sound enabled
    if (isOrderSoundEnabled) {
      playNewOrderAlertSound();
    }

    // Trigger instant new order notification banner
    setLastNewOrderNotification(enriched);
  };

  const simulateNewOrderAlert = () => {
    const mockOrder: OrderDetails = {
      orderId: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: 'Ayesha Tariq',
      phone: '0300-1234567',
      email: 'ayesha.tariq@gmail.com',
      address: 'House #45, Block 5, Gulshan-e-Iqbal',
      area: 'Gulshan-e-Iqbal',
      deliveryDate: new Date().toISOString().split('T')[0],
      timeSlot: 'Evening (5:00 PM – 8:00 PM)',
      paymentMethod: 'cod',
      paymentStatus: 'Pending',
      notes: 'Please pack extra mint chutney & handle with care',
      items: [
        {
          cartItemId: `item-${Date.now()}-1`,
          productId: products[0]?.id || 'p1',
          product: products[0] || ({} as any),
          selectedPack: products[0]?.packOptions?.[1] || { size: '1 Dozen (12 Pcs)', weightGrams: 500, price: 980, costPrice: 540 },
          quantity: 2
        }
      ],
      subtotal: 1960,
      discountAmount: 0,
      deliveryFee: 150,
      total: 2110,
      costTotal: 1080,
      profit: 1030,
      createdAt: new Date().toISOString(),
      status: 'Received'
    };

    addOrder(mockOrder);
  };

  const updateOrder = (orderId: string, updated: Partial<OrderDetails>) => {
    setOrders(prev =>
      prev.map(o => {
        if (o.orderId === orderId) {
          const merged = { ...o, ...updated };
          return enrichOrderWithProfit(merged);
        }
        return o;
      })
    );
  };

  const updateOrderStatus = (orderId: string, status: OrderDetails['status']) => {
    setOrders(prev =>
      prev.map(o => (o.orderId === orderId ? { ...o, status } : o))
    );
  };

  const deleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.orderId !== orderId));
  };

  const resetToDefaults = () => {
    setSiteSettings(DEFAULT_SITE_SETTINGS);
    setNotificationBar(DEFAULT_NOTIFICATION_BAR);
    setNavbarConfig(DEFAULT_NAVBAR_CONFIG);
    setHeroSlides(DEFAULT_HERO_SLIDES);
    setCategories(DEFAULT_CATEGORIES);
    setPrimaryMaterialCategories(DEFAULT_PRIMARY_MATERIAL_CATEGORIES);
    setProducts(INITIAL_PRODUCTS);
    setDeals(INITIAL_DEALS);
    setPurchases(DEFAULT_PURCHASE_RECORDS);
    setTopSellingConfig(DEFAULT_TOP_SELLING_CONFIG);
    setNimkoRangeConfig(DEFAULT_NIMKO_RANGE_CONFIG);
    setFooterConfig(DEFAULT_FOOTER_CONFIG);
    setOrders(DEFAULT_INITIAL_ORDERS);

    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATION);
    localStorage.removeItem(STORAGE_KEYS.NAVBAR);
    localStorage.removeItem(STORAGE_KEYS.HERO);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.PRIMARY_MATERIALS);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.DEALS);
    localStorage.removeItem(STORAGE_KEYS.PURCHASES);
    localStorage.removeItem(STORAGE_KEYS.TOP_SELLING);
    localStorage.removeItem(STORAGE_KEYS.NIMKO_RANGE);
    localStorage.removeItem(STORAGE_KEYS.FOOTER);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
  };

  const exportConfigJson = (): string => {
    const data = {
      siteSettings,
      notificationBar,
      navbarConfig,
      heroSlides,
      categories,
      primaryMaterialCategories,
      products,
      deals,
      purchases,
      orders,
      topSellingConfig,
      nimkoRangeConfig,
      footerConfig
    };
    return JSON.stringify(data, null, 2);
  };

  const importConfigJson = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.siteSettings) setSiteSettings(parsed.siteSettings);
      if (parsed.notificationBar) setNotificationBar(parsed.notificationBar);
      if (parsed.navbarConfig) setNavbarConfig(parsed.navbarConfig);
      if (parsed.heroSlides) setHeroSlides(parsed.heroSlides);
      if (parsed.categories) setCategories(parsed.categories);
      if (parsed.primaryMaterialCategories) setPrimaryMaterialCategories(parsed.primaryMaterialCategories);
      if (parsed.products) setProducts(parsed.products);
      if (parsed.deals) setDeals(parsed.deals);
      if (parsed.purchases) setPurchases(parsed.purchases);
      if (parsed.orders) setOrders(parsed.orders);
      if (parsed.topSellingConfig) setTopSellingConfig(parsed.topSellingConfig);
      if (parsed.nimkoRangeConfig) setNimkoRangeConfig(parsed.nimkoRangeConfig);
      if (parsed.footerConfig) setFooterConfig(parsed.footerConfig);
      return true;
    } catch (e) {
      console.error('Invalid configuration JSON', e);
      return false;
    }
  };

  return (
    <StoreContext.Provider
      value={{
        siteSettings,
        updateSiteSettings,
        notificationBar,
        updateNotificationBar,
        navbarConfig,
        updateNavbarConfig,
        addNavLink,
        updateNavLink,
        deleteNavLink,
        heroSlides,
        addHeroSlide,
        updateHeroSlide,
        deleteHeroSlide,
        reorderHeroSlides,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        reorderCategories,
        primaryMaterialCategories,
        addPrimaryMaterialCategory,
        updatePrimaryMaterialCategory,
        deletePrimaryMaterialCategory,
        reorderPrimaryMaterialCategories,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductBestseller,
        deals,
        addDeal,
        updateDeal,
        deleteDeal,
        purchases,
        addPurchase,
        updatePurchase,
        deletePurchase,
        topSellingConfig,
        updateTopSellingConfig,
        nimkoRangeConfig,
        updateNimkoRangeConfig,
        footerConfig,
        updateFooterConfig,
        addFooterQuickLink,
        updateFooterQuickLink,
        deleteFooterQuickLink,
        updateFooterDeliveryAreas,
        orders,
        addOrder,
        updateOrder,
        updateOrderStatus,
        deleteOrder,
        isOrderSoundEnabled,
        toggleOrderSound,
        lastNewOrderNotification,
        dismissOrderNotification,
        simulateNewOrderAlert,
        resetToDefaults,
        resetToFactoryDefaults: resetToDefaults,
        exportConfigJson,
        importConfigJson
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

