import { Reveal } from "@/components/shared/Reveal";
import { Container } from "@/components/ui/Container";
import { statement } from "@/data/statement";

/**
 * A quiet beat between the banner and the sections below: one centred
 * paragraph, set large and light so it reads as a voice rather than a
 * heading. Fades up the first time it scrolls into view.
 */
export function Statement() {
  return (
    <section className="bg-surface py-20 lg:py-28">
      <Container>
        <Reveal className="mx-auto max-w-5xl translate-y-5 opacity-0 transition-[opacity,translate] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] data-visible:translate-y-0 data-visible:opacity-100">
          <p className="text-center text-[clamp(1.375rem,2.6vw,2.125rem)] leading-[1.35] font-light tracking-[-0.01em] text-balance text-headline">
            {statement.text}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
