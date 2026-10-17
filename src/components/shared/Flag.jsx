import { cn } from "@/lib/cn";

/**
 * Square flags, drawn to be cropped to a circle, by ISO code (EU for the
 * European Union): the countries the dashboard names, and a few more. Check
 * `hasFlag` first. Each is decorative, so say the
 * country's name beside it. Small emblems are simplified to read at a glance
 * at avatar size.
 */

/** A star's outline: `points` tips on radius `r` round (cx, cy), the first pointing up. */
function star(cx, cy, r, points = 5, inner = 0.4) {
  const step = Math.PI / points;
  const corners = Array.from({ length: points * 2 }, (_, i) => {
    const radius = i % 2 ? r * inner : r;
    const a = i * step - Math.PI / 2;
    return `${(cx + radius * Math.cos(a)).toFixed(2)} ${(cy + radius * Math.sin(a)).toFixed(2)}`;
  });
  return `M${corners.join("L")}Z`;
}

/** The Union Flag in a 30-unit square, its red diagonals offset against the white as on the real thing. */
const UNION = (
  <>
    <path fill="#012169" d="M0 0h30v30H0z" />
    <path stroke="#fff" strokeWidth="6" d="M0 0l30 30M30 0L0 30" />
    <path
      fill="#c8102e"
      d="M0 0l15 15h-2.83L0 2.83zM15 15l15 15v-2.83L17.83 15zM15 15L0 30h2.83L15 17.83zM15 15L30 0h-2.83L15 12.17z"
    />
    <path fill="#fff" d="M10 0h10v30H10zM0 10h30v10H0z" />
    <path fill="#c8102e" d="M12 0h6v30h-6zM0 12h30v6H0z" />
  </>
);

/** The EU's twelve gold stars, in a ring. */
const EU_STARS = Array.from({ length: 12 }, (_, i) => {
  const a = (i * Math.PI) / 6;
  return star(15 + 8.5 * Math.sin(a), 15 - 8.5 * Math.cos(a), 1.7);
}).join("");

/** Australia's stars: the Commonwealth Star under the Union Flag, and the Southern Cross. */
const AU_STARS = [
  star(7.5, 22.5, 3.4, 7, 0.45),
  star(22.5, 5.5, 1.7, 7, 0.45),
  star(26.6, 12.4, 1.7, 7, 0.45),
  star(18.4, 13.6, 1.7, 7, 0.45),
  star(22.5, 24.2, 1.9, 7, 0.45),
  star(24.9, 17.3, 1.1),
].join("");

/** The Stars and Stripes' fifty stars: nine rows, six and five in turn. */
const STARS = Array.from({ length: 9 }, (_, row) =>
  Array.from({ length: row % 2 ? 5 : 6 }, (_, i) => ({
    cx: ((row % 2 ? 2 : 1) + i * 2) * (13 / 12),
    cy: 1.4 * (row + 1),
  })),
).flat();

/** Canada's maple leaf: one half of its outline, mirrored about the middle. */
const LEAF = [
  [0, 7], [1.3, 9.6], [2.9, 8.9], [2.4, 12.4], [5.2, 10.4], [4.6, 12], [7.2, 12.4], [5.9, 14.6], [6.6, 15.4],
  [3.6, 17.6], [4, 19], [0.9, 18.4], [0.6, 22.6],
];
const MAPLE = `M${[...LEAF, ...[...LEAF].reverse().map(([x, y]) => [-x, y])]
  .map(([x, y]) => `${15 + x * 0.85} ${15 + (y - 15) * 0.85}`)
  .join("L")}Z`;

/** The spokes of India's wheel (twelve, for the size it is drawn at). */
const SPOKES = Array.from({ length: 12 }, (_, i) => {
  const a = (i * Math.PI) / 6;
  return `M15 15L${15 + 3.6 * Math.cos(a)} ${15 + 3.6 * Math.sin(a)}`;
}).join("");

/** Singapore's five stars, in a ring beside the crescent. */
const SG_STARS = Array.from({ length: 5 }, (_, i) => {
  const a = ((-90 + i * 72) * Math.PI) / 180;
  return { cx: 13.2 + 2.1 * Math.cos(a), cy: 7.6 + 2.1 * Math.sin(a) };
});

const FLAGS = {
  US: (
    <svg viewBox="0 0 26 26">
      <path fill="#fff" d="M0 0h26v26H0z" />
      <path fill="#b22234" d="M0 0h26v2H0zM0 4h26v2H0zM0 8h26v2H0zM0 12h26v2H0zM0 16h26v2H0zM0 20h26v2H0zM0 24h26v2H0z" />
      <path fill="#3c3b6e" d="M0 0h13v14H0z" />
      <g fill="#fff">
        {STARS.map((star) => (
          <circle key={`${star.cx}-${star.cy}`} cx={star.cx} cy={star.cy} r="0.42" />
        ))}
      </g>
    </svg>
  ),
  GB: <svg viewBox="0 0 30 30">{UNION}</svg>,
  EU: (
    <svg viewBox="0 0 30 30">
      <path fill="#003399" d="M0 0h30v30H0z" />
      <path fill="#ffcc00" d={EU_STARS} />
    </svg>
  ),
  AU: (
    <svg viewBox="0 0 30 30">
      <path fill="#012169" d="M0 0h30v30H0z" />
      <g transform="scale(0.5)">{UNION}</g>
      <path fill="#fff" d={AU_STARS} />
    </svg>
  ),
  FR: (
    <svg viewBox="0 0 3 3">
      <path fill="#002395" d="M0 0h1v3H0z" />
      <path fill="#fff" d="M1 0h1v3H1z" />
      <path fill="#ed2939" d="M2 0h1v3H2z" />
    </svg>
  ),
  AE: (
    <svg viewBox="0 0 30 30">
      <path fill="#00732f" d="M8 0h22v10H8z" />
      <path fill="#fff" d="M8 10h22v10H8z" />
      <path fill="#000" d="M8 20h22v10H8z" />
      <path fill="#ff0000" d="M0 0h8v30H0z" />
    </svg>
  ),
  JP: (
    <svg viewBox="0 0 30 30">
      <path fill="#fff" d="M0 0h30v30H0z" />
      <circle cx="15" cy="15" r="9" fill="#bc002d" />
    </svg>
  ),
  CA: (
    <svg viewBox="0 0 30 30">
      <path fill="#fff" d="M0 0h30v30H0z" />
      <path fill="#d52b1e" d="M0 0h7.5v30H0zM22.5 0H30v30h-7.5z" />
      <path fill="#d52b1e" d={MAPLE} />
    </svg>
  ),
  MX: (
    <svg viewBox="0 0 30 30">
      <path fill="#006847" d="M0 0h10v30H0z" />
      <path fill="#fff" d="M10 0h10v30H10z" />
      <path fill="#ce1126" d="M20 0h10v30H20z" />
      <circle cx="15" cy="15" r="3.2" fill="#a0702a" stroke="#006847" strokeWidth="0.7" />
    </svg>
  ),
  BR: (
    <svg viewBox="0 0 30 30">
      <path fill="#009c3b" d="M0 0h30v30H0z" />
      <path fill="#ffdf00" d="M15 3.5L28 15 15 26.5 2 15z" />
      <circle cx="15" cy="15" r="6.2" fill="#002776" />
      <path fill="none" stroke="#fff" strokeWidth="1.2" d="M8.9 13.7Q15 11.6 21.1 16.3" />
    </svg>
  ),
  // The green Y with white on its outer edges and gold on its inner, round
  // the black triangle at the hoist.
  ZA: (
    <svg viewBox="0 0 30 30">
      <path fill="#e03c31" d="M0 0h30v15H0z" />
      <path fill="#001489" d="M0 15h30v15H0z" />
      <g fill="none" strokeLinejoin="round" strokeLinecap="round">
        <path stroke="#fff" strokeWidth="10" d="M0 0l11 15h19M0 30l11-15" />
        <path stroke="#007749" strokeWidth="6" d="M0 0l11 15h19M0 30l11-15" />
      </g>
      <path fill="#ffb81c" d="M0 5.07L7.28 15 0 24.93z" />
      <path fill="#000" d="M0 7.78L5.3 15 0 22.22z" />
    </svg>
  ),
  IN: (
    <svg viewBox="0 0 30 30">
      <path fill="#ff9933" d="M0 0h30v10H0z" />
      <path fill="#fff" d="M0 10h30v10H0z" />
      <path fill="#138808" d="M0 20h30v10H0z" />
      <circle cx="15" cy="15" r="3.6" fill="none" stroke="#000080" strokeWidth="0.7" />
      <path stroke="#000080" strokeWidth="0.3" d={SPOKES} />
      <circle cx="15" cy="15" r="0.8" fill="#000080" />
    </svg>
  ),
  SG: (
    <svg viewBox="0 0 30 30">
      <path fill="#ef3340" d="M0 0h30v15H0z" />
      <path fill="#fff" d="M0 15h30v15H0z" />
      <circle cx="8.5" cy="7.5" r="4.6" fill="#fff" />
      <circle cx="10.1" cy="7.5" r="4.3" fill="#ef3340" />
      <g fill="#fff">
        {SG_STARS.map((star) => (
          <circle key={star.cx} cx={star.cx} cy={star.cy} r="0.55" />
        ))}
      </g>
    </svg>
  ),
};

export const hasFlag = (code) => code in FLAGS;

/** A country's flag, filling its box; nothing for a country without one. */
export function Flag({ code, className }) {
  const flag = FLAGS[code];
  if (!flag) return null;
  return (
    <span aria-hidden="true" className={cn("block [&>svg]:size-full", className)}>
      {flag}
    </span>
  );
}
