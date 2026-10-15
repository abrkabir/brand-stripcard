/**
 * The title and subtitle at the top of the auth panel. Its own file so both
 * the shell (server) and the reset-password gate (client) can use it.
 */
export function AuthIntro({ title, subtitle }) {
  return (
    <div className="mb-8">
      <h1 className="font-heading text-[clamp(1.75rem,2.6vw,2.25rem)] leading-tight font-medium tracking-[-0.02em] text-headline">
        {title}
      </h1>
      <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted dark:text-white/55">{subtitle}</p>
    </div>
  );
}
