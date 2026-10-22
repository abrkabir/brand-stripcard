import { PageHeader } from "@/components/dashboard/PageHeader";
import { WithdrawMoney } from "@/components/dashboard/WithdrawMoney";

export const metadata = {
  title: "Withdraw Money",
  description: "Move money from your balance back to your bank.",
  // A private, signed-in page: keep it out of search results.
  robots: { index: false, follow: false },
};

/**
 * Withdrawing money to a linked bank account: the details, a review, then done, with your limits beside. DEMO: nothing is sent (see WithdrawMoney).
 */
export default function WithdrawMoneyPage() {
  return (
    <>
      <PageHeader
        title="Withdraw Money"
        back={{ href: "/dashboard", label: "Back to dashboard" }}
      />
      <WithdrawMoney />
    </>
  );
}
