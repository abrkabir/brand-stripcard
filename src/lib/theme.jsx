"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import { THEME_COOKIE, THEME_COOKIE_PATTERN } from "@/lib/theme-script";

/**
 * Context shape: `theme` is the resolved "light" | "dark", `chosen` is the
 * visitor's explicit pick and stays null until they make one — until then the
 * OS preference wins.
 */
const ThemeContext = createContext({
  theme: "light",
  chosen: null,
  setTheme: () => {},
  toggleTheme: () => {},
});

const SCHEME_QUERY = "(prefers-color-scheme: dark)";

function subscribeToScheme(onChange) {
  const query = window.matchMedia(SCHEME_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** The cookie only changes through `setTheme`, which re-renders on its own. */
const subscribeToNothing = () => () => {};

function readStoredTheme() {
  const match = document.cookie.match(new RegExp(THEME_COOKIE_PATTERN));
  return match ? match[1] : null;
}

function persist(theme) {
  // The inline script in the root layout reads this cookie, so every visit
  // after the first paints the right theme before any content shows.
  document.cookie = `${THEME_COOKIE}=${theme};path=/;max-age=31536000;SameSite=Lax`;
}

function apply(theme) {
  const root = document.documentElement;
  // Both classes are stamped, not just `dark`: the CSS falls back to the OS
  // preference while neither is present, and an explicit `.light` is what
  // switches that fallback off. See the @custom-variant in styles/variables.css.
  root.classList.toggle("dark", theme === "dark");
  root.classList.toggle("light", theme === "light");
  root.style.colorScheme = theme;
}

/**
 * The static HTML carries no theme, so both the saved cookie and the OS
 * preference are read through `useSyncExternalStore`. Their server snapshots
 * (`null` and `false`) match that HTML, which keeps hydration clean, and React
 * re-renders with the real values straight after.
 */
export function ThemeProvider({ children }) {
  const stored = useSyncExternalStore(
    subscribeToNothing,
    readStoredTheme,
    () => null,
  );
  const [picked, setPicked] = useState(null);
  const chosen = picked ?? stored;

  const systemDark = useSyncExternalStore(
    subscribeToScheme,
    () => window.matchMedia(SCHEME_QUERY).matches,
    () => false,
  );

  const theme = chosen ?? (systemDark ? "dark" : "light");

  // Sync the resolved theme out to the DOM and the cookie. Writing to external
  // systems is exactly what an effect is for — no state is set here.
  useEffect(() => {
    if (!chosen) return;
    apply(theme);
    persist(theme);
  }, [theme, chosen]);

  const setTheme = useCallback((next) => setPicked(next), []);

  const toggleTheme = useCallback(
    () => setPicked(theme === "dark" ? "light" : "dark"),
    [theme],
  );

  return (
    <ThemeContext value={{ theme, chosen, setTheme, toggleTheme }}>
      {children}
    </ThemeContext>
  );
}

export const useTheme = () => useContext(ThemeContext);
