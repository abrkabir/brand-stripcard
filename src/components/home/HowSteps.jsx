"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { HowCard } from "@/components/home/HowCard";
import {
  ArrowRightIcon,
  CreditCardIcon,
  GlobeIcon,
  UserIcon,
} from "@/components/icons";
import { cn } from "@/lib/cn";

/**
 * The motion. Panels resizing and the picture opening share one in-out
 * curve, so a change starts gently, moves, and settles; colours ease out a
 * little quicker; and the text never reflows on the way (see below).
 */
const MORPH =
  "duration-[750ms] ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none";
const FADE = "duration-500 ease-out motion-reduce:transition-none";

/** How long the pointer has to rest on a panel before it becomes the active one. */
const HOVER_INTENT_MS = 90;

/**
 * The geometry, in units of the row (a size container; 1cqw is 1% of its
 * inner width). Panels grow in the ratio 2.5 : 1 : 1, so a narrow panel is
 * 100 / 4.5 = 22.22cqw and the active one 55.56cqw. Text is set at the
 * narrow panel's width in every panel, so its lines never rewrap while a
 * panel resizes; the picture is set at its full width inside its frame, so
 * opening it reveals it rather than stretching it.
 */
const TEXT_W = "w-[calc(22.22cqw-50px)]";
const PICTURE_W = "calc(27.78cqw - 12px)";

/**
 * The panels' colours. The grid is one neutral ground, and only the active
 * step's panel stands out: on the light page, white warming to a faint
 * brand peach, with a fine peach edge and a warm shadow; on the dark one,
 * pure black warming to a deep brand brown, with a fine orange edge.
 */
const TONES = {
  rest: {
    panel: "bg-transparent shadow-none",
    title: "text-headline",
    icon: "text-brand ring-brand/40",
    body: "text-content",
    link: "text-brand hover:text-brand-700",
  },
  active: {
    panel:
      "bg-white shadow-[0_26px_50px_-26px_rgb(242_106_27/0.38)] ring-1 ring-brand-200/70 ring-inset dark:bg-black dark:shadow-[0_28px_60px_-30px_rgb(242_106_27/0.55)] dark:ring-brand-500/35",
    title: "text-headline",
    icon: "text-brand ring-brand/40 dark:ring-brand/55",
    body: "text-content",
    link: "text-brand hover:text-brand-700 dark:hover:text-brand-300",
  },
};

/** Each step's outlined icon, by its `glyph`. */
const ICONS = { user: UserIcon, card: CreditCardIcon, globe: GlobeIcon };

function StepIcon({ glyph, className }) {
  const Icon = ICONS[glyph] ?? UserIcon;
  return <Icon className={className} />;
}

/**
 * "How it works": the heading, the steps, and where it works under them
 * (`heading` and `footer`, passed in).
 *
 * From `lg`: the heading top left, and under it the steps as one grid: a
 * single bordered block split into
 * panels with no gaps between them, on one neutral ground; only the active
 * panel stands out, in a brand-tinted white or black (TONES). Each panel has its step's outlined
 * icon at the top and its title, description and link at the foot. The
 * active step's panel is wide, with its picture inside on the left and the
 * rest beside it; the other two are narrow, their text only, dimmed.
 *
 * The first step is active to begin with. Resting the pointer on a panel (a
 * moment, so sweeping across the row does not flicker through every step),
 * or moving focus into it, makes it the active one: it widens and its
 * picture opens, its colours following a beat after one another, while the
 * one before narrows and closes.
 *
 * Below `lg`: the heading, the steps as cards (HowCard), each with its own
 * picture, then where it works.
 */
export function HowSteps({ steps, heading, footer }) {
  const [active, setActive] = useState(0);
  const timer = useRef(0);

  useEffect(() => () => clearTimeout(timer.current), []);

  const intend = (i) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setActive(i), HOVER_INTENT_MS);
  };
  const cancel = () => clearTimeout(timer.current);

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-0">
      <div className="lg:col-start-1 lg:row-start-1">{heading}</div>

      {/* The steps, as a row of panels; the active one wide. */}
      <ol
        onPointerLeave={cancel}
        className="@container mt-12 hidden h-[25rem] overflow-hidden rounded-[1.75rem] bg-surface p-2 ring-1 ring-line ring-inset lg:col-span-2 lg:flex"
      >
        {steps.map((step, i) => {
          const on = i === active;
          const tone = on ? TONES.active : TONES.rest;
          /** Colours change a beat apart, top to bottom, on the way in only. */
          const beat = (k) => ({
            transitionDelay: on ? `${120 + k * 50}ms` : "0ms",
          });
          return (
            <li
              key={step.title}
              onPointerEnter={() => intend(i)}
              onFocus={() => {
                cancel();
                setActive(i);
              }}
              className={cn(
                "group relative isolate flex min-w-0 basis-0 overflow-hidden rounded-[1.25rem] p-3 transition-[flex-grow,background-color,box-shadow]",
                MORPH,
                tone.panel,
                on ? "grow-[2.5]" : "grow",
              )}
            >
              {/* The hairline between two resting panels; hidden beside the
                  active one, whose rounded edge stands on its own. */}
              {i > 0 && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute inset-y-6 left-0 w-px bg-line transition-opacity",
                    FADE,
                    on || i - 1 === active ? "opacity-0" : "opacity-100",
                  )}
                />
              )}

              {/* The active panel's brand tint: on the light page, white at
                  its top left warming to a faint peach at its foot; on the dark
                  one, pure black warming to a deep brand brown. A layer of its
                  own, so it fades in with the panel's colour. */}
              <span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(140deg,rgb(255_255_255)_0%,var(--color-brand-50)_48%,var(--color-brand-100)_100%)] transition-opacity dark:bg-[linear-gradient(140deg,rgb(0_0_0)_0%,rgb(0_0_0)_42%,rgb(64_21_7/0.85)_78%,rgb(117_47_19/0.9)_100%)]",
                  MORPH,
                  on ? "opacity-100" : "opacity-0",
                )}
              />

              {/* A soft light in the active panel. */}
              <span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute -right-[15%] -bottom-1/2 -z-10 aspect-square w-[70%] rounded-full bg-[radial-gradient(closest-side,rgb(242_106_27/0.16),rgb(242_106_27/0))] transition-[opacity,scale] dark:bg-[radial-gradient(closest-side,rgb(242_106_27/0.35),rgb(242_106_27/0))]",
                  MORPH,
                  on ? "scale-100 opacity-100" : "scale-75 opacity-0",
                )}
              />

              {/* The picture: a frame that opens in the active panel, the
                  picture inside it already at full size. */}
              <div
                aria-hidden="true"
                className={cn(
                  "relative shrink-0 overflow-hidden rounded-[0.875rem] bg-brand-100 transition-[width,margin-right,opacity]",
                  MORPH,
                  on ? "mr-6 opacity-100" : "mr-0 opacity-0",
                )}
                style={{ width: on ? PICTURE_W : "0px" }}
              >
                <div
                  className="absolute inset-y-0 left-0"
                  style={{ width: PICTURE_W }}
                >
                  <Image
                    src={step.image}
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 380px, 28vw"
                    style={{ objectPosition: step.focus }}
                    className={cn(
                      "object-cover transition-[scale]",
                      MORPH,
                      on ? "scale-100" : "scale-[1.08]",
                    )}
                  />
                </div>
              </div>

              {/* The step: its icon at the top, the words at the foot, set at
                  one width in every panel so they never rewrap. */}
              <div
                className={cn(
                  "flex min-w-0 flex-1 flex-col justify-between px-3 py-3 transition-opacity",
                  FADE,
                  on ? "opacity-100" : "opacity-80 group-hover:opacity-100",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "grid size-12 shrink-0 place-items-center rounded-full ring-1 ring-inset transition-[color,box-shadow,scale]",
                    FADE,
                    tone.icon,
                    on ? "scale-100" : "scale-95",
                  )}
                  style={beat(0)}
                >
                  <StepIcon glyph={step.glyph} className="size-6" />
                </span>
                <div className={cn("shrink-0", TEXT_W)}>
                  <h3
                    className={cn(
                      "font-heading text-[clamp(1.5rem,2.1vw,2rem)] leading-[1.1] font-normal tracking-[-0.02em] transition-colors",
                      FADE,
                      tone.title,
                    )}
                    style={beat(1)}
                  >
                    {step.title}
                  </h3>
                  <p
                    className={cn(
                      "mt-3 line-clamp-3 text-[15px] leading-relaxed text-pretty transition-colors",
                      FADE,
                      tone.body,
                    )}
                    style={beat(2)}
                  >
                    {step.description}
                  </p>
                  <Link
                    href={step.cta.href}
                    className={cn(
                      "group/link mt-4 inline-flex items-center gap-1.5 text-sm font-semibold whitespace-nowrap transition-colors",
                      FADE,
                      tone.link,
                    )}
                    style={beat(3)}
                  >
                    {step.cta.label}
                    <ArrowRightIcon
                      aria-hidden="true"
                      className="size-4 -rotate-45 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                    />
                  </Link>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Below lg: the steps as cards. */}
      <ul className="grid gap-5 lg:hidden">
        {steps.map((step, i) => (
          <li key={step.title}>
            <HowCard step={step} index={i} />
          </li>
        ))}
      </ul>

      <div className="lg:col-span-2 lg:mt-14">{footer}</div>
    </div>
  );
}
