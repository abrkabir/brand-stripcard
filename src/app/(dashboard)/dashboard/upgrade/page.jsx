import { PageHeader } from "@/components/dashboard/PageHeader";
import { PremiumPlans } from "@/components/dashboard/PremiumPlans";

export const metadata = {
  title: "Premium plan",
  description: "Higher limits, more cards and priority support.",
  // A private, signed-in page: keep it out of search results.
  robots: { index: false, follow: false },
};

/**
 * The plans, side by side, and a way to change plan. DEMO: nothing is
 * charged (see PremiumPlans).
 */
export default function UpgradePage() {
  return (
    <>
      <PageHeader
        title="Premium plan"
        back={{ href: "/dashboard", label: "Back to dashboard" }}
      />
      <PremiumPlans />
    </>
  );
}
