import { agents } from "@/data/agents";
import { properties } from "@/data/properties";

/** The listing with this id, or undefined. The detail page turns that into a 404. */
export function getProperty(id) {
  return properties.find((property) => property.id === id);
}

/** The agent responsible for a listing, joined on `agentId`. */
export function getPropertyAgent(property) {
  return agents.find((agent) => agent.id === property.agentId);
}

/**
 * Other listings to show under one.
 *
 * Same intent first — someone reading a rental is looking for rentals — and
 * only then padded out with whatever else is on the books, so the row is never
 * short just because a category is thin.
 */
export function getRelatedProperties(property, limit = 3) {
  const others = properties.filter((other) => other.id !== property.id);
  const sameIntent = others.filter((other) => other.status === property.status);
  const rest = others.filter((other) => other.status !== property.status);

  return [...sameIntent, ...rest].slice(0, limit);
}

/**
 * The average of a listing's reviews and how they are spread across the five
 * stars, derived rather than stored — an aggregate kept alongside the reviews
 * is an aggregate that can disagree with them.
 *
 * Returns null when there is nothing to average, so callers can drop the whole
 * block instead of rendering a zero.
 */
export function summariseReviews(reviews) {
  if (!reviews?.length) return null;

  const total = reviews.reduce((sum, review) => sum + review.rating, 0);

  return {
    count: reviews.length,
    average: total / reviews.length,
    // Highest star first, which is the order these are always read in.
    distribution: [5, 4, 3, 2, 1].map((stars) => {
      const count = reviews.filter(
        (review) => Math.round(review.rating) === stars,
      ).length;

      return { stars, count, share: count / reviews.length };
    }),
  };
}

/** Digits out of a display price string — "৳ 5,200,000" becomes 5200000. */
function priceValue(property) {
  const shown = property.discountPrice ?? property.price;
  return Number(String(shown).replace(/[^\d]/g, ""));
}

const SORTS = {
  "price-asc": (a, b) => priceValue(a) - priceValue(b),
  "price-desc": (a, b) => priceValue(b) - priceValue(a),
  "beds-desc": (a, b) => b.beds - a.beds,
  // Default: featured first, file order within that.
  "": (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)),
};

/**
 * The listing page's filter, run server-side against the query string.
 *
 * Every filter is skipped when its param is absent, so `/properties` with no
 * query returns everything and each param only narrows. That is what lets the
 * chips and the two forms compose without any of them knowing about the others.
 *
 * Prices are compared on the *live* figure — the discounted one where there is
 * one — because that is the number someone filtering by budget has in mind.
 */
export function filterProperties(query = {}) {
  const { status, type, location, budget, beds, featured, sort } = query;

  let list = [...properties];

  if (status) {
    list = list.filter((property) => property.status === status);
  }

  if (type) {
    // Comma-separated, so one chip can cover "house,villa".
    const wanted = new Set(String(type).split(","));
    list = list.filter((property) => wanted.has(property.type));
  }

  if (location) {
    const needle = String(location).trim().toLowerCase();
    list = list.filter(
      (property) =>
        property.location.toLowerCase().includes(needle) ||
        property.title.toLowerCase().includes(needle),
    );
  }

  if (budget) {
    const [min, max] = String(budget).split("-");
    if (min) list = list.filter((property) => priceValue(property) >= Number(min));
    if (max) list = list.filter((property) => priceValue(property) <= Number(max));
  }

  if (beds) {
    list = list.filter((property) => property.beds >= Number(beds));
  }

  if (featured) {
    list = list.filter((property) => property.featured);
  }

  return list.sort(SORTS[sort] ?? SORTS[""]);
}

/**
 * Which quick-filter chip the current query matches.
 *
 * A chip is active when every param it sets is present with that value *and*
 * the query sets nothing else a chip could own — otherwise "For sale" would stay
 * lit after someone also picked a type, which reads as though the type had not
 * applied.
 */
export function isChipActive(chip, query = {}) {
  const owned = ["status", "type", "featured"];
  const entries = Object.entries(chip.params);

  if (entries.length === 0) {
    return owned.every((key) => !query[key]);
  }

  return (
    entries.every(([key, value]) => query[key] === value) &&
    owned.every((key) => !query[key] || key in chip.params)
  );
}
