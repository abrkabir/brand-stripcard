/**
 * How long each slide holds, in milliseconds.
 *
 * This single number drives three things that must agree exactly: the autoplay
 * timer, the fill of the progress ring on the active dot, and the duration of
 * the slide's Ken Burns drift. Change it here and all three follow.
 */
export const SLIDE_MS = 7000;

/** Crossfade length. Also how far past SLIDE_MS the drift keeps running. */
export const FADE_MS = 1200;

/**
 * Banner slides.
 *
 * Photography is deliberately full-bleed and slow-moving — see the `motion`
 * field and the ken-* keyframes in styles/tokens.css. Directions alternate so
 * two consecutive frames never drift the same way.
 *
 * Swapping to your own assets: drop files in `public/images/hero/` and replace
 * `image` with `/images/hero/<file>.jpg`. Nothing else changes.
 */
/**
 * The card pinned to the banner's bottom corner.
 *
 * Not per-slide — it sits over all of them, so it lives beside `heroSlides`
 * rather than inside one. The whole card is a link, which is why the copy is a
 * statement and the label is the destination: a card that says one thing and
 * goes somewhere else is a card nobody trusts twice.
 */
export const bannerCard = {
  image: "/images/properties/property-one.webp",
  alt: "Living room of a recently listed apartment",
  body: "Every listing is visited, measured and photographed by our own team before it goes live.",
  cta: { label: "Browse properties", href: "/properties" },
};

export const heroSlides = [
  {
    id: "find",
    title: "Find the address you actually want",
    description:
      "Verified listings, honest pricing data and agents who pick up the phone. Adestate takes the guesswork out of moving.",
    cta: { label: "Browse properties", href: "/properties" },
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=72",
    alt: "Modern white villa with a landscaped lawn and pool at dusk",
    motion: "zoom-in",
  },
  {
    id: "verified",
    title: "Every home seen before it is ever listed",
    description:
      "No stock photography, no phantom listings. Our team stands inside each property, measures it and photographs it — then it goes live.",
    cta: { label: "How we verify", href: "/about" },
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=72",
    alt: "Bright open-plan living room with floor-to-ceiling windows",
    motion: "pan-left",
  },
  {
    id: "rent",
    title: "Rent direct. No brokerage, no runaround",
    description:
      "Over 1,200 homes listed by verified owners, with deposits held in protected accounts and contracts you can read in one sitting.",
    cta: { label: "See owner listings", href: "/properties?status=rent" },
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=2000&q=72",
    alt: "Contemporary kitchen with an island and warm wood cabinetry",
    motion: "zoom-out",
  },
  {
    id: "commercial",
    title: "Space that works as hard as you do",
    description:
      "Office floors, showrooms and warehousing across the city's main business districts, with real occupancy costs shown up front.",
    cta: { label: "Explore commercial", href: "/properties?type=commercial" },
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=72",
    alt: "Glass office towers seen from below against an open sky",
    motion: "pan-right",
  },
  {
    id: "agents",
    title: "Agents who answer, in 42 neighbourhoods",
    description:
      "Three hundred and twenty licensed agents, each one accountable for the listings that carry their name. Reply times published monthly.",
    cta: { label: "Meet the team", href: "/agents" },
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=2000&q=72",
    alt: "Warm, softly lit interior of a furnished apartment",
    motion: "pan-left",
  },
];
