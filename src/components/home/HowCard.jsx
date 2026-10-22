import Image from "next/image";
import Link from "next/link";
import { MorphBadge } from "@/components/home/MorphBadge";
import { ArrowRightIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

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
 * A step's label, on a small white pill laid over its picture: a morphing
 * badge (see MorphBadge) with the step's mark, and a word.
 */
export function StepLabel({ step, index, className }) {
  return (
    <span
      className={cn(
        "flex items-center gap-2 rounded-full bg-white/90 py-1 pr-3.5 pl-1 text-sm font-medium text-brand-800 shadow-soft",
        className,
      )}
    >
      <MorphBadge className="size-7 shrink-0" shapeClassName="fill-brand" delay={index * 0.35}>
        <g fill="none" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" className="stroke-white">
          {GLYPHS[step.glyph]}
        </g>
      </MorphBadge>
      {step.label}
    </span>
  );
}

/**
 * One "how it works" step as a card, for screens below `lg` (wider ones get
 * the scrolling panel, see HowSteps): a softly tinted card (the headline ink
 * at 5%, so it stays a gentle grey in either theme) holding the step's
 * picture, with its label over it, and the step itself.
 *
 * The picture fills its tile (`step.image`, cropped round `step.focus`) and
 * eases in a touch when the card is pointed at. It sits above the copy on a
 * phone and beside it on a tablet.
 */
export function HowCard({ step, index }) {

  return (
    <article className="group relative isolate flex h-full flex-col gap-5 overflow-hidden rounded-[1.75rem] border border-line bg-headline/[0.05] p-3 text-content sm:flex-row sm:gap-6">
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-[1.25rem] bg-brand-100 sm:aspect-square sm:w-[42%]">
        <Image
          src={step.image}
          alt=""
          fill
          sizes="(min-width: 640px) 40vw, 92vw"
          style={{ objectPosition: step.focus }}
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] motion-reduce:transition-none"
        />
        <StepLabel step={step} index={index} className="absolute top-3 left-3" />
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
