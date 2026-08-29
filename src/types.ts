export type Category = string;

export type SpiceLevel = 'Mild' | 'Medium' | 'Spicy' | 'Kids-Friendly';

export interface CategoryItem {
  id: string;
  name: string; // e.g. "Chicken Kababs"
  slug: string; // e.g. "chicken"
  urduName?: string; // e.g. "چکن کباب"
  description?: string;
  badge?: string; // e.g. "Bestseller", "Hot"
  image?: string;
  iconName?: 'drumstick' | 'flame' | 'utensils' | 'package' | 'sparkles' | 'layers' | 'star' | 'heart';
  colorBadge?: string; // e.g. "red", "amber", "emerald", "purple", "blue"
  displayOrder: number;
  isEnabled: boolean;
}

export interface PackOption {
  size: string; // e.g. "500g (12 Pcs)", "1 Kg (24 Pcs)", "250g Pack"
  weightGrams: number;
  pieces?: number;
  price: number; // Selling Price in Rs.
  originalPrice?: number;
  costPrice?: number; // Purchase / Production Cost per pack in Rs.
  isPopular?: boolean;
}

export interface CookingInstruction {
  method: 'Pan Fry' | 'Deep Fry' | 'Air Fryer' | 'Tawa / Grill';
  time: string;
  temperature: string;
  steps: string[];
  tips: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  urduName?: string;
  category: string;
  tagline: string;
  description: string;
  image: string;
  galleryImages: string[];
  packOptions: PackOption[];
  defaultPackIndex: number;
  rating: number;
  reviewCount: number;
  spiceLevel: SpiceLevel;
  isBestseller?: boolean;
  isNew?: boolean;
  isDiscounted?: boolean;
  discountPercentage?: number;
  badge?: string;
  ingredients: string[];
  storageInfo: string;
  shelfLife: string;
  cookingInstructions: CookingInstruction[];
  nutritionPer100g: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
  };
  altText: string;
}

export interface Deal {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  badge: string;
  urgencyText: string;
  originalPrice: number;
  discountedPrice: number;
  savings: number;
  costPrice?: number;
  image: string;
  itemsIncluded: string[];
  servings: string;
  expiryHoursLeft?: number;
  description: string;
}

export interface CartItem {
  cartItemId: string; // unique combo of productId + selectedPackIndex
  productId: string;
  product: Product;
  selectedPack: PackOption;
  quantity: number;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  review: string;
  productBought: string;
  date: string;
  avatar: string;
  verifiedBuyer: boolean;
}

export interface DeliveryZone {
  id: string;
  name: string;
  subAreas: string[];
  deliveryTime: string;
  minOrder: number;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  sameDayCutoff: string;
}

export interface OrderDetails {
  orderId: string;
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  area: string;
  landmark?: string;
  deliveryDate: string;
  timeSlot: string;
  paymentMethod: 'cod' | 'raast' | 'jazzcash_easypaisa' | 'card';
  paymentStatus?: 'Pending' | 'Paid' | 'Refunded';
  notes?: string;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  deliveryFee: number;
  total: number;
  costTotal?: number; // Total Cost of Goods Sold (COGS)
  profit?: number; // Gross Profit = total - costTotal - discount
  promoCode?: string;
  createdAt: string;
  status: 'Received' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  assignedRider?: {
    name: string;
    phone: string;
    vehicleNo?: string;
  };
}

export interface PrimaryMaterialCategory {
  id: string;
  name: string; // e.g. "Raw Poultry & Meat", "Pulses & Besan"
  code: string; // e.g. "MAT-MEAT", "MAT-BESAN"
  slug: string; // e.g. "raw-meat", "pulses-besan"
  description?: string;
  defaultUnit: string; // e.g. "Kg", "Bags", "Liters", "Packs", "Cartons"
  color: string; // e.g. "red", "amber", "emerald", "blue", "purple", "orange"
  colorBadge?: string;
  displayOrder?: number;
  isEnabled?: boolean;
  isCustom?: boolean;
  createdAt: string;
}

export interface PurchaseItem {
  name: string;
  category: string;
  quantity: number;
  unit: string; // e.g. "Kg", "Packs", "Bags", "Liters", "Boxes"
  unitCost: number;
  totalCost: number;
}

export interface PurchaseRecord {
  id: string;
  purchaseInvoiceNo: string;
  date: string; // YYYY-MM-DD
  supplierName: string;
  supplierPhone?: string;
  category: string; // References PrimaryMaterialCategory name or custom string
  items: PurchaseItem[];
  totalAmount: number;
  paymentStatus: 'Paid' | 'Unpaid' | 'Partial';
  paymentMethod: 'cash' | 'bank_transfer' | 'cheque';
  notes?: string;
  createdAt: string;
}

export type PageView = 'home' | 'shop' | 'deals' | 'about' | 'delivery' | 'product-detail' | 'cart' | 'checkout' | 'admin';

export interface SiteSettings {
  whatsappNumber: string; // e.g. "+923001234567"
  whatsappDisplay: string; // e.g. "+92 300 1234567"
  phoneHotline: string; // e.g. "+92 300 1234567"
  brandName: string; // e.g. "Nimko & Kabab Co."
  brandTagline: string; // e.g. "Frozen • Fresh • Ready to Fry"
  currency: string; // e.g. "Rs."
  freeDeliveryThreshold: number; // e.g. 2000
  standardDeliveryFee: number; // e.g. 150
  kitchenHours: string; // e.g. "9:00 AM – 11:00 PM Daily"
  kitchenAddress: string; // e.g. "Commercial Kitchen: Block 6, PECHS & Phase 5 DHA, Karachi"
  email: string; // e.g. "orders@nimkokabab.pk"
}

export interface NotificationBarConfig {
  enabled: boolean;
  badgeText: string;
  mainText: string;
  mobileText: string;
  showCookingGuide: boolean;
  showPhoneCall: boolean;
}

export interface NavLinkConfig {
  id: string;
  label: string;
  page: PageView;
  badge?: string;
  iconName?: 'home' | 'flame' | 'map-pin' | 'info' | 'shopping-bag' | 'chef-hat';
  isEnabled: boolean;
}

export interface NavbarConfig {
  brandPrefix: string;
  brandSuffix: string;
  subtext: string;
  estYear: string;
  links: NavLinkConfig[];
  showSearch: boolean;
  showCookingGuide: boolean;
  showCart: boolean;
}

export interface HeroSlide {
  id: string;
  badge: string;
  badgeIconType?: 'snowflake' | 'flame' | 'sparkles' | 'award';
  title: string;
  subtitle: string;
  primaryBtnText: string;
  primaryPage: PageView;
  primaryCategory?: string;
  secondaryBtnText: string;
  secondaryPage: PageView;
  secondaryCategory?: string;
  image: string;
  highlights: string[];
  isEnabled: boolean;
}

export interface TopSellingSectionConfig {
  enabled: boolean;
  badge: string;
  title: string;
  subtitle: string;
  customProductIds: string[]; // empty means auto-bestsellers
  ctaText: string;
  ctaCategory: string;
}

export interface NimkoRangeSectionConfig {
  enabled: boolean;
  badge: string;
  title: string;
  subtitle: string;
  customProductIds: string[]; // empty means auto-nimko
  ctaText: string;
}

export interface FooterQuickLink {
  id: string;
  label: string;
  page: PageView;
  isHighlighted?: boolean;
}

export interface FooterConfig {
  brandDescription: string;
  halalBadgeText: string;
  coldChainBadgeText: string;
  quickLinks: FooterQuickLink[];
  deliveryAreas: string[];
  newsletterPromoText: string;
  welcomeCouponCode: string;
  seoText: string;
  copyrightText: string;
}

export type AdminTab = 
  | 'overview'
  | 'categories'
  | 'products'
  | 'orders'
  | 'reports'
  | 'purchases'
  | 'deals'
  | 'seo'
  | 'whatsapp'
  | 'notification-bar'
  | 'navbar'
  | 'hero'
  | 'top-selling'
  | 'nimko-range'
  | 'footer'
  | 'backup';

