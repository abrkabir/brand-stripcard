import { AppSection } from "@/components/home/AppSection";
import { Cta } from "@/components/home/Cta";
import { Features } from "@/components/home/Features";
import { HowItWorks } from "@/components/home/HowItWorks";
import { PageHero } from "@/components/shared/PageHero";
import { pageHeroes } from "@/data/pages";

const hero = pageHeroes.services;

export const metadata = {
  title: hero.title,
  description: hero.description,
};

/** Services: the page banner, then the features, how it works, the app and
    the call to action. */
export default function ServicesPage() {
  return (
    <>
      <PageHero {...hero} crumbs={[{ label: "Services", href: "/services" }]} />
      <Features />
      <HowItWorks />
      <AppSection />
      <Cta />
    </>
  );
}
