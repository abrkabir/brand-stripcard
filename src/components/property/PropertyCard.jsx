import Link from "next/link";
import { ArrowRightIcon, BathIcon, BedIcon, MapPinIcon, RulerIcon } from "@/components/icons";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { SaveListing } from "@/components/property/SaveListing";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

/** Three across at `lg`, two at `sm`, one below — the card is sized for that. */
const SIZES = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";

const STATUS = {
  sale: { tone: "brand", label: "For sale" },
  rent: { tone: "gold", label: "For rent" },
};

/**
 * One listing: photography above, a panel below carrying the name, the numbers
 * and the actions.
 *
 * The panel is painted entirely from semantic tokens, so the card is white on
 * the light theme and near-black on the dark one with no `dark:` variant
 * anywhere. `on-dark` is scoped to the photograph alone — that ground *is*
 * fixed dark in both themes, which is what keeps the status badge solid and
 * legible over it while everything below follows the theme.
 *
 * A Server Component. The photographs cycle and the save toggles, so those two
 * are the client islands; everything else ships no JavaScript.
 *
 * The card is deliberately not one big link. The name and the two buttons are
 * three separate, correctly-labelled targets rather than one anonymous block a
 * screen reader has to read out whole.
 */
export function PropertyCard({ property, index = 0 }) {
  const status = STATUS[property.status] ?? STATUS.sale;
  const discounted = Boolean(property.discountPrice);

  return (
    <article className="flex w-full flex-col overflow-hidden rounded-3xl border border-line bg-surface p-3">
      {/* Inset rather than full-bleed, so the card's ground frames the
          photograph. The radii are concentric on purpose: an inner corner has
          to be the outer one minus the padding between them (24 − 12 = 12) or
          the two curves visibly disagree. */}
      <div className="on-dark relative aspect-[4/3] overflow-hidden rounded-xl">
        <PropertyGallery
          images={property.images}
          alt={property.alt}
          index={index}
          sizes={SIZES}
        />

        {/* Two chips, one to each top corner: what it is on the left, what
            you can do with it on the right. Both solid rather than tinted —
            see the `.on-dark .badge--*` rules in styles/components.css. */}
        {property.featured && (
          <div className="absolute top-4 left-4">
            <Badge tone="neutral">Featured</Badge>
          </div>
        )}

        <div className="absolute top-4 right-4">
          <Badge tone={status.tone}>{status.label}</Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center px-2 pt-9 pb-3 text-center">
        {/* Medium, not bold. The uppercase and the tracking already give the
            name its presence; the extra weight only bought glare, which on the
            dark theme is near-white on near-black at roughly 19:1 — far past
            what legibility needs. */}
        <h3 className="font-heading text-[15px] font-medium tracking-[0.14em] text-headline uppercase">
          <Link href={property.href} className="transition-colors hover:text-brand">
            {property.title}
          </Link>
        </h3>

        <ul className="mt-3.5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[12px] text-muted">
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

        {/* The live figure first and largest, whichever one it is. The original
            follows it struck through — `<s>` rather than a line-through class,
            because "no longer the price" is what the element means, not how it
            happens to be drawn. */}
        <p className="mt-4 flex flex-wrap items-baseline justify-center gap-x-2.5">
          <span className="font-heading text-lg font-semibold text-headline">
            {discounted ? property.discountPrice : property.price}
          </span>

          {discounted && (
            <s className="text-[13px] text-subtle">
              {property.price}
            </s>
          )}
        </p>

        {/* Clamped at three lines so a long entry cannot push one card's action
            row out of line with its neighbours. */}
        <p className="mt-4 line-clamp-3 text-[13px] leading-relaxed text-muted">
          {property.description}
        </p>

        <p className="mt-3 flex items-center gap-1.5 text-[12px] text-muted">
          <MapPinIcon className="size-3.5 shrink-0" />
          {property.location}
        </p>

        {/* `mt-auto` floors the row, so the actions line up across the grid
            whatever length the copy above them runs to. All three are the same
            `.btn` at the same size — the two icon ones only drop their label
            compartment — so they share a height and a hover with no bespoke
            styling to drift out of sync. */}
        <div className="mt-auto flex w-full items-center gap-2.5 pt-6">
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
    </article>
  );
}
