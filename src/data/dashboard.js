import {
  siAirbnb,
  siApple,
  siBankofamerica,
  siChase,
  siDoordash,
  siIkea,
  siNetflix,
  siNike,
  siPlaystation,
  siSpotify,
  siStarbucks,
  siSteam,
  siTarget,
  siUber,
} from "simple-icons";
// Maya, Daniel and Aisha have square headshots made for round avatars; the
// others' photos are cropped to their faces where they are drawn.
import cardBusiness from "../../public/images/assets/cards/card-business-plain.webp";
import cardOrange from "../../public/images/assets/cards/card-orange-plain.webp";
import cardPlatinum from "../../public/images/assets/cards/card-platinum-plain.webp";
import cardSilver from "../../public/images/assets/cards/card-silver-plain.webp";
import aisha from "../../public/images/testimonials/customer-aisha-avatar.webp";
import daniel from "../../public/images/testimonials/customer-daniel-avatar.webp";
import marcus from "../../public/images/testimonials/customer-marcus.webp";
import maya from "../../public/images/testimonials/customer-maya-avatar.webp";
import sofia from "../../public/images/testimonials/customer-sofia.webp";

/** A brand's mark (from simple-icons), drawn in the text colour wherever it is used. */
const brand = (icon) => ({ title: icon.title, path: icon.path });

/** A brand's mark with its own colour, for a mark drawn on the brand's colour (a gift card, a bank). */
const mark = (icon) => ({
  title: icon.title,
  path: icon.path,
  hex: `#${icon.hex}`,
});

/**
 * Everything the dashboard shows. DEMO DATA: there is no account behind it
 * yet. When the API lands, each export here becomes a request, and the
 * components keep the same shapes.
 */

export const dashboardUser = {
  name: "Maya Collins",
  first: "Maya",
  email: "maya@example.com",
  avatar: maya,
};

/* ── Navigation ──────────────────────────────────────────────────────────── */

/**
 * The sidebar, in groups. A group without a `title` sits above the first
 * heading; a `collapsible` group shows as one item, its `title` and `icon`,
 * that opens out to its pages. `icon` names an icon in SectionIcon. Every item
 * but the first opens its own page under /dashboard (each its own route in
 * app/(dashboard)/dashboard); `description` is that page's description, and
 * the line search shows for it.
 */
export const dashboardNav = [
  {
    items: [{ label: "Dashboard", href: "/dashboard", icon: "home" }],
  },
  {
    title: "Money management",
    items: [
      {
        label: "Add Money",
        href: "/dashboard/add-money",
        icon: "plusCircle",
        description: "Top up your balance by card or bank transfer.",
      },
      {
        label: "Transfer Money",
        href: "/dashboard/transfer-money",
        icon: "send",
        description: "Send money to another StripCard user or a bank account.",
      },
      {
        label: "Withdraw Money",
        href: "/dashboard/withdraw-money",
        icon: "arrowDownCircle",
        description: "Move money from your balance back to your bank.",
      },
    ],
  },
  {
    title: "Services",
    items: [
      {
        label: "Virtual Card",
        href: "/dashboard/virtual-card",
        icon: "card",
        description: "Create, fund and manage your virtual cards.",
      },
      {
        label: "Gift Card",
        href: "/dashboard/gift-card",
        icon: "gift",
        description: "Buy and send gift cards for hundreds of brands.",
      },
      {
        label: "Transactions",
        href: "/dashboard/transactions",
        icon: "dollarSquare",
        description: "Every payment, top up and transfer, in one place.",
      },
    ],
  },
  {
    title: "Settings",
    icon: "settings",
    collapsible: true,
    items: [
      {
        label: "My Profile",
        href: "/dashboard/profile",
        icon: "userCircle",
        description: "Your name, contact details and preferences.",
      },
      {
        label: "KYC Verification",
        href: "/dashboard/kyc-verification",
        icon: "shield",
        description: "Verify your identity to unlock higher limits.",
      },
      {
        label: "2FA Security",
        href: "/dashboard/2fa-security",
        icon: "lock",
        description: "Turn on two-factor sign-in to protect your account.",
      },
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
  ...dashboardNav
    .flatMap((group) => group.items)
    .filter((item) => item.href !== "/dashboard"),
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
  {
    id: 1,
    title: "Payment blocked",
    text: "Merchant lock stopped a $65.00 charge at the Apple Store.",
    when: "2 days ago",
  },
  {
    id: 2,
    title: "Money received",
    text: "Daniel Brooks sent you $50.00.",
    when: "Today",
  },
];

/* ── Overview ────────────────────────────────────────────────────────────── */

/**
 * The virtual cards: `purpose` is what each pays for, `limit` the most it may
 * spend in a month, `spent` what it has spent this month, `design` its look
 * (see cardDesigns), `network` Visa or Mastercard, `balance` the money on it
 * and `status` whether it can be used. `number` and `cvv` are made up, for
 * the details a card shows when opened.
 */
export const myCards = [
  {
    id: "subs",
    name: "Subscriptions",
    last4: "7718",
    network: "Visa",
    balance: 313.6,
    number: "4532 8814 2093 7718",
    cvv: "381",
    expires: "08/28",
    design: "orange",
    purpose: "Pays for Netflix, Spotify and 3 more plans",
    limit: 500,
    spent: 186.4,
    status: "Active",
  },
  {
    id: "travel",
    name: "Travel",
    last4: "3302",
    network: "Mastercard",
    balance: 760,
    number: "5412 7539 0061 3302",
    cvv: "604",
    expires: "11/27",
    design: "business",
    purpose: "Flights, hotels and rides on trips abroad",
    limit: 2000,
    spent: 1240,
    status: "Active",
  },
  {
    id: "shop",
    name: "Shopping",
    last4: "4821",
    network: "Mastercard",
    balance: 487.25,
    number: "5236 1180 4471 4821",
    cvv: "927",
    expires: "02/28",
    design: "silver",
    purpose: "Online shopping, kept to Amazon and eBay",
    limit: 800,
    spent: 312.75,
    status: "Frozen",
  },
];

/**
 * The looks a card can take: its face (the card art with the network's mark
 * taken off, so a card of any design can be Visa or Mastercard), the colour
 * that reads on it (`ink`, light text on the orange and dark cards, dark on
 * silver) and its back, a gradient in the face's colours.
 */
export const cardDesigns = [
  {
    id: "orange",
    name: "Sunset",
    image: cardOrange,
    ink: "light",
    back: "linear-gradient(135deg, #ff8a3d 0%, #ff5a36 55%, #ff4545 100%)",
  },
  {
    id: "business",
    name: "Ember",
    image: cardBusiness,
    ink: "light",
    back: "radial-gradient(120% 140% at 85% 100%, #c2541a 0%, #3a1a0c 45%, #120806 100%)",
  },
  {
    id: "silver",
    name: "Silver",
    image: cardSilver,
    ink: "dark",
    back: "linear-gradient(135deg, #f4f4f5 0%, #e4e4e7 55%, #d4d4d8 100%)",
  },
  {
    id: "platinum",
    name: "Platinum",
    image: cardPlatinum,
    ink: "light",
    back: "radial-gradient(120% 140% at 80% 100%, #b42fd6 0%, #4a1173 42%, #07050b 100%)",
  },
];

/**
 * Making a card: the most cards the plan allows, the networks a card can run
 * on, the range a monthly limit must fall in, the quick limits offered, the
 * quick amounts offered for adding money, and what a card costs.
 */
export const cardRules = {
  max: 5,
  networks: ["Visa", "Mastercard"],
  minLimit: 50,
  maxLimit: 5000,
  quick: [250, 500, 1000, 2500],
  topUps: [25, 50, 100, 250],
  fee: "Free",
};

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
      {
        brand: "Netflix",
        logo: brand(siNetflix),
        balance: 50,
        note: "Expires Dec 2027",
      },
      {
        brand: "Starbucks",
        logo: brand(siStarbucks),
        balance: 18.4,
        note: "Expires Mar 2027",
      },
    ],
    latest: {
      text: "Last used, Starbucks gift card",
      amount: 5.4,
      logo: brand(siStarbucks),
    },
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
    added: [
      290, 250, 426, 219, 344, 259, 153, 229, 121, 381, 141, 165, 283, 443, 238,
      418,
    ],
    withdrawn: [33, 39, 61, 45, 53, 64, 39, 63, 68, 72, 25, 32, 46, 48, 44, 18],
  },
  {
    id: "2026-09",
    label: "September 2026",
    short: "Sep",
    year: 2026,
    added: [
      88, 110, 80, 94, 95, 50, 51, 159, 99, 104, 225, 142, 185, 239, 124, 60,
      98, 116, 91, 125, 135, 71, 180, 162, 187, 71, 175, 108, 119, 121,
    ],
    withdrawn: [
      22, 27, 33, 42, 40, 50, 16, 32, 47, 33, 35, 12, 19, 14, 22, 26, 12, 21,
      25, 51, 95, 19, 38, 15, 25, 11, 8, 29, 15, 18,
    ],
  },
  {
    id: "2026-08",
    label: "August 2026",
    short: "Aug",
    year: 2026,
    added: [
      97, 169, 176, 201, 94, 91, 127, 69, 108, 51, 90, 68, 88, 118, 189, 164,
      73, 108, 82, 301, 132, 117, 112, 108, 139, 142, 93, 188, 144, 188, 153,
    ],
    withdrawn: [
      25, 33, 40, 22, 44, 47, 49, 24, 19, 77, 46, 22, 27, 20, 34, 39, 26, 52,
      19, 56, 61, 25, 50, 39, 49, 19, 26, 62, 29, 22, 17,
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
    {
      id: "paypal",
      name: "PayPal",
      fixed: 2,
      percent: 0.01,
      arrives: "Arrives instantly",
    },
    {
      id: "visa",
      name: "Visa",
      fixed: 0,
      percent: 0.015,
      arrives: "Arrives instantly",
    },
    {
      id: "mastercard",
      name: "Mastercard",
      fixed: 0,
      percent: 0.015,
      arrives: "Arrives instantly",
    },
    {
      id: "applepay",
      name: "Apple Pay",
      fixed: 0,
      percent: 0.015,
      arrives: "Arrives instantly",
    },
    {
      id: "googlepay",
      name: "Google Pay",
      fixed: 0,
      percent: 0.015,
      arrives: "Arrives instantly",
    },
    {
      id: "bank",
      name: "Bank transfer",
      fixed: 0,
      percent: 0,
      arrives: "Arrives in 1 to 2 days",
    },
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

/* ── Profile ─────────────────────────────────────────────────────────────── */

/**
 * The profile page (see Profile): the account holder's details, as the form
 * opens with them. DEMO DATA, the same person as `dashboardUser`. The email
 * is shown but not edited here; changing it is a support request.
 *
 * `countries` are the ones the country picker offers, each with its dialling
 * code; every one has a flag in Flag.
 */
export const profile = {
  first: "Maya",
  last: "Collins",
  email: dashboardUser.email,
  country: "US",
  phone: "415 555 0132",
  address: "2140 Fillmore Street",
  city: "San Francisco",
  state: "CA",
  zip: "94115",
  memberSince: "March 2024",
  plan: "Personal",
  verified: true,
  cards: 3,
};

/**
 * The membership section: the plan the account is on, what it includes, and
 * the account's own facts. DEMO DATA. `upgrade` is the premium plan's pitch,
 * as the premium page puts it (see `dashboardUpgrade`).
 */
export const membership = {
  plan: "Personal",
  price: "Free",
  accountId: "SC-4829-1037",
  perks: [
    "Up to 5 virtual cards",
    "Spending limits on every card",
    "Pay in 30+ currencies",
    "Freeze any card in a tap",
  ],
  upgrade: {
    title: "Premium",
    text: "Higher limits, more cards and priority support.",
    href: "/dashboard/upgrade",
  },
};

export const profileCountries = [
  { code: "US", name: "United States", dial: "+1" },
  { code: "GB", name: "United Kingdom", dial: "+44" },
  { code: "CA", name: "Canada", dial: "+1" },
  { code: "AU", name: "Australia", dial: "+61" },
  { code: "FR", name: "France", dial: "+33" },
  { code: "AE", name: "United Arab Emirates", dial: "+971" },
  { code: "JP", name: "Japan", dial: "+81" },
  { code: "MX", name: "Mexico", dial: "+52" },
  { code: "BR", name: "Brazil", dial: "+55" },
  { code: "ZA", name: "South Africa", dial: "+27" },
  { code: "IN", name: "India", dial: "+91" },
  { code: "SG", name: "Singapore", dial: "+65" },
];

/* ── Identity checks (KYC) ───────────────────────────────────────────────── */

/**
 * Checking who the account holder is. DEMO DATA: the account starts at the
 * first level, its identity not checked yet (`status` is "unverified", then
 * "review" once the documents are in, then "verified").
 *
 *   levels     what an account can be, in order
 *   limits     what each level allows, a row per limit
 *   documents  the IDs we take, with the `sides` to photograph and the icon
 *              (by name, see icons) each is shown with
 *   review     how long a check usually takes
 */
export const kyc = {
  status: "unverified",
  review: "about 10 minutes",
  levels: [
    { id: "basic", name: "Basic", text: "Email and phone confirmed" },
    { id: "verified", name: "Verified", text: "Photo ID and a selfie checked" },
  ],
  limits: [
    { label: "Monthly card spend", basic: "$1,000", verified: "$50,000" },
    { label: "Virtual cards", basic: "5", verified: "20" },
    { label: "Daily withdrawals", basic: "$500", verified: "$10,000" },
    { label: "Sending abroad", basic: "Not allowed", verified: "Allowed" },
  ],
  documents: [
    {
      id: "passport",
      label: "Passport",
      text: "The photo page",
      sides: ["Photo page"],
      icon: "passport",
    },
    {
      id: "licence",
      label: "Driving licence",
      text: "Front and back",
      sides: ["Front", "Back"],
      icon: "car",
    },
    {
      id: "national",
      label: "National ID card",
      text: "Front and back",
      sides: ["Front", "Back"],
      icon: "idCard",
    },
  ],
};

/* ── Sign-in security (2FA) ──────────────────────────────────────────────── */

/**
 * Two-factor sign-in with an authenticator app. DEMO DATA: it starts off.
 * `secret` is the key the app is set up with (base32, shown as a QR code and
 * in groups of four).
 */
export const security = {
  issuer: "StripCard",
  secret: "K7QX2M4PLN6RW3ZD",
};

/* ── Card holder ─────────────────────────────────────────────────────────── */

/**
 * The person the virtual cards are issued to, as the card issuer needs them.
 * DEMO DATA: the same person as the profile. `dob` is as typed ("MM / DD /
 * YYYY"); `idImage` is the ID photo sent before (only its name is kept, so
 * there is no preview).
 */
export const cardHolder = {
  first: profile.first,
  last: profile.last,
  nameOnCard: "Maya Collins",
  dob: "04 / 12 / 1991",
  email: profile.email,
  idType: "national",
  idNumber: "243456345645",
  idImage: {
    name: "national-id-front.jpg",
    size: 1468006,
    type: "image/jpeg",
    note: "Saved document, sent March 2024",
  },
  purpose: "personal",
  employment: "employed",
  occupation: "designer",
  address: profile.address,
  city: profile.city,
  state: profile.state,
  zip: profile.zip,
  country: profile.country,
  phone: profile.phone,
};

/** The choices the card holder form offers, as { value, label }. */
export const cardHolderOptions = {
  idTypes: [
    { value: "national", label: "National ID card" },
    { value: "passport", label: "Passport" },
    { value: "licence", label: "Driving licence" },
  ],
  purposes: [
    { value: "personal", label: "Personal spending" },
    { value: "business", label: "Business expenses" },
    { value: "travel", label: "Travel" },
    { value: "shopping", label: "Online shopping" },
    { value: "subscriptions", label: "Subscriptions" },
  ],
  employment: [
    { value: "employed", label: "Employed" },
    { value: "self", label: "Self employed" },
    { value: "student", label: "Student" },
    { value: "retired", label: "Retired" },
    { value: "none", label: "Not working" },
  ],
  occupations: [
    { value: "designer", label: "Designer" },
    { value: "engineer", label: "Engineer" },
    { value: "developer", label: "Software developer" },
    { value: "teacher", label: "Teacher" },
    { value: "healthcare", label: "Healthcare worker" },
    { value: "finance", label: "Finance professional" },
    { value: "sales", label: "Sales and marketing" },
    { value: "owner", label: "Business owner" },
    { value: "student", label: "Student" },
    { value: "other", label: "Something else" },
  ],
};

/* ── Transfer money ──────────────────────────────────────────────────────── */

/**
 * Sending money: to another StripCard user (free, and there at once) or to a
 * bank account (a flat `bankFee`, a day or two). DEMO DATA.
 *
 *   contacts  the people paid most, to pick in a tap, each with a username
 *   banks     the banks a transfer can go to, as select options
 *   limits    the least and most one transfer can be, and the daily limit
 *   quick     the quick amounts offered
 *   recent    the latest transfers, newest first; `amount` below 0 was sent
 */
export const transfer = {
  contacts: [
    { id: "daniel", name: "Daniel Brooks", handle: "@danielb", avatar: daniel },
    { id: "aisha", name: "Aisha Bello", handle: "@aishab", avatar: aisha },
    { id: "sofia", name: "Sofia Lindqvist", handle: "@sofial", avatar: sofia },
    { id: "marcus", name: "Marcus Reid", handle: "@marcusr", avatar: marcus },
  ],
  banks: [
    { value: "chase", label: "Chase" },
    { value: "boa", label: "Bank of America" },
    { value: "wells", label: "Wells Fargo" },
    { value: "citi", label: "Citibank" },
    { value: "capitalone", label: "Capital One" },
    { value: "other", label: "Another bank" },
  ],
  bankFee: 1.5,
  limits: {
    min: 1,
    max: 5000,
    daily: 10000,
    dailyUsed: 35,
    dailyReset: "Resets at midnight",
  },
  quick: [25, 50, 100, 250],
  recent: [
    {
      id: "r1",
      name: "Daniel Brooks",
      avatar: daniel,
      amount: 50,
      when: "Today",
    },
    {
      id: "r2",
      name: "Aisha Bello",
      avatar: aisha,
      amount: -35,
      when: "15 Oct",
    },
    {
      id: "r3",
      name: "Sofia Lindqvist",
      avatar: sofia,
      amount: 120,
      when: "12 Oct",
    },
    {
      id: "r4",
      name: "Marcus Reid",
      avatar: marcus,
      amount: -80,
      when: "9 Oct",
    },
  ],
};

/* ── Withdraw money ──────────────────────────────────────────────────────── */

/**
 * Taking money out of the wallet to a bank account. DEMO DATA.
 *
 *   accounts  the bank accounts linked to the wallet, each with its bank's
 *             mark (simple-icons, with the bank's colour)
 *   speeds    how soon it arrives, and what that costs, as a share of the
 *             amount, taken from it
 *   limits    the least and most one withdrawal can be, and the daily and
 *             monthly limits
 *   quick     the quick amounts offered
 */
export const withdraw = {
  accounts: [
    {
      id: "chase",
      bank: "Chase",
      type: "Checking",
      last4: "6604",
      logo: mark(siChase),
    },
    {
      id: "boa",
      bank: "Bank of America",
      type: "Savings",
      last4: "0937",
      logo: mark(siBankofamerica),
    },
  ],
  speeds: [
    {
      id: "standard",
      label: "Standard",
      text: "1 to 2 business days",
      percent: 0,
    },
    {
      id: "instant",
      label: "Instant",
      text: "In about 30 minutes",
      percent: 0.015,
    },
  ],
  limits: {
    min: 10,
    max: 5000,
    daily: 5000,
    dailyUsed: 0,
    dailyReset: "Resets at midnight",
    monthly: 20000,
    monthlyUsed: 750,
    monthlyReset: "Resets on 1 Nov",
  },
  quick: [100, 250, 500, 1000],
};

/* ── Gift cards ──────────────────────────────────────────────────────────── */

/**
 * The gift card shop and the cards held. DEMO DATA.
 *
 *   categories  what the shop can be narrowed to
 *   brands      the gift cards on sale: each brand's mark (simple-icons, with
 *               its colour, the card's ground), its category, the amounts
 *               offered, and where it is used
 *   min, max    the least and most a card of another amount can hold
 *   held        the cards bought, by brand id: what is left on each of what
 *               it held, its code and when it expires
 */
export const giftCards = {
  categories: ["Entertainment", "Gaming", "Shopping", "Food", "Travel"],
  brands: [
    {
      id: "netflix",
      name: "Netflix",
      category: "Entertainment",
      logo: mark(siNetflix),
      amounts: [25, 50, 100],
      use: "netflix.com/redeem",
    },
    {
      id: "spotify",
      name: "Spotify",
      category: "Entertainment",
      logo: mark(siSpotify),
      amounts: [10, 30, 60],
      use: "spotify.com/redeem",
    },
    {
      id: "steam",
      name: "Steam",
      category: "Gaming",
      logo: mark(siSteam),
      amounts: [20, 50, 100],
      use: "the Steam app",
    },
    {
      id: "playstation",
      name: "PlayStation",
      category: "Gaming",
      logo: mark(siPlaystation),
      amounts: [25, 50, 100],
      use: "the PlayStation Store",
    },
    {
      id: "apple",
      name: "Apple",
      category: "Shopping",
      logo: mark(siApple),
      amounts: [25, 50, 100, 200],
      use: "the App Store or apple.com",
    },
    {
      id: "nike",
      name: "Nike",
      category: "Shopping",
      logo: mark(siNike),
      amounts: [50, 100, 200],
      use: "nike.com",
    },
    {
      id: "target",
      name: "Target",
      category: "Shopping",
      logo: mark(siTarget),
      amounts: [25, 50, 100],
      use: "target.com",
    },
    {
      id: "ikea",
      name: "IKEA",
      category: "Shopping",
      logo: mark(siIkea),
      amounts: [50, 100, 250],
      use: "ikea.com",
    },
    {
      id: "starbucks",
      name: "Starbucks",
      category: "Food",
      logo: mark(siStarbucks),
      amounts: [10, 25, 50],
      use: "the Starbucks app",
    },
    {
      id: "doordash",
      name: "DoorDash",
      category: "Food",
      logo: mark(siDoordash),
      amounts: [25, 50, 100],
      use: "the DoorDash app",
    },
    {
      id: "uber",
      name: "Uber",
      category: "Travel",
      logo: mark(siUber),
      amounts: [25, 50, 100],
      use: "the Uber app",
    },
    {
      id: "airbnb",
      name: "Airbnb",
      category: "Travel",
      logo: mark(siAirbnb),
      amounts: [50, 100, 250],
      use: "airbnb.com",
    },
  ],
  min: 10,
  max: 500,
  held: [
    {
      id: "g1",
      brand: "netflix",
      balance: 50,
      value: 50,
      code: "NFLX8H2KQW715PZD",
      expires: "Dec 2027",
    },
    {
      id: "g2",
      brand: "starbucks",
      balance: 18.4,
      value: 25,
      code: "SBUX4M9TJ2XR7LQA",
      expires: "Mar 2027",
    },
  ],
};

/* ── Help ────────────────────────────────────────────────────────────────── */

/**
 * The Help page: the account's support tickets, and the ways to reach the
 * support team. DEMO DATA.
 *
 *   contact     the support email and phone, and when the phone is answered
 *   socials     support on social media: each with its icon (by name, see
 *               icons) and the handle shown
 *   categories  what a ticket can be about, as select options, each with
 *               the icon its row shows
 *   priorities  how urgent a ticket is
 *   statuses    where a ticket stands: open (with the team), answered
 *               ("Replied": the team has replied, over to you) or closed
 *   tickets     the account's tickets, newest first: the thread of messages
 *               on each, `unread` when the latest reply is still to be read
 */
export const help = {
  contact: {
    email: "support@stripcard.com",
    emailHref: "mailto:support@stripcard.com",
    phone: "+1 415 555 0142",
    phoneHref: "tel:+14155550142",
    hours: "Every day, 8 AM to 10 PM",
  },
  socials: [
    {
      id: "whatsapp",
      label: "WhatsApp",
      handle: "+1 415 555 0142",
      icon: "whatsapp",
      href: "https://wa.me/14155550142",
    },
    {
      id: "x",
      label: "X",
      handle: "@StripCardHelp",
      icon: "x",
      href: "https://x.com",
    },
    {
      id: "facebook",
      label: "Messenger",
      handle: "StripCard Support",
      icon: "facebook",
      href: "https://facebook.com",
    },
    {
      id: "instagram",
      label: "Instagram",
      handle: "@stripcard",
      icon: "instagram",
      href: "https://instagram.com",
    },
  ],
  categories: [
    { value: "cards", label: "A card or a payment", icon: "card" },
    { value: "money", label: "Adding or sending money", icon: "dollarSquare" },
    { value: "account", label: "My account", icon: "userCircle" },
    { value: "security", label: "Something looks wrong", icon: "shield" },
    { value: "other", label: "Something else", icon: "help" },
  ],
  priorities: [
    { value: "low", label: "Low" },
    { value: "normal", label: "Normal" },
    { value: "urgent", label: "Urgent" },
  ],
  statuses: [
    { value: "open", label: "Open" },
    { value: "answered", label: "Replied" },
    { value: "closed", label: "Closed" },
  ],
  tickets: [
    {
      id: "SC-1048",
      subject: "Travel card declined at a hotel",
      category: "cards",
      priority: "urgent",
      status: "answered",
      unread: true,
      opened: "22 Oct",
      updated: "2 hours ago",
      messages: [
        {
          from: "me",
          text: "My Travel card ending 3302 was declined when I checked in at a hotel in Lisbon last night. It has money on it and is not frozen.",
          when: "22 Oct, 11:40 PM",
        },
        {
          from: "support",
          name: "Ava",
          text: "Sorry about that, Maya. The hotel asked for a $1,200 hold, which is more than this card's $2,000 monthly limit has left this month. You can raise the limit from Virtual Card, or pay with your Subscriptions card for now.",
          when: "Today, 8:15 AM",
        },
      ],
    },
    {
      id: "SC-1045",
      subject: "Bank transfer has not arrived",
      category: "money",
      priority: "normal",
      status: "open",
      opened: "20 Oct",
      updated: "Yesterday",
      messages: [
        {
          from: "me",
          text: "I added $500 by bank transfer on Monday and it is still not in my wallet.",
          when: "20 Oct, 3:12 PM",
        },
        {
          from: "support",
          name: "Daniel",
          text: "Thanks, I have found the transfer. Your bank sent it late on Monday, so it should land today. I will keep this ticket open until it does.",
          when: "Yesterday, 10:02 AM",
        },
      ],
    },
    {
      id: "SC-1041",
      subject: "Change the email on my account",
      category: "account",
      priority: "low",
      status: "open",
      opened: "17 Oct",
      updated: "17 Oct",
      messages: [
        {
          from: "me",
          text: "Please change my email to my work address. I can confirm it from both inboxes.",
          when: "17 Oct, 9:30 AM",
        },
      ],
    },
    {
      id: "SC-1037",
      subject: "Refund for a double Spotify charge",
      category: "cards",
      priority: "normal",
      status: "closed",
      opened: "12 Oct",
      updated: "14 Oct",
      messages: [
        {
          from: "me",
          text: "Spotify charged my Subscriptions card twice this month, $10.99 each time.",
          when: "12 Oct, 6:05 PM",
        },
        {
          from: "support",
          name: "Ava",
          text: "You are right, the second charge was a duplicate. We have refunded $10.99 to the card; you will see it within a day.",
          when: "13 Oct, 9:20 AM",
        },
        { from: "me", text: "Got it, thank you!", when: "14 Oct, 8:00 AM" },
      ],
    },
    {
      id: "SC-1032",
      subject: "How do instant withdrawals work?",
      category: "money",
      priority: "low",
      status: "closed",
      opened: "3 Oct",
      updated: "3 Oct",
      messages: [
        {
          from: "me",
          text: "What does an instant withdrawal cost, and how fast is it really?",
          when: "3 Oct, 11:11 AM",
        },
        {
          from: "support",
          name: "Marcus",
          text: "It costs 1.5% of the amount and usually reaches your bank in about 30 minutes. Standard withdrawals are free and take 1 to 2 business days.",
          when: "3 Oct, 11:24 AM",
        },
      ],
    },
  ],
};

/* ── Plans ───────────────────────────────────────────────────────────────── */

/**
 * The plans, and what each includes. DEMO DATA: the account is on
 * `current`. `monthly` is the price a month, billed monthly; billed yearly it
 * is `yearlyDiscount` less. `compare` sets the plans side by side, a row per
 * feature: a value per plan, `true` for included, `false` for not.
 */
export const plans = {
  current: "personal",
  yearlyDiscount: 0.2,
  list: [
    {
      id: "personal",
      name: "Personal",
      tagline: "For everyday spending online",
      monthly: 0,
      features: [
        "Up to 5 virtual cards",
        "Pay in 30+ currencies",
        "Freeze any card in a tap",
        "Free standard withdrawals",
        "Help by email",
      ],
    },
    {
      id: "premium",
      name: "Premium",
      tagline: "Higher limits, more cards and priority support",
      monthly: 9.99,
      popular: true,
      features: [
        "Up to 20 virtual cards",
        "No foreign exchange fee",
        "Free instant withdrawals",
        "1% cashback on subscriptions",
        "Priority support, day and night",
      ],
    },
    {
      id: "business",
      name: "Business",
      tagline: "For teams and growing companies",
      monthly: 24.99,
      features: [
        "Unlimited virtual cards",
        "Everything in Premium",
        "Up to 25 team members",
        "Spend reports and exports",
        "A dedicated account manager",
      ],
    },
  ],
  compare: [
    { label: "Virtual cards", values: ["5", "20", "Unlimited"] },
    { label: "Foreign exchange fee", values: ["1%", "None", "None"] },
    { label: "Instant withdrawals", values: ["1.5%", "Free", "Free"] },
    { label: "Cashback on subscriptions", values: [false, "1%", "2%"] },
    { label: "Card designs", values: ["3", "All 4", "All 4"] },
    { label: "Spend reports", values: [false, true, true] },
    { label: "Team members", values: [false, false, "Up to 25"] },
    { label: "Support", values: ["Email", "Priority", "Dedicated manager"] },
  ],
  questions: [
    {
      q: "When am I charged?",
      a: "Today, from your wallet, for the first month or year. After that it renews on the same date, and we email you a few days before.",
    },
    {
      q: "Can I switch back?",
      a: "Yes, at any time. Your plan's perks stay until the end of the period you have paid for, then the account moves to the plan you chose.",
    },
    {
      q: "What happens to my extra cards?",
      a: "Nothing is deleted. If you move to a plan with fewer cards, the newest ones are frozen until you are back within its limit.",
    },
  ],
};
