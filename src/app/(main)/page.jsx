import { About } from "@/components/home/About";
import { AppSection } from "@/components/home/AppSection";
import { Agents } from "@/components/home/Agents";
import { Banner } from "@/components/home/Banner";
import { ContactSection } from "@/components/home/ContactSection";
import { FeaturedItems } from "@/components/home/FeaturedItems";
import { Gallery } from "@/components/home/Gallery";
import { Properties } from "@/components/home/Properties";
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
      <AppSection />
      <Properties />
      <FeaturedItems />
      <Gallery />
      <Agents />
      <Testimonials />
      <ContactSection />
    </>
  );
}
