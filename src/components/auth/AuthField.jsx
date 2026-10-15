"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

/**
 * The auth screens' own controls: the label above, then a rounded field with
 * an icon and a thin divider before the text. They follow the theme like the
 * rest of the site, with the dark theme warmed to match the auth panel.
 *
 *   icon          user · mail · lock, shown at the field's start
 *   placeholder   an example of what goes in, not a repeat of the label
 *
 * A required field marks its label with an asterisk (hidden from assistive
 * tech, which hears `required` instead). A password field gets a show/hide
 * toggle. `hint` and `error` sit under the field and are tied to it with
 * `aria-describedby`; an error also rings the field in red.
 */
export function AuthField({ label, icon, type = "text", hint, error, className, ...rest }) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const password = type === "password";
  const note = error || hint;
  const Icon = ICONS[icon];

  return (
    <div className={cn("text-left", className)}>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-headline dark:text-white/85">
        {label}
        {rest.required && (
          <span aria-hidden="true" className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>
      <div
        className={cn(
          "flex h-11 items-center rounded-xl bg-elevated ring-1 ring-line transition-[box-shadow,background-color] hover:ring-headline/20 focus-within:ring-2 focus-within:ring-brand/70 focus-within:hover:ring-brand/70",
          "dark:bg-white/[0.04] dark:ring-white/10 dark:hover:ring-white/20 dark:focus-within:bg-white/[0.06]",
          error && "ring-red-500/70 hover:ring-red-500/70 dark:ring-red-400/70",
        )}
      >
        {Icon && (
          <span aria-hidden="true" className="flex shrink-0 items-center gap-3 pl-4 text-muted dark:text-white/50">
            <Icon />
            <span className="h-5 w-px bg-line dark:bg-white/10" />
          </span>
        )}
        <input
          {...rest}
          id={id}
          type={password && visible ? "text" : type}
          aria-invalid={error ? true : undefined}
          aria-describedby={note ? `${id}-note` : undefined}
          className={cn(
            "h-full min-w-0 flex-1 rounded-xl bg-transparent pr-4 text-[0.9375rem] text-headline outline-none placeholder:text-subtle dark:text-white dark:placeholder:text-white/35",
            Icon ? "pl-3" : "pl-4",
            "autofill:shadow-[inset_0_0_0_100px_var(--color-elevated)] autofill:[-webkit-text-fill-color:var(--color-headline)] dark:autofill:shadow-[inset_0_0_0_100px_#1f1916]",
          )}
        />
        {password && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
            className="mr-1 grid size-9 shrink-0 cursor-pointer place-items-center rounded-lg text-subtle transition-colors hover:text-headline focus-visible:outline-2 focus-visible:outline-brand dark:text-white/40 dark:hover:text-white"
          >
            <EyeIcon off={visible} />
          </button>
        )}
      </div>
      {note && (
        <p id={`${id}-note`} className={cn("mt-2 text-[13px]", error ? "text-red-600 dark:text-red-300" : "text-muted dark:text-white/45")}>
          {note}
        </p>
      )}
    </div>
  );
}

/** The field icons: 16px strokes, in the field's muted tone. */
const stroke = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  className: "size-4",
};

const ICONS = {
  user: () => (
    <svg {...stroke}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20.5c1.2-3.6 4.1-5.5 7.5-5.5s6.3 1.9 7.5 5.5" />
    </svg>
  ),
  mail: () => (
    <svg {...stroke}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  ),
  lock: () => (
    <svg {...stroke}>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </svg>
  ),
};

/** The button each auth form ends on: the site's base button, full width,
    without the arrow. */
export function AuthSubmit({ children, ...rest }) {
  return (
    <Button type="submit" block arrow={false} {...rest}>
      {children}
    </Button>
  );
}

/** A confirmation in place of a form once it has done its job. */
export function AuthNotice({ icon, children }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-surface p-5 text-left ring-1 ring-line dark:bg-white/[0.05] dark:ring-white/10">
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand text-white">{icon}</span>
      <p className="text-[14px] leading-relaxed text-content dark:text-white/70">{children}</p>
    </div>
  );
}

function EyeIcon({ off }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="size-[18px]">
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.8" />
      {off && <path d="m4 4 16 16" />}
    </svg>
  );
}
