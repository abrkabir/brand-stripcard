/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for Cloudflare Pages: `next build` writes plain HTML, CSS
  // and JS to `out/`, and that folder is all Pages has to serve. Anything that
  // needs a server per request (cookies(), searchParams, Server Actions, the
  // image optimizer) is unavailable, so the app reads those in the browser.
  output: "export",

  reactCompiler: true,

  images: {
    // There is no server to resize images on a static host, so `next/image`
    // hands the browser the original file. Keep files in `public/images/`
    // exported at the size they are drawn; remote URLs load directly.
    unoptimized: true,
  },
};

export default nextConfig;
