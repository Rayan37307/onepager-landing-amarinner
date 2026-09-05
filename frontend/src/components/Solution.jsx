import { CONTENT } from '../config/content';
import { tpl } from '../lib/text';
import Section from './Section';

export default function Solution() {
  const { solution } = CONTENT;
  if (!solution?.points?.length) return null;

  return (
    <Section title={solution.title} subtitle={solution.intro}>
      <div className="grid gap-4 sm:grid-cols-2">
        {solution.points.map((point) => (
          <div key={point.title} className="rounded-2xl border border-neutral-200 bg-white p-5">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">{point.emoji ?? '✅'}</span>
              <h3 className="font-bold text-magenta-800">{tpl(point.title)}</h3>
            </div>
            <p className="mt-2 text-sm text-neutral-600">{tpl(point.body)}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
