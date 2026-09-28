import { CartIcon } from './icons';
import { usePage } from '../lib/page';

// Repeated "jump to the order form" button, dropped between sections. Renders
// nothing when CONTENT.inlineCta is blank.
export default function OrderCta({ className = '' }) {
  const { CONTENT, tpl } = usePage();
  const label = CONTENT.inlineCta;
  if (!label) return null;

  return (
    <div className={`mx-auto max-w-md px-4 sm:max-w-lg sm:px-6 ${className}`}>
      <a
        href="#order"
        data-reveal
        className="btn-shine flex w-full items-center justify-center gap-2 rounded-xl bg-magenta-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-magenta-700"
      >
        <CartIcon width={20} height={20} />
        {tpl(label)}
      </a>
    </div>
  );
}
