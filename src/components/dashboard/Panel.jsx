import Link from "next/link";
import { ArrowUpRightIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

/**
 * The white card every dashboard widget sits in: a title (with an optional
 * icon before it and a subtitle under it), the widget's own controls on the
 * right, and a round arrow that opens the full page for it.
 *
 *   id        the title's id, so the section is labelled by it
 *   link      { href, label } for the arrow; `label` is its accessible name
 *   actions   controls set before the arrow (a toggle, a filter)
 *
 * In a narrow card the controls drop to a row of their own under the title
 * and the arrow stays top right. The card measures itself (a container
 * query), so this holds wherever the grid puts it.
 *
 * The body grows to fill the card, so cards sharing a grid row keep their
 * content anchored however tall the row is.
 */
export function Panel({ id, title, subtitle, icon, link, actions, className, children }) {
  return (
    <section
      aria-labelledby={id}
      className={cn("@container flex flex-col rounded-[1.75rem] bg-card p-5 sm:p-6", className)}
    >
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {icon && (
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-canvas text-headline">{icon}</span>
          )}
          <div className="min-w-0">
            <h2 id={id} className="truncate font-heading text-lg leading-tight font-semibold text-headline">
              {title}
            </h2>
            {subtitle && <p className="mt-0.5 truncate text-xs text-muted">{subtitle}</p>}
          </div>
        </div>
        {actions && (
          <div className="order-last flex basis-full items-center gap-2 @min-[21rem]:order-none @min-[21rem]:basis-auto">{actions}</div>
        )}
        {link && (
          <Link
            href={link.href}
            aria-label={link.label}
            title={link.label}
            className="grid size-10 shrink-0 place-items-center rounded-full border border-line text-headline transition-colors hover:border-headline hover:bg-headline hover:text-page focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <ArrowUpRightIcon className="size-[18px]" />
          </Link>
        )}
      </div>
      <div className="mt-4 flex flex-1 flex-col">{children}</div>
    </section>
  );
}
