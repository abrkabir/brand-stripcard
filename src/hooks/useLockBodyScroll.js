"use client";

import { useEffect } from "react";

/* How many overlays hold the page still, and the body's own styles from
   before the first, put back when the last lets go. Counted, so overlays can
   open over one another (a dialog over the drawer) and close in any order. */
let holds = 0;
let before = null;

/**
 * Freezes page scroll while an overlay (mobile nav, modal, search) is open,
 * without the page jumping. Hiding the overflow takes the window's scrollbar
 * away, which would widen the page by its width and shift everything
 * sideways, then back on close; the body is padded by that width instead, so
 * nothing moves. An overlay drawn over the whole window covers that strip
 * too, so it dims with the rest. Locks while `locked` is true (or always,
 * left out).
 */
export function useLockBodyScroll(locked = true) {
  useEffect(() => {
    if (!locked) return;

    const { body, documentElement } = document;
    if (holds === 0) {
      before = { overflow: body.style.overflow, paddingRight: body.style.paddingRight };
      const scrollbar = window.innerWidth - documentElement.clientWidth;
      const padding = Number.parseFloat(getComputedStyle(body).paddingRight) || 0;
      body.style.overflow = "hidden";
      if (scrollbar > 0) body.style.paddingRight = `${padding + scrollbar}px`;
    }
    holds += 1;

    return () => {
      holds -= 1;
      if (holds === 0) Object.assign(body.style, before);
    };
  }, [locked]);
}
