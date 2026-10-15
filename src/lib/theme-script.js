/**
 * Kept out of `theme.jsx` on purpose: that file is a client module, and a
 * Server Component importing a plain value from one gets a client reference
 * rather than the value. The root layout needs the real string.
 */
export const THEME_COOKIE = "stripcard-theme";

/** Matches a saved choice; anything else in the cookie is ignored. */
export const THEME_COOKIE_PATTERN = `(?:^|; )${THEME_COOKIE}=(dark|light)`;

/**
 * Stamps the saved theme on <html> before the first paint. The site is a
 * static export, so no server can read the cookie and bake the class into the
 * HTML; this runs in <head> while the page is still parsing instead. With no
 * cookie it does nothing and the CSS follows the OS (see the @custom-variant
 * in styles/variables.css).
 */
export const themeScript = `(function(){try{var m=document.cookie.match(new RegExp(${JSON.stringify(THEME_COOKIE_PATTERN)}));if(m){var r=document.documentElement;r.classList.add(m[1]);r.style.colorScheme=m[1]}}catch(e){}})()`;
