"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useId, useRef, useState } from "react";
import { LOOPS, popIn } from "@/components/home/whyCardMotion";
import { ArrowRightIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * One "why choose us" card: two layers on a warm ground.
 *
 * Up top, a white panel that reads like a settings tile — keywords, a title,
 * a status line. Underneath, on a plain, very light brand ground, a line
 * illustration of the idea that lifts on hover.
 *
 * "View details" swaps the illustration for the description in the same
 * spot: the art shrinks and fades out and the copy rises in a beat later. The button flips to "Hide details"
 * and reverses it. The description stays in the DOM throughout so the swap
 * can animate; `aria-hidden` keeps the hidden side out of the reading order.
 *
 * The card rises in the first time its grid scrolls into view, keyed off the
 * `data-visible` that the surrounding `Reveal` sets.
 *
 * The illustration is animated with GSAP (see whyCardMotion.js): the first
 * time it scrolls into view its shapes pop in, then its own MorphSVG loop
 * takes over. The loop only runs while the card is on screen and its
 * details are closed, and none of it runs for visitors who ask for less
 * motion — they get the still drawing.
 */
export function WhyCard({ item, index }) {
  const [open, setOpen] = useState(false);
  const detailsId = useId();
  const Art = ART[item.art];
  const artRef = useRef(null);

  // Shared between the GSAP setup and the open/close handler, so either can
  // decide whether the loop should be running right now.
  const motion = useRef({ loops: [], started: false, inView: false, open: false });

  const sync = () => {
    const m = motion.current;
    const run = m.started && m.inView && !m.open;
    m.loops.forEach((anim) => anim.paused(!run));
  };

  useGSAP(
    () => {
      const svg = artRef.current;
      const build = LOOPS[item.art];
      if (!svg || !build) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const m = motion.current;
        m.loops = build(svg);

        const intro = popIn(svg);
        intro.eventCallback("onComplete", () => {
          m.started = true;
          sync();
        });

        ScrollTrigger.create({
          trigger: svg,
          start: "top 85%",
          end: "bottom top",
          onToggle: (self) => {
            m.inView = self.isActive;
            if (self.isActive && intro.progress() === 0) intro.play();
            sync();
          },
        });

        return () => {
          m.loops = [];
          m.started = false;
        };
      });
    },
    { scope: artRef },
  );

  const toggle = () => {
    const next = !open;
    setOpen(next);
    motion.current.open = next;
    sync();
  };

  return (
    <li
      className="group relative flex translate-y-8 flex-col overflow-hidden rounded-[2rem] bg-brand-50 p-1 opacity-0 transition-[opacity,translate] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] in-data-visible:translate-y-0 in-data-visible:opacity-100 dark:bg-surface"
      // Staggered across each row of three, so a whole row lands together.
      style={{ transitionDelay: `${(index % 3) * 140}ms` }}
    >
      {/* The panel. Grows to fill, so every card's glow starts at the same
          height whatever the length of its title. */}
      <div className="relative z-10 flex flex-1 flex-col rounded-[1.75rem] bg-elevated p-6 lg:p-7">
        <p className="flex flex-wrap items-center gap-x-2 text-sm text-muted">
          {item.tags.map((tag, i) => (
            <span key={tag} className="inline-flex items-center gap-2">
              {i > 0 && (
                <span aria-hidden="true" className="size-1 rounded-full bg-subtle" />
              )}
              {tag}
            </span>
          ))}
        </p>

        {/* Pushed to the foot of the panel, so titles of one or two lines all
            sit on the same baseline across a row. */}
        <h3 className="mt-auto pt-10 font-display text-[1.55rem] leading-tight font-semibold tracking-[-0.025em] text-headline lg:pt-12 lg:text-[1.7rem]">
          {item.title}
        </h3>

        <div className="mt-3 flex items-center justify-between gap-4 text-sm">
          <p className="flex items-center gap-2 text-headline">
            {item.status.label}
            <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
            <span className="text-content">{item.status.value}</span>
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            arrow={false}
            onClick={toggle}
            aria-expanded={open}
            aria-controls={detailsId}
            className="shrink-0 gap-1 border-headline/25 text-[0.6875rem] text-headline/55 [--btn-h:1.75rem] [--btn-pad:0.625rem] hover:border-brand hover:text-white"
          >
            {open ? "Hide details" : "View details"}
            {/* ↗ to open; swings round to ↙ once open, pointing back at the
                way in. */}
            <ArrowRightIcon
              className={cn(
                "size-3 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                open ? "rotate-[135deg]" : "-rotate-45",
              )}
            />
          </Button>
        </div>
      </div>

      {/* The illustration, or the description in its place. */}
      <div className="relative h-44 lg:h-48">
        <div className="absolute inset-0 grid place-items-center px-6 lg:px-7">
          {Art && (
            <Art
              ref={artRef}
              aria-hidden="true"
              className={cn(
                "relative col-start-1 row-start-1 w-44 transition-[opacity,scale,translate] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:w-48",
                open
                  ? "scale-90 opacity-0"
                  : "scale-100 opacity-100 delay-150 group-hover:-translate-y-1.5",
              )}
            />
          )}

          <p
            id={detailsId}
            aria-hidden={!open}
            className={cn(
              "relative col-start-1 row-start-1 self-center text-[15px] leading-relaxed text-headline transition-[opacity,translate] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:text-base",
              open
                ? "translate-y-0 opacity-100 delay-150"
                : "pointer-events-none translate-y-3 opacity-0",
            )}
          >
            {item.description}
          </p>
        </div>

      </div>
    </li>
  );
}

/* ── Illustrations ───────────────────────────────────────────────────────────
   Filled shapes in the brand scale on the pale card, white for detail. Every
   piece is 200 × 140. Parts that move carry a `data-a` mark, and the shapes
   that change form are single <path>s, so GSAP's MorphSVG can reshape them
   (see whyCardMotion.js). Each drawing's resting state is the end of its
   story, so the still picture — reduced motion, or before it starts — reads
   on its own. The card passes `aria-hidden`. */

function Art({ children, ...props }) {
  return (
    <svg viewBox="0 0 200 140" {...props}>
      {children}
    </svg>
  );
}

/** Issuance: a card grown out of the phone's screen. */
function CardsArt(props) {
  return (
    <Art {...props}>
      {/* Phone. */}
      <rect x="18" y="14" width="60" height="112" rx="13" className="fill-brand-300" />
      <rect x="24" y="24" width="48" height="92" rx="8" className="fill-white" />
      <rect x="40" y="18" width="16" height="3" rx="1.5" className="fill-white/70" />
      <g data-a="plus">
        <circle cx="48" cy="100" r="9" className="fill-brand-500" />
        <path d="M48 95.5v9M43.5 100h9" fill="none" strokeWidth="2.5" strokeLinecap="round" className="stroke-white" />
      </g>

      {/* The card — morphs between this and a thumbnail on the screen. */}
      <path
        data-a="morph"
        d="M110 40h66a10 10 0 0 1 10 10v36a10 10 0 0 1-10 10h-66a10 10 0 0 1-10-10V50a10 10 0 0 1 10-10Z"
        className="fill-brand-400"
      />
      <g data-a="detail">
        <rect x="112" y="52" width="15" height="11" rx="3" className="fill-white/85" />
        <rect x="112" y="78" width="38" height="5" rx="2.5" className="fill-white/70" />
        <circle cx="166" cy="57" r="6" className="fill-white/55" />
        <circle cx="173" cy="57" r="6" className="fill-white/35" />
      </g>

      <path
        data-a="spark"
        d="M182 14l2.5 5.5L190 22l-5.5 2.5L182 30l-2.5-5.5L174 22l5.5-2.5Z"
        className="fill-brand-500"
      />
    </Art>
  );
}

/** Security: a checkout field, and a shield that is sometimes a padlock. */
function ShieldArt(props) {
  return (
    <Art {...props}>
      {/* Checkout form. */}
      <rect x="12" y="28" width="108" height="84" rx="14" className="fill-white" />
      <rect x="24" y="42" width="84" height="20" rx="6" className="fill-brand-100" />
      <circle data-a="dot" cx="36" cy="52" r="3" className="fill-brand-500" />
      <circle data-a="dot" cx="46" cy="52" r="3" className="fill-brand-500" />
      <circle data-a="dot" cx="56" cy="52" r="3" className="fill-brand-500" />
      <circle data-a="dot" cx="66" cy="52" r="3" className="fill-brand-500" />
      <rect x="76" y="50" width="24" height="4" rx="2" className="fill-brand-300" />
      <rect x="24" y="72" width="44" height="18" rx="6" className="fill-brand-100" />
      <rect x="74" y="72" width="34" height="18" rx="6" className="fill-brand-100" />

      {/* Shield ⇄ padlock. */}
      <path
        data-a="morph"
        d="M164 46c10 6 19 9 28 9v22c0 20-12 35-28 42-16-7-28-22-28-42V55c9 0 18-3 28-9Z"
        className="fill-brand-400"
      />
      <path
        data-a="check"
        d="m154 82 8 8 15-16"
        fill="none"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-white"
      />
    </Art>
  );
}

/** Plans: a total split into four instalments, paid along a timeline. */
function PlansArt(props) {
  return (
    <Art {...props}>
      {/* The total ⇄ four parts. */}
      <path
        data-a="morph"
        d="M35 28h10a13 13 0 0 1 0 26H35a13 13 0 0 1 0-26ZM77 28h10a13 13 0 0 1 0 26H77a13 13 0 0 1 0-26ZM119 28h10a13 13 0 0 1 0 26h-10a13 13 0 0 1 0-26ZM161 28h10a13 13 0 0 1 0 26h-10a13 13 0 0 1 0-26Z"
        className="fill-brand-200"
      />

      {/* Paid instalments, filled left to right. */}
      {[22, 64, 106, 148].map((x, i) => (
        <g key={x} data-a="paid" opacity={i < 2 ? 1 : 0}>
          <rect x={x} y="28" width="36" height="26" rx="13" className="fill-brand-500" />
          <path
            d={`m${x + 12} 41 4 4 8-9`}
            fill="none"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="stroke-white"
          />
        </g>
      ))}

      {/* Timeline. */}
      <rect x="40" y="94" width="126" height="4" rx="2" className="fill-brand-200" />
      <rect data-a="progress" x="40" y="94" width="42" height="4" rx="2" className="fill-brand-500" />
      {[40, 82, 124, 166].map((cx, i) => (
        <circle
          key={cx}
          data-a="node"
          cx={cx}
          cy="96"
          r="8"
          className={i < 2 ? "fill-brand-500" : "fill-brand-200"}
        />
      ))}
      {[40, 82, 124, 166].map((cx) => (
        <rect key={cx} x={cx - 10} y="112" width="20" height="4" rx="2" className="fill-brand-200" />
      ))}
    </Art>
  );
}

/** Monitoring: spending surges on the chart and an alert drops in. */
function MonitorArt(props) {
  return (
    <Art {...props}>
      {/* Alert. */}
      <g data-a="toast">
        <rect x="66" y="8" width="122" height="30" rx="15" className="fill-brand-500" />
        <g data-a="bell">
          <path d="M78 28h14l-2-3v-5a5 5 0 0 0-10 0v5Z" className="fill-white" />
          <circle cx="85" cy="30.5" r="2" className="fill-white" />
        </g>
        <rect x="100" y="16" width="48" height="5" rx="2.5" className="fill-white/85" />
        <rect x="100" y="25" width="30" height="4" rx="2" className="fill-white/60" />
        <rect x="158" y="20" width="18" height="5" rx="2.5" className="fill-white" />
      </g>

      {/* Dashboard. */}
      <rect x="12" y="46" width="146" height="84" rx="14" className="fill-white" />
      <rect x="24" y="58" width="28" height="5" rx="2.5" className="fill-brand-200" />
      <path
        data-a="area"
        d="M24 120v-14c14-2 24-10 38-8s22-14 36-20 26-12 44-18v60Z"
        className="fill-brand-100"
      />
      <path
        data-a="line"
        d="M24 106c14-2 24-10 38-8s22-14 36-20 26-12 44-18"
        fill="none"
        strokeWidth="3.5"
        strokeLinecap="round"
        className="stroke-brand-500"
      />
      <circle data-a="point" cx="142" cy="60" r="6" className="fill-brand-500" />
    </Art>
  );
}

/** Currencies: one coin whose symbol turns $ → € → £. */
function CurrencyArt(props) {
  return (
    <Art {...props}>
      <circle data-a="float" cx="36" cy="96" r="16" className="fill-brand-200" />
      <circle data-a="float" cx="166" cy="40" r="13" className="fill-brand-200" />
      <circle cx="176" cy="96" r="5" className="fill-brand-300" />
      <circle cx="28" cy="40" r="4" className="fill-brand-300" />

      <circle cx="100" cy="70" r="46" className="fill-brand-400" />
      <circle cx="100" cy="70" r="37" className="fill-brand-300" />
      <path
        data-a="morph"
        d="M112 54c-3-5-8-8-13-8-9 0-15 5-15 12 0 15 31 9 31 25 0 8-7 13-16 13-7 0-13-3-16-8M100 38v64"
        fill="none"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-white"
      />
    </Art>
  );
}

/** Support: the question becomes a reply, still typing; the clock runs. */
function SupportArt(props) {
  return (
    <Art {...props}>
      {/* Reply ⇄ question. */}
      <path
        data-a="morph"
        d="M84 40h76a16 16 0 0 1 16 16v30a16 16 0 0 1-16 16h-6v14l-16-14H84a16 16 0 0 1-16-16V56a16 16 0 0 1 16-16Z"
        className="fill-brand-400"
      />
      <g data-a="typing">
        <circle data-a="dot" cx="104" cy="71" r="5" className="fill-white" />
        <circle data-a="dot" cx="122" cy="71" r="5" className="fill-white" />
        <circle data-a="dot" cx="140" cy="71" r="5" className="fill-white" />
      </g>
      <g data-a="question" opacity="0">
        <rect x="38" y="44" width="62" height="7" rx="3.5" className="fill-white" />
        <rect x="38" y="59" width="40" height="7" rx="3.5" className="fill-white/75" />
      </g>

      {/* Round-the-clock badge. */}
      <circle cx="176" cy="22" r="16" className="fill-brand-200" />
      <path
        data-a="minute"
        d="M176 22v-9"
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
        className="stroke-brand-500"
      />
      <path
        data-a="hour"
        d="m176 22 5 3.5"
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
        className="stroke-brand-500"
      />
    </Art>
  );
}

const ART = {
  cards: CardsArt,
  shield: ShieldArt,
  plans: PlansArt,
  monitor: MonitorArt,
  currency: CurrencyArt,
  support: SupportArt,
};
