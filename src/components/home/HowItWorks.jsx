import { HowSteps } from "@/components/home/HowSteps";
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
 * "How it works": the label and a statement title (small morphing badges set
 * between its words) top left; where it works top right, set lower (the
 * flags of the markets it serves with a line under them, and a grid of places to pay
 * with it, see `LogoCloud`); and the steps under them as a row of panels,
 * the active one wide with its picture, pointing at a step making it the
 * active one (see `HowSteps`, which lays it all out; cards below `lg`).
 *
 * A Server Component; the morphing badges and the steps are client islands.
 */
export function HowItWorks() {
  const { eyebrow, title } = howItWorksHeading;

  return (
    <section aria-labelledby="how-title" className="bg-page py-20 lg:py-28">
      <Container>
        <HowSteps
          steps={howItWorksSteps}
          heading={
            <Reveal className={rise}>
              <Eyebrow>{eyebrow}</Eyebrow>
              <h2
                id="how-title"
                className="mt-5 max-w-2xl font-heading text-[clamp(1.5rem,2.8vw,2.25rem)] leading-[1.2] font-semibold tracking-[-0.035em] text-pretty text-headline"
              >
                {title.map((piece, i) => (
                  <TitlePiece key={i} piece={piece} />
                ))}
              </h2>
            </Reveal>
          }
          aside={
            // Where it works: the banner's flags plus a count of the rest
            // beside a line, then the places to pay.
            <Reveal className={cn("[transition-delay:120ms]", rise)}>
              <TrustBadge tone="onLight" countries={banner.trust.countries} more={32} />
              <p className="mt-3 text-sm text-muted">
                {howItWorksLogos.caption.lead}{" "}
                <SwipePill className="border text-headline">{howItWorksLogos.caption.pill}</SwipePill>
              </p>
              <LogoCloud logos={howItWorksLogos.logos} className="mt-5" />
            </Reveal>
          }
        />
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
