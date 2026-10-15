import QRCode from "qrcode";
import { AppPhones } from "@/components/home/AppPhones";
import { AppQrCards } from "@/components/home/AppQrCards";
import { AppleIcon, GooglePlayIcon } from "@/components/icons";
import { Reveal } from "@/components/shared/Reveal";
import { Container } from "@/components/ui/Container";
import { appPromo } from "@/data/appPromo";

const STORE_ICONS = { apple: AppleIcon, googlePlay: GooglePlayIcon };

/**
 * "Get the app" as two bordered panels of equal height. Left, centred: where
 * to get it, a poster-style title, a scan card per store with a real QR
 * code, and the store badges. Right: the app on three phones that take
 * turns in front.
 * Stacks on small screens.
 *
 * The QR codes are rendered to SVG on the server from each store's link, so
 * they always match it and no QR library ships to the browser. Each scan
 * card opens its code large in a modal (see AppQrCards); the badges link
 * straight to the stores, for visitors already on a phone. Everything fades up once, the first time it scrolls into view.
 */
export async function AppSection() {
  const { title, scanLabel, viewLabel, stores, phones, phonesLabel } = appPromo;

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
            className="mt-6 max-w-xl font-heading text-[clamp(1.75rem,2.6vw,2.375rem)] leading-[1.1] font-semibold tracking-[-0.02em] text-headline"
          >
            {title.map((line, i) => (
              <span key={line}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </h2>

          {/* Scan cards; each opens its QR code in a modal. */}
          <AppQrCards
            stores={stores.map((store, i) => ({ ...store, qr: qrs[i] }))}
            scanLabel={scanLabel}
            viewLabel={viewLabel}
          />

          {/* Store badges. */}
          <ul className="mt-7 flex flex-wrap justify-center gap-2.5">
            {stores.map((store) => {
              const Icon = STORE_ICONS[store.icon];
              return (
                <li key={store.name}>
                  <a
                    href={store.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 items-center gap-2 rounded-full border border-black bg-black pr-5 pl-4 text-left text-white transition-[translate,opacity] duration-300 hover:-translate-y-0.5 hover:opacity-90 dark:border-white/20"
                  >
                    {Icon && <Icon aria-hidden="true" className="size-5" />}
                    <span className="leading-none">
                      <span className="block text-[9px] tracking-[0.02em] uppercase">
                        {store.badge.small}
                      </span>
                      <span className="mt-0.5 block font-display text-[0.9375rem] font-semibold tracking-[-0.01em]">
                        {store.badge.large}
                      </span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </Reveal>

        {/* The app on three phones that take turns in front (see AppPhones).
            The grid stretches this panel to the content panel's height, and
            the phones size themselves to whatever room that leaves. Its
            backdrop is the brand orange in rgba washes: over warm cream in
            the light theme, over black in the dark one. */}
        <Reveal className="relative min-h-[32rem] translate-y-6 overflow-hidden rounded-2xl border border-line bg-[#fdf6ee] bg-[radial-gradient(90%_60%_at_50%_100%,rgba(242,106,27,0.2)_0%,rgba(242,106,27,0.06)_45%,rgba(242,106,27,0)_75%),linear-gradient(160deg,rgba(242,106,27,0.12)_0%,rgba(242,106,27,0.03)_35%,rgba(242,106,27,0)_60%)] dark:border-black dark:bg-black dark:bg-[radial-gradient(90%_60%_at_50%_100%,rgba(242,106,27,0.42)_0%,rgba(242,106,27,0.12)_45%,rgba(0,0,0,0)_75%),linear-gradient(160deg,rgba(242,106,27,0.28)_0%,rgba(242,106,27,0.06)_35%,rgba(0,0,0,0)_60%)] opacity-0 transition-[opacity,translate] delay-150 duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] data-visible:translate-y-0 data-visible:opacity-100 lg:col-span-5 lg:min-h-0">
          <AppPhones label={phonesLabel} phones={phones} />
        </Reveal>
      </Container>
    </section>
  );
}
