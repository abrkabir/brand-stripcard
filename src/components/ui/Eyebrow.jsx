import { cn } from "@/lib/cn";

/**
 * The small outlined pill that sits above a section heading. Every section
 * uses this one, so they all read the same; `.eyebrow` in
 * styles/components.css owns the look, including the white variant inside an
 * `on-dark` area.
 *
 * Renders a `<p>` by default. Pass `as="span"` to put it inside a heading —
 * when the pill *is* the section's label, it can be the heading itself.
 */
export function Eyebrow({ as: Tag = "p", className, children }) {
  return <Tag className={cn("eyebrow", className)}>{children}</Tag>;
}
