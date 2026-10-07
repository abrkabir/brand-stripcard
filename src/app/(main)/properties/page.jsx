import Link from "next/link";
import { PropertyCard } from "@/components/property/PropertyCard";
import { PropertySearchBar } from "@/components/property/PropertySearchBar";
import { Container } from "@/components/ui/Container";
import { properties } from "@/data/properties";
import { filterProperties } from "@/lib/properties";

export const metadata = {
  title: "Properties",
  description:
    "Every Adestate listing, filtered by what matters — price, type, bedrooms and area. All visited and measured before they went live.",
};

/**
 * The properties listing page.
 *
 * Filtering happens here, on the server, from `searchParams` — which is a
 * promise in this version of Next and has to be awaited, same as `params`. Both
 * the search bar and the filter panel are plain GET forms and the chips are
 * links, so the entire filter surface ships **no JavaScript**: every change is
 * an ordinary navigation, and the resulting URL is shareable and survives the
 * back button.
 *
 * The only client code on the page is inside the cards, where the photographs
 * cycle and the save button toggles.
 */
export default async function PropertiesPage({ searchParams }) {
  const query = await searchParams;
  const results = filterProperties(query);

  return (
    <>
      <PropertySearchBar query={query} />

      <section className="bg-page py-12 lg:py-16">
        <Container>
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="font-heading text-[1.375rem] font-medium text-headline">
              {results.length} of {properties.length}{" "}
              {properties.length === 1 ? "property" : "properties"}
            </h2>

            {results.length !== properties.length && (
              <Link
                href="/properties"
                className="text-[13px] text-muted underline hover:text-brand"
              >
                Clear all filters
              </Link>
            )}
          </div>

          {results.length > 0 ? (
            /* Flex-wrap, not a grid — same as the homepage row. A grid keeps
               its empty tracks, so a last row of one or two cards stays pinned
               left against the hole where the third would be. A wrapping flex
               line centres itself. The widths are the column maths written
               out: `gap-8` is 2rem, so two across has one gap to subtract and
               three across has two. */
            <ul className="mt-10 flex flex-wrap justify-center gap-8">
              {results.map((property, index) => (
                <li
                  key={property.id}
                  className="flex w-full sm:w-[calc((100%-2rem)/2)] lg:w-[calc((100%-4rem)/3)]"
                >
                  <PropertyCard property={property} index={index} />
                </li>
              ))}
            </ul>
          ) : (
            /* An empty result is a dead end unless it offers a way out, so the
               way out is the only thing in it. */
            <div className="mt-10 rounded-2xl border border-line bg-surface px-6 py-16 text-center">
              <p className="font-heading text-lg font-medium text-headline">
                Nothing matches that yet
              </p>

              <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-muted">
                We list a few dozen a month and verify each one before it goes
                up. Widen the filters, or tell us what you are after and we will
                watch for it.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link href="/properties" className="btn btn--base btn--sm">
                  <span className="btn__label">Clear all filters</span>
                </Link>

                <Link href="/contact" className="btn btn--outline btn--sm">
                  <span className="btn__label">Tell us what you want</span>
                </Link>
              </div>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
