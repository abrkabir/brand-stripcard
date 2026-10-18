import { Panel } from "@/components/dashboard/Panel";
import { ClockIcon, ShieldIcon, SwapIcon } from "@/components/icons";
import { CurrencyMark } from "@/components/shared/CurrencyMark";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";

const HEADING = "text-[0.6875rem] font-semibold tracking-[0.12em] text-subtle uppercase";

/**
 * A daily or monthly limit as a row: what is left of it after this top-up,
 * a bar of what is used and what this top-up would take (red where it goes
 * over), and when it resets.
 */
function Allowance({ label, limit, used, pending, reset }) {
  const room = Math.max(limit - used, 0);
  const over = pending > room;
  const share = (n) => `${Math.min((n / limit) * 100, 100)}%`;

  return (
    <li>
      <p className="flex items-baseline justify-between gap-3 text-sm">
        <span className="font-medium text-headline">{label}</span>
        <span className="text-muted tabular-nums">
          <span className="font-semibold text-headline">{formatMoney(Math.max(room - pending, 0), { whole: true })}</span>{" "}
          left of {formatMoney(limit, { whole: true })}
        </span>
      </p>
      <div
        role="meter"
        aria-label={`${label} limit used`}
        aria-valuemin={0}
        aria-valuemax={limit}
        aria-valuenow={Math.min(used + pending, limit)}
        aria-valuetext={`${formatMoney(used)} used${pending ? `, ${formatMoney(pending)} with this top-up` : ""}, of ${formatMoney(limit)}`}
        className="mt-2 flex h-2 overflow-hidden rounded-full bg-canvas"
      >
        <span className="h-full bg-brand transition-[width] duration-500" style={{ width: share(used) }} />
        <span
          className={cn("h-full transition-[width] duration-500", over ? "bg-danger" : "bg-brand/40")}
          style={{ width: share(over ? room : pending) }}
        />
      </div>
      <p className={cn("mt-1.5 text-xs", over ? "font-medium text-danger" : "text-muted")}>
        {over ? `Over by ${formatMoney(pending - room)}` : reset}
      </p>
    </li>
  );
}

/** A note with its icon. */
function Note({ icon: Icon, children }) {
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
 * Beside the Add Money form: your balance, your limits (following the amount
 * being entered, `pending`: where it sits in the range one top-up must fall
 * in, and what the daily and monthly limits would have left), and a few
 * things good to know about how and when the money arrives.
 */
export function AddMoneyInfo({ balance, limits, used, pending, rateLock, className }) {
  const { min, max } = limits;
  const tooLow = pending > 0 && pending < min;
  const tooHigh = pending > max;
  const at = Math.min(Math.max((pending - min) / (max - min), 0), 1);

  return (
    <Panel id="add-money-info-title" title="Limits and info" subtitle="Good to know before you top up" className={className}>
      <div className="flex items-center gap-3 rounded-2xl bg-canvas/70 p-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted">Current balance</p>
          <p className="mt-1 font-heading text-2xl font-semibold text-headline tabular-nums">{formatMoney(balance)}</p>
        </div>
        <CurrencyMark code="USD" className="size-10 shrink-0" />
      </div>

      <h3 className={cn(HEADING, "mt-6")}>Your limits</h3>
      <ul className="mt-3 space-y-5">
        <li>
          <p className="flex items-baseline justify-between gap-3 text-sm">
            <span className="font-medium text-headline">Per top-up</span>
            <span className="font-semibold text-headline tabular-nums">
              {formatMoney(min, { whole: true })} to {formatMoney(max, { whole: true })}
            </span>
          </p>
          {/* The range, with a marker where this top-up sits in it. */}
          <div aria-hidden="true" className="relative mt-2 h-2 rounded-full bg-canvas">
            {pending > 0 && (
              <>
                <span
                  className={cn("absolute inset-y-0 left-0 rounded-full", tooLow || tooHigh ? "bg-danger" : "bg-brand/40")}
                  style={{ width: `${at * 100}%` }}
                />
                <span
                  className={cn(
                    "absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-card",
                    tooLow || tooHigh ? "bg-danger" : "bg-brand",
                  )}
                  style={{ left: `${at * 100}%` }}
                />
              </>
            )}
          </div>
          <p className={cn("mt-1.5 text-xs", tooLow || tooHigh ? "font-medium text-danger" : "text-muted")}>
            {!pending
              ? "Each top-up must fall in this range"
              : tooHigh
                ? `Over the most by ${formatMoney(pending - max)}`
                : tooLow
                  ? `Under the least by ${formatMoney(min - pending)}`
                  : `${formatMoney(pending)} is within range`}
          </p>
        </li>
        <Allowance label="Daily" limit={limits.daily} used={used.daily} pending={pending} reset={limits.dailyReset} />
        <Allowance label="Monthly" limit={limits.monthly} used={used.monthly} pending={pending} reset={limits.monthlyReset} />
      </ul>

      <h3 className={cn(HEADING, "mt-6")}>Good to know</h3>
      <ul className="mt-3 space-y-3">
        <Note icon={ClockIcon}>Cards and wallets arrive instantly. Bank transfers take 1 to 2 business days.</Note>
        <Note icon={SwapIcon}>
          Paying in another currency? We hold the exchange rate for {rateLock} seconds while you check out.
        </Note>
        <Note icon={ShieldIcon}>Every payment is encrypted and checked with 3-D Secure.</Note>
      </ul>
    </Panel>
  );
}
