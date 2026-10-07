import { PropertyCard } from "@/components/property/PropertyCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Container } from "@/components/ui/Container";
import { properties, propertiesHeading } from "@/data/properties";

/**
 * The properties list — property cards over the page ground.
 *
 * The section stays on the server; each card's photographs are the only part
 * that ships JavaScript. `index` is handed down so the cards stagger their
 * image cycles instead of all turning on the same frame.
 */
export function Properties() {
  return (
    <section className="bg-page py-24 lg:py-32">
      <Container>
        <SectionHeading
          title={propertiesHeading.title}
          description={propertiesHeading.description}
          action={propertiesHeading.action}
        />

        {/* Flex-wrap rather than a grid. A grid keeps its empty tracks, so a
            final row of one or two cards stays pinned left against the hole
            where the third would be. A wrapping flex line centres itself, so
            any leftover count sits in the middle whatever it is.

            The widths are the column maths written out — `gap-8` is 2rem, so
            two across has one gap to subtract and three across has two.
            Tailwind resolves them to calc(50% - 1rem) and
            calc(33.3333% - 1.33333rem), which is exactly what the grid tracks
            were. `flex` on each item keeps align-items: stretch working, so
            cards on the same line still share a height. */}
        <ul className="mt-14 flex flex-wrap justify-center gap-8 lg:mt-16">
          {properties.map((property, index) => (
            <li
              key={property.id}
              className="flex w-full sm:w-[calc((100%-2rem)/2)] lg:w-[calc((100%-4rem)/3)]"
            >
              <PropertyCard property={property} index={index} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
