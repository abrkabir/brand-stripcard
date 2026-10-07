"use client";

import { CheckIcon } from "@/components/icons";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

/**
 * Ask for the email, then say a link is on its way.
 *
 * The confirmation is deliberately vague about whether that address has an
 * account. "If there is an account, a link is on its way" is the same answer
 * either way, which is what stops this form being used to find out who is
 * registered.
 *
 * Unlike the login form this one does show a success state. There is no session
 * to fake here — the honest answer really is "we have sent something" — so it
 * follows the pattern the other forms on the site use rather than stopping at a
 * pending state.
 *
 * TODO: Backend — POST /api/auth/forgot-password.
 */
export function ForgotPasswordForm({ submitLabel }) {
  const [sent, setSent] = useState(false);

  const submit = (event) => {
    event.preventDefault();
    setSent(true);
  };

  if (sent) {
    return (
      <div className="mt-8 flex items-start gap-3 rounded-2xl border border-line bg-page p-5">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand text-white">
          <CheckIcon className="size-5" />
        </span>
        <p className="text-[14px] leading-relaxed text-content">
          <span className="font-medium text-headline">Check your inbox.</span> If
          that address has an Adestate account, a reset link is on its way. The
          link is good for one hour.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-8 space-y-5">
      <Input
        label="Your email"
        type="email"
        name="email"
        autoComplete="email"
        placeholder="you@example.com"
        required
      />

      <Button type="submit" block arrow={false}>
        {submitLabel}
      </Button>
    </form>
  );
}
