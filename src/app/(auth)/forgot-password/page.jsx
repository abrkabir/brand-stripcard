import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { authCopy } from "@/data/auth";

export const metadata = {
  title: "Reset your password",
  description: "Send yourself a link to set a new Adestate password.",
};

const copy = authCopy.forgotPassword;

export default function ForgotPasswordPage() {
  return (
    <AuthShell aside={copy.aside}>
      <h1 className="mt-7 font-heading text-[2rem] leading-tight font-medium text-headline">
        {copy.title}
      </h1>

      <p className="mt-3 text-[15px] leading-relaxed text-muted">
        {copy.subtitle}
      </p>

      <hr className="mt-7 border-line" />

      <ForgotPasswordForm submitLabel={copy.submit} />

      <p className="mt-7 text-center text-[14px] text-muted">
        {copy.altText}{" "}
        <Link href={copy.altHref} className="font-medium text-brand underline">
          {copy.altLabel}
        </Link>
      </p>
    </AuthShell>
  );
}
