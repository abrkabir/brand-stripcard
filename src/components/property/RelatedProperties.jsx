import { PropertyCard } from "@/components/property/PropertyCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Container } from "@/components/ui/Container";

/**
 * Other listings, under the one being read.
 *
 * The same `PropertyCard` the homepage uses, not a cut-down variant — the
 * cycling photographs, the badges and the actions all come with it, and there
 * is one card in the codebase rather than two that drift apart.
 *
 * Renders nothing when there is nothing to show, so a single-listing site does
 * not get an empty heading.
 */
export function RelatedProperties({ properties }) {
  if (!properties?.length) return null;

  return (
    <section className="border-t border-line bg-page py-20 lg:py-28">
      <Container>
        <SectionHeading
          title="You might also look at these"
          description="Others on our books in the same bracket, each one visited and measured by the same team."
          action={{ label: "Browse all properties", href: "/properties" }}
        />

        <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property, index) => (
            <li key={property.id} className="flex">
              <PropertyCard property={property} index={index} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
