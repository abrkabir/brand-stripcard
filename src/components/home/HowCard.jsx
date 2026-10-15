import Link from "next/link";
import { MorphBadge } from "@/components/home/MorphBadge";
import { ArrowRightIcon } from "@/components/icons";

/** The mark inside the badge, one per step, drawn in white strokes. */
const GLYPHS = {
  user: (
    <>
      <circle cx="50" cy="42" r="9" />
      <path d="M34 66c3-9 9-13 16-13s13 4 16 13" />
    </>
  ),
  card: (
    <>
      <rect x="32" y="37" width="36" height="26" rx="5" />
      <path d="M32 46h36M38 56h8" />
    </>
  ),
  globe: (
    <>
      <circle cx="50" cy="50" r="17" />
      <path d="M33 50h34M50 33c5 5 7 11 7 17s-2 12-7 17c-5-5-7-11-7-17s2-12 7-17Z" />
    </>
  ),
};

/**
 * One "how it works" step: a softly tinted card (the headline ink at 5%, so
 * it stays a gentle grey in either theme) holding a brand-coloured tile on
 * the left and the step on the right.
 *
 * The tile reads like a product card — a morphing badge and a label top left
 * (see MorphBadge), a switch top right that flips on when the row scrolls
 * into view, and one big word cropped by the tile's bottom edge. The word is
 * sized in container units, so it fills the tile at any width.
 *
 * On a phone the tile sits above the copy. Colours come from the brand
 * tokens, so a rebrand recolours the card.
 */
export function HowCard({ step, index }) {

  return (
    <article className="relative isolate flex h-full flex-col gap-5 overflow-hidden rounded-[1.75rem] border border-line bg-headline/[0.05] p-3 text-content sm:flex-row sm:gap-6">
      {/* The tile's glow, spilling onto the card. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_22%_55%,color-mix(in_srgb,var(--color-brand)_10%,transparent),transparent_60%)]"
      />

      <div className="@container relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-[1.25rem] bg-linear-to-br from-brand-100 to-brand-200 p-4 sm:aspect-square sm:w-[42%]">
        <div className="relative z-10 flex items-center justify-between gap-2">
          <span className="flex items-center gap-2 text-sm font-medium text-brand-800">
            <MorphBadge className="size-8 shrink-0" shapeClassName="fill-brand" delay={index * 0.35}>
              <g
                fill="none"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="stroke-white"
              >
                {GLYPHS[step.glyph]}
              </g>
            </MorphBadge>
            {step.label}
          </span>

          {/* A switch that turns on once the row is in view. */}
          <span aria-hidden="true" className="relative h-5 w-9 shrink-0 rounded-full bg-brand/25">
            <span
              className="absolute top-0.5 left-0.5 size-4 rounded-full bg-brand shadow-soft transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] in-data-visible:translate-x-4"
              style={{ transitionDelay: `${600 + index * 150}ms` }}
            />
          </span>
        </div>

        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-[0.2em] left-[0.05em] font-heading text-[42cqw] leading-none font-bold tracking-[-0.05em] text-brand-300/70 select-none"
        >
          {step.word}
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-center px-3 pb-4 sm:px-0 sm:py-4 sm:pr-5">
        <h3 className="font-heading text-[clamp(1.375rem,2.2vw,1.875rem)] leading-[1.15] font-normal tracking-[-0.02em] text-headline">
          {step.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-content">{step.description}</p>

        <Link
          href={step.cta.href}
          className="mt-5 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-brand transition-colors hover:text-brand-700"
        >
          {step.cta.label}
          <ArrowRightIcon aria-hidden="true" className="size-4 -rotate-45" />
        </Link>
      </div>
    </article>
  );
}
