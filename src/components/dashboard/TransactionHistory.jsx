"use client";

import { useEffect, useState } from "react";
import { ActionMenu } from "@/components/dashboard/ActionMenu";
import { CellLines, DataTable } from "@/components/dashboard/DataTable";
import { FilterSelect, SearchInput } from "@/components/dashboard/FormField";
import { Panel } from "@/components/dashboard/Panel";
import {
  isStopped,
  StatusBadge,
  statusLabel,
} from "@/components/dashboard/StatusBadge";
import {
  downloadReceipt,
  signedAmount,
  TransactionDialog,
  TransactionParty,
} from "@/components/dashboard/TransactionDialog";
import {
  CopyIcon,
  DownloadIcon,
  EyeIcon,
  HelpCircleIcon,
} from "@/components/icons";
import { history, historyFilters } from "@/data/dashboard";
import { cn } from "@/lib/cn";

/** Whether a row passes the filter. */
const passes = (row, filter) =>
  filter === "all"
    ? true
    : filter === "in"
      ? row.amount > 0
      : filter === "out"
        ? row.amount < 0
        : row.status === filter;

/** Whether a row matches what was searched: its name, kind, card, reference or amount. */
function matches(row, q) {
  if (!q) return true;
  const hay = [
    row.name,
    row.kind,
    row.ref,
    row.card ? `${row.card.name} ${row.card.last4}` : "wallet balance",
    row.date,
    Math.abs(row.amount).toFixed(2),
  ]
    .join(" ")
    .toLowerCase();
  return hay.includes(q);
}

/**
 * The columns. In a narrow panel the type, what paid, the date and the status
 * step aside: the type and date move under the name, the status under the
 * amount, so nothing is lost.
 */
const COLUMNS = [
  {
    key: "party",
    header: "Transaction",
    // Takes the room the others leave while the panel is narrow; from 64rem
    // up every column is as wide as its content needs.
    grow: true,
    className: "@5xl:w-auto @5xl:max-w-none",
    cell: (row) => (
      <span className="flex items-center gap-3">
        <TransactionParty row={row} />
        <CellLines
          main={row.name}
          figures
          under={
            <>
              <span className="@3xl:hidden">
                {row.kind}
                <span className="@xl:hidden">, {row.date}</span>
              </span>
              <span className="hidden @3xl:inline">#{row.ref}</span>
            </>
          }
        />
      </span>
    ),
  },
  {
    key: "kind",
    header: "Type",
    className: "hidden @3xl:table-cell",
    cell: (row) => (
      <span className="text-sm whitespace-nowrap text-content">{row.kind}</span>
    ),
  },
  {
    key: "card",
    header: "Paid with",
    className: "hidden @lg:table-cell",
    cell: (row) => (
      <CellLines
        main={row.card ? row.card.name : "Wallet"}
        under={row.card ? `•••• ${row.card.last4}` : "Balance"}
        strong={false}
        figures
      />
    ),
  },
  {
    key: "date",
    header: "Date",
    className: "hidden whitespace-nowrap @xl:table-cell",
    cell: (row) => (
      <CellLines main={row.date} under={row.time} strong={false} figures />
    ),
  },
  {
    key: "status",
    header: "Status",
    className: "hidden @2xl:table-cell",
    cell: (row) => <StatusBadge status={row.status} />,
  },
  {
    key: "amount",
    header: "Amount",
    align: "right",
    cell: (row) => {
      const stopped = isStopped(row.status);
      return (
        <span className="block leading-tight">
          <span
            className={cn(
              "block text-sm font-semibold whitespace-nowrap tabular-nums",
              stopped
                ? "text-danger line-through decoration-danger/40"
                : row.amount > 0
                  ? "text-success"
                  : "text-headline",
            )}
          >
            {signedAmount(row)}
          </span>
          <span
            className={cn(
              "mt-1 block text-xs text-muted @2xl:hidden",
              stopped && "text-danger",
            )}
          >
            {statusLabel(row.status)}
          </span>
        </span>
      );
    },
  },
];

/** How long a note at the foot of the window stays, in milliseconds. */
const NOTE_MS = 2200;

/**
 * Every transaction (the transactions page): in the panel's head, a search
 * (by name, kind, card, reference or amount) and a filter (money in or out,
 * pending, blocked, canceled); under it every transaction in a boxed table (see
 * DataTable), newest first. A row opens its details in a dialog (see
 * TransactionDialog); the three dots at its end open its actions: view the
 * details, copy the reference, download the receipt, or report a problem.
 */
export function TransactionHistory({ className }) {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState(null);
  const [note, setNote] = useState(null);

  const q = query.trim().toLowerCase();
  const rows = history.filter((row) => passes(row, filter) && matches(row, q));
  const open = history.find((row) => row.id === openId);

  // A note at the foot of the window ("Reference copied") goes on its own.
  useEffect(() => {
    if (!note) return;
    const timer = window.setTimeout(() => setNote(null), NOTE_MS);
    return () => window.clearTimeout(timer);
  }, [note]);

  const copyRef = async (row) => {
    try {
      await navigator.clipboard.writeText(row.ref);
      setNote(`Reference ${row.ref} copied`);
    } catch {
      setNote("Could not copy the reference");
    }
  };

  const saveReceipt = async (row) => {
    try {
      await downloadReceipt(row);
      setNote(`Receipt for ${row.ref} downloaded`);
    } catch {
      setNote("Could not make the receipt");
    }
  };

  const reset = () => {
    setQuery("");
    setFilter("all");
  };

  return (
    <Panel
      id="history-title"
      title="All transactions"
      subtitle="Every payment, top-up and transfer, newest first"
      wideActions
      actions={
        <div className="flex w-full flex-col gap-2 @min-[30rem]:flex-row @min-[44rem]:w-auto">
          <SearchInput
            label="Search transactions"
            placeholder="Search transactions"
            value={query}
            onChange={setQuery}
            className="min-w-0 flex-1 @min-[44rem]:w-64 @min-[44rem]:flex-none"
          />
          <FilterSelect
            label="Show"
            value={filter}
            onChange={setFilter}
            options={historyFilters}
            className="@min-[30rem]:w-48"
          />
        </div>
      }
      className={className}
    >
      <DataTable
        columns={COLUMNS}
        rows={rows}
        caption={`Transactions, ${rows.length} in all. Choose a row to see its details.`}
        onRowClick={(row) => setOpenId(row.id)}
        actions={(row) => (
          <ActionMenu
            label={`Actions for ${row.name}, ${row.ref}`}
            items={[
              {
                label: "View details",
                icon: EyeIcon,
                onSelect: () => setOpenId(row.id),
              },
              {
                label: "Copy reference",
                icon: CopyIcon,
                onSelect: () => copyRef(row),
              },
              {
                label: "Download receipt",
                icon: DownloadIcon,
                onSelect: () => saveReceipt(row),
              },
              {
                label: "Report a problem",
                icon: HelpCircleIcon,
                href: "/dashboard/help",
              },
            ]}
          />
        )}
        empty={
          <>
            <p className="text-sm font-semibold text-headline">
              No transactions match
              {q ? ` “${query.trim()}”` : " that filter"}
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-2 cursor-pointer rounded-md px-1.5 py-0.5 text-sm font-semibold text-brand transition-colors hover:bg-brand/10 focus-visible:outline-2 focus-visible:outline-brand"
            >
              Show all transactions
            </button>
          </>
        }
      />

      {open && (
        <TransactionDialog
          key={open.id}
          row={open}
          onClose={() => setOpenId(null)}
        />
      )}

      <p
        role="status"
        className={cn(
          "pointer-events-none fixed bottom-6 left-1/2 z-[90] -translate-x-1/2 rounded-full bg-headline px-4 py-2.5 text-sm font-semibold text-page shadow-lift transition-[opacity,translate] duration-300",
          note ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
        )}
      >
        {note}
      </p>
    </Panel>
  );
}
