import businessImage from "../../public/images/assets/use-cases/use-case-business.webp";
import shopperImage from "../../public/images/assets/use-cases/use-case-shopper.webp";
import shoppingImage from "../../public/images/assets/use-cases/use-case-shopping.webp";
import onTheGoImage from "../../public/images/assets/use-cases/use-case-on-the-go.webp";
import travellerImage from "../../public/images/assets/use-cases/use-case-traveller.webp";

/**
 * The "use cases" bento on the homepage. `UseCases` renders straight from this.
 *
 * Four tiles with their copy laid over a picture. Their order is fixed by the
 * layout: a tall story tile, a stat tile and a call-to-action tile stacked
 * beside it, then a second tall tile.
 *
 * `focus` is the `object-position` of each photo, so the subject stays in view
 * however the tile is cropped. The copy's colour and shading are set for each
 * photo in the component, so swapping a photo may mean revisiting them.
 */
export const useCasesHeading = {
  eyebrow: "Use cases",
  title: "One card for every way you pay online",
  description:
    "From weekend shopping to monthly subscriptions, StripCard gives every payment its own secure virtual card.",
};

export const useCases = {
  /**
   * The tall tile plays these as stories, one after another (see
   * UseCaseStory). Each has its own person and its own `variant`, the way its
   * copy is dressed:
   *
   *   scrim   white type over a dark fade at the foot of the photo
   *   brand   a tag chip and white type over an orange wash
   *   tint    an orange sweep up from the bottom corner, a dotted label
   */
  story: {
    label: "StripCard use cases",
    slides: [
      {
        variant: "scrim",
        image: shopperImage,
        alt: "A smiling man holding up an orange StripCard virtual card",
        // Far enough right that the card he holds is never cropped.
        focus: "72% 30%",
        statement: "Shop on any site without sharing your identity or data.",
        tag: { strong: "Online shopping", rest: "everyday purchases" },
      },
      {
        variant: "brand",
        image: travellerImage,
        alt: "A woman on her phone walking down a sunny city street",
        focus: "48% 30%",
        statement: "Book trips abroad and pay in any currency, like a local.",
        tag: { strong: "Travel", rest: "flights, stays and everything after" },
      },
      {
        variant: "tint",
        image: businessImage,
        alt: "A man in a blue blazer laughing as he works on his laptop",
        focus: "55% 20%",
        statement: "Keep ads, tools and software on cards your team controls.",
        tag: { strong: "Business", rest: "spending that stays in budget" },
      },
    ],
  },
  stat: {
    image: shoppingImage,
    alt: "A shopping bag, a coffee and a red payment card",
    focus: "70% 50%",
    label: "Cards issued",
    value: "2M+",
    caption: "Virtual cards created for safer checkouts",
  },
  action: {
    image: onTheGoImage,
    alt: "A man with a bicycle smiling at his phone",
    focus: "25% 40%",
    title: "Pay on the go, right from your phone",
    cta: { label: "Explore more", href: "/services" },
  },
  // No photo: its three cards are drawn by the component (see UseCaseCards).
  feature: {
    label: "Subscriptions",
    title: "A separate card for every subscription",
    description: "Freeze or cancel one in a tap while the rest keep running.",
  },
};
