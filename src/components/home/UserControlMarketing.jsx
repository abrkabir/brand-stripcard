import Image from "next/image";
import { icons } from "@/components/icons";
import { Reveal } from "@/components/shared/Reveal";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { userControlHeading, userControlShowcase, userControlStats } from "@/data/userControlMarketing";
import { cn } from "@/lib/cn";
import phoneWallet from "../../../public/images/assets/app/phone-wallet.webp";
import cardBusiness from "../../../public/images/assets/cards/card-business.webp";
import cardOrange from "../../../public/images/assets/cards/card-orange.webp";
import cardSilver from "../../../public/images/assets/cards/card-silver.webp";
import dashboardDark from "../../../public/images/assets/user-control/dashboard-dark.webp";
import dashboardLight from "../../../public/images/assets/user-control/dashboard-light.webp";

/*
 * The showcase is one picture that scales as a whole: the stage sets its font
 * size from its container's width (1em is 1% of it on wide screens) and
 * everything inside is sized in em. Narrow screens get a bigger em and the
 * dashboard cropped behind the phone.
 */

/**
 * The dashboard, behind a pane of glass: a screenshot of the real one
 * (public/images/assets/user-control/dashboard-*.webp), light or dark with the
 * site. Retake them when the dashboard changes.
 */
function DashboardScreen() {
  return (
    <div className="rounded-[2em] bg-white/25 p-[0.8em] shadow-[0_2.5em_5em_-1.5em_rgb(70_20_0/0.45)] ring-1 ring-white/50 backdrop-blur-md">
      <div className="overflow-hidden rounded-[1.3em]">
        <Image src={dashboardLight} alt="" sizes="(min-width: 1280px) 860px, 70vw" className="h-auto w-full dark:hidden" />
        <Image src={dashboardDark} alt="" sizes="(min-width: 1280px) 860px, 70vw" className="hidden h-auto w-full dark:block" />
      </div>
    </div>
  );
}

/** A piece of the showcase that rises into place once it scrolls into view, after `delay` ms. */
function Rise({ delay, className, children }) {
  return (
    <div
      className={cn(
        "absolute translate-y-[3em] opacity-0 transition-[opacity,translate] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] in-data-visible:translate-y-0 in-data-visible:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none",
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/**
 * The cards that take turns, in order, each with how far into the 10.5s cycle
 * it starts: a third apart, so orange shows first, then Business, then silver.
 */
const SWAP = [
  { name: "orange", src: cardOrange, delay: "-0.5s" },
  { name: "business", src: cardBusiness, delay: "-7.5s" },
  { name: "silver", src: cardSilver, delay: "-4s" },
];

/**
 * One card at a time, the three swapping by themselves: each glides in from
 * the right as the last glides out to the left, and a dot for each, on a
 * small glass pill at the card's foot, stretches while its card is showing
 * (`animate-card-swap` and `animate-dot-swap` in tokens.css). With reduced
 * motion it rests on the orange card, its dot lit.
 */
function CardSwap() {
  return (
    <div className="relative aspect-[1411/843]">
      {SWAP.map((card, i) => (
        <div
          key={card.name}
          data-loop
          className={cn("absolute inset-0 animate-card-swap", i > 0 && "opacity-0")}
          style={{ animationDelay: card.delay }}
        >
          <Image
            src={card.src}
            alt=""
            sizes="(min-width: 1024px) 360px, 200px"
            className="h-auto w-full drop-shadow-[0_1.4em_1.6em_rgb(20_6_0/0.45)]"
          />
        </div>
      ))}
      <div className="absolute inset-x-0 bottom-[1.1em] flex justify-center">
        <span className="flex items-center gap-[0.35em] rounded-full bg-hero-ink/35 px-[0.6em] py-[0.5em] ring-1 ring-white/15 backdrop-blur-sm">
          {SWAP.map((card, i) => (
            <span
              key={card.name}
              data-loop
              className={cn("h-[0.45em] animate-dot-swap rounded-full bg-white", i === 0 ? "w-[1.5em]" : "w-[0.45em] opacity-50")}
              style={{ animationDelay: card.delay }}
            />
          ))}
        </span>
      </div>
    </div>
  );
}

/**
 * "Your cards and your balance, all in your control": one strong line, then
 * the showcase on a dark stage deepening to brand orange, in either theme
 * (the dashboard on screen, the app on a phone at its right, three cards
 * swapping in turn at its lower left), then under it, on the right, the
 * eyebrow over one bold statement: the title, running on into the
 * description in a quieter colour. Four stat cards close the section.
 */
export function UserControlMarketing() {
  const { lead, eyebrow, title, description } = userControlHeading;
  const LeadIcon = icons[lead.icon];

  return (
    <section id="user-control-marketing" aria-labelledby="user-control-title" className="bg-page py-20 lg:py-28">
      <Container>
        {/* One strong line over the showcase, its icon rippling like a live
            signal: two rings, half a cycle apart, so the pulse never stops. */}
        <Reveal className="mb-8 flex translate-y-6 items-center gap-4 opacity-0 transition-[opacity,translate] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] data-visible:translate-y-0 data-visible:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100 sm:gap-5 lg:mb-10">
          <span aria-hidden="true" className="relative grid size-10 shrink-0 place-items-center sm:size-11">
            <span data-loop className="absolute inset-0 animate-ripple-soft rounded-full bg-brand/45" />
            <span data-loop className="absolute inset-0 animate-ripple-soft rounded-full bg-brand/45 [animation-delay:1.4s]" />
            <span className="relative grid size-full place-items-center rounded-full bg-brand text-white shadow-[0_0.5rem_1.25rem_-0.25rem_rgb(242_106_27/0.55)]">
              <LeadIcon className="size-5" />
            </span>
          </span>
          <p className="font-heading text-[clamp(1rem,1.5vw,1.25rem)] leading-[1.4] font-semibold tracking-[-0.015em] text-balance text-headline">
            {lead.strong} <span className="font-medium text-muted">{lead.rest}</span>
          </p>
        </Reveal>

        <Reveal className="@container">
          <div
            role="img"
            aria-label={userControlShowcase.label}
            className="relative isolate aspect-[4/5] overflow-hidden rounded-[2rem] bg-linear-to-br from-hero-ink via-brand-950 to-brand-800 text-[length:2.8cqw] select-none @min-[40rem]:aspect-[2.1/1] @min-[40rem]:text-[length:1cqw] lg:rounded-[2.5rem]"
          >
            <Rise delay={0} className="top-[3.5em] left-[3em] w-[50em] @min-[40rem]:top-[4.5em] @min-[40rem]:left-[15em] @min-[40rem]:w-[70em]">
              <DashboardScreen />
            </Rise>

            <Rise delay={300} className="bottom-px left-[2em] w-[18em] @min-[40rem]:left-[6em] @min-[40rem]:w-[28em]">
              <CardSwap />
            </Rise>

            <Rise delay={150} className="top-[13.5em] left-[14em] w-[20em] @min-[40rem]:top-[15.5em] @min-[40rem]:left-[73em]">
              {/* The app's wallet screen: an image, shared with the app section
                  (public/images/assets/app/phone-wallet.webp). */}
              <Image
                src={phoneWallet}
                alt=""
                sizes="(min-width: 1024px) 260px, 200px"
                className="h-auto w-full drop-shadow-[0_3em_2.5em_rgb(50_12_0/0.55)]"
              />
            </Rise>
          </div>
        </Reveal>

        <Reveal className="mt-10 grid translate-y-6 gap-6 opacity-0 transition-[opacity,translate] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] data-visible:translate-y-0 data-visible:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100 sm:gap-8 lg:mt-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-x-16">
          <div className="lg:col-start-2 lg:row-start-1">
            <Eyebrow>{eyebrow}</Eyebrow>
            <div className="mt-5 font-heading text-[clamp(1.25rem,2vw,1.75rem)] leading-[1.3] font-medium tracking-[-0.015em] text-pretty">
              <h2 id="user-control-title" className="inline tracking-[inherit] text-headline">
                {title.map((piece, i) =>
                  typeof piece === "string" ? (
                    piece
                  ) : (
                    <span key={i} className="text-brand">
                      {piece.brand}
                    </span>
                  ),
                )}
              </h2>{" "}
              <p className="inline text-muted">{description}</p>
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-14 lg:mt-20">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {userControlStats.map((stat, i) => (
              <StatCard key={stat.title} stat={stat} index={i} />
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}

/**
 * Each stat card's colours, band by band, darkest at the top: the header, the
 * two rows, then the tall panel, lightest of all. `chip` is the ground of the
 * header's icon. The ink and neutral cards follow the theme; the brand and
 * soft ones are the same in both.
 */
const STAT_TONES = {
  // On a dark page, ink would vanish: there the bands are white veils,
  // brightening down to a pale panel.
  ink: {
    header: "bg-hero-ink text-white dark:bg-white/10",
    chip: "bg-white/15",
    rows: ["bg-hero-ink/85 text-white dark:bg-white/15", "bg-hero-ink/70 text-white dark:bg-white/20"],
    panel: "bg-canvas text-headline dark:bg-white/85 dark:text-hero-ink",
  },
  brand: {
    header: "bg-brand-800 text-white",
    chip: "bg-white/15",
    rows: ["bg-brand-700 text-white", "bg-brand-600 text-white"],
    panel: "bg-brand-400 text-hero-ink",
  },
  soft: {
    header: "bg-brand-300 text-hero-ink",
    chip: "bg-white/35",
    rows: ["bg-brand-200 text-hero-ink", "bg-brand-100 text-hero-ink"],
    panel: "bg-brand-50 text-hero-ink",
  },
  neutral: {
    header: "bg-line text-headline dark:bg-white/[0.16]",
    chip: "bg-card",
    rows: ["bg-canvas text-headline dark:bg-white/[0.11]", "bg-surface text-headline dark:bg-white/[0.08]"],
    panel: "bg-surface text-headline ring-1 ring-line ring-inset dark:bg-white/[0.05]",
  },
};

/**
 * One point about what you control, as a stack of separate bands with a thin
 * gap between each: the title with its icon, two rows (the value first, what
 * it is after), and a tall panel with the big figure in its middle and a
 * short line at its foot. The cards rise in one after another as the row
 * scrolls into view.
 */
function StatCard({ stat, index }) {
  const tone = STAT_TONES[stat.tone] ?? STAT_TONES.neutral;
  const Icon = icons[stat.icon];
  const band = "rounded-[0.9rem] px-4";

  return (
    <li
      className="flex translate-y-6 flex-col gap-[3px] opacity-0 transition-[opacity,translate] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] in-data-visible:translate-y-0 in-data-visible:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100"
      style={{ transitionDelay: `${index * 90}ms` }}
    >
      <h3 className={cn(band, "flex items-center gap-2 py-3 text-[15px] font-medium", tone.header)}>
        <span className={cn("grid size-6 place-items-center rounded-full", tone.chip)}>
          <Icon className="size-3.5" />
        </span>
        {stat.title}
      </h3>

      <dl className="flex flex-col gap-[3px]">
        {stat.rows.map((row, i) => (
          <div key={row.label} className={cn(band, "flex items-baseline justify-between gap-3 py-3.5", tone.rows[i])}>
            <dt className="order-last text-xs opacity-65">{row.label}</dt>
            <dd className="text-[15px] font-medium tabular-nums">{row.value}</dd>
          </div>
        ))}
      </dl>

      <div className={cn(band, "flex min-h-52 flex-1 flex-col items-center pt-6 pb-5 text-center sm:min-h-64", tone.panel)}>
        <p className="my-auto font-heading text-[clamp(2.5rem,3.6vw,3.5rem)] leading-none font-medium tracking-[-0.02em]">
          {stat.figure}
        </p>
        <p className="mt-4 max-w-[18rem] text-[14.5px] leading-snug text-pretty opacity-75">{stat.description}</p>
      </div>
    </li>
  );
}
