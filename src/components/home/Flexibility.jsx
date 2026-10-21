import Image from "next/image";
import Link from "next/link";
import { siNetflix } from "simple-icons";
import { ArrowRightIcon, LongArrowRightIcon } from "@/components/icons";
import { CurrencyMark } from "@/components/shared/CurrencyMark";
import { Reveal } from "@/components/shared/Reveal";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { flexibility, flexibilityHeading } from "@/data/flexibility";
import { cn } from "@/lib/cn";
import cardOrange from "../../../public/images/assets/cards/card-orange.webp";
import cardPlatinum from "../../../public/images/assets/cards/card-platinum.webp";
import cardSilver from "../../../public/images/assets/cards/card-silver.webp";

/** A slow, smooth ease for everything that moves here. */
const EASE = "duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]";

/**
 * Frosted glass, over a dark poster or a light one. A medium blur: the
 * browser redoes a backdrop blur on every frame something under it moves, and
 * its cost grows with the radius, so this keeps the frost at half the price.
 */
const GLASS_DARK = "bg-white/10 ring-1 ring-white/20 backdrop-blur-md";
const GLASS_LIGHT = "bg-white/40 ring-1 ring-white/70 backdrop-blur-md dark:bg-white/10 dark:ring-white/15";

/* ── What every poster shares ──────────────────────────────────────────── */

/**
 * The poster's frame: a tall rounded card that lifts a little when pointed
 * at, with grain over it. `tone` is dark, light (white with a hairline) or
 * soft (the surface grey). The whole poster is its title's link, so it shows
 * the focus ring when that link has it.
 */
function Poster({ tone, className, children }) {
  return (
    <article
      className={cn(
        "group relative isolate flex aspect-[9/10] flex-col overflow-hidden rounded-[1.75rem] p-6 transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:shadow-lift has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-brand motion-reduce:hover:translate-y-0 sm:p-7",
        tone === "dark" && "bg-hero-ink dark:ring-1 dark:ring-white/10 dark:ring-inset",
        tone === "light" && "bg-card ring-1 ring-line ring-inset",
        tone === "soft" && "bg-surface",
        className,
      )}
    >
      {children}
      {/* Grain, laid on plainly rather than with a blend mode: blending it
          over the drifting glow meant re-blending the poster every frame. */}
      <span aria-hidden="true" className="bg-grain pointer-events-none absolute inset-0 opacity-[0.07]" />
    </article>
  );
}

/**
 * A soft bloom of brand light, drifting slowly. Place and size it with
 * `className`.
 *
 * The softness is all in the gradient, which fades out over many stops: no
 * `blur` filter. A blurred element that is also animated gets a layer of its
 * own, and the browser then re-runs the blur on every frame of a scroll,
 * which is what made this section stutter. A plain gradient layer just moves.
 */
function Glow({ className, strong }) {
  return (
    <span
      aria-hidden="true"
      data-loop
      className={cn(
        // `scale` stands in for the spread a blur used to give it; it
        // composes with the drift's own transform.
        "pointer-events-none absolute -z-10 scale-[1.45] rounded-full motion-safe:animate-glow-drift",
        strong
          ? "bg-[radial-gradient(circle_closest-side,rgb(255_168_108/0.95)_0%,rgb(248_128_58/0.82)_18%,rgb(242_106_27/0.55)_38%,rgb(242_106_27/0.3)_56%,rgb(242_106_27/0.13)_74%,rgb(242_106_27/0.04)_88%,rgb(242_106_27/0)_100%)]"
          : "bg-[radial-gradient(circle_closest-side,rgb(255_160_100/0.62)_0%,rgb(246_122_52/0.46)_20%,rgb(242_106_27/0.3)_40%,rgb(242_106_27/0.16)_60%,rgb(242_106_27/0.06)_80%,rgb(242_106_27/0)_100%)]",
        className,
      )}
    />
  );
}

/** The header every poster carries: its label, and a long arrow in the corner that slides on hover. */
function TopBar({ label, dark }) {
  return (
    <div className="relative z-10 flex items-center justify-between pb-3">
      <p className={cn("text-sm font-medium", dark ? "text-white/80" : "text-content")}>{label}</p>
      <LongArrowRightIcon
        aria-hidden="true"
        className={cn(
          "size-6 transition-transform duration-500 group-hover:translate-x-1",
          dark ? "text-white/80" : "text-headline",
        )}
      />
    </div>
  );
}

/** The poster's number, in an outlined pill. */
function Num({ n, dark }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-3 py-1 text-xs font-medium tabular-nums",
        dark ? "border-white/40 text-white" : "border-brand/40 bg-brand-50 text-brand-700 dark:bg-brand/15 dark:text-brand-300",
      )}
    >
      {String(n).padStart(2, "0")}
    </span>
  );
}

/** The big statement: the poster's link, its target stretched over the whole poster. */
function Title({ item, dark, className }) {
  return (
    <h3
      className={cn(
        "font-heading text-[clamp(1.875rem,2.6vw,2.5rem)] leading-[1.04] font-light tracking-[-0.025em]",
        dark ? "text-white" : "text-headline",
        className,
      )}
    >
      <Link href={item.link.href} className="outline-none after:absolute after:inset-0 after:z-30 after:rounded-[1.75rem]">
        {item.title}
        <span className="sr-only">, {item.link.label}</span>
      </Link>
    </h3>
  );
}

/** The short line under the title, in brackets. */
function Note({ children, dark, className }) {
  return <p className={cn("mt-2.5 text-sm", dark ? "text-white/60" : "text-muted", className)}>({children})</p>;
}

/** A thick ribbon swooping across a poster, white or ink. */
function Ribbon({ className, light }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 400 150" fill="none" className={cn("pointer-events-none absolute", className)}>
      <path
        d="M-20 128 C 50 132, 70 52, 132 58 S 214 146, 282 102 S 362 6, 430 22"
        strokeWidth="24"
        strokeLinecap="round"
        className={cn(
          light ? "stroke-white" : "stroke-hero-ink dark:stroke-white/85",
          "drop-shadow-[0_14px_14px_rgb(0_0_0/0.25)]",
        )}
      />
    </svg>
  );
}

/* ── The posters ───────────────────────────────────────────────────────── */

/** 01 · Send money: brand light over black, the statement low, and a pill to act on it. */
function SendPoster({ item, n }) {
  return (
    <Poster tone="dark">
      <Glow strong className="-top-[38%] left-1/2 h-[95%] w-[130%] -translate-x-1/2" />
      <TopBar label={item.label} dark />
      <div className="relative z-10 mt-auto">
        <Num n={n} dark />
        <Title item={item} dark className="mt-4" />
        <Note dark>{item.note}</Note>
        <span
          aria-hidden="true"
          className="mt-6 inline-flex h-14 items-center gap-4 rounded-full bg-brand pr-1.5 pl-6 text-base font-medium text-white shadow-[0_14px_34px_-12px_rgb(242_106_27/0.8)]"
        >
          {item.action}
          <span className="grid size-11 place-items-center rounded-full bg-white text-hero-ink transition-transform duration-300 group-hover:translate-x-1">
            <ArrowRightIcon className="size-5" />
          </span>
        </span>
      </div>
    </Poster>
  );
}

/** 02 · Hold currencies: a white poster, the statement large, and the currencies at its foot. */
function CurrenciesPoster({ item, n }) {
  return (
    <Poster tone="light">
      <Glow className="-right-[30%] -bottom-[30%] size-[100%]" />
      <TopBar label={item.label} />
      <div className="relative z-10 mt-6">
        <Num n={n} />
        <Title item={item} className="mt-4" />
        <Note>{item.note}</Note>
      </div>
      <div className="relative z-10 mt-auto flex items-center">
        {["USD", "EUR", "GBP", "JPY", "INR"].map((code, i) => (
          <CurrencyMark
            key={code}
            code={code}
            className={cn("size-11 rounded-full ring-[3px] ring-card transition-transform duration-500", i > 0 && "-ml-3", "group-hover:-translate-y-1")}
          />
        ))}
        <span className="-ml-3 grid size-11 place-items-center rounded-full bg-hero-ink text-xs font-semibold text-white ring-[3px] ring-card dark:bg-white dark:text-hero-ink">
          +24
        </span>
      </div>
    </Poster>
  );
}

/** 03 · A card for every spend: the orange card glowing over black, seen through a glass panel. */
function CardsPoster({ item, n }) {
  return (
    <Poster tone="dark">
      <Glow strong className="-top-[6%] -right-[22%] size-[85%]" />
      <TopBar label={item.label} dark />
      <div className="pointer-events-none absolute top-[13%] -right-[16%] w-[86%]">
        <div data-loop className="motion-safe:animate-card-bob">
          <Image
            src={cardOrange}
            alt=""
            sizes="(min-width: 1280px) 22rem, (min-width: 768px) 40vw, 80vw"
            className={cn(
              "w-full -rotate-[24deg] drop-shadow-[0_34px_50px_rgb(242_106_27/0.45)] transition-[rotate,translate] group-hover:-translate-y-2 group-hover:-rotate-[16deg]",
              EASE,
            )}
          />
        </div>
      </div>
      <Ribbon light className="-right-[12%] -bottom-[3%] w-[90%] rotate-[-8deg]" />
      <div className={cn("relative z-10 mt-auto mb-8 rounded-[1.5rem] p-5", GLASS_DARK)}>
        <Num n={n} dark />
        <Title item={item} dark className="mt-3 text-[clamp(1.625rem,2.2vw,2.125rem)]" />
        <Note dark>{item.note}</Note>
      </div>
    </Poster>
  );
}

/** 04 · Exchange at the real rate: light, a glow, a rate quoted on glass, and an ink ribbon. */
function ExchangePoster({ item, n }) {
  return (
    <Poster tone="light">
      <Glow className="top-[18%] -left-[32%] size-[90%]" />
      <TopBar label={item.label} />
      <div className="relative z-10 mt-6">
        <Num n={n} />
        <Title item={item} className="mt-4" />
        <Note>{item.note}</Note>
      </div>
      <p
        className={cn(
          "relative z-10 mt-auto mb-14 ml-auto flex w-fit items-center gap-2.5 rounded-full py-1.5 pr-4 pl-1.5 text-sm font-semibold text-headline tabular-nums transition-transform group-hover:-translate-y-1",
          GLASS_LIGHT,
          EASE,
        )}
      >
        <span className="flex">
          <CurrencyMark code="EUR" className="size-7 rounded-full" />
          <CurrencyMark code="USD" className="-ml-2 size-7 rounded-full ring-2 ring-white/70" />
        </span>
        1 EUR = 1.0816 USD
      </p>
      <Ribbon className="-bottom-[6%] -left-[14%] w-[125%]" />
    </Poster>
  );
}

/** 05 · Freeze any card: a frosted folder with two cards tucked in it, rising when pointed at. */
function FreezePoster({ item, n }) {
  return (
    <Poster tone="soft">
      <Glow className="-top-[22%] left-1/2 size-[90%] -translate-x-1/2" />
      <TopBar label={item.label} />
      <div className="relative z-10 mt-auto">
        {/* The cards inside, their tops showing above the folder's edge. */}
        <div className="pointer-events-none absolute inset-x-[10%] -top-[5.5rem] h-28">
          <Image
            src={cardPlatinum}
            alt=""
            sizes="(min-width: 1280px) 16rem, 60vw"
            className={cn("absolute top-0 left-[4%] w-[78%] -rotate-6 transition-transform group-hover:-translate-y-3", EASE)}
          />
          <Image
            src={cardSilver}
            alt=""
            sizes="(min-width: 1280px) 16rem, 60vw"
            className={cn("absolute top-5 right-[2%] w-[74%] rotate-[5deg] transition-transform delay-75 group-hover:-translate-y-5", EASE)}
          />
        </div>
        {/* The folder's tab, then its smoked-glass front, darkest in its lower corner. */}
        <div className="relative h-6 w-[44%] rounded-t-2xl bg-hero-ink/55 ring-1 ring-white/25 backdrop-blur-md" />
        <div className="relative overflow-hidden rounded-[1.5rem] rounded-tl-none bg-hero-ink/55 p-5 ring-1 ring-white/25 backdrop-blur-md">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(130%_100%_at_0%_100%,rgb(12_5_3/0.85)_0%,rgb(12_5_3/0.35)_55%,rgb(255_255_255/0.08)_100%)]"
          />
          <div className="relative">
            <Num n={n} dark />
            <Title item={item} dark className="mt-3 text-[clamp(1.625rem,2.2vw,2.125rem)]" />
            <Note dark className="text-white/70">
              {item.note}
            </Note>
          </div>
        </div>
      </div>
    </Poster>
  );
}

/** 06 · Every payment: streaks of brand light across black, and an alert arriving on glass. */
function AlertsPoster({ item, n }) {
  return (
    <Poster tone="dark">
      {/* The streaks: two long ellipses of light, soft at every edge from
          their gradients alone (no blur filter, see Glow), the first
          drifting. */}
      <span
        aria-hidden="true"
        data-loop
        className="pointer-events-none absolute top-[38%] -right-[45%] -z-10 h-[38%] w-[150%] -rotate-[32deg] bg-[radial-gradient(closest-side,rgb(255_190_140)_0%,rgb(246_118_45/0.9)_30%,rgb(242_106_27/0.5)_58%,rgb(242_106_27/0.16)_82%,rgb(242_106_27/0)_100%)] motion-safe:animate-glow-drift"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-[62%] -right-[30%] -z-10 h-[16%] w-[120%] -rotate-[32deg] bg-[radial-gradient(closest-side,rgb(255_150_90/0.8)_0%,rgb(242_106_27/0.38)_50%,rgb(242_106_27/0.1)_80%,rgb(242_106_27/0)_100%)]"
      />
      <TopBar label={item.label} dark />
      <div className="relative z-10 mt-6">
        <Num n={n} dark />
        <Title item={item} dark className="mt-4" />
        <Note dark>{item.note}</Note>
      </div>
      <div
        className={cn(
          "relative z-10 mt-auto flex items-center gap-3 rounded-2xl p-3 pr-4 transition-transform group-hover:-translate-y-1",
          GLASS_DARK,
          EASE,
        )}
      >
        <span className="relative grid size-10 shrink-0 place-items-center rounded-full bg-hero-ink text-white">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[1.125rem] fill-current">
            <path d={siNetflix.path} />
          </svg>
          <span className="absolute -top-0.5 -right-0.5 size-3 rounded-full bg-brand ring-2 ring-hero-ink" />
        </span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block truncate text-sm font-semibold text-white">Netflix</span>
          <span className="mt-0.5 block truncate text-xs text-white/60">Subscriptions card</span>
        </span>
        <span className="shrink-0 text-right leading-tight">
          <span className="block text-sm font-semibold text-white tabular-nums">−$15.49</span>
          <span className="mt-0.5 block text-xs text-white/60">Just now</span>
        </span>
      </div>
    </Poster>
  );
}

const POSTERS = {
  send: SendPoster,
  currencies: CurrenciesPoster,
  cards: CardsPoster,
  exchange: ExchangePoster,
  freeze: FreezePoster,
  alerts: AlertsPoster,
};

/**
 * Homepage "flexibility": what one StripCard account does, as a set of
 * posters.
 *
 * The heading sits left, with a line and a way in on the right. Then six tall
 * posters in black, white and grey, three to a row on wide screens: each with
 * a header (its label and an arrow over a hairline), its number, a
 * big light statement and a short note in brackets, set in soft blurs of brand
 * light and grain, with frosted glass and the StripCards themselves as the
 * objects in them. The whole poster is the link.
 *
 * The posters rise in one after another as the grid comes into view; the glows
 * drift and the card floats; pointing at a poster lifts it and moves what is
 * in it. Without motion, all of it simply sits in place. A Server Component.
 */
export function Flexibility() {
  const { eyebrow, title, description, cta } = flexibilityHeading;

  return (
    <section aria-labelledby="flexibility-title" className="bg-page py-20 lg:py-28">
      <Container>
        <Reveal className="flex translate-y-6 flex-col gap-6 opacity-0 transition-[opacity,translate] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] data-visible:translate-y-0 data-visible:opacity-100 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2
              id="flexibility-title"
              className="mt-6 font-heading text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.16] font-medium tracking-[-0.025em] text-headline"
            >
              {title.map((line, i) => (
                <span key={i} className="block">
                  {line.map((piece, j) =>
                    typeof piece === "string" ? (
                      piece
                    ) : (
                      <span key={j} className="text-brand">
                        {piece.brand}
                      </span>
                    ),
                  )}
                </span>
              ))}
            </h2>
          </div>
          <div className="max-w-md lg:pb-1.5">
            <p className="text-[15px] leading-relaxed text-pretty text-content">{description}</p>
            <Button href={cta.href} size="sm" className="mt-5">
              {cta.label}
            </Button>
          </div>
        </Reveal>

        <Reveal className="mt-12 grid gap-4 md:grid-cols-2 lg:mt-16 lg:gap-5 xl:grid-cols-3">
          {flexibility.map((item, i) => {
            const Poster = POSTERS[item.art];
            return (
              <div
                key={item.art}
                className="translate-y-8 opacity-0 transition-[opacity,translate] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] in-data-visible:translate-y-0 in-data-visible:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none"
                style={{ transitionDelay: `${(i % 3) * 110 + Math.floor(i / 3) * 140}ms` }}
              >
                <Poster item={item} n={i + 1} />
              </div>
            );
          })}
        </Reveal>
      </Container>
    </section>
  );
}
