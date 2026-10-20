import { siAirbnb, siApple, siNetflix, siSpotify, siStarbucks, siUber } from "simple-icons";
// Maya, Daniel and Aisha have square headshots made for round avatars; the
// others' photos are cropped to their faces where they are drawn.
import aisha from "../../public/images/testimonials/customer-aisha-avatar.webp";
import daniel from "../../public/images/testimonials/customer-daniel-avatar.webp";
import marcus from "../../public/images/testimonials/customer-marcus.webp";
import maya from "../../public/images/testimonials/customer-maya-avatar.webp";
import sofia from "../../public/images/testimonials/customer-sofia.webp";

/** A brand's mark (from simple-icons), drawn in the text colour wherever it is used. */
const brand = (icon) => ({ title: icon.title, path: icon.path });

/**
 * Everything the dashboard shows. DEMO DATA: there is no account behind it
 * yet. When the API lands, each export here becomes a request, and the
 * components keep the same shapes.
 */

export const dashboardUser = { name: "Maya Collins", first: "Maya", email: "maya@example.com", avatar: maya };

/* ── Navigation ──────────────────────────────────────────────────────────── */

/**
 * The sidebar, in groups. A group without a `title` sits above the first
 * heading; a `collapsible` group shows as one item, its `title` and `icon`,
 * that opens out to its pages. `icon` names an icon in SectionIcon. Every item
 * but the first opens its own page under /dashboard, built from this list (see
 * app/(dashboard)/dashboard/[section]); `description` is the line that page
 * opens with.
 */
export const dashboardNav = [
  {
    items: [{ label: "Dashboard", href: "/dashboard", icon: "home" }],
  },
  {
    title: "Money management",
    items: [
      { label: "Add Money", href: "/dashboard/add-money", icon: "plusCircle", description: "Top up your balance by card or bank transfer." },
      { label: "Transfer Money", href: "/dashboard/transfer-money", icon: "send", description: "Send money to another StripCard user or a bank account." },
      { label: "Withdraw Money", href: "/dashboard/withdraw-money", icon: "arrowDownCircle", description: "Move money from your balance back to your bank." },
    ],
  },
  {
    title: "Services",
    items: [
      { label: "Virtual Card", href: "/dashboard/virtual-card", icon: "card", description: "Create, fund and manage your virtual cards." },
      { label: "Gift Card", href: "/dashboard/gift-card", icon: "gift", description: "Buy and send gift cards for hundreds of brands." },
      { label: "Transactions", href: "/dashboard/transactions", icon: "dollarSquare", description: "Every payment, top up and transfer, in one place." },
    ],
  },
  {
    title: "Settings",
    icon: "settings",
    collapsible: true,
    items: [
      { label: "My Profile", href: "/dashboard/profile", icon: "userCircle", description: "Your name, contact details and preferences." },
      { label: "KYC Verification", href: "/dashboard/kyc-verification", icon: "shield", description: "Verify your identity to unlock higher limits." },
      { label: "2FA Security", href: "/dashboard/2fa-security", icon: "lock", description: "Turn on two-factor sign-in to protect your account." },
    ],
  },
];

/** Help: at the foot of the sidebar and in the top bar, not in a group. */
export const dashboardHelp = {
  label: "Help",
  href: "/dashboard/help",
  icon: "help",
  description: "Answers to common questions, and a direct line to our team.",
};

/** The premium plan's page: not in the sidebar; search finds it. */
export const dashboardUpgrade = {
  label: "Premium plan",
  href: "/dashboard/upgrade",
  icon: "sparkles",
  description: "Higher limits, more cards and priority support.",
};

/** Every page under /dashboard, by slug: the sidebar's pages, Help and the premium plan. */
export const dashboardPages = [
  ...dashboardNav.flatMap((group) => group.items).filter((item) => item.href !== "/dashboard"),
  dashboardHelp,
  dashboardUpgrade,
].map((item) => ({ ...item, slug: item.href.split("/").pop() }));

/** The top bar's tabs: the places people go most. */
export const dashboardTabs = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Transfer", href: "/dashboard/transfer-money" },
  { label: "Cards", href: "/dashboard/virtual-card" },
  { label: "Transactions", href: "/dashboard/transactions" },
  { label: "Help", href: "/dashboard/help" },
];

export const dashboardNotifications = [
  { id: 1, title: "Payment blocked", text: "Merchant lock stopped a $65.00 charge at the Apple Store.", when: "2 days ago" },
  { id: 2, title: "Money received", text: "Daniel Brooks sent you $50.00.", when: "Today" },
];

/* ── Overview ────────────────────────────────────────────────────────────── */

/**
 * The virtual cards: `purpose` is what each pays for, `limit` the most it may
 * spend in a month and `status` whether it can be used.
 */
export const myCards = [
  {
    id: "subs",
    name: "Subscriptions",
    last4: "7718",
    purpose: "Pays for Netflix, Spotify and 3 more plans",
    limit: 500,
    status: "Active",
  },
  {
    id: "travel",
    name: "Travel",
    last4: "3302",
    purpose: "Flights, hotels and rides on trips abroad",
    limit: 2000,
    status: "Active",
  },
  {
    id: "shop",
    name: "Shopping",
    last4: "4821",
    purpose: "Online shopping, kept to Amazon and eBay",
    limit: 800,
    status: "Frozen",
  },
];

/**
 * The overview's three cards, for adding money, transferring it and gift
 * cards: `kind` picks the icon and what the card shows (the ways money can
 * be added, by `sources` id (see PaymentMark) and how many more, with a
 * `note`; the `contacts` paid most, with a `note`; the `giftCards` held, with
 * what is left on each), `sub` says
 * what it is for, and its foot shows either `latest`, the most recent one
 * (with a person's `avatar` or a brand's `logo`, if it has one), or the
 * `note`.
 */
export const moneyStats = [
  {
    id: "added",
    kind: "add",
    label: "Payment Methods",
    sub: "Ways to add money",
    sources: ["visa", "mastercard", "paypal", "applepay", "googlepay"],
    moreSources: 2,
    note: "Cards arrive instantly, bank transfers in 1 to 2 days",
    noun: "money in",
    action: "Add money",
    href: "/dashboard/add-money",
  },
  {
    id: "sent",
    kind: "transfer",
    label: "Quick Transfer",
    sub: "Send money in a tap",
    contacts: [
      { name: "Daniel Brooks", avatar: daniel },
      { name: "Aisha Bello", avatar: aisha },
      { name: "Sofia Lindqvist", avatar: sofia },
      { name: "Marcus Reid", avatar: marcus },
    ],
    note: "Free and instant between StripCard users",
    noun: "transfers",
    action: "Transfer money",
    href: "/dashboard/transfer-money",
  },
  {
    id: "gifts",
    kind: "gift",
    label: "Gift Cards",
    sub: "Give or spend them",
    giftCards: [
      { brand: "Netflix", logo: brand(siNetflix), balance: 50, note: "Expires Dec 2027" },
      { brand: "Starbucks", logo: brand(siStarbucks), balance: 18.4, note: "Expires Mar 2027" },
    ],
    latest: { text: "Last used, Starbucks gift card", amount: 5.4, logo: brand(siStarbucks) },
    noun: "gift card activity",
    action: "Send a gift card",
    href: "/dashboard/gift-card",
  },
];

/** The wallet: its total balance. */
export const wallet = {
  balance: 17643.41,
};

/**
 * Money added to and withdrawn from the wallet each day, a month at a time,
 * newest first, for the overview's chart: `added[i]` and `withdrawn[i]` are
 * day i + 1's totals in dollars. The current month runs to today.
 */
export const moneyFlow = [
  {
    id: "2026-10",
    label: "October 2026",
    short: "Oct",
    year: 2026,
    added: [290, 250, 426, 219, 344, 259, 153, 229, 121, 381, 141, 165, 283, 443, 238, 418],
    withdrawn: [33, 39, 61, 45, 53, 64, 39, 63, 68, 72, 25, 32, 46, 48, 44, 18],
  },
  {
    id: "2026-09",
    label: "September 2026",
    short: "Sep",
    year: 2026,
    added: [
      88, 110, 80, 94, 95, 50, 51, 159, 99, 104, 225, 142, 185, 239, 124, 60, 98, 116, 91, 125, 135,
      71, 180, 162, 187, 71, 175, 108, 119, 121
    ],
    withdrawn: [
      22, 27, 33, 42, 40, 50, 16, 32, 47, 33, 35, 12, 19, 14, 22, 26, 12, 21, 25, 51, 95, 19, 38,
      15, 25, 11, 8, 29, 15, 18
    ],
  },
  {
    id: "2026-08",
    label: "August 2026",
    short: "Aug",
    year: 2026,
    added: [
      97, 169, 176, 201, 94, 91, 127, 69, 108, 51, 90, 68, 88, 118, 189, 164, 73, 108, 82, 301, 132,
      117, 112, 108, 139, 142, 93, 188, 144, 188, 153
    ],
    withdrawn: [
      25, 33, 40, 22, 44, 47, 49, 24, 19, 77, 46, 22, 27, 20, 34, 39, 26, 52, 19, 56, 61, 25, 50,
      39, 49, 19, 26, 62, 29, 22, 17
    ],
  },
];


/**
 * Where the cards have been used: the countries paid in, most used first (by
 * ISO code, with where to pin each on the map), how many places, the kinds of
 * place and the services paid most (`icon` names an icon, `logo` is a brand's
 * mark, `count` how many payments), and how many countries the cards work in
 * at all.
 */
export const coverage = {
  places: 48,
  worldwide: 180,
  countries: [
    { code: "US", name: "United States", lat: 39, lon: -98 },
    { code: "GB", name: "United Kingdom", lat: 52.5, lon: -1.5 },
    { code: "FR", name: "France", lat: 46.5, lon: 2.5 },
    { code: "AE", name: "United Arab Emirates", lat: 24, lon: 54.4 },
    { code: "JP", name: "Japan", lat: 36.2, lon: 138.3 },
    { code: "CA", name: "Canada", lat: 54, lon: -106 },
    { code: "MX", name: "Mexico", lat: 23.5, lon: -102 },
    { code: "BR", name: "Brazil", lat: -10, lon: -52 },
    { code: "ZA", name: "South Africa", lat: -29, lon: 24.5 },
    { code: "IN", name: "India", lat: 22, lon: 79 },
    { code: "SG", name: "Singapore", lat: 1.35, lon: 103.8 },
    { code: "AU", name: "Australia", lat: -25, lon: 134 },
  ],
  spots: [
    { label: "Coffee shops", icon: "coffee", count: 14 },
    { label: "Fuel stations", icon: "fuel", count: 6 },
    { label: "Apple Pay", logo: brand(siApple) },
    { label: "Netflix", logo: brand(siNetflix) },
    { label: "Spotify", logo: brand(siSpotify) },
    { label: "Airbnb", logo: brand(siAirbnb) },
  ],
};

export const historyFilters = [
  { id: "all", label: "All" },
  { id: "in", label: "Money in" },
  { id: "out", label: "Money out" },
];

/**
 * Every transaction, newest first, for the transactions page: people (with a
 * photo) and merchants (with their logo). `kind` says what it was and `card` which card paid (none for
 * money moved through the wallet). `amount` is positive for money in, and
 * `status` is completed, pending, or blocked (a card's controls stopped it).
 */
export const history = [
  {
    id: "h1",
    name: "Daniel Brooks",
    avatar: daniel,
    kind: "Money received",
    card: null,
    date: "16 Oct 2026",
    time: "10:30 AM",
    amount: 50,
    status: "completed",
  },
  {
    id: "h2",
    name: "Spotify",
    logo: brand(siSpotify),
    kind: "Subscription",
    card: { name: "Subscriptions", last4: "7718" },
    date: "15 Oct 2026",
    time: "9:12 AM",
    amount: -10.99,
    status: "completed",
  },
  {
    id: "h3",
    name: "Aisha Bello",
    avatar: aisha,
    kind: "Money sent",
    card: null,
    date: "15 Oct 2026",
    time: "12:00 PM",
    amount: -35,
    status: "completed",
  },
  {
    id: "h4",
    name: "Apple Store",
    logo: brand(siApple),
    kind: "Online purchase",
    card: { name: "Shopping", last4: "4821" },
    date: "14 Oct 2026",
    time: "4:45 PM",
    amount: -65,
    status: "blocked",
  },
  {
    id: "h5",
    name: "Uber",
    logo: brand(siUber),
    kind: "Ride",
    card: { name: "Travel", last4: "3302" },
    date: "13 Oct 2026",
    time: "6:40 PM",
    amount: -24.6,
    status: "pending",
  },
  {
    id: "h6",
    name: "Sofia Lindqvist",
    avatar: sofia,
    kind: "Money received",
    card: null,
    date: "12 Oct 2026",
    time: "3:15 PM",
    amount: 120,
    status: "completed",
  },
];

/**
 * Adding money (the Add Money page). `wallet` is the wallet's currency, what
 * every top-up lands as. `gateways` are the ways to pay in, each with its fee
 * (a `fixed` part plus a `percent` share of the amount added) and how soon
 * the money arrives; a gateway's id is also its mark (see PaymentMark), but
 * for the bank. `currencies` can be paid in, each with its `rate`: how many US
 * dollars one unit buys. A quoted rate holds for `rateLock` seconds, then a
 * fresh one is quoted. `limits` cap top-ups, with how much of each is used;
 * `quick` are amounts to pick from.
 */
export const addMoney = {
  wallet: "USD",
  gateways: [
    { id: "paypal", name: "PayPal", fixed: 2, percent: 0.01, arrives: "Arrives instantly" },
    { id: "visa", name: "Visa", fixed: 0, percent: 0.015, arrives: "Arrives instantly" },
    { id: "mastercard", name: "Mastercard", fixed: 0, percent: 0.015, arrives: "Arrives instantly" },
    { id: "applepay", name: "Apple Pay", fixed: 0, percent: 0.015, arrives: "Arrives instantly" },
    { id: "googlepay", name: "Google Pay", fixed: 0, percent: 0.015, arrives: "Arrives instantly" },
    { id: "bank", name: "Bank transfer", fixed: 0, percent: 0, arrives: "Arrives in 1 to 2 days" },
  ],
  currencies: [
    { code: "USD", rate: 1 },
    { code: "EUR", rate: 1.08 },
    { code: "GBP", rate: 1.27 },
  ],
  rateLock: 30,
  limits: {
    min: 10,
    max: 1000,
    daily: 10000,
    dailyUsed: 0,
    dailyReset: "Resets at midnight",
    monthly: 50000,
    monthlyUsed: 4360,
    monthlyReset: "Resets on 1 Nov",
  },
  quick: [50, 100, 250, 500],
};
