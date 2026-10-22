"use client";

import { useEffect, useRef, useState } from "react";
import { TextField } from "@/components/dashboard/FormField";
import {
  Allowance,
  BalanceTile,
  BrandMark,
  cents,
  cleanAmount,
  Line,
  Note,
  QuickAmounts,
  Result,
  SMALL_HEADING,
  StepPill,
} from "@/components/dashboard/MoneyParts";
import { Panel } from "@/components/dashboard/Panel";
import { CheckIcon, ClockIcon, LockIcon, ShieldIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { wallet, withdraw } from "@/data/dashboard";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";

const { accounts, speeds, limits, quick } = withdraw;

const LABEL = "block text-sm font-medium text-headline";

/** How long the demo pretends to send the money, in milliseconds. */
const SEND_MS = 900;

/** A bank's mark, white on the bank's own colour, in a circle. */
function BankMark({ account, className }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid shrink-0 place-items-center rounded-full text-white",
        className,
      )}
      style={{ background: account.logo.hex }}
    >
      <BrandMark logo={account.logo} className="size-[46%]" />
    </span>
  );
}

/** A choice drawn as a tile: a radio button, the tile lit and ticked when chosen. */
function Tile({ name, value, checked, onChange, children }) {
  return (
    <label className="group flex cursor-pointer items-center gap-3 rounded-2xl border border-line bg-canvas/40 p-3 transition-colors hover:border-headline/25 has-checked:border-brand has-checked:bg-brand-50 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-brand dark:has-checked:bg-brand/10">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      {children}
      <span
        aria-hidden="true"
        className="grid size-5 shrink-0 place-items-center rounded-full ring-1 ring-line ring-inset group-has-checked:bg-brand group-has-checked:text-white group-has-checked:ring-0"
      >
        <CheckIcon
          className="size-3 opacity-0 group-has-checked:opacity-100"
          strokeWidth={3}
        />
      </span>
    </label>
  );
}

/** A speed's fee on `amount`, in words: "Free" or "$1.50 fee (1.5%)". */
function feeText(speed, amount) {
  if (!speed.percent) return "Free";
  const share = `${Number((speed.percent * 100).toFixed(2))}%`;
  return amount > 0
    ? `${formatMoney(cents(amount * speed.percent))} fee (${share})`
    : `${share} fee`;
}

/**
 * Beside the withdrawal: the balance, the limits (following the amount being
 * entered, `pending`), and what is good to know.
 */
function WithdrawInfo({ balance, used, pending }) {
  return (
    <Panel
      id="withdraw-info-title"
      title="Limits and info"
      subtitle="Good to know before you withdraw"
    >
      <BalanceTile balance={balance} />

      <h3 className={cn(SMALL_HEADING, "mt-6")}>Your limits</h3>
      <ul className="mt-3 space-y-5">
        <li>
          <p className="flex items-baseline justify-between gap-3 text-sm">
            <span className="font-medium text-headline">Per withdrawal</span>
            <span className="font-semibold text-headline tabular-nums">
              {formatMoney(limits.min, { whole: true })} to{" "}
              {formatMoney(limits.max, { whole: true })}
            </span>
          </p>
        </li>
        <Allowance
          label="Daily"
          limit={limits.daily}
          used={used.daily}
          pending={pending}
          reset={limits.dailyReset}
        />
        <Allowance
          label="Monthly"
          limit={limits.monthly}
          used={used.monthly}
          pending={pending}
          reset={limits.monthlyReset}
        />
      </ul>

      <h3 className={cn(SMALL_HEADING, "mt-6")}>Good to know</h3>
      <ul className="mt-3 space-y-3">
        <Note icon={ClockIcon}>
          Standard withdrawals are free and arrive in 1 to 2 business days.
          Instant ones arrive in about 30 minutes.
        </Note>
        <Note icon={LockIcon}>
          Money only goes to bank accounts in your own name.
        </Note>
        <Note icon={ShieldIcon}>
          We check every withdrawal, and email you when it leaves.
        </Note>
      </ul>
    </Panel>
  );
}

/**
 * The Withdraw Money page, a short flow in one card, with your limits beside
 * it.
 *
 *   1. Details   which linked bank account it goes to; how much (typed, a
 *                quick amount, or the whole balance); and how soon: Standard
 *                (free, a day or two) or Instant (a small share, about 30
 *                minutes). Continue checks it and puts focus on what to fix.
 *   2. Review    the account, the amount, when it arrives, the fee, what
 *                reaches the bank and the balance after. Back, or confirm.
 *   3. Done      what was withdrawn, with ways on.
 *
 * Each step takes focus as it opens. The limits beside follow the amount as
 * you type.
 *
 * DEMO: nothing is sent. Confirming waits a moment, then takes the money off
 * the balance shown and adds it to the limits used.
 */
export function WithdrawMoney() {
  const [step, setStep] = useState("details");
  const [accountId, setAccountId] = useState(accounts[0].id);
  const [speedId, setSpeedId] = useState(speeds[0].id);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [balance, setBalance] = useState(wallet.balance);
  const [used, setUsed] = useState({
    daily: limits.dailyUsed,
    monthly: limits.monthlyUsed,
  });
  const [done, setDone] = useState(null);
  const amountRef = useRef(null);

  // Each step takes focus as it opens, not on first load (compared with what
  // was shown, so an effect run twice cannot fire it).
  const stepRef = useRef(null);
  const shown = useRef(step);
  useEffect(() => {
    if (shown.current === step) return;
    shown.current = step;
    stepRef.current?.focus();
  }, [step]);

  const account = accounts.find((a) => a.id === accountId);
  const speed = speeds.find((s) => s.id === speedId);
  const value = Number.parseFloat(amount) || 0;
  const fee = cents(value * speed.percent);
  const receive = cents(value - fee);
  const all = Math.min(cents(balance), limits.max);

  const problem = () => {
    const leftToday = limits.daily - used.daily;
    const leftThisMonth = limits.monthly - used.monthly;
    if (!value) return "Enter how much to withdraw";
    if (value < limits.min)
      return `Withdraw at least ${formatMoney(limits.min, { whole: true })}`;
    if (value > limits.max)
      return `Withdraw at most ${formatMoney(limits.max, { whole: true })} at a time`;
    if (value > balance)
      return `That is more than your balance of ${formatMoney(balance)}`;
    if (value > leftToday)
      return `That is over today's limit. You can withdraw ${formatMoney(leftToday)} more today.`;
    if (value > leftThisMonth)
      return `That is over this month's limit. You can withdraw ${formatMoney(leftThisMonth)} more this month.`;
    return null;
  };

  const toReview = (event) => {
    event.preventDefault();
    const found = problem();
    setError(found);
    if (found) {
      amountRef.current?.querySelector("input")?.focus();
      return;
    }
    setStep("review");
  };

  const confirm = () => {
    setBusy(true);
    window.setTimeout(() => {
      setBalance((b) => cents(b - value));
      setUsed((u) => ({
        daily: cents(u.daily + value),
        monthly: cents(u.monthly + value),
      }));
      setDone({ amount: value, receive, account, speed });
      setBusy(false);
      setStep("done");
    }, SEND_MS);
  };

  const again = () => {
    setDone(null);
    setAmount("");
    setError(null);
    setStep("details");
  };

  const heads = {
    details: {
      title: "Withdraw to your bank",
      subtitle: "Move money from your wallet to a linked account",
      actions: <StepPill n={1} />,
    },
    review: {
      title: "Review your withdrawal",
      subtitle: "Check the details, then confirm",
      actions: <StepPill n={2} />,
    },
    done: {
      title: "Withdrawal on its way",
      subtitle: "We will email you when it lands",
    },
  };

  const pick = (text) => {
    setAmount(text);
    setError(null);
  };

  return (
    <div className="@container">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-4 lg:gap-5 @min-[60rem]:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <Panel id="withdraw-title" {...heads[step]} className="relative z-10">
          <div
            key={step}
            ref={stepRef}
            tabIndex={-1}
            className="flex flex-1 flex-col outline-none motion-safe:animate-pop-in"
          >
            {/* ── 1. Details ───────────────────────────────────────────── */}
            {step === "details" && (
              <form
                onSubmit={toReview}
                noValidate
                className="flex flex-1 flex-col gap-6"
              >
                <fieldset>
                  <legend className={LABEL}>To</legend>
                  <div className="mt-2 grid gap-2.5 @min-[34rem]:grid-cols-2">
                    {accounts.map((option) => (
                      <Tile
                        key={option.id}
                        name="account"
                        value={option.id}
                        checked={accountId === option.id}
                        onChange={() => setAccountId(option.id)}
                      >
                        <BankMark account={option} className="size-10" />
                        <span className="min-w-0 flex-1 leading-tight">
                          <span className="block truncate text-sm font-semibold text-headline">
                            {option.bank}
                          </span>
                          <span className="mt-1 block text-xs text-muted tabular-nums">
                            {option.type} •••• {option.last4}
                          </span>
                        </span>
                      </Tile>
                    ))}
                  </div>
                </fieldset>

                <div ref={amountRef}>
                  <TextField
                    label="Amount"
                    required
                    name="amount"
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder="0.00"
                    inputClassName="tabular-nums"
                    prefix={
                      <span className="pl-3.5 text-[0.9375rem] font-medium text-muted">
                        $
                      </span>
                    }
                    value={amount}
                    onChange={(event) => pick(cleanAmount(event.target.value))}
                    error={error}
                    hint={`${formatMoney(balance)} available, ${formatMoney(limits.min, { whole: true })} to ${formatMoney(limits.max, { whole: true })} at a time`}
                  />
                  <div className="mt-3">
                    <QuickAmounts
                      amounts={quick.filter((n) => n <= balance)}
                      value={value}
                      onPick={(n) => pick(String(n))}
                    >
                      <button
                        type="button"
                        onClick={() => pick(String(all))}
                        aria-pressed={value === all}
                        className={cn(
                          "h-9 cursor-pointer rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                          value === all
                            ? "border-brand bg-brand-50 text-brand-700 dark:bg-brand/15 dark:text-brand-300"
                            : "border-line text-headline hover:border-headline/30",
                        )}
                      >
                        {all === cents(balance)
                          ? "Whole balance"
                          : `Most, ${formatMoney(all, { whole: true })}`}
                      </button>
                    </QuickAmounts>
                  </div>
                </div>

                <fieldset>
                  <legend className={LABEL}>Speed</legend>
                  <div className="mt-2 grid gap-2.5 @min-[34rem]:grid-cols-2">
                    {speeds.map((option) => (
                      <Tile
                        key={option.id}
                        name="speed"
                        value={option.id}
                        checked={speedId === option.id}
                        onChange={() => setSpeedId(option.id)}
                      >
                        <span
                          aria-hidden="true"
                          className="grid size-10 shrink-0 place-items-center rounded-full bg-card text-brand ring-1 ring-line"
                        >
                          <ClockIcon className="size-[18px]" />
                        </span>
                        <span className="min-w-0 flex-1 leading-tight">
                          <span className="flex items-center gap-2 text-sm font-semibold text-headline">
                            {option.label}
                            <span
                              className={cn(
                                "rounded-full px-2 py-0.5 text-[0.6875rem] font-semibold",
                                option.percent
                                  ? "bg-canvas text-content"
                                  : "bg-success/12 text-success",
                              )}
                            >
                              {feeText(option, value)}
                            </span>
                          </span>
                          <span className="mt-1 block text-xs text-muted">
                            {option.text}
                          </span>
                        </span>
                      </Tile>
                    ))}
                  </div>
                </fieldset>

                <Button type="submit" block arrow={false} className="mt-auto">
                  Continue
                </Button>
              </form>
            )}

            {/* ── 2. Review ────────────────────────────────────────────── */}
            {step === "review" && (
              <div className="flex flex-1 flex-col gap-5">
                <div className="grid gap-3 @min-[30rem]:grid-cols-2">
                  <div className="rounded-2xl bg-canvas/70 p-4">
                    <p className="text-xs text-muted">You withdraw</p>
                    <p className="mt-1 font-heading text-[1.75rem] leading-tight font-semibold text-headline tabular-nums">
                      {formatMoney(value)}
                    </p>
                    <p className="mt-1 text-xs text-muted">From your wallet</p>
                  </div>
                  <div className="rounded-2xl bg-brand-50 p-4 dark:bg-brand/10">
                    <p className="text-xs text-muted">Your bank gets</p>
                    <p className="mt-1 font-heading text-[1.75rem] leading-tight font-semibold text-headline tabular-nums">
                      {formatMoney(receive)}
                    </p>
                    <p className="mt-1 truncate text-xs text-muted">
                      {account.bank} •••• {account.last4}
                    </p>
                  </div>
                </div>

                <dl className="divide-y divide-dashed divide-line">
                  <Line label="To">
                    <span className="inline-flex items-center gap-2">
                      <BankMark account={account} className="size-6" />
                      {account.bank}, {account.type.toLowerCase()} ••••{" "}
                      {account.last4}
                    </span>
                  </Line>
                  <Line label="Arrives" hint={speed.label}>
                    {speed.text}
                  </Line>
                  <Line label="Fee" hint={feeText(speed, 0)}>
                    {formatMoney(fee)}
                  </Line>
                  <Line label="Balance after" strong>
                    {formatMoney(cents(balance - value))}
                  </Line>
                </dl>

                <div className="mt-auto flex flex-col-reverse gap-3 @min-[30rem]:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    arrow={false}
                    onClick={() => setStep("details")}
                    disabled={busy}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    arrow={false}
                    disabled={busy}
                    aria-busy={busy || undefined}
                    onClick={confirm}
                    className="disabled:cursor-wait disabled:opacity-70 @min-[30rem]:flex-1"
                  >
                    {busy ? "Withdrawing" : `Withdraw ${formatMoney(value)}`}
                  </Button>
                </div>
              </div>
            )}

            {/* ── 3. Done ──────────────────────────────────────────────── */}
            {step === "done" && done && (
              <Result
                done={false}
                figure={formatMoney(done.receive)}
                line={`on its way to ${done.account.bank} •••• ${done.account.last4}`}
                note={`${done.speed.label}: ${done.speed.text.toLowerCase()}. Your balance is now ${formatMoney(balance)}.`}
              >
                <Button
                  type="button"
                  variant="outline"
                  arrow={false}
                  onClick={again}
                >
                  Withdraw more
                </Button>
                <Button href="/dashboard" arrow={false}>
                  Back to dashboard
                </Button>
              </Result>
            )}
          </div>
        </Panel>

        <WithdrawInfo
          balance={balance}
          used={used}
          pending={step === "done" ? 0 : value}
        />
      </div>
    </div>
  );
}
