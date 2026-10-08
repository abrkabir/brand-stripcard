import { Footer } from "@/components/layout/Footer";
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

      <Footer />
    </>
  );
}
