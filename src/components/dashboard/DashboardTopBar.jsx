"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { SectionIcon } from "@/components/dashboard/SectionIcon";
import { BellIcon, ChevronRightIcon, LogOutIcon, LongArrowRightIcon, MenuIcon, SearchIcon, UserIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { dashboardNav, dashboardNotifications, dashboardPages, dashboardTabs, dashboardUser } from "@/data/dashboard";
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

/** Everything search can jump to: the dashboard and every page under it. */
const SEARCHABLE = [dashboardNav[0].items[0], ...dashboardPages];

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
 * Search jumps between dashboard pages: type to narrow the list, Enter opens
 * the first match. Each popover opens under its button, closes on Escape, on
 * a click outside, when another opens, or on going to another page, and
 * Escape hands focus back to its button.
 *
 * It stays at the top while the page scrolls, over a frosted strip of the
 * canvas so cards slide under it cleanly.
 */
export function DashboardTopBar({ onMenu, rail, onToggleSidebar }) {
  const pathname = usePathname();
  const router = useRouter();
  // The open popover, tied to the page it was opened on, so going to another
  // page closes it without an effect.
  const [menu, setMenu] = useState({ id: null, on: null });
  const open = menu.on === pathname ? menu.id : null;
  const [query, setQuery] = useState("");
  const root = useRef(null);
  const searchInput = useRef(null);
  const ids = { search: useId(), notes: useId(), account: useId() };

  const close = () => setMenu({ id: null, on: null });
  const toggle = (id) => setMenu((m) => (m.id === id && m.on === pathname ? { id: null, on: null } : { id, on: pathname }));

  useEffect(() => {
    if (!open) return;
    const onPointer = (event) => {
      if (!root.current?.contains(event.target)) setMenu({ id: null, on: null });
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

  const q = query.trim().toLowerCase();
  const results = q
    ? SEARCHABLE.filter((page) => `${page.label} ${page.description ?? ""}`.toLowerCase().includes(q))
    : SEARCHABLE;
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
            href="/dashboard"
            aria-label="StripCard dashboard"
            className={cn(
              "flex shrink-0 items-center gap-3 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
              // Large screens: a box as wide as the sidebar, rail or full, with
              // the logo centred in it. It grows and shrinks with the sidebar,
              // clipped meanwhile so the wordmark never spills out.
              "lg:justify-center lg:overflow-hidden lg:transition-[width] lg:duration-300 lg:ease-[cubic-bezier(0.16,1,0.3,1)]",
              rail ? "lg:w-20" : "lg:w-64",
            )}
          >
            {/* The mark on phones and over the rail; the wordmark, one per theme, otherwise. */}
            <span
              className={cn(
                "grid size-12 shrink-0 place-items-center rounded-full bg-brand-50 sm:hidden dark:bg-brand/15",
                rail && "lg:grid",
              )}
            >
              <Image src={mark} alt="" sizes="32px" className="size-7" />
            </span>
            <span className={cn("hidden shrink-0 sm:inline-flex", rail && "lg:hidden")}>
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
          {/* Search */}
          <div className="relative hidden sm:block">
            <button
              type="button"
              onClick={() => {
                setQuery("");
                toggle(ids.search);
                requestAnimationFrame(() => searchInput.current?.focus());
              }}
              aria-expanded={open === ids.search}
              aria-controls={ids.search}
              aria-label="Search pages"
              className={cn(ROUND, OPEN)}
            >
              <SearchIcon className="size-5" />
            </button>
            <Popover id={ids.search} open={open === ids.search} label="Search pages" className="w-80">
              <form
                role="search"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (results[0]) {
                    close();
                    router.push(results[0].href);
                  }
                }}
                className="border-b border-line p-2"
              >
                <label htmlFor={`${ids.search}-q`} className="sr-only">
                  Search pages
                </label>
                <span className="flex items-center gap-2 rounded-xl bg-canvas px-3">
                  <SearchIcon aria-hidden="true" className="size-4 text-muted" />
                  <input
                    ref={searchInput}
                    id={`${ids.search}-q`}
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search pages"
                    autoComplete="off"
                    className="h-10 w-full bg-transparent text-sm text-headline outline-none placeholder:text-subtle"
                  />
                </span>
              </form>
              <ul className="max-h-80 overflow-y-auto p-1.5">
                {results.map((page) => (
                  <li key={page.href}>
                    <Link href={page.href} className={ITEM}>
                      <SectionIcon name={page.icon} className="size-4 shrink-0" />
                      {page.label}
                    </Link>
                  </li>
                ))}
                {results.length === 0 && <li className="px-3 py-6 text-center text-sm text-muted">No pages match.</li>}
              </ul>
            </Popover>
          </div>

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
