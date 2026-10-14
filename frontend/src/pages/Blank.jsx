import { useEffect } from 'react';
import { initPixel } from '../lib/pixel';

// Placeholder for `/` and any unknown path — there is no homepage yet, every
// campaign points straight at a product route such as `/guddi-bra`. Still
// inits the pixel so PageView fires and the helper / Events Manager see the
// pixel on every route.
export default function Blank() {
  useEffect(() => {
    initPixel();
  }, []);
  return <div className="min-h-screen bg-cream" />;
}
