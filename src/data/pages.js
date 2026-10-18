/**
 * The banner copy for the inner pages (see PageHero). Each page then reuses
 * sections from the homepage, so a change to a section shows on both.
 *
 *   title         the page name, set large
 *   caption       two short lines beside the title (hidden on phones)
 *   description   one sentence under it
 *
 * The contact page keeps its banner beside the rest of its copy, in
 * data/contact.js.
 */
export const pageHeroes = {
  about: {
    title: "About us",
    caption: ["Virtual cards for", "safer online payments"],
    description:
      "StripCard gives every online payment its own secure virtual card, so your real card details stay private wherever you shop.",
  },
  services: {
    title: "Services",
    caption: ["Issue, control", "and protect"],
    description:
      "Everything you need to create virtual cards, set the limits on them and watch every payment as it happens.",
  },
  useCases: {
    title: "Use cases",
    caption: ["One card for every", "way you pay online"],
    description:
      "From weekend shopping to team subscriptions, see how people use StripCard to pay online safely.",
  },
  howItWorks: {
    title: "How it works",
    caption: ["From sign up to", "your first payment"],
    description:
      "Sign up, issue a virtual card and pay anywhere online, in a few minutes and from one account.",
  },
  flexibility: {
    title: "Flexibility",
    caption: ["One account for every", "way your money moves"],
    description:
      "Send, hold, exchange and spend from one place, with every card under your control and every payment in view.",
  },
  control: {
    title: "Control",
    caption: ["Your cards and balance,", "all in your hands"],
    description:
      "See every balance, set a limit on every card and pause one the moment you need to, from your dashboard or the app.",
  },
};
