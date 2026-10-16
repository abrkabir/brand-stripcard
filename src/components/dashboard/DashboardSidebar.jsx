"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { SectionIcon } from "@/components/dashboard/SectionIcon";
import { ChevronRightIcon, CloseIcon, LogOutIcon } from "@/components/icons";
import { dashboardNav } from "@/data/dashboard";
import { useDesktop } from "@/hooks/useDesktop";
import { cn } from "@/lib/cn";
import mark from "../../../public/images/logo/favicon_brand.png";
import wordmark from "../../../public/images/logo/web_logo_white.png";

/**
 * The dashboard's sidebar, on the dark frame: the StripCard mark and
 * wordmark, the links in titled groups, and log out at the foot. The link for
 * the page you are on is lit.
 *
 * Large screens: part of the layout, with a round button on its edge that
 * collapses it to an icon rail and back. On the rail the group titles become
 * thin rules and each icon names itself in a tooltip on hover or focus.
 *
 * Smaller screens: a drawer from the left (see DashboardShell), always full
 * width, with its own close button; while shut it is inert, so focus cannot
 * wander into it.
 */
export function DashboardSidebar({ collapsed, onToggleCollapsed, drawer, onCloseDrawer }) {
  const pathname = usePathname();
  const closeButton = useRef(null);
  const desktop = useDesktop();

  // Focus moves into the drawer when it opens.
  useEffect(() => {
    if (drawer && !desktop) closeButton.current?.focus();
  }, [drawer, desktop]);

  // The rail only exists on large screens; the drawer is always full.
  const rail = collapsed && desktop;
  const isCurrent = (href) => (href === "/dashboard" ? pathname === href : pathname.startsWith(href));

  return (
    <aside
      id="dashboard-sidebar"
      aria-label="Dashboard"
      inert={!desktop && !drawer}
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-hero-ink text-white transition-[translate,width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        drawer ? "translate-x-0" : "-translate-x-full",
        "lg:sticky lg:top-0 lg:z-30 lg:h-dvh lg:translate-x-0",
        rail ? "lg:w-[5.5rem]" : "lg:w-68",
      )}
    >
      {/* ── The mark ──────────────────────────────────────────────────── */}
      <div className={cn("flex h-20 shrink-0 items-center gap-3 pt-2", rail ? "justify-center px-0" : "px-6")}>
        <Link
          href="/dashboard"
          aria-label="StripCard dashboard"
          className="flex min-w-0 items-center gap-3 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
        >
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-50">
            <Image src={mark} alt="" sizes="28px" className="size-6" />
          </span>
          {!rail && <Image src={wordmark} alt="" sizes="140px" className="h-6 w-auto" />}
        </Link>
        <button
          ref={closeButton}
          type="button"
          onClick={onCloseDrawer}
          aria-label="Close menu"
          className="ml-auto grid size-9 cursor-pointer place-items-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-brand lg:hidden"
        >
          <CloseIcon className="size-5" />
        </button>
      </div>

      {/* The collapse button, on the sidebar's edge. */}
      <button
        type="button"
        onClick={onToggleCollapsed}
        aria-label={rail ? "Expand sidebar" : "Collapse sidebar"}
        aria-controls="dashboard-sidebar"
        aria-expanded={!rail}
        className="absolute top-7 -right-3.5 z-10 hidden size-7 cursor-pointer place-items-center rounded-full bg-elevated text-headline shadow-soft ring-1 ring-line transition-colors hover:bg-brand hover:text-white hover:ring-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand lg:grid"
      >
        <ChevronRightIcon className={cn("size-4 transition-transform duration-300", !rail && "rotate-180")} />
      </button>

      {/* ── The links ─────────────────────────────────────────────────── */}
      <nav
        aria-label="Dashboard pages"
        className={cn("flex-1 pt-4 pb-4", rail ? "overflow-visible px-4" : "overflow-y-auto px-4 [scrollbar-width:thin]")}
      >
        {dashboardNav.map((group, g) => (
          <div key={group.title ?? g} className={g > 0 ? "mt-6" : undefined}>
            {group.title &&
              (rail ? (
                <h2 className="mx-auto mb-3 h-px w-8 bg-white/12">
                  <span className="sr-only">{group.title}</span>
                </h2>
              ) : (
                <h2 className="mb-2 px-3 text-[0.6875rem] font-semibold tracking-[0.14em] text-white/40 uppercase">
                  {group.title}
                </h2>
              ))}
            <ul className="space-y-1">
              {group.items.map((item) => {
                const current = isCurrent(item.href);
                return (
                  <li key={item.href} className="group relative">
                    <Link
                      href={item.href}
                      aria-current={current ? "page" : undefined}
                      className={cn(
                        "flex h-11 items-center gap-3 rounded-xl text-[0.9375rem] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-brand",
                        rail ? "justify-center" : "px-3",
                        current ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white",
                      )}
                    >
                      <SectionIcon name={item.icon} className={cn("size-5 shrink-0", current && "text-brand")} />
                      <span className={rail ? "sr-only" : "truncate"}>{item.label}</span>
                    </Link>
                    {rail && <Tooltip>{item.label}</Tooltip>}
                    {current && (
                      <span
                        aria-hidden="true"
                        className="absolute top-1/2 -left-4 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-brand"
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* ── Log out ───────────────────────────────────────────────────── */}
      <div className="shrink-0 border-t border-white/10 px-4 py-4">
        <div className="group relative">
          <Link
            href="/login"
            className={cn(
              "flex h-11 items-center gap-3 rounded-xl text-[0.9375rem] font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-2 focus-visible:outline-brand",
              rail ? "justify-center" : "px-3",
            )}
          >
            <LogOutIcon className="size-5 shrink-0" />
            <span className={rail ? "sr-only" : undefined}>Log out</span>
          </Link>
          {rail && <Tooltip>Log out</Tooltip>}
        </div>
      </div>
    </aside>
  );
}

/** The rail's label for an icon, shown beside it on hover or keyboard focus. */
function Tooltip({ children }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 left-full z-50 ml-4 -translate-x-1 -translate-y-1/2 rounded-lg bg-headline px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap text-page opacity-0 shadow-soft transition-[opacity,translate] duration-150 group-hover:translate-x-0 group-hover:opacity-100 group-has-[:focus-visible]:translate-x-0 group-has-[:focus-visible]:opacity-100"
    >
      {children}
    </span>
  );
}
