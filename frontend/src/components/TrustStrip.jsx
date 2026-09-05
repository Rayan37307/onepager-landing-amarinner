import { CONTENT } from '../config/content';
import { tpl } from '../lib/text';

export default function TrustStrip() {
  const items = CONTENT.trust ?? [];
  if (items.length === 0) return null;

  return (
    <div className="bg-magenta-700">
      <div className="mx-auto grid max-w-5xl gap-3 px-4 py-5 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.text ?? item}
            className="flex items-center gap-2 text-sm font-semibold text-white"
          >
            <span className="text-lg">{item.emoji ?? '✅'}</span>
            {tpl(item.text ?? item)}
          </div>
        ))}
      </div>
    </div>
  );
}
