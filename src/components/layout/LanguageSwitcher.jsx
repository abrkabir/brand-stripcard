"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon, TranslateIcon } from "@/components/icons";
import { locales } from "@/data/navigation";
import { cn } from "@/lib/cn";

/**
 * Locale picker in the header rail.
 *
 * Selection is local state for now — there is no i18n routing yet. When it
 * lands, swap `setActive` for a router push to the localised path; the markup
 * does not need to change.
 */
/* `triggerClassName` is a colour override for the trigger — the header passes
   white over the hero. */
export function LanguageSwitcher({ className, triggerClassName }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(locales[0].code);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`Language: ${active}. Change language`}
        className={cn(
          "flex items-center gap-2 py-2 text-[13px] font-semibold tracking-[0.08em] uppercase transition-colors",
          "text-muted hover:text-headline",
          triggerClassName,
        )}
      >
        <TranslateIcon className="size-[18px]" />
        {active}
        <ChevronDownIcon
          className={cn(
            "size-3.5 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      <ul
        role="listbox"
        aria-label="Language"
        className={cn(
          "absolute top-full right-0 z-10 mt-2 w-40 overflow-hidden rounded-lg border border-line bg-elevated py-1 shadow-lift",
          "transition-all duration-200",
          open
            ? "visible translate-y-0 opacity-100"
            : "pointer-events-none invisible -translate-y-1 opacity-0",
        )}
      >
        {locales.map((locale) => (
          <li key={locale.code} role="option" aria-selected={locale.code === active}>
            <button
              type="button"
              tabIndex={open ? undefined : -1}
              onClick={() => {
                setActive(locale.code);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center justify-between px-4 py-2.5 text-left text-[13px] transition-colors",
                locale.code === active
                  ? "text-headline"
                  : "text-muted hover:bg-surface hover:text-headline",
              )}
            >
              {locale.label}
              <span className="text-[11px] font-semibold tracking-[0.08em]">
                {locale.code}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
