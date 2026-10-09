"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

/** Heading, line and rule shared by every state of the reset page. */
export function ResetPasswordIntro({ title, subtitle }) {
  return (
    <>
      <h1 className="mt-7 font-heading text-[2rem] leading-tight font-medium text-headline">
        {title}
      </h1>

      <p className="mt-3 text-[15px] leading-relaxed text-muted">{subtitle}</p>

      <hr className="mt-7 border-line" />
    </>
  );
}

/**
 * Reads `?token=…` in the browser. The site is a static export, so there is no
 * server to hand the page its search params; the HTML is built once and the
 * token only exists in the visitor's address bar.
 *
 * Whether the token is *valid* is the backend's call. This only handles the
 * one case it can judge on its own: no token at all, which means the link was
 * mangled or someone typed the URL. Rendering the form then would let them set
 * a password the backend could only reject.
 */
export function ResetPasswordGate({ copy }) {
  const token = useSearchParams().get("token");

  if (!token) {
    return (
      <>
        <ResetPasswordIntro
          title="That link looks incomplete"
          subtitle="Reset links carry a one-time code and this one has none. Ask for a fresh link and it will work."
        />

        <Link href="/forgot-password" className="btn btn--base btn--block mt-8">
          <span className="btn__label">Send a new link</span>
        </Link>
      </>
    );
  }

  return (
    <>
      <ResetPasswordIntro title={copy.title} subtitle={copy.subtitle} />
      <ResetPasswordForm token={token} submitLabel={copy.submit} />
    </>
  );
}
