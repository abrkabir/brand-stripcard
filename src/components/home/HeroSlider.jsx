"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { FADE_MS, SLIDE_MS, heroSlides } from "@/data/slides";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";

/**
 * Slide motion → utility class.
 *
 * These are written out as whole literal class names on purpose. Tailwind
 * scans source text, so a composed string like `animate-ken-${motion}` would
 * never be found and the animation would be pruned from the build.
 */
const KEN = {
  "zoom-in": "animate-ken-zoom-in",
  "zoom-out": "animate-ken-zoom-out",
  "pan-left": "animate-ken-pan-left",
  "pan-right": "animate-ken-pan-right",
};

/**
 * The drift outlives the slide by one fade at each end, so the frame is still
 * moving while the next one comes up and the motion never visibly stops.
 */
const KEN_MS = SLIDE_MS + FADE_MS * 2;

/**
 * Full-bleed banner slider.
 *
 * Three things make stills read as footage rather than a slideshow: every
 * frame is always in motion (a slow scale-and-pan that never settles), the
 * transition is a long crossfade rather than a cut, and consecutive slides
 * drift in different directions so the loop has no rhythm to latch onto.
 *
 * `SLIDE_MS` is the single source of truth for the autoplay timer, the ring
 * that fills on the active dot, and the drift duration — they cannot desync.
 */
export function HeroSlider() {
  const [active, setActive] = useState(0);
  // The outgoing slide keeps drifting while it fades, so its transform is
  // never reset mid-view. Without this the old frame visibly snaps back.
  const [previous, setPrevious] = useState(null);
  const reduced = usePrefersReducedMotion();

  const go = useCallback(
    (next) => {
      if (next === active) return;
      setPrevious(active);
      setActive(next);
    },
    [active],
  );

  useEffect(() => {
    if (reduced) return;
    const timer = setTimeout(
      () => go((active + 1) % heroSlides.length),
      SLIDE_MS,
    );
    return () => clearTimeout(timer);
  }, [active, reduced, go]);

  const onDotKeys = (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go((active + 1) % heroSlides.length);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      go((active - 1 + heroSlides.length) % heroSlides.length);
    }
  };

  const slide = heroSlides[active];

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Adestate highlights"
      className="relative h-[100svh] min-h-[36rem] w-full overflow-hidden bg-black"
    >
      {/* ── Frames ─────────────────────────────────────────────────────── */}
      {heroSlides.map((item, index) => {
        const isActive = index === active;
        const drifting = !reduced && (isActive || index === previous);

        return (
          <div
            key={item.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${heroSlides.length}: ${item.title}`}
            aria-hidden={!isActive}
            className={cn(
              "absolute inset-0 transition-opacity ease-linear",
              isActive ? "opacity-100" : "opacity-0",
            )}
            style={{ transitionDuration: `${FADE_MS}ms` }}
          >
            <div
              className={cn(
                "absolute inset-0 will-change-transform",
                drifting && KEN[item.motion],
              )}
              // The class carries the keyframes; the duration comes from
              // SLIDE_MS so the drift, the timer and the ring stay in step.
              style={drifting ? { animationDuration: `${KEN_MS}ms` } : undefined}
            >
              <Image
                src={item.image}
                alt={item.alt}
                fill
                priority={index === 0}
                loading={index === 0 ? undefined : "lazy"}
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </div>
        );
      })}

      {/* ── Legibility scrim ───────────────────────────────────────────── */}
      <div aria-hidden="true" className="hero-scrim absolute inset-0 z-10" />

      {/* ── Content ────────────────────────────────────────────────────── */}
      <div className="on-dark relative z-30 flex h-full flex-col">
        <div className="flex flex-1 items-center pt-[var(--header-h)] lg:pt-[var(--header-h-lg)]">
          <Container>
            {/* Keyed on the slide so the entrance replays on every change. */}
            <div key={slide.id} className="max-w-4xl">
              <h1
                className="animate-rise font-heading text-[clamp(2.25rem,5.2vw,4.25rem)] leading-[1.06] font-light text-white"
                style={{ maxWidth: "22ch" }}
              >
                {slide.title}
              </h1>

              <p
                className="animate-rise mt-7 text-[15px] leading-[2] text-white/75 sm:text-base"
                style={{ maxWidth: "64ch", animationDelay: "120ms" }}
              >
                {slide.description}
              </p>

              <Button
                href={slide.cta.href}
                variant="outline"
                size="sm"
                className="animate-rise mt-10"
                style={{ animationDelay: "240ms" }}
              >
                {slide.cta.label}
              </Button>
            </div>
          </Container>
        </div>

        {/* ── Dots ─────────────────────────────────────────────────────── */}
        <Container className="pb-8 lg:pb-12">
          <div
            role="tablist"
            aria-label="Choose a slide"
            onKeyDown={onDotKeys}
            className="-ml-1.5 flex items-center"
          >
            {heroSlides.map((item, index) => {
              const isActive = index === active;

              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Slide ${index + 1}: ${item.title}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => go(index)}
                  className="group grid size-11 shrink-0 place-items-center"
                >
                  {isActive ? (
                    <span className="relative grid size-8 place-items-center">
                      {/* Remounted on every change so the fill restarts. */}
                      <svg
                        key={active}
                        viewBox="0 0 36 36"
                        aria-hidden="true"
                        className="absolute inset-0 size-8 -rotate-90"
                      >
                        <circle
                          cx="18"
                          cy="18"
                          r="16.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1"
                          className="text-white/25"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r="16.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1"
                          strokeLinecap="round"
                          pathLength={100}
                          className={cn("text-white", !reduced && "animate-ring-fill")}
                          style={{
                            strokeDasharray: 100,
                            strokeDashoffset: reduced ? 0 : 100,
                            animationDuration: `${SLIDE_MS}ms`,
                          }}
                        />
                      </svg>
                      <span className="size-1.5 rounded-full bg-white" />
                    </span>
                  ) : (
                    <span className="size-1.5 rounded-full bg-white/45 transition-all duration-300 group-hover:scale-150 group-hover:bg-white" />
                  )}
                </button>
              );
            })}
          </div>
        </Container>
      </div>

      {/* Announces the change to screen readers without moving focus. */}
      <p aria-live="polite" className="sr-only">
        {`Slide ${active + 1} of ${heroSlides.length}: ${slide.title}`}
      </p>
    </section>
  );
}
