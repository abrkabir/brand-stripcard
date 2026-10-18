import { Cta } from "@/components/home/Cta";
import { Flexibility } from "@/components/home/Flexibility";
import { Testimonials } from "@/components/home/Testimonials";
import { PageHero } from "@/components/shared/PageHero";
import { pageHeroes } from "@/data/pages";

const hero = pageHeroes.flexibility;

export const metadata = {
  title: hero.title,
  description: hero.description,
};

/** Flexibility: the page banner, then everything one account does, the
    customers behind it and the call to action. */
export default function FlexibilityPage() {
  return (
    <>
      <PageHero {...hero} crumbs={[{ label: "Flexibility", href: "/flexibility" }]} />
      <Flexibility />
      <Testimonials />
      <Cta />
    </>
  );
}
