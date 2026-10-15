/**
 * The footer's opening statement, over the rippled backdrop.
 *
 * `title` is set at display size and wraps to two or three lines by design —
 * keep it to roughly this length or the backdrop's bloom starts fighting the
 * type.
 */
export const footerLede = {
  tagline: "Virtual cards for safer online payments, ready in seconds.",
  title: "Every payment, protected from the very first tap",
  cta: { label: "Get your card", href: "/register" },
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
    title: "Product",
    links: [
      { label: "Virtual cards", href: "/services" },
      { label: "Spending controls", href: "/services" },
      { label: "Security", href: "/services" },
      { label: "Global payments", href: "/services" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About StripCard", href: "/about" },
      { label: "Use cases", href: "/use-cases" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help centre", href: "/help" },
      { label: "Get started", href: "/register" },
      { label: "Log in", href: "/login" },
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
  { icon: "shield", label: "Tokenised numbers and 3-D Secure" },
  { icon: "card", label: "Cards issued in seconds" },
  { icon: "globe", label: "Pay in any currency" },
];
