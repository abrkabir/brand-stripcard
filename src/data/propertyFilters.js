/**
 * The listing page's filters.
 *
 * `chips` are the quick filters across the top. Each one carries the query it
 * sets rather than an id the page has to interpret, so adding a chip is a data
 * change and the bar stays a dumb renderer. An empty `params` is the "All" chip:
 * it clears everything.
 *
 * Type values are the machine ones from `properties.js`, comma-separated where
 * a chip covers more than one — "Houses & villas" is one chip because the
 * distinction is not what anyone browses by.
 */
export const propertyChips = [
  { label: "All", icon: "sparkles", params: {} },
  { label: "For sale", icon: "key", params: { status: "sale" } },
  { label: "To rent", icon: "tag", params: { status: "rent" } },
  { label: "Apartments", icon: "building", params: { type: "apartment" } },
  { label: "Houses & villas", icon: "home", params: { type: "house,villa" } },
  { label: "Duplexes", icon: "layers", params: { type: "duplex" } },
  { label: "Featured", icon: "star", params: { featured: "1" } },
];

/** The "All" option in the search bar's first segment. */
export const statusOptions = [
  { label: "All listings", value: "" },
  { label: "For sale", value: "sale" },
  { label: "To rent", value: "rent" },
];

export const typeOptions = [
  { label: "Any type", value: "" },
  { label: "Apartment", value: "apartment" },
  { label: "House", value: "house" },
  { label: "Villa", value: "villa" },
  { label: "Duplex", value: "duplex" },
];

/**
 * Budget bands, as `min-max` with either end open. The page splits the value,
 * so one `<select>` covers both bounds and the URL stays short.
 */
export const budgetBands = [
  { label: "Any budget", value: "" },
  { label: "Under ৳ 3,000,000", value: "0-3000000" },
  { label: "৳ 3,000,000 – 5,000,000", value: "3000000-5000000" },
  { label: "৳ 5,000,000 and above", value: "5000000-" },
];

/**
 * `bedOptions` and `sortOptions` have no control on the page — the filters
 * panel that used them was removed. `filterProperties` still honours `beds` and
 * `sort` from the query string, so these stay as the record of what those params
 * accept, and as the options for whatever renders them next.
 */
export const bedOptions = [
  { label: "Any", value: "" },
  { label: "2 or more", value: "2" },
  { label: "3 or more", value: "3" },
  { label: "4 or more", value: "4" },
  { label: "5 or more", value: "5" },
];

export const sortOptions = [
  { label: "Featured first", value: "" },
  { label: "Price, low to high", value: "price-asc" },
  { label: "Price, high to low", value: "price-desc" },
  { label: "Most bedrooms", value: "beds-desc" },
];

export const propertiesPageCopy = {
  eyebrow: "Every listing visited before it went live",
  title: "Find the address you actually want",
  description:
    "Filter by what matters, then read the whole file — facts, features, and the reviews of people who stood in the same rooms.",
  // An exterior, not an interior: the page is a list of buildings, and the old
  // shot read as somebody's living room. Chosen partly on tone — the mean
  // luminance across the middle of the frame is 0.24, and `hero-scrim` puts
  // ~0.44 of black over it there, which keeps white body copy above 4.5:1.
  image:
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2000&q=72",
  imageAlt:
    "Modern two-storey villa with timber soffits reflected in a long pool",
};
