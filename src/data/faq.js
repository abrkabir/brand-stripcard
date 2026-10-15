/**
 * The FAQ section on the homepage. `Faq` renders straight from this.
 *
 * `title` is read as one line: strings are plain text, `{ em }` pieces are set
 * in the italic accent serif. Each question belongs to one `category`, which
 * is what the pills above the list filter by; "all" shows every question.
 * Keep answers to two or three sentences, and keep the copy free of dashes.
 */
export const faqHeading = {
  eyebrow: "FAQ",
  title: [{ em: "Simple" }, " answers to the questions people ", { em: "ask" }, " most"],
};

export const faqCategories = [
  { id: "all", label: "All" },
  { id: "general", label: "General" },
  { id: "cards", label: "Cards" },
  { id: "payments", label: "Payments" },
  { id: "security", label: "Security" },
];

export const faqs = [
  {
    category: "general",
    question: "What is StripCard?",
    answer:
      "StripCard lets you create virtual credit cards in seconds and use them anywhere online. Give every subscription, shop or team its own card, set a limit on it, and watch each payment as it happens.",
  },
  {
    category: "general",
    question: "Who can use StripCard?",
    answer:
      "Freelancers, startups and growing businesses in more than 180 countries use StripCard to keep their online spending organised. You only need an email address and a quick identity check to get started.",
  },
  {
    category: "cards",
    question: "How quickly can I create a virtual card?",
    answer:
      "Right away. A new card is ready the moment you create it, with its own number, expiry date and security code, so you can pay with it straight from the app.",
  },
  {
    category: "cards",
    question: "Can I set limits or freeze a card?",
    answer:
      "Yes. Every card can have its own spending limit, be locked to a single merchant, or be frozen and unfrozen in a tap. Deleting a card stops any future charges on it for good.",
  },
  {
    category: "payments",
    question: "Where can I use my StripCard?",
    answer:
      "Anywhere online that accepts card payments: shops, subscriptions, travel sites, ad platforms and software tools. Your card also works in Apple Pay and Google Pay for paying on the go.",
  },
  {
    category: "payments",
    question: "Can I pay in other currencies?",
    answer:
      "Yes. You can pay merchants in their own currency, and the app shows the exchange rate and any fee before you confirm, so there are no surprises on your statement.",
  },
  {
    category: "security",
    question: "How does StripCard keep my payments safe?",
    answer:
      "Your real card details are never shared. Each payment uses a tokenised card number, checkouts are protected by 3-D Secure, and you sign in with your fingerprint or face.",
  },
  {
    category: "security",
    question: "What happens if a card is compromised?",
    answer:
      "Freeze or delete it in a tap and create a new one in seconds. Because every card is separate, your other cards and subscriptions keep working as normal.",
  },
];
