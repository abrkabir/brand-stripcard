import { AuthForm } from "@/components/auth/AuthForm";
import { AuthShell } from "@/components/auth/AuthShell";
import { authCopy } from "@/data/auth";

export const metadata = {
  title: "Log in",
  description: "Log in to your StripCard account to manage your virtual cards and payments.",
};

const copy = authCopy.login;

export default function LoginPage() {
  return (
    <AuthShell copy={copy}>
      <AuthForm mode="login" submitLabel={copy.submit} />
    </AuthShell>
  );
}
