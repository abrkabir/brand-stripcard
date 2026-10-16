"use client";

import { useId, useState } from "react";
import { ChevronDownIcon } from "@/components/icons";
import { dashboardCards, spendingChange, transactionPeriods, transactions } from "@/data/dashboard";
import { cn } from "@/lib/cn";
import { formatChange, formatMoney } from "@/lib/format";

const STATUS = {
  completed: { label: "Completed", tone: "bg-success/10 text-success" },
  pending: { label: "Pending", tone: "bg-tint-amber text-tint-amber-ink" },
  blocked: { label: "Blocked", tone: "bg-danger/10 text-danger" },
};

const cardById = Object.fromEntries(dashboardCards.map((card) => [card.id, card]));

/**
 * Recent payments, with a line on how spending compares with last week and
 * two filters: the period, and which card. A plain table, so it reads as one
 * to assistive tech; on small screens the card and date columns drop out and
 * the date moves under the merchant.
 */
export function TransactionsTable() {
  const [period, setPeriod] = useState("week");
  const [card, setCard] = useState("all");
  const id = useId();

  const rows = transactions.filter(
    (row) => (period === "month" || row.period === "week") && (card === "all" || row.card === card),
  );
  const down = spendingChange < 0;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id={`${id}-title`} className="font-heading text-xl font-semibold tracking-[-0.01em] text-headline">
          Spending is {down ? "down" : "up"}{" "}
          <span className={down ? "text-success" : "text-danger"}>{formatChange(Math.abs(spendingChange)).slice(1)}</span>
        </h2>
        <div className="flex gap-2">
          <Select
            label="Period"
            value={period}
            onChange={setPeriod}
            options={transactionPeriods.map((p) => ({ value: p.id, label: p.label }))}
          />
          <Select
            label="Card"
            value={card}
            onChange={setCard}
            options={[
              { value: "all", label: "All cards" },
              ...dashboardCards.map((c) => ({ value: c.id, label: c.name })),
            ]}
          />
        </div>
      </div>

      <table aria-labelledby={`${id}-title`} className="mt-4 w-full text-left">
        <thead>
          <tr className="text-xs font-medium text-muted">
            <th scope="col" className="pb-2 font-medium">Merchant</th>
            <th scope="col" className="hidden pb-2 font-medium sm:table-cell">Card</th>
            <th scope="col" className="hidden pb-2 font-medium md:table-cell">Date</th>
            <th scope="col" className="pb-2 text-right font-medium">Amount</th>
            <th scope="col" className="hidden pb-2 pl-4 text-right font-medium sm:table-cell">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const status = STATUS[row.status];
            const c = cardById[row.card];
            return (
              <tr key={row.id} className="border-t border-line first:border-t-0">
                <td className="py-3 pr-3">
                  <span className="flex items-center gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-hero-ink text-white dark:bg-white/10">
                      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-current">
                        <path d={row.merchant.path} />
                      </svg>
                    </span>
                    <span className="min-w-0 leading-tight">
                      <span className="block truncate text-sm font-semibold text-headline">{row.merchant.title}</span>
                      <span className="block truncate text-xs text-muted">
                        {row.category}
                        <span className="md:hidden"> · {row.date}</span>
                      </span>
                    </span>
                  </span>
                </td>
                <td className="hidden py-3 pr-3 text-sm text-content sm:table-cell">•••• {c.last4}</td>
                <td className="hidden py-3 pr-3 text-sm text-content md:table-cell">{row.date}</td>
                <td className="py-3 text-right text-sm font-semibold whitespace-nowrap text-headline tabular-nums">
                  {formatMoney(row.amount)}
                  <span className={cn("mt-1 block text-xs font-medium sm:hidden", status.tone.split(" ").pop())}>
                    {status.label}
                  </span>
                </td>
                <td className="hidden py-3 pl-4 text-right sm:table-cell">
                  <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", status.tone)}>{status.label}</span>
                </td>
              </tr>
            );
          })}
          {rows.length === 0 && (
            <tr>
              <td colSpan={5} className="py-10 text-center text-sm text-muted">
                No payments on this card {period === "week" ? "this week" : "this month"}.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/** A native select dressed as a pill, its label kept for assistive tech. */
function Select({ label, value, onChange, options }) {
  const id = useId();
  return (
    <span className="relative">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 cursor-pointer appearance-none rounded-full border border-line bg-elevated pr-9 pl-4 text-sm font-medium text-headline transition-colors hover:border-headline/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted"
      />
    </span>
  );
}
