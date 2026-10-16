"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(min-width: 1024px)";

function subscribe(onChange) {
  const query = window.matchMedia(QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/**
 * True at Tailwind's `lg` breakpoint and up. Read through
 * `useSyncExternalStore`, like usePrefersReducedMotion; the server snapshot
 * assumes a large screen, the layout the static HTML is drawn for.
 */
export function useDesktop() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => true,
  );
}
