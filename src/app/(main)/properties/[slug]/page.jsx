import { notFound } from "next/navigation";
import { DetailSection } from "@/components/property/DetailSection";
import { PropertyAdditionalDetails } from "@/components/property/PropertyAdditionalDetails";
import { PropertyAgentPanel } from "@/components/property/PropertyAgentPanel";
import { PropertyDetailGallery } from "@/components/property/PropertyDetailGallery";
import { PropertyDetailHero } from "@/components/property/PropertyDetailHero";
import { PropertyFactCards } from "@/components/property/PropertyFactCards";
import { PropertyFeatures } from "@/components/property/PropertyFeatures";
import { PropertyReviewForm } from "@/components/property/PropertyReviewForm";
import { PropertyReviews } from "@/components/property/PropertyReviews";
import { RelatedProperties } from "@/components/property/RelatedProperties";
import { Container } from "@/components/ui/Container";
import { properties } from "@/data/properties";
import {
  getProperty,
  getPropertyAgent,
  getRelatedProperties,
  summariseReviews,
} from "@/lib/properties";

/**
 * Every listing is known at build time, so every page is prerendered. Next only
 * falls back to rendering on demand for a slug that is not in this list, and
 * that slug does not exist — `notFound()` below catches it.
 */
export function generateStaticParams() {
  return properties.map((property) => ({ slug: property.id }));
}

export async function generateMetadata({ params }) {
  // `params` is a promise in this version of Next — see
  // node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/dynamic-routes.md
  const { slug } = await params;
  const property = getProperty(slug);

  if (!property) return {};

  const title = `${property.title}, ${property.location}`;

  return {
    title,
    description: property.description,
    openGraph: {
      title,
      description: property.description,
      images: [{ url: property.images[0] }],
    },
    alternates: { canonical: property.href },
  };
}

/**
 * Property detail page.
 *
 * Thin, like every other page here: it resolves the slug, derives what has to
 * be derived, and hands the pieces to sections in `@/components/property/`.
 *
 * The layout is one column — gallery, then the written sections — with the
 * facts beside it from `lg`, where that column goes sticky and so stays level
 * with whatever is being read. Below `lg` the facts drop to the end.
 *
 * The price is in the header only. It was also in a panel in this column, which
 * meant the same figure twice on one screen.
 */
export default async function PropertyPage({ params }) {
  const { slug } = await params;
  const property = getProperty(slug);

  if (!property) notFound();

  const agent = getPropertyAgent(property);
  const reviews = summariseReviews(property.reviews);
  const related = getRelatedProperties(property);

  return (
    <>
      <PropertyDetailHero property={property} reviews={reviews} />

      <Container className="pt-10 pb-14 lg:pb-20">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16">
          {/* `space-y` rather than a gap: each block owns the rule above it, so
              the first one after the hero does not draw a second line. */}
          <div className="space-y-10">
            <PropertyDetailGallery
              images={property.images}
              alt={property.alt}
            />

            <DetailSection id="overview" title="About this property">
              <div className="space-y-5">
                {property.overview.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="max-w-[68ch] text-[15px] leading-[1.9] text-content"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </DetailSection>

            <PropertyFeatures features={property.features} />

            <PropertyAdditionalDetails rows={property.additional} />

            {/* Before the reviews, not after: someone who has just seen the
                place should not have to read every other opinion first to find
                where to leave their own. */}
            <PropertyReviewForm property={property} />

            <PropertyReviews reviews={property.reviews} summary={reviews} />
          </div>

          {/* `self-start` is what lets this stick: a grid child stretches to
              the row height by default, which leaves `sticky` nothing to slide
              inside and quietly does nothing. */}
          <aside className="space-y-6 lg:sticky lg:top-[calc(var(--header-h-lg)+1.5rem)] lg:self-start">
            <PropertyFactCards property={property} />
            <PropertyAgentPanel property={property} agent={agent} />
          </aside>
        </div>
      </Container>

      <RelatedProperties properties={related} />
    </>
  );
}
