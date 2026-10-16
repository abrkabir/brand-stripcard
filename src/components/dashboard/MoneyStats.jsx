import Image from "next/image";
import Link from "next/link";
import { Notch } from "@/components/dashboard/Notch";
import { ArrowUpRightIcon, DownloadIcon, SwapIcon, UploadIcon } from "@/components/icons";
import { moneyStats } from "@/data/dashboard";
import { cn } from "@/lib/cn";
import { formatChange, formatMoney } from "@/lib/format";

/** The same icons the wallet's quick actions use. */
const ICONS = { add: DownloadIcon, transfer: SwapIcon, withdraw: UploadIcon };

/**
 * The cards' look, shared by all three: white warming to a faint peach at the
 * foot (it follows the theme), with its print, small print, icon badge and
 * chip edge.
 */
const LOOK = {
  card: "bg-[linear-gradient(160deg,var(--color-card)_40%,color-mix(in_oklab,var(--color-brand)_8%,var(--color-card))_100%)]",
  ink: "text-headline",
  soft: "text-muted",
  badge: "bg-brand-50 text-brand-700 dark:bg-brand/15 dark:text-brand-300",
  chip: "border-line",
};

/**
 * One month's figure as a card: its name and what the figure is, the total
 * large, its change against last month and how many there were, and the
 * latest one in a chip. Two round buttons sit in notches cut from its right
 * corners: the arrow at the top opens your transactions, the dark one at the
 * foot does the thing itself.
 */
function StatCard({ stat }) {
  const t = LOOK;
  const Icon = ICONS[stat.kind];
  const titleId = `stat-${stat.id}`;

  return (
    <article aria-labelledby={titleId} className={cn("@container relative isolate flex h-full min-h-[16rem] flex-col p-5 @min-[44rem]:min-h-[19rem]", t.ink)}>
      <div aria-hidden="true" className={cn("absolute inset-0 -z-10 rounded-[1.75rem]", t.card)} />

      {/* Its name and what the figure is, clear of the notch at the top. */}
      <div className="pr-14">
        <h3 id={titleId} className={cn("font-heading text-xl leading-tight font-semibold", t.ink)}>
          {stat.label}
        </h3>
        <p className={cn("mt-1 text-sm", t.soft)}>Total transactions</p>
      </div>

      {/* The total and its change, centred. */}
      <div className="my-auto py-5 text-center">
        <p className="font-heading text-[clamp(1.75rem,14cqw,2.25rem)] leading-none font-semibold tracking-[-0.01em] tabular-nums">
          {formatMoney(stat.value)}
        </p>
        <p className={cn("mt-2.5 text-sm", t.soft)}>
          <span className={cn("font-semibold tabular-nums", t.ink)}>{formatChange(stat.change, 0)}</span> vs last month
        </p>
      </div>

      {/* The latest one, clear of the notch at the foot. */}
      <div className="pr-16">
        <p className={cn("truncate text-xs", t.soft)}>{stat.latest.text}</p>
        <p className={cn("mt-1.5 inline-flex items-center gap-2 rounded-full border py-1 pr-3.5 pl-1", t.chip)}>
          {stat.latest.avatar ? (
            <Image src={stat.latest.avatar} alt="" sizes="28px" className="size-7 rounded-full object-cover object-top" />
          ) : (
            <span aria-hidden="true" className={cn("grid size-7 place-items-center rounded-full", t.badge)}>
              <Icon className="size-3.5" />
            </span>
          )}
          <span className="text-sm font-semibold tabular-nums">{formatMoney(stat.latest.amount)}</span>
        </p>
      </div>

      <Notch corner="top">
        <Link
          href="/dashboard/transactions"
          aria-label={`See all ${stat.noun}`}
          className="grid size-12 place-items-center rounded-full bg-card text-headline transition-colors hover:bg-brand-50 hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand dark:hover:bg-brand/15 dark:hover:text-brand-300"
        >
          <ArrowUpRightIcon className="size-5" />
        </Link>
      </Notch>
      <Notch corner="foot">
        <Link
          href={stat.href}
          aria-label={stat.action}
          className="grid size-12 place-items-center rounded-full bg-hero-ink text-white transition-colors hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand dark:bg-white dark:text-hero-ink dark:hover:bg-white/85"
        >
          <Icon className="size-5" />
        </Link>
      </Notch>
    </article>
  );
}

/**
 * This month at a glance: money added, transferred and withdrawn, as three
 * cards. On the overview's wide layout (its `page` container, beside the
 * wallet) all three stand side by side; below that, two to a row, the third
 * across the full width under them; on a phone, one under another. A Server
 * Component.
 */
export function MoneyStats({ className }) {
  return (
    <section aria-labelledby="money-stats-title" className={cn("@container", className)}>
      <h2 id="money-stats-title" className="sr-only">
        Money this month
      </h2>
      <ul className="grid h-full gap-4 lg:gap-5 @min-[30rem]:grid-cols-2 @min-[70rem]/page:grid-cols-3">
        {moneyStats.map((stat) => (
          <li key={stat.id} className="@min-[30rem]:last:col-span-2 @min-[70rem]/page:last:col-span-1">
            <StatCard stat={stat} />
          </li>
        ))}
      </ul>
    </section>
  );
}
