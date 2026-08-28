import { Deal } from '../types';
import comboDealImg from '../assets/images/combo_pack_deal_1787856623204.jpg';
import heroImg from '../assets/images/hero_kabab_nimko_1787856565814.jpg';
import chickenKababImg from '../assets/images/chicken_kabab_prod_1787856580952.jpg';

export const DEALS: Deal[] = [
  {
    id: 'deal-family-mega',
    title: 'Family Feast Mega Combo Pack',
    slug: 'family-feast-mega-combo',
    tagline: '2 Dozen Frozen Kababs + 500g Fresh Nimko + Free Chutney',
    badge: '20% OFF',
    urgencyText: 'Limited Stock • Today Only',
    originalPrice: 2950,
    discountedPrice: 2350,
    savings: 600,
    image: comboDealImg,
    itemsIncluded: [
      '1 Dozen (12 Pcs) Chicken Seekh Kababs',
      '1 Dozen (12 Pcs) Gourmet Beef Seekh Kababs',
      '500 Grams Royal Karachi Mix Nimko Pouch',
      'Free 200g Artisanal Imli-Mint Chutney Jar'
    ],
    servings: '6–8 Persons',
    expiryHoursLeft: 7,
    description: 'Our most sought-after deal for families. Get 2 Dozen restaurant-quality charcoal smoked chicken and beef kababs with 500 grams crunchy Karachi nimko snacks at an unbeatable price.'
  },
  {
    id: 'deal-buy2-get1-kabab',
    title: 'Buy 2 Dozen Kabab Packs, Get 500g Nimko Free',
    slug: 'buy-2-kababs-get-1-nimko-free',
    tagline: 'Buy 1 Dozen Chicken Seekh + 1 Dozen Beef Seekh & Get 500g Royal Nimko FREE',
    badge: 'FREE GIFT',
    urgencyText: 'Free 500g Nimko Worth Rs. 540',
    originalPrice: 2670,
    discountedPrice: 2130,
    savings: 540,
    image: heroImg,
    itemsIncluded: [
      '1 Dozen (12 Pcs) Chicken Seekh Kabab Pack',
      '1 Dozen (12 Pcs) Beef Seekh Kabab Pack',
      'FREE 500 Grams Royal Mix Nimko Pouch (Worth Rs. 540)'
    ],
    servings: '5–6 Persons',
    expiryHoursLeft: 14,
    description: 'Order two dozen of our bestselling frozen kabab packs and we will add a 500g pack of our fresh crispy Karachi Mix Nimko in grams for free!'
  },
  {
    id: 'deal-weekend-chai',
    title: 'Weekend Chai & Kabab Duo',
    slug: 'weekend-chai-kabab-duo',
    tagline: '1 Dozen Chicken Shami + 500g Daal Moth + 250g Royal Mix Nimko',
    badge: 'SAVE 15%',
    urgencyText: 'Weekend Special',
    originalPrice: 1850,
    discountedPrice: 1550,
    savings: 300,
    image: chickenKababImg,
    itemsIncluded: [
      '1 Dozen (12 Pcs) Homestyle Chicken Shami Kababs',
      '500 Grams Spicy Daal Moth Nimko',
      '250 Grams Special Royal Mix Nimko'
    ],
    servings: '4–5 Persons',
    expiryHoursLeft: 22,
    description: 'Transform your evening teatime with a full dozen melt-in-mouth chicken shami kababs and 750 grams of fresh crispy nimkos.'
  }
];
