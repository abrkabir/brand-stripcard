import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { TrustBadge } from "@/components/shared/TrustBadge";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { banner } from "@/data/banner";

/**
 * Homepage banner.
 *
 * A dark, orange-lit card inset from the viewport edge, with the photograph
 * filling it and the copy split across three positions: the headline centred
 * on the left, the trust badge top-right and the pitch bottom-right. On small
 * screens the three stack — headline at the top, badge and pitch on the floor
 * — and the photograph shows through the gap between them.
 *
 * Static markup, so it stays a Server Component. The header floats over the
 * card, so the content pads itself clear of `--header-h` from the inside.
 */
export function Banner() {
  const { eyebrow, headline, description, cta, image, trust } = banner;

  return (
    <section className="bg-brand-50 p-2 sm:p-3 lg:p-4 dark:bg-page">
      <div className="on-dark relative isolate flex min-h-[calc(100svh-1rem)] overflow-hidden rounded-4xl bg-hero-glow sm:min-h-[calc(100svh-1.5rem)] lg:min-h-[calc(100svh-2rem)] lg:rounded-5xl">
        <div className="animate-fade-up absolute inset-0 [animation-delay:150ms]">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            preload
            sizes="100vw"
            className="object-cover object-[60%_45%] lg:object-center"
          />
        </div>

        {/* Legibility, then texture. The grain sits on top of everything
            visual so the photograph and the gradient share one surface. */}
        <div aria-hidden="true" className="hero-glow-scrim absolute inset-0" />
        <div
          aria-hidden="true"
          className="bg-grain pointer-events-none absolute inset-0 opacity-[0.16] mix-blend-overlay"
        />

        <Container className="relative grid grid-rows-[auto_1fr_auto_auto] gap-y-6 pt-[calc(var(--header-h)+2rem)] pb-8 sm:pb-12 lg:grid-cols-12 lg:grid-rows-[auto_1fr_auto] lg:gap-x-8 lg:pt-[calc(var(--header-h-lg)+2.5rem)] lg:pb-24 xl:pb-28">
          {/* Centred on the card, then lifted: optical centre sits above the
              geometric one, and the lift keeps the headline clear of the card
              in the photograph. */}
          <div className="lg:col-span-7 lg:row-span-3 lg:row-start-1 lg:-translate-y-12 lg:self-center">
            <Eyebrow className="animate-fade-up">{eyebrow}</Eyebrow>

            <h1 className="mt-4 font-heading text-[clamp(2.25rem,5.2vw,4.5rem)] leading-[0.98] font-bold tracking-[-0.03em] text-white lg:mt-5">
              {headline.map((line, i) => (
                <span
                  key={line}
                  className="animate-rise block"
                  style={{ animationDelay: `${120 + i * 90}ms` }}
                >
                  {line}
                </span>
              ))}
            </h1>
          </div>

          <TrustBadge
            label={trust.label}
            countries={trust.countries}
            className="animate-fade-up row-start-3 [animation-delay:500ms] lg:col-span-4 lg:col-start-9 lg:row-start-1"
          />

          <div className="animate-fade-up row-start-4 [animation-delay:600ms] lg:col-span-4 lg:col-start-9 lg:row-start-3">
            <p className="max-w-md text-base leading-[1.45] text-white/85 sm:text-lg">
              {description}
            </p>

            <Button
              href={cta.href}
              variant="outline"
              arrow={false}
              className="mt-6 [--btn-h:2.875rem] [--btn-pad:1.375rem] lg:mt-7"
            >
              {cta.label}
            </Button>
          </div>
        </Container>
      </div>
    </section>
  );
}
