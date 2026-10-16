"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardTopBar } from "@/components/dashboard/DashboardTopBar";

const STORAGE_KEY = "stripcard-sidebar";
const CHANGE = "stripcard-sidebar-change";

/* Whether the sidebar is the narrow rail, remembered in this browser. It
   starts as the rail; the arrow by the logo opens it out, and that choice sticks.
   Read through `useSyncExternalStore`, so the first render matches the static
   HTML and a choice made in another tab follows here too. If storage is
   blocked it simply stays the rail. */
function readRail() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== "full";
  } catch {
    return true;
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

/**
 * The frame every dashboard page sits in: a light canvas filling the window,
 * the top bar across it (see DashboardTopBar), and below that the sidebar as
 * a floating card beside the page, whose own cards float on the canvas.
 *
 * On large screens the sidebar is part of the layout and switches between an
 * icon rail and the full list. Below that it is a drawer, opened from the top
 * bar's menu button; it closes on Escape, on the backdrop, or on going to
 * another page, and focus moves into it and back.
 */
export function DashboardShell({ children }) {
  const pathname = usePathname();
  const collapsed = useSyncExternalStore(subscribeRail, readRail, () => true);
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
    <div className="flex min-h-dvh flex-1 flex-col bg-canvas">
      <DashboardTopBar onMenu={openMenu} rail={collapsed} onToggleSidebar={toggleCollapsed} />

      {/* The backdrop behind the drawer. */}
      <div
        aria-hidden="true"
        onClick={closeMenu}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${
          drawer ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div className="flex flex-1 gap-4 px-3 pb-4 sm:px-4 lg:gap-5">
        <DashboardSidebar
          collapsed={collapsed}
          drawer={drawer}
          onCloseDrawer={closeMenu}
        />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
