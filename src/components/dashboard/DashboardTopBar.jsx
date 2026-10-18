"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { SearchPalette } from "@/components/dashboard/SearchPalette";
import { BellIcon, ChevronRightIcon, LogOutIcon, LongArrowRightIcon, MenuIcon, SearchIcon, UserIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { dashboardNotifications, dashboardPages, dashboardTabs, dashboardUser } from "@/data/dashboard";
import { cn } from "@/lib/cn";
import mark from "../../../public/images/logo/favicon_brand.png";
import logoDark from "../../../public/images/logo/web_logo_dark.png";
import logoLight from "../../../public/images/logo/web_logo_light.png";

/**
 * The bar's round buttons, each a white circle of its own: 3rem, and 3.5rem
 * from xl, the height of the tabs. Hover tints them like the active tab.
 */
const ROUND =
  "grid size-12 shrink-0 cursor-pointer place-items-center rounded-full bg-card text-headline transition-colors hover:bg-brand-50 hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand xl:size-14 dark:hover:bg-brand/15 dark:hover:text-brand-300";

/** A menu's button keeps that tint while its menu is open. */
const OPEN =
  "aria-expanded:bg-brand-50 aria-expanded:text-brand-700 dark:aria-expanded:bg-brand/15 dark:aria-expanded:text-brand-300";

const ITEM =
  "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-content transition-colors hover:bg-canvas hover:text-headline focus-visible:outline-2 focus-visible:outline-brand";

/**
 * The app's top bar, set straight on the canvas: the StripCard logo on the
 * left (from lg up centred over the sidebar: the mark over the rail, the
 * wordmark over the full list), then the arrow that opens and closes the
 * sidebar and the page's title with a breadcrumb under it (below lg the page
 * shows its own title; see PageHeader); the main tabs in a white pill at the
 * centre where there is room (from xl beside the rail, from 102rem beside the
 * full sidebar; the sidebar holds every link anyway); and on the right
 * search, the theme switch, notifications and the account menu (your name
 * and email before your photo, from 88rem), each on a white ground of its
 * own. Below lg a menu button opens the sidebar drawer.
 *
 * Search opens a palette over the page (see SearchPalette), from its button
 * or from Ctrl K, Cmd K or / anywhere. The notifications and account
 * popovers open under their buttons and close on Escape, on a click anywhere
 * outside them (the bar's empty space too), when another opens, or on going
 * to another page; Escape hands focus back to the button.
 *
 * It stays at the top while the page scrolls, over a frosted strip of the
 * canvas so cards slide under it cleanly.
 */
export function DashboardTopBar({ onMenu, rail, onToggleSidebar, animate }) {
  const pathname = usePathname();
  // The open popover, tied to the page it was opened on, so going to another
  // page closes it without an effect.
  const [menu, setMenu] = useState({ id: null, on: null });
  const open = menu.on === pathname ? menu.id : null;
  const root = useRef(null);
  const ids = { notes: useId(), account: useId() };

  // The search palette, open on the page it was opened from.
  const [searchOn, setSearchOn] = useState(null);
  const searching = searchOn === pathname;
  const searchButton = useRef(null);
  const openSearch = () => {
    setMenu({ id: null, on: null });
    setSearchOn(pathname);
  };
  const closeSearch = () => {
    setSearchOn(null);
    searchButton.current?.focus();
  };

  const toggle = (id) => setMenu((m) => (m.id === id && m.on === pathname ? { id: null, on: null } : { id, on: pathname }));

  // Ctrl K (Cmd K on a Mac), or / when not typing somewhere, opens search.
  useEffect(() => {
    const onKey = (event) => {
      const typing = event.target.closest?.("input, textarea, select, [contenteditable='true']");
      const shortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k";
      if (!shortcut && !(event.key === "/" && !typing)) return;
      event.preventDefault();
      setMenu({ id: null, on: null });
      setSearchOn(pathname);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    // Anywhere but the open popover and its own button closes it.
    const onPointer = (event) => {
      const popover = document.getElementById(open);
      const button = root.current?.querySelector(`[aria-controls="${open}"]`);
      if (popover?.contains(event.target) || button?.contains(event.target)) return;
      setMenu({ id: null, on: null });
    };
    const onKey = (event) => {
      if (event.key !== "Escape") return;
      root.current?.querySelector(`[aria-controls="${open}"]`)?.focus();
      setMenu({ id: null, on: null });
    };
    window.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isCurrent = (href) => (href === "/dashboard" ? pathname === href : pathname.startsWith(href));
  const unread = dashboardNotifications.length;

  // The page's title and its place, for the title beside the sidebar arrow.
  const section = dashboardPages.find((page) => page.href === pathname);
  const trail =
    pathname === "/dashboard"
      ? { title: `Hello, ${dashboardUser.first}`, current: "Overview" }
      : section && { title: section.label, current: section.label };

  return (
    <div className="sticky top-0 z-40 bg-canvas/85 px-3 pt-3 pb-4 backdrop-blur-md sm:px-4">
      <header ref={root} className="flex h-16 items-center gap-2 sm:gap-3 lg:grid lg:grid-cols-[1fr_auto_1fr]">
        <button
          type="button"
          onClick={onMenu}
          aria-label="Open menu"
          aria-controls="dashboard-sidebar"
          className={cn(ROUND, "lg:hidden")}
        >
          <MenuIcon className="size-5" />
        </button>

        {/* The logo, and from lg up the arrow that opens and closes the sidebar. */}
        <div className="flex min-w-0 shrink-0 items-center gap-5 justify-self-start lg:col-start-1">
          <Link
            href="/"
            aria-label="StripCard home"
            className={cn(
              "flex shrink-0 items-center gap-3 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
              // Large screens: a box as wide as the sidebar, rail or full, that
              // grows and shrinks with it (clipping what spills over), with the
              // mark and the wordmark both centred in it, crossfading.
              "lg:relative lg:justify-center lg:overflow-hidden lg:transition-[width] lg:duration-[450ms] lg:ease-in-out",
              rail ? "lg:w-20" : "lg:w-64",
              !animate && "transition-none! [&_*]:transition-none!",
            )}
          >
            {/* The mark on phones and over the rail; the wordmark, one per theme, otherwise. */}
            <span
              className={cn(
                "grid size-12 shrink-0 place-items-center rounded-full bg-brand-50 sm:hidden lg:grid lg:transition-opacity lg:duration-300 dark:bg-brand/15",
                rail ? "lg:opacity-100" : "lg:opacity-0",
              )}
            >
              <Image src={mark} alt="" sizes="32px" className="size-7" />
            </span>
            <span
              className={cn(
                "hidden shrink-0 sm:inline-flex lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:transition-opacity lg:duration-300",
                rail ? "lg:opacity-0" : "lg:opacity-100",
              )}
            >
              <Image src={logoDark} alt="" sizes="160px" className="h-8 w-auto dark:hidden" />
              <Image src={logoLight} alt="" sizes="160px" className="hidden h-8 w-auto dark:block" />
            </span>
          </Link>
          <div className="hidden min-w-0 items-center gap-3 lg:flex">
            <button
              type="button"
              onClick={onToggleSidebar}
              aria-label={rail ? "Expand sidebar" : "Collapse sidebar"}
              aria-controls="dashboard-sidebar"
              aria-expanded={!rail}
              className={cn(ROUND, "hidden lg:grid")}
            >
              {/* Points the way the sidebar will go; turns as it does. */}
              <LongArrowRightIcon
                className={cn(
                  "size-6 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  !rail && "rotate-180",
                )}
              />
            </button>
            {/* The page's title, and a breadcrumb under it. */}
            {trail && (
              <div className="min-w-0 max-w-[11.5rem]">
                <p
                  aria-hidden="true"
                  className="truncate font-heading text-2xl leading-tight font-semibold tracking-[-0.01em] text-headline"
                >
                  {trail.title}
                </p>
                <nav aria-label="Breadcrumb" className="mt-0.5">
                  <ol className="flex min-w-0 items-center gap-1 text-xs text-muted">
                    <li>
                      <Link
                        href="/dashboard"
                        className="rounded-sm transition-colors hover:text-headline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li aria-hidden="true">
                      <ChevronRightIcon className="size-3.5" />
                    </li>
                    <li className="min-w-0">
                      <span aria-current="page" className="block truncate font-medium text-content">
                        {trail.current}
                      </span>
                    </li>
                  </ol>
                </nav>
              </div>
            )}
          </div>
        </div>

        {/* The tabs, centred on the bar. */}
        <nav aria-label="Main" className={cn("hidden lg:col-start-2", rail ? "xl:block" : "min-[102rem]:block")}>
          <ul className="flex items-center gap-1 rounded-full bg-card p-1.5">
            {dashboardTabs.map((tab) => {
              const current = isCurrent(tab.href);
              return (
                <li key={tab.href}>
                  <Link
                    href={tab.href}
                    aria-current={current ? "page" : undefined}
                    className={cn(
                      "flex h-11 items-center rounded-full px-5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                      current ? "bg-brand-50 text-brand-700 dark:bg-brand/15 dark:text-brand-300" : "text-content hover:bg-canvas hover:text-headline",
                    )}
                  >
                    {tab.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:col-start-3 lg:justify-self-end xl:gap-3">
          {/* Search: opens the palette. */}
          <button
            ref={searchButton}
            type="button"
            onClick={() => (searching ? closeSearch() : openSearch())}
            aria-haspopup="dialog"
            aria-expanded={searching}
            aria-label="Search pages"
            title="Search"
            className={cn(ROUND, OPEN)}
          >
            <SearchIcon className="size-5" />
          </button>
          {searching && <SearchPalette onClose={closeSearch} />}

          <ThemeToggle className={cn(ROUND, "hidden sm:grid")} />

          {/* Notifications */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggle(ids.notes)}
              aria-expanded={open === ids.notes}
              aria-controls={ids.notes}
              aria-label={`Notifications, ${unread} new`}
              className={cn(ROUND, OPEN)}
            >
              <BellIcon className="size-5" />
              {unread > 0 && (
                <span aria-hidden="true" className="absolute top-3 right-3 size-2 rounded-full bg-brand ring-2 ring-card xl:top-4 xl:right-4" />
              )}
            </button>
            <Popover id={ids.notes} open={open === ids.notes} label="Notifications" className="w-80" wide>
              <p className="px-4 pt-3 pb-2 text-xs font-semibold tracking-[0.12em] text-muted uppercase">Notifications</p>
              <ul>
                {dashboardNotifications.map((note) => (
                  <li key={note.id} className="border-t border-line px-4 py-3">
                    <p className="flex items-baseline justify-between gap-3">
                      <span className="text-sm font-semibold text-headline">{note.title}</span>
                      <span className="shrink-0 text-xs text-subtle">{note.when}</span>
                    </p>
                    <p className="mt-1 text-sm leading-snug text-content">{note.text}</p>
                  </li>
                ))}
              </ul>
            </Popover>
          </div>

          {/* Account */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggle(ids.account)}
              aria-expanded={open === ids.account}
              aria-controls={ids.account}
              aria-label={`Account menu for ${dashboardUser.name}`}
              className="flex h-12 cursor-pointer items-center gap-3 rounded-full bg-card p-1 transition-colors hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand aria-expanded:bg-brand-50 xl:h-14 xl:p-1.5 dark:hover:bg-brand/15 dark:aria-expanded:bg-brand/15"
            >
              {/* Name and email where there is room; the photo always. */}
              <span className="hidden pl-3 text-left leading-tight min-[88rem]:block">
                <span className="block max-w-[8.5rem] truncate text-sm font-semibold text-headline">
                  {dashboardUser.name}
                </span>
                <span className="mt-0.5 block max-w-[8.5rem] truncate text-xs text-muted">{dashboardUser.email}</span>
              </span>
              <Image
                src={dashboardUser.avatar}
                alt=""
                sizes="44px"
                className="size-10 rounded-full object-cover object-top xl:size-11"
              />
            </button>
            <Popover id={ids.account} open={open === ids.account} label="Account" className="w-56">
              <p className="px-4 pt-3 pb-3">
                <span className="block text-sm font-semibold text-headline">{dashboardUser.name}</span>
                <span className="block truncate text-xs text-muted">{dashboardUser.email}</span>
              </p>
              <ul className="border-t border-line p-1.5">
                <li>
                  <Link href="/dashboard/profile" className={ITEM}>
                    <UserIcon className="size-4" />
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link href="/login" className={cn(ITEM, "text-danger hover:bg-danger/10 hover:text-danger")}>
                    <LogOutIcon className="size-4" />
                    Log out
                  </Link>
                </li>
              </ul>
            </Popover>
          </div>
        </div>
      </header>
    </div>
  );
}

/**
 * A panel that drops from its button, right-aligned. `wide` panels span the
 * screen on a phone, where right-aligning them would push them off the left
 * edge.
 */
function Popover({ id, open, label, wide, className, children }) {
  return (
    <div
      id={id}
      role="region"
      aria-label={label}
      hidden={!open}
      className={cn(
        "absolute top-[calc(100%+0.75rem)] right-0 z-50 overflow-hidden rounded-2xl border border-line bg-card shadow-lift",
        className,
        wide && "max-sm:fixed max-sm:inset-x-4 max-sm:top-24 max-sm:w-auto",
      )}
    >
      {children}
    </div>
  );
}
