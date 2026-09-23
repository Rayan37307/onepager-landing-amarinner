import { useEffect, useRef, useState } from 'react';

const PHRASES = [
  'ডেলিভারি খরচও কম',
  'ঢাকার মধ্যে ৬৫ টাকা এবং ঢাকার বাহিরে ১২৫ টাকা মাত্র',
];

// Auto-scrolling infinite ticker shown just above the order form. The track
// carries two identical halves so the CSS loop (-50%) has no visible seam.
// Every phrase is trailed by a spaced star separator, and each half opens with
// a wide blank lead-in so the first line sits well right of the edge and is
// readable before it scrolls. The animation starts the moment the band scrolls
// into view.
export default function Marquee() {
  const ref = useRef(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || running) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setRunning(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [running]);

  return (
    <div
      ref={ref}
      className={`marquee bg-magenta-800 py-3 text-white sm:py-4 ${running ? 'is-running' : ''}`}
      aria-label={PHRASES.join(' — ')}
    >
      <div className="marquee__track" aria-hidden="true">
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0 items-center gap-14 pl-[38vw] pr-14 sm:pl-[22vw]">
            {Array.from({ length: 3 }).flatMap((_, rep) =>
              PHRASES.map((phrase, i) => (
                <span
                  key={`${rep}-${i}`}
                  className="flex items-center gap-14 text-lg font-bold tracking-normal [word-spacing:0.12em] sm:text-xl"
                >
                  <span>{phrase}</span>
                  <span className="text-2xl text-magenta-400">✦</span>
                </span>
              )),
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
