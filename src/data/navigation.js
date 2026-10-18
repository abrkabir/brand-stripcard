/**
 * The primary navigation. The desktop dropdown and the mobile drawer both
 * render from this array — add a route here and it appears in both, correctly.
 *
 * An item with a `panel` opens a dropdown card under the header; without one
 * it is a plain link. Panels are deliberately shallow: a handful of
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
export const heroRoutes = [
  "/",
  "/about",
  "/services",
  "/use-cases",
  "/how-it-works",
  "/flexibility",
  "/control",
  "/contact",
];

export const mainNav = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  {
    label: "Resources",
    href: "/use-cases",
    /**
     * A bento panel (see MegaMenu): the first entry is the tall tile on the
     * left, then two down the middle and two down the right. `tone` paints
     * the tile (soft, brand or ink) and `art` picks its illustration.
     */
    panel: [
      {
        label: "Use cases",
        href: "/use-cases",
        description: "Shopping, subscriptions, travel and teams. One card for every way you pay online.",
        tone: "soft",
        art: "useCases",
      },
      {
        label: "About",
        href: "/about",
        description: "Who we are, and why we built StripCard.",
        tone: "soft",
        art: "about",
      },
      {
        label: "How it works",
        href: "/how-it-works",
        description: "Sign up, issue a card and pay, in minutes.",
        tone: "soft",
        art: "howItWorks",
      },
      {
        label: "Flexibility",
        href: "/flexibility",
        description: "One account for every way your money moves.",
        tone: "brand",
        art: "flexibility",
      },
      {
        label: "Control",
        href: "/control",
        description: "Your cards and your balance, all in your control.",
        tone: "ink",
        art: "control",
      },
    ],
  },
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
