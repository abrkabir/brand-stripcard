import QRCode from "qrcode";
import { siTelegram, siWhatsapp } from "simple-icons";
import { ArrowRightIcon } from "@/components/icons";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Container } from "@/components/ui/Container";
import { contactChannels } from "@/data/contact";

/** Each app's mark, by channel id. */
const MARKS = { whatsapp: siWhatsapp, telegram: siTelegram };

/** Each card's entrance: fades up once, the first time the cards come into view (their Reveal). */
const rise =
  "translate-y-6 opacity-0 transition-[opacity,translate] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] in-data-visible:translate-y-0 in-data-visible:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100";

/** An app's mark, filled with `currentColor`. Decorative: name the app beside it. */
function AppMark({ id, className }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
    >
      <path d={MARKS[id].path} />
    </svg>
  );
}

/**
 * One channel, as a white card (the theme's card colour): its QR code
 * standing up out of the card's top edge, on a white panel in a frame of the
 * app's colour (a deep ground, lit from a
 * corner by its bright colour) with "Scan to join" under the code and the
 * app's mark in its middle; then the channel's name and a line on what
 * members get; and a pill that opens the channel, its button in the app's
 * bright colour.
 *
 * The QR panel stays white in both themes, so every camera reads it. The
 * code is drawn at the highest error correction, which is what lets the
 * mark cover its middle and still scan.
 */
function ChannelCard({ channel, qr }) {
  const titleId = `channel-${channel.id}`;

  return (
    <article
      aria-labelledby={titleId}
      className="flex h-full flex-col rounded-[2rem] bg-card px-5 pb-5 ring-1 ring-line ring-inset sm:px-8 sm:pb-8"
    >
      {/* The code: on white, in a frame of the app's colour. */}
      <div
        className="relative isolate mx-auto -mt-16 w-full max-w-[16.5rem] overflow-hidden rounded-[1.6rem] p-2.5 pb-0 text-white shadow-[0_22px_40px_-18px_rgb(12_5_3/0.5)] sm:-mt-20"
        style={{ background: channel.ground }}
      >
        <span
          aria-hidden="true"
          className="absolute -top-20 -right-16 -z-10 size-56 rounded-full opacity-75"
          style={{
            background: `radial-gradient(closest-side, ${channel.glow}, transparent)`,
          }}
        />
        <span
          aria-hidden="true"
          className="absolute -bottom-24 -left-16 -z-10 size-56 rounded-full opacity-35"
          style={{
            background: `radial-gradient(closest-side, ${channel.glow}, transparent)`,
          }}
        />
        <span
          aria-hidden="true"
          className="bg-grain absolute inset-0 -z-10 opacity-[0.07]"
        />

        <div className="relative rounded-[1.15rem] bg-white p-4">
          <div
            role="img"
            aria-label={`QR code that opens ${channel.name}`}
            className="aspect-square [&>svg]:size-full"
            dangerouslySetInnerHTML={{ __html: qr }}
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 grid place-items-center"
          >
            <span className="grid size-[22%] place-items-center rounded-2xl bg-white p-1.5">
              <span
                className="grid size-full place-items-center rounded-xl text-white"
                style={{ background: channel.ground }}
              >
                <AppMark id={channel.id} className="size-[62%]" />
              </span>
            </span>
          </span>
        </div>
        <p className="py-3 text-center font-heading text-[0.9375rem] font-semibold tracking-[0.02em] text-white">
          Scan to join
        </p>
      </div>

      <h3
        id={titleId}
        className="mt-6 text-center font-heading text-xl font-semibold text-headline"
      >
        {channel.name}
      </h3>
      <p className="mx-auto mt-2 max-w-sm text-center text-sm leading-relaxed text-pretty text-muted">
        {channel.text}
      </p>

      {/* The way in, for a visitor already on their phone. */}
      <div className="mt-auto pt-6">
        <a
          href={channel.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3 rounded-full bg-canvas p-1.5 pl-5 ring-1 ring-line transition-colors ring-inset hover:ring-headline/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
        >
          <span className="flex min-w-0 flex-1 items-center gap-2 font-heading text-base font-semibold text-headline">
            <span
              style={{ color: channel.ground }}
              className="dark:!text-white"
            >
              <AppMark id={channel.id} className="size-[18px] shrink-0" />
            </span>
            <span className="truncate">{channel.app}</span>
          </span>
          <span
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-5 font-heading text-[0.9375rem] font-semibold text-hero-ink transition-[filter] group-hover:brightness-105"
            style={{ background: channel.accent }}
          >
            Join channel
            <ArrowRightIcon
              aria-hidden="true"
              className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </span>
          <span className="sr-only"> {channel.name} (opens in a new tab)</span>
        </a>
      </div>
    </article>
  );
}

/**
 * Under the contact section: the channels to join for news (WhatsApp and
 * Telegram), each as a card with its QR code and a link, so a visitor can
 * keep up with StripCard without signing up for anything.
 *
 * A Server Component: the QR codes are drawn to SVG here, from each
 * channel's link, so they always match it and no QR library ships to the
 * browser. The cards fade up once, the first time they scroll into view.
 */
export async function ContactChannels() {
  const { eyebrow, title, description, channels } = contactChannels;

  const qrs = await Promise.all(
    channels.map((channel) =>
      QRCode.toString(channel.href, {
        type: "svg",
        margin: 0,
        errorCorrectionLevel: "H",
        color: { dark: "#0b1020", light: "#00000000" },
      }),
    ),
  );

  return (
    <section
      aria-labelledby="channels-title"
      className="bg-page py-20 lg:py-28"
    >
      <Container>
        <SectionHeading
          id="channels-title"
          align="center"
          eyebrow={eyebrow}
          title={title}
          description={description}
        />

        <Reveal className="mx-auto mt-28 grid max-w-[76rem] gap-x-6 gap-y-28 md:grid-cols-2 lg:mt-32 lg:gap-x-8">
          {channels.map((channel, i) => (
            <div
              key={channel.id}
              className={rise}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <ChannelCard channel={channel} qr={qrs[i]} />
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
