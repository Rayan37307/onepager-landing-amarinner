import { CONTENT } from '../config/content';
import { tpl } from '../lib/text';
import Section from './Section';

export default function Problem() {
  const { problem } = CONTENT;
  if (!problem?.points?.length) return null;

  return (
    <Section title={problem.title} alt>
      <ul className="grid gap-3 sm:grid-cols-2">
        {problem.points.map((point) => (
          <li
            key={point}
            className="flex items-start gap-3 rounded-2xl bg-white p-4 text-neutral-800 shadow-sm ring-1 ring-magenta-100"
          >
            <span className="mt-0.5 shrink-0 text-magenta-400">✕</span>
            {tpl(point)}
          </li>
        ))}
      </ul>
    </Section>
  );
}
