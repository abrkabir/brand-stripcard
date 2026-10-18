/**
 * The "flexibility" section on the homepage: what one StripCard account lets
 * you do, as six posters. `Flexibility` renders straight from this.
 *
 * Each item is a poster: its `label` (in the poster's header), a big title
 * (the poster's link, to `link`), a short `note` set under it in brackets, and
 * its look (`art`, a key in `POSTERS` inside the component). The figures in
 * the posters are placeholders, as elsewhere on the site.
 */
export const flexibilityHeading = {
  eyebrow: "Flexibility",
  /**
   * The title, line by line. A string is plain text; `{ brand }` is set in the
   * brand colour.
   */
  title: [["One account for ", { brand: "every way" }], ["your money moves"]],
  description:
    "Send, hold, exchange and spend from one place, with every card under your control and every payment in view.",
  cta: { label: "Open an account", href: "/register" },
};

export const flexibility = [
  {
    art: "send",
    label: "Transfers",
    title: "Send money in seconds",
    note: "free and instant between StripCard users",
    action: "Send money",
    link: { label: "Explore transfers", href: "/services" },
  },
  {
    art: "currencies",
    label: "Multi-currency",
    title: "Hold 30+ currencies in one wallet",
    note: "every balance, ready to spend",
    link: { label: "Explore currencies", href: "/services" },
  },
  {
    art: "cards",
    label: "Virtual cards",
    title: "A card for every spend",
    note: "its own limit, merchant and lifetime",
    link: { label: "Get a virtual card", href: "/register" },
  },
  {
    art: "exchange",
    label: "Exchange",
    title: "Exchange at the real rate",
    note: "held while you check out, no hidden markup",
    link: { label: "See how rates work", href: "/services" },
  },
  {
    art: "freeze",
    label: "Controls",
    title: "Freeze any card in a tap",
    note: "and switch it back on just as fast",
    link: { label: "Explore controls", href: "/services" },
  },
  {
    art: "alerts",
    label: "Insights",
    title: "Every payment, the moment it happens",
    note: "real-time alerts, monthly insights",
    link: { label: "Explore insights", href: "/services" },
  },
];
