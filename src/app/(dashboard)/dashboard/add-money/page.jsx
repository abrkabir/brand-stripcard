import { AddMoney } from "@/components/dashboard/AddMoney";
import { PageHeader } from "@/components/dashboard/PageHeader";

export const metadata = {
  title: "Add Money",
  description: "Top up your StripCard wallet by card, wallet or bank transfer.",
  // A private, signed-in page: keep it out of search results.
  robots: { index: false, follow: false },
};

/**
 * Adding money to the wallet: the details, a review, then done, with your
 * limits and a few notes beside. DEMO: nothing is charged (see AddMoney).
 */
export default function AddMoneyPage() {
  return (
    <>
      <PageHeader title="Add Money" back={{ href: "/dashboard", label: "Back to dashboard" }} />
      <AddMoney />
    </>
  );
}
