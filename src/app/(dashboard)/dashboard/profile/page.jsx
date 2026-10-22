import { PageHeader } from "@/components/dashboard/PageHeader";
import { Profile } from "@/components/dashboard/Profile";

export const metadata = {
  title: "My Profile",
  description: "Your name, contact details, password and account settings.",
  // A private, signed-in page: keep it out of search results.
  robots: { index: false, follow: false },
};

/**
 * The account holder's profile: who they are, their personal details, their
 * password, and a way to delete the account. DEMO: nothing is saved (see
 * Profile).
 */
export default function ProfilePage() {
  return (
    <>
      <PageHeader
        title="My Profile"
        back={{ href: "/dashboard", label: "Back to dashboard" }}
      />
      <Profile />
    </>
  );
}
