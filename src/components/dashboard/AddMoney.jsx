"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AddMoneyInfo } from "@/components/dashboard/AddMoneyInfo";
import { GatewayMark } from "@/components/dashboard/GatewayMark";
import { cleanAmount as clean, Line, StepPill } from "@/components/dashboard/MoneyParts";
import { Panel } from "@/components/dashboard/Panel";
import { CheckIcon } from "@/components/icons";
import { CurrencyMark, currencyName } from "@/components/shared/CurrencyMark";
import { Button } from "@/components/ui/Button";
import { Listbox } from "@/components/ui/Listbox";
import { addMoney, wallet } from "@/data/dashboard";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";

const { gateways, currencies, limits, quick, rateLock } = addMoney;

const LABEL = "block text-sm font-medium text-headline";

const round = (n) => Math.round(n * 100) / 100;

/** A gateway's fee in words, "$2.00 + 1%" or "1.5%"; null when it charges none. */
function feeLabel(gateway) {
  const parts = [];
  if (gateway.fixed) parts.push(formatMoney(gateway.fixed));
  if (gateway.percent) parts.push(`${Number((gateway.percent * 100).toFixed(2))}%`);
  return parts.length ? parts.join(" + ") : null;
}

/**
 * The rate quoted for a currency the `cycle`-th time it is quoted: it drifts
 * a touch each time (a few hundredths of a percent either way), as live
 * rates do, to four decimal places.
 */
function quote(currency, cycle) {
  return Math.round(currency.rate * (1 + 0.0015 * Math.sin(cycle * 1.7)) * 10000) / 10000;
}

/**
 * One side of the converter: what it is, the amount (typed into here, or
 * worked out from the other side), and its currency. Focusing it selects the
 * amount, so typing replaces it; the click that focused it is kept from
 * dropping the selection again.
 */
function AmountField({ id, label, value, onChange, onBlur, invalid, describedBy, end }) {
  const justFocused = useRef(false);

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl border bg-canvas/60 py-2.5 pr-2.5 pl-4 transition-colors focus-within:border-brand",
        invalid ? "border-danger" : "border-line",
      )}
    >
      <div className="min-w-0 flex-1">
        <label htmlFor={id} className="block text-xs text-muted">
          {label}
        </label>
        <input
          id={id}
          inputMode="decimal"
          autoComplete="off"
          placeholder="0.00"
          value={value}
          onChange={(event) => onChange(clean(event.target.value))}
          onFocus={(event) => {
            event.currentTarget.select();
            justFocused.current = true;
          }}
          onMouseUp={(event) => {
            if (justFocused.current) event.preventDefault();
            justFocused.current = false;
          }}
          onKeyDown={() => {
            justFocused.current = false;
          }}
          onBlur={onBlur}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          className="mt-0.5 h-10 w-full bg-transparent font-heading text-[1.75rem] font-semibold text-headline tabular-nums outline-none placeholder:text-subtle"
        />
      </div>
      {end}
    </div>
  );
}

/** A step between the two sides: a sign on the line that joins them, a figure, and what it is. */
function Step({ sign, figure, children }) {
  return (
    <li className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm">
      <span
        aria-hidden="true"
        className="relative grid size-6 shrink-0 place-items-center rounded-full bg-card text-xs font-semibold text-muted ring-1 ring-line"
      >
        {sign}
      </span>
      {figure && <span className="font-semibold text-headline tabular-nums">{figure}</span>}
      {children}
    </li>
  );
}

/**
 * How long the quoted rate holds: a ring running down with the seconds left,
 * then "Rate updated" for a moment when a fresh one is quoted.
 */
function RateLock({ left, total, fresh, className }) {
  const r = 7;
  const length = 2 * Math.PI * r;
  if (fresh) {
    return (
      <span className={cn("inline-flex items-center gap-1 text-xs font-semibold text-success", className)}>
        <CheckIcon aria-hidden="true" className="size-3.5" />
        Rate updated
      </span>
    );
  }
  return (
    <span
      title="We hold this rate for you, then quote a fresh one"
      className={cn("inline-flex items-center gap-1.5 text-xs text-muted tabular-nums", className)}
    >
      <svg aria-hidden="true" viewBox="0 0 18 18" className="size-4 -rotate-90">
        <circle cx="9" cy="9" r={r} fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" />
        <circle
          cx="9"
          cy="9"
          r={r}
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={length}
          strokeDashoffset={length * (1 - left / total)}
          style={{ stroke: "var(--color-brand)" }}
          className="transition-[stroke-dashoffset] duration-1000 ease-linear"
        />
      </svg>
      Locked for 0:{String(left).padStart(2, "0")}
    </span>
  );
}

/**
 * The Add Money page, a short flow in one card, with your limits and a few
 * notes beside it.
 *
 *   1. Details   how to pay (a select, each method with its fee and how soon
 *                the money arrives), then a converter: "You pay" is what is
 *                charged, in the currency you pick; "You get" is what lands in
 *                the wallet, in dollars. Between them, the steps from one to
 *                the other: the exchange rate, held for a short while and then
 *                quoted afresh, and the fee. Type into either side and the
 *                other follows; quick amounts set what you get. Continue
 *                checks the amount against the limits.
 *   2. Review    what you pay and what you get, the method, when it arrives,
 *                the fee, the rate (still held) and your balance after. Back
 *                to change it, or confirm.
 *   3. Done      what was added (or is on its way), with ways on.
 *
 * Each step takes focus as it opens, so keyboard and screen reader users land
 * on it. The limits beside follow the amount as you type.
 *
 * DEMO: nothing is charged. Confirming waits a moment, then acts as if it went
 * through (a bank transfer stays pending): it raises the balance and the
 * limits used.
 */
export function AddMoney() {
  const id = useId();
  const [step, setStep] = useState("details");
  const [gatewayId, setGatewayId] = useState(gateways[0].id);
  const [currencyCode, setCurrencyCode] = useState(addMoney.wallet);
  // The side typed into last, and what was typed there; the other side is worked out.
  const [entry, setEntry] = useState({ side: "get", text: "" });
  const [tick, setTick] = useState(0);
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [balance, setBalance] = useState(wallet.balance);
  const [used, setUsed] = useState({ daily: limits.dailyUsed, monthly: limits.monthlyUsed });
  const [done, setDone] = useState(null);

  const gateway = gateways.find((g) => g.id === gatewayId);
  const currency = currencies.find((c) => c.code === currencyCode);
  const converts = currency.code !== addMoney.wallet;

  // The quoted rate: held for `rateLock` seconds, then quoted afresh. The
  // clock only runs while there is a conversion to quote.
  const cycle = Math.floor(tick / rateLock);
  const rate = converts ? quote(currency, cycle) : 1;
  const lockLeft = rateLock - (tick % rateLock);
  const freshRate = converts && cycle > 0 && tick % rateLock < 2;
  useEffect(() => {
    if (!converts) return;
    const timer = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => window.clearInterval(timer);
  }, [converts]);

  // Each step takes focus as it opens (but not on first load).
  const stepRef = useRef(null);
  const opened = useRef(false);
  useEffect(() => {
    if (!opened.current) {
      opened.current = true;
      return;
    }
    stepRef.current?.focus();
  }, [step]);

  // What you get (dollars, into the wallet) and what you pay (in the chosen
  // currency): the fee is charged on top of what you get, and the whole
  // converted at the rate.
  const typed = Number.parseFloat(entry.text) || 0;
  const get =
    entry.side === "get"
      ? typed
      : typed > 0
        ? Math.max(0, round((typed * rate - gateway.fixed) / (1 + gateway.percent)))
        : 0;
  const fee = get > 0 ? round(gateway.fixed + gateway.percent * get) : 0;
  const totalUsd = round(get + fee);
  const pay = entry.side === "pay" ? typed : get > 0 ? round(totalUsd / rate) : 0;
  const shown = (side, n) => (entry.side === side ? entry.text : n > 0 ? n.toFixed(2) : "");

  const leftToday = limits.daily - used.daily;
  const leftThisMonth = limits.monthly - used.monthly;
  const error = !typed
    ? "Enter how much to add."
    : get <= 0
      ? `That does not cover the ${formatMoney(gateway.fixed)} fee.`
      : get < limits.min
        ? `Add at least ${formatMoney(limits.min)} at a time.`
        : get > limits.max
          ? `Add at most ${formatMoney(limits.max)} at a time.`
          : get > leftToday
            ? `That is over today's limit. You can add ${formatMoney(leftToday)} more today.`
            : get > leftThisMonth
              ? `That is over this month's limit. You can add ${formatMoney(leftThisMonth)} more this month.`
              : null;
  const showError = touched && Boolean(error);
  const noteId = `${id}-note`;

  const toReview = (event) => {
    event.preventDefault();
    setTouched(true);
    if (!error) setStep("review");
  };

  const confirm = () => {
    // The rate may have moved since; if that takes the amount out of bounds, back to the details.
    if (error) {
      setStep("details");
      return;
    }
    setBusy(true);
    window.setTimeout(() => {
      const instant = gateway.id !== "bank";
      if (instant) setBalance((b) => round(b + get));
      setUsed((u) => ({ daily: u.daily + get, monthly: u.monthly + get }));
      setDone({
        instant,
        got: get,
        paid: pay,
        currency: currency.code,
        name: gateway.name,
        balance: instant ? round(balance + get) : balance,
      });
      setEntry({ side: "get", text: "" });
      setTouched(false);
      setBusy(false);
      setStep("done");
    }, 900);
  };

  const startAgain = () => {
    setDone(null);
    setStep("details");
  };

  const gatewayOptions = gateways.map((g) => ({ ...g, value: g.id, label: g.name }));
  const currencyOptions = currencies.map((c) => ({ ...c, value: c.code, label: c.code }));

  const heads = {
    details: { title: "Top up your wallet", subtitle: "Pay in by card, wallet or bank transfer", actions: <StepPill n={1} /> },
    review: { title: "Review your top-up", subtitle: "Check the details, then confirm", actions: <StepPill n={2} /> },
    done: {
      title: done?.instant ? "Top-up complete" : "Top-up on its way",
      subtitle: done?.instant ? "The money is in your wallet" : "We will let you know when it lands",
    },
  };

  return (
    <div className="@container">
      <div className="grid gap-4 lg:gap-5 @min-[60rem]:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <Panel id="add-money-title" {...heads[step]} className="relative z-10">
          <div
            key={step}
            ref={stepRef}
            tabIndex={-1}
            className="flex flex-1 flex-col outline-none motion-safe:animate-pop-in"
          >
            {/* ── 1. Details ───────────────────────────────────────────── */}
            {step === "details" && (
              <form onSubmit={toReview} noValidate className="flex flex-1 flex-col gap-6">
                <Listbox
                  label="Payment method"
                  labelClassName={LABEL}
                  value={gatewayId}
                  onChange={setGatewayId}
                  options={gatewayOptions}
                  buttonClassName="mt-3 rounded-2xl border border-line bg-canvas/60 p-2.5 pr-4 transition-colors hover:border-headline/25 aria-expanded:border-brand"
                  renderOption={(g) => (
                    <>
                      <GatewayMark id={g.id} className="size-10" />
                      <span className="min-w-0 leading-tight">
                        <span className="block truncate text-sm font-semibold text-headline">{g.name}</span>
                        <span className="mt-0.5 block truncate text-xs text-muted">
                          {feeLabel(g) ? `${feeLabel(g)} fee` : "No fee"}, {g.arrives.toLowerCase()}
                        </span>
                      </span>
                    </>
                  )}
                />

                {/* How much: what you pay, the steps between, and what you get. */}
                <div>
                  <p className={LABEL}>Amount</p>
                  <div className="mt-3">
                    <AmountField
                      id={`${id}-pay`}
                      label="You pay"
                      value={shown("pay", pay)}
                      onChange={(text) => setEntry({ side: "pay", text })}
                      onBlur={() => entry.text && setTouched(true)}
                      describedBy={noteId}
                      end={
                        <Listbox
                          label="Currency you pay in"
                          labelClassName="sr-only"
                          align="right"
                          value={currencyCode}
                          onChange={(code) => {
                            setCurrencyCode(code);
                            setTick(0);
                          }}
                          options={currencyOptions}
                          className="shrink-0"
                          buttonClassName="h-11 gap-2 rounded-full bg-card py-1.5 pr-3 pl-1.5 shadow-soft"
                          listClassName="w-56"
                          renderValue={(c) => (
                            <>
                              <CurrencyMark code={c.code} className="size-8" />
                              <span className="text-sm font-semibold text-headline">{c.code}</span>
                            </>
                          )}
                          renderOption={(c) => (
                            <>
                              <CurrencyMark code={c.code} className="size-8" />
                              <span className="leading-tight">
                                <span className="block text-sm font-semibold text-headline">{c.code}</span>
                                <span className="mt-0.5 block text-xs text-muted">{currencyName(c.code)}</span>
                              </span>
                            </>
                          )}
                        />
                      }
                    />

                    {/* The steps from what you pay to what you get, on a line that joins the two. */}
                    <ul className="relative space-y-2.5 py-3.5 pl-3 before:absolute before:inset-y-0 before:left-6 before:w-px before:bg-line">
                      <Step sign="×" figure={converts ? rate.toFixed(4) : null}>
                        {converts ? (
                          <>
                            <span className="text-muted">
                              Rate, 1 {currency.code} = {rate.toFixed(4)} {addMoney.wallet}
                            </span>
                            <RateLock left={lockLeft} total={rateLock} fresh={freshRate} className="ml-auto" />
                          </>
                        ) : (
                          <span className="text-muted">No conversion, you pay in US dollars</span>
                        )}
                      </Step>
                      <Step sign="−" figure={formatMoney(fee)}>
                        <span className="text-muted">
                          {feeLabel(gateway) ? `Fee, ${feeLabel(gateway)}` : "No fee with this method"}
                        </span>
                      </Step>
                    </ul>

                    <AmountField
                      id={`${id}-get`}
                      label="You get"
                      value={shown("get", get)}
                      onChange={(text) => setEntry({ side: "get", text })}
                      onBlur={() => entry.text && setTouched(true)}
                      invalid={showError}
                      describedBy={noteId}
                      end={
                        <span
                          title="Your wallet is in US dollars"
                          className="flex h-11 shrink-0 items-center gap-2 rounded-full bg-card py-1.5 pr-4 pl-1.5 shadow-soft"
                        >
                          <CurrencyMark code={addMoney.wallet} className="size-8" />
                          <span className="text-sm font-semibold text-headline">{addMoney.wallet}</span>
                        </span>
                      }
                    />
                  </div>

                  <p id={noteId} className={cn("mt-2 text-sm", showError ? "text-danger" : "text-muted")}>
                    {showError
                      ? error
                      : converts
                        ? `Between ${formatMoney(limits.min)} and ${formatMoney(limits.max)} at a time, in what you get.`
                        : `Between ${formatMoney(limits.min)} and ${formatMoney(limits.max)} at a time. Paying in another currency? Pick it above.`}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {quick.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => {
                          setEntry({ side: "get", text: String(q) });
                          setTouched(true);
                        }}
                        className={cn(
                          "h-9 cursor-pointer rounded-full border px-4 text-sm font-semibold tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                          get === q
                            ? "border-brand bg-brand-50 text-brand-700 dark:bg-brand/15 dark:text-brand-300"
                            : "border-line text-headline hover:border-headline/30",
                        )}
                      >
                        {formatMoney(q, { whole: true })}
                      </button>
                    ))}
                  </div>
                </div>

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
                    <p className="text-xs text-muted">You pay</p>
                    <p className="mt-1 font-heading text-[1.75rem] leading-tight font-semibold text-headline tabular-nums">
                      {formatMoney(pay, { currency: currency.code })}
                    </p>
                    <p className="mt-1 text-xs text-muted">With {gateway.name}</p>
                  </div>
                  <div className="rounded-2xl bg-brand-50 p-4 dark:bg-brand/10">
                    <p className="text-xs text-muted">You get</p>
                    <p className="mt-1 font-heading text-[1.75rem] leading-tight font-semibold text-headline tabular-nums">
                      {formatMoney(get)}
                    </p>
                    <p className="mt-1 text-xs text-muted">Into your wallet</p>
                  </div>
                </div>

                <dl className="divide-y divide-dashed divide-line">
                  <Line label="Payment method">
                    <span className="inline-flex items-center gap-2">
                      <GatewayMark id={gateway.id} className="size-6" />
                      {gateway.name}
                    </span>
                  </Line>
                  <Line label="Arrives">
                    {gateway.arrives.replace(/^Arrives (\w)/, (_, first) => first.toUpperCase())}
                  </Line>
                  <Line label="Fee" hint={feeLabel(gateway) ?? "None with this method"}>
                    {formatMoney(fee)}
                  </Line>
                  {converts && (
                    <>
                      <Line
                        label="Exchange rate"
                        hint={<RateLock left={lockLeft} total={rateLock} fresh={freshRate} className="mt-0.5" />}
                      >
                        1 {currency.code} = {rate.toFixed(4)} {addMoney.wallet}
                      </Line>
                      <Line label="Total in US dollars">{formatMoney(totalUsd)}</Line>
                    </>
                  )}
                  <Line label="Balance after" strong>
                    {formatMoney(round(balance + get))}
                  </Line>
                </dl>

                <div className="mt-auto flex flex-col-reverse gap-3 @min-[30rem]:flex-row">
                  <Button type="button" variant="outline" arrow={false} onClick={() => setStep("details")}>
                    Back
                  </Button>
                  <Button
                    type="button"
                    arrow={false}
                    disabled={busy}
                    onClick={confirm}
                    className="disabled:cursor-wait disabled:opacity-70 @min-[30rem]:flex-1"
                  >
                    {busy ? "Adding money" : `Confirm and add ${formatMoney(get)}`}
                  </Button>
                </div>
              </div>
            )}

            {/* ── 3. Done ──────────────────────────────────────────────── */}
            {step === "done" && done && (
              <div role="status" className="flex flex-1 flex-col items-center justify-center py-8 text-center">
                <span
                  aria-hidden="true"
                  className={cn(
                    "grid size-16 place-items-center rounded-full",
                    done.instant ? "bg-success/12 text-success" : "bg-brand-50 text-brand dark:bg-brand/15",
                  )}
                >
                  <CheckIcon className="size-8" />
                </span>
                <p className="mt-5 font-heading text-[2.25rem] leading-none font-semibold text-headline tabular-nums">
                  {formatMoney(done.got)}
                </p>
                <p className="mt-2 text-content">{done.instant ? "added to your wallet" : "on its way to your wallet"}</p>
                <p className="mt-3 max-w-sm text-sm text-pretty text-muted">
                  {done.instant
                    ? `You paid ${formatMoney(done.paid, { currency: done.currency })} with ${done.name}. Your balance is now ${formatMoney(done.balance)}.`
                    : "Bank transfers arrive in 1 to 2 business days. We will let you know when it lands."}
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Button type="button" variant="outline" arrow={false} onClick={startAgain}>
                    Add more money
                  </Button>
                  <Button href="/dashboard" arrow={false}>
                    Back to dashboard
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Panel>

        <AddMoneyInfo
          balance={balance}
          limits={limits}
          used={used}
          pending={step === "done" ? 0 : get}
          rateLock={rateLock}
        />
      </div>
    </div>
  );
}
