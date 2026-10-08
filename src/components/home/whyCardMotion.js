import { gsap } from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

gsap.registerPlugin(DrawSVGPlugin);

/**
 * GSAP motion for the "why choose us" illustrations.
 *
 * Every illustration gets the same entrance — its lines draw themselves in —
 * and then a small looping story of its own, built from the `data-a` marks
 * on its SVG parts (see the art in WhyCard.jsx). Everything is created
 * paused; `WhyCard` decides when it plays.
 */

const q = (svg, name) => [...svg.querySelectorAll(`[data-a="${name}"]`)];

/**
 * Entrance: every stroke draws on, a few at a time. Dashed lines keep their
 * dashes (DrawSVG would overwrite them) and filled dots pop instead.
 */
export function drawIn(svg) {
  const all = [...svg.querySelectorAll("path, rect, circle, ellipse, polyline")];
  const strokes = all.filter(
    (el) =>
      !el.hasAttribute("stroke-dasharray") && el.getAttribute("fill") !== "currentColor",
  );
  const dots = all.filter((el) => el.getAttribute("fill") === "currentColor");

  return gsap
    .timeline({ paused: true })
    .from(strokes, {
      drawSVG: 0,
      duration: 1.1,
      ease: "power2.inOut",
      stagger: 0.03,
    })
    .from(
      dots,
      { scale: 0, transformOrigin: "50% 50%", duration: 0.3, stagger: 0.08, ease: "back.out(3)" },
      "-=0.4",
    );
}

/** Shorthand for a paused, endlessly repeating timeline. */
const loop = (repeatDelay = 1) =>
  gsap.timeline({
    paused: true,
    repeat: -1,
    repeatDelay,
    // Nothing should jump to its start state until its turn comes round.
    defaults: { immediateRender: false },
  });

/** Endless dash flow along dashed connectors. */
const flow = (els) =>
  gsap.to(els, { strokeDashoffset: -18, duration: 0.9, ease: "none", repeat: -1, paused: true });

/**
 * One builder per illustration. Each returns the animations to run, all
 * paused, so the caller can play and pause them together.
 */
export const LOOPS = {
  /** The card leaves, the button is pressed, a fresh card slides out. */
  cards(svg) {
    const card = q(svg, "card");
    const tl = loop(0.4)
      .to(card, { x: 16, opacity: 0, duration: 0.45, ease: "power2.in" }, "+=1.6")
      .to(q(svg, "spark"), { scale: 0, duration: 0.25, transformOrigin: "50% 50%" }, "<")
      .to(q(svg, "plus"), {
        scale: 0.82,
        duration: 0.14,
        yoyo: true,
        repeat: 1,
        transformOrigin: "50% 50%",
        ease: "power1.inOut",
      })
      .fromTo(
        q(svg, "chev"),
        { opacity: 0.15 },
        { opacity: 1, duration: 0.18, stagger: 0.1, yoyo: true, repeat: 1 },
        "<0.1",
      )
      .fromTo(card, { x: -28, opacity: 0 }, { x: 0, opacity: 1, duration: 0.75, ease: "back.out(1.5)" }, "<0.15")
      .fromTo(
        q(svg, "wave"),
        { opacity: 0 },
        { opacity: 1, duration: 0.25, stagger: 0.12, yoyo: true, repeat: 3 },
        ">-0.2",
      )
      .fromTo(
        q(svg, "spark"),
        { scale: 0, rotate: -60 },
        { scale: 1, rotate: 0, duration: 0.45, transformOrigin: "50% 50%", ease: "back.out(3)" },
        "<",
      );
    return [tl];
  },

  /** Digits type into the field, the padlock clicks shut, the check lands. */
  shield(svg) {
    const tl = loop(1.4)
      .to(q(svg, "dot"), { opacity: 0, duration: 0.2 })
      .to(q(svg, "check"), { drawSVG: 0, duration: 0.2 }, "<")
      .to(q(svg, "shackle"), { y: -4, duration: 0.2 }, "<")
      .fromTo(
        q(svg, "dot"),
        { opacity: 0, scale: 0.3 },
        { opacity: 1, scale: 1, duration: 0.18, stagger: 0.16, transformOrigin: "50% 50%" },
        "+=0.2",
      )
      .to(q(svg, "shackle"), { y: 0, duration: 0.3, ease: "back.out(3)" }, "+=0.1")
      .to(q(svg, "check"), { drawSVG: "100%", duration: 0.5, ease: "power2.out" }, "+=0.15")
      .to(
        q(svg, "shield"),
        { scale: 1.06, duration: 0.22, yoyo: true, repeat: 1, transformOrigin: "50% 50%" },
        "<0.2",
      );
    return [tl];
  },

  /** Each instalment is paid in turn: segment ticked, node ticked. */
  plans(svg) {
    const seg = q(svg, "segcheck");
    const node = q(svg, "nodecheck");
    const rings = q(svg, "node");

    const tl = loop(1.2).to([...seg, ...node], { drawSVG: 0, duration: 0.3 });
    seg.forEach((s, i) => {
      tl.to(s, { drawSVG: "100%", duration: 0.35, ease: "power2.out" }, i === 0 ? "+=0.3" : "+=0.35")
        .to(node[i], { drawSVG: "100%", duration: 0.35, ease: "power2.out" }, "<0.15")
        .fromTo(
          rings[i],
          { scale: 1 },
          { scale: 1.2, duration: 0.18, yoyo: true, repeat: 1, transformOrigin: "50% 50%" },
          "<",
        );
    });
    tl.to({}, { duration: 1.4 });

    return [tl, flow(q(svg, "dash"))];
  },

  /** The line climbs, the latest point pings, the alert drops in and rings. */
  monitor(svg) {
    const toast = q(svg, "toast");
    const tl = loop(0.6)
      .to(toast, { y: -10, opacity: 0, duration: 0.3 })
      .to(q(svg, "line"), { drawSVG: 0, duration: 0.25 }, "<")
      .to(q(svg, "line"), { drawSVG: "100%", duration: 1.2, ease: "power1.inOut" })
      .fromTo(q(svg, "point"), { scale: 0 }, { scale: 1, duration: 0.3, transformOrigin: "50% 50%", ease: "back.out(3)" })
      .fromTo(
        q(svg, "ring"),
        { scale: 0.5, opacity: 0.9 },
        { scale: 1.8, opacity: 0, duration: 0.7, transformOrigin: "50% 50%", ease: "power2.out" },
        "<",
      )
      .to(toast, { y: 0, opacity: 1, duration: 0.5, ease: "back.out(2)" }, "<0.1")
      .to(q(svg, "bell"), {
        keyframes: { rotate: [0, -16, 12, -8, 5, 0] },
        duration: 0.7,
        transformOrigin: "50% 15%",
      })
      .to({}, { duration: 1.6 });

    return [tl, flow(q(svg, "dash"))];
  },

  /** Coins travel the orbit, brighter in front; the globe turns. */
  currency(svg) {
    const coins = q(svg, "coin");
    const cx = 100;
    const cy = 72;
    const rx = 86;
    const ry = 26;
    const tilt = (-12 * Math.PI) / 180;
    const cos = Math.cos(tilt);
    const sin = Math.sin(tilt);

    // Start each coin at the angle nearest where it is drawn, so the orbit
    // picks up from the static picture instead of jumping.
    const phases = coins.map((coin) => {
      const dx = Number(coin.dataset.cx) - cx;
      const dy = Number(coin.dataset.cy) - cy;
      const px = dx * cos + dy * sin;
      const py = -dx * sin + dy * cos;
      return Math.atan2(py / ry, px / rx);
    });

    const state = { t: 0 };
    const orbit = gsap.to(state, {
      t: Math.PI * 2,
      duration: 14,
      ease: "none",
      repeat: -1,
      paused: true,
      onUpdate: () => {
        coins.forEach((coin, i) => {
          const a = phases[i] + state.t;
          const px = rx * Math.cos(a);
          const py = ry * Math.sin(a);
          gsap.set(coin, {
            x: cx + px * cos - py * sin - Number(coin.dataset.cx),
            y: cy + px * sin + py * cos - Number(coin.dataset.cy),
            // In front of the globe (lower half of the orbit) reads stronger.
            opacity: 0.45 + 0.55 * ((Math.sin(a) + 1) / 2),
          });
        });
      },
    });

    const spin = gsap.to(q(svg, "meridian"), {
      scaleX: 0.15,
      duration: 2.4,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      paused: true,
      svgOrigin: "100 72",
    });

    return [orbit, spin];
  },

  /** Typing dots bounce, the clock sweeps, the headset floats. */
  support(svg) {
    const dots = gsap.to(q(svg, "dot"), {
      y: -5,
      duration: 0.32,
      ease: "sine.inOut",
      paused: true,
      stagger: { each: 0.14, repeat: -1, yoyo: true },
    });
    const minute = gsap.to(q(svg, "minute"), {
      rotate: 360,
      duration: 6,
      ease: "none",
      repeat: -1,
      paused: true,
      svgOrigin: "150 40",
    });
    const hour = gsap.to(q(svg, "hour"), {
      rotate: 360,
      duration: 48,
      ease: "none",
      repeat: -1,
      paused: true,
      svgOrigin: "150 40",
    });
    const arrow = gsap.to(q(svg, "loop"), {
      rotate: 360,
      duration: 9,
      ease: "none",
      repeat: -1,
      paused: true,
      svgOrigin: "150 40",
    });
    const float = gsap.to(q(svg, "headset"), {
      y: -3,
      duration: 1.8,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      paused: true,
    });

    return [dots, minute, hour, arrow, float];
  },
};
