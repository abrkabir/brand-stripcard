/**
 * The primary navigation. The desktop dropdown and the mobile drawer both
 * render from this array — add a route here and it appears in both, correctly.
 *
 * An item with a `panel` opens a dropdown card under the header; without one
 * it is a plain link. Panels are deliberately shallow: three to four
 * destinations, each with one line of explanation. Anything deeper belongs on
 * the landing page for that section, not in a menu.
 *
 * Every page that opens with a full-bleed hero must pad its own content by
 * `--header-h` from the inside (see `Banner`); every other page starts its
 * first section with the `pt-header` utility.
 */
/**
 * Routes that open on a dark banner: the homepage banner, or the PageHero an
 * inner page opens with. Here the header starts compact —
 * white logo, white pills only behind the links and the button — and its
 * surface grows into the full bar once the page scrolls. Everywhere else it
 * is the full bar from the start. Matched exactly.
 */
export const heroRoutes = ["/", "/about", "/services", "/use-cases", "/contact"];

export const mainNav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Use Cases", href: "/use-cases" },
  { label: "Contact", href: "/contact" },
];

/** The header's call to action. Kept beside the nav so both menus share it. */
export const headerCta = { label: "Get Started", href: "/register" };

/** Language switcher options. Wire to real i18n routing when it lands. */
export const locales = [
  { code: "EN", label: "English" },
  { code: "BN", label: "বাংলা" },
  { code: "AR", label: "العربية" },
];
