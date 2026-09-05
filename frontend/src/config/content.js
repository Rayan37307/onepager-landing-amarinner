// All marketing copy for the landing-page sections. Edit freely per relaunch —
// components read from here and render nothing for empty arrays / blank strings.
// `{name}` in any string is replaced with PRODUCT.name at render time.

export const CONTENT = {
  // Header
  header: {
    codNote: 'সারা বাংলাদেশে ক্যাশ অন ডেলিভারি',
  },

  // 1 — Hero
  hero: {
    headline: 'ইন্ডিয়ান গুড্ডি ব্রা',
    headlineAccent: '৬ পিস কম্বো',
    priceBadgePrefix: 'মাত্র',
    priceBadgeSuffix: 'টাকা',
    pills: [
      { icon: 'fit', text: '৬টি ব্রা একসাথে' },
      { icon: 'soft', text: 'নরম ও আরামদায়ক' },
      { icon: 'daily', text: 'দৈনন্দিন ব্যবহারের জন্য' },
    ],
    cta: 'অর্ডার করতে এখানে চাপ দিন',
  },

  // 2 — Why choose ("কেন নেবেন?") — a simple checkmark list.
  features: {
    title: 'কেন নেবেন?',
    items: [
      { text: 'সফট ও আরামদায়ক কাপড়' },
      { text: 'দীর্ঘ সময় পরার জন্য আরামদায়ক' },
      { text: 'সুন্দর ফিট ও সাপোর্ট' },
      { text: 'এক কম্বোতেই ৬ পিস' },
      { text: 'কম দামে বেশি সুবিধা' },
      { text: '৬ পিস কম্বো মাত্র ৯৭০ টাকা!' },
    ],
  },

  // 3 — Product showcase ("প্রোডাক্ট দেখুন") — image row only, no captions.
  showcase: {
    title: 'প্রোডাক্ট দেখুন',
    images: [
      { src: '/combo-6-colors.webp', alt: '৬ রঙের সম্পূর্ণ কম্বো' },
      { src: '/bra-red.webp', alt: 'সফট ও আরামদায়ক কটন কাপড়' },
      { src: '/bra-detail.webp', alt: 'অরিজিনাল GUDDI ব্র্যান্ড' },
      { src: '/bra-black.webp', alt: 'মজবুত সেলাই ও ফিনিশিং' },
      { src: '/bra-pink.webp', alt: 'দৈনন্দিন ব্যবহারের জন্য পারফেক্ট' },
    ],
  },

  // 3b — Product video. Set `url` to a YouTube/Facebook/MP4 link to embed it;
  // while empty the section shows a titled placeholder box.
  video: {
    title: 'প্রোডাক্টের ভিডিও দেখুন',
    url: '',
    placeholder: 'এখানে প্রোডাক্ট ভিডিও থাকবে',
  },

  // 4 — Size picker ("আপনার সাইজ বেছে নিন")
  sizeGuide: {
    title: 'আপনার সাইজ বেছে নিন',
    note: 'সাইজ বুঝতে সমস্যা হলে কল করুন',
    chart: { columns: [], rows: [] },
    howToMeasure: [],
    betweenSizes: '',
  },

  // 5 — Order with confidence ("নিশ্চিন্তে অর্ডার করুন")
  guarantee: {
    title: 'নিশ্চিন্তে অর্ডার করুন',
    items: [
      { icon: 'cash', title: 'ক্যাশ অন ডেলিভারি', body: 'পণ্য হাতে পেয়ে টাকা পরিশোধ' },
      { icon: 'delivery', title: 'সারা বাংলাদেশ ডেলিভারি', body: 'দ্রুত ও নিরাপদ ডেলিভারি' },
      { icon: 'privacy', title: 'গোপনীয় প্যাকেজিং', body: 'প্রাইভেসি মেইনটেইন করে নিরাপদ প্যাকেজ' },
      { icon: 'exchange', title: 'সাইজ পরিবর্তনের সুবিধা', body: 'সাইজ না মিললে সহজে পরিবর্তন' },
    ],
  },

  // 6 — Reviews ("আমাদের কাস্টমারদের ভালোবাসা")
  reviews: {
    title: 'আমাদের কাস্টমারদের ভালোবাসা',
    items: [
      { name: 'সুমি আক্তার', rating: 5, body: 'খুব নরম ও আরামদায়ক। দামও অনেক কম!' },
      { name: 'মাহমুদা বেগম', rating: 5, body: '৬ পিস একসাথে পেয়ে খুশি খুশি। ধন্যবাদ!' },
      { name: 'নুসরাত জাহান', rating: 5, body: 'ফিটিং অসাধারণ, রিকমেন্ডেড!' },
    ],
  },

  // 7 — Offer bar
  offer: {
    title: '৬ পিস কম্বো – {price} টাকা',
    cta: 'এখনই অর্ডার করুন',
  },

  // Inline "jump to order form" button repeated between sections.
  inlineCta: 'এখনই অর্ডার করুন',

  // FAQ ("প্রশ্নোত্তর") — real buying questions. Leave items empty ([]) to hide.
  faq: {
    title: 'প্রশ্নোত্তর',
    items: [
      {
        q: 'এক কম্বোতে কয়টি ব্রা পাব?',
        a: 'একটি কম্বোতে মোট ৬ পিস ব্রা পাবেন।',
      },
      {
        q: '৬ পিসের দাম কত?',
        a: '৬ পিস কম্বোর অফার মূল্য মাত্র ৯৭০ টাকা।',
      },
      {
        q: 'ডেলিভারি চার্জ কত?',
        a: 'ঢাকা সিটির ভেতরে ডেলিভারি চার্জ ৬৫ টাকা। আশুলিয়া, ধামরাই, দোহার, হেমায়েতপুর, কেরানীগঞ্জ ও নবাবগঞ্জ (ঢাকার আশপাশ) এলাকায় ১০০ টাকা। এছাড়া দেশের বাকি সব এলাকায় ডেলিভারি চার্জ ১২৫ টাকা।',
      },
      {
        q: 'ব্রাগুলো কি প্রতিদিন ব্যবহার করা যাবে?',
        a: 'জি। সফট ও আরামদায়ক কাপড়ের হওয়ায় এগুলো প্রতিদিনের ব্যবহারের জন্য উপযোগী।',
      },
      {
        q: 'ছবির মতো একই কালার পাব?',
        a: 'ছবির সাথে যতটা সম্ভব মিল রেখে পণ্য দেওয়া হয়। তবে Lighting ও স্ক্রিন সেটিংসের কারণে বাস্তব পণ্যের রঙে সামান্য পার্থক্য দেখা যেতে পারে।',
      },
      {
        q: 'সাইজ কীভাবে নির্বাচন করব?',
        a: 'অর্ডার করার সময় আপনার প্রয়োজনীয় সাইজটি নির্বাচন করুন। সাইজ নিয়ে দ্বিধায় থাকলে অর্ডারের আগে আমাদের সাথে যোগাযোগ করতে পারেন।',
      },
      {
        q: 'অর্ডার কীভাবে করব?',
        a: 'নিচের অর্ডার ফর্মে আপনার নাম, মোবাইল নম্বর, সম্পূর্ণ ঠিকানা ও প্রয়োজনীয় তথ্য দিয়ে অর্ডার কনফার্ম করুন।',
      },
      {
        q: 'প্রয়োজনে কোথায় যোগাযোগ করব?',
        a: 'যেকোনো প্রয়োজনে সরাসরি কল করুন: 01984146600',
      },
    ],
  },

  // 8 — Order help ("কোনো প্রশ্ন আছে?")
  help: {
    title: 'কোনো প্রশ্ন আছে?',
    body: 'অর্ডার বা প্রোডাক্ট সম্পর্কে যেকোনো প্রয়োজনে সরাসরি কল করুন।',
    callLabel: 'কল করুন',
    whatsappLabel: 'WhatsApp',
  },

  // Contact CTA — a green WhatsApp pill plus a magenta call pill (shows the
  // phone number). Leave `label` blank to hide the whole block; leave
  // `callLabel` blank to hide just the call button.
  whatsapp: {
    title: 'কোনো প্রশ্ন আছে?',
    label: 'হোয়াটসঅ্যাপে অর্ডার করুন',
    callLabel: 'কল করুন',
    note: 'সরাসরি মেসেজ দিন — দ্রুত রিপ্লাই',
    prefill: 'আসসালামু আলাইকুম, আমি {name} অর্ডার করতে চাই।',
  },

  // UI strings used across the form and shared components.
  ui: {
    orderNow: 'অর্ডার করুন',
    codSuffix: 'ক্যাশ অন ডেলিভারি',
    savePrefix: 'সাশ্রয়',
    galleryPlaceholder: 'এখানে পণ্যের ছবি বসবে',
    formTitle: 'অর্ডার করতে নিচের ফর্মটি পূরণ করুন',
    yourProductsLabel: 'আপনার পণ্য',
    billingTitle: 'বিলিং তথ্য',
    summaryTitle: 'আপনার অর্ডার',
    qtyOptions: [
      { quantity: 1, label: '১ সেট নিন' },
      { quantity: 2, label: '২ সেট নিন', badge: 'জনপ্রিয়' },
      { quantity: 3, label: '৩ সেট নিন', badge: 'সেরা দাম' },
    ],
    sizeLabel: 'আপনার সাইজ',
    sizeGuideLink: 'সাইজ গাইড দেখুন',
    colorLabel: 'রঙ সিলেক্ট করুন',
    nameLabel: 'আপনার নাম',
    namePlaceholder: 'আপনার নাম',
    addressLabel: 'আপনার সম্পূর্ণ ঠিকানা',
    addressPlaceholder: 'সম্পূর্ণ ঠিকানা',
    phoneLabel: 'আপনার ফোন নাম্বার',
    phonePlaceholder: 'মোবাইল নম্বর',
    sizeFieldLabel: 'সাইজ সিলেক্ট করুনঃ',
    sizePlaceholder: 'আপনার সাইজ',
    shippingTitle: 'ডেলিভারি এলাকা',
    districtLabel: 'আপনার জেলা নির্বাচন করুন',
    zonePlaceholder: '— জেলা বেছে নিন —',
    productLabel: 'পণ্য',
    quantityLabel: 'পরিমাণ',
    subtotalLabel: 'সাবটোটাল',
    deliveryLabel: 'ডেলিভারি চার্জ',
    freeDelivery: 'ফ্রি',
    totalLabel: 'মোট',
    codLabel: 'ক্যাশ অন ডেলিভারি',
    codNote: 'ডেলিভারির সময় ক্যাশ দিয়ে মূল্য পরিশোধ করুন।',
    privacyNote:
      'আপনার তথ্য শুধুমাত্র অর্ডার প্রসেস করতে এবং আপনার অভিজ্ঞতা আরও ভালো করতে ব্যবহৃত হবে।',
    secureNote: 'আপনার তথ্য সম্পূর্ণ নিরাপদ',
    submitIdle: 'অর্ডার কনফার্ম করুন',
    submitting: 'অর্ডার হচ্ছে…',
    genericError: 'কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।',
    successTitle: 'অর্ডার নিশ্চিত হয়েছে!',
    successBody: 'অর্ডার #{order} প্লেস হয়েছে। ডেলিভারি নিশ্চিত করতে আমরা শীঘ্রই কল করব।',
    stickyCta: 'অর্ডার করুন',
    rightsReserved: 'সর্বস্বত্ব সংরক্ষিত।',
  },
};
