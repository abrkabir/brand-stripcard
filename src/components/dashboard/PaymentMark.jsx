import { siApple, siGoogle, siPaypal, siVisa } from "simple-icons";
import { cn } from "@/lib/cn";

/** A brand's glyph (from simple-icons), scaled and centred in a 24-unit square. */
function Glyph({ icon, fill, scale }) {
  const offset = (24 - 24 * scale) / 2;
  return (
    <g transform={`translate(${offset} ${offset}) scale(${scale})`}>
      <path d={icon.path} fill={fill} />
    </g>
  );
}

/**
 * Ways to pay as round marks, by id: each brand's glyph on its own colour,
 * drawn square to be cropped to a circle, and kept clear of the right fifth,
 * which the next mark in a row covers. Mastercard is drawn as its two
 * circles, red and yellow, overlapping in orange.
 */
const MARKS = {
  visa: {
    name: "Visa",
    art: (
      <svg viewBox="0 0 24 24">
        <path fill="#1a1f71" d="M0 0h24v24H0z" />
        <Glyph icon={siVisa} fill="#fff" scale={0.5} />
      </svg>
    ),
  },
  mastercard: {
    name: "Mastercard",
    art: (
      <svg viewBox="0 0 24 24">
        <path fill="#1b1b1f" d="M0 0h24v24H0z" />
        <circle cx="8.5" cy="12" r="5" fill="#eb001b" />
        <circle cx="13.5" cy="12" r="5" fill="#f79e1b" />
        <path fill="#ff5f00" d="M11 7.67A5 5 0 0 1 11 16.33A5 5 0 0 1 11 7.67Z" />
      </svg>
    ),
  },
  paypal: {
    name: "PayPal",
    art: (
      <svg viewBox="0 0 24 24">
        <path fill="#003087" d="M0 0h24v24H0z" />
        <Glyph icon={siPaypal} fill="#fff" scale={0.5} />
      </svg>
    ),
  },
  applepay: {
    name: "Apple Pay",
    art: (
      <svg viewBox="0 0 24 24">
        <path fill="#000" d="M0 0h24v24H0z" />
        <Glyph icon={siApple} fill="#fff" scale={0.5} />
      </svg>
    ),
  },
  googlepay: {
    name: "Google Pay",
    art: (
      <svg viewBox="0 0 24 24">
        <path fill="#fff" d="M0 0h24v24H0z" />
        <Glyph icon={siGoogle} fill="#4285f4" scale={0.5} />
      </svg>
    ),
  },
};

/** A way to pay's name, for its label. */
export const paymentName = (id) => MARKS[id]?.name ?? id;

/** A way to pay's mark, filling its box; nothing for an unknown id. Decorative: name it beside. */
export function PaymentMark({ id, className }) {
  const mark = MARKS[id];
  if (!mark) return null;
  return (
    <span aria-hidden="true" className={cn("block [&>svg]:size-full", className)}>
      {mark.art}
    </span>
  );
}
