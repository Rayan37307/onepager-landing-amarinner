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
const RAW_CURRENCY = PRODUCT.tracking?.currencyCode || 'BDT';

/**
 * Meta only accepts a 3-letter ISO-4217 code (e.g. "BDT"). Anything else —
 * empty string, symbol like "৳"/"Tk", lowercase — triggers
 * "[Meta Pixel] - Parameter 'currency' is invalid". Normalize defensively so
 * a bad env value can never reach fbq.
 */
function pixelCurrency() {
  const code = String(RAW_CURRENCY || 'BDT').trim().toUpperCase();
  return /^[A-Z]{3}$/.test(code) ? code : 'BDT';
}

/** Meta requires value as a plain number (no symbols/commas). Coerce + round. */
function pixelValue(n) {
  const v = Number(n);
  if (!Number.isFinite(v) || v < 0) return 0;
  return Math.round(v * 100) / 100;
}

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
    content_ids: [product.name],
    contents: [{ id: product.name, quantity: 1 }],
    content_type: 'product',
    currency: pixelCurrency(),
    value: pixelValue(product.price),
  });
}

/** Someone reached / engaged the order form. */
export function trackInitiateCheckout(product = PRODUCT) {
  track('InitiateCheckout', {
    content_name: product.name,
    content_type: 'product',
    content_ids: [product.name],
    currency: pixelCurrency(),
    value: pixelValue(product.price),
    num_items: 1,
  });
}

/**
 * Order placed. `eventID` MUST be the `event_id` returned by the backend so
 * Meta collapses this with the server-side Purchase event.
 */
export function trackPurchase({ value, eventID, contentName, numItems = 1 }) {
  const numericValue = pixelValue(value);
  const currency = pixelCurrency();
  if (!pixelEnabled()) {
    // Visible in DevTools console — if you see this, VITE_META_PIXEL_ID was
    // empty at build time (Vite bakes env vars into the bundle) or
    // fbevents.js was blocked (ad-blocker). Rebuild/redeploy with the ID set.
    if (typeof window !== 'undefined') {
      console.warn(
        `[pixel] Purchase skipped: pixel disabled (PIXEL_ID=${PIXEL_ID ? 'set' : 'MISSING'}, fbq=${typeof window.fbq}).`,
      );
    }
    return;
  }
  // NOTE: fbq('track', ...) signature is (event, params, opts) where opts
  // carries { eventID } for browser ↔ CAPI deduplication. Do not merge
  // eventID into params.
  track(
    'Purchase',
    {
      content_name: contentName || PRODUCT.name,
      content_ids: [contentName || PRODUCT.name],
      contents: [{ id: contentName || PRODUCT.name, quantity: numItems }],
      content_type: 'product',
      currency,
      value: numericValue,
      num_items: numItems,
    },
    eventID,
  );
}

/** Debug helper — call `window.__pixelStatus()` in DevTools console. */
if (typeof window !== 'undefined') {
  window.__pixelStatus = () => ({
    pixelId: PIXEL_ID ? `${String(PIXEL_ID).slice(0, 2)}…${String(PIXEL_ID).slice(-2)}` : '(missing)',
    currency: pixelCurrency(),
    rawCurrency: RAW_CURRENCY,
    fbqLoaded: typeof window.fbq === 'function',
    initialized,
  });
}
