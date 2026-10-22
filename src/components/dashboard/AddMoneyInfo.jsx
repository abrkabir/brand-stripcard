import {
  Allowance,
  BalanceTile,
  Note,
  SMALL_HEADING as HEADING,
} from "@/components/dashboard/MoneyParts";
import { Panel } from "@/components/dashboard/Panel";
import { ClockIcon, ShieldIcon, SwapIcon } from "@/components/icons";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";

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
      <BalanceTile balance={balance} />

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
