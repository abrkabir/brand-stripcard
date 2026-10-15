import { UseCaseCards } from "@/components/home/UseCaseCards";
import { ShieldIcon } from "@/components/icons";
import { Reveal } from "@/components/shared/Reveal";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cta } from "@/data/cta";

/**
 * The closing call to action: a solid near-black band, rounded on every
 * corner, with a tall card standing on its floor and rising above it.
 *
 *   left    the tall card: the three StripCard cards from the use cases
 *           (see UseCaseCards), bobbing on a dark ground, with a benefit
 *           (a shield before it) and a few tags at the top; inset from the
 *           band's left edge, square at the foot, so the cards rise
 *           straight out of the band
 *   right   inside the band, centred: the title (brand colour with a white
 *           closing phrase, set as one flowing line), the two buttons and a
 *           line of copy under them
 *
 * On small screens it stacks (card, then the band's contents on a piece of
 * the band of their own). A Server Component; only the reveal is
 * client-side.
 */
export function Cta() {
  const { title, card, primary, secondary, note } = cta;

  return (
    <section aria-labelledby="cta-title" className="bg-page py-16 lg:py-24">
      <Container>
        <Reveal className="relative isolate grid gap-6 lg:grid-cols-[minmax(0,0.58fr)_minmax(0,1fr)] lg:grid-rows-[minmax(14rem,auto)_auto] lg:gap-0">
          {/* ── The band ─────────────────────────────────────────────── */}
          <div
            aria-hidden="true"
            className="hidden rounded-4xl bg-hero-ink lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:block lg:rounded-5xl dark:ring-1 dark:ring-white/10"
          />

          {/* ── The tall card, rising out of the band ────────────────── */}
          <div className="relative isolate z-10 order-1 aspect-[3/4] overflow-hidden rounded-3xl bg-hero-ink sm:aspect-[4/5] lg:order-none lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:ml-16 lg:aspect-auto xl:ml-20 lg:rounded-b-none">
            {/* A soft light from the top corner, then the cards. */}
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-[radial-gradient(130%_60%_at_100%_0%,rgb(255_255_255/0.18),transparent_65%)]"
            />
            <UseCaseCards className="-z-10" />

            {/* The label and the tags, over the dark top of the card. */}
            <div className="absolute inset-x-0 top-0 p-5 sm:p-6">
              <p className="flex items-center gap-2.5">
                <ShieldIcon aria-hidden="true" className="size-6 shrink-0 text-brand" />
                <span className="font-heading text-lg font-semibold tracking-[-0.01em] text-white">
                  {card.label}
                </span>
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {card.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full bg-white/[0.07] px-3 py-1.5 text-xs font-medium text-white/80 ring-1 ring-white/15 backdrop-blur-sm"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── The title, the buttons and a line, inside the band ──── */}
          <div className="on-dark relative z-10 order-2 flex flex-col items-center justify-center rounded-3xl bg-hero-ink p-6 text-center sm:p-8 lg:order-none lg:col-start-2 lg:row-start-2 lg:min-h-72 lg:rounded-none lg:bg-transparent lg:px-10 lg:py-12">
            {/* One flowing line, wrapping evenly where it must. */}
            <h2
              id="cta-title"
              className="font-heading text-[clamp(1.5rem,2.4vw,2.125rem)] leading-[1.15] font-semibold tracking-[-0.015em] text-balance"
            >
              {title.map((line, i) => (
                <span key={i}>
                  {i > 0 && " "}
                  {line.map((piece) => (
                    <span key={piece.text} className={piece.accent ? "text-brand" : "text-white"}>
                      {piece.text}
                    </span>
                  ))}
                </span>
              ))}
            </h2>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button href={primary.href} size="sm">
                {primary.label}
              </Button>
              <Button href={secondary.href} size="sm" variant="outline">
                {secondary.label}
              </Button>
            </div>
            <p className="mt-6 max-w-md text-[0.9375rem] leading-relaxed text-pretty text-white/60">{note}</p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
