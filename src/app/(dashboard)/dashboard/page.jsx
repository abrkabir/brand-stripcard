import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { CardTiles } from "@/components/dashboard/CardTiles";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { RewardsCard } from "@/components/dashboard/RewardsCard";
import { TransactionsTable } from "@/components/dashboard/TransactionsTable";

export const metadata = {
  title: "Dashboard",
  description: "Your StripCard balance, cards and recent payments.",
  // A private, signed-in page: keep it out of search results.
  robots: { index: false, follow: false },
};

/** A section heading, the same size wherever it appears. */
function SectionTitle({ id, children }) {
  return (
    <h2 id={id} className="mb-4 font-heading text-xl font-semibold tracking-[-0.01em] text-headline">
      {children}
    </h2>
  );
}

/**
 * The overview, inside the dashboard shell: the header, then two rows. First
 * the balance and its chart beside the virtual cards; then recent payments
 * beside the rewards offer.
 *
 * DEMO DATA throughout (see data/dashboard.js); nothing is signed in yet.
 */
export default function DashboardPage() {
  return (
    <>
      <DashboardHeader title="Dashboard" />

      <div className="mt-8 grid gap-8 lg:mt-10 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)] xl:gap-6">
        <section aria-labelledby="balance-title" className="flex flex-col">
          <SectionTitle id="balance-title">Balance</SectionTitle>
          <div className="flex-1">
            <BalanceCard />
          </div>
        </section>
        <section aria-labelledby="cards-title" className="flex flex-col">
          <SectionTitle id="cards-title">Your cards</SectionTitle>
          <div className="flex-1">
            <CardTiles />
          </div>
        </section>
      </div>

      <div className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] xl:gap-6">
        <section>
          <TransactionsTable />
        </section>
        <section aria-label="Rewards">
          <RewardsCard />
        </section>
      </div>
    </>
  );
}
