import { cn } from "@/lib/cn";

/** Looked up rather than interpolated, so each class is greppable from here. */
const tones = {
  outline: "",
  brand: "eyebrow--brand",
};

/**
 * The small outlined pill that sits above a section heading. Every section
 * uses this one, so they all read the same; `.eyebrow` in
 * styles/components.css owns the look, including the white variant inside an
 * `on-dark` area.
 *
 * At its left sits the eyebrow's sign (`.eyebrow-sign`): four coloured dots
 * with two bars stretching and folding through them. Decorative, so screen
 * readers skip it. Pass `sign={false}` for an eyebrow without it.
 *
 * Renders a `<p>` by default. Pass `as="span"` to put it inside a heading —
 * when the pill *is* the section's label, it can be the heading itself.
 *
 * `tone` is `outline` (the default) or `brand`, filled in the brand colour.
 */
export function Eyebrow({
  as: Tag = "p",
  tone = "outline",
  sign = true,
  className,
  children,
}) {
  return (
    <Tag className={cn("eyebrow", tones[tone], className)}>
      {sign && <span aria-hidden="true" className="eyebrow-sign" />}
      {children}
    </Tag>
  );
}
