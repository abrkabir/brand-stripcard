import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/lib/site";

/**
 * The banner every inner page opens with: near-black at the top glowing into
 * the brand orange at the foot, with a fine grain over it, the way the
 * StripCard brand boards are lit. A breadcrumb, the page title with a short
 * two-line caption beside it, and an optional line of description.
 *
 * Framed like the homepage banner (an inset, rounded panel), so moving from
 * home to an inner page feels like the same site. The page's route belongs in
 * `heroRoutes` (data/navigation.js), so the header sits over it in its
 * compact form, as it does over the homepage banner.
 *
 *   title         the page name, set large
 *   caption       two short lines beside the title (hidden on phones)
 *   description   one sentence under it
 *   crumbs        the trail, last item being this page: [{ label, href }]
 *
 * A Server Component. The glow drifts very slowly (paused while the page
 * scrolls, see ScrollCalm, and still for visitors who ask for less motion),
 * and the trail is also given to search engines as structured data.
 */
export function PageHero({ title, caption, description, crumbs }) {
  const trail = [{ label: "Home", href: "/" }, ...crumbs];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.label,
      item: new URL(crumb.href, siteConfig.url).toString(),
    })),
  };

  return (
    <section className="bg-page p-2 sm:p-3 lg:p-4">
      <div className="on-dark relative isolate overflow-hidden rounded-4xl bg-[#110c0a] lg:rounded-5xl">
        {/* The light: a broad orange bloom rising from below the frame. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(135%_80%_at_50%_122%,#ff7f2a_0%,#f26a1b_20%,#c4450c_38%,rgba(110,36,8,0.55)_58%,rgba(17,12,10,0)_80%)]"
        />
        {/* A second, softer bloom that drifts, so the light feels alive. */}
        <div
          aria-hidden="true"
          data-loop
          className="absolute -bottom-[45%] left-1/2 -z-10 h-[95%] w-[85%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,150,70,0.42),rgba(255,150,70,0))] will-change-transform motion-safe:animate-glow-drift"
        />
        <div aria-hidden="true" className="bg-grain pointer-events-none absolute inset-0 -z-10 opacity-[0.2] mix-blend-overlay" />

        <Container className="flex min-h-[25rem] flex-col items-center justify-center pt-[calc(var(--header-h)+3.5rem)] pb-16 text-center sm:min-h-[28rem] lg:min-h-[34rem] lg:pt-[calc(var(--header-h-lg)+3rem)] lg:pb-20">
          <nav aria-label="Breadcrumb" className="animate-fade-up">
            <ol className="inline-flex items-center gap-2 rounded-full bg-white/[0.07] px-4 py-1.5 text-sm text-white/65 ring-1 ring-white/15 backdrop-blur-md">
              {trail.map((crumb, i) => {
                const last = i === trail.length - 1;
                return (
                  <li key={crumb.href} className="flex items-center gap-2">
                    {i > 0 && (
                      <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3 text-white/35">
                        <path d="m6 3.5 4.5 4.5L6 12.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                    {last ? (
                      <span aria-current="page" className="font-medium text-white">
                        {crumb.label}
                      </span>
                    ) : (
                      <Link href={crumb.href} className="transition-colors hover:text-white">
                        {crumb.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>

          <div className="mt-8 flex items-start gap-5 lg:mt-10">
            <h1 className="animate-rise font-heading text-[clamp(3rem,9vw,7rem)] leading-[0.9] font-bold tracking-[-0.04em] text-white [animation-delay:80ms]">
              {title}
            </h1>
            {caption && (
              <p className="animate-fade-up mt-[0.35em] hidden text-left text-[clamp(0.9rem,1.3vw,1.125rem)] leading-[1.15] font-medium text-white/80 [animation-delay:220ms] md:block">
                {caption.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            )}
          </div>

          {description && (
            <p className="animate-fade-up mt-6 max-w-xl text-base leading-relaxed text-pretty text-white/70 [animation-delay:300ms] lg:mt-8 lg:text-lg">
              {description}
            </p>
          )}
        </Container>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </section>
  );
}
