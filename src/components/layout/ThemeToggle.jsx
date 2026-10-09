"use client";

import { MoonIcon, SunIcon } from "@/components/icons";
import { cn } from "@/lib/cn";
import { useTheme } from "@/lib/theme";

/**
 * Light / dark switch in the header rail.
 *
 * Colours come from semantic tokens, so it follows the theme. Over the hero
 * the header passes a white override through `className` — twMerge lets the
 * caller win.
 *
 * Both icons stay mounted and cross-fade, so the button never reflows. The
 * provider hydrates with the same theme the static HTML was built with, then
 * swaps in the saved one, so there is nothing to hydrate-mismatch.
 */
export function ThemeToggle({ className }) {
  const { theme, toggleTheme } = useTheme();
  const dark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={dark}
      className={cn(
        "relative grid size-6 place-items-center text-muted transition-colors hover:text-headline",
        className,
      )}
    >
      <SunIcon
        className={cn(
          "absolute size-[18px] transition-all duration-300",
          dark ? "scale-50 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100",
        )}
      />
      <MoonIcon
        className={cn(
          "absolute size-[18px] transition-all duration-300",
          dark ? "scale-100 rotate-0 opacity-100" : "scale-50 -rotate-90 opacity-0",
        )}
      />
    </button>
  );
}
