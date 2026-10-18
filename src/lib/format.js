const formats = new Map();

/** One number format per currency and rounding, made once and kept. */
function money(currency, whole) {
  const key = `${currency}:${whole}`;
  if (!formats.has(key)) {
    formats.set(
      key,
      new Intl.NumberFormat("en-US", { style: "currency", currency, ...(whole ? { maximumFractionDigits: 0 } : {}) }),
    );
  }
  return formats.get(key);
}

/**
 * `$1,234.56`, or `$1,235` with `{ whole: true }`; another currency with
 * `{ currency: "EUR" }` (`€1,234.56`). Negative values keep the sign.
 */
export function formatMoney(value, { whole = false, currency = "USD" } = {}) {
  return money(currency, whole).format(value);
}

/** A share as a signed percentage: 0.048 → "+4.8%". */
export function formatChange(share, digits = 1) {
  const sign = share > 0 ? "+" : share < 0 ? "−" : "";
  return `${sign}${Math.abs(share * 100).toFixed(digits)}%`;
}
