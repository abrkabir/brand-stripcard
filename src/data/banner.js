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

  /**
   * The payment partners, as a row of logo badges under the pitch. `icon` names a
   * simple-icons export (see Banner); `h` is the logo's height in pixels,
   * set per logo so square marks and long wordmarks carry the same weight.
   */
  partners: {
    label: "Works with the payment partners you trust",
    items: [
      { name: "Stripe", icon: "siStripe", h: 18 },
      { name: "Visa", icon: "siVisa", h: 12 },
      { name: "Mastercard", icon: "siMastercard", h: 18 },
      { name: "Apple Pay", icon: "siApplepay", h: 21 },
      { name: "Google Pay", icon: "siGooglepay", h: 14 },
      { name: "PayPal", icon: "siPaypal", h: 18 },
    ],
  },

  /**
   * An orange StripCard handed against a phone whose screen reads "Payment
   * Successful, $4,200.00, paid to John's Hardware" with a "Done" button.
   * The background is transparent, so the banner's own glow shows round the
   * hands. The earlier artwork (`hero-stripcard.webp`, and the original
   * `hero_img1.webp`) stays beside it.
   */
  image: {
    src: "/images/assets/banner/banner-bg.webp",
    alt: "An orange StripCard tapped against a phone showing a successful $4,200.00 payment",
    width: 1678,
    height: 937,
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
