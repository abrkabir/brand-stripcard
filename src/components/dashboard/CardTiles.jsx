import { CreditCardIcon, GlobeIcon, TagIcon } from "@/components/icons";
import { dashboardCards } from "@/data/dashboard";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";

const ICONS = { card: CreditCardIcon, globe: GlobeIcon, tag: TagIcon };

/** Tint ground, ink and bar fill for each card. */
const TINTS = {
  violet: { ground: "bg-tint-violet", ink: "text-tint-violet-ink", bar: "bg-tint-violet-ink" },
  green: { ground: "bg-tint-green", ink: "text-tint-green-ink", bar: "bg-tint-green-ink" },
  amber: { ground: "bg-tint-amber", ink: "text-tint-amber-ink", bar: "bg-tint-amber-ink" },
};

/**
 * One tile per virtual card, each on its own tint: this month's spend, the
 * card's name and number, how much of its limit is used (a bar and a
 * figure), and its icon. A Server Component.
 */
export function CardTiles() {
  return (
    <ul className="grid h-full gap-3 sm:grid-cols-3 sm:gap-4">
      {dashboardCards.map((card) => {
        const Icon = ICONS[card.icon];
        const t = TINTS[card.tint];
        const used = Math.min(card.spent / card.limit, 1);
        return (
          <li key={card.id} className={cn("flex min-h-44 flex-col rounded-3xl p-5", t.ground)}>
            <p className="font-heading text-2xl leading-none font-semibold tracking-[-0.02em] text-headline tabular-nums">
              {formatMoney(card.spent)}
            </p>
            <p className="mt-2 text-sm text-content">
              {card.name} <span className="text-muted">•••• {card.last4}</span>
            </p>

            <div className="mt-auto pt-6">
              <div
                role="meter"
                aria-label={`${card.name} limit used`}
                aria-valuemin={0}
                aria-valuemax={card.limit}
                aria-valuenow={card.spent}
                aria-valuetext={`${formatMoney(card.spent)} of ${formatMoney(card.limit, { whole: true })}`}
                className="h-1.5 overflow-hidden rounded-full bg-elevated/70"
              >
                <span className={cn("block h-full rounded-full", t.bar)} style={{ width: `${used * 100}%` }} />
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-elevated text-headline shadow-soft">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <span className={cn("text-right text-xs font-semibold", t.ink)}>
                  {Math.round(used * 100)}% of {formatMoney(card.limit, { whole: true })}
                </span>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
