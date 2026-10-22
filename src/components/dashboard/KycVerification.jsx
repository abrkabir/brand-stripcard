"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import {
  CountrySelect,
  countryOf,
  FIELD_LABEL,
  Required,
  TextField,
} from "@/components/dashboard/FormField";
import { Panel } from "@/components/dashboard/Panel";
import { Stepper } from "@/components/dashboard/Stepper";
import {
  ID_TYPES,
  MAX_FILE,
  Tip,
  UploadZone,
} from "@/components/dashboard/UploadZone";
import {
  CameraIcon,
  CheckIcon,
  ClockIcon,
  FileIcon,
  getIcon,
  IdCardIcon,
  InfoIcon,
  LockIcon,
  MapPinIcon,
  ScanFaceIcon,
  ShieldIcon,
  SunIcon,
} from "@/components/icons";
import { Flag } from "@/components/shared/Flag";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { dashboardUser, kyc, profile } from "@/data/dashboard";
import { cn } from "@/lib/cn";
import { dobLong, dobProblem, nextDob } from "@/lib/dob";

const HEADING =
  "text-[0.6875rem] font-semibold tracking-[0.12em] text-subtle uppercase";

const STEPS = [
  { id: "details", label: "Your details" },
  { id: "document", label: "ID document" },
  { id: "selfie", label: "Selfie" },
  { id: "review", label: "Review" },
];
const LAST = STEPS.length - 1;

/** How long the demo pretends to send the documents, then to check them, in milliseconds. */
const SEND_MS = 1100;
const CHECK_MS = 6000;

/* ── The flow's parts ────────────────────────────────────────────────────── */

/** A line of the review: what it is, what was given, and a way back to change it. */
function ReviewLine({ label, onEdit, children }) {
  return (
    <div className="flex items-start gap-4 py-3.5">
      <dt className="w-32 shrink-0 text-sm text-muted">{label}</dt>
      <dd className="min-w-0 flex-1 text-sm font-medium text-headline">
        {children}
      </dd>
      <button
        type="button"
        onClick={onEdit}
        className="shrink-0 cursor-pointer rounded-md px-1.5 py-0.5 text-xs font-semibold text-brand transition-colors hover:bg-brand/10 focus-visible:outline-2 focus-visible:outline-brand"
      >
        Edit<span className="sr-only"> {label.toLowerCase()}</span>
      </button>
    </div>
  );
}

/** A photo sent, small, with what it is under it. */
function Thumb({ file, label }) {
  return (
    <figure>
      <div className="relative aspect-[1.6] overflow-hidden rounded-xl bg-canvas ring-1 ring-line">
        {file.type.startsWith("image/") ? (
          <Image
            src={file.url}
            alt=""
            fill
            sizes="10rem"
            className="object-cover"
          />
        ) : (
          <div className="grid size-full place-items-center text-muted">
            <FileIcon className="size-7" />
          </div>
        )}
      </div>
      <figcaption className="mt-1.5 truncate text-xs text-muted">
        {label}
      </figcaption>
    </figure>
  );
}

/* ── After sending ───────────────────────────────────────────────────────── */

const TIMELINE = [
  { label: "Documents sent", text: "Just now" },
  { label: "Checking your documents", text: `Usually ${kyc.review}` },
  { label: "Identity verified", text: "Your new limits go live" },
];

/** How far the check has got: done steps ticked, the one under way pulsing. */
function Timeline({ at }) {
  return (
    <ol className="w-full max-w-xs text-left">
      {TIMELINE.map((item, i) => {
        const done = i < at;
        const now = i === at;
        return (
          <li key={item.label} className="relative flex gap-3 pb-5 last:pb-0">
            {i < TIMELINE.length - 1 && (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-7 bottom-0.5 left-[0.8125rem] w-px transition-colors duration-500",
                  done ? "bg-brand" : "bg-line",
                )}
              />
            )}
            <span
              aria-hidden="true"
              className={cn(
                "relative grid size-[1.625rem] shrink-0 place-items-center rounded-full transition-colors duration-500",
                done
                  ? "bg-brand text-white"
                  : now
                    ? "bg-brand-50 ring-1 ring-brand dark:bg-brand/15"
                    : "bg-canvas",
              )}
            >
              {done ? (
                <CheckIcon className="size-3.5" strokeWidth={2.6} />
              ) : now ? (
                <span className="size-2 rounded-full bg-brand motion-safe:animate-pulse" />
              ) : (
                <span className="size-1.5 rounded-full bg-subtle" />
              )}
            </span>
            <div className="pt-0.5 leading-tight">
              <p
                className={cn(
                  "text-sm font-semibold",
                  done || now ? "text-headline" : "text-muted",
                )}
              >
                {item.label}
                <span className="sr-only">
                  {done ? ", done" : now ? ", under way" : ", still to come"}
                </span>
              </p>
              <p className="mt-1 text-xs text-muted">{item.text}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* ── Beside the flow ─────────────────────────────────────────────────────── */

/** A note with its icon. */
function Note({ icon: Icon, children }) {
  return (
    <li className="flex gap-3">
      <span
        aria-hidden="true"
        className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700 dark:bg-brand/15 dark:text-brand-300"
      >
        <Icon className="size-4" />
      </span>
      <p className="pt-1 text-sm leading-snug text-content">{children}</p>
    </li>
  );
}

/**
 * Beside the flow: the two levels, which one the account is at, what each
 * allows, and what is good to know before starting.
 */
function KycLimits({ status }) {
  const verified = status === "verified";
  const tags = [
    verified ? null : "Your level",
    verified ? "Your level" : status === "review" ? "In review" : "Unlock next",
  ];

  return (
    <Panel
      id="kyc-limits-title"
      title="Your limits"
      subtitle="What verifying unlocks"
      icon={<ShieldIcon className="size-[18px]" />}
    >
      <div className="grid grid-cols-2 gap-3">
        {kyc.levels.map((level, i) => {
          const yours = tags[i] === "Your level";
          return (
            <div
              key={level.id}
              className={cn(
                "rounded-2xl p-4 transition-colors duration-500",
                yours
                  ? "bg-brand-50 ring-1 ring-brand/35 ring-inset dark:bg-brand/12"
                  : "bg-canvas/60",
              )}
            >
              <span
                className={cn(
                  "inline-flex h-5 items-center rounded-full px-2 text-[0.6875rem] font-semibold",
                  yours
                    ? "bg-brand text-white"
                    : tags[i]
                      ? "bg-card text-content ring-1 ring-line ring-inset"
                      : "invisible",
                )}
              >
                {tags[i] ?? "Done"}
              </span>
              <p className="mt-3 font-heading text-xl leading-none font-semibold text-headline">
                {level.name}
              </p>
              <p className="mt-1.5 text-xs leading-snug text-muted">
                {level.text}
              </p>
            </div>
          );
        })}
      </div>

      <table className="mt-5 w-full text-sm">
        <caption className="sr-only">What each level allows</caption>
        <thead>
          <tr>
            <th scope="col" className="sr-only">
              Limit
            </th>
            {kyc.levels.map((level) => (
              <th
                key={level.id}
                scope="col"
                className="pb-2 pl-3 text-right text-xs font-medium text-muted"
              >
                {level.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-dashed divide-line">
          {kyc.limits.map((row) => (
            <tr key={row.label}>
              <th
                scope="row"
                className="py-3 text-left font-normal text-content"
              >
                {row.label}
              </th>
              <td
                className={cn(
                  "py-3 pl-3 text-right whitespace-nowrap tabular-nums",
                  verified ? "text-muted" : "font-semibold text-headline",
                )}
              >
                {row.basic}
              </td>
              <td
                className={cn(
                  "py-3 pl-3 text-right font-semibold whitespace-nowrap tabular-nums",
                  verified
                    ? "text-headline"
                    : "text-brand-700 dark:text-brand-300",
                )}
              >
                {row.verified}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className={cn(HEADING, "mt-6")}>Good to know</h3>
      <ul className="mt-3 space-y-3">
        <Note icon={IdCardIcon}>
          Have a valid passport, driving licence or national ID card to hand.
        </Note>
        <Note icon={ClockIcon}>
          It takes about 3 minutes, and most checks finish in {kyc.review}.
        </Note>
        <Note icon={LockIcon}>
          Your documents are encrypted and used only to confirm who you are.
        </Note>
      </ul>
    </Panel>
  );
}

/* ── The page ────────────────────────────────────────────────────────────── */

/**
 * Verifying the account holder's identity (KYC), a short flow in one card,
 * with the limits it unlocks beside it.
 *
 *   1. Your details   legal name, date of birth and nationality, with the
 *                     home address from the profile
 *   2. ID document    the type of ID, where it was issued, and a photo of
 *                     each side (dropped in or chosen)
 *   3. Selfie         a photo of your face, from the camera on a phone
 *   4. Review         everything given, each with a way back to it, and a
 *                     box to tick before sending
 *
 * Continue checks the step, and puts focus on the first thing to fix. Each
 * step takes focus as it opens. Once sent, the card shows how far the check
 * has got.
 *
 * DEMO: nothing leaves the browser. The photos are only previewed; sending
 * waits a moment, and the check "passes" a few seconds later.
 */
export function KycVerification() {
  const [status, setStatus] = useState(kyc.status);
  const [step, setStep] = useState(0);
  const [details, setDetails] = useState({
    first: profile.first,
    last: profile.last,
    dob: "",
    nationality: profile.country,
  });
  const [docId, setDocId] = useState(kyc.documents[0].id);
  const [issuer, setIssuer] = useState(profile.country);
  const [files, setFiles] = useState({});
  const [selfie, setSelfie] = useState(null);
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const formRef = useRef(null);
  const selfieId = useId();

  const doc = kyc.documents.find((d) => d.id === docId);
  const sideKey = (i) => `${doc.id}-${i}`;
  const country = countryOf(details.nationality);
  const issuedIn = countryOf(issuer);

  // The previews are object URLs: let them all go when the page does. The
  // timers that play out the check stop with it too.
  const made = useRef([]);
  const timers = useRef([]);
  useEffect(() => {
    const urls = made.current;
    const pending = timers.current;
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
      pending.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  // Each step takes focus as it opens, not on first load (compared with
  // what was shown, so an effect run twice cannot fire it).
  const stepRef = useRef(null);
  const shown = useRef(`${status}-${step}`);
  useEffect(() => {
    const now = `${status}-${step}`;
    if (shown.current === now) return;
    shown.current = now;
    stepRef.current?.focus();
  }, [step, status]);

  const keep = (file) => {
    const url = URL.createObjectURL(file);
    made.current.push(url);
    return { name: file.name, size: file.size, type: file.type, url };
  };
  const fail = (key, message) => setErrors((e) => ({ ...e, [key]: message }));
  const clear = (key) => setErrors((e) => ({ ...e, [key]: undefined }));

  const takeFile = (key, file, types) => {
    if (!file) return;
    if (!types.includes(file.type))
      return fail(
        key,
        types.includes("application/pdf")
          ? "Use a PNG, JPG, WebP or PDF file"
          : "Use a PNG, JPG or WebP photo",
      );
    if (file.size > MAX_FILE) return fail(key, "That file is over 10 MB");
    const kept = keep(file);
    if (key === "selfie") setSelfie(kept);
    else setFiles((f) => ({ ...f, [key]: kept }));
    clear(key);
  };
  const dropFile = (key) => {
    setFiles((f) => ({ ...f, [key]: undefined }));
    formRef.current?.elements.namedItem(key)?.focus();
  };

  const set = (key) => (value) => {
    setDetails((d) => ({ ...d, [key]: value }));
    clear(key);
  };

  // The date of birth keeps to its digits, laid out as they come.
  const typeDob = (event) =>
    set("dob")(nextDob(event.target.value, details.dob));

  /** What is wrong in the open step, by the name of the field to fix. */
  const problems = () => {
    const found = {};
    if (step === 0) {
      if (!details.first.trim())
        found.first = "Enter your first name as it is on your ID";
      if (!details.last.trim())
        found.last = "Enter your last name as it is on your ID";
      const dob = dobProblem(details.dob, new Date());
      if (dob) found.dob = dob;
    }
    if (step === 1)
      doc.sides.forEach((side, i) => {
        if (!files[sideKey(i)])
          found[sideKey(i)] = `Add the ${side.toLowerCase()}`;
      });
    if (step === 2 && !selfie) found.selfie = "Take or choose a selfie";
    if (step === 3 && !agree) found.agree = "Tick the box to confirm";
    return found;
  };

  const go = (to) => {
    setErrors({});
    setStep(to);
  };

  const send = () => {
    setBusy(true);
    timers.current.push(
      window.setTimeout(() => {
        setBusy(false);
        setStatus("review");
        timers.current.push(
          window.setTimeout(() => setStatus("verified"), CHECK_MS),
        );
      }, SEND_MS),
    );
  };

  const next = (event) => {
    event.preventDefault();
    const found = problems();
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      formRef.current?.elements.namedItem(first)?.focus();
      return;
    }
    if (step < LAST) setStep(step + 1);
    else send();
  };

  const heads = {
    unverified: {
      title: "Verify your identity",
      subtitle: "About 3 minutes, and your documents stay private",
    },
    review: {
      title: "Verification in review",
      subtitle: "Sent just now",
    },
    verified: {
      title: "Identity verified",
      subtitle: "Your new limits are live",
    },
  };

  const homeLine = [profile.city, `${profile.state} ${profile.zip}`]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="@container">
      <div className="grid gap-4 lg:gap-5 @min-[60rem]:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <Panel
          id="kyc-title"
          icon={<IdCardIcon className="size-[18px]" />}
          {...heads[status]}
        >
          {status === "unverified" ? (
            <form
              ref={formRef}
              onSubmit={next}
              noValidate
              className="flex flex-1 flex-col"
            >
              <Stepper steps={STEPS} at={step} onGo={go} />

              <div
                key={step}
                ref={stepRef}
                tabIndex={-1}
                role="group"
                aria-label={`Step ${step + 1} of ${STEPS.length}, ${STEPS[step].label}`}
                className="mt-6 outline-none motion-safe:animate-pop-in"
              >
                {/* ── 1. Your details ──────────────────────────────────── */}
                {step === 0 && (
                  <>
                    <p className="mb-5 flex items-start gap-2.5 rounded-xl bg-brand-50 px-3.5 py-3 text-sm text-content dark:bg-brand/10">
                      <InfoIcon
                        aria-hidden="true"
                        className="mt-px size-[18px] shrink-0 text-brand"
                      />
                      Enter your name exactly as it is on your ID, middle names
                      too.
                    </p>
                    <div className="grid gap-4 @min-[32rem]:grid-cols-2">
                      <TextField
                        label="First name"
                        required
                        name="first"
                        autoComplete="given-name"
                        value={details.first}
                        onChange={(event) => set("first")(event.target.value)}
                        error={errors.first}
                      />
                      <TextField
                        label="Last name"
                        required
                        name="last"
                        autoComplete="family-name"
                        value={details.last}
                        onChange={(event) => set("last")(event.target.value)}
                        error={errors.last}
                      />
                      <TextField
                        label="Date of birth"
                        required
                        name="dob"
                        inputMode="numeric"
                        autoComplete="off"
                        placeholder="MM / DD / YYYY"
                        value={details.dob}
                        onChange={typeDob}
                        error={errors.dob}
                        inputClassName="tabular-nums"
                      />
                      <CountrySelect
                        label="Nationality"
                        required
                        value={details.nationality}
                        onChange={set("nationality")}
                      />
                    </div>

                    {/* The home address, from the profile. */}
                    <div className="mt-5 flex items-start gap-3 rounded-2xl bg-canvas/60 p-4">
                      <span
                        aria-hidden="true"
                        className="grid size-10 shrink-0 place-items-center rounded-xl bg-card text-headline"
                      >
                        <MapPinIcon className="size-[18px]" />
                      </span>
                      <div className="min-w-0 flex-1 leading-tight">
                        <p className="text-xs text-muted">Home address</p>
                        <p className="mt-1 text-sm font-semibold text-headline">
                          {profile.address}
                        </p>
                        <p className="mt-0.5 text-sm text-content">
                          {homeLine}, {countryOf(profile.country).name}
                        </p>
                      </div>
                      <Link
                        href="/dashboard/profile#personal"
                        className="shrink-0 rounded-md px-1.5 py-0.5 text-xs font-semibold text-brand transition-colors hover:bg-brand/10 focus-visible:outline-2 focus-visible:outline-brand"
                      >
                        Change<span className="sr-only"> home address</span>
                      </Link>
                    </div>
                  </>
                )}

                {/* ── 2. ID document ───────────────────────────────────── */}
                {step === 1 && (
                  <>
                    <fieldset>
                      <legend className={FIELD_LABEL}>
                        Type of ID
                        <Required />
                      </legend>
                      <div className="mt-2 grid gap-2.5 @min-[34rem]:grid-cols-3">
                        {kyc.documents.map((option) => {
                          const Icon = getIcon(option.icon);
                          return (
                            <label
                              key={option.id}
                              className="group relative flex cursor-pointer items-center gap-3 rounded-2xl border border-line bg-canvas/40 p-3 transition-colors hover:border-headline/25 has-checked:border-brand has-checked:bg-brand-50 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-brand dark:has-checked:bg-brand/10"
                            >
                              <input
                                type="radio"
                                name="document"
                                value={option.id}
                                checked={docId === option.id}
                                onChange={() => {
                                  setDocId(option.id);
                                  setErrors({});
                                }}
                                className="sr-only"
                              />
                              <span
                                aria-hidden="true"
                                className="grid size-10 shrink-0 place-items-center rounded-xl bg-card text-headline transition-colors group-has-checked:bg-brand group-has-checked:text-white"
                              >
                                <Icon className="size-[18px]" />
                              </span>
                              <span className="min-w-0 leading-tight">
                                <span className="block text-sm font-semibold text-headline">
                                  {option.label}
                                </span>
                                <span className="mt-1 block text-xs text-muted">
                                  {option.text}
                                </span>
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </fieldset>

                    <CountrySelect
                      label="Issued in"
                      value={issuer}
                      onChange={setIssuer}
                      className="mt-5"
                    />

                    <p className={cn(FIELD_LABEL, "mt-5")}>
                      Photos of your {doc.label.toLowerCase()}
                    </p>
                    <div className="mt-2 grid gap-3 @min-[30rem]:grid-cols-2">
                      {doc.sides.map((side, i) => (
                        <UploadZone
                          key={sideKey(i)}
                          name={sideKey(i)}
                          label={side}
                          ariaLabel={`${side} of your ID`}
                          file={files[sideKey(i)]}
                          error={errors[sideKey(i)]}
                          onFile={(file) =>
                            takeFile(sideKey(i), file, ID_TYPES)
                          }
                          onRemove={() => dropFile(sideKey(i))}
                        />
                      ))}
                      <div
                        className={cn(
                          "rounded-2xl bg-canvas/60 p-4",
                          doc.sides.length > 1
                            ? "@min-[30rem]:col-span-2"
                            : "self-start",
                        )}
                      >
                        <p className={HEADING}>For a quick check</p>
                        <ul
                          className={cn(
                            "mt-3 gap-x-6 gap-y-2.5",
                            doc.sides.length > 1
                              ? "flex flex-col @min-[30rem]:flex-row @min-[30rem]:flex-wrap"
                              : "flex flex-col",
                          )}
                        >
                          <Tip>All four corners in the photo</Tip>
                          <Tip>Sharp, with no glare on it</Tip>
                          <Tip>Still in date</Tip>
                        </ul>
                      </div>
                    </div>
                  </>
                )}

                {/* ── 3. Selfie ────────────────────────────────────────── */}
                {step === 2 && (
                  <div className="grid gap-5 @min-[36rem]:grid-cols-[minmax(0,1fr)_13rem]">
                    <div>
                      <input
                        id={selfieId}
                        name="selfie"
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        capture="user"
                        aria-label="Selfie"
                        aria-invalid={errors.selfie ? true : undefined}
                        aria-describedby={`${selfieId}-note`}
                        className="peer sr-only"
                        onChange={(event) => {
                          takeFile(
                            "selfie",
                            event.target.files?.[0],
                            ID_TYPES.slice(0, 3),
                          );
                          event.target.value = "";
                        }}
                      />
                      <label
                        htmlFor={selfieId}
                        className="relative isolate flex aspect-[4/3] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[1.5rem] bg-hero-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand"
                      >
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 -z-10 bg-[radial-gradient(60%_55%_at_50%_42%,rgb(242_106_27/0.28),rgb(242_106_27/0)_70%)]"
                        />
                        <span
                          className={cn(
                            "relative grid aspect-[3/4] h-[66%] place-items-center overflow-hidden rounded-[50%] border-2 transition-colors",
                            selfie
                              ? "border-brand"
                              : "border-dashed border-white/35",
                          )}
                        >
                          {selfie ? (
                            <Image
                              src={selfie.url}
                              alt="Your selfie, as sent"
                              fill
                              sizes="12rem"
                              className="object-cover"
                            />
                          ) : (
                            <ScanFaceIcon
                              aria-hidden="true"
                              className="size-10 text-white/55"
                            />
                          )}
                        </span>
                        <span className="mt-3 text-xs font-medium text-white/70">
                          {selfie
                            ? "Looking good"
                            : "Fit your face inside the oval"}
                        </span>
                      </label>
                      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                        <label
                          htmlFor={selfieId}
                          className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border border-line bg-card px-4 text-sm font-semibold text-headline transition-colors hover:border-headline/40"
                        >
                          <CameraIcon aria-hidden="true" className="size-4" />
                          {selfie ? "Retake selfie" : "Take a selfie"}
                        </label>
                        <p
                          id={`${selfieId}-note`}
                          className={cn(
                            "text-xs",
                            errors.selfie
                              ? "font-medium text-danger"
                              : "text-muted",
                          )}
                        >
                          {errors.selfie ||
                            "On a computer, choose a recent photo instead"}
                        </p>
                      </div>
                    </div>

                    <div className="self-start rounded-2xl bg-canvas/60 p-4">
                      <p className={HEADING}>For a clear selfie</p>
                      <ul className="mt-3 flex flex-col gap-2.5">
                        <Tip>Soft, even light on your face</Tip>
                        <Tip>Look straight at the camera</Tip>
                        <Tip>No hat, sunglasses or filters</Tip>
                        <Tip>Just you in the photo</Tip>
                      </ul>
                      <p className="mt-4 flex items-start gap-2 border-t border-line pt-4 text-xs leading-relaxed text-muted">
                        <SunIcon
                          aria-hidden="true"
                          className="mt-px size-4 shrink-0"
                        />
                        We match it to the photo on your ID, then delete it.
                      </p>
                    </div>
                  </div>
                )}

                {/* ── 4. Review ────────────────────────────────────────── */}
                {step === 3 && (
                  <>
                    <dl className="divide-y divide-dashed divide-line rounded-2xl border border-line px-4">
                      <ReviewLine label="Legal name" onEdit={() => go(0)}>
                        {details.first.trim()} {details.last.trim()}
                      </ReviewLine>
                      <ReviewLine label="Date of birth" onEdit={() => go(0)}>
                        {dobLong(details.dob)}
                      </ReviewLine>
                      <ReviewLine label="Nationality" onEdit={() => go(0)}>
                        <span className="inline-flex items-center gap-2">
                          <Flag
                            code={country.code}
                            className="size-5 shrink-0 overflow-hidden rounded-full ring-1 ring-line"
                          />
                          {country.name}
                        </span>
                      </ReviewLine>
                      <ReviewLine label="ID" onEdit={() => go(1)}>
                        {doc.label}, issued in {issuedIn.name}
                      </ReviewLine>
                    </dl>

                    <div className="mt-4 grid grid-cols-2 gap-3 @min-[34rem]:grid-cols-3">
                      {doc.sides.map((side, i) => (
                        <Thumb
                          key={sideKey(i)}
                          file={files[sideKey(i)]}
                          label={`${doc.label}, ${side.toLowerCase()}`}
                        />
                      ))}
                      <Thumb file={selfie} label="Selfie" />
                    </div>

                    <div className="mt-5 rounded-2xl bg-canvas/60 p-4">
                      <Checkbox
                        name="agree"
                        checked={agree}
                        onChange={(event) => {
                          setAgree(event.target.checked);
                          clear("agree");
                        }}
                        aria-invalid={errors.agree ? true : undefined}
                        label="I confirm these details are true, and agree to StripCard checking them with its identity partner."
                        className="items-start text-sm leading-snug"
                        inputClassName="mt-px"
                      />
                      {errors.agree && (
                        <p className="mt-2 pl-7 text-xs font-medium text-danger">
                          {errors.agree}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="mt-auto pt-7">
                <div className="flex flex-col-reverse gap-3 border-t border-line pt-5 @min-[30rem]:flex-row @min-[30rem]:items-center @min-[30rem]:justify-between">
                  {step > 0 ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      arrow={false}
                      onClick={() => go(step - 1)}
                      disabled={busy}
                    >
                      Back
                    </Button>
                  ) : (
                    <p className="flex items-center gap-1.5 text-xs text-muted">
                      <LockIcon aria-hidden="true" className="size-3.5" />
                      Encrypted from your device to our checks
                    </p>
                  )}
                  <Button
                    type="submit"
                    size="sm"
                    arrow={step < LAST}
                    disabled={busy}
                    aria-busy={busy || undefined}
                    className="disabled:cursor-wait disabled:opacity-70"
                  >
                    {step < LAST
                      ? "Continue"
                      : busy
                        ? "Sending"
                        : "Send for review"}
                  </Button>
                </div>
              </div>
            </form>
          ) : (
            <div
              ref={stepRef}
              tabIndex={-1}
              role="status"
              className="flex flex-1 flex-col items-center justify-center py-6 text-center outline-none motion-safe:animate-pop-in"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "relative grid size-16 place-items-center rounded-full",
                  status === "verified"
                    ? "bg-success/12 text-success"
                    : "bg-brand-50 text-brand dark:bg-brand/15",
                )}
              >
                {status === "review" && (
                  <span className="absolute inset-0 rounded-full bg-brand/25 motion-safe:animate-ripple-soft" />
                )}
                {status === "verified" ? (
                  <CheckIcon className="size-8" />
                ) : (
                  <ClockIcon className="relative size-7" />
                )}
              </span>
              <p className="mt-5 font-heading text-2xl font-semibold text-headline">
                {status === "verified"
                  ? "You are verified"
                  : "We are checking your documents"}
              </p>
              <p className="mt-2 max-w-sm text-sm text-pretty text-muted">
                {status === "verified"
                  ? "Thank you for helping keep StripCard safe. Your higher limits are ready to use now."
                  : `This usually takes ${kyc.review}. We will email ${dashboardUser.email} when it is done, so feel free to leave this page.`}
              </p>
              <div className="mt-8">
                <Timeline at={status === "verified" ? TIMELINE.length : 1} />
              </div>
              {status === "verified" && (
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Button
                    href="/dashboard"
                    variant="outline"
                    size="sm"
                    arrow={false}
                  >
                    Back to dashboard
                  </Button>
                  <Button href="/dashboard/virtual-card" size="sm">
                    Create a card
                  </Button>
                </div>
              )}
              {status === "review" && (
                <p className="mt-8 text-sm text-muted">
                  You can keep using your account while we check.
                </p>
              )}
            </div>
          )}
        </Panel>

        <KycLimits status={status} />
      </div>
    </div>
  );
}
