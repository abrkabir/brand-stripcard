/**
 * How long each review holds before the next one, in milliseconds.
 *
 * This is the only place the pace is set: the ring around the active number
 * fills over exactly this long, and finishing that fill is what advances the
 * slide — so the indicator and the timer cannot drift apart.
 */
export const TESTIMONIAL_MS = 9000;

export const testimonialsHeading = {
  title: "Don't take our word for it.",
  description:
    "Every review below is from a completed transaction, published unedited. We do not remove the ones that cost us four stars instead of five.",
};

/**
 * Client testimonials for the homepage.
 *
 * `context` matters as much as the quote — "Bought in Gulshan 2" is what makes
 * a review checkable rather than decorative. Keep quotes near sixty words:
 * past that they stop being read and start being scenery.
 *
 * The photography shows agents working with clients — a consultation, a
 * handover, a handshake. Scenes, never portraits: a stock face beside a named
 * review reads as a claim that this is the reviewer, which it is not.
 */
export const testimonials = [
  {
    quote:
      "Shirin was an invaluable guide through the whole buying process, from the first search to closing. She understood immediately what we were after, steered us away from two places that looked right on paper, and kept every stage moving with a steady, reassuring hand.",
    name: "Matt Powers",
    context: "Bought in Gulshan 2",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1573497491208-6b1acb260507?auto=format&fit=crop&w=1400&q=75",
    alt: "An agent talking a client through options across a table, city skyline behind them",
  },
  {
    quote:
      "We had been burned twice by listings that turned out not to exist. Adestate was the first place where what we saw online was exactly what we walked into. The floor plan was accurate to the centimetre.",
    name: "Nusrat Jahan",
    context: "Rented in Dhanmondi",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1400&q=75",
    alt: "An agent going through listings on a laptop with a client",
  },
  {
    quote:
      "The valuation came back in thirty-one hours with the comparable sales attached, so I could see exactly how they had arrived at the number. We listed that week and had three offers by the following Sunday.",
    name: "Imran Chowdhury",
    context: "Sold in Banani",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1400&q=75",
    alt: "Two people shaking hands over a completed sale",
  },
  {
    quote:
      "Renting direct from the owner saved us a full month's rent in brokerage, and the deposit went into a protected account the same day. Small things, but they are the ones nobody else was doing.",
    name: "Tanvir Rahman",
    context: "Rented in Bashundhara R/A",
    rating: 4,
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1400&q=75",
    alt: "An agent handing over keys and paperwork at a counter",
  },
  {
    quote:
      "We needed eleven hundred square feet of office space in under a month. Our agent sent four options, all of them genuinely available, with the service charges already worked into the figures. No time wasted.",
    name: "Farhana Haque",
    context: "Leased commercial space, Motijheel",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=75",
    alt: "An agent and a client reviewing floor plans and documents at a desk",
  },
];
