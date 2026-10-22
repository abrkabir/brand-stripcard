"use client";

import { useId, useState } from "react";
import { ChevronDownIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

/**
 * Questions that open to their answers, one at a time: each question a button
 * (its state announced), the answer easing in under it. Opening one closes
 * the one open before; opening it again closes it. Under reduced motion the
 * answer simply appears.
 *
 *   items  [{ q, a }]; `a` may be text or nodes
 *   open   the index open to begin with (none by default)
 */
export function Accordion({ items, open: initial = null, className }) {
  const id = useId();
  const [open, setOpen] = useState(initial);

  return (
    <ul className={cn("divide-y divide-line", className)}>
      {items.map((item, i) => {
        const on = open === i;
        return (
          <li key={item.q}>
            <h3>
              <button
                type="button"
                id={`${id}-q${i}`}
                aria-expanded={on}
                aria-controls={`${id}-a${i}`}
                onClick={() => setOpen(on ? null : i)}
                className="group flex w-full cursor-pointer items-center gap-4 py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <span
                  className={cn(
                    "min-w-0 flex-1 text-[0.9375rem] font-semibold transition-colors",
                    on
                      ? "text-headline"
                      : "text-content group-hover:text-headline",
                  )}
                >
                  {item.q}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-full transition-colors",
                    on
                      ? "bg-brand text-white"
                      : "bg-canvas text-muted group-hover:text-headline",
                  )}
                >
                  <ChevronDownIcon
                    className={cn(
                      "size-4 transition-transform duration-300 motion-reduce:transition-none",
                      on && "rotate-180",
                    )}
                  />
                </span>
              </button>
            </h3>
            <div
              id={`${id}-a${i}`}
              role="region"
              aria-labelledby={`${id}-q${i}`}
              hidden={!on}
              className="motion-safe:animate-pop-in"
            >
              <p className="max-w-2xl pr-12 pb-4 text-sm leading-relaxed text-muted">
                {item.a}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
