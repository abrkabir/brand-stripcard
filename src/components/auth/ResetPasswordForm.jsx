"use client";

import { useState } from "react";
import { AuthField, AuthNotice, AuthSubmit } from "@/components/auth/AuthField";
import { CheckIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";

/** Matches the minimum the register form asks for, so the two cannot disagree. */
const MIN_LENGTH = 8;

/**
 * Set a new password, twice.
 *
 * The match is checked on submit rather than on every keystroke: telling
 * someone the two do not match while they are still typing the second one is
 * noise, not help.
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
    if (form.get("password") !== form.get("confirm")) {
      setError("Both passwords need to match.");
      return;
    }
    setError(null);
    setDone(true);
  };

  if (done) {
    return (
      <div className="space-y-5">
        <AuthNotice icon={<CheckIcon className="size-5" />}>
          <span className="font-medium text-headline">Password saved.</span> You can use it to log in now.
        </AuthNotice>
        <Button href="/login" block arrow={false}>
          Log in
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      <AuthField
        label="New password"
        icon="lock"
        type="password"
        placeholder="Choose a new password"
        name="password"
        autoComplete="new-password"
        minLength={MIN_LENGTH}
        hint={`At least ${MIN_LENGTH} characters.`}
        required
      />
      <AuthField
        label="Confirm new password"
        icon="lock"
        type="password"
        placeholder="Type it again"
        name="confirm"
        autoComplete="new-password"
        minLength={MIN_LENGTH}
        error={error}
        required
      />
      <div className="pt-5">
        <AuthSubmit>{submitLabel}</AuthSubmit>
      </div>
    </form>
  );
}
