import { CONTENT } from '../config/content';
import { tpl } from '../lib/text';
import Section from './Section';
import OrderCta from './OrderCta';
import { CheckIcon } from './icons';

export default function Features() {
  const { features } = CONTENT;
  if (!features?.items?.length) return null;

  return (
    <Section title={features.title}>
      <ul data-reveal className="mx-auto grid max-w-xl gap-3">
        {features.items.map((item) => (
          <li key={item.text} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-magenta-100 text-magenta-700">
              <CheckIcon width={14} height={14} />
            </span>
            <span className="text-zinc-800">{tpl(item.text)}</span>
          </li>
        ))}
      </ul>

      <OrderCta className="mt-8" />
    </Section>
  );
}
