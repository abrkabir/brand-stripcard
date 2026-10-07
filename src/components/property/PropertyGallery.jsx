"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";

/** How long each photograph holds before the track moves on. */
const HOLD_MS = 3800;

/**
 * The photographs in a property card: cycling on their own, and pickable.
 *
 * A flex track carrying every image at full width, moved by `translateX`, so
 * this is a real slide rather than a cross-fade. All the images stay mounted —
 * `next/image` gets to decode the rest while the first is on screen, so nothing
 * pops in when the track moves.
 *
 * The timer is a `setTimeout` keyed on `active` rather than a standing
 * interval, which means choosing a frame by hand restarts the countdown for
 * free: the effect tears down and schedules again. The ring around the active
 * thumbnail is remounted on the same change, so what it draws is always the
 * time actually left.
 *
 * The whole thing stops when the visitor has asked for less motion. A CSS media
 * query cannot reach a JavaScript timer — the same reason `HeroSlider` checks
 * the hook rather than trusting `prefers-reduced-motion` in the stylesheet.
 */
export function PropertyGallery({ images, alt, index = 0, sizes }) {
  const [active, setActive] = useState(0);
  const reduced = usePrefersReducedMotion();
  const many = images.length > 1;

  useEffect(() => {
    if (reduced || !many) return;

    const timer = setTimeout(
      () => setActive((i) => (i + 1) % images.length),
      HOLD_MS,
    );
    return () => clearTimeout(timer);
  }, [active, reduced, many, images.length]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="flex h-full w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
        style={{ transform: `translateX(-${active * 100}%)` }}
      >
        {images.map((src, i) => (
          <div key={src} className="relative h-full w-full shrink-0">
            <Image
              src={src}
              // Only the frame on screen is described. The others are the same
              // property from another angle, and announcing all of them would
              // repeat the card's own heading once per photograph.
              alt={i === active ? alt : ""}
              fill
              sizes={sizes}
              className="object-cover"
              priority={index === 0 && i === 0}
            />
          </div>
        ))}
      </div>

      {many && (
        <>
          {/* Enough shade under the thumbnails to keep their rings readable
              against a bright photograph, and nothing above that. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 to-transparent"
          />

          <div
            role="tablist"
            aria-label={`Photographs of ${alt}`}
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
                  onClick={() => setActive(i)}
                  className="relative grid size-11 shrink-0 place-items-center"
                >
                  {/* The ring only exists on the active thumbnail, and is
                      remounted on every change so the fill restarts from zero
                      rather than continuing from wherever it had got to. */}
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
                        }}
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
    </div>
  );
}
