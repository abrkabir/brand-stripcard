/**
 * The "get the app" section on the homepage. `AppSection` renders straight
 * from this.
 *
 * Each store gets a scan card with a QR code built from its `href`, so the
 * codes always match the links. Until the app is published these point at
 * the store home pages — replace them with the real listing URLs.
 *
 * `rating` is shown beside each store once it is filled in, e.g.
 * `{ score: "4.8", reviews: "152K" }`. Leave it null until there are real
 * reviews to quote.
 */
export const appPromo = {
  title: "Manage your money anywhere",
  scanLabel: "Scan to get App",
  viewLabel: "Click & View QR",
  stores: [
    {
      name: "App Store",
      icon: "apple",
      badge: { small: "Download on the", large: "App Store" },
      href: "https://apps.apple.com/",
      rating: null,
    },
    {
      name: "Google Play",
      icon: "googlePlay",
      badge: { small: "Get it on", large: "Google Play" },
      href: "https://play.google.com/store/apps",
      rating: null,
    },
  ],
  /**
   * `app-mockup.png`, re-branded: caption cropped, scaled up 2x, a StripCard
   * home screen drawn and perspective-fitted onto the phone, and the faded
   * lettering behind it cleared. The originals stay beside it.
   */
  image: {
    src: "/images/assets/app/app-mockup-stripcard.webp",
    alt: "A hand holding a phone with the StripCard app open, showing a balance, an orange virtual card and recent payments",
  },
};
