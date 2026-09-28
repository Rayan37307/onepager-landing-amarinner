// /bra2 — Wireless Push-Up Bra, 3-piece combo. Starts from the default
// product/content (brand, contact, districts, UI strings) and overrides only
// what differs for this product.
import { PRODUCT } from './product';
import { CONTENT } from './content';

const IMAGES = [
  { src: '/products/bra2/bra2-hanging-colors.webp', alt: 'ওয়্যারলেস পুশ-আপ ব্রা — বিভিন্ন রঙ' },
  { src: '/products/bra2/bra2-five-colors.webp', alt: 'Full coverage design ও wide lower band' },
  { src: '/products/bra2/bra2-front.webp', alt: 'Padded supportive design' },
  { src: '/products/bra2/bra2-back-hook.webp', alt: 'Adjustable strap ও back hook' },
];

const SIZE_PRICE = 999;

// Two delivery rates only: Dhaka 65, everywhere else 125. Shared with /bra3.
export const TWO_RATE_SHIPPING = {
  ...PRODUCT.shipping,
  tiers: {
    ...PRODUCT.shipping.tiers,
    dhaka: { label: 'ঢাকার মধ্যে', fee: 65 },
    normal: { label: 'ঢাকার বাইরে', fee: 125 },
  },
  suburbDistricts: [],
};

export const BRA2_PRODUCT = {
  ...PRODUCT,
  name: 'ওয়্যারলেস পুশ-আপ ব্রা',
  variantTag: '৩ পিস কম্বো',
  tagline: 'Steel ring ছাড়া soft, padded ও supportive — একসাথে ৩টি ব্রা।',
  price: SIZE_PRICE,
  compareAtPrice: null,

  // Hero banner: `desktop` on ≥640px, `mobile` below.
  heroBanner: {
    desktop: { src: '/products/bra2/bra2-banner-desktop.gif', alt: 'ওয়্যারলেস পুশ-আপ ব্রা — ৩ পিস কম্বো' },
    mobile: { src: '/products/bra2/bra2-banner-mobile.gif', alt: 'ওয়্যারলেস পুশ-আপ ব্রা — ৩ পিস কম্বো' },
  },
  images: IMAGES,

  sizes: ['32', '34', '36', '38', '40', '42', '44'].map((label) => ({ label, price: SIZE_PRICE })),

  shipping: TWO_RATE_SHIPPING,
};

export const BRA2_CONTENT = {
  ...CONTENT,

  hero: {
    ...CONTENT.hero,
    headline: 'ওয়্যারলেস পুশ-আপ ব্রা',
    headlineAccent: '৩ পিস কম্বো',
  },

  features: {
    title: 'কেন নেবেন?',
    items: [
      { text: 'Steel ring বা wire নেই' },
      { text: 'Soft ও skin-friendly fabric' },
      { text: 'Padded supportive design' },
      { text: 'Bust lift ও support দিতে সাহায্য করে' },
      { text: 'Wide lower band' },
      { text: 'Full coverage design' },
      { text: 'Lightweight ও breathable fabric' },
      { text: 'Removable pad' },
      { text: '৩২–৪৪ পর্যন্ত বিভিন্ন Size Available' },
      { text: '৩ পিস মাত্র ৯৯৯ টাকা' },
    ],
  },

  showcase: {
    ...CONTENT.showcase,
    images: IMAGES,
  },

  offer: {
    ...CONTENT.offer,
    title: '৩ পিস কম্বো – {price} টাকা',
  },

  faq: {
    title: 'প্রশ্নোত্তর',
    items: [
      {
        q: 'এক Combo-তে কয়টি পাব?',
        a: 'একটি Combo-তে মোট ৩ পিস Wireless Push-Up Bra পাবেন।',
      },
      {
        q: 'এতে কি Wire আছে?',
        a: 'না, এতে কোনো steel ring বা wire নেই।',
      },
      {
        q: 'এতে কি Pad আছে?',
        a: 'হ্যাঁ, এতে padded support আছে এবং প্রয়োজন হলে pad remove করা যায়।',
      },
      {
        q: 'সারাদিন ব্যবহার করা যাবে?',
        a: 'এর soft, lightweight ও breathable fabric everyday use-এর জন্য comfortable করে তৈরি করা হয়েছে।',
      },
      {
        q: 'Support কেমন?',
        a: 'Padded supportive design bust-কে lift ও support দিতে সাহায্য করে। Wide lower band ও full coverage design fitting আরও secure রাখে।',
      },
      {
        q: 'কী কী Size পাওয়া যাবে?',
        a: '৩২ থেকে ৪৪ পর্যন্ত বিভিন্ন size available।',
      },
      {
        q: 'দাম কত?',
        a: '৩ পিসের পুরো Combo মাত্র ৯৯৯ টাকা। অর্থাৎ একেকটি পড়ছে মাত্র ৩৩৩ টাকা।',
      },
      {
        q: 'ডেলিভারি চার্জ কত?',
        a: 'ঢাকার মধ্যে ৬৫ টাকা এবং ঢাকার বাইরে ১২৫ টাকা।',
      },
      {
        q: 'কীভাবে Order করব?',
        a: 'Order Form-এ আপনার Size, নাম, ফোন নাম্বার ও ঠিকানা দিয়ে “অর্ডার কনফার্ম করুন” বাটনে ক্লিক করুন।',
      },
    ],
  },
};
