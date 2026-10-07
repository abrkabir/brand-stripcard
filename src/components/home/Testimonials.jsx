"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { StarIcon } from "@/components/icons";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Container } from "@/components/ui/Container";
import {
  TESTIMONIAL_MS,
  testimonials,
  testimonialsHeading,
} from "@/data/testimonials";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";

/**
 * Client testimonials, paged by number, advancing on their own.
 *
 * The ring around the active number *is* the timer: it fills over
 * TESTIMONIAL_MS and its `animationend` is what advances the slide. Nothing
 * runs on a parallel `setTimeout`, so the indicator and the rotation cannot
 * drift out of sync, and pausing the animation pauses the carousel for free.
 *
 * Hovering pauses it. These are sixty-word quotes — rotating one out from
 * under someone mid-sentence is the fastest way to make a section unreadable.
 */
export function Testimonials() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = usePrefersReducedMotion();

  const current = testimonials[active];
  const advance = useCallback(
    (step) =>
      setActive((i) => (i + step + testimonials.length) % testimonials.length),
    [],
  );

  const onKeyDown = (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      advance(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      advance(-1);
    }
  };

  return (
    <section className="bg-surface py-24 lg:py-32">
      <Container>
        <SectionHeading
          title={testimonialsHeading.title}
          description={testimonialsHeading.description}
        />

        <div
          className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-2 lg:gap-20"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          {/* Photography. All frames stay mounted and crossfade; the incoming
              one settles out of a slight scale so the change reads as a move
              rather than a swap. */}
          <div className="relative aspect-[7/5] overflow-hidden bg-page">
            {testimonials.map((item, index) => (
              <Image
                key={item.image}
                src={item.image}
                alt={item.alt}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className={cn(
                  "object-cover transition-all duration-[900ms] ease-out",
                  index === active
                    ? "scale-100 opacity-100"
                    : "scale-[1.06] opacity-0",
                )}
              />
            ))}
          </div>

          {/* Quote. A flex column so the attribution can sit on the baseline
              of the image rather than floating under the text. No rule across
              the top — the numbers already open the column. */}
          <div className="flex flex-col">
            <div className="flex items-start justify-between gap-6">
              <div
                role="tablist"
                aria-label="Choose a review"
                onKeyDown={onKeyDown}
                className="flex flex-wrap items-center gap-2.5"
              >
                {testimonials.map((item, index) => {
                  const selected = index === active;

                  return (
                    <button
                      key={item.name}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      aria-label={`Review ${index + 1} of ${testimonials.length}, ${item.name}`}
                      tabIndex={selected ? 0 : -1}
                      onClick={() => setActive(index)}
                      className={cn(
                        "relative grid size-9 place-items-center rounded-full border text-[13px] transition-colors duration-200",
                        selected
                          ? "border-transparent font-medium text-headline"
                          : "border-line text-muted hover:border-muted hover:text-headline",
                      )}
                    >
                      {selected && (
                        // Remounted on every change so the fill restarts.
                        <svg
                          key={active}
                          viewBox="0 0 36 36"
                          aria-hidden="true"
                          className="absolute inset-0 size-9 -rotate-90"
                        >
                          <circle
                            cx="18"
                            cy="18"
                            r="17.5"
                            fill="none"
                            strokeWidth="1"
                            stroke="currentColor"
                            className="text-line"
                          />
                          <circle
                            cx="18"
                            cy="18"
                            r="17.5"
                            fill="none"
                            strokeWidth="1"
                            stroke="currentColor"
                            strokeLinecap="round"
                            pathLength={100}
                            className={cn(
                              "text-headline",
                              !reduced && "animate-ring-fill",
                            )}
                            style={{
                              strokeDasharray: 100,
                              strokeDashoffset: reduced ? 0 : 100,
                              animationDuration: `${TESTIMONIAL_MS}ms`,
                              animationPlayState: paused ? "paused" : "running",
                            }}
                            // Finishing the fill is what advances the carousel.
                            onAnimationEnd={reduced ? undefined : () => advance(1)}
                          />
                        </svg>
                      )}
                      <span className="relative">{index + 1}</span>
                    </button>
                  );
                })}
              </div>

              <span
                aria-hidden="true"
                className="font-heading text-6xl leading-[0.55] font-bold text-headline opacity-20"
              >
                &rdquo;
              </span>
            </div>

            {/* Keyed on the review so the entrance replays on every change. */}
            <figure key={active} className="mt-9 flex flex-1 flex-col">
              <blockquote className="animate-fade-up font-heading text-[19px] leading-[1.6] font-light text-headline sm:text-[21px]">
                &ldquo;{current.quote}&rdquo;
              </blockquote>

              <figcaption
                className="animate-fade-up mt-auto pt-12"
                style={{ animationDelay: "160ms" }}
              >
                <span
                  className="flex items-center gap-1.5"
                  aria-label={`Rated ${current.rating} out of 5`}
                >
                  {Array.from({ length: 5 }, (_, index) => (
                    <StarIcon
                      key={index}
                      aria-hidden="true"
                      className={cn(
                        "size-[22px]",
                        index < current.rating ? "text-headline" : "text-line",
                      )}
                    />
                  ))}
                </span>

                <span className="mt-4 block font-heading text-lg font-medium text-headline">
                  {current.name}
                </span>

                <span className="mt-1 block text-[14px] text-muted">
                  {current.context}
                </span>
              </figcaption>
            </figure>
          </div>
        </div>
      </Container>
    </section>
  );
}
