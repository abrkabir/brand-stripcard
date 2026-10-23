"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";
import { Status } from "@/components/dashboard/FormField";
import { Modal, ModalHead } from "@/components/dashboard/Modal";
import {
  isStopped,
  StatusBadge,
  statusLabel,
  statusTone,
} from "@/components/dashboard/StatusBadge";
import {
  CheckIcon,
  CopyIcon,
  DownloadIcon,
  HelpCircleIcon,
} from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { dashboardUser, help } from "@/data/dashboard";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import { downloadReceiptPdf } from "@/lib/receipt";
import { siteConfig } from "@/lib/site";

/** A transaction's amount, signed: "+$50.00", "−$15.49". */
export const signedAmount = (row) =>
  `${row.amount > 0 ? "+" : "−"}${formatMoney(Math.abs(row.amount))}`;

/** What paid: the card and its last four, or the wallet. */
const paidWith = (row) =>
  row.card ? `${row.card.name} card •••• ${row.card.last4}` : "Wallet balance";

/** A transaction's party: a photo for a person, a logo for a merchant. Size it with `className`. */
export function TransactionParty({ row, className = "size-10" }) {
  return row.avatar ? (
    <Image
      src={row.avatar}
      alt=""
      sizes="64px"
      className={cn("shrink-0 rounded-full object-cover object-top", className)}
    />
  ) : (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-full bg-hero-ink text-white dark:bg-white/10",
        className,
      )}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-[45%] fill-current"
      >
        <path d={row.logo.path} />
      </svg>
    </span>
  );
}

/**
 * Saves a transaction's receipt as a PDF (see lib/receipt): who it was with,
 * what it was, the amount and its status; its reference, when, what paid and
 * whose account it is; a line on what a pending, blocked or canceled one
 * means; and a thank-you. Resolves once the file is handed to the browser.
 */
export function downloadReceipt(row) {
  const stopped = isStopped(row.status);
  return downloadReceiptPdf({
    ref: row.ref,
    name: row.name,
    kind: row.kind,
    amount: signedAmount(row),
    tone: stopped ? "stopped" : row.amount > 0 ? "in" : "out",
    struck: stopped,
    status: statusLabel(row.status),
    statusTone: statusTone(row.status),
    details: [
      ["Reference", `#${row.ref}`],
      ["Date", `${row.date}, ${row.time}`],
      ["Type", row.kind],
      ["Paid with", paidWith(row)],
      ["Account", `${dashboardUser.name}, ${dashboardUser.email}`],
    ],
    note: statusNote(row),
    supportEmail: help.contact.email,
    company: siteConfig.legalName,
    fileName: `stripcard-receipt-${row.ref}.pdf`,
  });
}

/** A line of the details: what it is, and its value. */
function Detail({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="min-w-0 text-right text-sm font-medium text-headline">
        {children}
      </dd>
    </div>
  );
}

/** What a pending, blocked or canceled transaction means, in a line. */
function statusNote(row) {
  if (row.status === "blocked")
    return row.card
      ? `This payment was stopped by the controls on your ${row.card.name} card, so nothing was charged.`
      : "This payment was stopped, so nothing was charged.";
  if (row.status === "canceled")
    return "This payment was canceled before it went through, so nothing was charged.";
  if (row.status === "pending")
    return "This is on its way and usually completes within 1 to 2 business days.";
  return null;
}

/**
 * A transaction's details, in a modal: who it was with (photo or logo), what
 * it was, the amount (money in green, a blocked or canceled payment red and
 * struck through) and its status; then its reference (copied in a tap), the
 * date and time, the type and what paid; a line on what a pending, blocked
 * or canceled one means; and ways to download its receipt (a PDF) or report
 * a problem with it. Mount it only while it is open (see Modal).
 */
export function TransactionDialog({ row, onClose }) {
  const id = useId();
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);
  const stopped = isStopped(row.status);
  const note = statusNote(row);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(row.ref);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const save = async () => {
    setSaving(true);
    setFailed(false);
    try {
      await downloadReceipt(row);
    } catch {
      setFailed(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal labelledBy={`${id}-title`} onClose={onClose}>
      {(close) => (
        <div className="p-5 sm:p-6">
          <ModalHead
            id={`${id}-title`}
            title="Transaction details"
            subtitle={`#${row.ref}`}
            onClose={close}
          />

          {/* Who, what, and how much. */}
          <div className="mt-5 flex flex-col items-center rounded-2xl bg-canvas/60 px-5 py-6 text-center">
            <TransactionParty row={row} className="size-14" />
            <p className="mt-3 font-heading text-lg leading-tight font-semibold text-headline">
              {row.name}
            </p>
            <p className="mt-1 text-xs text-muted">{row.kind}</p>
            <p
              className={cn(
                "mt-4 font-heading text-[2rem] leading-none font-semibold tabular-nums",
                stopped
                  ? "text-danger line-through decoration-danger/40"
                  : row.amount > 0
                    ? "text-success"
                    : "text-headline",
              )}
            >
              {signedAmount(row)}
            </p>
            <div className="mt-3">
              <StatusBadge status={row.status} />
            </div>
          </div>

          <dl className="mt-4 divide-y divide-dashed divide-line">
            <Detail label="Reference">
              <span className="inline-flex items-center gap-2">
                <span className="tabular-nums">#{row.ref}</span>
                <button
                  type="button"
                  onClick={copy}
                  aria-label={copied ? "Reference copied" : "Copy reference"}
                  className="grid size-7 cursor-pointer place-items-center rounded-full text-muted transition-colors hover:bg-canvas hover:text-headline focus-visible:outline-2 focus-visible:outline-brand"
                >
                  {copied ? (
                    <CheckIcon className="size-3.5 text-success" />
                  ) : (
                    <CopyIcon className="size-3.5" />
                  )}
                </button>
              </span>
            </Detail>
            <Detail label="Date">
              <span className="tabular-nums">
                {row.date}, {row.time}
              </span>
            </Detail>
            <Detail label="Type">{row.kind}</Detail>
            <Detail label="Paid with">
              <span className="tabular-nums">{paidWith(row)}</span>
            </Detail>
          </dl>

          {note && (
            <p
              className={cn(
                "mt-4 rounded-2xl px-4 py-3 text-sm leading-relaxed",
                stopped
                  ? "bg-danger/8 text-danger"
                  : "bg-warning/15 text-content dark:bg-warning/10",
              )}
            >
              {note}
            </p>
          )}

          {failed && (
            <Status tone="danger" className="mt-4">
              Could not make the receipt. Please try again.
            </Status>
          )}

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              href="/dashboard/help"
              variant="outline"
              size="sm"
              arrow={false}
            >
              <HelpCircleIcon aria-hidden="true" className="size-4" />
              Report a problem
            </Button>
            <Button
              type="button"
              size="sm"
              arrow={false}
              onClick={save}
              disabled={saving}
            >
              <DownloadIcon aria-hidden="true" className="size-4" />
              {saving ? "Preparing receipt" : "Download receipt"}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
