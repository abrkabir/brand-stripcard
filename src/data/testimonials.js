import aisha from "../../public/images/testimonials/customer-aisha.webp";
import daniel from "../../public/images/testimonials/customer-daniel.webp";
import marcus from "../../public/images/testimonials/customer-marcus.webp";
import maya from "../../public/images/testimonials/customer-maya.webp";
import sofia from "../../public/images/testimonials/customer-sofia.webp";

/** How long the rail rests before gliding on by one card, in milliseconds. */
export const TESTIMONIAL_MS = 5000;

export const testimonialsHeading = {
  eyebrow: "Customer stories",
  title: "Hear from real customers who pay safer, spend smarter and save more with StripCard",
};

/**
 * The orange card pinned at the start of the rail. PLACEHOLDER figures:
 * replace `score` and `users` with real, current numbers (and say where the
 * rating comes from) before launch. `avatars` are a few of the faces below.
 */
export const testimonialsRating = {
  score: "4.9",
  label: "Rating",
  note: "Average from customers paying with StripCard every day.",
  users: "15k+",
  usersLabel: "Trusted users",
  avatars: [maya, daniel, aisha],
};

/**
 * Customer stories for the rail (see Testimonials).
 *
 * PLACEHOLDERS. The people and quotes below are illustrative, and the photos
 * are stock (CC0, StockSnap). Before launch, replace every entry with a real
 * customer who has agreed to be quoted, with their own photo. Publishing
 * invented reviews as genuine is misleading, and in many countries unlawful.
 *
 * Keep each quote near twenty words, so it sits in the lower part of the
 * photo. `rating` is out of 5. `focus` is the photo's `object-position`,
 * keeping the face in view.
 */
export const testimonials = [
  {
    quote:
      "Every free trial gets its own StripCard now. The renewals I used to forget simply stop, and that money stays with me.",
    name: "Maya Collins",
    rating: 5,
    role: "Freelance designer",
    image: maya,
    focus: "50% 25%",
  },
  {
    quote:
      "Ads, hosting and every tool we use run on their own card with a limit. I see each charge the moment it lands.",
    name: "Daniel Brooks",
    rating: 5,
    role: "Founder, Brookline Studio",
    image: daniel,
    focus: "50% 20%",
  },
  {
    quote:
      "Hotels, trains and street food in thirty-two countries, all on StripCard, with no surprise conversion fees along the way.",
    name: "Aisha Bello",
    rating: 5,
    role: "Travel creator",
    image: aisha,
    focus: "50% 20%",
  },
  {
    quote:
      "Every card is tagged to a team and a budget, so closing the month now takes a morning instead of a week.",
    name: "Sofia Lindqvist",
    rating: 4,
    role: "Finance lead, Northwind",
    image: sofia,
    focus: "50% 18%",
  },
  {
    quote:
      "Merchant lock stopped a supplier charging us twice. The duplicate never went through, and I didn't have to call anyone.",
    name: "Marcus Reid",
    rating: 5,
    role: "Online store owner",
    image: marcus,
    focus: "55% 20%",
  },
];
