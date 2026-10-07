import Image from "next/image";
import { MapPinIcon, SearchIcon } from "@/components/icons";
import { PropertyFilterBar } from "@/components/property/PropertyFilterBar";
import { Container } from "@/components/ui/Container";
import { NiceSelect } from "@/components/ui/NiceSelect";
import {
  budgetBands,
  propertiesPageCopy,
  statusOptions,
  typeOptions,
} from "@/data/propertyFilters";

/**
 * The listing page's hero: photograph, heading, search bar and the quick
 * filters, all over the one image.
 *
 * Full-bleed, and behind the header. The photograph is the band rather than a
 * card inside the container, so it runs edge to edge and up under the header,
 * which goes transparent over it — `/properties` is listed in `heroRoutes`.
 * Only the copy and the bar sit in a `Container`, which keeps them lined up
 * with everything below.
 *
 * The search bar is a plain `<form>` with no method — so a GET to
 * `/properties?status=…&location=…`. That means **no JavaScript at all**: the
 * browser builds the query string, Next treats the result as an ordinary
 * navigation, and the page filters server-side from `searchParams`. A shareable
 * URL falls out of it for free, and it works before hydration and with JS off.
 *
 * `defaultValue` on each control, not `value`, is what carries the current
 * query back into the bar after a search — the form is uncontrolled, so the
 * server-rendered markup *is* the state.
 *
 * A Server Component, like everything on this page except the cards' galleries.
 */
export function PropertySearchBar({ query }) {
  return (
    /* No `pt-header`. The photograph runs up behind the transparent header —
       `/properties` is in `heroRoutes` — and the copy pads itself clear of it
       from the inside instead, the same way `HeroSlider` does. */
    <section>
      <div className="relative">
        <Image
          src={propertiesPageCopy.image}
          alt={propertiesPageCopy.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        {/* The project's own scrim, so the copy reads whatever the photograph
            is doing behind it. */}
        <div aria-hidden="true" className="hero-scrim absolute inset-0" />

        {/* `pt` is the header height plus the band's own breathing room, and
            `pb` only the latter — so the visible area below the header stays
            what it was before the image moved up behind it. */}
        <Container className="on-dark relative flex min-h-[34rem] flex-col items-center justify-center pt-[calc(var(--header-h)+3.5rem)] pb-14 text-center lg:min-h-[41rem] lg:pt-[calc(var(--header-h-lg)+3.5rem)]">
          <p className="text-[12px] tracking-[0.18em] text-white/70 uppercase">
            {propertiesPageCopy.eyebrow}
          </p>

          <h1 className="mt-5 max-w-3xl font-heading text-[2rem] leading-[1.1] font-medium text-white sm:text-[3rem]">
            {propertiesPageCopy.title}
          </h1>

          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/75">
            {propertiesPageCopy.description}
          </p>

          {/* Segments divided by rules on a single rounded surface. Below `sm`
              it becomes a stacked card — four segments side by side on a phone
              would give each about 20 usable pixels. */}
          <form
            action="/properties"
            className="mt-10 w-full max-w-4xl rounded-3xl border border-line bg-elevated p-2 text-left sm:rounded-full"
          >
            <div className="flex flex-col sm:flex-row sm:items-center">
              <Segment label="Listings">
                <NiceSelect
                  name="status"
                  label="Listings"
                  options={statusOptions}
                  defaultValue={query.status ?? ""}
                  placeholder="All listings"
                />
              </Segment>

              <Rule />

              <Segment label="Where" htmlFor="search-location" grow>
                <span className="flex items-center gap-2">
                  <MapPinIcon
                    aria-hidden="true"
                    className="size-4 shrink-0 text-subtle"
                  />
                  <input
                    id="search-location"
                    name="location"
                    defaultValue={query.location ?? ""}
                    placeholder="Gulshan, Banani, Dhanmondi…"
                    className="w-full bg-transparent text-[14px] text-headline placeholder:text-subtle focus:outline-none"
                  />
                </span>
              </Segment>

              <Rule />

              <Segment label="Type">
                <NiceSelect
                  name="type"
                  label="Type"
                  options={typeOptions}
                  defaultValue={query.type ?? ""}
                  placeholder="Any type"
                  searchable
                />
              </Segment>

              <Rule />

              <Segment label="Budget">
                <NiceSelect
                  name="budget"
                  label="Budget"
                  options={budgetBands}
                  defaultValue={query.budget ?? ""}
                  placeholder="Any budget"
                  align="end"
                />
              </Segment>

              <div className="mt-3 shrink-0 sm:mt-0 sm:pl-3">
                <button
                  type="submit"
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand text-[14px] font-semibold text-white transition-colors hover:bg-brand-700 sm:size-12 sm:w-12"
                >
                  <SearchIcon aria-hidden="true" className="size-5" />
                  <span className="sm:sr-only">Search</span>
                </button>
              </div>
            </div>
          </form>

          {/* The quick filters sit on the photograph with the bar rather than
              in a strip beneath it, so the whole filter surface is one block
              instead of two stacked bands. */}
          <div className="mt-8 w-full">
            <PropertyFilterBar query={query} />
          </div>
        </Container>
      </div>
    </section>
  );
}

/**
 * One labelled segment.
 *
 * `htmlFor` only when the control is a real form element with that id — then
 * clicking the label focuses it. `NiceSelect` is a button carrying its own
 * accessible name, and a `for` pointing at an id that does not exist is worse
 * than no `for` at all, so those segments get a plain span instead.
 */
function Segment({ label, htmlFor, grow, children }) {
  const Label = htmlFor ? "label" : "span";

  return (
    <div className={`px-4 py-2.5 ${grow ? "min-w-0 flex-1" : "sm:w-44"}`}>
      <Label
        htmlFor={htmlFor}
        className="block text-[11px] tracking-[0.12em] text-muted uppercase"
      >
        {label}
      </Label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

/** Divider between segments — a rule across on a phone, upright on a row. */
function Rule() {
  return (
    <span
      aria-hidden="true"
      className="block h-px w-full bg-line sm:h-9 sm:w-px"
    />
  );
}
