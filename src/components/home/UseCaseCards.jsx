import Image from "next/image";
import { cn } from "@/lib/cn";
import cardBusiness from "../../../public/images/assets/cards/card-business.webp";
import cardOrange from "../../../public/images/assets/cards/card-orange.webp";
import cardPlatinum from "../../../public/images/assets/cards/card-platinum.webp";

/**
 * A card stood on end, in `cqw` of the layer: as wide as the front card's
 * box, and as tall as the artwork's proportions make it (1411 × 843, turned).
 */
const CARD_W = 51.9;
const CARD_H = (CARD_W * 1411) / 843;

/**
 * Three StripCards standing in a row, for the subscriptions tile: the orange
 * card in front, then the Platinum and the Business behind it, each showing
 * only a narrow strip. Each bobs gently on its own beat.
 *
 * Each card is its artwork turned on end, so the "StripCard" logo, along the
 * top of the card, runs down its right-hand edge. A back card's box is only
 * the strip of it that shows, with the card anchored to the box's right, so
 * the strip is the edge that carries the logo.
 *
 * The layout is measured off the original artwork. Every card box is sheared
 * with `skewY`, so its sides stay upright and its top edge falls to the left,
 * a little less steeply on each card further back. Each one's top-right
 * corner sits slightly higher than the one in front. The cards are much
 * taller than they look: their feet are always out of frame, bob or no bob.
 *
 * Everything is sized in `cqw` against this layer, which fills the tile, so
 * the group scales with the tile's width and stays anchored to its foot.
 * Decorative only.
 */
const CARDS = [
  {
    name: "business",
    src: cardBusiness,
    // Furthest back, its left edge tucked behind the Platinum card.
    box: { left: "74.5cqw", width: "18cqw", bottom: "-17.2cqw", zIndex: 0 },
    slope: "-23deg",
    bob: { duration: "7.2s", delay: "-4.4s" },
    shadow: "shadow-[1.2cqw_0_3cqw_rgb(0_0_0/0.4)]",
  },
  {
    name: "platinum",
    src: cardPlatinum,
    box: { left: "58cqw", width: "17.7cqw", bottom: "-18.85cqw", zIndex: 1 },
    slope: "-26.6deg",
    bob: { duration: "6.6s", delay: "-2.2s" },
    shadow: "shadow-[1.2cqw_0_3cqw_rgb(0_0_0/0.5)]",
  },
  {
    name: "orange",
    src: cardOrange,
    // In front: the whole card, and the steepest top edge.
    box: { left: "7.2cqw", width: `${CARD_W}cqw`, bottom: "-40.3cqw", zIndex: 2 },
    slope: "-29.3deg",
    bob: { duration: "6s", delay: "0s" },
    shadow: "shadow-[1.2cqw_0_3cqw_rgb(0_0_0/0.55)]",
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
            className={cn("relative size-full origin-top-left overflow-hidden rounded-[3.2cqw]", card.shadow)}
            style={{ transform: `skewY(${card.slope})` }}
          >
            {/* The card on end, anchored top right: for a back card, the box
                shows only its right-hand strip, the one with the logo. */}
            <div className="absolute top-0 right-0" style={{ width: `${CARD_W}cqw`, height: `${CARD_H}cqw` }}>
              <Image
                src={card.src}
                alt=""
                sizes="40vw"
                className="absolute top-1/2 left-1/2 max-w-none -translate-x-1/2 -translate-y-1/2 rotate-90"
                style={{ width: `${CARD_H}cqw`, height: `${CARD_W}cqw` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
