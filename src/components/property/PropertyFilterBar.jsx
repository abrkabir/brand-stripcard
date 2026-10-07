import Link from "next/link";
import { getIcon } from "@/components/icons";
import { propertyChips } from "@/data/propertyFilters";
import { cn } from "@/lib/cn";
import { isChipActive } from "@/lib/properties";

/**
 * The quick filters. Rendered inside the hero, over the photograph, so it comes
 * with no section or container of its own — the hero places it.
 *
 * Painted in whites rather than the surface tokens: the ground under it is a
 * photograph in both themes, which is what `on-dark` on the hero declares.
 *
 * The chips are links, not buttons. A filter is a location — it belongs in the
 * URL so it can be shared, bookmarked and reached by the back button — and a
 * link gets all of that from the browser with no state to keep. No JavaScript
 * on this bar at all.
 *
 * Each chip carries the params it sets and *keeps* the ones it does not own, so
 * a location typed into the search bar survives switching between "For sale"
 * and "To rent" instead of being silently dropped.
 */
export function PropertyFilterBar({ query }) {
  return (
    <ul
      // `w-fit` with `mx-auto` centres the row while it fits and lets it fall
      // back to scrolling when it does not. `justify-center` would have been
      // the obvious way, but on an overflowing scroll container it pushes the
      // first chips past the left edge where they cannot be reached.
      className="no-scrollbar mx-auto flex w-fit max-w-full gap-1 overflow-x-auto px-1"
    >
      {propertyChips.map((chip) => {
        const Icon = getIcon(chip.icon);
        const active = isChipActive(chip, query);

        return (
          <li key={chip.label}>
            <Link
              href={chipHref(chip, query)}
              aria-current={active ? "true" : undefined}
              className={cn(
                "flex w-20 shrink-0 flex-col items-center gap-2 rounded-xl px-2 py-3 text-center text-[11px] leading-tight transition-colors sm:w-24",
                active
                  ? "bg-white/15 text-white backdrop-blur-sm"
                  : "text-white/70 hover:bg-white/10 hover:text-white",
              )}
            >
              {Icon && <Icon className="size-5 shrink-0" />}
              {chip.label}

              {/* The active chip is underlined as well as filled: colour alone
                  is not something everyone can see. */}
              <span
                aria-hidden="true"
                className={cn(
                  "h-px w-6 transition-colors",
                  active ? "bg-white" : "bg-transparent",
                )}
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * A chip's destination: its own params, merged over everything the query
 * already carries that no chip owns.
 */
function chipHref(chip, query) {
  const params = new URLSearchParams();

  // Kept across chips — these come from the search bar, or straight from a URL.
  for (const key of ["location", "budget", "beds", "sort"]) {
    if (query[key]) params.set(key, query[key]);
  }

  for (const [key, value] of Object.entries(chip.params)) {
    params.set(key, value);
  }

  const search = params.toString();
  return `/properties${search ? `?${search}` : ""}`;
}
