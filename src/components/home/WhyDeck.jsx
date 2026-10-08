"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { WhyCard } from "@/components/home/WhyCard";
import { Reveal } from "@/components/shared/Reveal";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Scroll distance per pixel the row travels — a little over 1:1 feels calm. */
const SCROLL_RATIO = 1.1;

/**
 * Pauses either side of the slide, as a share of it. The section settles into
 * its pin before the row starts, and holds the last card a beat before it
 * lets go, so neither hand-off is a jolt.
 */
const HOLD = 0.15;

/**
 * The "why choose us" cards as a pinned, sideways row, from `lg` up.
 *
 * The section holds still under the header with the first three cards already in
 * view, set in from the left so the row starts right of the page edge;
 * scrolling down slides it to the left, bringing the rest in from the right
 * until the last card has landed. The inset is padding on the row, so it is
 * counted in the distance travelled.
 *
 * Kept jank-free on purpose: the section holds still with CSS `sticky`
 * rather than a JavaScript pin — no switch to `position: fixed` that could
 * land a frame late — and the row moves on the compositor via a transform
 * with `will-change`. GSAP only drives the row.
 *
 * Below `lg`, or for visitors who ask for less motion, nothing is pinned and
 * the cards fall back to a plain grid. The layout switch is done in CSS
 * (`lg:motion-safe:`) and the motion in a matching `gsap.matchMedia`, so the
 * two can never disagree.
 */
export function WhyDeck({ items }) {
  const rootRef = useRef(null);
  const rowRef = useRef(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const section = root.closest("section") ?? root;
      const row = rowRef.current;
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        // The section's content block is what holds still. It is made
        // sticky — the browser keeps it in place on the same thread that
        // scrolls, so it can never lag a frame and jump the way a JS pin
        // does. A spacer after it gives the scroll room to play out in.
        const frame = section.firstElementChild;
        const spacer = document.createElement("div");
        spacer.setAttribute("aria-hidden", "true");
        section.appendChild(spacer);

        // Ends with the last full frame of cards — three at xl, two at lg —
        // lined up on the left edge: the row stops when the first of them
        // reaches it.
        const perView = () => (window.matchMedia("(min-width: 1280px)").matches ? 3 : 2);
        const travel = () => {
          const cards = row.children;
          const first = cards[Math.max(0, cards.length - perView())];
          return first ? first.offsetLeft : 0;
        };
        const distance = () => travel() * SCROLL_RATIO * (1 + HOLD * 2);

        // Stick just below the header, or higher if heading plus cards would
        // not fit the screen — then only the heading tucks under the header.
        const top = () => {
          const header = parseFloat(getComputedStyle(section).paddingTop) || 0;
          return Math.min(header, window.innerHeight - frame.offsetHeight - 24);
        };

        const layout = () => {
          frame.style.position = "sticky";
          frame.style.top = `${top()}px`;
          spacer.style.height = `${distance()}px`;
        };
        layout();

        const tl = gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              // The spacer never moves, so it is a stable thing to measure:
              // the frame is stuck from the moment the spacer's top reaches
              // the frame's bottom, until the spacer has scrolled past.
              trigger: spacer,
              start: () => `top top+=${top() + frame.offsetHeight}`,
              end: () => `+=${distance()}`,
              // A softer catch-up, so a quick flick glides instead of jumping.
              scrub: 1,
              invalidateOnRefresh: true,
              onRefreshInit: layout,
            },
          })
          // Eased in and out: the row gathers speed after the frame settles
          // and slows to a stop before it lets go.
          .fromTo(
            row,
            { x: 0 },
            { x: () => -travel(), ease: "power2.inOut", duration: 1, force3D: true },
            HOLD,
          )
          .to({}, { duration: HOLD });

        return () => {
          tl.kill();
          spacer.remove();
          frame.style.position = "";
          frame.style.top = "";
        };
      });
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="mt-12 lg:mt-14">
      <div className="lg:motion-safe:overflow-hidden">
        <Reveal>
          <ul
            ref={rowRef}
            className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:motion-safe:flex lg:motion-safe:gap-8 lg:motion-safe:pl-[22%] lg:motion-safe:will-change-transform xl:motion-safe:pl-[24%]"
          >
            {items.map((item, i) => (
              <li
                key={item.title}
                // A share of the room left after the inset — three to a frame at xl,
                // two at lg — so the first set always fits exactly.
                className="lg:motion-safe:w-[calc((100%-2rem)/2)] lg:motion-safe:shrink-0 xl:motion-safe:w-[calc((100%-4rem)/3)]"
              >
                <WhyCard item={item} index={i} />
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </div>
  );
}
