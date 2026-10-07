/**
 * The primary navigation. The desktop dropdown and the mobile drawer both
 * render from this array — add a route here and it appears in both, correctly.
 *
 * An item with a `panel` opens a dropdown card under the header; without one
 * it is a plain link. Panels are deliberately shallow: three to four
 * destinations, each with one line of explanation. Anything deeper belongs on
 * the landing page for that section, not in a menu.
 *
 * Every page that opens with a full-bleed hero must pad its own content by
 * `--header-h` from the inside (see `Banner`); every other page starts its
 * first section with the `pt-header` utility. The header floats over both.
 */
export const mainNav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Announcement", href: "/announcements" },
  { label: "Contact", href: "/contact" },
];

/** The header's call to action. Kept beside the nav so both menus share it. */
export const headerCta = { label: "Get Started", href: "/register" };

/** Language switcher options. Wire to real i18n routing when it lands. */
export const locales = [
  { code: "EN", label: "English" },
  { code: "BN", label: "বাংলা" },
  { code: "AR", label: "العربية" },
];
