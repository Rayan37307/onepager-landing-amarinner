import { PRODUCT } from '../config/product';
import { CONTENT } from '../config/content';
import { tpl, bnDigits } from '../lib/text';
import Section from './Section';
import { PhoneIcon } from './icons';

export default function SizeGuide() {
  const { sizeGuide, ui } = CONTENT;
  const sizes = PRODUCT.sizes ?? [];
  const hasChart = sizeGuide?.chart?.rows?.length;
  if (!sizes.length && !hasChart) return null;

  const { chart, howToMeasure = [], betweenSizes } = sizeGuide ?? {};

  return (
    <Section id="size-guide" title={sizeGuide.title} subtitle={sizeGuide.intro}>
      {sizes.length > 0 && (
        <>
          <div className="flex flex-wrap justify-center gap-2.5">
            {sizes.map((s) => (
              <a
                key={s.label}
                href="#order"
                className="min-w-[3.5rem] rounded-xl border border-emerald-200 bg-emerald-50/50 px-4 py-3 text-center text-lg font-bold text-neutral-800 transition hover:border-magenta-400 hover:bg-magenta-50 hover:text-magenta-700"
              >
                {bnDigits(s.label)}
              </a>
            ))}
          </div>
          {sizeGuide.note && (
            <p className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-neutral-500">
              <PhoneIcon width={16} height={16} className="text-magenta-500" />
              {tpl(sizeGuide.note)}
            </p>
          )}
        </>
      )}

      {hasChart ? (
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-magenta-100">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-magenta-600 text-white">
                  {chart.columns.map((col) => (
                    <th key={col} className="px-4 py-3 font-semibold">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {chart.rows.map((row, r) => (
                  <tr key={row[0]} className={`border-b border-neutral-100 last:border-0 ${r % 2 ? 'bg-magenta-50/50' : ''}`}>
                    {row.map((cell, i) => (
                      <td key={i} className={`px-4 py-3 ${i === 0 ? 'font-bold text-magenta-700' : 'text-neutral-600'}`}>
                        {bnDigits(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            {howToMeasure.length > 0 && (
              <>
                <h3 className="font-bold text-magenta-700">{ui.howToMeasureTitle}</h3>
                <ol className="mt-3 space-y-2.5">
                  {howToMeasure.map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm text-neutral-700">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-magenta-600 text-xs font-bold text-white">
                        {bnDigits(i + 1)}
                      </span>
                      {tpl(step)}
                    </li>
                  ))}
                </ol>
              </>
            )}

            {betweenSizes && (
              <div className="mt-6 rounded-2xl bg-white p-4 text-sm text-neutral-700 shadow-sm ring-1 ring-magenta-100">
                <span className="font-bold text-magenta-700">{ui.betweenSizesLabel}</span>
                {tpl(betweenSizes)}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </Section>
  );
}
