import { ScrollRevealTitle } from "@/components/home/ScrollRevealTitle";
import { FeatureTabs } from "@/components/home/FeatureTabs";
import { Reveal } from "@/components/shared/Reveal";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { featuresHeading, featureTabs } from "@/data/features";

/**
 * Homepage features: a heading, then a tab per product area, each opening a
 * panel with a visual and the details (see `FeatureTabs`).
 *
 * A Server Component; the scroll-lit title and the tabs are client islands.
 */
export function Features() {
  const { eyebrow, title } = featuresHeading;

  return (
    <section aria-labelledby="features-title" className="bg-page py-20 lg:py-28">
      <Container>
        <Reveal className="translate-y-6 opacity-0 transition-[opacity,translate] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] data-visible:translate-y-0 data-visible:opacity-100">
          <div className="flex flex-col items-center text-center">
            <Eyebrow>{eyebrow}</Eyebrow>
            <ScrollRevealTitle
              id="features-title"
              parts={title}
              className="mt-6 max-w-6xl font-display text-[clamp(1.375rem,2.7vw,2.25rem)] leading-[1.18] font-medium tracking-[-0.025em] text-balance text-headline"
            />
          </div>

          <FeatureTabs tabs={featureTabs} />
        </Reveal>
      </Container>
    </section>
  );
}
