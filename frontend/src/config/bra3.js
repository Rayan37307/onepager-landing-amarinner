// /bra3 — Premium Strapless Padded Bra, 4-piece combo. Starts from the default
// product/content (brand, contact, districts, UI strings) and overrides only
// what differs for this product.
import { PRODUCT } from './product';
import { CONTENT } from './content';
import { TWO_RATE_SHIPPING } from './bra2';

const IMAGES = [
  { src: '/products/bra3/bra3-all-colors.webp', alt: 'স্ট্র্যাপলেস প্যাডেড ব্রা — বিভিন্ন রঙ' },
  { src: '/products/bra3/bra3-stack.webp', alt: 'Soft ও smooth fabric' },
  { src: '/products/bra3/bra3-model-black.webp', alt: 'Straps লাগিয়ে পরা — কালো' },
  { src: '/products/bra3/bra3-model-white.webp', alt: 'Tops ও T-shirt-এর সাথে — সাদা' },
  { src: '/products/bra3/bra3-pink.webp', alt: 'গোলাপি রঙ' },
  { src: '/products/bra3/bra3-nude.webp', alt: 'নুড রঙ' },
  { src: '/products/bra3/bra3-black.webp', alt: 'কালো রঙ' },
  { src: '/products/bra3/bra3-grey.webp', alt: 'ধূসর রঙ' },
];

const PRICE = 900;

export const BRA3_PRODUCT = {
  ...PRODUCT,
  name: 'প্রিমিয়াম স্ট্র্যাপলেস প্যাডেড ব্রা',
  variantTag: '৪ পিস কম্বো',
  tagline: 'Strapless বা straps লাগিয়ে — দুইভাবেই পরা যায়। একসাথে ৪টি ব্রা।',
  price: PRICE,
  compareAtPrice: null,

  // Hero banner: `desktop` on ≥640px, `mobile` below.
  heroBanner: {
    desktop: { src: '/products/bra3/bra3-banner-desktop.gif', alt: 'প্রিমিয়াম স্ট্র্যাপলেস প্যাডেড ব্রা — ৪ পিস কম্বো' },
    mobile: { src: '/products/bra3/bra3-banner-mobile.gif', alt: 'প্রিমিয়াম স্ট্র্যাপলেস প্যাডেড ব্রা — ৪ পিস কম্বো' },
  },
  images: IMAGES,

  // One free size covers 28–36.
  sizes: [{ label: '28–36 Free Size', price: PRICE }],

  shipping: TWO_RATE_SHIPPING,
};

export const BRA3_CONTENT = {
  ...CONTENT,

  hero: {
    ...CONTENT.hero,
    headline: 'প্রিমিয়াম স্ট্র্যাপলেস প্যাডেড ব্রা',
    headlineAccent: '৪ পিস কম্বো',
  },

  features: {
    title: 'কেন নেবেন?',
    items: [
      { text: 'Strapless ও straps লাগিয়ে—দুইভাবেই ব্যবহার করা যায়' },
      { text: 'Soft ও smooth fabric' },
      { text: 'Wire-free design' },
      { text: 'Padded support' },
      { text: 'Tops ও T-shirt-এর সাথে ব্যবহার করতে convenient' },
      { text: 'Teen aged ও young মেয়েদের জন্য উপযোগী' },
      { text: '২৮–৩৬ Free Size' },
      { text: '৪ পিস মাত্র ৯০০ টাকা' },
      { text: 'একেকটির দাম মাত্র ২২৫ টাকা' },
    ],
  },

  showcase: {
    ...CONTENT.showcase,
    images: IMAGES,
  },

  offer: {
    ...CONTENT.offer,
    title: '৪ পিস কম্বো – {price} টাকা',
  },

  faq: {
    title: 'প্রশ্নোত্তর',
    items: [
      {
        q: 'একেকটা Combo-তে কয়টি Bra পাব?',
        a: 'একটি Combo-তে মোট ৪ পিস Premium Strapless Padded Bra পাবেন।',
      },
      {
        q: 'সাইজ কত?',
        a: '২৮–৩৬ Free Size available।',
      },
      {
        q: 'Strap ছাড়া পরা যাবে?',
        a: 'হ্যাঁ। Strapless হিসেবে ব্যবহার করা যাবে এবং প্রয়োজন হলে straps লাগিয়েও ব্যবহার করা যাবে।',
      },
      {
        q: 'এতে কি Pad আছে?',
        a: 'হ্যাঁ, এতে padded support আছে।',
      },
      {
        q: 'Wire আছে?',
        a: 'না, এটি wire-free design।',
      },
      {
        q: 'কোন ধরনের পোশাকের সাথে ব্যবহার করা যায়?',
        a: 'Tops, T-shirt এবং যেসব outfit-এর সাথে strap দেখা যাক চান না, সেগুলোর সাথে ব্যবহার করা convenient।',
      },
      {
        q: 'ডেলিভারি চার্জ কত?',
        a: 'ঢাকার মধ্যে ৬৫ টাকা এবং ঢাকার বাইরে ১২৫ টাকা।',
      },
      {
        q: 'অর্ডার কীভাবে করব?',
        a: 'নিচের Order Form পূরণ করে “অর্ডার কনফার্ম করুন” বাটনে চাপ দিন।',
      },
      {
        q: 'প্রয়োজনে কোথায় যোগাযোগ করব?',
        a: 'Landing page-এ দেওয়া WhatsApp অথবা Call button ব্যবহার করে যোগাযোগ করতে পারবেন।',
      },
    ],
  },
};
