import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
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
 * `searchParams` is a promise in this version of Next and has to be awaited,
 * the same as `params`.
 *
 * Whether the token is *valid* is the server's call — this page only handles the
 * one case it can judge on its own: no token at all, which means the link was
 * mangled or someone typed the URL. Rendering the form then would let them set a
 * password the backend could only reject.
 */
export default async function ResetPasswordPage({ searchParams }) {
  const { token } = await searchParams;

  return (
    <AuthShell aside={copy.aside}>
      <h1 className="mt-7 font-heading text-[2rem] leading-tight font-medium text-headline">
        {token ? copy.title : "That link looks incomplete"}
      </h1>

      <p className="mt-3 text-[15px] leading-relaxed text-muted">
        {token
          ? copy.subtitle
          : "Reset links carry a one-time code and this one has none. Ask for a fresh link and it will work."}
      </p>

      <hr className="mt-7 border-line" />

      {token ? (
        <ResetPasswordForm token={token} submitLabel={copy.submit} />
      ) : (
        <Link href="/forgot-password" className="btn btn--base btn--block mt-8">
          <span className="btn__label">Send a new link</span>
        </Link>
      )}

      <p className="mt-7 text-center text-[14px] text-muted">
        {copy.altText}{" "}
        <Link href={copy.altHref} className="font-medium text-brand underline">
          {copy.altLabel}
        </Link>
      </p>
    </AuthShell>
  );
}
