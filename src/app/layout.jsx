import { Anton, Arimo, Inter_Tight, Merriweather_Sans } from "next/font/google";
import "@/styles/globals.css";
import { ScrollCalm } from "@/components/shared/ScrollCalm";
import { ThemeProvider } from "@/lib/theme";
import { themeScript } from "@/lib/theme-script";
import { siteConfig } from "@/lib/site";

/**
 * Every face is self-hosted by next/font at build time — no request ever
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

/** Display — headlines. Variable, so 400–700 ships in one file. */
const displayFont = Arimo({
  variable: "--font-arimo",
  subsets: ["latin"],
  display: "swap",
});

/** Condensed: poster-style capitals for the odd statement title. One weight. */
const condensedFont = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

/** Body copy. Variable, so the whole 100–900 axis ships in one file. */
const bodyFont = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({ children }) {
  // The site is a static export, so the HTML is the same for everyone and
  // carries no theme class. `themeScript` reads the saved choice from the
  // cookie and stamps it before the first paint; with no cookie the CSS
  // follows the OS (see the @custom-variant in styles/variables.css).
  // `suppressHydrationWarning` lets React accept the class the script added.
  return (
    <html
      lang="en"
      className={`${headingFont.variable} ${displayFont.variable} ${condensedFont.variable} ${bodyFont.variable} h-full antialiased`}
      style={{ colorScheme: "light dark" }}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <ThemeProvider>{children}</ThemeProvider>
        <ScrollCalm />
      </body>
    </html>
  );
}
