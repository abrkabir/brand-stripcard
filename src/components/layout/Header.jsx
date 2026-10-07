"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDownIcon, MenuIcon } from "@/components/icons";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Logo } from "@/components/layout/Logo";
import { MegaMenu } from "@/components/layout/MegaMenu";
import { MobileNav } from "@/components/layout/MobileNav";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { heroRoutes, mainNav } from "@/data/navigation";
import { useScrolled } from "@/hooks/useScrolled";
import { cn } from "@/lib/cn";

/** Grace period so the pointer can cross the gap between trigger and panel. */
const CLOSE_DELAY = 140;

/**
 * Fixed header, in two states.
 *
 * **Transparent** — over the homepage banner, before any scroll, with no panel
 * open. The hero runs edge to edge behind it, so everything is forced white
 * regardless of theme: it is sitting on photography, not on the page.
 *
 * **Solid** — the moment the page scrolls, a panel opens, or the route is
 * anything but `/`. Here it is painted from semantic tokens, so it is white
 * with dark type in the light theme and near-black with light type in the
 * dark one, matching the mega panel below it.
 *
 * Only colour changes between the two; nothing moves.
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

  // Transparent wherever the page opens with a full-bleed hero — not just on
  // the homepage. The list lives in data/navigation.js beside the nav itself.
  const overHero = heroRoutes.includes(pathname);
  const transparent = overHero && !scrolled && !openMenu;

  /** White override for the controls while the bar sits on photography. */
  const onPhoto = transparent ? "text-white/75 hover:text-white" : undefined;

  const navTone = (on) =>
    transparent
      ? on
        ? "text-white"
        : "text-white/75 hover:text-white"
      : on
        ? "text-headline"
        : "text-muted hover:text-headline";

  const isActive = (href) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500",
          // `on-dark` only while the bar sits on the banner. It is what turns
          // the outline button white — the same mechanism the hero and the
          // footer use — so the button itself needs no transparent-state
          // colours of its own.
          transparent
            ? "on-dark border-transparent bg-transparent"
            : "bg-elevated",
          // The rule would cut across the seam between bar and panel, so it is
          // only drawn when nothing is open.
          !transparent && openMenu ? "border-transparent" : "",
          !transparent && !openMenu ? "border-line" : "",
        )}
      >
        <Container className="flex h-[var(--header-h)] items-center justify-between gap-6 lg:h-[var(--header-h-lg)]">
          <Logo tone={transparent ? "inverse" : "default"} className="shrink-0" />

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-5 xl:gap-7">
              {mainNav.map((item) => {
                const active = isActive(item.href);
                const open = openMenu === item.label;

                return (
                  <li
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => {
                      cancelClose();
                      if (item.panel) setOpenMenu(item.label);
                      else setOpenMenu(null);
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
                          "flex items-center gap-1.5 py-2 text-[13px] font-semibold tracking-[0.1em] whitespace-nowrap uppercase transition-colors",
                          navTone(active || open),
                        )}
                      >
                        {item.label}
                        <ChevronDownIcon
                          className={cn(
                            "size-3.5 transition-transform duration-300",
                            open && "-rotate-180",
                          )}
                        />
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className={cn(
                          "block py-2 text-[13px] font-semibold tracking-[0.1em] whitespace-nowrap uppercase transition-colors",
                          navTone(active),
                        )}
                      >
                        {item.label}
                      </Link>
                    )}

                    {/* Underline marker, drawn from the centre out. */}
                    <span
                      className={cn(
                        "pointer-events-none absolute -bottom-1 left-0 h-px transition-all duration-300",
                        transparent ? "bg-white" : "bg-brand",
                        active || open ? "w-full opacity-100" : "w-0 opacity-0",
                      )}
                    />
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-4">
            <ThemeToggle className={onPhoto} />

            <LanguageSwitcher triggerClassName={onPhoto} />

            {/* Auth pair. `Register` appears from lg, `Log in` only at xl —
                between those widths the nav and the rail would collide. Both
                are always reachable from the drawer. */}
            <span
              aria-hidden="true"
              className={cn(
                "hidden h-4 w-px lg:block",
                transparent ? "bg-white/25" : "bg-line",
              )}
            />

            <Link
              href="/login"
              className={cn(
                "hidden whitespace-nowrap text-[12px] font-semibold tracking-[0.12em] uppercase transition-colors xl:block",
                transparent
                  ? "text-white/75 hover:text-white"
                  : "text-muted hover:text-headline",
              )}
            >
              Log in
            </Link>

            <Button
              href="/register"
              variant="outline"
              size="sm"
              arrow={false}
              className="hidden whitespace-nowrap tracking-[0.12em] uppercase lg:inline-flex"
            >
              Register
            </Button>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              className={cn(
                "transition-colors lg:hidden",
                transparent
                  ? "text-white/85 hover:text-white"
                  : "text-content hover:text-headline",
              )}
            >
              <MenuIcon className="size-6" />
            </button>
          </div>
        </Container>

        {/* Panel layer. Sits outside the <nav> so every panel opens to the same
            full-bleed frame and continues the header's black seamlessly. Zero
            height of its own — the panels inside are absolutely positioned. */}
        <div
          className="pointer-events-none absolute inset-x-0 top-full hidden lg:block"
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
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
