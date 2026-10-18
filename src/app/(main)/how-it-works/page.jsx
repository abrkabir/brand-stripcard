import { Cta } from "@/components/home/Cta";
import { Faq } from "@/components/home/Faq";
import { HowItWorks } from "@/components/home/HowItWorks";
import { PageHero } from "@/components/shared/PageHero";
import { pageHeroes } from "@/data/pages";

const hero = pageHeroes.howItWorks;

export const metadata = {
  title: hero.title,
  description: hero.description,
};

/** How it works: the page banner, then the steps, the questions people ask
    and the call to action. */
export default function HowItWorksPage() {
  return (
    <>
      <PageHero {...hero} crumbs={[{ label: "How it works", href: "/how-it-works" }]} />
      <HowItWorks />
      <Faq />
      <Cta />
    </>
  );
}
