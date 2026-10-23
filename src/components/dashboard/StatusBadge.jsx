import { cn } from "@/lib/cn";

/** Each tone: its tint, and the colour of its dot. */
const TONES = {
  success: { pill: "bg-success/12", dot: "bg-success" },
  warning: { pill: "bg-warning/20 dark:bg-warning/15", dot: "bg-warning" },
  danger: { pill: "bg-danger/12", dot: "bg-danger" },
  brand: { pill: "bg-brand-50 dark:bg-brand/15", dot: "bg-brand" },
  neutral: { pill: "bg-canvas", dot: "bg-subtle" },
};

/**
 * Every status the dashboard shows, by its value: how it reads and its tone.
 * Done is green; waiting (pending, in review) is yellow; stopped (blocked,
 * canceled, failed) is red; an open ticket is the brand's; a closed one grey.
 */
const STATUSES = {
  completed: { label: "Completed", tone: "success" },
  verified: { label: "Verified", tone: "success" },
  answered: { label: "Replied", tone: "success" },
  pending: { label: "Pending", tone: "warning" },
  review: { label: "In review", tone: "warning" },
  blocked: { label: "Blocked", tone: "danger" },
  canceled: { label: "Canceled", tone: "danger" },
  failed: { label: "Failed", tone: "danger" },
  open: { label: "Open", tone: "brand" },
  closed: { label: "Closed", tone: "neutral" },
};

/** How a status reads: "Pending". */
export const statusLabel = (status) => STATUSES[status]?.label ?? status;

/** A status's tone: success, warning, danger, brand or neutral. */
export const statusTone = (status) => STATUSES[status]?.tone ?? "neutral";

/** Whether a status means the money never moved (blocked, canceled, failed). */
export const isStopped = (status) => statusTone(status) === "danger";

/**
 * A status, as a pill: a dot in its tone on a tint of it, and its name. The
 * one badge for every status on the dashboard, so they all look alike.
 *
 *   status    a value from STATUSES ("pending"); sets the name and the tone
 *   tone      overrides the status's tone, or sets one for a badge without a
 *             status
 *   children  overrides the name ("Replied")
 */
export function StatusBadge({ status, tone, className, children }) {
  const look = TONES[tone ?? statusTone(status)];
  return (
    <span
      className={cn(
        "inline-flex h-6 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold whitespace-nowrap text-headline",
        look.pill,
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn("size-1.5 rounded-full", look.dot)}
      />
      {children ?? statusLabel(status)}
    </span>
  );
}
