import Image from "next/image";
import { Reveal } from "@/components/shared/Reveal";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { useCases, useCasesHeading } from "@/data/useCases";
import { cn } from "@/lib/cn";

/**
 * "Use cases": a heading, then a bento of four photo tiles with their copy laid
 * over the picture.
 *
 *   desktop   story │ stat   │ feature        tablet   story │ feature
 *                   │ action │                         stat  │ action
 *
 * On a phone the tiles stack in that same reading order. Each tile fades up
 * in turn the first time the grid scrolls into view, and its photo eases in
 * a touch on hover.
 *
 * A Server Component; only the reveal is client-side.
 */
export function UseCases() {
  const { eyebrow, title, description } = useCasesHeading;
  const { story, stat, action, feature } = useCases;

  return (
    <section aria-labelledby="use-cases-title" className="bg-page py-20 lg:py-28">
      <Container>
        <Reveal className="flex translate-y-6 flex-col gap-5 opacity-0 transition-[opacity,translate] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] data-visible:translate-y-0 data-visible:opacity-100 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2
              id="use-cases-title"
              className="mt-5 max-w-2xl font-display text-[clamp(1.5rem,2.8vw,2.25rem)] leading-[1.2] font-semibold tracking-[-0.035em] text-pretty text-headline"
            >
              {title}
            </h2>
          </div>
          <p className="max-w-md leading-relaxed text-pretty text-content">{description}</p>
        </Reveal>

        <Reveal className="mt-10 grid gap-4 md:grid-cols-2 md:[grid-template-areas:'story_feature'_'stat_action'] lg:mt-14 lg:h-[42rem] lg:grid-cols-[1.15fr_1fr_1fr] lg:grid-rows-2 lg:[grid-template-areas:'story_stat_feature'_'story_action_feature']">
          {/* Story: the shopper, with the promise set over a scrim at the foot. */}
          <Tile
            {...story}
            index={0}
            sizes="(min-width: 1024px) 34vw, (min-width: 768px) 50vw, 100vw"
            className="aspect-[4/5] justify-between md:aspect-[3/4] md:[grid-area:story] lg:aspect-auto"
          >
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 -z-10 h-3/5 bg-linear-to-t from-hero-ink/90 via-hero-ink/45 to-transparent"
            />
            <p className="text-center text-sm font-medium text-hero-ink/70">{story.caption}</p>
            <div>
              <h3 className="max-w-xs font-display text-[clamp(1.5rem,2.2vw,2rem)] leading-[1.12] font-semibold tracking-[-0.02em] text-balance text-white">
                {story.statement}
              </h3>
              <p className="mt-4 text-sm text-white/70">
                <strong className="font-semibold text-white">{story.tag.strong}</strong>,{" "}
                {story.tag.rest}
              </p>
            </div>
          </Tile>

          {/* Stat: dark type, since the backdrop here is a pale blue. */}
          <Tile
            {...stat}
            index={1}
            sizes="(min-width: 1024px) 30vw, (min-width: 768px) 50vw, 100vw"
            className="aspect-[6/5] justify-between md:[grid-area:stat] lg:aspect-auto"
          >
            <div>
              <p className="text-xs font-semibold tracking-[0.14em] text-hero-ink/60 uppercase">
                {stat.label}
              </p>
              <p className="mt-1 font-display text-[clamp(2.5rem,4vw,3.5rem)] leading-none font-semibold tracking-[-0.04em] text-hero-ink">
                {stat.value}
              </p>
            </div>
            <p className="text-sm font-medium text-hero-ink/70">{stat.caption}</p>
          </Tile>

          {/* Action: shaded top and bottom so the title and button hold up
              against the glass behind him and the pale wall beside him. */}
          <Tile
            {...action}
            index={2}
            sizes="(min-width: 1024px) 30vw, (min-width: 768px) 50vw, 100vw"
            className="aspect-[6/5] justify-between md:[grid-area:action] lg:aspect-auto"
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-linear-to-b from-hero-ink/65 via-hero-ink/10 to-hero-ink/55"
            />
            <h3 className="max-w-[15rem] font-display text-xl leading-tight font-semibold text-balance text-white">
              {action.title}
            </h3>
            <Button
              href={action.cta.href}
              size="sm"
              className="self-start border-white bg-white text-hero-ink hover:border-brand hover:bg-brand hover:text-white"
            >
              {action.cta.label}
            </Button>
          </Tile>

          {/* Feature: the copy sits in the black above the cards. */}
          <Tile
            {...feature}
            index={3}
            sizes="(min-width: 1024px) 30vw, (min-width: 768px) 50vw, 100vw"
            className="aspect-[4/5] md:aspect-[3/4] md:[grid-area:feature] lg:aspect-auto"
          >
            <p className="text-xs font-semibold tracking-[0.14em] text-white/55 uppercase">
              {feature.label}
            </p>
            <h3 className="mt-3 max-w-xs font-display text-[clamp(1.5rem,2.2vw,2rem)] leading-[1.12] font-semibold tracking-[-0.02em] text-balance text-white">
              {feature.title}
            </h3>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/65">
              {feature.description}
            </p>
          </Tile>
        </Reveal>
      </Container>
    </section>
  );
}

/**
 * A rounded photo tile. The photo fills it behind everything; children are
 * laid out in a padded column over it. Tiles fade up one after another once
 * the grid around them is revealed — `index` sets each one's place in that
 * stagger.
 */
function Tile({ image, alt, focus, sizes, index, className, children }) {
  return (
    <article
      style={{ transitionDelay: `${index * 110}ms` }}
      className={cn(
        "group relative isolate flex translate-y-8 flex-col overflow-hidden rounded-[1.25rem] bg-hero-ink p-6 opacity-0 transition-[opacity,translate] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] in-data-visible:translate-y-0 in-data-visible:opacity-100 lg:p-7",
        className,
      )}
    >
      <Image
        src={image}
        alt={alt}
        fill
        sizes={sizes}
        style={{ objectPosition: focus }}
        className="-z-10 object-cover transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
      />
      {children}
    </article>
  );
}
