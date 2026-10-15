/**
 * Homepage banner copy and artwork. `Banner` renders straight from this.
 *
 * `headline` is split into lines on purpose: the design stacks it as short,
 * ragged lines, and leaving it to the browser would wrap it differently at
 * every width.
 */
export const banner = {
  eyebrow: "Elevate your payments",
  headline: ["Powering", "Next-Gen", "Virtual Cards."],

  description:
    "With StripCard, create virtual credit cards in seconds. Set spending limits, track every payment in real time, and pay securely online, anywhere in the world.",

  cta: { label: "Explore Products", href: "/products" },

  /**
   * `hero_img1.webp`, rebranded: the receipt on the phone reads "$4,200.00,
   * Payment approved, StripCard", the button "Continue", and the card is an
   * orange StripCard with its own number. The original stays beside it.
   */
  image: {
    src: "/images/assets/banner/hero-stripcard.webp",
    alt: "An orange StripCard tapped against a phone, approving a $4,200.00 payment",
    width: 2400,
    height: 1340,
  },

  /**
   * The trust badge: flags of the markets StripCard serves. Square SVGs from
   * flag-icons (MIT) in /public/images/flags, cropped to circles. Add a
   * country by dropping its 1x1 flag there and listing it here; past six the
   * stack reads as a strip, not a badge.
   */
  trust: {
    label: "Trusted worldwide",
    countries: [
      { code: "us", name: "United States" },
      { code: "gb", name: "United Kingdom" },
      { code: "ca", name: "Canada" },
      { code: "au", name: "Australia" },
      { code: "ae", name: "United Arab Emirates" },
      { code: "it", name: "Italy" },
    ],
  },
};
