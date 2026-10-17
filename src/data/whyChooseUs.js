/**
 * The "why choose us" section on the homepage. `WhyChooseUs` renders straight
 * from this.
 *
 * Each item is a card: a white panel (keywords, title, a status line) above
 * a warm glow holding an illustration. "View details" swaps the illustration
 * for `description`. `art` picks the illustration — one of
 * the keys in `ART` inside the component. The status values are placeholder
 * figures until real ones are supplied.
 */
/**
 * The title, line by line. Each line is a list of pieces: a string is plain
 * text, `{ highlight }` is set in the brand colour and `{ pill }` is framed
 * in an outlined pill with an animated capsule. Keep a pill phrase short — it
 * never wraps, so it has to fit a phone's width on its own.
 */
export const whyChooseUsHeading = {
  eyebrow: "Why choose us",
  title: [
    ["Discover why ", { highlight: "StripCard" }, " is"],
    ["your safest and ", { pill: "smartest choice" }],
  ],
};

export const whyChooseUs = [
  {
    tags: ["create", "customize", "manage"],
    title: "Virtual Card Issuance",
    description:
      "Instantly create and manage virtual cards for secure online transactions, customized to suit your specific needs.",
    status: { label: "status", value: "ready in 3s" },
    art: "cards",
  },
  {
    tags: ["encryption", "3-D Secure", "tokens"],
    title: "Secure Online Transactions",
    description:
      "Benefit from advanced encryption and authentication methods, ensuring that your online payments are protected.",
    status: { label: "protection", value: "always on" },
    art: "shield",
  },
  {
    tags: ["monthly", "yearly", "flexible"],
    title: "Customizable Payment Plans",
    description:
      "Choose from a variety of flexible payment plans designed to accommodate different budgets and preferences.",
    status: { label: "plan", value: "saving: 20%" },
    art: "plans",
  },
  {
    tags: ["alerts", "history", "insights"],
    title: "Real-Time Monitoring",
    description:
      "Keep track of your spending with real-time notifications and detailed transaction history.",
    status: { label: "live", value: "updated 1s ago" },
    art: "monitor",
  },
  {
    tags: ["usd", "eur", "gbp"],
    title: "Multi-Currency Support",
    description:
      "Easily manage transactions in multiple currencies, perfect for international shopping and payments.",
    status: { label: "rates", value: "live" },
    art: "currency",
  },
  {
    tags: ["chat", "email", "phone"],
    title: "24/7 Customer Support",
    description:
      "Access round-the-clock customer support to resolve any payment-related issues or inquiries.",
    status: { label: "support", value: "reply in 2 min" },
    art: "support",
  },
];

/**
 * The note under the cards: the currencies StripCard handles, as a row of
 * coins (the first few, by ISO code; see CurrencyMark), then how many more,
 * a label, and a line on what that means when you pay. The count is a
 * placeholder until a real figure is supplied; keep `more` and the figure in
 * `label` in step.
 */
export const whyChooseUsCurrencies = {
  currencies: ["USD", "EUR", "GBP", "JPY", "INR", "KRW"],
  more: 24,
  label: "30+ global currencies",
  text: "Hold and spend them all from one wallet. Every payment converts at the real exchange rate, with no hidden markups or foreign transaction fees.",
};
