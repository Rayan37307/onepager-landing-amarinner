import { tpl } from '../lib/text';

// One restrained accent (rose) — kept minimal and used sparingly.
const ACCENT = {
  bar: 'bg-magenta-600',
  head: 'text-zinc-900',
  ring: 'ring-zinc-200',
};

// Kept so legacy components can `import { TONES }` without breaking — every key
// resolves to the same accent.
export const TONES = new Proxy({}, { get: () => ACCENT });

// Plain, quiet section heading — no rules, no colour, just weight.
export function SectionHeading({ children }) {
  return (
    <h2
      data-reveal
      className="text-center text-3xl font-bold tracking-tight text-zinc-900"
    >
      {children}
    </h2>
  );
}

export default function Section({ id, title, subtitle, children }) {
  return (
    <section id={id} className="bg-cream">
      <div className="mx-auto max-w-page px-4 py-6 sm:px-6 sm:py-8">
        {title && <SectionHeading>{tpl(title)}</SectionHeading>}
        {subtitle && (
          <p data-reveal className="mx-auto mt-2 max-w-2xl text-center text-zinc-500">
            {tpl(subtitle)}
          </p>
        )}
        <div className={title || subtitle ? 'mt-8' : ''}>{children}</div>
      </div>
    </section>
  );
}
