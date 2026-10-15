import phoneControls from "../../public/images/assets/app/phone-controls.webp";
import phoneHome from "../../public/images/assets/app/phone-home.webp";
import phoneInsights from "../../public/images/assets/app/phone-insights.webp";

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
  /** One string per line; the title always breaks after "money". */
  title: ["Manage your money", "anywhere"],
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
   * The phones beside the copy (see AppPhones), in their starting places:
   * front, back right, back left. Each is a transparent render of a phone
   * with its screen, 760px wide; `screen` notes what each shows. Only
   * `phonesLabel` is read out, for the group as a whole.
   */
  phones: [
    { src: phoneHome, screen: "Home: the balance, an orange virtual card and recent payments" },
    { src: phoneControls, screen: "Card controls: a monthly limit and switches for each card" },
    { src: phoneInsights, screen: "Spending: the month by day and by category, and a blocked charge" },
  ],
  phonesLabel:
    "The StripCard app on three phones: the home screen with a balance and an orange virtual card, card controls with limits and switches, and spending insights",
};
