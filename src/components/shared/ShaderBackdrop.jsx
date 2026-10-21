"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

/**
 * Client-only mount point for the WebGPU canvas.
 *
 * The shader needs a browser: WebGPU has no server equivalent, so the module
 * must never be evaluated during the render on the server. `ssr: false` is what
 * guarantees that — and it is only legal from a Client Component, which is the
 * whole reason this thin wrapper exists between a Server Component and the
 * canvas itself.
 *
 * Shared, so it carries no assumption about where it sits: drop it into any
 * positioned box and it fills it.
 *
 * No loading state on purpose. There is nothing to wait for visually — the ink
 * behind it already fills the box, so the canvas fades in over a finished
 * surface rather than a hole.
 */
const ShaderCanvas = dynamic(() => import("@/components/shared/ShaderCanvas"), {
  ssr: false,
});

/**
 * The canvas is started late, on purpose. Starting it compiles the shader's
 * GPU pipelines, which holds the browser's GPU thread for most of a second,
 * and every frame of the page is drawn on that same thread: started with the
 * page, it froze any scroll that began soon after loading. So it waits until
 * its box is within a screen of the viewport, then for the page to have been
 * still for a moment (`data-scrolling`, see ScrollCalm) and the browser to be
 * idle, and does the work then, while nothing is moving. Any scroll in the
 * meantime puts it back to waiting.
 */
const STILL_MS = 600;

export function ShaderBackdrop() {
  const box = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;

    const root = document.documentElement;
    const scrolling = () => root.hasAttribute("data-scrolling");
    const idle = window.requestIdleCallback ?? ((cb) => setTimeout(cb, 1));
    const cancelIdle = window.cancelIdleCallback ?? clearTimeout;
    let near = false;
    let timer = 0;
    let pending = 0;

    const disarm = () => {
      clearTimeout(timer);
      timer = 0;
      if (pending) cancelIdle(pending);
      pending = 0;
    };
    const arm = () => {
      disarm();
      if (!near || scrolling()) return;
      timer = setTimeout(() => {
        timer = 0;
        pending = idle(
          () => {
            pending = 0;
            if (near && !scrolling()) setStarted(true);
            else arm();
          },
          { timeout: 1000 },
        );
      }, STILL_MS);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        near = entry.isIntersecting;
        if (near) arm();
        else disarm();
      },
      { rootMargin: "100% 0px" },
    );
    observer.observe(el);
    window.addEventListener("scrollcalm:start", disarm);
    window.addEventListener("scrollcalm:end", arm);

    return () => {
      observer.disconnect();
      window.removeEventListener("scrollcalm:start", disarm);
      window.removeEventListener("scrollcalm:end", arm);
      disarm();
    };
  }, []);

  return (
    <div ref={box} className="absolute inset-0">
      {started && <ShaderCanvas />}
    </div>
  );
}
