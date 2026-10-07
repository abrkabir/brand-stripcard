import Link from "next/link";
import { ChevronRightIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

/** Column counts are looked up, not interpolated — Tailwind needs literals. */
const GRID = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-2",
};

/**
 * Dropdown card under the floating header.
 *
 * Centred under the pill rather than hanging off its trigger, so every menu
 * opens to the same frame and a wide panel can never overflow the viewport.
 * The top padding is part of the panel, not a margin: the pointer travelling
 * from trigger to card never leaves a hover target, so the menu stays open.
 *
 * Painted from semantic tokens, so it follows the theme with the pill.
 *
 * Kept mounted when closed so it can animate and so its links stay in the DOM
 * for crawlers; `invisible` plus `pointer-events-none` makes it inert.
 */
export function MegaMenu({ id, items, open, onNavigate }) {
  return (
    <div
      id={id}
      aria-hidden={!open}
      className={cn(
        "absolute inset-x-0 top-0 pt-3 transition-all duration-300 ease-out",
        open
          ? "pointer-events-auto visible translate-y-0 opacity-100"
          : "pointer-events-none invisible -translate-y-2 opacity-0",
      )}
    >
      <div className="mx-auto max-w-3xl rounded-4xl border border-line bg-elevated p-3 shadow-lift">
        <div className={cn("grid gap-1", GRID[items.length] ?? GRID[4])}>
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              tabIndex={open ? undefined : -1}
              className="group rounded-3xl p-5 transition-colors hover:bg-surface focus-visible:bg-surface"
            >
              <span className="flex items-center gap-1.5 font-heading text-[15px] font-semibold text-headline transition-colors group-hover:text-brand">
                {item.label}
                <ChevronRightIcon className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>

              <span className="mt-2 block text-sm leading-relaxed text-muted">
                {item.description}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
