import { BraIcon } from './icons';
import { usePage } from '../lib/page';

export default function Hero() {
  const { PRODUCT, CONTENT, tpl } = usePage();
  const { hero } = CONTENT;
  const banner = PRODUCT.heroBanner;
  const bannerMobile = banner?.mobile ?? banner?.desktop;
  const bannerDesktop = banner?.desktop ?? banner?.mobile;
  const heroImage = PRODUCT.images?.[0];
  const title = `${PRODUCT.name}${PRODUCT.variantTag ? ` — ${PRODUCT.variantTag}` : ''}`;

  return (
    <section className="mx-auto max-w-page">
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

      {/* Order button — on mobile it lifts up over the banner's bottom edge for
          a floating 3D effect; on desktop it sits normally below. */}
      <div className="relative z-10 mx-auto -mt-7 max-w-md px-4 sm:mt-4 sm:max-w-lg">
        <a
          href="#order"
          data-reveal
          className="btn-shine flex w-full items-center justify-center gap-2 rounded-xl bg-magenta-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-magenta-900/30 ring-1 ring-black/5 transition-colors hover:bg-magenta-700 sm:shadow-none sm:ring-0"
        >
          <img
            src="/online-shopping.png"
            alt=""
            aria-hidden="true"
            className="h-5 w-5 brightness-0 invert"
          />
          {tpl(hero.cta)}
        </a>
      </div>
    </section>
  );
}
