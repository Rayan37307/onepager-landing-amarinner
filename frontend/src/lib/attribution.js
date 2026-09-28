// Captures ad-attribution data on landing and persists it for the lifetime of
// the visit, so it's still available when the visitor submits the order form
// later — even if they land on a UTM'd URL, browse around, then convert.

const STORAGE_KEY = 'attribution';

const TRACKED_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'fbclid',
  'campaign', // manual override, e.g. ?campaign=Summer%20Offer
  // Meta ad hierarchy — add these to the ad's URL parameters:
  //   campaign_id={{campaign.id}}&adset_id={{adset.id}}&ad_id={{ad.id}}
  //   &adset_name={{adset.name}}&ad_name={{ad.name}}&placement={{placement}}
  'adset_name',
  'ad_name',
  'placement',
];

// URL params renamed on the way to the backend, where `campaign_id` is already
// the local campaign foreign key.
const RENAMED_PARAMS = {
  campaign_id: 'fb_campaign_id',
  adset_id: 'fb_adset_id',
  ad_id: 'fb_ad_id',
};

function newSessionId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function readCookie(name) {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function captureFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const captured = {};

  for (const key of TRACKED_PARAMS) {
    const value = params.get(key);
    if (value) captured[key] = value;
  }
  for (const [param, key] of Object.entries(RENAMED_PARAMS)) {
    const value = params.get(param);
    if (value) captured[key] = value;
  }

  return captured;
}

/**
 * Call once on app load. Merges any new UTM/fbclid params from the current
 * URL into whatever was already stored for this visit (first-touch wins per
 * field, so re-landing without params doesn't wipe earlier attribution).
 */
export function captureAttribution() {
  let stored = {};
  try {
    stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    stored = {};
  }

  const fromUrl = captureFromUrl();
  // Visit details are first-touch too: the page they landed on, where they
  // came from, a per-tab session id and when they arrived (for "time spent
  // before order").
  const visit = {
    landing_page: window.location.href,
    referrer: document.referrer || undefined,
    session_id: newSessionId(),
    landed_at: Date.now(),
  };
  const merged = { ...visit, ...fromUrl, ...stored };

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // sessionStorage unavailable (private mode, etc) — attribution just won't persist across reloads.
  }

  return merged;
}

/**
 * Read the attribution payload to attach to the order submission. Includes
 * the Meta browser pixel cookie (_fbp) if the Meta Pixel is installed.
 */
export function getAttribution() {
  let stored = {};
  try {
    stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    stored = {};
  }

  const { landed_at: landedAt, ...rest } = stored;

  return {
    ...rest,
    time_to_order_seconds: landedAt ? Math.max(0, Math.round((Date.now() - landedAt) / 1000)) : undefined,
    // Meta Pixel first-party cookies — present once the pixel has loaded.
    // fbc is the click id (from fbclid); the backend falls back to
    // reconstructing it from the raw fbclid when this cookie is absent.
    fbp: readCookie('_fbp'),
    fbc: readCookie('_fbc'),
  };
}
