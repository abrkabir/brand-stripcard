import Link from "next/link";
import { ArrowRightIcon, getIcon } from "@/components/icons";
import { ShaderBackdrop } from "@/components/shared/ShaderBackdrop";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { footerLede, legalLinks } from "@/data/footer";
import { siteConfig } from "@/lib/site";

/**
 * Deliberately dark in both themes — it anchors the bottom of every page and
 * keeps the brand block consistent. All colours here are explicit white/opacity
 * values rather than semantic tokens, because this surface never flips.
 *
 * One band: the wordmark and strapline top-left, the statement and its action
 * on the floor, socials and small print opposite them.
 *
 * Everything sits over `shader-scrim`. The glass ribs strobe badly behind
 * type, so the band's floor and left edge are pulled back down before any text
 * goes on them. The bloom moves with the pointer, which means the worst case is
 * wherever the cursor happens to be — the scrim has to hold for all of them,
 * not just for one bright corner.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    /* Inset from the page on all four sides with every corner rounded, so the
       footer reads as a card that lifts away, at the end of the page, off the
       "Our impact" panel beneath it (see FooterReveal and the main layout).
       `overflow-hidden` is what makes the corners actually clip the shader
       band inside.

       The hairline is not decoration. On the light theme the inset is obvious —
       a near-black panel on a white page is 20:1 — but on the dark theme the
       page is #000 and the panel #04060e, which is 1.04:1: without an edge the
       gutter simply would not exist. `white/10` sits on the panel's own dark
       fill, so it draws in the dark theme and disappears into it in the light
       one, which is exactly where each is needed. */
    <footer className="relative m-3 overflow-hidden rounded-3xl border border-white/10 bg-shader-ink text-white/70 sm:m-4 lg:m-6 lg:rounded-[2rem]">
      {/* `isolate` gives the backdrop its own stacking context, so neither the
          canvas nor the scrim can climb over the copy. `on-dark` because the
          ground is dark in both themes: anything from the UI kit dropped in
          here commits to white on its own. */}
      <div className="relative isolate overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0">
          <ShaderBackdrop />
        </div>

        <div
          aria-hidden="true"
          className="shader-scrim pointer-events-none absolute inset-0"
        />

        <Container className="on-dark relative flex flex-col justify-between gap-16 py-14 lg:min-h-[32rem] lg:gap-24 lg:py-16">
          <div className="flex items-start justify-between gap-6">
            <div className="max-w-[22rem]">
              <Logo tone="inverse" />

              <p className="mt-5 text-[13px] leading-relaxed text-white/60">
                {footerLede.tagline}
              </p>
            </div>

            {/* A plain anchor, not a button: `#top` is the id on <main>, and
                `scroll-behavior: smooth` in base.css already animates the jump
                — and already turns itself off under prefers-reduced-motion. No
                JavaScript, so the footer stays a Server Component, and the
                link still works if the page never hydrates. */}
            <a
              href="#top"
              aria-label="Back to top"
              className="grid size-12 shrink-0 place-items-center rounded-full border border-white/15 bg-white/8 text-white/75 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/15 hover:text-white"
            >
              <ArrowRightIcon className="size-[18px] -rotate-90" />
            </a>
          </div>

          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-20">
            {/* Statement and action. */}
            <div className="flex flex-col items-start gap-10">
              {/* Headline, not h1 — one per page, and the page owns it. Left
                  at normal weight: at this scale the size carries it, and a
                  semibold would shout over the content above. */}
              <h2 className="max-w-[30ch] font-heading text-[1.875rem] leading-[1.05] font-normal text-balance text-white sm:text-[2.375rem] lg:text-[2.75rem]">
                {footerLede.title}
              </h2>

              {/* The kit's own button, not a bespoke one. `on-dark` above is
                  what makes the outline read white on the ripple — that is the
                  variant's whole purpose, so there is nothing to hand-roll. */}
              <Button href={footerLede.cta.href} variant="outline">
                {footerLede.cta.label}
              </Button>
            </div>

            {/* Socials and small print, on the floor of the band opposite the
                action. Right-aligned from `lg` so the two columns share a
                baseline and an outer edge. */}
            <div className="flex flex-col gap-7 lg:items-end lg:text-right">
              <ul className="flex flex-wrap items-center gap-2.5">
                {siteConfig.socials.map((social) => {
                  const Icon = getIcon(social.icon);

                  return (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className="grid size-10 place-items-center rounded-full border border-white/15 bg-white/8 text-white/75 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/15 hover:text-white"
                      >
                        {Icon && <Icon className="size-[18px]" />}
                      </a>
                    </li>
                  );
                })}
              </ul>

              <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] lg:justify-end">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/60 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <p className="text-[13px] text-white/45">
                &copy; {year} {siteConfig.legalName} All rights reserved.
              </p>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}
