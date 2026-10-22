"use client";

import { useId, useState } from "react";
import { Accordion } from "@/components/dashboard/Accordion";
import { Status } from "@/components/dashboard/FormField";
import { Modal, ModalHead } from "@/components/dashboard/Modal";
import { cents, Line, Segmented } from "@/components/dashboard/MoneyParts";
import { Panel } from "@/components/dashboard/Panel";
import {
  CheckIcon,
  HelpCircleIcon,
  LayersIcon,
  SparklesIcon,
} from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { plans, wallet } from "@/data/dashboard";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";

const { list, compare, questions, yearlyDiscount } = plans;

/** How long the demo pretends to change the plan, in milliseconds. */
const CHANGE_MS = 900;

const BILLING = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: `Yearly, save ${yearlyDiscount * 100}%` },
];

const rank = (id) => list.findIndex((p) => p.id === id);

/** What a plan costs on a billing: per month, and what each charge is. */
function priceOf(plan, billing) {
  if (!plan.monthly) return { perMonth: 0, charge: 0 };
  if (billing === "monthly")
    return { perMonth: plan.monthly, charge: plan.monthly };
  const charge = cents(plan.monthly * 12 * (1 - yearlyDiscount));
  return { perMonth: cents(charge / 12), charge };
}

/** The date a plan started today renews on: a month or a year on. */
function renewsOn(billing) {
  const date = new Date();
  if (billing === "yearly") date.setFullYear(date.getFullYear() + 1);
  else date.setMonth(date.getMonth() + 1);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/* ── A plan ──────────────────────────────────────────────────────────────── */

/**
 * A plan as a card: its name and line, its price on the billing chosen, what
 * it includes, and the way to move to it (or that it is yours). The popular
 * plan is the dark one, lit from the corner, as the membership card is.
 */
function PlanCard({ plan, billing, current, onChoose }) {
  const dark = plan.popular;
  const mine = plan.id === current;
  const up = rank(plan.id) > rank(current);
  const { perMonth, charge } = priceOf(plan, billing);

  return (
    <article
      aria-labelledby={`plan-${plan.id}`}
      className={cn(
        "relative isolate flex flex-col overflow-hidden rounded-[1.5rem] p-6",
        dark
          ? "bg-hero-ink text-white shadow-[0_24px_48px_-24px_rgb(12_5_3/0.7)]"
          : "bg-card ring-1 ring-line ring-inset",
        mine && !dark && "ring-2 ring-brand",
      )}
    >
      {dark && (
        <>
          <span
            aria-hidden="true"
            className="absolute -top-24 -right-20 -z-10 size-72 rounded-full bg-[radial-gradient(closest-side,rgb(242_106_27/0.7),rgb(242_106_27/0.15)_55%,rgb(242_106_27/0))]"
          />
          <span
            aria-hidden="true"
            className="bg-grain absolute inset-0 -z-10 opacity-[0.08]"
          />
        </>
      )}

      <div className="flex items-center justify-between gap-3">
        <h3
          id={`plan-${plan.id}`}
          className={cn(
            "font-heading text-2xl font-semibold",
            dark ? "text-white" : "text-headline",
          )}
        >
          {plan.name}
        </h3>
        {mine ? (
          <span
            className={cn(
              "inline-flex h-6 items-center gap-1 rounded-full px-2.5 text-xs font-semibold",
              dark
                ? "bg-white/15 text-white"
                : "bg-brand-50 text-brand-700 dark:bg-brand/15 dark:text-brand-300",
            )}
          >
            <CheckIcon aria-hidden="true" className="size-3" strokeWidth={3} />
            Your plan
          </span>
        ) : (
          plan.popular && (
            <span className="inline-flex h-6 items-center gap-1 rounded-full bg-brand px-2.5 text-xs font-semibold text-white">
              <SparklesIcon aria-hidden="true" className="size-3" />
              Most popular
            </span>
          )
        )}
      </div>
      <p
        className={cn(
          "mt-1.5 min-h-10 text-sm",
          dark ? "text-white/65" : "text-muted",
        )}
      >
        {plan.tagline}
      </p>

      <p className="mt-5 flex items-baseline gap-1.5">
        <span className="font-heading text-[2.75rem] leading-none font-semibold tracking-[-0.02em] tabular-nums">
          {perMonth ? formatMoney(perMonth) : "Free"}
        </span>
        <span className={cn("text-sm", dark ? "text-white/60" : "text-muted")}>
          {perMonth ? "a month" : "for good"}
        </span>
      </p>
      <p
        className={cn(
          "mt-1.5 h-4 text-xs",
          dark ? "text-white/55" : "text-muted",
        )}
      >
        {perMonth && billing === "yearly"
          ? `Billed ${formatMoney(charge)} a year`
          : perMonth
            ? "Billed monthly"
            : ""}
      </p>

      <ul
        className={cn(
          "mt-6 flex flex-1 flex-col gap-3 border-t pt-6",
          dark ? "border-white/10" : "border-line",
        )}
      >
        {plan.features.map((feature) => (
          <li
            key={feature}
            className={cn(
              "flex items-start gap-2.5 text-sm",
              dark ? "text-white/85" : "text-content",
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "mt-px grid size-[1.125rem] shrink-0 place-items-center rounded-full",
                dark
                  ? "bg-brand text-white"
                  : "bg-brand-50 text-brand-700 dark:bg-brand/15 dark:text-brand-300",
              )}
            >
              <CheckIcon className="size-2.5" strokeWidth={3} />
            </span>
            {feature}
          </li>
        ))}
      </ul>

      <div className="mt-7">
        {mine ? (
          <button
            type="button"
            disabled
            className={cn(
              "flex h-12 w-full items-center justify-center rounded-full text-sm font-semibold",
              dark ? "bg-white/10 text-white/70" : "bg-canvas text-muted",
            )}
          >
            Your current plan
          </button>
        ) : (
          <Button
            type="button"
            block
            arrow={up}
            variant={up ? "base" : "outline"}
            onClick={() => onChoose(plan.id)}
            className={cn(!up && dark && "border-white/30 text-white")}
          >
            {up ? `Upgrade to ${plan.name}` : `Switch to ${plan.name}`}
          </Button>
        )}
      </div>
    </article>
  );
}

/* ── Changing plan ───────────────────────────────────────────────────────── */

/**
 * Moving to a plan, in a modal: the plan, its billing (changeable here), what
 * is due today from the wallet and when it renews, then confirm. Moving down
 * to the free plan charges nothing, and says when the paid perks end. Done,
 * it says so and lists what the plan includes.
 */
function ChangeDialog({
  plan,
  current,
  billing: initialBilling,
  balance,
  onConfirm,
  onClose,
}) {
  const id = useId();
  const [billing, setBilling] = useState(initialBilling);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const up = rank(plan.id) > rank(current);
  const from = list[rank(current)];
  const { charge } = priceOf(plan, billing);
  const short = charge > balance;

  const confirm = () => {
    if (short) return;
    setBusy(true);
    window.setTimeout(() => {
      onConfirm(plan.id, charge);
      setBusy(false);
      setDone(true);
    }, CHANGE_MS);
  };

  return (
    <Modal labelledBy={`${id}-title`} onClose={onClose}>
      {(close) => (
        <div className="p-5 sm:p-6">
          <ModalHead
            id={`${id}-title`}
            title={
              done
                ? `You are on ${plan.name}`
                : up
                  ? `Upgrade to ${plan.name}`
                  : `Switch to ${plan.name}`
            }
            subtitle={
              done ? "Here is what your plan includes" : `From ${from.name}`
            }
            onClose={close}
          />

          {done ? (
            <div role="status" className="mt-5 motion-safe:animate-pop-in">
              <ul className="space-y-2.5 rounded-2xl bg-canvas/60 p-4">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm text-content"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-px grid size-[1.125rem] shrink-0 place-items-center rounded-full bg-success/12 text-success"
                    >
                      <CheckIcon className="size-2.5" strokeWidth={3} />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-muted">
                {charge
                  ? `${formatMoney(charge)} was paid from your wallet. It renews on ${renewsOn(billing)}.`
                  : "Nothing more to pay. You can upgrade again at any time."}
              </p>
              <div className="mt-6 flex justify-end">
                <Button type="button" size="sm" arrow={false} onClick={close}>
                  Done
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="mt-5 flex items-center gap-3 rounded-2xl bg-brand-50 p-4 dark:bg-brand/10">
                <span
                  aria-hidden="true"
                  className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand text-white"
                >
                  <SparklesIcon className="size-5" />
                </span>
                <div className="min-w-0 leading-tight">
                  <p className="font-heading text-lg font-semibold text-headline">
                    {plan.name}
                  </p>
                  <p className="mt-1 text-xs text-muted">{plan.tagline}</p>
                </div>
              </div>

              {plan.monthly > 0 && (
                <Segmented
                  name="billing"
                  label="Billing"
                  value={billing}
                  onChange={setBilling}
                  options={BILLING}
                  className="mt-4"
                />
              )}

              <dl className="mt-5 divide-y divide-dashed divide-line">
                <Line label="Plan">{plan.name}</Line>
                {plan.monthly > 0 && (
                  <Line label="Billing">
                    {billing === "yearly" ? "Yearly" : "Monthly"}
                  </Line>
                )}
                <Line label={plan.monthly ? "Renews on" : "Takes effect"}>
                  {plan.monthly ? renewsOn(billing) : "Today"}
                </Line>
                <Line
                  label="From your wallet"
                  hint={`${formatMoney(balance)} available`}
                >
                  {formatMoney(balance - charge)} after
                </Line>
                <Line label="Due today" strong>
                  {formatMoney(charge)}
                </Line>
              </dl>
              {short && (
                <Status tone="danger" className="mt-3">
                  Your wallet has {formatMoney(balance)}. Add money first.
                </Status>
              )}
              {!up && (
                <p className="mt-3 text-xs text-muted">
                  Cards over the new plan&apos;s limit are frozen, not deleted.
                  You can move back at any time.
                </p>
              )}

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  arrow={false}
                  onClick={close}
                  disabled={busy}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  arrow={false}
                  onClick={confirm}
                  disabled={busy || short}
                  aria-busy={busy || undefined}
                  className="disabled:opacity-60 aria-busy:cursor-wait"
                >
                  {busy
                    ? "Changing your plan"
                    : charge
                      ? `Pay ${formatMoney(charge)} and ${up ? "upgrade" : "switch"}`
                      : `Switch to ${plan.name}`}
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </Modal>
  );
}

/* ── The page ────────────────────────────────────────────────────────────── */

/** A value in the comparison: a tick, a blank, or the text. */
function Cell({ value }) {
  if (value === true)
    return (
      <span className="inline-grid size-5 place-items-center rounded-full bg-success/12 text-success">
        <CheckIcon aria-hidden="true" className="size-3" strokeWidth={3} />
        <span className="sr-only">Included</span>
      </span>
    );
  if (value === false)
    return (
      <span className="inline-block size-5 rounded-full ring-1 ring-line ring-inset">
        <span className="sr-only">Not included</span>
      </span>
    );
  return <span className="font-medium text-headline">{value}</span>;
}

/**
 * The Premium plan page: the plans as cards, monthly or yearly (yearly for
 * less), each with the way to move to it; under them, the plans side by
 * side, feature by feature, and the questions people ask before changing.
 *
 * DEMO: nothing is charged. Changing plan waits a moment, then takes the
 * charge off the balance shown and marks the new plan as yours.
 */
export function PremiumPlans() {
  const [current, setCurrent] = useState(plans.current);
  const [billing, setBilling] = useState("monthly");
  const [balance, setBalance] = useState(wallet.balance);
  const [changing, setChanging] = useState(null);
  const changingPlan = list.find((p) => p.id === changing);

  return (
    <div className="@container flex flex-col gap-4 lg:gap-5">
      <Panel
        id="plans-title"
        title="Choose your plan"
        subtitle={`You are on ${list[rank(current)].name}. Change or cancel at any time.`}
        icon={<SparklesIcon className="size-[18px]" />}
        actions={
          <Segmented
            name="page-billing"
            label="Billing"
            value={billing}
            onChange={setBilling}
            options={BILLING}
            className="w-full @min-[34rem]:w-80"
          />
        }
      >
        <div className="mt-2 grid gap-4 @min-[56rem]:grid-cols-3">
          {list.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              billing={billing}
              current={current}
              onChoose={setChanging}
            />
          ))}
        </div>
      </Panel>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-4 lg:gap-5 @min-[60rem]:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <Panel
          id="compare-title"
          title="Compare plans"
          subtitle="Everything each plan includes"
          icon={<LayersIcon className="size-[18px]" />}
        >
          <div className="relative -mx-1 overflow-x-auto px-1 [scrollbar-width:thin]">
            <table className="w-full min-w-[32rem] text-sm">
              <caption className="sr-only">What each plan includes</caption>
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="w-[38%] pb-3 text-left text-xs font-medium text-muted"
                  >
                    Feature
                  </th>
                  {list.map((plan) => (
                    <th
                      key={plan.id}
                      scope="col"
                      className={cn(
                        "rounded-t-xl px-2 pt-2 pb-3 text-center text-sm font-semibold text-headline",
                        plan.id === current && "bg-brand-50 dark:bg-brand/10",
                      )}
                    >
                      {plan.name}
                      {plan.id === current && (
                        <span className="mt-0.5 block text-[0.6875rem] font-medium text-brand-700 dark:text-brand-300">
                          Your plan
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-dashed divide-line">
                {compare.map((row, r) => (
                  <tr key={row.label}>
                    <th
                      scope="row"
                      className="py-3.5 pr-3 text-left font-normal text-content"
                    >
                      {row.label}
                    </th>
                    {row.values.map((value, i) => (
                      <td
                        key={list[i].id}
                        className={cn(
                          "px-2 py-3.5 text-center tabular-nums",
                          list[i].id === current &&
                            "bg-brand-50 dark:bg-brand/10",
                          list[i].id === current &&
                            r === compare.length - 1 &&
                            "rounded-b-xl",
                        )}
                      >
                        <Cell value={value} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel
          id="plan-questions-title"
          title="Before you change"
          subtitle="What people ask most"
          icon={<HelpCircleIcon className="size-[18px]" />}
        >
          <Accordion items={questions} open={0} />
        </Panel>
      </div>

      {changingPlan && (
        <ChangeDialog
          key={changingPlan.id}
          plan={changingPlan}
          current={current}
          billing={billing}
          balance={balance}
          onConfirm={(id, charge) => {
            setCurrent(id);
            setBalance((b) => cents(b - charge));
          }}
          onClose={() => setChanging(null)}
        />
      )}
    </div>
  );
}
