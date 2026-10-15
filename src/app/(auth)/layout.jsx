/**
 * Chrome for the auth screens: `/login`, `/register`, `/forgot-password`,
 * `/reset-password`.
 *
 * Its own route group, so these pages inherit none of `(main)`'s chrome: no
 * header, no footer. A sign-in box with a full site nav around it invites you
 * to wander off mid-task, and the logo on the panel is already the way back
 * to the homepage.
 *
 * Follows the theme, with the dark one warmed towards the brand; the panel's
 * switch changes it here as it does on the rest of the site.
 * `--auth-radius` is the one corner radius shared by the form panel and every
 * pane of the image shell, so their corners always match.
 * `min-h-dvh` rather than `min-h-screen` so a mobile browser's collapsing
 * toolbar does not leave the panel scrolled off-centre.
 */
export default function AuthLayout({ children }) {
  return (
    <main className="flex min-h-dvh items-center bg-surface p-3 [--auth-radius:1.5rem] sm:p-4 lg:p-5 dark:bg-[#0c0908]">
      {children}
    </main>
  );
}
