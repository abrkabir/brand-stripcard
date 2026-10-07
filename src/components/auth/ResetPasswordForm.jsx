"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

/** Matches the minimum the register form asks for, so the two cannot disagree. */
const MIN_LENGTH = 8;

/**
 * Set a new password, twice.
 *
 * The match is checked on submit rather than on every keystroke: telling
 * someone the two do not match while they are still typing the second one is
 * noise, not help.
 *
 * The error goes through `Input`'s own `error` prop, so it renders as
 * `.field-error` and turns the control's border red — the same treatment every
 * other invalid field on the site gets.
 *
 * `token` rides along in a hidden field. The server has to be the one that
 * decides whether it is valid; the page only refuses to render the form when
 * there is no token at all, which is the one case it can judge by itself.
 *
 * TODO: Backend — POST /api/auth/reset-password. Verify the token server-side
 * before accepting the password.
 */
export function ResetPasswordForm({ token, submitLabel }) {
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  const submit = (event) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const password = form.get("password");

    if (password !== form.get("confirm")) {
      setError("Both passwords need to match.");
      return;
    }

    setError(null);
    setDone(true);
  };

  if (done) {
    return (
      <div className="mt-8">
        <div className="flex items-start gap-3 rounded-2xl border border-line bg-page p-5">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand text-white">
            <CheckIcon className="size-5" />
          </span>
          <p className="text-[14px] leading-relaxed text-content">
            <span className="font-medium text-headline">Password saved.</span>{" "}
            You can use it to log in now.
          </p>
        </div>

        <Link href="/login" className="btn btn--base btn--block mt-5">
          <span className="btn__label">Log in</span>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-8 space-y-5" noValidate={false}>
      <input type="hidden" name="token" value={token} />

      <Input
        label="New password"
        type="password"
        name="password"
        autoComplete="new-password"
        minLength={MIN_LENGTH}
        hint={`At least ${MIN_LENGTH} characters.`}
        required
      />

      <Input
        label="Confirm new password"
        type="password"
        name="confirm"
        autoComplete="new-password"
        minLength={MIN_LENGTH}
        error={error}
        required
      />

      <Button type="submit" block arrow={false}>
        {submitLabel}
      </Button>
    </form>
  );
}
