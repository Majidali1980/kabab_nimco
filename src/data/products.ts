import { Product } from '../types';

import chickenKababImg from '../assets/images/chicken_kabab_prod_1787856580952.jpg';
import beefKababImg from '../assets/images/beef_kabab_prod_1787856593378.jpg';
import mixNimkoImg from '../assets/images/mix_nimko_prod_1787856606652.jpg';
import comboDealImg from '../assets/images/combo_pack_deal_1787856623204.jpg';
import heroImg from '../assets/images/hero_kabab_nimko_1787856565814.jpg';

export { chickenKababImg, beefKababImg, mixNimkoImg, comboDealImg, heroImg };

export const PRODUCTS: Product[] = [
  {
    id: 'prod-chicken-seekh',
    name: 'Frozen Chicken Seekh Kabab',
    urduName: 'چکن سیخ کباب (فی درجن)',
    slug: 'frozen-chicken-seekh-kabab',
    category: 'chicken',
    tagline: 'Tender, juicy, charcoal-smoked minced chicken priced per dozen',
    description: 'Our signature Chicken Seekh Kababs are crafted from prime boneless chicken breast, finely minced with fresh ginger, garlic, green chilies, roasted cumin, and our secret family spice blend. Naturally blast-frozen within 30 minutes of preparation to lock in peak tenderness and smoky charcoal aroma.',
    image: chickenKababImg,
    galleryImages: [chickenKababImg, heroImg, comboDealImg],
    packOptions: [
      { size: 'Half Dozen (6 Pcs)', weightGrams: 250, pieces: 6, price: 550, originalPrice: 620, costPrice: 310 },
      { size: '1 Dozen (12 Pcs)', weightGrams: 500, pieces: 12, price: 980, originalPrice: 1150, costPrice: 540, isPopular: true },
      { size: '2 Dozen (24 Pcs Value Pack)', weightGrams: 1000, pieces: 24, price: 1850, originalPrice: 2200, costPrice: 1020 }
    ],
    defaultPackIndex: 1,
    rating: 4.9,
    reviewCount: 284,
    spiceLevel: 'Medium',
    isBestseller: true,
    badge: 'Rs. 980 / Dozen',
    ingredients: [
      '100% Halal Fresh Chicken Breast Mince',
      'Fresh Ginger & Garlic Paste',
      'Crushed Green Chilies & Fresh Mint',
      'Roasted Cumin & Coriander Seeds',
      'Garam Masala (Cardamom, Cloves, Cinnamon)',
      'Rock Salt & Black Pepper',
      'Natural Vegetable Oil'
    ],
    storageInfo: 'Keep frozen at -18°C. Do not thaw before frying.',
    shelfLife: '6 Months from manufacture date in deep freezer.',
    cookingInstructions: [
      {
        method: 'Pan Fry',
        time: '3–4 Mins',
        temperature: 'Medium Heat',
        steps: [
          'Heat 2-3 tablespoons of oil in a non-stick pan over medium heat.',
          'Place frozen kababs directly into the pan without thawing.',
          'Fry for 3-4 minutes, rotating every 60 seconds until all sides are golden brown and sizzling.',
          'Drain on paper towel and serve hot with mint chutney.'
        ],
        tips: 'Do not thaw! Frying directly from frozen keeps the juices locked inside.'
      },
      {
        method: 'Air Fryer',
        time: '6–8 Mins',
        temperature: '180°C (356°F)',
        steps: [
          'Preheat air fryer to 180°C for 2 minutes.',
          'Lightly brush or spray frozen kababs with oil.',
          'Arrange in a single layer in the basket.',
          'Air fry for 6 to 8 minutes, shaking basket at halfway mark.'
        ],
        tips: 'Great for a low-oil healthy meal option with crispy skin.'
      },
      {
        method: 'Tawa / Grill',
        time: '4–5 Mins',
        temperature: 'Medium-High',
        steps: [
          'Brush flat tawa with butter or ghee.',
          'Sear kababs turning frequently for a rich tandoori crust.'
        ],
        tips: 'Sprinkle fresh chaat masala and lemon juice right before serving.'
      }
    ],
    nutritionPer100g: {
      calories: 172,
      protein: '19.4g',
      carbs: '2.8g',
      fat: '8.6g'
    },
    altText: 'Nimko & Kabab Co. frozen chicken seekh kabab dozen pack, ready to fry'
  },
  {
    id: 'prod-chicken-shami',
    name: 'Homestyle Chicken Shami Kabab',
    urduName: 'چکن شامی کباب (فی درجن)',
    slug: 'homestyle-chicken-shami-kabab',
    category: 'chicken',
    tagline: 'Velvety smooth shredded chicken and chana daal priced per dozen',
    description: 'Slow-cooked traditional Daal and Chicken Shami Kababs made just like grandma used to prepare. Silky texture, aromatic khara masala, and coated with a light whisked egg wash so they fry to a delicate golden crisp in minutes.',
    image: chickenKababImg,
    galleryImages: [chickenKababImg, heroImg],
    packOptions: [
      { size: 'Half Dozen (6 Pcs)', weightGrams: 250, pieces: 6, price: 520, originalPrice: 580, costPrice: 290 },
      { size: '1 Dozen (12 Pcs)', weightGrams: 500, pieces: 12, price: 920, originalPrice: 1050, costPrice: 510, isPopular: true },
      { size: '2 Dozen (24 Pcs Family Pack)', weightGrams: 1000, pieces: 24, price: 1750, originalPrice: 2000, costPrice: 970 }
    ],
    defaultPackIndex: 1,
    rating: 4.8,
    reviewCount: 196,
    spiceLevel: 'Mild',
    isBestseller: true,
    badge: 'Rs. 920 / Dozen',
    ingredients: [
      '100% Halal Chicken (Shredded & Minced)',
      'Split Bengal Gram (Chana Daal)',
      'Fresh Mint & Coriander Leaves',
      'Whole Red Kashmiri Chilies',
      'Egg & Onion Bind',
      'Fresh Ginger Garlic',
      'Traditional Shami Spices'
    ],
    storageInfo: 'Store frozen at -18°C.',
    shelfLife: '6 Months',
    cookingInstructions: [
      {
        method: 'Pan Fry',
        time: '3 Mins',
        temperature: 'Medium Heat',
        steps: [
          'Heat 2 tablespoons of oil in a shallow frying pan.',
          'Place frozen shami kababs directly into medium hot oil.',
          'Shallow fry each side for 1.5 minutes until crispy golden brown.'
        ],
        tips: 'Perfect for instant Bun Kabab sandwiches or quick daal-chawal dinner.'
      }
    ],
    nutritionPer100g: {
      calories: 165,
      protein: '17.8g',
      carbs: '8.2g',
      fat: '6.4g'
    },
    altText: 'Nimko & Kabab Co. homestyle chicken shami kabab dozen pack ready to fry'
  },
  {
    id: 'prod-beef-seekh',
    name: 'Gourmet Frozen Beef Seekh Kabab',
    urduName: 'بیف سیخ کباب (فی درجن)',
    slug: 'gourmet-frozen-beef-seekh-kabab',
    category: 'beef',
    tagline: 'Rich, melt-in-mouth prime beef with traditional Karachi spices (Per Dozen)',
    description: 'Crafted from premium quality prime beef mince infused with roasted papaya tenderizer, crushed black pepper, toasted coriander, and smoked mustard oil. Yields an authentic dhaba-style juicy texture that bursts with succulent flavors.',
    image: beefKababImg,
    galleryImages: [beefKababImg, heroImg, comboDealImg],
    packOptions: [
      { size: 'Half Dozen (6 Pcs)', weightGrams: 250, pieces: 6, price: 620, originalPrice: 700, costPrice: 360 },
      { size: '1 Dozen (12 Pcs)', weightGrams: 500, pieces: 12, price: 1150, originalPrice: 1350, costPrice: 660, isPopular: true },
      { size: '2 Dozen (24 Pcs Master Pack)', weightGrams: 1000, pieces: 24, price: 2190, originalPrice: 2600, costPrice: 1250 }
    ],
    defaultPackIndex: 1,
    rating: 4.95,
    reviewCount: 342,
    spiceLevel: 'Spicy',
    isBestseller: true,
    badge: 'Rs. 1,150 / Dozen',
    ingredients: [
      '100% Halal Prime Beef Mince (80/20 lean to fat for juiciness)',
      'Raw Papaya Extract Tenderizer',
      'Fried Brown Onions',
      'Crushed Black Pepper & Red Chili Flakes',
      'Whole Coriander Seeds & Roasted Cumin',
      'Fresh Garlic, Ginger & Green Chilies',
      'Pure Spices & Sea Salt'
    ],
    storageInfo: 'Keep frozen at -18°C. Do not re-freeze after defrosting.',
    shelfLife: '6 Months',
    cookingInstructions: [
      {
        method: 'Pan Fry',
        time: '4–5 Mins',
        temperature: 'Medium-High',
        steps: [
          'Add 2 tbsp oil or ghee to a hot skillet.',
          'Fry frozen beef kababs for 4-5 minutes, turning every minute.',
          'Let rest for 1 minute before biting for maximum juiciness.'
        ],
        tips: 'Serve with parathas, sliced purple onions, and tamarind imli chutney.'
      },
      {
        method: 'Air Fryer',
        time: '8 Mins',
        temperature: '190°C',
        steps: [
          'Lightly oil the surface and air fry at 190°C for 8 minutes.'
        ],
        tips: 'Crisp exterior with ultra-tender center.'
      }
    ],
    nutritionPer100g: {
      calories: 215,
      protein: '22.1g',
      carbs: '2.1g',
      fat: '12.8g'
    },
    altText: 'Nimko & Kabab Co. frozen beef seekh kabab dozen pack, ready to fry'
  },
  {
    id: 'prod-beef-gola',
    name: 'Spicy Beef Gola Kabab (Dumwale)',
    urduName: 'دم والے بیف گولہ کباب (درجن پیک)',
    slug: 'spicy-beef-gola-kabab',
    category: 'beef',
    tagline: 'Succulent round spiced beef dumplings with coal-infused smoke (Per Dozen)',
    description: 'Round, juicy and packed with a fiery kick of green chilies, mint, and kachri powder. These beef gola kababs are precooked on charcoal skewers and immediately blast-frozen, delivering sensational restaurant-quality barbecue in minutes at home.',
    image: beefKababImg,
    galleryImages: [beefKababImg, heroImg],
    packOptions: [
      { size: '1 Dozen (12 Pcs)', weightGrams: 400, pieces: 12, price: 990, originalPrice: 1150, costPrice: 550 },
      { size: '1.25 Dozen (15 Pcs)', weightGrams: 500, pieces: 15, price: 1190, originalPrice: 1390, costPrice: 690, isPopular: true },
      { size: '2.5 Dozen (30 Pcs Party Pack)', weightGrams: 1000, pieces: 30, price: 2250, originalPrice: 2650, costPrice: 1300 }
    ],
    defaultPackIndex: 1,
    rating: 4.85,
    reviewCount: 148,
    spiceLevel: 'Spicy',
    isBestseller: false,
    badge: 'Rs. 990 / Dozen',
    ingredients: [
      'Halal Beef Mince',
      'Kachri Powder Tenderizer',
      'Fresh Mint & Cilantro Paste',
      'Chopped Green Serrano Chilies',
      'Crushed Khoya Khushboo Masala',
      'Mustard Oil Smoke'
    ],
    storageInfo: 'Store frozen at -18°C.',
    shelfLife: '6 Months',
    cookingInstructions: [
      {
        method: 'Pan Fry',
        time: '3–4 Mins',
        temperature: 'Medium',
        steps: [
          'Toss into shallow hot oil or ghee.',
          'Roll gently for 3-4 minutes until aromatic and browned.'
        ],
        tips: 'Garnish with freshly sliced ginger juliennes and lemon.'
      }
    ],
    nutritionPer100g: {
      calories: 220,
      protein: '21.5g',
      carbs: '3.0g',
      fat: '13.2g'
    },
    altText: 'Nimko & Kabab Co. spicy beef gola kabab dozen pack, ready to fry'
  },
  {
    id: 'prod-chicken-chapli',
    name: 'Peshawari Chicken Chapli Kabab',
    urduName: 'پشاوری چکن چپلی کباب (درجن پیک)',
    slug: 'peshawari-chicken-chapli-kabab',
    category: 'chicken',
    tagline: 'Crispy edged, coarse ground chicken patties with pomegranate seeds (Per Dozen)',
    description: 'Authentic Khyber-style flat chapli kababs made with coarse ground chicken, crunchy pomegranate anardana seeds, roasted coriander crushed seeds, fresh diced tomatoes, and green chilies. Crispy edges with a tender juicy center.',
    image: chickenKababImg,
    galleryImages: [chickenKababImg, heroImg],
    packOptions: [
      { size: 'Half Dozen (6 Large Pcs)', weightGrams: 500, pieces: 6, price: 990, originalPrice: 1150, costPrice: 560, isPopular: true },
      { size: '1 Dozen (12 Large Pcs)', weightGrams: 1000, pieces: 12, price: 1890, originalPrice: 2250, costPrice: 1080 }
    ],
    defaultPackIndex: 0,
    rating: 4.9,
    reviewCount: 167,
    spiceLevel: 'Medium',
    isBestseller: false,
    badge: 'Rs. 1,890 / Dozen',
    ingredients: [
      'Halal Coarse Chicken Mince',
      'Dried Pomegranate Seeds (Anardana)',
      'Crushed Roasted Coriander & Cumin',
      'Fresh Tomatoes & Green Chilies',
      'Makai Atta (Cornmeal Binder)',
      'Scallions & Mint'
    ],
    storageInfo: 'Store frozen at -18°C.',
    shelfLife: '6 Months',
    cookingInstructions: [
      {
        method: 'Pan Fry',
        time: '4 Mins',
        temperature: 'Medium-High',
        steps: [
          'Heat oil in a flat skillet.',
          'Fry each side for 2 minutes on medium heat until golden crisp.'
        ],
        tips: 'Serve with hot naan and green yogurt raita.'
      }
    ],
    nutritionPer100g: {
      calories: 180,
      protein: '18.9g',
      carbs: '5.2g',
      fat: '9.1g'
    },
    altText: 'Nimko & Kabab Co. Peshawari chicken chapli kabab dozen pack ready to fry'
  },
  {
    id: 'prod-mix-nimko-special',
    name: 'Royal Karachi Mix Nimko (Special Blend)',
    urduName: 'شاہی مکس نمکو کراچی (گرامز پیک)',
    slug: 'royal-karachi-mix-nimko',
    category: 'nimko',
    tagline: 'Crunchy golden chickpea sev, peanuts & lentils in 250g, 500g & 1000g packs',
    description: 'The crowning jewel of Karachi tea-time snacks! Prepared fresh in small batches using pure vegetable oil. Packed with crunchy gram flour sev, crispy spiced peanuts, fried green split peas, crunchy daal moth, and sprinkled with our hand-ground zesty chaat masala.',
    image: mixNimkoImg,
    galleryImages: [mixNimkoImg, heroImg, comboDealImg],
    packOptions: [
      { size: '250 Grams (250g Zip Pouch)', weightGrams: 250, price: 290, originalPrice: 340, costPrice: 140 },
      { size: '500 Grams (500g Airtight Jar)', weightGrams: 500, price: 540, originalPrice: 650, costPrice: 260, isPopular: true },
      { size: '1000 Grams / 1 Kg (Family Mega Pack)', weightGrams: 1000, price: 990, originalPrice: 1200, costPrice: 480 }
    ],
    defaultPackIndex: 1,
    rating: 4.95,
    reviewCount: 412,
    spiceLevel: 'Medium',
    isBestseller: true,
    isNew: false,
    badge: 'Rs. 540 / 500g',
    ingredients: [
      'Gram Flour (Besan) Crisps & Sev',
      'Roasted Spiced Peanuts',
      'Fried Split Green Gram (Moong Daal)',
      'Fried Brown Lentils (Daal Moth)',
      'Crispy Chickpeas (Chana)',
      'Curry Leaves & Mustard Seeds',
      'Special Zesty Chaat Masala'
    ],
    storageInfo: 'Store in an airtight container at room temperature away from direct sunlight.',
    shelfLife: '4 Months from packaging.',
    cookingInstructions: [
      {
        method: 'Tawa / Grill',
        time: 'Ready to Eat',
        temperature: 'Ambient',
        steps: [
          'Ready to eat straight from the pack.',
          'Optional tip: Warm in microwave for 15 seconds or toss on dry tawa for 30 seconds for an irresistible oven-fresh crunch!'
        ],
        tips: 'Pair with hot steaming Karak Chai or evening drinks.'
      }
    ],
    nutritionPer100g: {
      calories: 520,
      protein: '14.5g',
      carbs: '48.0g',
      fat: '29.5g'
    },
    altText: 'Nimko & Kabab Co. mix nimko pack in grams, crispy Karachi tea snack'
  },
  {
    id: 'prod-daal-moth-nimko',
    name: 'Spicy Daal Moth Nimko (Pure Moong & Lentils)',
    urduName: 'دال موٹھ نمکو (گرامز پیک)',
    slug: 'spicy-daal-moth-nimko',
    category: 'nimko',
    tagline: 'Crispy fried whole lentils with spicy black salt in 250g, 500g & 1000g packs',
    description: 'For authentic lentil snack lovers. Light, airy, high-protein fried whole brown lentils and split moong daal seasoned with black Himalayan salt, amchoor powder, and freshly ground red chili.',
    image: mixNimkoImg,
    galleryImages: [mixNimkoImg, heroImg],
    packOptions: [
      { size: '250 Grams (250g Pack)', weightGrams: 250, price: 270, originalPrice: 320, costPrice: 130 },
      { size: '500 Grams (500g Pack)', weightGrams: 500, price: 490, originalPrice: 590, costPrice: 240, isPopular: true },
      { size: '1000 Grams / 1 Kg (1000g Pack)', weightGrams: 1000, price: 920, originalPrice: 1100, costPrice: 450 }
    ],
    defaultPackIndex: 1,
    rating: 4.8,
    reviewCount: 153,
    spiceLevel: 'Spicy',
    isBestseller: false,
    badge: 'Rs. 490 / 500g',
    ingredients: [
      'Whole Brown Lentils (Moth Daal)',
      'Yellow Moong Daal',
      'Black Himalayan Salt (Kala Namak)',
      'Dry Mango (Amchur) Powder',
      'Chili Powder & Cumin'
    ],
    storageInfo: 'Airtight container at dry room temperature.',
    shelfLife: '4 Months',
    cookingInstructions: [
      {
        method: 'Tawa / Grill',
        time: 'Ready to Eat',
        temperature: 'Ambient',
        steps: ['Tear open and enjoy immediately.'],
        tips: 'Sprinkle over fresh dahi baray or fruit chaat for extra crunch!'
      }
    ],
    nutritionPer100g: {
      calories: 495,
      protein: '19.2g',
      carbs: '45.0g',
      fat: '25.1g'
    },
    altText: 'Nimko & Kabab Co. spicy daal moth nimko snack pack in grams'
  },
  {
    id: 'prod-kaju-peanut-nimko',
    name: 'Premium Roasted Kaju & Peanut Mix Nimko',
    urduName: 'کاجو اور مونگ پھلی نمکو (گرامز پیک)',
    slug: 'kaju-peanut-mix-nimko',
    category: 'nimko',
    tagline: 'Gourmet roasted cashews, almonds & peanuts in 250g & 500g deluxe jars',
    description: 'An executive blend loaded with golden fried cashews, California almonds, jumbo peanuts, and fine potato salli straws. Delicately spiced for family gatherings and festive gifting.',
    image: mixNimkoImg,
    galleryImages: [mixNimkoImg, comboDealImg],
    packOptions: [
      { size: '250 Grams (250g Jar)', weightGrams: 250, price: 580, originalPrice: 680, costPrice: 340 },
      { size: '500 Grams (500g Deluxe Jar)', weightGrams: 500, price: 1080, originalPrice: 1280, costPrice: 640, isPopular: true }
    ],
    defaultPackIndex: 0,
    rating: 4.92,
    reviewCount: 188,
    spiceLevel: 'Kids-Friendly',
    isBestseller: false,
    isNew: true,
    badge: 'Rs. 580 / 250g',
    ingredients: [
      'Whole Roasted Cashews (Kaju)',
      'Crispy Roasted Almonds',
      'Jumbo Spiced Peanuts',
      'Crispy Potato Salli',
      'Mild Sea Salt & White Pepper'
    ],
    storageInfo: 'Keep sealed in airtight jar.',
    shelfLife: '4 Months',
    cookingInstructions: [
      {
        method: 'Tawa / Grill',
        time: 'Ready to Eat',
        temperature: 'Ambient',
        steps: ['Serve as an appetizer or premium gift.'],
        tips: 'Kids and adults adore this mild savory blend.'
      }
    ],
    nutritionPer100g: {
      calories: 560,
      protein: '18.0g',
      carbs: '34.0g',
      fat: '38.0g'
    },
    altText: 'Nimko & Kabab Co. premium roasted kaju cashew peanut nimko pack in grams'
  },
  {
    id: 'prod-family-feast-combo',
    name: 'Family Feast Mega Combo Pack',
    urduName: 'فیملی فیسٹ میگا کومبو (2 درجن کباب + 500 گرام نمکو)',
    slug: 'family-feast-mega-combo',
    category: 'combos',
    tagline: '1 Dozen Chicken Seekh + 1 Dozen Beef Seekh + 500g Mix Nimko + Free Chutney',
    description: 'The ultimate household party and freezer-stocking bundle! Includes 1 Dozen (12 pcs) Chicken Seekh Kababs, 1 Dozen (12 pcs) Gourmet Beef Seekh Kababs, a 500g pouch of Royal Mix Nimko in grams, plus a complimentary 200g jar of our signature Imli-Mint Chutney.',
    image: comboDealImg,
    galleryImages: [comboDealImg, heroImg, chickenKababImg, beefKababImg, mixNimkoImg],
    packOptions: [
      { size: 'Mega Bundle (2 Dozen Kababs + 500g Nimko)', weightGrams: 1800, price: 2350, originalPrice: 2950, costPrice: 1380, isPopular: true }
    ],
    defaultPackIndex: 0,
    rating: 5.0,
    reviewCount: 520,
    spiceLevel: 'Medium',
    isBestseller: true,
    isDiscounted: true,
    discountPercentage: 20,
    badge: '20% OFF Deal',
    ingredients: [
      '1 Dozen (12 Pcs) Frozen Chicken Seekh Kababs',
      '1 Dozen (12 Pcs) Frozen Beef Seekh Kababs',
      '500g Royal Mix Nimko Pouch (Grams)',
      '200g Fresh Mint Imli Chutney'
    ],
    storageInfo: 'Store kababs at -18°C, keep nimko at room temperature.',
    shelfLife: '6 Months for kababs, 4 months for nimko.',
    cookingInstructions: [
      {
        method: 'Pan Fry',
        time: '3–4 Mins',
        temperature: 'Medium',
        steps: [
          'Fry chicken and beef kababs in separate pans or batches for 3-4 minutes each directly from frozen.',
          'Open the nimko pack and serve along with fresh parathas and mint chutney.'
        ],
        tips: 'Complete dinner and tea-time ready in under 10 minutes!'
      }
    ],
    nutritionPer100g: {
      calories: 240,
      protein: '19.5g',
      carbs: '12.0g',
      fat: '13.0g'
    },
    altText: 'Nimko & Kabab Co. family combo feast package 2 dozen frozen kababs and 500g nimko'
  },
  {
    id: 'prod-weekend-chai-nimko-bundle',
    name: 'Weekend Chai & Kabab Duo',
    urduName: 'ویک اینڈ چائے اور کباب ڈو (1 درجن شامی + 750 گرام نمکو)',
    slug: 'weekend-chai-kabab-duo',
    category: 'combos',
    tagline: '1 Dozen Chicken Shami + 500g Daal Moth + 250g Royal Mix Nimko (Save 15%)',
    description: 'Perfect for cozy weekend tea times and unexpected guests. Fry hot golden Shami kababs in 3 minutes and set the table with fresh crunchy nimkos in grams.',
    image: comboDealImg,
    galleryImages: [comboDealImg, heroImg],
    packOptions: [
      { size: 'Duo Box (1 Dozen Shami + 750g Nimko)', weightGrams: 1250, price: 1550, originalPrice: 1850, costPrice: 910, isPopular: true }
    ],
    defaultPackIndex: 0,
    rating: 4.88,
    reviewCount: 215,
    spiceLevel: 'Medium',
    isBestseller: true,
    isDiscounted: true,
    discountPercentage: 15,
    badge: 'Weekend Special',
    ingredients: [
      '1 Dozen (12 Pcs) Homestyle Chicken Shami Kababs',
      '500g Spicy Daal Moth Nimko (Grams)',
      '250g Special Royal Mix Nimko (Grams)'
    ],
    storageInfo: 'Store kababs in freezer (-18°C).',
    shelfLife: '6 Months',
    cookingInstructions: [
      {
        method: 'Pan Fry',
        time: '3 Mins',
        temperature: 'Medium',
        steps: ['Shallow fry shami kababs for 3 minutes until crisp.'],
        tips: 'Make rapid bun kababs or serve with evening chai.'
      }
    ],
    nutritionPer100g: {
      calories: 225,
      protein: '17.0g',
      carbs: '18.0g',
      fat: '11.0g'
    },
    altText: 'Nimko & Kabab Co. weekend chai and kabab duo deal pack 1 dozen kababs and nimko in grams'
  }
];
