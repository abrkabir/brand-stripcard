import cardsImage from "../../public/images/assets/features/feature-virtual-cards-fan.webp";
import controlsImage from "../../public/images/assets/features/feature-controls-wide.webp";
import globalImage from "../../public/images/assets/features/feature-global-wide.webp";
import securityImage from "../../public/images/assets/features/feature-security-wide.webp";

/**
 * The features section on the homepage: a heading, then one tab per product
 * area. `Features` renders straight from this.
 *
 * Each tab fills the panel: `image` fills the left side, the rest goes on
 * the right. The images are 1200 x 1000 (6:5, the panel's ratio), made from
 * the source files beside them in /public/images/assets/features: recoloured,
 * their original branding and copy replaced with StripCard's, and widened or
 * cropped to fit; the virtual cards one is the four card designs in
 * /public/images/assets/cards, fanned out. They are imported rather than linked by path, so the build
 * names each by a hash of its contents and an edited image can never be
 * served stale from a cache. Keep `points` to three
 * short, checkable claims, and `label` to a word or two so the tab bar fits
 * a phone.
 */
export const featuresHeading = {
  eyebrow: "Features",
  /**
   * A statement that reads itself in on scroll, word by word, from muted to
   * fully on. Strings are plain text; `{ brand }` pieces are set in the brand
   * colour.
   */
  title: [
    "Everything you need to ",
    { brand: "issue, control and protect" },
    " your cards, and watch every payment as it happens.",
  ],
};

export const featureTabs = [
  {
    id: "cards",
    label: "Virtual cards",
    image: { src: cardsImage, alt: "StripCard cards in all four designs, orange, Platinum, silver and Business, fanned out in a loose ring on black" },
    title: "A card for every way you pay",
    description:
      "Create virtual cards in seconds, for a single purchase, a subscription or a whole team, without waiting for plastic.",
    points: [
      "Ready to use the moment it is created",
      "Single-use or recurring, your choice per card",
      "Works anywhere online that takes cards",
    ],
    cta: { label: "Explore virtual cards", href: "/services" },
  },
  {
    id: "controls",
    label: "Controls",
    image: { src: controlsImage, alt: "Stacked orange glass cards reading Spend only what you plan" },
    title: "Spend exactly how you mean to",
    description:
      "Put limits on every card and change them whenever you need to, so no payment ever goes further than you planned.",
    points: [
      "Limits by card, by merchant or by month",
      "Freeze and unfreeze any card in a tap",
      "Alerts the moment a limit is near",
    ],
    cta: { label: "Explore controls", href: "/services" },
  },
  {
    id: "security",
    label: "Security",
    image: { src: securityImage, alt: "A ring of glowing orange and dark tiles on black" },
    title: "Your real details, never shared",
    description:
      "Every card carries its own tokenised number, so merchants never see your account, and every payment is checked before it goes through.",
    points: [
      "Tokenised numbers for every card",
      "3-D Secure on every online payment",
      "Close a card for good if it is ever exposed",
    ],
    cta: { label: "Explore security", href: "/services" },
  },
  {
    id: "global",
    label: "Global",
    image: { src: globalImage, alt: "The orange StripCard card tucked into the pocket of a dark jacket" },
    title: "Pay anywhere, in any currency",
    description:
      "Shop and pay across borders in the currency each merchant expects, with the rate shown before you confirm.",
    points: [
      "Pay merchants in their own currency",
      "Live rates, shown before you pay",
      "One balance for every currency you use",
    ],
    cta: { label: "Explore global payments", href: "/services" },
  },
];
