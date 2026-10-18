/**
 * The "About" block under the homepage banner: an intro, three cards and a
 * row of facts. `About` renders straight from this.
 *
 * Every figure here is a placeholder until real numbers are supplied — keep
 * them plausible, and replace them all at once so the cards and the facts
 * never disagree with each other.
 */
export const about = {
  label: "About StripCard",
  /**
   * Read as one sentence: `brand`, then the icon tiles, then `lead` in full
   * colour and `rest` dimmed. `icons` are keys into the icon registry; they
   * take turns in a single tile, in this order. Keep it to four — the cycle's
   * keyframes are timed for four faces.
   */
  intro: {
    brand: "At StripCard",
    icons: ["card", "shield", "chart", "globe"],
    lead: "we're building a virtual card platform designed to simplify how you pay, control and track your money online.",
    rest: "From one-off purchases to team subscriptions, every card is ready in seconds and protected by default.",
  },

  /** Dark card. `strong` pieces are set in full white, the rest dimmed. */
  security: {
    text: [
      { text: "Bank-grade security", strong: true },
      { text: " with tokenised numbers and 3-D Secure, so you can " },
      { text: "pay with confidence,", strong: true },
      { text: " anywhere online.", strong: true },
    ],
    toggle: "Secure mode",
    /**
     * The overlapping badges at the top of the card, one per layer of
     * protection. `icon` names an icon in components/icons; `badge` sets
     * a short mark instead, on the brand colour, to close the stack.
     */
    badges: [
      { icon: "shield", label: "Fraud protection" },
      { icon: "lock", label: "Encrypted card data" },
      { icon: "fingerprint", label: "Biometric sign-in" },
      { icon: "key", label: "Tokenised card numbers" },
      { badge: "3DS", label: "3-D Secure checkout" },
    ],
  },

  /** Picture card: the three StripCards fanned, and a floating caption. */
  visual: {
    caption: "Single-use & recurring cards",
  },

  /** Light card. Each row draws one dot per three units of `value`. */
  audience: {
    value: "50K+",
    label: "Active businesses",
    description: "Teams of every size run their online spending on StripCard.",
    rows: [
      { label: "Freelancers", value: 33 },
      { label: "Startups", value: 40 },
      { label: "Enterprises", value: 35 },
    ],
  },

  facts: {
    title:
      "A few more facts about StripCard, in the numbers our customers count on every day",
    items: [
      { value: "2M+", label: "Virtual cards issued" },
      { value: "99.9%", label: "Platform uptime" },
      { value: "$1B+", label: "Processed every year" },
      { value: "180+", label: "Countries supported" },
    ],
  },
};
