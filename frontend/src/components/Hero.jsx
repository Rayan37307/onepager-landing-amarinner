import { PRODUCT } from '../config/product';
import { CONTENT } from '../config/content';
import { tpl } from '../lib/text';
import { BraIcon } from './icons';

export default function Hero() {
  const { hero } = CONTENT;
  const banner = PRODUCT.heroBanner;
  const bannerMobile = banner?.mobile ?? banner?.desktop;
  const bannerDesktop = banner?.desktop ?? banner?.mobile;
  const heroImage = PRODUCT.images?.[0];
  const title = `${PRODUCT.name}${PRODUCT.variantTag ? ` — ${PRODUCT.variantTag}` : ''}`;

  return (
    <section className="">
      {/* Full-bleed banner — natural height, nothing overlaid */}
      {bannerMobile ? (
        <picture data-reveal>
          <source media="(min-width: 640px)" srcSet={bannerDesktop.src} />
          <img
            src={bannerMobile.src}
            alt={bannerMobile.alt ?? title}
            className="block h-auto w-full"
          />
        </picture>
      ) : heroImage ? (
        <img
          data-reveal
          src={heroImage.src}
          alt={heroImage.alt ?? title}
          className="block h-auto w-full"
        />
      ) : (
        <div className="flex aspect-[4/5] w-full items-center justify-center bg-zinc-100 text-zinc-300">
          <BraIcon width={56} height={56} />
        </div>
      )}

      <div className="mx-auto max-w-md px-4 sm:max-w-lg">
        {/* Order button — sits directly under the banner */}
        <a
          href="#order"
          data-reveal
          className="btn-shine mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-magenta-600 px-6 py-3 text-lg font-bold text-white transition-colors hover:bg-magenta-700"
        >
          <img
            src="/online-shopping.png"
            alt=""
            aria-hidden="true"
            className="h-6 w-6 brightness-0 invert"
          />
          {tpl(hero.cta)}
        </a>
      </div>
    </section>
  );
}
