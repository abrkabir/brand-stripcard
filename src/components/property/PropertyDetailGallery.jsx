"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowRightIcon } from "@/components/icons";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";

/** How long each photograph holds before the gallery moves on. */
const HOLD_MS = 4600;

/**
 * The detail page's gallery: one photograph at a time, swipeable, with the same
 * ringed circular thumbnails the property cards carry.
 *
 * The swipe is native. The track is a scroll container with `snap-x
 * snap-mandatory` and each frame is a full-width snap point, so a finger drag,
 * a trackpad flick and shift-scroll all work with the browser's own physics —
 * no gesture library, no pointer maths, and momentum behaves the way the
 * platform says it should.
 *
 * Because the browser owns the scrolling, the active index is read back *out*
 * of it rather than driving it: the scroll handler divides `scrollLeft` by the
 * frame width. That keeps the thumbnails, the counter and the announcement
 * honest whether you got there by swiping, by a thumbnail or by an arrow.
 * `setActive` with an unchanged value is a no-op in React, so firing that on
 * every scroll frame costs nothing between snap points.
 *
 * Nothing here runs a timer. The ring's own animation ending is what advances
 * the gallery — the same trick `Testimonials` uses — so the ring cannot show
 * one thing while a separate countdown does another. Pausing the animation
 * therefore pauses the advance for free, which is what hovering does: on a
 * page where someone is studying a photograph, moving it out from under them
 * is worse than a carousel that waits.
 */
export function PropertyDetailGallery({ images, alt }) {
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = usePrefersReducedMotion();

  const many = images.length > 1;

  const goTo = (index) => {
    const track = trackRef.current;
    if (!track) return;

    const next = (index + images.length) % images.length;
    track.scrollTo({
      left: next * track.clientWidth,
      // Smooth scrolling is motion the visitor may have asked not to see, and
      // this one is out of reach of a CSS media query.
      behavior: reduced ? "auto" : "smooth",
    });
  };

  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    setActive(Math.round(track.scrollLeft / track.clientWidth));
  };

  const onKeyDown = (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(active + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(active - 1);
    }
  };

  return (
    <div
      aria-roledescription="carousel"
      aria-label={`Photographs of ${alt}`}
      className="relative"
      // Hover and focus both hold it, so a keyboard user gets the same reprieve
      // as a mouse user rather than being carried along.
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        ref={trackRef}
        onScroll={onScroll}
        onKeyDown={onKeyDown}
        // Focusable so the arrow keys have somewhere to land — not every engine
        // gives a scroll container a tab stop on its own.
        tabIndex={0}
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-2xl border border-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        {images.map((src, i) => (
          <div
            key={src}
            className="relative aspect-[3/2] w-full shrink-0 snap-start"
          >
            <Image
              src={src}
              // Only the frame on screen is described; the rest are the same
              // property from another angle.
              alt={i === active ? alt : ""}
              fill
              priority={i === 0}
              sizes="(min-width: 1024px) 62vw, 100vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {many && (
        <>
          {/* Counter and arrows ride on the photograph. `on-dark` because the
              ground under them is a photograph in both themes. */}
          <span className="on-dark pointer-events-none absolute top-4 right-4 rounded-full bg-black/50 px-3 py-1 text-[12px] font-medium text-white tabular-nums backdrop-blur-sm">
            {active + 1} / {images.length}
          </span>

          <div className="absolute inset-y-0 left-3 flex items-center">
            <Arrow label="Previous photograph" onClick={() => goTo(active - 1)} back />
          </div>

          <div className="absolute inset-y-0 right-3 flex items-center">
            <Arrow label="Next photograph" onClick={() => goTo(active + 1)} />
          </div>

          {/* Enough shade under the thumbnails to keep their rings readable
              against a bright photograph, and nothing above that. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-28 rounded-b-2xl bg-gradient-to-t from-black/55 to-transparent"
          />

          <div
            role="tablist"
            aria-label="Choose a photograph"
            className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2"
          >
            {images.map((src, i) => {
              const isActive = i === active;

              return (
                <button
                  key={src}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Photograph ${i + 1} of ${images.length}`}
                  onClick={() => goTo(i)}
                  className="relative grid size-11 shrink-0 place-items-center"
                >
                  {/* The ring exists only on the active thumbnail, remounted on
                      every change so the fill restarts from zero rather than
                      carrying on from wherever it had got to. */}
                  {isActive && (
                    <svg
                      key={active}
                      viewBox="0 0 44 44"
                      aria-hidden="true"
                      className="absolute inset-0 size-11 -rotate-90"
                    >
                      <circle
                        cx="22"
                        cy="22"
                        r="20.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="text-white/30"
                      />
                      <circle
                        cx="22"
                        cy="22"
                        r="20.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        pathLength={100}
                        className={cn("text-white", !reduced && "animate-ring-fill")}
                        style={{
                          strokeDasharray: 100,
                          strokeDashoffset: reduced ? 0 : 100,
                          animationDuration: `${HOLD_MS}ms`,
                          animationPlayState: paused ? "paused" : "running",
                        }}
                        // Finishing the fill is what advances the gallery.
                        onAnimationEnd={reduced ? undefined : () => goTo(active + 1)}
                      />
                    </svg>
                  )}

                  <span
                    className={cn(
                      "relative block overflow-hidden rounded-full transition-all duration-300",
                      isActive
                        ? "size-8"
                        : "size-7 opacity-60 hover:opacity-100 hover:ring-2 hover:ring-white/60",
                    )}
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  </span>
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* Announces the change without moving focus. */}
      <p aria-live="polite" className="sr-only">
        {`Photograph ${active + 1} of ${images.length}`}
      </p>
    </div>
  );
}

/** Round control on the photograph, mirrored for the back direction. */
function Arrow({ label, onClick, back }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid size-10 place-items-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
    >
      <ArrowRightIcon className={cn("size-4", back && "rotate-180")} />
    </button>
  );
}
