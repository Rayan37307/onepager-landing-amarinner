import { PRODUCT } from '../config/product';
import { CONTENT } from '../config/content';
import { money } from '../lib/text';

export default function StickyBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-page items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
        <div className="text-sm font-semibold text-zinc-900">
          {PRODUCT.variantTag ? `${PRODUCT.variantTag} · ` : ''}
          <span className="price-hl text-magenta-600">{money(PRODUCT.price)}</span>
        </div>
        <a
          href="#order"
          className="btn-shine inline-flex shrink-0 items-center gap-2 rounded-lg bg-magenta-600 px-4 py-1.5 text-sm font-bold text-white transition-colors hover:bg-magenta-700"
        >
          <img
            src="/online-shopping.png"
            alt=""
            aria-hidden="true"
            className="h-5 w-5 brightness-0 invert"
          />
          {CONTENT.ui.stickyCta}
        </a>
      </div>
    </div>
  );
}
