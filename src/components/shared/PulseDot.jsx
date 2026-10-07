import { cn } from "@/lib/cn";

/**
 * A brand dot with two rings rippling out of it, half a cycle apart, so the
 * pulse never stops. Marks something as live — an eyebrow, a status line.
 * Decorative. With reduced motion the global stylesheet runs each ring once,
 * instantly, and it ends invisible — a still dot.
 */
export function PulseDot({ className }) {
  return (
    <span
      aria-hidden="true"
      className={cn("relative grid size-2.5 shrink-0 place-items-center", className)}
    >
      <span className="animate-ripple absolute inset-0 rounded-full bg-brand" />
      <span className="animate-ripple absolute inset-0 rounded-full bg-brand [animation-delay:1.2s]" />
      <span className="relative size-2.5 rounded-full bg-brand" />
    </span>
  );
}
