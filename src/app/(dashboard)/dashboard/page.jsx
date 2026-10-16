import { CoverageCard } from "@/components/dashboard/CoverageCard";
import { MoneyFlowChart } from "@/components/dashboard/MoneyFlowChart";
import { MoneyStats } from "@/components/dashboard/MoneyStats";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { WalletCard } from "@/components/dashboard/WalletCard";
import { dashboardUser } from "@/data/dashboard";

export const metadata = {
  title: "Dashboard",
  description: "Your StripCard balance, cards and recent payments.",
  // A private, signed-in page: keep it out of search results.
  robots: { index: false, follow: false },
};

/**
 * The overview: a greeting (in the top bar from lg up; see PageHeader), then
 * the widgets on a grid.
 *
 *   wide    wallet · stats (two wide)  /  flow (all three)
 *   else    wallet, stats, flow, one under another: the balance first
 *           (the stat cards two to a row, see MoneyStats)
 *
 * `flow` is the chart of money added against money withdrawn with, beside it
 * where there is room (under it where not), where your cards have paid. The
 * transactions themselves are on their own page (see dashboard/transactions).
 *
 * The grid goes by the room beside the sidebar (a container query), not the
 * screen, so opening the full sidebar on a laptop steps it down to two
 * columns instead of squeezing three.
 *
 * The widgets are in that phone order in the markup too, so it is also the
 * reading order for assistive tech.
 *
 * DEMO DATA throughout (see data/dashboard.js); nothing is signed in yet.
 */
export default function DashboardPage() {
  return (
    <>
      <PageHeader title={`Hello, ${dashboardUser.first}`} />

      {/* On large screens the grid fills the window (to a point), so its foot
          lines up with the sidebar's and the bottom row takes the room. */}
      <div className="@container/page lg:flex lg:min-h-[min(calc(100dvh-6.75rem),64rem)] lg:flex-col">
        <div className="grid grid-cols-1 grid-rows-[auto_auto_1fr] gap-4 [grid-template-areas:'wallet'_'stats'_'flow'] lg:flex-1 lg:gap-5 @min-[70rem]:grid-cols-3 @min-[70rem]:grid-rows-[auto_1fr] @min-[70rem]:[grid-template-areas:'wallet_stats_stats'_'flow_flow_flow']">
          <WalletCard className="[grid-area:wallet]" />
          <MoneyStats className="[grid-area:stats]" />
          <div className="@container [grid-area:flow]">
            <div className="grid h-full gap-4 lg:gap-5 @min-[60rem]:grid-cols-[minmax(0,1fr)_minmax(0,1.34fr)]">
              <MoneyFlowChart />
              <CoverageCard />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
