"use client";

import { useRef, useState } from "react";
import { AppleIcon, ArrowRightIcon, CloseIcon, GooglePlayIcon } from "@/components/icons";

const STORE_ICONS = { apple: AppleIcon, googlePlay: GooglePlayIcon };

/**
 * The scan cards, and the QR modal they open.
 *
 * Each card is a button: it opens a native `<dialog>` holding that store's
 * code at a size a phone camera picks up from across a desk, with a direct
 * link for anyone already on a phone. The native dialog gives us the focus
 * trap, Escape to close and the inert page behind for free; clicking the
 * backdrop closes it too.
 *
 * `stores` arrive with their QR code already rendered to SVG on the server
 * (see AppSection), so no QR library ships to the browser.
 */
export function AppQrCards({ stores, scanLabel, viewLabel }) {
  const dialogRef = useRef(null);
  const [active, setActive] = useState(null);

  const open = (store) => {
    setActive(store);
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();

  const ActiveIcon = active ? STORE_ICONS[active.icon] : null;

  return (
    <>
      <ul className="mt-12 grid w-full max-w-2xl gap-4 sm:grid-cols-2">
        {stores.map((store) => {
          const Icon = STORE_ICONS[store.icon];
          return (
            <li key={store.name}>
              <button
                type="button"
                onClick={() => open(store)}
                aria-haspopup="dialog"
                className="group flex w-full cursor-pointer items-center justify-between gap-4 rounded-3xl border border-line bg-elevated p-5 text-left transition-[border-color,box-shadow,translate] duration-300 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-soft"
              >
                <span className="min-w-0">
                  <span className="block font-display text-lg font-semibold tracking-[-0.01em] text-headline">
                    {scanLabel}
                  </span>
                  <span className="mt-1 flex items-center gap-1.5 text-xs text-muted">
                    {Icon && <Icon aria-hidden="true" className="size-3.5" />}
                    {store.name}
                  </span>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs text-content transition-colors group-hover:text-brand">
                    {viewLabel}
                    <ArrowRightIcon aria-hidden="true" className="size-3.5 -rotate-45" />
                  </span>
                </span>

                {/* Kept on white in both themes, so it always scans. */}
                <span
                  aria-hidden="true"
                  className="grid size-24 shrink-0 place-items-center rounded-2xl border border-line bg-white p-2.5 [&>svg]:size-full"
                  dangerouslySetInnerHTML={{ __html: store.qr }}
                />
              </button>
            </li>
          );
        })}
      </ul>

      <dialog
        ref={dialogRef}
        aria-labelledby="qr-title"
        onClick={(event) => {
          // A click that lands on the dialog itself, not its panel, is a
          // click on the backdrop.
          if (event.target === event.currentTarget) close();
        }}
        onClose={() => setActive(null)}
        className="m-auto w-[min(26rem,calc(100%-2rem))] overflow-visible bg-transparent p-0 backdrop:bg-black/55 backdrop:backdrop-blur-sm open:animate-fade-up"
      >
        {active && (
          <div className="relative rounded-3xl bg-elevated p-7 text-center shadow-lift sm:p-8">
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute top-4 right-4 grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-surface hover:text-headline"
            >
              <CloseIcon className="size-5" />
            </button>

            <p className="flex items-center justify-center gap-2 text-sm text-muted">
              {ActiveIcon && <ActiveIcon aria-hidden="true" className="size-4 text-headline" />}
              {active.name}
            </p>
            <h3
              id="qr-title"
              className="mt-2 font-display text-2xl font-semibold tracking-[-0.02em] text-headline"
            >
              Scan with your phone
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Point your camera at the code to get StripCard on {active.name}.
            </p>

            <div
              role="img"
              aria-label={`QR code linking to StripCard on ${active.name}`}
              className="mx-auto mt-6 grid size-60 place-items-center rounded-2xl border border-line bg-white p-4 [&>svg]:size-full"
              dangerouslySetInnerHTML={{ __html: active.qr }}
            />

            <a
              href={active.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-brand px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
            >
              Open {active.name}
              <ArrowRightIcon aria-hidden="true" className="size-4 -rotate-45" />
            </a>
          </div>
        )}
      </dialog>
    </>
  );
}
