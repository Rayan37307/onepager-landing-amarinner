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
];

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
  const merged = { ...fromUrl, ...stored };

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

  return {
    ...stored,
    // Meta Pixel first-party cookies — present once the pixel has loaded.
    // fbc is the click id (from fbclid); the backend falls back to
    // reconstructing it from the raw fbclid when this cookie is absent.
    fbp: readCookie('_fbp'),
    fbc: readCookie('_fbc'),
  };
}
