import Image from "next/image";
import { getIcon } from "@/components/icons";
import { PulseDot } from "@/components/shared/PulseDot";
import { Reveal } from "@/components/shared/Reveal";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Odometer } from "@/components/ui/Odometer";
import { Switch } from "@/components/ui/Switch";
import { about } from "@/data/about";
import { cn } from "@/lib/cn";
import cardOrange from "../../../public/images/assets/cards/card-orange.webp";
import cardPlatinum from "../../../public/images/assets/cards/card-platinum.webp";
import cardSilver from "../../../public/images/assets/cards/card-silver.webp";

/** Shared entrance: fades up once, the first time the block is in view. */
const rise =
  "translate-y-6 opacity-0 transition-[opacity,translate] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] data-visible:translate-y-0 data-visible:opacity-100";

/**
 * Homepage "About" block, straight under the banner.
 *
 *   label + intro      a small pill on the left, the pitch on the right
 *   three cards        security (dark) · the product (visual) · who uses it
 *   facts              four headline figures in a row
 *
 * A Server Component; only the toggle on the dark card is a client island.
 */
export function About() {
  const { label, intro, security, visual, audience, facts } = about;

  return (
    <section aria-labelledby="about-title" className="bg-page py-20 lg:py-28">
      <Container>
        <Reveal className={cn("grid gap-6 lg:grid-cols-12 lg:gap-8", rise)}>
          <h2 id="about-title" className="lg:col-span-4">
            <Eyebrow as="span">{label}</Eyebrow>
          </h2>
          <p className="text-xl leading-[1.45] font-medium tracking-[-0.01em] sm:text-2xl lg:col-span-8 lg:text-[1.75rem]">
            <span className="text-headline">{intro.brand}</span>{" "}
            <IconTiles icons={intro.icons} />{" "}
            <span className="text-headline">{intro.lead}</span>{" "}
            <span className="text-muted">{intro.rest}</span>
          </p>
        </Reveal>

        <Reveal
          className={cn(
            "mt-12 grid gap-4 [transition-delay:120ms] md:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-5",
            rise,
          )}
        >
          <SecurityCard {...security} />
          <VisualCard {...visual} />
          <AudienceCard {...audience} />
        </Reveal>

        <Reveal className={cn("mt-12 text-center lg:mt-16", rise)}>
          <p className="inline-flex items-center gap-3 text-lg text-balance text-content">
            <PulseDot />
            {facts.title}
          </p>
          {/* Each figure in its own rounded box, cornered like the cards above. */}
          <dl className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:mt-8 lg:grid-cols-4 lg:gap-5">
            {facts.items.map((fact) => (
              <div
                key={fact.label}
                className="flex flex-col-reverse gap-2 rounded-3xl border border-line bg-elevated px-4 py-7 transition-colors hover:border-brand/40 sm:px-6 lg:py-9"
              >
                <dt className="text-sm text-muted">{fact.label}</dt>
                <dd className="text-[2rem] leading-none font-medium tracking-[-0.03em] text-headline tabular-nums lg:text-[2.75rem]">
                  <Odometer value={fact.value} />
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Container>
    </section>
  );
}

/** Tile colours, alternating face to face. */
const TILE_TONES = ["bg-brand text-white", "bg-hero-ink text-white"];

/** Seconds each face holds the slot. Must match `--animate-icon-cycle`. */
const FACE_SECONDS = 2;

/**
 * One inline tile in the intro, sized in `em` so it scales with the sentence,
 * that the icons take turns in: each rises in from below, holds, and is
 * pushed out of the top by the next, colour alternating as they go. All four
 * run the same keyframes, offset by their slot, so the loop never drifts.
 *
 * The cycle starts the first time the block scrolls into view (the
 * surrounding `Reveal` sets `data-visible`). With reduced motion it never
 * runs, and the first icon simply sits in the tile. Decorative, so hidden
 * from assistive tech.
 */
function IconTiles({ icons }) {
  return (
    <span
      aria-hidden="true"
      className="relative inline-grid size-[1.2em] -translate-y-[0.08em] overflow-hidden rounded-full align-middle"
    >
      {icons.map((name, i) => {
        const Icon = getIcon(name);

        return (
          <span
            key={name}
            data-loop
            className={cn(
              "absolute inset-0 grid place-items-center motion-safe:in-data-visible:animate-icon-cycle",
              i === 0 ? "translate-y-0" : "translate-y-full",
              TILE_TONES[i % TILE_TONES.length],
            )}
            style={{ animationDelay: `${i * FACE_SECONDS}s` }}
          >
            {Icon && <Icon strokeWidth={2} className="size-[0.62em]" />}
          </span>
        );
      })}
    </span>
  );
}

const cardBase =
  "relative flex min-h-[22rem] flex-col overflow-hidden rounded-3xl p-7 lg:h-[26rem] lg:p-8";

/**
 * Dark card: a stack of security badges, a two-tone statement and a working
 * toggle. The badges overlap like the flags in the banner, each ringed in the
 * card's own colour so they read as cut out of one another, and each lifts a
 * little on hover.
 */
function SecurityCard({ text, toggle, badges }) {
  return (
    <article className={cn(cardBase, "bg-hero-ink text-white")}>
      <ul aria-label="Security features" className="flex -space-x-2.5">
        {badges.map((item) => {
          const Icon = item.icon && getIcon(item.icon);
          return (
            <li
              key={item.label}
              title={item.label}
              className={cn(
                "relative grid size-11 place-items-center rounded-full border-2 border-hero-ink transition-transform duration-300 hover:z-10 hover:-translate-y-1",
                item.badge
                  ? "bg-brand text-white"
                  : "bg-[#2a1f1a] text-white/85 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.09)]",
              )}
            >
              {Icon ? (
                <Icon aria-hidden="true" className="size-[18px]" />
              ) : (
                <span aria-hidden="true" className="font-heading text-[0.8125rem] font-bold tracking-[0.02em]">
                  {item.badge}
                </span>
              )}
              <span className="sr-only">{item.label}</span>
            </li>
          );
        })}
      </ul>

      <p className="mt-auto text-2xl leading-[1.3] font-medium tracking-[-0.01em] lg:text-[1.65rem]">
        {text.map((piece) => (
          <span
            key={piece.text}
            className={piece.strong ? "text-white" : "text-white/45"}
          >
            {piece.text}
          </span>
        ))}
      </p>

      <Switch
        label={toggle}
        defaultChecked
        className="mt-7"
        labelClassName="text-white/70"
      />
    </article>
  );
}

/**
 * The three StripCards, back to front, as a stack: all at the same tilt, each
 * further back a step higher (so its logo shows above the card in front) and
 * a touch smaller. `rise` is where each settles once the tile is in view (they
 * start tucked behind the front card), `pose` its scale and how it fans out
 * on hover, and `bob` where it starts in the shared float: the cards float
 * together, a beat apart, a ripple through the stack that never lets one
 * card cover the logo of the card behind it.
 */
const STACK = [
  {
    src: cardSilver,
    rise: "in-data-visible:-translate-y-[5.5rem] in-data-visible:translate-x-4",
    delay: "450ms",
    pose: "scale-90 group-hover:-translate-y-4 group-hover:translate-x-3 group-hover:-rotate-2",
    bob: "-1s",
  },
  {
    src: cardPlatinum,
    rise: "in-data-visible:-translate-y-[2.75rem] in-data-visible:translate-x-2",
    delay: "300ms",
    pose: "scale-95 group-hover:-translate-y-2 group-hover:translate-x-1.5 group-hover:-rotate-4",
    bob: "-0.5s",
  },
  {
    src: cardOrange,
    rise: "",
    delay: "0ms",
    pose: "group-hover:translate-y-2 group-hover:-rotate-9",
    bob: "0s",
  },
];

/**
 * Picture card: the three StripCards (silver, Platinum and orange) stacked on
 * the brand gradient, every logo in view, with a glass caption under them.
 *
 * Once the tile scrolls into view the back cards rise out from behind the
 * front one, one after the other, and the caption follows; then the stack
 * floats, a ripple running through it. Pointing at the tile fans them further apart.
 * Each motion has its own layer (rise, float, fan), so they never fight over
 * a transform. Without motion, the stack simply sits in place. Decorative;
 * the caption says what it shows.
 */
function VisualCard({ caption }) {
  return (
    <article
      className={cn(cardBase, "group items-center justify-center bg-hero-glow p-0 pb-14 lg:p-0 lg:pb-16")}
    >
      <div
        aria-hidden="true"
        className="bg-grain pointer-events-none absolute inset-0 opacity-[0.16] mix-blend-overlay"
      />

      <div aria-hidden="true" className="relative w-56 pt-[5.75rem] sm:w-64">
        <div className="relative aspect-[1411/843]">
          {STACK.map(({ src, rise, delay, pose, bob }) => (
            <div
              key={src.src}
              className={cn(
                "absolute inset-0 transition-[translate] duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
                rise,
              )}
              style={{ transitionDelay: delay }}
            >
              <div
                data-loop
                className="size-full motion-safe:animate-card-bob"
                style={{ animationDelay: bob }}
              >
                <Image
                  src={src}
                  alt=""
                  sizes="(min-width: 640px) 256px, 224px"
                  className={cn(
                    "size-full -rotate-6 drop-shadow-[0_18px_28px_rgb(12_5_3/0.45)] transition-[translate,rotate,scale] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    pose,
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-x-6 bottom-7 flex justify-center lg:bottom-8">
        <p className="translate-y-3 rounded-full border border-white/30 bg-white/20 px-4 py-2 text-sm text-white opacity-0 shadow-soft backdrop-blur-md transition-[opacity,translate] delay-700 duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] in-data-visible:translate-y-0 in-data-visible:opacity-100 motion-reduce:transition-none">
          {caption}
        </p>
      </div>
    </article>
  );
}

/** Light card: a headline figure and a dot bar per segment. */
function AudienceCard({ value, label, description, rows }) {
  return (
    <article className={cn(cardBase, "bg-surface md:col-span-2 lg:col-span-1")}>
      <p className="text-5xl leading-none font-medium tracking-[-0.03em] text-headline tabular-nums lg:text-6xl">
        <Odometer value={value} />
      </p>
      <p className="mt-3 font-medium text-headline">{label}</p>
      <p className="mt-1 max-w-xs text-sm leading-relaxed text-muted">
        {description}
      </p>

      <ul className="mt-auto space-y-3 pt-8">
        {rows.map((row) => (
          <li
            key={row.label}
            className="grid grid-cols-[6.5rem_1fr_auto] items-center gap-3"
          >
            <span className="text-sm text-content">{row.label}</span>
            <span aria-hidden="true" className="flex gap-1.5 overflow-hidden">
              {Array.from({ length: Math.round(row.value / 3) }, (_, i) => (
                <span key={i} className="size-2 shrink-0 rounded-full bg-brand" />
              ))}
            </span>
            <span className="text-sm text-muted tabular-nums">{row.value}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
