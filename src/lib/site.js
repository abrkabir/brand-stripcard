/**
 * Single source of truth for brand, contact and social details.
 * Anything that appears in more than one place (header, footer, metadata,
 * schema.org) reads from here so it can never drift.
 */
export const siteConfig = {
  name: "Adestate",
  legalName: "Adestate Properties Ltd.",
  tagline: "Real estate, without the runaround",
  description:
    "Browse verified homes for sale and rent, compare neighbourhoods with real data, and work with agents who answer.",
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
