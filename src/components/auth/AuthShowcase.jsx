import Image from "next/image";
import { CheckIcon, SlidersIcon } from "@/components/icons";
import { authShowcase } from "@/data/auth";
import { cn } from "@/lib/cn";
import mark from "../../../public/images/logo/favicon_brand.png";

/**
 * The image shell beside the auth form: one photo laid across a grid of
 * rounded tiles, as if seen through a window of panes, with three panes on
 * the third row given over to content: the steps of issuing a card, a line on
 * control, and the StripCard mark.
 *
 * Every photo tile holds the whole photo, sized to the shell and shifted by
 * the tile's own position, so the panes line up into one picture across the
 * gaps. That needs the shell's size inside each tile, which is what the size
 * container is for (`100cqw` / `100cqh`). The photo breathes very slowly in
 * every pane at once, and the panes fade in corner to corner on arrival.
 *
 * Shown from lg up; below that the form has the screen to itself. Decorative,
 * so hidden from assistive tech.
 */

/** Track sizes, as fractions: four columns (the last a sliver), four rows. */
const COLS = [1, 1, 1, 0.55];
const ROWS = [0.62, 1, 1, 0.5];
const GAP = "0.625rem";

/** Where a track starts, as a share of the space left after the gaps. */
const start = (tracks, i) => tracks.slice(0, i).reduce((a, b) => a + b, 0) / tracks.reduce((a, b) => a + b, 0);

/** The panes given over to content, by "column,row". */
const CONTENT = { "1,2": "status", "2,2": "control", "3,2": "mark" };

export function AuthShowcase() {
  const cells = ROWS.flatMap((_, r) => COLS.map((_, c) => [c, r]));

  return (
    <div aria-hidden="true" className="relative hidden min-h-[38rem] [container-type:size] lg:block">
      <div
        className="grid h-full"
        style={{
          gridTemplateColumns: COLS.map((f) => `${f}fr`).join(" "),
          gridTemplateRows: ROWS.map((f) => `${f}fr`).join(" "),
          gap: GAP,
        }}
      >
        {cells.map(([c, r]) => {
          const kind = CONTENT[`${c},${r}`];
          return (
            <div
              key={`${c},${r}`}
              className={cn(
                "animate-fade-up relative overflow-hidden rounded-(--auth-radius)",
                !kind && "bg-[#1a1412]",
              )}
              style={{ animationDelay: `${120 + (c + r) * 70}ms` }}
            >
              {kind === "status" && <StatusPane />}
              {kind === "control" && <ControlPane />}
              {kind === "mark" && <MarkPane />}
              {!kind && (
                <div
                  className="absolute h-[100cqh] w-[100cqw] motion-safe:animate-shell-breathe"
                  style={{
                    left: `calc(-1 * ((100cqw - ${COLS.length - 1} * ${GAP}) * ${start(COLS, c)} + ${c} * ${GAP}))`,
                    top: `calc(-1 * ((100cqh - ${ROWS.length - 1} * ${GAP}) * ${start(ROWS, r)} + ${r} * ${GAP}))`,
                  }}
                >
                  <Image
                    src={authShowcase.image}
                    alt=""
                    fill
                    sizes="60vw"
                    preload={c === 0 && r === 0}
                    className="object-cover object-[50%_40%]"
                  />
                </div>
              )}
              {/* A faint inner edge, so panes over the photo's black still
                  read as panes. */}
              {!kind && (
                <span className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-white/[0.06] ring-inset" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** The steps of issuing a card, the last still running, over a dark pane. */
function StatusPane() {
  const { steps, title, text } = authShowcase.status;
  return (
    <div className="flex h-full flex-col justify-between bg-[#17120f] p-5 ring-1 ring-white/[0.06] ring-inset">
      <ul className="flex flex-col items-center gap-1.5 pt-1">
        {steps.map((step, i) => {
          const done = i < steps.length - 1;
          const depth = steps.length - 1 - i;
          return (
            <li
              key={step}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[11px] whitespace-nowrap",
                done ? "bg-white/10 text-white/70" : "bg-white text-[#151110] shadow-[0_8px_20px_-8px_rgb(0_0_0/0.6)]",
              )}
              style={{ scale: 1 - depth * 0.07, opacity: 1 - depth * 0.25 }}
            >
              {done ? <CheckIcon className="size-3" strokeWidth={2.4} /> : <Spinner />}
              {done ? step : `${step}…`}
            </li>
          );
        })}
      </ul>
      <div>
        <p className="font-heading text-xl font-semibold text-white">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-white/55">{text}</p>
      </div>
    </div>
  );
}

/** A line on control, on the brand orange. */
function ControlPane() {
  const { title, text } = authShowcase.control;
  return (
    <div className="flex h-full flex-col justify-between bg-[linear-gradient(150deg,#fd8645_0%,#f26a1b_55%,#d2520f_100%)] p-5 text-white">
      <div>
        <p className="font-heading text-xl font-semibold">{title}</p>
        <p className="mt-1.5 max-w-[14rem] text-xs leading-relaxed text-white/85">{text}</p>
      </div>
      <span className="grid size-11 place-items-center self-end rounded-xl bg-[#151110] text-white">
        <SlidersIcon className="size-5" />
      </span>
    </div>
  );
}

/** The StripCard mark on a pale pane. */
function MarkPane() {
  return (
    <div className="grid h-full place-items-center bg-brand-100">
      <Image src={mark} alt="" sizes="56px" className="size-12" />
    </div>
  );
}

function Spinner() {
  return (
    <svg viewBox="0 0 16 16" className="size-3 motion-safe:animate-spin">
      <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" />
      <path d="M8 2a6 6 0 0 1 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
