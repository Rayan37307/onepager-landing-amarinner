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

        <div className="flex items-center gap-1.5 text-left">
          <img
            src="/delivery (2).png"
            alt=""
            aria-hidden="true"
            className="h-7 w-7 shrink-0 brightness-0 invert"
          />
          <span className="max-w-[9.5rem] text-xs font-semibold leading-tight text-white sm:max-w-[12rem]">
            {CONTENT.header.codNote.split('\n').map((line, i) => (
              <span key={i} className="block whitespace-nowrap">
                {line}
              </span>
            ))}
          </span>
        </div>
      </div>
    </header>
  );
}
