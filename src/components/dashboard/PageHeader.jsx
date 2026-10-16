import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

/**
 * The row a dashboard page opens with: an optional way back, the title, and
 * the page's own actions on the right (they wrap under the title when there
 * is not room beside it), then a gap before the page's content.
 *
 * From lg up the top bar shows the title with a breadcrumb, so here the title
 * stays for screen readers only and the way back gives way to the breadcrumb.
 * A row left with nothing to show then takes no room, and the content starts
 * right under the top bar, level with the sidebar.
 */
export function PageHeader({ title, back, children }) {
  return (
    <div
      className={cn(
        "mb-5 flex min-h-11 flex-wrap items-center justify-between gap-x-4 gap-y-3",
        !children && "lg:sr-only",
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        {back && (
          <Link
            href={back.href}
            aria-label={back.label}
            className="grid size-11 shrink-0 place-items-center rounded-full bg-card text-headline transition-colors hover:bg-headline hover:text-page focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand lg:hidden"
          >
            <ArrowRightIcon className="size-5 rotate-180" />
          </Link>
        )}
        <h1 className="truncate font-heading text-[1.75rem] leading-tight font-semibold tracking-[-0.02em] text-headline sm:text-[2.125rem] lg:sr-only">
          {title}
        </h1>
      </div>
      {children && <div className="flex flex-wrap items-center gap-2 sm:gap-3">{children}</div>}
    </div>
  );
}
