"use client";

import { useEffect } from "react";

/** How long after the last scroll event the page counts as still again. */
const IDLE_MS = 160;

/**
 * Keeps scrolling smooth by resting decorative loops while the page moves.
 *
 * While the visitor is scrolling, `<html>` carries `data-scrolling`, which
 * pauses every CSS loop marked `data-loop` (see styles/base.css) and which
 * GSAP loops can watch too (see MorphBadge). It clears a moment after the
 * last scroll event, and everything carries on from where it stopped. Those
 * loops repaint on every frame; resting them hands each frame back to the
 * scroll itself. Renders nothing.
 */
export function ScrollCalm() {
  useEffect(() => {
    const root = document.documentElement;
    let timer = 0;

    const onScroll = () => {
      if (!timer) {
        root.dataset.scrolling = "";
        window.dispatchEvent(new Event("scrollcalm:start"));
      } else {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        timer = 0;
        delete root.dataset.scrolling;
        window.dispatchEvent(new Event("scrollcalm:end"));
      }, IDLE_MS);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
      delete root.dataset.scrolling;
    };
  }, []);

  return null;
}
