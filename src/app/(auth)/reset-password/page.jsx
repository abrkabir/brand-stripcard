import Link from "next/link";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import {
  ResetPasswordGate,
  ResetPasswordIntro,
} from "@/components/auth/ResetPasswordGate";
import { authCopy } from "@/data/auth";

export const metadata = {
  title: "Choose a new password",
  description: "Set a new password for your Adestate account.",
  // A reset link is single-use and personal; it has no business in an index.
  robots: { index: false, follow: false },
};

const copy = authCopy.resetPassword;

/**
 * Reached from the emailed link, which carries `?token=…`.
 *
 * The token is read in the browser by `ResetPasswordGate`, which needs a
 * Suspense boundary around it in a static export. The fallback is the heading
 * most visitors will see anyway, so the page does not jump when it resolves.
 */
export default function ResetPasswordPage() {
  return (
    <AuthShell aside={copy.aside}>
      <Suspense
        fallback={<ResetPasswordIntro title={copy.title} subtitle={copy.subtitle} />}
      >
        <ResetPasswordGate copy={copy} />
      </Suspense>

      <p className="mt-7 text-center text-[14px] text-muted">
        {copy.altText}{" "}
        <Link href={copy.altHref} className="font-medium text-brand underline">
          {copy.altLabel}
        </Link>
      </p>
    </AuthShell>
  );
}
