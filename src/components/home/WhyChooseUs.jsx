import { WhyDeck } from "@/components/home/WhyDeck";
import { Reveal } from "@/components/shared/Reveal";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { whyChooseUs, whyChooseUsHeading } from "@/data/whyChooseUs";

/**
 * "Why choose us": a brand label and a title with a highlighted word and a
 * phrase framed in a swipe pill, then the cards — a pinned, scroll-driven
 * deck beside a list of their titles on desktop (see `WhyDeck`), a plain
 * grid elsewhere.
 *
 * Each card (see `WhyCard`) is a settings-style panel over the surface
 * colour with an animated illustration, and a "View details" toggle that
 * swaps the illustration for the description.
 *
 * A Server Component; the deck is the client island.
 */
export function WhyChooseUs() {
  const { eyebrow, title } = whyChooseUsHeading;

  return (
    <section aria-labelledby="why-title" className="bg-page py-20 lg:py-28">
      <Container>
        {/* The label, then the title: one word picked out in the brand
            colour, one phrase framed in a swipe pill. */}
        <Reveal>
          <Eyebrow tone="brand">{eyebrow}</Eyebrow>

          <h2
            id="why-title"
            className="mt-6 max-w-4xl font-display text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.16] font-medium tracking-[-0.025em] text-headline"
          >
            {title.map((line, i) => (
              <span key={i} className="block">
                {line.map((piece, j) =>
                  typeof piece === "string" ? (
                    piece
                  ) : piece.highlight ? (
                    <span key={j} className="text-brand">
                      {piece.highlight}
                    </span>
                  ) : (
                    <SwipePill key={j}>{piece.pill}</SwipePill>
                  ),
                )}
              </span>
            ))}
          </h2>
        </Reveal>

        <WhyDeck items={whyChooseUs} />
      </Container>
    </section>
  );
}

/**
 * A phrase framed like a swipe control: an outlined brand pill holding a
 * solid capsule that keeps stretching from a round knob into a long pill and
 * back. Everything is sized in `em`, so it scales with the title around it.
 * The capsule starts moving once the surrounding `Reveal` sets
 * `data-visible`; with reduced motion it stays a still knob.
 */
function SwipePill({ children }) {
  return (
    <span className="inline-flex items-center gap-[0.28em] rounded-full border-2 border-brand py-[0.08em] pr-[0.42em] pl-[0.1em] align-middle leading-none whitespace-nowrap">
      <span
        aria-hidden="true"
        className="h-[0.82em] w-[0.82em] shrink-0 rounded-full bg-brand in-data-visible:animate-pill-swipe"
      />
      {children}
    </span>
  );
}
