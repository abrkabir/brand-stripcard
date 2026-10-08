"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import { CheckIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

/**
 * Tabbed feature panel: a segmented tab bar, then a two-part panel — the
 * feature's image filling one side, and the copy beside it.
 *
 * The tabs follow the WAI-ARIA pattern: one tab stop for the whole bar,
 * Left/Right (and Home/End) to move between tabs, and each tab names the
 * panel it controls. The active marker slides between tabs; the image and the
 * copy re-enter on every change (keyed on the tab), and with reduced motion
 * the global stylesheet simply makes the swap instant.
 */
export function FeatureTabs({ tabs }) {
  const [index, setIndex] = useState(0);
  const tabRefs = useRef([]);
  const base = useId();
  const tab = tabs[index];

  const select = (i) => {
    const next = (i + tabs.length) % tabs.length;
    setIndex(next);
    tabRefs.current[next]?.focus();
  };

  const onKeyDown = (event) => {
    const moves = {
      ArrowRight: index + 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: tabs.length - 1,
    };
    if (event.key in moves) {
      event.preventDefault();
      select(moves[event.key]);
    }
  };

  return (
    <div className="mt-10 lg:mt-12">
      {/* Tab bar. */}
      <div
        role="tablist"
        aria-label="Features"
        onKeyDown={onKeyDown}
        className="relative grid max-w-2xl rounded-full bg-surface p-1"
        style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
      >
        {/* The active marker, sliding to the selected tab. */}
        <span
          aria-hidden="true"
          className="absolute inset-y-1 left-1 rounded-full bg-brand shadow-soft transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            width: `calc((100% - 0.5rem) / ${tabs.length})`,
            transform: `translateX(${index * 100}%)`,
          }}
        />
        {tabs.map((t, i) => {
          const on = i === index;
          return (
            <button
              key={t.id}
              ref={(el) => (tabRefs.current[i] = el)}
              type="button"
              role="tab"
              id={`${base}-tab-${t.id}`}
              aria-selected={on}
              aria-controls={`${base}-panel`}
              tabIndex={on ? 0 : -1}
              onClick={() => setIndex(i)}
              className={cn(
                "relative truncate rounded-full px-3 py-2.5 text-sm font-semibold transition-colors duration-300 sm:px-4",
                on ? "text-white" : "text-muted hover:text-headline",
              )}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Panel. */}
      <div
        id={`${base}-panel`}
        role="tabpanel"
        aria-labelledby={`${base}-tab-${tab.id}`}
        className="mt-4 grid overflow-hidden rounded-[2rem] bg-surface md:grid-cols-2"
      >
        {/* The visual: the tab's image, filling a fixed 6:5 frame — the
            images are made at exactly that ratio, so nothing is cropped. */}
        <div className="relative aspect-[6/5] overflow-hidden rounded-[2rem] bg-hero-ink">
          <Image
            key={tab.id}
            src={tab.image.src}
            alt={tab.image.alt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="animate-fade-up object-cover"
          />
        </div>

        {/* The copy. */}
        <div
          key={tab.id}
          className="animate-fade-up flex flex-col justify-center px-6 py-10 sm:px-10 md:px-7 md:py-8 lg:px-12 lg:py-14"
        >
          <h3 className="max-w-md font-display text-[clamp(1.5rem,2.4vw,2rem)] leading-tight font-semibold tracking-[-0.02em] text-headline">
            {tab.title}
          </h3>
          <p className="mt-4 max-w-md text-base leading-relaxed text-content">
            {tab.description}
          </p>

          <ul className="mt-7 space-y-3">
            {tab.points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-[15px] text-content">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand text-white">
                  <CheckIcon aria-hidden="true" strokeWidth={2.5} className="size-3" />
                </span>
                {point}
              </li>
            ))}
          </ul>

          <Button
            href={tab.cta.href}
            variant="outline"
            size="sm"
            className="mt-9 self-start border-headline/20 text-headline/60 hover:border-brand hover:text-white"
          >
            {tab.cta.label}
          </Button>
        </div>
      </div>
    </div>
  );
}
