import {
  SiteSettings,
  NotificationBarConfig,
  NavbarConfig,
  HeroSlide,
  TopSellingSectionConfig,
  NimkoRangeSectionConfig,
  FooterConfig,
  CategoryItem,
  PurchaseRecord,
  OrderDetails
} from '../types';
import { PRODUCTS } from './products';

import heroImg from '../assets/images/hero_kabab_nimko_1787856565814.jpg';
import comboImg from '../assets/images/combo_pack_deal_1787856623204.jpg';
import nimkoImg from '../assets/images/mix_nimko_prod_1787856606652.jpg';
import chickenImg from '../assets/images/chicken_kabab_prod_1787856580952.jpg';
import beefImg from '../assets/images/beef_kabab_prod_1787856593378.jpg';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  whatsappNumber: '+923001234567',
  whatsappDisplay: '+92 300 1234567',
  phoneHotline: '+92 300 1234567',
  brandName: 'Nimko & Kabab Co.',
  brandTagline: 'Frozen • Fresh • Ready to Fry',
  currency: 'Rs.',
  freeDeliveryThreshold: 2000,
  standardDeliveryFee: 150,
  kitchenHours: '9:00 AM – 11:00 PM Daily',
  kitchenAddress: 'Commercial Kitchen: Block 6, PECHS & Phase 5 DHA, Karachi',
  email: 'orders@nimkokabab.pk'
};

export const DEFAULT_NOTIFICATION_BAR: NotificationBarConfig = {
  enabled: true,
  badgeText: 'Karachi Delivery',
  mainText: '❄️ Same-Day Cold Chain Delivery • 🚚 FREE Shipping over Rs. 2,000',
  mobileText: '❄️ 100% Halal Frozen Kababs & Fresh Nimko',
  showCookingGuide: true,
  showPhoneCall: true
};

export const DEFAULT_NAVBAR_CONFIG: NavbarConfig = {
  brandPrefix: 'Nimko & Kabab',
  brandSuffix: 'Co.',
  subtext: 'Frozen • Ready to Fry • Artisanal Snacks',
  estYear: 'Est. 2021',
  links: [
    { id: 'nav-home', label: 'Home', page: 'home', iconName: 'home', isEnabled: true },
    { id: 'nav-shop', label: 'Shop / Menu', page: 'shop', iconName: 'shopping-bag', isEnabled: true },
    { id: 'nav-deals', label: 'Hot Deals', page: 'deals', badge: 'SAVE 20%', iconName: 'flame', isEnabled: true },
    { id: 'nav-delivery', label: 'Delivery Areas', page: 'delivery', iconName: 'map-pin', isEnabled: true },
    { id: 'nav-about', label: 'About Us', page: 'about', iconName: 'info', isEnabled: true }
  ],
  showSearch: true,
  showCookingGuide: true,
  showCart: true
};

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    badge: 'Karachi Home Delivery • Blast Frozen',
    badgeIconType: 'snowflake',
    title: 'Frozen, Fresh, Ready to Fry in 3 Minutes',
    subtitle: 'Artisanal Chicken & Beef Seekh Kababs, Shami Kababs, and Crispy Karachi Mix Nimko. Made with 100% Halal prime meat, secret family spices, and zero preservatives.',
    primaryBtnText: 'Order Kababs Now',
    primaryPage: 'shop',
    primaryCategory: 'all',
    secondaryBtnText: 'View Bestsellers',
    secondaryPage: 'shop',
    secondaryCategory: 'chicken',
    image: heroImg,
    highlights: ['❄️ 100% Cold-Chain Protected', '⏱️ Fry Direct From Frozen', '✨ Zero Preservatives'],
    isEnabled: true
  },
  {
    id: 'slide-2',
    badge: 'Limited Time Deal • Save Up to 20%',
    badgeIconType: 'flame',
    title: 'Family Feast Combo Bundles',
    subtitle: 'Stock your home freezer for unannounced guests, dinner parties, and late night cravings. 24 Kababs + 500g Crunchy Mix Nimko + Free Mint Imli Chutney.',
    primaryBtnText: 'Shop Combo Deals',
    primaryPage: 'deals',
    secondaryBtnText: 'See Included Items',
    secondaryPage: 'deals',
    image: comboImg,
    highlights: ['🍗 12 Chicken + 12 Beef Kababs', '🥜 500g Royal Mix Nimko', '🎁 Free Chutney Included'],
    isEnabled: true
  },
  {
    id: 'slide-3',
    badge: 'Fresh Small Batches • Karak Chai Companion',
    badgeIconType: 'sparkles',
    title: 'Artisanal Karachi Mix Nimko Packs',
    subtitle: 'Crispy gram flour sev, roasted golden peanuts, spicy lentils, and hand-ground tangy chaat masala. Sealed in zipper aroma-lock pouches.',
    primaryBtnText: 'Shop Nimko Collection',
    primaryPage: 'shop',
    primaryCategory: 'nimko',
    secondaryBtnText: 'View Pack Sizes',
    secondaryPage: 'shop',
    secondaryCategory: 'nimko',
    image: nimkoImg,
    highlights: ['🫖 Perfect with Evening Chai', '🌾 Pure Vegetable Oil', '🌶️ Medium & Spicy Options'],
    isEnabled: true
  }
];

export const DEFAULT_TOP_SELLING_CONFIG: TopSellingSectionConfig = {
  enabled: true,
  badge: 'Customer Favorites',
  title: 'Top Selling Frozen Kababs & Snacks',
  subtitle: 'Ordered most frequently across Karachi for dinners, bun kababs, and tea-time crunch.',
  customProductIds: [],
  ctaText: 'Explore All Kabab & Nimko Varieties',
  ctaCategory: 'all'
};

export const DEFAULT_NIMKO_RANGE_CONFIG: NimkoRangeSectionConfig = {
  enabled: true,
  badge: 'Artisanal Tea-Time Crunch',
  title: "Karachi's Favorite Mix Nimko Range",
  subtitle: 'Hand-prepared in small batches with pure spices, crunchy peanuts, and zero oily aftertaste.',
  customProductIds: [],
  ctaText: 'View All Nimko Flavors'
};

export const DEFAULT_FOOTER_CONFIG: FooterConfig = {
  brandDescription: "Karachi's trusted local artisanal food brand for gourmet frozen chicken kababs, prime beef seekh kababs, and crunchy mix nimko tea snacks. Prepared with 100% Halal certified meat and zero preservatives.",
  halalBadgeText: '100% Halal Meat',
  coldChainBadgeText: 'Cold-Chain Dispatch',
  quickLinks: [
    { id: 'fl-1', label: 'Home', page: 'home' },
    { id: 'fl-2', label: 'Shop All Products', page: 'shop' },
    { id: 'fl-3', label: 'Family Deals & Offers 🔥', page: 'deals', isHighlighted: true },
    { id: 'fl-4', label: '3-Min Frying Guide', page: 'shop' },
    { id: 'fl-5', label: 'About Our Kitchen', page: 'about' },
    { id: 'fl-6', label: 'Delivery Zones & Rates', page: 'delivery' }
  ],
  deliveryAreas: [
    'DHA Phases 1–8',
    'Clifton Blocks 1–9',
    'Gulshan-e-Iqbal',
    'Gulistan-e-Johar',
    'PECHS / Tariq Rd',
    'North Nazimabad',
    'Bahadurabad',
    'Malir Cantt & Askari'
  ],
  newsletterPromoText: 'Get special weekend promo codes:',
  welcomeCouponCode: 'WELCOME10',
  seoText: 'Nimko & Kabab Co. — Frozen Chicken Kabab, Beef Kabab & Mix Nimko Delivery in Karachi.',
  copyrightText: `© ${new Date().getFullYear()} Nimko & Kabab Co. All rights reserved. 100% Halal Food Guaranteed.`
};

export const SAMPLE_IMAGE_PRESETS = [
  { name: 'Kabab Grill / Hero Banner', url: heroImg },
  { name: 'Chicken Seekh Kabab Pack', url: chickenImg },
  { name: 'Beef Seekh Kabab Pack', url: beefImg },
  { name: 'Mix Nimko Pack', url: nimkoImg },
  { name: 'Family Combo Deal Bundle', url: comboImg }
];

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-chicken',
    name: 'Chicken Kababs',
    slug: 'chicken',
    urduName: 'چکن کباب',
    description: '100% Halal chicken seekh, shami, and chapli kababs blast-frozen within 30 minutes.',
    badge: 'Bestseller',
    iconName: 'drumstick',
    colorBadge: 'red',
    displayOrder: 1,
    isEnabled: true
  },
  {
    id: 'cat-beef',
    name: 'Beef Kababs',
    slug: 'beef',
    urduName: 'بیف کباب',
    description: 'Prime beef seekh and succulent gola kababs with authentic charcoal tandoor flavor.',
    badge: 'Chef Special',
    iconName: 'flame',
    colorBadge: 'amber',
    displayOrder: 2,
    isEnabled: true
  },
  {
    id: 'cat-nimko',
    name: 'Karachi Mix Nimko',
    slug: 'nimko',
    urduName: 'کراچی مکس نمکو',
    description: 'Crispy gram flour sev, fried peanuts, lentils, and royal kaju blends for evening chai.',
    badge: 'Chai Companion',
    iconName: 'sparkles',
    colorBadge: 'yellow',
    displayOrder: 3,
    isEnabled: true
  },
  {
    id: 'cat-combos',
    name: 'Family Combos & Deals',
    slug: 'combos',
    urduName: 'فیملی کومبوز',
    description: 'Value bundles with kabab assortments, mix nimko packs, and free homemade chutneys.',
    badge: 'Save 20%',
    iconName: 'package',
    colorBadge: 'purple',
    displayOrder: 4,
    isEnabled: true
  }
];

export const DEFAULT_PRIMARY_MATERIAL_CATEGORIES = [
  {
    id: 'mat-cat-1',
    name: 'Raw Poultry & Beef Meat',
    code: 'MAT-MEAT',
    slug: 'raw-meat',
    description: '100% Halal fresh slaughtered boneless chicken breasts, lean beef mince, mutton cubes.',
    defaultUnit: 'Kg',
    color: 'red',
    isCustom: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'mat-cat-2',
    name: 'Gram Flour, Pulses & Besan',
    code: 'MAT-BESAN',
    slug: 'gram-flour-pulses',
    description: 'Triple-sifted pure chana daal besan, whole moong, lentils, and peanuts for crispy nimko.',
    defaultUnit: 'Kg',
    color: 'amber',
    isCustom: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'mat-cat-3',
    name: 'Whole Spices, Herbs & Seasonings',
    code: 'MAT-SPICE',
    slug: 'spices-seasonings',
    description: 'Jodia Bazaar garam masala, kachri powder, roasted cumin, red chili flakes, crushed coriander.',
    defaultUnit: 'Kg',
    color: 'orange',
    isCustom: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'mat-cat-4',
    name: 'Cooking Oils, Banaspati Ghee & Fats',
    code: 'MAT-OIL',
    slug: 'cooking-oil-ghee',
    description: 'Premium refined canola oil, banaspati ghee, and culinary fats for small batch frying.',
    defaultUnit: 'Liters',
    color: 'emerald',
    isCustom: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'mat-cat-5',
    name: 'Packaging Pouches, Trays & Boxes',
    code: 'MAT-PACK',
    slug: 'packaging-materials',
    description: 'Cold-chain vacuum barrier bags, zipper aroma-lock pouches, corrugated shipper boxes.',
    defaultUnit: 'Packs',
    color: 'blue',
    isCustom: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'mat-cat-6',
    name: 'Condiments, Marinades & Sauces',
    code: 'MAT-COND',
    slug: 'condiments-sauces',
    description: 'Tamarind (Imli) pulp, fresh mint-coriander puree, green chillies, vinegar, food-grade twine.',
    defaultUnit: 'Kg',
    color: 'purple',
    isCustom: false,
    createdAt: new Date().toISOString()
  }
];

export const DEFAULT_PURCHASE_RECORDS: PurchaseRecord[] = [
  {
    id: 'pur-101',
    purchaseInvoiceNo: 'INV-MEAT-8821',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString().slice(0, 10), // 2 days ago
    supplierName: 'Al-Haram Halal Poultry & Beef Farms',
    supplierPhone: '+92 321 4455667',
    category: 'Raw Meat',
    items: [
      { name: 'Boneless Prime Chicken Breast', category: 'Raw Meat', quantity: 50, unit: 'Kg', unitCost: 650, totalCost: 32500 },
      { name: 'Prime Beef Mince 80/20 Lean', category: 'Raw Meat', quantity: 40, unit: 'Kg', unitCost: 850, totalCost: 34000 }
    ],
    totalAmount: 66500,
    paymentStatus: 'Paid',
    paymentMethod: 'bank_transfer',
    notes: 'Certified 100% Halal fresh morning slaughter delivery.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
  },
  {
    id: 'pur-102',
    purchaseInvoiceNo: 'INV-SPICE-4022',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString().slice(0, 10), // 5 days ago
    supplierName: 'Jodia Bazaar Whole Spices Traders',
    supplierPhone: '+92 300 9988112',
    category: 'Spices & Seasoning',
    items: [
      { name: 'Whole Cumin & Coriander Seeds', category: 'Spices', quantity: 20, unit: 'Kg', unitCost: 450, totalCost: 9000 },
      { name: 'Kashmiri Red Chili & Amchoor', category: 'Spices', quantity: 15, unit: 'Kg', unitCost: 600, totalCost: 9000 },
      { name: 'Black Himalayan Rock Salt', category: 'Spices', quantity: 25, unit: 'Kg', unitCost: 120, totalCost: 3000 }
    ],
    totalAmount: 21000,
    paymentStatus: 'Paid',
    paymentMethod: 'cash',
    notes: 'Premium hand-cleaned whole spices batch.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString()
  },
  {
    id: 'pur-103',
    purchaseInvoiceNo: 'INV-PKG-9011',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString().slice(0, 10), // 10 days ago
    supplierName: 'Sindh Pack & Thermal Solutions',
    supplierPhone: '+92 333 1122334',
    category: 'Packaging Materials',
    items: [
      { name: 'Zipper Cold-Lock Standup Pouches (500g)', category: 'Packaging', quantity: 1000, unit: 'Packs', unitCost: 14, totalCost: 14000 },
      { name: 'Vacuum Sealed Frozen Kabab Trays', category: 'Packaging', quantity: 800, unit: 'Packs', unitCost: 18, totalCost: 14400 }
    ],
    totalAmount: 28400,
    paymentStatus: 'Paid',
    paymentMethod: 'bank_transfer',
    notes: 'Aroma-lock foil laminates with certified food grade barrier.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString()
  }
];

export const DEFAULT_INITIAL_ORDERS: OrderDetails[] = [
  {
    orderId: 'ORD-7821',
    customerName: 'Zubair Tariq',
    phone: '0300-2458911',
    email: 'zubair.tariq@gmail.com',
    address: 'House 42, Street 7, Phase 6, DHA',
    area: 'DHA Phases 1–8',
    landmark: 'Near Saba Avenue Roundabout',
    deliveryDate: new Date().toISOString().slice(0, 10),
    timeSlot: '6:00 PM – 9:00 PM (Evening Slot)',
    paymentMethod: 'cod',
    paymentStatus: 'Paid',
    notes: 'Please ring the bell twice and bring exact change.',
    items: [
      {
        cartItemId: 'prod-chicken-seekh-1',
        productId: 'prod-chicken-seekh',
        product: PRODUCTS[0],
        selectedPack: PRODUCTS[0].packOptions[1], // 500g (12 Pcs), price 980, cost 540
        quantity: 2
      },
      {
        cartItemId: 'prod-mix-nimko-special-1',
        productId: 'prod-mix-nimko-special',
        product: PRODUCTS[5],
        selectedPack: PRODUCTS[5].packOptions[1], // 500g, price 540, cost 260
        quantity: 1
      }
    ],
    subtotal: 2500,
    discountAmount: 0,
    deliveryFee: 0,
    total: 2500,
    costTotal: 1340, // 540*2 + 260 = 1340
    profit: 1160,
    createdAt: new Date().toISOString(),
    status: 'Delivered',
    assignedRider: {
      name: 'Kamran Ali',
      phone: '0315-8822910',
      vehicleNo: 'KHI-9821'
    }
  },
  {
    orderId: 'ORD-7820',
    customerName: 'Ayesha Bilgrami',
    phone: '0321-9876543',
    email: 'ayesha.b@outlook.com',
    address: 'Flat 4B, Al-Noor Heights, Block 4, Clifton',
    area: 'Clifton Blocks 1–9',
    landmark: 'Behind Boat Basin Park',
    deliveryDate: new Date().toISOString().slice(0, 10),
    timeSlot: '2:00 PM – 5:00 PM (Afternoon Slot)',
    paymentMethod: 'raast',
    paymentStatus: 'Paid',
    notes: 'Leave with apartment reception if not answering.',
    items: [
      {
        cartItemId: 'prod-family-feast-combo-0',
        productId: 'prod-family-feast-combo',
        product: PRODUCTS[8],
        selectedPack: PRODUCTS[8].packOptions[0], // price 2350, cost 1380
        quantity: 1
      }
    ],
    subtotal: 2350,
    discountAmount: 150,
    deliveryFee: 0,
    total: 2200,
    costTotal: 1380,
    profit: 820,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    status: 'Out for Delivery',
    assignedRider: {
      name: 'Muhammad Asif',
      phone: '0334-7711200',
      vehicleNo: 'KHI-4433'
    }
  },
  {
    orderId: 'ORD-7819',
    customerName: 'Farhan Siddiqui',
    phone: '0333-8823419',
    address: 'B-144, Block 7, Gulshan-e-Iqbal',
    area: 'Gulshan-e-Iqbal',
    landmark: 'Near Disco Bakery & Maskan',
    deliveryDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString().slice(0, 10),
    timeSlot: '6:00 PM – 9:00 PM (Evening Slot)',
    paymentMethod: 'jazzcash_easypaisa',
    paymentStatus: 'Paid',
    items: [
      {
        cartItemId: 'prod-beef-seekh-1',
        productId: 'prod-beef-seekh',
        product: PRODUCTS[2],
        selectedPack: PRODUCTS[2].packOptions[1], // price 1150, cost 660
        quantity: 1
      },
      {
        cartItemId: 'prod-chicken-shami-1',
        productId: 'prod-chicken-shami',
        product: PRODUCTS[1],
        selectedPack: PRODUCTS[1].packOptions[1], // price 920, cost 510
        quantity: 1
      }
    ],
    subtotal: 2070,
    discountAmount: 0,
    deliveryFee: 0,
    total: 2070,
    costTotal: 1170,
    profit: 900,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    status: 'Delivered'
  },
  {
    orderId: 'ORD-7818',
    customerName: 'Dr. Sameera Khan',
    phone: '0302-3344556',
    address: 'House 88/B, Sindhi Muslim Housing Society (SMCHS)',
    area: 'PECHS / Tariq Rd',
    landmark: 'Behind Jafferjees',
    deliveryDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString().slice(0, 10),
    timeSlot: '2:00 PM – 5:00 PM (Afternoon Slot)',
    paymentMethod: 'cod',
    paymentStatus: 'Paid',
    items: [
      {
        cartItemId: 'prod-weekend-chai-nimko-bundle-0',
        productId: 'prod-weekend-chai-nimko-bundle',
        product: PRODUCTS[9],
        selectedPack: PRODUCTS[9].packOptions[0], // price 1550, cost 910
        quantity: 2
      }
    ],
    subtotal: 3100,
    discountAmount: 200,
    deliveryFee: 0,
    total: 2900,
    costTotal: 1820,
    profit: 1080,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    status: 'Delivered'
  },
  {
    orderId: 'ORD-7817',
    customerName: 'Omer Farooq',
    phone: '0345-6677889',
    address: 'Apartment 12, Block C, North Nazimabad',
    area: 'North Nazimabad',
    landmark: 'Near Five Star Chowrangi',
    deliveryDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString().slice(0, 10),
    timeSlot: '6:00 PM – 9:00 PM (Evening Slot)',
    paymentMethod: 'card',
    paymentStatus: 'Paid',
    items: [
      {
        cartItemId: 'prod-beef-gola-0',
        productId: 'prod-beef-gola',
        product: PRODUCTS[3],
        selectedPack: PRODUCTS[3].packOptions[0], // price 1190, cost 690
        quantity: 1
      },
      {
        cartItemId: 'prod-kaju-peanut-nimko-1',
        productId: 'prod-kaju-peanut-nimko',
        product: PRODUCTS[7],
        selectedPack: PRODUCTS[7].packOptions[1], // price 1080, cost 640
        quantity: 1
      }
    ],
    subtotal: 2270,
    discountAmount: 0,
    deliveryFee: 0,
    total: 2270,
    costTotal: 1330,
    profit: 940,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    status: 'Delivered'
  }
];

