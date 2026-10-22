"use client";

import QRCode from "qrcode";
import { useEffect, useId, useRef, useState } from "react";
import { Status } from "@/components/dashboard/FormField";
import { Panel } from "@/components/dashboard/Panel";
import {
  CheckIcon,
  ClockIcon,
  CopyIcon,
  ShieldIcon,
  SmartphoneIcon,
} from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { dashboardUser, security } from "@/data/dashboard";
import { cn } from "@/lib/cn";

/** How long the demo pretends to check the code, in milliseconds. */
const SAVE_MS = 800;

const DIGITS = 6;
const EMPTY_CODE = Array(DIGITS).fill("");

/**
 * The link an authenticator app is set up from, and its QR code as one SVG
 * path, a unit per module (each row's dark runs drawn as one rectangle).
 */
const OTP_URI = `otpauth://totp/${encodeURIComponent(`${security.issuer}:${dashboardUser.email}`)}?secret=${security.secret}&issuer=${encodeURIComponent(security.issuer)}&digits=${DIGITS}&period=30`;
const QR = (() => {
  const { size, data } = QRCode.create(OTP_URI, {
    errorCorrectionLevel: "M",
  }).modules;
  let d = "";
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if (!data[y * size + x]) continue;
      let run = 1;
      while (x + run < size && data[y * size + x + run]) run += 1;
      d += `M${x} ${y}h${run}v1h-${run}z`;
      x += run;
    }
  }
  return { size, d };
})();

/** The key, in groups of four, as people copy it by hand. */
const SECRET_GROUPS = security.secret.match(/.{1,4}/g).join(" ");

/**
 * Six boxes for a six-digit code, one digit each. Typing moves on to the
 * next box; Backspace in an empty box goes back one; the arrow keys move
 * between them; pasting (or the phone filling in the code) fills them all.
 */
function CodeInput({ value, onChange, invalid, labelledBy, describedBy }) {
  const boxes = useRef([]);
  const focus = (i) =>
    boxes.current[Math.max(0, Math.min(DIGITS - 1, i))]?.focus();

  const put = (i, text) => {
    let digits = text.replace(/\D/g, "");
    // Typed into a filled box without selecting it: keep the new digit.
    if (digits.length === 2 && value[i])
      digits = digits[0] === value[i] ? digits[1] : digits[0];
    const next = [...value];
    if (!digits) {
      next[i] = "";
      onChange(next);
      return;
    }
    [...digits].slice(0, DIGITS - i).forEach((digit, k) => {
      next[i + k] = digit;
    });
    onChange(next);
    focus(i + digits.length);
  };

  return (
    <div
      role="group"
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      className="grid max-w-[22rem] grid-cols-6 gap-2"
    >
      {value.map((digit, i) => (
        <input
          key={i}
          ref={(el) => {
            boxes.current[i] = el;
          }}
          value={digit}
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          aria-label={`Digit ${i + 1} of ${DIGITS}`}
          aria-invalid={invalid || undefined}
          onFocus={(event) => event.target.select()}
          onChange={(event) => put(i, event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Backspace" && !digit && i > 0) {
              event.preventDefault();
              const next = [...value];
              next[i - 1] = "";
              onChange(next);
              focus(i - 1);
            } else if (event.key === "ArrowLeft") {
              event.preventDefault();
              focus(i - 1);
            } else if (event.key === "ArrowRight") {
              event.preventDefault();
              focus(i + 1);
            }
          }}
          className={cn(
            "h-12 w-full min-w-0 rounded-xl border bg-canvas/60 text-center font-heading text-xl font-semibold text-headline tabular-nums outline-none transition-[border-color,background-color,box-shadow] focus:border-brand focus:bg-card focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-brand)_14%,transparent)]",
            invalid
              ? "border-danger"
              : digit
                ? "border-headline/30"
                : "border-line",
          )}
        />
      ))}
    </div>
  );
}

/** A numbered step of the setup. */
function SetupStep({ n, title, children }) {
  return (
    <li className="flex gap-3">
      <span
        aria-hidden="true"
        className="grid size-6 shrink-0 place-items-center rounded-full bg-headline text-xs font-semibold text-page tabular-nums"
      >
        {n}
      </span>
      <div className="min-w-0 flex-1">
        {title}
        {children}
      </div>
    </li>
  );
}

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
 * Two-factor sign-in with an authenticator app. Off, the card sets it up:
 * scan the QR code (or type the key in), then enter the code the app shows
 * and turn it on. On, it says so, with a way to turn it off. Beside it, a
 * few notes on how it works.
 *
 * DEMO: nothing is sent anywhere. Any six digits pass as the app's code.
 */
export function TwoFactorSecurity() {
  const id = useId();
  const [on, setOn] = useState(false);
  const [code, setCode] = useState(EMPTY_CODE);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [note, setNote] = useState(null);
  const formRef = useRef(null);

  // The card's body takes focus when it changes over, not on first load
  // (compared with what was shown, so an effect run twice cannot fire it).
  const bodyRef = useRef(null);
  const shown = useRef(on);
  useEffect(() => {
    if (shown.current === on) return;
    shown.current = on;
    bodyRef.current?.focus();
  }, [on]);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(security.secret);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const turnOn = (event) => {
    event.preventDefault();
    const missing = code.findIndex((digit) => !digit);
    if (missing !== -1) {
      setError(`Enter all ${DIGITS} digits from the app`);
      formRef.current?.querySelectorAll("input")[missing]?.focus();
      return;
    }
    setBusy(true);
    window.setTimeout(() => {
      setBusy(false);
      setCode(EMPTY_CODE);
      setNote(null);
      setOn(true);
    }, SAVE_MS);
  };

  const turnOff = () => {
    setOn(false);
    setNote("Two-factor sign-in is off. Set it up again any time.");
  };

  return (
    <div className="@container">
      <div className="grid gap-4 lg:gap-5 @min-[60rem]:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <Panel
          id="tfa-title"
          title="Two-factor sign-in"
          subtitle={
            on
              ? "On, with your authenticator app"
              : "Off, only your password protects your account"
          }
          icon={<ShieldIcon className="size-[18px]" />}
        >
          <div
            key={String(on)}
            ref={bodyRef}
            tabIndex={-1}
            className="flex flex-1 flex-col outline-none motion-safe:animate-pop-in"
          >
            {on ? (
              <div
                role="status"
                className="flex flex-1 flex-col items-center justify-center py-8 text-center"
              >
                <span
                  aria-hidden="true"
                  className="grid size-16 place-items-center rounded-full bg-success/12 text-success"
                >
                  <CheckIcon className="size-8" />
                </span>
                <p className="mt-5 font-heading text-2xl font-semibold text-headline">
                  Two-factor sign-in is on
                </p>
                <p className="mt-2 max-w-sm text-sm text-pretty text-muted">
                  Each time you sign in on a new device, we ask for the code
                  from your authenticator app.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  arrow={false}
                  onClick={turnOff}
                  className="mt-8"
                >
                  Turn off
                </Button>
              </div>
            ) : (
              <form
                ref={formRef}
                onSubmit={turnOn}
                noValidate
                className="flex flex-1 flex-col"
              >
                <div className="flex items-start gap-3 rounded-2xl bg-brand-50 p-4 ring-1 ring-brand/20 ring-inset dark:bg-brand/10">
                  <span
                    aria-hidden="true"
                    className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand text-white"
                  >
                    <ShieldIcon className="size-[18px]" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-headline">
                      Add a second lock to your account
                    </p>
                    <p className="mt-1 text-sm leading-snug text-content">
                      With two-factor sign-in a stolen password is not enough.
                      We also ask for a code from your phone.
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-6 @min-[38rem]:grid-cols-[auto_minmax(0,1fr)] @min-[38rem]:gap-8">
                  {/* The code to scan: dark on white whatever the theme, so every camera reads it. */}
                  <div className="flex justify-center @min-[38rem]:block">
                    <div className="rounded-2xl bg-white p-3 shadow-soft ring-1 ring-line">
                      <svg
                        role="img"
                        aria-label="QR code that adds StripCard to your authenticator app"
                        viewBox={`0 0 ${QR.size} ${QR.size}`}
                        shapeRendering="crispEdges"
                        className="size-40"
                      >
                        <path d={QR.d} className="fill-hero-ink" />
                      </svg>
                    </div>
                  </div>

                  <ol className="flex flex-col gap-6">
                    <SetupStep
                      n={1}
                      title={
                        <p className="text-sm font-semibold text-headline">
                          Scan the code with your app
                        </p>
                      }
                    >
                      <p className="mt-1 text-sm text-muted">
                        Open your authenticator app, tap add, and point your
                        camera at the code. Cannot scan it? Type in this key.
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <code className="rounded-lg bg-canvas/60 px-3 py-1.5 font-mono text-sm font-semibold tracking-[0.08em] text-headline ring-1 ring-line ring-inset">
                          {SECRET_GROUPS}
                        </code>
                        <button
                          type="button"
                          onClick={copy}
                          className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-brand transition-colors hover:bg-brand/10 focus-visible:outline-2 focus-visible:outline-brand"
                        >
                          {copied ? (
                            <CheckIcon
                              aria-hidden="true"
                              className="size-3.5"
                            />
                          ) : (
                            <CopyIcon aria-hidden="true" className="size-3.5" />
                          )}
                          {copied ? "Copied" : "Copy key"}
                        </button>
                      </div>
                    </SetupStep>

                    <SetupStep
                      n={2}
                      title={
                        <p
                          id={`${id}-label`}
                          className="text-sm font-semibold text-headline"
                        >
                          Enter the {DIGITS}-digit code it shows
                        </p>
                      }
                    >
                      <div className="mt-3">
                        <CodeInput
                          value={code}
                          onChange={(next) => {
                            setCode(next);
                            setError(null);
                          }}
                          invalid={Boolean(error)}
                          labelledBy={`${id}-label`}
                          describedBy={`${id}-note`}
                        />
                      </div>
                      <p
                        id={`${id}-note`}
                        className={cn(
                          "mt-2 text-xs",
                          error ? "font-medium text-danger" : "text-muted",
                        )}
                      >
                        {error || "A new code shows every 30 seconds"}
                      </p>
                    </SetupStep>
                  </ol>
                </div>

                <div className="mt-auto pt-7">
                  <div className="flex flex-col-reverse gap-3 border-t border-line pt-5 @min-[30rem]:flex-row @min-[30rem]:items-center @min-[30rem]:justify-between">
                    <div className="min-h-5">
                      {note && <Status>{note}</Status>}
                    </div>
                    <Button
                      type="submit"
                      size="sm"
                      arrow={false}
                      disabled={busy}
                      aria-busy={busy || undefined}
                      className="disabled:cursor-wait disabled:opacity-70"
                    >
                      {busy ? "Checking the code" : "Turn on"}
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </Panel>

        <Panel
          id="tfa-info-title"
          title="How it works"
          subtitle="Good to know before you start"
        >
          <ul className="space-y-4">
            <Note icon={SmartphoneIcon}>
              Use any authenticator app, like Google Authenticator, 1Password or
              Authy.
            </Note>
            <Note icon={ClockIcon}>
              The app shows a new code every 30 seconds, and works without a
              signal.
            </Note>
            <Note icon={ShieldIcon}>
              With it on, a stolen password alone cannot open your account.
            </Note>
          </ul>
        </Panel>
      </div>
    </div>
  );
}
