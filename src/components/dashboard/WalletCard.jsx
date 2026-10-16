import Link from "next/link";
import { WalletBalance } from "@/components/dashboard/WalletBalance";
import { DownloadIcon, PlusIcon, SwapIcon, UploadIcon } from "@/components/icons";
import { wallet } from "@/data/dashboard";
import { cn } from "@/lib/cn";

/** The three ways to move money, under the balance, with the icons the stat cards use. */
const ACTIONS = [
  { label: "Add", href: "/dashboard/add-money", icon: DownloadIcon, name: "Add money" },
  { label: "Transfer", href: "/dashboard/transfer-money", icon: SwapIcon, name: "Transfer money" },
  { label: "Withdraw", href: "/dashboard/withdraw-money", icon: UploadIcon, name: "Withdraw money" },
];

/**
 * Your wallet: its title, then the balance across all your cards, centred
 * (with an eye to hide it), buttons to add, transfer and withdraw money (pills
 * where the panel has room for them, small tiles where it is narrow), and at
 * the foot a dashed button to add a card. A Server Component; only the
 * balance's eye runs in the browser.
 */
export function WalletCard({ className }) {
  return (
    <section
      aria-labelledby="wallet-title"
      className={cn("@container flex flex-col rounded-[1.75rem] bg-card p-5 sm:p-6", className)}
    >
      <h2 id="wallet-title" className="font-heading text-xl leading-tight font-semibold text-headline">
        My Wallet
      </h2>
      <WalletBalance amount={wallet.balance} />

      <ul className="mt-5 grid grid-cols-3 gap-2.5">
        {ACTIONS.map(({ label, href, icon: Icon, name }) => (
          <li key={href}>
            <Link
              href={href}
              aria-label={name}
              className="flex flex-col items-center justify-center gap-1.5 rounded-2xl bg-canvas py-2.5 text-xs font-medium text-headline transition-colors hover:bg-brand-50 hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand dark:hover:bg-brand/15 dark:hover:text-brand-300 @min-[24rem]:h-12 @min-[24rem]:flex-row @min-[24rem]:justify-start @min-[24rem]:gap-2.5 @min-[24rem]:rounded-full @min-[24rem]:py-0 @min-[24rem]:pr-3 @min-[24rem]:pl-1.5 @min-[24rem]:text-sm"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-card text-brand">
                <Icon aria-hidden="true" className="size-4" />
              </span>
              {label}
            </Link>
          </li>
        ))}
      </ul>

      {/* A way to add a card. */}
      <div className="mt-auto pt-6">
        <Link
          href="/dashboard/virtual-card"
          className="flex h-16 items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-brand/30 bg-brand-50/60 text-sm font-semibold text-headline transition-colors hover:border-brand/60 hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand dark:border-brand/40 dark:bg-brand/10 dark:hover:bg-brand/15"
        >
          <span className="grid size-8 place-items-center rounded-lg bg-brand text-white">
            <PlusIcon aria-hidden="true" className="size-4" />
          </span>
          Add new card
        </Link>
      </div>
    </section>
  );
}
