import { WORLD } from "@/components/dashboard/worldDots";
import { cn } from "@/lib/cn";

const COLS = WORLD.rows[0].length;
const ROWS = WORLD.rows.length;

/** Every land cell as a dot: a zero-length stroke with round caps, all in one path. */
const DOTS = WORLD.rows
  .flatMap((row, r) => [...row].map((cell, c) => (cell === "#" ? `M${c + 0.5} ${r + 0.5}h0` : "")))
  .join("");

/** Where a latitude and longitude fall on the map, as percentages across and down. */
function at(lat, lon) {
  return {
    left: `${((lon - WORLD.west) / (COLS * WORLD.step)) * 100}%`,
    top: `${((WORLD.north - lat) / (ROWS * WORLD.step)) * 100}%`,
  };
}

/**
 * The world in dots, with a pin on each place given (`pins`: { code, lat,
 * lon }), a ring rippling slowly out of each, one after another. Decorative:
 * the places are named elsewhere.
 */
export function WorldMap({ pins, className }) {
  return (
    <div aria-hidden="true" className={cn("relative", className)} style={{ aspectRatio: `${COLS} / ${ROWS}` }}>
      <svg viewBox={`0 0 ${COLS} ${ROWS}`} className="absolute inset-0 size-full">
        <path
          d={DOTS}
          fill="none"
          strokeWidth="0.6"
          strokeLinecap="round"
          style={{ stroke: "var(--color-muted)", strokeOpacity: 0.32 }}
        />
      </svg>
      {pins.map((pin, i) => (
        <span key={pin.code} className="absolute size-2 -translate-x-1/2 -translate-y-1/2" style={at(pin.lat, pin.lon)}>
          <span
            data-loop
            className="absolute inset-0 rounded-full bg-brand/60 motion-safe:animate-ripple"
            style={{ animationDelay: `${i * 0.4}s` }}
          />
          <span className="absolute inset-0 rounded-full bg-brand ring-2 ring-card" />
        </span>
      ))}
    </div>
  );
}
