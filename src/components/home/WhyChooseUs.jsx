import { WhyDeck } from "@/components/home/WhyDeck";
import { CurrencyMark, currencyName } from "@/components/shared/CurrencyMark";
import { Reveal } from "@/components/shared/Reveal";
import { SwipePill } from "@/components/shared/SwipePill";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { whyChooseUs, whyChooseUsCurrencies, whyChooseUsHeading } from "@/data/whyChooseUs";
import { cn } from "@/lib/cn";

/** A round coin in a row of them, overlapping the one before. */
const MARK = "relative grid size-12 place-items-center overflow-hidden rounded-full ring-[3px] ring-page";

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
 * Under the cards, set to the right on desktop (it stays in view while the
 * deck slides), a note on the currencies StripCard handles: a row of them as
 * coins with a label, and a line on what that means when you pay. Kept short,
 * so the pinned block still fits the screen under the header.
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
            className="mt-6 max-w-4xl font-heading text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.16] font-medium tracking-[-0.025em] text-headline"
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

        <Reveal className="mt-6 lg:mt-5 lg:ml-auto lg:max-w-2xl">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            <ul aria-label="Currencies you can spend in" className="flex items-center">
              {whyChooseUsCurrencies.currencies.map((code, i) => (
                <li key={code} title={`${currencyName(code)} (${code})`} className={cn(MARK, i > 0 && "-ml-3")}>
                  <CurrencyMark code={code} className="absolute inset-0" />
                  <span className="sr-only">{currencyName(code)}</span>
                </li>
              ))}
              <li className={cn(MARK, "-ml-3 bg-brand text-sm font-semibold text-white")}>
                +{whyChooseUsCurrencies.more}
                <span className="sr-only"> more currencies</span>
              </li>
            </ul>
            <p className="font-heading text-xl leading-tight font-semibold text-headline">{whyChooseUsCurrencies.label}</p>
          </div>
          {/* On a short desktop screen the line gives way, so the pinned block still fits under the header. */}
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-pretty text-content lg:[@media(max-height:820px)]:hidden">
            {whyChooseUsCurrencies.text}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
