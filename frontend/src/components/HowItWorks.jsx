import { CONTENT } from '../config/content';
import { tpl, bnDigits } from '../lib/text';
import Section from './Section';

export default function HowItWorks() {
  const { howItWorks } = CONTENT;
  if (!howItWorks?.steps?.length) return null;

  return (
    <Section title={howItWorks.title} alt>
      <ol className="grid gap-4 sm:grid-cols-3">
        {howItWorks.steps.map((step, i) => (
          <li key={step.title} className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-magenta-100">
            <div className="flex items-center justify-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-magenta-700 text-sm font-bold text-white">
                {bnDigits(i + 1)}
              </span>
              <span className="text-2xl">{step.emoji ?? '➡️'}</span>
            </div>
            <h3 className="mt-3 font-bold text-magenta-800">{tpl(step.title)}</h3>
            <p className="mt-1.5 text-sm text-neutral-600">{tpl(step.body)}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
