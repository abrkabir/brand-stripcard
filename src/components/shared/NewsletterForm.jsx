"use client";

import { useState } from "react";
import { ArrowRightIcon, CheckIcon, MailIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

/**
 * The only interactive part of the newsletter band, split out so the
 * surrounding copy stays a Server Component.
 *
 * TODO: Backend — POST /api/newsletter { email }. The optimistic success state
 * below is a placeholder; surface a real error state once the endpoint exists.
 */
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  const submit = (event) => {
    event.preventDefault();
    if (status !== "idle") return;

    setStatus("loading");
    setTimeout(() => setStatus("done"), 700);
  };

  if (status === "done") {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-white">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-brand-800">
          <CheckIcon className="size-5" />
        </span>
        <p className="text-sm">
          <span className="font-semibold">You are on the list.</span> Look out for
          the first digest on Sunday.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="w-full">
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <div className="relative flex-1">
          <MailIcon className="absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-white/50" />
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            aria-label="Email address"
            className={cn(
              "h-13 w-full rounded-full border border-white/20 bg-white/10 pr-4 pl-12",
              "text-sm text-white placeholder:text-white/45",
              "outline-none transition-colors focus:border-white/50 focus:bg-white/15",
            )}
          />
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className={cn(
            "group flex h-13 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-7",
            "text-sm font-semibold text-brand-900 transition-all",
            "hover:bg-brand-50 active:scale-[0.98] disabled:opacity-70",
          )}
        >
          {status === "loading" ? "Subscribing…" : "Subscribe"}
          <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      <p className="mt-3 text-[13px] text-white/55">
        One email a week. Unsubscribe in a click.
      </p>
    </form>
  );
}
