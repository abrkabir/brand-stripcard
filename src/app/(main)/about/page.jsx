import { About } from "@/components/home/About";
import { Testimonials } from "@/components/home/Testimonials";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { PageHero } from "@/components/shared/PageHero";
import { pageHeroes } from "@/data/pages";

const hero = pageHeroes.about;

export const metadata = {
  title: hero.title,
  description: hero.description,
};

/** About: the page banner, then who we are, why choose us and what customers say. */
export default function AboutPage() {
  return (
    <>
      <PageHero {...hero} crumbs={[{ label: "About", href: "/about" }]} />
      <About />
      <WhyChooseUs />
      <Testimonials />
    </>
  );
}
