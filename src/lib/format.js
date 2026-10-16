const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const usdWhole = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

/** `$1,234.56`, or `$1,235` with `{ whole: true }`. Negative values keep the sign. */
export function formatMoney(value, { whole = false } = {}) {
  return (whole ? usdWhole : usd).format(value);
}

/** A share as a signed percentage: 0.048 → "+4.8%". */
export function formatChange(share, digits = 1) {
  const sign = share > 0 ? "+" : share < 0 ? "−" : "";
  return `${sign}${Math.abs(share * 100).toFixed(digits)}%`;
}
