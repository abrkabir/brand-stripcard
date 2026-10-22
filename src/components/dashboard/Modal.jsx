"use client";

import { useEffect, useState } from "react";
import { CloseIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

/** How long a modal takes to transition out before it closes, in milliseconds (its duration-200). */
const LEAVE_MS = 200;

/**
 * A modal dialog over a dimmed, blurred page: a native <dialog>, so focus
 * stays in it while it is open and goes back to whatever opened it after.
 * Escape, a click on the dimmed page, or `close` (handed to `children`, a
 * function) closes it.
 *
 * It rises and fades in over a fading backdrop, and sinks and fades out the
 * same way, taking LEAVE_MS before it really closes and calls `onClose` (at
 * once under reduced motion, where it simply appears and goes). Mount it only
 * while it is open: `onClose` should unmount it. The page behind stays still
 * while it is open.
 *
 *   labelledBy  the id of its title
 *   className   its width, and anything else for the panel
 */
export function Modal({ labelledBy, onClose, className, children }) {
  // The <dialog> itself, and whether it is on its way out, are kept as state
  // (not refs), so `close` can be handed to the content as it renders.
  const [dialog, setDialog] = useState(null);
  const [leaving, setLeaving] = useState(false);
  const [shown, setShown] = useState(false);

  // Open as a modal, then on the next frame let it transition in.
  useEffect(() => {
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    // The native dialog focuses its first control; a field marked
    // data-autofocus takes it instead.
    dialog.querySelector("[data-autofocus]")?.focus();
    const frame = requestAnimationFrame(() => setShown(true));
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previous;
    };
  }, [dialog]);

  // Transition out, then close for real (which unmounts it).
  const close = () => {
    if (!dialog || leaving) return;
    setLeaving(true);
    setShown(false);
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => dialog.close(), still ? 0 : LEAVE_MS);
  };

  return (
    <dialog
      ref={setDialog}
      aria-labelledby={labelledBy}
      data-shown={shown}
      onClose={onClose}
      onCancel={(event) => {
        // Escape: transition out first, as the other ways to close do.
        event.preventDefault();
        close();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
      className={cn(
        "@container m-auto max-h-[calc(100dvh-2rem)] w-[min(32rem,calc(100vw-2rem))] overflow-y-auto rounded-3xl bg-card text-content shadow-lift ring-1 ring-line backdrop:bg-hero-ink/35 backdrop:backdrop-blur-[3px]",
        // Out (and before it is in): lowered, a touch smaller, clear; going
        // out quickly, easing in.
        "translate-y-4 scale-[0.97] opacity-0 transition-[opacity,translate,scale] duration-200 ease-in backdrop:opacity-0 backdrop:transition-opacity backdrop:duration-200",
        // In: risen, full size, solid; settling in slower, easing out.
        "data-[shown=true]:translate-y-0 data-[shown=true]:scale-100 data-[shown=true]:opacity-100 data-[shown=true]:duration-300 data-[shown=true]:ease-[cubic-bezier(0.16,1,0.3,1)] data-[shown=true]:backdrop:opacity-100 data-[shown=true]:backdrop:duration-300",
        "motion-reduce:transition-none motion-reduce:backdrop:transition-none",
        className,
      )}
    >
      {children(close)}
    </dialog>
  );
}

/** A modal's head: its title (with a line under it, maybe), anything beside it, and a close button. */
export function ModalHead({ id, title, subtitle, end, onClose }) {
  return (
    <div className="flex items-start gap-3">
      <div className="min-w-0 flex-1">
        <h2
          id={id}
          className="truncate font-heading text-xl leading-tight font-semibold text-headline"
        >
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 truncate text-xs text-muted">{subtitle}</p>
        )}
      </div>
      {end}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="-mt-1 -mr-1 grid size-9 shrink-0 cursor-pointer place-items-center rounded-full text-muted transition-colors hover:bg-canvas hover:text-headline focus-visible:outline-2 focus-visible:outline-brand"
      >
        <CloseIcon className="size-5" />
      </button>
    </div>
  );
}
