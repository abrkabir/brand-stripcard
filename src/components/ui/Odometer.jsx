import { cn } from "@/lib/cn";

/** Two full turns of the wheel, so every digit rolls through at least ten. */
const WHEEL = Array.from({ length: 20 }, (_, i) => i % 10);

/**
 * A figure whose digits roll into place like an odometer.
 *
 * Each digit is a clipped column holding 0–9 twice; it rests on 0 and rolls
 * up through one full turn to land on its own digit. Everything else in the
 * value — `$`, `.`, `K`, `%`, `+` — is set static beside the wheels, so
 * "99.9%" and "$1B+" read naturally.
 *
 * Pure CSS, so it stays a Server Component: the roll fires when an ancestor
 * gains `data-visible`, which `Reveal` sets the first time it scrolls into
 * view. Digits start a beat apart from left to right. With reduced motion the
 * global stylesheet collapses the transition and the value simply appears.
 *
 * Use inside a parent with `tabular-nums`, so every wheel is the same width
 * and nothing shifts while they spin. Assistive tech reads `value` as plain
 * text; the wheels are hidden from it.
 */
export function Odometer({ value, className }) {
  let order = 0;

  return (
    <span className={cn("inline-flex", className)}>
      <span className="sr-only">{value}</span>

      <span aria-hidden="true" className="inline-flex">
        {[...value].map((char, i) => {
          if (!/\d/.test(char)) {
            return (
              <span key={i} className="inline-block h-[1.1em] leading-[1.1]">
                {char}
              </span>
            );
          }

          // Land on the second turn: index 10 + digit of the 20-row wheel.
          const stop = ((10 + Number(char)) / WHEEL.length) * -100;
          const delay = order++ * 90;

          return (
            <span key={i} className="inline-block h-[1.1em] overflow-hidden">
              <span
                className="block transition-[translate] duration-[1800ms] ease-[cubic-bezier(0.16,1,0.3,1)] in-data-visible:translate-y-[var(--odometer-stop)]"
                style={{
                  "--odometer-stop": `${stop}%`,
                  transitionDelay: `${delay}ms`,
                }}
              >
                {WHEEL.map((digit, row) => (
                  <span key={row} className="block h-[1.1em] leading-[1.1]">
                    {digit}
                  </span>
                ))}
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
