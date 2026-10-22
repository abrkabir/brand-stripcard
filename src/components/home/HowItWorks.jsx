import { HowSteps } from "@/components/home/HowSteps";
import { MorphBadge } from "@/components/home/MorphBadge";
import { FlagMarquee } from "@/components/shared/FlagMarquee";
import { Reveal } from "@/components/shared/Reveal";
import { SwipePill } from "@/components/shared/SwipePill";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { LogoCloud } from "@/components/ui/LogoCloud";
import { howItWorksHeading, howItWorksLogos, howItWorksReach, howItWorksSteps } from "@/data/howItWorks";
import { cn } from "@/lib/cn";

/** Shared entrance: fades up once, the first time the block is in view. */
const rise =
  "translate-y-6 opacity-0 transition-[opacity,translate] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] data-visible:translate-y-0 data-visible:opacity-100";

/**
 * "How it works": the label and a statement title (small morphing badges set
 * between its words) top left; the steps under it as a row of panels, the
 * active one wide with its picture, pointing at a step making it the active
 * one (see `HowSteps`, which lays it all out; cards below `lg`); and where it
 * works under the steps: the flags of the markets it serves drifting past on
 * the left (see `FlagMarquee`), a grid of places to pay with it on the right
 * (see `LogoCloud`), each under a line with a pill.
 *
 * A Server Component; the morphing badges and the steps are client islands.
 */
export function HowItWorks() {
  const { eyebrow, title } = howItWorksHeading;

  return (
    <section aria-labelledby="how-title" className="overflow-x-clip bg-page py-20 lg:py-28">
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
          footer={
            // Where it works, under the steps, as two blocks side by side, of
            // a height: on the left a line and the flags, an arrow riding
            // over them as you scroll; on the right a line and the places to
            // pay. On a phone, one under another.
            <Reveal
              className={cn(
                "grid gap-x-16 gap-y-5 lg:grid-cols-2 [transition-delay:120ms]",
                rise,
              )}
            >
              <p className="text-sm text-muted lg:col-start-1 lg:row-start-1">
                {howItWorksReach.caption.lead}{" "}
                <SwipePill className="border text-headline">{howItWorksReach.caption.pill}</SwipePill>
              </p>
              <div className="mb-6 flex flex-col justify-center lg:col-start-1 lg:row-start-2 lg:mb-0">
                <FlagMarquee countries={howItWorksReach.countries} />
              </div>
              <p className="text-sm text-muted lg:col-start-2 lg:row-start-1">
                {howItWorksLogos.caption.lead}{" "}
                <SwipePill className="border text-headline">{howItWorksLogos.caption.pill}</SwipePill>
              </p>
              {/* From lg it reaches out to the window's right edge, as the flags do to the left. */}
              <LogoCloud
                logos={howItWorksLogos.logos}
                named
                tinted
                className="border-y-0 lg:col-start-2 lg:row-start-2 lg:mr-[calc(-1*var(--to-edge))]"
              />
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
