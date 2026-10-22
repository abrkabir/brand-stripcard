import { PageHeader } from "@/components/dashboard/PageHeader";
import { TwoFactorSecurity } from "@/components/dashboard/TwoFactorSecurity";

export const metadata = {
  title: "2FA Security",
  description: "Turn on two-factor sign-in to protect your account.",
  // A private, signed-in page: keep it out of search results.
  robots: { index: false, follow: false },
};

/**
 * Turning two-factor sign-in on with an authenticator app, or off. DEMO:
 * nothing is saved (see TwoFactorSecurity).
 */
export default function TwoFactorSecurityPage() {
  return (
    <>
      <PageHeader
        title="2FA Security"
        back={{ href: "/dashboard", label: "Back to dashboard" }}
      />
      <TwoFactorSecurity />
    </>
  );
}
