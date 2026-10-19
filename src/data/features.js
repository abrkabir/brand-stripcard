import cardsImage from "../../public/images/assets/features/feature-virtual-cards-fan.webp";
import controlsImage from "../../public/images/assets/features/feature-controls-phone.webp";
import globalImage from "../../public/images/assets/features/feature-global-anywhere.webp";
import securityImage from "../../public/images/assets/features/feature-security-lock.webp";

/**
 * The features section on the homepage: a heading, then one tab per product
 * area. `Features` renders straight from this.
 *
 * Each tab fills the panel: `image` fills the left side, the rest goes on
 * the right. The images are 1200 x 1000 (6:5, the panel's ratio), made from
 * the source files beside them in /public/images/assets/features: recoloured,
 * their original branding and copy replaced with StripCard's, and widened or
 * cropped to fit. The virtual cards one is the four card designs in
 * /public/images/assets/cards, floating in a pinwheel, and the controls one is
 * cards-phone from that folder, set on the same dark ground. The security
 * one is card-security from that folder, recoloured to the brand, with the
 * orange card set into the padlock's face; the global one is pay-anywhere
 * from there, recoloured the same way, its backdrop taken down to a dark
 * ground and the orange card on top of its stack. They are imported rather
 * than linked by path, so the build names each by a hash of its contents and
 * an edited image can never be served stale from a cache. Keep `points` to
 * three short, checkable claims, and `label` to a word or two so the tab bar
 * fits a phone.
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
    image: { src: cardsImage, alt: "Five StripCard cards in all four designs, two silver, Platinum, Business and orange, floating in a loose pinwheel on black" },
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
    image: { src: controlsImage, alt: "The orange StripCard card in front of two more cards, rising out of a phone" },
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
    image: { src: securityImage, alt: "A padlock with the orange StripCard card as its body, on a pedestal, all in StripCard orange" },
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
    image: { src: globalImage, alt: "A glass plane flying over a glass globe and a twisting stack of cards topped by the orange StripCard card, on a dark ground" },
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
