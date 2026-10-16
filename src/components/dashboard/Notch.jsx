import { cn } from "@/lib/cn";

/**
 * Where a notch meets the card's edges the card's corners are rounded: a
 * small square of canvas with a quarter circle taken out of it, the curve
 * facing down from a top notch and up from a foot one.
 */
const FILLET = "pointer-events-none absolute size-5";
const CURVE_DOWN = "bg-[radial-gradient(circle_at_0_100%,transparent_1.25rem,var(--color-canvas)_calc(1.25rem_+_0.5px))]";
const CURVE_UP = "bg-[radial-gradient(circle_at_0_0,transparent_1.25rem,var(--color-canvas)_calc(1.25rem_+_0.5px))]";

/**
 * A notch cut from a card's top-right (`corner="top"`) or bottom-right
 * (`corner="foot"`) corner, holding a button. The notch is the canvas showing
 * through: a block of it over the card's corner, rounded on its inner corner
 * (2rem, to sit round a 3rem circle with a 0.5rem gap; pass a `rounded-*`
 * class for other buttons), and the card's own edges rounded where they meet
 * it. The card must be positioned and sit straight on the canvas.
 */
export function Notch({ corner = "top", className, children }) {
  const top = corner === "top";
  const curve = top ? CURVE_DOWN : CURVE_UP;

  return (
    <div
      className={cn(
        "absolute right-0 bg-canvas",
        top ? "top-0 rounded-bl-[2rem] pb-2 pl-2" : "bottom-0 rounded-tl-[2rem] pt-2 pl-2",
        className,
      )}
    >
      <span aria-hidden="true" className={cn(FILLET, curve, top ? "top-0 -left-5" : "bottom-0 -left-5")} />
      <span aria-hidden="true" className={cn(FILLET, curve, top ? "right-0 -bottom-5" : "right-0 -top-5")} />
      {children}
    </div>
  );
}
