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

/** Issuance: a phone with a "+" button, a fresh card sliding out of it. */
function CardsArt(props) {
  return (
    <Line {...props}>
      {/* Phone, with a card thumbnail and the create button. */}
      <rect x="20" y="16" width="58" height="108" rx="12" />
      <path d="M42 24h14" strokeOpacity="0.5" />
      <rect x="30" y="40" width="38" height="24" rx="5" strokeOpacity="0.5" />
      <circle cx="49" cy="96" r="10" />
      <path d="M49 91v10M44 96h10" />

      {/* Motion between the two. */}
      <path d="m84 64 6 8-6 8M92 64l6 8-6 8" strokeOpacity="0.5" />

      {/* The new card: chip, number, contactless. */}
      <g transform="rotate(-8 142 72)">
        <rect x="102" y="42" width="84" height="56" rx="10" />
        <rect x="112" y="54" width="15" height="11" rx="3" />
        <path d="M112 84h30" />
        <path d="M148 84h10" strokeOpacity="0.5" />
        <path d="M166 55a7 7 0 0 1 0 11M171 52a12 12 0 0 1 0 17" strokeOpacity="0.6" />
      </g>
      <path d="M182 22v8M178 26h8" strokeOpacity="0.6" />
    </Line>
  );
}

/** Security: a checkout form with a lock and a masked number, shield beside. */
function ShieldArt(props) {
  return (
    <Line {...props}>
      {/* Browser window. */}
      <rect x="14" y="18" width="126" height="104" rx="12" />
      <path d="M14 38h126" strokeOpacity="0.5" />
      <circle cx="26" cy="28" r="2.5" strokeOpacity="0.6" />
      <circle cx="35" cy="28" r="2.5" strokeOpacity="0.6" />
      <circle cx="44" cy="28" r="2.5" strokeOpacity="0.6" />

      {/* Card number field: padlock, masked digits, last four. */}
      <rect x="26" y="50" width="102" height="22" rx="6" />
      <rect x="34" y="60" width="10" height="8" rx="2" />
      <path d="M36 60v-2.5a3 3 0 0 1 6 0V60" />
      <circle cx="56" cy="61" r="2" fill="currentColor" />
      <circle cx="63" cy="61" r="2" fill="currentColor" />
      <circle cx="70" cy="61" r="2" fill="currentColor" />
      <circle cx="77" cy="61" r="2" fill="currentColor" />
      <path d="M88 61h28" strokeOpacity="0.6" />

      {/* Expiry and CVC. */}
      <rect x="26" y="82" width="56" height="22" rx="6" strokeOpacity="0.5" />
      <rect x="90" y="82" width="38" height="22" rx="6" strokeOpacity="0.5" />

      {/* Shield, checked. */}
      <path d="M168 62c8 5 15 7 22 7v17c0 15-10 27-22 33-12-6-22-18-22-33V69c7 0 14-2 22-7Z" />
      <path d="m160 90 6 6 11-12" strokeWidth="3" />
    </Line>
  );
}

/** Plans: one total split into four parts, paid off along a timeline. */
function PlansArt(props) {
  return (
    <Line {...props}>
      {/* The total, in four instalments — the first two paid. */}
      <rect x="24" y="20" width="152" height="28" rx="14" />
      <path d="M62 20v28M100 20v28M138 20v28" strokeOpacity="0.5" />
      <path d="m37 34 4 4 7-8M75 34l4 4 7-8" />

      {/* Each part drops to its date. */}
      <path d="M43 54v28M81 54v28M119 54v28M157 54v28" strokeOpacity="0.4" strokeDasharray="3 6" />

      {/* Timeline. */}
      <path d="M52 94h20M90 94h20M128 94h20" strokeOpacity="0.5" />
      <circle cx="43" cy="94" r="9" />
      <circle cx="81" cy="94" r="9" />
      <circle cx="119" cy="94" r="9" strokeOpacity="0.6" />
      <circle cx="157" cy="94" r="9" strokeOpacity="0.6" />
      <path d="m39 94 3 3 5-6M77 94l3 3 5-6" />
      <path d="M35 116h16M73 116h16M111 116h16M149 116h16" strokeOpacity="0.45" />
    </Line>
  );
}

/** Monitoring: a spend lands on the chart and fires a notification. */
function MonitorArt(props) {
  return (
    <Line {...props}>
      {/* Notification, with its bell. */}
      <rect x="66" y="10" width="122" height="32" rx="16" />
      <path d="M78 30h12M80 30v-6a4 4 0 0 1 8 0v6M82 33a2 2 0 0 0 4 0" />
      <path d="M100 21h44" strokeOpacity="0.6" />
      <path d="M100 30h28" strokeOpacity="0.45" />
      <path d="M160 26h16" />

      {/* What triggered it. */}
      <path d="M120 42v22" strokeOpacity="0.4" strokeDasharray="3 5" />

      {/* Dashboard. */}
      <rect x="14" y="50" width="134" height="78" rx="14" />
      <path d="M26 62h26" strokeOpacity="0.6" />
      <path d="M26 116h110" strokeOpacity="0.35" />
      <polyline points="26,108 46,94 64,100 86,80 104,86 120,70" strokeWidth="3" />
      <circle cx="120" cy="70" r="5" />
      <circle cx="120" cy="70" r="11" strokeOpacity="0.35" />
    </Line>
  );
}

/** Currencies: a globe, with $, € and £ coins in orbit around it. */
function CurrencyArt(props) {
  return (
    <Line {...props}>
      {/* Orbit. */}
      <ellipse cx="100" cy="72" rx="86" ry="26" transform="rotate(-12 100 72)" strokeOpacity="0.4" />

      {/* Globe. */}
      <circle cx="100" cy="72" r="34" />
      <ellipse cx="100" cy="72" rx="14" ry="34" strokeOpacity="0.6" />
      <path d="M66 72h68" strokeOpacity="0.6" />
      <path d="M72 55h56M72 89h56" strokeOpacity="0.4" />

      {/* € */}
      <circle cx="26" cy="92" r="13" />
      <path d="M31 86a7 7 0 1 0 0 12M19 90h9M19 94h9" />
      {/* £ */}
      <circle cx="174" cy="50" r="13" />
      <path d="M178 45c-1-2-2-3-4-3-3 0-4 2-4 4v9M166 51h8M166 55h12" />
      {/* $ */}
      <circle cx="152" cy="104" r="13" />
      <path d="M152 95v18M156 99c-1-2-2-2-4-2-3 0-4 1-4 3 0 4 8 2 8 6 0 2-2 3-4 3-2 0-4-1-5-2" />
    </Line>
  );
}

/** Support: a headset, a round-the-clock clock, and a reply on its way. */
function SupportArt(props) {
  return (
    <Line {...props}>
      {/* Headset and mic. */}
      <path d="M30 76v-8a32 32 0 0 1 64 0v8" />
      <rect x="24" y="72" width="14" height="28" rx="6" />
      <rect x="86" y="72" width="14" height="28" rx="6" />
      <path d="M93 100c0 13-10 20-24 20h-4" />
      <rect x="52" y="114" width="14" height="10" rx="5" />

      {/* 24/7 clock with a looping arrow. */}
      <circle cx="150" cy="40" r="20" />
      <path d="M150 30v10l7 5" />
      <path d="M124 26a28 28 0 0 1 44-8" strokeOpacity="0.5" />
      <path d="m164 12 4 6-7 1" strokeOpacity="0.5" />

      {/* Reply, still typing. */}
      <path d="M126 74h44a12 12 0 0 1 12 12v12a12 12 0 0 1-12 12h-28l-12 10v-10h-4a12 12 0 0 1-12-12V86a12 12 0 0 1 12-12Z" />
      <circle cx="136" cy="92" r="2.5" fill="currentColor" />
      <circle cx="148" cy="92" r="2.5" fill="currentColor" />
      <circle cx="160" cy="92" r="2.5" fill="currentColor" />
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
