import { CONTENT } from '../config/content';
import { tpl } from '../lib/text';
import Section from './Section';

export default function Faq() {
  const { faq } = CONTENT;
  if (!faq?.items?.length) return null;

  return (
    <Section title={faq.title}>
      <div data-reveal className="mx-auto max-w-2xl divide-y divide-zinc-200 border-y border-zinc-200">
        {faq.items.map((item) => (
          <details key={item.q} className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-zinc-900">
              {tpl(item.q)}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="shrink-0 text-zinc-400 transition-transform group-open:rotate-45"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </summary>
            <p className="mt-2 text-xs text-zinc-600">{tpl(item.a)}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
