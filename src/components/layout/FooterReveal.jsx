import { FooterRevealStage } from "@/components/layout/FooterRevealStage";
import { Odometer } from "@/components/ui/Odometer";
import { footerImpact } from "@/data/footer";
import { cn } from "@/lib/cn";

/**
 * "Our impact", under the footer: the footer lifts away to uncover it at the
 * very end of every page.
 *
 * The layout sets the footer and this panel in one wrapper. This panel is
 * `sticky` to the bottom of the viewport and sits beneath the footer (which is
 * raised and painted all round), so it stays pinned in place as the footer
 * scrolls up off it, and comes to rest at the foot of the page.
 *
 * Plain black in both themes, the same as the dark ground behind the
 * footer, so the two meet without a seam. The figures sit in dotted rings
 * that overlap in a row (a loose cluster on narrow screens).
 * Once the footer has lifted far enough to show them (see FooterRevealStage),
 * the heading brightens from muted to white, each ring warms from a faint grey
 * to the brand colour, one a beat after the other from the left, and the
 * numbers roll up on odometers. With reduced motion they simply appear lit.
 */
export function FooterReveal() {
  const { title, items } = footerImpact;

  return (
    <FooterRevealStage
      aria-labelledby="impact-title"
      className="sticky bottom-0 z-0 overflow-hidden bg-black px-4 py-16 text-white sm:py-20 lg:py-24"
    >
      <h2 id="impact-title" className="text-center font-heading text-[clamp(1.5rem,2.6vw,2.125rem)] leading-tight font-semibold tracking-[-0.01em] text-balance text-white/45 transition-colors duration-700 in-data-visible:text-white">
        {title}
      </h2>

      <ul className="mx-auto mt-10 flex max-w-6xl flex-wrap justify-center lg:mt-16 lg:flex-nowrap">
        {items.map((item, i) => (
          <li
            key={item.label}
            className="relative -m-1.5 grid size-36 shrink-0 place-items-center p-4 text-center sm:-m-2 sm:size-44 lg:-mx-3.5 lg:my-0 lg:size-[13.5rem]"
          >
            {/* The dotted ring: muted, then the brand colour once revealed,
                each ring a beat after the one before. */}
            <svg
              aria-hidden="true"
              viewBox="0 0 100 100"
              className="absolute inset-0 size-full text-white/25 transition-colors duration-700 ease-out in-data-visible:text-brand"
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <circle cx="50" cy="50" r="49.3" fill="none" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" strokeDasharray="0 2.4" />
            </svg>

            <p className="relative leading-tight">
              {item.value && (
                <span className="block font-heading text-[1.375rem] font-semibold text-brand tabular-nums sm:text-[1.625rem] lg:text-[1.875rem]">
                  <Odometer value={item.value} />
                </span>
              )}
              <span
                className={cn(
                  "mx-auto block max-w-[8rem] text-balance",
                  item.value ? "mt-1 text-[13px] text-white/75 sm:text-[15px]" : "font-heading text-[1.125rem] font-medium text-white sm:text-[1.375rem]",
                )}
              >
                {item.label}
              </span>
            </p>
          </li>
        ))}
      </ul>
    </FooterRevealStage>
  );
}
