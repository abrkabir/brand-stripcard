"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { Modal } from "@/components/dashboard/Modal";
import { LogOutIcon } from "@/components/icons";

/** Where logging out lands. */
const LOGIN = "/login";

/**
 * Asking before logging out, in a modal: a log-out mark on a soft red ground,
 * "Log out?", what it means, and two equal buttons, Cancel and Log out (in
 * red). Cancel, Escape or a click on the dimmed page closes it, and focus
 * goes back to the button that opened it; Cancel takes focus first, so a
 * stray Enter does not log anyone out. Log out goes to the login page,
 * replacing the dashboard in the history so Back does not return to it.
 * Mount it only while it is open.
 *
 * DEMO: there is no session to end; it only leaves for the login page.
 */
export function LogoutDialog({ onClose }) {
  const id = useId();
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    router.prefetch(LOGIN);
  }, [router]);

  return (
    <Modal
      labelledBy={`${id}-title`}
      onClose={onClose}
      className="w-[min(26rem,calc(100vw-2rem))]"
    >
      {(close) => (
        <div
          role="alertdialog"
          aria-labelledby={`${id}-title`}
          aria-describedby={`${id}-text`}
          className="px-6 pt-8 pb-6 text-center sm:px-7"
        >
          <span
            aria-hidden="true"
            className="mx-auto grid size-14 place-items-center rounded-full bg-danger/10 text-danger"
          >
            <LogOutIcon className="size-6" />
          </span>
          <h2
            id={`${id}-title`}
            className="mt-5 font-heading text-2xl leading-tight font-semibold text-headline"
          >
            Log out?
          </h2>
          <p id={`${id}-text`} className="mt-2 text-sm text-pretty text-muted">
            You&apos;ll need to sign in again to access your account.
          </p>
          <div className="mt-7 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={close}
              disabled={leaving}
              className="h-12 cursor-pointer rounded-full bg-canvas text-sm font-semibold text-headline transition-colors hover:bg-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                setLeaving(true);
                router.replace(LOGIN);
              }}
              disabled={leaving}
              aria-busy={leaving || undefined}
              className="h-12 cursor-pointer rounded-full bg-danger-solid text-sm font-semibold text-white transition-[background-color,opacity] hover:bg-danger-solid/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger disabled:cursor-wait disabled:opacity-80"
            >
              {leaving ? "Logging out" : "Log out"}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
