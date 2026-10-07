import { siteConfig } from "@/lib/site";

/**
 * Copy and options for the contact section — the details rail on the left and
 * the enquiry form on the right.
 *
 * `offices` renders whatever length it is given, so opening a branch is a data
 * change and closing one is a deletion. The Gulshan entry mirrors
 * `siteConfig.contact` rather than repeating it, so the head office can never
 * drift from the footer and the metadata.
 */
export const contactHeading = {
  title: "How can we help you today",
  description:
    "Tell us what you are after and a named agent picks it up — usually the same day. No call centre, no ticket number.",
};

export const offices = [
  {
    name: "Gulshan · Head office",
    address: [siteConfig.contact.address],
    phone: siteConfig.contact.phone,
    phoneHref: siteConfig.contact.phoneHref,
    email: siteConfig.contact.email,
    hours: siteConfig.contact.hours,
  },
  {
    // Placeholder branch — see directory/1-project-concept.md. Delete it or
    // replace the details; the rail follows.
    name: "Dhanmondi",
    address: ["House 42, Road 11, Dhanmondi", "Dhaka 1209"],
    phone: "+880 1700 111 222",
    phoneHref: "tel:+8801700111222",
    email: "dhanmondi@adestate.com",
    hours: "Sun–Thu · 10:00–19:00",
  },
];

export const contactEnquiry = {
  /** Pre-filled so the field is never a blank stare. */
  messageDraft:
    "Hello! I'm interested in finding a home or commercial space with Adestate and would appreciate more information.",
  consent:
    "I would like to receive occasional updates about new listings and Adestate developments.",
  legal:
    "You can unsubscribe at any time. When you send an enquiry, your data is processed in accordance with our",
};
