"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Status, TextField } from "@/components/dashboard/FormField";
import { Modal, ModalHead } from "@/components/dashboard/Modal";
import {
  BrandMark,
  cents,
  cleanAmount,
  QuickAmounts,
  Segmented,
  SMALL_HEADING,
} from "@/components/dashboard/MoneyParts";
import { Panel } from "@/components/dashboard/Panel";
import {
  CheckIcon,
  CopyIcon,
  EyeIcon,
  GiftIcon,
  SearchIcon,
  SparklesIcon,
  UserIcon,
} from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Listbox } from "@/components/ui/Listbox";
import { giftCards, wallet } from "@/data/dashboard";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";

const { brands, categories, min, max } = giftCards;

const LABEL = "block text-sm font-medium text-headline";

/** How long the demo pretends to buy a card, in milliseconds. */
const BUY_MS = 900;

const brandOf = (id) => brands.find((b) => b.id === id);

const CATEGORY_OPTIONS = [
  { value: "all", label: "All categories" },
  ...categories.map((c) => ({ value: c, label: c })),
];

const RECIPIENTS = [
  { value: "me", label: "For me", icon: UserIcon },
  { value: "gift", label: "As a gift", icon: GiftIcon },
];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** A gift card's code in groups of four, or all but the first and last groups hidden. */
const grouped = (code) => code.match(/.{1,4}/g).join(" ");
const maskedCode = (code) =>
  grouped(code)
    .split(" ")
    .map((group, i, all) => (i === 0 || i === all.length - 1 ? group : "••••"))
    .join(" ");

/** A new card's code: four letters for the brand, then twelve that cannot be misread. */
function newCode(brand) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  const prefix = brand.name
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .padEnd(4, "X")
    .slice(0, 4);
  return (
    prefix + Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("")
  );
}

/** When a card bought today expires, two years on: "Oct 2028". */
function expiryFromNow() {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 2);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

/* ── The card ────────────────────────────────────────────────────────────── */

/**
 * A gift card as it looks: its brand's colour, deepening across it, with the
 * brand's mark and "Gift card" at the top, and its name, a line under it and
 * an amount (if there is one) at the foot. The type scales with the card.
 */
function GiftCardArt({ brand, amount, line, className }) {
  const hex = brand.logo.hex;
  return (
    <div
      className={cn(
        "@container relative isolate aspect-[1.6] w-full overflow-hidden rounded-[1.1rem] text-left text-white shadow-[0_14px_24px_-12px_rgb(12_5_3/0.45)] select-none",
        className,
      )}
      style={{
        background: `linear-gradient(140deg, color-mix(in srgb, ${hex} 86%, white) 0%, ${hex} 45%, color-mix(in srgb, ${hex} 55%, black) 100%)`,
      }}
    >
      <span
        aria-hidden="true"
        className="absolute -top-[38%] -right-[16%] -z-10 aspect-square w-[70%] rounded-full bg-white/10"
      />
      <span
        aria-hidden="true"
        className="absolute -right-[30%] -bottom-[55%] -z-10 aspect-square w-[80%] rounded-full border-[0.9cqw] border-white/10"
      />
      <BrandMark
        logo={brand.logo}
        className="absolute top-[11%] left-[7%] size-[13cqw] drop-shadow-[0_1px_2px_rgb(0_0_0/0.2)]"
      />
      <p className="absolute top-[12%] right-[7%] text-[3.2cqw] font-semibold tracking-[0.14em] text-white/75 uppercase">
        Gift card
      </p>
      <div className="absolute right-[7%] bottom-[11%] left-[7%] flex items-end justify-between gap-[3cqw]">
        <div className="min-w-0 leading-none">
          <p className="truncate font-heading text-[7.4cqw] font-semibold tracking-[-0.01em]">
            {brand.name}
          </p>
          {line && (
            <p className="mt-[2.2cqw] truncate text-[3.8cqw] text-white/80">
              {line}
            </p>
          )}
        </div>
        {amount !== undefined && (
          <p className="shrink-0 font-heading text-[9cqw] leading-none font-semibold tabular-nums">
            {formatMoney(amount, { whole: Number.isInteger(amount) })}
          </p>
        )}
      </div>
    </div>
  );
}

/* ── A card held ─────────────────────────────────────────────────────────── */

const PILL =
  "inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border border-line px-3.5 text-sm font-semibold text-headline transition-colors hover:border-headline/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

/**
 * A gift card held, in a modal: the card, what is left on it of what it
 * held, its code (hidden until shown, and copied in a tap), and where to use
 * it. Mount it only while it is open, so it starts with the code hidden.
 */
function HeldDialog({ card, onClose }) {
  const brand = brandOf(card.brand);
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const left = card.value ? card.balance / card.value : 0;

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(card.code);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Modal labelledBy="held-dialog-title" onClose={onClose}>
      {(close) => (
        <div className="p-5 sm:p-6">
          <ModalHead
            id="held-dialog-title"
            title={`${brand.name} gift card`}
            subtitle={`Expires ${card.expires}`}
            onClose={close}
          />
          <GiftCardArt
            brand={brand}
            amount={card.balance}
            line={`of ${formatMoney(card.value)}`}
            className="mx-auto mt-5 max-w-[22rem]"
          />

          <div className="mt-5 rounded-2xl bg-canvas/60 p-4">
            <p className="flex items-baseline justify-between gap-3 text-xs text-muted">
              <span>
                <span className="text-sm font-semibold text-headline tabular-nums">
                  {formatMoney(card.balance)}
                </span>{" "}
                left to spend
              </span>
              <span className="tabular-nums">of {formatMoney(card.value)}</span>
            </p>
            <div
              role="meter"
              aria-label="Left on the card"
              aria-valuemin={0}
              aria-valuemax={card.value}
              aria-valuenow={card.balance}
              aria-valuetext={`${formatMoney(card.balance)} of ${formatMoney(card.value)}`}
              className="mt-2 h-1.5 overflow-hidden rounded-full bg-line"
            >
              <span
                className="block h-full rounded-full bg-brand"
                style={{ width: `${left * 100}%` }}
              />
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-line p-4">
            <p className="text-xs text-muted">Gift card code</p>
            <p className="mt-1.5 font-mono text-lg font-semibold tracking-[0.08em] text-headline tabular-nums">
              {revealed ? grouped(card.code) : maskedCode(card.code)}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setRevealed((v) => !v)}
                aria-pressed={revealed}
                className={PILL}
              >
                <EyeIcon off={revealed} aria-hidden="true" className="size-4" />
                {revealed ? "Hide code" : "Show code"}
              </button>
              <button type="button" onClick={copy} className={PILL}>
                {copied ? (
                  <CheckIcon
                    aria-hidden="true"
                    className="size-4 text-success"
                  />
                ) : (
                  <CopyIcon aria-hidden="true" className="size-4" />
                )}
                {copied ? "Copied" : "Copy code"}
              </button>
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-content">
            Enter the code at checkout on{" "}
            <span className="font-semibold text-headline">{brand.use}</span>.
            Whatever you do not spend stays on the card.
          </p>

          <div className="mt-6 flex justify-end">
            <Button type="button" size="sm" arrow={false} onClick={close}>
              Done
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}

/* ── Buying one ──────────────────────────────────────────────────────────── */

/**
 * Buying a gift card, in a modal: the card (showing the amount as it is
 * chosen), the amount (one of the brand's, or any other in range), who it
 * is for (you, or someone else: their name, email and a message), and the
 * total, paid from the wallet. Buy checks it and puts focus on what to fix;
 * bought, it says so (a card for you joins your cards; a gift is emailed).
 * Mount it only while it is open, so it starts afresh.
 */
function BuyDialog({ brand, balance, onBuy, onClose }) {
  const id = useId();
  const [choice, setChoice] = useState(brand.amounts[1] ?? brand.amounts[0]);
  const [other, setOther] = useState("");
  const [forWho, setForWho] = useState("me");
  const [gift, setGift] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [bought, setBought] = useState(null);
  const formRef = useRef(null);

  const amount = choice === "other" ? Number.parseFloat(other) || 0 : choice;
  const clear = (key) => setErrors((e) => ({ ...e, [key]: undefined }));

  const buy = (event) => {
    event.preventDefault();
    const found = {};
    if (choice === "other") {
      if (!amount) found.other = "Enter an amount";
      else if (amount < min || amount > max)
        found.other = `Choose ${formatMoney(min, { whole: true })} to ${formatMoney(max, { whole: true })}`;
    }
    if (forWho === "gift") {
      if (!gift.name.trim()) found.giftName = "Enter their name";
      if (!EMAIL.test(gift.email.trim()))
        found.giftEmail = "Enter an email like name@example.com";
    }
    if (amount > balance && !found.other)
      found.total = `That is more than your balance of ${formatMoney(balance)}`;
    setErrors(found);
    const first = Object.keys(found).find((key) => key !== "total");
    if (first) {
      formRef.current?.elements.namedItem(first)?.focus();
      return;
    }
    if (found.total) return;
    setBusy(true);
    window.setTimeout(() => {
      setBought(
        onBuy({
          brand,
          amount: cents(amount),
          gift:
            forWho === "gift"
              ? { ...gift, name: gift.name.trim(), email: gift.email.trim() }
              : null,
        }),
      );
      setBusy(false);
    }, BUY_MS);
  };

  return (
    <Modal labelledBy={`${id}-title`} onClose={onClose}>
      {(close) => (
        <div className="p-5 sm:p-6">
          <ModalHead
            id={`${id}-title`}
            title={bought ? "Gift card ready" : `${brand.name} gift card`}
            subtitle={`Use it on ${brand.use}`}
            onClose={close}
          />
          <GiftCardArt
            brand={brand}
            amount={amount || undefined}
            line={
              bought?.gift
                ? `For ${bought.gift.name}`
                : amount
                  ? undefined
                  : "Choose an amount"
            }
            className="mx-auto mt-5 max-w-[22rem]"
          />

          {bought ? (
            <div
              role="status"
              className="mt-6 text-center motion-safe:animate-pop-in"
            >
              <span
                aria-hidden="true"
                className="mx-auto grid size-12 place-items-center rounded-full bg-success/12 text-success"
              >
                <CheckIcon className="size-6" />
              </span>
              <p className="mt-4 font-heading text-xl font-semibold text-headline">
                {bought.gift
                  ? `Sent to ${bought.gift.name}`
                  : `Your ${formatMoney(bought.amount)} ${brand.name} card is ready`}
              </p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-pretty text-muted">
                {bought.gift
                  ? `We emailed it to ${bought.gift.email}, with your message.`
                  : "It is in My gift cards, with its code."}{" "}
                Your balance is now {formatMoney(bought.balance)}.
              </p>
              <div className="mt-6 flex justify-center">
                <Button type="button" size="sm" arrow={false} onClick={close}>
                  Done
                </Button>
              </div>
            </div>
          ) : (
            <form
              ref={formRef}
              onSubmit={buy}
              noValidate
              className="mt-6 flex flex-col gap-5"
            >
              <fieldset>
                <legend className={LABEL}>Amount</legend>
                <div className="mt-2">
                  <QuickAmounts
                    amounts={brand.amounts}
                    value={choice}
                    onPick={(n) => {
                      setChoice(n);
                      clear("other");
                      clear("total");
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setChoice("other")}
                      aria-pressed={choice === "other"}
                      className={cn(
                        "h-9 cursor-pointer rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                        choice === "other"
                          ? "border-brand bg-brand-50 text-brand-700 dark:bg-brand/15 dark:text-brand-300"
                          : "border-line text-headline hover:border-headline/30",
                      )}
                    >
                      Other
                    </button>
                  </QuickAmounts>
                </div>
                {choice === "other" && (
                  <TextField
                    label="Other amount"
                    name="other"
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder="0.00"
                    autoFocus
                    className="mt-3"
                    inputClassName="tabular-nums"
                    prefix={
                      <span className="pl-3.5 text-[0.9375rem] font-medium text-muted">
                        $
                      </span>
                    }
                    hint={`${formatMoney(min, { whole: true })} to ${formatMoney(max, { whole: true })}`}
                    value={other}
                    onChange={(event) => {
                      setOther(cleanAmount(event.target.value));
                      clear("other");
                      clear("total");
                    }}
                    error={errors.other}
                  />
                )}
              </fieldset>

              <Segmented
                name="for"
                label="Who it is for"
                value={forWho}
                onChange={(next) => {
                  setForWho(next);
                  setErrors({});
                }}
                options={RECIPIENTS}
              />

              {forWho === "gift" && (
                <div className="grid gap-4 @min-[28rem]:grid-cols-2">
                  <TextField
                    label="Their name"
                    required
                    name="giftName"
                    autoComplete="off"
                    value={gift.name}
                    onChange={(event) => {
                      setGift((g) => ({ ...g, name: event.target.value }));
                      clear("giftName");
                    }}
                    error={errors.giftName}
                  />
                  <TextField
                    label="Their email"
                    required
                    type="email"
                    name="giftEmail"
                    autoComplete="off"
                    value={gift.email}
                    onChange={(event) => {
                      setGift((g) => ({ ...g, email: event.target.value }));
                      clear("giftEmail");
                    }}
                    error={errors.giftEmail}
                  />
                  <TextField
                    label="Message"
                    name="message"
                    autoComplete="off"
                    maxLength={120}
                    placeholder="Happy birthday!"
                    className="@min-[28rem]:col-span-2"
                    value={gift.message}
                    onChange={(event) =>
                      setGift((g) => ({ ...g, message: event.target.value }))
                    }
                  />
                </div>
              )}

              <div className="flex items-center justify-between gap-4 rounded-2xl bg-canvas/60 p-4">
                <div className="min-w-0">
                  <p className="text-xs text-muted">Total, from your wallet</p>
                  <p className="mt-0.5 text-xs text-muted tabular-nums">
                    {formatMoney(balance)} available, no fee
                  </p>
                </div>
                <p className="font-heading text-2xl font-semibold text-headline tabular-nums">
                  {formatMoney(amount)}
                </p>
              </div>
              {errors.total && <Status tone="danger">{errors.total}</Status>}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  arrow={false}
                  onClick={close}
                  disabled={busy}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  arrow={false}
                  disabled={busy}
                  aria-busy={busy || undefined}
                  className="disabled:cursor-wait disabled:opacity-70"
                >
                  {busy ? "Buying" : `Buy for ${formatMoney(amount)}`}
                </Button>
              </div>
            </form>
          )}
        </div>
      )}
    </Modal>
  );
}

/* ── The page ────────────────────────────────────────────────────────────── */

/**
 * The Gift Card page: the gift cards held, each opening its code and balance;
 * then the shop, every brand's card in a grid, narrowed by a search and a
 * category, each opening a way to buy it, for you or as a gift, paid from
 * the wallet.
 *
 * DEMO: nothing is bought or sent. Buying waits a moment, then takes the
 * money off the balance shown; a card for you joins your cards here.
 */
export function GiftCards() {
  const [held, setHeld] = useState(giftCards.held);
  const [balance, setBalance] = useState(wallet.balance);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [buying, setBuying] = useState(null);
  const [openId, setOpenId] = useState(null);
  const searchId = useId();

  const total = held.reduce((sum, card) => sum + card.balance, 0);
  const q = query.trim().toLowerCase();
  const shown = brands.filter(
    (b) =>
      (category === "all" || b.category === category) &&
      (!q ||
        b.name.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q)),
  );
  const openCard = held.find((card) => card.id === openId);
  const buyingBrand = buying ? brandOf(buying) : null;

  /** Pays for a card, keeps it if it is for you, and says what is left. */
  const buy = ({ brand, amount, gift }) => {
    const after = cents(balance - amount);
    setBalance(after);
    if (!gift) {
      setHeld((list) => [
        {
          id: `g-${Date.now()}`,
          brand: brand.id,
          balance: amount,
          value: amount,
          code: newCode(brand),
          expires: expiryFromNow(),
        },
        ...list,
      ]);
    }
    return { amount, gift, balance: after };
  };

  return (
    <div className="@container flex flex-col gap-4 lg:gap-5">
      {/* ── The cards held ─────────────────────────────────────────────── */}
      <Panel
        id="held-title"
        title="My gift cards"
        subtitle={
          held.length
            ? `${held.length} ${held.length === 1 ? "card" : "cards"}, ${formatMoney(total)} to spend`
            : "Cards you buy for yourself show here"
        }
        icon={<GiftIcon className="size-[18px]" />}
      >
        {held.length ? (
          <ul className="mt-2 grid grid-cols-[repeat(auto-fill,minmax(min(100%,17rem),1fr))] gap-5">
            {held.map((card) => {
              const brand = brandOf(card.brand);
              return (
                <li key={card.id}>
                  <button
                    type="button"
                    onClick={() => setOpenId(card.id)}
                    aria-label={`${brand.name} gift card, ${formatMoney(card.balance)} left. Show its code`}
                    className="group block w-full max-w-[24rem] cursor-pointer rounded-[1.1rem] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
                  >
                    <GiftCardArt
                      brand={brand}
                      amount={card.balance}
                      line={`of ${formatMoney(card.value)}, expires ${card.expires}`}
                      className="transition-transform duration-500 ease-out group-hover:-translate-y-1.5"
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="grid place-items-center rounded-2xl border border-dashed border-line px-6 py-10 text-center">
            <span
              aria-hidden="true"
              className="grid size-12 place-items-center rounded-full bg-brand-50 text-brand dark:bg-brand/15"
            >
              <GiftIcon className="size-5" />
            </span>
            <p className="mt-3 text-sm font-semibold text-headline">
              No gift cards yet
            </p>
            <p className="mt-1 text-xs text-muted">
              Buy one below, for you or for someone else.
            </p>
          </div>
        )}
      </Panel>

      {/* ── The shop ───────────────────────────────────────────────────── */}
      <Panel
        id="shop-title"
        title="Buy a gift card"
        subtitle={`Paid from your wallet, ${formatMoney(balance)} available`}
        icon={<SparklesIcon className="size-[18px]" />}
      >
        <div className="mt-1 flex flex-col gap-3 @min-[40rem]:flex-row">
          <div className="min-w-0 flex-1">
            <label htmlFor={searchId} className="sr-only">
              Search brands
            </label>
            <div className="flex h-11 items-center rounded-xl border border-line bg-canvas/60 transition-[border-color,background-color,box-shadow] hover:border-headline/25 focus-within:border-brand focus-within:bg-card focus-within:shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-brand)_14%,transparent)]">
              <SearchIcon
                aria-hidden="true"
                className="ml-3.5 size-[18px] shrink-0 text-muted"
              />
              <input
                id={searchId}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search brands"
                autoComplete="off"
                className="h-full min-w-0 flex-1 bg-transparent px-3 text-[0.9375rem] text-headline outline-none placeholder:text-subtle"
              />
            </div>
          </div>
          <Listbox
            label="Category"
            labelClassName="sr-only"
            value={category}
            onChange={setCategory}
            options={CATEGORY_OPTIONS}
            align="right"
            className="@min-[40rem]:w-56"
            buttonClassName="h-11 rounded-xl border border-line bg-canvas/60 pr-3.5 pl-3.5 transition-colors hover:border-headline/25 aria-expanded:border-brand aria-expanded:bg-card"
            listClassName="w-full"
            renderValue={(option) => (
              <span className="truncate text-[0.9375rem] text-headline">
                {option.label}
              </span>
            )}
            renderOption={(option) => (
              <span className="min-w-0 flex-1 truncate text-sm text-headline">
                {option.label}
              </span>
            )}
          />
        </div>

        <p className={cn(SMALL_HEADING, "mt-6")} aria-live="polite">
          {shown.length} {shown.length === 1 ? "brand" : "brands"}
          {category !== "all" ? `, ${category.toLowerCase()}` : ""}
        </p>
        {shown.length ? (
          <ul className="mt-3 grid grid-cols-[repeat(auto-fill,minmax(min(100%,13rem),1fr))] gap-4">
            {shown.map((brand) => (
              <li key={brand.id}>
                <button
                  type="button"
                  onClick={() => setBuying(brand.id)}
                  aria-label={`Buy a ${brand.name} gift card, ${formatMoney(brand.amounts[0], { whole: true })} to ${formatMoney(brand.amounts.at(-1), { whole: true })}`}
                  className="group block w-full cursor-pointer rounded-[1.1rem] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
                >
                  <GiftCardArt
                    brand={brand}
                    line={`${formatMoney(brand.amounts[0], { whole: true })} to ${formatMoney(brand.amounts.at(-1), { whole: true })}`}
                    className="transition-transform duration-500 ease-out group-hover:-translate-y-1"
                  />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-3 grid place-items-center rounded-2xl border border-dashed border-line px-6 py-10 text-center">
            <p className="text-sm font-semibold text-headline">
              No brands match {q ? `“${query.trim()}”` : "that"}
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("all");
              }}
              className="mt-2 cursor-pointer rounded-md px-1.5 py-0.5 text-sm font-semibold text-brand transition-colors hover:bg-brand/10 focus-visible:outline-2 focus-visible:outline-brand"
            >
              Show all brands
            </button>
          </div>
        )}
      </Panel>

      {buyingBrand && (
        <BuyDialog
          key={buyingBrand.id}
          brand={buyingBrand}
          balance={balance}
          onBuy={buy}
          onClose={() => setBuying(null)}
        />
      )}
      {openCard && (
        <HeldDialog
          key={openCard.id}
          card={openCard}
          onClose={() => setOpenId(null)}
        />
      )}
    </div>
  );
}
