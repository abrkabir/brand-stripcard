import { cn } from "@/lib/cn";

/**
 * A phrase framed like a swipe control: an outlined brand pill holding a
 * solid capsule that keeps stretching from a round knob into a long pill and
 * back, carrying the words along with it. Everything is sized in `em`, so it
 * scales with the text around it — a big title or a small caption.
 *
 * The capsule starts once the surrounding `Reveal` sets `data-visible`, rests
 * while the page is scrolling (`data-loop`, see ScrollCalm), and stays a
 * still knob for visitors who ask for less motion.
 */
export function SwipePill({ className, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-[0.28em] rounded-full border-2 border-brand py-[0.08em] pr-[0.42em] pl-[0.1em] align-middle leading-none whitespace-nowrap",
        className,
      )}
    >
      <span
        data-loop
        aria-hidden="true"
        className="h-[0.82em] w-[0.82em] shrink-0 rounded-full bg-brand in-data-visible:animate-pill-swipe"
      />
      {children}
    </span>
  );
}
