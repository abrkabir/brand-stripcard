/**
 * Chrome for the auth screens: `/login`, `/register`.
 *
 * Its own route group, so these pages inherit none of `(main)`'s chrome — no
 * header, no newsletter, no footer. A sign-in box with a full site nav around it
 * invites you to wander off mid-task, and the wordmark inside the card is
 * already the way back to the homepage.
 *
 * The surround is `bg-brand-950` rather than the near-black `bg-shader-ink`.
 * On the light theme either works — a near-white card against either is over
 * 15:1. On the dark theme the card is `bg-surface` (#0f0f0f), and against
 * near-black that is 1.06:1: the card all but disappears. Neither dark value
 * separates them by luminance, so the navy does it by hue instead, and the
 * card's own `border-line` draws the edge.
 * `min-h-dvh` rather than `min-h-screen` so a mobile browser's collapsing
 * toolbar does not leave the card scrolled off-centre.
 */
export default function AuthLayout({ children }) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-brand-950 px-4 py-10 sm:px-8">
      {children}
    </main>
  );
}
