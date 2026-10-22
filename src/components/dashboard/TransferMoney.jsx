"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { SelectField, TextField } from "@/components/dashboard/FormField";
import {
  Allowance,
  BalanceTile,
  cents,
  cleanAmount,
  Line,
  Note,
  QuickAmounts,
  Result,
  Segmented,
  SMALL_HEADING,
  StepPill,
} from "@/components/dashboard/MoneyParts";
import { Panel } from "@/components/dashboard/Panel";
import {
  BuildingIcon,
  ClockIcon,
  SendIcon,
  ShieldIcon,
  UserIcon,
} from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { transfer, wallet } from "@/data/dashboard";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";

const { contacts, banks, bankFee, limits, quick, recent } = transfer;

const LABEL = "block text-sm font-medium text-headline";

/** How long the demo pretends to send the money, in milliseconds. */
const SEND_MS = 900;

const DESTINATIONS = [
  { value: "user", label: "StripCard user", icon: UserIcon },
  { value: "bank", label: "Bank account", icon: BuildingIcon },
];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HANDLE = /^@[a-z0-9_.]{3,30}$/i;

/** Who a typed recipient is: an email, an @username or a phone number; null if it is none of them. */
function readRecipient(text) {
  const value = text.trim();
  if (EMAIL.test(value) || HANDLE.test(value)) return value;
  const digits = value.replace(/[\s()+-]/g, "");
  if (/^\d{7,15}$/.test(digits)) return value;
  return null;
}

/** A person's initials, for one without a photo. */
const initials = (name) =>
  name
    .replace(/^@/, "")
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

/** A person's round photo, or their initials on a tint when there is none. */
function Avatar({ person, className }) {
  return person.avatar ? (
    <Image
      src={person.avatar}
      alt=""
      sizes="48px"
      className={cn("shrink-0 rounded-full object-cover object-top", className)}
    />
  ) : (
    <span
      aria-hidden="true"
      className={cn(
        "grid shrink-0 place-items-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700 dark:bg-brand/15 dark:text-brand-300",
        className,
      )}
    >
      {initials(person.name) || "?"}
    </span>
  );
}

/**
 * Beside the transfer: the balance, the daily limit (following the amount
 * being entered, `pending`), the latest transfers, and what is good to know.
 */
function TransferInfo({ balance, used, pending }) {
  return (
    <Panel
      id="transfer-info-title"
      title="Limits and activity"
      subtitle="Good to know before you send"
    >
      <BalanceTile balance={balance} />

      <h3 className={cn(SMALL_HEADING, "mt-6")}>Your limits</h3>
      <ul className="mt-3 space-y-5">
        <li>
          <p className="flex items-baseline justify-between gap-3 text-sm">
            <span className="font-medium text-headline">Per transfer</span>
            <span className="font-semibold text-headline tabular-nums">
              {formatMoney(limits.min, { whole: true })} to{" "}
              {formatMoney(limits.max, { whole: true })}
            </span>
          </p>
        </li>
        <Allowance
          label="Daily"
          limit={limits.daily}
          used={used}
          pending={pending}
          reset={limits.dailyReset}
        />
      </ul>

      <h3 className={cn(SMALL_HEADING, "mt-6")}>Recent transfers</h3>
      <ul className="mt-3 space-y-1">
        {recent.map((item) => (
          <li key={item.id} className="flex items-center gap-3 py-1.5">
            <Avatar person={item} className="size-9" />
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-sm font-semibold text-headline">
                {item.name}
              </p>
              <p className="mt-0.5 text-xs text-muted">
                {item.amount > 0 ? "Received" : "Sent"}, {item.when}
              </p>
            </div>
            <span
              className={cn(
                "text-sm font-semibold tabular-nums",
                item.amount > 0 ? "text-success" : "text-headline",
              )}
            >
              {item.amount > 0 ? "+" : "−"}
              {formatMoney(Math.abs(item.amount))}
            </span>
          </li>
        ))}
      </ul>

      <h3 className={cn(SMALL_HEADING, "mt-6")}>Good to know</h3>
      <ul className="mt-3 space-y-3">
        <Note icon={SendIcon}>
          Sending to another StripCard user is free and arrives at once.
        </Note>
        <Note icon={ClockIcon}>
          Bank transfers cost {formatMoney(bankFee)} and arrive in 1 to 2
          business days.
        </Note>
        <Note icon={ShieldIcon}>
          Check who you are paying. A sent transfer cannot be called back.
        </Note>
      </ul>
    </Panel>
  );
}

/**
 * The Transfer Money page, a short flow in one card, with your limits and
 * recent transfers beside it.
 *
 *   1. Details   who to send to: a StripCard user (one of the people paid
 *                most, in a tap, or anyone by email, phone or @username) or
 *                a bank account (the holder, the bank, the account and
 *                routing numbers); how much (typed, or a quick amount); and a
 *                note for them, if you like. Continue checks it all, and puts
 *                focus on the first thing to fix.
 *   2. Review    who it goes to, the amount, the fee, when it arrives, what
 *                leaves the wallet and the balance after. Back to change it,
 *                or send.
 *   3. Done      what was sent (or is on its way), with ways on.
 *
 * Each step takes focus as it opens. The daily limit beside follows the
 * amount as you type.
 *
 * DEMO: nothing is sent. Sending waits a moment, then takes the money off
 * the balance shown and adds it to the limit used.
 */
export function TransferMoney() {
  const [step, setStep] = useState("details");
  const [to, setTo] = useState("user");
  const [contactId, setContactId] = useState(null);
  const [recipient, setRecipient] = useState("");
  const [bank, setBank] = useState({
    holder: "",
    bank: banks[0].value,
    account: "",
    routing: "",
  });
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [balance, setBalance] = useState(wallet.balance);
  const [used, setUsed] = useState(limits.dailyUsed);
  const [done, setDone] = useState(null);
  const formRef = useRef(null);

  // Each step takes focus as it opens, not on first load (compared with what
  // was shown, so an effect run twice cannot fire it).
  const stepRef = useRef(null);
  const shown = useRef(step);
  useEffect(() => {
    if (shown.current === step) return;
    shown.current = step;
    stepRef.current?.focus();
  }, [step]);

  const value = Number.parseFloat(amount) || 0;
  const fee = to === "bank" && value > 0 ? bankFee : 0;
  const total = cents(value + fee);
  const contact = contacts.find((c) => c.id === contactId);
  const bankName = banks.find((b) => b.value === bank.bank)?.label;
  const accountDigits = bank.account.replace(/\D/g, "");

  /** Who the money goes to, as the review and the result show them. */
  const payee =
    to === "user"
      ? contact
        ? { name: contact.name, detail: contact.handle, avatar: contact.avatar }
        : { name: recipient.trim(), detail: "StripCard user" }
      : {
          name: bank.holder.trim(),
          detail: `${bankName}, account ending ${accountDigits.slice(-4)}`,
          bank: true,
        };

  const clear = (key) => setErrors((e) => ({ ...e, [key]: undefined }));

  /** What is wrong with the details, by the name of the field to fix. */
  const problems = () => {
    const found = {};
    if (to === "user") {
      if (!contact && !readRecipient(recipient))
        found.recipient = recipient.trim()
          ? "Enter an email, a phone number or an @username"
          : "Choose someone, or enter their email, phone or @username";
    } else {
      if (!bank.holder.trim()) found.holder = "Enter the account holder's name";
      if (!/^\d{6,17}$/.test(accountDigits))
        found.account = "Enter the 6 to 17 digit account number";
      if (!/^\d{9}$/.test(bank.routing.replace(/\D/g, "")))
        found.routing = "Enter the 9 digit routing number";
    }
    const leftToday = limits.daily - used;
    if (!value) found.amount = "Enter how much to send";
    else if (value < limits.min)
      found.amount = `Send at least ${formatMoney(limits.min)}`;
    else if (value > limits.max)
      found.amount = `Send at most ${formatMoney(limits.max, { whole: true })} at a time`;
    else if (value > leftToday)
      found.amount = `That is over today's limit. You can send ${formatMoney(leftToday)} more today.`;
    else if (total > balance)
      found.amount = `That is more than your balance of ${formatMoney(balance)}`;
    return found;
  };

  const toReview = (event) => {
    event.preventDefault();
    const found = problems();
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      formRef.current?.elements.namedItem(first)?.focus?.();
      return;
    }
    setStep("review");
  };

  const send = () => {
    setBusy(true);
    window.setTimeout(() => {
      setBalance((b) => cents(b - total));
      setUsed((u) => cents(u + value));
      setDone({ ...payee, amount: value, instant: to === "user" });
      setBusy(false);
      setStep("done");
    }, SEND_MS);
  };

  const again = () => {
    setDone(null);
    setAmount("");
    setNote("");
    setErrors({});
    setStep("details");
  };

  const heads = {
    details: {
      title: "Send money",
      subtitle: "To a StripCard user or a bank account",
      actions: <StepPill n={1} />,
    },
    review: {
      title: "Review your transfer",
      subtitle: "Check the details, then send",
      actions: <StepPill n={2} />,
    },
    done: {
      title: done?.instant ? "Transfer sent" : "Transfer on its way",
      subtitle: done?.instant
        ? "The money is with them now"
        : "We will let you know when it lands",
    },
  };

  const setBankField = (key) => (event) => {
    setBank((b) => ({ ...b, [key]: event.target.value }));
    clear(key);
  };

  return (
    <div className="@container">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-4 lg:gap-5 @min-[60rem]:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <Panel id="transfer-title" {...heads[step]} className="relative z-10">
          <div
            key={step}
            ref={stepRef}
            tabIndex={-1}
            className="flex flex-1 flex-col outline-none motion-safe:animate-pop-in"
          >
            {/* ── 1. Details ───────────────────────────────────────────── */}
            {step === "details" && (
              <form
                ref={formRef}
                onSubmit={toReview}
                noValidate
                className="flex flex-1 flex-col gap-6"
              >
                <Segmented
                  name="to"
                  label="Send to"
                  value={to}
                  onChange={(next) => {
                    setTo(next);
                    setErrors({});
                  }}
                  options={DESTINATIONS}
                />

                {to === "user" ? (
                  <div className="flex flex-col gap-4">
                    <fieldset>
                      <legend className={LABEL}>People you pay often</legend>
                      <div className="mt-2 grid grid-cols-4 gap-2">
                        {contacts.map((person) => (
                          <label
                            key={person.id}
                            className="group flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-line bg-canvas/40 px-1.5 py-3 text-center transition-colors hover:border-headline/25 has-checked:border-brand has-checked:bg-brand-50 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-brand dark:has-checked:bg-brand/10"
                          >
                            <input
                              type="radio"
                              name="contact"
                              value={person.id}
                              checked={contactId === person.id}
                              onChange={() => {
                                setContactId(person.id);
                                setRecipient("");
                                clear("recipient");
                              }}
                              className="sr-only"
                            />
                            <Avatar
                              person={person}
                              className="size-11 ring-2 ring-card transition-shadow group-has-checked:ring-brand"
                            />
                            <span className="w-full truncate text-xs font-semibold text-headline">
                              {person.name.split(" ")[0]}
                            </span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                    <TextField
                      label={
                        contact
                          ? "Or someone else"
                          : "Email, phone or @username"
                      }
                      name="recipient"
                      autoComplete="off"
                      spellCheck={false}
                      placeholder="name@example.com"
                      value={recipient}
                      onChange={(event) => {
                        setRecipient(event.target.value);
                        setContactId(null);
                        clear("recipient");
                      }}
                      error={errors.recipient}
                      hint={
                        contact
                          ? `Sending to ${contact.name}, ${contact.handle}`
                          : "Free, and with them at once"
                      }
                    />
                  </div>
                ) : (
                  <div className="grid gap-4 @min-[32rem]:grid-cols-2">
                    <TextField
                      label="Account holder"
                      required
                      name="holder"
                      autoComplete="off"
                      placeholder="Full name on the account"
                      value={bank.holder}
                      onChange={setBankField("holder")}
                      error={errors.holder}
                    />
                    <SelectField
                      label="Bank"
                      required
                      value={bank.bank}
                      onChange={(next) =>
                        setBank((b) => ({ ...b, bank: next }))
                      }
                      options={banks}
                    />
                    <TextField
                      label="Account number"
                      required
                      name="account"
                      inputMode="numeric"
                      autoComplete="off"
                      inputClassName="tabular-nums"
                      value={bank.account}
                      onChange={setBankField("account")}
                      error={errors.account}
                    />
                    <TextField
                      label="Routing number"
                      required
                      name="routing"
                      inputMode="numeric"
                      autoComplete="off"
                      maxLength={9}
                      inputClassName="tabular-nums"
                      value={bank.routing}
                      onChange={setBankField("routing")}
                      error={errors.routing}
                    />
                  </div>
                )}

                <div>
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
                    onChange={(event) => {
                      setAmount(cleanAmount(event.target.value));
                      clear("amount");
                    }}
                    error={errors.amount}
                    hint={`${formatMoney(balance)} available${to === "bank" ? `, plus a ${formatMoney(bankFee)} fee` : ""}`}
                  />
                  <div className="mt-3">
                    <QuickAmounts
                      amounts={quick}
                      value={value}
                      onPick={(n) => {
                        setAmount(String(n));
                        clear("amount");
                      }}
                    />
                  </div>
                </div>

                <TextField
                  label="Note"
                  name="note"
                  autoComplete="off"
                  maxLength={80}
                  placeholder="What it's for, if you like"
                  hint="They see it with the money"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                />

                <Button type="submit" block arrow={false} className="mt-auto">
                  Continue
                </Button>
              </form>
            )}

            {/* ── 2. Review ────────────────────────────────────────────── */}
            {step === "review" && (
              <div className="flex flex-1 flex-col gap-5">
                <div className="flex items-center gap-4 rounded-2xl bg-brand-50 p-4 dark:bg-brand/10">
                  {payee.bank ? (
                    <span
                      aria-hidden="true"
                      className="grid size-12 shrink-0 place-items-center rounded-full bg-card text-brand"
                    >
                      <BuildingIcon className="size-5" />
                    </span>
                  ) : (
                    <Avatar person={payee} className="size-12" />
                  )}
                  <div className="min-w-0 flex-1 leading-tight">
                    <p className="text-xs text-muted">You send</p>
                    <p className="mt-1 font-heading text-[1.75rem] leading-tight font-semibold text-headline tabular-nums">
                      {formatMoney(value)}
                    </p>
                    <p className="mt-1 truncate text-sm text-content">
                      to{" "}
                      <span className="font-semibold text-headline">
                        {payee.name}
                      </span>
                    </p>
                  </div>
                </div>

                <dl className="divide-y divide-dashed divide-line">
                  <Line label="To" hint={payee.detail}>
                    {payee.name}
                  </Line>
                  <Line label="Arrives">
                    {to === "user" ? "Instantly" : "In 1 to 2 business days"}
                  </Line>
                  <Line
                    label="Fee"
                    hint={
                      to === "user"
                        ? "Free between StripCard users"
                        : "Bank transfer"
                    }
                  >
                    {formatMoney(fee)}
                  </Line>
                  {note.trim() && <Line label="Note">{note.trim()}</Line>}
                  <Line label="Total from your wallet">
                    {formatMoney(total)}
                  </Line>
                  <Line label="Balance after" strong>
                    {formatMoney(cents(balance - total))}
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
                    onClick={send}
                    className="disabled:cursor-wait disabled:opacity-70 @min-[30rem]:flex-1"
                  >
                    {busy ? "Sending" : `Send ${formatMoney(value)}`}
                  </Button>
                </div>
              </div>
            )}

            {/* ── 3. Done ──────────────────────────────────────────────── */}
            {step === "done" && done && (
              <Result
                done={done.instant}
                figure={formatMoney(done.amount)}
                line={
                  done.instant
                    ? `sent to ${done.name}`
                    : `on its way to ${done.name}`
                }
                note={
                  done.instant
                    ? `It is in their StripCard wallet now. Your balance is ${formatMoney(balance)}.`
                    : `${done.detail}. Bank transfers arrive in 1 to 2 business days.`
                }
              >
                <Button
                  type="button"
                  variant="outline"
                  arrow={false}
                  onClick={again}
                >
                  Send more money
                </Button>
                <Button href="/dashboard" arrow={false}>
                  Back to dashboard
                </Button>
              </Result>
            )}
          </div>
        </Panel>

        <TransferInfo
          balance={balance}
          used={used}
          pending={step === "done" ? 0 : value}
        />
      </div>
    </div>
  );
}
