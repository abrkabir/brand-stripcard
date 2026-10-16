"use client";

import { useState } from "react";
import { CheckIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { rewardsPromo } from "@/data/dashboard";

/**
 * The rewards offer: a dark card on a short stack of paler ones, the figure
 * set in a tilted outline as if circled by hand, two outlined cards in the
 * corner, and a button that joins (and then says so).
 *
 * TODO: Backend — joining should call the rewards API; for now it only
 * changes the button.
 */
export function RewardsCard() {
  const { before, highlight, after, text, cta, joined } = rewardsPromo;
  const [isIn, setIsIn] = useState(false);

  return (
    <div className="relative h-full pb-4">
      {/* The paler cards behind it. */}
      <div aria-hidden="true" className="absolute inset-x-5 bottom-0 h-12 rounded-b-3xl bg-line/70" />
      <div aria-hidden="true" className="absolute inset-x-2.5 bottom-2 h-12 rounded-b-3xl bg-line" />

      <div className="relative isolate flex h-full min-h-72 flex-col overflow-hidden rounded-3xl bg-hero-ink p-6 text-white sm:p-7 dark:bg-[#17100c] dark:ring-1 dark:ring-white/10">
        {/* Two outlined cards in the corner. */}
        <svg
          aria-hidden="true"
          viewBox="0 0 160 120"
          className="pointer-events-none absolute -right-6 -bottom-6 -z-10 w-48 text-white/25"
        >
          <rect x="40" y="18" width="110" height="74" rx="10" fill="none" stroke="currentColor" strokeWidth="1.2" transform="rotate(-14 95 55)" />
          <rect x="52" y="34" width="110" height="74" rx="10" fill="none" stroke="currentColor" strokeWidth="1.2" transform="rotate(-8 107 71)" />
        </svg>

        <h2 className="font-heading text-[1.65rem] leading-[1.2] font-semibold tracking-[-0.01em] text-white">
          {before}{" "}
          <span className="inline-block -rotate-6 rounded-xl border-2 border-white px-2 font-accent font-normal tracking-normal italic">
            {highlight}
          </span>{" "}
          {after}
        </h2>
        <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/65">{text}</p>

        <div className="mt-auto pt-7">
          {isIn ? (
            <p className="inline-flex h-10 items-center gap-2 rounded-full bg-white/10 px-4 text-sm font-semibold" role="status">
              <CheckIcon className="size-4 text-brand-300" />
              {joined}
            </p>
          ) : (
            <Button
              size="sm"
              arrow={false}
              onClick={() => setIsIn(true)}
              className="border-brand-100 bg-brand-100 text-hero-ink hover:border-white hover:bg-white"
            >
              {cta}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
