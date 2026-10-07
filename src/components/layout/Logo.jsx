import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { siteConfig } from "@/lib/site";
import logoDark from "../../../public/images/logo/web_logo_dark.png";
import logoLight from "../../../public/images/logo/web_logo_light.png";
import logoWhite from "../../../public/images/logo/web_logo_white.png";

/**
 * Both are cut from `web_logo.png`, the master artwork, trimmed to the ink and
 * recoloured from the brand scale in styles/variables.css. "Strip" is always
 * the signature orange; "Card" carries the contrast — deep rust on light
 * ground, pale peach on dark — so the two-tone split survives either way.
 * After a rebrand, regenerate these from the master rather than editing them.
 *
 * Imported rather than referenced by path: the build names each file by a hash
 * of its contents, so replacing the artwork under the same file name can never
 * be served stale from the image cache. Width and height come with the import.
 */
const SRC = {
  /** Strip brand-500 #F26A1B + Card brand-800 #913613. For light surfaces. */
  dark: logoDark,
  /** Strip dark-brand #F7782C + Card brand-200 #FFCDAB. For dark surfaces. */
  light: logoLight,
  /** Strip white + Card brand-100 #FFE8D6. For the orange banner. */
  white: logoWhite,
};

/**
 * The wordmark.
 *
 * Two artworks, picked by surface rather than by theme:
 *
 * - `tone="inverse"` — always the light artwork. For the footer, which is a
 *   dark block in *both* themes, and anything else sitting on photography.
 * - `tone="default"` — follows the theme. Both files are rendered and swapped
 *   with a `dark:` variant rather than read from `useTheme`, so this stays a
 *   Server Component (the footer depends on that) and there is no flash on
 *   first paint.
 *
 * `white` lays the white artwork over the default one and crossfades between
 * them, so the header can carry the mark on the orange banner and hand it
 * back to the theme artwork as its own surface slides in underneath.
 *
 * `next/image` serves each one as a WebP at the size it is actually drawn, so
 * shipping both costs a few KB, not the 12KB of each source PNG.
 */
export function Logo({
  className,
  tone = "default",
  /** Height in Tailwind units. Width follows the aspect ratio. */
  size = "h-8",
  /** Default tone only: crossfade to the white artwork. */
  white = false,
}) {
  // `alt` is set on each <Image> rather than here: inside a spread, the
  // a11y lint rule cannot see it and flags every usage.
  const shared = {
    preload: true,
    // Drawn at ~150px wide at most; this stops the optimiser shipping more.
    sizes: "160px",
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
        <span className="relative inline-flex">
          <span
            className={cn(
              "inline-flex transition-opacity duration-500",
              white && "opacity-0",
            )}
          >
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
          </span>
          <Image
            {...shared}
            alt=""
            src={SRC.white}
            className={cn(
              "absolute inset-y-0 left-0 w-auto transition-opacity duration-500",
              white ? "opacity-100" : "opacity-0",
              size,
            )}
          />
        </span>
      )}
    </Link>
  );
}
