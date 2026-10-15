import Link from "next/link";
import { siGoogle } from "simple-icons";
import { AuthIntro } from "@/components/auth/AuthIntro";
import { AuthShowcase } from "@/components/auth/AuthShowcase";
import { AppleIcon, ArrowRightIcon } from "@/components/icons";
import { Logo } from "@/components/layout/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

/**
 * The frame every auth screen sits in: the form on a dark panel at the left,
 * and the image shell at the right (see AuthShowcase).
 *
 * The panel, top to bottom: a way back to the homepage and the theme switch,
 * then the logo, the screen's title and subtitle, Google and Apple sign-in
 * where the screen offers it, the form (children), and the link to the other
 * screen pinned to the foot. The panel follows the theme; the image shell
 * stays dark in both, as artwork.
 *
 * `intro={false}` leaves the heading to the children, for a screen whose
 * heading depends on state (see ResetPasswordGate).
 *
 * A Server Component; the forms are the client islands.
 */
export function AuthShell({ copy, intro = true, children }) {
  return (
    <div className="grid w-full gap-3 lg:min-h-[calc(100dvh-2.5rem)] lg:grid-cols-[minmax(26rem,0.82fr)_1.18fr]">
      <section className="flex flex-col rounded-(--auth-radius) bg-elevated px-5 py-5 shadow-[0_30px_60px_-40px_rgb(11_16_32/0.25)] ring-1 ring-line sm:px-8 sm:py-7 dark:bg-[#151110] dark:shadow-none dark:ring-white/[0.07]">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full py-1.5 pr-3.5 pl-2.5 text-sm text-muted ring-1 ring-line transition-colors hover:text-headline hover:ring-headline/25 dark:text-white/60 dark:ring-white/10 dark:hover:text-white dark:hover:ring-white/25"
          >
            <ArrowRightIcon className="size-4 rotate-180 transition-transform group-hover:-translate-x-0.5" />
            Back to home
          </Link>
          <ThemeToggle className="size-9 rounded-full ring-1 ring-line hover:bg-headline/[0.05] dark:text-white/60 dark:ring-white/10 dark:hover:bg-white/[0.06] dark:hover:text-white" />
        </div>

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10 text-center">
          <div className="mb-7 flex justify-center">
            <Logo size="h-8" />
          </div>
          {intro && <AuthIntro title={copy.title} subtitle={copy.subtitle} />}
          {copy.social && <SocialSignIn />}
          {children}
        </div>

        <p className="pb-2 text-center font-mono text-xs text-muted dark:text-white/45">
          {copy.altText}{" "}
          <Link
            href={copy.altHref}
            className="ml-1 inline-block rounded-md bg-surface px-2.5 py-1 text-headline ring-1 ring-line transition-colors hover:bg-brand hover:text-white hover:ring-brand dark:bg-white/[0.07] dark:text-white dark:ring-white/10"
          >
            {copy.altLabel}
          </Link>
        </p>
      </section>

      <AuthShowcase />
    </div>
  );
}

/**
 * Google and Apple sign-in, then an "or" before the form.
 *
 * TODO: Backend — wire each button to its OAuth flow. Until then they do
 * nothing, like the forms below them.
 */
function SocialSignIn() {
  const button =
    "grid h-11 w-16 cursor-pointer place-items-center rounded-xl bg-surface text-headline ring-1 ring-line transition-colors hover:bg-headline/[0.06] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand dark:bg-white/[0.06] dark:text-white dark:ring-white/10 dark:hover:bg-white/[0.12]";
  return (
    <div className="mb-6">
      <div className="flex justify-center gap-3">
        <button type="button" aria-label="Continue with Google" className={button}>
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[18px] fill-current">
            <path d={siGoogle.path} />
          </svg>
        </button>
        <button type="button" aria-label="Continue with Apple" className={button}>
          <AppleIcon className="size-5" />
        </button>
      </div>
      <div className="mt-6 flex items-center gap-4 text-xs text-subtle dark:text-white/35">
        <span className="h-px flex-1 bg-line dark:bg-white/10" />
        or
        <span className="h-px flex-1 bg-line dark:bg-white/10" />
      </div>
    </div>
  );
}
