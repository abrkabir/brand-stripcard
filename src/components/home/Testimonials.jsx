"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ArrowRightIcon, StarIcon } from "@/components/icons";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import {
  TESTIMONIAL_MS,
  testimonials,
  testimonialsHeading,
  testimonialsRating,
} from "@/data/testimonials";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";

/** Copies of the stories laid end to end, so the rail can loop forever. */
const COPIES = 3;

/** The glide: a long, gentle ease in and out, shared by the rail and the
    cards fading as they pass behind the rating card, so they move as one. */
const GLIDE = "duration-[1100ms] ease-[cubic-bezier(0.5,0,0.1,1)]";

const mod = (n, m) => ((n % m) + m) % m;

/**
 * Customer stories on a rail: an orange rating card pinned at the start, and
 * photo cards gliding along behind it, each a portrait fading through dark
 * into orange, with the quote and who said it over the foot.
 *
 * The rail moves on by itself every TESTIMONIAL_MS, one card at a time, and
 * the arrows (or the arrow keys, or a swipe on a phone) move it either way.
 * It holds still while hovered or focused, while off screen, and after the
 * pause button. Visitors who ask for less motion get no auto-play and no
 * glide; the arrows still step through.
 *
 * Looping: the stories are laid out three times over and the rail starts on
 * the middle copy. Whenever a glide ends outside it, the rail is put back on
 * the matching card of the middle copy without a transition, which looks
 * identical, so it can go round forever in either direction. Sizes live in
 * `.story-rail` (styles/components.css).
 */
export function Testimonials() {
  const { eyebrow, title, highlight, attribution } = testimonialsHeading;
  const count = testimonials.length;
  const root = useRef(null);
  const swipe = useRef(null);
  const reduce = usePrefersReducedMotion();
  const [index, setIndex] = useState(count);
  const [jump, setJump] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [held, setHeld] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const paused = stopped || held || !onScreen;

  const go = useCallback(
    (step) => {
      if (reduce) {
        setJump(true);
        setIndex((i) => count + mod(i - count + step, count));
        return;
      }
      // Clicks made mid-glide stack up; stop before the copies run out.
      setIndex((i) => (i + step < 1 || i + step > COPIES * count - 4 ? i : i + step));
    },
    [count, reduce],
  );

  // Back onto the middle copy once a glide lands outside it.
  const onTransitionEnd = (event) => {
    if (event.target !== event.currentTarget) return;
    if (index < count || index >= 2 * count) {
      setJump(true);
      setIndex(count + mod(index, count));
    }
  };

  // A jump renders one painted frame without transitions, then lets go.
  useEffect(() => {
    if (!jump) return;
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setJump(false));
    });
    return () => cancelAnimationFrame(frame);
  }, [jump]);

  useEffect(() => {
    if (paused || reduce) return;
    const id = setTimeout(() => go(1), TESTIMONIAL_MS);
    return () => clearTimeout(id);
  }, [paused, reduce, index, go]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), {
      threshold: 0.25,
    });
    observer.observe(root.current);
    return () => observer.disconnect();
  }, []);

  const onKeyDown = (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(-1);
    }
  };

  // Swipe on touch screens; a mouse drag is left alone so clicks stay clicks.
  const onPointerDown = (event) => {
    if (event.pointerType !== "mouse") swipe.current = event.clientX;
  };
  const onPointerUp = (event) => {
    if (swipe.current === null) return;
    const dx = event.clientX - swipe.current;
    swipe.current = null;
    if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
  };

  return (
    <section ref={root} aria-labelledby="testimonials-title" className="bg-page py-20 lg:py-28">
      <Container>
        {/* The heading as a quotation: a tall quote mark lit from the top
            left, then the label, the title closing on the brand colour, and
            who said it. */}
        <div className="mx-auto flex w-fit max-w-6xl items-center gap-4 sm:gap-6">
          <QuoteMark className="h-[clamp(6.5rem,12vw,11rem)] w-auto shrink-0" />
          <div className="max-w-[46rem] min-w-0 pt-1">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2
              id="testimonials-title"
              className="mt-4 font-heading text-[clamp(1.5rem,2.7vw,2.375rem)] leading-[1.12] font-bold tracking-[-0.015em] text-balance text-headline"
            >
              {title} <span className="text-brand">{highlight}</span>
            </h2>
            <p className="mt-4 text-sm text-muted italic sm:text-base">-{attribution}</p>
          </div>
        </div>

        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Customer stories"
          tabIndex={0}
          onKeyDown={onKeyDown}
          onPointerEnter={(e) => e.pointerType === "mouse" && setHeld(true)}
          onPointerLeave={() => setHeld(false)}
          onFocus={(e) => e.target.matches(":focus-visible") && setHeld(true)}
          onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setHeld(false)}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (swipe.current = null)}
          className="mt-12 rounded-[1.75rem] outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-8 focus-visible:ring-offset-page lg:mt-16"
        >
          <div className="story-rail relative touch-pan-y overflow-hidden md:rounded-[1.5rem]">
            <RatingCard />

            <div
              aria-live={paused ? "polite" : "off"}
              onTransitionEnd={onTransitionEnd}
              className={cn(
                "flex gap-(--gap)",
                "will-change-transform",
                !jump && !reduce && ["transition-transform", GLIDE],
              )}
              style={{
                transform: `translateX(calc(var(--base) - (var(--cw) + var(--gap)) * ${index}))`,
              }}
            >
              {Array.from({ length: COPIES }, (_, copy) =>
                testimonials.map((story, i) => {
                  const at = copy * count + i;
                  return (
                    <StoryCard
                      key={`${copy}-${story.name}`}
                      story={story}
                      label={`${i + 1} of ${count}`}
                      hidden={copy !== 1}
                      passed={index - at}
                      instant={jump}
                    />
                  );
                }),
              )}
            </div>
          </div>

          {/* Arrows and pause. */}
          <div className="mt-10 flex items-center justify-center gap-3">
            <RoundButton label="Previous story" onClick={() => go(-1)}>
              <ArrowRightIcon className="size-4 rotate-180" />
            </RoundButton>
            <RoundButton label={stopped ? "Play the stories" : "Pause the stories"} onClick={() => setStopped((s) => !s)}>
              <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5 fill-current">
                {stopped ? (
                  <path d="M4.5 2.8v10.4a.6.6 0 0 0 .9.5l8.3-5.2a.6.6 0 0 0 0-1L5.4 2.3a.6.6 0 0 0-.9.5Z" />
                ) : (
                  <path d="M4 2.5h2.6v11H4zM9.4 2.5H12v11H9.4z" />
                )}
              </svg>
            </RoundButton>
            <RoundButton label="Next story" onClick={() => go(1)}>
              <ArrowRightIcon className="size-4" />
            </RoundButton>
          </div>
        </div>
      </Container>
    </section>
  );
}

/** The orange card pinned at the start of the rail; stacks above it on a phone. */
function RatingCard() {
  const { score, label, note, users, usersLabel, avatars } = testimonialsRating;
  return (
    <div className="relative z-10 mb-4 flex flex-col justify-between gap-10 overflow-hidden rounded-[1.5rem] bg-[linear-gradient(160deg,#fd8645_0%,#f26a1b_45%,#c4450c_100%)] p-6 text-white shadow-[0_24px_48px_-24px_rgb(194_69_12/0.7)] md:absolute md:inset-y-0 md:left-0 md:mb-0 md:w-(--rw) lg:p-7">
      <span aria-hidden="true" className="absolute -top-16 -right-16 size-48 rounded-full bg-white/12" />
      <div className="relative">
        <div className="flex gap-1" role="img" aria-label={`Rated ${score} out of 5`}>
          {Array.from({ length: 5 }, (_, i) => (
            <StarIcon key={i} className="size-5" />
          ))}
        </div>
        <p className="mt-4 font-heading text-[2.5rem] leading-none font-bold tracking-[-0.02em]">
          {score} <span className="text-[0.6em] font-semibold">{label}</span>
        </p>
        <p className="mt-3 max-w-[15rem] text-sm leading-relaxed text-white/80">{note}</p>
      </div>
      <div className="relative flex items-center gap-3">
        <div className="flex -space-x-3">
          {avatars.map((src, i) => (
            <span key={i} className="relative size-11 overflow-hidden rounded-full ring-2 ring-brand">
              <Image src={src} alt="" fill sizes="44px" className="object-cover" />
            </span>
          ))}
        </div>
        <p className="leading-tight">
          <span className="block font-heading text-2xl font-bold">{users}</span>
          <span className="block text-sm text-white/80">{usersLabel}</span>
        </p>
      </div>
    </div>
  );
}

/**
 * A story: the portrait in black and white (colour on hover), fading
 * through dark into orange at the foot, where the quote, who said it and
 * their star rating sit. `passed` is how
 * many places it has slid behind the rating card: the one just passed stays
 * as a dim sliver beside it, any further back fades out entirely.
 */
function StoryCard({ story, label, hidden, passed, instant }) {
  return (
    <figure
      aria-hidden={hidden}
      aria-roledescription={hidden ? undefined : "slide"}
      aria-label={hidden ? undefined : `${label}: ${story.name}`}
      className={cn(
        "group relative isolate flex aspect-[3/4] w-(--cw) shrink-0 flex-col justify-end overflow-hidden rounded-[1.5rem] bg-hero-ink p-6 lg:p-7",
        !instant && ["transition-opacity", GLIDE],
        passed > 1 ? "opacity-0" : passed === 1 ? "opacity-40" : "opacity-100",
      )}
    >
      <Image
        src={story.image}
        alt=""
        fill
        sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 80vw"
        style={{ objectPosition: story.focus }}
        className="-z-10 object-cover grayscale transition-[filter,scale] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] group-hover:grayscale-0"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-t from-brand-600 via-hero-ink/75 via-40% to-transparent to-70%"
      />
      <blockquote className="text-[0.9375rem] leading-relaxed text-pretty text-white lg:text-base">
        “{story.quote}”
      </blockquote>
      <figcaption className="mt-5 flex items-end justify-between gap-3 leading-tight">
        <span className="min-w-0">
          <span className="block font-heading text-base font-semibold text-white">{story.name}</span>
          <span className="mt-1 block text-sm text-white/75">{story.role}</span>
        </span>
        <span role="img" aria-label={`Rated ${story.rating} out of 5`} className="flex shrink-0 gap-0.5 pb-0.5">
          {Array.from({ length: 5 }, (_, i) => (
            <StarIcon key={i} className={cn("size-3.5", i < story.rating ? "text-white" : "text-white/35")} />
          ))}
        </span>
      </figcaption>
    </figure>
  );
}

/**
 * A tall opening quote mark, slanted and lit from the top left: each mark is
 * drawn twice, a dark copy set back and down for depth and the lit face on
 * top. Decorative.
 */
function QuoteMark({ className }) {
  const id = useId();
  // One "6"-shaped mark: a tail curling up to the right over a squared blob.
  const mark =
    "M62 0 L70 16 C46 28 34 60 34 100 L58 100 Q70 100 70 112 L70 168 Q70 180 58 180 L12 180 Q0 180 0 168 L0 104 C0 52 22 14 62 0 Z";
  return (
    <svg aria-hidden="true" viewBox="-4 -2 170 192" className={className}>
      <defs>
        <linearGradient id={`${id}-face`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffd9bd" />
          <stop offset="0.35" stopColor="#fd8645" />
          <stop offset="0.7" stopColor="#f26a1b" />
          <stop offset="1" stopColor="#c4450c" />
        </linearGradient>
      </defs>
      <g transform="skewX(-8) translate(16 0)">
        {[0, 86].map((x) => (
          <g key={x} transform={`translate(${x} 0)`}>
            <path d={mark} transform="translate(6 7)" fill="#7a2c0c" opacity="0.85" />
            <path d={mark} fill={`url(#${id}-face)`} />
          </g>
        ))}
      </g>
    </svg>
  );
}

function RoundButton({ label, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid size-11 cursor-pointer place-items-center rounded-full border border-line bg-elevated text-headline transition-colors hover:border-brand hover:bg-brand hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      {children}
    </button>
  );
}
