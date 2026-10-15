"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

gsap.registerPlugin(useGSAP);

/** Seconds each story holds before the next one takes over. */
const DWELL = 6.5;

/**
 * How each variant dresses its photo: `shade` is laid over the picture, and
 * the copy itself is built in `Copy` below.
 */
const SHADES = {
  scrim: "bg-linear-to-t from-hero-ink/90 via-hero-ink/40 via-45% to-transparent to-70%",
  brand:
    "bg-linear-to-t from-brand-800 via-brand-700/55 via-40% to-transparent to-75% after:absolute after:inset-0 after:bg-brand-500/15 after:mix-blend-multiply",
  tint: "bg-linear-to-tr from-brand-700 via-brand-600/55 via-40% to-transparent to-75%",
};

/**
 * The tall "story" tile: a few use cases told one after another, each with
 * its own person, its own copy and its own look (see the variants in
 * data/useCases.js). Progress bars along the top count down each one, and
 * jump straight to a story when pressed.
 *
 * A change is a curtain: the next photo rises in from the foot of the tile,
 * settling from a slight zoom, while the one it covers drifts up and dims.
 * The words leave upwards and the new ones rise out of a mask after them,
 * one at a time. While a story holds, its photo creeps in very slowly.
 *
 * Stories hold still while hovered or focused, off screen, while the page is
 * being scrolled (see ScrollCalm), or when paused with the button. Visitors
 * who ask for less motion get plain cross-fades and no creep.
 */
export function UseCaseStory({ label, slides }) {
  const root = useRef(null);
  const api = useRef(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useGSAP(
    (_, contextSafe) => {
      const q = gsap.utils.selector(root);
      const slideEls = q("[data-slide]");
      const media = q("[data-media]");
      const dims = q("[data-dim]");
      const copies = q("[data-copy]");
      const fills = q("[data-fill]");
      const parts = (i) => ({
        words: copies[i].querySelectorAll("[data-word]"),
        meta: copies[i].querySelectorAll("[data-meta]"),
        panel: copies[i].querySelector("[data-panel]"),
      });
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      let current = 0;
      let busy = false;
      let dwell = null;
      // Every reason to hold still; a story only counts down when this is empty.
      const holds = new Set(["offscreen"]);
      const sync = () => dwell && (holds.size ? dwell.pause() : dwell.resume());
      const hold = (reason, on) => {
        if (on) holds.add(reason);
        else holds.delete(reason);
        sync();
      };

      // The countdown for story `i`: its bar fills, and its photo creeps in.
      const startDwell = (i) => {
        dwell?.kill();
        dwell = gsap
          .timeline({ paused: true, onComplete: () => go((i + 1) % slides.length) })
          .fromTo(fills[i], { scaleX: 0 }, { scaleX: 1, duration: DWELL, ease: "none" }, 0);
        if (!reduce) dwell.to(media[i], { scale: 1.07, duration: DWELL, ease: "none" }, 0);
        sync();
      };

      const go = contextSafe((next) => {
        if (busy || next === current) return;
        busy = true;
        dwell?.kill();
        dwell = null;
        const from = current;
        current = next;
        setActive(next);

        const tl = gsap.timeline({
          onComplete: () => {
            busy = false;
            startDwell(next);
          },
        });
        // Bars before the new story read full, the rest empty.
        fills.forEach((fill, k) =>
          tl.to(fill, { scaleX: k < next ? 1 : 0, duration: 0.5, ease: "power2.inOut" }, 0),
        );

        const out = parts(from);
        const inn = parts(next);

        if (reduce) {
          gsap.set(slideEls[next], { zIndex: 2, autoAlpha: 0 });
          gsap.set(inn.words, { yPercent: 0 });
          tl.to(slideEls[next], { autoAlpha: 1, duration: 0.5 }, 0)
            .to(copies[from], { autoAlpha: 0, duration: 0.3 }, 0)
            .fromTo(copies[next], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, 0.2)
            .set(slideEls[from], { autoAlpha: 0, zIndex: 0 })
            .set(slideEls[next], { zIndex: 1 });
          return;
        }

        // The curtain: the frame rises while the photo inside it is held back,
        // so the picture is uncovered rather than pushed up.
        gsap.set(slideEls[next], { zIndex: 2, autoAlpha: 1, yPercent: 100 });
        gsap.set(media[next], { yPercent: -60, scale: 1.25 });
        gsap.set(slideEls[from], { zIndex: 1 });
        tl.to(slideEls[next], { yPercent: 0, duration: 1.3, ease: "expo.inOut" }, 0)
          .to(media[next], { yPercent: 0, duration: 1.3, ease: "expo.inOut" }, 0)
          .to(media[next], { scale: 1, duration: 1.9, ease: "expo.out" }, 0.15)
          .to(media[from], { yPercent: -18, scale: "+=0.08", duration: 1.3, ease: "expo.inOut" }, 0)
          .to(dims[from], { opacity: 0.6, duration: 1.3, ease: "expo.inOut" }, 0);

        // Copy out: words lift out of their masks, the rest fades up and away.
        tl.to(out.words, { yPercent: -110, duration: 0.55, stagger: 0.02, ease: "power3.in" }, 0)
          .to(out.meta, { autoAlpha: 0, y: -8, duration: 0.4, ease: "power2.in" }, 0);
        if (out.panel) {
          tl.to(out.panel, { autoAlpha: 0, y: -12, scale: 0.98, duration: 0.5, ease: "power2.in" }, 0.1);
        }
        tl.set(copies[from], { autoAlpha: 0 }, 0.7);

        // Copy in: the panel settles, then the words rise one by one.
        tl.set(copies[next], { autoAlpha: 1 }, 0.55);
        if (inn.panel) {
          tl.fromTo(
            inn.panel,
            { autoAlpha: 0, y: 28, scale: 0.96 },
            { autoAlpha: 1, y: 0, scale: 1, duration: 1.1, ease: "expo.out" },
            0.55,
          );
        }
        tl.fromTo(
          inn.words,
          { yPercent: 110 },
          { yPercent: 0, duration: 1, stagger: 0.045, ease: "expo.out" },
          0.7,
        ).fromTo(
          inn.meta,
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power3.out" },
          0.95,
        );

        // Put the story that left back where it waits.
        tl.set(slideEls[from], { autoAlpha: 0, zIndex: 0, yPercent: 0 })
          .set(media[from], { yPercent: 0, scale: 1 })
          .set(dims[from], { opacity: 0 })
          .set(slideEls[next], { zIndex: 1 });
      });

      api.current = { go, hold };

      // Start counting only once the tile is on screen; the first time it
      // arrives, its words rise in with the tile's own fade.
      let introduced = false;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !introduced) {
            introduced = true;
            if (!reduce) {
              const first = parts(0);
              gsap.fromTo(
                first.words,
                { yPercent: 110 },
                { yPercent: 0, duration: 1.1, stagger: 0.045, ease: "expo.out", delay: 0.35 },
              );
            }
            startDwell(0);
          }
          hold("offscreen", !entry.isIntersecting);
        },
        { threshold: 0.35 },
      );
      observer.observe(root.current);

      const rest = () => hold("scrolling", true);
      const wake = () => hold("scrolling", false);
      window.addEventListener("scrollcalm:start", rest);
      window.addEventListener("scrollcalm:end", wake);

      return () => {
        observer.disconnect();
        window.removeEventListener("scrollcalm:start", rest);
        window.removeEventListener("scrollcalm:end", wake);
        api.current = null;
      };
    },
    { scope: root },
  );

  useEffect(() => {
    api.current?.hold("user", paused);
  }, [paused]);

  return (
    <div
      ref={root}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      className="absolute inset-0"
      onPointerEnter={(e) => e.pointerType === "mouse" && api.current?.hold("hover", true)}
      onPointerLeave={() => api.current?.hold("hover", false)}
      // Keyboard focus holds the story; a mouse click on a bar does not, or
      // it would stay paused after the pointer has left.
      onFocus={(e) => e.target.matches(":focus-visible") && api.current?.hold("focus", true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && api.current?.hold("focus", false)}
    >
      {/* Photos, stacked. Only the current one is shown at rest. */}
      <div className="absolute inset-0 isolate">
        {slides.map((slide, i) => (
          <div
            key={slide.tag.strong}
            data-slide
            aria-hidden={i !== active}
            className="absolute inset-0 overflow-hidden will-change-transform"
            style={i === 0 ? { zIndex: 1 } : { visibility: "hidden", opacity: 0 }}
          >
            <div data-media className="absolute inset-0 will-change-transform">
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                sizes="(min-width: 1024px) 34vw, (min-width: 768px) 50vw, 100vw"
                style={{ objectPosition: slide.focus }}
                className="object-cover"
              />
              <div className={cn("absolute inset-0", SHADES[slide.variant])} />
            </div>
            <div data-dim className="absolute inset-0 bg-hero-ink opacity-0" />
          </div>
        ))}
      </div>

      {/* Bars and pause, over a soft fade so they hold on a pale photo. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-linear-to-b from-hero-ink/55 to-transparent" />
      <div className="absolute inset-x-0 top-0 z-20 flex items-center gap-3 px-6 pt-5 lg:px-7">
        <div className="flex flex-1 gap-1.5">
          {slides.map((slide, i) => (
            <button
              key={slide.tag.strong}
              type="button"
              onClick={() => api.current?.go(i)}
              aria-label={`Show story ${i + 1} of ${slides.length}: ${slide.tag.strong}`}
              aria-current={i === active}
              className="relative h-6 flex-1 cursor-pointer rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-white/30">
                <span
                  data-fill
                  className="absolute inset-0 origin-left rounded-full bg-white"
                  style={{ transform: "scaleX(0)" }}
                />
              </span>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? "Play the stories" : "Pause the stories"}
          className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-full bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-md transition-colors hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5 fill-current">
            {paused ? (
              <path d="M4.5 2.8v10.4a.6.6 0 0 0 .9.5l8.3-5.2a.6.6 0 0 0 0-1L5.4 2.3a.6.6 0 0 0-.9.5Z" />
            ) : (
              <path d="M4 2.5h2.6v11H4zM9.4 2.5H12v11H9.4z" />
            )}
          </svg>
        </button>
      </div>

      {/* Copy, stacked in one cell at the foot. */}
      <div className="absolute inset-x-0 bottom-0 z-20 grid p-6 lg:p-7">
        {slides.map((slide, i) => (
          <div
            key={slide.tag.strong}
            data-copy
            aria-hidden={i !== active}
            className="[grid-area:1/1] self-end"
            style={i === 0 ? undefined : { visibility: "hidden", opacity: 0 }}
          >
            <Copy slide={slide} />
          </div>
        ))}
      </div>
    </div>
  );
}

/** One story's copy, dressed for its variant. */
function Copy({ slide }) {
  const { variant, statement, tag } = slide;

  if (variant === "tint") {
    return (
      <>
        <p
          data-meta
          className="flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-white/85 uppercase"
        >
          <span className="size-1.5 rounded-full bg-white" />
          {tag.strong}
        </p>
        <h3 className="mt-3 max-w-[27rem] font-heading text-[clamp(1.5rem,2.2vw,2rem)] leading-[1.12] font-semibold tracking-[-0.02em] text-balance text-white">
          <Words text={statement} />
        </h3>
        <p data-meta className="mt-4 text-sm text-white/80">
          {tag.rest}
        </p>
      </>
    );
  }

  if (variant === "brand") {
    return (
      <>
        <p
          data-meta
          className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold tracking-[0.02em] text-brand-700"
        >
          {tag.strong}
        </p>
        <h3 className="mt-4 max-w-[27rem] font-heading text-[clamp(1.5rem,2.2vw,2rem)] leading-[1.12] font-semibold tracking-[-0.02em] text-balance text-white">
          <Words text={statement} />
        </h3>
        <p data-meta className="mt-4 text-sm text-white/80">
          {tag.rest}
        </p>
      </>
    );
  }

  return (
    <>
      <h3 className="max-w-[27rem] font-heading text-[clamp(1.5rem,2.2vw,2rem)] leading-[1.12] font-semibold tracking-[-0.02em] text-balance text-white">
        <Words text={statement} />
      </h3>
      <p data-meta className="mt-4 text-sm text-white/70">
        <strong className="font-semibold text-white">{tag.strong}</strong>, {tag.rest}
      </p>
    </>
  );
}

/**
 * Each word in its own mask, so it can rise into view rather than fade. The
 * mask is padded above and below the line, so tall capitals and descenders
 * are never clipped.
 */
function Words({ text }) {
  return text.split(" ").map((word, i) => (
    <span key={i}>
      {i > 0 && " "}
      <span className="-my-[0.14em] inline-block overflow-hidden py-[0.14em] align-top">
        <span data-word className="inline-block will-change-transform">
          {word}
        </span>
      </span>
    </span>
  ));
}
