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
export const whyChooseUsHeading = {
  eyebrow: "Why choose us",
  title: "What Makes Us Your Best Choice",
  description:
    "Reliable, secure and built around you. Here's why people and teams trust StripCard with every payment.",
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
