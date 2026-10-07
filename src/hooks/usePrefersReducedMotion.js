"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange) {
  const query = window.matchMedia(QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/**
 * True when the visitor has asked the OS to reduce motion.
 *
 * Read through `useSyncExternalStore` rather than an effect, so there is no
 * setState-during-mount and the server snapshot (`false`) matches the HTML
 * that was sent. Callers use it to skip autoplay and the Ken Burns drift —
 * the CSS `prefers-reduced-motion` block only neutralises durations, it
 * cannot stop a JavaScript timer.
 */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
