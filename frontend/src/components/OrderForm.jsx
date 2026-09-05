import { useEffect, useRef, useState } from 'react';
import { PRODUCT } from '../config/product';
import { CONTENT } from '../config/content';
import { money, bnDigits } from '../lib/text';
import { getAttribution } from '../lib/attribution';
import { trackInitiateCheckout, trackPurchase } from '../lib/pixel';
import { submitOrder, ApiError } from '../lib/api';
import { BraIcon, CheckIcon } from './icons';

const UI = CONTENT.ui;
const SIZES = PRODUCT.sizes ?? [];
const COLORS = PRODUCT.colors ?? [];
const SHIP = PRODUCT.shipping ?? null;

// Resolve a district name to its fee tier: Dhaka city → dhaka, the adjacent
// belt → suburb, everything else → normal.
function resolveTier(district) {
  if (!SHIP || !district) return null;
  if (district === SHIP.dhakaDistrict) return SHIP.tiers.dhaka;
  if (SHIP.suburbDistricts?.includes(district)) return SHIP.tiers.suburb;
  return SHIP.tiers.normal;
}

export default function OrderForm() {
  const [size, setSize] = useState(SIZES[0]?.label ?? '');
  const [color, setColor] = useState(COLORS[0]?.label ?? null);
  const [district, setDistrict] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errors, setErrors] = useState({});
  const [orderNumber, setOrderNumber] = useState(null);

  // Fire Meta Pixel InitiateCheckout once, when the form scrolls into view.
  const sectionRef = useRef(null);
  const checkoutTracked = useRef(false);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || checkoutTracked.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !checkoutTracked.current) {
          checkoutTracked.current = true;
          trackInitiateCheckout();
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const quantity = 1;
  const unitPrice = SIZES.length
    ? (SIZES.find((s) => s.label === size)?.price ?? PRODUCT.price)
    : PRODUCT.price;
  const tier = resolveTier(district);
  const shippingFee = tier?.fee ?? 0;
  const total = unitPrice * quantity + shippingFee;

  function updateField(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    setErrors({});

    try {
      const attribution = getAttribution();
      const result = await submitOrder({
        customer_name: form.name,
        customer_phone: form.phone,
        customer_address: form.address,
        product_name: `${PRODUCT.name}${PRODUCT.variantTag ? ` (${PRODUCT.variantTag})` : ''}`,
        quantity,
        unit_price: unitPrice,
        variant: size || null,
        color,
        shipping_zone: district ? `${district}${tier ? ` — ${tier.label}` : ''}` : null,
        shipping_fee: shippingFee,
        ...attribution,
      });

      setOrderNumber(result.order_number);
      setStatus('success');

      // Browser-side Purchase — deduped against the server-side CAPI event by
      // the shared event_id the backend returns.
      trackPurchase({
        value: total,
        eventID: result.event_id,
        contentName: `${PRODUCT.name}${PRODUCT.variantTag ? ` ${PRODUCT.variantTag}` : ''}`,
      });
    } catch (err) {
      setStatus('error');
      if (err instanceof ApiError) setErrors(err.errors);
    }
  }

  const productTitle = `${PRODUCT.name}${PRODUCT.variantTag ? ` ${PRODUCT.variantTag}` : ''}`;
  const selectedImage = COLORS.find((c) => c.label === color)?.image ?? PRODUCT.images?.[0]?.src;

  if (status === 'success') {
    return (
      <section id="order" className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckIcon width={24} height={24} />
        </span>
        <h2 className="mt-4 text-xl font-bold text-zinc-900">{UI.successTitle}</h2>
        <p className="mt-2 text-zinc-600">{UI.successBody.replace('#{order}', `#${orderNumber}`)}</p>
      </section>
    );
  }

  return (
    <section id="order" ref={sectionRef} className="border-t border-zinc-200 bg-magenta-50/40">
      <div className="mx-auto max-w-lg px-4 py-12 sm:px-6">
        <h2 data-reveal className="text-2xl font-bold tracking-tight text-zinc-900">
          {UI.formTitle}
        </h2>

        {/* What you're ordering */}
        <div data-reveal className="mt-5 flex items-center gap-3 border-y border-zinc-200 py-3">
          <ProductThumb image={selectedImage} />
          <span className="flex-1 text-sm font-semibold text-zinc-900">{productTitle}</span>
          <span className="price-hl text-sm font-bold text-zinc-900">{money(unitPrice)}</span>
        </div>

        <form onSubmit={handleSubmit} data-reveal className="mt-6 space-y-6">
          {SIZES.length > 0 && (
            <fieldset>
              <legend className="text-sm font-semibold text-zinc-900">{UI.sizeFieldLabel}</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {SIZES.map((s) => {
                  const delta = s.price - PRODUCT.price;
                  return (
                    <button
                      type="button"
                      key={s.label}
                      onClick={() => setSize(s.label)}
                      aria-pressed={size === s.label}
                      className={`min-w-[3rem] rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                        size === s.label
                          ? 'border-magenta-600 bg-magenta-600 text-white'
                          : 'border-zinc-300 text-zinc-800 hover:border-zinc-400'
                      }`}
                    >
                      {bnDigits(s.label)}
                      {delta > 0 && ` (+${money(delta)})`}
                    </button>
                  );
                })}
              </div>
              <FieldError error={errors.variant} />
            </fieldset>
          )}

          {COLORS.length > 0 && (
            <fieldset>
              <legend className="text-sm font-semibold text-zinc-900">{UI.colorLabel}</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {COLORS.map((c) => (
                  <button
                    type="button"
                    key={c.label}
                    onClick={() => setColor(c.label)}
                    aria-pressed={color === c.label}
                    className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      color === c.label
                        ? 'border-magenta-600 text-zinc-900'
                        : 'border-zinc-300 text-zinc-800 hover:border-zinc-400'
                    }`}
                  >
                    <span
                      aria-hidden
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: c.swatch, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.15)' }}
                    />
                    {c.label}
                  </button>
                ))}
              </div>
              <FieldError error={errors.color} />
            </fieldset>
          )}

          {SHIP?.divisions?.length > 0 && (
            <fieldset>
              <legend className="text-sm font-semibold text-zinc-900">{UI.shippingTitle}</legend>
              <label className="mt-2 block">
                <span className="mb-1 block text-sm font-medium text-zinc-800">
                  {UI.districtLabel}
                </span>
                <select
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className={`${inputClass} appearance-none bg-white`}
                >
                  <option value="" disabled>
                    {UI.zonePlaceholder}
                  </option>
                  {SHIP.divisions.map((div) => (
                    <optgroup key={div.name} label={div.name}>
                      {div.districts.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </label>
              {tier && (
                <p className="mt-2 flex items-center justify-between text-sm text-zinc-600">
                  <span>{UI.deliveryLabel} · {tier.label}</span>
                  <span className="font-semibold text-zinc-900">{money(tier.fee)}</span>
                </p>
              )}
              <FieldError error={errors.shipping_zone} />
            </fieldset>
          )}

          <div className="space-y-3">
            <Input
              label={UI.nameLabel}
              value={form.name}
              onChange={updateField('name')}
              placeholder={UI.namePlaceholder}
              error={errors.customer_name}
            />
            <Input
              label={UI.phoneLabel}
              type="tel"
              value={form.phone}
              onChange={updateField('phone')}
              placeholder={UI.phonePlaceholder}
              error={errors.customer_phone}
            />
            <Input
              label={UI.addressLabel}
              value={form.address}
              onChange={updateField('address')}
              placeholder={UI.addressPlaceholder}
              error={errors.customer_address}
            />
          </div>

          <div className="flex items-center justify-between border-t border-zinc-200 pt-4 text-base font-bold text-zinc-900">
            <span>{UI.totalLabel}</span>
            <span className="price-hl">{money(total)}</span>
          </div>

          {status === 'error' && Object.keys(errors).length === 0 && (
            <p className="text-center text-sm font-medium text-magenta-600">{UI.genericError}</p>
          )}

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="btn-shine flex w-full items-center justify-center gap-2 rounded-xl bg-magenta-600 py-3.5 text-base font-bold text-white transition-colors hover:bg-magenta-700 disabled:opacity-60"
          >
            {status === 'submitting' ? UI.submitting : `${UI.submitIdle} — ${money(total)}`}
          </button>

          <p className="text-center text-xs text-zinc-500">{UI.codNote}</p>
        </form>
      </div>
    </section>
  );
}

function ProductThumb({ image }) {
  return (
    <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-300">
      {image ? (
        <img src={image} alt="" className="h-full w-full object-cover" />
      ) : (
        <BraIcon width={20} height={20} />
      )}
    </span>
  );
}

const inputClass =
  'w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-magenta-500 focus:ring-1 focus:ring-magenta-500';

function Input({ label, error, ...props }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-zinc-800">{label}</span>
      <input required className={inputClass} {...props} />
      <FieldError error={error} />
    </label>
  );
}

function FieldError({ error }) {
  if (!error) return null;
  return <span className="mt-1 block text-xs font-medium text-magenta-600">{error[0] || error}</span>;
}
