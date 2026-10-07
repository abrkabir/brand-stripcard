import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { bannerCard } from "@/data/slides";

/**
 * The card in the banner's bottom corner: a photograph, a line about how the
 * listings are made, and the way through to them.
 *
 * Bottom-right on purpose. The slide dots sit bottom-left and the scroll cue
 * bottom-centre, so this is the one corner of the banner nothing else claims.
 *
 * Frosted rather than solid — `bg-black/40` with `backdrop-blur-md` — so the
 * photography still reads through it and the card belongs to the image instead
 * of being pasted on top. `on-dark` because that ground is a photograph in both
 * themes.
 *
 * Hidden below `lg`. On a narrower screen it would either cover the headline or
 * shrink to the point of being unreadable, and the same link is a few hundred
 * pixels away in the slide's own call to action.
 *
 * The whole card is one link, so there is a single target and a single
 * accessible name rather than a clickable block with a link inside it.
 *
 * A Server Component; the hover is CSS.
 */
export function BannerCard() {
  return (
    <Link
      href={bannerCard.cta.href}
      aria-label={`${bannerCard.body} ${bannerCard.cta.label}`}
      className="group on-dark absolute right-6 bottom-10 z-30 hidden w-[19rem] rounded-2xl border border-white/15 bg-black/40 p-3 backdrop-blur-md transition-colors duration-300 hover:border-white/35 hover:bg-black/55 lg:block xl:right-10 xl:bottom-12"
    >
      <span className="relative block aspect-[16/10] overflow-hidden rounded-xl">
        <Image
          src={bannerCard.image}
          alt=""
          fill
          sizes="304px"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
      </span>

      <span className="mt-4 block px-1 text-[13px] leading-relaxed text-white/80">
        {bannerCard.body}
      </span>

      {/* The arrow is the right-arrow turned 45°, which is the "goes somewhere
          else" mark the reference uses and one fewer icon to carry. */}
      <span className="mt-4 flex items-center gap-2 border-t border-white/15 px-1 pt-3.5 text-[11px] font-medium tracking-[0.14em] text-white uppercase">
        <ArrowRightIcon
          aria-hidden="true"
          className="size-3.5 -rotate-45 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
        {bannerCard.cta.label}
      </span>
    </Link>
  );
}
