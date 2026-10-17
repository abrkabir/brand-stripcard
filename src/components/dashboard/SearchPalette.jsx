"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { SectionIcon } from "@/components/dashboard/SectionIcon";
import { SearchIcon } from "@/components/icons";
import { dashboardHelp, dashboardNav, dashboardUpgrade } from "@/data/dashboard";
import { cn } from "@/lib/cn";

/** What search can open: the sidebar's groups, then Help and the premium plan. */
const GROUPS = [
  ...dashboardNav.map((group) => ({ title: group.title ?? "Overview", items: group.items })),
  { title: "More", items: [dashboardHelp, dashboardUpgrade] },
];

/**
 * How well a page matches the search, best first: its name starting with
 * it, its name containing it, then its description containing it; null for
 * no match.
 */
function rank(item, query) {
  const name = item.label.toLowerCase();
  if (name.startsWith(query)) return 0;
  if (name.includes(query)) return 1;
  if ((item.description ?? "").toLowerCase().includes(query)) return 2;
  return null;
}

/** The text with the first match of `query` (already lower case) marked. */
function Highlight({ text, query }) {
  const at = query ? text.toLowerCase().indexOf(query) : -1;
  if (at < 0) return text;
  return (
    <>
      {text.slice(0, at)}
      <mark className="bg-transparent text-brand-700 dark:text-brand-300">{text.slice(at, at + query.length)}</mark>
      {text.slice(at + query.length)}
    </>
  );
}

function Key({ children }) {
  return (
    <kbd className="grid h-5 min-w-5 place-items-center rounded-md border border-line bg-canvas px-1 font-body text-[0.6875rem] font-semibold text-content">
      {children}
    </kbd>
  );
}

/**
 * Search across the dashboard's pages, as a palette over a dimmed page: the
 * pages in the sidebar's groups to begin with; type and they give way to one
 * list of results, best match first (the matching letters marked). Move with
 * the arrow keys and open with Enter, or pick with the pointer. It closes on Escape, on
 * a click anywhere outside it, and on opening a page; `onClose` should hand
 * focus back to whatever opened it. Mount it only while it is open, so it
 * starts fresh each time. Rendered into <body>, clear of the top bar's
 * frosted strip (a backdrop filter would trap a fixed overlay inside it).
 */
export function SearchPalette({ onClose }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const id = useId();
  const q = query.trim().toLowerCase();

  const groups = q
    ? [
        {
          title: "Results",
          items: GROUPS.flatMap((group) => group.items)
            .map((item) => ({ item, score: rank(item, q) }))
            .filter((hit) => hit.score !== null)
            .sort((a, b) => a.score - b.score)
            .map((hit) => hit.item),
        },
      ].filter((group) => group.items.length > 0)
    : GROUPS;
  const flat = groups.flatMap((group) => group.items);
  const current = Math.min(active, Math.max(flat.length - 1, 0));
  const optionId = (i) => `${id}-option-${i}`;

  // The page behind stays put while the palette is open.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const move = (to) => {
    const next = (to + flat.length) % flat.length;
    setActive(next);
    document.getElementById(optionId(next))?.scrollIntoView({ block: "nearest" });
  };

  const onKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
    } else if (event.key === "Tab") {
      // Focus stays in the search field; the arrow keys move through the list.
      event.preventDefault();
    } else if (flat.length > 0 && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      event.preventDefault();
      move(current + (event.key === "ArrowDown" ? 1 : -1));
    } else if (flat.length > 0 && event.key === "Enter") {
      event.preventDefault();
      onClose();
      router.push(flat[current].href);
    }
  };

  const mac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[10vh] sm:pt-[14vh]">
      {/* The dimmed page: a click on it closes the palette. */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-hero-ink/35 backdrop-blur-[3px] motion-safe:animate-fade-in"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search pages"
        onKeyDown={onKeyDown}
        className="relative flex max-h-[80vh] w-full max-w-xl flex-col overflow-hidden rounded-3xl bg-card shadow-lift ring-1 ring-line motion-safe:animate-pop-in"
      >
        <div className="flex items-center gap-3 border-b border-line px-5">
          <SearchIcon aria-hidden="true" className="size-5 shrink-0 text-muted" />
          <input
            autoFocus
            role="combobox"
            aria-expanded="true"
            aria-controls={`${id}-list`}
            aria-autocomplete="list"
            aria-activedescendant={flat.length > 0 ? optionId(current) : undefined}
            aria-label="Search pages"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            placeholder="Search pages"
            autoComplete="off"
            spellCheck={false}
            className="h-16 min-w-0 flex-1 bg-transparent text-base text-headline outline-none placeholder:text-subtle"
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={onClose}
            className="cursor-pointer rounded-md border border-line bg-canvas px-1.5 py-0.5 text-[0.6875rem] font-semibold text-muted transition-colors hover:text-headline"
          >
            Esc
          </button>
        </div>

        <div id={`${id}-list`} role="listbox" aria-label="Pages" className="min-h-0 flex-1 overflow-y-auto p-2 [scrollbar-width:thin]">
          {groups.map((group) => (
            <div key={group.title} role="group" aria-label={group.title}>
              <p aria-hidden="true" className="px-3 pt-3 pb-1.5 text-[0.6875rem] font-semibold tracking-[0.12em] text-subtle uppercase">
                {group.title}
              </p>
              {group.items.map((item) => {
                const index = flat.indexOf(item);
                const selected = index === current;
                return (
                  <Link
                    key={item.href}
                    id={optionId(index)}
                    role="option"
                    aria-selected={selected}
                    href={item.href}
                    tabIndex={-1}
                    onMouseMove={() => setActive(index)}
                    onClick={onClose}
                    className={cn("flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors", selected && "bg-canvas")}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "grid size-9 shrink-0 place-items-center rounded-full transition-colors",
                        selected ? "bg-brand text-white" : "bg-canvas text-muted",
                      )}
                    >
                      <SectionIcon name={item.icon} className="size-[1.125rem]" />
                    </span>
                    <span className="min-w-0 flex-1 leading-tight">
                      <span className="block truncate text-sm font-semibold text-headline">
                        <Highlight text={item.label} query={q} />
                      </span>
                      {item.description && (
                        <span className="mt-0.5 block truncate text-xs text-muted">{item.description}</span>
                      )}
                    </span>
                    <span aria-hidden="true" className={cn("shrink-0", !selected && "invisible")}>
                      <Key>↵</Key>
                    </span>
                  </Link>
                );
              })}
            </div>
          ))}

          {flat.length === 0 && (
            <div className="px-4 py-12 text-center">
              <p className="text-sm font-semibold text-headline">No pages match “{query.trim()}”</p>
              <p className="mt-1 text-xs text-muted">Try a shorter word, like “card” or “money”.</p>
            </div>
          )}
        </div>

        <div className="hidden items-center gap-4 border-t border-line px-5 py-3 text-xs text-muted sm:flex">
          <span className="flex items-center gap-1.5">
            <Key>↑</Key>
            <Key>↓</Key>
            to move
          </span>
          <span className="flex items-center gap-1.5">
            <Key>↵</Key>
            to open
          </span>
          <span className="flex items-center gap-1.5">
            <Key>Esc</Key>
            to close
          </span>
          <span className="ml-auto flex items-center gap-1.5">
            <Key>{mac ? "⌘" : "Ctrl"}</Key>
            <Key>K</Key>
            anywhere
          </span>
        </div>
      </div>
    </div>,
    document.body,
  );
}
