import { twMerge } from "tailwind-merge";

/**
 * Join conditional class names and resolve Tailwind conflicts.
 *
 * The merge step matters more than it looks. Two utilities that set the same
 * property have equal specificity, so the winner is decided by their order in
 * the generated stylesheet — not by their order in the `class` attribute. That
 * makes `<Button className="hidden sm:inline-flex">` silently lose to the
 * component's own `inline-flex`. `twMerge` drops the earlier of any conflicting
 * pair, so the caller's class always wins, which is what everyone expects.
 *
 * Objects and nested arrays are supported so call sites can stay terse:
 *   cn("px-4", isActive && "bg-brand", { "opacity-50": disabled })
 */
function flatten(input) {
  const out = [];

  for (const value of input) {
    if (!value) continue;

    if (typeof value === "string" || typeof value === "number") {
      out.push(String(value));
    } else if (Array.isArray(value)) {
      const nested = flatten(value);
      if (nested) out.push(nested);
    } else {
      for (const [key, active] of Object.entries(value)) {
        if (active) out.push(key);
      }
    }
  }

  return out.join(" ");
}

export function cn(...input) {
  return twMerge(flatten(input));
}
