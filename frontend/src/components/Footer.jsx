import { PRODUCT } from '../config/product';
import { CONTENT } from '../config/content';
import { bnDigits } from '../lib/text';
import { FacebookIcon, InstagramIcon, TiktokIcon, WhatsAppIcon } from './icons';

const SOCIAL_LINKS = [
  { key: 'facebook', Icon: FacebookIcon, label: 'Facebook' },
  { key: 'instagram', Icon: InstagramIcon, label: 'Instagram' },
  { key: 'tiktok', Icon: TiktokIcon, label: 'TikTok' },
  { key: 'whatsapp', Icon: WhatsAppIcon, label: 'WhatsApp' },
];

export default function Footer() {
  const social = PRODUCT.social ?? {};

  return (
    <footer
      data-reveal
      className="border-t border-magenta-100 bg-cream py-5 text-center text-sm text-neutral-500"
    >
      <img src="/logo-footer.png" alt={PRODUCT.brand?.name ?? PRODUCT.name} className="mx-auto h-10 w-auto" />
      <div className="mt-4 flex items-center justify-center gap-4">
        {SOCIAL_LINKS.filter(({ key }) => social[key]).map(({ key, Icon, label }) => (
          <a
            key={key}
            href={social[key]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-magenta-50 text-magenta-600 transition hover:bg-magenta-100"
          >
            <Icon />
          </a>
        ))}
      </div>
      <div className="mt-3">
        © {bnDigits(new Date().getFullYear())} {PRODUCT.brand?.name ?? PRODUCT.name}. {CONTENT.ui.rightsReserved}
      </div>
    </footer>
  );
}
