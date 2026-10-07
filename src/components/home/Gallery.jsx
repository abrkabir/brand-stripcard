import Image from "next/image";
import Link from "next/link";
import { SearchIcon } from "@/components/icons";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Container } from "@/components/ui/Container";
import { galleryHeading, galleryItems } from "@/data/gallery";

/** Four across at `lg`, three at `md`, two below — the tile is sized for that. */
const SIZES = "(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw";

/**
 * The project gallery: a heading, then a tight grid of tall tiles.
 *
 * `gap-1` rather than the section spacing used elsewhere. The tiles are meant to
 * read as one block of photography with hairlines through it, and a normal gap
 * turns that into eight separate cards.
 *
 * Every tile carries the same furniture — a label top-left, a rule bottom-left,
 * and a magnifier on hover — so the grid reads as one set rather than a row of
 * photographs that each decided something different.
 *
 * A Server Component. Nothing here has state; the hover is entirely CSS.
 */
export function Gallery() {
  return (
    <section className="bg-page py-24 lg:py-32">
      <Container>
        <SectionHeading
          align="center"
          title={galleryHeading.title}
          description={galleryHeading.description}
          className="mb-14 lg:mb-16"
        />

        <ul className="grid grid-cols-2 gap-1 md:grid-cols-3 lg:grid-cols-4">
          {galleryItems.map((item, index) => (
            <li key={item.id}>
              <Tile item={item} index={index} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/**
 * One tile.
 *
 * `on-dark` because the ground is a photograph in both themes — that is what
 * lets everything on top of it commit to white without a second set of colours.
 *
 * The scrim is two gradients: a flat wash that deepens on hover, and a stronger
 * one at the top where the label sits. Without the second, a pale sky behind the
 * label leaves it unreadable, and darkening the whole tile enough to fix that
 * would flatten the photograph.
 */
function Tile({ item, index }) {
  return (
    <Link
      href={item.href}
      className="group on-dark relative block aspect-[3/4] overflow-hidden bg-shader-ink"
    >
      <Image
        src={item.image}
        alt={item.alt}
        fill
        sizes={SIZES}
        // The first row is above the fold on most screens.
        priority={index < 4}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
      />

      <span
        aria-hidden="true"
        className="absolute inset-0 bg-black/35 transition-colors duration-500 group-hover:bg-black/55"
      />

      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-black/55 to-transparent"
      />

      {/* Two lines, always broken in the same place — see the data file. */}
      <span className="absolute top-6 left-6 block text-[11px] leading-[1.6] tracking-[0.14em] text-white uppercase">
        {item.title}
        <span className="block text-white/70">in {item.place}</span>
      </span>

      {/* The mark at the foot of each tile. Decorative, and drawn rather than
          set in type so it cannot be read out or selected. */}
      <span
        aria-hidden="true"
        className="absolute bottom-6 left-6 flex flex-col gap-1"
      >
        {[0, 1, 2, 3, 4].map((rule) => (
          <span key={rule} className="block h-px w-4 bg-white/40" />
        ))}
      </span>

      {/* The affordance, on hover and on keyboard focus alike — a control that
          only appears for a mouse is a control half the visitors never see. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        <span className="grid size-14 place-items-center rounded-full border border-white/40 bg-black/30 text-white backdrop-blur-sm">
          <SearchIcon className="size-5" />
        </span>
      </span>
    </Link>
  );
}
