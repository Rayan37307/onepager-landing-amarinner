import { useState } from 'react';
import { PRODUCT } from '../config/product';
import { CONTENT } from '../config/content';

// Image carousel mirroring the reference landing page: a large square slide,
// prev/next arrows, and a row of dot indicators. Driven by PRODUCT.images.
export default function Gallery() {
  const slides = PRODUCT.images ?? [];
  const [index, setIndex] = useState(0);

  const count = slides.length;
  const go = (next) => setIndex((next + count) % count);

  if (count === 0) {
    return (
      <div className="aspect-square w-full overflow-hidden rounded-3xl bg-gradient-to-br from-magenta-100 via-magenta-50 to-white shadow-inner">
        <div className="flex h-full w-full items-center justify-center text-magenta-300">
          <span className="text-sm font-medium">{CONTENT.ui.galleryPlaceholder}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-neutral-100 shadow-inner">
        {slides.map((slide, i) => (
          <img
            key={slide.src ?? i}
            src={slide.src}
            alt={slide.alt ?? `${PRODUCT.name} photo ${i + 1}`}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
              i === index ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-neutral-700 shadow-sm transition hover:bg-white"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-neutral-700 shadow-sm transition hover:bg-white"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {slides.map((slide, i) => (
            <button
              key={slide.src ?? i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to image ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === index ? 'w-5 bg-magenta-600' : 'w-2 bg-neutral-300 hover:bg-neutral-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
