import { CheckIcon } from "@/components/icons";
import { CurrencyMark } from "@/components/shared/CurrencyMark";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";

/**
 * The pieces the money pages share (adding, transferring and withdrawing
 * money, and gift cards), so each flow reads and looks the same.
 */

/** The small capital heading over a group of notes or limits. */
export const SMALL_HEADING =
  "text-[0.6875rem] font-semibold tracking-[0.12em] text-subtle uppercase";

/** Rounds to whole cents. */
export const cents = (n) => Math.round(n * 100) / 100;

/** What was typed as an amount, kept to a number with at most two decimal places. */
export function cleanAmount(text) {
  const [whole, ...rest] = text.replace(/[^\d.]/g, "").split(".");
  return rest.length ? `${whole}.${rest.join("").slice(0, 2)}` : whole;
}

/** Where a step of a two-step flow stands: "Step 1 of 2". */
export function StepPill({ n, of = 2 }) {
  return (
    <span className="rounded-full bg-canvas px-3 py-1.5 text-xs font-semibold text-content tabular-nums">
      Step {n} of {of}
    </span>
  );
}

/** A line of a review: what it is (with a note under it, maybe) and the figure. */
export function Line({ label, hint, strong, children }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 first:pt-0">
      <dt className="text-sm text-muted">
        {label}
        {hint && (
          <span className="mt-0.5 block text-xs text-subtle">{hint}</span>
        )}
      </dt>
      <dd
        className={cn(
          "text-right text-sm text-headline tabular-nums",
          strong && "font-semibold",
        )}
      >
        {children}
      </dd>
    </div>
  );
}

/** Quick amounts, as a row of pills; the one matching `value` lit. */
export function QuickAmounts({ amounts, value, onPick, children }) {
  return (
    <div className="flex flex-wrap gap-2">
      {amounts.map((amount) => (
        <button
          key={amount}
          type="button"
          onClick={() => onPick(amount)}
          aria-pressed={value === amount}
          className={cn(
            "h-9 cursor-pointer rounded-full border px-4 text-sm font-semibold tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
            value === amount
              ? "border-brand bg-brand-50 text-brand-700 dark:bg-brand/15 dark:text-brand-300"
              : "border-line text-headline hover:border-headline/30",
          )}
        >
          {formatMoney(amount, { whole: true })}
        </button>
      ))}
      {children}
    </div>
  );
}

/** The wallet's balance, as a tile with its currency's coin. */
export function BalanceTile({ balance, label = "Current balance" }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-canvas/70 p-4">
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted">{label}</p>
        <p className="mt-1 font-heading text-2xl font-semibold text-headline tabular-nums">
          {formatMoney(balance)}
        </p>
      </div>
      <CurrencyMark code="USD" className="size-10 shrink-0" />
    </div>
  );
}

/**
 * A daily or monthly limit as a row: what is left of it after this one, a
 * bar of what is used and what this would take (red where it goes over),
 * and when it resets.
 */
export function Allowance({ label, limit, used, pending, reset }) {
  const room = Math.max(limit - used, 0);
  const over = pending > room;
  const share = (n) => `${Math.min((n / limit) * 100, 100)}%`;

  return (
    <li>
      <p className="flex items-baseline justify-between gap-3 text-sm">
        <span className="font-medium text-headline">{label}</span>
        <span className="text-muted tabular-nums">
          <span className="font-semibold text-headline">
            {formatMoney(Math.max(room - pending, 0), { whole: true })}
          </span>{" "}
          left of {formatMoney(limit, { whole: true })}
        </span>
      </p>
      <div
        role="meter"
        aria-label={`${label} limit used`}
        aria-valuemin={0}
        aria-valuemax={limit}
        aria-valuenow={Math.min(used + pending, limit)}
        aria-valuetext={`${formatMoney(used)} used${pending ? `, ${formatMoney(pending)} with this one` : ""}, of ${formatMoney(limit)}`}
        className="mt-2 flex h-2 overflow-hidden rounded-full bg-canvas"
      >
        <span
          className="h-full bg-brand transition-[width] duration-500"
          style={{ width: share(used) }}
        />
        <span
          className={cn(
            "h-full transition-[width] duration-500",
            over ? "bg-danger" : "bg-brand/40",
          )}
          style={{ width: share(over ? room : pending) }}
        />
      </div>
      <p
        className={cn(
          "mt-1.5 text-xs",
          over ? "font-medium text-danger" : "text-muted",
        )}
      >
        {over ? `Over by ${formatMoney(pending - room)}` : reset}
      </p>
    </li>
  );
}

/** A note with its icon. */
export function Note({ icon: Icon, children }) {
  return (
    <li className="flex gap-3">
      <span
        aria-hidden="true"
        className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700 dark:bg-brand/15 dark:text-brand-300"
      >
        <Icon className="size-4" />
      </span>
      <p className="pt-1 text-sm leading-snug text-content">{children}</p>
    </li>
  );
}

/**
 * How a flow ended: a tick (green when it is done, brand when it is on its
 * way), the figure, a line under it, a note, and the ways on. Read out as it
 * appears.
 */
export function Result({ done = true, figure, line, note, children }) {
  return (
    <div
      role="status"
      className="flex flex-1 flex-col items-center justify-center py-8 text-center"
    >
      <span
        aria-hidden="true"
        className={cn(
          "grid size-16 place-items-center rounded-full",
          done
            ? "bg-success/12 text-success"
            : "bg-brand-50 text-brand dark:bg-brand/15",
        )}
      >
        <CheckIcon className="size-8" />
      </span>
      <p className="mt-5 font-heading text-[2.25rem] leading-none font-semibold text-headline tabular-nums">
        {figure}
      </p>
      <p className="mt-2 text-content">{line}</p>
      {note && (
        <p className="mt-3 max-w-sm text-sm text-pretty text-muted">{note}</p>
      )}
      <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div>
    </div>
  );
}

/**
 * Two or more choices as a segmented control: real radio buttons, the chosen
 * one lit. `options` are { value, label, icon? }.
 */
export function Segmented({
  name,
  label,
  value,
  onChange,
  options,
  className,
}) {
  return (
    <fieldset className={className}>
      <legend className="sr-only">{label}</legend>
      <div className="grid auto-cols-fr grid-flow-col gap-1 rounded-full bg-canvas p-1">
        {options.map((option) => {
          const Icon = option.icon;
          return (
            <label
              key={option.value}
              className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full px-3 text-sm font-semibold text-muted transition-colors hover:text-headline has-checked:bg-card has-checked:text-headline has-checked:shadow-soft has-focus-visible:outline-2 has-focus-visible:outline-brand"
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              {Icon && <Icon aria-hidden="true" className="size-4" />}
              <span className="truncate">{option.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/** A brand's mark, filled with `currentColor`. Decorative: name the brand beside it. */
export function BrandMark({ logo, className }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={cn("fill-current", className)}
    >
      <path d={logo.path} />
    </svg>
  );
}
