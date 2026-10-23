"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MoreVerticalIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

/** A menu item's height and the menu's padding, for placing it before it is drawn. */
const ITEM_H = 40;
const PAD = 12;
const WIDTH = 208;

/**
 * A three-dot button that opens a menu of actions, for a row of a table or a
 * card. The menu is drawn over the page (in <body>), so a box that clips its
 * content (a table's) cannot cut it off; it opens under the button, or above
 * it when there is no room below.
 *
 * Works as a menu: it opens on a click (or Enter, Space or Arrow Down) with
 * focus on its first item; the arrow keys, Home and End move through it;
 * Escape or Tab closes it; so does a click anywhere else, or the page
 * scrolling. Choosing an item closes it and hands focus back to the button
 * before the item acts, so a dialog it opens returns focus there.
 *
 *   label  the button's name ("Actions for Netflix")
 *   items  [{ label, icon, onSelect }] or [{ label, icon, href }]; `danger`
 *          sets one in red
 */
export function ActionMenu({ label, items, className }) {
  const id = useId();
  const button = useRef(null);
  const menu = useRef(null);
  const [place, setPlace] = useState(null);
  const open = place !== null;

  const show = () => {
    const box = button.current.getBoundingClientRect();
    const height = items.length * ITEM_H + PAD;
    const below = box.bottom + 6 + height <= window.innerHeight - 8;
    setPlace({
      top: below ? box.bottom + 6 : Math.max(8, box.top - 6 - height),
      left: Math.max(
        8,
        Math.min(box.right - WIDTH, window.innerWidth - WIDTH - 8),
      ),
    });
  };
  const hide = (refocus = true) => {
    setPlace(null);
    if (refocus) button.current?.focus();
  };

  // While open: focus its first item; a click elsewhere, a scroll or a
  // resize closes it.
  useEffect(() => {
    if (!open) return;
    menu.current?.querySelector("[role=menuitem]")?.focus();
    const onPointer = (event) => {
      if (
        menu.current?.contains(event.target) ||
        button.current?.contains(event.target)
      )
        return;
      setPlace(null);
    };
    const onMove = () => setPlace(null);
    window.addEventListener("pointerdown", onPointer);
    window.addEventListener("scroll", onMove, true);
    window.addEventListener("resize", onMove);
    return () => {
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("scroll", onMove, true);
      window.removeEventListener("resize", onMove);
    };
  }, [open]);

  const onMenuKey = (event) => {
    const entries = [...menu.current.querySelectorAll("[role=menuitem]")];
    const at = entries.indexOf(document.activeElement);
    const last = entries.length - 1;
    const moves = {
      ArrowDown: at === last ? 0 : at + 1,
      ArrowUp: at <= 0 ? last : at - 1,
      Home: 0,
      End: last,
    };
    if (event.key in moves) {
      event.preventDefault();
      entries[moves[event.key]]?.focus();
    } else if (event.key === "Escape") {
      event.preventDefault();
      hide();
    } else if (event.key === "Tab") {
      hide(false);
    }
  };

  const choose = (item) => {
    hide();
    item.onSelect?.();
  };

  const look = (item) =>
    cn(
      "flex h-10 w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 text-left text-sm font-medium transition-colors outline-none focus-visible:bg-canvas",
      item.danger
        ? "text-danger hover:bg-danger/10 focus-visible:bg-danger/10"
        : "text-content hover:bg-canvas hover:text-headline",
    );

  return (
    <>
      <button
        ref={button}
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? `${id}-menu` : undefined}
        onClick={() => (open ? hide() : show())}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" && !open) {
            event.preventDefault();
            show();
          }
        }}
        className={cn(
          "grid size-9 shrink-0 cursor-pointer place-items-center rounded-full text-muted transition-colors hover:bg-canvas hover:text-headline focus-visible:outline-2 focus-visible:outline-brand aria-expanded:bg-canvas aria-expanded:text-headline",
          className,
        )}
      >
        <MoreVerticalIcon className="size-[18px]" />
      </button>

      {open &&
        createPortal(
          <div
            ref={menu}
            id={`${id}-menu`}
            role="menu"
            aria-label={label}
            onKeyDown={onMenuKey}
            style={{ top: place.top, left: place.left, width: WIDTH }}
            className="fixed z-[80] rounded-2xl border border-line bg-card p-1.5 shadow-lift motion-safe:animate-pop-in"
          >
            {items.map((item) => {
              const Icon = item.icon;
              const inner = (
                <>
                  {Icon && (
                    <Icon aria-hidden="true" className="size-4 shrink-0" />
                  )}
                  {item.label}
                </>
              );
              return item.href ? (
                <Link
                  key={item.label}
                  href={item.href}
                  role="menuitem"
                  tabIndex={-1}
                  onClick={() => hide(false)}
                  className={look(item)}
                >
                  {inner}
                </Link>
              ) : (
                <button
                  key={item.label}
                  type="button"
                  role="menuitem"
                  tabIndex={-1}
                  onClick={() => choose(item)}
                  className={look(item)}
                >
                  {inner}
                </button>
              );
            })}
          </div>,
          document.body,
        )}
    </>
  );
}
