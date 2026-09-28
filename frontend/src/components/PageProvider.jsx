import { useMemo } from 'react';
import { PageContext } from '../lib/page';

// Wrap a landing page in this to give every section its product + copy.
export default function PageProvider({ product, content, children }) {
  const value = useMemo(() => ({ product, content }), [product, content]);
  return <PageContext.Provider value={value}>{children}</PageContext.Provider>;
}
