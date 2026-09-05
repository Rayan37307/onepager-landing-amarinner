import { CONTENT } from '../config/content';
import { tpl } from '../lib/text';
import Section from './Section';

export default function ProductDetails() {
  const { details } = CONTENT;
  if (!details?.points?.length) return null;

  const images = details.images ?? [];

  return (
    <Section title={details.title}>
      {images.length > 0 && (
        <div className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img, i) => (
            <img
              key={img.src ?? i}
              src={img.src}
              alt={img.alt ?? `Detail ${i + 1}`}
              className="aspect-square w-full rounded-2xl object-cover"
            />
          ))}
        </div>
      )}
      <dl className="grid gap-4 sm:grid-cols-2">
        {details.points.map((point) => (
          <div key={point.title} className="rounded-2xl border border-neutral-200 bg-white p-5">
            <dt className="flex items-center gap-2.5 font-bold text-magenta-800">
              <span className="text-xl">{point.emoji ?? '🔎'}</span>
              {tpl(point.title)}
            </dt>
            <dd className="mt-2 text-sm text-neutral-600">{tpl(point.body)}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
