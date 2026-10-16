import {
  siAirbnb,
  siBookingdotcom,
  siFigma,
  siNetflix,
  siNotion,
  siShopify,
  siSpotify,
  siUber,
} from "simple-icons";
import avatar from "../../public/images/testimonials/customer-maya.webp";

/**
 * Everything the dashboard shows. DEMO DATA: there is no account behind it
 * yet. When the API lands, each export here becomes a request, and the
 * components keep the same shapes.
 */

export const dashboardUser = { name: "Maya Collins", short: "Maya C.", avatar };

/**
 * The sidebar, in groups. A group without a `title` sits above the first
 * heading. `icon` names an icon in the sidebar's map (see DashboardSidebar).
 * Every item but the first opens its own page under /dashboard, built from
 * this list (see app/(dashboard)/dashboard/[section]); `description` is the
 * line that page opens with.
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
    title: "Account",
    items: [
      { label: "My Profile", href: "/dashboard/profile", icon: "userCircle", description: "Your name, contact details and preferences." },
      { label: "KYC Verification", href: "/dashboard/kyc-verification", icon: "shield", description: "Verify your identity to unlock higher limits." },
      { label: "2FA Security", href: "/dashboard/2fa-security", icon: "lock", description: "Turn on two-factor sign-in to protect your account." },
    ],
  },
];

/** Every page the sidebar links to except the dashboard itself, by slug. */
export const dashboardPages = dashboardNav
  .flatMap((group) => group.items)
  .filter((item) => item.href !== "/dashboard")
  .map((item) => ({ ...item, slug: item.href.split("/").pop() }));

export const dashboardNotifications = [
  { id: 1, title: "Payment blocked", text: "Merchant lock stopped a $89.00 charge on •••• 7718.", when: "2 min ago" },
  { id: 2, title: "Card frozen", text: "Your Travel card •••• 3302 is frozen until you unfreeze it.", when: "Yesterday" },
];

/* ── Balance ─────────────────────────────────────────────────────────────── */

export const balanceRanges = [
  { id: "1d", label: "1D" },
  { id: "1w", label: "1W" },
  { id: "1m", label: "1M" },
  { id: "1y", label: "1Y" },
  { id: "all", label: "All" },
];

/** A smooth, repeatable walk, so the demo chart is the same on every load. */
function walk(count, start, end, wobble, seed) {
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  return Array.from({ length: count }, (_, i) => {
    const t = i / (count - 1);
    const trend = start + (end - start) * t;
    return Math.round((trend + (rand() - 0.5) * wobble + Math.sin(i * 1.3) * wobble * 0.3) * 100) / 100;
  });
}

const LABELS = {
  "1d": Array.from({ length: 13 }, (_, i) => `${String(8 + i).padStart(2, "0")}:00`),
  "1w": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].flatMap((d) => [`${d} am`, `${d} pm`]),
  "1m": Array.from({ length: 30 }, (_, i) => `Oct ${i + 1}`),
  "1y": ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
  all: ["2022", "Q2", "Q3", "Q4", "2023", "Q2", "Q3", "Q4", "2024", "Q2", "Q3", "Q4", "2025", "Q2", "Q3", "Q4", "2026", "Q2", "Q3", "Q4"],
};

const RAW = {
  "1d": walk(13, 17410, 17643.41, 160, 3),
  "1w": walk(14, 16820, 17643.41, 420, 7),
  "1m": walk(30, 15200, 17643.41, 700, 11),
  "1y": walk(12, 9800, 17643.41, 1300, 17),
  all: walk(20, 2400, 17643.41, 1600, 23),
};

/** The series for each range: `{ label, value }` points, oldest first. */
export const balanceSeries = Object.fromEntries(
  Object.entries(RAW).map(([id, values]) => {
    const points = values.map((value, i) => ({ label: LABELS[id][i], value }));
    points[points.length - 1].value = 17643.41;
    return [id, points];
  }),
);

/* ── Cards ───────────────────────────────────────────────────────────────── */

/**
 * The virtual cards, each on its own tint (violet · green · amber).
 * `spent` and `limit` are this month's figures.
 */
export const dashboardCards = [
  { id: "subs", name: "Subscriptions", last4: "7718", spent: 248.5, limit: 500, tint: "violet", icon: "card" },
  { id: "travel", name: "Travel", last4: "3302", spent: 1236.4, limit: 2000, tint: "green", icon: "globe" },
  { id: "shop", name: "Shopping", last4: "4821", spent: 412.75, limit: 1500, tint: "amber", icon: "tag" },
];

/* ── Transactions ────────────────────────────────────────────────────────── */

export const transactionPeriods = [
  { id: "week", label: "This week" },
  { id: "month", label: "This month" },
];

/** How this week's spending compares with last week's, as a share. */
export const spendingChange = -0.084;

const brand = (icon) => ({ title: icon.title, path: icon.path });

/**
 * Recent payments, newest first. `amount` is negative for money out.
 * `period` is the narrowest filter the row still belongs to.
 */
export const transactions = [
  { id: "t1", merchant: brand(siSpotify), category: "Music", card: "subs", date: "Oct 15", amount: -10.99, status: "completed", period: "week" },
  { id: "t2", merchant: brand(siUber), category: "Rides", card: "travel", date: "Oct 15", amount: -24.6, status: "pending", period: "week" },
  { id: "t3", merchant: brand(siNotion), category: "Software", card: "subs", date: "Oct 14", amount: -96, status: "completed", period: "week" },
  { id: "t4", merchant: brand(siShopify), category: "Online store", card: "shop", date: "Oct 13", amount: -89, status: "blocked", period: "week" },
  { id: "t5", merchant: brand(siAirbnb), category: "Stays", card: "travel", date: "Oct 12", amount: -412.3, status: "completed", period: "week" },
  { id: "t6", merchant: brand(siNetflix), category: "Streaming", card: "subs", date: "Oct 6", amount: -15.49, status: "completed", period: "month" },
  { id: "t7", merchant: brand(siFigma), category: "Design tools", card: "subs", date: "Oct 3", amount: -45, status: "completed", period: "month" },
  { id: "t8", merchant: brand(siBookingdotcom), category: "Hotels", card: "travel", date: "Oct 2", amount: -268.9, status: "completed", period: "month" },
];

/* ── Rewards ─────────────────────────────────────────────────────────────── */

export const rewardsPromo = {
  before: "Earn",
  highlight: "2%",
  after: "cashback with StripCard Rewards!",
  text: "Get money back on every card payment, paid into your balance each month.",
  cta: "Join rewards",
  joined: "You're in",
};
