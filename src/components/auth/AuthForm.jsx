"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

/**
 * The email-and-password form, shared by both screens.
 *
 * `mode` is "login" or "register" and only changes three things: the label on
 * the password field, whether the forgot-password link shows, and the
 * `autoComplete` token. That last one matters more than it looks — a browser
 * needs `current-password` to offer a saved credential and `new-password` to
 * offer a generated one, and getting it wrong is the difference between a
 * password manager helping and getting in the way.
 *
 * TODO: Backend — POST /api/auth/{login,register}. Right now submitting shows
 * the pending state and stops; there is nothing to authenticate against, so it
 * deliberately does not pretend to have signed anyone in.
 */
export function AuthForm({ mode, submitLabel }) {
  const [pending, setPending] = useState(false);

  const submit = (event) => {
    event.preventDefault();
    setPending(true);
  };

  const registering = mode === "register";

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

      <div>
        <Input
          label={registering ? "Create a password" : "Password"}
          type="password"
          name="password"
          autoComplete={registering ? "new-password" : "current-password"}
          // A browser will not offer to generate or save a password it thinks is
          // too short to be one, and a server that accepts four characters is
          // worse than one that says so up front.
          minLength={8}
          required
        />

        {registering ? (
          <p className="mt-2 text-[13px] text-muted">
            At least 8 characters.
          </p>
        ) : (
          <p className="mt-2 text-right text-[13px]">
            <Link
              href="/forgot-password"
              className="text-muted underline hover:text-brand"
            >
              Forgot your password?
            </Link>
          </p>
        )}
      </div>

      <Button type="submit" block arrow={false} disabled={pending}>
        {pending ? "One moment…" : submitLabel}
      </Button>

      {registering && (
        <p className="text-center text-[13px] leading-relaxed text-muted">
          By creating an account you agree to our{" "}
          <Link href="/terms-of-service" className="underline hover:text-brand">
            terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy-policy" className="underline hover:text-brand">
            privacy policy
          </Link>
          .
        </p>
      )}
    </form>
  );
}
