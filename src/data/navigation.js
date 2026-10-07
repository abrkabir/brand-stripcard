/**
 * The primary navigation. The desktop mega panel and the mobile drawer both
 * render from this array — add a route here and it appears in both, correctly.
 *
 * An item with a `panel` opens a full-width dropdown; without one it is a
 * plain link. Panels are deliberately shallow: three to four destinations,
 * each with one line of explanation. Anything deeper belongs on the landing
 * page for that section, not in a menu.
 *
 * The Properties panel points into `/properties` with a filter rather than at
 * four separate landing pages — one page answers all four, and the filter is in
 * the URL so each entry is a real, shareable destination.
 *
 * `type=commercial` and `type=new-development` match nothing in `properties.js`
 * yet, so those two land on the listing page's empty state. That is deliberate:
 * the alternative is sending someone who clicked "Commercial" to a page of
 * houses. Give a listing either of those `type` values and its link starts
 * working with no change here.
 */
/**
 * Routes that open with a full-bleed hero, so the header sits transparently
 * over the photograph instead of as a solid bar above it.
 *
 * Matched exactly. `/properties` is in the list; `/properties/[slug]` is not —
 * a detail page starts with a breadcrumb, not a photograph, and needs the
 * header's height reserved with `pt-header` instead.
 *
 * Any page added here must also drop `pt-header` and pad its own content by
 * `--header-h` from the inside, or the header will sit on top of its copy. See
 * `HeroSlider` and `PropertySearchBar`.
 */
export const heroRoutes = ["/", "/properties"];

export const mainNav = [
  {
    label: "Properties",
    href: "/properties",
    panel: [
      {
        label: "Buy",
        href: "/properties?status=sale",
        description:
          "Apartments, houses and land, each one visited and photographed by our team before it goes live.",
      },
      {
        label: "Rent",
        href: "/properties?status=rent",
        description:
          "Long lets, short stays and serviced homes — over 1,200 listed direct by verified owners.",
      },
      {
        label: "Commercial",
        href: "/properties?type=commercial",
        description:
          "Office floors, retail units and warehousing across the city's main business districts.",
      },
      {
        label: "New developments",
        href: "/properties?type=new-development",
        description:
          "Off-plan and just-completed projects, with build quality and handover dates on record.",
      },
    ],
  },
  {
    label: "Services",
    href: "/services",
    panel: [
      {
        label: "Valuation",
        href: "/sell/valuation",
        description:
          "A free, data-backed estimate of what your property is worth, returned within 48 hours.",
      },
      {
        label: "Selling",
        href: "/sell",
        description:
          "Photography, staging, listing and legal paperwork handled end to end. Average 27 days.",
      },
      {
        label: "Management",
        href: "/landlords/management",
        description:
          "Tenant screening, rent collection and maintenance, reported to you monthly.",
      },
    ],
  },
  { label: "Areas", href: "/areas" },
  { label: "Insights", href: "/insights" },
  {
    label: "Company",
    href: "/about",
    panel: [
      {
        label: "About us",
        href: "/about",
        description:
          "Twelve years, 42 neighbourhoods and one rule: never list what we have not stood inside.",
      },
      {
        label: "Our agents",
        href: "/agents",
        description:
          "320 licensed agents, each one accountable for the listings that carry their name.",
      },
      {
        label: "Careers",
        href: "/careers",
        description:
          "Six roles open across sales, valuation and engineering. Remote-friendly.",
      },
    ],
  },
  { label: "Contact", href: "/contact" },
];

/** Language switcher options. Wire to real i18n routing when it lands. */
export const locales = [
  { code: "EN", label: "English" },
  { code: "BN", label: "বাংলা" },
  { code: "AR", label: "العربية" },
];
