"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { SectionIcon } from "@/components/dashboard/SectionIcon";
import { ArrowRightIcon, ChevronDownIcon, CloseIcon, LogOutIcon, PlusIcon } from "@/components/icons";
import { dashboardHelp, dashboardNav } from "@/data/dashboard";
import { useDesktop } from "@/hooks/useDesktop";
import { cn } from "@/lib/cn";
import mark from "../../../public/images/logo/favicon_brand.png";
import logoDark from "../../../public/images/logo/web_logo_dark.png";
import logoLight from "../../../public/images/logo/web_logo_light.png";

/** How the sidebar eases between the rail and the full list: its width, and everything that follows it. */
const EASE = "duration-[450ms] ease-in-out";

/**
 * The dashboard's sidebar: a floating card under the top bar with the links in
 * groups, and at its foot Help, Log out (which asks first, `onLogout`) and a
 * nudge to add a card.
 * The page you are on sits on a soft brand tint, in deep orange. Group titles
 * are for screen readers only; on screen the links run as one even list, but
 * for Settings: one item that opens out to its pages on a tree.
 *
 * Large screens: part of the layout. It starts right under the top bar, level
 * with the page's content, reaches down to the foot of the window and stays
 * in view as the page scrolls. Open full, the list scrolls inside it when the
 * window is short; the rail grows instead, as its tooltips must not be
 * clipped. The arrow beside the logo in the top bar switches between the two.
 * On the rail a short rule marks each group, each icon names itself in a
 * tooltip on hover or keyboard focus, and the nudge is an orange plus.
 *
 * The switch is one smooth movement, not a swap: every row keeps its shape
 * either way (see `row`), and what differs between the two (the rules, the
 * tree's indent and lines, the nudge) eases from one to the other alongside
 * the width. `animate` is off until the page has settled, so it opens at the
 * width you left it at instead of easing there on every load.
 *
 * Smaller screens: a drawer from the left (see DashboardShell), always full,
 * with the logo and a close button; while shut it is inert, so focus cannot
 * wander into it.
 */
export function DashboardSidebar({ collapsed, drawer, onCloseDrawer, onLogout, animate }) {
  const pathname = usePathname();
  const desktop = useDesktop();
  const closeButton = useRef(null);

  // Focus moves into the drawer when it opens.
  useEffect(() => {
    if (drawer && !desktop) closeButton.current?.focus();
  }, [drawer, desktop]);

  // The rail only exists on large screens; the drawer is always full.
  const rail = collapsed && desktop;
  const isCurrent = (href) => (href === "/dashboard" ? pathname === href : pathname.startsWith(href));

  // The settings tree is open on its own pages and shut elsewhere; a click
  // flips it until you move to another page.
  const treeId = useId();
  const inTree = dashboardNav.some((group) => group.collapsible && group.items.some((entry) => isCurrent(entry.href)));
  const [tree, setTree] = useState({ open: false, on: null });
  const treeOpen = tree.on === pathname ? tree.open : inTree;
  const toggleTree = () => setTree({ open: !treeOpen, on: pathname });

  // Every row has the same shape on the rail and on the full list: the icon at
  // a fixed spot (the middle of the rail) with the label beside it. The row
  // clips the label as the sidebar narrows and the label fades, so nothing
  // jumps. On the rail a row is exactly as wide as it is tall: a circle (44px,
  // in the 80px rail less its 18px padding either side).
  const row = (current) =>
    cn(
      "flex h-11 w-full items-center gap-3 overflow-hidden rounded-full px-[11px] text-base font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
      current ? "bg-brand-50 text-brand-700 dark:bg-brand/15 dark:text-brand-300" : "text-muted hover:bg-canvas hover:text-headline",
    );
  const label = cn("transition-opacity", rail ? "opacity-0 duration-150" : "opacity-100 delay-150 duration-300");

  return (
    <aside
      id="dashboard-sidebar"
      aria-label="Dashboard"
      inert={!desktop && !drawer}
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-72 flex-col rounded-r-[2.5rem] bg-card transition-[translate,width]",
        EASE,
        drawer ? "translate-x-0" : "-translate-x-full",
        "lg:sticky lg:top-[5.75rem] lg:z-30 lg:translate-x-0 lg:self-start lg:rounded-[2.5rem]",
        rail ? "lg:min-h-[calc(100dvh-6.75rem)] lg:w-20" : "lg:h-[calc(100dvh-6.75rem)] lg:w-64",
        !animate && "transition-none! [&_*]:transition-none!",
      )}
    >
      {/* The drawer's own header: the logo and a way to close it. */}
      <div className="flex h-20 shrink-0 items-center justify-between px-5 lg:hidden">
        <Link href="/" aria-label="StripCard home" className="flex items-center gap-2.5">
          <span className="grid size-10 place-items-center rounded-full bg-brand-50 dark:bg-brand/15">
            <Image src={mark} alt="" sizes="24px" className="size-5" />
          </span>
          <Image src={logoDark} alt="" sizes="120px" className="h-5 w-auto dark:hidden" />
          <Image src={logoLight} alt="" sizes="120px" className="hidden h-5 w-auto dark:block" />
        </Link>
        <button
          ref={closeButton}
          type="button"
          onClick={onCloseDrawer}
          aria-label="Close menu"
          className="grid size-10 cursor-pointer place-items-center rounded-full bg-canvas text-headline transition-colors hover:bg-line focus-visible:outline-2 focus-visible:outline-brand"
        >
          <CloseIcon className="size-5" />
        </button>
      </div>

      {/* ── The links ─────────────────────────────────────────────────── */}
      <nav
        aria-label="Dashboard pages"
        className={cn(
          "flex-1 px-[18px] pt-2 pb-3 lg:pt-5",
          rail ? "overflow-visible" : "min-h-0 overflow-y-auto [scrollbar-width:thin]",
        )}
      >
        {dashboardNav.map((group, g) => (
          <div key={group.title ?? g} className={cn(g > 0 && ["transition-[margin]", EASE, rail ? "mt-2.5" : "mt-0.5"])}>
            {/* Between groups: a short rule on the rail, shrinking away on the full list. */}
            {g > 0 && (
              <span
                aria-hidden="true"
                className={cn(
                  "mx-auto block h-px bg-line transition-[width,margin,opacity]",
                  EASE,
                  rail ? "mb-2.5 w-8 opacity-100" : "mb-0 w-0 opacity-0",
                )}
              />
            )}
            {group.collapsible ? (
              <h2 className="group relative">
                <button
                  type="button"
                  onClick={toggleTree}
                  aria-expanded={treeOpen}
                  aria-controls={treeId}
                  className={cn(row(false), "cursor-pointer font-body")}
                >
                  <SectionIcon name={group.icon} className="size-[22px] shrink-0" />
                  <span className={label}>{group.title}</span>
                  <ChevronDownIcon
                    aria-hidden="true"
                    className={cn(
                      "ml-auto size-4 shrink-0 transition-[rotate,opacity] duration-200",
                      treeOpen && "rotate-180",
                      rail ? "opacity-0" : "opacity-100",
                    )}
                  />
                </button>
                {rail && <Tooltip>{group.title}</Tooltip>}
              </h2>
            ) : (
              group.title && <h2 className="sr-only">{group.title}</h2>
            )}
            {/* A collapsible group's pages hang off a line under it, each on a
                branch: on the full list they move in under it and the lines
                fade in; on the rail they line up with the rest. */}
            <ul
              id={group.collapsible ? treeId : undefined}
              hidden={group.collapsible && !treeOpen}
              className={cn(
                "space-y-0.5",
                group.collapsible && [
                  "relative mt-0.5 transition-[margin]",
                  EASE,
                  "before:absolute before:-top-0.5 before:bottom-[22px] before:left-0 before:w-px before:bg-line before:transition-opacity before:duration-300",
                  rail ? "ml-0 before:opacity-0" : "ml-5 before:opacity-100",
                ],
              )}
            >
              {group.items.map((entry) => {
                const current = isCurrent(entry.href);
                return (
                  <li
                    key={entry.href}
                    className={cn(
                      "group relative",
                      group.collapsible && [
                        "transition-[padding]",
                        EASE,
                        "after:absolute after:top-1/2 after:left-0 after:h-px after:w-3 after:bg-line after:transition-opacity after:duration-300",
                        rail ? "pl-0 after:opacity-0" : "pl-3 after:opacity-100",
                      ],
                    )}
                  >
                    <Link href={entry.href} aria-current={current ? "page" : undefined} className={row(current)}>
                      <SectionIcon name={entry.icon} className="size-[22px] shrink-0" />
                      <span className={label}>{entry.label}</span>
                    </Link>
                    {rail && <Tooltip>{entry.label}</Tooltip>}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* ── Help, log out, then the add-card nudge ───────────────────── */}
      <div className="shrink-0 space-y-3 px-[18px] pb-5">
        <ul className="space-y-0.5">
          <li className="group relative">
            <Link
              href={dashboardHelp.href}
              aria-current={isCurrent(dashboardHelp.href) ? "page" : undefined}
              className={row(isCurrent(dashboardHelp.href))}
            >
              <SectionIcon name={dashboardHelp.icon} className="size-[22px] shrink-0" />
              <span className={label}>{dashboardHelp.label}</span>
            </Link>
            {rail && <Tooltip>{dashboardHelp.label}</Tooltip>}
          </li>
          <li className="group relative">
            <button
              type="button"
              onClick={onLogout}
              className={cn(row(false), "w-full cursor-pointer text-danger hover:bg-danger/10 hover:text-danger")}
            >
              <LogOutIcon className="size-[22px] shrink-0" />
              <span className={label}>Log out</span>
            </button>
            {rail && <Tooltip>Log out</Tooltip>}
          </li>
        </ul>
        <AddCardPromo rail={rail} />
      </div>
    </aside>
  );
}

/** The rail's label for an icon, shown beside it on hover or keyboard focus. */
function Tooltip({ children }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 left-full z-50 ml-3 -translate-x-1 -translate-y-1/2 rounded-lg bg-headline px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap text-page opacity-0 shadow-soft transition-[opacity,translate] duration-150 group-hover:translate-x-0 group-hover:opacity-100 group-has-[:focus-visible]:translate-x-0 group-has-[:focus-visible]:opacity-100"
    >
      {children}
    </span>
  );
}

/**
 * The nudge at the sidebar's foot to add a card: an orange card with a little
 * card stack, a line of copy and a dark button, which folds down into an
 * orange plus (with a tooltip) on the rail. Both are always there, one folded
 * away and inert, so the switch is a fold rather than a swap. The card keeps
 * the full list's width, so its words do not reflow as the sidebar opens out.
 */
function AddCardPromo({ rail }) {
  const href = "/dashboard/virtual-card";
  const fold = (shown) =>
    cn("grid transition-[grid-template-rows,opacity]", EASE, shown ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0");

  return (
    <div>
      {/* On the rail: the plus. */}
      <div className={fold(rail)} inert={!rail}>
        <div className="group relative min-h-0">
          <Link
            href={href}
            aria-label="Add a new card"
            className="grid size-11 place-items-center rounded-full bg-brand text-hero-ink transition-colors hover:bg-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <PlusIcon className="size-[22px]" />
          </Link>
          {rail && <Tooltip>Add a new card</Tooltip>}
        </div>
      </div>

      {/* On the full list: the card. */}
      <div className={fold(!rail)} inert={rail}>
        <div className="min-h-0 overflow-hidden">
          <div className="w-full rounded-[1.5rem] bg-brand px-4 pt-5 pb-4 text-center text-hero-ink lg:w-[13.75rem]">
            {/* A little stack of cards. */}
            <div aria-hidden="true" className="relative mx-auto h-12 w-[4.5rem]">
              <span className="absolute inset-0 -rotate-12 rounded-lg bg-white/70" />
              <span className="absolute inset-0 rotate-6 rounded-lg bg-hero-ink shadow-[0_8px_16px_-6px_rgb(12_5_3/0.6)]">
                <span className="absolute top-2 left-2 h-2 w-3 rounded-[3px] bg-brand-300" />
                <span className="absolute right-2 bottom-1.5 text-[0.5rem] leading-none tracking-[0.2em] text-white/70">
                  ••••
                </span>
              </span>
            </div>
            <p className="mt-4 font-heading text-lg leading-tight font-semibold">Add a new card</p>
            <p className="mt-1 text-xs text-balance text-hero-ink/80">A virtual card in seconds, ready to spend.</p>
            <Link
              href={href}
              aria-label="Let's go: add a new card"
              className="mt-4 inline-flex h-10 items-center gap-2 rounded-full bg-hero-ink pr-3.5 pl-4 text-sm font-semibold text-white transition-colors hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hero-ink"
            >
              Let&apos;s go
              <ArrowRightIcon aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
