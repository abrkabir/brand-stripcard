"use client";

import { useId, useMemo, useState } from "react";
import { Panel } from "@/components/dashboard/Panel";
import { ChevronDownIcon } from "@/components/icons";
import { moneyFlow } from "@/data/dashboard";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";

const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });

/** Round tick steps (1, 2, 2.5 or 5 times a power of ten) up to a tidy top. */
function scale(max, intervals = 4) {
  const raw = max / intervals;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const r = raw / magnitude;
  const step = (r <= 1 ? 1 : r <= 2 ? 2 : r <= 2.5 ? 2.5 : r <= 5 ? 5 : 10) * magnitude;
  const top = Math.ceil(max / step) * step;
  return { top, ticks: Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step) };
}

/**
 * The two series. `color` draws the line, its area's fade (from `fill` at
 * the line to nothing at the axis) and its dot. On the dark tooltip the
 * withdrawals' dot turns white, as their ink colour would vanish there.
 */
const SERIES = [
  { key: "added", label: "Add money", short: "Added", color: "var(--color-brand)", fill: 0.32, dot: "bg-brand", tip: "bg-brand" },
  {
    key: "withdrawn",
    label: "Withdraw money",
    short: "Withdrawn",
    color: "var(--color-headline)",
    fill: 0.1,
    dot: "bg-headline",
    tip: "bg-white",
  },
];

/**
 * Money added against money withdrawn, day by day, for the month picked at
 * the top: two areas on a dollar scale, each fading down to the axis, with
 * each month's totals in the legend. The busiest day is read out in a
 * tooltip to begin with; point at the chart (or focus it and use the arrow
 * keys) to read any day, with its net. Changing month draws the lines in
 * again.
 */
export function MoneyFlowChart({ className }) {
  const [monthId, setMonthId] = useState(moneyFlow[0].id);
  const [active, setActive] = useState(null);
  const uid = useId().replace(/[^\w-]/g, "");
  const month = moneyFlow.find((m) => m.id === monthId);
  const last = month.added.length - 1;

  const { top, ticks, peak, totals } = useMemo(() => {
    const sum = (values) => values.reduce((total, value) => total + value, 0);
    return {
      ...scale(Math.max(...month.added, ...month.withdrawn)),
      peak: month.added.indexOf(Math.max(...month.added)),
      totals: { added: sum(month.added), withdrawn: sum(month.withdrawn) },
    };
  }, [month]);

  // Day i across the plot, and a value up it, both as percentages.
  const x = (i) => (i / (last || 1)) * 100;
  const y = (value) => (value / top) * 100;
  const line = (values) => values.map((value, i) => `${i ? "L" : "M"}${x(i)} ${100 - y(value)}`).join(" ");
  const area = (values) => `${line(values)} L100 100 L0 100 Z`;
  const date = (i) => `${month.short} ${i + 1}`;
  const mid = Math.floor(last / 2);

  const shown = active ?? peak;
  const at = x(shown);
  const net = month.added[shown] - month.withdrawn[shown];
  const highest = Math.max(month.added[shown], month.withdrawn[shown]);

  // The tooltip sits beside the dots on the side with more room, level with
  // the higher one, and is clamped inside the plot so it never spills off a
  // narrow one.
  const tip = {
    ...(at < 50
      ? { left: `clamp(0px, calc(${at}% + 1rem), calc(100% - 11rem))` }
      : { right: `clamp(0px, calc(${100 - at}% + 1rem), calc(100% - 11rem))` }),
    top: `clamp(0px, calc(${100 - y(highest)}% - 3.5rem), calc(100% - 8rem))`,
  };

  const pick = (event) => {
    const box = event.currentTarget.getBoundingClientRect();
    const share = Math.min(Math.max((event.clientX - box.left) / box.width, 0), 1);
    setActive(Math.round(share * last));
  };

  const onKeyDown = (event) => {
    const from = active ?? peak;
    const moves = { ArrowLeft: from - 1, ArrowRight: from + 1, Home: 0, End: last };
    if (!(event.key in moves)) return;
    event.preventDefault();
    setActive(Math.min(Math.max(moves[event.key], 0), last));
  };

  const select = (
    <span className="relative">
      <label htmlFor={`${uid}-month`} className="sr-only">
        Month
      </label>
      <select
        id={`${uid}-month`}
        value={monthId}
        onChange={(event) => {
          setMonthId(event.target.value);
          setActive(null);
        }}
        className="h-10 cursor-pointer appearance-none rounded-full bg-canvas pr-9 pl-4 text-sm font-medium text-headline transition-colors hover:bg-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        {moneyFlow.map((m) => (
          <option key={m.id} value={m.id}>
            {m.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted"
      />
    </span>
  );

  return (
    <Panel
      id="money-flow-title"
      title="Add Money vs Withdraw Money"
      subtitle="Money added to and taken out of your wallet, day by day"
      actions={select}
      link={{ href: "/dashboard/transactions", label: "See all transactions" }}
      className={className}
    >
      {/* The legend, with each series' total for the month. */}
      <ul className="flex flex-wrap gap-x-6 gap-y-2">
        {SERIES.map((s) => (
          <li key={s.key} className="flex items-center gap-2 text-sm text-content">
            <span aria-hidden="true" className={cn("size-2.5 rounded-full", s.dot)} />
            {s.label}
            <span className="font-semibold text-headline tabular-nums">{formatMoney(totals[s.key])}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5 grid flex-1 grid-cols-[auto_minmax(0,1fr)] grid-rows-[minmax(14rem,1fr)_auto] gap-x-3 gap-y-3">
        {/* The scale. */}
        <div aria-hidden="true" className="relative w-10 text-right text-xs text-muted tabular-nums">
          {ticks.map((tick) => (
            <span key={tick} className="absolute right-0 translate-y-1/2" style={{ bottom: `${y(tick)}%` }}>
              ${compact.format(tick)}
            </span>
          ))}
        </div>

        {/* The plot. */}
        <div
          tabIndex={0}
          role="group"
          aria-roledescription="chart"
          aria-label={`Money added and withdrawn each day, ${month.label}. Use the arrow keys to read each day.`}
          aria-describedby={`${uid}-readout`}
          onPointerMove={pick}
          onPointerDown={pick}
          onPointerLeave={() => setActive(null)}
          onKeyDown={onKeyDown}
          onBlur={() => setActive(null)}
          className="relative touch-pan-y rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-4 focus-visible:ring-offset-card"
        >
          {ticks.map((tick) => (
            <span
              key={tick}
              aria-hidden="true"
              className="absolute inset-x-0 border-t border-line"
              style={{ bottom: `${y(tick)}%` }}
            />
          ))}

          <svg
            key={month.id}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="absolute inset-0 size-full overflow-visible motion-safe:animate-chart-reveal"
          >
            <defs>
              {SERIES.map((s) => (
                <linearGradient key={s.key} id={`${uid}-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" style={{ stopColor: s.color, stopOpacity: s.fill }} />
                  <stop offset="1" style={{ stopColor: s.color, stopOpacity: 0 }} />
                </linearGradient>
              ))}
            </defs>
            {SERIES.map((s) => (
              <g key={s.key}>
                <path d={area(month[s.key])} fill={`url(#${uid}-${s.key})`} />
                <path
                  d={line(month[s.key])}
                  fill="none"
                  style={{ stroke: s.color }}
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            ))}
          </svg>

          {/* The day being read: a guide down to the axis, a dot on each
              line, and the tooltip. They arrive once the lines have drawn. */}
          <div
            key={`${month.id}-reading`}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 motion-safe:animate-fade-up motion-safe:[animation-delay:0.45s]"
          >
            <span className="absolute inset-y-0 border-l border-dashed border-headline/25" style={{ left: `${at}%` }} />
            {SERIES.map((s) => (
              <span
                key={s.key}
                className={cn("absolute size-3 -translate-x-1/2 translate-y-1/2 rounded-full ring-[3px] ring-card", s.dot)}
                style={{ left: `${at}%`, bottom: `${y(month[s.key][shown])}%` }}
              />
            ))}
            <div
              className="absolute z-10 w-44 rounded-xl bg-hero-ink px-3.5 py-3 text-white shadow-lift dark:ring-1 dark:ring-white/10"
              style={tip}
            >
              <p className="text-xs text-white/60">
                {date(shown)}, {month.year}
              </p>
              {SERIES.map((s) => (
                <p key={s.key} className="mt-1.5 flex items-center justify-between gap-3 text-sm">
                  <span className="flex items-center gap-2 text-white/80">
                    <span className={cn("size-2 rounded-full", s.tip)} />
                    {s.short}
                  </span>
                  <span className="font-semibold tabular-nums">{formatMoney(month[s.key][shown])}</span>
                </p>
              ))}
              <p className="mt-2 flex items-center justify-between gap-3 border-t border-white/10 pt-2 text-xs text-white/60">
                Net
                <span
                  className={cn(
                    "font-semibold tabular-nums",
                    net >= 0 ? "text-[var(--dark-success)]" : "text-[var(--dark-danger)]",
                  )}
                >
                  {net >= 0 ? "+" : "−"}
                  {formatMoney(Math.abs(net))}
                </span>
              </p>
            </div>
          </div>

          <span id={`${uid}-readout`} aria-live="polite" className="sr-only">
            {active === null
              ? ""
              : `${date(active)}: added ${formatMoney(month.added[active])}, withdrawn ${formatMoney(month.withdrawn[active])}`}
          </span>
        </div>

        {/* The dates: the first, the middle and the last. */}
        <span aria-hidden="true" />
        <div aria-hidden="true" className="relative h-4 text-xs text-muted">
          <span className="absolute left-0">{date(0)}</span>
          <span className="absolute -translate-x-1/2" style={{ left: `${x(mid)}%` }}>
            {date(mid)}
          </span>
          <span className="absolute right-0">{date(last)}</span>
        </div>
      </div>

      {/* The figures, for assistive tech. In a div: a table won't shrink to the
          one pixel sr-only asks for, and would push the page wide. */}
      <div className="sr-only">
        <table>
          <caption>Money added and withdrawn each day, {month.label}</caption>
          <thead>
            <tr>
              <th scope="col">Day</th>
              <th scope="col">Added</th>
              <th scope="col">Withdrawn</th>
            </tr>
          </thead>
          <tbody>
            {month.added.map((value, i) => (
              <tr key={i}>
                <th scope="row">{date(i)}</th>
                <td>{formatMoney(value)}</td>
                <td>{formatMoney(month.withdrawn[i])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
