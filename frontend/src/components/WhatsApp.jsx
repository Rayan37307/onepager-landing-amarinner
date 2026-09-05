import { PRODUCT } from '../config/product';
import { CONTENT } from '../config/content';
import { tpl } from '../lib/text';
import { WhatsAppIcon } from './icons';

// Standalone contact block — a wide green WhatsApp pill and, under it, a matching
// magenta call pill showing the phone number. Renders nothing without a
// WhatsApp number or label; the call pill hides on its own without a phone
// number or `callLabel`.
export default function WhatsApp() {
  const { whatsapp } = CONTENT;
  const number = PRODUCT.contact?.whatsapp;
  const phone = PRODUCT.contact?.phone;
  if (!whatsapp?.label || !number) return null;

  const href = `https://wa.me/${number}${
    whatsapp.prefill ? `?text=${encodeURIComponent(tpl(whatsapp.prefill))}` : ''
  }`;

  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-md px-4 py-8 sm:max-w-lg sm:px-6">
        {whatsapp.title && (
          <p data-reveal className="mb-4 text-center text-lg font-bold text-zinc-900">
            {tpl(whatsapp.title)}
          </p>
        )}

        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          data-reveal
          className="btn-shine flex items-center justify-center gap-3 rounded-full bg-[#25D366] px-6 py-4 text-base font-bold text-white shadow-sm transition-colors hover:bg-[#1ebe5b]"
        >
          <WhatsAppIcon width={24} height={24} />
          {tpl(whatsapp.label)}
        </a>

        {phone && whatsapp.callLabel && (
          <a
            href={`tel:${phone}`}
            data-reveal
            className="btn-shine mt-3 flex items-center justify-center gap-3 rounded-full bg-magenta-600 px-6 py-4 text-lg font-bold text-white shadow-sm transition-colors hover:bg-magenta-700"
          >
            <span aria-hidden="true" className="text-xl leading-none">📞</span>
            {tpl(whatsapp.callLabel)} — {phone}
          </a>
        )}

        {whatsapp.note && (
          <p data-reveal className="mt-2 text-center text-xs text-zinc-500">
            {tpl(whatsapp.note)}
          </p>
        )}
      </div>
    </section>
  );
}
