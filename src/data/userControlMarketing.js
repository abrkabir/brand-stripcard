/**
 * The "user control" marketing section on the homepage: your cards and your
 * balance, all in your hands, shown as the dashboard on a screen, the app on a
 * phone and the card in front. `UserControlMarketing` renders straight from
 * this, and takes the phone's total from the dashboard's demo account
 * (data/dashboard).
 */
export const userControlHeading = {
  eyebrow: "In your control",
  /**
   * The statement under the showcase: the title (a string is plain text,
   * `{ brand }` is set in the brand colour), running on into the description.
   */
  title: ["Your cards and your balance, ", { brand: "all in your control." }],
  description:
    "Check every balance, set a limit on every card and pause one the moment you need to, from your dashboard or the app.",
  /** What you control, as badges in staggered rows. `icon` names an icon in the `icons` registry. */
  badges: [
    [{ label: "Freeze in a tap", icon: "lock" }],
    [
      { label: "Monthly limits", icon: "sliders" },
      { label: "Merchant lock", icon: "shield" },
    ],
    [
      { label: "Virtual cards", icon: "card" },
      { label: "Live balances", icon: "chart" },
      { label: "30+ currencies", icon: "globe" },
    ],
  ],
};

export const userControlShowcase = {
  label:
    "The StripCard dashboard on screen and the app's wallet on a phone, both showing your total balance, the phone with your cards, their limits and which are on, and the orange StripCard card in front.",
  /** The phone: the wallet's ID, under the balance. */
  phone: {
    walletId: "4829 1037 55",
  },
};
