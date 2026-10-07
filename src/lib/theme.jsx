"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";

export const THEME_COOKIE = "adestate-theme";

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

function persist(theme) {
  try {
    localStorage.setItem(THEME_COOKIE, theme);
  } catch {
    /* Private mode blocks storage — the cookie below is what actually matters. */
  }
  // The server reads this cookie in the root layout, so every visit after the
  // first paints the right theme in the very first byte of HTML.
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
 * `initialTheme` is the cookie value read server-side, or `undefined` on a
 * first visit. While it is undefined the OS preference drives the theme — CSS
 * already handles that for the first paint, so there is no flash and no
 * render-blocking inline script.
 */
export function ThemeProvider({ children, initialTheme }) {
  const [chosen, setChosen] = useState(initialTheme ?? null);

  // The OS preference is external mutable state, so it is read through the
  // API built for that. The server snapshot is `false`, matching the
  // cookie-less HTML the server sent.
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

  const setTheme = useCallback((next) => setChosen(next), []);

  const toggleTheme = useCallback(
    () => setChosen(theme === "dark" ? "light" : "dark"),
    [theme],
  );

  return (
    <ThemeContext value={{ theme, chosen, setTheme, toggleTheme }}>
      {children}
    </ThemeContext>
  );
}

export const useTheme = () => useContext(ThemeContext);
