import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Section from './Section';
import OrderCta from './OrderCta';
import { BraIcon } from './icons';
import { usePage } from '../lib/page';

const ChevronLeft = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const ChevronRight = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 6l6 6-6 6" />
  </svg>
);

export default function ProductShowcase() {
  const { CONTENT } = usePage();
  const { showcase } = CONTENT;
  const images = showcase?.images ?? [];
  const trackRef = useRef(null);
  const thumbsRef = useRef(null);
  const overlayRef = useRef(null);
  const [active, setActive] = useState(0);
  const [zoomIndex, setZoomIndex] = useState(null);
  const zoomOpen = zoomIndex !== null;

  // The main image is a native scroll-snap track, so phones get real swipe for
  // free. Keep `active` in sync with whichever slide is snapped into view.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let frame;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        // Slides are full-width on phones but ~1/3.5 of the track on desktop, so
        // find the snapped slide by position instead of dividing by track width.
        const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 1;
        if (atEnd) return setActive(images.length - 1);
        let i = 0;
        let best = Infinity;
        for (let k = 0; k < el.children.length; k += 1) {
          const d = Math.abs(el.children[k].offsetLeft - el.scrollLeft);
          if (d < best) {
            best = d;
            i = k;
          }
        }
        setActive(i);
      });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener('scroll', onScroll);
    };
  }, [images.length]);

  // Keep the selected thumbnail visible when the row overflows.
  useEffect(() => {
    const row = thumbsRef.current;
    const thumb = row?.children[active];
    if (!row || !thumb) return;
    const left = thumb.offsetLeft - (row.clientWidth - thumb.clientWidth) / 2;
    row.scrollTo({ left, behavior: 'smooth' });
  }, [active]);

  // Lightbox: lock page scroll and wire keyboard nav (Esc to close, arrows to
  // step through) while an image is open.
  useEffect(() => {
    if (!zoomOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setZoomIndex(null);
      else if (e.key === 'ArrowRight') setZoomIndex((i) => (i + 1) % images.length);
      else if (e.key === 'ArrowLeft') setZoomIndex((i) => (i - 1 + images.length) % images.length);
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [zoomOpen, images.length]);

  useGSAP(
    () => {
      if (!zoomOpen || !overlayRef.current) return;
      gsap.fromTo(overlayRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.18, ease: 'power1.out' });
      const img = overlayRef.current.querySelector('[data-zoom-img]');
      if (img) gsap.fromTo(img, { scale: 0.92 }, { scale: 1, duration: 0.25, ease: 'power2.out' });
    },
    { dependencies: [zoomOpen, zoomIndex] },
  );

  if (!images.length) return null;

  const goTo = (i) => {
    const el = trackRef.current;
    if (!el) return;
    const next = (i + images.length) % images.length;
    const slide = el.children[next];
    el.scrollTo({ left: slide ? slide.offsetLeft : 0, behavior: 'smooth' });
    setActive(next);
  };

  const stepZoom = (dir) => setZoomIndex((i) => (i + dir + images.length) % images.length);

  const roundBtn =
    'flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition active:scale-95 sm:h-14 sm:w-14';

  return (
    <>
      <Section title={showcase.title}>
        <div data-reveal>
          <div className="relative overflow-hidden rounded-3xl bg-zinc-100 md:rounded-none md:bg-transparent">
            <div
              ref={trackRef}
              className="no-scrollbar flex aspect-square snap-x snap-mandatory overflow-x-auto md:aspect-auto"
            >
              {images.map((img, i) => (
                <div
                  key={img.src ?? i}
                  className="h-full w-full shrink-0 snap-center md:h-auto md:w-[40%] md:snap-start md:px-2"
                >
                  <div className="h-full w-full overflow-hidden bg-zinc-100 md:aspect-square md:rounded-3xl">
                    {img?.src ? (
                      <img
                        src={img.src}
                        alt={img.alt ?? ''}
                        loading={i === 0 ? 'eager' : 'lazy'}
                        draggable={false}
                        onClick={() => setZoomIndex(i)}
                        className="h-full w-full cursor-zoom-in object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-zinc-300">
                        <BraIcon width={64} height={64} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => goTo(active - 1)}
                  aria-label="Previous image"
                  className={`${roundBtn} absolute left-4 top-1/2 z-10 -translate-y-1/2 bg-black/85 md:left-6 text-white hover:bg-black`}
                >
                  <ChevronLeft />
                </button>
                <button
                  type="button"
                  onClick={() => goTo(active + 1)}
                  aria-label="Next image"
                  className={`${roundBtn} absolute right-4 top-1/2 z-10 -translate-y-1/2 bg-black/85 md:right-6 text-white hover:bg-black`}
                >
                  <ChevronRight />
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => setZoomIndex(active)}
              aria-label="Zoom image"
              className={`${roundBtn} absolute bottom-4 right-4 bg-white text-zinc-900 hover:bg-zinc-50 md:hidden`}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
              </svg>
            </button>

            {images.length > 1 && (
              <span className="absolute bottom-5 left-4 rounded-full bg-black/55 px-3 py-0.5 text-xs text-white md:hidden">
                {active + 1} / {images.length}
              </span>
            )}
          </div>

          {images.length > 1 && (
            <div ref={thumbsRef} className="no-scrollbar mt-4 flex gap-3 overflow-x-auto p-1 md:hidden">
              {images.map((img, i) => (
                <button
                  key={img.src ?? i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={img?.alt ? `Show image: ${img.alt}` : `Show image ${i + 1}`}
                  aria-current={i === active}
                  className={`aspect-square w-[22%] shrink-0 overflow-hidden rounded-2xl bg-zinc-100 transition sm:w-[18%] ${
                    i === active
                      ? 'opacity-100 ring-2 ring-zinc-900 ring-offset-2 ring-offset-white'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  {img?.src ? (
                    <img src={img.src} alt="" loading="lazy" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-zinc-300">
                      <BraIcon width={28} height={28} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {showcase.note && (
          <p data-reveal className="mt-3 text-center text-xs font-light text-zinc-400">
            {showcase.note}
          </p>
        )}

        <OrderCta className="mt-8" />
      </Section>

      {zoomOpen && (
        <div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label="Product image"
          onClick={() => setZoomIndex(null)}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 md:p-12"
        >
          <button
            type="button"
            onClick={() => setZoomIndex(null)}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  stepZoom(-1);
                }}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  stepZoom(1);
                }}
                aria-label="Next image"
                className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <img
            data-zoom-img
            key={zoomIndex}
            src={images[zoomIndex]?.src}
            alt={images[zoomIndex]?.alt ?? ''}
            onClick={(e) => e.stopPropagation()}
            className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl"
          />
        </div>
      )}
    </>
  );
}
