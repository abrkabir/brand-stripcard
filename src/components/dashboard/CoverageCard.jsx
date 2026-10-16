import { Flag, hasFlag } from "@/components/dashboard/Flag";
import { Panel } from "@/components/dashboard/Panel";
import { WorldMap } from "@/components/dashboard/WorldMap";
import { CoffeeIcon, FuelIcon, GlobeIcon } from "@/components/icons";
import { coverage } from "@/data/dashboard";
import { cn } from "@/lib/cn";

const ICONS = { coffee: CoffeeIcon, fuel: FuelIcon };

/**
 * How many of the countries paid in are shown by flag, five to a row: one
 * row where the card is narrow, two where it is wide, the count after them.
 */
const NAMED = { narrow: 5, wide: 10 };

/**
 * Where your cards have been used, to show how far they already go and
 * nudge you to take them further. On one side: how many countries and
 * places, the countries paid in most, and the kinds of place and services
 * you pay. On the other: the world in dots with a pin on every country you
 * have paid in, and a bar of how many of the 180+ countries the cards work
 * in that is. Side by side when the card is wide, one above the other when
 * it is narrow. A Server Component.
 */
export function CoverageCard({ className }) {
  const { countries, places, worldwide, spots } = coverage;
  const named = countries.slice(0, NAMED.wide);
  const more = { narrow: countries.length - NAMED.narrow, wide: countries.length - NAMED.wide };
  const countLabel = (n) => ` more ${n === 1 ? "country" : "countries"}`;
  const share = Math.min(countries.length / worldwide, 1);

  return (
    <Panel
      id="coverage-title"
      title="Global coverage"
      subtitle="Where your cards have paid"
      link={{ href: "/dashboard/transactions", label: "See where you have paid" }}
      className={className}
    >
      <div className="grid flex-1 gap-6 @min-[36rem]:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] @min-[36rem]:gap-8">
        <div className="flex flex-col gap-5">
          {/* The two counts, figure first. */}
          <dl className="grid grid-cols-2 gap-3">
            {[
              ["Countries", countries.length],
              ["Places", places],
            ].map(([label, value]) => (
              <div key={label} className="flex flex-col-reverse">
                <dt className="mt-1.5 text-xs text-muted">{label}</dt>
                <dd className="font-heading text-[2rem] leading-none font-semibold text-headline tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>

          {/* The countries paid in most, by flag, and how many more. */}
          <div>
            <h3 className="text-xs font-medium text-muted">Top countries</h3>
            <ul className="mt-2 flex items-center @min-[36rem]:grid @min-[36rem]:w-max @min-[36rem]:grid-cols-[repeat(6,1.75rem)] @min-[36rem]:gap-y-2">
              {named.map((country, i) => (
                <li
                  key={country.code}
                  title={country.name}
                  className={cn(
                    "relative grid size-9 place-items-center overflow-hidden rounded-full bg-canvas text-[0.6875rem] font-semibold tracking-wide text-headline ring-2 ring-card",
                    // A hairline round the edge, so a pale flag still reads as a circle.
                    "after:pointer-events-none after:absolute after:inset-0 after:rounded-full after:ring-1 after:ring-black/10 after:ring-inset dark:after:ring-white/15",
                    i > 0 && "-ml-2 @min-[36rem]:ml-0",
                    i >= NAMED.narrow && "hidden @min-[36rem]:grid",
                    // The sixth starts the second row.
                    i === NAMED.narrow && "@min-[36rem]:col-start-1",
                  )}
                >
                  {hasFlag(country.code) ? (
                    <Flag code={country.code} className="absolute inset-0" />
                  ) : (
                    <span aria-hidden="true">{country.code}</span>
                  )}
                  <span className="sr-only">{country.name}</span>
                </li>
              ))}
              {more.narrow > 0 && (
                <li className="relative -ml-2 grid size-9 place-items-center rounded-full bg-brand text-[0.6875rem] font-semibold text-white ring-2 ring-card @min-[36rem]:hidden">
                  +{more.narrow}
                  <span className="sr-only">{countLabel(more.narrow)}</span>
                </li>
              )}
              {more.wide > 0 && (
                <li className="relative hidden size-9 place-items-center rounded-full bg-brand text-[0.6875rem] font-semibold text-white ring-2 ring-card @min-[36rem]:grid">
                  +{more.wide}
                  <span className="sr-only">{countLabel(more.wide)}</span>
                </li>
              )}
            </ul>
          </div>

          {/* The kinds of place and the services paid at, at the column's foot. */}
          <div className="mt-auto">
            <h3 className="text-xs font-medium text-muted">Paid at</h3>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {spots.map((spot) => {
                const Icon = ICONS[spot.icon];
                return (
                  <li
                    key={spot.label}
                    className="inline-flex items-center gap-1.5 rounded-full bg-canvas py-1 pr-2.5 pl-1 text-xs font-medium text-headline"
                  >
                    <span aria-hidden="true" className="grid size-6 place-items-center rounded-full bg-card text-brand">
                      {Icon ? (
                        <Icon className="size-3.5" />
                      ) : (
                        <svg viewBox="0 0 24 24" className="size-3.5 fill-current">
                          <path d={spot.logo.path} />
                        </svg>
                      )}
                    </span>
                    {spot.label}
                    {spot.count && (
                      <span className="text-muted tabular-nums">
                        <span className="sr-only">, </span>
                        {spot.count}
                        <span className="sr-only"> payments</span>
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {/* Centred in the room above the nudge when the column is taller than both. */}
          <WorldMap pins={countries} className="my-auto" />

          {/* How far round the world the cards have been, and a nudge. */}
          <div className="rounded-2xl bg-brand-50 p-3.5 dark:bg-brand/10">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-headline">
              <GlobeIcon aria-hidden="true" className="size-4 text-brand" />
              {countries.length} of {worldwide}+ countries
            </p>
            <div
              role="meter"
              aria-label="Countries paid in"
              aria-valuemin={0}
              aria-valuemax={worldwide}
              aria-valuenow={countries.length}
              aria-valuetext={`${countries.length} of ${worldwide}+ countries`}
              className="mt-2 h-1.5 overflow-hidden rounded-full bg-card"
            >
              <span className="block h-full rounded-full bg-brand" style={{ width: `${Math.max(share * 100, 4)}%` }} />
            </div>
            <p className="mt-2 text-xs text-content">Your cards work in {worldwide}+ countries. Where next?</p>
          </div>
        </div>
      </div>
    </Panel>
  );
}
