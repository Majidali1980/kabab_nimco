import { DeliveryZone } from '../types';

export const DELIVERY_ZONES: DeliveryZone[] = [
  {
    id: 'zone-dha-clifton',
    name: 'DHA & Clifton',
    subAreas: [
      'DHA Phase 1', 'DHA Phase 2 & Ext', 'DHA Phase 4', 'DHA Phase 5 & Commercial',
      'DHA Phase 6', 'DHA Phase 7 & Ext', 'DHA Phase 8', 'Clifton Block 1 to 9',
      'Sea View', 'Bath Island', 'Gizri'
    ],
    deliveryTime: 'Within 45–75 Mins (Express Cold Chain)',
    minOrder: 800,
    deliveryFee: 150,
    freeDeliveryThreshold: 2000,
    sameDayCutoff: '8:30 PM'
  },
  {
    id: 'zone-pechs-bahadurabad',
    name: 'PECHS, Bahadurabad & Tariq Road',
    subAreas: [
      'PECHS Block 1 to 6', 'Bahadurabad', 'Tariq Road', 'Sindhi Muslim Housing Society (SMCHS)',
      'Delhi Mercantile Society', 'KDA Scheme 1', 'Mohammad Ali Society (MACHS)', 'Sharifabad'
    ],
    deliveryTime: 'Within 60–90 Mins',
    minOrder: 800,
    deliveryFee: 150,
    freeDeliveryThreshold: 2000,
    sameDayCutoff: '8:00 PM'
  },
  {
    id: 'zone-gulshan-johar',
    name: 'Gulshan-e-Iqbal & Gulistan-e-Johar',
    subAreas: [
      'Gulshan-e-Iqbal Block 1 to 19', 'NIPA', 'Hassan Square', 'University Road',
      'Gulistan-e-Johar Block 1 to 20', 'Safoora Chowrangi', 'Kamran Chowrangi', 'Pehlwan Goth'
    ],
    deliveryTime: 'Within 60–90 Mins',
    minOrder: 800,
    deliveryFee: 180,
    freeDeliveryThreshold: 2000,
    sameDayCutoff: '8:00 PM'
  },
  {
    id: 'zone-north-nazimabad',
    name: 'North Nazimabad, Federal B Area & Nazimabad',
    subAreas: [
      'North Nazimabad Block A to T', 'Federal B Area Block 1 to 22', 'Nazimabad No. 1 to 7',
      'Hyderi', 'KDA Market', 'Paposh Nagar', 'Buffer Zone'
    ],
    deliveryTime: 'Within 60–90 Mins',
    minOrder: 800,
    deliveryFee: 180,
    freeDeliveryThreshold: 2000,
    sameDayCutoff: '7:30 PM'
  },
  {
    id: 'zone-malir-cantt',
    name: 'Malir Cantt, Model Colony & Airport',
    subAreas: [
      'Malir Cantt (All Gates & Falcon Complex)', 'Askari 4 & 5', 'Model Colony',
      'Airport Road', 'Gulshan-e-Jamal', 'Shah Faisal Colony'
    ],
    deliveryTime: 'Within 75–100 Mins',
    minOrder: 1000,
    deliveryFee: 200,
    freeDeliveryThreshold: 2500,
    sameDayCutoff: '7:00 PM'
  },
  {
    id: 'zone-bahria-town',
    name: 'Bahria Town Karachi & Scheme 33',
    subAreas: [
      'Bahria Town Karachi (Precinct 1 to 35)', 'Scheme 33', 'Gulshan-e-Maymar',
      'Saadi Town', 'Super Highway Communities'
    ],
    deliveryTime: 'Scheduled Slots (Morning & Evening)',
    minOrder: 1500,
    deliveryFee: 250,
    freeDeliveryThreshold: 3500,
    sameDayCutoff: '5:00 PM'
  }
];

export const DELIVERY_PROMISES = [
  {
    title: 'Frozen Cold-Chain Delivery',
    desc: 'Packed in insulated thermal bags with frozen gel packs to guarantee rock-solid frozen temperature upon delivery.'
  },
  {
    title: 'Free Delivery Over Rs. 2,000',
    desc: 'Enjoy free doorstep delivery anywhere in Karachi on orders over Rs. 2,000.'
  },
  {
    title: 'Same-Day Delivery 7 Days a Week',
    desc: 'Orders placed before 8:00 PM are delivered same evening for dinner or weekend parties.'
  },
  {
    title: 'Instant WhatsApp Order Support',
    desc: 'Need custom delivery timings or bulk party orders? Chat directly with our kitchen manager.'
  }
];
