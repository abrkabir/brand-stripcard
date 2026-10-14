import shopperImage from "../../public/images/assets/use-cases/use-case-shopper.webp";
import shoppingImage from "../../public/images/assets/use-cases/use-case-shopping.webp";
import onTheGoImage from "../../public/images/assets/use-cases/use-case-on-the-go.webp";
import subscriptionsImage from "../../public/images/assets/use-cases/use-case-subscriptions.webp";

/**
 * The "use cases" bento on the homepage. `UseCases` renders straight from this.
 *
 * Four tiles, each a photo with its copy laid over it. Their order is fixed by
 * the layout: a tall story tile, a stat tile and a call-to-action tile stacked
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
  story: {
    image: shopperImage,
    alt: "A smiling woman paying on her phone at her desk",
    focus: "50% 20%",
    caption: "Shop with confidence.",
    statement: "Shop on any site without ever sharing your real card.",
    tag: { strong: "Online shopping", rest: "everyday purchases" },
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
  feature: {
    image: subscriptionsImage,
    alt: "Three payment cards standing side by side",
    focus: "50% 100%",
    label: "Subscriptions",
    title: "A separate card for every subscription",
    description: "Freeze or cancel one in a tap while the rest keep running.",
  },
};
