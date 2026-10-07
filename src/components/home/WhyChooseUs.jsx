import { WhyCard } from "@/components/home/WhyCard";
import { Reveal } from "@/components/shared/Reveal";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { whyChooseUs, whyChooseUsHeading } from "@/data/whyChooseUs";

/**
 * "Why choose us": a centred heading, then a grid of cards.
 *
 * Each card (see `WhyCard`) is a settings-style panel over a breathing brand
 * glow with an illustration, and a "View details" toggle that swaps the
 * illustration for the description.
 *
 * The cards rise in row by row the first time the grid scrolls into view,
 * keyed off the `data-visible` that `Reveal` sets. A Server Component.
 */
export function WhyChooseUs() {
  const { eyebrow, title, description } = whyChooseUsHeading;

  return (
    <section aria-labelledby="why-title" className="bg-page py-20 lg:py-28">
      <Container>
        <Reveal className="mx-auto flex max-w-4xl translate-y-6 flex-col items-center text-center opacity-0 transition-[opacity,translate] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] data-visible:translate-y-0 data-visible:opacity-100">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2
            id="why-title"
            className="mt-5 font-display text-[clamp(1.75rem,3.2vw,2.5rem)] leading-[1.12] font-medium tracking-[-0.03em] text-balance text-headline"
          >
            {title}
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            {description}
          </p>
        </Reveal>

        <Reveal
          as="ul"
          className="mt-12 grid gap-5 md:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-6"
        >
          {whyChooseUs.map((item, i) => (
            <WhyCard key={item.title} item={item} index={i} />
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
