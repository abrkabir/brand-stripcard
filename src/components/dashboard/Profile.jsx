"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  CountrySelect,
  PasswordField,
  PhoneField,
  Status,
  TextField,
} from "@/components/dashboard/FormField";
import { Panel } from "@/components/dashboard/Panel";
import {
  CalendarIcon,
  CameraIcon,
  CheckIcon,
  ChevronRightIcon,
  CreditCardIcon,
  HelpCircleIcon,
  LayersIcon,
  LockIcon,
  MailIcon,
  ShieldIcon,
  SparklesIcon,
  TrashIcon,
  UserIcon,
} from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { dashboardUser, kyc, membership, profile } from "@/data/dashboard";
import { cn } from "@/lib/cn";

/** The details the form edits, and the ones a complete profile fills in. */
const FIELDS = [
  "first",
  "last",
  "country",
  "phone",
  "address",
  "city",
  "state",
  "zip",
];

/** How long the demo pretends to talk to the server, in milliseconds. */
const SAVE_MS = 800;

/** The largest photo we take, in bytes. */
const MAX_PHOTO = 5 * 1024 * 1024;

/** The page's sections, as the sidebar lists them. */
const SECTIONS = [
  {
    id: "personal",
    label: "Personal info",
    icon: UserIcon,
  },
  {
    id: "password",
    label: "Password",
    icon: LockIcon,
  },
  {
    id: "membership",
    label: "Membership",
    icon: SparklesIcon,
  },
  {
    id: "delete",
    label: "Delete account",
    icon: TrashIcon,
    danger: true,
  },
];

const pick = (from) =>
  Object.fromEntries(FIELDS.map((key) => [key, from[key] ?? ""]));

/**
 * The open section lives in the URL's hash (#password), so a section can be
 * linked to and survives a reload. Read through useSyncExternalStore: the
 * server, and the first render, see no hash and open the first section.
 */
const onHash = (callback) => {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
};
const readHash = () => window.location.hash.slice(1);
const noHash = () => "";

function openSection(id) {
  window.history.replaceState(null, "", `#${id}`);
  window.dispatchEvent(new HashChangeEvent("hashchange"));
}

/* ── The sidebar ─────────────────────────────────────────────────────────── */

/**
 * The page's sections, as a list down the left, the open one lit, standing
 * as tall as the section beside it; at its foot, a way to the help pages. On
 * a narrow screen the list becomes a row of tabs that scrolls, and the help
 * card goes.
 *
 * The list is a set of tabs: arrow keys, Home and End move between them, and
 * each one opens its section.
 */
function ProfileSidebar({ section }) {
  const onKey = (event) => {
    const steps = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    const n = SECTIONS.length;
    let i = SECTIONS.findIndex((s) => s.id === section);
    if (event.key in steps) i = (i + steps[event.key] + n) % n;
    else if (event.key === "Home") i = 0;
    else if (event.key === "End") i = n - 1;
    else return;
    event.preventDefault();
    openSection(SECTIONS[i].id);
    document.getElementById(`profile-tab-${SECTIONS[i].id}`)?.focus();
  };

  return (
    <aside className="flex flex-col rounded-[1.75rem] bg-card p-3 @min-[56rem]:p-4">
      <p className="hidden px-2 pt-1 pb-3 text-[0.6875rem] font-semibold tracking-[0.12em] text-subtle uppercase @min-[56rem]:block">
        Account settings
      </p>

      <div
        role="tablist"
        aria-label="Profile sections"
        aria-orientation="vertical"
        onKeyDown={onKey}
        className="flex gap-1.5 overflow-x-auto [scrollbar-width:none] @min-[56rem]:flex-col @min-[56rem]:overflow-visible"
      >
        {SECTIONS.map((item) => {
          const on = item.id === section;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              id={`profile-tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={on}
              aria-controls={`profile-panel-${item.id}`}
              tabIndex={on ? 0 : -1}
              onClick={() => openSection(item.id)}
              className={cn(
                "group relative flex shrink-0 cursor-pointer items-center gap-3 rounded-2xl py-2 pr-3 pl-2 text-left transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand @min-[56rem]:w-full",
                on ? "bg-canvas" : "hover:bg-canvas/60",
                item.danger && "@min-[56rem]:mt-3",
              )}
            >
              {/* The open section's mark. */}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-1/2 -left-4 hidden h-6 w-1 -translate-y-1/2 rounded-r-full transition-opacity duration-300 @min-[56rem]:block",
                  item.danger ? "bg-danger" : "bg-brand",
                  on ? "opacity-100" : "opacity-0",
                )}
              />
              <span
                aria-hidden="true"
                className={cn(
                  "grid size-9 shrink-0 place-items-center rounded-xl transition-colors duration-300",
                  item.danger
                    ? on
                      ? "bg-danger-solid text-white"
                      : "bg-danger/10 text-danger"
                    : on
                      ? "bg-brand text-white"
                      : "bg-canvas text-headline group-hover:bg-card",
                )}
              >
                <Icon className="size-[17px]" />
              </span>
              <span
                className={cn(
                  "min-w-0 flex-1 text-sm font-semibold whitespace-nowrap",
                  item.danger ? "text-danger" : "text-headline",
                )}
              >
                {item.label}
              </span>
              <ChevronRightIcon
                aria-hidden="true"
                className={cn(
                  "hidden size-4 shrink-0 transition-[translate,color] duration-300 @min-[56rem]:block",
                  on
                    ? "translate-x-0.5 text-headline"
                    : "text-subtle group-hover:translate-x-0.5",
                )}
              />
            </button>
          );
        })}
      </div>

      {/* A way to the help pages, at the foot. */}
      <div className="mt-auto hidden pt-6 @min-[56rem]:block">
        <div className="rounded-2xl bg-canvas/60 p-4">
          <span
            aria-hidden="true"
            className="grid size-9 place-items-center rounded-xl bg-card text-brand"
          >
            <HelpCircleIcon className="size-[18px]" />
          </span>
          <p className="mt-3 text-sm font-semibold text-headline">
            Need a hand?
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            Our support team is here 24/7 for anything about your account.
          </p>
          <Link
            href="/dashboard/help"
            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand transition-colors hover:text-brand-700"
          >
            Visit Help
            <ChevronRightIcon aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}

/**
 * The profile photo, at the top of Personal info: the photo, the name and
 * email, and a button to change the photo.
 */
function PhotoRow({ name, photo, onPhoto, note }) {
  const inputId = useId();
  return (
    <div className="mb-6 rounded-2xl bg-canvas/60 p-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-full bg-card ring-4 ring-card">
          <Image
            src={photo}
            alt={`${name}'s profile photo`}
            fill
            sizes="64px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-heading text-lg leading-tight font-semibold text-headline">
            {name}
          </p>
          <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-muted">
            <MailIcon aria-hidden="true" className="size-3.5 shrink-0" />
            <span className="truncate">{profile.email}</span>
            {profile.verified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-xs font-semibold text-success">
                <CheckIcon aria-hidden="true" className="size-3" />
                Verified
              </span>
            )}
          </p>
        </div>
        <div className="flex basis-full flex-wrap items-center gap-x-3 gap-y-1.5 @min-[32rem]:basis-auto @min-[32rem]:flex-col @min-[32rem]:items-end">
          <input
            id={inputId}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="peer sr-only"
            onChange={(event) => {
              onPhoto(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
          <label
            htmlFor={inputId}
            className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border border-line bg-card px-4 text-sm font-semibold text-headline transition-colors hover:border-headline/40 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand"
          >
            <CameraIcon aria-hidden="true" className="size-4" />
            Change photo
          </label>
          <p className="text-xs text-muted">PNG, JPG or WebP, up to 5 MB</p>
        </div>
      </div>
      {note && <div className="mt-3">{note}</div>}
    </div>
  );
}

/* ── Personal info ───────────────────────────────────────────────────────── */

/** What is wrong with the details, by field; empty when they can be saved. */
function check(draft) {
  const errors = {};
  if (!draft.first.trim()) errors.first = "Enter your first name";
  if (!draft.last.trim()) errors.last = "Enter your last name";
  const digits = draft.phone.replace(/\D/g, "");
  if (!digits) errors.phone = "Enter your phone number";
  else if (digits.length < 6 || digits.length > 14)
    errors.phone = "Enter a phone number of 6 to 14 digits";
  return errors;
}

function DetailsPanel({ saved, onSave, photo, onPhoto, photoNote }) {
  const [draft, setDraft] = useState(saved);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const formRef = useRef(null);

  const dirty = FIELDS.some((key) => draft[key] !== saved[key]);

  const set = (key) => (value) => {
    setDraft((d) => ({ ...d, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
    setSavedAt(null);
  };
  const field = (key) => ({
    name: key,
    value: draft[key],
    onChange: (event) => set(key)(event.target.value),
    error: errors[key],
  });

  const submit = (event) => {
    event.preventDefault();
    const found = check(draft);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      formRef.current?.elements.namedItem(first)?.focus();
      return;
    }
    setBusy(true);
    setTimeout(() => {
      onSave(draft);
      setBusy(false);
      setSavedAt(Date.now());
    }, SAVE_MS);
  };

  const discard = () => {
    setDraft(saved);
    setErrors({});
  };

  return (
    <Panel
      id="details-title"
      title="Personal info"
      subtitle="Used on your statements and for identity checks"
      icon={<UserIcon className="size-[18px]" />}
    >
      <PhotoRow
        name={`${saved.first} ${saved.last}`.trim() || "Your name"}
        photo={photo}
        onPhoto={onPhoto}
        note={photoNote}
      />
      <form
        ref={formRef}
        onSubmit={submit}
        noValidate
        className="flex flex-1 flex-col"
      >
        <div className="grid gap-x-4 gap-y-4 @min-[32rem]:grid-cols-2">
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
            label="Email"
            value={profile.email}
            readOnly
            hint="To change your email, contact support"
            className="@min-[32rem]:col-span-2"
            suffix={
              <LockIcon
                aria-hidden="true"
                className="mr-3.5 size-4 shrink-0 text-subtle"
              />
            }
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
            placeholder="415 555 0132"
            country={draft.country}
            {...field("phone")}
          />

          <TextField
            label="Address"
            autoComplete="street-address"
            placeholder="Street and number"
            {...field("address")}
            className="@min-[32rem]:col-span-2"
          />
          <TextField
            label="City"
            autoComplete="address-level2"
            {...field("city")}
          />
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="State"
              autoComplete="address-level1"
              {...field("state")}
            />
            <TextField
              label="ZIP code"
              autoComplete="postal-code"
              inputMode="numeric"
              {...field("zip")}
            />
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-4 border-t border-line pt-5 @min-[32rem]:flex-row @min-[32rem]:items-center @min-[32rem]:justify-between">
          <div className="min-h-5">
            {busy ? (
              <Status>Saving your changes</Status>
            ) : savedAt && !dirty ? (
              <Status tone="success">Changes saved</Status>
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
              onClick={discard}
              disabled={!dirty || busy}
              className="disabled:opacity-50"
            >
              Discard
            </Button>
            <Button
              type="submit"
              size="sm"
              arrow={false}
              disabled={!dirty || busy}
              aria-busy={busy || undefined}
              className="disabled:opacity-50 aria-busy:cursor-wait"
            >
              {busy ? "Saving" : "Save changes"}
            </Button>
          </div>
        </div>
      </form>
    </Panel>
  );
}

/* ── Password ────────────────────────────────────────────────────────────── */

const RULES = [
  { id: "length", label: "8 characters or more", test: (p) => p.length >= 8 },
  {
    id: "case",
    label: "Upper and lower case",
    test: (p) => /[a-z]/.test(p) && /[A-Z]/.test(p),
  },
  { id: "number", label: "A number", test: (p) => /\d/.test(p) },
  { id: "symbol", label: "A symbol", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

const STRENGTH = [
  { label: "Too weak", bar: "bg-danger", text: "text-danger" },
  { label: "Weak", bar: "bg-danger", text: "text-danger" },
  { label: "Fair", bar: "bg-brand-400", text: "text-brand-600" },
  { label: "Good", bar: "bg-brand", text: "text-brand-600" },
  { label: "Strong", bar: "bg-success", text: "text-success" },
];

/**
 * Changing the password: the three fields on the left, and on the right how
 * strong the new one is and what makes it so, checked off as it is typed.
 */
function PasswordPanel() {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [changed, setChanged] = useState(false);

  const score = form.next
    ? RULES.filter((rule) => rule.test(form.next)).length
    : 0;
  const strength = STRENGTH[score];
  const mismatch = form.confirm && form.confirm !== form.next;

  const set = (key) => (event) => {
    const value = event.target.value;
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
    setChanged(false);
  };

  const submit = (event) => {
    event.preventDefault();
    const found = {};
    if (!form.current) found.current = "Enter your current password";
    if (form.next.length < 8) found.next = "Use 8 characters or more";
    else if (form.next === form.current)
      found.next = "Choose a password you have not used here";
    if (!form.confirm) found.confirm = "Type the new password again";
    else if (form.confirm !== form.next)
      found.confirm = "The passwords do not match";
    setErrors(found);
    if (Object.keys(found).length) return;
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      setChanged(true);
      setForm({ current: "", next: "", confirm: "" });
    }, SAVE_MS);
  };

  return (
    <Panel
      id="password-title"
      title="Password"
      subtitle={changed ? "Changed just now" : "Last changed 3 months ago"}
      icon={<LockIcon className="size-[18px]" />}
    >
      <form
        onSubmit={submit}
        noValidate
        className="grid gap-6 @min-[44rem]:grid-cols-[minmax(0,1fr)_16rem] @min-[44rem]:gap-8"
      >
        <div className="flex flex-col gap-4">
          <PasswordField
            label="Current password"
            required
            autoComplete="current-password"
            value={form.current}
            onChange={set("current")}
            error={errors.current}
          />
          <PasswordField
            label="New password"
            required
            autoComplete="new-password"
            value={form.next}
            onChange={set("next")}
            error={errors.next}
          />
          <PasswordField
            label="Confirm new password"
            required
            autoComplete="new-password"
            value={form.confirm}
            onChange={set("confirm")}
            error={
              errors.confirm ||
              (mismatch ? "The passwords do not match" : undefined)
            }
            hint={
              form.confirm && !mismatch ? (
                <span className="inline-flex items-center gap-1 font-medium text-success">
                  <CheckIcon aria-hidden="true" className="size-3.5" />
                  Passwords match
                </span>
              ) : undefined
            }
          />
          <div className="mt-2 flex flex-col gap-3 @min-[32rem]:flex-row @min-[32rem]:items-center">
            <Button
              type="submit"
              size="sm"
              arrow={false}
              disabled={busy}
              className="disabled:cursor-wait disabled:opacity-70"
            >
              {busy ? "Updating password" : "Update password"}
            </Button>
            {changed && <Status tone="success">Password updated</Status>}
          </div>
        </div>

        {/* How strong the new password is, and what makes it so. */}
        <aside className="self-start rounded-2xl bg-canvas/60 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-headline">
              Password strength
            </p>
            <span
              className={cn(
                "text-xs font-semibold",
                form.next ? strength.text : "text-subtle",
              )}
            >
              {form.next ? strength.label : "Not set"}
            </span>
          </div>
          <div aria-hidden="true" className="mt-3 grid grid-cols-4 gap-1.5">
            {RULES.map((rule, i) => (
              <span
                key={rule.id}
                className={cn(
                  "h-1.5 rounded-full transition-colors duration-300",
                  i < score ? strength.bar : "bg-line",
                )}
              />
            ))}
          </div>
          <ul className="mt-4 flex flex-col gap-2">
            {RULES.map((rule) => {
              const ok = rule.test(form.next);
              return (
                <li
                  key={rule.id}
                  className={cn(
                    "flex items-center gap-2 text-[13px] transition-colors",
                    ok ? "text-success" : "text-muted",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "grid size-4 shrink-0 place-items-center rounded-full transition-colors",
                      ok
                        ? "bg-success text-white"
                        : "ring-1 ring-line ring-inset",
                    )}
                  >
                    {ok && <CheckIcon className="size-2.5" strokeWidth={3} />}
                  </span>
                  {rule.label}
                  <span className="sr-only">{ok ? ", done" : ", not yet"}</span>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 border-t border-line pt-4 text-xs leading-relaxed text-muted">
            A short phrase only you would think of is easier to remember and
            harder to guess.
          </p>
        </aside>
      </form>
    </Panel>
  );
}

/* ── Membership ──────────────────────────────────────────────────────────── */

/** How much of the profile is filled in, as a ring with the percentage in it. */
function Completeness({ value }) {
  const r = 22;
  const length = 2 * Math.PI * r;
  const done = value >= 100;
  return (
    <div className="flex items-center gap-4">
      <div
        role="meter"
        aria-label="Profile complete"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        className="relative grid size-14 shrink-0 place-items-center"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 56 56"
          className="absolute inset-0 size-full -rotate-90"
        >
          <circle
            cx="28"
            cy="28"
            r={r}
            fill="none"
            strokeWidth="5"
            className="stroke-line"
          />
          <circle
            cx="28"
            cy="28"
            r={r}
            fill="none"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={length}
            strokeDashoffset={length * (1 - value / 100)}
            className={cn(
              "transition-[stroke-dashoffset] duration-700 ease-out",
              done ? "stroke-success" : "stroke-brand",
            )}
          />
        </svg>
        <span className="text-xs font-semibold text-headline tabular-nums">
          {value}%
        </span>
      </div>
      <div className="leading-tight">
        <p className="text-sm font-semibold text-headline">
          {done ? "Profile complete" : "Profile incomplete"}
        </p>
        <p className="mt-1 text-xs text-muted">
          {done
            ? "Everything we need is here"
            : "Add the missing details in Personal info"}
        </p>
      </div>
    </div>
  );
}

/** One fact about the account, in its own tile. */
function Fact({ icon: Icon, label, children }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-canvas/60 p-4">
      <span
        aria-hidden="true"
        className="grid size-10 shrink-0 place-items-center rounded-xl bg-card text-headline"
      >
        <Icon className="size-[18px]" />
      </span>
      <div className="min-w-0 leading-tight">
        <p className="text-xs text-muted">{label}</p>
        <div className="mt-1 text-sm font-semibold text-headline">
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * The account's plan and facts: the plan as a dark card with what it
 * includes, the premium plan beside it, then the facts about the account and
 * how complete the profile is.
 */
function MembershipPanel({ saved }) {
  const [copied, setCopied] = useState(false);
  const filled = FIELDS.filter((key) => String(saved[key]).trim()).length;
  const complete = Math.round((filled / FIELDS.length) * 100);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(id);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(membership.accountId);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Panel
      id="membership-title"
      title="Membership"
      subtitle="Your plan, and the facts about your account"
      icon={<SparklesIcon className="size-[18px]" />}
    >
      <div className="grid gap-4 @min-[40rem]:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        {/* The plan. */}
        <div className="relative isolate overflow-hidden rounded-[1.5rem] bg-hero-ink p-6 text-white">
          <span
            aria-hidden="true"
            className="absolute -top-20 -right-16 -z-10 size-64 rounded-full bg-[radial-gradient(closest-side,rgb(242_106_27/0.7),rgb(242_106_27/0.15)_55%,rgb(242_106_27/0))]"
          />
          <span
            aria-hidden="true"
            className="bg-grain absolute inset-0 -z-10 opacity-[0.08]"
          />
          <p className="text-xs font-semibold tracking-[0.12em] text-white/55 uppercase">
            Current plan
          </p>
          <div className="mt-2 flex items-end justify-between gap-4">
            <p className="font-heading text-[2rem] leading-none font-semibold tracking-[-0.02em]">
              {membership.plan}
            </p>
            <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-semibold ring-1 ring-white/15 ring-inset">
              {membership.price}
            </span>
          </div>
          <ul className="mt-6 grid gap-2.5 @min-[30rem]:grid-cols-2">
            {membership.perks.map((perk) => (
              <li
                key={perk}
                className="flex items-center gap-2 text-sm text-white/80"
              >
                <span
                  aria-hidden="true"
                  className="grid size-4 shrink-0 place-items-center rounded-full bg-brand text-white"
                >
                  <CheckIcon className="size-2.5" strokeWidth={3} />
                </span>
                {perk}
              </li>
            ))}
          </ul>
        </div>

        {/* The premium plan. */}
        <div className="flex flex-col rounded-[1.5rem] bg-linear-to-br from-brand-50 to-brand-100 p-6 ring-1 ring-brand-200/60 ring-inset dark:from-brand-950 dark:to-brand-900/60 dark:ring-brand-800/50">
          <span
            aria-hidden="true"
            className="grid size-10 place-items-center rounded-xl bg-brand text-white"
          >
            <SparklesIcon className="size-[18px]" />
          </span>
          <p className="mt-4 font-heading text-xl font-semibold text-headline">
            Go {membership.upgrade.title}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-content">
            {membership.upgrade.text}
          </p>
          <Button
            href={membership.upgrade.href}
            size="sm"
            className="mt-5 self-start @min-[40rem]:mt-auto"
          >
            See {membership.upgrade.title}
          </Button>
        </div>
      </div>

      {/* The facts. */}
      <div className="mt-4 grid gap-3 @min-[34rem]:grid-cols-2">
        <Fact icon={CalendarIcon} label="Member since">
          {profile.memberSince}
        </Fact>
        <Fact icon={LayersIcon} label="Account ID">
          <span className="flex items-center gap-2">
            <span className="whitespace-nowrap tabular-nums">
              {membership.accountId}
            </span>
            <button
              type="button"
              onClick={copy}
              className="cursor-pointer rounded-md px-1.5 py-0.5 text-xs font-semibold text-brand transition-colors hover:bg-brand/10 focus-visible:outline-2 focus-visible:outline-brand"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </span>
        </Fact>
        <Fact icon={CreditCardIcon} label="Virtual cards">
          {profile.cards} active
        </Fact>
        <Fact icon={ShieldIcon} label="Identity">
          {kyc.status === "verified" ? (
            <span className="text-success">Verified</span>
          ) : (
            <span className="flex items-center gap-2 whitespace-nowrap">
              Not verified
              <Link
                href="/dashboard/kyc-verification"
                className="rounded-md px-1.5 py-0.5 text-xs font-semibold text-brand transition-colors hover:bg-brand/10 focus-visible:outline-2 focus-visible:outline-brand"
              >
                Verify<span className="sr-only"> your identity</span>
              </Link>
            </span>
          )}
        </Fact>
      </div>

      <div className="mt-4 rounded-2xl border border-line p-4">
        <Completeness value={complete} />
      </div>
    </Panel>
  );
}

/* ── Delete account ──────────────────────────────────────────────────────── */

const CONFIRM_WORD = "DELETE";

/** What deleting the account does, each as a line with a mark. */
const CONSEQUENCES = [
  "Every virtual card stops working at once",
  "Any balance left is paid out to your bank",
  "Your profile and settings are removed",
];

function DangerPanel() {
  const [typed, setTyped] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const confirm = (event) => {
    event.preventDefault();
    if (typed !== CONFIRM_WORD) return;
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      setDone(true);
      setTyped("");
    }, SAVE_MS);
  };

  return (
    <section
      aria-labelledby="danger-title"
      className="rounded-[1.75rem] bg-card p-5 ring-1 ring-danger/20 ring-inset sm:p-6"
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="grid size-10 shrink-0 place-items-center rounded-full bg-danger/10 text-danger"
        >
          <TrashIcon className="size-[18px]" />
        </span>
        <div className="min-w-0">
          <h2
            id="danger-title"
            className="font-heading text-lg leading-tight font-semibold text-headline"
          >
            Delete account
          </h2>
          <p className="mt-0.5 text-xs text-muted">This cannot be undone</p>
        </div>
      </div>

      <div className="mt-5 grid gap-5 @min-[44rem]:grid-cols-2 @min-[44rem]:gap-8">
        <div>
          <p className="text-sm font-semibold text-headline">
            When you delete your account
          </p>
          <ul className="mt-3 flex flex-col gap-2.5">
            {CONSEQUENCES.map((line) => (
              <li
                key={line}
                className="flex items-start gap-2.5 text-sm text-content"
              >
                <span
                  aria-hidden="true"
                  className="mt-1.5 size-1.5 shrink-0 rounded-full bg-danger"
                />
                {line}
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={confirm} className="rounded-2xl bg-danger/5 p-4">
          <label
            htmlFor="delete-confirm"
            className="block text-sm text-content"
          >
            Type{" "}
            <span className="font-semibold text-headline">{CONFIRM_WORD}</span>{" "}
            to confirm
          </label>
          <input
            id="delete-confirm"
            value={typed}
            onChange={(event) => {
              setTyped(event.target.value.toUpperCase());
              setDone(false);
            }}
            autoComplete="off"
            spellCheck={false}
            className="mt-2 h-11 w-full rounded-xl border border-line bg-card px-3.5 text-[0.9375rem] font-semibold tracking-[0.12em] text-headline outline-none transition-[border-color,box-shadow] focus:border-danger focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-danger)_14%,transparent)]"
          />
          <button
            type="submit"
            disabled={typed !== CONFIRM_WORD || busy}
            className="mt-3 inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-danger-solid px-5 text-sm font-semibold text-white transition-[background-color,opacity] hover:bg-danger-solid/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger disabled:cursor-not-allowed disabled:opacity-40"
          >
            <TrashIcon aria-hidden="true" className="size-4" />
            {busy ? "Deleting" : "Delete my account"}
          </button>
          {done && (
            <div className="mt-3">
              <Status>This is a demo, so your account was not deleted.</Status>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}

/* ── The page ────────────────────────────────────────────────────────────── */

/**
 * The account holder's profile, as settings with a sidebar: on the left the
 * page's sections; on the right the open one (personal info, with the photo
 * at its top; password; membership; or deleting the account). The sections
 * stay mounted while hidden, so an unsaved draft survives a look at another
 * one. On a narrow screen the sidebar sits on top and its sections become a
 * row of tabs.
 *
 * DEMO: nothing is sent anywhere. Saving waits a moment and keeps the change
 * on this page; a new photo is shown from the file picked, never uploaded.
 */
export function Profile() {
  const [saved, setSaved] = useState(() => pick(profile));
  const [photo, setPhoto] = useState(dashboardUser.avatar);
  const [photoNote, setPhotoNote] = useState(null);
  const hash = useSyncExternalStore(onHash, readHash, noHash);
  const section = SECTIONS.some((s) => s.id === hash) ? hash : SECTIONS[0].id;

  // The preview of a picked photo is an object URL: let it go when replaced.
  useEffect(() => {
    if (typeof photo !== "string") return;
    return () => URL.revokeObjectURL(photo);
  }, [photo]);

  const choosePhoto = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setPhotoNote(
        <Status tone="danger">Choose a PNG, JPG or WebP image.</Status>,
      );
      return;
    }
    if (file.size > MAX_PHOTO) {
      setPhotoNote(<Status tone="danger">That photo is over 5 MB.</Status>);
      return;
    }
    setPhoto(URL.createObjectURL(file));
    setPhotoNote(<Status tone="success">Photo updated</Status>);
  };

  const panels = {
    personal: (
      <DetailsPanel
        saved={saved}
        onSave={setSaved}
        photo={photo}
        onPhoto={choosePhoto}
        photoNote={photoNote}
      />
    ),
    password: <PasswordPanel />,
    membership: <MembershipPanel saved={saved} />,
    delete: <DangerPanel />,
  };

  return (
    <div className="@container">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-4 lg:gap-5 @min-[56rem]:grid-cols-[17.5rem_minmax(0,1fr)]">
        <ProfileSidebar section={section} />

        <div className="min-w-0">
          {SECTIONS.map((item) => (
            <div
              key={item.id}
              id={`profile-panel-${item.id}`}
              role="tabpanel"
              aria-labelledby={`profile-tab-${item.id}`}
              hidden={item.id !== section}
              className="motion-safe:animate-pop-in"
            >
              {panels[item.id]}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
