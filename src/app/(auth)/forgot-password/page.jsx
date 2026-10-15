import { AuthShell } from "@/components/auth/AuthShell";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { authCopy } from "@/data/auth";

export const metadata = {
  title: "Reset your password",
  description: "Send yourself a link to set a new StripCard password.",
};

const copy = authCopy.forgotPassword;

export default function ForgotPasswordPage() {
  return (
    <AuthShell copy={copy}>
      <ForgotPasswordForm submitLabel={copy.submit} />
    </AuthShell>
  );
}
