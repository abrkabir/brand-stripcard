import { cn } from "@/lib/cn";

/** Looked up rather than interpolated, so each class is greppable from here. */
const tones = {
  brand: "badge--brand",
  gold: "badge--gold",
  success: "badge--success",
  danger: "badge--danger",
  neutral: "badge--neutral",
  outline: "badge--outline",
};

/**
 * Small status pill. Tints are mixed from the same token as the text (see
 * `.badge--*` in styles/components.css), so each tone stays legible in either
 * theme without a `dark:` variant.
 *
 * `tone` is one of: brand · gold · success · danger · neutral · outline.
 */
export function Badge({ tone = "brand", className, children }) {
  return <span className={cn("badge", tones[tone], className)}>{children}</span>;
}
