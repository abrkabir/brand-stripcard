import Image from "next/image";
import Link from "next/link";
import { Notch } from "@/components/dashboard/Notch";
import { PaymentMark, paymentName } from "@/components/dashboard/PaymentMark";
import {
  ArrowUpRightIcon,
  DownloadIcon,
  GiftIcon,
  PlusIcon,
  SwapIcon,
} from "@/components/icons";
import { moneyStats } from "@/data/dashboard";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";

/** Each card's icon: the wallet's own for adding and transferring, a gift for gift cards. */
const ICONS = { add: DownloadIcon, transfer: SwapIcon, gift: GiftIcon };

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

/** A row in a card's list: an icon, a name with a note under it, and something at the end. */
function Row({ icon, title, note, end }) {
  return (
    <li className="flex items-center gap-3 rounded-2xl bg-canvas/70 p-2 pr-3">
      <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-full bg-card text-brand">
        {icon}
      </span>
      <span className="min-w-0 flex-1 leading-tight">
        <span className="block truncate text-sm font-semibold text-headline">{title}</span>
        <span className="mt-0.5 block truncate text-xs text-muted">{note}</span>
      </span>
      {end}
    </li>
  );
}

const LABEL = "text-xs font-medium text-muted";

/** A round mark in a row of them, overlapping the one before; a hairline keeps a pale one round. */
const MARK =
  "relative grid size-10 place-items-center overflow-hidden rounded-full ring-2 ring-card after:pointer-events-none after:absolute after:inset-0 after:rounded-full after:ring-1 after:ring-black/10 after:ring-inset dark:after:ring-white/15";

/** Adding money: the ways it can come in, as a row of marks, and how soon it arrives. */
function Sources({ stat }) {
  return (
    <>
      <h4 className={LABEL}>Connected</h4>
      <ul className="mt-2 flex items-center">
        {stat.sources.map((id, i) => (
          <li key={id} title={paymentName(id)} className={cn(MARK, i > 0 && "-ml-2")}>
            <PaymentMark id={id} className="absolute inset-0" />
            <span className="sr-only">{paymentName(id)}</span>
          </li>
        ))}
        {stat.moreSources > 0 && (
          <li className={cn(MARK, "-ml-2 bg-brand text-[0.6875rem] font-semibold text-white")}>
            +{stat.moreSources}
            <span className="sr-only"> more ways to add money</span>
          </li>
        )}
      </ul>
    </>
  );
}

/** Transferring: the people paid most, a tap from sending to them, and a way to add someone. */
function QuickSend({ stat }) {
  const ring =
    "rounded-full transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";
  return (
    <>
      <h4 className={LABEL}>People you pay often</h4>
      <ul className="mt-2 flex flex-wrap items-center gap-2">
        {stat.contacts.map((person) => (
          <li key={person.name}>
            <Link
              href={stat.href}
              aria-label={`Send money to ${person.name}`}
              title={person.name}
              className={cn(ring, "block ring-2 ring-transparent ring-offset-2 ring-offset-card hover:ring-brand")}
            >
              <Image src={person.avatar} alt="" sizes="40px" className="size-10 rounded-full object-cover object-top" />
            </Link>
          </li>
        ))}
        <li>
          <Link
            href={stat.href}
            aria-label="Send money to someone new"
            title="Someone new"
            className={cn(
              ring,
              "grid size-10 place-items-center border-2 border-dashed border-line text-muted hover:border-brand hover:text-brand",
            )}
          >
            <PlusIcon className="size-4" />
          </Link>
        </li>
      </ul>
    </>
  );
}

/** Gift cards: the ones you hold, what is left on each, and until when. */
function GiftCards({ stat }) {
  return (
    <>
      <h4 className={LABEL}>Balances</h4>
      <ul className="mt-2 space-y-2">
        {stat.giftCards.map((gift) => (
          <Row
            key={gift.brand}
            icon={
              <svg viewBox="0 0 24 24" className="size-4 fill-current">
                <path d={gift.logo.path} />
              </svg>
            }
            title={gift.brand}
            note={gift.note}
            end={<span className="shrink-0 text-sm font-semibold text-headline tabular-nums">{formatMoney(gift.balance)}</span>}
          />
        ))}
      </ul>
    </>
  );
}

/** What each card shows in its middle: what is good to know before doing the thing. */
const DETAILS = { add: Sources, transfer: QuickSend, gift: GiftCards };

/**
 * One way to move money as a card: its name and what it is for, what is
 * good to know before doing it (see DETAILS), and at its foot the latest one
 * in a chip, or a note. Two round buttons sit in notches cut from its right
 * corners: the arrow at the top opens your transactions, the dark one at the
 * foot does the thing itself.
 */
function StatCard({ stat }) {
  const t = LOOK;
  const Icon = ICONS[stat.kind];
  const Details = DETAILS[stat.kind];
  const titleId = `stat-${stat.id}`;

  return (
    <article aria-labelledby={titleId} className={cn("relative isolate flex h-full min-h-[16rem] flex-col p-5 @min-[44rem]:min-h-[19rem]", t.ink)}>
      <div aria-hidden="true" className={cn("absolute inset-0 -z-10 rounded-[1.75rem]", t.card)} />

      {/* Its name and what it is for, clear of the notch at the top. */}
      <div className="pr-14">
        <h3 id={titleId} className={cn("font-heading text-xl leading-tight font-semibold", t.ink)}>
          {stat.label}
        </h3>
        <p className={cn("mt-1 text-sm", t.soft)}>{stat.sub}</p>
      </div>

      {/* What is good to know before doing it. */}
      <div className="my-auto py-4">
        <Details stat={stat} />
      </div>

      {/* At the foot, clear of the notch: the latest one in a chip, or a note. */}
      <div className="pr-16">
        {stat.latest ? (
          <>
            <p className={cn("truncate text-xs", t.soft)}>{stat.latest.text}</p>
            <p className={cn("mt-1.5 inline-flex items-center gap-2 rounded-full border py-1 pr-3.5 pl-1", t.chip)}>
              {stat.latest.avatar ? (
                <Image src={stat.latest.avatar} alt="" sizes="28px" className="size-7 rounded-full object-cover object-top" />
              ) : (
                <span aria-hidden="true" className={cn("grid size-7 place-items-center rounded-full", t.badge)}>
                  {stat.latest.logo ? (
                    <svg viewBox="0 0 24 24" className="size-3.5 fill-current">
                      <path d={stat.latest.logo.path} />
                    </svg>
                  ) : (
                    <Icon className="size-3.5" />
                  )}
                </span>
              )}
              <span className="text-sm font-semibold tabular-nums">{formatMoney(stat.latest.amount)}</span>
            </p>
          </>
        ) : (
          <p className={cn("text-sm leading-snug text-pretty", t.soft)}>{stat.note}</p>
        )}
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
 * Three cards for moving money: adding it, sending it, and gift cards. On the overview's wide layout (its `page` container, beside the
 * wallet) all three stand side by side; below that, two to a row, the third
 * across the full width under them; on a phone, one under another. A Server
 * Component.
 */
export function MoneyStats({ className }) {
  return (
    <section aria-labelledby="money-stats-title" className={cn("@container", className)}>
      <h2 id="money-stats-title" className="sr-only">
        Your money
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
