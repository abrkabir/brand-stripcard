import Link from "next/link";
import { ChevronRightIcon } from "@/components/icons";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";

/** Column counts are looked up, not interpolated — Tailwind needs literals. */
const GRID = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

/**
 * Full-bleed dropdown panel.
 *
 * It spans the whole header rather than hanging off its trigger, so a wide
 * panel can never overflow the viewport and every menu opens to the same
 * frame. Content is inset from the left so it lines up under the nav.
 *
 * Painted from semantic tokens, so it is white-on-light or near-black-on-dark
 * with the theme. Opening a panel always forces the header out of its
 * transparent state, so the two never disagree.
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
        "absolute inset-x-0 top-0 bg-elevated transition-all duration-300 ease-out",
        open
          ? "pointer-events-auto visible translate-y-0 opacity-100"
          : "pointer-events-none invisible -translate-y-2 opacity-0",
      )}
    >
      <Container>
        <div className="py-12 lg:min-h-[19rem] lg:py-14 lg:pl-[22%]">
          <div className={cn("grid gap-x-14 gap-y-10", GRID[items.length] ?? GRID[4])}>
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                tabIndex={open ? undefined : -1}
                className="group max-w-56"
              >
                <span className="flex items-center gap-2 text-[13px] font-semibold tracking-[0.1em] text-headline uppercase">
                  {item.label}
                  <ChevronRightIcon className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>

                <span className="mt-5 block text-[15px] leading-[1.65] text-muted transition-colors duration-300 group-hover:text-content">
                  {item.description}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
