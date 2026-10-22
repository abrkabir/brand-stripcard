import { siteConfig } from "@/lib/site";

/**
 * Copy and options for the contact page: the banner, the details rail on the
 * left and the enquiry form on the right.
 *
 * `offices` renders whatever length it is given, so adding a location is a
 * data change and removing one is a deletion. The head office mirrors
 * `siteConfig.contact` rather than repeating it, so it can never drift from
 * the footer and the metadata.
 */
export const contactHero = {
  title: "Contact us",
  caption: ["We reply within", "one working day"],
  description:
    "Questions about your cards, limits or account? Send us a message and the StripCard team will get back to you.",
};

export const contactHeading = {
  title: "How can we help you today",
  description:
    "Tell us what you need and a real person on our team picks it up, usually the same day. No call centre, no ticket number.",
};

export const offices = [
  {
    name: "Head office",
    address: [siteConfig.contact.address],
    phone: siteConfig.contact.phone,
    phoneHref: siteConfig.contact.phoneHref,
    email: siteConfig.contact.email,
    hours: siteConfig.contact.hours,
  },
];

export const contactEnquiry = {
  /** Pre-filled so the field is never a blank stare. */
  messageDraft:
    "Hello! I'd like to know more about StripCard virtual cards and how they could work for me.",
  consent:
    "I would like to receive occasional product updates and offers from StripCard.",
  legal:
    "You can unsubscribe at any time. When you send an enquiry, your data is processed in accordance with our",
};

/**
 * The channels to join for news, under the contact section: each with its
 * app's mark (simple-icons), its colours (a deep ground, and the bright
 * accent of its button, read with dark ink), the link its QR code and button
 * open, and a line on what members get.
 *
 * DEMO: the links are placeholders. Swap in the real channel invites before
 * launch; each QR code is drawn from its link, so it follows.
 */
export const contactChannels = {
  eyebrow: "Stay in the loop",
  title: "Join our channels",
  description:
    "Get new features, security tips and offers straight to your phone. Scan a code with your camera, or tap to join.",
  channels: [
    {
      id: "whatsapp",
      app: "WhatsApp",
      name: "StripCard on WhatsApp",
      href: "https://whatsapp.com/channel/stripcard",
      text: "Product news and offers, right in your WhatsApp Updates tab.",
      ground: "#064e45",
      glow: "#25d366",
      accent: "#25d366",
    },
    {
      id: "telegram",
      app: "Telegram",
      name: "StripCard on Telegram",
      href: "https://t.me/stripcard",
      text: "Release notes, security alerts and tips, the moment they go out.",
      ground: "#0b4a7d",
      glow: "#26a5e4",
      accent: "#4cc3ff",
    },
  ],
};
