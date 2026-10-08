"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDownIcon, CloseIcon, MenuIcon } from "@/components/icons";
import { Logo } from "@/components/layout/Logo";
import { MegaMenu } from "@/components/layout/MegaMenu";
import { MobileNav } from "@/components/layout/MobileNav";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { headerCta, heroRoutes, mainNav } from "@/data/navigation";
import { useScrolled } from "@/hooks/useScrolled";
import { cn } from "@/lib/cn";

/** Grace period so the pointer can cross the gap between trigger and panel. */
const CLOSE_DELAY = 140;

/**
 * Fixed header with one surface that grows.
 *
 * **Compact** — over the banner (see `heroRoutes`), before any scroll, with no
 * panel open. The white surface sits only behind the nav links; the button
 * and the logo (in its white artwork) stand on the banner by themselves.
 *
 * **Full** — once the page scrolls, a panel opens, or the route has no banner.
 * The nav's surface widens from the centre out to both edges and becomes the
 * whole bar. Nothing else moves: the logo and button stay put, the surface
 * slides in underneath them and the logo crossfades to the theme artwork.
 *
 * The surface is a single layer animating its width, so the grow reads as one
 * continuous object. Its compact width is the nav's measured width; below lg
 * there is no nav, so it is zero and the surface fades in as it grows. The
 * transition is only switched on a frame after the first measurement, so the
 * page never animates on load.
 *
 * The outer <header> is click-through: only the controls and the full bar
 * take pointer events, so empty space beside the compact pills never blocks
 * the banner.
 */
export function Header() {
  const pathname = usePathname();
  const scrolled = useScrolled(8);

  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const [navWidth, setNavWidth] = useState(0);
  const [ready, setReady] = useState(false);
  const closeTimer = useRef(null);
  const headerRef = useRef(null);
  const navRef = useRef(null);

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

  // A tap anywhere outside the header closes the mobile menu.
  useEffect(() => {
    if (!mobileOpen) return;
    const onPointerDown = (event) => {
      if (!headerRef.current?.contains(event.target)) setMobileOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [mobileOpen]);

  // The compact surface hugs the nav, so it needs the nav's real width. It is
  // 0 below lg, where the nav is hidden — the surface then has nothing to sit
  // behind and simply fades out.
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const measure = () => setNavWidth(nav.offsetWidth);
    const observer = new ResizeObserver(measure);
    observer.observe(nav);

    let frame = requestAnimationFrame(() => {
      measure();
      frame = requestAnimationFrame(() => setReady(true));
    });

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  const compact = heroRoutes.includes(pathname) && !scrolled && !openMenu && !mobileOpen;

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
        {/* Sits lower while compact, clear of the banner's rounded top edge,
            and rises to its bar position as the surface grows. */}
        <Container
          className={cn(
            "relative transition-[translate] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
            compact && "translate-y-3 lg:translate-y-5",
          )}
        >
          <div className="relative flex h-12 items-center justify-between gap-4 pr-1.5 pl-5 lg:h-13 lg:pr-[7px] lg:pl-7">
            {/* The surface. Centred; compact it hugs the links — their width
                and a slimmer height — and on scroll it grows out to the full
                bar in both directions at once. */}
            <span
              aria-hidden="true"
              style={{ width: compact ? navWidth : "100%" }}
              className={cn(
                "absolute left-1/2 -translate-x-1/2 rounded-full border border-line bg-elevated",
                compact ? "inset-y-1.5" : "inset-y-0",
                ready &&
                  "transition-[width,top,bottom,opacity,box-shadow] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                compact
                  ? "shadow-soft"
                  : cn(
                      "pointer-events-auto",
                      scrolled || openMenu ? "shadow-lift" : "shadow-soft",
                    ),
                compact && navWidth === 0 && "opacity-0",
              )}
            />

            {/* A touch larger while it stands alone on the banner; it eases
                back to bar size as the surface arrives. Scaled rather than
                resized, so nothing around it reflows. */}
            <Logo
              white={compact}
              className={cn(
                "pointer-events-auto relative shrink-0 origin-left transition-[opacity,scale] duration-500",
                compact && "scale-125",
              )}
              size="h-4 lg:h-5"
            />

            {/* Centred on the bar rather than in the space left between logo
                and button, so it sits on the page's axis whatever their
                widths. */}
            <nav
              ref={navRef}
              aria-label="Main"
              className="pointer-events-auto absolute left-1/2 hidden -translate-x-1/2 px-2 lg:block"
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
                            "flex items-center gap-1 rounded-full px-4 py-1.5 text-[15px] font-medium whitespace-nowrap transition-colors",
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
                            "block rounded-full px-4 py-1.5 text-[15px] font-medium whitespace-nowrap transition-colors",
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

            {/* Stands on the banner by itself while compact; the surface
                arrives underneath it on scroll. The bar's side padding equals
                its vertical gap, so the button sits evenly inset either way. */}
            <div className="pointer-events-auto relative flex shrink-0 items-center gap-2">
              {/* Same round footprint as the menu button. White on the banner,
                  theme ink once the surface is under it, like the logo. */}
              <ThemeToggle
                className={cn(
                  "size-9 rounded-full duration-500",
                  compact
                    ? "text-white/85 hover:bg-white/15 hover:text-white"
                    : "text-content hover:bg-surface hover:text-headline",
                )}
              />

              <Button
                href={headerCta.href}
                size="sm"
                className="hidden [--btn-h:2.25rem] sm:inline-flex lg:[--btn-h:2.375rem]"
              >
                {headerCta.label}
              </Button>

              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
                className={cn(
                  "grid size-9 place-items-center rounded-full transition-colors duration-500 lg:hidden",
                  compact
                    ? "text-white hover:bg-white/15"
                    : "text-headline hover:bg-surface",
                )}
              >
                {mobileOpen ? <CloseIcon className="size-6" /> : <MenuIcon className="size-6" />}
              </button>
            </div>
          </div>

          {/* The menu below lg, dropping out of the pill. */}
          <MobileNav id="mobile-menu" open={mobileOpen} onClose={closeMobile} />

          {/* Panel layer. Hangs under the bar, inside the same container, so
              every panel opens to the same frame. Zero height of its own — the
              panels inside are absolutely positioned and carry their own top
              gap, so the pointer never crosses dead space on the way down. */}
          <div
            className="pointer-events-auto absolute inset-x-0 top-full hidden lg:block"
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

    </>
  );
}
