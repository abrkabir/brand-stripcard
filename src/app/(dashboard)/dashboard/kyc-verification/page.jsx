import { KycVerification } from "@/components/dashboard/KycVerification";
import { PageHeader } from "@/components/dashboard/PageHeader";

export const metadata = {
  title: "KYC Verification",
  description: "Verify your identity to unlock higher limits.",
  // A private, signed-in page: keep it out of search results.
  robots: { index: false, follow: false },
};

/**
 * Verifying the account holder's identity: details, a photo ID and a selfie,
 * then the check, with the limits it unlocks beside. DEMO: nothing is sent
 * (see KycVerification).
 */
export default function KycVerificationPage() {
  return (
    <>
      <PageHeader
        title="KYC Verification"
        back={{ href: "/dashboard", label: "Back to dashboard" }}
      />
      <KycVerification />
    </>
  );
}
