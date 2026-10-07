import { properties } from "@/data/properties";

/**
 * The featured properties, stepped through one at a time.
 *
 * Derived from `properties` rather than duplicated: a listing appears here for
 * exactly the same reason it wears the "Featured" badge on its card — the
 * `featured` flag in properties.js. One edit moves both, and the two can never
 * disagree about what is featured.
 */
export const featuredItemsHeading = {
  title: "Properties worth a second look",
  description:
    "The listings our team keeps coming back to — for the address, the build, or how rarely anything like them reaches the market.",
};

export const featuredItems = properties.filter((property) => property.featured);
