// Small inline icon set — keeps the bundle self-contained (no icon library).
const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export function TruckIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 7h11v10H3zM14 10h4l3 3v4h-7" />
      <circle cx="7.5" cy="17.5" r="1.6" />
      <circle cx="17.5" cy="17.5" r="1.6" />
    </svg>
  );
}

export function CartIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
      <path d="M2 3h3l2.4 12.4a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.6L23 7H6" />
    </svg>
  );
}

export function PhoneIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M22 16.9v2.6a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h2.6a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L9.1 11a16 16 0 0 0 6 6l1.5-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2Z" />
    </svg>
  );
}

export function WhatsAppIcon(props) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 1 1 12 20Zm4.4-6c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.8 1-.3.2-.5.1a6.5 6.5 0 0 1-1.9-1.2 7.2 7.2 0 0 1-1.3-1.7c-.1-.2 0-.4.1-.5l.4-.4.3-.5a.5.5 0 0 0 0-.5l-.8-1.9c-.2-.5-.4-.4-.5-.5H8c-.2 0-.4.1-.6.3a2.7 2.7 0 0 0-.9 2 4.7 4.7 0 0 0 1 2.5 10.7 10.7 0 0 0 4.1 3.6c2.4 1 2.4.7 2.9.6a2.4 2.4 0 0 0 1.6-1.1 2 2 0 0 0 .1-1.1c0-.1-.2-.2-.4-.3Z" />
    </svg>
  );
}

export function FacebookIcon(props) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V8c0-.9.25-1.5 1.55-1.5H16.7V3.7C16.4 3.66 15.4 3.6 14.2 3.6c-2.4 0-4 1.46-4 4.15V9.9H7.5V13h2.7v8h3.3Z" />
    </svg>
  );
}

export function InstagramIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TiktokIcon(props) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M16.5 2h-3v13.6a2.9 2.9 0 1 1-2.1-2.8v-3.1a6 6 0 1 0 5.1 5.94V9.3a6.9 6.9 0 0 0 4 1.27V7.6a3.9 3.9 0 0 1-4-3.9V2Z" />
    </svg>
  );
}

export function StarIcon({ filled = true, ...props }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.5"
      {...props}
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export function CheckIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function BraIcon(props) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 8c1.5-1.2 4-2 6-2s3.4 1 4 2c.6-1 2-2 4-2s4.5.8 6 2" />
      <path d="M2 8c0 4 1.5 6 5 6 2.6 0 4-1.8 5-3 1 1.2 2.4 3 5 3 3.5 0 5-2 5-6" />
      <path d="M12 9v2" />
    </svg>
  );
}

export function CloudIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M7 17a4 4 0 0 1-.5-7.97A5 5 0 0 1 16 8a4.5 4.5 0 0 1 1 8.9" />
      <path d="M7 17h9.5" />
    </svg>
  );
}

export function GiftIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="9" width="18" height="4" rx="1" />
      <path d="M5 13v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7" />
      <path d="M12 9v12" />
      <path d="M12 9c-1.5-3-3.5-5-5.2-5A2.3 2.3 0 0 0 4.5 6.3C4.5 8 6 9 12 9Z" />
      <path d="M12 9c1.5-3 3.5-5 5.2-5A2.3 2.3 0 0 1 19.5 6.3C19.5 8 18 9 12 9Z" />
    </svg>
  );
}

export function TagIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M20.6 12.6 12 21.2 2.8 12 2.8 3l9.2 0 8.6 9.6Z" />
      <circle cx="7.5" cy="7.5" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function SunIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2.5v2.5M12 19v2.5M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M2.5 12h2.5M19 12h2.5M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8" />
    </svg>
  );
}

export function CashIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="2.5" y="6.5" width="19" height="11" rx="1.5" />
      <circle cx="12" cy="12" r="2.6" />
      <path d="M5.5 6.5v11M18.5 6.5v11" />
    </svg>
  );
}

export function LockIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
      <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
    </svg>
  );
}

export function RefreshIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M20 8a8 8 0 0 0-14.3-3.5M4 4v4.5h4.5" />
      <path d="M4 16a8 8 0 0 0 14.3 3.5M20 20v-4.5h-4.5" />
    </svg>
  );
}

export function SparkleIcon(props) {
  return (
    <svg {...base} fill="currentColor" stroke="none" {...props}>
      <path d="M12 2.5c.6 3.6 2 5.9 5.5 6.5-3.5.6-4.9 2.9-5.5 6.5-.6-3.6-2-5.9-5.5-6.5 3.5-.6 4.9-2.9 5.5-6.5Z" />
      <path d="M19 15c.3 1.7.9 2.7 2.5 3-1.6.3-2.2 1.3-2.5 3-.3-1.7-.9-2.7-2.5-3 1.6-.3 2.2-1.3 2.5-3Z" />
    </svg>
  );
}

export function ArrowRightIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

const ICON_MAP = {
  fit: BraIcon,
  soft: CloudIcon,
  combo: GiftIcon,
  price: TagIcon,
  daily: SunIcon,
  cash: CashIcon,
  delivery: TruckIcon,
  privacy: LockIcon,
  exchange: RefreshIcon,
  check: CheckIcon,
};

export function Icon({ name, ...props }) {
  const Cmp = ICON_MAP[name] ?? SparkleIcon;
  return <Cmp {...props} />;
}
