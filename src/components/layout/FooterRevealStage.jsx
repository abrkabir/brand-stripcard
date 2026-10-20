"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * The pinned stage under the footer, which marks itself `data-visible` once it
 * has really been uncovered, so what animates inside (the odometers) plays
 * where it can be seen.
 *
 * `Reveal` cannot do this: pinned to the bottom of the viewport, the stage is
 * on screen, by geometry, from the moment the footer arrives, while the footer
 * still hides it. So this watches a zero-height marker in the normal flow just
 * above the stage instead, which sits on the footer's bottom edge, and fires
 * once that edge has risen past the middle of the viewport.
 */
export function FooterRevealStage({ className, children, ...props }) {
  const marker = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = marker.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { rootMargin: "0px 0px -45% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <span ref={marker} aria-hidden="true" className="block h-0" />
      <section {...props} data-visible={visible || undefined} className={cn(className)}>
        {children}
      </section>
    </>
  );
}
