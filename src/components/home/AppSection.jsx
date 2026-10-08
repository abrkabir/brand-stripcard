import Image from "next/image";
import QRCode from "qrcode";
import { AppQrCards } from "@/components/home/AppQrCards";
import { AppleIcon, GooglePlayIcon } from "@/components/icons";
import { Reveal } from "@/components/shared/Reveal";
import { Container } from "@/components/ui/Container";
import { appPromo } from "@/data/appPromo";

const STORE_ICONS = { apple: AppleIcon, googlePlay: GooglePlayIcon };

/**
 * "Get the app" as two bordered panels of equal height. Left, centred: where
 * to get it, a poster-style title, a scan card per store with a real QR
 * code, and the store badges. Right: the app in hand, filling its panel.
 * Stacks on small screens.
 *
 * The QR codes are rendered to SVG on the server from each store's link, so
 * they always match it and no QR library ships to the browser. Each scan
 * card opens its code large in a modal (see AppQrCards); the badges link
 * straight to the stores, for visitors already on a phone. Everything fades up once, the first time it scrolls into view.
 */
export async function AppSection() {
  const { title, scanLabel, viewLabel, stores, image } = appPromo;

  const qrs = await Promise.all(
    stores.map((store) =>
      QRCode.toString(store.href, {
        type: "svg",
        margin: 0,
        errorCorrectionLevel: "M",
        color: { dark: "#0b1020", light: "#00000000" },
      }),
    ),
  );

  return (
    <section aria-labelledby="app-title" className="bg-page py-20 lg:py-28">
      <Container className="grid gap-4 lg:grid-cols-12 lg:gap-5">
        <Reveal className="flex translate-y-6 flex-col items-center justify-center rounded-2xl border border-line px-6 py-12 text-center opacity-0 transition-[opacity,translate] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] data-visible:translate-y-0 data-visible:opacity-100 sm:px-10 lg:col-span-7 lg:py-16">
          {/* Where to get it. Ratings appear here once they are real. */}
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-content">
            {stores.map((store) => {
              const Icon = STORE_ICONS[store.icon];
              return (
                <li key={store.name} className="flex items-center gap-2">
                  {Icon && <Icon aria-hidden="true" className="size-4 text-headline" />}
                  {store.rating ? (
                    <span>
                      <strong className="font-semibold text-headline">
                        {store.rating.score} ★
                      </strong>{" "}
                      on {store.name} {store.rating.reviews} reviews
                    </span>
                  ) : (
                    <span>Available on {store.name}</span>
                  )}
                </li>
              );
            })}
          </ul>

          <h2
            id="app-title"
            className="mt-6 max-w-xl font-condensed text-[clamp(2.5rem,4.6vw,4rem)] leading-[1] font-normal tracking-[0] text-balance text-headline"
          >
            {title}
          </h2>

          {/* Scan cards; each opens its QR code in a modal. */}
          <AppQrCards
            stores={stores.map((store, i) => ({ ...store, qr: qrs[i] }))}
            scanLabel={scanLabel}
            viewLabel={viewLabel}
          />

          {/* Store badges. */}
          <ul className="mt-8 flex flex-wrap justify-center gap-3">
            {stores.map((store) => {
              const Icon = STORE_ICONS[store.icon];
              return (
                <li key={store.name}>
                  <a
                    href={store.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-13 items-center gap-2.5 rounded-xl border border-black bg-black px-4 text-left text-white transition-[translate,opacity] duration-300 hover:-translate-y-0.5 hover:opacity-90 dark:border-white/20"
                  >
                    {Icon && <Icon aria-hidden="true" className="size-6" />}
                    <span className="leading-none">
                      <span className="block text-[10px] tracking-[0.02em] uppercase">
                        {store.badge.small}
                      </span>
                      <span className="mt-0.5 block font-display text-lg font-semibold tracking-[-0.01em]">
                        {store.badge.large}
                      </span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </Reveal>

        {/* The app, in hand. The grid stretches this panel to the content
            panel's height; the photo covers it, anchored on the phone. */}
        <Reveal className="relative min-h-[28rem] translate-y-6 overflow-hidden rounded-2xl border border-line bg-[#fdf6ee] opacity-0 transition-[opacity,translate] delay-150 duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] data-visible:translate-y-0 data-visible:opacity-100 lg:col-span-5 lg:min-h-0">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover object-[50%_35%]"
          />
        </Reveal>
      </Container>
    </section>
  );
}
