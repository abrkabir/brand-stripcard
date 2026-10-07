"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRightIcon, BathIcon, BedIcon, MapPinIcon, RulerIcon } from "@/components/icons";
import { SaveListing } from "@/components/property/SaveListing";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { featuredItems } from "@/data/featuredItems";

/** Five across at `lg`; below that the strip scrolls sideways instead of wrapping. */
const TILE_SIZES = "(min-width: 1024px) 18vw, 10rem";

/**
 * One featured property at a time: its name, its numbers, its description, and
 * its photographs as a strip hanging off the panel's bottom edge.
 *
 * The overhang is done in flow rather than with absolute positioning — the
 * photograph strip carries a negative bottom margin, which pulls the panel's
 * bottom edge up behind it. The panel still sizes itself to its own copy, so a
 * longer description makes it taller and the controls below simply clear the
 * overhang with padding, instead of every height being pinned by hand.
 *
 * Stepping wraps at both ends, so neither control is ever dead. With a single
 * featured listing there is nothing to step through and the row is dropped.
 */
export function FeaturedItemsSlider() {
  const [active, setActive] = useState(0);
  const total = featuredItems.length;
  const property = featuredItems[active];

  const step = (delta) => setActive((i) => (i + delta + total) % total);

  const onKeyDown = (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
    }
  };

  const discounted = Boolean(property.discountPrice);

  return (
    <div
      aria-roledescription="carousel"
      aria-label="Featured properties"
      onKeyDown={onKeyDown}
    >
      <Container>
        {/* A plain surface, no texture: the panel is a ground for the
            photographs to sit on, and anything patterned behind them competes
            with them. */}
        <div className="border border-line bg-surface px-5 pt-14 sm:px-10 lg:pt-20">
          {/* Keyed on the listing so the entrance replays on every step — the
              same pattern the hero uses. */}
          <div key={property.id} className="mx-auto max-w-2xl text-center">
            <h3 className="animate-rise font-heading text-[1.75rem] leading-tight font-normal text-headline sm:text-[2.25rem]">
              <Link
                href={property.href}
                className="transition-colors hover:text-brand"
              >
                {property.title}
              </Link>
            </h3>

            <ul
              className="animate-rise mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13px] text-muted"
              style={{ animationDelay: "90ms" }}
            >
              <li className="flex items-center gap-1.5">
                <MapPinIcon className="size-3.5 shrink-0 text-brand" />
                {property.location}
              </li>
              <li className="flex items-center gap-1.5">
                <BedIcon className="size-3.5 shrink-0" />
                {property.beds} beds
              </li>
              <li className="flex items-center gap-1.5">
                <BathIcon className="size-3.5 shrink-0" />
                {property.baths} baths
              </li>
              <li className="flex items-center gap-1.5">
                <RulerIcon className="size-3.5 shrink-0" />
                {property.area}
              </li>
            </ul>

            {/* The live figure first and largest, whichever one it is. `<s>`
                rather than a line-through class: "no longer the price" is what
                the element means, not how it happens to be drawn. */}
            <p
              className="animate-rise mt-5 flex flex-wrap items-baseline justify-center gap-x-2.5"
              style={{ animationDelay: "150ms" }}
            >
              <span className="font-heading text-xl font-semibold text-headline">
                {discounted ? property.discountPrice : property.price}
              </span>

              {discounted && (
                <s className="text-[13px] text-subtle">{property.price}</s>
              )}
            </p>

            <p
              className="animate-rise mx-auto mt-6 max-w-xl text-[15px] leading-[1.8] text-muted"
              style={{ animationDelay: "210ms" }}
            >
              {property.description}
            </p>

            {/* The same three controls the property card carries, so the two
                places a listing appears offer the identical set. Capped rather
                than stretched: across the full panel the row would read as a
                toolbar instead of one listing's actions. */}
            <div
              className="animate-rise mx-auto mt-8 flex max-w-sm items-center gap-2.5"
              style={{ animationDelay: "270ms" }}
            >
              <SaveListing title={property.title} />

              <Button
                href={property.href}
                variant="outline"
                size="sm"
                arrow={false}
                className="flex-1"
              >
                Select
              </Button>

              <Button
                href={property.href}
                variant="outline"
                size="sm"
                arrow={false}
                aria-label={`View ${property.title}`}
                className="btn--icon"
              >
                <ArrowRightIcon className="size-4" />
              </Button>
            </div>
          </div>

          {/* The negative margin is the overhang. Sideways scroll below `lg`,
              because photographs wrapped onto two rows stop reading as a strip
              hanging off the panel. */}
          <ul
            key={`${property.id}-gallery`}
            className="no-scrollbar -mb-14 mt-12 flex gap-4 overflow-x-auto pb-1 lg:-mb-20 lg:justify-center lg:overflow-visible"
          >
            {property.images.map((src, i) => (
              <li
                key={src}
                className="animate-rise w-36 shrink-0 sm:w-40 lg:w-52"
                style={{ animationDelay: `${340 + i * 70}ms` }}
              >
                <span className="relative block aspect-[4/5] overflow-hidden rounded-lg border border-line">
                  <Image
                    src={src}
                    // The first photograph carries the description; the rest are
                    // the same property from another angle and add nothing a
                    // screen reader needs, so they are marked decorative rather
                    // than repeating one sentence three times.
                    alt={i === 0 ? property.alt : ""}
                    fill
                    sizes={TILE_SIZES}
                    className="object-cover"
                  />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      {total > 1 && (
        <Container>
          {/* Padding, not margin: it has to clear the strip's overhang above. */}
          <div className="flex items-center justify-center gap-5 pt-24 lg:pt-32">
            <Button
              type="button"
              variant="outline"
              size="sm"
              arrow={false}
              aria-label="Previous property"
              onClick={() => step(-1)}
              className="btn--icon"
            >
              <ArrowRightIcon className="size-4 rotate-180" />
            </Button>

            <p className="font-heading text-[13px] tracking-[0.14em] text-muted tabular-nums">
              {String(active + 1).padStart(2, "0")}
              <span className="text-subtle"> / </span>
              {String(total).padStart(2, "0")}
            </p>

            <Button
              type="button"
              variant="outline"
              size="sm"
              arrow={false}
              aria-label="Next property"
              onClick={() => step(1)}
              className="btn--icon"
            >
              <ArrowRightIcon className="size-4" />
            </Button>
          </div>
        </Container>
      )}

      {/* Announces the step without moving focus. */}
      <p aria-live="polite" className="sr-only">
        {`Property ${active + 1} of ${total}: ${property.title}`}
      </p>
    </div>
  );
}
