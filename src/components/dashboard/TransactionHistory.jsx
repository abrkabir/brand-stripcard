"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { Panel } from "@/components/dashboard/Panel";
import { ChevronDownIcon } from "@/components/icons";
import { history, historyFilters } from "@/data/dashboard";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";

/** How each status reads: its label, its pill and the colour of its dot. */
const STATUS = {
  completed: { label: "Completed", pill: "bg-success/12", dot: "bg-success" },
  pending: { label: "Pending", pill: "bg-brand-50 dark:bg-brand/15", dot: "bg-brand" },
  blocked: { label: "Blocked", pill: "bg-danger/10", dot: "bg-danger" },
};

/**
 * Every transaction (the transactions page) as a table whose cells each carry
 * two lines: who or what
 * (a photo for people, a logo for merchants) and what kind of transaction it
 * was; the card that paid and its last four; the date and the time; its
 * status; and the amount (money in green, a blocked payment red). The filter
 * narrows it to money in or out; rows highlight on hover.
 *
 * The columns go by the panel's own width: in a narrow one the card, date
 * and status step aside, the date moving under the name and the status under
 * the amount, so nothing is lost.
 */
export function TransactionHistory({ className }) {
  const [filter, setFilter] = useState("all");
  const id = useId();

  const rows = history.filter((row) => filter === "all" || (filter === "in" ? row.amount > 0 : row.amount < 0));

  const select = (
    <span className="relative">
      <label htmlFor={id} className="sr-only">
        Show
      </label>
      <select
        id={id}
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
        className="h-10 cursor-pointer appearance-none rounded-full border border-line bg-card pr-9 pl-4 text-sm font-medium text-headline transition-colors hover:border-headline/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        {historyFilters.map((option) => (
          <option key={option.id} value={option.id}>
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

  const cell = "py-3 group-hover:bg-canvas";
  const under = "mt-0.5 block text-xs text-muted";

  return (
    <Panel
      id="history-title"
      title="All transactions"
      subtitle="Every payment, top-up and transfer, newest first"
      actions={select}
      className={className}
    >
      <div className="-mx-2">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs text-muted">
              <th scope="col" className="pb-2 pl-2 font-medium">Transaction</th>
              <th scope="col" className="hidden pb-2 font-medium @lg:table-cell">Card</th>
              <th scope="col" className="hidden pb-2 font-medium @xl:table-cell">Date</th>
              <th scope="col" className="hidden pb-2 font-medium @2xl:table-cell">Status</th>
              <th scope="col" className="pr-2 pb-2 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const status = STATUS[row.status];
              const blocked = row.status === "blocked";
              const sign = row.amount > 0 ? "+" : "−";
              return (
                <tr key={row.id} className="group">
                  <td className={cn(cell, "rounded-l-2xl pr-3 pl-2")}>
                    <span className="flex items-center gap-3">
                      {row.avatar ? (
                        <Image src={row.avatar} alt="" sizes="40px" className="size-10 shrink-0 rounded-full object-cover object-top" />
                      ) : (
                        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-hero-ink text-white dark:bg-white/10">
                          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[1.125rem] fill-current">
                            <path d={row.logo.path} />
                          </svg>
                        </span>
                      )}
                      <span className="min-w-0 leading-tight">
                        <span className="block truncate text-sm font-semibold text-headline">{row.name}</span>
                        <span className={under}>
                          {row.kind}
                          <span className="@xl:hidden">, {row.date}</span>
                        </span>
                      </span>
                    </span>
                  </td>
                  <td className={cn(cell, "hidden pr-3 leading-tight @lg:table-cell")}>
                    <span className="block text-sm font-medium text-headline">{row.card ? row.card.name : "Wallet"}</span>
                    <span className={cn(under, "tabular-nums")}>{row.card ? `•••• ${row.card.last4}` : "Balance"}</span>
                  </td>
                  <td className={cn(cell, "hidden pr-3 leading-tight whitespace-nowrap @xl:table-cell")}>
                    <span className="block text-sm text-headline">{row.date}</span>
                    <span className={under}>{row.time}</span>
                  </td>
                  <td className={cn(cell, "hidden pr-3 @2xl:table-cell")}>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-headline",
                        status.pill,
                      )}
                    >
                      <span aria-hidden="true" className={cn("size-1.5 rounded-full", status.dot)} />
                      {status.label}
                    </span>
                  </td>
                  <td className={cn(cell, "rounded-r-2xl pr-2 text-right leading-tight")}>
                    <span
                      className={cn(
                        "block text-sm font-semibold whitespace-nowrap tabular-nums",
                        blocked ? "text-danger" : row.amount > 0 ? "text-success" : "text-headline",
                      )}
                    >
                      {sign}
                      {formatMoney(Math.abs(row.amount))}
                    </span>
                    <span className={cn(under, "@2xl:hidden", blocked && "text-danger")}>{status.label}</span>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="py-10 text-center text-sm text-muted">
                  Nothing here yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
