/**
 * The project gallery.
 *
 * `title` and `place` are two lines on the tile, not one string, because the
 * break is deliberate — "Riverside residences" over "in Gulshan" — and letting
 * it fall where the column width happens to put it makes eight tiles wrap eight
 * different ways.
 *
 * Photography points at Unsplash, allow-listed in `next.config.mjs`, the same
 * arrangement `slides.js` and `agents.js` use. Every one is a placeholder: drop
 * real files into `public/images/gallery/` and swap `image` for the local path.
 * Nothing in the component changes.
 *
 * The grid is four across at `lg`, so a multiple of four keeps the last row
 * full. Any count renders — it just leaves a gap.
 */
export const galleryHeading = {
  title: "Work we have put our name to",
  description:
    "Developments we brought to market, buildings we let in full, and the streets we know best. Every one photographed by our own team.",
};

const photo = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=75`;

export const galleryItems = [
  {
    id: "gulshan-riverside",
    title: "Riverside residences",
    place: "Gulshan",
    href: "/properties?location=gulshan",
    image: photo("photo-1487958449943-2429e8be8625"),
    alt: "Concrete and glass residential block seen from below",
  },
  {
    id: "banani-townhouses",
    title: "Townhouse terrace",
    place: "Banani",
    href: "/properties?location=banani",
    image: photo("photo-1449157291145-7efd050a4d0e"),
    alt: "Row of townhouses along a quiet street",
  },
  {
    id: "motijheel-offices",
    title: "Office conversion",
    place: "Motijheel",
    href: "/properties?type=apartment",
    image: photo("photo-1486718448742-163732cd1544"),
    alt: "Curved office facade with ribbon glazing",
  },
  {
    id: "dhanmondi-lakeside",
    title: "Lakeside apartments",
    place: "Dhanmondi",
    href: "/properties?location=dhanmondi",
    image: photo("photo-1439337153520-7082a56a81f4"),
    alt: "Apartment block stairwell looking upward",
  },
  {
    id: "baridhara-villas",
    title: "Villa quarter",
    place: "Baridhara",
    href: "/properties?location=baridhara",
    image: photo("photo-1524230572899-a752b3835840"),
    alt: "Modern villa lit from within at dusk",
  },
  {
    id: "uttara-duplexes",
    title: "Courtyard duplexes",
    place: "Uttara",
    href: "/properties?type=duplex",
    image: photo("photo-1511818966892-d7d671e672a2"),
    alt: "Duplex frontage with a planted forecourt",
  },
  {
    id: "purbachal-masterplan",
    title: "Masterplan blocks",
    place: "Purbachal",
    href: "/properties",
    image: photo("photo-1503387762-592deb58ef4e"),
    alt: "Tower under construction against an open sky",
  },
  {
    id: "tejgaon-warehousing",
    title: "Warehouse frontage",
    place: "Tejgaon",
    href: "/properties",
    image: photo("photo-1497366216548-37526070297c"),
    alt: "Open-plan commercial interior with exposed structure",
  },
];
