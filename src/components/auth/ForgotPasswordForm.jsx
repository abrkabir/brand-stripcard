"use client";

import { useState } from "react";
import { AuthField, AuthNotice, AuthSubmit } from "@/components/auth/AuthField";
import { CheckIcon } from "@/components/icons";

/**
 * Ask for the email, then say a link is on its way.
 *
 * The confirmation is deliberately vague about whether that address has an
 * account. "If there is an account, a link is on its way" is the same answer
 * either way, which is what stops this form being used to find out who is
 * registered.
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
      <AuthNotice icon={<CheckIcon className="size-5" />}>
        <span className="font-medium text-headline">Check your inbox.</span> If that address has a
        StripCard account, a reset link is on its way. The link is good for one hour.
      </AuthNotice>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <AuthField
        label="Email address"
        icon="mail"
        type="email"
        name="email"
        autoComplete="email"
        placeholder="jane@company.com"
        required
      />
      <div className="pt-5">
        <AuthSubmit>{submitLabel}</AuthSubmit>
      </div>
    </form>
  );
}
