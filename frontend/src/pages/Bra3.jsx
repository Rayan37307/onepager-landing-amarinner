import LandingPage from '../components/LandingPage';
import { BRA3_PRODUCT, BRA3_CONTENT } from '../config/bra3';

// /bra3 — premium strapless padded bra, 4-piece combo.
export default function Bra3() {
  return <LandingPage product={BRA3_PRODUCT} content={BRA3_CONTENT} />;
}
