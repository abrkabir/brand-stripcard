"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { cn } from "@/lib/cn";

gsap.registerPlugin(useGSAP, MorphSVGPlugin, ScrollTrigger);

/* Every outline is built from the same number of points around (50, 50) in
   a 100 × 100 box, so MorphSVG can move between any two point for point. */

const POINTS = 64;

function outline(radiusAt) {
  let d = "";
  for (let i = 0; i < POINTS; i++) {
    const t = (i / POINTS) * Math.PI * 2;
    const r = radiusAt(t);
    const x = (50 + r * Math.cos(t)).toFixed(2);
    const y = (50 + r * Math.sin(t)).toFixed(2);
    d += `${i ? "L" : "M"}${x} ${y}`;
  }
  return `${d}Z`;
}

/* Seal: a "verified" badge cycling through squircle and flower, turning. */
const SEAL = [
  outline((t) => 40 + 4.5 * Math.cos(12 * t)), // seal
  outline((t) => 41 / (Math.abs(Math.cos(t)) ** 4 + Math.abs(Math.sin(t)) ** 4) ** 0.25), // squircle
  outline((t) => 38 + 7 * Math.cos(6 * t)), // flower
];

/* Blob: three organic, liquid outlines that flow into one another. */
const blob = (a, b, c) =>
  outline((t) => 39 + 4 * Math.sin(2 * t + a) + 3 * Math.sin(3 * t + b) + 1.6 * Math.sin(5 * t + c));
const BLOB = [blob(0, 1.2, 2.1), blob(2.4, 4.1, 0.6), blob(4.3, 0.4, 3.7)];

/* Burst: a calm circle that pops into an eight-point starburst and back. */
const BURST = [
  outline(() => 37),
  outline((t) => 32 + 12 * Math.abs(Math.cos(4 * t)) ** 3),
];

/* Hex: a rounded hexagon, a rounded square and a circle. `round` blends the
   hexagon toward a circle, which softens its corners. */
const polygon = (sides, radius, turn, round) =>
  outline((t) => {
    const seg = (Math.PI * 2) / sides;
    const local = (((t - turn) % seg) + seg) % seg;
    const edge = (radius * Math.cos(Math.PI / sides)) / Math.cos(local - Math.PI / sides);
    return edge * (1 - round) + radius * 0.93 * round;
  });
const HEX = [
  polygon(6, 44, -Math.PI / 2, 0.28), // hexagon, a point up
  outline((t) => 40 / (Math.abs(Math.cos(t)) ** 5 + Math.abs(Math.sin(t)) ** 5) ** 0.2), // rounded square
  outline(() => 39), // circle
];

/**
 * Each style: the outline it rests on, and how its loop is built.
 *
 *   seal   steps through seal, squircle and flower, holding on each, while
 *          the whole badge slowly turns — measured, like a stamp.
 *   blob   never holds: one liquid outline flows into the next, with a
 *          gentle sway, so it reads as alive rather than switching.
 *   burst  rests as a circle, then pops into a starburst with a twist and a
 *          little overshoot, and relaxes back — a twinkle.
 *   hex    a rounded hexagon that becomes a square and a circle in turn,
 *          beating twice on each — steady, like a pulse.
 */
const STYLES = {
  seal: {
    rest: SEAL[0],
    build(tl, shape) {
      [1, 2, 0].forEach((to) => {
        tl.to(shape, { morphSVG: SEAL[to], duration: 0.9, ease: "power3.inOut" }).to({}, { duration: 1.2 });
      });
      tl.to(shape, { rotate: 360, svgOrigin: "50 50", duration: tl.duration(), ease: "none" }, 0);
    },
  },
  blob: {
    rest: BLOB[0],
    build(tl, shape) {
      [1, 2, 0].forEach((to) => {
        tl.to(shape, { morphSVG: BLOB[to], duration: 1.6, ease: "sine.inOut" });
      });
      tl.to(
        shape,
        { rotate: 12, svgOrigin: "50 50", duration: tl.duration() / 2, ease: "sine.inOut", yoyo: true, repeat: 1 },
        0,
      );
    },
  },
  hex: {
    rest: HEX[0],
    build(tl, shape) {
      [1, 2, 0].forEach((to) => {
        tl.to(shape, { morphSVG: HEX[to], duration: 0.75, ease: "power3.inOut" })
          .to(shape, {
            keyframes: { scale: [1, 1.12, 1, 1.07, 1] },
            svgOrigin: "50 50",
            duration: 0.7,
            ease: "sine.inOut",
          })
          .to({}, { duration: 0.8 });
      });
    },
  },
  burst: {
    rest: BURST[0],
    build(tl, shape) {
      tl.to({}, { duration: 1.4 })
        .to(shape, {
          morphSVG: BURST[1],
          rotate: 45,
          scale: 1.08,
          svgOrigin: "50 50",
          duration: 0.6,
          ease: "back.out(2.4)",
        })
        .to({}, { duration: 0.9 })
        .to(shape, {
          morphSVG: BURST[0],
          rotate: 90,
          scale: 1,
          svgOrigin: "50 50",
          duration: 0.7,
          ease: "power3.inOut",
        })
        .set(shape, { rotate: 0, svgOrigin: "50 50" });
    },
  },
};

/**
 * A badge whose outline keeps morphing, with a mark held still in the middle.
 * `variant` picks the style — `seal` (default), `blob`, `burst` or `hex`,
 * see STYLES. `children` is the mark, drawn in the same 100 × 100 box;
 * `shapeClassName` colours the outline (use brand tokens, so a rebrand
 * recolours it); `delay` staggers badges that sit side by side so they never
 * pulse in unison.
 *
 * Plays only while on screen and the page is not being scrolled; still for
 * visitors who ask for less motion.
 * Decorative — hidden from assistive tech.
 */
export function MorphBadge({ className, shapeClassName, variant = "seal", delay = 0, children }) {
  const ref = useRef(null);
  const style = STYLES[variant] ?? STYLES.seal;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const shape = ref.current.querySelector("[data-shape]");
        const tl = gsap.timeline({ repeat: -1, paused: true, delay });
        style.build(tl, shape);

        // Runs only while on screen, and rests while the page is being
        // scrolled (see ScrollCalm) so every frame goes to the scroll.
        let onScreen = false;
        let scrolling = false;
        const sync = () => (onScreen && !scrolling ? tl.play() : tl.pause());
        const rest = () => ((scrolling = true), sync());
        const wake = () => ((scrolling = false), sync());

        ScrollTrigger.create({
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => ((onScreen = self.isActive), sync()),
        });
        window.addEventListener("scrollcalm:start", rest);
        window.addEventListener("scrollcalm:end", wake);
        return () => {
          window.removeEventListener("scrollcalm:start", rest);
          window.removeEventListener("scrollcalm:end", wake);
        };
      });
    },
    { scope: ref },
  );

  return (
    // Its own compositing layer (will-change): each morph frame then
    // repaints only this small badge, not the card or heading around it.
    <svg
      ref={ref}
      aria-hidden="true"
      viewBox="0 0 100 100"
      className={cn("will-change-transform", className)}
    >
      <path data-shape d={style.rest} className={shapeClassName} />
      {children}
    </svg>
  );
}
