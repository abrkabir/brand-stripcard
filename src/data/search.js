/**
 * Options for the property search control (`components/property/SearchPanel`).
 * Kept separate from the banner data because the same panel is used on the
 * results pages, which have no hero.
 */

export const intentTabs = [
  { value: "buy", label: "Buy", icon: "key" },
  { value: "rent", label: "Rent", icon: "home" },
  { value: "sell", label: "Sell", icon: "tag" },
];

export const propertyTypeOptions = [
  { label: "Any type", value: "" },
  { label: "Apartment", value: "apartment" },
  { label: "House / villa", value: "house" },
  { label: "Duplex", value: "duplex" },
  { label: "Penthouse", value: "penthouse" },
  { label: "Office", value: "office" },
  { label: "Plot / land", value: "land" },
];


export const budgetOptions = {
  buy: [
    { label: "Any budget", value: "" },
    { label: "Under ৳50 Lac", value: "0-5000000" },
    { label: "৳50 Lac – 1 Cr", value: "5000000-10000000" },
    { label: "৳1 Cr – 2.5 Cr", value: "10000000-25000000" },
    { label: "৳2.5 Cr and above", value: "25000000-" },
  ],
  rent: [
    { label: "Any rent", value: "" },
    { label: "Under ৳25k / mo", value: "0-25000" },
    { label: "৳25k – 50k / mo", value: "25000-50000" },
    { label: "৳50k – 1 Lac / mo", value: "50000-100000" },
    { label: "৳1 Lac+ / mo", value: "100000-" },
  ],
  sell: [
    { label: "Expected price", value: "" },
    { label: "Under ৳50 Lac", value: "0-5000000" },
    { label: "৳50 Lac – 1 Cr", value: "5000000-10000000" },
    { label: "৳1 Cr – 2.5 Cr", value: "10000000-25000000" },
    { label: "৳2.5 Cr and above", value: "25000000-" },
  ],
};


/** Chips under the search panel — the searches people actually run. */
export const popularSearches = [
  { label: "Gulshan apartments", href: "/buy/apartments?area=gulshan" },
  { label: "3-bed in Dhanmondi", href: "/rent?area=dhanmondi&beds=3" },
  { label: "Ready to move", href: "/buy?status=ready" },
  { label: "Sea-facing", href: "/buy?feature=sea-view" },
];
