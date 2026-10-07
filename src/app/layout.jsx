import { Merriweather_Sans, Questrial } from "next/font/google";
import { cookies } from "next/headers";
import "@/styles/globals.css";
import { ThemeProvider, THEME_COOKIE } from "@/lib/theme";
import { siteConfig } from "@/lib/site";

/**
 * Both faces are self-hosted by next/font at build time — no request ever
 * reaches Google, and there is no layout shift.
 *
 * Each one only exposes a raw CSS variable named after the family. The
 * semantic tokens the app actually uses — `--font-heading` and `--font-body`,
 * which back the `font-heading` / `font-body` utilities — are composed from
 * these in styles/variables.css, together with their fallback stacks.
 */

/** Headings. Variable font, so the whole 300–800 axis ships in one file. */
const headingFont = Merriweather_Sans({
  variable: "--font-merriweather-sans",
  subsets: ["latin"],
  display: "swap",
});

/** Body copy. Questrial is single-weight, so 400 has to be named. */
const bodyFont = Questrial({
  variable: "--font-questrial",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: siteConfig.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default async function RootLayout({ children }) {
  // Reading the cookie here means the first byte of HTML already carries the
  // right class — no flash, and no render-blocking inline script. When there
  // is no cookie yet we stamp nothing and let the CSS follow the OS instead
  // (see the @custom-variant in styles/variables.css).
  const stored = (await cookies()).get(THEME_COOKIE)?.value;
  const theme = stored === "dark" || stored === "light" ? stored : undefined;

  return (
    <html
      lang="en"
      className={`${headingFont.variable} ${bodyFont.variable} h-full antialiased${theme ? ` ${theme}` : ""}`}
      style={{ colorScheme: theme ?? "light dark" }}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider initialTheme={theme}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
