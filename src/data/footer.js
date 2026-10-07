/**
 * The footer's opening statement, over the rippled backdrop.
 *
 * `title` is set at display size and wraps to three lines by design — keep it
 * to roughly this length or the backdrop's bloom starts fighting the type.
 */
export const footerLede = {
  tagline: "Verified listings, honest pricing, and an agent who answers.",
  title: "Every home, seen in person before it reaches you",
  cta: { label: "Talk to an agent", href: "/contact" },
};

/**
 * The site's link map.
 *
 * Not currently rendered: the footer's lede band puts the statement and the
 * small print on the ripple, and columns of links could not be read over it.
 * Kept because it is still the canonical grouping — a `/sitemap` page or a
 * slimmer footer variant can render it unchanged.
 */
export const footerColumns = [
  {
    title: "Properties",
    links: [
      { label: "Homes for sale", href: "/buy" },
      { label: "Homes for rent", href: "/rent" },
      { label: "New developments", href: "/new-projects", badge: "New" },
      { label: "Commercial space", href: "/commercial" },
      { label: "Plots & land", href: "/buy/land" },
      { label: "Luxury collection", href: "/luxury" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Adestate", href: "/about" },
      { label: "Our agents", href: "/agents" },
      { label: "Careers", href: "/careers", badge: "6 open" },
      { label: "Press kit", href: "/press" },
      { label: "Partner with us", href: "/partners" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Market insights", href: "/insights" },
      { label: "Mortgage calculator", href: "/tools/mortgage" },
      { label: "Buying guide", href: "/guides/buying" },
      { label: "Selling guide", href: "/guides/selling" },
      { label: "Tenant rights", href: "/guides/tenant-rights" },
      { label: "Help centre", href: "/help" },
    ],
  },
  {
    title: "Popular areas",
    links: [
      { label: "Gulshan", href: "/areas/gulshan" },
      { label: "Banani", href: "/areas/banani" },
      { label: "Dhanmondi", href: "/areas/dhanmondi" },
      { label: "Bashundhara R/A", href: "/areas/bashundhara" },
      { label: "Uttara", href: "/areas/uttara" },
      { label: "Mirpur DOHS", href: "/areas/mirpur-dohs" },
    ],
  },
];

/** Bottom bar — legal only. Keep it short. */
export const legalLinks = [
  { label: "Privacy policy", href: "/privacy-policy" },
  { label: "Terms of service", href: "/terms-of-service" },
  { label: "Cookie policy", href: "/cookie-policy" },
  { label: "Sitemap", href: "/sitemap" },
];

/**
 * Trust badges. Not currently rendered — the footer is a single band now, and
 * the strip that carried these was removed with it. Kept for whatever picks the
 * argument back up: an /about page, or a strip above the fold.
 */
export const footerBadges = [
  { icon: "shield", label: "Every listing verified on site" },
  { icon: "star", label: "4.9 / 5 from 2,840 reviews" },
  { icon: "users", label: "320 licensed agents" },
];
