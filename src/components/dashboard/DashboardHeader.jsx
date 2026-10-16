"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { useDashboardShell } from "@/components/dashboard/DashboardShell";
import { BellIcon, ChevronDownIcon, LogOutIcon, MenuIcon, UserIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { dashboardNotifications, dashboardUser } from "@/data/dashboard";
import { cn } from "@/lib/cn";

/** The round, quiet button the header's actions share. */
const ROUND =
  "grid size-11 shrink-0 cursor-pointer place-items-center rounded-full bg-surface text-headline transition-colors hover:bg-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

/**
 * The page title (with the menu button before it on small screens, which
 * opens the sidebar drawer), then the theme switch, notifications and the
 * account menu.
 * Each menu opens under its button, closes on Escape, on a click outside or
 * when the other opens, and hands focus back to its button when it closes
 * from the keyboard.
 */
export function DashboardHeader({ title }) {
  const [open, setOpen] = useState(null);
  const root = useRef(null);
  const { openMenu } = useDashboardShell();

  useEffect(() => {
    if (!open) return;
    const onPointer = (event) => {
      if (!root.current?.contains(event.target)) setOpen(null);
    };
    const onKey = (event) => {
      if (event.key !== "Escape") return;
      root.current?.querySelector(`[aria-controls="${open}"]`)?.focus();
      setOpen(null);
    };
    window.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const ids = { notes: useId(), account: useId() };
  const toggle = (id) => setOpen((o) => (o === id ? null : id));
  const unread = dashboardNotifications.length;

  return (
    <header className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={openMenu}
          aria-label="Open menu"
          aria-controls="dashboard-sidebar"
          className={cn(ROUND, "lg:hidden")}
        >
          <MenuIcon className="size-5" />
        </button>
        <h1 className="truncate font-heading text-[1.75rem] leading-none font-semibold tracking-[-0.02em] text-headline sm:text-[2rem] lg:text-[2.5rem]">
          {title}
        </h1>
      </div>

      <div ref={root} className="flex items-center gap-2 sm:gap-3">
        <ThemeToggle className={cn(ROUND, "text-headline")} />

        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggle(ids.notes)}
            aria-expanded={open === ids.notes}
            aria-controls={ids.notes}
            aria-label={`Notifications, ${unread} new`}
            className={ROUND}
          >
            <BellIcon className="size-5" />
            {unread > 0 && (
              <span aria-hidden="true" className="absolute top-2.5 right-3 size-2 rounded-full bg-brand ring-2 ring-surface" />
            )}
          </button>
          <Menu id={ids.notes} open={open === ids.notes} label="Notifications" className="w-80" wide>
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
          </Menu>
        </div>

        {/* Account */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggle(ids.account)}
            aria-expanded={open === ids.account}
            aria-controls={ids.account}
            aria-label={`Account menu for ${dashboardUser.name}`}
            className="flex h-11 cursor-pointer items-center gap-2 rounded-full bg-surface p-1 transition-colors hover:bg-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:pr-3"
          >
            <Image
              src={dashboardUser.avatar}
              alt=""
              sizes="36px"
              className="size-9 rounded-full object-cover object-top"
            />
            <span className="hidden text-sm font-semibold text-headline sm:block">{dashboardUser.short}</span>
            <ChevronDownIcon
              className={cn("hidden size-4 text-muted transition-transform sm:block", open === ids.account && "rotate-180")}
            />
          </button>
          <Menu id={ids.account} open={open === ids.account} label="Account" className="w-56">
            <p className="px-4 pt-3 pb-3">
              <span className="block text-sm font-semibold text-headline">{dashboardUser.name}</span>
              <span className="block text-xs text-muted">Personal account</span>
            </p>
            <ul className="border-t border-line p-1.5">
              <li>
                <Link href="/dashboard/profile" className={ITEM}>
                  <UserIcon className="size-4" />
                  My Profile
                </Link>
              </li>
              <li>
                <Link href="/login" className={ITEM}>
                  <LogOutIcon className="size-4" />
                  Log out
                </Link>
              </li>
            </ul>
          </Menu>
        </div>
      </div>
    </header>
  );
}

const ITEM =
  "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-content transition-colors hover:bg-surface hover:text-headline focus-visible:outline-2 focus-visible:outline-brand";

/**
 * A panel that drops from its button, right-aligned. `wide` panels span the
 * screen on a phone, where right-aligning them would push them off the left
 * edge.
 */
function Menu({ id, open, label, wide, className, children }) {
  return (
    <div
      id={id}
      role="region"
      aria-label={label}
      hidden={!open}
      className={cn(
        "absolute top-[calc(100%+0.5rem)] right-0 z-30 overflow-hidden rounded-2xl border border-line bg-elevated shadow-lift",
        className,
        wide && "max-sm:fixed max-sm:inset-x-4 max-sm:top-24 max-sm:w-auto",
      )}
    >
      {children}
    </div>
  );
}
