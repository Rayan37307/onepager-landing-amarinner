import { CONTENT } from '../config/content';
import { tpl } from '../lib/text';
import { Icon } from './icons';

// Compact trust strip — sits directly above the order form as reassurance
// right before the customer commits. Deliberately small and plain.
export default function Guarantee() {
  const { guarantee } = CONTENT;
  if (!guarantee?.items?.length) return null;

  return (
    <section className="border-y border-zinc-200 bg-magenta-50/40">
      <div className="mx-auto max-w-page px-4 py-7 sm:px-6">
        {guarantee.title && (
          <p data-reveal className="text-center text-base font-semibold text-zinc-900">
            {tpl(guarantee.title)}
          </p>
        )}
        <div
          data-reveal
          className="mt-5 grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4"
        >
          {guarantee.items.map((item) => (
            <div key={item.title} className="flex flex-col items-center gap-2 text-center">
              <Icon name={item.icon} width={22} height={22} className="text-magenta-600" />
              <span className="text-xs font-medium leading-snug text-zinc-600">
                {tpl(item.title)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
