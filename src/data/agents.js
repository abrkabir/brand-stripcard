/**
 * The agents shown on the homepage.
 *
 * `photo` expects a **cut-out** — the portrait with its background removed, as
 * a PNG or a WebP with an alpha channel. That is what the card is built around:
 * the figure is drawn over the frame at its own proportions and stands on the
 * frame's floor, so the head rises past the top line and the line disappears
 * behind the body where they cross.
 *
 * Adding more portraits:
 *   1. Export with alpha, subject full-length, and **flush to the bottom edge
 *      of the file** — the card stands the figure on that edge, so transparent
 *      padding underneath it shows up as the figure floating in the frame.
 *      Keep the file's aspect near 2:3 to match the card's stage; a much wider
 *      file is fitted by height and the figure ends up small and marooned.
 *   2. Drop them in `public/images/agents/`.
 *   3. Point `photo` at the file below.
 *
 * Left unset, the card draws the agent's initials in the same footprint, so the
 * frame, star and nameplate still read while a shoot is pending.
 *
 * The names are placeholders picked to match the photographs. There are three
 * portraits for four agents, so `agent-one` appears twice — the fourth card
 * repeats it until a fourth cut-out exists.
 *
 * The count and the grid in `Agents` have to agree: four cards want four
 * columns, and `SIZES` in `AgentCard` has to track that too or `next/image`
 * fetches the wrong candidate width.
 *
 * `verified` shows the shield-and-tick on the frame's left border — the same
 * mark the footer uses for "verified on site". It is a plain flag, not a score
 * threshold: an agent is either checked out by us or not. Leave it off and the
 * badge is dropped.
 *
 * `rating` (out of five) and `reviews` render under the role on the nameplate.
 * Both are needed for that line to appear — a score with no count behind it is
 * not worth showing, so leaving either off drops the row.
 */
export const agentsHeading = {
  title: "The people you will actually be dealing with",
  description:
    "No call centre and no handover. One named agent takes your enquiry and stays with it until the keys change hands.",
};

export const agents = [
  {
    id: "arif-rahman",
    name: "Arif Rahman",
    role: "Investment Manager",
    href: "/agents/arif-rahman",
    verified: true,
    rating: 4.9,
    reviews: 128,
    photo: "/images/agents/agent-one.webp",
    alt: "Arif Rahman, investment manager at Adestate",
  },
  {
    id: "imran-chowdhury",
    name: "Imran Chowdhury",
    role: "Customer Relations",
    href: "/agents/imran-chowdhury",
    verified: true,
    rating: 4.6,
    reviews: 74,
    photo: "/images/agents/agent-two.webp",
    alt: "Imran Chowdhury, customer relations manager at Adestate",
  },
  {
    id: "tanvir-ahmed",
    name: "Tanvir Ahmed",
    role: "Commercial Agent",
    href: "/agents/tanvir-ahmed",
    verified: true,
    rating: 5,
    reviews: 212,
    photo: "/images/agents/agent-three.webp",
    alt: "Tanvir Ahmed, commercial agent at Adestate",
  },
  {
    id: "sabbir-hossain",
    name: "Sabbir Hossain",
    role: "Lettings Lead",
    href: "/agents/sabbir-hossain",
    verified: true,
    rating: 4.8,
    reviews: 96,
    // Repeats the first portrait — see the note above.
    photo: "/images/agents/agent-one.webp",
    alt: "Sabbir Hossain, lettings lead at Adestate",
  },
];
