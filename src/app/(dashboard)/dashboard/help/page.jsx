import { HelpCenter } from "@/components/dashboard/HelpCenter";
import { PageHeader } from "@/components/dashboard/PageHeader";

export const metadata = {
  title: "Help",
  description: "Your support tickets, and a direct line to our team.",
  // A private, signed-in page: keep it out of search results.
  robots: { index: false, follow: false },
};

/**
 * Support: the account's tickets, and the ways to reach the team. DEMO:
 * nothing is sent (see HelpCenter).
 */
export default function HelpPage() {
  return (
    <>
      <PageHeader
        title="Help"
        back={{ href: "/dashboard", label: "Back to dashboard" }}
      />
      <HelpCenter />
    </>
  );
}
