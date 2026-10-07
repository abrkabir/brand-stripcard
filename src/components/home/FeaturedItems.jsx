import { FeaturedItemsSlider } from "@/components/home/FeaturedItemsSlider";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Container } from "@/components/ui/Container";
import { featuredItems, featuredItemsHeading } from "@/data/featuredItems";

/**
 * Featured properties.
 *
 * The heading is centred and stays on the server; only the panel below it
 * needs state, so `FeaturedItemsSlider` is the one client island.
 *
 * The list is whatever carries `featured` in properties.js. Clear every flag
 * and the section removes itself rather than rendering an empty panel — which
 * is also what keeps the slider from indexing into nothing.
 */
export function FeaturedItems() {
  if (featuredItems.length === 0) return null;

  return (
    <section className="bg-page py-24 lg:py-32">
      <Container>
        <SectionHeading
          align="center"
          title={featuredItemsHeading.title}
          description={featuredItemsHeading.description}
          className="mb-14 lg:mb-20"
        />
      </Container>

      <FeaturedItemsSlider />
    </section>
  );
}
