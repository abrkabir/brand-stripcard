import { SparklesIcon } from "@/components/icons";
import { NewsletterForm } from "@/components/shared/NewsletterForm";
import { Container } from "@/components/ui/Container";

/**
 * Sits between the page content and the footer. Rendered by the `(main)`
 * layout so every marketing page ends the same way.
 */
export function Newsletter() {
  return (
    <section className="relative overflow-hidden bg-brand-900 py-16 lg:py-20">
      {/* Decorative wash so the flat brand block reads less like a slab. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-[8%] size-96 rounded-full bg-brand-400/25 blur-[110px]" />
        <div className="absolute -bottom-32 left-[5%] size-80 rounded-full bg-gold-500/15 blur-[110px]" />
      </div>

      <Container className="relative">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.12em] text-white uppercase">
              <SparklesIcon className="size-3.5" />
              Market digest
            </span>

            <h2 className="mt-5 font-heading text-3xl font-semibold text-white sm:text-4xl">
              Know what your street is worth
              <span className="block text-brand-200">before everyone else</span>
            </h2>

            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/70">
              Weekly price movements, new launches and the listings that get
              pulled before they ever hit the portals.
            </p>
          </div>

          <NewsletterForm />
        </div>
      </Container>
    </section>
  );
}
