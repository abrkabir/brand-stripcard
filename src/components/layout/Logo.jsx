import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { siteConfig } from "@/lib/site";

/** Intrinsic size of the source files — both artworks share it. */
const LOGO_W = 1753;
const LOGO_H = 448;

const SRC = {
  /** Dark ink. For light surfaces. */
  dark: "/images/logo/web_logo_dark.png",
  /** White ink. For dark surfaces and photography. */
  light: "/images/logo/web_logo_light.png",
};

/**
 * The wordmark.
 *
 * Two artworks, picked by surface rather than by theme:
 *
 * - `tone="inverse"` — always the white artwork. For the header while it is
 *   transparent over the banner, and for the footer, which is a dark brand
 *   block in *both* themes.
 * - `tone="default"` — follows the theme. Both files are rendered and swapped
 *   with a `dark:` variant rather than read from `useTheme`, so this stays a
 *   Server Component (the footer depends on that) and there is no flash on
 *   first paint.
 *
 * `next/image` serves each one as a WebP at the size it is actually drawn, so
 * shipping both costs a few KB, not the 38KB of the source PNGs.
 */
export function Logo({
  className,
  tone = "default",
  /** Height in Tailwind units. Width follows the aspect ratio. */
  size = "h-9",
}) {
  // `alt` is set on each <Image> rather than here: inside a spread, the
  // a11y lint rule cannot see it and flags every usage.
  const shared = {
    width: LOGO_W,
    height: LOGO_H,
    priority: true,
    // Drawn at ~200px wide at most; this stops the optimiser shipping more.
    sizes: "220px",
  };

  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name} — home`}
      className={cn(
        "inline-flex items-center transition-opacity hover:opacity-80",
        className,
      )}
    >
      {tone === "inverse" ? (
        <Image {...shared} alt="" src={SRC.light} className={cn("w-auto", size)} />
      ) : (
        <>
          <Image
            {...shared}
            alt=""
            src={SRC.dark}
            className={cn("w-auto dark:hidden", size)}
          />
          <Image
            {...shared}
            alt=""
            src={SRC.light}
            className={cn("hidden w-auto dark:block", size)}
          />
        </>
      )}
    </Link>
  );
}
