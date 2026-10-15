"use client";

import { useSearchParams } from "next/navigation";
import { AuthIntro } from "@/components/auth/AuthIntro";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { Button } from "@/components/ui/Button";

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
        <AuthIntro
          title="That link looks incomplete"
          subtitle="Reset links carry a one-time code and this one has none. Ask for a fresh link and it will work."
        />
        <Button href="/forgot-password" block arrow={false}>
          Send a new link
        </Button>
      </>
    );
  }

  return (
    <>
      <AuthIntro title={copy.title} subtitle={copy.subtitle} />
      <ResetPasswordForm token={token} submitLabel={copy.submit} />
    </>
  );
}
