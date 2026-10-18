import Image from "next/image";
import Link from "next/link";
import { ChevronRightIcon } from "@/components/icons";
import { CurrencyMark } from "@/components/shared/CurrencyMark";
import { cn } from "@/lib/cn";
import cardOrange from "../../../public/images/assets/cards/card-orange.webp";
import cardSilver from "../../../public/images/assets/cards/card-silver.webp";
import business from "../../../public/images/assets/use-cases/use-case-business.webp";
import shopper from "../../../public/images/assets/use-cases/use-case-shopper.webp";
import traveller from "../../../public/images/assets/use-cases/use-case-traveller.webp";
import mark from "../../../public/images/logo/favicon_brand.png";

/** Column counts are looked up, not interpolated — Tailwind needs literals. */
const GRID = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-2",
};

/** A slow, soft ease for the illustrations moving on hover. */
const EASE = "transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]";

/** How each bento tile is painted: its ground, its title and its line. */
const TONES = {
  soft: { tile: "bg-surface", title: "text-headline", text: "text-muted" },
  brand: { tile: "bg-brand-500", title: "text-white", text: "text-white/80" },
  ink: { tile: "bg-hero-ink ring-1 ring-white/10 ring-inset", title: "text-white", text: "text-white/65" },
};

/**
 * Each tile's illustration, by the entry's `art`: decorative, set in the
 * tile's lower right and running off its edges, and easing a little further
 * out when the tile is pointed at.
 */
const ART = {
  // Three use cases, as photos fanned like a hand of cards.
  useCases: () => (
    <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2">
      {[traveller, shopper, business].map((src, i) => (
        <Image
          key={i}
          src={src}
          alt=""
          sizes="120px"
          className={cn(
            "absolute -bottom-6 left-1/2 aspect-[3/4] w-[42%] rounded-2xl object-cover shadow-lift ring-4 ring-card",
            EASE,
            [
              "-translate-x-[92%] -rotate-[10deg] group-hover:-translate-x-[104%] group-hover:-rotate-[14deg]",
              "z-10 -translate-x-1/2 -translate-y-3 group-hover:-translate-y-5",
              "-translate-x-[8%] rotate-[10deg] group-hover:translate-x-[4%] group-hover:rotate-[14deg]",
            ][i],
          )}
        />
      ))}
    </span>
  ),
  // The brand mark on a raised tile, with a softer one behind it.
  about: () => (
    <span aria-hidden="true">
      <span className={cn("absolute right-16 -bottom-4 size-14 -rotate-12 rounded-2xl bg-brand-100 dark:bg-brand-500/20", EASE, "group-hover:-rotate-20")} />
      <span
        className={cn(
          "absolute -right-1 -bottom-3 grid size-24 rotate-12 place-items-center rounded-[1.6rem] bg-card shadow-lift ring-1 ring-line",
          EASE,
          "group-hover:-translate-y-1.5 group-hover:rotate-6",
        )}
      >
        <Image src={mark} alt="" sizes="56px" className="size-14" />
      </span>
    </span>
  ),
  // The three steps, as numbered stops on a dashed line; the last one lights
  // up when the tile is pointed at.
  howItWorks: () => (
    <span aria-hidden="true" className="absolute right-5 bottom-5 flex items-center">
      {[1, 2, 3].map((n) => (
        <span key={n} className="flex items-center">
          {n > 1 && <span className="w-5 border-t-2 border-dashed border-line" />}
          <span
            className={cn(
              "grid size-9 place-items-center rounded-full bg-card font-heading text-sm font-semibold text-headline shadow-soft ring-1 ring-line",
              EASE,
              "transition-[translate,background-color,color] group-hover:-translate-y-1",
              n === 3 && "group-hover:bg-brand-500 group-hover:text-white group-hover:ring-brand-500",
            )}
            style={{ transitionDelay: `${(n - 1) * 70}ms` }}
          >
            {n}
          </span>
        </span>
      ))}
    </span>
  ),
  // Three currencies, stacked and rising.
  flexibility: () => (
    <span aria-hidden="true" className="absolute -right-2 -bottom-3 flex items-end">
      {["GBP", "EUR", "USD"].map((code, i) => (
        <CurrencyMark
          key={code}
          code={code}
          className={cn(
            "-ml-6 size-14 rounded-full shadow-lift ring-4 ring-brand-500 first:ml-0",
            EASE,
            ["translate-y-2 group-hover:translate-y-1", "-translate-y-2 group-hover:-translate-y-4", "-translate-y-6 group-hover:-translate-y-9"][i],
          )}
        />
      ))}
    </span>
  ),
  // Two cards, the orange one in front, tipping up when pointed at.
  control: () => (
    <span aria-hidden="true">
      <Image
        src={cardSilver}
        alt=""
        sizes="160px"
        className={cn("absolute -right-6 bottom-6 h-auto w-36 -rotate-[8deg] opacity-80", EASE, "group-hover:-rotate-[4deg]")}
      />
      <Image
        src={cardOrange}
        alt=""
        sizes="160px"
        className={cn(
          "absolute -right-10 -bottom-7 h-auto w-40 -rotate-[22deg] drop-shadow-[0_12px_18px_rgb(0_0_0/0.5)]",
          EASE,
          "group-hover:-translate-y-2 group-hover:-rotate-[16deg]",
        )}
      />
    </span>
  ),
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
 *
 * A panel whose entries carry `art` is laid out as a bento: the first entry
 * a tall tile on the left, the rest in two columns of two, each tile painted
 * by its `tone` with its illustration in the corner. Any other panel is a
 * plain grid of links.
 */
export function MegaMenu({ id, items, open, onNavigate }) {
  const bento = items.every((item) => item.art);

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
      {bento ? (
        <div className="mx-auto max-w-4xl rounded-4xl border border-line bg-elevated p-2.5 shadow-lift">
          <div className="grid grid-flow-col grid-cols-3 grid-rows-[repeat(2,9.75rem)] gap-2.5">
            {items.map((item, i) => {
              const tone = TONES[item.tone] ?? TONES.soft;
              const Art = ART[item.art];
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  tabIndex={open ? undefined : -1}
                  className={cn(
                    "group relative isolate overflow-hidden rounded-3xl p-5 transition-[filter] duration-300 hover:brightness-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                    tone.tile,
                    i === 0 && "row-span-2",
                  )}
                >
                  <span className={cn("relative z-20 flex items-center gap-1.5 font-heading text-[15px] font-semibold", tone.title)}>
                    {item.label}
                    <ChevronRightIcon className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                  <span className={cn("relative z-20 mt-1.5 block text-sm leading-relaxed", tone.text, i === 0 ? "max-w-[90%]" : "max-w-[62%]")}>
                    {item.description}
                  </span>
                  {Art && <Art />}
                </Link>
              );
            })}
          </div>
        </div>
      ) : (
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
      )}
    </div>
  );
}
