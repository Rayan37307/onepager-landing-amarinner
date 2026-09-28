import { createContext, useContext, useMemo } from 'react';
import { PRODUCT } from '../config/product';
import { CONTENT } from '../config/content';
import { money as formatMoney, tpl as fillTokens } from './text';

// Each landing page supplies its own product + copy through this context (see
// components/PageProvider), so the shared section components can render any
// product. Components outside a provider fall back to the default product in
// ../config.
export const PageContext = createContext({ product: PRODUCT, content: CONTENT });

/**
 * The current page's PRODUCT and CONTENT, plus `tpl` / `money` bound to that
 * product (so `{name}` / `{price}` and the currency come from the right page).
 */
export function usePage() {
  const { product, content } = useContext(PageContext);
  return useMemo(
    () => ({
      PRODUCT: product,
      CONTENT: content,
      tpl: (str) => fillTokens(str, product),
      money: (n) => formatMoney(n, product),
    }),
    [product, content],
  );
}
