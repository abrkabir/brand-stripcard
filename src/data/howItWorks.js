/**
 * The "how it works" section on the homepage. `HowItWorks` renders straight
 * from this.
 *
 * `title` is read as one sentence: strings are plain text, `{ icon }` pieces
 * are small round badges set between the words, and `muted` pieces are dimmed
 * (the closing line). `steps` are the cards, in order: `label` and `word`
 * dress the orange tile, `glyph` picks the mark inside its morphing badge,
 * and the rest is the copy beside it (see HowCard).
 */
import {
  siAirbnb,
  siApple,
  siBookingdotcom,
  siGoogle,
  siNetflix,
  siShopify,
  siSpotify,
  siSteam,
} from "simple-icons";

export const howItWorksHeading = {
  eyebrow: "How it works",
  title: [
    "Your StripCard in three simple steps, ",
    { icon: "shield" },
    " secure from the first tap ",
    { icon: "sparkles", muted: true },
    { muted: " and ready in seconds." },
  ],
};

export const howItWorksSteps = [
  {
    title: "Sign up",
    description:
      "Create your account with just your email, then confirm who you are in a quick, secure check.",
    label: "Account",
    word: "Join",
    glyph: "user",
    cta: { label: "Sign up", href: "/register" },
  },
  {
    title: "Issue card",
    description:
      "Choose single-use or recurring, set a spending limit and get a card number the moment you ask.",
    label: "Virtual card",
    word: "Card",
    glyph: "card",
    cta: { label: "Create card", href: "/register" },
  },
  {
    title: "Pay Everywhere",
    description:
      "Shop online in any currency and watch every payment land in your dashboard as it happens.",
    label: "Payments",
    word: "Pay",
    glyph: "globe",
    cta: { label: "Start paying", href: "/register" },
  },
];

/**
 * Where a StripCard gets used: the logo grid under the title. Places people
 * pay online with a card, not partners — the caption says as much, so it
 * claims no endorsement. Marks come from simple-icons (bundled, drawn in the
 * theme's muted colour, in the brand's own colour on hover; see LogoCloud). Keep it to eight, and pick square
 * marks — a wide wordmark shrinks to nothing in the square slot.
 */
export const howItWorksLogos = {
  caption: { lead: "Pay wherever you already", pill: "shop online" },
  logos: [siNetflix, siSpotify, siShopify, siAirbnb, siApple, siBookingdotcom, siSteam, siGoogle].map(
    ({ title, path, hex }) => ({ title, path, color: `#${hex}` }),
  ),
};
