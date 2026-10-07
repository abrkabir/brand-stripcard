"use client";

import { useEffect, useState } from "react";

/**
 * True once the window has scrolled past `offset`.
 * Used by the header to swap from transparent to a frosted, bordered bar.
 */
export function useScrolled(offset = 12) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > offset);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [offset]);

  return scrolled;
}
