"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthField, AuthSubmit } from "@/components/auth/AuthField";

/** Where signing in or up lands. */
const HOME = "/dashboard";

/**
 * The sign-in and sign-up form.
 *
 * `mode` is "login" or "register". Registering asks for a name as well and
 * shows the password rule and the terms; logging in offers the
 * forgot-password link. The password's `autoComplete` token differs too, and
 * that matters more than it looks: a browser needs `current-password` to offer
 * a saved credential and `new-password` to offer a generated one.
 *
 * The browser checks the fields before it lets the form submit: a name when
 * registering, an email address, and a password of 8 characters or more.
 *
 * DEMO: there is no account behind it yet. Any details that pass those checks
 * sign in: submitting shows the pending state and goes to the dashboard
 * (replacing this page in the history, so Back does not return to the form).
 * The dashboard is fetched ahead while the form is open, so it opens at once.
 *
 * TODO: Backend — POST /api/auth/{login,register}, and go to the dashboard
 * only once it answers.
 */
export function AuthForm({ mode, submitLabel }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const registering = mode === "register";

  useEffect(() => {
    router.prefetch(HOME);
  }, [router]);

  const submit = (event) => {
    event.preventDefault();
    setPending(true);
    router.replace(HOME);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {registering && (
        <AuthField label="Full name" icon="user" name="name" autoComplete="name" placeholder="Jane Cooper" required />
      )}
      <AuthField
        label="Email address"
        icon="mail"
        type="email"
        name="email"
        autoComplete="email"
        placeholder="jane@company.com"
        required
      />
      <AuthField
        label={registering ? "Create a password" : "Password"}
        icon="lock"
        type="password"
        name="password"
        placeholder={registering ? "Choose a password" : "Enter your password"}
        autoComplete={registering ? "new-password" : "current-password"}
        // A browser will not offer to generate or save a password it thinks is
        // too short to be one.
        minLength={8}
        hint={registering ? "At least 8 characters." : undefined}
        required
      />

      {!registering && (
        <p className="text-right text-[13px]">
          <Link href="/forgot-password" className="text-muted underline-offset-4 hover:text-headline hover:underline dark:text-white/50 dark:hover:text-white">
            Forgot your password?
          </Link>
        </p>
      )}

      <div className="pt-5">
        <AuthSubmit disabled={pending}>{pending ? "One moment…" : submitLabel}</AuthSubmit>
      </div>

      {registering && (
        <p className="pt-2 text-[12px] leading-relaxed text-muted dark:text-white/40">
          By creating an account you agree to our{" "}
          <Link href="/terms-of-service" className="text-content underline underline-offset-2 hover:text-brand dark:text-white/70 dark:hover:text-white">
            terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy-policy" className="text-content underline underline-offset-2 hover:text-brand dark:text-white/70 dark:hover:text-white">
            privacy policy
          </Link>
          .
        </p>
      )}
    </form>
  );
}
