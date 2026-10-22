import { VirtualCards } from "@/components/dashboard/VirtualCards";

export const metadata = {
  title: "Virtual Card",
  description: "Create, fund and manage your virtual cards.",
  // A private, signed-in page: keep it out of search results.
  robots: { index: false, follow: false },
};

/**
 * The virtual cards, with ways to update the card holder and to make a new
 * card. DEMO: nothing is saved (see VirtualCards).
 */
export default function VirtualCardPage() {
  return <VirtualCards />;
}
