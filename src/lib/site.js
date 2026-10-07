/**
 * Single source of truth for brand, contact and social details.
 * Anything that appears in more than one place (header, footer, metadata,
 * schema.org) reads from here so it can never drift.
 */
export const siteConfig = {
  name: "StripCard",
  legalName: "StripCard Ltd.",
  tagline: "Virtual Credit Card Solution",
  /** The full page title — browser tab, search results and link previews. */
  title: "StripCard - Virtual Credit Card Solution",
  description:
    "Issue, manage and control virtual credit cards in seconds — secure, instant and built for how you pay online.",
  url: "https://adestate.com",
  founded: 2014,

  contact: {
    phone: "+880 1700 000 000",
    phoneHref: "tel:+8801700000000",
    email: "hello@adestate.com",
    emailHref: "mailto:hello@adestate.com",
    address: "Level 8, Bay's Galleria, Gulshan 1, Dhaka 1212",
    hours: "Sun–Thu · 9:00–18:00",
  },

  socials: [
    { label: "Facebook", href: "https://facebook.com", icon: "facebook" },
    { label: "Instagram", href: "https://instagram.com", icon: "instagram" },
    { label: "X", href: "https://x.com", icon: "x" },
    { label: "LinkedIn", href: "https://linkedin.com", icon: "linkedin" },
    { label: "YouTube", href: "https://youtube.com", icon: "youtube" },
  ],
};
