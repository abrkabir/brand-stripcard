/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  images: {
    // Placeholder photography for the hero and mega menus. Every URL is
    // centralised in `src/data/`, so when real assets land in
    // `public/images/properties/` you can swap the data file and delete this
    // block in one go.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
