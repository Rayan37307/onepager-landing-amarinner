import { useEffect, useMemo, useState } from 'react';
import { CONTENT } from '../config/content';
import { tpl, bnDigits } from '../lib/text';
import OrderCta from './OrderCta';
import { ClockIcon } from './icons';

const STORAGE_KEY = 'ai_offer_deadline';

// Read (or lazily create) the per-visitor offer deadline. The first view sets
// `now + durationHours`, remembered in localStorage so the same visitor keeps
// counting down instead of the timer resetting on every page load. Once it runs
// out we roll a fresh window so the offer never sits dead at 00:00:00.
function resolveDeadline(durationHours) {
  const span = Math.max(1, durationHours) * 60 * 60 * 1000;
  const fresh = () => Date.now() + span;
  try {
    const saved = Number(localStorage.getItem(STORAGE_KEY));
    if (saved && saved > Date.now()) return saved;
    const next = fresh();
    localStorage.setItem(STORAGE_KEY, String(next));
    return next;
  } catch {
    return fresh();
  }
}

function parts(msLeft) {
  const total = Math.max(0, Math.floor(msLeft / 1000));
  return {
    hours: Math.floor(total / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

const pad = (n) => bnDigits(String(n).padStart(2, '0'));

export default function Countdown() {
  const { countdown } = CONTENT;
  const { title, subtitle, durationHours = 6, labels = {}, expiredText } = countdown ?? {};
  const deadline = useMemo(() => resolveDeadline(durationHours), [durationHours]);
  const [msLeft, setMsLeft] = useState(() => deadline - Date.now());

  useEffect(() => {
    const tick = () => setMsLeft(deadline - Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [deadline]);

  if (!countdown) return null;

  const { hours, minutes, seconds } = parts(msLeft);
  const done = msLeft <= 0;

  const cells = [
    { value: hours, label: labels.hours ?? 'ঘণ্টা' },
    { value: minutes, label: labels.minutes ?? 'মিনিট' },
    { value: seconds, label: labels.seconds ?? 'সেকেন্ড' },
  ];

  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-page px-4 py-6 sm:px-6 sm:py-8">
        <div
          data-reveal
          className="countdown-glow mx-auto max-w-xl overflow-hidden rounded-2xl bg-gradient-to-br from-magenta-700 to-magenta-800 px-5 py-7 text-center text-white sm:px-8"
        >
          <p className="flex items-center justify-center gap-2 text-lg font-bold">
            <ClockIcon width={22} height={22} aria-hidden />
            {tpl(title)}
          </p>

          {done ? (
            <p className="mt-4 text-xl font-extrabold text-magenta-50">
              {tpl(expiredText ?? title)}
            </p>
          ) : (
            <div className="mt-5 flex items-start justify-center gap-2 sm:gap-3">
              {cells.map((cell, i) => (
                <div key={cell.label} className="flex items-start gap-2 sm:gap-3">
                  <div className="w-[4.5rem] rounded-xl bg-white/95 px-2 py-3 shadow-sm sm:w-20">
                    <div className="font-display text-4xl font-extrabold leading-none tracking-tight text-magenta-700 tabular-nums">
                      {pad(cell.value)}
                    </div>
                    <div className="mt-1.5 text-xs font-semibold text-magenta-700/70">
                      {cell.label}
                    </div>
                  </div>
                  {i < cells.length - 1 && (
                    <span className="pt-2 text-3xl font-extrabold text-white/60">:</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {subtitle && (
            <p className="mt-5 text-sm font-medium text-magenta-50/90">{tpl(subtitle)}</p>
          )}
        </div>

        <OrderCta className="mt-6" />
      </div>
    </section>
  );
}
