import Image from "next/image";
import { siApplepay, siGooglepay, siPaypal, siStripe, siVisa } from "simple-icons";
import { TrustBadge } from "@/components/shared/TrustBadge";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { banner } from "@/data/banner";

/**
 * A wedge of a circle, as polygon points: from `from` to `to` degrees (SVG
 * angles, clockwise from three o'clock), out to radius `r` around `cx, cy`.
 */
function wedge(cx, cy, r, from, to) {
  const at = (deg) => {
    const a = (deg * Math.PI) / 180;
    return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`;
  };
  return `${cx},${cy} ${at(from)} ${at((from + to) / 2)} ${at(to)}`;
}

/**
 * Google Pay's "G" in its four colours. simple-icons draws "G Pay" as one
 * shape, the G a ring of radius 3.963 round (3.963, 11.198) with the word to
 * its right; the coloured wedges are clipped to that shape and kept left of
 * the "P", so only the G takes them.
 */
const G = { cx: 3.963, cy: 11.198, r: 9 };
const G_COLOURS = [
  ["#ea4335", 190, 320],
  ["#fbbc04", 140, 190],
  ["#34a853", 35, 140],
  ["#4285f4", -40, 35],
];

/**
 * The partner logos in their own colours, by the name the data uses: each
 * simple-icons path with a viewBox cropped to its own outline (the icons sit
 * in a 24-unit square, which would leave a wordmark tiny and a square mark
 * huge). Mastercard is drawn as its circles, red and yellow overlapping in
 * orange, and Google Pay's G in its four colours.
 */
const PARTNER_ICONS = {
  siStripe: { box: "3.43 0 17.13 24", art: <path d={siStripe.path} fill="#635bff" /> },
  siVisa: { box: "0 8.12 24 7.75", art: <path d={siVisa.path} fill="#1a1f71" /> },
  siMastercard: {
    box: "0 0 38 24",
    art: (
      <>
        <circle cx="12" cy="12" r="12" fill="#eb001b" />
        <circle cx="26" cy="12" r="12" fill="#f79e1b" />
        <path d="M19 2.253A12 12 0 0 1 19 21.747A12 12 0 0 1 19 2.253Z" fill="#ff5f00" />
      </>
    ),
  },
  siApplepay: { box: "0 4.32 24 15.37", art: <path d={siApplepay.path} fill="#000" /> },
  siGooglepay: {
    box: "0 7.23 24 9.53",
    art: (
      <>
        <defs>
          <clipPath id="partner-gpay-shape">
            <path d={siGooglepay.path} />
          </clipPath>
          <clipPath id="partner-gpay-g">
            <rect x="0" y="0" width="8.3" height="24" />
          </clipPath>
        </defs>
        <path d={siGooglepay.path} fill="#5f6368" />
        <g clipPath="url(#partner-gpay-shape)">
          <g clipPath="url(#partner-gpay-g)">
            {G_COLOURS.map(([fill, from, to]) => (
              <polygon key={fill} points={wedge(G.cx, G.cy, G.r, from, to)} fill={fill} />
            ))}
          </g>
        </g>
      </>
    ),
  },
  siPaypal: { box: "1.82 0 20.36 24", art: <path d={siPaypal.path} fill="#003087" /> },
};

/**
 * Homepage banner.
 *
 * A dark, orange-lit card inset from the viewport edge, with the photograph
 * filling it and the copy split across three positions: the headline centred
 * on the left, the trust badge top-right and the pitch bottom-right. On small
 * screens the three stack — headline at the top, badge and pitch on the floor
 * — and the photograph shows through the gap between them.
 *
 * Static markup, so it stays a Server Component. The header floats over the
 * card, so the content pads itself clear of `--header-h` from the inside.
 */
export function Banner() {
  const { eyebrow, headline, description, partners, image, trust } = banner;

  return (
    <section className="bg-brand-50 p-2 sm:p-3 lg:p-4 dark:bg-page">
      <div className="on-dark relative isolate flex min-h-[calc(100svh-1rem)] overflow-hidden rounded-4xl bg-hero-glow sm:min-h-[calc(100svh-1.5rem)] lg:min-h-[calc(100svh-2rem)] lg:rounded-5xl">
        <div className="animate-fade-up absolute inset-0 [animation-delay:150ms]">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            preload
            sizes="100vw"
            className="object-cover object-[60%_45%] lg:object-center"
          />
        </div>

        {/* Legibility, then texture. The grain sits on top of everything
            visual so the photograph and the gradient share one surface. */}
        <div aria-hidden="true" className="hero-glow-scrim absolute inset-0" />
        <div
          aria-hidden="true"
          className="bg-grain pointer-events-none absolute inset-0 opacity-[0.16] mix-blend-overlay"
        />

        <Container className="relative grid grid-rows-[auto_1fr_auto_auto] gap-y-6 pt-[calc(var(--header-h)+2rem)] pb-8 sm:pb-12 lg:grid-cols-12 lg:grid-rows-[auto_1fr_auto] lg:gap-x-8 lg:pt-[calc(var(--header-h-lg)+2.5rem)] lg:pb-24 xl:pb-28">
          {/* Centred on the card, then lifted: optical centre sits above the
              geometric one, and the lift keeps the headline clear of the card
              in the photograph. */}
          <div className="lg:col-span-7 lg:row-span-3 lg:row-start-1 lg:-translate-y-12 lg:self-center">
            <Eyebrow className="animate-fade-up">{eyebrow}</Eyebrow>

            <h1 className="mt-4 font-heading text-[clamp(2.25rem,5.2vw,4.5rem)] leading-[0.98] font-bold tracking-[-0.03em] text-white lg:mt-5">
              {headline.map((line, i) => (
                <span
                  key={line}
                  className="animate-rise block"
                  style={{ animationDelay: `${120 + i * 90}ms` }}
                >
                  {line}
                </span>
              ))}
            </h1>
          </div>

          <TrustBadge
            label={trust.label}
            countries={trust.countries}
            className="animate-fade-up row-start-3 [animation-delay:500ms] lg:col-span-4 lg:col-start-9 lg:row-start-1"
          />

          <div className="animate-fade-up row-start-4 [animation-delay:600ms] lg:col-span-4 lg:col-start-9 lg:row-start-3">
            <p className="max-w-md text-base leading-[1.45] text-white/85 sm:text-lg">
              {description}
            </p>

            {/* The payment partners, each logo in its own colours on a small
                white badge, so even the dark ones (Visa, Apple Pay) read on
                the banner's dark ground. */}
            <div className="mt-6 lg:mt-7">
              <p className="text-xs font-medium tracking-[0.02em] text-white/60">{partners.label}</p>
              <ul className="mt-3.5 flex flex-wrap items-center gap-1.5 sm:gap-2">
                {partners.items.map((partner) => {
                  const icon = PARTNER_ICONS[partner.icon];
                  return (
                    <li
                      key={partner.name}
                      className="grid h-8 place-items-center rounded-lg bg-white px-2 shadow-[0_6px_16px_-8px_rgb(0_0_0/0.5)] ring-1 ring-black/5 transition-transform duration-300 hover:-translate-y-0.5 sm:h-9 sm:px-3"
                    >
                      <svg role="img" aria-label={partner.name} viewBox={icon.box} className="h-(--h) w-auto max-sm:h-[calc(var(--h)*0.85)]" style={{ "--h": `${partner.h}px` }}>
                        {icon.art}
                      </svg>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
