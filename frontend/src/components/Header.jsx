import { PRODUCT } from '../config/product';
import { CONTENT } from '../config/content';

export default function Header() {
  const { brand } = PRODUCT;

  return (
    <header className="sticky top-0 z-40 bg-magenta-700 text-white">
      <div className="mx-auto flex max-w-page items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <img
          src="/Amar Inner logo-v1 (3).png"
          alt={`${brand.name} (${brand.nameEn})`}
          className="h-9 w-auto sm:h-10"
        />

        {/* Two-line delivery note with a truck icon sized to span both lines.
            The PNG carries its own transparent padding, so a negative margin
            pulls the text back in tight against the glyph. */}
        <div className="flex items-center gap-0 text-right">
          <img
            src="/delivery (2).png"
            alt=""
            aria-hidden="true"
            className="-mr-2 h-10 w-10 shrink-0 brightness-0 invert"
          />
          <span className="max-w-[9.5rem] text-sm font-semibold leading-tight text-white sm:max-w-[12rem]">
            {CONTENT.header.codNote}
          </span>
        </div>
      </div>
    </header>
  );
}
