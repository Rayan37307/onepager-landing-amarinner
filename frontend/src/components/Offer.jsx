import { CONTENT } from '../config/content';
import { tpl } from '../lib/text';
import { ArrowRightIcon } from './icons';

export default function Offer() {
  const { offer } = CONTENT;
  if (!offer) return null;

  return (
    <section className="border-y border-zinc-200 bg-magenta-50/50">
      <div
        data-reveal
        className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6"
      >
        <span className="text-base font-semibold text-zinc-900">{tpl(offer.title)}</span>
        <a
          href="#order"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-magenta-600 hover:text-magenta-700"
        >
          {tpl(offer.cta)}
          <ArrowRightIcon width={15} height={15} aria-hidden />
        </a>
      </div>
    </section>
  );
}
