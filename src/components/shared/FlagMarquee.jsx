"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { ArrowRightIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

/**
 * Where the bar's run starts and ends, as a share of the window's height from
 * the top: it sets off as the strip comes up past 90% and has run its length
 * by the time the strip reaches 30%.
 */
const FROM = 0.9;
const TO = 0.3;

/**
 * How much of the way to where the scroll says the bar follows each frame:
 * low, so it glides slowly after the scroll rather than jumping with it.
 */
const EASE = 0.08;

/** The most the flags tilt, by the end of the bar's run: a gentle lean, never a spin. */
const TILT = 60;

/**
 * A row of flags led by an arrow, as a strip that runs out from the left edge
 * of the window: a bar in the brand colour from the edge, the arrow at its
 * head, then the flags, fading away at the far end. At rest it all keeps
 * still, the arrow just in from the window's edge. Scrolling down grows the bar, which pushes the arrow and the flags
 * along to the right, the flags leaning slowly round as they go (up to TILT
 * degrees by the end of the run); scrolling back up brings them back
 * upright. A flag lifts under the pointer, with its country's name as a
 * tooltip. Under reduced motion nothing moves.
 *
 * All of it is hidden from assistive tech; a plain list of the countries
 * stands in for it.
 *
 * `countries` is a list of { code, name }: the code names the flag in
 * /public/images/flags.
 *
 * It reaches out to the window's left edge by the container's `--to-edge`
 * (see .app-container), and its width is contained, so the row (far wider
 * than the screen) never pushes a grid or the page wider. How far it runs is
 * `--run`, as a share of its width: a quarter on a phone (so a few flags stay
 * in view), two fifths from lg. Where the bar is in its run (`--trip`, 0 to
 * 1) is a CSS variable set straight on the element, so scrolling never
 * re-renders it; the bar, the flags and their tilt all follow from it.
 */
export function FlagMarquee({ countries, label = "Countries we serve", className }) {
  const root = useRef(null);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let target = 0;
    let trip = 0;
    let frame = 0;

    const glide = () => {
      trip += (target - trip) * EASE;
      if (Math.abs(target - trip) < 0.0005) trip = target;
      el.style.setProperty("--trip", trip.toFixed(4));
      frame = trip === target ? 0 : requestAnimationFrame(glide);
    };

    const measure = () => {
      const top = el.getBoundingClientRect().top;
      const start = window.innerHeight * FROM;
      const end = window.innerHeight * TO;
      target = Math.min(1, Math.max(0, (start - top) / (start - end)));
      if (!frame) frame = requestAnimationFrame(glide);
    };

    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div
      ref={root}
      style={{
        marginLeft: "calc(-1 * var(--to-edge, 0px))",
        width: "calc(100% + var(--to-edge, 0px))",
        // Where the arrow's head is: at rest just in from the window's edge
        // (`--start`, the arrow and a sliver of bar), then as the bar runs,
        // across to the content's edge and `--run` of the strip beyond.
        "--head":
          "calc(var(--start) + var(--trip, 0) * (var(--to-edge, 0px) + var(--run) * 100cqw))",
      }}
      className={cn(
        "@container relative h-20 overflow-hidden [--run:0.25] [--start:5rem] [contain:inline-size] [mask-image:linear-gradient(to_right,black_82%,transparent)] lg:h-[6.5rem] lg:[--run:0.4] lg:[--start:6.75rem]",
        className,
      )}
    >
      <ul className="sr-only" aria-label={label}>
        {countries.map((country) => (
          <li key={country.code}>{country.name}</li>
        ))}
      </ul>

      {/* The flags, just past the arrow's head, pushed along with it. */}
      <ul
        aria-hidden="true"
        style={{ transform: "translateX(calc(var(--head) + 0.75rem))" }}
        className="absolute inset-y-0 left-0 flex w-max items-center gap-3 will-change-transform lg:gap-4"
      >
        {countries.map((country) => (
          <li
            key={country.code}
            title={country.name}
            className="relative size-[3.75rem] shrink-0 overflow-hidden rounded-full bg-white shadow-soft ring-1 ring-line transition-transform duration-300 ease-out hover:-translate-y-1 lg:size-[5.25rem]"
          >
            {/* The lean the bar's run gives it. */}
            <span className="absolute inset-0" style={{ transform: `rotate(calc(var(--trip, 0) * ${TILT}deg))` }}>
              <Image
                src={`/images/flags/${country.code}.svg`}
                alt=""
                fill
                sizes="84px"
                className="object-cover"
              />
            </span>
          </li>
        ))}
      </ul>

      {/* The bar, from the window's edge to the arrow's head. */}
      <div
        aria-hidden="true"
        style={{ transform: "translateX(calc(var(--head) - 100%))" }}
        className="absolute inset-y-0 left-0 z-10 flex w-full items-center justify-end rounded-r-full bg-brand pr-2 will-change-transform"
      >
        <span className="grid size-16 place-items-center rounded-full bg-hero-ink text-brand lg:size-[5.5rem]">
          <ArrowRightIcon className="size-7 lg:size-9" strokeWidth={2} />
        </span>
      </div>
    </div>
  );
}
