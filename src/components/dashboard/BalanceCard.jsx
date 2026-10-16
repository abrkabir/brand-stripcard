"use client";

import { useId, useMemo, useState } from "react";
import { balanceRanges, balanceSeries } from "@/data/dashboard";
import { cn } from "@/lib/cn";
import { formatChange, formatMoney } from "@/lib/format";

/** The chart's drawing box: 100 wide, 80 tall, the line kept off both edges. */
const W = 100;
const H = 80;
const TOP = 10;
const BOTTOM = 70;

/**
 * Total balance, with an area chart of it over the chosen range.
 *
 * Point at the chart (or focus it and use the arrow keys) to read any point;
 * a dark tooltip follows, with a dot and a dashed guide down to the base.
 * At rest it marks the range's high. The range tabs swap the series.
 *
 * The line is SVG stretched to the card (`preserveAspectRatio="none"`, with a
 * non-scaling stroke so it stays crisp), and the tooltip, dot and guide are
 * HTML laid over it by percentage, so they keep their shape at any width.
 */
export function BalanceCard() {
  const [range, setRange] = useState("1w");
  const [active, setActive] = useState(null);
  const id = useId();
  const points = balanceSeries[range];

  const { coords, linePath, areaPath, peak } = useMemo(() => {
    const values = points.map((p) => p.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || 1;
    const coords = points.map((p, i) => ({
      x: (i / (points.length - 1)) * W,
      y: TOP + (1 - (p.value - min) / span) * (BOTTOM - TOP),
    }));
    const linePath = coords.map((c, i) => `${i ? "L" : "M"}${c.x.toFixed(2)},${c.y.toFixed(2)}`).join(" ");
    return {
      coords,
      linePath,
      areaPath: `${linePath} L${W},${H} L0,${H} Z`,
      peak: values.indexOf(max),
    };
  }, [points]);

  const index = active ?? peak;
  const point = points[index];
  const at = coords[index];
  const latest = points[points.length - 1].value;
  const change = (latest - points[0].value) / points[0].value;

  const pick = (event) => {
    const box = event.currentTarget.getBoundingClientRect();
    const share = Math.min(Math.max((event.clientX - box.left) / box.width, 0), 1);
    setActive(Math.round(share * (points.length - 1)));
  };

  const onKeyDown = (event) => {
    const last = points.length - 1;
    const moves = { ArrowLeft: index - 1, ArrowRight: index + 1, Home: 0, End: last };
    if (!(event.key in moves)) return;
    event.preventDefault();
    setActive(Math.min(Math.max(moves[event.key], 0), last));
  };

  // Near either end the tooltip hangs inwards, so it never runs off the card.
  const edge = at.x < 22 ? "left" : at.x > 78 ? "right" : "middle";
  const rangeLabel = balanceRanges.find((r) => r.id === range).label;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl bg-brand-50 dark:bg-brand-950/45">
      <div className="flex items-start justify-between gap-4 px-5 pt-5 sm:px-6 sm:pt-6">
        <div>
          <p className="font-heading text-[2rem] leading-none font-semibold tracking-[-0.02em] text-headline tabular-nums">
            {formatMoney(latest)}
          </p>
          <p className="mt-2 text-sm text-content">Total balance</p>
        </div>
        <span
          className={cn(
            "mt-1 shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums",
            change >= 0 ? "bg-success/10 text-success" : "bg-danger/10 text-danger",
          )}
        >
          {formatChange(change)}
        </span>
      </div>

      {/* The chart. */}
      <div
        tabIndex={0}
        role="group"
        aria-roledescription="chart"
        aria-label={`Balance over ${rangeLabel}. Use the arrow keys to read each point.`}
        aria-describedby={`${id}-readout`}
        onPointerMove={pick}
        onPointerLeave={() => setActive(null)}
        onKeyDown={onKeyDown}
        onBlur={() => setActive(null)}
        className="relative mt-4 min-h-36 flex-1 cursor-crosshair touch-pan-y outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset sm:min-h-40 lg:min-h-32"
      >
        <svg aria-hidden="true" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 size-full text-brand">
          <defs>
            <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="currentColor" stopOpacity="0.28" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill={`url(#${id}-fill)`} />
          <path
            d={linePath}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Guide, dot and tooltip at the point being read. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 border-l border-dashed border-brand/50"
          style={{ left: `${at.x}%`, top: `${(at.y / H) * 100}%` }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute size-3 -translate-1/2 rounded-full bg-brand ring-4 ring-brand/25"
          style={{ left: `${at.x}%`, top: `${(at.y / H) * 100}%` }}
        />
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute -mt-4 rounded-full bg-hero-ink px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap text-white tabular-nums shadow-soft",
            edge === "left" && "-translate-y-full",
            edge === "middle" && "-translate-x-1/2 -translate-y-full",
            edge === "right" && "-translate-x-full -translate-y-full",
          )}
          style={{ left: `${at.x}%`, top: `${(at.y / H) * 100}%` }}
        >
          {formatMoney(point.value)}
          <span className="ml-1.5 font-medium text-white/55">{point.label}</span>
        </span>
        <span id={`${id}-readout`} aria-live="polite" className="sr-only">
          {active === null ? "" : `${point.label}: ${formatMoney(point.value)}`}
        </span>
      </div>

      {/* Range tabs. */}
      <div role="group" aria-label="Chart range" className="flex gap-1 px-4 pt-3 pb-4 sm:px-5">
        {balanceRanges.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => {
              setRange(r.id);
              setActive(null);
            }}
            aria-pressed={r.id === range}
            className={cn(
              "cursor-pointer rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-brand",
              r.id === range ? "bg-elevated text-headline shadow-soft" : "text-muted hover:text-headline",
            )}
          >
            {r.label}
          </button>
        ))}
      </div>
    </div>
  );
}
