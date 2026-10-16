"use client";

import { useState } from "react";
import { EyeIcon } from "@/components/icons";
import { formatMoney } from "@/lib/format";

/**
 * The balance across your cards, centred: its label, with an eye that hides
 * the figure behind dots (for when someone is looking over your shoulder),
 * and the figure itself, the cents set smaller and lighter.
 */
export function WalletBalance({ amount }) {
  const [hidden, setHidden] = useState(false);
  const [whole, cents] = formatMoney(amount).split(".");

  return (
    <div className="mt-4 text-center">
      <div className="flex items-center justify-center gap-1.5">
        <p className="text-sm font-medium text-content">Total balance</p>
        <button
          type="button"
          onClick={() => setHidden((h) => !h)}
          aria-pressed={hidden}
          aria-label="Hide balance"
          className="grid size-7 cursor-pointer place-items-center rounded-full text-muted transition-colors hover:bg-canvas hover:text-headline focus-visible:outline-2 focus-visible:outline-brand"
        >
          <EyeIcon off={hidden} className="size-4" />
        </button>
      </div>
      <p className="mt-1.5 font-heading text-[2.75rem] leading-none font-semibold tracking-[-0.02em] text-headline tabular-nums">
        {hidden ? (
          <>
            <span aria-hidden="true">$ ••••••</span>
            <span className="sr-only">Hidden</span>
          </>
        ) : (
          <>
            {whole}
            <span className="text-[0.55em] text-subtle">.{cents}</span>
          </>
        )}
      </p>
    </div>
  );
}
