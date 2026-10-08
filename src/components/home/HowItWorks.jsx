import { HowCard } from "@/components/home/HowCard";
import { MorphBadge } from "@/components/home/MorphBadge";
import { Reveal } from "@/components/shared/Reveal";
import { SwipePill } from "@/components/shared/SwipePill";
import { TrustBadge } from "@/components/shared/TrustBadge";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { LogoCloud } from "@/components/ui/LogoCloud";
import { howItWorksHeading, howItWorksLogos, howItWorksSteps } from "@/data/howItWorks";
import { banner } from "@/data/banner";
import { cn } from "@/lib/cn";

/** Shared entrance: fades up once, the first time the block is in view. */
const rise =
  "translate-y-6 opacity-0 transition-[opacity,translate] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] data-visible:translate-y-0 data-visible:opacity-100";

/**
 * "How it works" in two columns. Left: the label, a statement title with
 * small morphing badges set between its words, and a grid of places to pay
 * with it (see `LogoCloud`) — a screen-tall panel that holds still (sticky)
 * while the steps scroll past, so the logos stay in view. Right: the steps, stacked
 * (see `HowCard`). On smaller screens it all stacks, heading first.
 *
 * A Server Component; the morphing badges are the client islands.
 */
export function HowItWorks() {
  const { eyebrow, title } = howItWorksHeading;

  return (
    <section aria-labelledby="how-title" className="bg-page py-20 lg:py-28">
      <Container className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-start lg:gap-12">
        {/* A screen-tall panel that holds still while the steps scroll past:
            heading at its top, logos on its bottom edge — so both stay in
            view. Capped, so on a very tall screen it never outgrows the
            steps beside it. */}
        <Reveal
          className={cn(
            "flex flex-col lg:sticky lg:top-[calc(var(--header-h-lg)+1.5rem)] lg:h-[min(calc(100svh-var(--header-h-lg)-3.5rem),44rem)]",
            rise,
          )}
        >
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2
            id="how-title"
            className="mt-5 font-display text-[clamp(1.5rem,2.8vw,2.25rem)] leading-[1.2] font-semibold tracking-[-0.035em] text-pretty text-headline"
          >
            {title.map((piece, i) => (
              <TitlePiece key={i} piece={piece} />
            ))}
          </h2>

          {/* The banner's flags, plus a count of the rest. */}
          <TrustBadge
            tone="onLight"
            countries={banner.trust.countries}
            more={32}
            className="mt-8 lg:mt-auto lg:pt-10"
          />

          <div className="mt-8">
            <p className="mb-4 text-sm text-muted">
              {howItWorksLogos.caption.lead}{" "}
              <SwipePill className="border text-headline">{howItWorksLogos.caption.pill}</SwipePill>
            </p>
            <LogoCloud logos={howItWorksLogos.logos} />
          </div>
        </Reveal>

        <Reveal as="ul" className={cn("grid gap-5 [transition-delay:150ms] lg:gap-6", rise)}>
          {howItWorksSteps.map((step, i) => (
            <li key={step.title}>
              <HowCard step={step} index={i} />
            </li>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}

/** Marks for the title's badges, in MorphBadge's 100 × 100 box. */
const TITLE_GLYPHS = {
  shield: (
    <>
      <path
        d="M50 27c8 5 15 7 21 7v14c0 14-9 23-21 28-12-5-21-14-21-28V34c6 0 13-2 21-7Z"
        fill="none"
        strokeWidth="6"
        strokeLinejoin="round"
      />
      <path d="m41 51 7 7 12-13" fill="none" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  sparkles: (
    <>
      <path d="M45 27c2 11 6 15 17 17-11 2-15 6-17 17-2-11-6-15-17-17 11-2 15-6 17-17Z" stroke="none" />
      <path d="M66 55c1 6 3 8 9 9-6 1-8 3-9 9-1-6-3-8-9-9 6-1 8-3 9-9Z" stroke="none" />
    </>
  ),
};

/** A piece of the title: text, dimmed text, or a morphing icon badge. */
function TitlePiece({ piece }) {
  if (typeof piece === "string") return piece;

  if (piece.icon) {
    return (
      <MorphBadge
        className="mx-[0.06em] inline-block size-[1.05em] -translate-y-[0.06em] align-middle"
        shapeClassName={piece.muted ? "fill-brand-100" : "fill-brand"}
        variant={piece.icon === "sparkles" ? "burst" : "hex"}
        delay={piece.muted ? 0.6 : 0}
      >
        <g className={piece.muted ? "fill-brand-600 stroke-brand-600" : "fill-white stroke-white"}>
          {TITLE_GLYPHS[piece.icon]}
        </g>
      </MorphBadge>
    );
  }

  return <span className="text-subtle">{piece.muted}</span>;
}
