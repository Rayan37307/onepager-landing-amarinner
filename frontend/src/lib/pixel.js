// Meta (Facebook) Pixel — browser-side event tracking.
//
// Pairs with the server-side Conversions API in the Laravel backend
// (App\Services\MetaConversionsApiService). Both sides send a "Purchase" event
// for every order; Meta de-duplicates them by matching `event_name` + the
// shared `eventID` / `event_id`. The backend returns that id in the order
// response as `event_id` — pass it straight into `trackPurchase()`.
//
// If no pixel id is configured (PRODUCT.tracking.metaPixelId / VITE_META_PIXEL_ID)
// every function here is a no-op and the fbevents.js script is never loaded.

import { PRODUCT } from '../config/product';

const PIXEL_ID = PRODUCT.tracking?.metaPixelId || '';
const CURRENCY = PRODUCT.tracking?.currencyCode || 'BDT';

let initialized = false;

/** True once `fbq` exists and a pixel id is set. */
export function pixelEnabled() {
  return Boolean(PIXEL_ID) && typeof window !== 'undefined' && typeof window.fbq === 'function';
}

/**
 * Inject fbevents.js, init the pixel and fire the initial PageView. Safe to
 * call more than once (StrictMode double-invokes effects) — only the first
 * call does anything.
 */
export function initPixel() {
  if (initialized || !PIXEL_ID || typeof window === 'undefined') return;
  initialized = true;

  /* eslint-disable */
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */

  window.fbq('init', PIXEL_ID);
  window.fbq('track', 'PageView');
}

/** Low-level standard-event tracker. `eventID` (when given) enables CAPI dedup. */
export function track(event, params = {}, eventID) {
  if (!pixelEnabled()) return;
  const opts = eventID ? { eventID } : undefined;
  window.fbq('track', event, params, opts);
}

/** Someone viewed the product (fire once on landing). */
export function trackViewContent(product = PRODUCT) {
  track('ViewContent', {
    content_name: product.name,
    content_type: 'product',
    currency: CURRENCY,
    value: product.price,
  });
}

/** Someone reached / engaged the order form. */
export function trackInitiateCheckout(product = PRODUCT) {
  track('InitiateCheckout', {
    content_name: product.name,
    content_type: 'product',
    currency: CURRENCY,
    value: product.price,
    num_items: 1,
  });
}

/**
 * Order placed. `eventID` MUST be the `event_id` returned by the backend so
 * Meta collapses this with the server-side Purchase event.
 */
export function trackPurchase({ value, eventID, contentName, numItems = 1 }) {
  track(
    'Purchase',
    {
      content_name: contentName || PRODUCT.name,
      content_type: 'product',
      currency: CURRENCY,
      value,
      num_items: numItems,
    },
    eventID,
  );
}
