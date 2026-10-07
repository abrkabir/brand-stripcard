import Link from "next/link";
import { ChevronRightIcon, MapPinIcon, ShieldIcon } from "@/components/icons";
import { StarRating } from "@/components/property/StarRating";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";

const STATUS = {
  sale: { tone: "brand", label: "For sale" },
  rent: { tone: "gold", label: "For rent" },
};

/**
 * The header of the detail page: where you are, what it is, and what it costs.
 *
 * Header only — the photographs and the numbers both live in the two-column
 * block below it, so the gallery on the left and the facts on the right start
 * level with each other. See `PropertyDetailGallery` and `PropertyFactCards`.
 *
 * A Server Component; nothing in here has state.
 */
export function PropertyDetailHero({ property, reviews }) {
  const status = STATUS[property.status] ?? STATUS.sale;
  const discounted = Boolean(property.discountPrice);

  return (
    <section className="pt-header">
      <Container className="pt-10 lg:pt-14">
        {/* Breadcrumb. Real links, so the browser and search engines both get a
            trail rather than decoration. */}
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-muted">
            <li>
              <Link href="/" className="transition-colors hover:text-brand">
                Home
              </Link>
            </li>
            <ChevronRightIcon aria-hidden="true" className="size-3.5 text-subtle" />
            <li>
              <Link
                href={
                  property.status === "rent"
                    ? "/properties?status=rent"
                    : "/properties?status=sale"
                }
                className="transition-colors hover:text-brand"
              >
                {property.status === "rent" ? "To rent" : "For sale"}
              </Link>
            </li>
            <ChevronRightIcon aria-hidden="true" className="size-3.5 text-subtle" />
            <li aria-current="page" className="text-headline">
              {property.title}
            </li>
          </ol>
        </nav>

        <div className="mt-7 flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge tone={status.tone}>{status.label}</Badge>
              {property.featured && <Badge tone="neutral">Featured</Badge>}

              {/* The verification claim the whole site is built on, said on the
                  one page where someone is deciding whether to believe it. */}
              <span className="inline-flex items-center gap-1.5 text-[12px] text-success">
                <ShieldIcon className="size-4" />
                Verified on site
              </span>
            </div>

            <h1 className="mt-5 font-heading text-[2rem] leading-[1.1] font-medium text-headline sm:text-[2.75rem]">
              {property.title}
            </h1>

            <p className="mt-4 flex items-center gap-2 text-[15px] text-muted">
              <MapPinIcon className="size-4 shrink-0 text-brand" />
              {property.location}
            </p>

            {reviews && (
              <p className="mt-3 flex flex-wrap items-center gap-2 text-[13px] text-muted">
                <StarRating value={reviews.average} />
                <span className="font-medium text-headline">
                  {reviews.average.toFixed(1)}
                </span>
                <a href="#reviews" className="underline hover:text-brand">
                  {reviews.count} {reviews.count === 1 ? "review" : "reviews"}
                </a>
              </p>
            )}
          </div>

          {/* Price sits at the end of the row on a wide screen and under the
              title on a narrow one, which keeps it beside the name either way
              rather than stranded. */}
          <div className="lg:text-right">
            <p className="flex flex-wrap items-baseline gap-x-3 lg:justify-end">
              <span className="font-heading text-[1.75rem] font-semibold text-headline sm:text-[2rem]">
                {discounted ? property.discountPrice : property.price}
              </span>

              {discounted && (
                <s className="text-[15px] text-subtle">{property.price}</s>
              )}
            </p>

            <p className="mt-1.5 text-[13px] text-muted">
              {property.status === "rent" ? "Per year" : "Asking price"}
            </p>
          </div>
        </div>

      </Container>
    </section>
  );
}

