"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Marks its subtree with `data-visible` the first time it scrolls into view.
 *
 * It carries no styling of its own — CSS decides what to do with the flag, so
 * one observer can drive a whole group of staggered children (see the `.step`
 * block in styles/components.css). The observer disconnects after firing:
 * these are entrance animations, not scroll-linked ones.
 *
 * If the block is already on screen at mount, `IntersectionObserver` fires
 * immediately, so above-the-fold use is safe.
 */
export function Reveal({ as: Tag = "div", className, children }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      // Waits until a little of the block is genuinely in the viewport, so the
      // animation is not already over by the time it is looked at.
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag ref={ref} data-visible={visible || undefined} className={cn(className)}>
      {children}
    </Tag>
  );
}
