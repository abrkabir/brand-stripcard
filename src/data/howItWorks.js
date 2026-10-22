/**
 * The "how it works" section on the homepage. `HowItWorks` renders straight
 * from this.
 *
 * `title` is read as one sentence: strings are plain text, `{ icon }` pieces
 * are small round badges set between the words, and `muted` pieces are dimmed
 * (the closing line). `steps` are the cards, in order: `image` fills the
 * card's picture (made from references, rebranded; public/images/assets/
 * how-it-works), `focus` is its object-position, `label` names it on a small
 * pill over it, `glyph` picks the mark in that pill's morphing badge, and the
 * rest is the copy under it (see HowCard).
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
import issueCardImage from "../../public/images/assets/cards/cards-stack-scene.webp";
import payEverywhereImage from "../../public/images/assets/how-it-works/step-pay-everywhere.webp";
import signUpImage from "../../public/images/assets/how-it-works/step-sign-up.webp";

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
    // The StripCard app on a phone's home screen.
    image: signUpImage,
    focus: "40% 62%",
    glyph: "user",
    cta: { label: "Sign up", href: "/register" },
  },
  {
    title: "Issue card",
    description:
      "Choose single-use or recurring, set a spending limit and get a card number the moment you ask.",
    label: "Virtual card",
    // The orange StripCard floating over a second card.
    image: issueCardImage,
    focus: "50% 46%",
    glyph: "card",
    cta: { label: "Create card", href: "/register" },
  },
  {
    title: "Pay Everywhere",
    description:
      "Shop online in any currency and watch every payment land in your dashboard as it happens.",
    label: "Payments",
    // A man on his phone as a $5,000.00 payment lands.
    image: payEverywhereImage,
    focus: "62% 42%",
    glyph: "globe",
    cta: { label: "Start paying", href: "/register" },
  },
];

/**
 * Where it works, beside the logos: a line with a pill (as the logos' caption
 * has), then the flags of some of the markets it serves drifting past, an
 * arrow riding over them as you scroll (square SVGs from flag-icons, MIT, in
 * /public/images/flags; see FlagMarquee). The flags are ordered so that no
 * two look-alike ones sit side by side.
 */
export const howItWorksReach = {
  caption: { lead: "Feels local in", pill: "180+ countries" },
  countries: [
    { code: "us", name: "United States" },
    { code: "de", name: "Germany" },
    { code: "jp", name: "Japan" },
    { code: "br", name: "Brazil" },
    { code: "gb", name: "United Kingdom" },
    { code: "sg", name: "Singapore" },
    { code: "za", name: "South Africa" },
    { code: "fr", name: "France" },
    { code: "in", name: "India" },
    { code: "ca", name: "Canada" },
    { code: "ke", name: "Kenya" },
    { code: "se", name: "Sweden" },
    { code: "ae", name: "United Arab Emirates" },
    { code: "kr", name: "South Korea" },
    { code: "nl", name: "Netherlands" },
    { code: "au", name: "Australia" },
    { code: "ar", name: "Argentina" },
    { code: "it", name: "Italy" },
    { code: "ch", name: "Switzerland" },
    { code: "ng", name: "Nigeria" },
    { code: "hk", name: "Hong Kong" },
    { code: "ie", name: "Ireland" },
    { code: "dk", name: "Denmark" },
    { code: "my", name: "Malaysia" },
    { code: "no", name: "Norway" },
    { code: "th", name: "Thailand" },
    { code: "tr", name: "Türkiye" },
    { code: "nz", name: "New Zealand" },
    { code: "id", name: "Indonesia" },
    { code: "fi", name: "Finland" },
    { code: "be", name: "Belgium" },
    { code: "pl", name: "Poland" },
    { code: "ph", name: "Philippines" },
    { code: "at", name: "Austria" },
  ],
};

/**
 * Where a StripCard gets used: the logo grid under the steps. Places people
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
