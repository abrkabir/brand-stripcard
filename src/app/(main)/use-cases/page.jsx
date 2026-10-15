import { Testimonials } from "@/components/home/Testimonials";
import { UseCases } from "@/components/home/UseCases";
import { PageHero } from "@/components/shared/PageHero";
import { pageHeroes } from "@/data/pages";

const hero = pageHeroes.useCases;

export const metadata = {
  title: hero.title,
  description: hero.description,
};

/** Use cases: the page banner, then the use cases and the customers behind them. */
export default function UseCasesPage() {
  return (
    <>
      <PageHero {...hero} crumbs={[{ label: "Use cases", href: "/use-cases" }]} />
      <UseCases />
      <Testimonials />
    </>
  );
}
