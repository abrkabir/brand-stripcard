import { gsap } from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";

gsap.registerPlugin(DrawSVGPlugin, MorphSVGPlugin);

/**
 * GSAP motion for the "why choose us" illustrations.
 *
 * Every illustration gets the same entrance — its shapes pop in one after
 * another — and then a looping story of its own, driven mostly by MorphSVG:
 * one path reshaping into another (a card folding back into a phone, a
 * shield becoming a padlock, one bill splitting into four). The parts are
 * found by their `data-a` marks (see the art in WhyCard.jsx).
 *
 * Every drawing rests on the *end* of its story, so each loop first steps
 * back to the beginning and then plays forward to that resting picture.
 * Everything is created paused; `WhyCard` decides when it plays.
 */

const q = (svg, name) => [...svg.querySelectorAll(`[data-a="${name}"]`)];

/**
 * A brand colour as a real value. GSAP can only blend between colours it can
 * parse, not `var(--…)` strings, so the token is read out of the stylesheet —
 * which keeps variables.css the only place it is defined.
 */
const token = (name) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

/* Shapes the morphs travel to and from. Same 200 × 140 space as the art. */
const SHAPE = {
  /** A card thumbnail sitting on the phone's screen. */
  thumb: "M36 40h24a5 5 0 0 1 5 5v14a5 5 0 0 1-5 5H36a5 5 0 0 1-5-5V45a5 5 0 0 1 5-5Z",
  /** A padlock: shackle and body as one path. */
  padlock:
    "M150 74v-10a14 14 0 0 1 28 0v10h-7v-10a7 7 0 0 0-14 0v10ZM144 74h40a6 6 0 0 1 6 6v28a6 6 0 0 1-6 6h-40a6 6 0 0 1-6-6V80a6 6 0 0 1 6-6Z",
  /** One bill, before it is split. */
  total: "M35 28h136a13 13 0 0 1 0 26H35a13 13 0 0 1 0-26Z",
  /** A quiet week on the chart, line and fill. */
  calmLine: "M24 104c18-4 32 4 50-2s34-4 68-2",
  calmArea: "M24 120v-16c18-4 32 4 50-2s34-4 68-2v20Z",
  /** The coin's other two symbols. */
  euro: "M120 52a24 24 0 1 0 0 36M76 64h32M76 76h32",
  pound: "M116 52c-2-6-7-9-13-9-9 0-14 6-14 14v39M80 70h28M78 96h42",
  /** The customer's question, tail on the left. */
  question:
    "M40 26h76a16 16 0 0 1 16 16v26a16 16 0 0 1-16 16H62l-16 14V84h-6a16 16 0 0 1-16-16V42a16 16 0 0 1 16-16Z",
};

/** Entrance: the drawing's parts pop in one after another. */
export function popIn(svg) {
  return gsap.from(svg.children, {
    opacity: 0,
    scale: 0.8,
    y: 8,
    transformOrigin: "50% 50%",
    duration: 0.6,
    ease: "back.out(1.7)",
    stagger: 0.07,
    paused: true,
  });
}

/** Shorthand for a paused, endlessly repeating timeline. */
const loop = (repeatDelay = 1.6) =>
  gsap.timeline({
    paused: true,
    repeat: -1,
    repeatDelay,
    // Nothing should jump to its start state until its turn comes round.
    defaults: { immediateRender: false },
  });

/**
 * One builder per illustration. Each returns the animations to run, all
 * paused, so the caller can play and pause them together.
 */
export const LOOPS = {
  /** The card folds back into the phone, "+" is pressed, it grows out again. */
  cards(svg) {
    const card = q(svg, "morph")[0];
    const cardShape = card.getAttribute("d");

    const tl = loop(1.8)
      .to(q(svg, "detail"), { opacity: 0, duration: 0.25 })
      .to(q(svg, "spark"), { scale: 0, duration: 0.25, transformOrigin: "50% 50%" }, "<")
      .to(card, { morphSVG: SHAPE.thumb, duration: 0.7, ease: "power3.inOut" })
      .to(q(svg, "plus"), {
        scale: 0.82,
        duration: 0.14,
        yoyo: true,
        repeat: 1,
        transformOrigin: "50% 50%",
      }, "+=0.3")
      .to(card, { morphSVG: cardShape, duration: 0.8, ease: "back.out(1.3)" }, "+=0.1")
      .to(q(svg, "detail"), { opacity: 1, duration: 0.35 }, "-=0.2")
      .fromTo(
        q(svg, "spark"),
        { scale: 0, rotate: -90 },
        { scale: 1, rotate: 0, duration: 0.5, transformOrigin: "50% 50%", ease: "back.out(3)" },
        "<",
      );
    return [tl];
  },

  /** The shield becomes a padlock, the number types in, it becomes a shield. */
  shield(svg) {
    const shape = q(svg, "morph")[0];
    const shield = shape.getAttribute("d");
    const dots = q(svg, "dot");
    const check = q(svg, "check");

    const tl = loop(1.6)
      .to(check, { drawSVG: 0, duration: 0.25 })
      .to(shape, { morphSVG: SHAPE.padlock, duration: 0.7, ease: "power3.inOut" })
      .to(dots, { opacity: 0, scale: 0.3, transformOrigin: "50% 50%", duration: 0.2 }, "<")
      .to(dots, {
        opacity: 1,
        scale: 1,
        duration: 0.2,
        stagger: 0.16,
        ease: "back.out(3)",
      }, "+=0.15")
      .to(shape, { morphSVG: shield, duration: 0.7, ease: "back.out(1.4)" }, "+=0.25")
      .to(check, { drawSVG: "100%", duration: 0.45, ease: "power2.out" }, "-=0.15");
    return [tl];
  },

  /** One bill splits into four, then they are paid off left to right. */
  plans(svg) {
    const shape = q(svg, "morph")[0];
    const parts = shape.getAttribute("d");
    const paid = q(svg, "paid");
    const nodes = q(svg, "node");
    const progress = q(svg, "progress");

    // Progress width per instalment, matching the node spacing.
    const step = 42;
    const idle = token("--color-brand-200");
    const done = token("--color-brand-500");

    const tl = loop(1.6)
      .to(paid, { opacity: 0, duration: 0.3 })
      .to(progress, { attr: { width: 0 }, duration: 0.4 }, "<")
      .to(nodes, { fill: idle, duration: 0.3 }, "<")
      .to(shape, { morphSVG: SHAPE.total, duration: 0.5, ease: "power2.inOut" }, "<")
      .to(shape, { morphSVG: parts, duration: 0.8, ease: "back.out(1.5)" }, "+=0.4");

    paid.forEach((part, i) => {
      tl.fromTo(
        part,
        { opacity: 0, scale: 0.6 },
        { opacity: 1, scale: 1, duration: 0.35, transformOrigin: "50% 50%", ease: "back.out(2)" },
        i === 0 ? "+=0.3" : "+=0.25",
      )
        .to(nodes[i], { fill: done, duration: 0.2 }, "<")
        .to(progress, { attr: { width: Math.min(step * i, 126) }, duration: 0.3 }, "<");
    });

    return [tl];
  },

  /** A quiet week surges, the latest point climbs, the alert drops and rings. */
  monitor(svg) {
    const area = q(svg, "area")[0];
    const line = q(svg, "line")[0];
    const surgeArea = area.getAttribute("d");
    const surgeLine = line.getAttribute("d");
    const toast = q(svg, "toast");
    const point = q(svg, "point");

    const tl = loop(1.4)
      .to(toast, { y: -14, opacity: 0, duration: 0.35 })
      .to(area, { morphSVG: SHAPE.calmArea, duration: 0.6, ease: "power2.inOut" }, "<")
      .to(line, { morphSVG: SHAPE.calmLine, duration: 0.6, ease: "power2.inOut" }, "<")
      .to(point, { attr: { cy: 100 }, duration: 0.6, ease: "power2.inOut" }, "<")
      .to(area, { morphSVG: surgeArea, duration: 1, ease: "power3.inOut" }, "+=0.6")
      .to(line, { morphSVG: surgeLine, duration: 1, ease: "power3.inOut" }, "<")
      .to(point, { attr: { cy: 60 }, duration: 1, ease: "power3.inOut" }, "<")
      .to(toast, { y: 0, opacity: 1, duration: 0.5, ease: "back.out(2)" }, "-=0.2")
      .to(q(svg, "bell"), {
        keyframes: { rotate: [0, -18, 14, -9, 5, 0] },
        duration: 0.7,
        transformOrigin: "50% 15%",
      });
    return [tl];
  },

  /** The coin's symbol turns $ → € → £ and back; small coins drift. */
  currency(svg) {
    const symbol = q(svg, "morph")[0];
    const dollar = symbol.getAttribute("d");

    const tl = loop(0)
      .to(symbol, { morphSVG: SHAPE.euro, duration: 0.8, ease: "power3.inOut" }, "+=1.4")
      .to(symbol, { morphSVG: SHAPE.pound, duration: 0.8, ease: "power3.inOut" }, "+=1.4")
      .to(symbol, { morphSVG: dollar, duration: 0.8, ease: "power3.inOut" }, "+=1.4");

    const drift = gsap.to(q(svg, "float"), {
      y: -6,
      duration: 2,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      stagger: 0.6,
      paused: true,
    });

    return [tl, drift];
  },

  /** The question becomes the reply; the reply types; the clock runs. */
  support(svg) {
    const bubble = q(svg, "morph")[0];
    const reply = bubble.getAttribute("d");
    const typing = q(svg, "typing");
    const question = q(svg, "question");

    const tl = loop(1.2)
      .to(typing, { opacity: 0, duration: 0.2 })
      .to(bubble, { morphSVG: SHAPE.question, duration: 0.7, ease: "power3.inOut" })
      .to(question, { opacity: 1, duration: 0.3 }, "-=0.2")
      .to(question, { opacity: 0, duration: 0.2 }, "+=1.4")
      .to(bubble, { morphSVG: reply, duration: 0.7, ease: "back.out(1.4)" })
      .to(typing, { opacity: 1, duration: 0.3 }, "-=0.2");

    const dots = gsap.to(q(svg, "dot"), {
      y: -5,
      duration: 0.32,
      ease: "sine.inOut",
      paused: true,
      stagger: { each: 0.14, repeat: -1, yoyo: true },
    });
    const minute = gsap.to(q(svg, "minute"), {
      rotate: 360,
      duration: 5,
      ease: "none",
      repeat: -1,
      paused: true,
      svgOrigin: "176 22",
    });
    const hour = gsap.to(q(svg, "hour"), {
      rotate: 360,
      duration: 40,
      ease: "none",
      repeat: -1,
      paused: true,
      svgOrigin: "176 22",
    });

    return [tl, dots, minute, hour];
  },
};
