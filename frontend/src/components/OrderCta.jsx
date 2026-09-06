import { CONTENT } from '../config/content';
import { tpl } from '../lib/text';
import { CartIcon } from './icons';

// Repeated "jump to the order form" button, dropped between sections. Renders
// nothing when CONTENT.inlineCta is blank.
export default function OrderCta({ className = '' }) {
  const label = CONTENT.inlineCta;
  if (!label) return null;

  return (
    <div className={`mx-auto max-w-md px-4 sm:max-w-lg sm:px-6 ${className}`}>
      <a
        href="#order"
        data-reveal
        className="btn-shine flex w-full items-center justify-center gap-2 rounded-xl bg-magenta-600 px-6 py-3 text-lg font-bold text-white transition-colors hover:bg-magenta-700"
      >
        <CartIcon width={24} height={24} />
        {tpl(label)}
      </a>
    </div>
  );
}
