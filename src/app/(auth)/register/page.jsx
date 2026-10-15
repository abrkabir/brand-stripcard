import { AuthForm } from "@/components/auth/AuthForm";
import { AuthShell } from "@/components/auth/AuthShell";
import { authCopy } from "@/data/auth";

export const metadata = {
  title: "Create an account",
  description: "Sign up for StripCard and create your first virtual card in seconds.",
};

const copy = authCopy.register;

export default function RegisterPage() {
  return (
    <AuthShell copy={copy}>
      <AuthForm mode="register" submitLabel={copy.submit} />
    </AuthShell>
  );
}
