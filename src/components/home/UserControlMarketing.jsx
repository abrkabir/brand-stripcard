import Image from "next/image";
import { ArrowUpRightIcon, BellIcon, icons, LayersIcon, PlusIcon, SwapIcon } from "@/components/icons";
import { Reveal } from "@/components/shared/Reveal";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { dashboardUser, myCards, wallet } from "@/data/dashboard";
import { userControlHeading, userControlShowcase } from "@/data/userControlMarketing";
import { cn } from "@/lib/cn";
import cardOrange from "../../../public/images/assets/cards/card-orange.webp";
import cardPlatinum from "../../../public/images/assets/cards/card-platinum.webp";
import cardSilver from "../../../public/images/assets/cards/card-silver.webp";
import dashboardDark from "../../../public/images/assets/user-control/dashboard-dark.webp";
import dashboardLight from "../../../public/images/assets/user-control/dashboard-light.webp";

/** The wallet's actions on the phone, as round buttons. `flip` turns the arrow to point down and in. */
const PHONE_BUTTONS = [
  { label: "Add money", Icon: ArrowUpRightIcon, flip: true },
  { label: "Withdraw", Icon: ArrowUpRightIcon },
  { label: "Transfer", Icon: SwapIcon },
  { label: "New card", Icon: PlusIcon },
];

/** Each of the dashboard's cards, by id, as one of the card images. */
const CARD_ART = { subs: cardOrange, travel: cardPlatinum, shop: cardSilver };

const money = (n) => Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

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

/**
 * The app's wallet screen on a phone, the same whatever the site's theme, from
 * the same demo account as the dashboard: the balance and the wallet's actions
 * on brand orange, then a white sheet with the cards, each with its monthly
 * limit and whether it is on.
 */
function PhoneScreen() {
  const { avatar } = dashboardUser;
  const [whole, cents] = money(wallet.balance).split(".");

  return (
    <div className="rounded-[3.2em] bg-hero-ink p-[0.55em] shadow-[0_3em_5em_-1.5em_rgb(50_12_0/0.6)] ring-[0.15em] ring-white/20">
      <div className="relative flex h-[42em] flex-col overflow-hidden rounded-[2.7em] bg-brand-600 text-white">
        {/* Status bar. */}
        <div className="flex h-[1.8em] shrink-0 items-center justify-between px-[1.6em] pt-[0.9em]">
          <span className="text-[0.66em] font-semibold">9:41</span>
          <span className="flex items-end gap-[0.12em]">
            {[0.35, 0.5, 0.65, 0.8].map((h) => (
              <span key={h} className="w-[0.18em] rounded-full bg-current" style={{ height: `${h}em` }} />
            ))}
            <span className="ml-[0.35em] h-[0.7em] w-[1.35em] rounded-[0.25em] p-[0.1em] ring-1 ring-current">
              <span className="block h-full w-3/4 rounded-[0.12em] bg-current" />
            </span>
          </span>
        </div>
        <span className="absolute top-[0.85em] left-1/2 h-[1.6em] w-[5.6em] -translate-x-1/2 rounded-full bg-black" />

        <div className="shrink-0 px-[1.2em]">
          <div className="mt-[1em] flex items-center gap-[0.5em]">
            <span className="font-heading text-[1.05em] font-semibold">Wallet</span>
            <span className="relative ml-auto grid size-[2.1em] place-items-center rounded-full bg-brand-100 text-hero-ink">
              <BellIcon className="size-[1em]" />
              <span className="absolute top-[0.45em] right-[0.5em] size-[0.4em] rounded-full bg-brand-600" />
            </span>
            <Image src={avatar} alt="" sizes="40px" className="size-[2.1em] rounded-full object-cover ring-[0.12em] ring-brand-100" />
          </div>

          {/* Balance. */}
          <p className="mt-[1.1em] text-center font-heading text-[2.6em] leading-none font-semibold tracking-[-0.01em]">
            ${whole}
            <span className="text-[0.5em] text-white/70">.{cents}</span>
          </p>
          <p className="mt-[0.6em] flex items-center justify-center gap-[0.4em] text-[0.52em] text-white/75">
            Wallet ID: {userControlShowcase.phone.walletId} <LayersIcon className="size-[1.2em]" />
          </p>

          {/* The wallet's actions. */}
          <div className="mt-[1.2em] flex justify-between px-[0.6em]">
            {PHONE_BUTTONS.map(({ label, Icon, flip }) => (
              <span key={label} className="grid size-[3em] place-items-center rounded-full bg-brand-100 text-hero-ink">
                <Icon className={cn("size-[1.2em]", flip && "rotate-180")} />
              </span>
            ))}
          </div>
        </div>

        {/* The sheet: the cards tab open, transactions beside it. */}
        <div className="mt-[1.5em] flex flex-1 flex-col">
          <div className="relative flex h-[2.6em] shrink-0">
            <span className="grid w-1/2 place-items-center rounded-t-[1.2em] bg-white text-hero-ink">
              <span className="text-[0.62em] font-semibold">My cards</span>
            </span>
            {/* The curve where the open tab meets the sheet. */}
            <span className="absolute bottom-0 left-1/2 size-[1.2em] bg-[radial-gradient(circle_at_100%_0,transparent_1.15em,white_1.2em)]" />
            <span className="grid w-1/2 place-items-center">
              <span className="text-[0.62em] font-medium text-white/85">Transactions</span>
            </span>
          </div>
          <div className="flex-1 rounded-tr-[1.2em] bg-white px-[1.1em] pt-[0.5em] text-hero-ink">
            {myCards.map((card) => (
              <div key={card.id} className="flex items-center gap-[0.7em] border-b border-hero-ink/[0.07] py-[0.75em]">
                <Image src={CARD_ART[card.id]} alt="" sizes="48px" className="h-auto w-[2.9em] shrink-0" />
                <span className="min-w-0 leading-tight">
                  <span className="block truncate text-[0.64em] font-semibold">{card.name}</span>
                  <span className="block text-[0.5em] text-hero-ink/55">•• {card.last4}</span>
                </span>
                <span className="ml-auto text-right leading-tight">
                  <span className="block text-[0.64em] font-semibold">${money(card.limit)}</span>
                  <span className={cn("block text-[0.5em] font-medium", card.status === "Active" ? "text-success" : "text-brand-600")}>
                    {card.status === "Active" ? "Active, monthly limit" : card.status}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
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

/** How far in each row of badges starts, so the rows stagger into a loose cluster. */
const BADGE_ROW_OFFSET = ["ml-16 sm:ml-24", "ml-6 sm:ml-10", "ml-0"];

/**
 * "Your cards and your balance, all in your control": the showcase on a flat
 * brand stage (the dashboard on screen, the app on a phone at its right, the
 * orange card in front at its lower left), then under it a cluster of what
 * you control on the left, and the eyebrow over one bold statement on the
 * right: the title, running on into the description in a quieter colour.
 */
export function UserControlMarketing() {
  const { eyebrow, title, description, badges } = userControlHeading;

  return (
    <section id="user-control-marketing" aria-labelledby="user-control-title" className="bg-page py-20 lg:py-28">
      <Container>
        <Reveal className="@container">
          <div
            role="img"
            aria-label={userControlShowcase.label}
            className="relative isolate aspect-[4/5] overflow-hidden rounded-[2rem] bg-brand-500 text-[length:2.8cqw] select-none @min-[40rem]:aspect-[2.1/1] @min-[40rem]:text-[length:1cqw] lg:rounded-[2.5rem] dark:bg-brand-600"
          >
            <Rise delay={0} className="top-[3.5em] left-[3em] w-[50em] @min-[40rem]:top-[4.5em] @min-[40rem]:left-[15em] @min-[40rem]:w-[70em]">
              <DashboardScreen />
            </Rise>

            <Rise delay={300} className="bottom-px left-[2em] w-[18em] @min-[40rem]:left-[6em] @min-[40rem]:w-[28em]">
              <Image
                src={cardOrange}
                alt=""
                sizes="(min-width: 1024px) 360px, 200px"
                className="h-auto w-full drop-shadow-[0_1.4em_1.6em_rgb(90_25_0/0.4)]"
              />
            </Rise>

            <Rise delay={150} className="top-[13.5em] left-[14em] w-[20em] @min-[40rem]:top-[15.5em] @min-[40rem]:left-[73em]">
              <PhoneScreen />
            </Rise>
          </div>
        </Reveal>

        <Reveal className="mt-10 grid translate-y-6 gap-6 opacity-0 transition-[opacity,translate] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] data-visible:translate-y-0 data-visible:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100 sm:gap-8 lg:mt-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-x-16">
          <div className="lg:col-start-2 lg:row-start-1">
            <Eyebrow>{eyebrow}</Eyebrow>
            <div className="mt-5 font-heading text-[clamp(1.5rem,2.5vw,2.25rem)] leading-[1.25] font-medium tracking-[-0.015em] text-pretty">
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

          <ul className="flex flex-col gap-2.5 lg:col-start-1 lg:row-start-1 lg:self-end">
            {badges.map((row, i) => (
              <li key={i} className={cn("flex flex-wrap gap-2.5", BADGE_ROW_OFFSET[i])}>
                {row.map((badge) => {
                  const Icon = icons[badge.icon];
                  return (
                    <span
                      key={badge.label}
                      className="inline-flex items-center gap-2 rounded-full border border-line bg-card py-1.5 pr-4 pl-1.5 text-sm font-medium text-headline"
                    >
                      <span className="grid size-7 place-items-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
                        <Icon className="size-3.5" />
                      </span>
                      {badge.label}
                    </span>
                  );
                })}
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
