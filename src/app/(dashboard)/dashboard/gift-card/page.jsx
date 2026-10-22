import { PageHeader } from "@/components/dashboard/PageHeader";
import { GiftCards } from "@/components/dashboard/GiftCards";

export const metadata = {
  title: "Gift Card",
  description: "Buy and send gift cards for hundreds of brands.",
  // A private, signed-in page: keep it out of search results.
  robots: { index: false, follow: false },
};

/**
 * The gift cards held, and a shop to buy more, for you or as a gift. DEMO: nothing is bought (see GiftCards).
 */
export default function GiftCardsPage() {
  return (
    <>
      <PageHeader
        title="Gift Card"
        back={{ href: "/dashboard", label: "Back to dashboard" }}
      />
      <GiftCards />
    </>
  );
}
