"use client";

import dynamic from "next/dynamic";

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
 * positioned box and it fills it. The footer uses it, and so does the aside on
 * the auth pages.
 *
 * No loading state on purpose. There is nothing to wait for visually — the ink
 * behind it already fills the box, so the canvas fades in over a finished
 * surface rather than a hole.
 */
const ShaderCanvas = dynamic(() => import("@/components/shared/ShaderCanvas"), {
  ssr: false,
});

export function ShaderBackdrop() {
  return <ShaderCanvas />;
}
