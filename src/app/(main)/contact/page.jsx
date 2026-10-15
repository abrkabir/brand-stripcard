import { ContactSection } from "@/components/contact/ContactSection";
import { PageHero } from "@/components/shared/PageHero";
import { contactHero } from "@/data/contact";

export const metadata = {
  title: "Contact us",
  description: contactHero.description,
};

/**
 * Contact page: the page banner with its breadcrumb, then the ways to reach
 * the team beside the enquiry form.
 */
export default function ContactPage() {
  return (
    <>
      <PageHero
        title={contactHero.title}
        caption={contactHero.caption}
        description={contactHero.description}
        crumbs={[{ label: "Contact", href: "/contact" }]}
      />
      <ContactSection />
    </>
  );
}
