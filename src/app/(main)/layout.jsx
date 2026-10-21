import { Footer } from "@/components/layout/Footer";
import { FooterReveal } from "@/components/layout/FooterReveal";
import { Header } from "@/components/layout/Header";

/**
 * Chrome for every public marketing page: `/`, `/about`, `/services`, …
 *
 * Route groups do not add a URL segment, so `(main)/buy/page.tsx` still serves
 * `/buy`. Dashboards and auth screens get their own groups with their own
 * chrome, and never inherit this one.
 *
 * `main` carries no top padding on purpose — the header is fixed and sits
 * transparently over the homepage banner. Any page that does NOT open with a
 * full-bleed hero must start its first section with the `pt-header` utility.
 */
export default function MainLayout({ children }) {
  return (
    <>
      <Header />

      <main id="top" className="flex-1">
        {children}
      </main>

      {/* At the very end of the page the footer lifts away to uncover "Our
          impact" (FooterReveal): the panel is pinned to the bottom of the
          viewport beneath the footer, which is raised and painted the page
          colour all round. `flow-root` keeps the footer's margins inside that
          paint, so the panel never shows through around the card early.

          From partway down the footer, a dark ground (rounded at its top
          corners) runs behind the card and on into the panel: the card's
          upper part sits on the page, its lower part on the dark. It is one
          flat colour, the same as the panel, so the two meet without a seam:
          `footer-ground` (variables.css), black on the light page and a warm
          brown on the dark one, so the band still shows against black. */}
      <div className="relative">
        <div className="relative z-10 flow-root bg-page">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-[40%] bottom-0 rounded-t-[2rem] bg-footer-ground lg:rounded-t-[2.75rem]"
          />
          <Footer />
        </div>
        <FooterReveal />
      </div>
    </>
  );
}
