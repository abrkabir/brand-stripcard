"use client";

import Image from "next/image";
import { siVisa } from "simple-icons";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  CountrySelect,
  FIELD_LABEL,
  PhoneField,
  Required,
  SelectField,
  Status,
  TextField,
} from "@/components/dashboard/FormField";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Panel } from "@/components/dashboard/Panel";
import { Stepper } from "@/components/dashboard/Stepper";
import {
  ID_TYPES,
  MAX_FILE,
  Tip,
  UploadZone,
} from "@/components/dashboard/UploadZone";
import {
  CheckIcon,
  CloseIcon,
  CopyIcon,
  CreditCardIcon,
  DownloadIcon,
  EyeIcon,
  IdCardIcon,
  LockIcon,
  PlusIcon,
  SwapIcon,
  UserIcon,
} from "@/components/icons";
import { Button } from "@/components/ui/Button";
import {
  cardDesigns,
  cardHolder,
  cardHolderOptions,
  cardRules,
  myCards,
  wallet,
} from "@/data/dashboard";
import { cn } from "@/lib/cn";
import { dobProblem, nextDob } from "@/lib/dob";
import { formatMoney } from "@/lib/format";

const HEADING =
  "text-[0.6875rem] font-semibold tracking-[0.12em] text-subtle uppercase";

/** How long the demo pretends to talk to the server, in milliseconds. */
const SAVE_MS = 900;

/** How long the card dialog takes to transition out before it closes, in milliseconds (its duration-200). */
const LEAVE_MS = 200;

/** The longest name a card can carry. */
const NAME_MAX = 26;

/**
 * The page has three views: the cards, the card holder's details, and making
 * a card. The open one lives in the URL's hash (#create-card), so each can be
 * linked to; the server, and the first render, see no hash and show the
 * cards.
 */
const VIEWS = ["cards", "card-holder", "create-card"];
const onHash = (callback) => {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
};
const readHash = () => window.location.hash.slice(1);
const noHash = () => "";

function openView(id) {
  const url =
    id === "cards"
      ? window.location.pathname
      : `${window.location.pathname}#${id}`;
  window.history.replaceState(null, "", url);
  window.dispatchEvent(new HashChangeEvent("hashchange"));
  window.scrollTo({ top: 0 });
}

const designOf = (id) => cardDesigns.find((d) => d.id === id) ?? cardDesigns[0];

/* ── The card ────────────────────────────────────────────────────────────── */

/** A card's corner, as on the card art: 55px of its 1411 by 843, as shares of its width and height (a container unit would measure against the card's container, not the card). */
const CORNER = "rounded-[3.9%/6.5%]";

/**
 * A card network's mark, drawn: Visa's wordmark (white on a dark or bright
 * card, its own blue on a light one) or Mastercard's two circles, in their
 * own colours on any card.
 */
function NetworkMark({ network, ink, className }) {
  if (network === "Mastercard") {
    return (
      <svg
        viewBox="0 0 152 94"
        aria-label="Mastercard"
        role="img"
        className={className}
      >
        <circle cx="47" cy="47" r="47" fill="#eb001b" />
        <circle cx="105" cy="47" r="47" fill="#f79e1b" />
        <path
          d="M76 10.01A47 47 0 0 1 76 83.99 47 47 0 0 1 76 10.01Z"
          fill="#ff5f00"
        />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 7.2 24 9.6"
      aria-label="Visa"
      role="img"
      className={cn(
        ink === "dark" ? "fill-[#1a1f71]" : "fill-white",
        className,
      )}
    >
      <path d={siVisa.path} />
    </svg>
  );
}

/** A card's number in groups of four. */
const spaced = (number) =>
  number
    .replace(/\s/g, "")
    .match(/.{1,4}/g)
    .join(" ");

/** A card's number in groups of four, the second group hidden. */
const masked = (number) =>
  spaced(number)
    .split(" ")
    .map((group, i) => (i === 1 ? "••••" : group))
    .join(" ");

/**
 * Whether a card can be used, as a small pill in its top right corner: a
 * green dot and "Active", or a lock and "Frozen". It scales with the card.
 */
function CardStatus({ status }) {
  const frozen = status === "Frozen";
  return (
    <span className="absolute top-[7%] right-[5.5%] inline-flex items-center gap-[1.2cqw] rounded-full bg-white/90 px-[2.4cqw] py-[1.1cqw] text-[2.7cqw] leading-none font-semibold text-hero-ink shadow-soft backdrop-blur">
      {frozen ? (
        <LockIcon aria-hidden="true" className="size-[3cqw]" />
      ) : (
        <span
          aria-hidden="true"
          className="size-[1.6cqw] rounded-full bg-success"
        />
      )}
      {frozen ? "Frozen" : "Active"}
    </span>
  );
}

/**
 * The front of a card, as it looks: its design; its number beside the chip
 * (the second group of four hidden); its name, the name on it and its expiry
 * along the foot; its network's mark in the corner; and, given a `status`,
 * whether it is active or frozen in the top right. Without a `number` (a
 * card still being made) the number shows as dots. A frozen card greys out.
 * The type scales with the card.
 */
function CardArt({
  design,
  network,
  name,
  number,
  holder,
  expires,
  status,
  sizes,
  className,
}) {
  const look = designOf(design);
  const ink = look.ink === "dark" ? "text-hero-ink" : "text-white";
  const frozen = status === "Frozen";
  return (
    <div
      className={cn(
        "@container relative aspect-[1411/843] w-full text-left select-none",
        className,
      )}
    >
      <div
        className={cn(
          "absolute inset-0 transition-[filter] duration-500",
          frozen && "grayscale-[0.85]",
        )}
      >
        <Image
          src={look.image}
          alt=""
          fill
          sizes={sizes}
          className="object-contain drop-shadow-[0_14px_20px_rgb(12_5_3/0.2)]"
        />
        <NetworkMark
          network={network}
          ink={look.ink}
          className={cn(
            "absolute top-[80.8%] left-[86%] -translate-1/2",
            network === "Mastercard" ? "w-[12.5%]" : "w-[14%]",
          )}
        />
      </div>
      <p
        className={cn(
          "absolute top-[47.5%] left-[25.5%] -translate-y-1/2 font-mono text-[5cqw] leading-none font-semibold tracking-[0.05em] whitespace-nowrap tabular-nums",
          ink,
        )}
      >
        {number ? masked(number) : "•••• •••• •••• ••••"}
      </p>
      <div className={cn("absolute bottom-[11%] left-[7.6%]", ink)}>
        {name && (
          <p className="max-w-[40cqw] truncate font-heading text-[4.8cqw] leading-none font-semibold tracking-[-0.01em]">
            {name}
          </p>
        )}
        <p className="mt-[2.4cqw] max-w-[40cqw] truncate text-[3.1cqw] leading-none font-semibold tracking-[0.14em] uppercase opacity-85">
          {holder}
        </p>
      </div>
      {expires && (
        <div
          className={cn("absolute bottom-[11%] left-[50%] leading-none", ink)}
        >
          <p className="text-[1.9cqw] font-semibold tracking-[0.12em] uppercase opacity-70">
            Valid thru
          </p>
          <p className="mt-[1cqw] font-mono text-[3.6cqw] font-semibold tracking-[0.08em] tabular-nums">
            {expires}
          </p>
        </div>
      )}
      {status && <CardStatus status={status} />}
    </div>
  );
}

/**
 * The back of a card: the magnetic stripe, the signature strip with the CVV
 * beside it, the card's number, expiry and holder, the small print and its
 * network's mark, on its design's colours. The number and CVV show only once
 * `revealed`; a card still being made, with neither yet, shows dots.
 */
function CardBack({ card, holder, revealed }) {
  const look = designOf(card.design);
  const ink = look.ink === "dark" ? "text-hero-ink" : "text-white";
  return (
    <div
      className={cn(
        "@container relative aspect-[1411/843] w-full overflow-hidden text-left shadow-[0_14px_20px_rgb(12_5_3/0.2)] select-none",
        CORNER,
        ink,
      )}
      style={{ background: look.back }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[10%] h-[18%] bg-hero-ink"
      />
      <div className="absolute top-[36%] right-[6%] left-[6%] flex h-[14%] items-stretch gap-[2cqw]">
        <div
          aria-hidden="true"
          className="flex-1 rounded-[1cqw] bg-[repeating-linear-gradient(-45deg,#fff_0_6px,#f1f1f3_6px_12px)]"
        />
        <div className="grid min-w-[17%] place-items-center rounded-[1cqw] bg-white px-[2cqw] font-mono text-[4.2cqw] font-semibold text-hero-ink italic tabular-nums">
          {revealed && card.cvv ? card.cvv : "•••"}
        </div>
      </div>
      <p className="absolute top-[52.5%] right-[6%] text-[2.4cqw] font-semibold tracking-[0.12em] uppercase opacity-75">
        CVV
      </p>
      <div className="absolute bottom-[10%] left-[6%] max-w-[64%]">
        <p className="font-mono text-[4.6cqw] leading-none font-semibold tracking-[0.1em] whitespace-nowrap tabular-nums">
          {!card.number
            ? "•••• •••• •••• ••••"
            : revealed
              ? spaced(card.number)
              : masked(card.number)}
        </p>
        <p className="mt-[2.4cqw] truncate text-[2.8cqw] leading-none font-semibold tracking-[0.12em] uppercase opacity-85">
          {holder} <span className="opacity-70">· {card.expires}</span>
        </p>
        <p className="mt-[2.4cqw] text-[2.1cqw] leading-snug opacity-60">
          Issued by StripCard. Use is subject to your card agreement.
        </p>
      </div>
      <NetworkMark
        network={card.network}
        ink={look.ink}
        className={cn(
          "absolute top-[80.8%] left-[86%] -translate-1/2",
          card.network === "Mastercard" ? "w-[12.5%]" : "w-[14%]",
        )}
      />
    </div>
  );
}

/**
 * A card that turns over: its front (CardArt) and back (CardBack) on the two
 * faces of one button, a click (or Enter or Space) flipping it. `flipped`
 * and `onFlip` control it; `front` are CardArt's props. Under reduced motion
 * it changes sides at once.
 */
function FlipCard({
  card,
  front,
  holder,
  revealed,
  flipped,
  onFlip,
  className,
}) {
  return (
    <button
      type="button"
      onClick={onFlip}
      aria-label={
        flipped ? "Show the front of the card" : "Show the back of the card"
      }
      className={cn(
        "block w-full cursor-pointer rounded-[1rem] [perspective:1400px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand",
        className,
      )}
    >
      <div
        className={cn(
          "relative aspect-[1411/843] w-full transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] [transform-style:preserve-3d] motion-reduce:transition-none",
          flipped && "[transform:rotateY(180deg)]",
        )}
      >
        <div className="absolute inset-0 [backface-visibility:hidden]">
          <CardArt sizes="24rem" {...front} />
        </div>
        <div className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <CardBack card={card} holder={holder} revealed={revealed} />
        </div>
      </div>
    </button>
  );
}

/* ── The cards ───────────────────────────────────────────────────────────── */

/**
 * The cards, each a button that opens its details, as many to a row as fit
 * at 20rem or more, sharing the row's width up to 26rem each (the full width
 * on a phone); the ways to update the card holder and
 * to make a card are in the panel's head.
 */
function CardsView({ cards, holder, onOpen }) {
  const active = cards.filter((c) => c.status === "Active").length;

  return (
    <Panel
      id="cards-title"
      title="My cards"
      subtitle={`${cards.length} of ${cardRules.max} cards, ${active} active`}
      icon={<CreditCardIcon className="size-[18px]" />}
      actions={
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            arrow={false}
            onClick={() => openView("card-holder")}
          >
            <UserIcon aria-hidden="true" className="size-4" />
            Update card holder
          </Button>
          <Button
            type="button"
            size="sm"
            arrow={false}
            onClick={() => openView("create-card")}
          >
            <PlusIcon aria-hidden="true" className="size-4" />
            Create card
          </Button>
        </div>
      }
    >
      <ul className="mt-2 grid grid-cols-[repeat(auto-fill,minmax(min(100%,20rem),1fr))] gap-6">
        {cards.map((card) => {
          const frozen = card.status === "Frozen";
          return (
            <li key={card.id}>
              <button
                type="button"
                onClick={() => onOpen(card.id)}
                aria-label={`${card.name} card, ${card.network}, ending ${card.last4}${frozen ? ", frozen" : ""}. Show its details`}
                className="group block w-full max-w-[26rem] cursor-pointer rounded-[1rem] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
              >
                <CardArt
                  design={card.design}
                  network={card.network}
                  name={card.name}
                  number={card.number}
                  holder={card.nameOnCard ?? holder}
                  expires={card.expires}
                  status={card.status}
                  sizes="(min-width: 64rem) 26rem, 100vw"
                  className="transition-transform duration-500 ease-out group-hover:-translate-y-1.5"
                />
              </button>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

/** A line of the card's details: what it is, and its value. */
function DetailLine({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="text-right text-sm font-medium text-headline">
        {children}
      </dd>
    </div>
  );
}

/** An amount as it is typed: digits, and at most two after a point. */
function cleanAmount(text) {
  const [whole, ...rest] = text.replace(/[^\d.]/g, "").split(".");
  return rest.length ? `${whole}.${rest.join("").slice(0, 2)}` : whole;
}

/**
 * Moving money between the wallet and a card: an amount (typed, or one of a
 * few quick ones, and on the way out, all of it), checked against what there
 * is to move. `mode` is "add" (wallet to card) or "withdraw" (card to wallet).
 */
function MoveMoney({ mode, card, wallet, onMove, onCancel }) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState(null);
  const input = useRef(null);
  const adding = mode === "add";
  const room = adding ? wallet : card.balance;
  const value = Number.parseFloat(amount) || 0;

  useEffect(() => {
    input.current?.focus();
  }, []);

  const confirm = (event) => {
    event.preventDefault();
    if (!value) return setError("Enter an amount");
    if (value > room)
      return setError(
        adding
          ? `Your wallet has ${formatMoney(room)}`
          : `The card has ${formatMoney(room)}`,
      );
    onMove(value);
  };

  const quick = cardRules.topUps.filter((n) => n <= room);

  return (
    <form
      onSubmit={confirm}
      noValidate
      className="mt-4 rounded-2xl border border-line p-4 motion-safe:animate-pop-in"
    >
      <p className="text-sm font-semibold text-headline">
        {adding ? `Add money to ${card.name}` : "Withdraw to your wallet"}
      </p>
      <p className="mt-0.5 text-xs text-muted">
        {adding
          ? `From your wallet, ${formatMoney(wallet)} available`
          : `${formatMoney(card.balance)} on this card`}
      </p>
      <TextField
        ref={input}
        label="Amount"
        name="amount"
        inputMode="decimal"
        autoComplete="off"
        placeholder="0.00"
        className="mt-3"
        inputClassName="tabular-nums"
        prefix={
          <span className="pl-3.5 text-[0.9375rem] font-medium text-muted">
            $
          </span>
        }
        value={amount}
        onChange={(event) => {
          setAmount(cleanAmount(event.target.value));
          setError(null);
        }}
        error={error}
      />
      <div className="mt-3 flex flex-wrap gap-2">
        {quick.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => {
              setAmount(String(n));
              setError(null);
            }}
            aria-pressed={value === n}
            className={cn(
              "h-8 cursor-pointer rounded-full border px-3.5 text-sm font-semibold tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
              value === n
                ? "border-brand bg-brand-50 text-brand-700 dark:bg-brand/15 dark:text-brand-300"
                : "border-line text-headline hover:border-headline/30",
            )}
          >
            {formatMoney(n, { whole: true })}
          </button>
        ))}
        {!adding && card.balance > 0 && (
          <button
            type="button"
            onClick={() => {
              setAmount(String(card.balance));
              setError(null);
            }}
            className="h-8 cursor-pointer rounded-full border border-line px-3.5 text-sm font-semibold text-headline transition-colors hover:border-headline/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            All of it
          </button>
        )}
      </div>
      <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          arrow={false}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit" size="sm" arrow={false}>
          {adding ? "Add" : "Withdraw"}
          {value ? ` ${formatMoney(value)}` : ""}
        </Button>
      </div>
    </form>
  );
}

/**
 * A card's details, in a dialog over the page: the card, which turns over
 * (on a click, or the Flip button) to show its back; its number, expiry and
 * CVV (hidden until shown, and the number can be copied), its holder and
 * network; its balance and what it has spent of its monthly limit; and ways
 * to add money to it, take money off it, and freeze or thaw it. A native
 * modal dialog: focus stays in it, Escape or a click on the dimmed page
 * closes it, and focus goes back to the card that opened it. Mount it only
 * while it is open, so it starts face up with the details hidden.
 *
 * It rises and fades in over a fading backdrop, and sinks and fades out the
 * same way, taking LEAVE_MS before it really closes (at once under reduced
 * motion, where it simply appears and goes).
 */
function CardDialog({ card, holder, wallet, onClose, onFreeze, onMove }) {
  const ref = useRef(null);
  const leaving = useRef(false);
  const [shown, setShown] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState(null);
  const [note, setNote] = useState(null);
  const frozen = card.status === "Frozen";
  const name = card.nameOnCard ?? holder;
  const used = Math.min(card.spent / card.limit, 1);

  // Open as a modal, then on the next frame let it transition in; keep the
  // page behind still while it is open.
  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
    const frame = requestAnimationFrame(() => setShown(true));
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  // Transition out, then close for real (which unmounts it).
  const close = () => {
    const dialog = ref.current;
    if (!dialog || leaving.current) return;
    leaving.current = true;
    setShown(false);
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => dialog.close(), still ? 0 : LEAVE_MS);
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(card.number.replace(/\s/g, ""));
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };
  const open = (next) => {
    setNote(null);
    setMode((m) => (m === next ? null : next));
  };
  const move = (amount) => {
    const adding = mode === "add";
    onMove(card.id, adding ? amount : -amount);
    setMode(null);
    setNote(
      adding
        ? `${formatMoney(amount)} added to ${card.name}`
        : `${formatMoney(amount)} moved to your wallet`,
    );
  };

  const PILL =
    "inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border border-line px-3.5 text-sm font-semibold text-headline transition-colors hover:border-headline/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

  return (
    <dialog
      ref={ref}
      aria-labelledby="card-dialog-title"
      data-shown={shown}
      onClose={onClose}
      onCancel={(event) => {
        // Escape: transition out first, as the other ways to close do.
        event.preventDefault();
        close();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
      className={cn(
        "m-auto max-h-[calc(100dvh-2rem)] w-[min(36rem,calc(100vw-2rem))] overflow-y-auto rounded-3xl bg-card text-content shadow-lift ring-1 ring-line backdrop:bg-hero-ink/35 backdrop:backdrop-blur-[3px]",
        // Out (and before it is in): lowered, a touch smaller, clear; going
        // out quickly, easing in.
        "translate-y-4 scale-[0.97] opacity-0 transition-[opacity,translate,scale] duration-200 ease-in backdrop:opacity-0 backdrop:transition-opacity backdrop:duration-200",
        // In: risen, full size, solid; settling in slower, easing out.
        "data-[shown=true]:translate-y-0 data-[shown=true]:scale-100 data-[shown=true]:opacity-100 data-[shown=true]:duration-300 data-[shown=true]:ease-[cubic-bezier(0.16,1,0.3,1)] data-[shown=true]:backdrop:opacity-100 data-[shown=true]:backdrop:duration-300",
        "motion-reduce:transition-none motion-reduce:backdrop:transition-none",
      )}
    >
      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <h2
              id="card-dialog-title"
              className="truncate font-heading text-xl leading-tight font-semibold text-headline"
            >
              {card.name}
            </h2>
            <p className="mt-1 truncate text-xs text-muted">{card.purpose}</p>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="-mt-1 -mr-1 grid size-9 shrink-0 cursor-pointer place-items-center rounded-full text-muted transition-colors hover:bg-canvas hover:text-headline focus-visible:outline-2 focus-visible:outline-brand"
          >
            <CloseIcon className="size-5" />
          </button>
        </div>

        {/* The card, turning over to its back. */}
        <FlipCard
          card={card}
          holder={name}
          revealed={revealed}
          flipped={flipped}
          onFlip={() => setFlipped((f) => !f)}
          front={{
            design: card.design,
            network: card.network,
            name: card.name,
            number: card.number,
            holder: name,
            expires: card.expires,
            status: card.status,
          }}
          className="mx-auto mt-5 max-w-[24rem]"
        />

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => setFlipped((f) => !f)}
            aria-pressed={flipped}
            className={PILL}
          >
            <SwapIcon aria-hidden="true" className="size-4" />
            {flipped ? "Show front" : "Flip card"}
          </button>
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            aria-pressed={revealed}
            className={PILL}
          >
            <EyeIcon off={revealed} aria-hidden="true" className="size-4" />
            {revealed ? "Hide details" : "Show details"}
          </button>
          <button type="button" onClick={copy} className={PILL}>
            {copied ? (
              <CheckIcon aria-hidden="true" className="size-4 text-success" />
            ) : (
              <CopyIcon aria-hidden="true" className="size-4" />
            )}
            {copied ? "Copied" : "Copy number"}
          </button>
        </div>

        <dl className="mt-5 divide-y divide-dashed divide-line rounded-2xl border border-line px-4">
          <DetailLine label="Card number">
            <span className="font-mono tracking-wide tabular-nums">
              {revealed ? spaced(card.number) : masked(card.number)}
            </span>
          </DetailLine>
          <DetailLine label="Expires">
            <span className="tabular-nums">{card.expires}</span>
          </DetailLine>
          <DetailLine label="CVV">
            <span className="font-mono tracking-wide tabular-nums">
              {revealed ? card.cvv : "•••"}
            </span>
          </DetailLine>
          <DetailLine label="Name on card">{name}</DetailLine>
          <DetailLine label="Network">{card.network}</DetailLine>
        </dl>

        {/* The money on it, and this month's spending. */}
        <div className="mt-4 rounded-2xl bg-canvas/60 p-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs text-muted">Balance</p>
              <p className="mt-1 font-heading text-2xl leading-none font-semibold text-headline tabular-nums">
                {formatMoney(card.balance)}
              </p>
            </div>
            <p className="text-right text-xs text-muted tabular-nums">
              <span className="font-semibold text-headline">
                {formatMoney(card.spent)}
              </span>{" "}
              spent of {formatMoney(card.limit, { whole: true })}
              <span className="block">this month</span>
            </p>
          </div>
          <div
            role="meter"
            aria-label="Spent this month"
            aria-valuemin={0}
            aria-valuemax={card.limit}
            aria-valuenow={Math.min(card.spent, card.limit)}
            aria-valuetext={`${formatMoney(card.spent)} of ${formatMoney(card.limit)}`}
            className="mt-3 h-1.5 overflow-hidden rounded-full bg-line"
          >
            <span
              className={cn(
                "block h-full rounded-full",
                frozen ? "bg-subtle" : "bg-brand",
              )}
              style={{ width: `${used * 100}%` }}
            />
          </div>
          {note && (
            <Status tone="success" className="mt-3">
              {note}
            </Status>
          )}
        </div>

        {mode && (
          <MoveMoney
            key={mode}
            mode={mode}
            card={card}
            wallet={wallet}
            onMove={move}
            onCancel={() => setMode(null)}
          />
        )}

        <div className="mt-6 flex flex-wrap justify-end gap-2.5">
          <Button
            type="button"
            size="sm"
            arrow={false}
            onClick={() => open("add")}
            aria-expanded={mode === "add"}
          >
            <PlusIcon aria-hidden="true" className="size-4" />
            Add money
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            arrow={false}
            onClick={() => open("withdraw")}
            aria-expanded={mode === "withdraw"}
            disabled={card.balance <= 0}
            className="disabled:opacity-50"
          >
            <DownloadIcon aria-hidden="true" className="size-4 rotate-180" />
            Withdraw
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            arrow={false}
            onClick={() => onFreeze(card.id)}
          >
            <LockIcon aria-hidden="true" className="size-4" />
            {frozen ? "Unfreeze" : "Freeze"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            arrow={false}
            onClick={close}
          >
            Done
          </Button>
        </div>
      </div>
    </dialog>
  );
}

/* ── Card holder ─────────────────────────────────────────────────────────── */

/** A part of a long form, under its heading. */
function Section({ id, title, children }) {
  return (
    <section
      aria-labelledby={id}
      className="border-t border-line pt-6 first:border-0 first:pt-0"
    >
      <h3 id={id} className={HEADING}>
        {title}
      </h3>
      <div className="mt-4 grid gap-4 @min-[32rem]:grid-cols-2">{children}</div>
    </section>
  );
}

const TEXT_FIELDS = [
  "first",
  "last",
  "nameOnCard",
  "dob",
  "email",
  "idNumber",
  "address",
  "city",
  "state",
  "zip",
  "phone",
];

/** What is wrong with the card holder's details, by field, on `today`. */
function checkHolder(draft, today) {
  const errors = {};
  if (!draft.first.trim()) errors.first = "Enter your first name";
  if (!draft.last.trim()) errors.last = "Enter your last name";
  const name = draft.nameOnCard.trim();
  if (!name) errors.nameOnCard = "Enter the name to show on your cards";
  else if (!/^[A-Za-z][A-Za-z .'-]*$/.test(name))
    errors.nameOnCard = "Use letters, spaces, dots, hyphens and apostrophes";
  const dob = dobProblem(draft.dob, today);
  if (dob) errors.dob = dob;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim()))
    errors.email = "Enter an email like name@example.com";
  if (!/^[A-Za-z0-9]{5,20}$/.test(draft.idNumber.replace(/[\s-]/g, "")))
    errors.idNumber = "Enter the 5 to 20 letters and digits on your ID";
  if (!draft.idImage) errors.idImage = "Add a photo of your ID";
  if (!draft.address.trim()) errors.address = "Enter your street address";
  if (!draft.city.trim()) errors.city = "Enter your city";
  if (!draft.state.trim()) errors.state = "Enter your state";
  if (!draft.zip.trim()) errors.zip = "Enter your postal code";
  const digits = draft.phone.replace(/\D/g, "");
  if (digits.length < 6 || digits.length > 14)
    errors.phone = "Enter a phone number of 6 to 14 digits";
  return errors;
}

/**
 * The card holder's details, in four parts (personal, identity, account and
 * address), with the cards' look beside it showing the name on card as it is
 * typed. Save checks it all and puts focus on the first thing to fix.
 */
function HolderView({ holder, onSave, cards }) {
  const [draft, setDraft] = useState(holder);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const formRef = useRef(null);

  // A new ID photo's preview is an object URL: let them go with the form.
  const made = useRef([]);
  useEffect(() => {
    const urls = made.current;
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const dirty =
    TEXT_FIELDS.some((key) => draft[key] !== holder[key]) ||
    ["idType", "purpose", "employment", "occupation", "country"].some(
      (key) => draft[key] !== holder[key],
    ) ||
    draft.idImage !== holder.idImage;

  const set = (key) => (value) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
    setSaved(false);
  };
  const field = (key) => ({
    name: key,
    value: draft[key],
    onChange: (event) => set(key)(event.target.value),
    error: errors[key],
  });

  const takeImage = (file) => {
    if (!file) return;
    if (!ID_TYPES.includes(file.type))
      return setErrors((e) => ({
        ...e,
        idImage: "Use a PNG, JPG, WebP or PDF file",
      }));
    if (file.size > MAX_FILE)
      return setErrors((e) => ({ ...e, idImage: "That file is over 10 MB" }));
    const url = URL.createObjectURL(file);
    made.current.push(url);
    set("idImage")({ name: file.name, size: file.size, type: file.type, url });
  };

  const submit = (event) => {
    event.preventDefault();
    const found = checkHolder(draft, new Date());
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      formRef.current?.elements.namedItem(first)?.focus();
      return;
    }
    setBusy(true);
    window.setTimeout(() => {
      const clean = { ...draft, nameOnCard: draft.nameOnCard.trim() };
      onSave(clean);
      setDraft(clean);
      setBusy(false);
      setSaved(true);
    }, SAVE_MS);
  };

  const sample = cards.find((c) => c.status === "Active") ?? cards[0];

  return (
    <div className="grid gap-4 lg:gap-5 @min-[60rem]:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
      <Panel
        id="holder-title"
        title="Card holder details"
        subtitle="Use the details exactly as they appear on your ID"
        icon={<UserIcon className="size-[18px]" />}
      >
        <form
          ref={formRef}
          onSubmit={submit}
          noValidate
          className="flex flex-1 flex-col gap-6"
        >
          <Section id="holder-personal" title="Personal">
            <TextField
              label="First name"
              required
              autoComplete="given-name"
              {...field("first")}
            />
            <TextField
              label="Last name"
              required
              autoComplete="family-name"
              {...field("last")}
            />
            <TextField
              label="Name on card"
              required
              maxLength={NAME_MAX}
              autoComplete="cc-name"
              hint={`As it shows on your cards, ${NAME_MAX - draft.nameOnCard.length} characters left`}
              {...field("nameOnCard")}
            />
            <TextField
              label="Date of birth"
              required
              inputMode="numeric"
              autoComplete="off"
              placeholder="MM / DD / YYYY"
              inputClassName="tabular-nums"
              {...field("dob")}
              onChange={(event) =>
                set("dob")(nextDob(event.target.value, draft.dob))
              }
            />
            <TextField
              label="Email"
              required
              type="email"
              autoComplete="email"
              className="@min-[32rem]:col-span-2"
              {...field("email")}
            />
          </Section>

          <Section id="holder-identity" title="Identity">
            <SelectField
              label="ID type"
              required
              value={draft.idType}
              onChange={set("idType")}
              options={cardHolderOptions.idTypes}
            />
            <TextField
              label="ID number"
              required
              autoComplete="off"
              spellCheck={false}
              inputClassName="tabular-nums"
              {...field("idNumber")}
            />
            <div>
              <p className={FIELD_LABEL}>
                ID image
                <Required />
              </p>
              <div className="mt-1.5">
                <UploadZone
                  name="idImage"
                  label="ID image"
                  ariaLabel="Photo of your ID"
                  file={draft.idImage}
                  error={errors.idImage}
                  onFile={takeImage}
                />
              </div>
            </div>
            {/* Level with the photo, under the labels. */}
            <div className="self-start rounded-2xl bg-canvas/60 p-4 @min-[32rem]:mt-[1.625rem]">
              <p className={HEADING}>For a quick check</p>
              <ul className="mt-3 flex flex-col gap-2.5">
                <Tip>The front of your ID, all four corners in view</Tip>
                <Tip>Sharp, with no glare on it</Tip>
                <Tip>The same ID as the number above</Tip>
              </ul>
            </div>
          </Section>

          <Section id="holder-account" title="Account details">
            <SelectField
              label="Account purpose"
              required
              value={draft.purpose}
              onChange={set("purpose")}
              options={cardHolderOptions.purposes}
              className="@min-[32rem]:col-span-2"
            />
            <SelectField
              label="Employment status"
              required
              value={draft.employment}
              onChange={set("employment")}
              options={cardHolderOptions.employment}
            />
            <SelectField
              label="Occupation"
              required
              value={draft.occupation}
              onChange={set("occupation")}
              options={cardHolderOptions.occupations}
            />
          </Section>

          <Section id="holder-address" title="Address">
            <TextField
              label="Address"
              required
              autoComplete="street-address"
              className="@min-[32rem]:col-span-2"
              {...field("address")}
            />
            <TextField
              label="City"
              required
              autoComplete="address-level2"
              {...field("city")}
            />
            <TextField
              label="State"
              required
              autoComplete="address-level1"
              {...field("state")}
            />
            <TextField
              label="Postal code"
              required
              autoComplete="postal-code"
              {...field("zip")}
            />
            <CountrySelect
              label="Country"
              required
              dial
              value={draft.country}
              onChange={set("country")}
            />
            <PhoneField
              label="Phone"
              required
              country={draft.country}
              className="@min-[32rem]:col-span-2"
              {...field("phone")}
            />
          </Section>

          <div className="mt-auto flex flex-col gap-4 border-t border-line pt-5 @min-[32rem]:flex-row @min-[32rem]:items-center @min-[32rem]:justify-between">
            <div className="min-h-5">
              {busy ? (
                <Status>Saving your details</Status>
              ) : saved && !dirty ? (
                <Status tone="success">Card holder details saved</Status>
              ) : dirty ? (
                <Status>You have unsaved changes</Status>
              ) : (
                <Status>Your details are up to date</Status>
              )}
            </div>
            <div className="flex flex-col-reverse gap-3 @min-[32rem]:flex-row">
              <Button
                type="button"
                variant="outline"
                size="sm"
                arrow={false}
                onClick={() => openView("cards")}
              >
                Back to cards
              </Button>
              <Button
                type="submit"
                size="sm"
                arrow={false}
                disabled={!dirty || busy}
                aria-busy={busy || undefined}
                className="disabled:opacity-50 aria-busy:cursor-wait"
              >
                {busy ? "Saving" : "Save details"}
              </Button>
            </div>
          </div>
        </form>
      </Panel>

      {/* How the cards will read, and why we ask. */}
      <div className="@min-[60rem]:sticky @min-[60rem]:top-[5.75rem] @min-[60rem]:self-start">
        <Panel
          id="holder-preview-title"
          title="On your cards"
          subtitle={`Applies to all ${cards.length} of your cards`}
          icon={<CreditCardIcon className="size-[18px]" />}
        >
          <CardArt
            design={sample.design}
            network={sample.network}
            name={sample.name}
            number={sample.number}
            holder={draft.nameOnCard.trim() || "Your name"}
            expires={sample.expires}
            sizes="22rem"
            className="mx-auto max-w-[22rem]"
          />
          <ul className="mt-6 space-y-3">
            <li className="flex gap-3">
              <span
                aria-hidden="true"
                className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700 dark:bg-brand/15 dark:text-brand-300"
              >
                <IdCardIcon className="size-4" />
              </span>
              <p className="pt-1 text-sm leading-snug text-content">
                Card issuers must know who holds each card, so we ask for your
                ID.
              </p>
            </li>
            <li className="flex gap-3">
              <span
                aria-hidden="true"
                className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700 dark:bg-brand/15 dark:text-brand-300"
              >
                <LockIcon className="size-4" />
              </span>
              <p className="pt-1 text-sm leading-snug text-content">
                Your details are encrypted and shared only with the card issuer.
              </p>
            </li>
          </ul>
        </Panel>
      </div>
    </div>
  );
}

/* ── Create a card ───────────────────────────────────────────────────────── */

const CREATE_STEPS = [
  { id: "name", label: "Name" },
  { id: "design", label: "Design" },
  { id: "limit", label: "Limit" },
  { id: "review", label: "Review" },
];
const CREATE_LAST = CREATE_STEPS.length - 1;

/** Names to start from, one tap each. */
const NAME_IDEAS = [
  "Subscriptions",
  "Online shopping",
  "Travel",
  "Ads",
  "Groceries",
];

/** The longest name a card can have. */
const CARD_NAME_MAX = 20;

/** When a card made on `date` expires, three years on: "MM/YY". */
const expiryFrom = (date) =>
  `${String(date.getMonth() + 1).padStart(2, "0")}/${String((date.getFullYear() + 3) % 100).padStart(2, "0")}`;

const blankCard = (holder) => ({
  name: "",
  nameOnCard: holder,
  design: cardDesigns[0].id,
  network: cardRules.networks[0],
  limit: "500",
});

/** What is wrong with a new card in the open step, by field. */
function checkCard(step, draft) {
  const errors = {};
  if (step === 0) {
    if (!draft.name.trim()) errors.name = "Give the card a name";
    const onCard = draft.nameOnCard.trim();
    if (!onCard) errors.nameOnCard = "Enter the name to show on the card";
    else if (!/^[A-Za-z][A-Za-z .'-]*$/.test(onCard))
      errors.nameOnCard = "Use letters, spaces, dots, hyphens and apostrophes";
  }
  if (step === 2) {
    const limit = Number(draft.limit);
    if (!draft.limit) errors.limit = "Set a monthly limit";
    else if (limit < cardRules.minLimit || limit > cardRules.maxLimit)
      errors.limit = `Set a limit between ${formatMoney(cardRules.minLimit, { whole: true })} and ${formatMoney(cardRules.maxLimit, { whole: true })}`;
  }
  return errors;
}

/** A line of the review: what it is, what was chosen, and a way back to change it. */
function ReviewLine({ label, onEdit, children }) {
  return (
    <div className="flex items-center gap-4 py-3.5">
      <dt className="w-28 shrink-0 text-sm text-muted">{label}</dt>
      <dd className="min-w-0 flex-1 truncate text-sm font-medium text-headline">
        {children}
      </dd>
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="shrink-0 cursor-pointer rounded-md px-1.5 py-0.5 text-xs font-semibold text-brand transition-colors hover:bg-brand/10 focus-visible:outline-2 focus-visible:outline-brand"
        >
          Edit<span className="sr-only"> {label.toLowerCase()}</span>
        </button>
      )}
    </div>
  );
}

/** The networks a card can run on, as select options. */
const NETWORKS = cardRules.networks.map((network) => ({
  value: network,
  label: network,
}));

/** A network's mark on a small white chip, for the network select. */
function NetworkChip({ network }) {
  return (
    <span
      aria-hidden="true"
      className="grid h-6 w-9 shrink-0 place-items-center rounded-md bg-white ring-1 ring-line"
    >
      <NetworkMark
        network={network}
        ink="dark"
        className={network === "Visa" ? "w-6" : "w-5"}
      />
    </span>
  );
}

/** A choice as a tile: a radio button drawn as a card, ticked when chosen. */
function ChoiceTile({ name, value, checked, onChange, children }) {
  return (
    <label className="group cursor-pointer rounded-2xl border border-line bg-canvas/40 p-3 transition-colors hover:border-headline/25 has-checked:border-brand has-checked:bg-brand-50 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-brand dark:has-checked:bg-brand/10">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      {children}
    </label>
  );
}

/** The tick in a chosen tile's corner. */
function Tick() {
  return (
    <span
      aria-hidden="true"
      className="grid size-5 shrink-0 place-items-center rounded-full ring-1 ring-line ring-inset group-has-checked:bg-brand group-has-checked:text-white group-has-checked:ring-0"
    >
      <CheckIcon
        className="size-3 opacity-0 group-has-checked:opacity-100"
        strokeWidth={3}
      />
    </span>
  );
}

/**
 * Making a card, a step at a time, with the card as it will look beside the
 * steps, following every change:
 *
 *   1. Name     what the card is called (typed, or picked from a few ideas)
 *               and the name printed on it, the card holder's to begin with
 *   2. Design   the card's look, one of four, and its network, Visa or
 *               Mastercard (a select), on any of them
 *   3. Limit    the most it may spend in a month
 *   4. Review   all of it, each with a way back to it, then create
 *
 * Continue checks the step and puts focus on what to fix; each step takes
 * focus as it opens. Done, it says so, with ways on. Once the plan's cards
 * are all in use, it says that instead.
 */
function CreateView({ cards, holder, onCreate }) {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState(() => blankCard(holder));
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [made, setMade] = useState(null);
  const formRef = useRef(null);

  // Each step takes focus as it opens, not on first load (compared with what
  // was shown, so an effect run twice cannot fire it).
  const stepRef = useRef(null);
  const shownStep = useRef(step);
  useEffect(() => {
    if (shownStep.current === step) return;
    shownStep.current = step;
    stepRef.current?.focus();
  }, [step]);

  const full = cards.length >= cardRules.max;
  const look = designOf(draft.design);

  const set = (key) => (value) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };
  const go = (to) => {
    setErrors({});
    setStep(to);
  };

  const create = () => {
    setBusy(true);
    const today = new Date();
    const digits = () =>
      String(Math.floor(Math.random() * 10000)).padStart(4, "0");
    const last4 = digits();
    const card = {
      id: `card-${today.getTime()}`,
      name: draft.name.trim(),
      nameOnCard: draft.nameOnCard.trim(),
      last4,
      network: draft.network,
      balance: 0,
      number: `${draft.network === "Visa" ? "4" : "5"}${digits().slice(1)} ${digits()} ${digits()} ${last4}`,
      cvv: String(Math.floor(Math.random() * 1000)).padStart(3, "0"),
      expires: expiryFrom(today),
      design: draft.design,
      purpose: "New card, ready to use",
      limit: Number(draft.limit),
      spent: 0,
      status: "Active",
    };
    window.setTimeout(() => {
      onCreate(card);
      setMade(card);
      setBusy(false);
    }, SAVE_MS);
  };

  const next = (event) => {
    event.preventDefault();
    const found = checkCard(step, draft);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      formRef.current?.elements.namedItem(first)?.focus();
      return;
    }
    if (step < CREATE_LAST) setStep(step + 1);
    else create();
  };

  const again = () => {
    setMade(null);
    setDraft(blankCard(holder));
    setErrors({});
    setStep(0);
  };

  const [flipped, setFlipped] = useState(false);
  const shownCard = made ?? {
    design: draft.design,
    network: draft.network,
    name: draft.name.trim(),
    nameOnCard: draft.nameOnCard.trim(),
    limit: Number(draft.limit) || 0,
  };
  const shownHolder = shownCard.nameOnCard || holder;
  const shownExpiry = made?.expires ?? expiryFrom(new Date());

  return (
    <div className="grid gap-4 lg:gap-5 @min-[60rem]:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      <Panel
        id="create-title"
        title={made ? "Card ready" : "Create a card"}
        subtitle={
          made
            ? "Active now, and ready to pay"
            : full
              ? `All ${cardRules.max} cards on your plan are in use`
              : `Card ${cards.length + 1} of ${cardRules.max} on your plan`
        }
        icon={<PlusIcon className="size-[18px]" />}
      >
        {made ? (
          <div
            role="status"
            className="flex flex-1 flex-col items-center justify-center py-6 text-center motion-safe:animate-pop-in"
          >
            <span
              aria-hidden="true"
              className="grid size-14 place-items-center rounded-full bg-success/12 text-success"
            >
              <CheckIcon className="size-7" />
            </span>
            <p className="mt-5 font-heading text-2xl font-semibold text-headline">
              Your {made.name} card is ready
            </p>
            <p className="mt-2 max-w-sm text-sm text-pretty text-muted">
              It works online right away, anywhere {made.network} is taken, up
              to {formatMoney(made.limit, { whole: true })} a month. Add money
              to it from your cards.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {cards.length < cardRules.max && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  arrow={false}
                  onClick={again}
                >
                  Create another
                </Button>
              )}
              <Button type="button" size="sm" onClick={() => openView("cards")}>
                See my cards
              </Button>
            </div>
          </div>
        ) : full ? (
          <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
            <span
              aria-hidden="true"
              className="grid size-14 place-items-center rounded-full bg-brand-50 text-brand dark:bg-brand/15"
            >
              <CreditCardIcon className="size-6" />
            </span>
            <p className="mt-5 font-heading text-xl font-semibold text-headline">
              You have {cardRules.max} of {cardRules.max} cards
            </p>
            <p className="mt-2 max-w-sm text-sm text-pretty text-muted">
              Verify your identity to hold up to 20 cards.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                arrow={false}
                onClick={() => openView("cards")}
              >
                Back to cards
              </Button>
              <Button href="/dashboard/kyc-verification" size="sm">
                Verify identity
              </Button>
            </div>
          </div>
        ) : (
          <form
            ref={formRef}
            onSubmit={next}
            noValidate
            className="flex flex-1 flex-col"
          >
            <Stepper steps={CREATE_STEPS} at={step} onGo={go} />

            <div
              key={step}
              ref={stepRef}
              tabIndex={-1}
              role="group"
              aria-label={`Step ${step + 1} of ${CREATE_STEPS.length}, ${CREATE_STEPS[step].label}`}
              className="mt-6 outline-none motion-safe:animate-pop-in"
            >
              {/* ── 1. Name ───────────────────────────────────────────── */}
              {step === 0 && (
                <>
                  <div className="grid gap-4 @min-[32rem]:grid-cols-2">
                    <TextField
                      label="Card name"
                      required
                      name="name"
                      maxLength={CARD_NAME_MAX}
                      autoComplete="off"
                      placeholder="Online shopping"
                      hint={`Shows on the card and in your list, ${CARD_NAME_MAX - draft.name.length} left`}
                      value={draft.name}
                      onChange={(event) => set("name")(event.target.value)}
                      error={errors.name}
                    />
                    <TextField
                      label="Name on card"
                      required
                      name="nameOnCard"
                      maxLength={NAME_MAX}
                      autoComplete="cc-name"
                      hint="Your name, as the card carries it"
                      value={draft.nameOnCard}
                      onChange={(event) =>
                        set("nameOnCard")(event.target.value)
                      }
                      error={errors.nameOnCard}
                    />
                  </div>
                  <p className={cn(HEADING, "mt-6")}>Or start from</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {NAME_IDEAS.map((idea) => (
                      <button
                        key={idea}
                        type="button"
                        onClick={() => set("name")(idea)}
                        aria-pressed={draft.name === idea}
                        className={cn(
                          "h-9 cursor-pointer rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                          draft.name === idea
                            ? "border-brand bg-brand-50 text-brand-700 dark:bg-brand/15 dark:text-brand-300"
                            : "border-line text-headline hover:border-headline/30",
                        )}
                      >
                        {idea}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* ── 2. Design and network ─────────────────────────────── */}
              {step === 1 && (
                <>
                  <fieldset>
                    <legend className={FIELD_LABEL}>Design</legend>
                    <div className="mt-3 grid grid-cols-2 gap-3 @min-[40rem]:grid-cols-4">
                      {cardDesigns.map((option) => (
                        <ChoiceTile
                          key={option.id}
                          name="design"
                          value={option.id}
                          checked={draft.design === option.id}
                          onChange={() => set("design")(option.id)}
                        >
                          <span className="relative block aspect-[1411/843]">
                            <Image
                              src={option.image}
                              alt=""
                              fill
                              sizes="12rem"
                              className="object-contain"
                            />
                          </span>
                          <span className="mt-3 flex items-center justify-between gap-2 px-0.5">
                            <span className="truncate text-sm font-semibold text-headline">
                              {option.name}
                            </span>
                            <Tick />
                          </span>
                        </ChoiceTile>
                      ))}
                    </div>
                  </fieldset>

                  <SelectField
                    label="Network"
                    required
                    value={draft.network}
                    onChange={set("network")}
                    options={NETWORKS}
                    className="mt-6 @min-[32rem]:max-w-[calc(50%-0.5rem)]"
                    renderValue={(option) => (
                      <>
                        <NetworkChip network={option.value} />
                        <span className="truncate text-[0.9375rem] text-headline">
                          {option.label}
                        </span>
                      </>
                    )}
                    renderOption={(option) => (
                      <>
                        <NetworkChip network={option.value} />
                        <span className="min-w-0 flex-1 truncate text-sm text-headline">
                          {option.label}
                        </span>
                      </>
                    )}
                  />
                </>
              )}

              {/* ── 3. Limit ──────────────────────────────────────────── */}
              {step === 2 && (
                <>
                  <TextField
                    label="Monthly limit"
                    required
                    name="limit"
                    inputMode="numeric"
                    autoComplete="off"
                    inputClassName="tabular-nums"
                    prefix={
                      <span className="pl-3.5 text-[0.9375rem] font-medium text-muted">
                        $
                      </span>
                    }
                    hint={`The most it can spend in a month, ${formatMoney(cardRules.minLimit, { whole: true })} to ${formatMoney(cardRules.maxLimit, { whole: true })}`}
                    value={draft.limit}
                    onChange={(event) =>
                      set("limit")(
                        event.target.value.replace(/\D/g, "").slice(0, 5),
                      )
                    }
                    error={errors.limit}
                  />
                  <div className="mt-4 flex flex-wrap gap-2">
                    {cardRules.quick.map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => set("limit")(String(amount))}
                        aria-pressed={Number(draft.limit) === amount}
                        className={cn(
                          "h-9 cursor-pointer rounded-full border px-4 text-sm font-semibold tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                          Number(draft.limit) === amount
                            ? "border-brand bg-brand-50 text-brand-700 dark:bg-brand/15 dark:text-brand-300"
                            : "border-line text-headline hover:border-headline/30",
                        )}
                      >
                        {formatMoney(amount, { whole: true })}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* ── 4. Review ─────────────────────────────────────────── */}
              {step === 3 && (
                <dl className="divide-y divide-dashed divide-line rounded-2xl border border-line px-4">
                  <ReviewLine label="Card name" onEdit={() => go(0)}>
                    {draft.name.trim()}
                  </ReviewLine>
                  <ReviewLine label="Name on card" onEdit={() => go(0)}>
                    {draft.nameOnCard.trim()}
                  </ReviewLine>
                  <ReviewLine label="Design" onEdit={() => go(1)}>
                    {look.name}
                  </ReviewLine>
                  <ReviewLine label="Network" onEdit={() => go(1)}>
                    {draft.network}
                  </ReviewLine>
                  <ReviewLine label="Monthly limit" onEdit={() => go(2)}>
                    {formatMoney(Number(draft.limit), { whole: true })}
                  </ReviewLine>
                  <ReviewLine label="Fee">{cardRules.fee}</ReviewLine>
                </dl>
              )}
            </div>

            <div className="mt-auto pt-7">
              <div className="flex flex-col-reverse gap-3 border-t border-line pt-5 @min-[32rem]:flex-row @min-[32rem]:items-center @min-[32rem]:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  arrow={false}
                  onClick={() => (step > 0 ? go(step - 1) : openView("cards"))}
                  disabled={busy}
                >
                  {step > 0 ? "Back" : "Back to cards"}
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  arrow={step < CREATE_LAST}
                  disabled={busy}
                  aria-busy={busy || undefined}
                  className="disabled:cursor-wait disabled:opacity-70"
                >
                  {step < CREATE_LAST
                    ? "Continue"
                    : busy
                      ? "Creating your card"
                      : "Create card"}
                </Button>
              </div>
            </div>
          </form>
        )}
      </Panel>

      {/* The card as it will look, following every change. */}
      <div className="@min-[60rem]:sticky @min-[60rem]:top-[5.75rem] @min-[60rem]:self-start">
        <Panel
          id="create-preview-title"
          title="Preview"
          subtitle={made ? "Your new card" : "How your card will look"}
          icon={<CreditCardIcon className="size-[18px]" />}
        >
          <div className="grid place-items-center rounded-2xl bg-canvas/60 px-6 pt-8 pb-5">
            <FlipCard
              card={{
                design: shownCard.design,
                network: shownCard.network,
                number: made?.number,
                cvv: made?.cvv,
                expires: shownExpiry,
              }}
              holder={shownHolder}
              revealed={Boolean(made)}
              flipped={flipped}
              onFlip={() => setFlipped((f) => !f)}
              front={{
                design: shownCard.design,
                network: shownCard.network,
                name: shownCard.name || "Card name",
                number: made?.number,
                holder: shownHolder,
                expires: shownExpiry,
              }}
              className="max-w-[24rem]"
            />
            <p className="mt-4 flex items-center gap-1.5 text-xs text-muted">
              <SwapIcon aria-hidden="true" className="size-3.5" />
              Click the card to see its {flipped ? "front" : "back"}
            </p>
          </div>
          <dl className="mt-6 divide-y divide-dashed divide-line text-sm">
            {[
              ["Design", designOf(shownCard.design).name],
              ["Network", shownCard.network],
              [
                "Monthly limit",
                shownCard.limit
                  ? formatMoney(shownCard.limit, { whole: true })
                  : "Not set",
              ],
              ["Fee", cardRules.fee],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-baseline justify-between gap-4 py-3 first:pt-0 last:pb-0"
              >
                <dt className="text-muted">{label}</dt>
                <dd className="truncate text-right font-medium text-headline">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </Panel>
      </div>
    </div>
  );
}

/* ── The page ────────────────────────────────────────────────────────────── */

/**
 * The Virtual Card page. It opens on the cards, with two buttons in the
 * panel's head: one to update the card holder's details, one to make a new
 * card, each opening its own view with a way back. A click on a card opens
 * its details in a dialog, where money can be moved between it and the
 * wallet.
 *
 * DEMO: nothing is sent anywhere. Saving and creating wait a moment, then
 * keep the change on this page: the new name shows on the cards, a new card
 * joins the list, a frozen card shows as frozen, and money moved changes the
 * card's balance and the wallet's.
 */
export function VirtualCards() {
  const hash = useSyncExternalStore(onHash, readHash, noHash);
  const view = VIEWS.includes(hash) ? hash : "cards";
  const [cards, setCards] = useState(myCards);
  const [holder, setHolder] = useState(cardHolder);
  const [walletBalance, setWalletBalance] = useState(wallet.balance);
  const [openId, setOpenId] = useState(null);
  const openCard = cards.find((card) => card.id === openId);

  // The view takes focus when it changes, not on first load (compared with
  // what was shown, so an effect run twice cannot fire it).
  const viewRef = useRef(null);
  const shown = useRef(view);
  useEffect(() => {
    if (shown.current === view) return;
    shown.current = view;
    viewRef.current?.focus({ preventScroll: true });
  }, [view]);

  const freeze = (id) =>
    setCards((list) =>
      list.map((card) =>
        card.id === id
          ? { ...card, status: card.status === "Frozen" ? "Active" : "Frozen" }
          : card,
      ),
    );

  /** Money onto a card from the wallet (`amount` above 0) or off it, back to the wallet. */
  const move = (id, amount) => {
    const cents = (n) => Math.round(n * 100) / 100;
    setCards((list) =>
      list.map((card) =>
        card.id === id
          ? { ...card, balance: cents(card.balance + amount) }
          : card,
      ),
    );
    setWalletBalance((b) => cents(b - amount));
  };

  return (
    <>
      <PageHeader
        title="Virtual Card"
        back={{ href: "/dashboard", label: "Back to dashboard" }}
      />

      <div
        key={view}
        ref={viewRef}
        tabIndex={-1}
        className="@container outline-none motion-safe:animate-pop-in"
      >
        {view === "cards" && (
          <CardsView
            cards={cards}
            holder={holder.nameOnCard}
            onOpen={setOpenId}
          />
        )}
        {view === "card-holder" && (
          <HolderView holder={holder} onSave={setHolder} cards={cards} />
        )}
        {view === "create-card" && (
          <CreateView
            cards={cards}
            holder={holder.nameOnCard}
            onCreate={(card) => setCards((list) => [...list, card])}
          />
        )}
      </div>

      {openCard && (
        <CardDialog
          key={openCard.id}
          card={openCard}
          holder={holder.nameOnCard}
          wallet={walletBalance}
          onClose={() => setOpenId(null)}
          onFreeze={freeze}
          onMove={move}
        />
      )}
    </>
  );
}
