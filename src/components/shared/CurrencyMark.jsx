import { cn } from "@/lib/cn";

/**
 * Currencies as flat round badges, by ISO code: each on its own solid colour
 * with its sign in bold white. The signs are drawn (stroked, in a 24-unit box
 * like the icon set) rather than typed, so they look the same whatever fonts
 * a visitor has.
 */
const COINS = {
  USD: { name: "US dollar", color: "#f25c7d", sign: "M12 2.5v19M16.5 6.5H10a3.25 3.25 0 0 0 0 6.5h4a3.25 3.25 0 0 1 0 6.5H7" },
  EUR: { name: "Euro", color: "#0d2b8e", sign: "M16.7 5.8A7.5 7.5 0 1 0 16.7 18.2M4 10.2h9.5M4 13.8h9.5" },
  GBP: { name: "British pound", color: "#8d5ac8", sign: "M16.4 7.6a3.6 3.6 0 0 0-6.9 1.4V15c0 2-.9 3.5-2.4 4.5h10.4M6.5 12.5H14" },
  JPY: { name: "Japanese yen", color: "#eb0d55", sign: "M6 3.5l6 8 6-8M12 11.5V21M7.5 13.5h9M7.5 17h9" },
  INR: { name: "Indian rupee", color: "#12a37f", sign: "M6 4h12M6 8.5h12M9.5 4c3.2 0 5.2 1.8 5.2 4.5S12.7 13 9.5 13H7l8.5 7.5" },
  KRW: { name: "South Korean won", color: "#1d9bf0", sign: "M3.5 5l3.5 14 5-12 5 12 3.5-14M2.5 10.5h19M2.5 14h19" },
};

/** A currency's name, for its label. */
export const currencyName = (code) => COINS[code]?.name ?? code;

/** A currency's coin, filling its box; nothing for an unknown code. Decorative: name it beside. */
export function CurrencyMark({ code, className }) {
  const coin = COINS[code];
  if (!coin) return null;
  return (
    <span aria-hidden="true" className={cn("block [&>svg]:size-full", className)}>
      <svg viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="24" fill={coin.color} />
        <g
          transform="translate(12 12)"
          fill="none"
          stroke="#fff"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={coin.sign} />
        </g>
      </svg>
    </span>
  );
}
