import Image from "next/image";
import Link from "next/link";
import { MailIcon, ShieldIcon, StarIcon } from "@/components/icons";
import { SaveListing } from "@/components/property/SaveListing";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site";

/**
 * Booking: who is handling the listing, and the ways to reach them.
 *
 * No price. It is already at the top of the page beside the name, and a second
 * copy of the same figure a screen further down is one more thing that can end
 * up out of step.
 *
 * The sticky behaviour lives on the column in `page.jsx`, not here — the facts
 * panel above has to travel with it, so the two are stuck together as one unit
 * rather than each pinning itself.
 *
 * A Server Component apart from the save button, which is its own client
 * island — the same one the cards use.
 */
export function PropertyAgentPanel({ property, agent }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-6">
        <p className="text-[12px] tracking-[0.1em] text-muted uppercase">
          Arrange a viewing
        </p>

        {agent && (
          <div className="mt-5 flex items-center gap-4">
            {/* The cut-out is framed and cropped square here — this is a
                headshot slot, not the poster the agent card builds. */}
            <span className="relative size-14 shrink-0 overflow-hidden rounded-full border border-line bg-brand-950">
              {agent.photo && (
                <Image
                  src={agent.photo}
                  alt=""
                  fill
                  sizes="56px"
                  className="object-cover object-top"
                />
              )}
            </span>

            <div className="min-w-0">
              <p className="font-heading text-[15px] font-semibold text-headline">
                <Link
                  href={agent.href}
                  className="transition-colors hover:text-brand"
                >
                  {agent.name}
                </Link>
              </p>

              <p className="mt-0.5 text-[12px] text-muted">{agent.role}</p>

              <p className="mt-1.5 flex items-center gap-2 text-[12px] text-muted">
                {agent.verified && (
                  <span className="inline-flex items-center gap-1 text-success">
                    <ShieldIcon className="size-3.5" />
                    Verified
                  </span>
                )}

                {agent.rating != null && (
                  <span className="inline-flex items-center gap-1">
                    <StarIcon
                      aria-hidden="true"
                      className="size-3.5 text-gold"
                      fill="currentColor"
                    />
                    {agent.rating.toFixed(1)}
                  </span>
                )}
              </p>
            </div>
          </div>
        )}

        {/* One row: save, the booking action, email. The booking button used to
            sit above this as well, which meant the same call to action twice on
            one small panel. */}
        <div className="mt-6 flex items-center gap-2.5">
          <SaveListing title={property.title} />

          <Button href="/contact" size="sm" arrow={false} className="flex-1">
            Book a viewing
          </Button>

          <Button
            href={siteConfig.contact.emailHref}
            variant="outline"
            size="sm"
            arrow={false}
            aria-label={`Email about ${property.title}`}
            className="btn--icon"
          >
            <MailIcon className="size-4" />
          </Button>
        </div>

        {/* Calling lost its button, so it keeps a real link here — a phone
            number is the one contact route someone may want without a form. */}
        <p className="mt-5 text-[12px] leading-relaxed text-muted">
          Quote{" "}
          <span className="text-headline">
            {property.additional?.find((row) => row.label === "Listing ID")
              ?.value ?? property.id}
          </span>{" "}
          when you get in touch, or call{" "}
          <a
            href={siteConfig.contact.phoneHref}
            className="text-headline underline hover:text-brand"
          >
            {siteConfig.contact.phone}
          </a>
          .
      </p>
    </div>
  );
}
