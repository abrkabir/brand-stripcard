import { CheckIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

/**
 * Where a flow is: each step as a numbered dot, done ones ticked (and a way
 * back to them, through `onGo`), the open one lit, joined by a line that
 * fills as you go. In a narrow card only the open step keeps its name.
 *
 *   steps  [{ id, label }], in order
 *   at     the open step's index
 */
export function Stepper({ steps, at, onGo }) {
  const last = steps.length - 1;
  return (
    <ol className="flex items-center gap-2">
      {steps.map((step, i) => {
        const done = i < at;
        const current = i === at;
        const dot = (
          <>
            <span
              aria-hidden="true"
              className={cn(
                "grid size-7 shrink-0 place-items-center rounded-full text-xs font-semibold tabular-nums transition-[background-color,color,box-shadow] duration-300",
                done
                  ? "bg-brand-50 text-brand-700 dark:bg-brand/15 dark:text-brand-300"
                  : current
                    ? "bg-brand text-white shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-brand)_16%,transparent)]"
                    : "bg-canvas text-muted",
              )}
            >
              {done ? (
                <CheckIcon className="size-3.5" strokeWidth={2.6} />
              ) : (
                i + 1
              )}
            </span>
            <span
              className={cn(
                "text-sm font-medium whitespace-nowrap",
                current ? "text-headline" : "text-muted",
                !current && "sr-only @min-[38rem]:not-sr-only",
              )}
            >
              {step.label}
              {done && <span className="sr-only">, done</span>}
            </span>
          </>
        );

        return (
          <li
            key={step.id}
            aria-current={current ? "step" : undefined}
            className={cn("flex items-center gap-2", i < last && "flex-1")}
          >
            {done && onGo ? (
              <button
                type="button"
                onClick={() => onGo(i)}
                className="-m-1 flex cursor-pointer items-center gap-2 rounded-full p-1 transition-colors hover:text-headline focus-visible:outline-2 focus-visible:outline-brand"
              >
                {dot}
              </button>
            ) : (
              dot
            )}
            {i < last && (
              <span
                aria-hidden="true"
                className="relative h-0.5 min-w-3 flex-1 overflow-hidden rounded-full bg-line"
              >
                <span
                  className={cn(
                    "absolute inset-0 origin-left bg-brand transition-transform duration-500 ease-out",
                    done ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
