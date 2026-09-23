// Single-product landing page config. Edit this to relaunch for a different
// product — everything commerce-related (form, pricing, CAPI value) reads from
// here. Marketing copy for the page sections lives in ./content.js.
export const PRODUCT = {
  name: 'ইন্ডিয়ান গুডি ব্রা',
  variantTag: '৬ পিস কম্বো',
  tagline: 'নরম, আরামদায়ক আর দৈনন্দিন ব্যবহারের জন্য পারফেক্ট — একসাথে ৬টি ব্রা।',
  price: 975,
  compareAtPrice: 1690,
  currency: '৳',

  // Meta Pixel + Conversions API. The pixel id and ISO currency also live in
  // env (VITE_META_PIXEL_ID / VITE_META_CURRENCY) so creds can be swapped per
  // deploy without touching config — env wins when set. Leave the id empty to
  // disable browser tracking entirely (the pixel script never loads).
  tracking: {
    metaPixelId: import.meta.env.VITE_META_PIXEL_ID || '',
    currencyCode: import.meta.env.VITE_META_CURRENCY || 'BDT',
  },

  // Storefront identity — shown in the header, footer and sticky bar.
  brand: {
    name: 'আমার ইনার',
    nameEn: 'Amar Inner',
  },

  // Order-help contact shown in the help section.
  contact: {
    phone: '01822999798',
    whatsapp: '8801822999798',
  },

  // Social links shown as footer icons.
  social: {
    facebook: 'https://www.facebook.com/amarinnerbd',
    instagram: 'https://www.instagram.com/amarinner',
    tiktok: 'https://www.tiktok.com/@amarinner',
    whatsapp: 'https://wa.link/qaz0ya',
  },

  // Hero banner shown behind the headline/price. Swaps by viewport width:
  // `mobile` renders on small screens, `desktop` on ≥640px. Omit a key to reuse
  // the other; omit the whole block to fall back to images[0].
  heroBanner: {
    desktop: { src: '/amar-inner-landing-page-banner-01.gif', alt: 'ইন্ডিয়ান গুডি ব্রা — ৬ পিস কম্বো' },
    mobile: { src: '/amar-inner-landing-page-banner-02.gif', alt: 'ইন্ডিয়ান গুডি ব্রা — ৬ পিস কম্বো' },
  },

  // Carousel images shown in the gallery. Drop real photo paths (imported from
  // /src/assets) or absolute URLs here — order is slide order. Falls back to a
  // placeholder when empty.
  images: [
    { src: '/combo-6-colors.webp', alt: 'ইন্ডিয়ান গুড্ডি ব্রা — ৬ রঙের কম্বো' },
    { src: '/bra-red.webp', alt: 'ইন্ডিয়ান গুড্ডি ব্রা — লাল' },
    { src: '/bra-pink.webp', alt: 'ইন্ডিয়ান গুড্ডি ব্রা — গোলাপি' },
    { src: '/bra-black.webp', alt: 'ইন্ডিয়ান গুড্ডি ব্রা — কালো' },
    { src: '/bra-nude.webp', alt: 'ইন্ডিয়ান গুড্ডি ব্রা — নুড' },
    { src: '/bra-skin.webp', alt: 'ইন্ডিয়ান গুড্ডি ব্রা — স্কিন' },
    { src: '/bra-beige.webp', alt: 'ইন্ডিয়ান গুড্ডি ব্রা — বেইজ' },
    { src: '/bra-detail.webp', alt: 'GUDDI ব্র্যান্ডের মজবুত সেলাই ও ফিনিশিং' },
  ],

  // Size / variant options shown as a radio group in the order form. Each can
  // carry its own price — the selected size's price becomes the unit price.
  // Leave empty ([]) for products without sizes; the form hides the selector
  // and uses `price` above.
  sizes: [
    { label: '32', price: 975 },
    { label: '34', price: 975 },
    { label: '36', price: 975 },
    { label: '38', price: 975 },
    { label: '40', price: 975 },
    { label: '42', price: 1025 },
    { label: '44', price: 1025 },
    { label: '46', price: 1475 },
    { label: '48', price: 1475 },
  ],

  // Colour options shown as a radio group. Leave empty ([]) to hide the
  // selector. `image` (optional) swaps the product thumbnail in the order
  // form when that colour is selected. This product ships without a colour
  // choice — keep empty.
  colors: [],

  // Shipping — the order form shows a 64-district selector (grouped by division).
  // The chosen district resolves to one of three fee tiers:
  //   • dhakaDistrict            → tiers.dhaka   (Dhaka city)
  //   • any of suburbDistricts   → tiers.suburb  (Dhaka-adjacent belt)
  //   • everything else          → tiers.normal  (rest of Bangladesh)
  shipping: {
    tiers: {
      dhaka: { label: 'ঢাকা সিটি', fee: 65 },
      suburb: { label: 'ঢাকার আশপাশ', fee: 100 },
      normal: { label: 'ঢাকার বাইরে', fee: 125 },
    },
    dhakaDistrict: 'ঢাকা',
    suburbDistricts: [
      'গাজীপুর', 'নারায়ণগঞ্জ', 'মুন্সিগঞ্জ', 'মানিকগঞ্জ', 'নরসিংদী',
      'সাভার', 'আশুলিয়া', 'ধামরাই', 'দোহার', 'কেরানীগঞ্জ', 'নবাবগঞ্জ', 'হেমায়েতপুর',
    ],
    divisions: [
      {
        name: 'ঢাকা বিভাগ',
        districts: [
          'ঢাকা', 'সাভার', 'আশুলিয়া', 'ধামরাই', 'দোহার', 'কেরানীগঞ্জ', 'নবাবগঞ্জ', 'হেমায়েতপুর',
          'গাজীপুর', 'নারায়ণগঞ্জ', 'মুন্সিগঞ্জ', 'মানিকগঞ্জ', 'নরসিংদী',
          'টাঙ্গাইল', 'কিশোরগঞ্জ', 'ফরিদপুর', 'গোপালগঞ্জ', 'মাদারীপুর', 'রাজবাড়ী', 'শরীয়তপুর',
        ],
      },
      {
        name: 'চট্টগ্রাম বিভাগ',
        districts: [
          'চট্টগ্রাম', 'কক্সবাজার', 'কুমিল্লা', 'ব্রাহ্মণবাড়িয়া', 'চাঁদপুর', 'ফেনী',
          'লক্ষ্মীপুর', 'নোয়াখালী', 'বান্দরবান', 'খাগড়াছড়ি', 'রাঙ্গামাটি',
        ],
      },
      {
        name: 'রাজশাহী বিভাগ',
        districts: [
          'রাজশাহী', 'বগুড়া', 'পাবনা', 'সিরাজগঞ্জ', 'নাটোর', 'নওগাঁ', 'জয়পুরহাট', 'চাঁপাইনবাবগঞ্জ',
        ],
      },
      {
        name: 'খুলনা বিভাগ',
        districts: [
          'খুলনা', 'যশোর', 'সাতক্ষীরা', 'বাগেরহাট', 'ঝিনাইদহ', 'মাগুরা', 'নড়াইল',
          'কুষ্টিয়া', 'চুয়াডাঙ্গা', 'মেহেরপুর',
        ],
      },
      {
        name: 'বরিশাল বিভাগ',
        districts: ['বরিশাল', 'পটুয়াখালী', 'ভোলা', 'পিরোজপুর', 'বরগুনা', 'ঝালকাঠি'],
      },
      {
        name: 'সিলেট বিভাগ',
        districts: ['সিলেট', 'মৌলভীবাজার', 'হবিগঞ্জ', 'সুনামগঞ্জ'],
      },
      {
        name: 'রংপুর বিভাগ',
        districts: [
          'রংপুর', 'দিনাজপুর', 'কুড়িগ্রাম', 'গাইবান্ধা', 'নীলফামারী', 'লালমনিরহাট',
          'পঞ্চগড়', 'ঠাকুরগাঁও',
        ],
      },
      {
        name: 'ময়মনসিংহ বিভাগ',
        districts: ['ময়মনসিংহ', 'জামালপুর', 'নেত্রকোণা', 'শেরপুর'],
      },
    ],
  },
};
