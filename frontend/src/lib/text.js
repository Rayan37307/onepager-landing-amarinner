import { PRODUCT } from '../config/product';

// Format a number with Bengali (Bangla) digits and grouping.
export function bnNum(n) {
  return Number(n).toLocaleString('bn-BD', { maximumFractionDigits: 2 });
}

// Map ASCII digits in a string to Bengali digits, no grouping (years, phone).
const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
export function bnDigits(str) {
  return String(str).replace(/\d/g, (d) => BN_DIGITS[d]);
}

// Price with the configured currency symbol, e.g. "৳৯৯৯".
export function money(n, product = PRODUCT) {
  return `${product.currency}${bnNum(n)}`;
}

// Replace `{name}` / `{price}` tokens in content strings.
export function tpl(str, product = PRODUCT) {
  if (typeof str !== 'string') return str;
  return str
    .replaceAll('{name}', product.name)
    .replaceAll('{price}', bnNum(product.price));
}
