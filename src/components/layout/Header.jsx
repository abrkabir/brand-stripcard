"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDownIcon, MenuIcon } from "@/components/icons";
import { Logo } from "@/components/layout/Logo";
import { MegaMenu } from "@/components/layout/MegaMenu";
import { MobileNav } from "@/components/layout/MobileNav";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { headerCta, mainNav } from "@/data/navigation";
import { useScrolled } from "@/hooks/useScrolled";
import { cn } from "@/lib/cn";

/** Grace period so the pointer can cross the gap between trigger and panel. */
const CLOSE_DELAY = 140;

/**
 * Fixed header: a floating pill.
 *
 * The bar is one rounded surface inset from the viewport edge, so it reads the
 * same over the homepage banner, over a photograph, or over a plain page — no
 * transparent state, no colour swap on scroll. It is painted from semantic
 * tokens, so it is white with dark type in the light theme and black with
 * light type in the dark one. Scrolling only deepens its shadow, so the pill
 * separates from whatever passes underneath.
 *
 * The outer <header> is click-through: only the pill and the open panel take
 * pointer events, so the strip either side of the pill never blocks the page.
 */
export function Header() {
  const pathname = usePathname();
  const scrolled = useScrolled(8);

  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef(null);
  const headerRef = useRef(null);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenMenu(null), CLOSE_DELAY);
  }, [cancelClose]);

  // Any navigation dismisses whatever is open. Adjusting during render — the
  // documented alternative to an effect — means the menu is already gone in
  // the first paint of the new route instead of blinking for one frame.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpenMenu(null);
    setMobileOpen(false);
  }

  // Escape and outside-clicks both close the panel. Both are needed because it
  // can be opened by keyboard as well as by pointer.
  useEffect(() => {
    if (!openMenu) return;

    const onKey = (event) => {
      if (event.key === "Escape") setOpenMenu(null);
    };
    const onPointerDown = (event) => {
      if (!headerRef.current?.contains(event.target)) setOpenMenu(null);
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [openMenu]);

  useEffect(() => cancelClose, [cancelClose]);

  const isActive = (href) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(href + "/");

  // No active-page styling by design: every link reads the same, and hover
  // only darkens the text. `aria-current` still marks the page for assistive
  // tech. An open dropdown trigger holds the hover colour.
  const navTone = (open) =>
    open ? "text-headline" : "text-content hover:text-headline";

  return (
    <>
      <header
        ref={headerRef}
        className="pointer-events-none fixed inset-x-0 top-0 z-50 pt-3 sm:pt-4 lg:pt-6"
      >
        <Container className="relative">
          <div
            className={cn(
              "pointer-events-auto relative flex h-14 items-center justify-between gap-4 rounded-full border border-line bg-elevated pr-2 pl-5 transition-shadow duration-500 lg:h-15 lg:pl-7",
              scrolled || openMenu ? "shadow-lift" : "shadow-soft",
            )}
          >
            <Logo className="shrink-0" size="h-4 lg:h-5" />

            {/* Centred on the pill rather than in the space left between logo
                and button, so it sits on the page's axis whatever their
                widths. */}
            <nav
              aria-label="Main"
              className="absolute left-1/2 hidden -translate-x-1/2 lg:block"
            >
              <ul className="flex items-center gap-1 xl:gap-2">
                {mainNav.map((item) => {
                  const active = isActive(item.href);
                  const open = openMenu === item.label;

                  return (
                    <li
                      key={item.label}
                      onMouseEnter={() => {
                        cancelClose();
                        setOpenMenu(item.panel ? item.label : null);
                      }}
                      onMouseLeave={item.panel ? scheduleClose : undefined}
                    >
                      {item.panel ? (
                        <button
                          type="button"
                          aria-expanded={open}
                          aria-haspopup="true"
                          aria-controls={`panel-${item.label.toLowerCase()}`}
                          onClick={() => setOpenMenu(open ? null : item.label)}
                          className={cn(
                            "flex items-center gap-1 rounded-full px-4 py-2 text-[15px] font-medium whitespace-nowrap transition-colors",
                            navTone(open),
                          )}
                        >
                          {item.label}
                          <ChevronDownIcon
                            className={cn(
                              "size-4 transition-transform duration-300",
                              open && "-rotate-180",
                            )}
                          />
                        </button>
                      ) : (
                        <Link
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "block rounded-full px-4 py-2 text-[15px] font-medium whitespace-nowrap transition-colors",
                            navTone(false),
                          )}
                        >
                          {item.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex shrink-0 items-center gap-2">
              <Button
                href={headerCta.href}
                size="sm"
                className="hidden sm:inline-flex lg:[--btn-h:2.75rem]"
              >
                {headerCta.label}
              </Button>

              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                aria-expanded={mobileOpen}
                className="grid size-10 place-items-center rounded-full text-headline transition-colors hover:bg-surface lg:hidden"
              >
                <MenuIcon className="size-6" />
              </button>
            </div>
          </div>

          {/* Panel layer. Hangs under the pill, inside the same container, so
              every panel opens to the same frame. Zero height of its own — the
              panels inside are absolutely positioned and carry their own top
              gap, so the pointer never crosses dead space on the way down. */}
          <div
            className="absolute inset-x-0 top-full hidden lg:block"
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          >
            {mainNav.map((item) =>
              item.panel ? (
                <MegaMenu
                  key={item.label}
                  id={`panel-${item.label.toLowerCase()}`}
                  items={item.panel}
                  open={openMenu === item.label}
                  onNavigate={() => setOpenMenu(null)}
                />
              ) : null,
            )}
          </div>
        </Container>
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
