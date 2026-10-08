"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

/**
 * A statement title that reads itself in as you scroll: every word starts
 * muted and turns fully on, one after another, in step with the scroll
 * position (SplitText + a scrubbed ScrollTrigger). Scroll back up and it
 * fades back down.
 *
 * `parts` is a list of strings and `{ brand }` pieces — brand pieces are set
 * in the brand colour, and light up the same way.
 *
 * The text is real text throughout, so it reads normally to assistive tech
 * and without JavaScript. With reduced motion it is simply shown fully on.
 */
export function ScrollRevealTitle({ id, parts, className }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create(ref.current, { type: "words" });
        gsap.fromTo(
          split.words,
          { opacity: 0.16 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: {
              trigger: ref.current,
              start: "top 82%",
              end: "bottom 42%",
              scrub: 0.6,
            },
          },
        );
        return () => split.revert();
      });
    },
    { scope: ref },
  );

  return (
    <h2 ref={ref} id={id} className={className}>
      {parts.map((part, i) =>
        typeof part === "string" ? (
          part
        ) : (
          <span key={i} className="text-brand">
            {part.brand}
          </span>
        ),
      )}
    </h2>
  );
}
