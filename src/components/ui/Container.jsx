import { cn } from "@/lib/cn";

/**
 * The one horizontal rhythm every section shares. Width and gutters live in
 * `.app-container` (styles/base.css) so page width changes in exactly one place.
 */
export function Container({ as: Tag = "div", className, children }) {
  return <Tag className={cn("app-container", className)}>{children}</Tag>;
}
