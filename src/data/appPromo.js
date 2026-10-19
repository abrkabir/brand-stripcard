import phoneCard from "../../public/images/assets/app/phone-card.webp";
import phoneSpending from "../../public/images/assets/app/phone-spending.webp";
import phoneWelcome from "../../public/images/assets/app/phone-welcome.webp";

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
   * front, back right, back left. Each is an image: a transparent render of
   * a phone with its screen, 760 x 1638, in public/images/assets/app. To
   * change a screen, replace its image at the same size. `screen` notes what
   * each shows. Only `phonesLabel` is read out, for the group as a whole.
   */
  phones: [
    { src: phoneWelcome, screen: "Welcome: the cards under floating coins, the card that works anywhere, and Get Started" },
    { src: phoneCard, screen: "My cards: the cards as a carousel, the front one's spend against its limit, and its controls" },
    { src: phoneSpending, screen: "Spending: the month's total, the week by day, and the categories" },
  ],
  phonesLabel:
    "The StripCard app on three phones: the welcome screen, the cards in a carousel with one card's limit and controls, and the month's spending by category",
};
