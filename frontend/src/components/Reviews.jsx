import { CONTENT } from '../config/content';
import { tpl, bnDigits } from '../lib/text';
import Section from './Section';
import { StarIcon } from './icons';

function Stars({ rating = 5 }) {
  return (
    <div className="flex gap-0.5 text-magenta-500" aria-label={`${bnDigits(rating)}/৫`}>
      {Array.from({ length: 5 }, (_, i) => (
        <StarIcon key={i} filled={i < rating} width={15} height={15} />
      ))}
    </div>
  );
}

export default function Reviews() {
  const items = CONTENT.reviews?.items ?? [];
  if (items.length === 0) return null;

  return (
    <Section title={CONTENT.reviews.title}>
      <div data-reveal className="mx-auto max-w-2xl divide-y divide-zinc-200 border-y border-zinc-200">
        {items.map((review, i) => (
          <figure key={i} className="py-5">
            <div className="flex items-center gap-3">
              {review.image ? (
                <img src={review.image} alt="" className="h-9 w-9 rounded-full object-cover" />
              ) : (
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-sm font-semibold text-zinc-600">
                  {review.name ? review.name[0] : '★'}
                </span>
              )}
              <div>
                <figcaption className="text-sm font-semibold text-zinc-900">{review.name}</figcaption>
                <Stars rating={review.rating} />
              </div>
            </div>
            <blockquote className="mt-2.5 text-sm text-zinc-600">{tpl(review.body)}</blockquote>
          </figure>
        ))}
      </div>
    </Section>
  );
}
