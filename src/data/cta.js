/**
 * The call to action band. `Cta` renders straight from this, on the homepage
 * (before the FAQ) and at the foot of the About, Services and Use cases
 * pages.
 *
 * `title` is two phrases of pieces, set as one line in the dark band:
 * `accent` pieces are in the brand colour, the rest in white. `card` is the
 * benefit and tags at the top of the tall card on the left. `primary` and
 * `secondary` are the two buttons under the title, and `note` the line
 * under them.
 */
export const cta = {
  title: [
    [{ text: "Pay with Confidence.", accent: true }],
    [{ text: "Spend", accent: true }, { text: " with Control." }],
  ],
  card: {
    label: "Safer online payments",
    tags: ["Instant issue", "Spend limits", "Freeze anytime", "3-D Secure", "Subscriptions", "Global payments"],
  },
  primary: { label: "Join now", href: "/register" },
  secondary: { label: "Talk to us", href: "/contact" },
  note: "Create a virtual card in seconds, set your own limits and pay anywhere online without sharing your real card.",
};
