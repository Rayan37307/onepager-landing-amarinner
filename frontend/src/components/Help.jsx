import { PRODUCT } from '../config/product';
import { CONTENT } from '../config/content';
import { WhatsAppIcon } from './icons';

export default function Help() {
  const { help } = CONTENT;
  const { phone, whatsapp } = PRODUCT.contact ?? {};
  if (!help || !phone) return null;

  return (
    <section className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-page px-4 py-10 text-center sm:px-6">
        <p data-reveal className="text-lg font-bold text-zinc-900">{help.title}</p>
        {help.body && (
          <p data-reveal className="mx-auto mt-2 max-w-md text-sm text-zinc-600">
            {help.body}
          </p>
        )}

        <div data-reveal className="mt-4 flex flex-wrap justify-center gap-3">
          <a
            href={`tel:${phone}`}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-50"
          >
            <span aria-hidden="true">📞</span>
            {help.callLabel} — {phone}
          </a>
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-50"
            >
              <WhatsAppIcon width={16} height={16} />
              {help.whatsappLabel}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
