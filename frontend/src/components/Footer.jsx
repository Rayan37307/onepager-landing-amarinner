import { PRODUCT } from '../config/product';
import { CONTENT } from '../config/content';
import { bnDigits } from '../lib/text';

export default function Footer() {
  return (
    <footer
      data-reveal
      className="border-t border-magenta-100 bg-white py-8 text-center text-sm text-neutral-500"
    >
      <img src="/logo-footer.png" alt={PRODUCT.brand?.name ?? PRODUCT.name} className="mx-auto h-10 w-auto" />
      <div className="mt-2">
        © {bnDigits(new Date().getFullYear())} {PRODUCT.brand?.name ?? PRODUCT.name}. {CONTENT.ui.rightsReserved}
      </div>
    </footer>
  );
}
