import { getIcon, ShieldIcon } from "@/components/icons";
import { PulseDot } from "@/components/shared/PulseDot";
import { Reveal } from "@/components/shared/Reveal";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Odometer } from "@/components/ui/Odometer";
import { Switch } from "@/components/ui/Switch";
import { about } from "@/data/about";
import { cn } from "@/lib/cn";

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
          <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-8 lg:mt-6 lg:grid-cols-4">
            {facts.items.map((fact) => (
              <div key={fact.label} className="flex flex-col-reverse gap-2">
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

/** Dark card: an icon, a two-tone statement and a working toggle. */
function SecurityCard({ text, toggle }) {
  return (
    <article className={cn(cardBase, "bg-hero-ink text-white")}>
      <span className="grid size-11 place-items-center rounded-xl bg-white/10">
        <ShieldIcon className="size-5" />
      </span>

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
 * Picture card. No photography yet, so the product is drawn: two virtual
 * cards fanned on the brand gradient, with a glass caption floating over
 * them — the same composition as a lifestyle photo with a label.
 */
function VisualCard({ caption, last4 }) {
  return (
    <article
      className={cn(cardBase, "items-center justify-center bg-hero-glow p-0 lg:p-0")}
    >
      <div
        aria-hidden="true"
        className="bg-grain pointer-events-none absolute inset-0 opacity-[0.16] mix-blend-overlay"
      />

      <div aria-hidden="true" className="relative">
        {/* Back card: frosted, offset and turned the other way. */}
        <div className="absolute inset-0 translate-x-6 -translate-y-5 rotate-[10deg] rounded-2xl border border-white/25 bg-white/15 backdrop-blur-sm" />
        <VirtualCard last4={last4} />
      </div>

      <p className="absolute top-[58%] left-6 rounded-full border border-white/30 bg-white/20 px-4 py-2 text-sm text-white shadow-soft backdrop-blur-md lg:left-7">
        {caption}
      </p>
    </article>
  );
}

/** The drawn card face. Decorative — its parent hides it from assistive tech. */
function VirtualCard({ last4 }) {
  return (
    <div className="relative flex aspect-[1.586] w-60 -rotate-6 flex-col justify-between rounded-2xl border border-white/15 bg-linear-to-br from-hero-ink via-brand-950 to-brand-900 p-5 text-white shadow-lift sm:w-64">
      <div className="flex items-start justify-between">
        <span className="font-display text-base font-semibold tracking-[-0.01em]">
          Strip<span className="text-brand-300">Card</span>
        </span>
        <span className="text-[10px] tracking-[0.2em] text-white/60 uppercase">
          Virtual
        </span>
      </div>

      {/* EMV chip */}
      <span className="h-7 w-9 rounded-md bg-linear-to-br from-gold-300 to-gold-500" />

      <div className="flex items-end justify-between">
        <span className="font-mono text-sm tracking-[0.18em] text-white/85">
          •••• {last4}
        </span>
        <span className="text-[10px] text-white/60">12/29</span>
      </div>
    </div>
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
