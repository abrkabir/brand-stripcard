"use client";

import { useId, useState } from "react";
import { ArrowRightIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

/**
 * One "why choose us" card: two layers on a warm ground.
 *
 * Up top, a white panel that reads like a settings tile — keywords, a title,
 * a status line. Underneath, a soft brand glow breathes behind a dark line
 * illustration of the idea; on hover the glow swells and the illustration
 * lifts.
 *
 * "View details" swaps the illustration for the description in the same
 * spot: the art shrinks and fades out, the glow dims so dark text reads over
 * it, and the copy rises in a beat later. The button flips to "Hide details"
 * and reverses it. The description stays in the DOM throughout so the swap
 * can animate; `aria-hidden` keeps the hidden side out of the reading order.
 *
 * The card rises in the first time its grid scrolls into view, keyed off the
 * `data-visible` that the surrounding `Reveal` sets.
 */
export function WhyCard({ item, index }) {
  const [open, setOpen] = useState(false);
  const detailsId = useId();
  const Art = ART[item.art];

  return (
    <li
      className="group relative flex translate-y-8 flex-col overflow-hidden rounded-[2rem] bg-brand-50/70 p-1 opacity-0 transition-[opacity,translate] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] in-data-visible:translate-y-0 in-data-visible:opacity-100 dark:bg-surface"
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
        <h3 className="mt-auto pt-14 font-display text-[1.55rem] leading-tight font-semibold tracking-[-0.025em] text-headline lg:pt-16 lg:text-[1.7rem]">
          {item.title}
        </h3>

        <div className="mt-3 flex items-center justify-between gap-4 text-sm">
          <p className="flex items-center gap-2 text-headline">
            {item.status.label}
            <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
            <span className="text-content">{item.status.value}</span>
          </p>
          <span className="shrink-0 text-subtle">{item.action}</span>
        </div>
      </div>

      {/* The glow, the illustration or the description, and the toggle. */}
      <div className="relative h-60 lg:h-64">
        <div
          aria-hidden="true"
          className={cn(
            "animate-glow-breathe absolute inset-x-6 top-6 -bottom-16 rounded-full bg-[radial-gradient(circle_at_50%_60%,var(--color-brand-400)_0%,var(--color-brand-300)_24%,var(--color-brand-100)_50%,transparent_72%)] blur-2xl transition-[scale,filter] duration-700",
            open ? "brightness-[1.35] saturate-[0.6]" : "group-hover:scale-110",
          )}
        />
        <div
          aria-hidden="true"
          className="bg-grain pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay"
        />

        {/* Art and copy share the area above the button. */}
        <div className="absolute inset-x-0 top-0 bottom-16 grid place-items-center px-6 lg:px-7">
          {Art && (
            <Art
              aria-hidden="true"
              className={cn(
                "relative col-start-1 row-start-1 w-44 text-headline/25 transition-[opacity,scale,translate] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:w-48",
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

        <Button
          type="button"
          variant="outline"
          size="sm"
          arrow={false}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={detailsId}
          className="absolute bottom-5 left-6 gap-1.5 border-headline/25 text-[0.75rem] text-headline/55 [--btn-h:2.125rem] [--btn-pad:0.875rem] hover:border-brand hover:text-white lg:left-7"
        >
          {open ? "Hide details" : "View details"}
          {/* ↗ to open; swings round to ↙ once open, pointing back at the
              way in. */}
          <ArrowRightIcon
            className={cn(
              "size-3.5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
              open ? "rotate-[135deg]" : "-rotate-45",
            )}
          />
        </Button>
      </div>
    </li>
  );
}

/* ── Illustrations ───────────────────────────────────────────────────────────
   Line art: strokes on the glow in the same ink as the "View details"
   button's border (headline at 25%), rounded ends, no fills — the same voice
   as a thin outline icon, drawn larger. Change the two together. The ink
   follows the theme. Secondary lines drop to a
   lower opacity for depth. Every piece is 200 × 140 and inherits the stroke
   from `Line`; the card passes `aria-hidden` and the colour. */

function Line({ children, ...props }) {
  return (
    <svg
      viewBox="0 0 200 140"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}

/** Two cards fanned, the front one with a chip, a number line and a mark. */
function CardsArt(props) {
  return (
    <Line {...props}>
      <rect x="38" y="36" width="112" height="72" rx="14" transform="rotate(-12 94 72)" strokeOpacity="0.5" />
      <g transform="rotate(5 106 70)">
        <rect x="50" y="32" width="112" height="72" rx="14" />
        <rect x="64" y="48" width="22" height="16" rx="4" />
        <path d="M64 86h40" />
        <path d="M112 86h14" strokeOpacity="0.6" />
        <circle cx="134" cy="56" r="7" />
        <circle cx="144" cy="56" r="7" strokeOpacity="0.6" />
      </g>
    </Line>
  );
}

/** A rounded shield with a check, and two small sparks. */
function ShieldArt(props) {
  return (
    <Line {...props}>
      <path d="M100 14c14 9 28 13 42 13 3 0 5 2 5 5v30c0 27-19 49-45 60a5 5 0 0 1-4 0c-26-11-45-33-45-60V32c0-3 2-5 5-5 14 0 28-4 42-13Z" />
      <path d="M100 28c10 6 20 9 30 10v24c0 20-13 37-30 46" strokeOpacity="0.45" />
      <path d="m82 68 12 12 25-27" strokeWidth="3.5" />
      <path d="M158 28v12M152 34h12" strokeOpacity="0.7" />
      <path d="M42 98v8M38 102h8" strokeOpacity="0.6" />
    </Line>
  );
}

/** Three plan tiers, the middle one picked out and ticked. */
function PlansArt(props) {
  return (
    <Line {...props}>
      <rect x="42" y="20" width="116" height="24" rx="12" strokeOpacity="0.5" />
      <rect x="28" y="54" width="144" height="34" rx="17" />
      <path d="M48 71h52" />
      <circle cx="150" cy="71" r="10" />
      <path d="m145 71 4 4 7-8" />
      <rect x="48" y="98" width="104" height="24" rx="12" strokeOpacity="0.5" />
    </Line>
  );
}

/** A small dashboard: a live line climbing, its latest point lit. */
function MonitorArt(props) {
  return (
    <Line {...props}>
      <rect x="30" y="20" width="140" height="100" rx="18" />
      <path d="M48 40h34" strokeOpacity="0.6" />
      <circle cx="152" cy="40" r="4" strokeOpacity="0.6" />
      <path d="M48 104h104" strokeOpacity="0.35" />
      <polyline points="48,94 74,76 98,86 126,56 152,66" strokeWidth="3" />
      <circle cx="126" cy="56" r="8" />
    </Line>
  );
}

/** Three coins, overlapping, each in a different currency. */
function CurrencyArt(props) {
  return (
    <Line {...props}>
      <circle cx="64" cy="80" r="30" strokeOpacity="0.55" />
      <circle cx="140" cy="82" r="28" strokeOpacity="0.55" />
      <circle cx="102" cy="64" r="38" />

      {/* € */}
      <path d="M73 69a13 13 0 1 0 0 22" strokeOpacity="0.8" />
      <path d="M52 77h15M52 84h15" strokeOpacity="0.8" />
      {/* $ */}
      <path d="M102 40v48" />
      <path d="M114 52c-2-4-7-6-12-6-7 0-12 4-12 9 0 12 25 7 25 19 0 6-6 10-13 10-6 0-11-2-13-6" strokeWidth="3" />
      {/* £ */}
      <path d="M148 72c-1-4-4-6-8-6-5 0-8 3-8 8v20M126 84h14M126 94h22" strokeOpacity="0.8" />
    </Line>
  );
}

/** A question and a reply, the reply still typing. */
function SupportArt(props) {
  return (
    <Line {...props}>
      <path d="M44 18h88a16 16 0 0 1 16 16v26a16 16 0 0 1-16 16H64l-16 14V76h-4a16 16 0 0 1-16-16V34a16 16 0 0 1 16-16Z" strokeOpacity="0.55" />
      <path d="M46 40h66M46 54h40" strokeOpacity="0.55" />

      <path d="M86 62h72a16 16 0 0 1 16 16v20a16 16 0 0 1-16 16h-2v14l-16-14H86a16 16 0 0 1-16-16V78a16 16 0 0 1 16-16Z" />
      <circle cx="104" cy="88" r="3.5" fill="currentColor" />
      <circle cx="122" cy="88" r="3.5" fill="currentColor" />
      <circle cx="140" cy="88" r="3.5" fill="currentColor" />
    </Line>
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
