import { PageHeader } from "@/components/dashboard/PageHeader";
import { TransferMoney } from "@/components/dashboard/TransferMoney";

export const metadata = {
  title: "Transfer Money",
  description: "Send money to another StripCard user or a bank account.",
  // A private, signed-in page: keep it out of search results.
  robots: { index: false, follow: false },
};

/**
 * Sending money to a StripCard user or a bank account: the details, a review, then done, with your limits and recent transfers beside. DEMO: nothing is sent (see TransferMoney).
 */
export default function TransferMoneyPage() {
  return (
    <>
      <PageHeader
        title="Transfer Money"
        back={{ href: "/dashboard", label: "Back to dashboard" }}
      />
      <TransferMoney />
    </>
  );
}
