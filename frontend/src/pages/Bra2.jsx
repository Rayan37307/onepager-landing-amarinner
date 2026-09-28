import LandingPage from '../components/LandingPage';
import { BRA2_PRODUCT, BRA2_CONTENT } from '../config/bra2';

// /bra2 — wireless push-up bra, 3-piece combo.
export default function Bra2() {
  return <LandingPage product={BRA2_PRODUCT} content={BRA2_CONTENT} />;
}
