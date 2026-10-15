import { MailIcon, MapPinIcon, PhoneIcon, getIcon } from "@/components/icons";
import { ContactForm } from "@/components/home/ContactForm";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Container } from "@/components/ui/Container";
import { contactHeading, offices } from "@/data/contact";
import { siteConfig } from "@/lib/site";

/**
 * Contact section — a centred heading over two columns: the ways to reach us on
 * the left, the enquiry form on the right.
 *
 * The rail is a brand panel and the form is left open on the page, which is
 * what keeps the two halves from competing: one block of colour, one block of
 * type. Below `lg` they stack, details first, so a visitor on a phone can call
 * without scrolling past a form they may not need.
 *
 * Stays a Server Component; only `ContactForm` ships JavaScript.
 */
export function ContactSection() {
  return (
    <section className="bg-page py-24 lg:py-32">
      <Container>
        <SectionHeading
          align="center"
          title={contactHeading.title}
          description={contactHeading.description}
        />

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-14 xl:gap-20">
          {/* ── Details rail ──────────────────────────────────────────────
              `on-dark` rather than hand-painted whites: the ground is brand in
              both themes, so anything from the kit dropped in here — a button,
              a field — commits to white on its own. The body copy below still
              names its own tones, which is what `on-dark` does not cover.
              `justify-between` pins the socials to the foot of the panel, so
              the column filling its row height reads as intentional. */}
          <div className="on-dark flex flex-col justify-between gap-14 bg-brand p-8 text-white sm:p-10">
            <ul className="divide-y divide-white/15">
              {offices.map((office) => (
                <li key={office.email} className="py-7 first:pt-0 last:pb-0">
                  <OfficeDetails office={office} />
                </li>
              ))}
            </ul>

            <div>
              <h3 className="font-heading text-[0.6875rem] font-semibold tracking-[0.14em] text-white/60 uppercase">
                Follow us
              </h3>

              <ul className="mt-5 flex flex-wrap gap-2.5">
                {siteConfig.socials.map((social) => {
                  const Icon = getIcon(social.icon);

                  return (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className="grid size-10 place-items-center rounded-full border border-white/25 text-white/80 transition-colors hover:border-white hover:bg-white/10 hover:text-white"
                      >
                        {Icon && <Icon className="size-[18px]" />}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* ── Enquiry form ──────────────────────────────────────────── */}
          <ContactForm />
        </div>
      </Container>
    </section>
  );
}

/**
 * One branch. The pin marks the address only — phone and email are indented to
 * its type column rather than carrying icons of their own, so the block reads
 * as one entry instead of a list of three.
 */
function OfficeDetails({ office }) {
  return (
    <div className="text-[15px] leading-relaxed">
      <p className="flex gap-3 text-white/80">
        <MapPinIcon className="mt-1 size-4 shrink-0 text-brand-200" />
        <span>
          <span className="block font-heading font-semibold text-white">
            {office.name}
          </span>
          {office.address.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </span>
      </p>

      <div className="mt-4 space-y-1.5 pl-7">
        <p>
          <a
            href={office.phoneHref}
            className="inline-flex items-center gap-2 text-white/80 transition-colors hover:text-white"
          >
            <PhoneIcon className="size-3.5 shrink-0 text-white/45" />
            {office.phone}
          </a>
        </p>

        <p>
          <a
            href={`mailto:${office.email}`}
            className="inline-flex items-center gap-2 text-white/80 transition-colors hover:text-white"
          >
            <MailIcon className="size-3.5 shrink-0 text-white/45" />
            {office.email}
          </a>
        </p>

        {office.hours && <p className="text-white/55">{office.hours}</p>}
      </div>
    </div>
  );
}
