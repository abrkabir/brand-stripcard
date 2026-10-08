import { About } from "@/components/home/About";
import { AppSection } from "@/components/home/AppSection";
import { Banner } from "@/components/home/Banner";
import { ContactSection } from "@/components/home/ContactSection";
import { Features } from "@/components/home/Features";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Testimonials } from "@/components/home/Testimonials";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { siteConfig } from "@/lib/site";

export const metadata = {
  // Root-relative title, so the layout template is skipped for the homepage.
  title: {
    absolute: siteConfig.title,
  },
};

/**
 * Homepage.
 *
 * Pages stay thin: they compose sections and own metadata, nothing else. Each
 * section lives in `@/components/home/` and pulls its copy from `@/data/`.
 *
 * Sections to come, in order:
 *   <PopularAreas />  ·  <LatestInsights />
 */
export default function HomePage() {
  return (
    <>
      <Banner />
      <About />
      <WhyChooseUs />
      <Features />
      <HowItWorks />
      <AppSection />
      <Testimonials />
      <ContactSection />
    </>
  );
}
