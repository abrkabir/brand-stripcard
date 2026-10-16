"use client";

import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

const STORAGE_KEY = "stripcard-sidebar";
const CHANGE = "stripcard-sidebar-change";

/* The remembered sidebar width, kept in this browser. Read through
   `useSyncExternalStore`, so the first render matches the static HTML (full
   width) and a choice made in another tab follows here too. Storage can be
   blocked; then it simply stays full width. */
function readRail() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "rail";
  } catch {
    return false;
  }
}
function subscribeRail(onChange) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE, onChange);
  };
}
function writeRail(rail) {
  try {
    window.localStorage.setItem(STORAGE_KEY, rail ? "rail" : "full");
  } catch {}
  window.dispatchEvent(new Event(CHANGE));
}

const ShellContext = createContext({ openMenu: () => {} });

/** For the header's menu button: opens the sidebar drawer on small screens. */
export const useDashboardShell = () => useContext(ShellContext);

/**
 * The frame every dashboard page sits in, edge to edge: the dark sidebar on
 * the left and the page's own panel beside it, inset just enough that its
 * rounded corners read against the dark.
 *
 * On large screens the sidebar is part of the layout and can be collapsed to
 * an icon rail (the choice is remembered in this browser). Below that it is
 * a drawer, opened from the header's menu button; it closes on Escape, on the
 * backdrop, or on going to another page, and focus moves into it and back.
 */
export function DashboardShell({ children }) {
  const pathname = usePathname();
  const collapsed = useSyncExternalStore(subscribeRail, readRail, () => false);
  // The drawer is open on the page it was opened on, so going to another
  // page closes it without an effect.
  const [openOn, setOpenOn] = useState(null);
  const drawer = openOn === pathname;
  const opener = useRef(null);

  const toggleCollapsed = useCallback(() => writeRail(!readRail()), []);

  const openMenu = useCallback(
    (event) => {
      opener.current = event?.currentTarget ?? null;
      setOpenOn(pathname);
    },
    [pathname],
  );

  const closeMenu = useCallback(() => {
    setOpenOn(null);
    opener.current?.focus();
  }, []);

  // While the drawer is open: Escape closes it, and the page behind stays put.
  useEffect(() => {
    if (!drawer) return;
    const onKey = (event) => event.key === "Escape" && closeMenu();
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [drawer, closeMenu]);

  return (
    <ShellContext.Provider value={{ openMenu }}>
      <div className="flex min-h-dvh flex-1 bg-hero-ink">
        {/* The backdrop behind the drawer. */}
        <div
          aria-hidden="true"
          onClick={closeMenu}
          className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${
            drawer ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        />

        <DashboardSidebar
          collapsed={collapsed}
          onToggleCollapsed={toggleCollapsed}
          drawer={drawer}
          onCloseDrawer={closeMenu}
        />

        <div className="min-w-0 flex-1 lg:py-3 lg:pr-3">
          <main className="min-h-dvh bg-elevated px-4 py-5 sm:px-7 sm:py-7 lg:min-h-[calc(100dvh-1.5rem)] lg:rounded-[1.75rem] lg:px-9 lg:py-8 dark:lg:ring-1 dark:lg:ring-white/10">
            {children}
          </main>
        </div>
      </div>
    </ShellContext.Provider>
  );
}
