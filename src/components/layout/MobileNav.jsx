"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRightIcon, ChevronDownIcon } from "@/components/icons";
import { headerCta, mainNav } from "@/data/navigation";
import { cn } from "@/lib/cn";

/**
 * The menu below `lg`: a white card that drops out of the header pill, with
 * every link as a full-width row (the current page tinted in the brand) and
 * the call to action as a wide pill at the foot.
 *
 * It renders inside the header, directly under the pill, so it shares the
 * pill's width and gutters. The header owns the open state and the toggle
 * (the burger turns into a close mark); Escape closes it too. Items with a
 * `panel` expand in place to show their sub-links.
 */
/**
 * Each row eases in a beat after the one above when the menu opens, and all
 * leave together, at once, when it closes — a stagger on the way out would
 * only make closing feel slow.
 */
function stagger(open, index) {
  return {
    className: cn(
      "transition-[opacity,translate] duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
      open ? "translate-y-0 opacity-100" : "-translate-y-1.5 opacity-0",
    ),
    style: { transitionDelay: open ? `${80 + index * 40}ms` : "0ms" },
  };
}

export function MobileNav({ id, open, onClose }) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  const row =
    "flex w-full items-center justify-between rounded-xl px-3.5 py-2 text-left text-[15px] transition-colors";

  return (
    <nav
      id={id}
      aria-label="Main menu"
      aria-hidden={!open}
      inert={!open}
      className={cn(
        // `visibility` is in the transition list on purpose: it then flips
        // at the start of opening and the end of closing, so the card
        // animates out instead of vanishing. The clip-path unfolds it from
        // the top edge.
        "pointer-events-auto absolute inset-x-5 top-full mt-2 origin-top rounded-[1.75rem] border border-line bg-elevated p-2 shadow-lift transition-[opacity,translate,clip-path,visibility] duration-[450ms] ease-[cubic-bezier(0.16,1,0.3,1)] sm:inset-x-6 lg:hidden",
        open
          ? "visible translate-y-0 opacity-100 [clip-path:inset(0_0_0_0_round_1.75rem)]"
          : "invisible -translate-y-2 opacity-0 [clip-path:inset(0_0_100%_0_round_1.75rem)]",
      )}
    >
      <ul className="space-y-0.5">
        {mainNav.map((item, index) => {
          const active = isActive(item.href);
          const enter = stagger(open, index);

          if (!item.panel) {
            return (
              <li key={item.label} className={enter.className} style={enter.style}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    row,
                    active
                      ? "bg-brand/10 text-brand"
                      : "text-content hover:bg-surface hover:text-headline",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          }

          const isOpen = expanded === item.label;
          return (
            <li key={item.label} className={enter.className} style={enter.style}>
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : item.label)}
                aria-expanded={isOpen}
                className={cn(row, "text-content hover:bg-surface hover:text-headline")}
              >
                {item.label}
                <ChevronDownIcon
                  className={cn("size-4 transition-transform duration-300", isOpen && "-rotate-180")}
                />
              </button>
              <div
                className={cn(
                  "grid transition-[grid-template-rows] duration-300 ease-out",
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <ul className="overflow-hidden pl-4">
                  {item.panel.map((entry) => (
                    <li key={entry.href}>
                      <Link
                        href={entry.href}
                        onClick={onClose}
                        className="block rounded-xl px-3.5 py-2 text-sm text-muted transition-colors hover:bg-surface hover:text-headline"
                      >
                        {entry.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ul>

      <Link
        href={headerCta.href}
        onClick={onClose}
        style={stagger(open, mainNav.length).style}
        className={cn(
          stagger(open, mainNav.length).className,
          "mt-2 flex h-11 items-center justify-center gap-2 rounded-full bg-linear-to-r from-brand-600 to-brand-400 text-[15px] font-semibold text-white transition-[opacity,translate,filter] hover:brightness-105",
        )}
      >
        {headerCta.label}
        <ArrowRightIcon aria-hidden="true" className="size-4 -rotate-45" />
      </Link>
    </nav>
  );
}
