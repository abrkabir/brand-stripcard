import { cn } from "@/lib/cn";

/**
 * Three StripCard cards standing in a row, for the subscriptions tile: a wide
 * orange card in front, then a black and a silver one behind it, each showing
 * only a narrow strip. Each bobs gently on its own beat.
 *
 * The layout is measured off the original artwork. Every card is a plain
 * rounded panel sheared with `skewY`, so its sides stay upright and its top
 * edge falls to the left, a little less steeply on each card further back.
 * Each one's top-right corner sits slightly higher than the one in front.
 * The cards are much taller than they look: their feet are always out of
 * frame, bob or no bob.
 *
 * Everything is sized in `cqw` against this layer, which fills the tile, so
 * the group scales with the tile's width and stays anchored to its foot.
 * Decorative only.
 */
const CARDS = [
  {
    name: "silver",
    // Furthest back, its left edge tucked behind the black card.
    box: { left: "74.5cqw", width: "18cqw", bottom: "-17.2cqw", zIndex: 0 },
    slope: "-23deg",
    bob: { duration: "7.2s", delay: "-4.4s" },
    face: "bg-[linear-gradient(90deg,#fbfbfc_0%,#e2e2e6_30%,#adadb4_74%,#d0d0d5_100%)] shadow-[inset_0.35cqw_0_0_rgb(255_255_255/0.95),inset_-0.25cqw_0_0_rgb(255_255_255/0.6)]",
    mark: "left-1/2 -translate-x-1/2 text-[#8d8d94] [text-shadow:0.15cqw_0.15cqw_0_rgb(255_255_255/0.75),-0.1cqw_-0.1cqw_0_rgb(0_0_0/0.2)]",
  },
  {
    name: "black",
    box: { left: "58cqw", width: "17.7cqw", bottom: "-18.85cqw", zIndex: 1 },
    slope: "-26.6deg",
    bob: { duration: "6.6s", delay: "-2.2s" },
    face: "bg-[linear-gradient(90deg,#45454c_0%,#18181b_26%,#060607_70%,#2a2a2f_100%)] shadow-[inset_0.3cqw_0_0_rgb(255_255_255/0.45),inset_-0.25cqw_0_0_rgb(255_255_255/0.35),1.2cqw_0_3cqw_rgb(0_0_0/0.5)]",
    mark: "left-1/2 -translate-x-1/2 bg-linear-to-b from-white via-[#c4c4cb] to-[#6d6d74] bg-clip-text text-transparent",
  },
  {
    name: "orange",
    // In front: the widest face, and the steepest top edge.
    box: { left: "7.2cqw", width: "51.9cqw", bottom: "-40.3cqw", zIndex: 2 },
    slope: "-29.3deg",
    bob: { duration: "6s", delay: "0s" },
    face: "bg-[radial-gradient(90%_55%_at_90%_0%,rgb(255_255_255/0.34),transparent_62%),linear-gradient(165deg,#ffa35e_0%,#f26a1b_32%,#d2420c_64%,#6b1406_100%)] shadow-[inset_0_0_0_0.3cqw_rgb(255_255_255/0.2),1.2cqw_0_3cqw_rgb(0_0_0/0.55)]",
    mark: "right-[5cqw] text-white/95",
    chip: true,
  },
];

export function UseCaseCards({ className }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 @container", className)}
    >
      {CARDS.map((card) => (
        // The bob moves this wrapper; the card inside keeps its own angle.
        <div
          key={card.name}
          data-loop
          className="absolute h-[90cqw] motion-safe:animate-card-bob"
          style={{
            ...card.box,
            animationDuration: card.bob.duration,
            animationDelay: card.bob.delay,
          }}
        >
          <div
            className={cn("relative size-full origin-top-left rounded-[3.2cqw]", card.face)}
            style={{ transform: `skewY(${card.slope})` }}
          >
            {card.chip && (
              <span className="absolute top-[11cqw] left-[6cqw] h-[6.5cqw] w-[8.5cqw] rounded-[1.2cqw] bg-[linear-gradient(135deg,#fff3d6_0%,#e9c27a_45%,#b88a3c_100%)] shadow-[inset_0_0_0_0.25cqw_rgb(120_80_20/0.35)]" />
            )}
            <span
              className={cn(
                "absolute top-[4.5cqw] font-display text-[8cqw] leading-none font-bold tracking-[-0.02em] [writing-mode:vertical-rl]",
                card.mark,
              )}
            >
              StripCard
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
