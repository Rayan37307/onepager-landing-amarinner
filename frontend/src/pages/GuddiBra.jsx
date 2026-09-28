import LandingPage from '../components/LandingPage';
import { PRODUCT } from '../config/product';
import { CONTENT } from '../config/content';

// /guddi-bra — Indian Guddi bra, 6-piece combo.
export default function GuddiBra() {
  return <LandingPage product={PRODUCT} content={CONTENT} />;
}
