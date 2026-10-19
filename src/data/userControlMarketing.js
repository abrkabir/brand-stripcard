/**
 * The "user control" marketing section on the homepage: your cards and your
 * balance, all in your hands, shown as the dashboard on a screen, the app on a
 * phone and the card in front. `UserControlMarketing` renders straight from
 * this, and takes the phone's total from the dashboard's demo account
 * (data/dashboard).
 */
export const userControlHeading = {
  /**
   * One strong line over the showcase, beside a rippling icon: `strong` in
   * full ink, `rest` quieter. `icon` names an icon in the `icons` registry.
   */
  lead: {
    icon: "shield",
    strong: "No more surprise charges.",
    rest: "Every card, limit and payment sits in one place, so you always know what is going out, where it went and how much is left to spend.",
  },
  eyebrow: "In your control",
  /**
   * The statement under the showcase: the title (a string is plain text,
   * `{ brand }` is set in the brand colour), running on into the description.
   */
  title: ["Your cards and your balance, ", { brand: "all in your control." }],
  description:
    "Check every balance, set a limit on every card and pause one the moment you need to, from your dashboard or the app.",
};

/**
 * What you control, as four stat cards under the statement. Each is a stack
 * of bands, darkest at the top: the title with its icon (`icon` names one in
 * the `icons` registry), two example rows (the value first, what it is
 * after), and a tall panel with one big figure in its middle and a short
 * line under it. `tone` picks the card's colours: "ink", "brand", "soft" or
 * "neutral". Keep figures to claims made elsewhere on the site, and each
 * description to a line or two.
 */
export const userControlStats = [
  {
    tone: "ink",
    icon: "lock",
    title: "Freeze a card",
    rows: [
      { value: "Active", label: "Everyday card" },
      { value: "Frozen", label: "Lost card" },
    ],
    figure: "1 tap",
    description: "Freeze a lost card, or one you want to rest, and turn it back on any time.",
  },
  {
    tone: "brand",
    icon: "sliders",
    title: "Spending limits",
    rows: [
      { value: "$400/mo", label: "Groceries" },
      { value: "$150/mo", label: "Eating out" },
    ],
    figure: "3 ways",
    description: "Cap spend by card, merchant or month and keep your money on plan.",
  },
  {
    tone: "soft",
    icon: "globe",
    title: "Currencies in one balance",
    rows: [
      { value: "€240", label: "Paris" },
      { value: "¥18,000", label: "Tokyo" },
    ],
    figure: "30+",
    description: "Move and spend in any country without the hassle of changing money.",
  },
  {
    tone: "neutral",
    icon: "card",
    title: "Subscriptions and shopping",
    rows: [
      { value: "$10.99/mo", label: "Spotify" },
      { value: "$86.20", label: "Online order" },
    ],
    figure: "180+",
    description: "Subscribe and shop from anywhere in the world, in 180+ countries.",
  },
];

export const userControlShowcase = {
  label:
    "The StripCard dashboard on screen and the app's wallet on a phone, both showing your total balance, the phone with your cards, their limits and which are on, and StripCard cards taking turns in front.",
};
