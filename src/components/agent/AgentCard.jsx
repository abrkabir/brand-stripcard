import Image from "next/image";
import Link from "next/link";
import { ShieldIcon, StarIcon } from "@/components/icons";

/**
 * Four across at `lg`, two at `sm`, one below. This has to track the grid in
 * `Agents`: `next/image` picks its srcset candidate from these widths, so a
 * stale value here means a portrait fetched too small and rendered soft.
 */
const SIZES = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw";

/**
 * One agent: a cut-out portrait standing in an open frame.
 *
 * There is no card behind it — the ground is whatever the section is sitting
 * on, so the frame outline is the only container. That is also why nothing here
 * is painted white: on the light theme a white plate on a white page is
 * invisible, so the frame, the plate and the badge all read from the surface
 * tokens and follow the theme.
 *
 * The order the layers go down in is the effect:
 *
 *   1. The frame — an outline, drawn first and therefore behind. Its top edge
 *      starts 15% down the stage, and that offset is the whole trick: the
 *      figure is scaled to the full stage, so the head rises past the line
 *      while the feet stand on the frame's floor, and the line disappears
 *      behind the body where they cross. A percentage rather than a fixed
 *      offset, because the stage is far taller on a phone than in a
 *      four-across row and the overhang has to stay proportional.
 *
 *      Nothing scales on hover, either: the figure already overhangs the
 *      outline, so growing it just pushes more of the body outside the frame.
 *      Hover moves the frame's colour instead.
 *   2. The portrait, over it. `object-contain` keeps a cut-out at its own
 *      proportions rather than cropping it; `object-bottom` is what stands it
 *      on the floor instead of floating it.
 *   3. The verified mark on the frame's left border, and the nameplate over
 *      the foot — last, so the plate covers the bottom of the figure.
 *
 * The `px-5` is not decoration: the badge straddles the frame's left edge and
 * hangs half its width outside it, so the card needs that much room or it
 * collides with its neighbour in the grid.
 *
 * Until the real PNGs land, a card with no `photo` draws the agent's initials
 * in the same footprint, so the frame and the plate still read.
 *
 * A Server Component — nothing here has state.
 */
export function AgentCard({ agent, index = 0 }) {
  const { verified } = agent;
  // Both or nothing: a score with no count behind it says very little.
  const scored = agent.rating != null && agent.reviews != null;

  const initials = agent.name
    .split(" ")
    .map((part) => part[0])
    .join("");

  return (
    <Link
      href={agent.href}
      aria-label={`${agent.name}, ${agent.role}${verified ? " — verified agent" : ""}`}
      className="group block px-5"
    >
      {/* 2:3 is the cut-out's own aspect. `object-contain` fits by height while
          the image is narrower than its box, so any stage wider than the file
          wastes the difference as empty air either side and shrinks the figure —
          at 4/5 the body spanned 64% of the frame, at 2:3 it spans 77%. */}
      <div className="relative aspect-[2/3]">
        {/* ── 1 · The frame, first and therefore behind ─────────────────── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-[15%] bottom-0 rounded-2xl border border-line transition-colors group-hover:border-brand"
        />

        {/* ── 2 · The portrait, over it ─────────────────────────────────── */}
        <div className="absolute inset-0">
          {agent.photo ? (
            <Image
              src={agent.photo}
              alt={agent.alt}
              fill
              sizes={SIZES}
              className="object-contain object-bottom"
              priority={index === 0}
            />
          ) : (
            // Placeholder until the cut-out exists. Sits low in the frame so it
            // occupies roughly the footprint a standing figure will.
            <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-[18%] text-center font-heading text-[5rem] leading-none font-bold text-muted/20"
            >
              {initials}
            </span>
          )}
        </div>

        {/* ── 3 · Straddling the frame's left border ──────────────────────
            The same shield-and-tick the footer uses for "verified on site", so
            the mark means one thing across the site. Solid brand rather than a
            surface tint: it lands half on the frame's line and half on the page,
            and a tint would read differently on each. The `ring-page` is what
            punches it out of the border instead of letting the line run
            through it. White ground with a green mark — the badge reads the
            same whether it lands on the frame's line, the page or the figure,
            and `border-line` is what keeps its edge visible once the ground
            behind it is white too. */}
        {verified && (
          <span className="absolute top-[20%] left-0 grid size-9 -translate-x-1/2 place-items-center rounded-full border border-line bg-white ring-2 ring-page">
            <ShieldIcon className="size-[18px] text-success" />
            <span className="sr-only">Verified agent</span>
          </span>
        )}

        {/* ── 4 · The plate, last, over the foot of the figure ──────────── */}
        <div className="absolute inset-x-3 bottom-3 rounded-xl border border-line bg-surface px-4 py-3.5 text-center">
          <h3 className="font-heading text-[15px] leading-tight font-semibold tracking-[0.06em] text-headline uppercase">
            {agent.name}
          </h3>

          <p className="mt-1 text-[10px] tracking-[0.16em] text-muted uppercase">
            {agent.role}
          </p>

          {scored && (
            <p className="mt-2.5 flex items-center justify-center gap-1.5 text-[11px] text-muted">
              <StarIcon className="size-3.5 shrink-0 text-gold" />
              <span className="font-medium text-headline">
                {agent.rating.toFixed(1)}
              </span>
              <span>({agent.reviews} reviews)</span>
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
