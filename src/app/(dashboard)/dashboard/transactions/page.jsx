import { PageHeader } from "@/components/dashboard/PageHeader";
import { TransactionHistory } from "@/components/dashboard/TransactionHistory";

export const metadata = {
  title: "Transactions",
  description: "Every payment, top-up and transfer on your StripCard account.",
  // A private, signed-in page: keep it out of search results.
  robots: { index: false, follow: false },
};

/**
 * Every transaction on the account, as a boxed table with a search and a
 * filter (money in or out, pending, blocked); a row opens its details. The overview only charts
 * the totals; this is where the transactions themselves live. DEMO DATA (see
 * data/dashboard.js).
 */
export default function TransactionsPage() {
  return (
    <>
      <PageHeader
        title="Transactions"
        back={{ href: "/dashboard", label: "Back to dashboard" }}
      />
      <TransactionHistory />
    </>
  );
}
