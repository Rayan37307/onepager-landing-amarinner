import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { CONTENT } from '../config/content';
import Section from './Section';
import OrderCta from './OrderCta';
import { BraIcon } from './icons';

export default function ProductShowcase() {
  const { showcase } = CONTENT;
  const images = showcase?.images ?? [];
  const scrollerRef = useRef(null);

  // One-time "swipe me" hint: when the slider scrolls into view it buzzes a few
  // pixels, then peeks the next slide and slides back — so it's obvious the row
  // scrolls sideways. Skipped on desktop (grid, nothing to scroll), for
  // reduced-motion users, and the moment the user touches it themselves.
  useGSAP(
    () => {
      const el = scrollerRef.current;
      if (!el || images.length < 2) return;

      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        if (el.scrollWidth - el.clientWidth < 24) return;

        const tl = gsap.timeline({
          delay: 0.4,
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        });
        tl.to(el, { scrollLeft: 12, duration: 0.1, repeat: 5, yoyo: true, ease: 'sine.inOut' })
          .to(el, { scrollLeft: 72, duration: 0.5, ease: 'power2.out' }, '+=0.06')
          .to(el, { scrollLeft: 0, duration: 0.45, ease: 'power2.inOut' }, '+=0.4');

        const stop = () => tl.kill();
        el.addEventListener('pointerdown', stop, { once: true });
        el.addEventListener('wheel', stop, { once: true, passive: true });
        el.addEventListener('touchstart', stop, { once: true, passive: true });
        return () => {
          tl.kill();
          el.removeEventListener('pointerdown', stop);
          el.removeEventListener('wheel', stop);
          el.removeEventListener('touchstart', stop);
        };
      });
    },
    { scope: scrollerRef },
  );

  if (!images.length) return null;

  const scrollByCard = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.82, behavior: 'smooth' });
  };

  return (
    <Section title={showcase.title}>
      <div className="relative">
        <div
          ref={scrollerRef}
          data-reveal
          className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0"
        >
          {images.map((img, i) => (
            <figure
              key={img.src ?? i}
              className="w-[78%] shrink-0 snap-center sm:w-auto sm:shrink"
            >
              <div className="aspect-square w-full overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50">
                {img?.src ? (
                  <img
                    src={img.src}
                    alt={img.alt ?? ''}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-zinc-300">
                    <BraIcon width={44} height={44} />
                  </div>
                )}
              </div>
            </figure>
          ))}
        </div>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              aria-label="Previous image"
              className="absolute left-1 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-zinc-700 shadow-md transition hover:bg-white sm:hidden"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              aria-label="Next image"
              className="absolute right-1 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-zinc-700 shadow-md transition hover:bg-white sm:hidden"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </>
        )}
      </div>

      {showcase.note && (
        <p data-reveal className="mt-3 text-center text-xs font-light text-zinc-400">
          {showcase.note}
        </p>
      )}

      <OrderCta className="mt-8" />
    </Section>
  );
}
